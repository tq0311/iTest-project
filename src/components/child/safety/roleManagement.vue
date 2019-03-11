<template>
	<div class="role-management">
		<div class="result-card">
			<div class="card-top">角色列表</div>
			<div class="content">
				<div class="table-list">
					<div class="export">
						<div class="icon">
							<LinkButton iconCls="icon-add" :plain="true" @click="dialogFormVisible = true">增加</LinkButton>
						</div>
						<div class="icon">
							<LinkButton iconCls="icon-edit" :plain="true" @click="edit">修改</LinkButton>
						</div>
						<div class="icon-load">
							<LinkButton iconCls="icon-export" :plain="true">导出</LinkButton>
						</div>
					</div>
					<el-dialog title="添加任务--角色管理" :visible.sync="dialogFormVisible" :modal="false" :close-on-click-modal="false" :lock-scroll="true">
						<el-form :model="form">
							<el-form-item label="任务名称：" :label-width="formLabelWidth">
								<el-input v-model="form.testName" autocomplete="off"></el-input>
							</el-form-item>
							<el-form-item label="IMSI输入方式：" :label-width="formLabelWidth">
								<el-radio-group v-model="form.radio">
									<el-radio :label="3">手动</el-radio>
									<el-radio :label="6">导入</el-radio>
									<el-radio :label="9">特定人员分类</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item label="手机卡码(IMSI)" :label-width="formLabelWidth" v-if="form.radio === 3">
								<el-input v-model="form.imsi" autocomplete="off"></el-input>
							</el-form-item>
							<el-form-item label="手机卡码(IMSI)" v-if="form.radio === 6">
								<input type="file" name="imsi" multiple @change="fileData">
							</el-form-item>
							<el-form-item label="手机卡码(IMSI)" :label-width="formLabelWidth" v-if="form.radio === 9">
								<el-select v-model="form.imsi" placeholder=" ">
									<el-option label="1" value="ces"></el-option>
									<el-option label="2" value="notify"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="卡口" :label-width="formLabelWidth">
								<!-- <ComboTree
									inputId="swan"
									:data="form.swanData"
									:multiple="true"
									v-model="form.swan"
									:editable="false">
									<Tree slot="tree"></Tree>
								</ComboTree> -->
							</el-form-item>
							<el-form-item label="开始时间" :label-width="formLabelWidth" class="time">
								<el-date-picker
									v-model="form.testStartTime"
									type="date"
									value-format="timestamp"
									placeholder=" ">
								</el-date-picker>
							</el-form-item>
							<el-form-item label="结束时间" :label-width="formLabelWidth" class="time">
								<el-date-picker
									v-model="form.testEndTime"
									type="date"
									value-format="timestamp"
									placeholder=" ">
								</el-date-picker>
							</el-form-item>
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
					<el-dialog title="修改任务--角色管理" :visible.sync="dialogFormVisible1" :modal="false" :close-on-click-modal="false" :lock-scroll="true">
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
							<el-button type="primary" @click="editData">保 存</el-button>
							<el-button @click="dialogFormVisible1 = false">取 消</el-button>
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
							label="角色名称"
							align="left"
							:show-overflow-tooltip="true"
							min-width='24%'>
						</el-table-column>
						<el-table-column
							prop="descript"
							align="left"
							:show-overflow-tooltip="true"
							label="角色描述"
							min-width='24%'>
						</el-table-column>
						<el-table-column
							prop="state"
							align="left"
							:show-overflow-tooltip="true"
							label="角色状态"
							min-width='24%'> <!-- :formatter="formatter" -->
						</el-table-column>
						<el-table-column
							prop="time"
							label="创建时间"
							:show-overflow-tooltip="true"
							align="center"
							min-width='24%'>
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
		name: 'roleManagement',
		data () {
			return {
				total: 0, // 默认数据总数
				pagesize: 10, // 每页的数据条数
				currentPage: 1, // 默认开始页面
				pageSizes: [10, 20, 30, 40, 50],
				tableData: [],
				dialogFormVisible: false,
				dialogFormVisible1: false,
				form: {
					testName: '',
					radio: 3,
					imsi: '',
					testStartTime: new Date(),
					testEndTime: new Date(),
					notifyobj: '',
					msg: '',
					delivery: false,
					type: []
					/* swan: '',
					swanData: [
						{
							id: 1,
							text: '全部',
							children: [
								{
									id: 11,
									text: '测试区域',
									state: 'closed',
									children: [
										{
											id: 111,
											text: 'iTest卡口'
										},
										{
											id: 112,
											text: 'testGate'
										}
									]
								}
							]
						}
					] */
				},
				form1: {
					notifyobj: '',
					msg: ''
				},
				formLabelWidth: '120px',
				num: ''
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
			editData () {
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
					this.$confirm('确定删除本条数据？', '提示', {
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
				// that.tableData = [] // 清空数据
				// 加载
				/* const loading = that.$loading({
					target: document.querySelector('.table-list'),
					lock: true,
					text: '正在加载...',
					spinner: 'el-icon-loading',
					background: 'rgba(255, 255, 255, 0.6)'
				}) */
				this.axios.post(`${this.url}/safety/role`)
				.then(function (response) {
					// 关闭加载
					// loading.close()
					// that.tableData = response.data.res
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
		mounted () {
			this.loading()
		},
		updated () {
			this.total = this.tableData.length
		},
		created () {
			this.tableData = [
				{
					name: '李雷',
					descript: '无',
					state: '在线',
					time: '2018-12-28 15:12:00'
				},
				{
					name: '韩梅梅',
					descript: '无',
					state: '在线',
					time: '2018-12-28 15:12:00'
				},
				{
					name: '李雷',
					descript: '无',
					state: '在线',
					time: '2018-12-28 15:12:00'
				},
				{
					name: '韩梅梅',
					descript: '无',
					state: '在线',
					time: '2018-12-28 15:12:00'
				}
			]
		}
	}
</script>

<style>
	.role-management .content{
		height: 100%;
		width: 100%;
		padding: 1px;
	}
	.role-management .card-content table{
		margin-top: 10px;
		width: 100%;
	}
	.role-management .card-content table tr th{
		width: 100px;
		height: 32px;
		padding: 1px 0;
		text-align: right;
	}
	.role-management.card-content table tr td{
		text-align: left;
		height: 34px;
		padding: 1px 0 1px 5px;
		line-height: 32px;
	}
	.role-management .export{
		height: 31px;
		padding-left: 5px;
		border-bottom: 1px solid #ddd;
		background-color: #f4f4f4;
	}
	.role-management .icon{
		padding-left: 2px;
		float: left;
		width: 78px;
		height: 26px;
		margin-top: 2px;
		border-right: 1px solid #ccc;
	}
	.role-management .icon-load{
		padding-left: 2px;
		float: left;
		width: 78px;
		height: 26px;
		margin-top: 2px;
	}
	.role-management table a{
		text-decoration: none;
		color: green;
	}
</style>
