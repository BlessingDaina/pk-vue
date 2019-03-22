/**
* @author: daina
* @date: 2018/11/23
* @description:
*/
<template>
  <div>
    <parkList v-on:getSelectedParkLotId="getParkLotIdFromList"/>
    <div class="content">
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
                    {{basicInfo.parkinglotCode}}
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
      <!--<div class="basic-info">-->
      <!--<el-card shadow="hover">-->
      <!--<div slot="header">-->
      <!--<strong>管理设置</strong>-->
      <!--</div>-->
      <!--<el-form ref="form" :model="basicInfo" size="mini">-->
      <!--<el-form-item>-->
      <!--<el-select v-model="managementParkId" placeholder="请选择" size="medium" @change="getNextLotManagement">-->
      <!--<el-option-->
      <!--v-for="item in nextParkLots"-->
      <!--:key="item.parkingLotId"-->
      <!--:label="item.parkingLotName"-->
      <!--:value="item.parkingLotId"-->
      <!--&gt;-->
      <!--</el-option>-->
      <!--</el-select>-->
      <!--下拉列表可选择子停车场进行设置-->
      <!--</el-form-item>-->
      <!--<el-form-item>-->
      <!--<strong>临时停车：</strong>是否允许临时车辆进入停车场。-->
      <!--<el-switch-->
      <!--v-model="basicInfo.isTempparking"-->
      <!--name="is_tempparking"-->
      <!--active-text="开启"-->
      <!--inactive-text="关闭"-->
      <!--:active-value="1"-->
      <!--:inactive-value="0"-->
      <!--@change="updateFlag('is_tempparking',basicInfo.isTempparking, '是否允许临时车辆进入停车场。')"-->
      <!--&gt;-->
      <!--</el-switch>-->
      <!--</el-form-item>-->
      <!--<el-form-item>-->
      <!--<strong>入口0车位进场：</strong>停车场车位为0时，是否自动放行车辆进入。-->
      <!--<el-switch-->
      <!--v-model="basicInfo.isZeroenter"-->
      <!--active-text="开启"-->
      <!--inactive-text="关闭"-->
      <!--:active-value="1"-->
      <!--:inactive-value="0"-->
      <!--@change="updateFlag('is_zeroenter',basicInfo.isZeroenter, '停车场车位为0时，是否自动放行车辆进入。')"-->
      <!--&gt;-->
      <!--</el-switch>-->
      <!--</el-form-item>-->
      <!--<el-form-item>-->
      <!--<strong>支付完成后，离场限制：</strong>设置电子支付后，离场的时间限制。-->
      <!--<div class="set-item-input">-->
      <!--<el-input placeholder="请输入时长" v-model="basicInfo.paidFreetime"></el-input>-->
      <!--<span>分钟</span>-->
      <!--</div>-->
      <!--</el-form-item>-->
      <!--<el-form-item>-->
      <!--<strong>手机包月续费 ：</strong>是否开启手机包月续费功能。-->
      <!--<el-switch-->
      <!--v-model="basicInfo.isMonthlyMobile"-->
      <!--active-text="开启"-->
      <!--inactive-text="关闭"-->
      <!--:active-value="1"-->
      <!--:inactive-value="0"-->
      <!--@change="updateFlag('is_monthly_mobile',basicInfo.isMonthlyMobile, '是否开启手机包月续费功能。')"-->
      <!--&gt;-->
      <!--</el-switch>-->
      <!--</el-form-item>-->
      <!--<el-form-item>-->
      <!--<strong>包月到期提醒：</strong>是否开启包月提醒功能。开启后，将提前7天提醒车主续费。-->
      <!--<el-switch-->
      <!--v-model="basicInfo.isMonthlyTip"-->
      <!--active-text="开启"-->
      <!--inactive-text="关闭"-->
      <!--:active-value="1"-->
      <!--:inactive-value="0"-->
      <!--@change="updateFlag('is_monthly_tip',basicInfo.isMonthlyTip, '是否开启包月提醒功能。开启后，将提前7天提醒车主续费。')"-->
      <!--&gt;-->
      <!--</el-switch>-->
      <!--</el-form-item>-->
      <!--<el-form-item>-->
      <!--<strong>允许包月超期天数：</strong>设置允许包月超期天数，客户在包月过期后仍可按包月进出。0表示不允许超期。-->
      <!--<div class="set-item-input">-->
      <!--<el-input placeholder="请输入天数" v-model="basicInfo.monthlyOver"></el-input>-->
      <!--<span>天&nbsp;&nbsp;&nbsp;&nbsp;</span>-->
      <!--</div>-->
      <!--</el-form-item>-->
      <!--<el-form-item>-->
      <!--<strong>包月车辆临停免费时长：</strong>设置允许包月车辆临时停车免费时长。-->
      <!--<div class="set-item-input">-->
      <!--<el-input placeholder="请输入免费时长" v-model="basicInfo.montthlyFreeTime"></el-input>-->
      <!--<span>分钟</span>-->
      <!--</div>-->
      <!--</el-form-item>-->
      <!--<el-form-item>-->
      <!--<strong>剩余空车位数：</strong>设置停车场剩余车位数。-->
      <!--<div class="set-item-input">-->
      <!--<el-input placeholder="请输入空车位数" v-model="basicInfo.emptyPlaces"></el-input>-->
      <!--<span>个&nbsp;&nbsp;&nbsp;&nbsp;</span>-->
      <!--</div>-->
      <!--</el-form-item>-->
      <!--<el-form-item>-->
      <!--<strong>停车场总车位数：</strong>设置停车场的车位总数。-->
      <!--<div class="set-item-input">-->
      <!--<el-input placeholder="请输入总车位数" v-model="basicInfo.totalPlaces"></el-input>-->
      <!--<span>个&nbsp;&nbsp;&nbsp;&nbsp;</span>-->
      <!--</div>-->
      <!--</el-form-item>-->
      <!--</el-form>-->
      <!--</el-card>-->
      <!--</div>-->
      <!--<div class="basic-info">-->
      <!--<el-card shadow="hover">-->
      <!--<div slot="header">-->
      <!--<strong>价格设置</strong>-->
      <!--</div>-->
      <!--<div class="card-body">-->
      <!--<div class="price-select-child">-->
      <!--<el-select v-model="chargeParkId" placeholder="请选择" size="medium" @change="getNextCharge">-->
      <!--<el-option-->
      <!--v-for="item in nextParkLots"-->
      <!--:key="item.parkingLotId"-->
      <!--:label="item.parkingLotName"-->
      <!--:value="item.parkingLotId"-->
      <!--&gt;-->
      <!--</el-option>-->
      <!--</el-select>-->
      <!--下拉列表可选择子停车场进行设置-->
      <!--<el-button type="primary" class="addButton" @click="modelShow()">添加</el-button>-->
      <!--<el-dialog title="计费规则设置" :visible.sync="dialogFormVisible" custom-class="modelHeight" height="40%">-->
      <!--<el-form :model="accountRuleForm" :rules="accountFillRule" ref="accountRuleForm">-->
      <!--<el-row>-->
      <!--<el-col :span="12">-->
      <!--<el-form-item label="规则名称" :label-width="formLabelWidth" prop="rulesName">-->
      <!--<el-input v-model="accountRuleForm.rulesName" autocomplete="off"></el-input>-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="12">-->
      <!--<el-form-item label="停车分类" :label-width="formLabelWidth">-->
      <!--<el-select v-model="accountRuleForm.parkingType" placeholder="请选择停车分类">-->
      <!--<el-option label="普通临停" value="0"></el-option>-->
      <!--<el-option label="业主临停" value="1"></el-option>-->
      <!--</el-select>-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--</el-row>-->
      <!--<el-row>-->
      <!--<el-col :span="12">-->
      <!--<el-form-item label="车牌颜色" :label-width="formLabelWidth">-->
      <!--<el-select v-model="accountRuleForm.licenseColor" placeholder="请选择车牌颜色">-->
      <!--<el-option label="不区分颜色" value="0"></el-option>-->
      <!--<el-option label="蓝色" value="1"></el-option>-->
      <!--<el-option label="黄色" value="2"></el-option>-->
      <!--<el-option label="黑色" value="3"></el-option>-->
      <!--<el-option label="绿色" value="4"></el-option>-->
      <!--</el-select>-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="12">-->
      <!--<el-form-item label="车型类别" :label-width="formLabelWidth">-->
      <!--<el-select v-model="accountRuleForm.carType" placeholder="请选择车型类别">-->
      <!--<el-option label="不区分" value="0"></el-option>-->
      <!--<el-option label="小型汽车" value="1"></el-option>-->
      <!--<el-option label="中型汽车" value="2"></el-option>-->
      <!--<el-option label="大型汽车" value="3"></el-option>-->
      <!--<el-option label="其他" value="4"></el-option>-->
      <!--</el-select>-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--</el-row>-->
      <!--<el-row>-->
      <!--<el-col :span="12">-->
      <!--<el-form-item label="无入场默认金额" :label-width="formLabelWidth">-->
      <!--<el-input v-model="accountRuleForm.defaultPrice" autocomplete="off"></el-input>-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="12">-->
      <!--<el-form-item label="限价设置" :label-width="formLabelWidth">-->
      <!--<el-select v-model="accountRuleForm.limitPrice">-->
      <!--<el-option label="不限价" value="0"></el-option>-->
      <!--<el-option label="8小时" value="8"></el-option>-->
      <!--<el-option label="12小时" value="12"></el-option>-->
      <!--<el-option label="24小时" value="24"></el-option>-->
      <!--</el-select>-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--</el-row>-->
      <!--<el-form-item label="价格设置" :label-width="formLabelWidth">-->
      <!--<el-select v-model="accountRuleForm.valuationType">-->
      <!--<el-option label="统一计费" value="0"></el-option>-->
      <!--<el-option label="分段计费" value="1"></el-option>-->
      <!--</el-select>-->
      <!--<el-select v-model="accountRuleForm.timeType">-->
      <!--<el-option label="按小时计费" value="0"></el-option>-->
      <!--<el-option label="按分钟计费" value="1"></el-option>-->
      <!--</el-select>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="免费时间" :label-width="formLabelWidth" prop="freeTime">-->
      <!--<el-input v-model="accountRuleForm.freeTime" autocomplete="off"></el-input>-->
      <!--{{accountRuleForm.timeType==0?'小时':'分钟'}}-->
      <!--</el-form-item>-->
      <!--<div class="unified" v-if="accountRuleForm.valuationType==0">-->
      <!--<el-form-item label="起步价" :label-width="formLabelWidth" required>-->
      <!--<el-col :span="7">-->
      <!--<el-form-item prop="firstPrice">-->
      <!--<el-input v-model="accountRuleForm.firstPrice" autocomplete="off"></el-input>-->
      <!--元-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="10">-->
      <!--<el-form-item prop="firstTime">-->
      <!--<el-input v-model="accountRuleForm.firstTime" autocomplete="off"></el-input>-->
      <!--{{accountRuleForm.timeType==0?'小时':'分钟'}}-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="后续价" :label-width="formLabelWidth" required>-->
      <!--<el-col :span="7">-->
      <!--<el-form-item prop="afterPrice">-->
      <!--<el-input v-model="accountRuleForm.afterPrice" autocomplete="off"></el-input>-->
      <!--元-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="10">-->
      <!--<el-form-item prop="afterTime">-->
      <!--<el-input v-model="accountRuleForm.afterTime" autocomplete="off"></el-input>-->
      <!--{{accountRuleForm.timeType==0?'小时':'分钟'}}-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--</el-form-item>-->
      <!--</div>-->
      <!--<div class="piecewise" v-if="accountRuleForm.valuationType==1">-->
      <!--<el-form-item label="白天时段" :label-width="formLabelWidth" prop="dayStartTime">-->
      <!--<el-time-picker v-model="accountRuleForm.dayStartTime" value-format="HH:mm:ss"></el-time-picker>-->
      <!--至-->
      <!--<el-time-picker v-model="accountRuleForm.dayEndTime" value-format="HH:mm:ss"></el-time-picker>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="起步价" :label-width="formLabelWidth" prop="dayFirstPrice">-->
      <!--<el-input v-model="accountRuleForm.dayFirstPrice" autocomplete="off"></el-input>-->
      <!--元-->
      <!--<el-input v-model="accountRuleForm.dayFirstTime" autocomplete="off"></el-input>-->
      <!--{{accountRuleForm.timeType==0?'小时':'分钟'}}-->
      <!--</el-form-item>-->
      <!--<el-form-item label="后续价" :label-width="formLabelWidth" prop="dayAfterPrice">-->
      <!--<el-input v-model="accountRuleForm.dayAfterPrice" autocomplete="off"></el-input>-->
      <!--元-->
      <!--<el-input v-model="accountRuleForm.dayAfterTime" autocomplete="off"></el-input>-->
      <!--{{accountRuleForm.timeType==0?'小时':'分钟'}}-->
      <!--</el-form-item>-->
      <!--<el-form-item label="白天限价" :label-width="formLabelWidth">-->
      <!--<el-input v-model="accountRuleForm.dayLimit" autocomplete="off"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="晚上时段" :label-width="formLabelWidth" prop="nightStartTime">-->
      <!--<el-time-picker v-model="accountRuleForm.nightStartTime" value-format="HH:mm:ss"></el-time-picker>-->
      <!--至-->
      <!--<el-time-picker v-model="accountRuleForm.nightEndTime" value-format="HH:mm:ss"></el-time-picker>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="起步价" :label-width="formLabelWidth" prop="nightFirstPrice">-->
      <!--<el-input v-model="accountRuleForm.nightFirstPrice" autocomplete="off"></el-input>-->
      <!--元-->
      <!--<el-input v-model="accountRuleForm.nightFirstTime" autocomplete="off"></el-input>-->
      <!--{{accountRuleForm.timeType==0?'小时':'分钟'}}-->
      <!--</el-form-item>-->
      <!--<el-form-item label="后续价" :label-width="formLabelWidth" prop="nightAfterPrice">-->
      <!--<el-input v-model="accountRuleForm.nightAfterPrice" autocomplete="off"></el-input>-->
      <!--元-->
      <!--<el-input v-model="accountRuleForm.nightAfterTime" autocomplete="off"></el-input>-->
      <!--{{accountRuleForm.timeType==0?'小时':'分钟'}}-->
      <!--</el-form-item>-->
      <!--<el-form-item label="晚上限价" :label-width="formLabelWidth">-->
      <!--<el-input v-model="accountRuleForm.nightLimit" autocomplete="off"></el-input>-->
      <!--</el-form-item>-->
      <!--</div>-->
      <!--</el-form>-->
      <!--<div slot="footer" class="dialog-footer">-->
      <!--<el-button @click="cancelSubmit('accountRuleForm')">取 消</el-button>-->
      <!--<el-button type="primary" @click="saveAccountRule('accountRuleForm')">确 定</el-button>-->
      <!--</div>-->
      <!--</el-dialog>-->
      <!--</div>-->
      <!--<div class="price-rules">-->
      <!--<ul>-->
      <!--<li class="price-rule-item" v-for="rule in accountRules" :key="rule.rulesid">-->
      <!--<div class="ruleName">规则名称：{{rule.rulesName}}</div>-->
      <!--<div class="ruleDesc">-->
      <!--<div class="unifiedRule" v-if="rule.valuationType==0">-->
      <!--<span class="badge bg-blue" v-if="rule.licenseColor==0">普</span>-->
      <!--<span class="badge bg-blue" v-if="rule.licenseColor==1">蓝</span>-->
      <!--<span class="badge bg-yellow" v-if="rule.licenseColor==2">黄</span>-->
      <!--<span class="badge bg-black" v-if="rule.licenseColor==3">黑</span>-->
      <!--<span class="badge bg-green" v-if="rule.licenseColor==4">绿</span>-->
      <!--统一收费：起步{{rule.firstPrice}}元/{{rule.timeType==0?'小时':'分钟'}}，后续{{rule.afterPrice}}元/{{rule.timeType==0?'小时':'分钟'}}-->
      <!--</div>-->
      <!--<div class="piecewiseRule" v-if="rule.valuationType==1">-->
      <!--<div class="piecewiseRuleTitle">-->
      <!--<span class="badge bg-blue" v-if="rule.licenseColor==0">普</span>-->
      <!--<span class="badge bg-blue" v-if="rule.licenseColor==1">蓝</span>-->
      <!--<span class="badge bg-yellow" v-if="rule.licenseColor==2">黄</span>-->
      <!--<span class="badge bg-black" v-if="rule.licenseColor==3">黑</span>-->
      <!--<span class="badge bg-green" v-if="rule.licenseColor==4">绿</span>-->
      <!--分时计费：-->
      <!--</div>-->
      <!--<div class="piecewiseRuleDesc">-->
      <!--白天：起步{{rule.dayFirstPrice}}元/{{rule.timeType==0?'小时':'分钟'}}，后续{{rule.dayAfterPrice}}元/{{rule.timeType==0?'小时':'分钟'}}<br>-->
      <!--晚上：起步{{rule.nightFirstPrice}}元/{{rule.timeType==0?'小时':'分钟'}}，后续{{rule.nightAfterPrice}}元/{{rule.timeType==0?'小时':'分钟'}}-->
      <!--</div>-->
      <!--</div>-->
      <!--<section class="button-group">-->
      <!--<el-button type="primary" @click="modelShow(rule.rulesId)">编辑</el-button>-->
      <!--<el-button type="primary">删除</el-button>-->
      <!--<el-button type="primary">上移</el-button>-->
      <!--<el-button type="primary">下移</el-button>-->
      <!--</section>-->
      <!--</div>-->
      <!--</li>-->
      <!--</ul>-->
      <!--</div>-->
      <!--<div class="no-rules" v-if="!accountRules[0]"><p class="prompt">暂无计费规则，请添加</p></div>-->
      <!--</div>-->
      <!--</el-card>-->
      <!--</div>-->
      <!--<div class="priceSetting"></div>-->
    </div>
  </div>
</template>
<script>
import parkList from '../components/parkingList'

export default {
  name: 'parkInfo',
  data () {
    return {
      basicInfo: {},
      accountRuleForm: {},
      accountRules: [],
      parkingLotId: '',
      managementParkId: '',
      chargeParkId: '',
      nextParkLots: [],
      dialogTableVisible: false,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      accountFillRule: {
        rulesName: [
          {required: true, message: '请输入活动名称', trigger: 'blur'}
        ],
        freeTime: [
          {required: true, message: '请输入免费时间', trigger: 'blur'}
        ],
        firstPrice: [
          {required: true, message: '请输入起步价', trigger: 'blur'}
        ],
        firstTime: [
          {required: true, message: '请输入起步时长', trigger: 'blur'}
        ],
        afterPrice: [
          {required: true, message: '请输入后续价', trigger: 'blur'}
        ],
        dayStartTime: [
          {required: true, message: '请输入白天时段', trigger: 'blur'}
        ],
        afterTime: [
          {required: true, message: '请输入后续时长', trigger: 'blur'}
        ],
        dayEndTime: [
          {required: true, message: '请输入白天时段', trigger: 'blur'}
        ],
        dayFirstPrice: [
          {required: true, message: '请输入起步价', trigger: 'blur'}
        ],
        dayAfterPrice: [
          {required: true, message: '请输入后续价', trigger: 'blur'}
        ],
        nightStartTime: [
          {required: true, message: '请输入晚上时段', trigger: 'blur'}
        ],
        nightEndTime: [
          {required: true, message: '请输入晚上时段', trigger: 'blur'}
        ],
        nightFirstPrice: [
          {required: true, message: '请输入起步价', trigger: 'blur'}
        ],
        nightAfterPrice: [
          {required: true, message: '请输入后续价', trigger: 'blur'}
        ]
      },
      changeFlag: false
    }
  },
  components: {
    parkList
  },
  methods: {
    updateFlag (fileType, fileValue, flagName) {
      let _this = this
      if (fileValue === 0) {
        flagName = flagName + '--关闭'
      } else {
        flagName = flagName + '--开启'
      }
      if (_this.managementParkId) {
        _this.$axios.post('/api/pklot/updateFlags', {
          fileType: fileType,
          fileValue: fileValue,
          parkId: _this.managementParkId,
          flagName: flagName
        }).then(function (res) {
          if (res) {
            _this.$message({
              message: '保存成功',
              type: 'success'
            })
          }
        }).catch(function () {
          console.log('error')
        })
      }
    },
    getParkLotIdFromList (data) {
      let _this = this
      _this.parkingLotId = data
      _this.getParkinglotInfo(_this.parkingLotId)
      _this.getChargeRules(_this.parkingLotId)
      _this.getNextParkLot(_this.parkingLotId)
    },
    getParkinglotInfo (parkingLotId) {
      let _this = this
      _this.$axios.post('/api/pklot/getParkinglotInfo', {
        parkingLotId: parkingLotId
      }).then(function (res) {
        if (res) {
          _this.basicInfo = res.data.data
        }
      }).catch(function () {
        console.log('error')
      })
    },
    getNextParkLot (parkingLotId) {
      let _this = this
      _this.$axios.post('/api/pklot/getNestParkinglot', {
        parkingLotId: parkingLotId
      }).then(function (res) {
        if (res) {
          _this.nextParkLots = res.data.data
          _this.chargeParkId = parkingLotId
          _this.managementParkId = parkingLotId
        }
      }).catch(function () {
        console.log('error')
      })
    },
    getNextLotManagement (selVal) {
      this.getParkinglotInfo(selVal)
    },
    getNextCharge (selVal) {
      this.getChargeRules(selVal)
    },
    getChargeRules (parkingLotId) {
      let _this = this
      this.$axios.post('/api/pklot/listChargeRules', {
        parkingLotId: parkingLotId
      }).then(function (res) {
        if (res) {
          _this.accountRules = res.data.data
        }
      }).catch(function () {
        console.log('error')
      })
    },
    modelShow (ruleId) {
      this.dialogFormVisible = true
      if (ruleId) {
        let _this = this
        _this.$axios.post('/api/pklot/getChargeRule', {
          rulesId: ruleId
        }).then(function (res) {
          if (res) {
            _this.accountRuleForm = res.data.data
          }
        }).catch(function () {
          console.log('error')
        })
      } else {
        let _this = this
        _this.accountRuleForm = {
          dayFirstTime: '',
          timeType: '0',
          afterTime: '',
          dayAfterPrice: '',
          dayFirstPrice: '',
          limitHour: '',
          licenseColor: '0',
          carType: '0',
          afterPrice: '',
          freeTime: '',
          dayStartTime: '',
          nightFirstPrice: '',
          valuationType: '0',
          nightEndTime: '',
          parkingType: '0',
          limitPrice: '0',
          nightStartTime: '',
          firstPrice: '',
          firstTime: '',
          parkinglotId: _this.parkingLotId,
          dayEndTime: '',
          nightAfterPrice: '',
          nightFirstTime: '',
          nightAfterTime: '',
          dayAfterTime: '',
          remarks: '',
          dayLimit: '',
          nightLimit: '',
          rulesName: ''
        }
      }
    },
    cancelSubmit (accountRuleForm) {
      this.dialogFormVisible = false
      this.$refs[accountRuleForm].clearValidate()
    },
    saveAccountRule (accountRuleForm) {
      this.$refs[accountRuleForm].validate((valid) => {
        let _this = this
        if (valid) {
          _this.$refs[accountRuleForm].clearValidate()
          _this.dialogFormVisible = false
          if (_this.accountRuleForm.rulesId) {
            _this.$axios.post('/api/pklot/updateChargeRule', _this.accountRuleForm).then(function (res) {
              if (res) {
                _this.$message({
                  message: '保存成功',
                  type: 'success'
                })
              }
            }).catch(function () {
              console.log('error')
            })
            _this.getChargeRules()
          } else {
            _this.$axios.post('/api/pklot/saveChargeRule', _this.accountRuleForm).then(function (res) {
              if (res) {
                _this.$message({
                  message: '保存成功',
                  type: 'success'
                })
              }
            }).catch(function () {
              console.log('error')
            })
            _this.getChargeRules()
          }
        } else {
          _this.$message.error('请填写必填项')
          // _this.$refs[accountRuleForm].clearValidate()
          return false
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
  .basic-info {
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

  .price-rules {
    ul {
      list-style: none;
      margin-top: 15px;
      padding: 0px;
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
        .el-button {
          padding: 12px 12px;
        }
      }
    }
  }

  .no-rules {
    .prompt {
      text-align: center;
      color: rgb(3, 183, 166);
    }
  }

  .el-input {
    width: 100px;
  }

  .set-item-input {
    display: inline-block;
    float: right;
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

  .el-switch {
    float: right;
  }

  .title {
    font-size: 16px;
    margin-top: 10px;
    padding: 0 10px;
    color: #23262E;
    font-weight: bold;
  }

  .titleHr {
    height: 1px;
    margin: 10px 0;
    border: 0;
    clear: both;
    background-color: #eee !important;
    color: #666 !important;
  }

  .basicInfo {
    margin: 0 20px 20px;
    border-top: 2px solid #dbd8d8;
    background-color: #fff;
    color: #676A6C;
    padding-bottom: 10px;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.3);
    .basicInfoItem {
      padding: 0 10px;
      .el-form-item {
        margin-bottom: 0;
      }
    }
    .parkImg {
      height: 120px;
      width: 100px
    }
  }

  .price-select-child {
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
  }

  .managementSetting {
    margin: 0 20px 20px;
    border-top: 2px solid #dbd8d8;
    background-color: #fff;
    color: #676A6C;
    padding-bottom: 10px;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.3);
    .selectChildPark {
      padding: 0 10px;
      .el-select {
        width: 50%;
      }
      .prompt {
        display: inline-block;
        font-size: 14px;
      }
    }
    .managementSettingList {
      list-style: none;
      margin: 0;
      padding: 10px 10px;
      .managementSettingItem {
        position: relative;
        border-bottom: 1px solid #eeeeee;
        height: 50px;
        .setTitle {
          font-weight: bold;
          color: #23262E;
          font-size: 14px;
          margin: 0;
          line-height: 30px;
        }
        .setDes {
          color: #676A6C;
          font-size: 12px;
          margin: 0;
          line-height: 1;
        }
        .el-switch {
          position: absolute;
          right: 10px;
          top: 20px;
        }
      }
    }
  }
</style>
