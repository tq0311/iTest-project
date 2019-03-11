<template>
	<div class="accurate-analysis">
		<div class="search-card">
			<div class="card-top">
				碰撞条件
			</div>
			<div class="card-content">
				<div class="select-template">
					<ComboBox inputId="selectTemplate" v-model="selectTemplate" :data="selectTemplateData" placeholder="选择模板"></ComboBox>
				</div>
				<form id="queryForm">
					<table width="100%" cellpadding="0" cellspacing="0" border="0">
						<tr v-for="(site, index) in siteData" :key="index">
							<th>采集地点{{index+1}}</th>
							<td>
								<el-select v-model="siteData[index].swan" placeholder=" ">
									<el-option-group
										v-for="group in sitePlaceData"
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
							<th>采集时间{{index+1}}</th>
							<td>
								<el-date-picker
									v-model="siteData[index].timestamp"
									type="datetime"
									value-format="timestamp"
									placeholder="选择日期时间">
								</el-date-picker>
							</td>
							<td>
								<a href="#" v-if="index == 1" @click="insert(index)">增加</a>
								<a href="#" v-if="index > 1" @click="remove(index)">删除</a>
							</td>
						</tr>
						<tr>
							<th>浮动间隔（时间）</th>
							<td>
								<ComboBox inputId="interval" v-model="interval" :data="intervalData" :editable="false"></ComboBox><span class="second">秒</span>
							</td>
							<th>最小碰撞次数</th>
							<td>
								<NumberBox inputId="minnumber" v-model="minnumber" :min="1" :value="1" :spinners="true"></NumberBox>
							</td>
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
		<div class="results-card">
			<div class="card-top">
				碰撞人员查询结果
			</div>
			<div class="card-content-list">
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
							type="index"
							width="30"
							:show-overflow-tooltip="true"
							:resizable="false"
							:index="indexMethod">
						</el-table-column>
						<el-table-column
							prop="set"
							label="设定"
							:show-overflow-tooltip="true"
							:resizable="false"
							min-width='6%'>
						</el-table-column>
						<el-table-column
							prop="phone"
							label="目标号码"
							:show-overflow-tooltip="true"
							:resizable="false"
							min-width='9%'>
						</el-table-column>
						<el-table-column
							prop="exist_condition_count"
							label="碰撞次数"
							:show-overflow-tooltip="true"
							:resizable="false"
							min-width='9%'>
						</el-table-column>
						<el-table-column
							prop="exist_condition"
							:label=label[0]
							:show-overflow-tooltip="true"
							:resizable="false"
							min-width='14%'>
							<template slot-scope="scope">
								<span v-if="typeof findSwan('1', scope.row.exist_condition) !== 'undefined'">
									<i class="el-icon-circle-check" style="color: green;"></i>
								</span>
								<span v-if="siteData.length > 0 && typeof findSwan('1', scope.row.exist_condition) === 'undefined'">
									<i class="el-icon-circle-close" style="color: red;"></i>
								</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="exist_condition"
							:label=label[1]
							:show-overflow-tooltip="true"
							:resizable="false"
							min-width='14%'>
							<template slot-scope="scope">
								<span v-if="typeof findSwan('2', scope.row.exist_condition) !== 'undefined'">
									<i class="el-icon-circle-check" style="color: green;"></i>
								</span>
								<span v-if="siteData.length > 1 && typeof findSwan('2', scope.row.exist_condition) === 'undefined'">
									<i class="el-icon-circle-close" style="color: red;"></i>
								</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="exist_condition"
							:label=label[2]
							:show-overflow-tooltip="true"
							:resizable="false"
							min-width='14%'>
							<template slot-scope="scope">
								<span v-if="typeof findSwan('3', scope.row.exist_condition) !== 'undefined'">
									<i class="el-icon-circle-check" style="color: green;"></i>
								</span>
								<span v-if="siteData.length > 2 && typeof findSwan('3', scope.row.exist_condition) === 'undefined'">
									<i class="el-icon-circle-close" style="color: red;"></i>
								</span>
								<span v-if="siteData.length < 3">-</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="exist_condition"
							:label=label[3]
							:show-overflow-tooltip="true"
							:resizable="false"
							min-width='14%'>
							<template slot-scope="scope">
								<span v-if="typeof findSwan('4', scope.row.exist_condition) !== 'undefined'">
									<i class="el-icon-circle-check" style="color: green;"></i>
								</span>
								<span v-if="siteData.length > 3 && typeof findSwan('4', scope.row.exist_condition) === 'undefined'">
									<i class="el-icon-circle-close" style="color: red;"></i>
								</span>
								<span v-if="siteData.length < 4">-</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="exist_condition"
							:label=label[4]
							:show-overflow-tooltip="true"
							:resizable="false"
							min-width='14%'>
							<template slot-scope="scope">
								<span v-if="typeof findSwan('5', scope.row.exist_condition) !== 'undefined'">
									<i class="el-icon-circle-check" style="color: green;"></i>
								</span>
								<span v-if="siteData.length > 4 && typeof findSwan('5', scope.row.exist_condition) === 'undefined'">
									<i class="el-icon-circle-close" style="color: red;"></i>
								</span>
								<span v-if="siteData.length < 5">-</span>
							</template>
						</el-table-column>
						<template slot="empty">
							<img src="../../../../static/nodata_icon.png" width="108" height="70">
							<p :style="{'marginTop': '23px'}">抱歉，暂无数据</p>
						</template>
					</el-table>
					<el-pagination
						layout=" sizes, jumper, prev, pager, next, total"
						@current-change="current_change"
						:page-sizes="pageSizes"
						:page-size="pagesize"
						@size="handleChangeSize"
						:total="total">
					</el-pagination>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default{
		name: 'accurateAnalysis',
		data () {
			return {
				siteData: [
					{
						timestamp: new Date('2014-04-28 13:00:00').getTime(),
						swan: '',
						condition: '1'
					},
					{
						timestamp: new Date('2014-04-28 13:00:00').getTime(),
						swan: '',
						condition: '2'
					}
				],
				minnumber: 2,
				interval: 5,
				selectTemplate: null,
				selectTemplateData: [
					{value: 1, text: ''}
				],
				intervalData: [
					{value: 1, text: '5'},
					{value: 2, text: '10'},
					{value: 3, text: '15'},
					{value: 4, text: '30'},
					{value: 5, text: '60(1分钟)'},
					{value: 6, text: '120(2分钟)'},
					{value: 7, text: '180(3分钟)'},
					{value: 8, text: '240(4分钟)'},
					{value: 9, text: '300(5分钟)'}
				],
				sitePlaceData: [
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
				total: 0, // 默认数据总数
				pagesize: 10, // 每页的数据条数
				currentPage: 1, // 默认开始页面
				pageSizes: [10, 20, 30, 40, 50],
				tableData: [],
				isSwanNull: [],
				isTimeNull: true,
				label: ['现场A', '现场B', '现场C', '现场D', '现场E']
			}
		},
		computed: {
			url () {
				return this.$store.state.url
			}
		},
		methods: {
			findSwan (num, arr) {
				var found = arr.find(function (item) {
					return item === num
				})
				return found
			},
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
			current_change (currentPage) {
				this.currentPage = currentPage
			},
			indexMethod(index) {
				return index + (this.currentPage - 1) * this.pagesize + 1
			},
			search () {
				var that = this
				that.isSwanNull = []
				that.isTimeNull = true
				that.siteData.forEach((item, index) => {
					if (item.swan === null || item.swan === '') {
						that.isSwanNull.push(index + 1)
					} else if (item.timestamp === null) {
						that.isTimeNull = false
					}
				})
				if (that.isTimeNull === false) {
					that.$notify({
						title: '提示',
						message: `请选择采集时间！`,
						position: 'bottom-right',
						duration: 2000
					})
				} else if (that.isSwanNull.length !== 0) {
					that.$notify({
						title: '提示',
						message: `请选择采集地点${that.isSwanNull[0]}！`,
						position: 'bottom-right',
						duration: 2000
					})
				} else {
					that.tableData = []
					const loading = that.$loading({
						target: document.querySelector('.table-list'),
						lock: true,
						text: '正在加载...',
						spinner: 'el-icon-loading',
						background: 'rgba(255, 255, 255, 0.5)'
					})
					this.axios.post(`${this.url}/collision/accurate`, {
						interval: this.getInterval(this.interval) ? this.getInterval(this.interval) : '',
						times: this.minnumber ? this.minnumber : '',
						conditions: this.siteData
					})
					.then(function (response) {
						loading.close()
						var map = that.siteData.map(function (item, index) {
							if (item.swan === '1') {
								return 'iTest卡口'
							} else {
								return 'testGate'
							}
						})
						Object.assign(that.label, map)
						that.tableData = response.data.res
						that.total = that.tableData.length
					})
				}
			},
			destroy () {
				this.$destroy()
			},
			reset () {
				Object.assign(this.$data, this.$options.data())
			},
			handleChangeSize (pagesize) {
				this.pagesize = pagesize
			},
			formatText (value) {
				if (this.value && this.value.length > 3) {
					return this.value.length + ' items selected'
				}
				return value
			},
			insert: function () {
				let len = this.siteData.length
				if (len < 5) {
					this.siteData.push({
						timestamp: new Date('2014-04-28 13:00:00').getTime(),
						swan: '',
						condition: String(len + 1)
					})
				}
			},
			remove: function (index) {
				this.siteData.splice(index, 1)
			}
		}
	}
</script>

<style>
	*{
		margin: 0;
		padding: 0;
		border: 0;
	}
	.accurate-analysis .card-content{
		height: 100%;
		width: 100%;
		height: 306px;
		overflow-y: scroll;
		overflow-x: hidden;
		padding: 1px 1px 3px 1px;
		border-left: 1px solid #b6b4b6;
		border-right: 1px solid #b6b4b6;
		border-bottom: 1px solid #b6b4b6;
	}
	.accurate-analysis .card-content-list{
		height: 100%;
		width: 100%;
		padding: 1px 1px 3px 1px;
	}
	.accurate-analysis .event-btn{
		text-align: center;
		margin: 15px 0;
	}
	.accurate-analysis .select-template{
		height: 45px;
		padding:  10px 0 10px 10px;
		margin-bottom: 10px;
		background: #F4F4F4;
	}
	.site{
		width: 300px;
		height: 32px;
		border: 1px solid #ddd;
		border-radius: 5px;
	}
	.accurate-analysis .card-content table tr th{
		height: 34px;
		line-height: 36px;
		text-align: right;
	}
	.accurate-analysis .card-content table tr td{
		text-align: left;
		height: 36px;
		padding-left: 5px;
		line-height: 34px;
	}
	.accurate-analysis .card-content table tr td span .second{
		font-weight: bold;
	}
	.accurate-analysis .to {
		margin: 0 3px;
	}
	.accurate-analysis .export{
		height: 31px;
		padding-left: 5px;
		border-bottom: 1px solid #ddd;
		background-color: #f4f4f4;
	}
	.accurate-analysis .icon{
		padding-left: 2px;
		float: left;
		width: 78px;
		height: 26px;
		margin-top: 2px;
	}
	.accurate-analysis .card-content a{
		color: #0163a7;
		text-decoration: none;
	}
	.accurate-analysis .second{
		font-weight: bold;
		margin-left: 5px;
	}
</style>
