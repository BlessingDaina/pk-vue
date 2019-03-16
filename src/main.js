// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.css'
import './styles/common.css'
import axios from './axios'
import store from './store/index'
import echarts from 'echarts'

Vue.prototype.$echatts = echarts
Vue.config.productionTip = false
Vue.use(ElementUI)
require('./api/mock')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  axios,
  store,
  components: {App},
  template: '<App/>'
})
