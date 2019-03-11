<template>
	<div class="index">
		<div class="menu">
			<div class="menu-top">
				<div class="user">
					<img src="@/assets/images/login.png">
					iTest v
				</div>
			</div>
			<div class="menu-content">
				<Menu @addTabMenu="addTab"></Menu>
			</div>
		</div>
		<div class="main">
			<div class="main-top">
				<span>电子围栏综合研判系统</span>
			</div>
			<div class="space"></div>
			<div class="main-content">
				<el-tabs v-model="editableTabs2Value"  @tab-remove="removeTab" type="card" @tab-click="openTab">
					<el-tab-pane
						v-for="item in editableTabs2"
						:key="item.name"
						:label="item.title"
						:name="item.name"
						:closable="item.title!=='首页'">
					</el-tab-pane>
				</el-tabs>
				<keep-alive>
					<Home ref="initialize" class="all-comp" @addTabInfo="addTab" v-bind:postData="postData" v-bind:is="currentTabComponent"></Home>
				</keep-alive>
			</div>
		</div>
	</div>
</template>

<script>
import Menu from '../menu/Menu'
import Home from '../child/home'
import infoSearch from '../child/information/infoSearch'
import belongSearch from '../child/information/belongSearch'
import macSearch from '../child/information/macSearch'
import pathAnalysis from '../child/analysis/pathAnalysis'
import pathMonitoring from '../child/statistical/pathMonitoring'
import conductStatistical from '../child/statistical/conductStatistical'
import targetStatistical from '../child/statistical/targetStatistical'
import trafficStatistical from '../child/statistical/trafficStatistical'
import swanStatistical from '../child/statistical/swanStatistical'
import alongWithAnalysis from '../child/analysis/alongWithAnalysis'
import suspectAnalysis from '../child/analysis/suspectAnalysis'
import regionaCollision from '../child/collision/regionaCollision'
import timeSpace from '../child/collision/timeSpace'
import accurateAnalysis from '../child/collision/accurateAnalysis'
import macCollision from '../child/collision/macCollision'
import trafficWarning from '../child/control/trafficWarning'
import dynamicWarning from '../child/control/dynamicWarning'
import firstWarning from '../child/control/firstWarning'
import rallyWarning from '../child/control/rallyWarning'
import activeAlarm from '../child/alarm/activeAlarm'
import historyAlarm from '../child/alarm/historyAlarm'
import alarmMessage from '../child/alarm/alarmMessage'
import caseManagement from '../child/libraries/caseManagement'
import specificPerson from '../child/libraries/specificPerson'
import specificPersonType from '../child/libraries/specificPersonType'
import userManagement from '../child/safety/userManagement'
import roleManagement from '../child/safety/roleManagement'
import powerManagement from '../child/safety/powerManagement'
import organManagement from '../child/safety/organManagement'
import operationLog from '../child/log/operationLog'
import securityLog from '../child/log/securityLog'
import swanManagement from '../child/system/swanManagement'
import messageNotify from '../child/system/messageNotify'
import messageManagement from '../child/system/messageManagement'
import register from '../child/system/register'
import infoSearchResult from '../child/information/infoSearchResult'
export default {
	name: 'index',
	components: {
		Menu,
		Home,
		infoSearch,
		belongSearch,
		macSearch,
		pathAnalysis,
		alongWithAnalysis,
		suspectAnalysis,
		regionaCollision,
		timeSpace,
		accurateAnalysis,
		macCollision,
		pathMonitoring,
		conductStatistical,
		targetStatistical,
		trafficStatistical,
		swanStatistical,
		trafficWarning,
		dynamicWarning,
		firstWarning,
		rallyWarning,
		activeAlarm,
		historyAlarm,
		alarmMessage,
		caseManagement,
		specificPerson,
		specificPersonType,
		userManagement,
		roleManagement,
		powerManagement,
		organManagement,
		operationLog,
		securityLog,
		swanManagement,
		messageNotify,
		messageManagement,
		register,
		infoSearchResult
	},
	data () {
		return {
			show: true,
			editableTabs2Value: '1',
			currentComp: 'Home',
			editableTabs2: [{
				title: '首页',
				component: 'Home',
				name: '1'
			}],
			tabIndex: 1,
			postData: {
				imsi: null,
				phone: null,
				belong: null,
				swan: null,
				starttime: null,
				endtime: null,
				persontype: null,
				particular: null,
				whether: null,
				operator: null,
				isSearch: null
			}
		}
	},
	computed: {
		currentTabComponent () {
			return this.currentComp
		},
		removeComp () {
			return this.$store.state.removeComp
		}
	},
	created () {
	},
	methods: {
		addTab (target) {
			var isexist = false
			var tabsvalue
			for (var i = 0; i < this.editableTabs2.length; i++) {
				if (this.editableTabs2[i].title === target.title) {
					isexist = true
					tabsvalue = this.editableTabs2[i].name
				} else if (this.currentComp === 'infoSearch') {
					this.postData.imsi = target.imsi
					this.postData.phone = target.phone
					this.postData.belong = target.belong
					this.postData.swan = target.swan
					this.postData.persontype = target.persontype
					this.postData.particular = target.particular
					this.postData.whether = target.whether
					this.postData.operator = target.operator
					this.postData.starttime = target.starttime
					this.postData.endtime = target.endtime
					this.postData.isSearch = target.isSearch
				}
			}
			if (!isexist) {
				let newTabName = ++this.tabIndex + ''
				this.editableTabs2.push({
					title: target.title,
					component: target.comp,
					name: newTabName
				})
				this.editableTabs2Value = newTabName
			} else {
				this.editableTabs2Value = tabsvalue
			}
			this.currentComp = target.comp
		},
		removeTab (targetName) {
			let tabs = this.editableTabs2
			let activeName = this.editableTabs2Value
			if (activeName === targetName) {
				tabs.forEach((tab, index) => {
					if (tab.name === targetName) {
						this.$refs.initialize.destroy()
						let nextTab = tabs[index + 1] || tabs[index - 1]
						if (nextTab) {
							activeName = nextTab.name
							this.currentComp = nextTab.component
							/* this.$router.push({path: `/${nextTab.component}`}) */
						}
					}
				})
			}
			this.editableTabs2Value = activeName
			this.editableTabs2 = tabs.filter(tab => tab.name !== targetName)
		},
		openTab (tabName) {
			this.editableTabs2.forEach((tab, index) => {
				if (tab.name === this.editableTabs2Value) {
					this.currentComp = tab.component
				}
			})
		}
	}}
</script>

<style>
*{
	margin: 0;
	border: 0;
	padding: 0;
	font-size: 12px;
}
.index .menu{
	width: 12.5vw;
	float: left;
	position: fixed;
	z-index: 20000;
	background-color: #48505f;
	color: #fff;
	height: 100vh;
}
.index .menu-top{
	width: 100%;
	height: 84px;
	background-color: #393f4d;
	line-height: 84px;
}
.index .user{
	width: 100%;
	height: 27px;
	line-height: 27px;
	position: absolute;
	top: 28px;
}
.index .menu-top img{
	width: 27px;
	height: 27px;
	float: left;
	margin: 0 10px 0 1.6vw;
	/* margin: 28px 10px 28px 25px; */
}
.index .main{
	float: left;
	width: 85.5vw;
	height: 100%;
	margin-left: 12.5vw;
}
.index .main-top{
	height: 53px;
	width: 100%;
	line-height: 41px;
	padding-left: 25px;
	position: fixed;
	z-index: 20000;
	background-color: #fff;
}
.index .space{
	height: 53px;
}
.index .main-top span{
	margin-top: 15px;
	font-size: 20px;
	display: inline-block;
	color: #333;
}
.index .all-comp{
	margin-left: 10px;
	width: calc(87.5vw - 20px);
}
/* .index .el-tabs__nav .el-tabs__item{
	display: inline-block;
} */
/* .index .el-tabs__nav{
	position: fixed;
	background: #fff;
} */
/* .index .main-content{
	width: 85vw;
} */
</style>
