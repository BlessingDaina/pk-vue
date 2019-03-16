import axios from 'axios'

// 配置api地址

const baseUrl = 'http://localhost:8080'

// axios设置key都是默认的不允许改动的
const $ajax = axios.create({
  baseURL: baseUrl,
  timeout: 5000
})

export default $ajax
