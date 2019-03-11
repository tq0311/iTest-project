<template>
	<div class="menu-list">
		<el-col>
			<el-menu
					default-active="2"
					class="el-menu-vertical-demo"
					background-color="#48505f"
					unique-opened
					text-color="#fff"
					active-text-color="#ffd04b">
				<el-submenu index="1" title="信息查询">
					<template slot="title">
						<svg class="icon" aria-hidden="true">
							<use xlink:href="#icon-xinxichaxun"></use>
						</svg>
						<span>信息查询</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="1-1" @click="add('infoSearch', '综合信息查询')">综合信息查询</el-menu-item>
						<el-menu-item index="1-2" @click="add('belongSearch', '归属地查询')">归属地查询</el-menu-item>
						<el-menu-item index="1-3" @click="add('macSearch', 'MAC地址查询')">MAC地址查询</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
				<el-submenu index="2" title="综合分析">
					<template slot="title">
						<svg class="icon" aria-hidden="true">
							<use xlink:href="#icon-zonghefenxi"></use>
						</svg>
						<span>综合分析</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="1-1" @click="add('pathAnalysis', '轨迹分析')">轨迹分析</el-menu-item>
						<el-menu-item index="1-2" @click="add('alongWithAnalysis', '伴随分析')">伴随分析</el-menu-item>
						<el-menu-item index="1-3" @click="add('suspectAnalysis', '嫌疑人分析')">嫌疑人分析</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
				<el-submenu index="3" title="碰撞分析">
					<template slot="title">
						<svg class="icon" aria-hidden="true">
							<use xlink:href="#icon-pengzhuangfenxi"></use>
						</svg>
						<span>碰撞分析</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="1-1" @click="add('regionaCollision', '区域碰撞')">区域碰撞</el-menu-item>
						<el-menu-item index="1-2" @click="add('timeSpace', '时空碰撞')">时空碰撞</el-menu-item>
						<el-menu-item index="1-3" @click="add('accurateAnalysis', '精准碰撞')">精准碰撞</el-menu-item>
						<el-menu-item index="1-4" @click="add('macCollision', 'MAC碰撞')">MAC碰撞</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
				<el-submenu index="4" title="统计监控">
					<template slot="title">
						<svg class="icon" aria-hidden="true">
							<use xlink:href="#icon-tongjijiankong"></use>
						</svg>
						<span>统计监控</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="1-1" @click="add('pathMonitoring', '轨迹监控')">轨迹监控</el-menu-item>
						<el-menu-item index="1-2" @click="add('conductStatistical', '目标行为统计')">目标行为统计</el-menu-item>
						<el-menu-item index="1-3" @click="add('targetStatistical', '目标人群统计')">目标人群统计</el-menu-item>
						<el-menu-item index="1-4" @click="add('trafficStatistical', '目标人流量统计')">目标人流量统计</el-menu-item>
						<el-menu-item index="1-5" @click="add('swanStatistical', '卡口流量统计')">卡口流量统计</el-menu-item>
						<el-menu-item index="1-6" ><a href="#/Monitoring" target="_blank">综合监控</a></el-menu-item>
					</el-menu-item-group>
				</el-submenu>
				<el-submenu index="5" title="布控预警">
					<template slot="title">
						<svg class="icon" aria-hidden="true">
							<use xlink:href="#icon-bkyj"></use>
						</svg>
						<span>布控预警</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="1-1" @click="add('dynamicWarning', '目标对象动态预警')">目标对象动态预警</el-menu-item>
						<el-menu-item index="1-2" @click="add('rallyWarning', '目标对象集结预警')">目标对象集结预警</el-menu-item>
						<el-menu-item index="1-3" @click="add('firstWarning', '目标对象首现预警')">目标对象首现预警</el-menu-item>
						<el-menu-item index="1-4" @click="add('trafficWarning', '卡口区域流量预警')">卡口区域流量预警</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
				<el-submenu index="6" title="告警管理">
					<template slot="title">
						<svg class="icon" aria-hidden="true">
							<use xlink:href="#icon-gaojingguanli"></use>
						</svg>
						<span>告警管理</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="1-1"  @click="add('activeAlarm', '活跃告警')">活跃告警</el-menu-item>
						<el-menu-item index="1-2" @click="add('historyAlarm', '历史告警')">历史告警</el-menu-item>
						<el-menu-item index="1-3" @click="add('alarmMessage', '告警短信设置')">告警短信设置</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
				<el-submenu index="7" title="中间库">
					<template slot="title">
						<svg class="icon" aria-hidden="true">
							<use xlink:href="#icon-ku"></use>
						</svg>
						<span>中间库</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="1-1" @click="add('caseManagement', '案件库管理')">案件库管理</el-menu-item>
						<el-menu-item index="1-2" @click="add('specificPerson', '特定人员库')">特定人员库</el-menu-item>
						<el-menu-item index="1-3" @click="add('specificPersonType', '特定人员类型管理')">特定人员类型管理</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
				<el-submenu index="8" title="安全管理">
					<template slot="title">
						<svg class="icon" aria-hidden="true">
							<use xlink:href="#icon-anquanguanli"></use>
						</svg>
						<span>安全管理</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="1-1" @click="add('userManagement', '用户管理')">用户管理</el-menu-item>
						<el-menu-item index="1-2" @click="add('roleManagement', '角色管理')">角色管理</el-menu-item>
						<el-menu-item index="1-3" @click="add('powerManagement', '权限管理')">权限管理</el-menu-item>
						<el-menu-item index="1-4" @click="add('organManagement', '机构管理')">机构管理</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
				<el-submenu index="9" title="日志管理">
					<template slot="title">
						<svg class="icon" aria-hidden="true">
							<use xlink:href="#icon-log"></use>
						</svg>
						<span>日志管理</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="1-1" @click="add('operationLog', '操作日志')">操作日志</el-menu-item>
						<el-menu-item index="1-2"  @click="add('securityLog', '安全日志')">安全日志</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
				<el-submenu index="10" title="系统管理">
					<template slot="title">
						<svg class="icon" aria-hidden="true">
							<use xlink:href="#icon-guanli"></use>
						</svg>
						<span>系统管理</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="1-1" @click="add('swanManagement', '卡口管理')">卡口管理</el-menu-item>
						<el-menu-item index="1-2" @click="add('messageNotify', '短信通知')">短信通知</el-menu-item>
						<el-menu-item index="1-3" @click="add('messageManagement', '短信管理')">短信管理</el-menu-item>
						<el-menu-item index="1-4" @click="add('register', '注册')">注册</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
			</el-menu>
		</el-col>
	</div>
</template>

<script>
import '@/assets/js/iconfont.js'
export default {
	name: 'Menu',
	methods: {
		add (targetName, title) {
			/* this.$router.push({path: `/${targetName}`}) */
			var obj = {
				comp: targetName,
				title: title,
				phone: this.phone
			}
			this.$emit('addTabMenu', obj)
		}
	}
}
</script>

<style>
.menu-list a{
	color: #b6c3e5;
	text-decoration: none;
	display: block;
}
</style>
