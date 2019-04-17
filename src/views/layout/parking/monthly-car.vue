/**
* @author: daina
* @date: 2019/3/24
* @description:
*/
<template>
  <div>
    <parkList v-on:getSelectedParkLotId="getParkLotIdFromList"/>
    <div class="container" :class="{'covered':showTag}">
      <div class="monthly-header">
        <div class="search-input">
          <el-input v-model="searchInfo" placeholder="请输入房号、车主、车牌或者包月车位查询" size="small"
                    @keyup.enter.native="getMonthlyList"><i slot="prefix"
                                                            class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <section class="button-group">
          <el-button type="primary" size="small" @click="getMonthlyList">查询</el-button>
          <el-button type="primary" size="small" @click="addMonthlyUser">添加
          </el-button>
          <input-excel @getResult="getMonthlyExcelData"/>
          <el-button type="primary" size="small" @click="exportMonthly">导出</el-button>
          <el-button type="primary" size="small" @click="downloadMonthlyUserTemp">
            下载模板
          </el-button>
        </section>
      </div>
      <el-tabs v-model="monthlyType" @tab-click="handleClick">
        <el-tab-pane name="-1">
          <span slot="label">全部
          </span>
        </el-tab-pane>
        <el-tab-pane name="0">
          <span slot="label">普通包月
          </span>
        </el-tab-pane>
        <el-tab-pane name="1">
          <span slot="label">分时包月
          </span>
        </el-tab-pane>
      </el-tabs>
      <div class="monthly-content">
        <el-table
          :data="monthlyList"
          border
          :height="tableHeight"
          style="width: 100%">
          <el-table-column
            prop="ownerName"
            label="车主"
            fixed
            min-width="100"
            align="center"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="roomNumber"
            label="房号"
            min-width="130"
            align="center"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="phone"
            label="电话"
            min-width="120"
            align="center"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="monthlyType"
            label="包月类型"
            min-width="80"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{scope.row.monthlyType? '分时':'普通'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="carLicense"
            label="车牌号"
            min-width="150"
            align="center"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="occupyNum"
            label="占用车位"
            min-width="90"
            align="center"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="monthlyAmount"
            label="包月金额"
            min-width="90"
            align="center"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="expDate"
            label="到期时间"
            min-width="120"
            align="center"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="categoryName"
            label="车辆类别"
            min-width="120"
            align="center"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="monthlySpace"
            label="包月车位"
            min-width="120"
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
              <el-button @click="renewalModel(scope.row)" type="primary" size="mini">续费</el-button>
              <el-button type="primary" size="mini" @click="editMonthlyUser(scope.row)">编辑</el-button>
              <el-button type="danger" size="mini" @click="deleteModel(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :disabled="monthlyTotal === 0"
          class="table-page"
          @size-change="monthlySizeChange"
          @current-change="monthlyCurrentChange"
          :current-page="monthlyCurrentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="20"
          layout="total, sizes, prev, pager, next, jumper"
          background
          :total="monthlyTotal">
        </el-pagination>
      </div>
      <el-dialog
        title="包月用户信息"
        :visible.sync="monthlyUserVisible"
        width="800px"
        top="10vh"
        :close-on-click-modal="false"
        custom-class="monthly-dialog"
        @close="cancelSubmit()"
      >
        <el-tabs
          v-model="setTabType"
          class="tabs-btn-group"
          @tab-click="monthlyTab"
        >
          <el-tab-pane label="用户信息" name="userInfo">
            <div class="tab-content">
              <el-form :model="userInfoForm" :rules="monthlyCarRule" ref="userInfoForm" size="mini"
                       label-width="420px"
                       label-position="left">
                <el-form-item label="包月类型">
                  <div class="monthly-type">
                    <el-form-item>
                      <el-select v-model="userInfoForm.monthlyType" @change="selectMonthlyType">
                        <el-option label="普通包月" value="0"></el-option>
                        <el-option label="分时包月" value="1"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-select v-model="userInfoForm.timeRuleId"
                                 placeholder="请选择分时类型"
                                 @change="selectTimeRule"
                                 :disabled="selectTime">
                        <el-option v-for="timeRuleType in timeRuleList" :key="timeRuleType.categoryId"
                                   :value="timeRuleType.timeRuleId" :label="timeRuleType.timeRuleName"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-button type="text" size="mini" :disabled="timeShow"
                               @click="showTimeDetails(userInfoForm.timeRuleId)">详情
                    </el-button>
                  </div>
                  <div class="explain">包月用户的包月类型</div>
                </el-form-item>
                <el-form-item label="车主信息" class="owner-info-item" required>
                  <div class="owner-info">
                    <el-form-item prop="roomNumber">
                      <el-input v-model="userInfoForm.roomNumber" placeholder="请输入房号" autocomplete="off"
                                class="model-input" ref="roomNumber"></el-input>
                    </el-form-item>
                    <el-form-item prop="ownerName">
                      <el-input v-model="userInfoForm.ownerName" placeholder="请输入称呼" autocomplete="off"
                                class="model-input" ref="ownerName"></el-input>
                    </el-form-item>
                    <el-form-item prop="phone">
                      <el-input v-model="userInfoForm.phone" placeholder="请输入联系电话" autocomplete="off"
                                class="model-input" ref="phone"></el-input>
                    </el-form-item>
                  </div>
                  <div class="explain">依次填写房号、称呼、联系电话</div>
                </el-form-item>
                <el-form-item label="包月金额" prop="monthlyAmount">
                  <div class="amount">
                    <el-input v-model="userInfoForm.monthlyAmount" placeholder="请输入金额"
                              autocomplete="off" ref="monthlyAmount"></el-input>
                    元
                  </div>
                  <div class="explain">输入每月的包月金额</div>
                </el-form-item>
                <el-form-item label="车辆类别" prop="categoryId">
                  <el-select v-model="userInfoForm.categoryId" placeholder="请选择车辆类别">
                    <el-option v-for="carType in carCategoryList" :key="carType.categoryId"
                               :value="carType.categoryId" :label="carType.categoryName"></el-option>
                  </el-select>
                  <div class="explain">选择车辆类别</div>
                </el-form-item>
                <el-form-item label="包月车位" prop="monthlySpace">
                  <el-input v-model="userInfoForm.monthlySpace" placeholder="请输入包月车位信息"
                            autocomplete="off" ref="monthlySpace"></el-input>
                  <div class="explain">输入包月车位信息</div>
                </el-form-item>
                <el-form-item label="备注" prop="remarks">
                  <el-input v-model="userInfoForm.remarks" placeholder="请输入备注信息"
                            autocomplete="off" ref="remarks"></el-input>
                  <div class="explain">输入其它备注信息</div>
                </el-form-item>
                <el-form-item label="占用车位" class="occupy" required>
                  <div class="occupy-item" v-for="occupy in occupyList" :key="occupy.parkingLotId">
                    <span class="park-name">{{occupy.parkingLotName}}</span>
                    <el-form-item>
                      <el-select v-model="occupy.occupyType">
                        <el-option label="非固定车位" value="0"></el-option>
                        <el-option label="固定车位" value="1"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-input v-model="occupy.occupyNum"
                                autocomplete="off" ref="occupyNum"></el-input>
                    </el-form-item>
                    个
                  </div>
                  <div class="explain">设置占用车位信息</div>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane label="车辆信息" name="carInfo" :disabled="carInfoShow">
            <div class="tab-content">
              <div class="car-list">
                <p class="title">车辆列表</p>
                <div class="car-header">
                  <div class="car-search">
                    <el-input size="mini" v-model="carKeyWord" placeholder="请输入车牌号"
                              @keyup.enter.native="searchMonthlyCar"></el-input>
                  </div>
                  <div class="car-button-group">
                    <el-button size="mini" type="primary" @click="searchMonthlyCar">查询</el-button>
                    <el-button size="mini" type="primary" @click="addMonthlyCar">添加</el-button>
                    <input id="importCar" class="import-car" type="file" @change="exportData($event, 1)" ref="clearFile"
                           accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
                    <el-button class="import-button" type="primary" size="mini" @click="importCar">导入</el-button>
                    <el-button size="mini" type="primary" @click="downloadMonthlyCarTemp">下载模板</el-button>
                  </div>
                </div>
                <div class="car-list-table">
                  <el-table
                    :data="carList"
                    border
                    height="155"
                  >
                    <el-table-column
                      prop="carLicense"
                      label="车牌号"
                      fixed
                      min-width="100"
                      align="center"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="startDate"
                      label="开始时间"
                      min-width="130"
                      align="center"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="endDate"
                      label="结束时间"
                      min-width="120"
                      align="center"
                    >
                    </el-table-column>
                    <el-table-column
                      label="操作"
                      min-width="250"
                      align="center"
                    >
                      <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="editMonthlyCar(scope.row)">编辑</el-button>
                        <el-button type="danger" size="mini" @click="deleteMonthlyCarModel(scope.row)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-pagination
                    @current-change="monthlyCarCurrentChange"
                    :current-page="monthlyCarCurrentPage"
                    :page-size="3"
                    background
                    small
                    layout="prev, pager, next"
                    :total="monthlyCarTotal">
                  </el-pagination>
                </div>
              </div>
              <div class="presence-car-list">
                <p class="title">在场车辆列表</p>
                <div class="car-header">
                  <div class="car-search">
                    <el-input size="mini" v-model="presenceCarKeyWord" placeholder="请输入车牌号"
                              @keyup.enter.native="searchMonthlyPresenceCar"></el-input>
                  </div>
                  <div class="car-button-group">
                    <el-button size="mini" type="primary" @click="searchMonthlyPresenceCar">查询</el-button>
                  </div>
                </div>
                <div class="car-list-table">
                  <el-table
                    :data="presenceCarList"
                    border
                    height="164"
                  >
                    <el-table-column
                      prop="carLicense"
                      label="车牌号"
                      fixed
                      min-width="150"
                      align="center"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="entranceTime"
                      label="进场时间"
                      min-width="200"
                      align="center"
                    >
                    </el-table-column>
                    <el-table-column
                      label="操作"
                      min-width="250"
                      align="center"
                    >
                      <template slot-scope="scope">
                        <el-button disabled type="primary" size="mini" @click="clearModel(scope.row)">清除在场状态</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cancelSubmit">取 消</el-button>
            <el-button size="mini" type="primary" @click="saveMonthlyUser" v-show="saveButtonShow">确 定</el-button>
        </span>
        <el-dialog
          width="410px"
          title="分时包月时段详情"
          :visible.sync="timeDetailsVisible"
          append-to-body>
          <div class="rule-name">{{timeDetails.timeRuleName}}</div>
          <el-form :model="timeDetails" class="time-rule-dialog" size="small">
            <el-form-item>
              <el-checkbox label="一" v-model="timeDetails.monday" :true-label=1 :false-label=0
                           :disabled="true"></el-checkbox>
              <el-input v-model="timeDetails.timeStart1" readonly></el-input>
              至
              <el-input v-model="timeDetails.timeEnd1" readonly></el-input>
            </el-form-item>
            <el-form-item>
              <el-checkbox label="二" v-model="timeDetails.tuesday" :true-label=1 :false-label=0
                           :disabled="true"></el-checkbox>
              <el-input v-model="timeDetails.timeStart2" readonly></el-input>
              至
              <el-input v-model="timeDetails.timeEnd2" readonly></el-input>
            </el-form-item>
            <el-form-item>
              <el-checkbox label="三" v-model="timeDetails.thursday" :true-label=1 :false-label=0
                           :disabled="true"></el-checkbox>
              <el-input v-model="timeDetails.timeStart3" readonly></el-input>
              至
              <el-input v-model="timeDetails.timeEnd3" readonly></el-input>
            </el-form-item>
            <el-form-item>
              <el-checkbox label="四" v-model="timeDetails.wednesday" :true-label=1 :false-label=0
                           :disabled="true"></el-checkbox>
              <el-input v-model="timeDetails.timeStart4" readonly></el-input>
              至
              <el-input v-model="timeDetails.timeEnd4" readonly></el-input>
            </el-form-item>
            <el-form-item>
              <el-checkbox label="五" v-model="timeDetails.friday" :true-label=1 :false-label=0
                           :disabled="true"></el-checkbox>
              <el-input v-model="timeDetails.timeStart5" readonly></el-input>
              至
              <el-input v-model="timeDetails.timeEnd5" readonly></el-input>
            </el-form-item>
            <el-form-item>
              <el-checkbox label="六" v-model="timeDetails.saturday" :true-label=1 :false-label=0
                           :disabled="true"></el-checkbox>
              <el-input v-model="timeDetails.timeStart6" readonly></el-input>
              至
              <el-input v-model="timeDetails.timeEnd6" readonly></el-input>
            </el-form-item>
            <el-form-item>
              <el-checkbox label="日" v-model="timeDetails.sunday" :true-label=1 :false-label=0
                           :disabled="true"></el-checkbox>
              <el-input v-model="timeDetails.timeStart7" readonly></el-input>
              至
              <el-input v-model="timeDetails.timeEnd7" readonly></el-input>
            </el-form-item>
          </el-form>
        </el-dialog>
        <el-dialog
          width="510px"
          title="车辆信息"
          :visible.sync="carInfoVisible"
          @close="cancelMonthlyDuring"
          append-to-body>
          <el-form :model="carInfo" class="car-info-dialog" size="mini"
                   :rules="monthlyCarRule"
                   label-width="200px" label-position="left" ref="carInfoForm">
            <el-form-item label="车牌号" prop="carLicense">
              <el-input v-model="carInfo.carLicense" placeholder="请输入车牌号"
                        autocomplete="off" ref="carLicense"></el-input>
              <div class="explain">输入车牌号，支持新能源车牌哟</div>
            </el-form-item>
            <el-form-item label="包月期间" required class="monthly-title">
              <div class="explain">选择包月起止日期</div>
            </el-form-item>
            <el-form-item prop="duringMonthly" class="during-monthly">
              <el-date-picker
                ref="duringMonthly"
                v-model="carInfo.duringMonthly"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancelMonthlyDuring">取 消</el-button>
          <el-button size="mini" type="primary" @click="saveMonthlyCar">确 定</el-button>
        </span>
        </el-dialog>
        <el-dialog
          title="导入提示"
          :visible.sync="importDialogVisible"
          width="550px"
          :close-on-click-modal="false"
          top="15vh"
          custom-class="import-dialog"
          append-to-body
        >
          <div class="err-content">
            <p class="title" v-if="errMsgs.length !== 0">导入失败</p>
            <div class="no-import">
              <div class="item" v-for="(err, index) in errMsgs" :key="index">
                <p>{{err.carLicense?err.carLicense+' ': ''}}{{err.startDate?err.startDate+' ':''}}{{err.endDate?err.endDate+' ':''}}</p>
              </div>
            </div>
            <p class="title" v-if="returnErrMsgs.length !== 0">导入成功，但部分数据导入失败</p>
            <div class="return-err">
              <div class="item" v-for="(err, index) in returnErrMsgs" :key="index">
                <p>{{err.errMsg}}</p>
              </div>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="importDialogVisible = false">关闭</el-button>
        </span>
        </el-dialog>
      </el-dialog>
      <el-dialog
        title="删除提示"
        :visible.sync="deleteDialogVisible"
        width="350px"
        :close-on-click-modal="false"
        top="30vh"
      >
        <el-form ref="form" :model="userInfoForm" size="mini">
          <div class="statusPrompt">
            <i class="iconfont icon-wenhao"></i>
            <span>确定删除包月用户：{{userInfoForm.ownerName}} ?</span>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="deleteDialogVisible = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="deleteUser">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="删除提示"
        :visible.sync="deleteCarDialogVisible"
        width="350px"
        :close-on-click-modal="false"
        top="30vh"
      >
        <el-form ref="form" :model="carInfo" size="mini">
          <div class="statusPrompt">
            <i class="iconfont icon-wenhao"></i>
            <span>确定删除包月用户车辆：{{carInfo.carLicense}} ?</span>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="deleteCarDialogVisible = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="deleteMonthlyCar">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="清除在场状态提示"
        :visible.sync="clearDialogVisible"
        width="350px"
        :close-on-click-modal="false"
        top="30vh"
      >
        <el-form ref="form" :model="clearCarInfo" size="mini">
          <div class="statusPrompt">
            <i class="iconfont icon-wenhao"></i>
            <span>确定清除车辆 {{clearCarInfo.carLicense}} 在场状态 ?</span>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="clearDialogVisible = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="clearCar">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="包月续费"
        :visible.sync="monthlyRenewalVisible"
        width="800px"
        top="10vh"
        :close-on-click-modal="false"
        custom-class="renewal-dialog"
        @close="canselRenewal()"
      >
        <div class="renewal-content">
          <div class="user-info">
            <div class="name-room">
              <div class="title">{{renewalUserInfo.ownerName}}({{renewalUserInfo.roomNumber}})</div>
              <div>
                <span class="badge ordinary" v-if="!renewalUserInfo.monthlyType">普通包月</span>
                <span class="badge ordinary" v-if="renewalUserInfo.monthlyType">分时包月</span>
                <span class="badge ordinary" v-if="renewalUserInfo.phone">{{renewalUserInfo.phone}}</span>
                <span class="badge ordinary">{{renewalUserInfo.occupyNum}}车位</span>
                <span class="badge price">{{renewalUserInfo.monthlyAmount}}元/月</span>
              </div>
            </div>
          </div>
          <el-form :model="renewalInfo" :rules="monthlyCarRule" ref="renewalInfoForm" size="mini"
                   label-width="450px"
                   label-position="left">
            <el-form-item label="缴费金额" prop="amountReceivable">
              <el-input v-model="renewalInfo.amountCollected" placeholder="请输入金额"
                        autocomplete="off" ref="amountReceivable"></el-input>
              元
              <div class="explain">输入缴费金额</div>
            </el-form-item>
            <el-form-item class="set-due-tiem" label="设置到期日期" prop="expdateType">
              <el-select v-model="renewalInfo.expdateType">
                <el-option label="统一设置" value="0"></el-option>
                <el-option label="独立设置" value="1"></el-option>
              </el-select>
              <el-button type="text" size="mini" :disabled="renewalInfo.expdateType === '0'"
                         @click="renewalSet">设置
              </el-button>
              <div class="explain">设置车辆停车到期日期，支持统一设置和独立设置</div>
              <div class="renewal-time" v-if="renewalInfo.expdateType === '0'">
                <el-form-item prop="expdateStart">
                  <el-date-picker
                    v-model="renewalInfo.expdateStart"
                    type="date"
                    ref="expdateStart"
                    value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item prop="expdateEnd">
                  <el-date-picker
                    v-model="renewalInfo.expdateEnd"
                    type="date"
                    ref="expdateEnd"
                    value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                  >
                  </el-date-picker>
                </el-form-item>
              </div>
              <div class="independent" v-if="renewalInfo.expdateType === '1'">
                <span v-for="item in nearDateList" class="badge due-time" :key='item'>{{item}}</span>
                <span class="badge price">陆续到期...</span>
              </div>
            </el-form-item>
            <el-form-item label="临停费用处理" v-if="monthlyTimeoutList.length !== 0">
              <div class="explain">针对包月到期车辆已产生的临停费用进行处理。 <span style="color: red">(谨慎操作：只能进行一次操作)</span></div>
            </el-form-item>
            <div class="timeout-list" v-if="monthlyTimeoutList.length !== 0">
              <div class="timeout-item" v-for="(item,index) in monthlyTimeoutList" :key='item.recordId'>
                <span class="badge due-time">{{item.carLicense}}</span>
                <span class="badge due-time">入场 {{item.entranceTime}}</span>
                <span class="badge due-time">出场 {{item.endDate}}</span>
                <span class="badge due-time">过期 {{UnixToDate(item.stopTime)}}</span>
                <span class="badge price">{{item.amountFinal}}</span>
                <el-switch
                  v-model="monthlyTimeoutList[index].isFree"
                  active-text="收费"
                  inactive-text="不收"
                  :active-value="1"
                  :inactive-value="0"
                  :disabled="monthlyTimeoutList[index].isFree===1"
                  @change="dealTimeout(monthlyTimeoutList[index], index)"
                >
                </el-switch>
              </div>
            </div>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="canselRenewal">取 消</el-button>
          <el-button size="mini" type="primary" @click="saveRenewal">确 定</el-button>
        </span>
        <el-dialog
          width="510px"
          title="车辆信息"
          :visible.sync="renewalCarInfoVisible"
          custom-class="renewal-car-dialog"
          append-to-body>
          <div v-if="renewalCarList.length < 11">
            <div class="car-totle">
              共查询到{{renewalCarList.length}}个包月车辆信息，请设置
            </div>
            <div class="car-list">
              <div class="item" v-for="item in renewalCarList" :key="item.monthlyCarId">
                <span class="badge due-time">{{item.carLicense}}</span>
                <el-date-picker
                  v-model="item.startDate"
                  type="date"
                  value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                  size="mini"
                >
                </el-date-picker>
                至
                <el-date-picker
                  v-model="item.endDate"
                  type="date"
                  value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                  size="mini"
                >
                </el-date-picker>
              </div>
            </div>
          </div>
          <div v-if="renewalCarList.length >= 11">
            <div class="car-totle">
              共查询到{{renewalCarList.length}}个包月车辆信息，请下载模板设置后再导入。
            </div>
            <div class="car-list">
              <!--<input id="importCarExtend" class="import-car" type="file" @change="exportData($event, 0)" ref="clearFile"-->
                     <!--accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>-->
              <!--<el-button class="import-button" type="primary" size="mini" @click="importCarExtend">导入</el-button>-->
              <!--<el-button size="mini" type="primary" @click="exportMonthlyCar">导出</el-button>-->
              <!--<el-button size="mini" type="primary" @click="downloadMonthlyCarTemp">下载模板</el-button>-->
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="renewalCarInfoVisible = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="saveRenewalCarList">确 定</el-button>
        </span>
        </el-dialog>
        <el-dialog
          title="临停费用处理提示"
          :visible.sync="dealTimeoutDialogVisible"
          width="350px"
          :close-on-click-modal="false"
          top="30vh"
          append-to-body
        >
          <el-form ref="form" :model="clearCarInfo" size="mini">
            <div class="statusPrompt">
              <i class="iconfont icon-wenhao"></i>
              <span>确认当前临停费用处理?</span>
            </div>
          </el-form>
          <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="dealTimeoutDialogVisible = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="dealTimeoutConfirm">确 定</el-button>
        </span>
        </el-dialog>
      </el-dialog>
      <el-dialog
        title="导入提示"
        :visible.sync="importMonthlyDialogVisible"
        width="550px"
        :close-on-click-modal="false"
        top="15vh"
        custom-class="import-dialog"
        append-to-body
      >
        <div class="err-content">
          <p class="title" v-if="errMsgs.length !== 0">导入失败</p>
          <div class="no-import">
            <div class="item" v-for="(err, index) in errMsgs" :key="index">
              <p>{{err.roomNumber?err.roomNumber+' ': ''}}{{err.ownerName?err.ownerName+' ':''}}
                {{err.phone?err.phone+' ':''}}{{err.monthlyType?err.monthlyType+' ':''}}
                {{err.carLicense?err.carLicense+' ': ''}}{{err.parkingOccupy?err.parkingOccupy+' ':''}}
                {{err.startDate?err.startDate+' ': ''}}{{err.endDate?err.endDate+' ':''}}</p>
            </div>
          </div>
          <p class="title" v-if="returnErrMsgs.length !== 0">导入成功，但部分数据导入失败</p>
          <div class="return-err">
            <div class="item" v-for="(err, index) in returnErrMsgs" :key="index">
              <p>{{err.errMsg}}</p>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="importMonthlyDialogVisible = false">关闭</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import XLSX from 'xlsx'
import {isVehicleNumber} from '@/utils/parking/verify'
import parkList from '../components/parkingList'
import inputExcel from '../components/inputExcel'
import {exportExcel} from '@/api/export'
export default {
  name: 'monthly-car',
  data () {
    let phoneValidation = (rule, value, callback) => {
      if (value) {
        if (!/^1[3|4|5|7|8][0-9]\d{8}$/.test(value)) {
          callback(new Error('手机号码格式不正确'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
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
    let carLicenseValidation = (rule, value, callback) => {
      if (!isVehicleNumber(value)) {
        callback(new Error('请输入正确的车牌号'))
      } else {
        if (this.originalCarLicense !== value) {
          this.$axios.post('/api/pklot/getIsUsedMonthlyCarLicense', {
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
    let renewalEndDateValidation = (rule, value, callback) => {
      if (value) {
        if (value < this.renewalInfo.expdateStart) {
          callback(new Error('结束日期小于开始日期'))
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
      searchInfo: '',
      monthlyType: '-1',
      monthlyList: [],
      tableHeight: this.tableHeights(),
      monthlyCurrentPage: 1,
      monthlyPageSize: 20,
      monthlyTotal: 1,
      monthlyUserVisible: false,
      timeDetailsVisible: false,
      deleteDialogVisible: false,
      deleteCarDialogVisible: false,
      carInfoVisible: false,
      monthlyRenewalVisible: false,
      renewalCarInfoVisible: false,
      clearDialogVisible: false,
      dealTimeoutDialogVisible: false,
      importDialogVisible: false,
      importMonthlyDialogVisible: false,
      setTabType: 'userInfo',
      userInfoForm: {
        monthlyType: '0',
        timeRuleId: '',
        roomNumber: '',
        ownerName: '',
        phone: '',
        monthlyAmount: '',
        categoryId: '',
        monthlySpace: '',
        remarks: '',
        occupyList: []
      },
      occupyList: [],
      monthlyCarRule: {
        roomNumber: [
          {required: true, message: '请输入房号', trigger: 'blur'},
          {min: 0, max: 20, message: '最大长度为20', trigger: 'blur'}
        ],
        ownerName: [
          {required: true, message: '请输入称呼', trigger: 'blur'},
          {min: 0, max: 20, message: '最大长度为20', trigger: 'blur'}
        ],
        phone: [
          {validator: phoneValidation, trigger: 'blur'}
        ],
        monthlyAmount: [
          {required: true, message: '请输入包月金额', trigger: 'blur'},
          {validator: numberValidation, trigger: 'blur'}
        ],
        monthlySpace: [
          {min: 0, max: 30, message: '最大长度为30', trigger: 'blur'}
        ],
        remarks: [
          {min: 0, max: 50, message: '最大长度为50', trigger: 'blur'}
        ],
        carLicense: [
          {required: true, message: '请输入车牌号', trigger: 'blur'},
          {validator: carLicenseValidation, trigger: 'blur'}
        ],
        duringMonthly: [
          {required: true, message: '请填写包月期间', trigger: 'blur'}
        ],
        amountReceivable: [
          {required: true, message: '请输入金额', trigger: 'blur'},
          {validator: numberValidation, trigger: 'blur'}
        ],
        expdateStart: [
          {type: 'string', required: true, message: '请填写开始日期', trigger: 'blur'}
        ],
        expdateEnd: [
          {type: 'string', required: true, message: '请填写结束日期', trigger: 'blur'},
          {validator: renewalEndDateValidation, trigger: 'blur'}
        ]
      },
      timeRuleList: [],
      carCategoryList: [],
      selectTime: true,
      timeShow: true,
      timeDetails: {},
      saveButtonShow: true,
      carInfoShow: true,
      carList: [],
      presenceCarList: [],
      carKeyWord: '',
      presenceCarKeyWord: '',
      monthlyId: '',
      carInfo: {},
      monthlyCarCurrentPage: 1,
      monthlyCarPageSize: 3,
      monthlyCarTotal: 1,
      clearCarInfo: {},
      renewalUserInfo: {},
      renewalInfo: {
        guid: '',
        monthlyType: '',
        expdateType: '0',
        expdateStart: '',
        amountReceivable: '',
        amountCollected: '',
        expdateEnd: ''
      },
      nearDateList: [],
      renewalCarList: [],
      monthlyTimeoutList: [],
      timeoutDeal: [],
      duringMonthly: '',
      importData: [],
      errMsgs: [],
      returnErrMsgs: [],
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
    parkList,
    inputExcel
  },
  methods: {
    // 从停车场列表组件获取当前选中的停车场id
    getParkLotIdFromList (data) {
      this.parkingLotId = data
      this.getMonthlyList()
      // this.$axios.post('/api/pklot/exportTest')
      // exportExcel('/api/pklot/exportTest', {}, 'test')
      if (this.isAdmin === '1') {
        this.showTag = true
      }
    },
    // 切换选项卡
    handleClick (tab, event) {
      this.monthlyType = tab.name
      this.getMonthlyList()
    },
    // 调整表格高度
    tableHeights () {
      return window.innerHeight - 210
    },
    // 获取包月车辆列表
    getMonthlyList () {
      this.$axios.post('/api/pklot/getMonthlyListByPage', {
        parkingLotId: this.parkingLotId,
        searchInfo: this.searchInfo,
        pageNum: this.monthlyCurrentPage,
        pageSize: this.monthlyPageSize,
        monthlyType: this.monthlyType
      }).then(response => {
        this.monthlyList = response.data.data.items
        this.monthlyTotal = response.data.data.count
      })
    },
    // 包月用户分页
    monthlySizeChange (val) {
      this.monthlyPageSize = val
      this.getMonthlyList()
    },
    monthlyCurrentChange (val) {
      this.monthlyCurrentPage = val
      this.getMonthlyList()
    },
    // 添加包月用户
    addMonthlyUser () {
      this.carInfoShow = true
      this.monthlyUserVisible = true
      this.userInfoForm = {
        parkingLotId: this.parkingLotId,
        monthlyType: '0',
        timeRuleId: '',
        roomNumber: '',
        ownerName: '',
        phone: '',
        monthlyAmount: '',
        categoryId: '',
        monthlySpace: '',
        remarks: '',
        occupyList: []
      }
      this.getTimeRuleList()
      this.getCarType()
      this.getCarOccupy('')
    },
    // 包月类型改变
    selectMonthlyType (type) {
      if (type === '1') {
        this.selectTime = false
        if (this.timeDetails.timeRuleName) {
          this.timeShow = false
        }
      } else {
        this.selectTime = true
        this.timeShow = true
      }
    },
    // 选择分时包月类型
    selectTimeRule (timeRuleId) {
      this.timeShow = false
      console.log(timeRuleId)
      this.$axios.post('/api/pklot/getTimeRuleById', {
        timeRuleId: timeRuleId
      }).then(response => {
        this.timeDetails = response.data.data
      })
    },
    // 显示分时包月详情
    showTimeDetails () {
      this.timeDetailsVisible = true
    },
    // 获取车辆类别
    getCarType () {
      this.$axios.post('/api/pklot/getCarCategoryList', {
        parkingLotId: this.parkingLotId,
        categoryType: 1
      }).then(response => {
        this.carCategoryList = response.data.data
      })
    },
    // 获取分时类别
    getTimeRuleList () {
      this.$axios.post('/api/pklot/getTimeRuleList', {
        parkingLotId: this.parkingLotId
      }).then(response => {
        this.timeRuleList = response.data.data
      })
    },
    // 获取车辆占位情况
    getCarOccupy (monthlyId) {
      this.$axios.post('/api/pklot/getMonthlyOccupy', {
        monthlyId: monthlyId,
        parkingLotId: this.parkingLotId
      }).then(response => {
        let _this = this
        this.occupyList = response.data.data
        if (!monthlyId) {
          this.occupyList.forEach(function (item, index) {
            _this.occupyList[index].occupyType = '0'
            _this.occupyList[index].occupyNum = 0
            _this.occupyList[index].occupyId = ''
          })
        } else {
          this.occupyList.forEach(function (item, index) {
            _this.occupyList[index].monthlyId = monthlyId
            _this.occupyList[index].occupyType = String(_this.occupyList[index].occupyType)
          })
        }
      })
    },
    // 保存包月用户信息
    saveMonthlyUser () {
      let failedFields = {}
      this.$refs['userInfoForm'].validate((valid, invalidFields) => {
        console.log(invalidFields)
        if (valid) {
          let occupyTag = 0
          this.occupyList.forEach(function (item, index) {
            console.log(item)
            if (Number(item.occupyNum) === 0) {
              occupyTag++
            }
          })
          console.log(occupyTag)
          console.log(this.occupyList.length)
          if (occupyTag !== this.occupyList.length) {
            this.userInfoForm.occupyList = JSON.stringify(this.occupyList)
            console.log(this.userInfoForm)
            if (this.userInfoForm.monthlyId) {
              this.$axios.post('/api/pklot/updateMonthlyAndOccupy', this.userInfoForm).then(response => {
                if (response.data.data === 1) {
                  this.$refs['userInfoForm'].clearValidate()
                  this.getCarList()
                  this.setTabType = 'carInfo'
                  this.$message.success('保存成功')
                  let tab = {
                    name: this.setTabType
                  }
                  this.monthlyTab(tab)
                  let mainTab = {
                    name: this.monthlyType
                  }
                  this.handleClick(mainTab)
                }
              })
            } else {
              this.$axios.post('/api/pklot/addMonthlyAndOccupy', this.userInfoForm).then(response => {
                if (response.data.status === 200) {
                  this.monthlyId = response.data.data
                  this.getCarList()
                  this.setTabType = 'carInfo'
                  this.$message.success('保存成功')
                  this.carInfoShow = false
                  let tab = {
                    name: this.setTabType
                  }
                  this.monthlyTab(tab)
                  let mainTab = {
                    name: this.monthlyType
                  }
                  this.handleClick(mainTab)
                }
              })
            }
          } else {
            this.$message.error('请填写占用车位')
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
    // 删除价格规则
    deleteModel (userInfo) {
      console.log(userInfo)
      this.deleteDialogVisible = true
      this.userInfoForm = userInfo
    },
    // 删除包月用户
    deleteUser () {
      this.$axios.post('/api/pklot/deleteMonthly', {
        monthlyId: this.userInfoForm.monthlyId
      }).then(response => {
        if (response.data.data === 1) {
          this.deleteDialogVisible = false
          this.$message.success('删除成功')
          let tab = {
            name: this.monthlyType
          }
          this.handleClick(tab)
        }
      })
    },
    // 弹出层取消提交
    cancelSubmit () {
      this.monthlyUserVisible = false
      this.$refs['userInfoForm'].clearValidate()
      document.getElementsByClassName('tab-content')[0].scrollTop = 0
      document.getElementsByClassName('tab-content')[1].scrollTop = 0
      this.setTabType = 'userInfo'
      this.saveButtonShow = true
      this.monthlyCarCurrentPage = 1
    },
    // 编辑包月用户信息
    editMonthlyUser (userInfo) {
      this.monthlyId = userInfo.monthlyId
      this.getCarList()
      this.getPresenceCarList()
      this.carInfoShow = false
      userInfo.occupyList = []
      this.userInfoForm = JSON.parse(JSON.stringify(userInfo))
      this.userInfoForm.monthlyType = String(this.userInfoForm.monthlyType)
      this.getCarOccupy(userInfo.monthlyId)
      this.getCarType()
      this.getTimeRuleList()
      if (Number(this.userInfoForm.monthlyType) === 1) {
        this.selectTime = false
        this.selectTimeRule(this.userInfoForm.timeRuleId)
      } else {
        this.selectTime = true
      }
      console.log(this.userInfoForm)
      this.monthlyUserVisible = true
    },
    // 切换弹出层选项卡
    monthlyTab (tab, event) {
      if (tab.name === 'userInfo') {
        document.getElementsByClassName('tab-content')[1].scrollTop = 0
        this.saveButtonShow = true
      } else {
        document.getElementsByClassName('tab-content')[0].scrollTop = 0
        this.saveButtonShow = false
      }
    },
    // 获取包月用户车辆列表
    getCarList () {
      this.$axios.post('/api/pklot/getMonthlyCarListByPage', {
        monthlyId: this.monthlyId,
        searchInfo: this.carKeyWord,
        pageNum: this.monthlyCarCurrentPage,
        pageSize: this.monthlyCarPageSize
      }).then(response => {
        this.carList = response.data.data.items
        this.monthlyCarTotal = response.data.data.count
      })
    },
    // 搜索包月用户车辆
    searchMonthlyCar () {
      this.getCarList()
    },
    monthlyCarCurrentChange (val) {
      this.monthlyCarCurrentPage = val
      this.getCarList()
    },
    // 添加包月用户车辆
    addMonthlyCar () {
      this.carInfoVisible = true
      this.carInfo = {
        parkingLotId: this.parkingLotId,
        monthlyId: this.monthlyId,
        carLicense: '',
        startDate: '',
        endDate: ''
      }
    },
    // 保存包月车辆
    saveMonthlyCar () {
      let failedFields = {}
      if (this.carInfo.duringMonthly) {
        this.carInfo.startDate = this.carInfo.duringMonthly[0]
        this.carInfo.endDate = this.carInfo.duringMonthly[1]
      }
      this.$refs['carInfoForm'].validate((valid, invalidFields) => {
        if (valid) {
          if (this.carInfo.monthlyCarId) {
            this.$axios.post('/api/pklot/updateMonthlyCar', this.carInfo).then(response => {
              if (response.data.data === 1) {
                this.carInfoVisible = false
                this.$message.success('修改成功')
                this.getCarList()
                this.getMonthlyList()
                this.$refs['carInfoForm'].clearValidate()
              }
            })
          } else {
            this.$axios.post('/api/pklot/addMonthlyCar', this.carInfo).then(response => {
              if (response.data.data === 1) {
                this.carInfoVisible = false
                this.$message.success('添加成功')
                this.getCarList()
                this.getMonthlyList()
                this.$refs['carInfoForm'].clearValidate()
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
    // 包月用户车辆取消
    cancelMonthlyDuring () {
      this.carInfoVisible = false
      this.$refs['carInfoForm'].clearValidate()
    },
    // 编辑包月用户车辆
    editMonthlyCar (carInfo) {
      this.carInfoVisible = true
      this.carInfo = carInfo
      this.originalCarLicense = this.carInfo.carLicense
      this.$set(this.carInfo, 'duringMonthly', [carInfo.startDate, carInfo.endDate])
    },
    // 删除包月用户车辆信息
    deleteMonthlyCarModel (carInfo) {
      this.deleteCarDialogVisible = true
      this.carInfo = carInfo
    },
    // 删除包月用户车辆
    deleteMonthlyCar () {
      this.$axios.post('/api/pklot/deleteMonthlyCar', {
        monthlyCarId: this.carInfo.monthlyCarId
      }).then(response => {
        if (response.data.data === 1) {
          this.deleteCarDialogVisible = false
          this.$message.success('删除成功')
          this.getCarList()
        }
      })
    },
    // 下载包月用户车辆导入模板
    downloadMonthlyCarTemp () {
      window.open('/api/pklot/excelParkMonthlyMouldDownload/2')
    },
    // 下载包月用户导入模板
    downloadMonthlyUserTemp () {
      window.open('/api/pklot/excelParkMonthlyMouldDownload/1')
    },
    // 获取包月用户在场车辆列表
    getPresenceCarList () {
      // listCarStatus(this.parkingLotId, this.monthlyId, this.presenceCarKeyWord).then(response => {
      //   this.presenceCarList = response.data
      // })
    },
    // 搜索包月用户在场车辆
    searchMonthlyPresenceCar () {
      this.getPresenceCarList()
    },
    // 清除在场车辆状态弹出层
    clearModel (carInfo) {
      this.clearDialogVisible = true
      this.clearCarInfo = carInfo
    },
    // 清除在场车辆
    clearCar () {
      // updateRecordToLeave(this.parkingLotId, this.clearCarInfo.recordId, this.clearCarInfo.carLicense).then(response => {
      //   this.clearDialogVisible = false
      //   this.$message.success('操作成功')
      //   this.getPresenceCarList()
      // })
    },
    // 包月续费弹出层
    renewalModel (info) {
      this.renewalInfo = {
        guid: this.creatGuid(),
        monthlyType: info.monthlyType,
        expdateType: '0',
        expdateStart: '',
        amountReceivable: info.monthlyAmount,
        amountCollected: '',
        expdateEnd: '',
        monthlyId: info.monthlyId,
        parkingLotId: info.parkingLotId
      }
      this.monthlyId = info.monthlyId
      this.renewalUserInfo = JSON.parse(JSON.stringify(info))
      this.monthlyRenewalVisible = true
      // 获取最近到期时间
      // listNearEndDate(info.monthlyId).then(response => {
      //   this.nearDateList = response.data[0].nearDate.split(',')
      //   this.renewalInfo.expdateStart = this.nearDateList[0]
      //   console.log(this.nearDateList)
      // })
      // 获取包月用户信息
      // getMonthlyInfo(info.monthlyId).then(response => {
      //   this.renewalUserInfo = response.data
      //   this.renewalInfo.guid = this.creatGuid()
      //   this.renewalInfo.monthlyAmount = this.renewalUserInfo.monthlyAmount
      //   this.renewalInfo.monthlyType = this.renewalUserInfo.monthlyType
      // })
      // listParkMonthlyTimeoutParkingRecord(this.parkingLotId, this.monthlyId).then(response => {
      //   this.monthlyTimeoutList = response.data
      //   let _this = this
      //   this.timeoutDeal = []
      //   this.monthlyTimeoutList.forEach(function (item) {
      //     let timeoutItem = {
      //       recordId: '',
      //       endDate: '',
      //       isFree: ''
      //     }
      //     timeoutItem.recordId = item.recordId
      //     timeoutItem.endDate = item.endDate
      //     timeoutItem.isFree = '0'
      //     _this.timeoutDeal.push(timeoutItem)
      //   })
      //   console.log(this.timeoutDeal)
      //   this.monthlyRenewalVisible = true
      // })
    },
    // 生成guid
    creatGuid () {
      let s = []
      let hexDigits = '0123456789abcdef'
      for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
      }
      s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = '-'

      let guid = s.join('')
      return guid
    },
    // 保存统一续费
    saveRenewal () {
      let failedFields = {}
      this.$refs['renewalInfoForm'].validate((valid, invalidFields) => {
        if (valid) {
          if (this.monthlyTimeoutList.length > 0) {
            this.dealTimeoutDialogVisible = true
          } else {
            this.renewalSubmit()
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
    // 确认续费
    renewalSubmit () {
      this.$axios.post('/api/pklot/addMonthlyExtend', this.renewalInfo).then(response => {
        if (response.data.data === 1) {
          this.monthlyRenewalVisible = false
          this.$message.success('续费成功')
          let mainTab = {
            name: this.monthlyType
          }
          this.handleClick(mainTab)
          this.$refs['renewalInfoForm'].clearValidate()
        }
      })
    },
    // 取消续费
    canselRenewal () {
      this.monthlyRenewalVisible = false
      this.$refs['renewalInfoForm'].clearValidate()
    },
    // 打开单独设置
    renewalSet () {
      this.renewalCarInfoVisible = true
      this.$axios.post('/api/pklot/getMonthlyCarList', {
        monthlyId: this.monthlyId
      }).then(response => {
        this.renewalCarList = response.data.data
      })
    },
    // 单独设置页面保存
    saveRenewalCarList () {
      let renewalCarList = JSON.stringify(this.renewalCarList)
      this.$axios.post('/api/pklot/addMonthlyCarTmp', {
        guid: this.renewalInfo.guid,
        carInfoList: renewalCarList
      }).then(response => {
        if (response.data.data !== 0) {
          this.renewalCarInfoVisible = false
          this.$message.success('保存成功')
        }
      })
    },
    // 时间戳转换时分秒
    UnixToDate (unixTime) {
      let d = Math.floor(unixTime / (24 * 3600))
      let h = Math.floor(unixTime % (24 * 3600) / (3600))
      let i = Math.floor(unixTime % (24 * 3600) % (3600) / (60))
      let s = unixTime % (24 * 3600) % (3600) % (60)
      if (d === 0) {
        return h + '小时' + i + '分' + s + '秒'
      } else {
        return d + '天' + h + '小时' + i + '分' + s + '秒'
      }
    },
    // 处理临停车牌
    dealTimeout (monthlyTimeoutList, index) {
      console.log(monthlyTimeoutList)
      this.timeoutDeal[index].isFree = monthlyTimeoutList.isFree
      this.timeoutDeal[index].recordId = monthlyTimeoutList.recordId
    },
    // 确认处理结果
    dealTimeoutConfirm () {
      // parkingFeeDeal(JSON.stringify(this.timeoutDeal)).then(response => {
      //   this.renewalSubmit()
      //   this.dealTimeoutDialogVisible = false
      // })
    },
    // 获取包月用户excel表格数据
    getMonthlyExcelData (data) {
      let _this = this
      this.errMsgs = []
      this.importData = []
      this.returnErrMsgs = []
      let msg = {}
      let data_ = JSON.parse(JSON.stringify(data))
      console.log(data_)
      if (data_.length === 0) {
        this.$message.error('不能导入空文件')
      } else {
        data_.forEach(function (item, index) {
          data_[index] = JSON.stringify(data_[index]).replace(/\s/g, '')
          data_[index] = data_[index].replace(/__EMPTY/, 'roomNumber')
          data_[index] = data_[index].replace(/__EMPTY_1/, 'ownerName')
          data_[index] = data_[index].replace(/__EMPTY_2/, 'phone')
          data_[index] = data_[index].replace(/__EMPTY_3/, 'monthlyType')
          data_[index] = data_[index].replace(/__EMPTY_4/, 'monthlyAmount')
          data_[index] = data_[index].replace(/__EMPTY_5/, 'carLicense')
          data_[index] = data_[index].replace(/__EMPTY_6/, 'startDate')
          data_[index] = data_[index].replace(/__EMPTY_7/, 'endDate')
          data_[index] = data_[index].replace(/__EMPTY_8/, 'parkingOccupy')
          data_[index] = data_[index].replace(/__EMPTY_9/, 'categoryName')
          data_[index] = data_[index].replace(/__EMPTY_10/, 'monthlySpace')
          data_[index] = data_[index].replace(/__EMPTY_11/, 'remarks')
          data_[index] = data_[index].replace(/固定/, 1)
          data_[index] = data_[index].replace(/非固定/, 0)
          data_[index] = data_[index].replace(/普通/, 0)
          data_[index] = data_[index].replace(/分时/, 1)
          data_[index] = JSON.parse(data_[index])
          if (data_[index].startDate) {
            data_[index].startDate = _this.dateFormat(data_[index].startDate)
          } else {
            data_[index].startDate = ''
          }
          if (data_[index].endDate) {
            data_[index].endDate = _this.dateFormat(data_[index].endDate)
          } else {
            data_[index].endDate = ''
          }
        })
        console.log(data_)
        data_.forEach(function (item, index) {
          msg = {}
          console.log(item.roomNumber)
          if (!item.roomNumber) {
            msg.roomNumber = '房号未填写'
          } else {
            if (!item.ownerName) {
              msg.ownerName = '车主未填写'
            }
            if (!item.phone) {
              msg.phone = '联系电话未填写'
            }
            if (!item.monthlyType) {
              msg.monthlyType = '包月类型未填写'
            }
            if (!item.monthlyAmount) {
              msg.monthlyAmount = '包月金额未填写'
            }
            if (!item.carLicense) {
              msg.carLicense = '车牌号未填写'
            }
            if (!item.startDate) {
              msg.startDate = '起始日期未填写'
            } else if (!_this.isDate(item.startDate)) {
              msg.startDate = '起始日期格式不正确'
            } else if (!item.endDate) {
              msg.endDate = '结束日期未填写'
            } else if (!_this.isDate(item.endDate)) {
              msg.endDate = '结束日期格式不正确'
            } else if (item.startDate > item.endDate) {
              msg.endDate = '结束日期小于开始日期'
            }
            if (!item.parkingOccupy) {
              msg.parkingOccupy = '停车场占位信息未填写'
            }
          }
          if (JSON.stringify(msg) !== '{}') {
            _this.errMsgs.push(msg)
          } else {
            _this.importData.push(item)
          }
        })
        console.log(this.errMsgs)
        console.log(this.importData)
        // 导入
        if (_this.importData.length !== 0 && _this.errMsgs.length === 0) {
          _this.$axios.post('/api/pklot/importParkMonthlyInfo', {
            parkingLotId: this.parkingLotId,
            params: JSON.stringify(_this.importData)
          }).then(response => {
            if (response.data.data) {
              this.returnErrMsgs = response.data.data
              this.importMonthlyDialogVisible = true
            } else {
              this.getMonthlyList()
              this.$message.success('导入成功')
            }
          })
        } else if (_this.errMsgs.length !== 0) {
          this.importMonthlyDialogVisible = true
        }
      }
    },
    // 判断是否为合法日期
    isDate (str) {
      let arr = str.split('-')
      if (arr.length === 3) {
        let intYear = parseInt(arr[0], 10)
        let intMonth = parseInt(arr[1], 10)
        let intDay = parseInt(arr[2], 10)
        if (isNaN(intYear) || isNaN(intMonth) || isNaN(intDay)) {
          return false
        }
        if (intYear > 2100 || intYear < 1900 || intMonth > 12 || intMonth < 0 || intDay > 31 || intDay < 0) {
          return false
        }
        if ((intMonth === 4 || intMonth === 6 || intMonth === 9 || intMonth === 11) && intDay > 30) {
          return false
        }
        if ((intYear % 4 === 0 && intYear % 100 !== 0) || intYear % 400 === 0) {
          if (intDay > 29) {
            return false
          }
        } else {
          if (intDay > 28) return false
        }
        return true
      }
      return false
    },
    // excel常规转换为时间格式
    dateFormat (numb, format) {
      let time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      let year = time.getFullYear() + ''
      let month = time.getMonth() + 1 + ''
      let date = time.getDate() + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + '-' + (month < 10 ? '0' + month : month) + '-' + (date < 10 ? '0' + date : date)
    },
    importCar () {
      document.querySelector('#importCar').click()
    },
    exportData (event, tag) {
      console.log(event)
      console.log(tag)
      if (!event.currentTarget.files.length) {
        return
      }
      const that = this
      // 拿取文件对象
      let f = event.currentTarget.files[0]
      // 用FileReader来读取
      let reader = new FileReader()
      // 重写FileReader上的readAsBinaryString方法
      FileReader.prototype.readAsBinaryString = function (f) {
        let binary = ''
        let wb // 读取完成的数据
        let outdata // 你需要的数据
        let reader = new FileReader()
        reader.onload = function (e) {
          // 读取成Uint8Array，再转换为Unicode编码（Unicode占两个字节）
          let bytes = new Uint8Array(reader.result)
          console.log(reader.result)
          let length = bytes.byteLength
          for (let i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i])
          }
          // 接下来就是xlsx了，具体可看api
          wb = XLSX.read(binary, {
            type: 'binary'
          })
          outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
          outdata = JSON.parse(JSON.stringify(outdata))
          outdata.shift()
          outdata.shift()
          console.log(outdata)
          // 自定义方法向父组件传递数据
          that.getMonthlyCarExcelData(outdata, tag)
          // 清空file文件
          that.$refs.clearFile.value = ''
        }
        reader.readAsArrayBuffer(f)
      }
      reader.readAsBinaryString(f)
    },
    // 获取包月用户车辆excel表格数据
    getMonthlyCarExcelData (data, tag) {
      console.log(1560)
      let _this = this
      this.errMsgs = []
      this.importData = []
      this.returnErrMsgs = []
      let msg = {}
      let data_ = JSON.parse(JSON.stringify(data))
      console.log(data_)
      if (data_.length === 0) {
        this.$message.error('不能导入空文件')
      } else {
        data_.forEach(function (item, index) {
          data_[index] = JSON.stringify(data_[index]).replace(/\s/g, '')
          data_[index] = data_[index].replace(/包月车辆导入模板/, 'carLicense')
          data_[index] = data_[index].replace(/__EMPTY/, 'startDate')
          data_[index] = data_[index].replace(/__EMPTY_1/, 'endDate')
          data_[index] = JSON.parse(data_[index])
          if (data_[index].startDate) {
            data_[index].startDate = _this.dateFormat(data_[index].startDate)
          } else {
            data_[index].startDate = ''
          }
          if (data_[index].endDate) {
            data_[index].endDate = _this.dateFormat(data_[index].endDate)
          } else {
            data_[index].endDate = ''
          }
        })
        console.log(data_)
        data_.forEach(function (item, index) {
          msg = {}
          if (!item.carLicense) {
            msg.carLicense = '车牌号未填写'
          } else if (!isVehicleNumber(item.carLicense)) {
            msg.carLicense = item.carLicense + '车牌号格式不正确'
          }
          if (!item.startDate) {
            msg.startDate = item.carLicense + '起始日期未填写'
          } else if (!_this.isDate(item.startDate)) {
            msg.startDate = item.carLicense + '起始日期格式不正确'
          } else if (!item.endDate) {
            msg.endDate = item.carLicense + '结束日期未填写'
          } else if (!_this.isDate(item.endDate)) {
            msg.endDate = item.carLicense + '结束日期格式不正确'
          } else if (item.startDate > item.endDate) {
            msg.endDate = item.carLicense + '结束日期小于开始日期'
          }
          if (JSON.stringify(msg) !== '{}') {
            _this.errMsgs.push(msg)
          } else {
            _this.importData.push(item)
          }
        })
        console.log(this.errMsgs)
        console.log(this.importData)
        // 导入
        if (_this.importData.length !== 0 && _this.errMsgs.length === 0) {
          if (tag) {
            _this.$axios.post('/api/pklot/importParkMonthlyCarInfo', {
              monthlyId: this.monthlyId,
              parkingLotId: this.parkingLotId,
              params: JSON.stringify(_this.importData)
            }).then(response => {
              if (response.data.data) {
                this.returnErrMsgs = response.data.data
                this.importDialogVisible = true
              } else {
                this.getCarList()
                this.$message.success('导入成功')
              }
            })
          } else {
            // importParkMonthlyCarExtendInfo(this.monthlyId, this.parkingLotId, JSON.stringify(_this.importData)).then(response => {
            //   if (response.message === '导入成功') {
            //     this.$message.success('导入成功')
            //   } else {
            //     this.returnErrMsgs = response.data
            //     this.importDialogVisible = true
            //   }
            // })
          }
        } else if (_this.errMsgs.length !== 0) {
          this.importDialogVisible = true
        }
      }
    },
    // 导出包月用户
    exportMonthly () {
      let data = {
        parkingLotId: this.parkingLotId,
        searchType: this.monthlyType,
        keyword: this.searchInfo
      }
      exportExcel('/api/pklot/exportParkMonthly', data, '包月车辆统计')
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
    .el-badge__content {
      margin-top: 8px;
    }
  }

  .import-car {
    display: none;
  }

  .badge {
    height: 20px;
    line-height: 20px;
    padding: 0 5px;
    font-size: 12px;
    display: inline-block;
    position: relative;
    text-align: center;
    border-radius: 2px;
  }

  .ordinary {
    background-color: #eee !important;
    color: #666 !important;
  }

  .price {
    background-color: #FF5722;
    color: #fff;
  }

  .due-time {
    background-color: #409EFF;
    color: #fff;
    margin-right: 5px;
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
    /deep/ {
      .el-pagination {
        margin-top: 15px;
        float: right;
      }
    }
  }

  .monthly-header {
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

  .mobile .search-input {
    margin-right: 70px;
  }

  .monthly-content {
    /deep/ {
      .el-button--mini, .el-button--mini.is-round {
        padding: 5px 8px;
      }
    }
  }

  .monthly-dialog {

    /deep/ {
      .el-dialog__body {
        padding: 30px 0 30px 20px !important;
      }
    }
    .tab-content {
      height: 350px;
      overflow: auto;
    }
    .el-form {
      margin-right: 10px;
    }
    #pane-userInfo {
      .el-form-item {
        /deep/ {
          .el-input {
            width: 310px;
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
          left: -420px;
          font-size: 12px;
          color: #676A6C;
          top: 11px;
        }
        .monthly-type {
          /deep/ {
            .el-form-item {
              display: inline-block;
              margin-bottom: 0px;
              .el-input {
                width: 140px;
              }
            }
          }
        }
        .amount {
          /deep/ {
            .el-input {
              width: 285px;
            }
          }
        }
        .price-time {
          display: inline-block;
          .el-form-item {
            display: inline-block;
            margin-bottom: 0px;
          }
        }
      }
      .owner-info-item {
        height: 85px;
        .owner-info {
          position: absolute;
          left: -420px;
          width: 760px;
          top: 40px;
          /deep/ {
            .el-form-item {
              display: inline-block;
              margin-bottom: 0px;
              .el-input {
                width: 240px;
              }
            }
          }
        }
      }
      .occupy {
        border-bottom: 0;
        /deep/ {
          .el-form-item {
            border-bottom: 0;
          }
        }
        .occupy-item {
          position: relative;
          /deep/ {
            .el-form-item {
              display: inline-block;
              margin-bottom: 0px;
              .el-input {
                width: 140px;
              }
            }
          }
          .park-name {
            color: #409EFF;
            position: absolute;
            transform: translateX(-110%)
          }
        }
      }
    }
    #pane-carInfo {
      .title {
        line-height: 30px;
        font-weight: bold;
        color: #444444;
        margin: 0;
      }
      .car-header {
        width: 100%;
        .car-search {
          width: 57%;
          display: inline-block;
        }
        .car-button-group {
          display: inline-block;
          margin-left: 10px;
          .import-button {
            margin-left: 10px;
          }
        }
      }
      .car-list-table {
        margin-top: 10px;
        /deep/ {
          .el-button--mini, .el-button--mini.is-round {
            padding: 5px 8px;
          }
        }
      }
    }
  }

  .rule-name {
    font-weight: bold;
    color: #444444;
  }

  .time-rule-dialog {
    margin-top: 10px;
    /deep/ {
      .el-form-item {
        display: inline-block;
      }
      .el-input {
        width: 150px;
      }
      .el-checkbox__label {
        padding-left: 5px;
        padding-right: 10px;
      }
      .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
        background-color: #409EFF;
        border-color: #409EFF;
      }
      .el-checkbox__input.is-disabled + span.el-checkbox__label {
        color: #606266;
        cursor: not-allowed;
      }
      .el-checkbox__input.is-checked.is-disabled + .el-checkbox__label {
        color: #409EFF;
      }
      .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
        border-color: #ffffff;
      }
      .el-checkbox__input.is-disabled .el-checkbox__inner {
        background-color: #ffffff;
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

  .car-info-dialog {
    margin: 10px 10px 20px 0;
    .el-form-item {
      /deep/ {
        .el-input {
          width: 265px;
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
      margin-top: 0;
      margin-bottom: 10px !important;
      .explain {
        position: absolute;
        left: -200px;
        font-size: 12px;
        color: #676A6C;
        top: 11px;
      }
    }
    .monthly-title {
      border-bottom: 1px solid #ffffff;
    }
    .during-monthly {
      margin-left: -200px;
      .el-date-editor {
        width: 465px;
      }
    }
  }

  .tab-content {
    .car-list {
      width: 98%;
      .el-pagination {
        float: right;
        padding: 5px 0px;
      }
    }
    .presence-car-list {
      margin-top: 30px;
      width: 98%;
      .car-search {
        width: 90% !important;
      }
      .car-button-group {
        margin-left: 14px !important;
      }
    }
  }

  .renewal-dialog {
    .renewal-content {
      height: 350px;
      margin-bottom: 10px;
    }
    .user-info {
      .name-room {
        .title {
          line-height: 30px;
          font-weight: bold;
          color: #444444;
        }
        border-bottom: 1px solid #eeeeee;
        width: 96%;
        padding-bottom: 2px;
        margin-bottom: 10px;
      }
    }
    .el-form-item {
      width: 96%;
      /deep/ {
        .el-input {
          width: 265px;
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
        left: -450px;
        font-size: 12px;
        color: #676A6C;
        top: 11px;
      }
    }
    .set-due-tiem {
      height: 80px;
      .renewal-time {
        position: absolute;
        left: -450px;
        top: 40px;
        .el-form-item {
          display: inline-block;
          margin-bottom: 0px;
          width: 160px;
          border-bottom: 1px solid #ffffff;
          /deep/ {
            .el-input {
              width: 150px;
            }
          }
        }
      }
      .independent {
        position: absolute;
        left: -450px;
        top: 50px;
      }
    }
    .timeout-list {
      .timeout-item {
        height: 35px;
        margin-top: 15px;
        border-bottom: 1px solid #eeeeee;
        width: 96%;
        /deep/ {
          .el-switch {
            float: right;
          }
        }
      }
    }
  }

  .renewal-car-dialog {
    .car-list {
      margin-top: 10px;
      height: 250px;
      overflow: auto;
      .item {
        height: 35px;
        margin-top: 10px;
        border-bottom: 1px solid #eeeeee;
        margin-right: 20px;
        span {
          margin-left: 20px;
        }
        /deep/ {
          .el-input {
            width: 150px;
          }
        }
      }
    }
  }

  .import-dialog {
    .item {
      width: 490px;
    }
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
