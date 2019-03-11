<template>
	<div class="along-with-analysis">
		<div class="condition-card">
			<div class="card-top">
				伴随条件
			</div>
			<div class="card-content">
				<div class="select-template">
					<ComboBox inputId="selectTemplate" v-model="selectTemplate" :data="selectTemplateData" placeholder="选择模板"></ComboBox>
				</div>
				<form id="queryForm">
					<table width="100%" cellpadding="0" cellspacing="0" border="0">
						<tr>
							<th>手机卡码(IMSI)</th>
							<td><TextBox inputId="imsi" v-model="imsi"></TextBox></td>
							<th>电话号码</th>
							<td><TextBox inputId="phone" v-model="phone"></TextBox></td>
						</tr>
						<tr>
							<th>浮动间隔（时间）</th>
							<td>
								<ComboBox inputId="interval" v-model="interval" :data="intervalData"></ComboBox><span class="b">秒</span>
							</td>
							<th>最小同行次数</th>
							<td>
								<ComboBox inputId="minNumber" v-model="minNumber" :data="minNumberData"></ComboBox>
							</td>
						</tr>
						<tr>
							<th>采集地点</th>
							<td class="addstyle">
								<el-select v-model="swan" multiple placeholder=" ">
									<el-option-group
										v-for="group in swanData"
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
							</td>
							<th>采集时间</th>
							<td>
								<div class="select-time">
									<el-date-picker
										v-model="starttime"
										type="date"
										value-format="timestamp"
										placeholder="选择日期时间">
									</el-date-picker>
									至
									<el-date-picker
										v-model="endtime"
										type="date"
										value-format="timestamp"
										placeholder="选择日期时间">
									</el-date-picker>
								</div>
							</td>
						</tr>
						<tr>
							<th>手机归属地</th>
							<td>
								<ComboTree inputId="belongto"
									:data="belongData"
									:multiple="true"
									:textFormatter="formatText"
									:selectLeafOnly = true
									v-model="belongto">
									<Tree slot="tree" @checkChange="checkBelong"></Tree>
								</ComboTree>
							</td>
							<th></th>
							<td></td>
						</tr>
					</table>
					<div class="event-btn">
						<el-button type="success" id="search" plain @click="search">查询</el-button>
						<el-button type="success" id="reset"  plain @click="reset">重置</el-button>
						<el-button type="success" id="save" plain>保存为模板</el-button>
					</div>
				</form>
			</div>
		</div>
		<div class="result-card">
			<div class="card-top">伴随分析结果</div>
			<div class="content">
				<div class="table-list">
					<div class="export">
						<div class="icon">
							<LinkButton iconCls="icon-export" :plain="true">导出</LinkButton>
						</div>
					</div>
					<el-table
						:data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
						height="300"
						stripe
						border
						class="tab"
						>
						<el-table-column
							label=" "
							width="30"
							type="index"
							:show-overflow-tooltip="true"
							:resizable="false"
							:index="indexMethod"> <!--  -->
						</el-table-column>
						<el-table-column
							prop="imsi"
							label="手机卡码(ISMI)"
							:show-overflow-tooltip="true"
							:resizable="false"
							min-width='33%'>
						</el-table-column>
						<el-table-column
							prop="particular"
							label="是否特定人员"
							:show-overflow-tooltip="true"
							:resizable="false"
							min-width='16%'>
							<template slot-scope="scope">
								<span v-if="scope.row.particular === 'yes'">是</span>
								<span v-else>否</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="phone"
							label="电话号码"
							:show-overflow-tooltip="true"
							:resizable="false"
							min-width='16%'> <!-- :formatter="formatter" -->
						</el-table-column>
						<el-table-column
							prop="times"
							label="出现次数"
							:show-overflow-tooltip="true"
							:resizable="false"
							min-width='16%'>
						</el-table-column>
						<el-table-column
							prop="operation"
							label="操作"
							align="center"
							:show-overflow-tooltip="true"
							:resizable="false"
							min-width='16%'>
							<template slot-scope="scope">
								<a href="#">查看</a>
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
	</div>
</template>

<script>
	export default{
		name: 'alongWithAnalysis',
		data () {
			return {
				total: 0, // 默认数据总数
				pagesize: 10, // 每页的数据条数
				currentPage: 1, // 默认开始页面
				pageSizes: [10, 20, 30, 40, 50],
				tableData: [],
				tip: {
					content: '此项为必输项',
					position: 'right'
				},
				imsi: null,
				phone: null,
				minNumber: 1,
				belongto: null,
				belong: [],
				site: null,
				swan: [],
				starttime: new Date().getTime() - 157680000000,
				endtime: new Date().getTime(),
				interval: 5,
				loading: false,
				selectTemplate: null,
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
				belongData: [
					{
						id: 1,
						text: '全部',
						children: [
							{
								id: 11,
								text: '北京',
								state: 'closed',
								children: [
									{
										id: 111,
										text: 'Friend'
									},
									{
										id: 112,
										text: 'Wife'
									},
									{
										id: 113,
										text: 'Company'
									}
								]
							},
							{
								id: 12,
								text: '广东',
								state: 'closed',
								children: [
									{
										id: 121,
										text: 'Intel'
									},
									{
										id: 122,
										text: 'Java'
									},
									{
										id: 123,
										text: 'Microsoft Office'
									},
									{
										id: 124,
										text: 'Games'
									}
								]
							},
							{
								id: 12,
								text: '上海',
								state: 'closed',
								children: [
									{
										id: 121,
										text: 'Intel'
									},
									{
										id: 122,
										text: 'Java'
									},
									{
										id: 123,
										text: 'Microsoft Office'
									},
									{
										id: 124,
										text: 'Games'
									}
								]
							},
							{
								id: 12,
								text: '天津',
								state: 'closed',
								children: [
									{
										id: 121,
										text: 'Intel'
									},
									{
										id: 122,
										text: 'Java'
									},
									{
										id: 123,
										text: 'Microsoft Office'
									},
									{
										id: 124,
										text: 'Games'
									}
								]
							},
							{
								id: 12,
								text: '重庆',
								state: 'closed',
								children: [
									{
										id: 121,
										text: 'Intel'
									},
									{
										id: 122,
										text: 'Java'
									},
									{
										id: 123,
										text: 'Microsoft Office'
									},
									{
										id: 124,
										text: 'Games'
									}
								]
							},
							{
								id: 12,
								text: '辽宁',
								state: 'closed',
								children: [
									{
										id: 121,
										text: 'Intel'
									},
									{
										id: 122,
										text: 'Java'
									},
									{
										id: 123,
										text: 'Microsoft Office'
									},
									{
										id: 124,
										text: 'Games'
									}
								]
							},
							{
								id: 12,
								text: '江苏',
								state: 'closed',
								children: [
									{
										id: 121,
										text: 'Intel'
									},
									{
										id: 122,
										text: 'Java'
									},
									{
										id: 123,
										text: 'Microsoft Office'
									},
									{
										id: 124,
										text: 'Games'
									}
								]
							}
						]
					}
				],
				minNumberData: [
					{value: 1, text: '1'},
					{value: 2, text: '2'},
					{value: 3, text: '3'},
					{value: 4, text: '4'},
					{value: 5, text: '5'},
					{value: 6, text: '6'},
					{value: 7, text: '7'},
					{value: 8, text: '8'},
					{value: 9, text: '9'},
					{value: 10, text: '10'}
				],
				intervalData: [
					{value: 1, text: '5'},
					{value: 2, text: '10'},
					{value: 3, text: '15'},
					{value: 4, text: '30'},
					{value: 5, text: '60'},
					{value: 6, text: '120'},
					{value: 7, text: '180'},
					{value: 8, text: '240'},
					{value: 9, text: '300'}
				],
				selectTemplateData: [
					{value: 1, text: ''}
				]
			}
		},
		computed: {
			url () {
				return this.$store.state.url
			}
		},
		methods: {
			getInterval (e) {
				if (e === 1) {
					return 5
				} else if (e === 2) {
					return 10
				} else if (e === 3) {
					return 15
				} else if (e === 4) {
					return 30
				} else if (e === 5) {
					return 60
				} else if (e === 6) {
					return 120
				} else if (e === 7) {
					return 180
				} else if (e === 8) {
					return 240
				} else {
					return 300
				}
			},
			formatText (value) {
				if (this.value && this.value.length > 3) {
					return this.value.length + ' items selected'
				}
				return value
			},
			handleChangeSize (pagesize) {
				this.pagesize = pagesize
			},
			checkChange (nodes) {
				var list = []
				nodes.forEach((node, index) => {
					if (typeof node.value !== 'undefined') {
						list.push(node.value)
					}
				})
				this.swan = list
			},
			checkBelong (nodes) {
				var list = []
				nodes.forEach((node, index) => {
					list.push(node.text)
				})
				this.belong = list
			},
			search () {
				var that = this
				that.list = []
				that.tableData = []
				if (that.phone === null || that.phone === '') {
					that.$notify({
						title: '提示',
						message: '请输入电话号码！',
						position: 'bottom-right',
						duration: 2000
					})
				} else if (that.phone.length > 15) {
					that.$notify({
						title: '提示',
						message: '参数非法！请输入有效的电话号码！',
						position: 'bottom-right',
						duration: 2000
					})
				} else {
					const loading = that.$loading({
						target: document.querySelector('.table-list'),
						lock: true,
						text: '正在加载...',
						spinner: 'el-icon-loading',
						background: 'rgba(255, 255, 255, 0.5)'
					})
					this.axios.post(`${this.url}/analysis/accompany`, {
						phone: this.phone,
						interval: this.getInterval(this.interval) ? this.getInterval(this.interval) : '',
						starttime: this.starttime,
						endtime: this.endtime
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
			reset () {
				Object.assign(this.$data, this.$options.data())
			},
			destroy () {
				this.$destroy()
			},
			indexMethod(index) {
				return index + (this.currentPage - 1) * this.pagesize + 1
			},
			current_change (currentPage) {
				this.currentPage = currentPage
			}
		}
	}
</script>

<style>
	*{
		font-size: 12px;
	}
	.along-with-analysis .card-content{
		height: 100%;
		width: 100%;
		padding: 1px;
		border-left: 1px solid #b6b4b6;
		border-right: 1px solid #b6b4b6;
		border-bottom: 1px solid #b6b4b6;
	}
	.select-template{
		height: 6vh;
		padding:  10px 0 10px 10px;
		margin-bottom: 10px;
		background: #F4F4F4;
	}
	.along-with-analysis .b{
		font-weight: bold;
		margin-left: 5px;
	}
	.along-with-analysis .condition-card table tr th{
		text-align: right;
	}
	.along-with-analysis .condition-card table tr td{
		padding: 6px 0;
		text-align: left;
	}
	.IMSI{
		border: 1px solid #b6b4b6;
		border-radius: 3px;
	}
	.event-btn{
		text-align: center;
		margin-bottom: 15px;
	}
	.along-with-analysis .select-time{
		margin-left: 10px;
	}
	.along-with-analysis .export{
		height: 31px;
		padding-left: 5px;
		border-bottom: 1px solid #ddd;
		background-color: #f4f4f4;
	}
	.along-with-analysis .icon{
		padding-left: 2px;
		float: left;
		width: 78px;
		height: 26px;
		margin-top: 2px;
	}
	.along-with-analysis .add{
		border: 1px solid #ffa8a8;
	}
	.along-with-analysis table a{
		color: green;
		text-decoration: none;
	}
</style>
