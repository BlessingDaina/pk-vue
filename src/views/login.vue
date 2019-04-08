<template>
  <el-form ref="form" :rules="loginRules" :model="user" label-position="left" label-width="0px"
           class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="userName">
      <el-input type="text" v-model="user.userName" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="passWord">
      <el-input type="password" v-model="user.passWord" auto-complete="off" placeholder="密码" @keyup.enter.native="login(user)"></el-input>
    </el-form-item>
    <br>
    <br>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click="login(user)">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      user: {
        userName: '',
        passWord: ''
      },
      loginRules: {
        userName: [
          {required: true, message: '请输入账号', trigger: 'blur'}
        ],
        passWord: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    login (user) {
      let _this = this
      this.$axios.post('/api/sys/login', this.$qs.stringify({
        loginName: user.userName,
        loginPwd: user.passWord
      })).then(function (response) {
        if (response.data.status === 200) {
          _this.$message({
            message: response.data.message,
            type: 'success'
          })
          console.log(response.data)
          _this.userToken = response.data.data.token
          _this.userId = response.data.data.userId
          // 将用户token保存到vuex中
          _this.$store.commit('changeLogin', {
            token: _this.userToken,
            userId: _this.userId,
            userName: response.data.data.userName
          })
          _this.$router.push({name: 'index'})
        } else if (response.data.status === 500) {
          _this.$message.error('用户名或密码错误')
        } else {
          _this.$message.error('服务器异常')
        }
      }).catch(function (res) {
        _this.$message.error('错误')
        console.log(res)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>
