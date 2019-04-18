/**
* @author: daina
* @date: 2019/3/24
* @description:
*/
<template>
  <div v-show="parkingLotId">
    <parkList v-on:getSelectedParkLotId="getParkLotIdFromList"/>
    <div class="container" :class="{'covered':showTag}">
      <div class="fallible-header">
        <div class="search-input">
          <el-input v-model="searchInfo" placeholder="请输入车牌号" size="small"
                    @keyup.enter.native="getFallibleLicenseList"><i slot="prefix"
                                                                    class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <section class="button-group">
          <el-button type="primary" size="small" @click="getFallibleLicenseList">查询</el-button>
          <el-button type="primary" size="small" @click="openFallibleModel">
            添加
          </el-button>
        </section>
      </div>
      <div class="fallible-content">
        <el-table
          :data="fallibleLicenseList"
          border
          :height="tableHeight"
          style="width: 100%">
          <el-table-column
            prop="errorLicense"
            label="易错车牌标记"
            min-width="80"
            align="center"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="trueLicense"
            label="易错车牌对应正确车牌"
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
            align="center"
          >
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="openFallibleModel(scope.row)">编辑</el-button>
              <el-button type="danger" size="mini" @click="deleteModel(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :disabled="total === 0"
          class="table-page"
          @size-change="pageSizeChange"
          @current-change="currentPageChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          background
          :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog
      title="易错车牌信息"
      :visible.sync="fallibleDialogVisible"
      width="600px"
      top="10vh"
      :close-on-click-modal="false"
      custom-class="fallible-dialog"
      @close="cancelSubmit()"
    >
      <div class="fallible-info">
        <el-form :model="fallibleInfo" :rules="fallibleRule" ref="fallibleInfo" size="mini"
                 label-width="300px"
                 label-position="left">
          <el-form-item label="易错车牌" prop="errorLicense">
            <el-input v-model="fallibleInfo.errorLicense" placeholder="请输入易错车牌"
                      autocomplete="off" ref="errorLicense"></el-input>
            <div class="explain">识别结果(一个易错车牌对应一个正确车牌)</div>
          </el-form-item>
          <el-form-item label="正确车牌" prop="trueLicense">
            <el-input v-model="fallibleInfo.trueLicense" placeholder="请输入正确车牌"
                      autocomplete="off" ref="trueLicense"></el-input>
            <div class="explain">车辆本身正确车牌(一个正确车牌可对应多个易错车牌)</div>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input v-model="fallibleInfo.remarks" placeholder="请输入备注信息"
                      autocomplete="off" ref="remarks"></el-input>
            <div class="explain">请输入其他备注信息</div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cancelSubmit">取 消</el-button>
            <el-button size="mini" type="primary" @click="saveFaliibleLicense">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog
      title="删除提示"
      :visible.sync="deleteDialogVisible"
      width="350px"
      :close-on-click-modal="false"
      top="30vh"
    >
      <el-form ref="form" :model="fallibleInfo" size="mini">
        <div class="statusPrompt">
          <i class="iconfont icon-wenhao"></i>
          <span>确定删除易错车牌：{{fallibleInfo.errorLicense}} ?</span>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="deleteDialogVisible = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="deleteFallibleCar">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import {isVehicleNumber} from '@/utils/parking/verify'
import parkList from '../components/parkingList'
export default {
  name: 'fallible-license',
  data () {
    let errorLicenseValidation = (rule, value, callback) => {
      if (this.originalCarLicense !== value) {
        this.$axios.post('/api/pklot/getIsUsedErrorLicense', {
          parkingLotId: this.parkingLotId,
          errorLicense: value
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
    let trueLicenseValidation = (rule, value, callback) => {
      if (!isVehicleNumber(value)) {
        callback(new Error('请输入正确的车牌号'))
      } else {
        callback()
      }
    }
    return {
      isAdmin: sessionStorage.getItem('isAdmin'),
      showTag: false,
      tableHeight: this.tableHeights(),
      parkingLotId: '',
      searchInfo: '',
      currentPage: 1,
      pageSize: 20,
      total: 0,
      fallibleLicenseList: [],
      fallibleDialogVisible: false,
      deleteDialogVisible: false,
      fallibleInfo: {},
      fallibleRule: {
        errorLicense: [
          {required: true, message: '请输入车牌号', trigger: 'blur'},
          {validator: errorLicenseValidation, trigger: 'blur'}
        ],
        trueLicense: [
          {required: true, message: '请输入车牌号', trigger: 'blur'},
          {validator: trueLicenseValidation, trigger: 'blur'}
        ]
      },
      originalCarLicense: ''
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
      this.getFallibleLicenseList()
      if (this.isAdmin === '1') {
        this.showTag = true
      }
    },
    // 调整表格高度
    tableHeights () {
      return window.innerHeight - 170
    },
    // 获取易错车牌列表
    getFallibleLicenseList () {
      this.$axios.post('/api/pklot/getFallibleLicenseByPage', {
        parkingLotId: this.parkingLotId,
        searchInfo: this.searchInfo,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }).then(response => {
        this.fallibleLicenseList = response.data.data.items
        this.total = response.data.data.count
      })
    },
    // 分页
    pageSizeChange (val) {
      this.pageSize = val
      this.getFallibleLicenseList()
    },
    currentPageChange (val) {
      this.currentPage = val
      this.getFallibleLicenseList()
    },
    // 打开弹出层
    openFallibleModel (fallibleInfo) {
      if (fallibleInfo.fallibleId) {
        this.originalCarLicense = fallibleInfo.errorLicense
        this.fallibleInfo = JSON.parse(JSON.stringify(fallibleInfo))
      } else {
        this.originalCarLicense = ''
        this.fallibleInfo = {
          parkingLotId: this.parkingLotId
        }
      }
      this.fallibleDialogVisible = true
    },
    // 取消提交
    cancelSubmit () {
      this.fallibleDialogVisible = false
      this.$refs['fallibleInfo'].clearValidate()
    },
    // 保存
    saveFaliibleLicense () {
      let failedFields = {}
      this.$refs['fallibleInfo'].validate((valid, invalidFields) => {
        console.log(invalidFields)
        console.log(356)
        if (valid) {
          if (this.fallibleInfo.fallibleId) {
            this.$axios.post('/api/pklot/updateFallibleLicense', this.fallibleInfo).then(response => {
              if (response.data.data === 1) {
                this.fallibleDialogVisible = false
                this.$message.success('修改成功')
                this.getFallibleLicenseList()
                this.$refs['fallibleInfo'].clearValidate()
              }
            })
          } else {
            this.$axios.post('/api/pklot/addFallibleLicense', this.fallibleInfo).then(response => {
              if (response.data.data === 1) {
                this.fallibleDialogVisible = false
                this.$message.success('添加成功')
                this.getFallibleLicenseList()
                this.$refs['fallibleInfo'].clearValidate()
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
    deleteModel (fallibleInfo) {
      this.deleteDialogVisible = true
      this.fallibleInfo = fallibleInfo
    },
    // 删除免费车辆
    deleteFallibleCar () {
      this.$axios.post('/api/pklot/deleteFallibleLicense', {
        fallibleId: this.fallibleInfo.fallibleId
      }).then(response => {
        if (response.data.data === 1) {
          this.deleteDialogVisible = false
          this.$message.success('删除成功')
          this.getFallibleLicenseList()
        }
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

  .fallible-header {
    position: relative;
    .search-input {
      margin-right: 145px;
    }
    .button-group {
      position: absolute;
      right: 0;
      top: 0;
    }
  }

  .fallible-content {
    margin-top: 15px;
    /deep/ {
      .el-button--mini, .el-button--mini.is-round {
        padding: 5px 8px;
      }
    }
  }

  .fallible-dialog {
    .fallible-info {
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
</style>
