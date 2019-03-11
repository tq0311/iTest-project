<template>
	<div class="alarm-message">
		<div class="result-card">
			<div class="card-top">短信管理列表</div>
			<div class="content">
				<div class="table-list">
					<div class="export">
						<div class="icon">
							<LinkButton iconCls="icon-edit" :plain="true" @click="editData">修改</LinkButton>
						</div>
						<div class="icon-load">
							<LinkButton iconCls="icon-reload" :plain="true" @click="loading">刷新</LinkButton>
						</div>
					</div>
					<el-dialog title="修改" v-dialogDrag :visible.sync="dialogFormVisible" :modal="false" :close-on-click-modal="false" :lock-scroll="true">
						<el-form :model="form">
							<el-form-item label="短信通知对象" :label-width="formLabelWidth">
								<el-select
									placeholder=" "
									@change="changeNotify"
									v-model="form.notifyobj">
									<el-option
										v-for="item in form.noticeData"
										:key="item.value"
										:label="item.label"
										:value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="选择短信" :label-width="formLabelWidth">
								<el-select
									@change="changeMsg"
									placeholder=" "
									v-model="form.msg">
									<el-option
										v-for="item in form.msgData"
										:key="item.value"
										:label="item.label"
										:value="item.value"></el-option>
								</el-select>
							</el-form-item>
						</el-form>
						<div slot="footer" class="dialog-footer">
							<el-button type="primary" @click="edit">保 存</el-button>
							<el-button @click="cancel">取 消</el-button>
						</div>
					</el-dialog>
					<div class="view">
						<el-dialog title="告警短信通知对象" v-dialogDrag :visible.sync="dialogFormVisible1" :modal="false" :close-on-click-modal="false" :lock-scroll="true">
							<el-form :model="form1">
									<el-input v-model="form1.notifyobj" autocomplete="off"></el-input>
							</el-form>
						</el-dialog>
					</div>
					<el-table
						:data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
						border
						ref="msgTable"
						class="tab"
						highlight-current-row
						@current-change="handleCurrentChange"
						@sort-change="sortChange"
						@row-click="clickRow"
						@selection-change="handleSelectionChange"
						:row-class-name="tableRowClassName"
						>
						<el-table-column
							label=" "
							type="index"
							width="30"
							:show-overflow-tooltip="true"
							:resizable="false"
							:index="indexMethod">
						</el-table-column>
						<el-table-column
							label=" "
							width="30">
							<template slot-scope="scope">
								<el-checkbox v-model="scope.row.checked"></el-checkbox>
							</template>
						</el-table-column>
						<el-table-column
							prop="type"
							label="告警类型"
							:show-overflow-tooltip="true"
							align="left"
							:resizable="false"
							min-width='12%'>
							<template slot-scope="scope">
								<span v-if="scope.row.type === 'powerdown'">掉电告警</span>
								<span v-if="scope.row.type === 'tranfer'">转移告警</span>
								<span v-if="scope.row.type === 'powerdownclear'">掉电告警清除</span>
								<span v-if="scope.row.type === 'tranferclear'">转移告警清除</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="noticeTo"
							align="center"
							:resizable="false"
							label="通知对象"
							:show-overflow-tooltip="true"
							min-width='12%'>
							<template slot-scope="scope">
								<a href="#" @click="viewData(scope.row)">点击查看</a>
							</template>
						</el-table-column>
						<el-table-column
							prop="title"
							align="left"
							:resizable="false"
							label="短信标题"
							:show-overflow-tooltip="true"
							min-width='12%'> <!-- :formatter="formatter" -->
						</el-table-column>
						<el-table-column
							prop="content"
							label="短信内容"
							:show-overflow-tooltip="true"
							align="left"
							:resizable="false"
							min-width='35%'>
						</el-table-column>
						<el-table-column
							prop="state"
							label="状态"
							:resizable="false"
							:show-overflow-tooltip="true"
							align="center"
							min-width='10%'>
							<template slot-scope="scope">
								<span style="color: red;" v-if="scope.row.state === 0">无效</span>
								<span style="color: green;" v-if="scope.row.state === 1">正常</span>
							</template>
						</el-table-column>
					</el-table>
					<el-pagination
						layout=" sizes, jumper, prev, pager, next, total"
						@current-change="current_change"
						@size-change="handleChangeSize"
						:page-sizes="pageSizes"
						:page-size="pagesize"
						:total="total">
					</el-pagination>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'alarmMessage',
		data () {
			return {
				total: 0, // 默认数据总数
				pagesize: 10, // 每页的数据条数
				currentPage: 1, // 默认开始页面
				pageSizes: [10, 20, 30, 40, 50],
				tableData: [],
				num: '',
				rowid: null,
				dialogFormVisible: false,
				form: {
					noticeData: [
						{value: '1', label: 'iTest'}
					],
					msgData: [
						{value: '1', label: 'ces'},
						{value: '2', label: '犯罪通知'}
					],
					msg: '',
					notifyobj: '',
					message: '',
					notice: ''
				},
				dialogFormVisible1: false,
				form1: {
					notifyobj: ''
				},
				formLabelWidth: '120px'
			}
		},
		computed: {
			url () {
				return this.$store.state.url
			}
		},
		methods: {
			reset () {
				Object.assign(this.$data, this.$options.data())
			},
			destroy () {
				this.$destroy()
			},
			changeNotify (value) {
				this.form.noticeData.forEach((key) => {
					if (key.value === value) {
						this.form.notice = key.label
					}
				})
			},
			changeMsg (value) {
				this.form.msgData.forEach((key) => {
					if (key.value === value) {
						this.form.message = key.label
					}
				})
			},
			tableRowClassName ({row, rowIndex}) {
				// 把每一行的索引放进row
				row.index = rowIndex
			},
			clickRow (row) {
				this.num = row.index + (this.currentPage - 1) * this.pagesize
				this.tableData.forEach(item => {
					if (item.index === row.index) {
						item.checked = !item.checked
					}
				})
			},
			handleChangeSize (pagesize) {
				this.pagesize = pagesize
			},
			handleCurrentChange (val) {
				this.currentRow = val
				this.tableData.forEach(item => {
					if (item.index !== val.index) {
						item.checked = false
					}
				})
			},
			handleSelectionChange (val) {
			},
			current_change (currentPage) {
				this.currentPage = currentPage
			},
			indexMethod(index) {
				return index + (this.currentPage - 1) * this.pagesize + 1
			},
			sortChange (column) {
				const loading = this.$loading({
					target: document.querySelector('.table-list'),
					lock: true,
					text: '正在加载...',
					spinner: 'el-icon-loading',
					background: 'rgba(255, 255, 255, 0.6)'
				})
				var tData = this.tableData
				var comp = function (prop) {
					return function (obj1, obj2) {
						var val1 = obj1[prop]
						var val2 = obj2[prop]
						if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
							val1 = Number(val1)
							val2 = Number(val2)
						}
						if (val1 < val2) {
							return -1
						} else if (val1 > val2) {
							return 1
						} else {
							return 0
						}
					}
				}
				if (column.order === 'ascending') {
					tData.sort(comp(column.prop))
				} else if (column.order === 'descending') {
					tData.reverse()
				} else {
					this.tableData = tData
				}
				loading.close()
			},
			cancel () {
				this.dialogFormVisible = false
				this.form.notifyobj = ''
				this.form.msg = ''
			},
			editData () {
				if (this.num === '') {
					this.$alert('请选择需要修改的记录', '警告', {
						confirmButtonText: '确定',
						callback: action => {
							this.$message({
								type: 'info',
								message: 'action:' + action
							})
						}
					})
				} else {
					this.dialogFormVisible = true
				}
			},
			edit () {
				if (this.form.notice === null || this.form.notice === '') {
					this.$alert('请选择短信通知对象', '警告', {
						confirmButtonText: '确定',
						callback: action => {
							this.$message({
								type: 'info',
								message: 'action:' + action
							})
						}
					})
				} else if (this.form.message === null || this.form.message === '') {
					this.$alert('请选择短信', '警告', {
						confirmButtonText: '确定',
						callback: action => {
							this.$message({
								type: 'info',
								message: 'action:' + action
							})
						}
					})
				} else {
					var that = this
					that.tableData.forEach(item => {
						if (item.checked === true) {
							that.rowid = item.id
						}
					})
					this.axios.post(`${this.url}/alarm/update`, {
						id: this.rowid,
						noticeTo: this.form.notice,
						title: this.form.message
					}) // error
					.then(function (response) {
						console.log(response)
						that.tableData = response.data.res
					})
					this.dialogFormVisible = false
				}
			},
			viewData (row) {
				this.dialogFormVisible1 = true
				this.form1.notifyobj = row.noticeTo
			},
			loading () {
				var that = this
				that.tableData = []
				const loading = that.$loading({
					target: document.querySelector('.table-list'),
					lock: true,
					text: '正在加载...',
					spinner: 'el-icon-loading',
					background: 'rgba(255, 255, 255, 0.6)'
				})
				this.axios.get(`${this.url}/alarm/smsalarm`)
				.then(function (response) {
					loading.close()
					let tableData1 = response.data.res
					tableData1.forEach(item => {
						item.checked = false
					})
					that.tableData = tableData1
					that.total = that.tableData.length
				})
				.catch(function (error) {
					console.log(error)
				})
			},
			getDateTime (time) {
				var d = new Date(time)
				var year = d.getFullYear()
				var month = d.getMonth() + 1
				var day = d.getDate()
				month = this.checkTime(month)
				day = this.checkTime(day)
				return year + '-' + month + '-' + day
			},
			checkTime (i) {
				if (i < 10) {
					i = '0' + i
				}
				return i
			}
		},
		mounted () {
			this.loading()
			$(document).ready(function () {
				$(':checkbox').click(function () {
					$(this).attr('checked', true)
					$(this).siblings().attr('checked', false)
				})
			})
		}
	}
</script>

<style>
	.alarm-message .content{
		height: 100%;
		width: 100%;
		padding: 1px;
	}
	.alarm-message .card-content table{
		margin-top: 10px;
		width: 100%;
	}
	.alarm-message .card-content table tr th{
		width: 220px;
		height: 32px;
		padding: 1px 0;
		text-align: right;
	}
	.alarm-message .card-content table tr td{
		width: 40%;
		text-align: left;
		height: 34px;
		padding: 1px 0 1px 5px;
		line-height: 32px;
	}
	.alarm-message .export{
		height: 31px;
		padding-left: 5px;
		border-bottom: 1px solid #ddd;
		background-color: #f4f4f4;
	}
	.alarm-message .icon{
		padding-left: 2px;
		float: left;
		width: 78px;
		height: 26px;
		margin-top: 2px;
		border-right: 1px solid #ccc;
	}
	.alarm-message .icon-load{
		padding-left: 2px;
		float: left;
		width: 78px;
		height: 26px;
		margin-top: 2px;
	}
	.alarm-message .el-checkbox{
		font-size: 12px;
		right: 8px;
	}
	.alarm-message table a{
		text-decoration: none;
		color: green;
	}
</style>
