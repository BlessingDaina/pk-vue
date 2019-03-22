/**
* @author: daina
* @date: 2019/3/17
* @description:
*/
<template>
  <div>
    <parkList v-on:getSelectedParkLotId="getParkLotIdFromList"/>
    <div class="content">
      <el-scrollbar style="height: 100%">
        <div class="basic-info info-content">
          <el-card shadow="hover">
            <div slot="header">
              <strong>基本信息</strong>
            </div>
            <el-row>
              <el-col :span="22">
                <div class="basicInfoItem">
                  <el-form ref="form" :model="basicInfo" size="mini">
                    <el-form-item label="编码:">
                      {{basicInfo.parkingLotCode}}
                    </el-form-item>
                    <el-form-item label="名称:">
                      {{basicInfo.parkingLotName}}
                    </el-form-item>
                    <el-form-item label="地址:">
                      {{basicInfo.address}}
                    </el-form-item>
                    <el-form-item label="总车位:">
                      {{basicInfo.totalPlaces}}
                    </el-form-item>
                  </el-form>
                </div>
              </el-col>
              <el-col :span="2"><img class="parkImg" src="../../images/warn.svg"></el-col>
            </el-row>
          </el-card>
        </div>
        <div class="basic-info set-management">
          <el-card shadow="hover">
            <div slot="header">
              <strong>管理设置</strong>
            </div>
            <el-form ref="form" :model="managementBasicInfo" size="mini">
              <div class="select-child">
                <el-select v-model="managementParkId" placeholder="请选择" size="small" @change="getNextLotManagement">
                  <el-option
                    v-for="item in nextParkLots"
                    :key="item.parkingLotId"
                    :label="item.parkingLotName"
                    :value="item.parkingLotId"
                  >
                  </el-option>
                </el-select>
                下拉列表可选择子停车场进行设置
              </div>
              <el-form-item>
                <div class="item-title">
                  <p class="set-title">临时停车</p>
                  <p class="set-desc">是否允许临时车辆进入停车场。</p>
                </div>
                <div class="set-item-input">
                  <el-switch
                    v-model="managementBasicInfo.isTempParking"
                    name="is_tempparking"
                    active-text="开启"
                    inactive-text="关闭"
                    :active-value="1"
                    :inactive-value="0"
                    @change="editManagement('is_tempparking', managementBasicInfo.isTempParking)"
                  >
                  </el-switch>
                </div>
              </el-form-item>
              <el-form-item>
                <p class="set-title">入口0车位进场</p>
                <p class="set-desc">停车场车位为0时，是否自动放行车辆进入。</p>
                <div class="set-item-input">
                  <el-switch
                    v-model="managementBasicInfo.isZeroEnter"
                    name="is_zeroenter"
                    active-text="开启"
                    inactive-text="关闭"
                    :active-value="1"
                    :inactive-value="0"
                    @change="editManagement('is_zeroenter', managementBasicInfo.isZeroEnter)"
                  >
                  </el-switch>
                </div>
              </el-form-item>
              <el-form-item>
                <p class="set-title">支付完成后，离场限制</p>
                <p class="set-desc">设置电子支付后，离场的时间限制。</p>
                <div class="set-item-input">
                  <el-input placeholder="请输入时长" v-model="managementBasicInfo.paidFreeTime"
                            @blur="editManagement('paid_freetime', managementBasicInfo.paidFreeTime)"></el-input>
                  <span>分钟</span>
                </div>
              </el-form-item>
              <el-form-item>
                <p class="set-title">允许包月超期天数：</p>
                <p class="set-desc">设置允许包月超期天数，客户在包月过期后仍可按包月进出。0表示不允许超期。</p>
                <div class="set-item-input">
                  <el-input placeholder="请输入天数" v-model="managementBasicInfo.monthlyOver"
                            @blur="editManagement('monthly_over', managementBasicInfo.monthlyOver)"></el-input>
                  <span>天</span>
                </div>
              </el-form-item>
              <el-form-item>
                <p class="set-title">包月车辆临停免费时长：</p>
                <p class="set-desc">设置允许包月车辆临时停车免费时长。</p>
                <div class="set-item-input">
                  <el-input placeholder="请输入免费时长" v-model="managementBasicInfo.monthlyFreeTime"
                            @blur="editManagement('monthly_free_time', managementBasicInfo.monthlyFreeTime)"></el-input>
                  <span>分钟</span>
                </div>
              </el-form-item>
              <el-form-item>
                <p class="set-title">剩余空车位数：</p>
                <p class="set-desc">设置停车场剩余车位数。</p>
                <div class="set-item-input">
                  <el-input placeholder="请输入空车位数" v-model="managementBasicInfo.emptyPlaces"
                            @blur="editManagement('empty_places', managementBasicInfo.emptyPlaces)"></el-input>
                  <span>个</span>
                </div>
              </el-form-item>
              <el-form-item>
                <p class="set-title">停车场总车位数：</p>
                <p class="set-desc">设置停车场的车位总数。</p>
                <div class="set-item-input">
                  <el-input placeholder="请输入总车位数" v-model="managementBasicInfo.totalPlaces"
                            @blur="editManagement('total_places', managementBasicInfo.totalPlaces)"></el-input>
                  <span>个</span>
                </div>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
        <div class="basic-info">
          <el-card shadow="hover">
            <div slot="header">
              <strong class="car-title">价格设置</strong>
            </div>
            <div class="card-body">
              <div class="price-select-child">
                <el-select v-model="chargeParkId" placeholder="请选择" size="small" @change="getNextCharge">
                  <el-option
                    v-for="item in nextParkLots"
                    :key="item.parkingLotId"
                    :label="item.parkingLotName"
                    :value="item.parkingLotId"
                  >
                  </el-option>
                </el-select>
                <div class="select-prompt">下拉列表可选择子停车场进行设置</div>
                <div class="addButton isShow">
                  <el-button type="primary" size="small" @click="modelShow()">添加</el-button>
                </div>
              </div>
              <div class="price-rules">
                <ul>
                  <li class="price-rule-item" v-for="rule in accountRules" :key="rule.ruleId">
                    <div class="ruleName">规则名称：{{rule.rulesName}}</div>
                    <div class="ruleDesc">
                      <div class="unifiedRule" v-if="rule.valuationType==='0'">
                        <span class="badge bg-blue isShow" v-if="rule.licenseColor==0">普</span>
                        <span class="badge bg-blue isShow" v-if="rule.licenseColor==1">蓝</span>
                        <span class="badge bg-yellow isShow" v-if="rule.licenseColor==2">黄</span>
                        <span class="badge bg-black isShow" v-if="rule.licenseColor==3">黑</span>
                        <span class="badge bg-green isShow" v-if="rule.licenseColor==4">绿</span>
                        统一收费：起步{{rule.firstPrice}}元/{{rule.timeType==0?'小时':'分钟'}}，后续{{rule.afterPrice}}元/{{rule.timeType==0?'小时':'分钟'}}
                      </div>
                      <div class="piecewiseRule" v-if="rule.valuationType==='1'">
                        <div class="piecewiseRuleTitle">
                          <span class="badge bg-blue isShow" v-if="rule.licenseColor==0">普</span>
                          <span class="badge bg-blue isShow" v-if="rule.licenseColor==1">蓝</span>
                          <span class="badge bg-yellow isShow" v-if="rule.licenseColor==2">黄</span>
                          <span class="badge bg-black isShow" v-if="rule.licenseColor==3">黑</span>
                          <span class="badge bg-green isShow" v-if="rule.licenseColor==4">绿</span>
                          分时计费：
                        </div>
                        <div class="piecewiseRuleDesc">
                          白天：起步{{rule.dayFirstPrice}}元/{{rule.timeType==0?'小时':'分钟'}}，后续{{rule.dayAfterPrice}}元/{{rule.timeType==0?'小时':'分钟'}}<br>
                          晚上：起步{{rule.nightFirstPrice}}元/{{rule.timeType==0?'小时':'分钟'}}，后续{{rule.nightAfterPrice}}元/{{rule.timeType==0?'小时':'分钟'}}
                        </div>
                      </div>
                      <section class="button-group isShow">
                        <el-button type="primary" size="small" @click="modelShow(rule)">编辑</el-button>
                        <el-button type="primary" size="small" @click="deleteModel(rule)">删除</el-button>
                        <el-button type="primary" size="small" :disabled="topRuleId===rule.rulesId"
                                   @click="changeRuleOrderLevel(rule, 0)">上移
                        </el-button>
                        <el-button type="primary" size="small" :disabled="endRuleId===rule.rulesId"
                                   @click="changeRuleOrderLevel(rule, 1)">下移
                        </el-button>
                      </section>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </el-card>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import parkList from '../components/parkingList'

export default {
  name: 'parkInfo',
  data () {
    return {
      parkingLotId: '',
      managementParkId: '',
      chargeParkId: '',
      basicInfo: {},
      nextParkLots: [],
      managementBasicInfo: {},
      accountRules: []
    }
  },
  components: {
    parkList
  },
  methods: {
    // 从停车场列表组件获取当前选中的停车场id
    getParkLotIdFromList (data) {
      this.parkingLotId = data
      this.getParkingLotInfo(this.parkingLotId, 1)
      this.getNextParkLot(this.parkingLotId)
    },
    // 获取停车场基本信息
    getParkingLotInfo (parkingLotId, tag) {
      this.$axios.post('/api/pklot/getParkingLotInfo', {
        parkingLotId: parkingLotId
      }).then(response => {
        if (tag === 1) {
          this.basicInfo = response.data.data
          this.managementBasicInfo = response.data.data
        } else if (tag === 2) {
          this.managementBasicInfo = response.data.data
        }
      })
    },
    // 获取子停车场列表
    getNextParkLot (parkingLotId) {
      this.$axios.post('/api/pklot/getNestParkingLot', {
        parkingLotId: parkingLotId
      }).then(response => {
        this.nextParkLots = response.data.data
        this.managementParkId = this.nextParkLots[0].parkingLotId
        this.chargeParkId = this.nextParkLots[0].parkingLotId
        this.getChargeRules(this.nextParkLots[0].parkingLotId)
      })
    },
    // 管理设置获取子停车场信息
    getNextLotManagement (parkingLotId) {
      this.getParkingLotInfo(parkingLotId, 2)
    },
    // 修改管理设置
    editManagement (key, value, tag) {
      this.$axios.post('/api/pklot/updateManagement', {
        key,
        value,
        parkingLotId: this.managementBasicInfo.parkingLotId
      }).then(response => {
        if (response.data.data === 1) {
          this.$message.success('修改成功')
        }
      })
    },
    // 获取子停车场价格列表
    getNextCharge (parkingLotId) {
      this.getChargeRules(parkingLotId)
    },
    // 获取停车场价格列表
    getChargeRules (parkingLotId) {
      this.$axios.post('/api/pklot/getChargeRuleList', {
        parkingLotId
      }).then(response => {
        console.log(this.accountRules)
        this.accountRules = response.data.data
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
  }

  .content {
    margin-left: 310px;
    height: calc(100vh - 75px);
  }

  .basic-info {
    margin-bottom: 10px;
    .basicInfoItem {
      padding: 0 10px;
      .el-form-item {
        margin-bottom: 0;
      }
    }
    .parkImg {
      height: 120px;
      width: 100px;
      float: right;
    }
  }

  .set-management {
    .select-child {
      margin-bottom: 15px;
      .select-prompt {
        width: 250px;
        display: inline-block;
        margin-top: 5px;
      }
    }
    .el-input {
      width: 200px;
    }
    .el-switch {
      float: right;
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
    .set-item-input {
      display: inline-block;
      right: 0;
      width: 183px;
      position: absolute;
      bottom: 12px;
      span {
        margin-left: 10px;
      }
      .el-input {
        width: 140px;
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
    /deep/ {
      .el-form-item {
        margin-bottom: 5px;
      }
      .el-form-item__content {
        border-bottom: 1px solid #eeeeee;
        position: relative;
      }
    }
  }
  .price-select-child {
    .select-prompt {
      width: 250px;
      display: inline-block;
      margin-top: 5px;
    }
    .addButton {
      float: right;
    }
    .el-input {
      width: 200px;
    }
    .el-select {
      width: 200px;
    }
    .el-form-item__label {
      font-weight: 500;
    }
    .model-input {
      width: 140px;
    }
    /deep/ {
      .el-dialog {
        height: 450px;
      }
    }
  }
  .price-rules {
    ul {
      list-style: none;
      margin-top: 15px;
      padding: 0px;
      font-size: 14px;
    }
    li:hover {
      background-color: #f2f2f2;
      cursor: pointer;
    }
    .badge {
      width: 30px;
      height: 30px;
      line-height: 30px;
      padding: 0;
      font-size: 14px;
      display: inline-block;
      color: #ffffff;
      position: relative;
      text-align: center;
      border-radius: 2px;
    }
    .bg-default {
      background-color: #409eff;
    }
    .bg-blue {
      background-color: #409EFF;
    }
    .bg-yellow {
      background-color: #E6A23C;
    }
    .bg-black {
      background-color: #909399;
    }
    .bg-green {
      background-color: #67C23A;
    }
    .price-rule-item {
      border: 1px solid #eeeeee;
      display: block;
      margin: 20px 0;
      .ruleName {
        margin-left: 10px;
        line-height: 30px;
      }
      .ruleDesc {
        margin-left: 10px;
        .el-button--mini {
          padding: 7px 7px;
        }
        .unifiedRule {
          display: inline-block;
          line-height: 50px;
        }
        .piecewiseRule {
          display: inline-block;
          height: 50px;
          position: relative;
          width: 50%;
        }
        .piecewiseRuleDesc {
          display: inline-block;
          line-height: 25px;
          position: absolute;
          left: 105px;
        }
        .piecewiseRuleTitle {
          display: inline-block;
          position: absolute;
          top: 12px;
        }
      }
      .button-group {
        float: right;
        margin-right: 10px;
        .el-button + .el-button {
          margin-left: 0;
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
  }
</style>
