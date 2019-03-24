/**
* @author: daina
* @date: 2019/3/24
* @description:
*/
<template>
  <div>
    <parkList v-on:getSelectedParkLotId="getParkLotIdFromList"/>
    <div class="container">
      <div class="free-header">
        <div class="search-input">
          <el-input v-model="searchInfo" placeholder="请输入车牌、备注信息" size="small"
                    @keyup.enter.native="getFreeList"><i slot="prefix"
                                                         class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <section class="button-group">
          <el-button type="primary" size="small" @click="getFreeList">查询</el-button>
          <el-button type="primary" size="small" @click="openFreeModel">添加
          </el-button>
          <!--<inputExcle @getResult="getMyExcelData"/>-->
          <!--<el-button type="primary" size="small" @click="exportOn">导出-->
          <!--</el-button>-->
          <!--<el-button type="primary" size="small" @click="downloadTemplate">-->
            <!--下载模板-->
          <!--</el-button>-->
        </section>
      </div>
      <el-tabs v-model="status" @tab-click="handleClick">
        <el-tab-pane label="全部" name="1"></el-tab-pane>
        <el-tab-pane label="已失效" name="0"></el-tab-pane>
      </el-tabs>
      <div class="free-content">
        <el-table
          :data="freeCarList"
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
            prop="categoryName"
            label="免费类别"
            min-width="80"
            align="center"
            :show-overflow-tooltip="true"
          >
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
            width="150"
            fixed="right"
            align="center"
          >
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="openFreeModel(scope.row)">编辑</el-button>
              <el-button type="danger" size="mini" @click="deleteModel(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :disabled="totalCar === 0"
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
      title="免费车辆信息"
      :visible.sync="freeCarDialogVisible"
      width="600px"
      top="10vh"
      :close-on-click-modal="false"
      custom-class="free-dialog"
      @close="cancelSubmit()"
    >
      <div class="free-car-info">
        <el-form :model="freeCarForm" :rules="freeCarRule" ref="freeCarForm" size="mini"
                 label-width="300px"
                 label-position="left">
          <el-form-item label="车牌号" prop="carLicense">
            <el-input v-model="freeCarForm.carLicense" placeholder="请输入车牌号"
                      autocomplete="off" ref="carLicense"></el-input>
            <div class="explain">请输入免费车辆车牌号码，系统将自动放行</div>
          </el-form-item>
          <el-form-item label="设置免费类别" prop="categoryId">
            <el-select v-model="freeCarForm.categoryId" placeholder="请选择免费类别">
              <el-option v-for="carType in carCategoryList" :key="carType.categoryId"
                         :value="carType.categoryId" :label="carType.categoryName"></el-option>
            </el-select>
            <div class="explain">选择车辆类别</div>
          </el-form-item>
          <el-form-item class="set-free-time" label="设置免费期限" prop="expdateType">
            <el-select v-model="freeCarForm.restrictType" @change="selectRestrictType">
              <el-option label="限时" value="1"></el-option>
              <el-option label="永久" value="0"></el-option>
            </el-select>
            <div class="explain">设置免费期限，系统可根据期限来判断是否生效</div>
            <div class="free-time" v-if="freeCarForm.restrictType==='1'">
              <el-form-item prop="freeTime">
                <el-date-picker
                  ref="freeTime"
                  v-model="freeCarForm.freeTime"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </el-form-item>
            </div>
            <div class="free-time" v-if="freeCarForm.restrictType==='0'">
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
            <el-input v-model="freeCarForm.remarks" placeholder="请输入备注信息"
                      autocomplete="off" ref="remarks"></el-input>
            <div class="explain">请输入其他备注信息</div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cancelSubmit">取 消</el-button>
            <el-button size="mini" type="primary" @click="saveFreeCar">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog
      title="删除提示"
      :visible.sync="deleteDialogVisible"
      width="350px"
      :close-on-click-modal="false"
      top="30vh"
    >
      <el-form ref="form" :model="freeCarForm" size="mini">
        <div class="statusPrompt">
          <i class="iconfont icon-wenhao"></i>
          <span>确定删除免费车辆：{{freeCarForm.carLicense}} ?</span>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="deleteDialogVisible = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="deleteFreeCar">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import {isVehicleNumber} from '@/utils/parking/verify'
import parkList from '../components/parkingList'
export default {
  name: 'free-car',
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
      tableHeight: this.tableHeights(),
      searchInfo: '',
      parkingLotId: '',
      pageSize: 10,
      totalCar: 0,
      pageNum: 1,
      freeCarList: [],
      status: '1',
      freeCarDialogVisible: false,
      deleteDialogVisible: false,
      importDialogVisible: false,
      freeCarForm: {},
      carCategoryList: [],
      originalCarLicense: '',
      freeCarRule: {
        carLicense: [
          {required: true, message: '请输入车牌号', trigger: 'blur'},
          {validator: carLicenseValidation, trigger: 'blur'}
        ],
        freeTime: [
          {required: true, message: '请填写免费期限', trigger: 'blur'}
        ]
      },
      importData: [],
      errMsgs: [],
      returnErrMsgs: []
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
      this.getFreeList()
    },
    // 调整表格高度
    tableHeights () {
      return window.innerHeight - 210
    },
    // 获取免费车辆列表
    getFreeList () {
      this.$axios.post('/api/pklot/getSpecialCarListByPage', {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        specialType: 0,
        parkingLotId: this.parkingLotId,
        status: this.status,
        searchInfo: this.searchInfo
      }).then(response => {
        this.freeCarList = response.data.data.items
        this.totalCar = response.data.data.count
      })
    },
    // 切换选项卡
    handleClick (tab, event) {
      this.status = tab.name
      this.getFreeList()
    },
    // 分页
    pageSizeChange (val) {
      this.pageSize = val
      this.getFreeList()
    },
    currentPageChange (val) {
      this.pageNum = val
      this.getFreeList()
    },
    // 打开弹出层
    openFreeModel (freeCarInfo) {
      if (freeCarInfo.specialCarId) {
        this.originalCarLicense = freeCarInfo.carLicense
        this.freeCarForm = JSON.parse(JSON.stringify(freeCarInfo))
        this.freeCarForm.restrictType = String(freeCarInfo.restrictType)
        if (this.freeCarForm.startDate) {
          this.$set(this.freeCarForm, 'freeTime', [freeCarInfo.startDate, freeCarInfo.endDate])
        }
        if (this.freeCarForm.categoryId === '0') {
          this.freeCarForm.categoryId = ''
        }
      } else {
        this.originalCarLicense = ''
        this.freeCarForm = {
          parkingLotId: this.parkingLotId,
          carLicense: '',
          categoryId: '',
          categoryName: '',
          endDate: '',
          remarks: '',
          restrictType: '1',
          startDate: '',
          specialType: 0
        }
      }
      this.freeCarDialogVisible = true
      this.getCarType()
    },
    // 获取车辆类别
    getCarType () {
      this.$axios.post('/api/pklot/getCarCategoryList', {
        parkingLotId: this.parkingLotId,
        categoryType: 2
      }).then(response => {
        this.carCategoryList = response.data.data
      })
    },
    // 取消提交
    cancelSubmit () {
      this.freeCarDialogVisible = false
      this.$refs['freeCarForm'].clearValidate()
    },
    // 保存免费车辆
    saveFreeCar () {
      let failedFields = {}
      if (this.freeCarForm.freeTime) {
        this.freeCarForm.startDate = this.freeCarForm.freeTime[0]
        this.freeCarForm.endDate = this.freeCarForm.freeTime[1]
      }
      if (this.freeCarForm.restrictType === '0') {
        this.freeCarForm.startDate = ''
        this.freeCarForm.endDate = ''
      }
      console.log(this.freeCarForm)
      this.$refs['freeCarForm'].validate((valid, invalidFields) => {
        if (valid) {
          if (this.freeCarForm.specialCarId) {
            console.log(368)
            this.$axios.post('/api/pklot/updateSpecialCar', this.freeCarForm).then(response => {
              if (response.data.data === 1) {
                this.freeCarDialogVisible = false
                this.$message.success('修改成功')
                this.getFreeList()
                this.$refs['freeCarForm'].clearValidate()
              }
            })
          } else {
            this.$axios.post('/api/pklot/addSpecialCar', this.freeCarForm).then(response => {
              if (response.data.data === 1) {
                this.freeCarDialogVisible = false
                this.$message.success('添加成功')
                this.getFreeList()
                this.$refs['freeCarForm'].clearValidate()
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
    deleteModel (freeCarInfo) {
      this.deleteDialogVisible = true
      this.freeCarForm = freeCarInfo
    },
    // 删除免费车辆
    deleteFreeCar () {
      this.$axios.post('/api/pklot/deleteSpecialCar', {
        specialCarId: this.freeCarForm.specialCarId
      }).then(response => {
        if (response.data.data === 1) {
          this.deleteDialogVisible = false
          this.$message.success('删除成功')
          this.getFreeList()
        }
      })
    },
    // 切换限时/永久
    selectRestrictType (type) {
      if (type === '0') {
        this.freeCarForm.freeTime = []
      }
    }
  }
}
</script>

<style scoped lang="scss">
  /deep/ {
    .el-pagination {
      margin-top: 15px;
      float: right;
    }
  }
  .container {
    margin-left: 310px !important;
    font-size: 14px;
    color: #333;
    padding: 0px;
    margin-left: 0px;
    height: calc(100vh - 75px);
  }

  .free-header {
    position: relative;
    .search-input {
      margin-right: 375px;
    }
    .button-group {
      position: absolute;
      right: 0;
      top: 0;
    }
  }
  .free-dialog {
    .free-car-info {
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
      .set-free-time {
        height: 85px;
        .free-time {
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
