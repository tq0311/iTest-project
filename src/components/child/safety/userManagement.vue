<template>
	<div class="user-management">
		<div class="result-card">
			<div class="card-top">用户管理</div>
			<div class="content">
				<div class="table-list">
					<div class="export">
						<div class="icon">
							<LinkButton iconCls="icon-add" :plain="true" @click="dialogFormVisible = true">增加</LinkButton>
						</div>
						<div class="icon">
							<LinkButton iconCls="icon-edit" :plain="true" @click="editData">修改</LinkButton>
						</div>
						<div class="icon">
							<LinkButton iconCls="icon-remove" :plain="true" @click="deleteData">删除</LinkButton>
						</div>
						<div class="icon-load">
							<LinkButton iconCls="icon-export" :plain="true">导出</LinkButton>
						</div>
					</div>
					<div class="view">
						<el-dialog title="添加任务--用户管理" v-dialogDrag :visible.sync="dialogFormVisible" :modal="false" :close-on-click-modal="false" :lock-scroll="true">
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
						<el-dialog title="修改任务--用户管理" :visible.sync="dialogFormVisible1" :modal="false" :close-on-click-modal="false" :lock-scroll="true">
							<el-form :model="form1">
								<el-form-item label="短信通知对象" :label-width="formLabelWidth">
									<el-select v-model="form1.notifyobj" placeholder=" ">
										<el-option label="1" value=" "></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="选择短信" :label-width="formLabelWidth">
									<el-select v-model="form1.msg" placeholder=" ">
										<el-option label="ces" value="ces"></el-option>
										<el-option label="犯罪通知" value="notify"></el-option>
									</el-select>
								</el-form-item>
							</el-form>
							<div slot="footer" class="dialog-footer">
								<el-button type="primary" @click="edit">保 存</el-button>
								<el-button @click="dialogFormVisible = false">取 消</el-button>
							</div>
						</el-dialog>
					</div>
					<div class="details">
						<el-dialog v-dialogDrag ref="dialog__wrapper" title="任务详情" :visible.sync="dialogTableVisible">
							<div class="export">
								<div class="icon-load">
									<LinkButton iconCls="icon-export" :plain="true">导出</LinkButton>
								</div>
							</div>
							<el-table
								:data="detailsData"
								border
								highlight-current-row
								@current-change="handleCurrentChange"
								@row-click="clickRow"
								:row-class-name="tableRowClassName">
								<el-table-column
									label=" "
									width="31"
									type="index"
									:show-overflow-tooltip="true"
									:resizable="false"
									:index="indexMethod">
								</el-table-column>
								<el-table-column property="imsi" sortable :resizable="false" label="手机卡码(IMSI)" min-width="20%" :show-overflow-tooltip="true"></el-table-column>
								<el-table-column property="belong" sortable :resizable="false" label="归属地" min-width="15%" :show-overflow-tooltip="true"></el-table-column>
								<el-table-column property="phone" label="电话号码" :resizable="false" min-width="15%" :show-overflow-tooltip="true"></el-table-column>
								<el-table-column property="operator" label="运营商" :resizable="false" min-width="15%" :show-overflow-tooltip="true"></el-table-column>
								<el-table-column property="swan" sortable label="卡口" :resizable="false" min-width="15%" :show-overflow-tooltip="true"></el-table-column>
								<el-table-column property="creattime" sortable label="创建时间" :resizable="false" min-width="15%" :show-overflow-tooltip="true"></el-table-column>
							</el-table>
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
							prop="name"
							label="操作员名称"
							:show-overflow-tooltip="true"
							align="left"
							:resizable="false"
							min-width='6%'>
						</el-table-column>
						<el-table-column
							prop="id"
							align="center"
							:resizable="false"
							label="警号"
							:show-overflow-tooltip="true"
							min-width='6%'>
						</el-table-column>
						<el-table-column
							prop="role"
							align="left"
							:resizable="false"
							label="操作员角色"
							:show-overflow-tooltip="true"
							min-width='6%'> <!-- :formatter="formatter" -->
						</el-table-column>
						<el-table-column
							prop="organ"
							label="所属机构"
							:show-overflow-tooltip="true"
							align="left"
							:resizable="false"
							min-width='6%'>
						</el-table-column>
						<el-table-column
							prop="area"
							label="管理区域"
							:show-overflow-tooltip="true"
							align="left"
							:resizable="false"
							min-width='49%'>
						</el-table-column>
						<el-table-column
							prop="state"
							label="操作员状态"
							:show-overflow-tooltip="true"
							align="left"
							:resizable="false"
							min-width='6%'>
						</el-table-column>
						<el-table-column
							prop="ip"
							label="操作员ip"
							:show-overflow-tooltip="true"
							align="left"
							:resizable="false"
							min-width='10%'>
						</el-table-column>
						<el-table-column
							prop="operatoin"
							label="操作"
							:resizable="false"
							:show-overflow-tooltip="true"
							align="center"
							min-width='4%'>
							<template slot-scope="scope">
								<a href="#" @click="viewData(scope.row)">查看</a>
							</template>
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
		name: 'userManagement',
		data () {
			return {
				total: 0, // 默认数据总数
				pagesize: 10, // 每页的数据条数
				currentPage: 1, // 默认开始页面
				pageSizes: [10, 20, 30, 40, 50],
				tableData: [],
				num: '',
				dialogFormVisible: false,
				dialogFormVisible1: false,
				formLabelWidth: '120px',
				form: {
					msg: '',
					notifyobj: ''
				},
				form1: {
					notifyobj: '',
					msg: ''
				},
				dialogTableVisible: false,
				detailsData: []
			}
		},
		computed: {
			url () {
				return this.$store.state.url
			}
		},
		methods: {
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
					this.dialogFormVisible1 = true
				}
			},
			edit () {
				this.dialogFormVisible1 = false
			},
			destroy () {
				this.$destroy()
			},
			reset () {
				Object.assign(this.$data, this.$options.data())
			},
			addData () {
				this.dialogTableVisible = false
			},
			viewData () {
				this.dialogTableVisible = true
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
						this.tableData.splice(this.num, 1)
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
				// 清空数据
				// that.tableData = []
				// 加载
				/* const loading = that.$loading({
					target: document.querySelector('.table-list'),
					lock: true,
					text: '正在加载...',
					spinner: 'el-icon-loading',
					background: 'rgba(255, 255, 255, 0.6)'
				}) */
				this.axios.get(`${this.url}/safety/user`)
				.then(function (response) {
					// 关闭加载
					// loading.close()
					let tableData1 = response.data.length
					that.total = that.tableData1.length
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
		},
		created() {
			this.tableData = [
				{
					name: '李雷',
					number: '1',
					role: '李雷',
					organ: '1',
					area: '中国',
					state: '在线',
					ip: '192.168.1.111',
					operatoin: '一般'
				},
				{
					name: '韩梅梅',
					number: '1',
					role: '韩梅梅',
					organ: '1',
					area: '中国',
					state: '在线',
					ip: '192.168.1.111',
					operatoin: '一般'
				},
				{
					name: '李雷',
					number: '1',
					role: '李雷',
					organ: '1',
					area: '中国',
					state: '在线',
					ip: '192.168.1.111',
					operatoin: '一般'
				},
				{
					name: '韩梅梅',
					number: '1',
					role: '韩梅梅',
					organ: '1',
					area: '中国',
					state: '在线',
					ip: '192.168.1.111',
					operatoin: '一般'
				}
			]
		}
	}
</script>

<style>
	.user-management .content{
		height: 100%;
		width: 100%;
		padding: 1px;
	}
	.user-management .card-content table{
		margin-top: 10px;
		width: 100%;
	}
	.user-management .card-content table tr th{
		width: 100px;
		height: 32px;
		padding: 1px 0;
		text-align: right;
	}
	.user-management .card-content table tr td{
		text-align: left;
		height: 34px;
		padding: 1px 0 1px 5px;
		line-height: 32px;
	}
	.user-management .export{
		height: 31px;
		padding-left: 5px;
		border-bottom: 1px solid #ddd;
		background-color: #f4f4f4;
	}
	.user-management .icon{
		padding-left: 2px;
		float: left;
		width: 78px;
		height: 26px;
		margin-top: 2px;
		border-right: 1px solid #ccc;
	}
	.user-management .icon-load{
		padding-left: 2px;
		float: left;
		width: 78px;
		height: 26px;
		margin-top: 2px;
	}
	.user-management table a{
		text-decoration: none;
		color: green;
	}
</style>
