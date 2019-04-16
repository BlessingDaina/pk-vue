/**
* @author: daina
* @date: 2019/3/27
* @description:
*/
<template>
  <div class="sentry-content">
    <div class="header">
      <div class="title">
        <i class="iconfont icon-gangting"></i> 实时收费
      </div>
      <div class="sentry">
        当前岗亭：
        <el-select v-model="currentSentryBox" value-key="sentryBoxId" placeholder="请选择" size="small"
                   @change="changeSentryBox">
          <el-option
            v-for="item in sentryBoxList"
            :key="item.sentryBoxId"
            :label="item.sentryBoxName"
            :value="item"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <el-tabs v-model="currentDrivewayId" @tab-click="handleClick">
      <el-tab-pane v-for="driveway in drivewayList" :name="driveway.drivewayId" :key="driveway.drivewayId"
                   :label="driveway.drivewayName"></el-tab-pane>
    </el-tabs>
    <div class="sentry-option">
      <div class="entrance" v-show="currentDriveway.drivewayType === '0'">
        <el-row :gutter="20">
          <el-col :span="16">
            <el-card shadow="hover">
              <div class="entrance-img">
                <img :src="'http://image.if-yun.com/'+entrancePhoto" v-if="entrancePhoto"/>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <div class="charge-item">
              <ul>
                <li>
                  <el-button type="primary" size="small">{{parkingType}}</el-button>
                  <span class="info">{{entranceCarInfo.carLicense}}</span>
                </li>
                <li>
                  <el-button type="success" size="small">时</el-button>
                  <span class="info">{{entranceCarInfo.entranceTime}}</span>
                </li>
              </ul>
              <div class="dynamic-message"><span style="color: red">{{dynamicMessage}}</span></div>
            </div>
          </el-col>
        </el-row>
        <div class="button-group">
          <el-button type="primary" size="small" @click="openPass">开启通道</el-button>
          <el-button type="primary" size="small" @click="closeChannel">关闭通道</el-button>
        </div>
      </div>
      <div class="export" v-show="currentDriveway.drivewayType === '1'">
        <el-row :gutter="20">
          <el-col :span="9">
            <el-card shadow="hover">
              <div class="entrance-img">
                <img :src="'http://image.if-yun.com/'+exportPhotoIn" v-if="exportPhotoIn"/>
              </div>
            </el-card>
          </el-col>
          <el-col :span="9">
            <el-card shadow="hover">
              <div class="entrance-img">
                <img :src="'http://image.if-yun.com/'+exportPhotoOut" v-if="exportPhotoOut"/>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <div class="charge-item">
              <ul>
                <li>
                  <el-button type="primary" size="small">{{parkingType}}</el-button>
                  <span class="info">{{exitCarInfo.carLicense}}</span>
                </li>
                <li>
                  <el-button type="success" size="small">时</el-button>
                  <span class="info">{{exitCarInfo.parkingTime}}</span>
                </li>
                <li>
                  <el-button type="info" size="small">费</el-button>
                  <span class="info">{{exitCarInfo.amountTotal? exitCarInfo.amountTotal+'元':'0.0'}}</span>
                </li>
              </ul>
              <div class="remark">{{exitCarInfo.remark}}</div>
              <div class="dynamic-message"><span style="color: red">{{dynamicMessage}}</span></div>
            </div>
          </el-col>
        </el-row>
        <div class="lower">
          <el-card shadow="hover">
            <div class="free-type">
              <h2>免费放行理由</h2>
              <div class="free-put-list">
                <el-radio-group v-model="selectedFreePutType">
                  <el-radio v-for="item in freePutTypeList" :key="item.categoryId" :label="item.categoryName"
                            border></el-radio>
                </el-radio-group>
              </div>
            </div>
          </el-card>
          <div class="option-buttong">
            <el-button type="success" size="small" @click="freePass">免费放行</el-button>
            <!--<div class="line"></div>-->
            <el-button type="danger" size="small" @click="rechargePass">收费放行</el-button>
            <br>
            <el-button type="primary" size="small" @click="openPass">开启通道</el-button>
            <el-button type="primary" size="small" @click="closeChannel">关闭通道</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'charge',
  data () {
    return {
      userInfo: {},
      parkingLotInfo: {},
      drivewayList: [],
      currentDriveway: {},
      currentDrivewayId: '',
      sentryBoxList: [],
      currentSentryBox: {},
      currentSentryBoxId: '',
      freePutTypeList: [],
      user: {},
      parkingLotId: '',
      selectedFreePutType: '',
      ws: {},
      heartCheck: {},
      lockReconnect: false,
      wsUrl: 'ws://192.168.1.209:18193/websocket',
      entrancePhoto: '',
      exportPhotoIn: '',
      exportPhotoOut: '',
      entranceCarInfo: {},
      exitCarInfo: {},
      parkingType: '临',
      freeRemark: '',
      freeType: '',
      freeTypeName: '',
      dynamicMessage: '',
      buttonTag: true
    }
  },
  created () {
    this.getUserInfo()
    let _this = this
    this.heartCheck = {
      timeout: 90000, // 90秒
      timeoutObj: null,
      serverTimeoutObj: null,
      reset: function () {
        clearTimeout(this.timeoutObj)
        clearTimeout(this.serverTimeoutObj)
        return this
      },
      start: function () {
        let self = this
        // 这里发送一个心跳，后端收到后，返回一个心跳消息，
        // onmessage拿到返回的心跳就说明连接正常
        _this.send({'serviceId': 102})
        _this.timeoutObj = setTimeout(function () {
          // console.log("没有收到心跳消息,N秒后将自动关闭重连")
          self.serverTimeoutObj = setTimeout(function () { // 如果超过一定时间还没重置，说明后端主动断开了
            _this.ws.close()// 如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
          }, self.timeout)
        }, _this.timeout)
      }
    }
  },
  methods: {
    // 获取当前账号信息
    getUserInfo () {
      this.$axios.post('/api/sentry/findUserByUserId', {}).then(response => {
        this.userInfo = response.data.data
        this.getParkLotInfo()
        this.createWebSocket(this.wsUrl)
      })
    },
    // 获取当前账号对应停车场
    getParkLotInfo () {
      this.$axios.post('/api/pklot/getParkingLotInfo', {
        parkingLotId: sessionStorage.getItem('parkingLotId')
      }).then(response => {
        this.parkingLotInfo = response.data.data
        this.getSentryAndDriveway()
        this.getFreePutType()
      })
    },
    // 获取岗亭与通道
    getSentryAndDriveway () {
      this.$axios.post('/api/sentry/getSentry', {
        parkingLotId: this.parkingLotInfo.parkingLotId
      }).then(response => {
        this.sentryBoxList = response.data.data
        this.currentSentryBox = this.sentryBoxList[0]
        this.currentSentryBoxId = this.currentSentryBox.sentryBoxId
        this.drivewayList = this.currentSentryBox.driveways
        this.currentDriveway = this.drivewayList[0]
        this.currentDriveway.drivewayType = String(this.currentDriveway.drivewayType)
        this.currentDrivewayId = this.currentDriveway.drivewayId
      })
    },
    // 切换岗亭
    changeSentryBox (sentryBox) {
      this.currentSentryBox = sentryBox
      this.currentSentryBoxId = this.currentSentryBox.sentryBoxId
      console.log(this.currentSentryBoxId)
      this.drivewayList = this.currentSentryBox.driveways
      this.currentDriveway = this.drivewayList[0]
      this.currentDrivewayId = this.currentDriveway.drivewayId
    },
    // 切换通道
    handleClick (tab, event) {
      console.log(tab)
      this.getDrivewayInfo(tab.name)
    },
    // 获取通道详细信息
    getDrivewayInfo (drivewayId) {
      this.$axios.post('/api/pklot/getDrivewayInfo', {
        drivewayId: drivewayId
      }).then(response => {
        this.currentDriveway = response.data.data
        this.currentDrivewayId = this.currentDriveway.drivewayId
      })
    },
    // 获取免费放行类型
    getFreePutType () {
      this.$axios.post('/api/pklot/getCarCategoryList', {
        parkingLotId: this.parkingLotInfo.parkingLotId,
        categoryType: 3
      }).then(response => {
        this.freePutTypeList = response.data.data
      })
    },
    // --------websocket相关-------
    createWebSocket (url) {
      try {
        this.ws = new WebSocket(url)
        this.initEventHandle()
      } catch (e) {
        this.reconnect(url)
      }
    },
    initEventHandle () {
      let _this = this
      this.ws.onclose = function () {
        _this.reconnect(this.wsUrl)
      }
      this.ws.onerror = function () {
        _this.reconnect(this.wsUrl)
      }
      this.ws.onopen = function () {
        console.log('首次上班webscoket链接时')
        console.log(sessionStorage.getItem('userId'))
        _this.drivewayList.forEach(function (item) {
          _this.send({
            'uid': sessionStorage.getItem('uid'),
            'drivewayId': item.drivewayId,
            'serviceId': 100,
            parkingLotId: _this.parkingLotId
          })
        })
        _this.heartCheck.reset().start()
      }
      this.ws.onmessage = function (event) {
        console.log('接收到消息了')
        let response = JSON.parse(event.data)
        console.log(response)
        if (response.serviceId === 100) {
          let msg = response.message
          _this.dynamicMessage = ''
          console.log(msg)
        } else if (response.serviceId === 103) { // 出场消息
          let msg = JSON.parse(response.message)
          _this.exitCarInfo = JSON.parse(response.message)
          _this.shiftParkingType(parseInt(msg.parkingType))
          _this.currentDrivewayId = response.drivewayId
          let currentDrivewayTab = {
            name: _this.currentDrivewayId
          }
          _this.handleClick(currentDrivewayTab)
          _this.dynamicMessage = ''
          _this.buttonTag = false
          console.log('出场消息' + msg)
          console.log(msg)
          setTimeout(function () {
            _this.exportPhotoIn = msg.entrancePhoto
            _this.exportPhotoOut = msg.exitPhoto
          }, 3500)
        } else if (response.serviceId === 114) { // 入场消息
          let msg = JSON.parse(response.message)
          _this.entranceCarInfo = JSON.parse(response.message)
          _this.currentDrivewayId = response.drivewayId
          let currentDrivewayTab = {
            name: _this.currentDrivewayId
          }
          _this.handleClick(currentDrivewayTab)
          console.log('入场消息' + msg)
          console.log(msg)
          _this.shiftParkingType(parseInt(msg.parkingType))
          console.log(_this.entranceCarInfo)
          setTimeout(function () {
            _this.entrancePhoto = msg.entrancePhoto
          }, 3500)
          _this.dynamicMessage = ''
        } else if (response.serviceId === 110) { // 开闸结果
          let msg = JSON.parse(response.message)
          _this.dynamicMessage = msg.dynamicMessage
        } else if (response.serviceId === 111) { // 关闸结果
          let msg = JSON.parse(response.message)
          _this.dynamicMessage = msg.dynamicMessage
        }
        _this.heartCheck.reset().start()
      }
    },
    reconnect (url) {
      let _this = this
      if (this.lockReconnect) return
      this.lockReconnect = true
      setTimeout(function () {
        _this.createWebSocket(url)
        _this.lockReconnect = false
      }, 2000)
    },
    send (message, tag) {
      if (!window.WebSocket) {
        return
      }
      if (this.ws.readyState === WebSocket.OPEN) {
        console.log('【发送】：' + JSON.stringify(message))
        this.ws.send(JSON.stringify(message))
        if (tag) {
          this.$message.success('操作成功')
          this.buttonTag = true
        }
      } else {
        console.log('错误')
      }
    },
    shiftParkingType (parkingType) {
      if (parkingType === 0) {
        this.parkingType = '包'
      } else if (parkingType === 1 || parkingType === 2 || parkingType === 3 || parkingType === 4) {
        this.parkingType = '免'
      } else if (parkingType === 5 || parkingType === 6 || parkingType === 7 || parkingType === 8 || parkingType === 9) {
        this.parkingType = '临'
      } else {
        this.parkingType = '未'
      }
    },
    // 免费放行
    freePass () {
      if (this.selectedFreePutType) {
        this.send({
          'serviceId': 109,
          'dataId': this.parkingLotId,
          'message': {
            'openUserName': sessionStorage.getItem('userName'),
            'recordId': this.exitCarInfo.recordId,
            'drivewayId': this.currentDrivewayId,
            'openUserId': this.user.uid,
            'drivewayCommand': '1',
            'freeType': this.freeType,
            'freeRemark': this.freeRemark,
            'freeTypeName': this.freeTypeName
          }
        }, 1)
      } else {
        this.$message.error('请选择免费放行理由')
      }
    },
    // 收费放行
    rechargePass () {
      this.send({
        'serviceId': 106,
        'dataId': this.parkingLotId,
        'message': {
          'openUserName': sessionStorage.getItem('userName'),
          'recordId': this.exitCarInfo.recordId,
          'drivewayId': this.currentDrivewayId,
          'openUserId': this.user.uid,
          'drivewayCommand': '1'
        }
      }, 1)
    },
    // 关闭通道
    closeChannel () {
      this.send({
        'serviceId': 107,
        'dataId': this.parkingLotId,
        'message': {
          'openUserName': sessionStorage.getItem('userName'),
          'recordId': this.exitCarInfo.recordId,
          'drivewayId': this.currentDrivewayId,
          'openUserId': this.user.uid,
          'drivewayCommand': '0'
        }
      }, 1)
    },
    // 打开通道
    openPass () {
      this.send({
        'serviceId': 108,
        'dataId': this.parkingLotId,
        'message': {
          'openUserName': sessionStorage.getItem('userName'),
          'recordId': this.exitCarInfo.recordId,
          'drivewayId': this.currentDrivewayId,
          'openUserId': sessionStorage.getItem('uid'),
          'drivewayCommand': '1'
        }
      }, 1)
    }
  }
}
</script>

<style scoped lang="scss">
  .sentry-content {
    margin: 10px;
    .header {
      margin-top: 20px;
      height: 35px;
      border-bottom: 1px solid #e4e4e4;
      .title {
        display: inline-block;
      }
      .sentry {
        float: right;
      }
    }
    .sentry-option {
      width: 100%;
      height: calc(100vh - 180px);
      .entrance {
        width: 100%;
        .el-card {
          width: 600px;
          float: right;
        }
        .entrance-img {
          margin: 0 auto;
          width: 526px;
          height: 344px;
          background: url("../../images/detail.png");
        }
        .button-group {
          margin: 20px auto;
          width: 400px;
          .el-button--small {
            padding: 19px 59px;
            font-size: 16px;
          }
        }
        .charge-item {
          display: inline-block;
          width: 430px;
          height: 385px;
          ul {
            padding: 0;
            margin: 20px 0;
            list-style: none;
          }
          li {
            margin: 0;
            list-style: none;
            border-bottom: 1px dashed #cccccc;
            padding: 6px 8px;
            .info {
              height: 35px;
              text-align: right;
              line-height: 35px;
              font-size: 24px;
              color: #777;
              padding-left: 20px;
            }
          }
          .dynamic-message {
            text-align: center;
          }
        }
      }
      .export {
        width: 100%;
        height: 54%;
        .el-card {
          width: 100%;
          display: inline-block;
          height: 100%;
          min-height: 366px;
        }
        .entrance-img {
          margin: 0 auto;
          width: 526px;
          height: 344px;
          background: url("../../images/detail.png");
        }
        .charge-item {
          width: 100%;
          display: inline-block;
          height: 385px;
          ul {
            padding: 0;
            margin: 20px 0;
            list-style: none;
          }
          li {
            margin: 0;
            list-style: none;
            border-bottom: 1px dashed #cccccc;
            padding: 6px 8px;
          }
          /deep/ {
            .el-button--small {
              padding: 9px 9px;
              font-size: 14px;
            }
          }
        }
        .lower {
          .el-card {
            width: calc(100% - 465px);
            display: inline-block;
            margin-right: 10px;
          }
          .free-type {
            h2 {
              margin: 0 10px;
            }
            .free-put-list {
              margin-top: 20px;
              height: 150px;
            }
          }
          .option-buttong {
            position: relative;
            float: right;
            margin-top: 40px;
            width: 430px;
            .el-button--small, .el-button--small.is-round {
              padding: 19px 59px;
              margin-top: 20px;
              font-size: 16px;
            }
            .line {
              display: inline-block;
              width: 20%;
              height: 5px;
              float: left;
              margin-top: -30px;
              background: rgb(82, 188, 137);
              height: 5px;
              overflow: hidden;
            }
          }
        }
      }
    }
  }
</style>
