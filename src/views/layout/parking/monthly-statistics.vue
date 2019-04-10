/**
* @author: daina
* @date: 2019/4/10
* @description:
*/
<template>
  <div>
    <parkList v-on:getSelectedParkLotId="getParkLotIdFromList"/>
    <div class="container">
      <div class="monthly-income-header">
        <div class="search-input">
          <el-input v-model="carLicense" placeholder="请输入车牌、备注信息" size="small"
                    @keyup.enter.native="getMonthlyIncome"><i slot="prefix"
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
          <el-button type="primary" size="small" @click="getMonthlyIncome">查询</el-button>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import parkList from '../components/parkingList'
import {getFormatDateTime} from '@/utils/parking/public'
export default {
  name: 'monthly-statistics',
  data () {
    return {
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
      pageSize: 10,
      totalMonthly: 0,
      pageNum: 1,
      tableData: [],
      carLicense: ''
    }
  },
  mounted () {
    let _this = this
    window.addEventListener('resize', function temp () {
      _this.tableHeight = _this.tableHeights()
    })
  },
  components: {
    parkList
  },
  methods: {
    // 从停车场列表组件获取当前选中的停车场id
    getParkLotIdFromList (data) {
      this.parkingLotId = data
      this.initData()
      this.getMonthlyIncome()
    },
    // 调整表格高度
    tableHeights () {
      return window.innerHeight - 170
    },
    // 初始化搜索条件
    initData () {
      let date = getFormatDateTime()
      this.date = [date.monthlyFirstDay, date.today]
    },
    // 获取包月统计
    getMonthlyIncome () {
      this.$axios.post('/api/pklot/getMonthlyIncomeList', {
        parkingLotId: this.parkingLotId,
        carLicense: this.carLicense,
        startDate: this.date[0],
        endDate: this.date[1],
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(response => {
        this.tableData = response.data.data.recordItems
        this.totalMonthly = response.data.data.count
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .container {
    margin-left: 310px !important;
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

  .monthly-income-header {
    position: relative;
    .search-input {
      margin-right: 430px;
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
</style>
