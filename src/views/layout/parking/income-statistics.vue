/**
* @author: daina
* @date: 2019/4/10
* @description:
*/
<template>
  <div>
    <parkList v-on:getSelectedParkLotId="getParkLotIdFromList"/>
    <div class="container" :class="{'covered':showTag}">
      <div class="income-header">
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
        <el-button type="primary" size="small" @click="getRevenue">查询</el-button>
      </div>
      <div class="income-content">
        <el-table
          :data="tableData"
          style="width: 100%;"
          :summary-method="letsTotal"
          show-summary
          :max-height="tableHeight"
        >
          <el-table-column
            prop="reportdate"
            label="日期"
            align="center"
            min-width="100"
          >
          </el-table-column>
          <el-table-column label="收入项目" align="center">
            <el-table-column
              prop="parkingAmount"
              label="临停"
              align="center"
              min-width="68">
            </el-table-column>
            <el-table-column
              prop="monthlyAmount"
              label="包月"
              align="center"
              min-width="68">
            </el-table-column>
          </el-table-column>
          <el-table-column
            label="小计"
            min-width="62"
            align="center"
            prop="amountCount">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import parkList from '../components/parkingList'
import {getFormatDateTime} from '@/utils/parking/public'
export default {
  name: 'income-statistics',
  data () {
    return {
      isAdmin: sessionStorage.getItem('isAdmin'),
      showTag: false,
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
      tableData: [],
      tableHeight: window.innerHeight - 115
    }
  },
  components: {
    parkList
  },
  methods: {
    // 从停车场列表组件获取当前选中的停车场id
    getParkLotIdFromList (data) {
      this.parkingLotId = data
      this.initData()
      this.getRevenue()
      if (this.isAdmin === '1') {
        this.showTag = true
      }
    },
    initData () {
      let date = getFormatDateTime()
      this.date = [date.monthlyFirstDay, date.today]
    },
    // 获取收入报表
    getRevenue () {
      this.$axios.post('/api/rpt/getReportRevenueList', {
        parkingLotId: this.parkingLotId,
        startDate: this.date[0],
        endDate: this.date[1]
      }).then(response => {
        this.tableData = response.data.data
      })
    },
    // 合计方法
    letsTotal (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((columns, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[columns.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] = sums[index].toFixed(2)
        } else {
          sums[index] = ''
        }
      })
      return sums
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
  }
  .income-header {
    position: relative;
    .el-button {
      margin-left: 15px;
    }
  }
  .income-content {
    margin-top: 20px;
  }
</style>
