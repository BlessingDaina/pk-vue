/**
* @author: daina
* @date: 2018/11/23
* @description:
*/
<template>
  <div class="parkingListPosition">
    <el-card class="parkingListContent" shadow="hover" :body-style="{ padding: '0px' }">
      <div class="searchParkLot">
        <el-row :gutter="10">
          <el-col :span="18">
            <el-input placeholder="请输入停车场名称" v-model="parkingLotName"><i slot="prefix"
                                                                         class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" class="searchButton" @click="searchParkLot">查询</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="searchResult">
        <ul>
          <li class="parkingLot" v-for="park in parkingList" :key="park.parkingLotId"
              :class="{'selectedClass': selectedParkId === park.parkingLotId}" @click="selectParkLot(park)">
            {{park.parkingLotName}}
          </li>
        </ul>
        <el-pagination
          background
          layout="prev, pager, next"
          :total=totalPage
          :current-page=pageNum
          @current-change="handleCurrentChange"
          :page-size=pageSize
        >
        </el-pagination>
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
      parkingList: [],
      pageSize: 1,
      totalPage: 0,
      pageNum: 1
    }
  },
  created () {
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
      this.$axios.post('/api/pklot/getParkingLotList', {
        pageNum: pageNum,
        pageSize: pageSize,
        parkingLotName: parkingLotName
      }).then(response => {
        this.totalPage = response.data.data.count
        this.parkingList = response.data.data.items
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .parkingListPosition {
    overflow-y:hidden;
    .parkingListContent {
      background-color: #FFFFFF;
      margin: 20px;
      position: relative;
      text-align: left;
      .searchParkLot {
        padding: 10px;
        margin-top: 10px;
      }
      .searchResult {
        padding: 10px;
        ul {
          list-style: none;
          margin: 0px;
          padding: 0px;
          border-top: 1px solid #dcdfe6;
        }
        .parkingLot {
          height: 35px;
          line-height: 35px;
          border-bottom: 1px solid #dcdfe6;
          border-left: 1px solid #dcdfe6;
          border-right: 1px solid #dcdfe6;
          padding-left: 10px;
          color: #23262E;
          cursor: pointer;
          background-color: #FFFFFF;
          font-size: 14px;
        }
        li:hover:not(.selectedClass) {
          background-color: #ecf5ff;
          color: #66b1ff;
        }
        .selectedClass {
          background-color: #409EFF;
          color: #FFFFFF;
          border-left: 1px solid #409EFF;
          border-right: 1px solid #409EFF;
        }
      }
      .el-pagination {
        margin: 20px 0;
        float: right;
      }
    }
  }
</style>
