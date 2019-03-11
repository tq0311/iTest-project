<template>
	<div class="specific-person-type">
		<div class="result-card">
			<div class="card-top">特定人员类型管理</div>
			<div class="content">
				<div class="table-list">
					<div class="export">
						<div class="icon">
							<LinkButton iconCls="icon-add" :plain="true" @click="dialogFormVisible = true">增加</LinkButton>
						</div>
						<div class="icon-load">
							<LinkButton iconCls="icon-reload" :plain="true" @click="loading">刷新</LinkButton>
						</div>
					</div>
					<el-dialog title="修改任务--特定人员库" v-dialogDrag :visible.sync="dialogFormVisible" :modal="false" :close-on-click-modal="false" :lock-scroll="true">
						<el-form :model="form">
							<el-form-item label="类型名称：" :label-width="formLabelWidth">
								<el-input v-model="form.typename" autocomplete="off"></el-input>
							</el-form-item>
						</el-form>
						<div slot="footer" class="dialog-footer">
							<el-button type="primary" @click="addData">保 存</el-button>
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
						@selection-change="handleSelectionChange"
						@row-click="clickRow"
						:row-class-name="tableRowClassName"
						>
						<el-table-column
							label=" "
							type="index"
							width="30"
							:resizable="false"
							:show-overflow-tooltip="true"
							:index="indexMethod">
						</el-table-column>
						<el-table-column
							prop="categorize"
							label="分类"
							sortable
							align="center"
							:resizable="false"
							:show-overflow-tooltip="true"
							min-width='49%'>
						</el-table-column>
						<el-table-column
							prop="operatoin"
							label="操作"
							align="center"
							:resizable="false"
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
		name: 'specificPersonType',
		data () {
			return {
				total: 0, // 默认数据总数
				pagesize: 10, // 每页的数据条数
				currentPage: 1, // 默认开始页面
				pageSizes: [10, 20, 30, 40, 50],
				tableData: [
					{
						categorize: 'testGate',
						operatoin: '一般'
					},
					{
						categorize: 'testGate',
						operatoin: '一般'
					},
					{
						categorize: 'testGate',
						operatoin: '一般'
					},
					{
						categorize: 'testGate',
						operatoin: '一般'
					}
				],
				num: '',
				dialogFormVisible: false,
				form: {
					typename: ''
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
			tableRowClassName ({row, rowIndex}) {
				// 把每一行的索引放进row
				row.index = rowIndex
			},
			clickRow (row) {
				this.num = row.index + (this.currentPage - 1) * this.pagesize
			},
			handleChangeSize (pagesize) {
				this.pagesize = pagesize
			},
			handleCurrentChange (val) {
				this.currentRow = val
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
			addData () {
				this.dialogFormVisible = false
				var that = this
				this.axios.post(`${this.url}/libraries/personneltype/update`, {})
				.then(function (response) {
					that.tableData = response.data.res
				})
				.catch(function (error) {
					console.log(error)
				})
			},
			loading () {
				var that = this
				const loading = that.$loading({
					target: document.querySelector('.table-list'),
					lock: true,
					text: '正在加载...',
					spinner: 'el-icon-loading',
					background: 'rgba(255, 255, 255, 0.6)'
				})
				this.axios.get(`${this.url}/libraries/personneltype`)
				.then(function (response) {
					loading.close()
					that.tableData = response.data.res
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
			}
		},
		updated () {
			this.total = this.tableData.length
		}
	}
</script>

<style>
	.specific-person-type .content{
		height: 100%;
		width: 100%;
		padding: 1px;
	}
	.specific-person-type .card-content table{
		margin-top: 10px;
		width: 100%;
	}
	.specific-person-type .card-content table tr th{
		width: 100px;
		height: 32px;
		padding: 1px 0;
		text-align: right;
	}
	.specific-person-type .card-content table tr td{
		text-align: left;
		height: 34px;
		padding: 1px 0 1px 5px;
		line-height: 32px;
	}
	.specific-person-type .export{
		height: 31px;
		padding-left: 5px;
		border-bottom: 1px solid #ddd;
		background-color: #f4f4f4;
	}
	.specific-person-type .icon{
		padding-left: 2px;
		float: left;
		width: 78px;
		height: 26px;
		margin-top: 2px;
		border-right: 1px solid #ccc;
	}
	.specific-person-type .icon-load{
		padding-left: 2px;
		float: left;
		width: 78px;
		height: 26px;
		margin-top: 2px;
	}
</style>
