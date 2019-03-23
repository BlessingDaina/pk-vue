/**
* @author: daina
* @date: 2019/3/23
* @description:
*/
<template>
  <div>
    <parkList v-on:getSelectedParkLotId="getParkLotIdFromList"/>
    <div class="container">
      <el-scrollbar style="height: 100%">
        <el-card shadow="hover">
          <div slot="header">
            <strong class="type-title">包月类型</strong><br>
            <span class="explain">设置包月车辆的包月类型</span>
          </div>
          <div class="type-content">
            <el-button size="small" v-for="item in monthlyTypeList" :key="item.categoryId" type="primary"  plain @click="deleteModel(item, 1)">{{item.categoryName}}<i class="el-icon-circle-close-outline el-icon--right"></i></el-button>
            <el-button size="small" class="add" type="primary" @click="addTypeModel(1)"
                       icon="el-icon-circle-plus-outline" :disabled="monthlyTypeList.length === 10">添加
            </el-button>
          </div>
        </el-card>
        <el-card shadow="hover" class="type-card">
          <div slot="header">
            <strong class="type-title">免费车辆类型</strong><br>
            <span class="explain">设置免费车辆类型</span>
          </div>
          <div class="type-content">
            <el-button size="small" @click="deleteModel(item, 2)" v-for="item in freeTypeList" :key="item.categoryId" type="primary"  plain>{{item.categoryName}}<i class="el-icon-circle-close-outline el-icon--right"></i></el-button>
            <el-button size="small" class="add" type="primary" @click="addTypeModel(2)"
                       icon="el-icon-circle-plus-outline" :disabled="freeTypeList.length === 10">添加
            </el-button>
          </div>
        </el-card>
        <el-card shadow="hover" class="type-card">
          <div slot="header">
            <strong class="type-title">免费放行类型</strong><br>
            <span class="explain">设置免费放行车辆类型</span>
          </div>
          <div class="type-content">
            <el-button size="small" @click="deleteModel(item, 3)" v-for="item in freePutTypeList" :key="item.categoryId" type="primary"  plain>{{item.categoryName}}<i class="el-icon-circle-close-outline el-icon--right"></i></el-button>
            <el-button size="small" class="add" type="primary" @click="addTypeModel(3)"
                       icon="el-icon-circle-plus-outline" :disabled="freePutTypeList.length === 10">添加
            </el-button>
          </div>
        </el-card>
        <el-card shadow="hover" class="type-card">
          <div slot="header">
            <strong class="type-title">临停车辆类型</strong><br>
            <span class="explain">设置临停车辆类型</span>
          </div>
          <div class="type-content">
            <el-button size="small" @click="deleteModel(item, 4)" v-for="item in tempTypeList" :key="item.categoryId" type="primary"  plain>{{item.categoryName}}<i class="el-icon-circle-close-outline el-icon--right"></i></el-button>
            <el-button size="small" class="add" type="primary" @click="addTypeModel(4)"
                       icon="el-icon-circle-plus-outline" :disabled="tempTypeList.length === 10">添加
            </el-button>
          </div>
        </el-card>
      </el-scrollbar>
    </div>
    <el-dialog
      title="请输入类型名称"
      :visible.sync="addDialogVisible"
      width="300px"
      :close-on-click-modal="false"
      top="30vh"
      @close="cancelSubmit()"
    >
      <div class="type-name">
        <el-form :model="typeInfo" :rules="typeInfoRule" ref="typeInfoForm" size="mini"
        >
          <el-form-item prop="categoryName">
            <el-input size="small" v-model="typeInfo.categoryName" ref="categoryName"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancelSubmit">取 消</el-button>
          <el-button size="mini" type="primary" @click="addType">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog
      title="删除提示"
      :visible.sync="deleteDialogVisible"
      width="350px"
      :close-on-click-modal="false"
      top="30vh"
    >
      <el-form ref="form" :model="categoryInfo" size="mini">
        <div class="statusPrompt">
          <i class="iconfont icon-wenhao"></i>
          <span>确定删除类型：{{categoryInfo.categoryName}} ?</span>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="deleteDialogVisible=false">取 消</el-button>
        <el-button size="mini" type="primary" @click="deleteCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import parkList from '../components/parkingList'
export default {
  name: 'car-type',
  data () {
    return {
      monthlyTypeList: [],
      freeTypeList: [],
      freePutTypeList: [],
      tempTypeList: [],
      addDialogVisible: false,
      deleteDialogVisible: false,
      typeInfo: {},
      categoryInfo: {},
      currentType: 1,
      typeInfoRule: {
        categoryName: [
          {required: true, message: '请输入类型名称', trigger: 'blur'},
          {min: 1, max: 10, message: '最多输入十个字数', trigger: 'blur'}
        ]
      }
    }
  },
  components: {
    parkList
  },
  methods: {
    // 从停车场列表组件获取当前选中的停车场id
    getParkLotIdFromList (data) {
      this.parkingLotId = data
      this.getMonthlyType()
      this.getFreeType()
      this.getFreePutType()
      this.getTempType()
    },
    // 获取包月类型
    getMonthlyType () {
      this.$axios.post('/api/pklot/getCarCategoryList', {
        parkingLotId: this.parkingLotId,
        categoryType: 1
      }).then(response => {
        this.monthlyTypeList = response.data.data
      })
    },
    // 获取免费车辆类型
    getFreeType () {
      this.$axios.post('/api/pklot/getCarCategoryList', {
        parkingLotId: this.parkingLotId,
        categoryType: 2
      }).then(response => {
        this.freeTypeList = response.data.data
      })
    },
    // 获取免费放行类型
    getFreePutType () {
      this.$axios.post('/api/pklot/getCarCategoryList', {
        parkingLotId: this.parkingLotId,
        categoryType: 3
      }).then(response => {
        this.freePutTypeList = response.data.data
      })
    },
    // 获取临停车辆类型
    getTempType () {
      this.$axios.post('/api/pklot/getCarCategoryList', {
        parkingLotId: this.parkingLotId,
        categoryType: 4
      }).then(response => {
        this.tempTypeList = response.data.data
      })
    },
    // 打开弹出层
    addTypeModel (type) {
      this.addDialogVisible = true
      this.currentType = type
      this.typeInfo = {
        categoryValue: '',
        categoryName: '',
        categoryId: '',
        parkingLotId: '',
        isDelete: 0
      }
    },
    // 取消添加
    cancelSubmit () {
      this.addDialogVisible = false
      this.$refs['typeInfoForm'].clearValidate()
    },
    // 添加类型
    addType () {
      let failedFields = {}
      this.$refs['typeInfoForm'].validate((valid, invalidFields) => {
        if (valid) {
          this.$axios.post('/api/pklot/addCarCategory', {
            parkingLotId: this.parkingLotId,
            categoryType: this.currentType,
            categoryName: this.typeInfo.categoryName
          }).then(response => {
            if (response.data.data === 1) {
              this.addDialogVisible = false
              this.$refs['typeInfoForm'].clearValidate()
              this.$message.success('保存成功')
              if (this.currentType === 1) {
                this.getMonthlyType()
              } else if (this.currentType === 2) {
                this.getFreeType()
              } else if (this.currentType === 3) {
                this.getFreePutType()
              } else if (this.currentType === 4) {
                this.getTempType()
              }
            }
          })
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
    // 删除弹出层
    deleteModel (category, type) {
      this.currentType = type
      this.deleteDialogVisible = true
      this.categoryInfo = category
    },
    // 删除类型
    deleteCategory () {
      this.$axios.post('/api/pklot/deleteCarCategory', {
        categoryId: this.categoryInfo.categoryId
      }).then(response => {
        if (response.data.data === 1) {
          this.$message.success('删除成功')
          this.deleteDialogVisible = false
          if (this.currentType === 1) {
            this.getMonthlyType()
          } else if (this.currentType === 2) {
            this.getFreeType()
          } else if (this.currentType === 3) {
            this.getFreePutType()
          } else if (this.currentType === 4) {
            this.getTempType()
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  /deep/ {
    .el-scrollbar {
      height: 100%;
    }
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
    .el-card__header {
      padding: 10px 20px;
    }
    .el-card__body {
      padding: 10px 20px;
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

  .type-card {
    margin-top: 15px;
  }

  .type-title {
    font-size: 16px;
  }

  .explain {
    font-size: 12px;
    color: #676A6C;
  }

  .type-content {
    /deep/ {
      .el-checkbox.is-bordered.el-checkbox--small {
        padding: 5px 15px 5px 10px;
        border-radius: 3px;
        height: 32px;
        margin-top: 10px;
        margin-right: 10px;
      }
      .el-checkbox.is-bordered + .el-checkbox.is-bordered {
        margin-left: 0px;
      }
    }
    margin-bottom: 10px;
    .add {
      margin-top: 10px;
    }
  }

  .type-name {
    margin-top: 10px;
    margin-bottom: 20px;
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
