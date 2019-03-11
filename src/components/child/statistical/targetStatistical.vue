<template>
	<div class="target-statistical">
		<div class="statistical-form">
			<form>
				<div class="container">
					<label>卡口选择</label>
					<ComboBox
						inputId="firstSwan"
						v-model="firstSwan"
						:data="firstSwanData"
						:editable="false"
						placeholder="选择/修改">
					</ComboBox>
				</div>
				<div class="container-select">
					<ComboBox inputId=empty :data="emptyData" v-model="empty" v-if="firstSwan === null"></ComboBox>
					<el-select v-model="secondSwan" collapse-tags multiple placeholder=" " v-if="firstSwan === 1">
						<el-option-group
							v-for="group in secondSwanData"
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
					<ComboBox inputId=swan :data="swanData" v-model="swan" v-if="firstSwan === 2"></ComboBox>
					<!-- <el-select v-model="swan" placeholder="请选择" v-if="firstSwan === 2">
						<el-option
							v-for="item in swanData"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select> -->
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
						type="date"
						value-format="timestamp"
						placeholder="选择日期时间">
					</el-date-picker>
				</div>
				<div class="container">
					<label>统计粒度</label>
					<ComboBox inputId="grainSize" v-model="grainSize" :data="grainSizeData"></ComboBox>
				</div>
				<div class="container">
					<el-button type="success" plain @click="statistical">统计</el-button>
				</div>
			</form>
		</div>
		<div class="statistical-chart">
			<div id="personType" ref="personType"></div>
		</div>
		<div class="resident">
			<div id="resident-container" ref="resident"></div>
		</div>
		<div class="flow">
			<div id="flow-container" ref="flow"></div>
		</div>
	</div>
</template>

<script>
	import echarts from 'echarts'
	import compare from '@/assets/js/compare'
	export default{
		name: 'targetStatistical',
		data () {
			return {
				starttime: new Date('2014-04-28 00:00:00').getTime(),
				endtime: new Date('2014-05-04 00:00:00').getTime(),
				firstSwan: null,
				secondSwan: [],
				swan: 1,
				empty: null,
				grainSize: 1,
				population: [],
				resident: [],
				date1: [],
				date2: [],
				migrant: [],
				emptyData: [],
				residents: null,
				residentChart: null,
				flow: null,
				flowChart: null,
				dom: null,
				myChart: null,
				swanData: [
					{value: 1, text: '测试区域'}
				],
				secondSwanData: [
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
				firstSwanData: [
					{value: 1, text: '卡口'},
					{value: 2, text: '区域'}
				],
				grainSizeData: [
					{value: 1, text: '24小时'}
				]
			}
		},
		computed: {
			url () {
				return this.$store.state.url
			}
		},
		mounted () {
			this.residentLine()
			this.flowLine()
			this.personTypePie()
		},
		methods: {
			reset () {
				Object.assign(this.$data, this.$options.data())
			},
			destroy () {
				this.$destroy()
			},
			getgrain () {
				var time = 24 * 60 * 60 * 1000
				return time
			},
			getSwan () {
				if (this.firstSwan === null) {
					return ''
				} else if (this.firstSwan === 1) {
					return this.secondSwan
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
			residentLine () {
				this.residents = this.$refs.resident
				this.residentChart = echarts.init(this.residents)
				this.residentChart.setOption({
					color: '#b6b4b6',
					tooltip: {
						trigger: 'axis',
						position: function (pt) {
							return [pt[0], '10%']
						}
					},
					title: {
						left: 'center',
						text: '常驻人群'
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
						bottom: '80' /* 标题与图的距离 */
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
							}
						}
					},
					yAxis: {
						type: 'value',
						name: '次数',
						axisLine: {
							lineStyle: {
								color: '#4488bb',
								width: 2
							}
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
							smooth: true
							/* data: [[5, 1], [10, 2], [15, 3], [48, 4], [20, 5], [25, 6]] */
						}
					]
				})
			},
			flowLine () {
				this.flow = this.$refs.flow
				this.flowChart = echarts.init(this.flow)
				this.flowChart.setOption({
					color: '#b6b4b6',
					tooltip: {
						trigger: 'axis',
						position: function (pt) {
							return [pt[0], '10%']
						}
					},
					title: {
						left: 'center',
						text: '流动人群'
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
							}
						}
						/* data: [5, 10, 30, 50, 60, 80] */
					},
					yAxis: {
						type: 'value',
						name: '次数',
						axisLine: {
							lineStyle: {
								color: '#4488bb',
								width: 2
							}
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
						/* data: [1, 2, 3, 4, 5, 6] */
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
							smooth: true
						}
					]
				})
			},
			personTypePie () {
				this.dom = this.$refs.personType
				this.myChart = echarts.init(this.dom)
				this.myChart.setOption({
					title: {
						left: 'center',
						text: '人口类型占比'
					},
					/* tooltip: {
						show: true,
						trigger: 'axis',
						position: function (pt) {
							return [pt[0], '10%']
						}
					}, */
					tooltip: {
						show: true,
						feature: {
							restore: {
								show: true
							}
						}
					},
					grid: {
						top: 'center'
					},
					series: [
						{
							name: '人口类型占比',
							type: 'pie',
							radius: '55%'
							/* data: [
								{value: 447, name: '常驻人口'},
								{value: 339, name: '流动人口'}
							] */
						}
					]
				})
			},
			statistical () {
				console.log(this.starttime)
				console.log(this.endtime)
				var that = this
				if (this.firstSwan === null || this.firstSwan === '') {
					this.$alert('请选择卡口!', '提示', {
						confirmButtonText: '确定',
						callback: action => {
							this.$message({
								type: 'info',
								message: 'action:' + action
							})
						}
					})
				} else if (this.firstSwan === 1 && this.secondSwan.length === 0) {
					this.$alert('请选择卡口!', '提示', {
						confirmButtonText: '确定',
						callback: action => {
							this.$message({
								type: 'info',
								message: 'action:' + action
							})
						}
					})
				} else if (this.starttime === null) {
					this.$notify({
						title: '提示',
						message: '开始时间不能为空！',
						position: 'bottom-right',
						duration: 2000
					})
				} else if (this.endtime === null) {
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
					that.residentChart.showLoading({
						text: 'loading',
						color: 'green',
						textColor: '#333',
						maskColor: 'rgba(255, 255, 255, 0.6)',
						zlevel: 0
					})
					that.flowChart.showLoading()
					that.myChart.showLoading()
					this.axios.post(`${this.url}/statistical/crowd`, {
						swanList: this.getSwan(),
						starttime: this.starttime,
						endtime: this.endtime,
						grain: this.getgrain()
					})
					.then(function (response) {
						that.resident = []
						that.population = []
						that.date1 = []
						that.date2 = []
						that.migrant = []
						// Pie人口类型占比
						var population = response.data.population_type
						// line常驻人口
						var resident = response.data.resident_population
						// line流动人口
						var migrant = response.data.migrant_population
						Object.keys(resident).forEach(function (key) {
							let mydate1 = that.getMydate(resident[key].time)
							that.date1.push(mydate1)
							that.resident.push(resident[key].count)
						})
						Object.keys(migrant).forEach(function (key) {
							let mydate2 = that.getMydate(migrant[key].time)
							that.date2.push(mydate2)
							that.migrant.push(migrant[key].count)
						})
						// line流动人口
						that.flowChart.hideLoading()
						that.flowChart.setOption({
							color: '#496f8c',
							tooltip: {
								trigger: 'axis',
								position: function (pt) {
									return [pt[0], '10%']
								}
							},
							title: {
								left: 'center',
								text: '流动人群'
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
									interval: 2
								},
								data: that.date2
							},
							yAxis: {
								type: 'value',
								name: '次数',
								axisLine: {
									lineStyle: {
										color: '#4488bb',
										width: 2
									}
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
								/* data: [1, 2, 3, 4, 5, 6] */
							},
							dataZoom: [
								{
									type: 'slider',
									xAxisIndex: 0,
									filterMode: 'filter',
									backgroundColor: '#fff',
									fillerColor: '#e9f4fc',
									borderColor: '#4488bb',
									realtime: true
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
									symbolSize: 10,
									smooth: true,
									data: that.resident
								}
							]
						})
						// line常驻人口
						that.residentChart.hideLoading()
						that.residentChart.setOption({
							color: '#496f8c',
							tooltip: {
								trigger: 'axis',
								position: function (pt) {
									return [pt[0], '10%']
								}
							},
							title: {
								left: 'center',
								text: '常驻人群'
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
								bottom: '80' /* 标题与图的距离 */
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
									}
								},
								data: that.date1
							},
							yAxis: {
								type: 'value',
								name: '次数',
								axisLine: {
									lineStyle: {
										color: '#4488bb',
										width: 2
									}
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
									borderColor: '#4488bb',
									realtime: true
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
									symbolSize: 10,
									smooth: true,
									data: that.resident
								}
							]
						})
						// Pie人口类型占比
						for (let i = 0; i < population.length; i++) {
							that.population.push({
								value: population[i].value,
								name: population[i].label
							})
						}
						that.myChart.hideLoading()
						that.myChart.setOption({
							title: {
								left: 'center',
								text: '人口类型占比'
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
								top: 'center'
							},
							series: [
								{
									name: '人口类型占比',
									type: 'pie',
									radius: '55%',
									data: that.population
								}
							]
						})
					})
					.catch(function (error) {
						that.flowChart.hideLoading()
						that.residentChart.hideLoading()
						that.myChart.hideLoading()
						console.log(error)
					})
				}
			},
			formatText (value) {
				if (this.value && this.value.length > 3) {
					return this.value.length + ' items selected'
				}
				return value
			}
		}
	}
</script>

<style>
	.target-statistical .statistical-form{
		width: 21%;
		height: 355px;
		padding-top: 41px;
		float: left;
		margin-right: 1%;
		border: 1px solid #ddd;
	}
	.target-statistical .statistical-chart{
		width: 78%;
		height: 355px;
		padding: 10px 0;
		float: left;
		border: 1px solid #ddd;
	}
	.target-statistical .container{
		width: 100%;
		height: 46px;
	}
	.target-statistical .container-select{
		margin-left: 94px;
		width: 100%;
		height: 46px;
	}
	.target-statistical label{
		display: inline-block;
		padding-left: 28px;
		width: 80px;
		height: 30px;
		line-height: 30px;
		margin-right: 10px;
	}
	.target-statistical #imsi{
		border: 1px solid #ddd;
		border-radius: 5px;
		width: 171px;
		height: 30px;
		padding: 5px 4px;
	}
	.target-statistical .resident{
		width: 49%;
		margin-right: 1%;
		margin-top: 10px;
		height: 309px;
		float: left;
		border: 1px solid #ddd;
	}
	.target-statistical .flow{
		width: 50%;
		height: 309px;
		float: left;
		margin-top: 10px;
		border: 1px solid #ddd;
	}
	.target-statistical #resident-container{
		margin-top: 15px;
		height: 97%;
		width: 100%;
	}
	.target-statistical #flow-container{
		margin-top: 15px;
		height: 97%;
		width: 100%;
	}
	.target-statistical #personType{
		height: 97%;
		width: 100%;
	}
</style>
