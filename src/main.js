// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'vx-easyui/dist/themes/gray/easyui.css'
import 'vx-easyui/dist/themes/icon.css'
import 'vx-easyui/dist/themes/vue.css'
import EasyUI from 'vx-easyui'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/style.css'
import echarts from 'echarts'
import axios from 'axios'
import 'vx-easyui/dist/locale/easyui-lang-zh_CN.js'
import store from './store/store.js'
import '@/assets/js/directives.js'
import VueWechatTitle from 'vue-wechat-title'

Vue.use(VueWechatTitle)
Vue.use(ElementUI)
Vue.use(EasyUI)
Vue.prototype.$echarts = echarts
Vue.prototype.axios = axios
Vue.prototype.$ = $
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
