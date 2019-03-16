/**
* @author: daina
* @date: 2018/11/23
* @description:
*/
<template>
  <el-container>
    <el-aside>
      <parkList v-on:getSelectedParkLotId="getParkLotIdFromList"/>
    </el-aside>
    <el-main>
      <div class="content-top"></div>
      <div class="content-main">
        <div class="content-tabs">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="全部" name="first"></el-tab-pane>
            <el-tab-pane label="普通包月" name="second"></el-tab-pane>
            <el-tab-pane label="分时包月" name="third"></el-tab-pane>
            <el-tab-pane label="即将到期" name="fourth"></el-tab-pane>
            <el-tab-pane label="已到期" name="fifth"></el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import parkList from '../components/parkingList'
export default {
  name: 'monthlycar',
  data () {
    return {
      activeName: 'second'
    }
  },
  components: {
    parkList
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab.index, event)
      let searchType = -1
      if (tab.index === '0') {
        console.log(111)
        searchType = -1
      } else if (tab.index === '1') {
        searchType = 0
      } else if (tab.index === '2') {
        searchType = 1
      } else if (tab.index === '3') {
        searchType = 2
      } else if (tab.index === '4') {
        searchType = 3
      }
      console.log(searchType)
      this.getParkMonth(searchType)
    },
    getParkMonth (searchType) {
      let _this = this
      console.log(this)
      _this.$axios.post('/api/pklot/listParkMonthly', {
        searchType: searchType
      }).then(function (res) {
        if (res) {
          console.log(res)
        }
      }).catch(function () {
        console.log('error')
      })
    },
    getParkLotIdFromList (data) {
      console.log(data)
    }
  }
}
</script>

<style scoped lang="scss">
  .el-container {
    height: 100%;
  }
  .el-aside {
    background-color: #e9e5e5;
    color: #333;
    text-align: center;
    height: 100%;
    width: 330px !important;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
</style>
