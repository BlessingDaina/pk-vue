<template>
  <el-container>
    <el-aside width="200px">
      <el-menu
        :default-active="$route.path" @open="handleOpen" @close="handleClose"
        background-color="#304156" text-color="#fff" active-text-color="#ffd04b" router>
        <el-submenu v-for="(menu, index) in menuTree" :key="index" :index="menu.icon">
          <template slot="title"><i class="el-icon-star-on"></i> {{menu.menuName}}</template>
          <el-menu @open="handleOpen" @close="handleClose"
                   background-color="#1f2d3d" text-color="#fff" active-text-color="#ffd04b" router>
            <el-menu-item v-for="(menuChild, index) in menu.children" :key="index" :index="'/'+menuChild.href">
              <i class="el-icon-star-on"></i> {{menuChild.menuName}}
            </el-menu-item>
          </el-menu>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div class="logo"></div>
        <div class="authorizedMenu">
          <div class="menu-list">
            <el-dropdown>
              <span class="el-dropdown-link menuFirst"><i class="el-icon-location-outline"></i>{{selectedMenuName}}<i
                class="el-icon-arrow-down el-icon--right"></i></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in AuthorizedSite" :key="item.sid" @click.native="handleSelect(item)">
                  {{item.siteName}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="navBarRight">
          <!--<ul mode="horizontal">-->
            <!--<li>ddd</li>-->
            <!--<li>ddd</li>-->
            <!--<li>ddd</li>-->
          <!--</ul>-->
          <el-menu mode="horizontal" active-text-color="#232650"  text-color="#232650" router>
            <el-menu-item index="/parking/parkingHome.php">Home</el-menu-item>
            <el-menu-item index="/message"><i class="el-icon-message" style="color: #232650"></i> </el-menu-item>
            <el-menu-item index="/help"><i class="el-icon-question" style="color: #232650"></i> </el-menu-item>
            <el-submenu index="2">
              <template slot="title"><img class="userHead" src="../images/head.png"> 选项4</template>
              <el-menu-item index="4">账号管理</el-menu-item>
              <el-menu-item @click="logout" index="/login">安全退出</el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
      </el-header>
      <!--<navBar/>-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
// import {login, forgetpasswoed} from '../router'
import navBar from './components/navBar'
export default {
  components: {
    navBar
  },
  created () {
    this.getAllSite()
  },
  data () {
    return {
      AuthorizedSite: [],
      allMenu: [],
      AuthorizedMenuType0: [],
      AuthorizedMenuType1: [],
      value: '',
      selectedMenuName: '',
      index: '',
      thisAsideMenu: [],
      thisMenuList: [],
      menuTree: []
    }
  },
  methods: {
    logout () {
      console.log(111)
      let _this = this
      _this.$axios.post('/api/sct/webLogout').then(function (response) {
        if (response.data.status === '200') {
          sessionStorage.setItem('token', '')
          console.log(111)
        }
      })
    },
    handleOpen (key, keyPath) {
    },
    handleClose (key, keyPath) {
    },
    handleSelect (selectedMenu) {
      let _this = this
      _this.selectedMenuName = selectedMenu.siteName
      _this.AuthorizedMenuType0 = []
      _this.AuthorizedMenuType1 = []
      _this.getAllMenu(selectedMenu.sid)
    },
    getAllSite () {
      let _this = this
      _this.$axios.post('/api/sct/listAuthorizedSite').then(function (res) {
        if (res) {
          _this.AuthorizedSite = res.data.data
          _this.value = _this.AuthorizedSite[0].sid
          _this.selectedMenuName = _this.AuthorizedSite[0].siteName
          _this.getAllMenu(_this.value)
        }
      }).catch(function () {
        console.log('error')
      })
    },
    getAllMenu (sid) {
      let _this = this
      _this.$axios.post('/api/sct/listAuthorizedMenu', {
        sid: sid
      }).then(function (res) {
        if (res) {
          _this.allMenu = res.data.data
          _this.getMenuType(_this.allMenu)
        }
      }).catch(function () {
        console.log('error')
      })
    },
    getMenuType (allMenu) {
      let _this = this
      allMenu.forEach(function (item) {
        if (item.menuType === 0) {
          _this.AuthorizedMenuType0.push(item)
        } else {
          _this.AuthorizedMenuType1.push(item)
        }
      })
      _this.matchMenu()
    },
    matchMenu () {
      let _this = this
      let menu = []
      let munuChildren = []
      _this.AuthorizedMenuType0.forEach(function (menuTitle, index) {
        let menuFather = {
          href: '',
          icon: '',
          menuCode: '',
          menuName: '',
          children: []
        }
        menuFather.href = menuTitle.href
        menuFather.icon = menuTitle.icon
        menuFather.menuCode = menuTitle.menuCode
        menuFather.menuName = menuTitle.menuName
        _this.AuthorizedMenuType1.forEach(function (menuList) {
          let menuCode = menuList.menuCode.substring(0, 4)
          if (menuTitle.menuCode === menuCode) {
            munuChildren.push(menuList)
          }
        })
        menuFather.children = munuChildren
        menu.push(menuFather)
        munuChildren = []
      })
      _this.menuTree = menu
    }
  }
}
</script>
<style scoped lang="scss">
  ::-webkit-scrollbar {
    display: none
  }
  .el-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px !important;
    display: flex;
    display: -webkit-flex;
    align-items: center;
    -webkit-align-items: center;
    justify-content: space-between;
    -webkit-justify-content: space-between;
    background-color: #fff;
    color: #333;
    .logo {
      position: absolute;
      left: 0;
      top: 0;
      width: 200px;
      height: 100%;
      line-height: 60px;
      text-align: center;
      color: #009688;
      font-size: 16px;
      background-color: #304156;
      background-image: url("../images/site-logo-00.png");
      background-repeat: no-repeat;
      background-size: 30%;
      background-position: 70px center;
    }
    .authorizedMenu {
      width: 180px;
      position: absolute;
      left: 200px;
      height: 100%;
      .menu-list {
        margin-top: 15px;
      }
      .menuFirst {
        cursor: pointer;
      }
    }
    .navBarRight {
      position: absolute;
      right: 50px;
      .userHead {
        height: 30px;
        width: 30px;
        border-radius:50%;
      }
    }
  }
  .el-aside {
    position: absolute;
    left: 0;
    top: 50px;
    bottom: 0;
    background-color: #304156;
    color: #333;
    text-align: left;
    overflow-x: hidden;
    overflow-y: auto;
    .el-menu {
      width: 218px;
      .el-menu-item {
        /*background-color: #1f2d3d !important;*/
        padding-left: 30px !important;
      }
    }
  }

  .el-aside ::-webkit-scrollbar {
    display: none;
  }

  .el-main {
    position: absolute;
    left: 200px;
    top: 50px;
    bottom: 0;
    right: 0;
    background-color: #f0f2f5;
    color: #333;
    text-align: left;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0;
  }

  body > .el-container {
    min-width: 1000px;
    overflow-x: auto;
    overflow-y: auto;
    position: relative;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    height: 100%;
  }
</style>
