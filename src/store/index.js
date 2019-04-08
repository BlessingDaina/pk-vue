import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // 存储token
    token: sessionStorage.getItem('token') ? sessionStorage.getItem('token') : '',
    // 存储uid
    userId: sessionStorage.getItem('userId') ? sessionStorage.getItem('userId') : '',
    // 存储userName
    user: sessionStorage.getItem('userName') ? sessionStorage.getItem('userName') : ''
  },
  mutations: {
    // 修改token，并将token存入sessionStorage
    changeLogin (state, user) {
      state.token = user.token
      sessionStorage.setItem('token', user.token)
      state.userId = user.userId
      sessionStorage.setItem('userId', user.userId)
      state.userName = user.userName
      sessionStorage.setItem('userName', user.userName)
    }
  }
})

export default store
