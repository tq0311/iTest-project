<template>
	<div class="first-warning">
		<div class="card-top">
			流量预警
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
				<el-dialog v-dialogDrag ref="dialog__wrapper" title="添加任务--流量预警" :visible.sync="dialogFormVisible" :modal="false" :close-on-click-modal="false" :lock-scroll="true">
					<el-form :model="form">
						<el-form-item label="任务名称：" :label-width="formLabelWidth">
							<el-input v-model="form.testName" autocomplete="off"></el-input>
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
							<!-- <ComboTree
								inputId="swan"
								:data="swanData"
								:multiple="true"
								v-model="form.swan"
								:editable="false">
								<Tree slot="tree" @checkChange="checkChange"></Tree>
							</ComboTree> -->
						</el-form-item>
						<el-form-item label="统计时长：" :label-width="formLabelWidth">
							<el-select
								@change="changeDuration"
								placeholder=" "
								v-model="form.duration">
								<el-option
									v-for="item in form.durationData"
									:key="item.value"
									:label="item.label"
									:value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="流量超限值：" :label-width="formLabelWidth">
							<el-input v-model="form.transfinite" autocomplete="off"></el-input>
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
				<el-dialog v-dialogDrag ref="dialog__wrapper" title="修改任务--流量预警" :visible.sync="dialogFormVisible1" :modal="false" :close-on-click-modal="false" :lock-scroll="true">
					<el-form :model="form">
						<el-form-item label="任务名称：" :label-width="formLabelWidth">
							<el-input v-model="form1.testName" autocomplete="off" :disabled="true"></el-input>
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
							<!-- <ComboTree
								inputId="swan"
								:data="swanData"
								:multiple="true"
								v-model="form1.swan"
								:editable="false">
								<Tree slot="tree" @checkChange="checkChange1"></Tree>
							</ComboTree> -->
						</el-form-item>
						<el-form-item label="统计时长：" :label-width="formLabelWidth">
							<el-select
								@change="changeDuration1"
								placeholder=" "
								v-model="form1.duration">
								<el-option
									v-for="item in form1.durationData"
									:key="item.value"
									:label="item.label"
									:value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="流量超限值：" :label-width="formLabelWidth">
							<el-input v-model="form1.transfinite" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="开始时间" :label-width="formLabelWidth" class="time">
							<el-date-picker
								v-model="form1.testStartTime"
								type="date"
								value-format="timestamp"
								placeholder=" ">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="结束时间" :label-width="formLabelWidth" class="time">
							<el-date-picker
								v-model="form1.testEndTime"
								type="date"
								value-format="timestamp"
								placeholder=" ">
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
									:value="item.value">
								</el-option>
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
									:value="item.value"></el-option>
							</el-select>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button type="primary" @click="edit">保 存</el-button>
						<el-button @click="dialogFormVisible1 = false">取 消</el-button>
					</div>
				</el-dialog>
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
							<el-table-column property="swan" sortable label="卡口" :resizable="false" min-width="15%" :show-overflow-tooltip="true">
								<template slot-scope="scope">
									<span v-if="scope.row.swan === '1'">iTest卡口</span>
									<span v-if="scope.row.swan === '1,2'">iTest卡口，testGate</span>
									<span v-if="scope.row.swan === '2'">testGate</span>
								</template>
							</el-table-column>
							<el-table-column property="creattime" sortable label="创建时间" :resizable="false" min-width="15%" :show-overflow-tooltip="true"></el-table-column>
						</el-table>
					</el-dialog>
				</div>
			</div>
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
						width="30"
						:show-overflow-tooltip="true"
						:index="indexMethod">
					</el-table-column>
					<el-table-column
						prop="taskname"
						label="任务名称"
						sortable
						:show-overflow-tooltip="true"
						align="left"
						min-width='8%'>
					</el-table-column>
					<el-table-column
						prop="creator"
						align="center"
						sortable
						:show-overflow-tooltip="true"
						label="创建人"
						min-width='7%'>
					</el-table-column>
					<el-table-column
						prop="creattime"
						align="center"
						sortable
						:show-overflow-tooltip="true"
						label="创建时间"
						min-width='11%'> <!-- :formatter="formatter" -->
					</el-table-column>
					<el-table-column
						prop="swan"
						label="卡口"
						align="left"
						sortable
						:show-overflow-tooltip="true"
						min-width='14%'>
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
						:show-overflow-tooltip="true"
						min-width='12%'>
					</el-table-column>
					<el-table-column
						prop="endtime"
						label="任务结束时间"
						align="center"
						sortable
						:show-overflow-tooltip="true"
						min-width='12%'>
					</el-table-column>
					<el-table-column
						prop="duration"
						label="统计时长(分钟)"
						align="center"
						sortable
						:show-overflow-tooltip="true"
						min-width='12%'>
						<template slot-scope="scope">
							<span>{{ getDuration(scope.row.duration) }}</span>
						</template>
					</el-table-column>
					<el-table-column
						prop="transfinite"
						label="流量超限值"
						align="center"
						sortable
						:show-overflow-tooltip="true"
						min-width='12%'>
					</el-table-column>
					<el-table-column
						prop="warning"
						align="right"
						label="预警结果(次)"
						sortable
						:show-overflow-tooltip="true"
						min-width='10%'>
						<template slot-scope="scope">
							<span style="margin-right: 10px;">{{ scope.row.warning }}</span>
							<img src="../../../assets/images/person.png" width="15" height="15">
						</template>
					</el-table-column>
					<el-table-column
						prop="state"
						label="状态"
						align="center"
						sortable
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
					:total="total">
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'trafficStatistical',
		data () {
			return {
				rowid: '',
				rowcontent: {},
				total: 0, // 默认数据总数
				pagesize: 10, // 每页的数据条数
				currentPage: 1, // 默认开始页面
				pageSizes: [10, 20, 30, 40, 50],
				dialogFormVisible: false,
				form: {
					testName: '',
					testStartTime: new Date().getTime(),
					testEndTime: new Date().getTime(),
					notifyobj: '',
					notice: '',
					noticeData: [
						{value: '1', label: 'iTest'}
					],
					msgData: [
						{value: '1', label: 'ces'},
						{value: '2', label: '犯罪通知'}
					],
					transfinite: '',
					duration: '',
					duration1: '',
					durationData: [
						{value: '1', label: '5分钟'},
						{value: '2', label: '10分钟'},
						{value: '3', label: '15分钟'},
						{value: '4', label: '30分钟'},
						{value: '5', label: '60分钟'}
					],
					message: '',
					msg: '',
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
				dialogFormVisible1: false,
				form1: {
					testName: '',
					transfinite: '',
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
					],
					duration: '',
					duration1: '',
					durationData: [
						{value: '1', label: '5分钟'},
						{value: '2', label: '10分钟'},
						{value: '3', label: '15分钟'},
						{value: '4', label: '30分钟'},
						{value: '5', label: '60分钟'}
					],
					testStartTime: new Date().getTime(),
					testEndTime: new Date().getTime(),
					notifyobj: '',
					msg: '',
					notice: '',
					noticeData: [
						{value: '1', label: 'iTest'}
					],
					msgData: [
						{value: '1', label: 'ces'},
						{value: '2', label: '犯罪通知'}
					],
					message: ''
				},
				num: '',
				tableData: [],
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
			destroy () {
				this.$destroy()
			},
			reset () {
				Object.assign(this.$data, this.$options.data())
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
			changeDuration (value) {
				if (value === '1') {
					this.form.duration1 = 300000
				} else if (value === '2') {
					this.form.duration1 = 600000
				} else if (value === '3') {
					this.form.duration1 = 900000
				} else if (value === '4') {
					this.form.duration1 = 1800000
				} else {
					this.form.duration1 = 3600000
				}
			},
			changeDuration1 (value) {
				if (value === '1') {
					this.form1.duration1 = 300000
				} else if (value === '2') {
					this.form1.duration1 = 600000
				} else if (value === '3') {
					this.form1.duration1 = 900000
				} else if (value === '4') {
					this.form1.duration1 = 1800000
				} else {
					this.form1.duration1 = 3600000
				}
			},
			getEditDuration (value) {
				if (value === 300000) {
					return '1'
				} else if (value === 600000) {
					return '2'
				} else if (value === 900000) {
					return '3'
				} else if (value === 1800000) {
					return '4'
				} else if (value === 3600000) {
					return '5'
				}
			},
			checkChange (nodes) {
				var swan
				nodes.forEach((node) => {
					if (typeof node.value !== 'undefined') {
						swan.push(node.value)
					}
				})
				this.form.swanList = swan
			},
			checkChange1 (nodes) {
				var swan
				nodes.forEach((node) => {
					if (typeof node.value !== 'undefined') {
						swan.push(node.value)
					}
				})
				this.form1.swanList = swan
			},
			getDuration (t) {
				var time = t / 60000
				return time + '分钟'
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
			viewData (val) {
				this.dialogTableVisible = true
				this.detailsData.push({
					swan: val.swan,
					creattime: val.creattime,
					belong: val.belong
				})
			},
			deleteData () {
				if (this.num === '') {
					this.$alert('请选择需要删除的记录', '警告', {
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
						this.axios.post(`${this.url}/control/flow/delete`, {
							taskid: this.rowid
						})
						.then(function (response) {
							that.tableData = response.data.res
							that.num = ''
							that.rowid = ''
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
			cancel () {
				this.dialogFormVisible = false
				this.form.testName = ''
				this.form.testStartTime = new Date().getTime()
				this.form.testEndTime = new Date().getTime()
				this.form.notifyobj = ''
				this.form.notice = ''
				this.form.transfinite = ''
				this.form.duration = ''
				this.form.duration1 = ''
				this.form.message = ''
				this.form.msg = ''
				this.form.swan = []
			},
			addData () {
				if (this.form.testName === null || this.form.testName === '') {
					this.$alert('请输入任务名称', '警告', {
						confirmButtonText: '确定',
						callback: action => {
							this.$message({
								type: 'info',
								message: 'action:' + action
							})
						}
					})
				} else if (this.form.swan.length === 0) {
					this.$alert('请选择卡口！', '警告', {
						confirmButtonText: '确定',
						callback: action => {
							this.$message({
								type: 'info',
								message: 'action:' + action
							})
						}
					})
				} else if (this.form.duration1 === null || this.form.duration1 === '') {
					this.$alert('请选择统计时长！', '警告', {
						confirmButtonText: '确定',
						callback: action => {
							this.$message({
								type: 'info',
								message: 'action:' + action
							})
						}
					})
				} else if (this.form.transfinite === null || this.form.transfinite === '') {
					this.$alert('请输入流量超限值！', '警告', {
						confirmButtonText: '确定',
						callback: action => {
							this.$message({
								type: 'info',
								message: 'action:' + action
							})
						}
					})
				} else if (this.form.testStartTime === null || this.form.testStartTime === '') {
					this.$alert('请选择开始时间！', '警告', {
						confirmButtonText: '确定',
						callback: action => {
							this.$message({
								type: 'info',
								message: 'action:' + action
							})
						}
					})
				} else if (this.form.testEndTime === null || this.form.testEndTime === '') {
					this.$alert('请选择结束时间！', '警告', {
						confirmButtonText: '确定',
						callback: action => {
							this.$message({
								type: 'info',
								message: 'action:' + action
							})
						}
					})
				} else {
					this.dialogFormVisible = false
					var that = this
					this.axios.post(`${this.url}/control/flow/add`, {
						taskname: this.form.testName,
						creator: 'iTest',
						creattime: new Date().getTime(),
						swan: this.form.swan.sort(),
						duration: this.form.duration1,
						transfinite: this.form.transfinite,
						starttime: new Date(this.form.testStartTime).getTime(),
						endtime: new Date(this.form.testEndTime).getTime(),
						warning: null,
						state: 1,
						noticeTo: this.form.notice,
						message: this.form.message
					})
					.then(function (response) {
						that.tableData = response.data.res
						that.form.testName = ''
						that.form.testStartTime = new Date().getTime()
						that.form.testEndTime = new Date().getTime()
						that.form.notifyobj = ''
						that.form.notice = ''
						that.form.transfinite = ''
						that.form.duration = ''
						that.form.duration1 = ''
						that.form.message = ''
						that.form.msg = ''
						that.form.swan = []
					})
					.catch(function (error) {
						console.log(error)
					})
				}
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
					this.form1.testName = this.rowcontent.taskname
					this.form1.swan = this.rowcontent.swan.split(',')
					this.form1.duration = this.getEditDuration(this.rowcontent.duration)
					this.form1.transfinite = this.rowcontent.transfinite
					this.form1.testStartTime = new Date(this.rowcontent.starttime)
					this.form1.testEndTime = new Date(this.rowcontent.endtime)
				}
			},
			edit () {
				if (this.form1.swan.length === 0) {
					this.$alert('请选择卡口！', '警告', {
						confirmButtonText: '确定',
						callback: action => {
							this.$message({
								type: 'info',
								message: 'action:' + action
							})
						}
					})
				} else if (this.form1.duration1 === null || this.form1.duration1 === '') {
					this.$alert('请选择统计时长！', '警告', {
						confirmButtonText: '确定',
						callback: action => {
							this.$message({
								type: 'info',
								message: 'action:' + action
							})
						}
					})
				} else if (this.form1.transfinite === null || this.form1.transfinite === '') {
					this.$alert('请输入流量超限值！', '警告', {
						confirmButtonText: '确定',
						callback: action => {
							this.$message({
								type: 'info',
								message: 'action:' + action
							})
						}
					})
				} else if (this.form1.testStartTime === null || this.form1.testStartTime === '') {
					this.$alert('请选择开始时间！', '警告', {
						confirmButtonText: '确定',
						callback: action => {
							this.$message({
								type: 'info',
								message: 'action:' + action
							})
						}
					})
				} else if (this.form1.testEndTime === null || this.form1.testEndTime === '') {
					this.$alert('请选择结束时间！', '警告', {
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
					this.axios.post(`${this.url}/control/flow/update`, {
						taskid: this.rowid,
						duration: this.form1.duration1,
						swan: this.form1.swan.sort(),
						transfinite: this.form1.transfinite,
						starttime: this.form1.testStartTime.getTime(),
						endtime: this.form1.testEndTime.getTime(),
						noticeTo: this.form1.notice,
						message: this.form1.message
					})
					.then(function (response) {
						that.tableData = response.data.res
						that.rowid = ''
					})
					.catch(function (error) {
						console.log(error)
					})
					this.dialogFormVisible1 = false
				}
			},
			fileData (event) {
				console.log(event.target.files)
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
			selectionChange1 (event) {
				this.form.belongPlace = event.text
			},
			selectionChange2 (event) {
				this.form1.belongPlace = event.text
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
				this.axios.get(`${this.url}/control/flow/refresh`)
				.then(function (response) {
					loading.close()
					that.tableData = response.data.res
					that.total = that.tableData.length
				})
				.catch(function (error) {
					console.log(error)
				})
			},
			getDateTime (time) {
				var t = new Date(time)
				var year = t.getFullYear()
				var month = t.getMonth() + 1
				var day = t.getDate()
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
		updated () {
			this.total = this.tableData.length
			this.tableData.forEach((value) => {
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
	.first-warning .card-content{
		height: 100%;
		width: 100%;
		padding: 1px;
	}
	.first-warning .export{
		height: 31px;
		padding-left: 5px;
		border-bottom: 1px solid #ddd;
		background-color: #f4f4f4;
	}
	.first-warning .icon{
		padding-left: 2px;
		float: left;
		width: 78px;
		height: 26px;
		margin-top: 2px;
		border-right: 1px solid #ccc;
	}
	.first-warning .icon-load{
		padding-left: 2px;
		float: left;
		width: 78px;
		height: 26px;
		margin-top: 2px;
	}
	.first-warning table a{
		text-decoration: none;
		color: green;
	}
</style>
