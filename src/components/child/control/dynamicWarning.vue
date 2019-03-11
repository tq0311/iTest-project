<template>
	<div class="dynamic-warning">
		<div class="card-top">
			动态预警
		</div>
		<div class="card-content">
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
						<LinkButton iconCls="icon-reload" :plain="true" @click="loading">刷新</LinkButton>
					</div>
				</div>
				<el-dialog  v-dialogDrag ref="dialog__wrapper" title="IMSI列表" :visible.sync="dialogTableVisible1">
					<div class="export">
						<div class="icon-load">
							<LinkButton iconCls="icon-export" :plain="true">导出</LinkButton>
						</div>
					</div>
					<el-table
						:data="gridData"
						border
						highlight-current-row>
						<el-table-column
							label=" "
							width="31"
							type="index"
							:show-overflow-tooltip="true"
							:resizable="false"
							:index="indexMethod">
						</el-table-column>
						<el-table-column property="imsi" label="用户卡码(IMSI)" min-width="49%"></el-table-column>
						<el-table-column property="name" label="用户名" min-width="49%"></el-table-column>
					</el-table>
				</el-dialog>
				<div class="details">
					<el-dialog v-dialogDrag ref="dialog__wrapper" title="任务详情" :visible.sync="dialogTableVisible2">
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
							<el-table-column
								property="imsi"
								sortable
								:resizable="false"
								:show-overflow-tooltip="true"
								label="手机卡码(IMSI)"
								min-width="20%">
							</el-table-column>
							<el-table-column
								property="belong"
								sortable
								:resizable="false"
								:show-overflow-tooltip="true"
								label="归属地"
								min-width="15%">
							</el-table-column>
							<el-table-column
								property="phone"
								label="电话号码"
								:resizable="false"
								:show-overflow-tooltip="true"
								min-width="11%">
							</el-table-column>
							<el-table-column
								property="operator"
								label="运营商"
								:resizable="false"
								:show-overflow-tooltip="true"
								min-width="11%">
							</el-table-column>
							<el-table-column
								property="swan"
								sortable label="卡口"
								:resizable="false"
								:show-overflow-tooltip="true"
								min-width="15%">
								<template slot-scope="scope">
									<span v-if="scope.row.swan === '1'">iTest卡口</span>
									<span v-if="scope.row.swan === '1,2'">iTest卡口，testGate</span>
									<span v-if="scope.row.swan === '2'">testGate</span>
								</template>
							</el-table-column>
							<el-table-column
								property="creattime"
								sortable label="采集时间"
								:resizable="false"
								:show-overflow-tooltip="true"
								min-width="24%">
							</el-table-column>
						</el-table>
					</el-dialog>
				</div>
				<el-dialog v-dialogDrag ref="dialog__wrapper" title="添加任务--动态预警" :visible.sync="dialogFormVisible" :modal="false" :close-on-click-modal="false" :lock-scroll="true">
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
							<el-select v-model="form.swan" multiple placeholder="请选择">
								<el-option-group
									v-for="group in form.swanData"
									:key="group.label"
									:label="group.label">
									<el-option
										v-for="item in group.swans"
										:key="item.value"
										:label="item.label"
										:value="item.value">
									</el-option>
								</el-option-group>
							</el-select>
						</el-form-item>
						<el-form-item label="开始时间" :label-width="formLabelWidth" class="time">
							<el-date-picker
								v-model="form.testStartTime"
								type="date"
								value-format="timestamp"
								placeholder="请输入日期">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="结束时间" :label-width="formLabelWidth" class="time">
							<el-date-picker
								v-model="form.testEndTime"
								type="date"
								value-format="timestamp"
								placeholder="请输入日期">
							</el-date-picker>
						</el-form-item>
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
						<el-button type="primary" @click="addData">保 存</el-button>
						<el-button @click="cancel">取 消</el-button>
					</div>
				</el-dialog>
				<el-dialog v-dialogDrag ref="dialog__wrapper" title="修改任务--动态预警" :visible.sync="dialogFormVisible1" :modal="false" :close-on-click-modal="false" :lock-scroll="true">
					<el-form :model="form">
						<el-form-item label="任务名称：" :label-width="formLabelWidth">
							<el-input v-model="form1.testName" autocomplete="off" :disabled="true"></el-input>
						</el-form-item>
						<el-form-item label="IMSI输入方式：" :label-width="formLabelWidth">
							<el-radio-group v-model="form1.radio">
								<el-radio :label="3">手动</el-radio>
								<el-radio :label="6">导入</el-radio>
								<el-radio :label="9">特定人员分类</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="手机卡码(IMSI)" :label-width="formLabelWidth" v-if="form1.radio === 3">
							<el-input v-model="form1.imsi" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="手机卡码(IMSI)" v-if="form1.radio === 6">
							<input type="file" name="imsi" multiple @change="fileData">
						</el-form-item>
						<el-form-item label="手机卡码(IMSI)" :label-width="formLabelWidth" v-if="form1.radio === 9">
							<el-select v-model="form1.imsi" placeholder=" ">
								<el-option label="1" value="ces"></el-option>
								<el-option label="2" value="notify"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="卡口" :label-width="formLabelWidth">
							<el-select v-model="form1.swan" multiple placeholder="请选择">
								<el-option-group
									v-for="group in form1.swanData"
									:key="group.label"
									:label="group.label">
									<el-option
										v-for="item in group.swans"
										:key="item.value"
										:label="item.label"
										:value="item.value">
									</el-option>
								</el-option-group>
							</el-select>
						</el-form-item>
						<el-form-item label="开始时间" :label-width="formLabelWidth" class="time">
							<el-date-picker
								v-model="form1.testStartTime"
								type="date"
								value-format="timestamp"
								placeholder="请选择日期">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="结束时间" :label-width="formLabelWidth" class="time">
							<el-date-picker
								v-model="form1.testEndTime"
								type="date"
								value-format="timestamp"
								placeholder="请选择日期">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="短信通知对象" :label-width="formLabelWidth">
							<el-select
								placeholder=" "
								@change="changeNotify1"
								v-model="form1.notifyobj">
								<el-option
									v-for="item in form1.noticeData"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="选择短信" :label-width="formLabelWidth">
							<el-select
								@change="changeMsg1"
								placeholder=" "
								v-model="form1.msg">
								<el-option
									v-for="item in form1.msgData"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								></el-option>
							</el-select>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button type="primary" @click="editimsi">保 存</el-button>
						<el-button @click="dialogFormVisible1 = false">取 消</el-button>
					</div>
				</el-dialog>
				<el-table
					:data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
					stripe
					border
					show-overflow-tooltip
					class="tab"
					highlight-current-row
					@current-change="handleCurrentChange"
					@row-click="clickRow"
					@sort-change="sortChange"
					:row-class-name="tableRowClassName"
					>
					<el-table-column
						label=" "
						width="30"
						type="index"
						:resizable="false"
						:index="indexMethod"
						:show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column
						prop="taskname"
						label="任务名称"
						sortable
						:resizable="false"
						:show-overflow-tooltip="true"
						min-width='8%'>
					</el-table-column>
					<el-table-column
						prop="creator"
						align="center"
						sortable
						:resizable="false"
						:show-overflow-tooltip="true"
						label="创建人"
						min-width='7%'>
					</el-table-column>
					<el-table-column
						prop="creattime"
						align="center"
						sortable
						:resizable="false"
						:show-overflow-tooltip="true"
						label="创建时间"
						min-width='10%'> <!-- :formatter="formatter" -->
					</el-table-column>
					<el-table-column
						prop="imsi"
						sortable
						:resizable="false"
						:show-overflow-tooltip="true"
						label="手机卡码(IMSI)"
						align="center"
						min-width='10%'>
						<template slot-scope="scope">
							<a href="#" @click="view(scope.row)">点击查看</a>
						</template>
					</el-table-column>
					<el-table-column
						prop="swan"
						label="卡口"
						sortable
						:resizable="false"
						:show-overflow-tooltip="true"
						min-width='12%'>
						<template slot-scope="scope">
							<span v-if="scope.row.swan === '1'">iTest卡口</span>
							<span v-if="scope.row.swan === '1,2'">iTest卡口，testGate</span>
							<span v-if="scope.row.swan === '2'">testGate</span>
						</template>
					</el-table-column>
					<el-table-column
						prop="starttime"
						label="任务开始时间"
						align="center"
						sortable
						:resizable="false"
						:show-overflow-tooltip="true"
						min-width='10%'>
					</el-table-column>
					<el-table-column
						prop="endtime"
						label="任务结束时间"
						align="center"
						sortable
						:resizable="false"
						:show-overflow-tooltip="true"
						min-width='10%'>
					</el-table-column>
					<el-table-column
						prop="warning"
						align="right"
						label="预警结果(次)"
						sortable
						:resizable="false"
						:show-overflow-tooltip="true"
						min-width='9%'>
						<template slot-scope="scope">
							<span style="margin-right: 10px">{{ scope.row.warning }}</span>
							<img width="15" height="15" src="../../../assets/images/person.png">
						</template>
					</el-table-column>
					<el-table-column
						prop="state"
						label="状态"
						align="center"
						sortable
						:resizable="false"
						:show-overflow-tooltip="true"
						min-width='6%'>
						<template slot-scope="scope">
							<span v-if="scope.row.state">
								<el-tag
									:type="scope.row.state === 2 ? 'warning' : 'success'"
									disable-transitions>
									<span v-if="scope.row.state === 2">过期</span>
									<span v-else>正常</span>
								</el-tag>
							</span>
						</template>
					</el-table-column>
					<el-table-column
						prop="taskid"
						label="操作"
						align="center"
						:resizable="false"
						:show-overflow-tooltip="true"
						min-width='8%'>
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
					:page-sizes="pageSizes"
					:page-size="pagesize"
					@size-change="handleChangeSize"
					:total="total">
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'dynamicWarning',
		data () {
			return {
				total: 0, // 默认数据总数
				pagesize: 10, // 每页的数据条数
				currentPage: 1, // 默认开始页面
				pageSizes: [10, 20, 30, 40, 50],
				tableData: [],
				dialogFormVisible: false,
				form: {
					testName: '',
					radio: 3,
					imsi: '',
					testStartTime: new Date().getTime(),
					testEndTime: new Date().getTime(),
					notifyobj: '',
					notice: '',
					message: '',
					msg: '',
					noticeData: [
						{value: '1', label: 'iTest'}
					],
					msgData: [
						{value: '1', label: 'ces'},
						{value: '2', label: '犯罪通知'}
					],
					swan: [],
					swanList: [],
					swanData: [
						{
							label: '测试区域',
							swans: [
								{
									value: '1',
									label: 'iTest卡口'
								},
								{
									value: '2',
									label: 'testGate'
								}
							]
						}
					]
				},
				formLabelWidth: '120px',
				num: '',
				dialogTableVisible1: false,
				gridData: [],
				dialogFormVisible1: false,
				form1: {
					testName: '',
					radio: 3,
					imsi: '',
					testStartTime: '',
					testEndTime: '',
					notifyobj: '',
					msg: '',
					notice: '',
					message: '',
					swan: [],
					swanList: [],
					noticeData: [
						{value: '1', label: 'iTest'}
					],
					msgData: [
						{value: '1', label: 'ces'},
						{value: '2', label: '犯罪通知'}
					],
					swanData: [
						{
							label: '测试区域',
							swans: [
								{
									value: '1',
									label: 'iTest卡口'
								},
								{
									value: '2',
									label: 'testGate'
								}
							]
						}
					]
				},
				dialogTableVisible2: false,
				detailsData: [],
				rowid: '',
				rowcontent: {}
			}
		},
		computed: {
			url () {
				return this.$store.state.url
			}
		},
		methods: {
			getSwan (swan) {
				var swanList = []
				if (swan !== '') {
					swan.forEach(item => {
						swanList.push(Number(item))
					})
				}
				return swanList
			},
			changeNotify1 (value) {
				this.form1.noticeData.forEach((key) => {
					if (key.value === value) {
						this.form1.notice = key.label
					}
				})
			},
			changeMsg1 (value) {
				this.form1.msgData.forEach((key) => {
					if (key.value === value) {
						this.form1.message = key.label
					}
				})
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
				this.rowid = row.taskid
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
			handleChangeSize (pagesize) {
				this.pagesize = pagesize
			},
			handleCurrentChange(val) {
				this.currentRow = val
			},
			current_change (currentPage) {
				this.currentPage = currentPage
			},
			indexMethod(index) {
				return index + (this.currentPage - 1) * this.pagesize + 1
			},
			cancel () {
				this.dialogFormVisible = false
				this.form.testName = ''
				this.form.radio = 3
				this.form.imsi = ''
				this.form.testStartTime = new Date().getTime()
				this.form.testEndTime = new Date().getTime()
				this.form.notifyobj = ''
				this.form.msg = ''
				this.form.notice = ''
				this.form.message = ''
				this.form.swan = []
			},
			isImsi (imsi) {
				if (imsi !== null && imsi !== '') {
					var list = imsi.replace(/，/ig, ',')
					var imsiList = list.split(',')
					return imsiList
				} else {
					return []
				}
			},
			addData () {
				var len = this.isImsi(this.form.imsi).length
				if (this.form.testName === null || this.form.testName === '') {
					this.$alert('请输入任务名称', '提示', {
						confirmButtonText: '确定',
						callback: action => {
							this.$message({
								type: 'info',
								message: 'action:' + action
							})
						}
					})
				} else if (this.form.imsi === null || this.form.imsi === '') {
					this.$alert('请输入手机卡码(IMSI)', '提示', {
						confirmButtonText: '确定',
						callback: action => {
							this.$message({
								type: 'info',
								message: 'action:' + action
							})
						}
					})
				} else if (len > 5) {
					this.$alert(`当前输入IMSI个数为${len}，最多支持5条IMSI`, '提示', {
						confirmButtonText: '确定',
						callback: action => {
							this.$message({
								type: 'info',
								message: 'action:' + action
							})
						}
					})
				} else if (this.form.swan.length === 0) {
					this.$alert('请输入卡口', '提示', {
						confirmButtonText: '确定',
						callback: action => {
							this.$message({
								type: 'info',
								message: 'action:' + action
							})
						}
					})
				} else if (this.form.starttime === 0) {
					this.$alert('请输入开始时间', '提示', {
						confirmButtonText: '确定',
						callback: action => {
							this.$message({
								type: 'info',
								message: 'action:' + action
							})
						}
					})
				} else if (this.form.endtime === 0) {
					this.$alert('请输入结束时间', '提示', {
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
					this.axios.post(`${this.url}/control/dynamic/add`, {
						taskname: this.form.testName,
						creator: 'iTest',
						creattime: new Date().getTime(),
						imsi: this.form.imsi,
						swan: this.form.swan.sort(),
						starttime: new Date(this.form.testStartTime).getTime(),
						endtime: new Date(this.form.testEndTime).getTime(),
						noticeTo: this.form.notice,
						message: this.form.message,
						warning: null,
						state: 2
					})
					.then(function (response) {
						that.tableData = response.data.res
						that.form.testName = ''
						that.form.radio = 3
						that.form.imsi = ''
						that.form.testStartTime = new Date().getTime()
						that.form.testEndTime = new Date().getTime()
						that.form.notifyobj = ''
						that.form.msg = ''
						that.form.notice = ''
						that.form.message = ''
						that.form.swan = []
					})
					.catch(function (error) {
						console.log(error)
					})
					this.dialogFormVisible = false
				}
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
			},
			fileData (event) {
				console.log(event.target.files)
			},
			editData () {
				if (this.num === '') {
					this.$alert('请选择要修改的记录', '警告', {
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
					this.form1.testName = this.rowcontent.taskname
					this.form1.imsi = this.rowcontent.imsi
					this.form1.swan = this.rowcontent.swan.split(',')
					this.form1.testStartTime = new Date(this.rowcontent.starttime)
					this.form1.testEndTime = new Date(this.rowcontent.endtime)
				}
			},
			editimsi () {
				var len = this.isImsi(this.form1.imsi).length
				if (this.form1.imsi === null || this.form1.imsi === '') {
					this.$alert('请输入手机卡码(IMSI)', '警告', {
						confirmButtonText: '确定',
						callback: action => {
							this.$message({
								type: 'info',
								message: 'action:' + action
							})
						}
					})
				} else if (len > 5) {
					this.$alert(`当前输入IMSI个数为${len}，最多支持5条IMSI`, '提示', {
						confirmButtonText: '确定',
						callback: action => {
							this.$message({
								type: 'info',
								message: 'action:' + action
							})
						}
					})
				} else if (this.form1.swan.length === 0) {
					this.$alert('请输入卡口', '警告', {
						confirmButtonText: '确定',
						callback: action => {
							this.$message({
								type: 'info',
								message: 'action:' + action
							})
						}
					})
				} else if (this.form1.starttime === 0) {
					this.$alert('请输入开始时间', '警告', {
						confirmButtonText: '确定',
						callback: action => {
							this.$message({
								type: 'info',
								message: 'action:' + action
							})
						}
					})
				} else if (this.form1.endtime === 0) {
					this.$alert('请输入结束时间', '警告', {
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
					this.axios.post(`${this.url}/control/dynamic/update`, {
						taskid: this.rowid,
						imsi: this.form1.imsi,
						swan: this.form1.swan.sort(),
						starttime: new Date(this.form1.testStartTime).getTime(),
						endtime: new Date(this.form1.testEndTime).getTime(),
						noticeTo: this.form1.notice,
						message: this.form1.message
					})
					.then(function (response) {
						that.tableData = response.data.res
						that.dialogFormVisible1 = false
					})
					.catch(function (error) {
						console.log(error)
					})
				}
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
						this.axios.post(`${this.url}/control/dynamic/delete`, {
							taskid: this.rowid
						})
						.then(function (response) {
							that.tableData = response.data.res
							that.num = ''
							that.rowid = ''
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
				that.tableData = []
				const loading = that.$loading({
					target: document.querySelector('.table-list'),
					lock: true,
					text: '正在加载...',
					spinner: 'el-icon-loading',
					background: 'rgba(255, 255, 255, 0.6)'
				})
				this.axios.post(`${this.url}/control/dynamic/refresh`)
				.then(function (response) {
					loading.close()
					that.tableData = response.data.res
					that.total = that.tableData.length
				})
				.catch(function (error) {
					console.log(error)
				})
			},
			view (row) {
				this.dialogTableVisible1 = true
				this.gridData = []
				var grid = row.imsi.split(',')
				grid.forEach((value) => {
					this.gridData.push({
						imsi: value,
						name: row.taskname
					})
				})
			},
			viewData (row) {
				this.detailsData = []
				var imsiList = row.imsi.split(',')
				imsiList.forEach((value) => {
					this.detailsData.push({
						imsi: value,
						swan: row.swan,
						creattime: row.creattime
					})
				})
				this.dialogTableVisible2 = true
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
			this.tableData.forEach((value, index) => {
				value.creattime = this.getDateTime(value.creattime)
				value.starttime = this.getDateTime(value.starttime)
				value.endtime = this.getDateTime(value.endtime)
			})
		},
		mounted () {
			this.loading()
		}
	}
</script>

<style>
	.dynamic-warning .card-content{
		height: 100%;
		width: 100%;
		padding: 1px;
	}
	.dynamic-warning .export{
		height: 31px;
		padding-left: 5px;
		border-bottom: 1px solid #ddd;
		background-color: #f4f4f4;
	}
	.dynamic-warning .icon{
		padding-left: 2px;
		float: left;
		width: 78px;
		height: 26px;
		margin-top: 2px;
		border-right: 1px solid #ccc;
	}
	.dynamic-warning .icon-load{
		padding-left: 2px;
		float: left;
		width: 78px;
		height: 26px;
		margin-top: 2px;
	}
	.dynamic-warning table a{
		text-decoration: none;
		color: green;
		display: inline-table;
	}
</style>
