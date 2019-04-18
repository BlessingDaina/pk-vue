/**
* @author: daina
* @date: 2019/4/10
* @description:
*/
<template>
  <div v-show="parkingLotId">
    <parkList v-on:getSelectedParkLotId="getParkLotIdFromList"/>
    <div class="container" :class="{'covered':showTag}">
      <div class="monthly-income-header">
        <div class="search-input">
          <el-input v-model="carLicense" placeholder="请输入车牌号" size="small"
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
      <div class="monthly-income-content">
        <el-table
          :data="tableData"
          style="width: 100%;"
          border
          class="table"
          :height="tableHeight"
        >
          <el-table-column
            prop="extendDate"
            label="支付时间"
            align="center"
            min-width="170"
          >
          </el-table-column>
          <el-table-column
            prop="roomNumber"
            label="房号"
            align="center"
            min-width="100"
          >
          </el-table-column>
          <el-table-column
            prop="ownerName"
            label="车主"
            align="center"
            min-width="100"
          >
          </el-table-column>
          <el-table-column
            prop="carLicense"
            label="车牌号"
            align="center"
            min-width="100"
          >
          </el-table-column>
          <el-table-column
            prop="expdatStart"
            label="包月起始"
            align="center"
            min-width="100"
          >
          </el-table-column>
          <el-table-column
            prop="expdateEnd"
            label="包月终止"
            align="center"
            min-width="100"
          >
          </el-table-column>
          <el-table-column
            prop="amountReceivable"
            label="应付"
            align="center"
            min-width="80"
          >
          </el-table-column>
          <el-table-column
            prop="actPay"
            label="实付"
            align="center"
            min-width="80"
          >
          </el-table-column>
          <el-table-column
            prop="remarks"
            label="备注"
            align="center"
            min-width="100"
          >
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        :disabled="totalMonthly === 0"
        @size-change="pageSizeChange"
        @current-change="currentPageChange"
        :current-page="pageNum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        background
        :total="totalMonthly">
      </el-pagination>
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
    },
    // 分页
    pageSizeChange (val) {
      this.pageSize = val
      this.getMonthlyIncome()
    },
    currentPageChange (val) {
      this.pageNum = val
      this.getMonthlyIncome()
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
  .monthly-income-content {
    margin-top: 20px;
  }
</style>
