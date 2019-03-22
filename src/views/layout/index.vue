<template>
  <el-container>
    <el-aside width="200px">
      <el-menu
        :default-active="$route.path" @open="handleOpen" @close="handleClose"
        background-color="#304156" text-color="#fff" active-text-color="#ffd04b" router>
        <el-submenu v-for="menu in menus" :key="menu.menuId" :index="menu.icon">
          <template slot="title"><i class="iconfont" :class="menu.icon"></i> {{menu.menuName}}</template>
          <el-menu @open="handleOpen" @close="handleClose"
                   background-color="#1f2d3d" text-color="#fff" active-text-color="#ffd04b" router>
            <el-menu-item v-for="menuChild in menu.menus" :key="menuChild.menuId" :index="'/'+menuChild.href">
              <i class="iconfont" :class="menuChild.icon"></i> {{menuChild.menuName}}
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
              <span class="el-dropdown-link menuFirst"><i class="el-icon-location-outline"></i>{{selectedSiteName}}<i
                class="el-icon-arrow-down el-icon--right"></i></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in sites" :key="item.siteId" @click.native="handleSelect(item)">
                  {{item.siteName}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="navBarRight">
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
        <div class="content">
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  created () {
    this.getAllSite()
  },
  data () {
    return {
      sites: [],
      selectedSiteName: '',
      menus: [],
      value: '',
      index: '',
      thisAsideMenu: [],
      thisMenuList: [],
      menuTree: []
    }
  },
  methods: {
    logout () {
    },
    handleOpen (key, keyPath) {
    },
    handleClose (key, keyPath) {
    },
    handleSelect (selectedSite) {
      let _this = this
      _this.selectedSiteName = selectedSite.siteName
      _this.getMenu(selectedSite.siteId)
    },
    getAllSite () {
      let _this = this
      _this.$axios.post('/api/sys/getSites').then(response => {
        _this.sites = response.data.data
        _this.selectedSiteName = response.data.data[0].siteName
        _this.handleSelect(response.data.data[0])
        console.log(_this.sites)
      }).catch(error => {
        console.log(error)
      })
    },
    getMenu (siteId) {
      let _this = this
      _this.$axios.post('/api/sys/getMenus', {
        siteId: siteId
      }).then(response => {
        console.log(response)
        _this.menus = response.data.data
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>
<style scoped lang="scss">
  /deep/ {
    .el-dropdown {
      float: left;
      margin-left: 30px;
    }
    .el-submenu__title i {
      color: #ffffff;
    }
    .el-menu-item i {
      color: #ffffff;
    }
  }
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
    .content {
      margin: 10px;
    }
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
