<template>
	<div class="home">
		<div class="container">
			<div id="homeMap">
			</div>
		</div>
	</div>
</template>

<script>
	import BMap from 'BMap'
	export default {
		name: 'Home',
		mounted () {
			// 创建实例
			var map = new BMap.Map('homeMap')
			// 创建坐标点
			var point = new BMap.Point(118.80, 32.06)
			// 添加控件
			var topLeftNavigation = new BMap.NavigationControl()
			// 初始化实例，传入坐标点并设置地图级别
			map.centerAndZoom(point, 12)
			map.addControl(topLeftNavigation)
			map.enableScrollWheelZoom(true)
			var overView = new BMap.OverviewMapControl()
			/* global BMAP_ANCHOR_BOTTOM_RIGHT */
			var overViewOpen = new BMap.OverviewMapControl({isOpen: true, anchor: BMAP_ANCHOR_BOTTOM_RIGHT})
			map.addControl(overView) // 添加默认缩略地图控件
			map.addControl(overViewOpen) // 打开小地图
		},
		methods: {
			destroy () {
				this.$destroy()
			}
		}
	}
</script>
<style>
.home{
	width: 100%;
	height: 100%;
	position: fixed;
}
.home #homeMap{
	width: 100%;
	height: calc(100vh - 110px);
	border: 1px solid #b6b4b6;
}
.home .container{
	width: calc(87.5vw - 20px);
	height: 645px;
}
</style>
