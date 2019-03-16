<template>
  <el-aside width="200px">
    <el-menu
      :default-active="$route.path" @open="handleOpen" @close="handleClose"
      background-color="#304156" text-color="#fff" active-text-color="#ffd04b" router>
      <el-submenu v-for="(menu, index) in menuTree" :key="index" :index="menu.icon">
        <template slot="title">{{menu.menuName}}</template>
        <el-menu @open="handleOpen" @close="handleClose"
                 background-color="#1f2d3d" text-color="#fff" active-text-color="#ffd04b" router>
          <el-menu-item v-for="(menuChild, index) in menu.children" :key="index" :index="'/'+menuChild.href">
            {{menuChild.menuName}}
          </el-menu-item>
        </el-menu>
      </el-submenu>
    </el-menu>
  </el-aside>
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
<style scoped lang="scss"></style>
