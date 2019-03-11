<template>
	<div class="traffic-statistical">
		<div class="statistical-form">
			<form>
				<div class="container">
					<label>热点选择</label>
					<ComboBox inputId="firstHot" v-model="firstHot" :data="firstHotData" :editable="false" placeholder="选择/修改"></ComboBox>
				</div>
				<div class="container-select">
					<!-- <ComboTree
						inputId="secondHot"
						:data="secondHotData"
						:multiple="true"
						:textFormatter="formatText"
						v-model="secondHot"
						:editable="false">
						<Tree slot="tree" @checkChange="checkChange"></Tree>
					</ComboTree> -->
					<ComboBox inputId=empty :data="emptyData" v-model="empty" v-if="firstHot === null"></ComboBox>
					<el-select v-model="secondHot" multiple collapse-tags placeholder=" " v-if="firstHot === 1">
						<el-option-group
							v-for="group in secondHotData"
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
					<ComboBox inputId=swan :data="swanData" v-model="swan" v-if="firstHot === 2"></ComboBox>
				</div>
				<div class="container">
					<label>开始时间</label>
					<el-date-picker
						v-model="starttime"
						type="date"
						value-format="timestamp"
						placeholder="选择日期时间">
					</el-date-picker>
				</div>
				<div class="container">
					<label>结束时间</label>
					<el-date-picker
						v-model="endtime"
						value-format="timestamp"
						type="date"
						placeholder="选择日期时间">>
					</el-date-picker>
				</div>
				<div class="container">
					<label>统计粒度</label>
					<ComboBox inputId="grainSize" v-model="grainSize" :data="grainSizeData" placeholder="选择/修改"></ComboBox>
				</div>
				<div class="container">
					<el-button type="success" plain @click="statistical">统计</el-button>
				</div>
			</form>
		</div>
		<div class="statistical-chart">
			<div id="personTraffic"></div>
		</div>
		<div class="area">
			<div id="areaChart"></div>
		</div>
		<div class="operator">
			<div id="operatorChart"></div>
		</div>
	</div>
</template>

<script>
	import echarts from 'echarts'
	import compare from '@/assets/js/compare'
	export default{
		name: 'trafficStatistical',
		data () {
			return {
				starttime: new Date('2014-04-28 00:00:00').getTime(),
				endtime: new Date('2014-05-04 00:00:00').getTime(),
				firstHot: null,
				secondHot: [],
				swan: 1,
				grainSize: 1,
				empty: null,
				secondHotData: [
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
				swanData: [
					{value: 1, text: '测试区域'}
				],
				emptyData: [],
				firstHotData: [
					{value: 1, text: '卡口'},
					{value: 2, text: '区域'}
				],
				grainSizeData: [
					{value: 1, text: '24小时'}
				],
				date: [],
				population: [],
				operator: [],
				belong: [],
				personTraffic: null,
				populationChart: null,
				area: null,
				areaChart: null,
				operatorPie: null,
				operatorChart: null
			}
		},
		computed: {
			url () {
				return this.$store.state.url
			}
		},
		mounted () {
			this.personTrafficline()
			this.areaChartPie()
			this.operatorChartPie()
		},
		methods: {
			getSwan () {
				if (this.firstHot === null) {
					return ''
				} else if (this.firstHot === 1) {
					return this.secondHot
				} else {
					return [String(this.swan)]
				}
			},
			getMydate (time) {
				var t = new Date(time)
				var y = t.getFullYear()
				var m = t.getMonth() + 1
				var d = t.getDate()
				return y + '/' + m + '/' + d
			},
			getgrainSizeData () {
				var time = 24 * 60 * 60 * 1000
				return time
			},
			personTrafficline () {
				this.personTraffic = document.getElementById('personTraffic')
				this.populationChart = echarts.init(this.personTraffic)
				this.populationChart.setOption({
					color: '#b6b4b6',
					tooltip: {
						trigger: 'axis',
						position: function (pt) {
							return [pt[0], '10%']
						}
					},
					title: {
						left: 'center',
						text: '目标人流量统计'
					},
					toolbox: {
						feature: {
							dataZoom: {
								yAxisIndex: 'none'
							},
							restore: {},
							saveAsImage: {}
						}
					},
					grid: {
						bottom: '80' /* 标题与柱状图的距离 */
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						spiltLine: {
							show: true
						},
						axisLine: {
							lineStyle: {
								color: '#4488bb',
								width: 2
							},
							onZero: false
						}
					},
					yAxis: {
						type: 'value',
						name: '次数',
						axisLine: {
							lineStyle: {
								color: '#4488bb',
								width: 2
							},
						onZero: false
						},
						axisTick: {
							show: false
						},
						axisLabel: {
							formatter: '{value}次'
						},
						boundaryGap: [0, '100%'],
						spiltLine: {
							show: true
						}
					},
					dataZoom: [
						{
							type: 'slider',
							xAxisIndex: 0,
							filterMode: 'filter',
							backgroundColor: '#fff',
							fillerColor: '#e9f4fc',
							borderColor: '#4488bb'
						},
						{
							type: 'inside',
							yAxisIndex: 0,
							filterMode: 'filter'
						}
					],
					series: [
						{
							name: '总人数',
							type: 'line',
							smooth: true,
							data: []
						}
					]
				})
			},
			areaChartPie () {
				this.area = document.getElementById('areaChart')
				this.areaChart = echarts.init(this.area)
				this.areaChart.setOption({
					title: {
						left: 'center',
						text: '归属地统计'
					},
					tooltip: {
						show: true,
						feature: {
							restore: {
								show: true
							}
						}
					},
					grid: {
						top: 'center' /* 标题与图的距离 */
					},
					series: [
						{
							name: '归属地统计',
							type: 'pie',
							radius: '55%',
							data: []
						}
					]
				})
			},
			operatorChartPie () {
				this.operatorPie = document.getElementById('operatorChart')
				this.operatorChart = echarts.init(this.operatorPie)
				this.operatorChart.setOption({
					title: {
						left: 'center',
						text: '运营商统计'
					},
					tooltip: {
						show: true,
						feature: {
							restore: {
								show: true
							}
						}
					},
					grid: {
						top: 'center' /* 标题与图的距离 */
					},
					series: [
						{
							name: '运营商统计',
							type: 'pie',
							radius: '55%',
							data: []
						}
					]
				})
			},
			formatText (value) {
				if (this.value && this.value.length > 3) {
					return this.value.length + ' items selected'
				}
				return value
			},
			getgrain () {
				var time = 24 * 60 * 60 * 1000
				return time
			},
			statistical () {
				var that = this
				if (that.firstHot === null || that.firstHot === '') {
					this.$alert('请选择卡口!', '提示', {
						confirmButtonText: '确定',
						callback: action => {
							this.$message({
								type: 'info',
								message: 'action:' + action
							})
						}
					})
				} else if (that.firstHot === 1 && that.secondHot.length === 0) {
					this.$alert('请选择卡口!', '提示', {
						confirmButtonText: '确定',
						callback: action => {
							this.$message({
								type: 'info',
								message: 'action:' + action
							})
						}
					})
				} else if (that.starttime === null) {
					this.$notify({
						title: '提示',
						message: '开始时间不能为空！',
						position: 'bottom-right',
						duration: 2000
					})
				} else if (that.endtime === null) {
					this.$notify({
						title: '提示',
						message: '结束时间不能为空！',
						position: 'bottom-right',
						duration: 2000
					})
				} else if (compare(that.starttime, that.endtime) === false) {
					that.$notify({
						title: '提示',
						message: '结束时间不能超过开始时间！',
						position: 'bottom-right',
						duration: 3000
					})
				} else if (compare(that.starttime, that.endtime) === true) {
					that.$notify({
						title: '提示',
						message: '查询时间范围为至少查一天，最多查一周！',
						position: 'bottom-right',
						duration: 4000
					})
				} else {
					that.populationChart.showLoading()
					that.areaChart.showLoading()
					that.operatorChart.showLoading()
					this.axios.post(`${this.url}/statistical/targetflow`, {
						swanList: this.getSwan(),
						starttime: this.starttime,
						endtime: this.endtime,
						grain: this.getgrain()
					})
					.then(function (response) {
						that.populationChart.hideLoading()
						that.areaChart.hideLoading()
						that.operatorChart.hideLoading()
						// line目标人流量统计
						that.date = []
						that.population = []
						var population = response.data.population_flow
						Object.keys(population).forEach(function (key) {
							let mydate = that.getMydate(population[key].time)
							that.date.push(mydate)
							that.population.push(population[key].count)
						})
						that.populationChart.setOption({
							color: '#b6b4b6',
							tooltip: {
								trigger: 'axis',
								position: function (pt) {
									return [pt[0], '10%']
								}
							},
							title: {
								left: 'center',
								text: '目标人流量统计'
							},
							toolbox: {
								feature: {
									dataZoom: {
										yAxisIndex: 'none'
									},
									restore: {},
									saveAsImage: {}
								}
							},
							grid: {
								bottom: '80'
							},
							xAxis: {
								type: 'category',
								boundaryGap: false,
								spiltLine: {
									show: true
								},
								axisLine: {
									lineStyle: {
										color: '#4488bb',
										width: 2
									},
									onZero: false
								},
								data: that.date
							},
							yAxis: {
								type: 'value',
								name: '次数',
								axisLine: {
									lineStyle: {
										color: '#4488bb',
										width: 2
									},
								onZero: false
								},
								axisTick: {
									show: false
								},
								axisLabel: {
									formatter: '{value}次'
								},
								boundaryGap: [0, '100%'],
								spiltLine: {
									show: true
								}
							},
							dataZoom: [
								{
									type: 'slider',
									xAxisIndex: 0,
									filterMode: 'filter',
									backgroundColor: '#fff',
									fillerColor: '#e9f4fc',
									borderColor: '#4488bb'
								},
								{
									type: 'inside',
									yAxisIndex: 0,
									filterMode: 'filter'
								}
							],
							series: [
								{
									name: '总人数',
									type: 'line',
									smooth: true,
									symbolSize: 10,
									data: that.population
								}
							]
						})
						// Pie运营商统计
						that.operator = []
						var operator1 = response.data.operator
						for (let i = 0; i < operator1.length; i++) {
							that.operator.push({
								value: operator1[i].count,
								name: operator1[i].operator
							})
						}
						that.operatorChart.setOption({
							title: {
								left: 'center',
								text: '运营商统计'
							},
							tooltip: {
								show: true,
								feature: {
									restore: {
										show: true
									}
								}
							},
							grid: {
								top: 'center' /* 标题与图的距离 */
							},
							series: [
								{
									name: '运营商统计',
									type: 'pie',
									radius: '55%',
									symbolSize: 10,
									data: that.operator
								}
							]
						})
						// Pie归属地统计
						that.belong = []
						var belong1 = response.data.belong
						for (let i = 0; i < belong1.length; i++) {
							that.belong.push({
								value: belong1[i].count,
								name: belong1[i].belong
							})
						}
						that.areaChart.setOption({
							title: {
								left: 'center',
								text: '归属地统计'
							},
							tooltip: {
								show: true,
								feature: {
									restore: {
										show: true
									}
								}
							},
							grid: {
								top: 'center' /* 标题与图的距离 */
							},
							series: [
								{
									name: '归属地统计',
									type: 'pie',
									radius: '55%',
									data: that.belong
								}
							]
						})
					})
					.catch(function (error) {
						that.populationChart.hideLoading()
						that.areaChart.hideLoading()
						that.operatorChart.hideLoading()
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
		}
	}
</script>

<style>
	.traffic-statistical .statistical-form{
		width: 21%;
		height: 355px;
		padding-top: 41px;
		float: left;
		margin-right: 1%;
		border: 1px solid #ddd;
	}
	.traffic-statistical .statistical-chart{
		width: 78%;
		height: 355px;
		padding: 10px 0;
		float: left;
		border: 1px solid #ddd;
	}
	.traffic-statistical #personTraffic{
		width: 100%;
		height: 100%;
	}
	.traffic-statistical .container{
		width: 100%;
		height: 46px;
	}
	.traffic-statistical .container-select{
		width: 100%;
		height: 46px;
		margin-left: 94px;
	}
	.traffic-statistical label{
		display: inline-block;
		padding-left: 28px;
		width: 80px;
		height: 30px;
		line-height: 30px;
		margin-right: 10px;
	}
	.traffic-statistical #imsi{
		border: 1px solid #ddd;
		border-radius: 5px;
		width: 171px;
		height: 30px;
		padding: 5px 4px;
	}
	.traffic-statistical .area{
		width: 49%;
		margin-right: 1%;
		margin-top: 10px;
		height: 309px;
		float: left;
		border: 1px solid #ddd;
	}
	.traffic-statistical #areaChart{
		width: 100%;
		height: 97%;
		margin-top: 15px;
	}
	.traffic-statistical .operator{
		width: 50%;
		height: 309px;
		float: left;
		margin-top: 10px;
		border: 1px solid #ddd;
	}
	.traffic-statistical #operatorChart{
		width: 100%;
		height: 97%;
		margin-top: 15px;
	}
</style>
