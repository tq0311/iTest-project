import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
	state: {
		url: '',
		// url: 'http://192.168.1.172:8888',
		tableData: [],
		isSearch: true
	},
	mutations: {
		changeData (state, list) {
			state.tableData = []
			state.tableData = list.tableData
		},
		changeisSearch (state, s) {
			state.isSearch = s
		}
	}
})
