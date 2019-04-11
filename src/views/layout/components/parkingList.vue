/**
* @author: daina
* @date: 2018/11/23
* @description:
*/
<template>
  <div class="parking-lot-list-position" v-if="showTag">
    <el-card class="parking-lot-list-content" id="cardStyle" shadow="hover"
             :body-style="{ padding: '0px',height:'100%' }">
      <div class="search-parking-lot">
        <el-row :gutter="15">
          <el-col :span="18">
            <el-input placeholder="请输入停车场名称" v-model="parkingLotName" size="small" @keyup.enter.native="searchParkLot"><i slot="prefix"
                                                                                                                          class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" size="small" @click="searchParkLot">查询</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="search-result">
        <el-scrollbar style="height: 100%">
          <ul id="ulStyle">
            <li class="parking-lot" v-for="park in parkingLotList" :key="park.parkingLotId"
                :class="{'selected-class': selectedParkId === park.parkingLotId}" @click="selectParkLot(park)">
              {{park.parkingLotName}}
            </li>
          </ul>
        </el-scrollbar>
        <div class="list-page">
          <el-pagination
            background
            layout="prev, pager, next"
            :total=totalPage
            :current-page=pageNum
            @current-change="handleCurrentChange"
            :page-size=pageSize
            small
            :pager-count="5"
          >
          </el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'parkingList',
  data () {
    return {
      parkingLotName: '',
      selectedParkId: '',
      parkingLotList: [],
      pageSize: 10,
      totalPage: 0,
      pageNum: 1,
      isAdmin: sessionStorage.getItem('isAdmin'),
      showTag: false
    }
  },
  created () {
    if (this.isAdmin === '1') {
      this.showTag = true
    }
    this.getParkingList()
  },
  methods: {
    handleCurrentChange (val) {
      this.pageNum = val
      this.getParkingList()
    },
    searchParkLot () {
      this.pageNum = 1
      this.getParkingList()
    },
    selectParkLot (park) {
      this.selectedParkId = park.parkingLotId
      this.$emit('getSelectedParkLotId', this.selectedParkId)
    },
    getParkingList () {
      let pageSize = this.pageSize
      let pageNum = this.pageNum
      let parkingLotName = this.parkingLotName
      let parkingLotId = sessionStorage.getItem('parkingLotId')
      if (parkingLotId === 'null') {
        parkingLotId = ''
      }
      this.$axios.post('/api/pklot/getParkingLotList', {
        pageNum: pageNum,
        pageSize: pageSize,
        parkingLotName: parkingLotName,
        parkingLotId: parkingLotId
      }).then(response => {
        this.totalPage = response.data.data.count
        this.parkingLotList = response.data.data.items
        this.selectParkLot(this.parkingLotList[0])
      })
    }
  }
}
</script>

<style scoped lang="scss">
  /deep/ {
    .el-scrollbar {
      height: 100%;
    }
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }

  .parking-lot-list-position {
    width: 300px;
    height: calc(100vh - 75px);
    position: absolute;
    z-index: 999;
    .parking-lot-list-content {
      background-color: #FFFFFF;
      position: relative;
      text-align: left;
      height: calc(100vh - 75px);
      .search-parking-lot {
        padding-left: 10px;
        padding-right: 10px;
        margin-top: 10px;
      }
      .search-result {
        padding: 10px;
        height: calc(100% - 105px);
        ul {
          list-style: none;
          margin: 0px;
          padding: 0px;
          border-top: 1px solid #F8F8F8;
        }
        .parking-lot {
          height: 34px;
          line-height: 34px;
          border-bottom: 1px solid #F8F8F8;
          border-left: 1px solid #F8F8F8;
          border-right: 1px solid #F8F8F8;
          padding-left: 10px;
          color: #23262E;
          cursor: pointer;
          background-color: #FFFFFF;
          font-size: 14px;
        }
        .selected-class {
          background-color: #409EFF;
          color: #FFFFFF;
          border-left: 1px solid #ecf5ff;
          border-right: 1px solid #ecf5ff;
        }
        li:hover:not(.selected-class) {
          background-color: #ecf5ff;
          color: #66b1ff;
        }
      }
      .list-page {
        text-align: center;
      }
      .el-pagination {
        margin-top: 10px;
      }
    }
    .close-button {
      height: 130px;
      position: absolute;
      right: 0px;
      top: calc(45% - 65px);
      cursor: pointer;
      border-bottom: 20px solid transparent;
      border-left: none;
      border-right: 25px solid #393D49;
      border-top: 20px solid transparent;
      color: #fff;
      text-align: center;
      font-size: 14px;
      z-index: 1;
      .close {
        width: 20px;
        right: -23px;
        position: absolute;
      }
    }
    .close-button:hover {
      border-right: 25px solid rgba(0, 0, 0, 0.3);
      color: #333;
    }
  }

  .open-button {
    height: 130px;
    position: absolute;
    right: -25px;
    top: calc(45% - 65px);
    cursor: pointer;
    border-bottom: 20px solid transparent;
    border-left: 25px solid #393D49;
    border-right: none;
    border-top: 20px solid transparent;
    color: #fff;
    text-align: center;
    font-size: 14px;
    .open {
      width: 20px;
      left: -23px;
      position: absolute;
    }
  }

  .open-button:hover {
    color: #333;
    border-left: 25px solid rgba(0, 0, 0, 0.3);
  }

  .parking-lot-list-position.close {
    left: -300px;
  }

  .parking-lot-list-position.open {
  }

  .shade {
    position: fixed;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(200, 200, 200, .5);
    z-index: 998;
  }
</style>
