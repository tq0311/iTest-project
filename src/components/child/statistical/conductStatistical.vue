<template>
	<div class="conduct-statistical">
		<div class="statistical-form">
			<form>
				<div class="container">
					<label>IMSI</label>
					<input id="imsi" v-model="imsi" type="text" name="">
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
					<el-button type="success" plain @click="statistical">统计</el-button>
				</div>
			</form>
		</div>
		<div class="statistical-chart">
			<div id="conductChart" ref="conduct" style="height: 100%"></div>
		</div>
	</div>
</template>

<script>
	import echarts from 'echarts'
	import compare from '@/assets/js/compare'
	export default{
		name: 'conductStatistical',
		data () {
			return {
				imsi: '',
				starttime: new Date('2014-04-28 00:00:00').getTime(),
				endtime: new Date('2014-04-30 00:00:00').getTime(),
				arr: [],
				dom: null,
				myChart: null
			}
		},
		computed: {
			url () {
				return this.$store.state.url
			}
		},
		mounted () {
			this.conductChartPie()
		},
		methods: {
			reset () {
				Object.assign(this.$data, this.$options.data())
			},
			destroy () {
				this.$destroy()
			},
			conductChartPie () {
				/* var dom = document.getElementById('conductChart') */
				this.dom = this.$refs.conduct
				this.myChart = echarts.init(this.dom)
				/* myChart.clear() */
				this.myChart.setOption({
					title: {
						left: 'center',
						text: '目标行为统计'
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
							name: '目标行为统计',
							type: 'pie',
							radius: '55%',
							data: []
						}
					]
				})
			},
			statistical () {
				var that = this
				if (that.imsi === null || that.imsi === '') {
					that.$alert('请输入IMSI!', '提示', {
						confirmButtonText: '确定',
						callback: action => {
							that.$message({
								type: 'info',
								message: 'action:' + action
							})
						}
					})
				} else if (that.starttime === null) {
					that.$notify({
						title: '提示',
						message: '开始时间不能为空！',
						position: 'bottom-right',
						duration: 2000
					})
				} else if (that.endtime === null) {
					that.$notify({
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
					that.myChart.showLoading()
					this.axios.post(`${this.url}/statistical/behaviors`, {
						imsi: this.imsi,
						starttime: this.starttime,
						endtime: this.endtime
					})
					.then(function (response) {
						var r = response.data.res
						that.arr = []
						r.forEach(item => {
							that.arr.push({
								name: item.eventtype,
								value: item.count
							})
						})
						// 获取饼图数据
						var option = ({
							title: {
								left: 'center',
								text: '目标行为统计'
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
									name: '目标行为统计',
									type: 'pie',
									radius: '55%',
									data: that.arr
								}
							]
						})
						that.myChart.hideLoading()
						that.myChart.setOption(option)
					})
					.catch(function (error) {
						that.myChart.hideLoading()
						console.log(error)
					})
				}
			}
		}
	}
</script>

<style>
	.conduct-statistical .statistical-form{
		width: 21%;
		height: 286px;
		padding-top: 41px;
		float: left;
		margin-right: 1%;
		border: 1px solid #ddd;
	}
	.conduct-statistical .statistical-chart{
		width: 78%;
		height: 287px;
		padding: 10px 0;
		float: left;
		border: 1px solid #ddd;
	}
	.conduct-statistical .container{
		width: 100%;
		height: 46px;
	}
	.conduct-statistical label{
		display: inline-block;
		padding-left: 28px;
		width: 80px;
		height: 30px;
		line-height: 30px;
		margin-right: 10px;
	}
	.conduct-statistical #imsi{
		border: 1px solid #ddd;
		border-radius: 5px;
		width: 171px;
		height: 30px;
		padding: 5px 4px;
	}
	.conduct-statistical #conductChart{
		width: 100%;
		height: 100%;
	}
</style>
