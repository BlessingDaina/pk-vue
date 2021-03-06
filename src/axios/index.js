import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'

Vue.prototype.$axios = axios
Vue.prototype.$qs = qs
// 添加请求拦截器，在请求头中加token
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.interceptors.request.use(
  config => {
    if (config.method === 'post') {
      let data = qs.parse(config.data)
      config.data = qs.stringify({
        token: sessionStorage.getItem('token'),
        uid: sessionStorage.getItem('uid'),
        ...data
      })
    } else if (config.method === 'get') {
      config.params = {
        token: sessionStorage.getItem('token'),
        uid: sessionStorage.getItem('uid'),
        ...config.params
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  })
export default ({})
