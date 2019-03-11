<template>
	<div class="message-notify">
		<div class="result-card">
			<div class="card-top">短信通知列表</div>
			<div class="content">
				<div class="table-list">
					<div class="export">
						<div class="icon">
							<LinkButton iconCls="icon-add" :plain="true" @click="dialogFormVisible = true">新增</LinkButton>
						</div>
						<div class="icon">
							<LinkButton iconCls="icon-edit" :plain="true" @click="editData">修改</LinkButton>
						</div>
						<div class="icon">
							<LinkButton iconCls="icon-remove" :plain="true" @click="deleteData">删除</LinkButton>
						</div>
						<div class="icon-load">
							<LinkButton iconCls="icon-reload" :plain="true" @click="loading">刷新</LinkButton>
						</div>
					</div>
					<el-dialog title="添加任务--短信通知" :visible.sync="dialogFormVisible" :modal="false" :close-on-click-modal="false" :lock-scroll="true">
						<el-form :model="form">
							<el-form-item label="短信通知对象" :label-width="formLabelWidth">
								<el-select v-model="form.notifyobj" placeholder=" ">
									<el-option label="1" value=" "></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="选择短信" :label-width="formLabelWidth">
								<el-select v-model="form.msg" placeholder=" ">
									<el-option label="ces" value="ces"></el-option>
									<el-option label="犯罪通知" value="notify"></el-option>
								</el-select>
							</el-form-item>
						</el-form>
						<div slot="footer" class="dialog-footer">
							<el-button type="primary" @click="addData">保 存</el-button>
							<el-button @click="dialogFormVisible = false">取 消</el-button>
						</div>
					</el-dialog>
					<div class="view">
						<el-dialog title="修改任务--短信通知" :visible.sync="dialogFormVisible1" :modal="false" :close-on-click-modal="false" :lock-scroll="true">
							<el-form :model="form1">
							</el-form>
							<div slot="footer" class="dialog-footer">
								<el-button type="primary" @click="edit">保 存</el-button>
								<el-button @click="dialogFormVisible1 = false">取 消</el-button>
							</div>
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
						<!-- <el-table-column
							type="selection"
							width="30"
							align="center"
							:resizable="false">
						</el-table-column> -->
						<el-table-column
							label=" "
							width="30"
							:resizable="false"
							:show-overflow-tooltip="true">
							<template slot-scope="scope">
								<el-checkbox v-model="scope.row.checked"></el-checkbox>
							</template>
						</el-table-column>
						<el-table-column
							prop="name"
							label="姓名"
							sortable
							:show-overflow-tooltip="true"
							align="left"
							:resizable="false"
							min-width='49%'>
						</el-table-column>
						<el-table-column
							prop="number"
							:resizable="false"
							label="短信通知号码"
							sortable
							:show-overflow-tooltip="true"
							min-width='49%'>
						</el-table-column>
						<template slot="empty">
							<img src="../../../../static/nodata_icon.png" width="108" height="70">
							<p :style="{'marginTop': '23px'}">暂无数据</p>
						</template>
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
		name: 'messageNotify',
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
				dialogFormVisible1: false,
				formLabelWidth: '120px',
				form: {
					msg: '',
					notifyobj: ''
				},
				form1: {}
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
				console.log(val)
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
				this.dialogFormVisible1 = false
			},
			addData () {
				this.dialogFormVisible = false
			},
			deleteData () {
				if (this.num === '') {
					this.$alert('请选择要删除的记录', '警告', {
						confirmButtonText: '确定',
						callback: action => {
							this.$message({
								type: 'info',
								message: 'action:' + action
							})
						}
					})
				} else {
					this.$confirm('确定删除本条记录？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
						center: true
					})
					.then(() => {
						var that = this
						this.axios.get(`${this.url}/system/smsnotification/delete`)
						.then(function (response) {
							that.total = that.tableData.length
							that.total = that.tableData.length
						})
						.catch(function (error) {
							console.log(error)
						})
						this.$message({
							type: 'success',
							message: '删除成功!'
						})
					})
					.catch(() => {
						this.$message({
							type: 'info',
							message: '已取消删除'
						})
					})
				}
			},
			loading () {
				var that = this
				// 加载
				/* const loading = this.$loading({
					target: document.querySelector('.table-list'),
					lock: true,
					text: '正在加载...',
					spinner: 'el-icon-loading',
					background: 'rgba(255, 255, 255, 0.6)'
				}) */
				that.tableData.forEach((item, index) => {
					if (item.checked === true) {
						that.rowid = item.id
					}
				})
				this.axios.get(`${this.url}/system/smsnotification/refresh`)
				.then(function (response) {
					// 加载关闭
					// loading.close()
					that.total = that.tableData.length
					let tableData1 = response.data.res
					tableData1.forEach(item => {
						item.checked = false
					})
					that.tableData = tableData1
				})
				.catch(function (error) {
					console.log(error)
				})
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
		},
		created() {
			this.tableData = [
				{
					name: '李雷',
					number: '12345678912'
				},
				{
					name: '韩梅梅',
					number: '78945612312'
				},
				{
					name: '李雷',
					number: '12345678912'
				},
				{
					name: '韩梅梅',
					number: '78945612378'
				}
			]
		}
	}
</script>

<style>
	.message-notify .content{
		height: 100%;
		width: 100%;
		padding: 1px;
	}
	.message-notify .card-content table{
		margin-top: 10px;
		width: 100%;
	}
	.message-notify .card-content table tr th{
		width: 100px;
		height: 32px;
		padding: 1px 0;
		text-align: right;
	}
	.message-notify .card-content table tr td{
		text-align: left;
		height: 34px;
		padding: 1px 0 1px 5px;
		line-height: 32px;
	}
	.message-notify .export{
		height: 31px;
		padding-left: 5px;
		border-bottom: 1px solid #ddd;
		background-color: #f4f4f4;
	}
	.message-notify .icon{
		padding-left: 2px;
		float: left;
		width: 78px;
		height: 26px;
		margin-top: 2px;
		border-right: 1px solid #ccc;
	}
	.message-notify .icon-load{
		padding-left: 2px;
		float: left;
		width: 78px;
		height: 26px;
		margin-top: 2px;
	}
</style>
