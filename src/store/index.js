import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // 存储token
    token: sessionStorage.getItem('token') ? sessionStorage.getItem('token') : '',
    // 存储uid
    uid: sessionStorage.getItem('uid') ? sessionStorage.getItem('uid') : ''
  },
  mutations: {
    // 修改token，并将token存入sessionStorage
    changeLogin (state, user) {
      state.token = user.token
      sessionStorage.setItem('token', user.token)
      state.uid = user.uid
      sessionStorage.setItem('uid', user.uid)
    }
  }
})

export default store
