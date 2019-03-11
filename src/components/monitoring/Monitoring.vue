<template>
	<div class="monitoring">
		<div class="top">
			<div class="top-left">
				<div class="hours">{{ time }}</div>
				<div class="address">南京<img src="../../assets/images/pos.png"></div>
				<div class="time">{{ fulltime }}</div>
			</div>
			<div class="top-center">电子围栏指挥监控中心</div>
			<div class="top-right">
				<img id="setp" src="../../assets/images/set-pointer.png">
				<img id="setd" src="../../assets/images/set-default.png">
			</div>
		</div>
		<div class="main">
			<div class="main-left">
				<div class="left-main">
					<div class="content">
						<div id="myMap"></div>
					</div>
				</div>
				<div class="left-charts">
					<div class="person-traffic">
						<div class="title">
							<div class="font">人流量统计</div>
						</div>
						<div class="person-chart">
							<div class="chart-top">
								<div class="dayNumber">当日人数 <span>0</span></div>
								<div class="realTimeNumber">实时人数	<span>0</span></div>
							</div>
							<div id="trafficChart" style="height: 100%"></div>
						</div>
					</div>
					<div class="operator">
						<div class="title">
							<div class="font">运营商占比</div>
						</div>
						<div class="operator-chart">
							<div class="flow-right">
								<div class="telecom">电信</div>
								<div>
									<span class="telecom-per">-</span>
									<span class="line">&nbsp;|</span>
									<span class="per">0</span>
								</div>
								<div class="mobile">移动</div>
								<div>
									<span class="mobile-per">-</span>
									<span class="line">&nbsp;|</span>
									<span class="per">0</span>
								</div>
								<div class="unicom">联通</div>
								<div>
									<span class="unicom-per">-</span>
									<span class="line">&nbsp;|</span>
									<span class="per">0</span>
								</div>
							</div>
						</div>
					</div>
					<div class="traffic-analysis">
						<div class="title">
							<div class="font">实时人流量分析</div>
						</div>
						<div class="analysis-chart">
							<div id="analysisChart">
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="main-right">
				<div class="title">
					<div class="imsi">IMSI</div>
				</div>
				<div class="table-list">
					<el-table
						:data="tableData"
						>
						<el-table-column
							prop="imsi"
							label="IMSI号"
							min-width="40%">
						</el-table-column>
						<el-table-column
							prop="operator"
							label="运营商"
							min-width="20%">
						</el-table-column>
						<el-table-column
							prop="event"
							label="事件"
							min-width="40%"> <!-- :formatter="formatter" -->
						</el-table-column>
					</el-table>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import echarts from 'echarts'
	import BMap from 'BMap'
	export default {
		name: 'Monitoring',
		data () {
			return {
				tableData: [],
				time: '',
				fulltime: '',
				isShow: true
			}
		},
		computed: {
			url () {
				return this.$store.state.url
			}
		},
		created() {
			this.tableData = [
				{
					imsi: 123456789,
					operator: '移动',
					event: '电话'
				},
				{
					imsi: 789456123,
					operator: '联通',
					event: '短信'
				},
				{
					imsi: 789456123,
					operator: '电信',
					event: '短信'
				}
			]
		},
		mounted () {
			var map = new BMap.Map('myMap')
			var point = new BMap.Point(118.80, 32.06)
			map.centerAndZoom(point, 12)
			map.enableScrollWheelZoom(true)
			var myIcon = new BMap.Icon('../../../static/market.png', new BMap.Size(30, 25))
			var marker = new BMap.Marker(point, {icon: myIcon})
			map.addOverlay(marker)
			var label = new BMap.Label('testGate', {offset: new BMap.Size(18, -22)})
			label.setStyle({
				color: 'orange',
				fontSize: '12px',
				lineHeight: '20px',
				fontFamily: '微软雅黑'
			})
			marker.setLabel(label)
			marker.addEventListener('click', function () {
				var p = marker.getPosition()
				alert('marker的位置是' + p.lng + ',' + p.lat)
			})
			var styleJson = [
				{
					'featureType': 'background', // 地图背景色
					'elementType': 'all',
					'stylers': {
						'color': '#003672ff'
					}
				},
				{
					'featureType': 'highway', // 高速公路填充
					'elementType': 'geometry.fill',
					'stylers': {
						'color': '#1298b3ff'
					}
				},
				{
					'featureType': 'highway', // 高速公路边框
					'elementType': 'geometry.stroke',
					'stylers': {
						'color': '#7be6ffff'
					}
				},
				{
					'featureType': 'water', // 水
					'elementType': 'geometry',
					'stylers': {
						'color': '#1e95e4ff'
					}
				},
				{
					'featureType': 'railway', // 铁路
					'elementType': 'geometry',
					'stylers': {
						'color': '#a60cc2ff'
					}
				},
				{
					'featureType': 'arterial',
					'elementType': 'geometry',
					'stylers': {
						'color': '#2b90d8ff'
					}
				},
				{
					'featureType': 'subway', // 地铁
					'elementType': 'geometry',
					'stylers': {
						'color': '#2b90d8ff'
					}
				},
				{
					'featureType': 'local', // 普通道路
					'elementType': 'geometry',
					'stylers': {
						'color': '#2b90d8ff'
					}
				},
				{
					'featureType': 'boundary', // 边界
					'elementType': 'geometry',
					'stylers': {
						'color': '#1e95e4ff'
					}
				},
				{
					'featureType': 'poilabel', // 边界
					'elementType': 'labels',
					'stylers': {
						'visibility': 'on'
					}
				}
			]
			map.setMapStyle({styleJson: styleJson})
			// 表格
			this.trafficChartLine()
			this.analysisChartLine()
			this.getTime()
			this.getDateTime()
			$('#setd').mouseover(function () {
				$(this).hide()
			})
			$('#setp').mouseout(function () {
				$('#setd').show()
			})
		},
		update () {
			// 时间5000更新
			setInterval(this.getTime(), 1000)
			// 年月日
			setInterval(this.getDateTime(), 60000)
		},
		methods: {
			trafficChartLine () {
				var dom = document.getElementById('trafficChart')
				var myChart = echarts.init(dom)
				myChart.setOption({
					color: '#74f0f7',
					tooltip: {
						trigger: 'axis',
						position: function (pt) {
							return [pt[0], '10%']
						}
					},
					grid: {
						x: 20,
						y: 5,
						x2: 5,
						y2: 68
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						spiltLine: {
							show: true
						},
						axisTick: {
							show: false
						},
						axisLabel: {
							show: true,
							textStyle: {
								fontSize: '9',
								color: '#ccc'
							}
						},
						axisLine: {
							lineStyle: {
								color: '#ccc',
								width: 1
							}
						}
					},
					yAxis: {
						type: 'value',
						axisLine: {
							lineStyle: {
								color: '#ccc',
								width: 1
							}
						},
						axisTick: {
							show: false
						},
						axisLabel: {
							show: true,
							textStyle: {
								fontSize: '9',
								color: '#ccc'
							}
						},
						boundaryGap: [0, '100%'],
						spiltLine: {
							show: true
						}
					},
					series: [
						{
							name: '总人数',
							type: 'line',
							smooth: true,
							data: [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6]]
						}
					]
				})
			},
			analysisChartLine () {
				var dom = document.getElementById('analysisChart')
				var myChart = echarts.init(dom)
				myChart.setOption({
					color: '#e98181',
					tooltip: {
						trigger: 'axis',
						position: function (pt) {
							return [pt[0], '10%']
						}
					},
					grid: {
						x: 23,
						y: 10,
						x2: 5,
						y2: 18
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						spiltLine: {
							show: true
						},
						axisTick: {
							show: false
						},
						axisLabel: {
							show: true,
							textStyle: {
								fontSize: '9',
								color: '#ccc'
							}
						},
						axisLine: {
							lineStyle: {
								color: '#ccc',
								width: 1
							}
						},
						data: [1, 2, 3, 4, 5, 6]
					},
					yAxis: {
						type: 'value',
						axisLine: {
							lineStyle: {
								color: '#ccc',
								width: 1
							}
						},
						axisTick: {
							show: false
						},
						axisLabel: {
							show: true,
							textStyle: {
								fontSize: '9',
								color: '#ccc'
							}
						},
						boundaryGap: [0, '100%'],
						spiltLine: {
							show: true
						}
					},
					series: [
						{
							name: '总人数',
							type: 'line',
							smooth: true,
							data: [0, 0, 0, 0, 0, 0]
							/* [[1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0]] */
						}
					]
				})
			},
			getData () {
				this.axios.post(`${this.url}/statistical/comprehensive`)
				.then(function (response) {
					console.log(response)
				})
				.catch(function (error) {
					console.log(error)
				})
			},
			getTime () {
				var today = new Date()
				var h = today.getHours()
				var m = today.getMinutes()
				if (m < 10) {
					m = '0' + m
					return m
				}
				this.time = h + ':' + m
			},
			getDateTime () {
				var date = new Date()
				var year = date.getFullYear()
				var month = date.getMonth() + 1
				var day = date.getDate()
				var weekDay = date.getDay()
				if (weekDay === 0) {
					weekDay = '周日'
				} else if (weekDay === 1) {
					weekDay = '周一'
				} else if (weekDay === 2) {
					weekDay = '周二'
				} else if (weekDay === 3) {
					weekDay = '周三'
				} else if (weekDay === 4) {
					weekDay = '周四'
				} else if (weekDay === 5) {
					weekDay = '周五'
				} else {
					weekDay = '周六'
				}
				this.fulltime = year + '-' + month + '-' + day + ' ' + weekDay
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
#setp{
	position: fixed;
	top: 22px;
	right: 22px;
}
#setd{
	position: fixed;
	top: 22px;
	right: 22px;
}
.monitoring .el-table__header th, .el-table__header tr {
	background-color: transparent !important;
}
.monitoring{
	width: 100%;
	height: 100%;
	position: fixed;
	overflow: hidden;
	background-image: url('../../assets/images/allbg.png');
	background-size: 100% 100%;
}
.monitoring .top{
	width: 100%;
	height: 69px;
	background: #113a68;
	color: #fff;
	border-bottom: 1px solid #0e6fcb;
	box-shadow: 0 -10px 10px #1d4a7f inset;
}
.monitoring .top-left{
	float: left;
	width: 33.33333%;
	height: 69px;
	min-width: 100px;
}
.monitoring .hours{
	float: left;
	margin: 15px 0 0 16px;
	width: 84px;
	font-size: 28px;
	margin-right: 10px;
}
.monitoring .address{
	margin-top: 10px;
	float: left;
	width: 300px;
	height: 26px;
	line-height: 26px;
	font-size: 14px;
	font-weight: bold;
	position: relative;
}
.monitoring .address img{
	float: right;
	position: absolute;
	top: 5px;
	margin-left: 5px;
}
.monitoring .time{
	width: 300px;
	float: left;
	height: 26px;
	line-height: 26px;
	font-size: 14px;
	font-weight: bold;
}
.monitoring .top-center{
	float: left;
	width: 33.33333%;
	min-width: 120px;
	font-size: 24px;
	line-height: 69px;
	height: 69px;
	text-align: center;
}
.monitoring .top-right{
	float: left;
	width: 33.33333%;
	min-width: 100px;
	height: 69px;
	text-align: right;
}
.monitoring #set{
	margin: 22px 22px 0 0;
}
.monitoring .main{
	width: 100vw;
	height: calc(100vh - 85px);
	padding: 15px;
}
.monitoring .main-left{
	float: left;
	width: calc(72.3vw + 29px);
	height: calc(100vh - 100px);
}
.monitoring .main-right{
	float: right;
	padding-left: 13px;
	width: calc(27.7vw - 59px);
	height: calc(100vh - 100px);
}
.monitoring .table-list{
	float: left;
	height: calc(100vh - 85px);
	margin-left: 3px;
	padding: 10px;
	width: 21.375vw;
	background: rgb(15, 64, 117, 0.6) none repeat scroll 0 0;
	overflow: hidden;
	border: 1px solid #0e89fe;
	box-shadow: 1px 1px 15px 1px #3973b7 inset;
}
.monitoring .left-main{
	width: 21.375vw;
	margin-bottom: 15px;
}
.monitoring .content{
	margin-left: 29px;
	width: 72.3vw;
	min-width: 638px;
	height: 56.7vh;
	border: 1px solid #0e89fe;
}
.monitoring .left-charts{
	width: calc(72.3vw + 29px);
	height: calc(43.3vh - 110px);
}
.monitoring .title{
	width: 1.625vw;
	height: 110px;
	border-bottom: 20px solid transparent;
	border-left: medium none;
	border-right: 26px solid #155ca9;
	opacity: 0.5;
	font-size: 12px;
	line-height: 12px;
	font-weight: bold;
	float: left;
}
.monitoring .font{
	width: 12px;
	padding-top: 4px;
	margin-top: 6px;
	margin-left: 6px;
	color: #fff;
	border-top: 4px solid rgb(81, 255, 255);
}
.monitoring .imsi{
	width: 12px;
	padding-top: 4px;
	margin-top: 6px;
	margin-left: 6px;
	color: #fff;
	writing-mode: tb-rl;
	border-top: 4px solid rgb(81, 255, 255);
}
.monitoring .person-traffic{
	float: left;
	width: 24.1vw;
	height: calc(43.3vh - 110px);
}
.monitoring .operator{
	float: left;
	margin-left: 14px;
	width: 24.1vw;
	height: calc(43.3vh - 110px);
}
.monitoring .traffic-analysis{
	float: left;
	margin-left: 14px;
	width: 24.1vw;
	height: calc(43.3vh - 110px);
}
.monitoring .person-chart{
	width: calc((67.425vw - 9px) / 3);
	height: calc(43.3vh - 110px);
	padding: 5px 10px;
	float: left;
	margin-left: 3px;
	border: 1px solid #0e89fe;
	box-shadow: 1px 1px 15px 1px #3973b7 inset;
	min-width: 190px;
}
.monitoring .operator-chart{
	width: calc((67.425vw - 9px) / 3);
	height: calc(43.3vh - 110px);
	padding-top: 10px;
	float: left;
	margin-left: 3px;
	border: 1px solid #0e89fe;
	box-shadow: 1px 1px 15px 1px #3973b7 inset;
	min-width: 190px;
}
.monitoring .analysis-chart{
	width: calc((67.425vw - 9px) / 3);
	height: calc(43.3vh - 110px);
	float: left;
	padding: 5px 10px;
	margin-left: 3px;
	border: 1px solid #0e89fe;
	box-shadow: 1px 1px 15px 1px #3973b7 inset;
	min-width: 190px;
}
#myMap{
	width: 100%;
	height: 100%;
}
.monitoring .dayNumber{
	width: 49%;
	height: 40px;
	padding-left: 10px;
	font-size: 12px;
	line-height: 40px;
	color: #fff;
	background: #082d55;
	float: left;
}
.monitoring .dayNumber span,
.monitoring .realTimeNumber span{
	font-size: 24px;
	color: #74f0f7;
	line-height: 40px;
	margin-left: 8px;
}
.monitoring .realTimeNumber{
	width: 49%;
	float: right;
	line-height: 40px;
	padding-left: 10px;
	font-size: 12px;
	color: #fff;
	height: 40px;
	background: #082d55;
}
.monitoring #trafficChart{
	margin-top: 50px;
	height: 150px;
}
.monitoring #analysisChart{
	height: 100%;
}
.monitoring .flow-right{
	float: right;
	width: 50%;
	height: 100%;
}
.monitoring .flow-right div{
	font-size: 14px;
	height: 27px;
	line-height: 27px;
	color: #fff;
}
.monitoring .line{
	color: #999;
	font-size: 20px;
}
.monitoring .telecom-per{
	color: #51ffff;
	font-size: 20px;
	font-weight: bold;
}
.monitoring .mobile-per{
	color: #fe7a92;
	font-size: 20px;
	font-weight: bold;
}
.monitoring .unicom-per{
	color: #3bacf7;
	font-size: 20px;
	font-weight: bold;
}
.monitoring .per{

}
</style>
