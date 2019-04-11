/**
* @author: daina
* @date: 2019/3/24
* @description:
*/
<template>
  <div>
    <parkList v-on:getSelectedParkLotId="getParkLotIdFromList"/>
    <div class="container" :class="{'covered':showTag}">
      <div class="temp-header">
        <div class="search-input">
          <el-input v-model="searchInfo" placeholder="请输入车牌" size="small"
                    @keyup.enter.native="getTempCarList"><i slot="prefix"
                                                            class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <section class="button-group">
          <el-button type="primary" size="small" @click="getTempCarList">查询</el-button>
          <el-button type="primary" size="small" @click="openTempModel">添加
          </el-button>
          <!--<inputExcle @getResult="getMyExcelData"/>-->
          <!--<el-button type="primary" size="small" @click="exportOn" v-if="$store.state.layout.device!='mobile'">导出-->
          <!--</el-button>-->
          <!--<el-button type="primary" size="small"-->
                     <!--v-if="$store.state.layout.device!='mobile'" @click="downloadTemplate">-->
            <!--下载模板-->
          <!--</el-button>-->
        </section>
      </div>
      <el-tabs v-model="tempType" @tab-click="handleClick">
        <el-tab-pane v-for="type in tempTypeList" :name="type.categoryId" :key="type.categoryId"
                     :label="type.categoryName"></el-tab-pane>
      </el-tabs>
      <div class="temp-content">
        <el-table
          :data="tempCarList"
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
            prop="categoryName"
            label="临停类型"
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
            width="200"
            fixed="right"
            align="center"
          >
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="openTempModel(scope.row)">编辑</el-button>
              <el-button type="danger" size="mini" @click="deleteModel(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :disabled="totalCar === 0"
          class="table-page"
          @size-change="pageSizeChange"
          @current-change="currentPageChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          background
          :total="totalCar">
        </el-pagination>
      </div>
    </div>
    <el-dialog
      title="临停车辆信息"
      :visible.sync="tempCarDialogVisible"
      width="600px"
      top="10vh"
      :close-on-click-modal="false"
      custom-class="temp-dialog"
      @close="cancelSubmit()"
    >
      <div class="temp-car-info">
        <el-form :model="tempCarForm" :rules="tempCarRule" ref="tempCarForm" size="mini"
                 label-width="300px"
                 label-position="left">
          <el-form-item label="车牌号" prop="carLicense">
            <el-input v-model="tempCarForm.carLicense" placeholder="请输入车牌号"
                      autocomplete="off" ref="carLicense"></el-input>
            <div class="explain">请输入临停车辆车牌号码</div>
          </el-form-item>
          <el-form-item label="设置临停类别" prop="categoryId">
            <el-select v-model="tempCarForm.categoryId" placeholder="请选择免费类别">
              <el-option v-for="carType in carCategoryList" :key="carType.categoryId"
                         :value="carType.categoryId" :label="carType.categoryName"></el-option>
            </el-select>
            <div class="explain">选择车辆临停类别</div>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input v-model="tempCarForm.remarks" placeholder="请输入备注信息"
                      autocomplete="off" ref="remarks"></el-input>
            <div class="explain">请输入其他备注信息</div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cancelSubmit">取 消</el-button>
            <el-button size="mini" type="primary" @click="saveTempCar">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog
      title="删除提示"
      :visible.sync="deleteDialogVisible"
      width="350px"
      :close-on-click-modal="false"
      top="30vh"
    >
      <el-form ref="form" :model="tempCarForm" size="mini">
        <div class="statusPrompt">
          <i class="iconfont icon-wenhao"></i>
          <span>确定删除临停车辆：{{tempCarForm.carLicense}} ?</span>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="deleteDialogVisible = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="deleteTempCar">确 定</el-button>
        </span>
    </el-dialog>
    <!--<el-dialog-->
      <!--title="导入提示"-->
      <!--:visible.sync="importDialogVisible"-->
      <!--width="550px"-->
      <!--:close-on-click-modal="false"-->
      <!--top="15vh"-->
      <!--custom-class="import-dialog"-->
    <!--&gt;-->
      <!--<div class="err-content">-->
        <!--<p class="title" v-if="errMsgs.length !== 0">导入失败</p>-->
        <!--<div class="no-import">-->
          <!--<div class="item" v-for="(err, index) in errMsgs" :key="index">-->
            <!--<p>{{err.carLicense?err.carLicense+' ': ''}}{{err.categoryName?err.categoryName+' ':''}}</p>-->
          <!--</div>-->
        <!--</div>-->
        <!--<p class="title" v-if="returnErrMsgs.length !== 0">导入成功，但部分数据导入失败</p>-->
        <!--<div class="return-err">-->
          <!--<div class="item" v-for="(err, index) in returnErrMsgs" :key="index">-->
            <!--<p>{{err.errMsg}}</p>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
      <!--<span slot="footer" class="dialog-footer">-->
          <!--<el-button size="mini" @click="importDialogVisible = false">关闭</el-button>-->
        <!--</span>-->
    <!--</el-dialog>-->
  </div>
</template>

<script>
import {isVehicleNumber} from '@/utils/parking/verify'
import parkList from '../components/parkingList'
export default {
  name: 'temporary-car',
  data () {
    let carLicenseValidation = (rule, value, callback) => {
      if (!isVehicleNumber(value)) {
        callback(new Error('请输入正确的车牌号'))
      } else {
        if (this.originalCarLicense !== value) {
          this.$axios.post('/api/pklot/getIsUsedTempCar', {
            parkingLotId: this.parkingLotId,
            carLicense: value
          }).then(response => {
            if (response.data.data !== 0) {
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
      tableHeight: this.tableHeights(),
      parkingLotId: '',
      searchInfo: '',
      tempTypeList: [],
      tempType: 'all',
      all: [{
        categoryId: 'all',
        categoryName: '全部'
      }],
      currentPage: 1,
      pageSize: 20,
      totalCar: 0,
      tempCarList: [],
      carCategoryList: [],
      tempCarDialogVisible: false,
      deleteDialogVisible: false,
      importDialogVisible: false,
      tempCarForm: {
        parkingLotId: this.parkingLotId,
        carLicense: '',
        categoryId: '',
        remarks: ''
      },
      tempCarRule: {
        carLicense: [
          {required: true, message: '请输入车牌号', trigger: 'blur'},
          {validator: carLicenseValidation, trigger: 'blur'}
        ]
      },
      originalCarLicense: '',
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
      this.getTempType()
      this.getTempCarList()
      if (this.isAdmin === '1') {
        this.showTag = true
      }
    },
    // 获取临停类型
    getTempType () {
      this.$axios.post('/api/pklot/getCarCategoryList', {
        parkingLotId: this.parkingLotId,
        categoryType: 4
      }).then(response => {
        this.tempTypeList = this.all.concat(response.data.data)
        this.carCategoryList = response.data.data
      })
    },
    // 获取临停车辆
    getTempCarList () {
      this.$axios.post('/api/pklot/getTempCarListByPage', {
        parkingLotId: this.parkingLotId,
        categoryId: this.tempType,
        searchInfo: this.searchInfo,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }).then(response => {
        this.tempCarList = response.data.data.items
        this.totalCar = response.data.data.count
      })
    },
    // 分页
    pageSizeChange (val) {
      this.pageSize = val
      this.getTempCarList()
    },
    currentPageChange (val) {
      this.currentPage = val
      this.getTempCarList()
    },
    // 调整表格高度
    tableHeights () {
      return window.innerHeight - 210
    },
    // 切换临停类型
    handleClick (tab, event) {
      console.log(tab)
      this.tempType = tab.name
      this.getTempCarList()
    },
    // 打开弹出层
    openTempModel (tempCarInfo) {
      console.log(tempCarInfo)
      if (tempCarInfo.tempCarId) {
        this.originalCarLicense = tempCarInfo.carLicense
        this.tempCarForm = JSON.parse(JSON.stringify(tempCarInfo))
      } else {
        this.originalCarLicense = ''
        this.tempCarForm = {
          parkingLotId: this.parkingLotId,
          carLicense: '',
          categoryId: '',
          remarks: ''
        }
        console.log(this.tempCarForm)
      }
      this.tempCarDialogVisible = true
      this.getTempType()
    },
    // 取消提交
    cancelSubmit () {
      this.tempCarDialogVisible = false
      this.$refs['tempCarForm'].clearValidate()
    },
    // 保存
    saveTempCar () {
      let failedFields = {}
      console.log(this.tempCarForm)
      console.log(356)
      this.$refs['tempCarForm'].validate((valid, invalidFields) => {
        console.log(invalidFields)
        console.log(356)
        if (valid) {
          if (this.tempCarForm.tempCarId) {
            this.$axios.post('/api/pklot/updateTempCar', this.tempCarForm).then(response => {
              if (response.data.data === 1) {
                this.tempCarDialogVisible = false
                this.$message.success('修改成功')
                this.getTempCarList()
                this.$refs['tempCarForm'].clearValidate()
              }
            })
          } else {
            this.$axios.post('/api/pklot/addTempCar', this.tempCarForm).then(response => {
              if (response.data.data === 1) {
                this.tempCarDialogVisible = false
                this.$message.success('添加成功')
                this.getTempCarList()
                this.$refs['tempCarForm'].clearValidate()
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
    deleteModel (tempCarInfo) {
      this.deleteDialogVisible = true
      this.tempCarForm = tempCarInfo
    },
    // 删除免费车辆
    deleteTempCar () {
      this.$axios.post('/api/pklot/deleteTempCar', {
        tempCarId: this.tempCarForm.tempCarId
      }).then(response => {
        this.deleteDialogVisible = false
        this.$message.success('删除成功')
        this.getTempCarList()
      })
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

  .temp-header {
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

  .temp-content {
    /deep/ {
      .el-button--mini, .el-button--mini.is-round {
        padding: 5px 8px;
      }
    }
  }

  .temp-dialog {
    .temp-car-info {
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

  .import-dialog {
    .err-content {
      max-height: 350px;
      overflow: auto;
      .title {
        text-align: center;
        font-size: 16px;
        color: #f86038;
        margin: 0;
      }
    }
  }
</style>
