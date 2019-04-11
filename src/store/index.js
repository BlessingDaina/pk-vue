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
    user: sessionStorage.getItem('userName') ? sessionStorage.getItem('userName') : '',
    // 存储roleId
    roleId: sessionStorage.getItem('roleId') ? sessionStorage.getItem('roleId') : '',
    // 存储是否为管理员
    isAdmin: sessionStorage.getItem('isAdmin') ? sessionStorage.getItem('isAdmin') : '',
    // 存储parkingLotId
    parkingLotId: sessionStorage.getItem('parkingLotId') ? sessionStorage.getItem('parkingLotId') : ''
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
      state.roleId = user.roleId
      sessionStorage.setItem('roleId', user.roleId)
      state.isAdmin = user.isAdmin
      sessionStorage.setItem('isAdmin', user.isAdmin)
      state.parkingLotId = user.parkingLotId
      sessionStorage.setItem('parkingLotId', user.parkingLotId)
    }
  }
})

export default store
