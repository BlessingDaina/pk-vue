/**
* @author: daina
* @date: 2018/11/21
* @description:
*/
<template>
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
  </el-header>
</template>

<script>
export default {
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
      background-image: url("../../images/site-logo-00.png");
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
    }
    .menuFirst {
      cursor: pointer;
    }
  }
</style>
