/**
* @author: daina
* @date: 2019/3/19
* @description:
*/
<template>
  <div class="content">
    <div class="person-header">
      <div class="search-input">
        <el-input v-model="userInfo" placeholder="输入用户名、登录账号、手机号码查询" size="small" @keyup.enter.native="getUserList"><i
          slot="prefix"
          class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <section class="button-group">
        <el-button type="primary" size="small" @click="getUserList">查询</el-button>
        <el-button type="primary" size="small" @click="addUser">添加用户
        </el-button>
      </section>
    </div>
    <el-tabs v-model="roleType" @tab-click="handleClick">
      <el-tab-pane v-for="role in roleTypeList" :name="role.roleId" :key="role.roleId"
                   :label="role.roleName"></el-tab-pane>
    </el-tabs>
    <div class="person-content">
      <el-scrollbar id="scrollBox" style="height: 100%">
        <div class="person-item" v-for="user in userList" :key="user.userId">
          <span class="head">{{user.userName.substring(0,1)}}</span>
          <div class="person-info">
            <p class="person-name">{{user.userName}}（{{user.loginName}}）</p>
            <p class="person-status">
              <el-button type="primary" size="mini" round>{{user.roleName}}</el-button>
              <span class="person-phone">{{user.phone}}</span>
            </p>
          </div>
          <section class="operation">
            <el-button type="primary" plain size="small" @click="editUser(user)">编辑</el-button>
            <el-button type="primary" plain size="small" @click="resetPwd(user)">重置密码</el-button>
            <el-button type="success" v-show="user.delFlag" size="small" @click="statusModelShow(user)">恢复</el-button>
            <el-button type="danger" v-show="!user.delFlag" size="small" @click="statusModelShow(user)">停用</el-button>
          </section>
        </div>
        <div class="searchPrompt" v-show="userList.length == 0">
          <p class="error-msg">没有找到相关人员</p>
        </div>
      </el-scrollbar>
    </div>
    <el-dialog
      title="添加人员信息"
      :visible.sync="addVisible"
      width="580px"
      :close-on-click-modal="false"
      @close="cancelSubmit('userForm')"
    >
      <el-form ref="userForm" :model="addUserInfo" :rules="FormRules" label-width="100px" size="small"
               label-position="left">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="addUserInfo.userName" ref="userName"></el-input>
        </el-form-item>
        <el-form-item label="登录账号" prop="loginName">
          <el-input v-model="addUserInfo.loginName" ref="loginName"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="loginPwd">
          <el-input v-model="addUserInfo.loginPwd" type="password" ref="loginPwd"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPwd">
          <el-input v-model="addUserInfo.checkPwd" type="password" ref="checkPwd"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="addUserInfo.phone" ref="phone"></el-input>
        </el-form-item>
        <el-form-item label="权限设置" prop="roleId">
          <el-select v-model="addUserInfo.roleId" ref="roleId">
            <el-option v-for="role in addRoleList" :key="role.roleId" :value="role.roleId"
                       :label="role.roleName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelSubmit('userForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveUserInfo('userForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑人员信息"
      :visible.sync="editVisible"
      width="450px"
      top="20vh"
      :close-on-click-modal="false"
      @close="cancelSubmit('editUserForm')"
    >
      <el-form ref="editUserForm" :model="editUserInfo" :rules="FormRules" label-width="100px" size="small"
               label-position="left">
        <el-form-item label="登录账号">
          {{editUserInfo.loginName}}
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="editUserInfo.userName" ref="userName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="editUserInfo.phone" ref="phone"></el-input>
        </el-form-item>
        <el-form-item label="权限设置" prop="roleId">
          <el-select v-model="editUserInfo.roleId" ref="roleId">
            <el-option v-for="role in addRoleList" :key="role.roleId" :value="role.roleId"
                       :label="role.roleName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelSubmit('editUserForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="updateUser('editUserForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="重置密码"
      :visible.sync="resetVisible"
      width="450px"
      top="20vh"
      :close-on-click-modal="false"
      @close="cancelSubmit('resetPwdForm')"
    >
      <el-form ref="resetPwdForm" :model="resetPwdInfo" :rules="FormRules" label-width="100px" size="small"
               label-position="left">
        <el-form-item label="用户名">
          {{resetPwdInfo.userName}}
        </el-form-item>
        <el-form-item label="登录账号">
          {{resetPwdInfo.loginName}}
        </el-form-item>
        <el-form-item label="登录密码" prop="loginPwd">
          <el-input v-model="resetPwdInfo.loginPwd" type="password" ref="loginPwd"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPwd">
          <el-input v-model="resetPwdInfo.checkPwd" type="password" ref="checkPwd"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelSubmit('resetPwdForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="updatePwd('resetPwdForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="切换状态提示"
      :visible.sync="statusVisible"
      width="350px"
      :close-on-click-modal="false"
      top="30vh"
    >
      <el-form ref="form" :model="statusInfo" size="mini">
        <div class="statusPrompt">
          <i class="iconfont icon-wenhao"></i>
          <span>确定{{statusInfo.delFlag ? '恢复' : '停用'}}人员：{{statusInfo.userName}} ?</span>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="statusVisible = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="changeStatus">确 定</el-button>
          </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'personal-management',
  data () {
    let loginNameValidation = (rule, value, callback) => {
      console.log(value)
      if (!/^[A-Za-z0-9]+$/.test(value)) {
        callback(new Error('登录账号只能由字母和数字组成'))
      } else {
        this.$axios.post('/api/pklot/getIsUsedLoginName', {
          loginName: value
        }).then(response => {
          if (response.data.data !== 0) {
            callback(new Error('该账号已被使用'))
          } else {
            callback()
          }
        })
      }
    }
    let loginPwdValidation = (rule, value, callback) => {
      if (!/^\w+$/.test(value)) {
        callback(new Error('登录密码只能由字母、数字和下划线组成'))
      } else {
        callback()
      }
    }
    let checkPwdValidation = (rule, value, callback) => {
      if (value !== this.addUserInfo.loginPwd && value !== this.resetPwdInfo.loginPwd) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    let phoneValidation = (rule, value, callback) => {
      if (value) {
        if (!/^1[3|4|5|7|8][0-9]\d{8}$/.test(value)) {
          callback(new Error('手机号码格式不正确'))
        } else if (value === this.phoneNumber) {
          callback()
        } else {
          this.$axios.post('/api/pklot/getIsUsedPhone', {
            phone: value
          }).then(response => {
            if (response.data.data !== 0) {
              callback(new Error('该号码已被使用'))
            } else {
              callback()
            }
          })
        }
      } else {
        callback()
      }
    }
    return {
      userInfo: '',
      roleTypeList: [],
      addRoleList: [],
      roleType: 'all',
      delFlag: 0,
      roleId: '',
      all: [{
        roleId: 'all',
        roleName: '全部'
      }],
      delete: [{
        roleId: 'delete',
        roleName: '已停用'
      }],
      userList: [],
      addVisible: false,
      editVisible: false,
      resetVisible: false,
      statusVisible: false,
      addUserInfo: {},
      resetPwdInfo: {},
      editUserInfo: {},
      statusInfo: {},
      FormRules: {
        userName: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 1, max: 20, message: '用户名不能超过20位', trigger: 'blur'}
        ],
        loginName: [
          {required: true, message: '请输入登录账号', trigger: 'blur'},
          {min: 4, max: 20, message: '登录账号不能少于4位或者超过20位', trigger: 'blur'},
          {validator: loginNameValidation, trigger: 'blur'}
        ],
        loginPwd: [
          {required: true, message: '请输入登录密码', trigger: 'blur'},
          {min: 6, max: 20, message: '登录密码长度在6-20位之间', trigger: 'blur'},
          {validator: loginPwdValidation, trigger: 'blur'}
        ],
        checkPwd: [
          {required: true, message: '请再次输入登录密码', trigger: 'blur'},
          {validator: checkPwdValidation, trigger: 'blur'}
        ],
        phone: [
          {validator: phoneValidation, trigger: 'blur'}
        ]
      }
    }
  },
  created () {
    this.getAllRole()
    this.getUserList()
  },
  methods: {
    // 获取用户角色
    getAllRole () {
      this.$axios.post('/api/sys/getAllRole').then(response => {
        this.addRoleList = response.data.data
        this.roleTypeList = this.all.concat(response.data.data, this.delete)
      })
    },
    // 获取人员列表
    getUserList () {
      this.$axios.post('/api/pklot/getUserList', {
        userInfo: this.userInfo,
        roleId: this.roleId,
        delFlag: this.delFlag
      }).then(response => {
        this.userList = response.data.data
      })
    },
    // 切换人员角色
    handleClick (tab, event) {
      if (tab.name === 'all') {
        this.delFlag = 0
        this.roleId = ''
      } else if (tab.name === 'delete') {
        this.delFlag = 1
        this.roleId = ''
      } else {
        this.delFlag = 0
        this.roleId = tab.name
      }
      this.getUserList()
    },
    addUser () {
      this.addVisible = true
      this.addUserInfo = {}
      this.addUserInfo.roleId = this.addRoleList[0].roleId
    },
    // 保存人员信息
    saveUserInfo (userForm) {
      let failedFields = {}
      this.$refs[userForm].validate((valid, invalidFields) => {
        if (valid) {
          this.$refs[userForm].clearValidate()
          this.addVisible = false
          this.$axios.post('/api/pklot/addUser', this.addUserInfo).then(response => {
            if (response.data.data === 1) {
              this.$message.success('保存成功')
              this.getUserList()
            }
          }).catch(error => {
            console.log(error)
            this.$message.error('服务器错误')
          })
        } else {
          console.log('验证失败')
          failedFields = invalidFields
          let obj = {}
          for (obj in failedFields) {
            this.$refs[obj].focus()
            console.log(obj)
            break
          }
        }
      })
    },
    // 弹出层取消提交
    cancelSubmit (nameForm) {
      this.addVisible = false
      this.addUserInfo = {}
      this.editVisible = false
      this.editUserInfo = {}
      this.resetVisible = false
      this.$refs[nameForm].clearValidate()
    },
    // 编辑人员信息
    editUser (user) {
      let _this = this
      this.editVisible = true
      this.editUserInfo = JSON.parse(JSON.stringify(user))
      this.phoneNumber = user.phone
      this.addRoleList.forEach((item) => {
        if (user.roleName === item.roleName) {
          _this.editUserInfo.roleId = item.roleId
        }
      })
    },
    // 更新人员信息
    updateUser (editUserForm) {
      let failedFields = {}
      this.$refs[editUserForm].validate((valid, invalidFields) => {
        if (valid) {
          this.$refs[editUserForm].clearValidate()
          this.editVisible = false
          this.$axios.post('/api/pklot/updateUser', this.editUserInfo).then(response => {
            if (response.data.data === 1) {
              this.$message.success('修改成功')
              this.getUserList()
            }
          }).catch(error => {
            console.log(error)
            this.$message.error('服务器错误')
          })
        } else {
          console.log('验证失败')
          failedFields = invalidFields
          console.log(failedFields)
          let obj = {}
          for (obj in failedFields) {
            this.$refs[obj].focus()
            console.log(obj)
            break
          }
        }
      })
    },
    // 重置密码
    resetPwd (user) {
      this.resetVisible = true
      this.resetPwdInfo = JSON.parse(JSON.stringify(user))
    },
    // 更新密码
    updatePwd (resetPwdForm) {
      let failedFields = {}
      this.$refs[resetPwdForm].validate((valid, invalidFields) => {
        if (valid) {
          this.$refs[resetPwdForm].clearValidate()
          this.resetVisible = false
          this.$axios.post('/api/pklot/resetPwd', this.resetPwdInfo).then(response => {
            if (response.data.data === 1) {
              this.$message.success('修改成功')
              this.getUserList()
            }
          }).catch(error => {
            console.log(error)
            this.$message.error('服务器错误')
          })
        } else {
          console.log('验证失败')
          failedFields = invalidFields
          console.log(failedFields)
          let obj = {}
          for (obj in failedFields) {
            this.$refs[obj].focus()
            console.log(obj)
            break
          }
        }
      })
    },
    // 显示停用/恢复弹出层
    statusModelShow (user) {
      this.statusVisible = true
      this.statusInfo = user
    },
    // 修改停用/恢复状态
    changeStatus () {
      if (this.statusInfo.delFlag) {
        this.statusInfo.delFlag = 0
      } else {
        this.statusInfo.delFlag = 1
      }
      this.$axios.post('/api/pklot/updateStatus', this.statusInfo).then(response => {
        this.statusVisible = false
        if (response.data.data === 1) {
          if (this.statusInfo.delFlag) {
            this.$message.success('停用成功')
          } else {
            this.$message.success('恢复成功')
          }
          this.getUserList()
        }
      }).catch(error => {
        console.log(error)
        this.$message.error('服务器错误')
      })
    }
  }
}
</script>

<style scoped lang="scss">
  /deep/ {
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
    p {
      margin: 0;
    }
    .el-select {
      width: 100%;
    }
    .el-tabs__header {
      margin: 0;
    }
  }
  .content {
    margin: 10px;
  }
  .person-header {
    margin: 0px 0px 0px 0px;
    position: relative;
    .search-input {
      margin-right: 170px;
    }
    .button-group {
      position: absolute;
      right: 0;
      top: 0;
    }
  }
  .person-content {
    height: calc(100vh - 170px);
    .person-item {
      border-bottom: 1px solid #DCDFE6;
      padding: 10px 0;
      position: relative;
      .head {
        display: inline-block;
        color: #fff;
        width: 50px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        border-radius: 50%;
        font-size: 20px;
        background-color: #7a907b;
        margin-right: 15px;
      }
      .person-info {
        display: inline-block;
        height: 50px;
        vertical-align: top;
        .person-name {
          font-size: 14px;
        }
        p:nth-child(1) {
          padding-bottom: 8px;
        }
        .person-phone {
          margin-right: 10px;
        }
        .person-status {
          /deep/ {
            .el-button--mini {
              padding: 5px;
            }
          }
        }
      }
      .operation {
        position: absolute;
        right: 10px;
        top: 20px;
        /deep/ {
          .el-input {
            width: 100px;
          }
          .el-input--small .el-input__inner {
            height: 33px;
            line-height: 32px;
          }
        }
      }
    }
    .error-msg {
      font-size: 14px;
      color: #333;
      line-height: 40px;
      text-align: center;
    }
  }
  .statusPrompt {
    position: relative;
    .icon-wenhao {
      font-size: 30px;
      color: #f5cb14;
    }
    span {
      position: absolute;
      top: 5px;
      left: 40px;
    }
  }
</style>
