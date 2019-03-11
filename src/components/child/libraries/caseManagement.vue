<template>
	<div class="case-management">
		<div class="search-card">
			<div class="card-top">
				搜索条件
			</div>
			<div class="card-content">
				<table>
					<tr>
						<th>案件库名称</th>
						<td>
							<el-input v-model="casename" autocomplete="off"></el-input>
						</td>
						<td>
							<el-button type="success" plain @click="caseSearch">查询</el-button>
							<el-button type="success" plain @click="reset">重置</el-button>
						</td>
					</tr>
				</table>
			</div>
		</div>
		<div class="result-card">
			<div class="card-top">活跃告警</div>
			<div class="content">
				<div class="table-list">
					<div class="export">
						<div class="icon">
							<LinkButton iconCls="icon-edit" :plain="true" @click="editData">修改</LinkButton>
						</div>
						<div class="icon">
							<LinkButton iconCls="icon-remove" :plain="true" @click="deleteData">删除</LinkButton>
						</div>
						<div class="icon-load">
							<LinkButton iconCls="icon-reload" :plain="true" @click="search">刷新</LinkButton>
						</div>
					</div>
					<el-dialog title="修改任务--案件库管理" v-dialogDrag :visible.sync="dialogFormVisible" :modal="false" :close-on-click-modal="false" :lock-scroll="true">
						<el-form :model="form">
							<el-form-item label="案件描述：" :label-width="formLabelWidth">
								<el-input type="textarea" v-model="form.describe"></el-input>
							</el-form-item>
						</el-form>
						<div slot="footer" class="dialog-footer">
							<el-button type="primary" @click="edit">保 存</el-button>
							<el-button @click="dialogFormVisible = false">取 消</el-button>
						</div>
					</el-dialog>
					<el-table
						:data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
						border
						class="tab"
						highlight-current-row
						@current-change="handleCurrentChange"
						@sort-change="sortChange"
						@row-click="clickRow"
						:row-class-name="tableRowClassName"
						>
						<el-table-column
							label=" "
							type="index"
							width="35"
							:show-overflow-tooltip="true"
							:index="indexMethod">
						</el-table-column>
						<el-table-column
							prop="name"
							label="案件名称"
							align="left"
							:show-overflow-tooltip="true"
							min-width='20%'>
						</el-table-column>
						<el-table-column
							prop="describe"
							align="left"
							:show-overflow-tooltip="true"
							label="案件描述"
							min-width='34%'>
						</el-table-column>
						<el-table-column
							prop="owenr"
							align="left"
							:show-overflow-tooltip="true"
							label="所有者"
							min-width='34%'> <!-- :formatter="formatter" -->
						</el-table-column>
						<el-table-column
							prop="id"
							label="操作"
							:show-overflow-tooltip="true"
							align="center"
							min-width='9%'>
								<template slot-scope="scope">
									<a href="#">点击查看</a>
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
		name: 'caseManagement',
		data () {
			return {
				casename: '',
				total: 0, // 默认数据总数
				pagesize: 10, // 每页的数据条数
				currentPage: 1, // 默认开始页面
				pageSizes: [10, 20, 30, 40, 50],
				tableData: [],
				dialogFormVisible: false,
				form: {
					describe: ''
				},
				formLabelWidth: '120px',
				num: '',
				rowcontent: null
			}
		},
		computed: {
			url () {
				return this.$store.state.url
			}
		},
		methods: {
			handleCurrentChange(val) {
				this.currentRow = val
			},
			handleChangeSize (pagesize) {
				this.pagesize = pagesize
			},
			current_change (currentPage) {
				this.currentPage = currentPage
			},
			indexMethod(index) {
				return index + (this.currentPage - 1) * this.pagesize + 1
			},
			tableRowClassName ({row, rowIndex}) {
				// 把每一行的索引放进row
				row.index = rowIndex
			},
			clickRow (row) {
				this.num = row.index + (this.currentPage - 1) * this.pagesize
				this.rowcontent = row
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
				var that = this
				this.axios.post(`${this.url}/libraries/case/update`, {
					id: this.rowcontent.id,
					describe: this.form.describe
				})
				.then(function (response) {
					that.tableData = response.data.res
					that.form.describe = ''
				})
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
					this.$confirm('确定删除本条数据？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
						center: true
					})
					.then(() => {
						var that = this
						this.axios.post(`${this.url}/libraries/case/delete`, {
							id: this.rowcontent.id
						})
						.then(function (response) {
							that.tableData = response.data.res
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
			caseSearch () {
				if (this.casename === '') {
					this.$notify({
						title: '提示',
						message: '案件库名称不能为空！',
						position: 'bottom-right',
						duration: 2000
					})
				} else {
					var that = this
					const loading = that.$loading({
						target: document.querySelector('.table-list'),
						lock: true,
						text: '正在加载...',
						spinner: 'el-icon-loading',
						background: 'rgba(255, 255, 255, 0.6)'
					})
					this.axios.post(`${this.url}/libraries/case/query`, {
						name: this.casename
					})
					.then(function (response) {
						loading.close()
						that.tableData = response.data.res
						that.total = that.tableData.length
					})
					.catch(function (error) {
						console.log(error)
					})
				}
			},
			destroy () {
				this.$destroy()
			},
			reset () {
				Object.assign(this.$data, this.$options.data())
			}
		},
		updated () {
			this.total = this.tableData.length
		},
		created () {
			var _self = this
			document.onkeydown = function (e) {
				var key = null
				if (window.event === undefined) {
					key = e.keyCode
				} else {
					key = window.event.keyCode
				}
				if (key === 13) {
					_self.caseSearch()
				}
			}
		}
	}
</script>

<style>
	.case-management .card-content{
		height: 100%;
		width: 100%;
		padding:1px;
		height: 66px;
		border-left: 1px solid #b6b4b6;
		border-right: 1px solid #b6b4b6;
		border-bottom: 1px solid #b6b4b6;
	}
	.case-management .content{
		height: 100%;
		width: 100%;
		padding: 1px;
	}
	.case-management .card-content table{
		width: 70% !important;
		margin-top: 10px;
		width: 100%;
	}
	.case-management .card-content table tr th{
		width: 200px;
		height: 32px;
		padding: 1px 0;
		text-align: right;
	}
	.case-management .card-content table tr td{
		text-align: left;
		height: 34px;
		padding: 1px 0 1px 5px;
		line-height: 32px;
	}
	.case-management .export{
		height: 31px;
		padding-left: 5px;
		border-bottom: 1px solid #ddd;
		background-color: #f4f4f4;
	}
	.case-management .icon{
		padding-left: 2px;
		float: left;
		width: 78px;
		height: 26px;
		margin-top: 2px;
		border-right: 1px solid #ccc;
	}
	.case-management .icon-load{
		padding-left: 2px;
		float: left;
		width: 78px;
		height: 26px;
		margin-top: 2px;
	}
	.case-management table a{
		text-decoration: none;
		color: green;
	}
	.case-management .card-content .el-input{
		width: 300px;
	}
</style>
