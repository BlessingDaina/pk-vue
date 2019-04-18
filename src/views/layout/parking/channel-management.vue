/**
* @author: daina
* @date: 2019/3/24
* @description:
*/
<template>
  <div v-show="parkingLotId">
    <parkList v-on:getSelectedParkLotId="getParkLotIdFromList"/>
    <div class="container" :class="{'covered':showTag}">
      <div class="channel-header">
        <div class="search-input">
          <el-input v-model="drivewayName" placeholder="请输入通道名称" size="small"
                    @keyup.enter.native="searchChannel">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <el-button class="search-button" type="primary" size="small" @click="searchChannel">查询</el-button>
      </div>
      <div class="channel-body">
        <el-tabs v-model="channelType" @tab-click="handleClick">
          <el-tab-pane label="全部" name="all"></el-tab-pane>
          <el-tab-pane label="入口" name="0"></el-tab-pane>
          <el-tab-pane label="出口" name="1"></el-tab-pane>
          <el-tab-pane label="停用" name="disable"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="channel-body-content">
        <el-scrollbar id="scrollBox" style="height: 100%">
          <div class="channel-item" v-for="item in channelList" :key="item.drivewayId">
            <span class="head">{{item.drivewayType ? '出' : '入'}}</span>
            <div class="channel-info">
              <p>{{item.parkingLotName}}</p>
              <p>
                <span class="stateIcon"></span><span class="equipmentStatus">设备正常</span>
                <el-button type="primary" size="mini" round>{{item.drivewayName}}</el-button>
                <el-button type="danger" v-show="!item.drivewayStatus" size="mini" round>停用</el-button>
              </p>
            </div>
            <section class="button-group">
              <el-button type="primary" size="small" @click="channelModelShow(item.drivewayId)">设置</el-button>
              <el-button type="danger" v-show="item.drivewayStatus" size="small" @click="statusModelShow(item)">停用</el-button>
              <el-button type="success" v-show="!item.drivewayStatus" size="small" @click="statusModelShow(item)">启用</el-button>
            </section>
          </div>
          <div class="searchPrompt" v-show="channelList.length == 0">
            <p class="error-msg">没有找到相关通道</p>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <el-dialog
      title="通道信息"
      :visible.sync="editDialogVisible"
      width="680px"
      class="dialogList"
      :close-on-click-modal="false"
      @close="cancelSubmit('nameForm')"
    >
      <el-tabs v-model="setTabType" class="tabs-btn-group">
        <el-tab-pane label="基础设置" name="basic">
          <div class="tab-content">
            <el-form ref="nameForm" :rules="rules" :model="channelInfo" size="mini" :inline-message="true"
                     label-width="120px"
                     label-position="left">
              <el-form-item prop="drivewayName" label="通道名称">
                <el-input placeholder="请输入通道名称" ref="drivewayName" v-model="channelInfo.drivewayName"></el-input>
              </el-form-item>
              <el-form-item v-show="!channelInfo.drivewayType">
                <div class="item-title">
                  <p class="set-title">是否显示剩余车位</p>
                  <p class="set-desc">设置是否显示剩余车位</p>
                </div>
                <div class="set-item-input">
                  <el-switch
                    v-model="channelInfo.isShowEmpty"
                    name="isShowEmpty"
                    active-text="是"
                    inactive-text="否"
                    :active-value="1"
                    :inactive-value="0"
                  >
                  </el-switch>
                </div>
              </el-form-item>
              <el-form-item v-show="channelInfo.drivewayType">
                <div class="item-title">
                  <p class="set-title">出口是否自动播报金额</p>
                  <p class="set-desc">设置出口是否自动播报金额</p>
                </div>
                <div class="set-item-input">
                  <el-switch
                    v-model="channelInfo.isAutoSound"
                    name="isAutoSound"
                    active-text="是"
                    inactive-text="否"
                    :active-value="1"
                    :inactive-value="0"
                  >
                  </el-switch>
                </div>
              </el-form-item>
              <el-form-item>
                <div class="item-title">
                  <p class="set-title">临时停车是否自动抬杆</p>
                  <p class="set-desc">车辆是临时停车时是否自动放行</p>
                </div>
                <div class="set-item-input">
                  <el-switch
                    v-model="channelInfo.tempAutoOpen"
                    name="tempAutoOpen"
                    active-text="是"
                    inactive-text="否"
                    :active-value="1"
                    :inactive-value="0"
                  >
                  </el-switch>
                </div>
              </el-form-item>
              <el-form-item>
                <div class="item-title">
                  <p class="set-title">包月是否自动抬杆</p>
                  <p class="set-desc">车辆在包月时是否自动放行</p>
                </div>
                <div class="set-item-input">
                  <el-switch
                    v-model="channelInfo.monthlyAutoOpen"
                    name="monthlyAutoOpen"
                    active-text="是"
                    inactive-text="否"
                    :active-value="1"
                    :inactive-value="0"
                  >
                  </el-switch>
                </div>
              </el-form-item>
              <el-form-item v-show="channelInfo.drivewayType">
                <div class="item-title">
                  <p class="set-title">无入场记录是否自动抬杆</p>
                  <p class="set-desc">设置车辆无入场记录时是否自动放行</p>
                </div>
                <div class="set-item-input">
                  <el-switch
                    v-model="channelInfo.noEntrance"
                    name="noEntrance"
                    active-text="是"
                    inactive-text="否"
                    :active-value="1"
                    :inactive-value="0"
                  >
                  </el-switch>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="时间音量" name="timeVolume">
          <div class="tab-content">
            <el-form :model="channelInfo" size="mini" :inline-message="true"
                     label-width="120px"
                     label-position="left">
              <el-form-item prop="dayStart" label="白天开始时间">
                <el-input-number placeholder="白天开始时间（0~23）" controls-position="right" :min="0" :max="23"
                                 ref="dayStart"
                                 v-model.number="channelInfo.dayStart"></el-input-number>
              </el-form-item>
              <el-form-item prop="dayVolume" label="白天音量">
                <el-input-number placeholder="白天音量（0~100）" controls-position="right" :min="0" :max="100"
                                 ref="dayVolume"
                                 v-model.number="channelInfo.dayVolume"></el-input-number>
              </el-form-item>
              <el-form-item prop="nightStart" label="夜间开始时间">
                <el-input-number placeholder="夜间开始时间（0~23）" ref="nightStart"
                                 controls-position="right" :min="0" :max="23"
                                 v-model.number="channelInfo.nightStart"></el-input-number>
              </el-form-item>
              <el-form-item prop="nightVolume" label="夜间音量">
                <el-input-number placeholder="夜间音量（0~100）" ref="nightVolume"
                                 controls-position="right" :min="0" :max="100"
                                 v-model.number="channelInfo.nightVolume"></el-input-number>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="screenParamsArray.length !=0" label="显示屏参数" name="display">
          <div class="tab-content">
            <el-form :model="channelInfo" size="mini" :inline-message="true"
                     label-width="150px"
                     label-position="left">
              <el-form-item>
                <div class="item-screen-title">
                  <p class="set-title">显示器扩展参数</p>
                  <p class="set-desc">设置显示器参数，用于显示器显示内容</p>
                  <el-row>
                    <el-col :span="12" v-for="item in screenParamsArray" :key="item.index">
                      <div class="parameter">
                        <span class="parameterIndex">第{{item.index}}行：</span>
                        <el-input maxlength="20" v-model="item.value" size="mini">
                        </el-input>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancelSubmit('nameForm')">取 消</el-button>
          <el-button size="mini" type="primary" @click="editChannel('nameForm')">确 定</el-button>
          </span>
    </el-dialog>
    <el-dialog
      title="切换状态提示"
      :visible.sync="statusDialogVisible"
      width="350px"
      :close-on-click-modal="false"
      top="30vh"
    >
      <el-form ref="form" :model="channelInfo" size="mini">
        <div class="statusPrompt">
          <i class="iconfont icon-wenhao"></i>
          <span>确定{{channelInfo.drivewayStatus ? '停用' : '启用'}}通道：{{channelInfo.drivewayName}} ?</span>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="statusDialogVisible = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="changeStatus">确 定</el-button>
          </span>
    </el-dialog>
  </div>
</template>

<script>
import parkList from '../components/parkingList'
export default {
  name: 'channel-management',
  data () {
    return {
      isAdmin: sessionStorage.getItem('isAdmin'),
      showTag: false,
      parkingLotId: '',
      channelType: 'all',
      drivewayName: '',
      channelList: [],
      tab: {},
      editDialogVisible: false,
      statusDialogVisible: false,
      channelInfo: {},
      screenParams: {},
      screenParamsArray: [],
      rules: {
        drivewayName: [
          {required: true, message: '请输入通道名称', trigger: 'blur'},
          {min: 0, max: 20, message: '最大长度为20', trigger: 'blur'}
        ]
      },
      setTabType: 'basic'
    }
  },
  components: {
    parkList
  },
  methods: {
    // 从停车场列表组件获取当前选中的停车场id
    getParkLotIdFromList (data) {
      this.parkingLotId = data
      this.getDrivewayList()
      this.channelType = 'all'
      if (this.isAdmin === '1') {
        this.showTag = true
      }
    },
    // 通道搜索
    searchChannel () {
      this.tab.name = this.channelType
      this.handleClick(this.tab)
    },
    // 获取通道列表
    getDrivewayList () {
      this.$axios.post('/api/pklot/getDrivewayList', {
        parkingLotId: this.parkingLotId,
        drivewayName: this.drivewayName
      }).then(response => {
        this.channelList = response.data.data
      })
    },
    // 获取通道列表bytype
    getDriverwayListByType (drivewayType) {
      this.$axios.post('/api/pklot/getDrivewayListByType', {
        parkingLotId: this.parkingLotId,
        drivewayName: this.drivewayName,
        drivewayType: drivewayType
      }).then(response => {
        this.channelList = response.data.data
      })
    },
    // 获取通道列表byStatus
    getDriverwayListByStatus (drivewayStatus) {
      this.$axios.post('/api/pklot/getDrivewayListByStatus', {
        parkingLotId: this.parkingLotId,
        drivewayName: this.drivewayName,
        drivewayStatus: drivewayStatus
      }).then(response => {
        this.channelList = response.data.data
      })
    },
    // 切换通道列表选项卡
    handleClick (tab, event) {
      document.getElementById('scrollBox').children[0].scrollTop = 0
      if (tab.name === 'all') {
        this.getDrivewayList()
      } else if (tab.name === '0') {
        this.getDriverwayListByType(0)
      } else if (tab.name === '1') {
        this.getDriverwayListByType(1)
      } else if (tab.name === 'disable') {
        this.getDriverwayListByStatus(0)
      }
    },
    // 打开设置弹出层
    channelModelShow (drivewayId) {
      this.editDialogVisible = true
      this.setTabType = 'basic'
      this.$axios.post('/api/pklot/getDrivewayInfo', {
        drivewayId
      }).then(response => {
        this.screenParamsArray = []
        this.channelInfo = response.data.data
        this.channelInfo.drivewayId = drivewayId
        if (response.data.data.screenType !== 0) {
          if (response.data.data.screenParams) {
            this.screenParams = JSON.parse(response.data.data.screenParams)
            let objValue = Object.values(this.screenParams)
            let obj = {}
            let _this = this
            objValue.forEach(function (item, index) {
              obj = {
                index: index + 1,
                value: item
              }
              _this.screenParamsArray.push(obj)
            })
          }
        }
      })
    },
    // 弹出层取消提交
    cancelSubmit (nameForm) {
      this.editDialogVisible = false
      this.$refs[nameForm].clearValidate()
    },
    // 保存通道修改
    editChannel (channelInfo) {
      document.getElementsByClassName('el-dialog__body')[0].scrollTop = 0
      console.log(document.getElementsByClassName('el-dialog__body')[0])
      let failedFields = {}
      this.$refs[channelInfo].validate((valid, invalidFields) => {
        if (valid) {
          let _screenParams = {}
          let rowTip = 'rowTip'
          this.screenParamsArray.forEach(function (item) {
            rowTip += item.index
            _screenParams[rowTip] = item.value
            rowTip = 'rowTip'
          })
          console.log(_screenParams)
          this.channelInfo.screenParams = JSON.stringify(_screenParams)
          this.$axios.post('/api/pklot/updateDriveway', this.channelInfo).then(response => {
            if (response.data.data === 1) {
              this.$refs[channelInfo].clearValidate()
              this.editDialogVisible = false
              this.tab.name = this.channelType
              this.handleClick(this.tab)
              this.$message.success('修改成功')
            }
          }).catch(error => {
            console.log(error)
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
    // 显示停用/启用弹出层
    statusModelShow (channelInfo) {
      this.statusDialogVisible = true
      this.channelInfo = channelInfo
    },
    // 修改停用/启用状态
    changeStatus () {
      if (this.channelInfo.drivewayStatus) {
        this.channelInfo.drivewayStatus = 0
      } else {
        this.channelInfo.drivewayStatus = 1
      }
      this.$axios.post('/api/pklot/updateDrivewayStatus', {
        drivewayId: this.channelInfo.drivewayId,
        drivewayStatus: this.channelInfo.drivewayStatus
      }).then(response => {
        if (response.data.data === 1) {
          this.statusDialogVisible = false
          if (this.channelInfo.drivewayStatus) {
            this.$message.success('启用成功')
            this.tab.name = this.channelType
            this.handleClick(this.tab)
          } else {
            this.$message.success('停用成功')
          }
        }
      }).catch(error => {
        console.log(error)
        this.$message.error('服务器错误')
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
    .channel-header {
      position: relative;
      .search-input {
        margin-right: 70px;
      }
      .search-button {
        position: absolute;
        right: 0;
        top: 0;
      }
    }
    .channel-body {
      margin: 0px 10px -10px 0px;
    }
    .channel-body-content {
      height: calc(100vh - 165px);
      .channel-item {
        border-bottom: 1px solid #DCDFE6;
        padding: 10px 0;
        position: relative;
        .head {
          display: inline-block;
          color: #fff;
          width: 50px;
          height: 50px;
          line-height: 50px;
          text-align: center;
          border-radius: 50%;
          font-size: 20px;
          background-color: #7a907b;
          margin-right: 15px;
        }
        .channel-info {
          display: inline-block;
          height: 50px;
          vertical-align: top;
          p {
            margin: 5px 0 0 0 !important;
          }
          .stateIcon {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: 5px;
            background: #92d050;
          }
          .equipmentStatus {
            display: inline-block;
            width: 60px;
          }
          /deep/ {
            .el-button--mini, .el-button--mini.is-round {
              padding: 3px 7px;
              margin-left: 3px;
            }
          }
        }
        .button-group {
          float: right;
          margin-top: 10px;
          margin-right: 10px;
        }
      }
    }
  }
  .tab-content {
    height: 254px;
  }
  .dialogList {
    /deep/ {
      .el-dialog {
        display: flex;
        flex-direction: column;
        /*height: 432px;*/
      }
      .el-dialog__body {
        padding: 10px 20px;
      }
    }
  }
  .set-title {
    margin: 0;
    line-height: 20px;
    font-weight: bold;
    color: #444444;
  }
  .set-desc {
    margin: 0 0 5px 0;
    line-height: 20px;
    color: #676A6C;
    font-size: 12px;
  }
  .el-form-item {
    /deep/ {
      .el-input {
        width: 200px;
        float: right;
      }
      .el-form-item__error--inline {
        position: relative;
        top: 18px;
        right: 10px;
        float: right;
        display: inline-block;
        margin-left: 10px;
      }
      .el-input-number {
        width: 200px;
        float: right;
      }
      .el-input-number__increase {
        margin-top: 10px;
      }
      .el-input-number__decrease {
        margin-bottom: 10px;
      }
    }
    .item-title {
      margin-left: -120px;
    }
    .item-screen-title {
      margin-left: -150px;
    }
  }
  .parameter {
    display: inline-block;
    position: relative;
    .parameterIndex {
      position: absolute;
      top: 10px;
    }
    /deep/ {
      .el-input {
        margin-left: 55px;
      }
    }
  }
  .el-switch {
    float: right;
  }
  .set-item-input {
    display: inline-block;
    right: 0;
    width: 183px;
    position: absolute;
    bottom: 12px;
    span {
      margin-left: 10px;
    }
    input {
      border: none;
      border-bottom: 1px solid #5FB878;
      width: 140px;
      font-size: 14px;
      -border-radius: 15%;
      -text-align: center;
      outline: none;
      text-align: center;
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
  /deep/ {
    .el-form-item {
      margin-bottom: 5px;
      border-bottom: 1px solid #eeeeee;
      .el-form-item__label {
        margin-top: 10px;
        margin-bottom: 10px;
        font-weight: bold;
        color: #444444;
      }
      .el-input {
        margin-top: 10px;
        margin-bottom: 10px;
      }
    }
  }
  .error-msg {
    line-height: 40px;
    text-align: center;
  }
</style>
