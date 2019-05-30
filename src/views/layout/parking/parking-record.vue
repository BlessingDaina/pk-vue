/**
* @author: daina
* @date: 2019/3/24
* @description:
*/
<template>
  <div v-show="parkingLotId">
    <parkList v-on:getSelectedParkLotId="getParkLotIdFromList"/>
    <div class="container" :class="{'covered':showTag}">
      <div class="record-header">
        <div class="search-input">
          <el-input v-model="searchParam.carLicense" placeholder="输入车牌号查询" size="small"
                    @keyup.enter.native="getRecordList"><i slot="prefix"
                                                         class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <section class="button-group">
          <el-date-picker
            size="small"
            v-model="date"
            type="daterange"
            align="center"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions">
          </el-date-picker>
          <el-button type="primary" size="small" @click="getRecordList">查询</el-button>
        </section>
      </div>
      <div class="parking-record-content">
        <el-table
          ref="filterTable"
          :data="parkingRecordData"
          border
          :height="tableHeight"
          highlight-current-row
          @filter-change="handleFilterChange"
          style="width: 100%">
          <el-table-column
            prop="carLicense"
            label="车牌号"
            align="center"
            fixed
            min-width="140">
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            align="center"
            :filter-multiple=false
            filter-placement="bottom"
            :filters="status"
            column-key="status"
            min-width="120">
            <template slot-scope="scope">
              <span v-show="scope.row.status === ''">全部</span>
              <span v-show="scope.row.status === 1">在场</span>
              <span v-show="scope.row.status === 2">已离场</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="entranceTime"
            label="入场时间"
            align="center"
            min-width="160">
          </el-table-column>
          <el-table-column
            prop="exitTime"
            label="出场时间"
            align="center"
            min-width="160">
          </el-table-column>
          <el-table-column
            prop="entranceName"
            label="入场通道"
            align="center"
            min-width="180">
          </el-table-column>
          <el-table-column
            prop="exitName"
            label="出场通道"
            align="center"
            min-width="180">
          </el-table-column>
          <el-table-column
            prop="datsum"
            label="停车时长"
            align="center"
            min-width="160">
            <template slot-scope="scope">
              {{countDuration(scope.row.datsum)}}
            </template>
          </el-table-column>
          <el-table-column
            prop="parkingType"
            label="停车类型"
            align="center"
            :filter-multiple=false
            filter-placement="bottom"
            :filters="searchType"
            column-key="searchType"
            min-width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.parkingType }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="date"
            label="操作"
            fixed="right"
            align="center"
            min-width="140">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="showDetails(scope.row.recordId)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :disabled="totalRecord === 0"
          class="table-page"
          @size-change="pageSizeChange"
          @current-change="currentPageChange"
          background
          :current-page="pageNum"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRecord">
        </el-pagination>
      </div>
    </div>
    <parking-record-detail v-show="isShowDetail" :recordId="recordId" :isShowDetail="isShowDetail" @closeShade="shadeStatus" />
  </div>
</template>

<script>
import parkList from '../components/parkingList'
import parkingRecordDetail from '../components/parkingRecordDetail'
import {getFormatDateTime} from '@/utils/parking/public'
export default {
  name: 'parking-record',
  data () {
    return {
      parkingLotId: '',
      isAdmin: sessionStorage.getItem('isAdmin'),
      showTag: false,
      tableHeight: this.tableHeights(),
      pickerOptions: { // 时间限制
        disabledDate (time) {
          return time.getTime() > Date.now() // 开始时间最大为当天
        },
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24)
            end.setTime(end.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      date: [],
      searchParam: {
        parkingLotId: '',
        carLicense: '',
        startDate: '',
        endDate: '',
        searchType: '',
        status: ''
      },
      pageSize: 10,
      totalRecord: 0,
      pageNum: 1,
      parkingRecordData: [],
      status: [{
        text: '在场',
        value: 1
      }, {
        text: '已离场',
        value: 2
      }],
      searchType: [{
        text: '临停',
        value: 1
      }, {
        text: '包月',
        value: 2
      }, {
        text: '免费',
        value: 3
      }, {
        text: '无牌',
        value: 4
      }],
      recordId: '',
      isShowDetail: false
    }
  },
  components: {
    parkList,
    parkingRecordDetail
  },
  mounted () {
    let _this = this
    window.addEventListener('resize', function temp () {
      _this.tableHeight = _this.tableHeights()
    })
  },
  methods: {
    // 从停车场列表组件获取当前选中的停车场id
    getParkLotIdFromList (data) {
      this.parkingLotId = data
      this.searchParam.parkingLotId = data
      this.initData()
      this.getRecordList()
      if (this.isAdmin === '1') {
        this.showTag = true
      }
    },
    // 调整表格高度
    tableHeights () {
      return window.innerHeight - 170
    },
    // 初始化搜索条件
    initData () {
      let date = getFormatDateTime()
      this.searchParam.startDate = date.monthlyFirstDay
      this.searchParam.endDate = date.today
      this.date = [this.searchParam.startDate, this.searchParam.endDate]
      this.searchParam.searchType = ''
      this.searchParam.status = ''
    },
    // 分页
    pageSizeChange (val) {
      this.pageSize = val
      this.getRecordList()
    },
    currentPageChange (val) {
      this.pageNum = val
      this.getRecordList()
    },
    // 获取停车记录
    getRecordList () {
      this.searchParam.startDate = this.date[0]
      this.searchParam.endDate = this.date[1]
      this.$axios.post('/api/pklot/getParkingRecordByPage', {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        parkingLotId: this.searchParam.parkingLotId,
        startDate: this.searchParam.startDate,
        endDate: this.searchParam.endDate,
        carLicense: this.searchParam.carLicense,
        searchType: this.searchParam.searchType,
        status: this.searchParam.status
      }).then(response => {
        this.parkingRecordData = response.data.data.recordItems
        this.totalRecord = response.data.data.count
      })
    },
    // table过滤事件
    handleFilterChange (filters) {
      let key = Object.keys(filters)[0]
      let value = filters[key]
      if (value.length === 0) {
        this.searchParam[key] = ''
      } else {
        this.searchParam[key] = value[0]
      }
      this.pageNum = 1
      this.getRecordList()
    },
    // 转换时长
    countDuration (duration) {
      console.log(duration)
      let day = duration / (60 * 60 * 24)
      console.log(day)
      let hour = duration / (60 * 60) - day * 24
      console.log(hour)
      let min = duration / 60 - hour * 60 - day * 24 * 60
      console.log(min)
      let sec = duration - min * 60 - hour * 60 * 60 - day * 60 * 60 * 24
      console.log(sec)
      let totalTime = (day === 0 ? '' : (day + '天')) + (hour === 0 ? '' : (hour + '小时')) + (min === 0 ? '' : (min + '分')) + sec + '秒'
      return totalTime
    },
    // 显示详情面板
    showDetails (recordId) {
      this.recordId = recordId
      this.isShowDetail = true
    },
    // 接收子组件传来的隐藏状态
    shadeStatus (val) {
      this.isShowDetail = val
    }
  }
}
</script>

<style scoped lang="scss">
  .covered {
    margin-left: 315px !important;
  }
  .container {
    margin-left: 0;
    font-size: 14px;
    color: #333;
    padding: 0px;
    margin-left: 0px;
    height: calc(100vh - 75px);
    /deep/ {
      .el-pagination {
        margin-top: 15px;
        float: right;
      }
    }
  }
  .record-header {
    position: relative;
    .search-input {
      margin-right: 435px;
    }
    .button-group {
      position: absolute;
      right: 0;
      top: 0;
      .el-button {
        margin-left: 10px;
      }
    }
  }
  .parking-record-content {
    margin-top: 20px;
  }
</style>
