const Mock = require('mockjs')
const Random = Mock.Random
const base = 'http://localhost:8080'
// login
Mock.mock(base + '/api/login', 'post', {
  'status': '200',
  'message': function () {
    return this.status ? '登录成功' : '登录失败'
  },
  'code': function () {
    return this.status ? 200 : 404
  },
  'loginData': {
    'uid': '@guid',
    'userName': '@cname',
    'email': '@email',
    'lastLoginTime': Random.date('yyyy-MM-dd HH mm ss')
  }
})
// menunav
Mock.mock(base + '/api/sct/listAuthorizedMenu', 'post', {
})
Mock.mock(base + '/api/login', 'get', {
  'status': ' @boolean',
  'message': function () {
    return this.status ? '登录成功' : '登录失败'
  },
  'code': function () {
    return this.status ? 200 : 404
  },
  'data': {
    'uid': '@guid',
    'userName': '@cname',
    'email': '@email',
    'lastLoginTime': Random.date('yyyy-MM-dd HH mm ss')
  }
})

Mock.mock(base + '/api/forgetpassword', 'get', {
  'name': '@name',
  'age|1-100': 100,
  'color': '@color'
})

Mock.mock(base + '/api/threemonth', 'get', {
  'code': 'success',
  'data': {
    'bid_amount': '554749745.00',
    'bid_user': '13918'
  }
})
