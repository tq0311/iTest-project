import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login/login'
import infoSearch from '@/components/child/information/infoSearch'
import belongSearch from '@/components/child/information/belongSearch'
import index from '@/components/index/index'
/* import Monitoring from '@/components/monitoring/Monitoring' */
import macSearch from '@/components/child/information/macSearch'
import Home from '@/components/child/home'
import pathAnalysis from '@/components/child/analysis/pathAnalysis'
import pathMonitoring from '@/components/child/statistical/pathMonitoring'
import conductStatistical from '@/components/child/statistical/conductStatistical'
import targetStatistical from '@/components/child/statistical/targetStatistical'
import trafficStatistical from '@/components/child/statistical/trafficStatistical'
import swanStatistical from '@/components/child/statistical/swanStatistical'
import alongWithAnalysis from '@/components/child/analysis/alongWithAnalysis'
import suspectAnalysis from '@/components/child/analysis/suspectAnalysis'
import regionaCollision from '@/components/child/collision/regionaCollision'
import timeSpace from '@/components/child/collision/timeSpace'
import accurateAnalysis from '@/components/child/collision/accurateAnalysis'
import macCollision from '@/components/child/collision/macCollision'
import trafficWarning from '@/components/child/control/trafficWarning'
import dynamicWarning from '@/components/child/control/dynamicWarning'
import firstWarning from '@/components/child/control/firstWarning'
import rallyWarning from '@/components/child/control/rallyWarning'
import activeAlarm from '@/components/child/alarm/activeAlarm'
import historyAlarm from '@/components/child/alarm/historyAlarm'
import alarmMessage from '@/components/child/alarm/alarmMessage'
import caseManagement from '@/components/child/libraries/caseManagement'
import specificPerson from '@/components/child/libraries/specificPerson'
import specificPersonType from '@/components/child/libraries/specificPersonType'
import userManagement from '@/components/child/safety/userManagement'
import roleManagement from '@/components/child/safety/roleManagement'
import powerManagement from '@/components/child/safety/powerManagement'
import organManagement from '@/components/child/safety/organManagement'
import operationLog from '@/components/child/log/operationLog'
import securityLog from '@/components/child/log/securityLog'
import swanManagement from '@/components/child/system/swanManagement'
import messageNotify from '@/components/child/system/messageNotify'
import messageManagement from '@/components/child/system/messageManagement'
import register from '@/components/child/system/register'
import infoSearchResult from '@/components/child/information/infoSearchResult'
Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '',
			redirect: '/login'
		},
		{
			path: '/login',
			name: 'login',
			component: login
		},
		{
			path: '/index',
			name: 'index',
			component: index,
			children: [
				{
					path: '/Home',
					name: 'Home',
					component: Home
				},
				{
					path: '/infoSearch',
					name: 'infoSearch',
					component: infoSearch
				},
				{
					path: '/belongSearch',
					name: 'belongSearch',
					component: belongSearch
				},
				{
					path: '/macSearch',
					name: 'macSearch',
					component: macSearch
				},
				{
					path: '/pathAnalysis',
					name: 'pathAnalysis',
					component: pathAnalysis
				},
				{
					path: '/pathMonitoring',
					name: 'pathMonitoring',
					component: pathMonitoring
				},
				{
					path: '/conductStatistical',
					name: 'conductStatistical',
					component: conductStatistical
				},
				{
					path: '/targetStatistical',
					name: 'targetStatistical',
					component: targetStatistical
				},
				{
					path: '/trafficStatistical',
					name: 'trafficStatistical',
					component: trafficStatistical
				},
				{
					path: '/swanStatistical',
					name: 'swanStatistical',
					component: swanStatistical
				},
				{
					path: '/alongWithAnalysis',
					name: 'alongWithAnalysis',
					component: alongWithAnalysis
				},
				{
					path: '/suspectAnalysis',
					name: 'suspectAnalysis',
					component: suspectAnalysis
				},
				{
					path: '/regionaCollision',
					name: 'regionaCollision',
					component: regionaCollision
				},
				{
					path: '/timeSpace',
					name: 'timeSpace',
					component: timeSpace
				},
				{
					path: '/accurateAnalysis',
					name: 'accurateAnalysis',
					component: accurateAnalysis
				},
				{
					path: '/macCollision',
					name: 'macCollision',
					component: macCollision
				},
				{
					path: '/trafficWarning',
					name: 'trafficWarning',
					component: trafficWarning
				},
				{
					path: '/dynamicWarning',
					name: 'dynamicWarning',
					component: dynamicWarning
				},
				{
					path: '/firstWarning',
					name: 'firstWarning',
					component: firstWarning
				},
				{
					path: '/rallyWarning',
					name: 'rallyWarning',
					component: rallyWarning
				},
				{
					path: '/activeAlarm',
					name: 'activeAlarm',
					component: activeAlarm
				},
				{
					path: '/historyAlarm',
					name: 'historyAlarm',
					component: historyAlarm
				},
				{
					path: '/alarmMessage',
					name: 'alarmMessage',
					component: alarmMessage
				},
				{
					path: '/caseManagement',
					name: 'caseManagement',
					component: caseManagement
				},
				{
					path: '/specificPerson',
					name: 'specificPerson',
					component: specificPerson
				},
				{
					path: '/specificPersonType',
					name: 'specificPersonType',
					component: specificPersonType
				},
				{
					path: '/userManagement',
					name: 'userManagement',
					component: userManagement
				},
				{
					path: '/roleManagement',
					name: 'roleManagement',
					component: roleManagement
				},
				{
					path: '/powerManagement',
					name: 'powerManagement',
					component: powerManagement
				},
				{
					path: '/organManagement',
					name: 'organManagement',
					component: organManagement
				},
				{
					path: '/operationLog',
					name: 'operationLog',
					component: operationLog
				},
				{
					path: '/securityLog',
					name: 'securityLog',
					component: securityLog
				},
				{
					path: '/swanManagement',
					name: 'swanManagement',
					component: swanManagement
				},
				{
					path: '/messageNotify',
					name: 'messageNotify',
					component: messageNotify
				},
				{
					path: '/messageManagement',
					name: 'messageManagement',
					component: messageManagement
				},
				{
					path: '/register',
					name: 'register',
					component: register
				},
				{
					path: '/infoSearchResult',
					name: 'infoSearchResult',
					component: infoSearchResult
				}
			]
		},
		{
			path: '/Monitoring',
			name: 'Monitoring',
			component: resolve => require(['@/components/monitoring/Monitoring.vue'], resolve),
			meta: {
				title: '集中监控'
			}
		}
	]
})
