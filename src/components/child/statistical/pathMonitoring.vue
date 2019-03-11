<template>
	<div class="path-monitoring">
		<div class="condition">
			<el-collapse v-model="activeNames" @change="handleChange">
				<el-collapse-item title="轨迹监控条件" name="1">
					<div class="search">
						<div class="text">
							<span>手机卡码&nbsp;(IMSI)</span>
							<el-tooltip :disabled="disabled" content="输入内容必须为15位有效IMSI号码" placement="right" effect="light">
								<TextBox inputId="imsi" v-model="imsi" class="add"></TextBox>
							</el-tooltip>
						</div>
						<div class="btn-container">
							<el-button type="success" id="stop" plain @click="stop">停止监控</el-button>
							<el-button type="success" id="start" plain @click="start">启动监控</el-button>
						</div>
					</div>
				</el-collapse-item>
			</el-collapse>
		</div>
		<div id="content">
		</div>
	</div>
</template>
<script>
	import BMap from 'BMap'
	export default{
		name: 'pathMonitoring',
		data () {
			return {
				disabled: false,
				imsi: '',
				activeNames: '1',
				pois: [],
				map: null,
				points: [],
				timer: null,
				markerpoi: []
			}
		},
		computed: {
			url () {
				return this.$store.state.url
			}
		},
		methods: {
			reset () {
				Object.assign(this.$data, this.$options.data())
			},
			destroy () {
				this.$destroy()
				clearInterval(this.timer)
			},
			handleChange(val) {
				console.log(val)
			},
			start () {
				if (this.imsi === null || this.imsi === '') {
					this.$notify({
						title: '提示',
						message: '手机卡码(IMSI)不能为空！',
						position: 'bottom-right',
						duration: 2000
					})
				} else if (this.imsi.length !== 15) {
					this.$notify({
						title: '提示',
						message: '非法IMSI,请输入15位的数字！',
						position: 'bottom-right',
						duration: 2000
					})
				} else {
					setTimeout(() => {
						document.getElementById('start').style.display = 'none'
						document.getElementById('stop').style.display = 'block'
					}, 200)
					var that = this
					// 创建实例
					that.map = new BMap.Map('content')
					// 创建坐标点
					var point = new BMap.Point(118.80, 32.06)
					// 初始化实例，传入坐标点并设置地图级别
					that.map.centerAndZoom(point, 12)
					that.map.enableScrollWheelZoom(true) // 鼠标滚动
					var overView = new BMap.OverviewMapControl()
					/* global BMAP_ANCHOR_BOTTOM_RIGHT */
					var overViewOpen = new BMap.OverviewMapControl({
						isOpen: true,
						anchor: BMAP_ANCHOR_BOTTOM_RIGHT
					})
					that.map.addControl(overView) // 添加默认缩略地图控件
					that.map.addControl(overViewOpen)
					// 定时器
					that.timer = setInterval(() => {
						this.axios.post(`${this.url}/statistical/trajectory`, {
							imsi: this.imsi
						})
						.then(function (response) {
							var r = response.data.res
							if (response.data.stat) {
								var datainfo = []
								datainfo.push([
									Number(r.lon),
									Number(r.lat),
									`位置：(${r.lon}, ${r.lat})`
								])
								var opts = {
									width: 200, // 信息窗口宽度
									height: 80, // 信息窗口高度
									title: '信息', // 信息窗口标题
									enableMessage: true // 设置允许信息窗发送短息
								}
								var pois = []
								var myIcon = new BMap.Icon('../../../static/market.png', new BMap.Size(30, 30))
								for (let i = 0; i < datainfo.length; i++) {
									pois.push(new BMap.Point(datainfo[i][0], datainfo[i][1]))
									var marker = new BMap.Marker(new BMap.Point(datainfo[i][0], datainfo[i][1]), {icon: myIcon}) // 创建标注
									var content = datainfo[i][2]
									that.map.addOverlay(marker)
								}
								var center = new BMap.Point(datainfo[0][0], datainfo[0][1])
								that.map.centerAndZoom(center, 18)
								marker.addEventListener('click', function (e) {
									var p = e.target
									var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat)
									var infoWindow = new BMap.InfoWindow(content, opts) // 创建信息窗口对象
									that.map.openInfoWindow(infoWindow, point) // 开启信息窗口
								})
							}
						})
						.catch(function (error) {
							console.log(error)
						})
					}, 5000)
				}
			},
			stop () {
				setTimeout(() => {
					document.getElementById('start').style.display = 'block'
					document.getElementById('stop').style.display = 'none'
				}, 200)
				clearInterval(this.timer)
			}
		},
		mounted () {
			// 创建实例
			var map = new BMap.Map('content')
			// 创建坐标点
			var point = new BMap.Point(118.80, 32.06)
			// 初始化实例，传入坐标点并设置地图级别
			map.centerAndZoom(point, 12)
			map.enableScrollWheelZoom(true) // 鼠标滚动
			var overView = new BMap.OverviewMapControl()
			/* global BMAP_ANCHOR_BOTTOM_RIGHT */
			var overViewOpen = new BMap.OverviewMapControl({
				isOpen: true,
				anchor: BMAP_ANCHOR_BOTTOM_RIGHT
			})
			map.addControl(overView) // 添加默认缩略地图控件
			map.addControl(overViewOpen)
		},
		beforeDestroy () {
			clearInterval(this.timer)
		}
	}
</script>

<style>
	*{
		font-size: 12px;
	}
	.path-monitoring{
		position: relative;
	}
	.path-monitoring .card-content{
		width: 100%;
		border: 1px solid #b6b4b6;
		height: 66px;
		padding: 1px;
	}
	.path-monitoring .f-field{
		width: 300px;
		height: 32px;
		padding: 5px;
		border: 1px solid #ffa8a8;
		border-radius: 5px;
		line-height: 32px;
	}
	.path-monitoring .condition{
		width: calc(87.5vw - 20px);
		position: fixed;
		z-index: 2000;
	}
	.path-monitoring #content{
		position: absolute;
		border-left: 1px solid #b6b4b6;
		border-right: 1px solid #b6b4b6;
		border-bottom: 1px solid #b6b4b6;
		width: 100%;
		height: calc(100vh - 110px);
	}
	.path-monitoring .search{
		height: 32px;
		margin: 10px 0 4px 50px;
		position: relative;
	}
	.path-monitoring .bubbles{
		display: none;
		position: absolute;
		top: 2px;
		left: 400px;
		width: 115px;
		/* background: url('@/assets/images/bubbles.png') no-repeat; */
		line-height: 26px;
		padding-left: 10px;
	}
	.bubbles-foucs{
		display: none;
		position: absolute;
		top: 2px;
		left: 400px;
		width: 220px;
		/* background: url('@/assets/images/bubbles_foucs.png') no-repeat; */
		line-height: 26px;
		padding-left: 10px;
	}
	.path-monitoring .btn-container{
		position: relative;
		float: left;
		padding-top: 3px;
		padding-left: 5px
	}
	.path-monitoring .text{
		float: left;
	}
	.path-monitoring .txt{
		font-size: 12px;
		border-color: green;
	}
	.path-monitoring .add{
		border: 1px solid #ffa8a8;
	}
</style>
