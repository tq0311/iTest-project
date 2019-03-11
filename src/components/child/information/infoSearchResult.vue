<template>
	<div class="info-search-result">
		<div class="search-card">
			<div class="card-top">
				查询条件
			</div>
			<div class="card-content">
				<table width="100%" cellpadding="0" cellspacing="0" border="0">
					<tr>
						<th rowspan="2">手机卡码(IMSI)：</th>
						<td rowspan="2">
							<ComboBox
								inputId="imsi"
								v-model="imsi"
								:data="imsiData"
								:editable="false">
							</ComboBox>
							<!-- {{postData.imsi}} -->
						</td>
						<th>电话号码：</th>
						<td>
							{{postData.phone}}
						</td>
						<th>采集地点：</th>
						<td>
							<ComboBox
								inputId="swan"
								v-model="swan"
								:data="swanData"
								:editable="false">
							</ComboBox>
						</td>
						<th>手机归属地：</th>
						<td>
							<span v-if="postData.whether === 1">(包含)</span>
							<span v-if="postData.whether === 2">(不包含)</span>
							{{postData.belong}}
						</td>
					</tr>
					<tr>
						<th>采集开始时间：</th>
						<td>
							{{getDateTime(postData.starttime)}}
						</td>
						<th>采集结束时间：</th>
						<td>
							{{getDateTime(postData.endtime)}}
						</td>
						<th>运营商类型：</th>
						<td>
							<ComboBox
								inputId="operator"
								v-model="operator"
								:data="operatorData"
								:editable="false">
							</ComboBox>
						</td>
					</tr>
					<tr>
						<th>是否特定人员：</th>
						<td>
							<span v-if="postData.particular === 'yes'">是</span>
							<span v-else>否</span>
						</td>
						<th>特定人员类型：</th>
						<td>
							<span v-if="postData.persontype === 1">全部</span>
							<span v-if="postData.persontype === 2">特定人员</span>
							<span v-if="postData.persontype === 3">非特定人员</span>
						</td>
					</tr>
				</table>
			</div>
		</div>
		<div>
			<div class="card-top">
				<span>综合信息查询结果</span>
			</div>
			<div class="state-content">
				<div class="export">
					<div class="icon-load">
						<LinkButton iconCls="icon-export" :plain="true">导出</LinkButton>
					</div>
				</div>
				<el-table
					:data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
					height="370"
					stripe
					border
					class="tab"
					highlight-current-row
					@current-change="handleCurrentChange"
					>
					<el-table-column
						label=" "
						width="30"
						type="index"
						:resizable="false"
						:show-overflow-tooltip="true"
						:index="indexMethod">
					</el-table-column>
					<el-table-column
						prop="imsi"
						label="手机卡码(IMSI)"
						sortable
						:show-overflow-tooltip="true"
						:resizable="false"
						min-width='15%'>
					</el-table-column>
					<el-table-column
						prop="imei"
						label="手机串码(IMEI)"
						sortable
						:show-overflow-tooltip="true"
						:resizable="false"
						min-width='15%'>
					</el-table-column>
					<el-table-column
						prop="belong"
						label="手机归属地"
						sortable
						:show-overflow-tooltip="true"
						:resizable="false"
						min-width='15%'>
					</el-table-column>
					<el-table-column
						prop="phone"
						label="电话号码"
						sortable
						:show-overflow-tooltip="true"
						:resizable="false"
						min-width='8%'>
					</el-table-column>
					<el-table-column
						prop="operator"
						label="运营商"
						sortable
						:show-overflow-tooltip="true"
						:resizable="false"
						min-width='8%'>
					</el-table-column>
					<el-table-column
						prop="swan"
						label="采集地点"
						:show-overflow-tooltip="true"
						:resizable="false"
						min-width='14%'>
						<template slot-scope="scope">
							<span v-if="scope.row.swan === '1'">iTest卡口</span>
							<span v-if="scope.row.swan === '1,2'">iTest卡口,testGate</span>
							<span v-if="scope.row.swan === '2'">testGate</span>
						</template>
					</el-table-column>
					<el-table-column
						prop="particular"
						label="是否特定人员"
						:show-overflow-tooltip="true"
						:resizable="false"
						min-width='8%'>
						<template slot-scope="scope">
							<span v-if="scope.row.particular === 'yes'">是</span>
							<span v-else>否</span>
						</template>
					</el-table-column>
					<el-table-column
						prop="timestamp"
						label="出现时间"
						sortable
						:show-overflow-tooltip="true"
						:resizable="false"
						min-width='15%'>
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
					:total="total"
					@size-change="handleChangeSize">
				</el-pagination>
			</div>
		</div>
	</div>
</template>
<script>
	export default{
		name: 'infoSearchResult',
		props: ['postData'],
		data () {
			return {
				total: 0, // 默认数据总数
				pagesize: 10, // 每页的数据条数
				currentPage: 1, // 默认开始页面
				pageSizes: [10, 20, 30, 40, 50],
				imsi: '',
				swan: [],
				Data: [],
				imsiData: [],
				swanData: [],
				operator: [],
				operatorData: [],
				load: null
				// isSearch: false
			}
		},
		watch: {
			/* 'postData.isSearch': {
				handler () {
					this.load = this.$loading({
						target: document.querySelector('.state-content'),
						lock: true,
						text: '正在加载...',
						spinner: 'el-icon-loading',
						background: 'rgba(255, 255, 255, 0.5)'
					})
				},
				immediate: true
			}, */
			tableData () {
				this.total = this.tableData.length
				this.Data = this.tableData
				this.load.close()
			}
		},
		computed: {
			tableData () {
				return this.$store.state.tableData
			},
			isSearch () {
				return this.$store.state.isSearch
			}
		},
		methods: {
			destroy () {
				this.$destroy()
			},
			reset () {
				Object.assign(this.$data, this.$options.data())
			},
			getDateTime (d) {
				if (d) {
					var date = new Date(d)
					var year = date.getFullYear()
					var month = date.getMonth() + 1
					var day = date.getDate()
					month = this.checkTime(month)
					day = this.checkTime(day)
					return year + '-' + month + '-' + day
				} else {
					return ''
				}
			},
			checkTime (d) {
				if (d < 10) {
					d = '0' + d
				}
				return d
			},
			handleCurrentChange(val) {
				this.currentRow = val
			},
			current_change (currentPage) {
				this.currentPage = currentPage
			},
			// 获取手机卡码(IMSI)下拉数据
			getImsiData (imsi) {
				if (imsi) {
					var list = imsi.replace(/，/ig, ',')
					var imsiList = list.split(',')
					var imsiData = []
					imsiList.forEach((item, index) => {
						imsiData.push({
							value: index + 1,
							text: item
						})
					})
					return imsiData
				} else {
					return []
				}
			},
			getSwanData (swan) {
				if (swan) {
					var list = []
					swan.find(function (item, index) {
						if (item === '1') {
							list.push({
								value: index + 1,
								text: 'iTest卡口'
							})
						} else if (item === '2') {
							list.push({
								value: index + 1,
								text: 'testGate'
							})
						}
					})
					return list
				} else {
					return []
				}
			},
			getOperatorData (operator) {
				if (operator) {
					var list = []
					operator.find(function (item, index) {
						if (item === 1) {
							list.push({
								value: index + 1,
								text: '中国移动'
							})
						} else if (item === 2) {
							list.push({
								value: index + 1,
								text: '中国联通'
							})
						} else if (item === 3) {
							list.push({
								value: index + 1,
								text: '中国电信'
							})
						} else if (item === 4) {
							list.push({
								value: index + 1,
								text: '国际用户'
							})
						}
					})
					return list
				} else {
					return []
				}
			},
			indexMethod(index) {
				return index + (this.currentPage - 1) * this.pagesize + 1
			},
			handleChangeSize (pagesize) {
				this.pagesize = pagesize
			},
			getData () {
				this.imsi = ''
				this.imsiData = this.getImsiData(this.postData.imsi)
				if (this.imsiData.length !== 0) {
					this.imsi = 1
				}
				this.operator = ''
				this.operatorData = this.getOperatorData(this.postData.operator)
				if (this.operatorData.length !== 0) {
					this.operator = 1
				}
				this.swan = ''
				this.swanData = this.getSwanData(this.postData.swan)
				if (this.swanData.length !== 0) {
					this.swan = 1
				}
			},
			loading () {
				if (this.isSearch === true) {
					this.load = this.$loading({
						target: document.querySelector('.state-content'),
						lock: true,
						text: '正在加载...',
						spinner: 'el-icon-loading',
						background: 'rgba(255, 255, 255, 0.5)'
					})
				}
			}
		},
		mounted () {
			this.getData()
		},
		activated () {
			this.getData()
			this.loading()
		}
	}
</script>

<style>
	*{
		font-size: 12px;
	}
	.info-search-result .card-content{
		height: 100%;
		width: 100%;
		padding: 1px;
		height: 166px;
		border-left: 1px solid #b6b4b6;
		border-right: 1px solid #b6b4b6;
		border-bottom: 1px solid #b6b4b6;
	}
	.info-search-result .search-card table{
		width: 100%;
		margin-top: 20px;
	}
	.info-search-result .search-card table tr th{
		text-align: right;
		width: 9vw;
		white-space: nowrap;
	}
	.info-search-result .search-card table tr td{
		width: calc(12.5vw);
		padding: 6px 0;
		text-align: left;
		white-space: nowrap;
	}
	.info-search-result .export{
		height: 31px;
		padding-left: 5px;
		border-bottom: 1px solid #ddd;
		background-color: #f4f4f4;
	}
	.info-search-result .icon-load{
		padding-left: 2px;
		float: left;
		width: 78px;
		height: 26px;
		margin-top: 2px;
	}
</style>
