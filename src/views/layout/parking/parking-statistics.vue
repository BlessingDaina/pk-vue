/**
* @author: daina
* @date: 2019/4/10
* @description:
*/
<template>
  <div>
    <parkList v-on:getSelectedParkLotId="getParkLotIdFromList"/>
    <div class="container">
      <div class="temp-header">
        <div class="search-input">
          <el-input v-model="searchInfo" placeholder="请输入车牌号" size="small"
                    @keyup.enter.native="getTempParking"><i slot="prefix"
                                                         class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <section class="button-group">
          <el-date-picker
            v-model="date"
            type="daterange"
            size="small"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          <el-button type="primary" size="small" @click="getFreeList">查询</el-button>
        </section>
      </div>
      <div class="temp-content">
        <el-table
          :data="tableData"
          border
          :height="tableHeight"
        >
          <el-table-column
            prop="incomeTime"
            label="付款时间"
            align="center"
            fixed="left"
            min-width="100"
          >
          </el-table-column>
          <el-table-column
            prop="incomeName"
            label="车牌号"
            fixed="left"
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
            prop="amountPayed"
            label="实付"
            align="center"
            min-width="80"
          >
          </el-table-column>
          <el-table-column
            prop="freeType"
            align="center"
            min-width="101"
          >
            <template slot="header" slot-scope="scope">
              <el-dropdown trigger="click" @command="selectFreeType"
                           placement="bottom"
                           style="width: 80px;padding: 0;text-align: center;">
                  <span class="el-dropdown-link">
                      <p class="show-menu">免费类别<i class="el-icon-arrow-down el-icon--right set-bottom"></i></p>
                      <p class="show-text">{{showText.freeType || "全部"}}</p>
                  </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item key="-1" command="">
                    全部
                  </el-dropdown-item>
                  <el-dropdown-item v-for="item in freeTypes"
                                    :class="{parkstatis:(freeTypeActive === item.categoryValue)}"
                                    :key="item.categoryValue" :command="{type:item.categoryValue, text:item.categoryName}">
                    {{item.categoryName}}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
          <el-table-column
            prop="entranceTime"
            label="入场时间"
            align="center"
            min-width="100"
          >
          </el-table-column>
          <el-table-column
            prop="exitTime"
            label="出场时间"
            align="center"
            min-width="100"
          >
          </el-table-column>
          <el-table-column
            prop="remarks"
            label="备注"
            align="center"
            min-width="120"
          >
          </el-table-column>
        </el-table>
        <el-pagination
          :disabled="totalTemp === 0"
          @size-change="pageSizeChange"
          @current-change="currentPageChange"
          :current-page="pageNum"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          background
          :total="totalTemp">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import parkList from '../components/parkingList'
import {getFormatDateTime} from '@/utils/parking/public'
export default {
  name: 'parking-statistics',
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
      totalTemp: 0,
      pageNum: 1,
      tableData: [],
      freeType: '',
      freeTypes: [],
      showText: {
        freeType: ''
      }
    }
  },
  components: {
    parkList
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
      this.initData()
      this.getFreeTypeList()
      this.getTempParking()
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
    // 获取临停记录
    getTempParking () {
      this.$axios.post('/api/rpt/getTemporaryParkingDetailList', {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        parkingLotId: this.parkingLotId,
        startDate: this.date[0],
        endDate: this.date[1],
        freeType: '',
        incomeName: ''
      }).then(response => {
        this.tableData = response.data.data.recordItems
        this.totalTemp = response.data.data.count
      })
    },
    // 分页
    pageSizeChange (val) {
      this.pageSize = val
      this.getTempParking()
    },
    currentPageChange (val) {
      this.pageNum = val
      this.getTempParking()
    },
    // 选择免费类别
    selectFreeType (obj) {
      if (obj.type === undefined) {
        this.freeType = ''
        this.freeTypeActive = ''
        this.showText.freeType = ''
      } else {
        this.freeType = obj.type
        this.freeTypeActive = obj.type
        this.showText.freeType = obj.text
      }
    },
    // 获取免费类别
    getFreeTypeList () {
      this.$axios.post('/api/pklot/getCarCategoryList', {
        parkingLotId: this.parkingLotId,
        categoryType: 2
      }).then(response => {
        this.freeTypes = response.data.data
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

  .temp-header {
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
  .temp-content {
    margin-top: 20px;
  }
  /deep/ .temp-content .el-table th > .cell{
    height: 36px;
    line-height: 36px;
  }
  .parkstatis{
    background: #409EFF;
    color: #fff;
  }
  .show-menu{
    line-height: 18px;
    margin: 0;
  }
  .show-text{
    line-height: 18px;
    font-size: 12px;
    margin: 0;
    color: #66b1ff;
  }
</style>
