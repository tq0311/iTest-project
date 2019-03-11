<template>
	<div class="specific-person">
		<div class="search-card">
			<div class="card-top">
				搜索条件
			</div>
			<div class="card-content">
				<table>
					<tr>
						<th>类型</th>
						<th>
							<ComboBox inputId="searchType" v-model="searchType" :data="searchTypeData"></ComboBox>
						</th>
						<th>IMSI</th>
						<th>
							<TextBox inputId="imsi" v-model="imsi"></TextBox>
						</th>
						<td></td>
						<td>
							<el-button type="success" plain @click="personSearch">查询</el-button>
							<el-button type="success" plain @click="reset">重置</el-button>
						</td>
					</tr>
				</table>
			</div>
		</div>
		<div class="result-card">
			<div class="card-top">特定人员管理</div>
			<div class="content">
				<div class="table-list">
					<div class="export">
						<div class="icon">
							<LinkButton iconCls="icon-add" :plain="true" @click="dialogFormVisible = true">增加</LinkButton>
						</div>
						<div class="icon">
							<LinkButton iconCls="icon-remove" :plain="true" @click="deleteData">删除</LinkButton>
						</div>
						<div class="icon">
							<LinkButton iconCls="icon-import" :plain="true">导入</LinkButton>
						</div>
						<div class="icon">
							<LinkButton iconCls="icon-export" :plain="true">导出</LinkButton>
						</div>
						<div class="icon-load">
							<LinkButton iconCls="icon-reload" :plain="true" @click="loading">刷新</LinkButton>
						</div>
					</div>
					<el-dialog title="添加" v-dialogDrag :visible.sync="dialogFormVisible" :modal="false" :close-on-click-modal="false" :lock-scroll="true">
						<el-form :model="form">
							<el-form-item label="类型" :label-width="formLabelWidth">
								<el-select
									placeholder=" "
									@change="changeType"
									v-model="form.type">
									<el-option
										v-for="item in form.typeData"
										:key="item.value"
										:label="item.label"
										:value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="IMSI" :label-width="formLabelWidth">
								<el-input v-model="form.imsi" autocomplete="off"></el-input>
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
						ref="personTable"
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
							width="30"
							:show-overflow-tooltip="true"
							:resizable="false"
							:index="indexMethod">
						</el-table-column>
						<el-table-column
							label=" "
							:show-overflow-tooltip="true"
							width="30">
							<template slot-scope="scope">
								<el-checkbox v-model="scope.row.checked"></el-checkbox>
							</template>
						</el-table-column>
						<el-table-column
							prop="imsi"
							label="特定IMSI"
							sortable
							align="center"
							:resizable="false"
							:show-overflow-tooltip="true"
							min-width='17%'>
						</el-table-column>
						<el-table-column
							prop="type"
							label="类型"
							sortable
							align="center"
							:resizable="false"
							:show-overflow-tooltip="true"
							min-width='17%'>
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
		name: 'specificPerson',
		data () {
			return {
				imsi: null,
				searchType: null,
				searchTypeData: [
					{ value: 1, text: '嫌疑人' }
				],
				num: '',
				rowid: null,
				total: 0, // 默认数据总数
				pagesize: 10, // 每页的数据条数
				currentPage: 1, // 默认开始页面
				pageSizes: [10, 20, 30, 40, 50],
				tableData: [],
				dialogFormVisible: false,
				form: {
					type: '',
					type1: '',
					imsi: '',
					typeData: [
						{value: '1', label: ''}
					]
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
			changeType (value) {
				this.form.typeData.forEach((key) => {
					if (key.value === value) {
						this.form.type1 = key.label
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
			current_change (currentPage) {
				this.currentPage = currentPage
			},
			getType (val) {
				if (val === 1) {
					return 'suspected'
				}
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
			edit () {
				this.dialogFormVisible = false
				var that = this
				this.axios.post(`${this.url}/particular/add`, {
					imsi: this.form.imsi,
					type: this.form.type1
				})
				.then(function (response) {
					that.tableData = response.data.res
				})
				.catch(function (error) {
					console.log(error)
				})
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
						that.tableData.forEach(item => {
							if (item.checked === true) {
								that.rowid = item.id
							}
						})
						that.tableData = []
						this.axios.post(`${this.url}/particular/delete`, {
							id: that.rowid
						})
						.then(function (response) {
							that.tableData = response.data.res
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
			personSearch () {
				if (this.searchType === null || this.searchType === '') {
					this.$notify({
						title: '提示',
						message: `请选择类型！`,
						position: 'bottom-right',
						duration: 2000
					})
				} else if (this.imsi === null || this.imsi === '') {
					this.$notify({
						title: '提示',
						message: `请输入IMSI!`,
						position: 'bottom-right',
						duration: 2000
					})
				}
				var that = this
				that.tableData = []
				const loading = that.$loading({
					target: document.querySelector('.table-list'),
					lock: true,
					text: '正在加载...',
					spinner: 'el-icon-loading',
					background: 'rgba(255, 255, 255, 0.6)'
				})
				this.axios.post(`${this.url}/libraries/particular/query`, {
					type: this.getType(this.searchType),
					imsi: this.imsi
				})
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
			destroy () {
				this.$destroy()
			},
			reset () {
				Object.assign(this.$data, this.$options.data())
			},
			loading () {
				var that = this
				that.tableData = []
				const loading = that.$loading({
					target: document.querySelector('.table-list'),
					lock: true,
					duration: 1000,
					text: '正在加载...',
					spinner: 'el-icon-loading',
					background: 'rgba(255, 255, 255, 0.6)'
				})
				this.axios.get(`${this.url}/libraries/particular/refresh`)
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
		mounted () {
			$(document).ready(function () {
				$(':checkbox').click(function () {
					$(this).attr('checked', true)
					$(this).siblings().attr('checked', false)
				})
			})
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
					_self.personSearch()
				}
			}
		}
	}
</script>

<style>
	.specific-person {
		color: #333;
	}
	.specific-person .card-content{
		height: 100%;
		width: 100%;
		padding:1px;
		height: 66px;
		border-left: 1px solid #b6b4b6;
		border-right: 1px solid #b6b4b6;
		border-bottom: 1px solid #b6b4b6;
	}
	.specific-person .content{
		height: 100%;
		width: 100%;
		padding: 1px;
	}
	.specific-person .card-content table{
		margin-top: 10px;
		width: 100%;
	}
	.specific-person .card-content table tr th{
		width: 100px;
		height: 32px;
		padding: 1px 0;
		text-align: right;
	}
	.specific-person .card-content table tr td{
		text-align: left;
		height: 34px;
		padding: 1px 0 1px 5px;
		line-height: 32px;
	}
	.specific-person .export{
		height: 31px;
		padding-left: 5px;
		border-bottom: 1px solid #ddd;
		background-color: #f4f4f4;
	}
	.specific-person .icon{
		padding-left: 2px;
		float: left;
		width: 78px;
		height: 26px;
		margin-top: 2px;
		border-right: 1px solid #ccc;
	}
	.specific-person .icon-load{
		padding-left: 2px;
		float: left;
		width: 78px;
		height: 26px;
		margin-top: 2px;
	}
</style>
