/**
* @author: daina
* @date: 2019/3/24
* @description:
*/
<template>
  <div v-show="parkingLotId">
    <parkList v-on:getSelectedParkLotId="getParkLotIdFromList"/>
    <div class="container" :class="{'covered':showTag}">
      <div class="black-header">
        <div class="search-input">
          <el-input v-model="searchInfo" placeholder="请输入车牌、备注信息" size="small"
                    @keyup.enter.native="getBlackCarList"><i slot="prefix"
                                                             class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <section class="button-group">
          <el-button type="primary" size="small" @click="getBlackCarList">查询</el-button>
          <el-button type="primary" size="small" @click="openBlackModel">添加
          </el-button>
          <el-button type="primary" size="small" @click="exportOn">导出
          </el-button>
        </section>
      </div>
      <el-tabs v-model="status" @tab-click="handleClick">
        <el-tab-pane label="全部" name="1"></el-tab-pane>
        <el-tab-pane label="已失效" name="0"></el-tab-pane>
      </el-tabs>
      <div class="black-content">
        <el-table
          :data="blackCarList"
          border
          :height="tableHeight"
          style="width: 100%">
          <el-table-column
            prop="carLicense"
            label="车牌号"
            fixed
            min-width="80"
            align="center"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="restrictType"
            label="期限"
            min-width="80"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{scope.row.restrictType? '限时':'永久'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="startDate"
            label="开始日期"
            min-width="80"
            align="center"
          >
            <template slot-scope="scope">
              {{scope.row.startDate?scope.row.startDate: '-'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="endDate"
            label="截止日期"
            min-width="80"
            align="center"
          >
            <template slot-scope="scope">
              {{scope.row.endDate?scope.row.endDate: '-'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="remarks"
            label="备注"
            min-width="100"
            align="center"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            label="操作"
            width="200"
            fixed="right"
            align="center"
          >
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="openBlackModel(scope.row)">编辑</el-button>
              <el-button type="danger" size="mini" @click="deleteModel(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :disabled="totalCar === 0"
          class="table-page"
          @size-change="pageSizeChange"
          @current-change="currentPageChange"
          :current-page="pageNum"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          background
          :total="totalCar">
        </el-pagination>
      </div>
    </div>
    <el-dialog
      title="黑名车辆信息"
      :visible.sync="blackCarDialogVisible"
      width="600px"
      top="10vh"
      :close-on-click-modal="false"
      custom-class="black-dialog"
      @close="cancelSubmit()"
    >
      <div class="black-car-info">
        <el-form :model="blackCarInfo" :rules="blackCarRule" ref="blackCarForm" size="mini"
                 label-width="300px"
                 label-position="left">
          <el-form-item label="车牌号" prop="carLicense">
            <el-input v-model="blackCarInfo.carLicense" placeholder="请输入车牌号"
                      autocomplete="off" ref="carLicense"></el-input>
            <div class="explain">请输入黑名车辆车牌号码，系统将禁止其入场</div>
          </el-form-item>
          <el-form-item class="set-black-time" label="设置黑名期限" prop="expdateType">
            <el-select v-model="blackCarInfo.restrictType" @change="selectRestrictType">
              <el-option label="限时" value="1"></el-option>
              <el-option label="永久" value="0"></el-option>
            </el-select>
            <div class="explain">设置黑名期限，系统可根据期限来判断是否生效</div>
            <div class="black-time" v-if="blackCarInfo.restrictType==='1'">
              <el-form-item prop="blackTime">
                <el-date-picker
                  ref="blackTime"
                  v-model="blackCarInfo.blackTime"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </el-form-item>
            </div>
            <div class="black-time" v-if="blackCarInfo.restrictType==='0'">
              <el-form-item>
                <el-date-picker
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :disabled="true"
                >
                </el-date-picker>
              </el-form-item>
            </div>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input v-model="blackCarInfo.remarks" placeholder="请输入备注信息"
                      autocomplete="off" ref="remarks"></el-input>
            <div class="explain">请输入其他备注信息</div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cancelSubmit">取 消</el-button>
            <el-button size="mini" type="primary" @click="saveBlackCar">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog
      title="删除提示"
      :visible.sync="deleteDialogVisible"
      width="350px"
      :close-on-click-modal="false"
      top="30vh"
    >
      <el-form ref="form" :model="blackCarInfo" size="mini">
        <div class="statusPrompt">
          <i class="iconfont icon-wenhao"></i>
          <span>确定删除黑名车辆：{{blackCarInfo.carLicense}} ?</span>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="deleteDialogVisible = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="deleteBlackCar">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import {isVehicleNumber} from '@/utils/parking/verify'
import parkList from '../components/parkingList'
import {exportExcel} from '@/api/export'
export default {
  name: 'black-car',
  data () {
    let carLicenseValidation = (rule, value, callback) => {
      if (!isVehicleNumber(value)) {
        callback(new Error('请输入正确的车牌号'))
      } else {
        if (this.originalCarLicense !== value) {
          this.$axios.post('/api/pklot/getIsUsedCarLicense', {
            carLicense: value,
            parkingLotId: this.parkingLotId
          }).then(response => {
            if (response.data.data === 1) {
              callback(new Error('该车牌号已存在'))
            } else {
              callback()
            }
          })
        } else {
          callback()
        }
      }
    }
    return {
      isAdmin: sessionStorage.getItem('isAdmin'),
      showTag: false,
      parkingLotId: '',
      tableHeight: this.tableHeights(),
      status: '1',
      searchInfo: '',
      pageNum: 1,
      pageSize: 20,
      totalCar: 1,
      blackCarList: [],
      blackCarInfo: {},
      originalCarLicense: '',
      blackCarDialogVisible: false,
      deleteDialogVisible: false,
      blackCarRule: {
        carLicense: [
          {required: true, message: '请输入车牌号', trigger: 'blur'},
          {validator: carLicenseValidation, trigger: 'blur'}
        ],
        blackTime: [
          {required: true, message: '请填写黑名期限', trigger: 'blur'}
        ]
      }
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
      this.getBlackCarList()
      if (this.isAdmin === '1') {
        this.showTag = true
      }
    },
    // 获取黑名车辆
    getBlackCarList () {
      this.$axios.post('/api/pklot/getSpecialCarListByPage', {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        specialType: 1,
        parkingLotId: this.parkingLotId,
        status: this.status,
        searchInfo: this.searchInfo
      }).then(response => {
        this.blackCarList = response.data.data.items
        this.totalCar = response.data.data.rowCount
      })
    },
    // 切换选项卡
    handleClick (tab, event) {
      this.status = tab.name
      this.getBlackCarList()
    },
    // 调整表格高度
    tableHeights () {
      return window.innerHeight - 210
    },
    // 分页
    pageSizeChange (val) {
      this.pageSize = val
      this.getBlackCarList()
    },
    currentPageChange (val) {
      this.pageNum = val
      this.getBlackCarList()
    },
    // 打开弹出层
    openBlackModel (blackCarInfo) {
      if (blackCarInfo.specialCarId) {
        this.originalCarLicense = blackCarInfo.carLicense
        this.blackCarInfo = JSON.parse(JSON.stringify(blackCarInfo))
        this.blackCarInfo.restrictType = String(this.blackCarInfo.restrictType)
        if (this.blackCarInfo.startDate) {
          this.$set(this.blackCarInfo, 'blackTime', [blackCarInfo.startDate, blackCarInfo.endDate])
        }
      } else {
        this.originalCarLicense = ''
        this.blackCarInfo = {
          parkingLotId: this.parkingLotId,
          carLicense: '',
          categoryId: '',
          categoryName: '',
          endDate: '',
          remarks: '',
          restrictType: '1',
          startDate: '',
          specialType: 1
        }
      }
      this.blackCarDialogVisible = true
    },
    // 取消提交
    cancelSubmit () {
      this.blackCarDialogVisible = false
      this.$refs['blackCarForm'].clearValidate()
    },
    // 保存黑名车辆
    saveBlackCar () {
      let failedFields = {}
      if (this.blackCarInfo.blackTime) {
        this.blackCarInfo.startDate = this.blackCarInfo.blackTime[0]
        this.blackCarInfo.endDate = this.blackCarInfo.blackTime[1]
      }
      if (this.blackCarInfo.restrictType === '0') {
        this.blackCarInfo.startDate = ''
        this.blackCarInfo.endDate = ''
      }
      this.$refs['blackCarForm'].validate((valid, invalidFields) => {
        if (valid) {
          if (this.blackCarInfo.specialCarId) {
            this.$axios.post('/api/pklot/updateSpecialCar', this.blackCarInfo).then(response => {
              if (response.data.data === 1) {
                this.blackCarDialogVisible = false
                this.$message.success('修改成功')
                this.getBlackCarList()
                this.$refs['blackCarForm'].clearValidate()
              }
            })
          } else {
            this.$axios.post('/api/pklot/addSpecialCar', this.blackCarInfo).then(response => {
              if (response.data.data === 1) {
                this.blackCarDialogVisible = false
                this.$message.success('添加成功')
                this.getBlackCarList()
                this.$refs['blackCarForm'].clearValidate()
              }
            })
          }
        } else {
          console.log('验证失败')
          failedFields = invalidFields
          let obj = {}
          for (obj in failedFields) {
            this.$refs[obj].focus()
            console.log(obj)
            break
          }
        }
      })
    },
    // 打开删除弹出层
    deleteModel (blackCarInfo) {
      this.deleteDialogVisible = true
      this.blackCarInfo = blackCarInfo
    },
    // 删除黑名车辆
    deleteBlackCar () {
      this.$axios.post('/api/pklot/deleteSpecialCar', {
        specialCarId: this.blackCarInfo.specialCarId
      }).then(response => {
        if (response.data.data === 1) {
          this.deleteDialogVisible = false
          this.$message.success('删除成功')
          this.getBlackCarList()
        }
      })
    },
    // 切换限时/永久
    selectRestrictType (type) {
      if (type === '0') {
        this.blackCarInfo.blackTime = []
      }
    },
    // 导出
    exportOn () {
      let data = {
        specialType: 1,
        carMessage: this.searchInfo,
        parkingLotId: this.parkingLotId,
        status: this.status
      }
      exportExcel('/api/pklot/exportSpecialCar', data, '黑名车辆统计')
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

  .black-header {
    position: relative;
    .search-input {
      margin-right: 210px;
    }
    .button-group {
      position: absolute;
      right: 0;
      top: 0;
    }
  }

  .mobile .search-input {
    margin-right: 70px;
  }

  .black-content {
    /deep/ {
      .el-button--mini, .el-button--mini.is-round {
        padding: 5px 8px;
      }
    }
  }
  .black-dialog {
    .black-car-info {
      .el-form-item {
        /deep/ {
          .el-form-item__label {
            font-weight: bold;
            color: #444444;
            line-height: 18px;
          }
          .el-input {
            width: 240px;
          }
        }
        position: relative;
        height: 45px;
        width: 98%;
        border-bottom: 1px solid #eeeeee;
        margin-bottom: 10px;
        .explain {
          position: absolute;
          left: -300px;
          font-size: 12px;
          color: #676A6C;
          top: 11px;
        }
      }
      .set-black-time {
        height: 85px;
        .black-time {
          position: absolute;
          left: -300px;
          top: 45px;
          .el-date-editor {
            width: 540px;
          }
          .el-form-item {
            border-bottom: 1px solid #ffffff;
          }
        }
      }
    }
  }
  .statusPrompt {
    position: relative;
    .icon-wenhao {
      font-size: 30px;
      color: #f5cb14;
    }
    span {
      position: absolute;
      top: 5px;
      left: 40px;
    }
  }
</style>
