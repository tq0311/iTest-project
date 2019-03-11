<template>
	<div class="path-analysis">
		<div class="condition">
			<el-collapse v-model="condition" @change="handleChange">
				<el-collapse-item title="轨迹跟踪条件" name="1">
					<table class="tab">
						<tbody>
							<td style="width: 50px; text-align: right;">采集时间</td>
							<td class="time" style="width: 330px; padding-left: 5px;">
								<el-date-picker
									v-model="starttime"
									type="date"
									value-format="timestamp"
									placeholder="选择日期时间">
								</el-date-picker>
								<span class="to">至</span>
								<el-date-picker
									v-model="endtime"
									type="date"
									value-format="timestamp"
									placeholder="选择日期时间">
								</el-date-picker>
							</td>
							<td style="width=95px; text-align: right;">手机卡码&nbsp;(IMSI)</td>
							<td>
								<TextBox inputId="imsi" v-model="imsi" placeholder="手机卡码(IMSI)"></TextBox>
							</td>
							<td>
								<el-button type="success" plain @click="search">查询</el-button>
								<el-button type="success" plain>伴随</el-button>
							</td>
						</tbody>
					</table>
				</el-collapse-item>
			</el-collapse>
			<div class="container">
				<el-collapse v-model="result" @change="handleChange">
					<el-collapse-item title="伴随分析结果" name="1">
						<pathAnalysisResult :tableData="tableData" id="float"></pathAnalysisResult>
					</el-collapse-item>
				</el-collapse>
			</div>
		</div>
		<div id="allmap">
		</div>
	</div>
</template>
<script>
	import pathAnalysisResult from './pathAnalysisResult'
	import BMap from 'BMap'
	export default{
		name: 'pathAnalysis',
		data () {
			return {
				starttime: new Date().getTime() - 157680000000,
				endtime: new Date().getTime(),
				imsi: null,
				condition: ['1'],
				result: ['2'],
				tableData: [],
				pois: []
			}
		},
		components: {
			pathAnalysisResult
		},
		mounted () {
			// 创建实例
			var map = new BMap.Map('allmap')
			// 创建坐标点
			var point = new BMap.Point(118.80, 32.06)
			// 初始化实例，传入坐标点并设置地图级别
			map.centerAndZoom(point, 12)
			map.enableScrollWheelZoom(true) // 缩放地图
			var overView = new BMap.OverviewMapControl()
			/* global BMAP_ANCHOR_BOTTOM_RIGHT */
			var overViewOpen = new BMap.OverviewMapControl({isOpen: true, anchor: BMAP_ANCHOR_BOTTOM_RIGHT})
			map.addControl(overView) // 添加默认缩略地图控件
			map.addControl(overViewOpen) // 打开小地图
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
			},
			handleChange (val) {
			},
			compare (prop) {
				return function (obj1, obj2) {
					var val1 = obj1[prop]
					var val2 = obj2[prop]
					if (val1 < val2) {
						return -1
					} else if (val1 > val2) {
						return 1
					} else {
						return 0
					}
				}
			},
			search () {
				var that = this
				that.tableData = []
				if (that.starttime === null) {
					that.$notify({
						title: '提示',
						message: '请选择采集开始时间',
						position: 'bottom-right',
						duration: 2000
					})
				} else if (that.endtime === null) {
					that.$notify({
						title: '提示',
						message: '请选择采集结束时间',
						position: 'bottom-right',
						duration: 2000
					})
				} else if (that.imsi === null || that.imsi === '') {
					that.$notify({
						title: '提示',
						message: '请输入IMSI号',
						position: 'bottom-right',
						duration: 2000
					})
				} else if (that.imsi.length !== 15) {
					that.$notify({
						title: '提示',
						message: '非法IMSI,请输入15位有效数字',
						position: 'bottom-right',
						duration: 2000
					})
				} else {
					const loading = that.$loading({
						target: document.querySelector('#float'),
						lock: true,
						text: '正在加载...',
						spinner: 'el-icon-loading',
						background: 'rgba(255, 255, 255, 0.5)'
					})
					this.axios.post(`${this.url}/analysis/trajectory`, {
						imsi: this.imsi,
						starttime: this.starttime,
						endtime: this.endtime
					})
					.then(function (response) {
						loading.close()
						that.tableData = response.data.res
						that.tableData.sort(that.compare('timestamp'))
						if (response.data.res.length !== 0) {
							var r = response.data.res
							// 创建实例
							var map = new BMap.Map('allmap')
							// 创建坐标点
							var point = new BMap.Point(118.80, 32.06)
							// 初始化实例，传入坐标点并设置地图级别
							map.centerAndZoom(point, 12)
							map.enableScrollWheelZoom(true) // 缩放地图
							var overView = new BMap.OverviewMapControl()
							/* global BMAP_ANCHOR_BOTTOM_RIGHT */
							var overViewOpen = new BMap.OverviewMapControl({isOpen: true, anchor: BMAP_ANCHOR_BOTTOM_RIGHT})
							map.addControl(overView) // 添加默认缩略地图控件
							map.addControl(overViewOpen) // 打开小地图
							var opts = {
								width: 160, // 信息窗口宽度
								height: 90, // 信息窗口高度
								title: '信息', // 信息窗口标题
								enableMessage: true // 设置允许信息窗发送短息
							}
							var datainfo = []
							r.forEach((val) => {
								datainfo.push([
									Number(val.lon),
									Number(val.lat),
									`位置：(${val.lon}, ${val.lat}) <br>
									IMSI：${val.imsi} <br>
									手机号码：${val.phone} <br>
									时间： ${val.timestamp}`
								])
							})
							var openInfo = function (content, e) {
								var p = e.target
								var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat)
								var infoWindow = new BMap.InfoWindow(content, opts) // 创建信息窗口对象
								map.openInfoWindow(infoWindow, point) // 开启信息窗口
							}
							var addClickHandler = function (content, marker) {
								marker.addEventListener('click', function (e) {
									openInfo(content, e)
								})
							}
							var pois = []
							var myIcon = new BMap.Icon('../../../static/market.png', new BMap.Size(45, 30))
							for (let i = 0; i < datainfo.length; i++) {
								pois.push(new BMap.Point(datainfo[i][0], datainfo[i][1]))
								var marker = new BMap.Marker(new BMap.Point(datainfo[i][0], datainfo[i][1]), {icon: myIcon}) // 创建标注
								var content = datainfo[i][2]
								map.addOverlay(marker)
								addClickHandler(content, marker)
								/* marker.addEventListener('click', function (e) {
									var p = e.target
									var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat)
									var infoWindow = new BMap.InfoWindow(content, opts) // 创建信息窗口对象
									map.openInfoWindow(infoWindow, point) // 开启信息窗口
								}) */
							}
							var center = new BMap.Point(datainfo[0][0], datainfo[0][1])
							map.centerAndZoom(center, 17)
							if (datainfo.length > 1) {
								/* global BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW */
								var sy = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {
									scale: 0.6, // 图标缩放大小
									strokeColor: '#fff', // 设置矢量图标的线填充颜色
									strokeWeight: '1' // 设置线宽
								})
								var icons = new BMap.IconSequence(sy, '10', '30')
								var polyline = new BMap.Polyline(pois, {
									enableEditing: false, // 是否启用线编辑，默认为false
									enableClicking: true, // 是否响应点击事件，默认为true
									icons: [icons],
									strokeWeight: '6', // 折线的宽度，以像素为单位
									strokeOpacity: 0.8, // 折线的透明度，取值范围0 - 1
									strokeColor: '#18a45b' // 折线颜色
								})
								map.addOverlay(polyline)
							}
						}
					})
					.catch(function (error) {
						console.log(error)
					})
				}
			}
		}
	}
</script>

<style>
	*{
		font-size: 12px;
	}
	.path-analysis{
		position: relative;
	}
	.path-analysis .condition{
		position: absolute;
		width: 100%;
		z-index: 2000;
	}
	.path-analysis .container{
		width: 34.31vw;
		height: 100%;
		float: right;
	}
	.path-analysis .card-content{
		height: 100%;
		width: 100%;
		background: #fff;
		border: 1px solid #b6b4b6;
		padding: 1px;
		overflow: hidden;
	}
	.path-analysis .condition .tab{
		margin: 10px 0 19px 10px;
	}
	.path-analysis table input{
		width: 300px;
		height: 32px;
		border: 1px solid #caccd1;
		border-radius: 5px;
		line-height: 32px;
	}
	.path-analysis #allmap{
		border: 1px solid #b6b4b6;
		width: 100%;
		height: calc(100vh - 110px);
	}
	.path-analysis .result-float .el-collapse{
		border: none;
		height: calc(100vh - 213px);
	}
	.path-analysis .f-field{
		width: 300px;
	}
</style>
