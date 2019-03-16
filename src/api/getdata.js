import $ajax from './config'

/* 登录接口 */
export const login = data => $ajax.get('/api/login', data)

/* 忘记密码 */
export const forgetpassword = data => $ajax.get('/api/forgetpassword', data)

/* 近三个月数据统计 */
export const threemonth = data => $ajax.get('/api/threemonth', data)
