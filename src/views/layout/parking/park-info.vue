/**
* @author: daina
* @date: 2019/3/17
* @description:
*/
<template>
  <div>
    <parkList v-on:getSelectedParkLotId="getParkLotIdFromList"/>
    <div class="content" :class="{'covered':showTag}">
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
                    <div class="ruleName">规则名称：{{rule.ruleName}}</div>
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
                        <el-button type="primary" size="small" :disabled="topRuleId===rule.ruleId"
                                   @click="changeRuleOrderLevel(rule, 0)">上移
                        </el-button>
                        <el-button type="primary" size="small" :disabled="endRuleId===rule.ruleId"
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
    <el-dialog
      title="计费规则设置"
      :visible.sync="chargeFormVisible"
      width="680px"
      top="10vh"
      :close-on-click-modal="false"
      custom-class="rule-dialog"
      @close="cancelSubmit('accountRuleForm')"
    >
      <el-tabs
        v-model="setTabType"
        class="tabs-btn-group"
      >
        <el-tab-pane label="基础设置" name="basic">
          <div class="tab-content">
            <el-form :model="accountRuleForm" :rules="accountFillRule" ref="basicForm" size="mini"
                     label-width="380px"
                     label-position="left">
              <el-form-item label="规则名称" prop="ruleName">
                <el-input v-model="accountRuleForm.ruleName"
                          autocomplete="off" ref="ruleName"></el-input>
                <div class="explain">设定计费规则名称</div>
              </el-form-item>
              <el-form-item label="停车分类">
                <el-select v-model="accountRuleForm.parkingType" placeholder="请选择停车分类">
                  <el-option label="不区分" value="0"></el-option>
                  <el-option v-for="parkingType in carCategoryList" :key="parkingType.categoryId"
                             :value="parkingType.categoryId" :label="parkingType.categoryName"></el-option>
                </el-select>
                <div class="explain">设定车辆分类，实现不同车主区分计费</div>
              </el-form-item>
              <el-form-item label="车牌颜色">
                <el-select v-model="accountRuleForm.licenseColor" placeholder="请选择车牌颜色">
                  <el-option label="不区分颜色" value="0"></el-option>
                  <el-option label="蓝色" value="1"></el-option>
                  <el-option label="黄色" value="2"></el-option>
                  <el-option label="黑色" value="3"></el-option>
                  <el-option label="绿色" value="4"></el-option>
                </el-select>
                <div class="explain">设定车牌颜色，按不同车牌颜色区分计费</div>
              </el-form-item>
              <el-form-item label="车型类别">
                <el-select v-model="accountRuleForm.carType" placeholder="请选择车型类别">
                  <el-option label="不区分" value="0"></el-option>
                  <el-option label="小型汽车" value="1"></el-option>
                  <el-option label="中型汽车" value="2"></el-option>
                  <el-option label="大型汽车" value="3"></el-option>
                  <el-option label="其他" value="4"></el-option>
                </el-select>
                <div class="explain">设定车型，按车辆类型区分计费</div>
              </el-form-item>
              <el-form-item label="无入场默认金额" prop="defaultPrice">
                <div class="default-price">
                  <el-input v-model="accountRuleForm.defaultPrice"
                            autocomplete="off" ref="defaultPrice"></el-input>
                  元
                </div>
                <div class="explain">无入场记录时，车辆默认收费金额</div>
              </el-form-item>
              <el-form-item label="限价设置">
                <div class="price-set">
                  <el-form-item>
                    <el-select v-model="accountRuleForm.limitHour">
                      <el-option label="不限价" value="0"></el-option>
                      <el-option label="8小时" value="8"></el-option>
                      <el-option label="12小时" value="12"></el-option>
                      <el-option label="24小时" value="24"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="limitPrice">
                    <el-input v-model="accountRuleForm.limitPrice" autocomplete="off"
                              class="model-input" ref="limitPrice"
                    ></el-input>
                  </el-form-item>
                  元
                </div>
                <div class="explain">设置限价后，系统会根据规则减去超出限价的停车费用</div>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="价格设置" name="price">
          <div class="tab-content">
            <el-form
              :model="accountRuleForm"
              :rules="accountFillRule"
              ref="priceForm"
              size="mini"
              label-position="left"
              label-width="240px"
            >
              <el-form-item label="价格设置">
                <el-select
                  v-model="accountRuleForm.valuationType"
                  @change="clearPriceForm"
                >
                  <el-option label="统一计费" value="0"></el-option>
                  <el-option label="分段计费" value="1"></el-option>
                </el-select>&nbsp;&nbsp;&nbsp;&nbsp;
                <el-select v-model="accountRuleForm.timeType">
                  <el-option label="按小时计费" value="0"></el-option>
                  <el-option label="按分钟计费" value="1"></el-option>
                </el-select>
                <div class="explain">设置具体价格，系统支持分段计费</div>
              </el-form-item>
              <el-form-item label="免费时间" prop="freeTime">
                <el-input v-model="accountRuleForm.freeTime"
                          autocomplete="off" ref="freeTime"
                ></el-input>
                {{accountRuleForm.timeType==0?'小时':'分钟'}}
                <div class="explain">免费停车时长</div>
              </el-form-item>
              <div class="unified" v-if="accountRuleForm.valuationType==='0'">
                <el-form-item label="起步价" required>
                  <div class="price-time">
                    <el-form-item prop="firstPrice">
                      <el-input v-model="accountRuleForm.firstPrice" autocomplete="off"
                                class="model-input" ref="firstPrice"
                      ></el-input>
                      元
                    </el-form-item>
                    <el-form-item prop="firstTime">
                      <el-input v-model="accountRuleForm.firstTime" autocomplete="off"
                                class="model-input" ref="firstTime"></el-input>
                      {{accountRuleForm.timeType==0?'小时':'分钟'}}
                    </el-form-item>
                  </div>
                  <div class="explain">停车起步价格与时长</div>
                </el-form-item>
                <el-form-item label="后续价" required>
                  <div class="price-time">
                    <el-form-item prop="afterPrice">
                      <el-input v-model="accountRuleForm.afterPrice" autocomplete="off"
                                class="model-input" ref="afterPrice"></el-input>
                      元
                    </el-form-item>
                    <el-form-item prop="afterTime">
                      <el-input v-model="accountRuleForm.afterTime" autocomplete="off"
                                class="model-input" ref="afterTime"></el-input>
                      {{accountRuleForm.timeType==0?'小时':'分钟'}}
                    </el-form-item>
                  </div>
                  <div class="explain">停车后续价格与时长</div>
                </el-form-item>
              </div>
              <div class="piecewise" v-if="accountRuleForm.valuationType==='1'">
                <el-form-item label="白天时段" required>
                  <div class="price-time">
                    <el-form-item prop="dayStartTime">
                      <el-time-picker v-model="accountRuleForm.dayStartTime" format="HH:mm"
                                      value-format="HH:mm"
                                      ref="dayStartTime"></el-time-picker>
                      至
                    </el-form-item>
                    <el-form-item prop="dayEndTime">
                      <el-time-picker v-model="accountRuleForm.dayEndTime" format="HH:mm"
                                      value-format="HH:mm"
                                      ref="dayEndTime"></el-time-picker>
                    </el-form-item>
                  </div>
                  <div class="explain">分段计费白天时间段</div>
                </el-form-item>
                <el-form-item label="起步价" required>
                  <div class="price-time">
                    <el-form-item prop="dayFirstPrice">
                      <el-input v-model="accountRuleForm.dayFirstPrice" autocomplete="off"
                                class="model-input" ref="dayFirstPrice"></el-input>
                      元
                    </el-form-item>
                    <el-form-item prop="dayFirstTime">
                      <el-input v-model="accountRuleForm.dayFirstTime" autocomplete="off"
                                class="model-input" ref="dayFirstTime"></el-input>
                      {{accountRuleForm.timeType==0?'小时':'分钟'}}
                    </el-form-item>
                  </div>
                  <div class="explain">白天时段停车起步价格与时长</div>
                </el-form-item>
                <el-form-item label="后续价" required>
                  <div class="price-time">
                    <el-form-item prop="dayAfterPrice">
                      <el-input v-model="accountRuleForm.dayAfterPrice" autocomplete="off"
                                class="model-input" ref="dayAfterPrice"></el-input>
                      元
                    </el-form-item>
                    <el-form-item prop="dayAfterTime">
                      <el-input v-model="accountRuleForm.dayAfterTime" autocomplete="off"
                                class="model-input" ref="dayAfterTime"></el-input>
                      {{accountRuleForm.timeType==0?'小时':'分钟'}}
                    </el-form-item>
                  </div>
                  <div class="explain">白天时段停车后续价格与时长</div>
                </el-form-item>
                <el-form-item label="白天限价" prop="dayLimit">
                  <el-input v-model="accountRuleForm.dayLimit" ref="dayLimit" autocomplete="off"></el-input>
                  元
                  <div class="explain">白天时段限制价格</div>
                </el-form-item>
                <el-form-item label="晚上时段" required>
                  <div class="price-time">
                    <el-form-item prop="nightStartTime">
                      <el-time-picker v-model="accountRuleForm.nightStartTime" format="HH:mm"
                                      value-format="HH:mm"
                                      ref="nightStartTime"></el-time-picker>
                      至
                    </el-form-item>
                    <el-form-item prop="nightEndTime">
                      <el-time-picker v-model="accountRuleForm.nightEndTime" format="HH:mm"
                                      value-format="HH:mm"
                                      ref="nightEndTime"></el-time-picker>
                    </el-form-item>
                  </div>
                  <div class="explain">分段计费晚上时间段</div>
                </el-form-item>
                <el-form-item label="起步价" required>
                  <div class="price-time">
                    <el-form-item prop="nightFirstPrice">
                      <el-input v-model="accountRuleForm.nightFirstPrice" autocomplete="off"
                                class="model-input" ref="nightFirstPrice"></el-input>
                      元
                    </el-form-item>
                    <el-form-item prop="nightFirstTime">
                      <el-input v-model="accountRuleForm.nightFirstTime" autocomplete="off"
                                class="model-input" ref="nightFirstTime"></el-input>
                      {{accountRuleForm.timeType==0?'小时':'分钟'}}
                    </el-form-item>
                  </div>
                  <div class="explain">晚上时段停车起步价格与时长</div>
                </el-form-item>
                <el-form-item label="后续价" required>
                  <div class="price-time">
                    <el-form-item prop="nightAfterPrice">
                      <el-input v-model="accountRuleForm.nightAfterPrice" autocomplete="off"
                                class="model-input" ref="nightAfterPrice"></el-input>
                      元
                    </el-form-item>
                    <el-form-item prop="nightAfterTime">
                      <el-input v-model="accountRuleForm.nightAfterTime" autocomplete="off"
                                class="model-input" ref="nightAfterTime"></el-input>
                      {{accountRuleForm.timeType==0?'小时':'分钟'}}
                    </el-form-item>
                  </div>
                  <div class="explain">晚上时段停车后续价格与时长</div>
                </el-form-item>
                <el-form-item label="晚上限价" prop="nightLimit">
                  <el-input v-model="accountRuleForm.nightLimit" ref="nightLimit" autocomplete="off"></el-input>
                  元
                  <div class="explain">晚上时段限制价格</div>
                </el-form-item>
                <i>* 若设置了"白天限价"或者"晚上限价"，"限价设置"将失效</i>
              </div>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelSubmit()">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveAccountRule()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="删除提示"
      :visible.sync="deleteDialogVisible"
      width="350px"
      :close-on-click-modal="false"
      top="30vh"
    >
      <el-form ref="form" :model="ruleInfo" size="mini">
        <div class="statusPrompt">
          <i class="iconfont icon-wenhao"></i>
          <span>确定删除计费规则：{{ruleInfo.ruleName}} ?</span>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="deleteDialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="deleteRule">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import parkList from '../components/parkingList'

export default {
  name: 'parkInfo',
  data () {
    let numberValidation = (rule, value, callback) => {
      if (value) {
        if (!/^\d+(\.\d+)?$/.test(value)) {
          callback(new Error('请输入大于0的数字'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      isAdmin: sessionStorage.getItem('isAdmin'),
      showTag: false,
      parkingLotId: '',
      managementParkId: '',
      chargeParkId: '',
      basicInfo: {},
      nextParkLots: [],
      managementBasicInfo: {},
      accountRules: [],
      chargeFormVisible: false,
      deleteDialogVisible: false,
      accountRuleForm: {
        dayFirstTime: '',
        timeType: '0',
        afterTime: '',
        dayAfterPrice: '',
        dayFirstPrice: '',
        limitHour: '0',
        licenseColor: '0',
        carType: '0',
        afterPrice: '',
        freeTime: '',
        dayStartTime: '',
        nightFirstPrice: '',
        valuationType: '0',
        nightEndTime: '',
        parkingType: '0',
        limitPrice: '',
        nightStartTime: '',
        firstPrice: '',
        firstTime: '',
        parkingLotId: this.chargeParkId,
        dayEndTime: '',
        nightAfterPrice: '',
        nightFirstTime: '',
        nightAfterTime: '',
        dayAfterTime: '',
        remarks: '',
        dayLimit: '',
        nightLimit: '',
        ruleName: ''
      },
      setTabType: 'basic',
      carCategoryList: [],
      accountFillRule: {
        ruleName: [
          {required: true, message: '请输入规则名称', trigger: 'blur'},
          {min: 1, max: 20, message: '名称不能超过20位', trigger: 'blur'}
        ],
        freeTime: [
          {required: true, message: '请输入免费时间', trigger: 'blur'},
          {validator: numberValidation, trigger: 'blur'}
        ],
        firstPrice: [
          {required: true, message: '请输入起步价', trigger: 'blur'},
          {validator: numberValidation, trigger: 'blur'}
        ],
        firstTime: [
          {required: true, message: '请输入起步时长', trigger: 'blur'},
          {validator: numberValidation, trigger: 'blur'}
        ],
        afterPrice: [
          {required: true, message: '请输入后续价', trigger: 'blur'},
          {validator: numberValidation, trigger: 'blur'}
        ],
        afterTime: [
          {required: true, message: '请输入后续时长', trigger: 'blur'},
          {validator: numberValidation, trigger: 'blur'}
        ],
        dayStartTime: [
          {required: true, message: '请输入白天时段', trigger: 'blur'}
        ],
        dayEndTime: [
          {required: true, message: '请输入白天时段', trigger: 'blur'}
        ],
        dayFirstPrice: [
          {required: true, message: '请输入起步价', trigger: 'blur'},
          {validator: numberValidation, trigger: 'blur'}
        ],
        dayFirstTime: [
          {required: true, message: '请输入起步时长', trigger: 'blur'},
          {validator: numberValidation, trigger: 'blur'}
        ],
        dayAfterPrice: [
          {required: true, message: '请输入后续价', trigger: 'blur'},
          {validator: numberValidation, trigger: 'blur'}
        ],
        dayAfterTime: [
          {required: true, message: '请输入起步时长', trigger: 'blur'},
          {validator: numberValidation, trigger: 'blur'}
        ],
        nightStartTime: [
          {required: true, message: '请输入晚上时段', trigger: 'blur'}
        ],
        nightEndTime: [
          {required: true, message: '请输入晚上时段', trigger: 'blur'}
        ],
        nightFirstPrice: [
          {required: true, message: '请输入起步价', trigger: 'blur'},
          {validator: numberValidation, trigger: 'blur'}
        ],
        nightAfterPrice: [
          {required: true, message: '请输入后续价', trigger: 'blur'},
          {validator: numberValidation, trigger: 'blur'}
        ],
        nightFirstTime: [
          {required: true, message: '请输入起步时长', trigger: 'blur'},
          {validator: numberValidation, trigger: 'blur'}
        ],
        nightAfterTime: [
          {required: true, message: '请输入后续价', trigger: 'blur'},
          {validator: numberValidation, trigger: 'blur'}
        ],
        defaultPrice: [
          {validator: numberValidation, trigger: 'blur'}
        ],
        limitPrice: [
          {validator: numberValidation, trigger: 'blur'}
        ],
        nightLimit: [
          {validator: numberValidation, trigger: 'blur'}
        ],
        dayLimit: [
          {validator: numberValidation, trigger: 'blur'}
        ]
      },
      topRuleId: '',
      endRuleId: '',
      ruleInfo: {}
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
      if (this.isAdmin === '1') {
        this.showTag = true
      }
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
        this.accountRules = response.data.data
        if (response.data.data.length) {
          this.topRuleId = response.data.data[0].ruleId
          this.endRuleId = response.data.data[response.data.data.length - 1].ruleId
        }
      })
    },
    // 价格设置弹出层
    modelShow (rule) {
      this.setTabType = 'basic'
      this.chargeFormVisible = true
      this.getTempType()
      if (rule) {
        this.accountRuleForm = rule
      } else {
        this.accountRuleForm = {
          dayFirstTime: '',
          timeType: '0',
          afterTime: '',
          dayAfterPrice: '',
          dayFirstPrice: '',
          limitHour: '0',
          licenseColor: '0',
          carType: '0',
          afterPrice: '',
          freeTime: '',
          dayStartTime: '',
          nightFirstPrice: '',
          valuationType: '0',
          nightEndTime: '',
          parkingType: '0',
          limitPrice: '',
          nightStartTime: '',
          firstPrice: '',
          firstTime: '',
          parkingLotId: this.chargeParkId,
          dayEndTime: '',
          nightAfterPrice: '',
          nightFirstTime: '',
          nightAfterTime: '',
          dayAfterTime: '',
          remarks: '',
          dayLimit: '',
          nightLimit: '',
          ruleName: ''
        }
      }
    },
    // 获取临停车辆类型
    getTempType () {
      this.$axios.post('/api/pklot/getCarCategoryList', {
        parkingLotId: this.parkingLotId,
        categoryType: 4
      }).then(response => {
        this.carCategoryList = response.data.data
      })
    },
    // 保存价格设置
    saveAccountRule () {
      let failedFields = {}
      console.log(this.accountRuleForm)
      this.$refs['basicForm'].validate((valid, invalidFields) => {
        console.log(invalidFields)
        if (valid) {
          this.$refs['priceForm'].validate((valid, invalidFields) => {
            if (valid) {
              this.chargeFormVisible = false
              document.getElementsByClassName('tab-content')[1].scrollTop = 0
              if (this.accountRuleForm.ruleId) {
                this.$axios.post('/api/pklot/updateChargeRule', this.accountRuleForm).then(response => {
                  if (response.data.data === 1) {
                    this.$message.success('保存成功')
                    this.getChargeRules(this.chargeParkId)
                    this.setTabType = 'basic'
                    this.$refs['basicForm'].clearValidate()
                    this.$refs['priceForm'].clearValidate()
                  }
                }).catch(error => {
                  console.log(error)
                  this.$message.error('服务器错误')
                })
              } else {
                this.$axios.post('/api/pklot/addChargeRule', this.accountRuleForm).then(response => {
                  if (response.data.data === 1) {
                    this.$message.success('保存成功')
                    this.getChargeRules(this.chargeParkId)
                    this.setTabType = 'basic'
                    this.$refs['basicForm'].clearValidate()
                    this.$refs['priceForm'].clearValidate()
                  }
                }).catch(error => {
                  console.log(error)
                  this.$message.error('服务器错误')
                })
              }
            } else {
              console.log('验证失败')
              this.setTabType = 'price'
              failedFields = invalidFields
              let obj = {}
              for (obj in failedFields) {
                this.$refs[obj].focus()
                console.log(obj)
                break
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
    // 切换统一/分段计费后清空表单
    clearPriceForm () {
      this.$refs.priceForm.clearValidate()
    },
    // 弹出层取消提交
    cancelSubmit () {
      this.chargeFormVisible = false
      document.getElementsByClassName('tab-content')[1].scrollTop = 0
      this.$refs['basicForm'].clearValidate()
      this.$refs['priceForm'].clearValidate()
    },
    // 规则上下移动
    changeRuleOrderLevel (rule, direction) {
      this.$axios.post('/api/pklot/updateChargeRuleOrderLevel', {
        parkingLotId: rule.parkingLotId,
        ruleId: rule.ruleId,
        direction: direction
      }).then(response => {
        console.log(response)
        this.$message.success('操作成功')
        this.getChargeRules(rule.parkingLotId)
      }).catch(error => {
        console.log(error)
      })
    },
    // 删除价格规则
    deleteModel (rule) {
      this.deleteDialogVisible = true
      this.ruleInfo = rule
    },
    // 删除规则
    deleteRule () {
      this.$axios.post('/api/pklot/deleteChargeRule', {
        ruleId: this.ruleInfo.ruleId
      }).then(response => {
        if (response.data.data === 1) {
          this.$message.success('删除成功')
          this.getChargeRules(this.ruleInfo.parkingLotId)
        }
      }).catch(error => {
        console.log(error)
      })
      this.deleteDialogVisible = false
    }
  }
}
</script>

<style scoped lang="scss">
  /deep/ {
    .el-dialog {
      display: flex;
      flex-direction: column;
    }
    .el-dialog__body {
      overflow: auto;
      padding-right: 0px;
    }
    .el-scrollbar {
      height: 100%;
    }
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }
  .covered {
    margin-left: 315px !important;
  }
  .content {
    margin-left: 0;
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
  }
  .rule-dialog {
    /deep/ {
      .el-dialog__body {
        padding: 30px 0 30px 20px !important;
      }
    }
    .tab-content {
      height: 340px;
      overflow: auto;
    }
    .el-form {
      margin-right: 20px;
    }
    #pane-price {
      .el-form-item {
        /deep/ {
          .el-input {
            width: 160px;
          }
          .el-form-item__label {
            font-weight: bold;
            color: #444444;
            line-height: 18px;
          }
        }
        position: relative;
        height: 45px;
        border-bottom: 1px solid #eeeeee;
        margin-bottom: 10px;
        .explain {
          position: absolute;
          left: -240px;
          font-size: 12px;
          color: #676A6C;
          top: 11px;
        }
        .price-time {
          display: inline-block;
          .el-form-item {
            display: inline-block;
            margin-bottom: 0px;
          }
        }
      }
    }
    #pane-basic {
      .el-form-item {
        /deep/ {
          .el-form-item__label {
            font-weight: bold;
            color: #444444;
            line-height: 18px;
          }
        }
        position: relative;
        height: 45px;
        border-bottom: 1px solid #eeeeee;
        margin-bottom: 10px;
        .explain {
          position: absolute;
          left: -380px;
          font-size: 12px;
          color: #676A6C;
          top: 11px;
        }
        .default-price {
          /deep/ {
            .el-input {
              width: 200px;
            }
          }
        }
        .price-set {
          width: 220px;
          /deep/ {
            .el-form-item {
              display: inline-block;
              margin-bottom: 0px;
              .el-input {
                width: 98px;
              }
            }
          }
        }
        /deep/ {
          .el-input {
            width: 220px;
          }
          .el-form-item__error--inline {
            position: relative;
            top: 18px;
            right: 10px;
            float: right;
            display: inline-block;
            margin-left: 10px;
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
