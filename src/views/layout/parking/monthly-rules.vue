/**
* @author: daina
* @date: 2019/3/24
* @description:
*/
<template>
    <div v-show="parkingLotId">
      <parkList v-on:getSelectedParkLotId="getParkLotIdFromList"/>
      <div class="container" :class="{'covered':showTagList}">
        <div class="rules-header">
          <div class="search-input">
            <el-input v-model="searchInfo" placeholder="请输入包月规则名称查询" size="small"
                      @keyup.enter.native="getRulesList"><i slot="prefix"
                                                            class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
          <section class="button-group">
            <el-button type="primary" size="small" @click="getRulesList">查询</el-button>
            <el-button type="primary" size="small" @click="openRuleModel">添加
            </el-button>
          </section>
        </div>
        <div class="rules-content">
          <el-table
            :data="rulesList"
            border
            :height="tableHeight"
            style="width: 100%">
            <el-table-column
              prop="timeRuleName"
              label="包月规则名称"
              fixed
              min-width="120"
              align="center"
              :show-overflow-tooltip="true"
            >
            </el-table-column>
            <el-table-column
              label="周一"
              min-width="120"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{scope.row.timeStart1}}-{{scope.row.timeEnd1}}
              </template>
            </el-table-column>
            <el-table-column
              label="周二"
              min-width="120"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{scope.row.timeStart2}}-{{scope.row.timeEnd2}}
              </template>
            </el-table-column>
            <el-table-column
              label="周三"
              min-width="120"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{scope.row.timeStart3}}-{{scope.row.timeEnd3}}
              </template>
            </el-table-column>
            <el-table-column
              label="周四"
              min-width="120"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{scope.row.timeStart4}}-{{scope.row.timeEnd4}}
              </template>
            </el-table-column>
            <el-table-column
              label="周五"
              min-width="120"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{scope.row.timeStart5}}-{{scope.row.timeEnd5}}
              </template>
            </el-table-column>
            <el-table-column
              label="周六"
              min-width="120"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{scope.row.timeStart6}}-{{scope.row.timeEnd6}}
              </template>
            </el-table-column>
            <el-table-column
              label="周日"
              min-width="120"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{scope.row.timeStart7}}-{{scope.row.timeEnd7}}
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="240"
              align="center"
            >
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="openRuleModel(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="deleteModel(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :disabled="totalRules === 0"
            class="table-page"
            @size-change="ruleSizeChange"
            @current-change="ruleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            background
            :total="totalRules">
          </el-pagination>
        </div>
      </div>
      <el-dialog
        width="600px"
        title="分时包月规则信息"
        :visible.sync="ruleDialogVisible"
        custom-class="rule-dialog"
        :close-on-click-modal="false"
        @close="cancelSubmit()"
      >
        <div class="rule-dialog-content">
          <el-form :model="ruleInfo" class="rule-dialog" ref="ruleInfoForm" :rules="timeRule" size="mini"
                   label-width="300px"
                   label-position="left">
            <el-form-item label="包月规则名称" prop="timeRuleName">
              <el-input v-model="ruleInfo.timeRuleName" placeholder="请输入包月规则名称"
                        autocomplete="off" ref="timeRuleName"></el-input>
              <div class="explain">设置分时包月规则名称，用于添加包月时选择</div>
            </el-form-item>
            <el-form-item label="规则设置" prop="timeRuleOption">
              <el-select v-model="ruleInfo.timeRuleOption" placeholder="请选择车辆类别" @change="selectUnifidDay">
                <el-option label="统一设置" value="0"></el-option>
                <el-option label="按天设置" value="1"></el-option>
              </el-select>
              <div class="explain">包括统一设置和按天设置</div>
            </el-form-item>
            <el-form-item label="统一设置" class="unified-label" v-if="showTag">
              <div class="unified">
                <el-form-item prop="timeStart1">
                  <el-time-picker v-model="ruleInfo.timeStart1" format="HH:mm"
                                  value-format="HH:mm"
                                  ref="timeStart1"
                  >
                  </el-time-picker>
                  至
                </el-form-item>
                <el-form-item prop="timeEnd1">
                  <el-time-picker v-model="ruleInfo.timeEnd1" format="HH:mm"
                                  value-format="HH:mm"
                                  ref="timeEnd1"
                  ></el-time-picker>
                </el-form-item>
              </div>
              <div class="explain">周一至周日每天同一时段包月</div>
            </el-form-item>
            <el-form-item label="按天设置" class="day-set" v-if="!showTag">
              <div class="day-items">
                <el-form-item>
                  <el-checkbox label="一" v-model="ruleInfo.monday" :true-label=1 :false-label=0 @change="checked=>checkDay(checked, 1)"
                  ></el-checkbox>
                  <el-form-item prop="timeStart1" :rules="ruleInfo.monday===1?timeRule.timeStart1:[{ required: false}]">
                    <el-time-picker v-model="ruleInfo.timeStart1" format="HH:mm"
                                    value-format="HH:mm"
                                    ref="timeStart1"
                                    :disabled="!ruleInfo.monday"
                    >
                    </el-time-picker>
                  </el-form-item>
                  至
                  <el-form-item prop="timeEnd1" :rules="ruleInfo.monday?timeRule.timeEnd1:[{ required: false}]">
                    <el-time-picker v-model="ruleInfo.timeEnd1" format="HH:mm"
                                    value-format="HH:mm"
                                    ref="timeEnd1"
                                    :disabled="!ruleInfo.monday"
                    >
                    </el-time-picker>
                  </el-form-item>
                </el-form-item>
                <el-form-item>
                  <el-checkbox label="二" v-model="ruleInfo.tuesday" :true-label=1 :false-label=0 @change="checked=>checkDay(checked, 2)"
                  ></el-checkbox>
                  <el-form-item prop="timeStart2"
                                :rules="ruleInfo.tuesday?timeRule.timeStart2:[{ required: false}]">
                    <el-time-picker v-model="ruleInfo.timeStart2" format="HH:mm"
                                    value-format="HH:mm"
                                    ref="timeStart2"
                                    :disabled="!ruleInfo.tuesday"
                    >
                    </el-time-picker>
                  </el-form-item>
                  至
                  <el-form-item prop="timeEnd2" :rules="ruleInfo.tuesday?timeRule.timeEnd2:[{ required: false}]">
                    <el-time-picker v-model="ruleInfo.timeEnd2" format="HH:mm"
                                    value-format="HH:mm"
                                    ref="timeEnd2"
                                    :disabled="!ruleInfo.tuesday"
                    >
                    </el-time-picker>
                  </el-form-item>
                </el-form-item>
                <el-form-item>
                  <el-checkbox label="三" v-model="ruleInfo.thursday" :true-label=1 :false-label=0 @change="checked=>checkDay(checked, 3)"
                  ></el-checkbox>
                  <el-form-item prop="timeStart3" :rules="ruleInfo.thursday?timeRule.timeStart3:[{ required: false}]">
                    <el-time-picker v-model="ruleInfo.timeStart3" format="HH:mm"
                                    value-format="HH:mm"
                                    ref="timeStart3"
                                    :disabled="!ruleInfo.thursday"
                    >
                    </el-time-picker>
                  </el-form-item>
                  至
                  <el-form-item prop="timeEnd3" :rules="ruleInfo.thursday?timeRule.timeEnd3:[{ required: false}]">
                    <el-time-picker v-model="ruleInfo.timeEnd3" format="HH:mm"
                                    value-format="HH:mm"
                                    ref="timeEnd3"
                                    :disabled="!ruleInfo.thursday"
                    >
                    </el-time-picker>
                  </el-form-item>
                </el-form-item>
                <el-form-item>
                  <el-checkbox label="四" v-model="ruleInfo.wednesday" :true-label=1 :false-label=0 @change="checked=>checkDay(checked, 4)"
                  ></el-checkbox>
                  <el-form-item prop="timeStart4" :rules="ruleInfo.wednesday?timeRule.timeStart4:[{ required: false}]">
                    <el-time-picker v-model="ruleInfo.timeStart4" format="HH:mm"
                                    value-format="HH:mm"
                                    ref="timeStart4"
                                    :disabled="!ruleInfo.wednesday"
                    >
                    </el-time-picker>
                  </el-form-item>
                  至
                  <el-form-item prop="timeEnd4" :rules="ruleInfo.wednesday?timeRule.timeEnd4:[{ required: false}]">
                    <el-time-picker v-model="ruleInfo.timeEnd4" format="HH:mm"
                                    value-format="HH:mm"
                                    ref="timeEnd4"
                                    :disabled="!ruleInfo.wednesday"
                    >
                    </el-time-picker>
                  </el-form-item>
                </el-form-item>
                <el-form-item>
                  <el-checkbox label="五" v-model="ruleInfo.friday" :true-label=1 :false-label=0 @change="checked=>checkDay(checked, 5)"
                  ></el-checkbox>
                  <el-form-item prop="timeStart5" :rules="ruleInfo.friday?timeRule.timeStart5:[{ required: false}]">
                    <el-time-picker v-model="ruleInfo.timeStart5" format="HH:mm"
                                    value-format="HH:mm"
                                    ref="timeStart5"
                                    :disabled="!ruleInfo.friday"
                    >
                    </el-time-picker>
                  </el-form-item>
                  至
                  <el-form-item prop="timeEnd5" :rules="ruleInfo.friday?timeRule.timeEnd5:[{ required: false}]">
                    <el-time-picker v-model="ruleInfo.timeEnd5" format="HH:mm"
                                    value-format="HH:mm"
                                    ref="timeEnd5"
                                    :disabled="!ruleInfo.friday"
                    >
                    </el-time-picker>
                  </el-form-item>
                </el-form-item>
                <el-form-item>
                  <el-checkbox label="六" v-model="ruleInfo.saturday" :true-label=1 :false-label=0 @change="checked=>checkDay(checked, 6)"
                  ></el-checkbox>
                  <el-form-item prop="timeStart6" :rules="ruleInfo.saturday?timeRule.timeStart6:[{ required: false}]">
                    <el-time-picker v-model="ruleInfo.timeStart6" format="HH:mm"
                                    value-format="HH:mm"
                                    ref="timeStart6"
                                    :disabled="!ruleInfo.saturday"
                    >
                    </el-time-picker>
                  </el-form-item>
                  至
                  <el-form-item prop="timeEnd6" :rules="ruleInfo.saturday?timeRule.timeEnd6:[{ required: false}]">
                    <el-time-picker v-model="ruleInfo.timeEnd6" format="HH:mm"
                                    value-format="HH:mm"
                                    ref="timeEnd6"
                                    :disabled="!ruleInfo.saturday"
                    >
                    </el-time-picker>
                  </el-form-item>
                </el-form-item>
                <el-form-item>
                  <el-checkbox label="日" v-model="ruleInfo.sunday" :true-label=1 :false-label=0 @change="checked=>checkDay(checked, 7)"
                  ></el-checkbox>
                  <el-form-item prop="timeStart7" :rules="ruleInfo.sunday?timeRule.timeStart7:[{ required: false}]">
                    <el-time-picker v-model="ruleInfo.timeStart7" format="HH:mm"
                                    value-format="HH:mm"
                                    ref="timeStart7"
                                    :disabled="!ruleInfo.sunday"
                    >
                    </el-time-picker>
                  </el-form-item>
                  至
                  <el-form-item prop="timeEnd7" :rules="ruleInfo.sunday?timeRule.timeEnd7:[{ required: false}]">
                    <el-time-picker v-model="ruleInfo.timeEnd7" format="HH:mm"
                                    value-format="HH:mm"
                                    ref="timeEnd7"
                                    :disabled="!ruleInfo.sunday"
                    >
                    </el-time-picker>
                  </el-form-item>
                </el-form-item>
              </div>
              <div class="explain">周一至周日单独设置</div>
            </el-form-item>
            <el-form-item label="备注" prop="remarks" label-width="150px" class="remarks">
              <el-input v-model="ruleInfo.remarks" placeholder="请输入备注信息"
                        autocomplete="off" ref="remarks"></el-input>
              <div class="explain">输入其他备注信息</div>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cancelSubmit">取 消</el-button>
            <el-button size="mini" type="primary" @click="saveRule">确 定</el-button>
        </span>
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
            <span>确定删除包月规则：{{ruleInfo.timeRuleName}} ?</span>
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
  name: 'monthly-rules',
  data () {
    return {
      isAdmin: sessionStorage.getItem('isAdmin'),
      showTagList: false,
      parkingLotId: '',
      rulesList: [],
      searchInfo: '',
      currentPage: 1,
      pageSize: 20,
      totalRules: 0,
      tableHeight: this.tableHeights(),
      ruleDialogVisible: false,
      deleteDialogVisible: false,
      ruleInfo: {
        parkingLotId: this.parkingLotId,
        friday: 1,
        monday: 1,
        price: '',
        saturday: 1,
        sunday: 1,
        thursday: 1,
        timeEnd1: '',
        timeEnd2: '',
        timeEnd3: '',
        timeEnd4: '',
        timeEnd5: '',
        timeEnd6: '',
        timeEnd7: '',
        timeRuleId: '',
        timeRuleName: '',
        timeRuleOption: '0',
        timeStart1: '',
        timeStart2: '',
        timeStart3: '',
        timeStart4: '',
        timeStart5: '',
        timeStart6: '',
        timeStart7: '',
        tuesday: 1,
        wednesday: 1,
        remarks: ''
      },
      showTag: true,
      timeRule: {
        timeRuleName: [
          {required: true, message: '请输入包月规则名称', trigger: 'blur'}
        ],
        timeStart1: [
          {required: true, message: '请输入开始时间', trigger: 'blur'}
        ],
        timeEnd1: [
          {required: true, message: '请输入结束时间', trigger: 'blur'}
        ],
        timeStart2: [
          {required: true, message: '请输入开始时间', trigger: 'blur'}
        ],
        timeEnd2: [
          {required: true, message: '请输入结束时间', trigger: 'blur'}
        ],
        timeStart3: [
          {required: true, message: '请输入开始时间', trigger: 'blur'}
        ],
        timeEnd3: [
          {required: true, message: '请输入结束时间', trigger: 'blur'}
        ],
        timeStart4: [
          {required: true, message: '请输入开始时间', trigger: 'blur'}
        ],
        timeEnd4: [
          {required: true, message: '请输入结束时间', trigger: 'blur'}
        ],
        timeStart5: [
          {required: true, message: '请输入开始时间', trigger: 'blur'}
        ],
        timeEnd5: [
          {required: true, message: '请输入结束时间', trigger: 'blur'}
        ],
        timeStart6: [
          {required: true, message: '请输入开始时间', trigger: 'blur'}
        ],
        timeEnd6: [
          {required: true, message: '请输入结束时间', trigger: 'blur'}
        ],
        timeStart7: [
          {required: true, message: '请输入开始时间', trigger: 'blur'}
        ],
        timeEnd7: [
          {required: true, message: '请输入结束时间', trigger: 'blur'}
        ]
      }
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
      this.getRulesList()
      if (this.isAdmin === '1') {
        this.showTagList = true
      }
    },
    // 调整表格高度
    tableHeights () {
      return window.innerHeight - 170
    },
    // 获取包月规则列表
    getRulesList () {
      this.$axios.post('/api/pklot/getTimeRuleListByPage', {
        parkingLotId: this.parkingLotId,
        searchInfo: this.searchInfo,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }).then(response => {
        this.rulesList = response.data.data.items
        this.totalRules = response.data.data.count
      })
    },
    // 分页
    ruleSizeChange (val) {
      this.pageSize = val
      this.getRulesList()
    },
    ruleCurrentChange (val) {
      this.currentPage = val
      this.getRulesList()
    },
    // 打开弹出层规则
    openRuleModel (ruleInfo) {
      this.ruleDialogVisible = true
      if (ruleInfo.timeRuleId) {
        this.ruleInfo = JSON.parse(JSON.stringify(ruleInfo))
        this.ruleInfo.timeRuleOption = ruleInfo.timeRuleOption.toString()
        console.log(this.ruleInfo.timeRuleOption)
        if (ruleInfo.timeRuleOption === 1) {
          console.log(503)
          this.showTag = false
        } else {
          console.log(506)
          this.showTag = true
        }
      } else {
        this.ruleInfo = {
          parkingLotId: this.parkingLotId,
          friday: 1,
          monday: 1,
          saturday: 1,
          sunday: 1,
          thursday: 1,
          timeEnd1: '',
          timeEnd2: '',
          timeEnd3: '',
          timeEnd4: '',
          timeEnd5: '',
          timeEnd6: '',
          timeEnd7: '',
          timeRuleName: '',
          timeRuleOption: '0',
          timeStart1: '',
          timeStart2: '',
          timeStart3: '',
          timeStart4: '',
          timeStart5: '',
          timeStart6: '',
          timeStart7: '',
          tuesday: 1,
          wednesday: 1,
          remarks: ''
        }
      }
    },
    // 选择统一设置或按天设置
    selectUnifidDay (tag) {
      this.$refs['ruleInfoForm'].clearValidate()
      if (tag === '1') {
        this.showTag = false
        if (!this.ruleInfo.timeRuleId) {
          this.ruleInfo.monday = 0
          this.ruleInfo.tuesday = 0
          this.ruleInfo.thursday = 0
          this.ruleInfo.wednesday = 0
          this.ruleInfo.friday = 0
          this.ruleInfo.saturday = 0
          this.ruleInfo.sunday = 0
        }
      } else {
        this.showTag = true
        this.ruleInfo.monday = 1
        this.ruleInfo.tuesday = 1
        this.ruleInfo.thursday = 1
        this.ruleInfo.wednesday = 1
        this.ruleInfo.friday = 1
        this.ruleInfo.saturday = 1
        this.ruleInfo.sunday = 1
      }
      console.log(this.ruleInfo)
    },
    // checkbox改变
    checkDay (checked, day) {
      if (!checked) {
        if (day === 1) {
          this.ruleInfo.timeStart1 = ''
          this.ruleInfo.timeEnd1 = ''
        }
        if (day === 2) {
          this.ruleInfo.timeStart2 = ''
          this.ruleInfo.timeEnd2 = ''
        }
        if (day === 3) {
          this.ruleInfo.timeStart3 = ''
          this.ruleInfo.timeEnd3 = ''
        }
        if (day === 4) {
          this.ruleInfo.timeStart4 = ''
          this.ruleInfo.timeEnd4 = ''
        }
        if (day === 5) {
          this.ruleInfo.timeStart5 = ''
          this.ruleInfo.timeEnd5 = ''
        }
        if (day === 6) {
          this.ruleInfo.timeStart6 = ''
          this.ruleInfo.timeEnd6 = ''
        }
        if (day === 7) {
          this.ruleInfo.timeStart7 = ''
          this.ruleInfo.timeEnd7 = ''
        }
      }
    },
    // 保存添加规则
    saveRule () {
      let failedFields = {}
      this.$refs['ruleInfoForm'].validate((valid, invalidFields) => {
        console.log(invalidFields)
        if (valid) {
          if (this.ruleInfo.timeRuleOption && !this.ruleInfo.monday && !this.ruleInfo.tuesday && !this.ruleInfo.thursday && !this.ruleInfo.wednesday && !this.ruleInfo.friday && !this.ruleInfo.saturday && !this.ruleInfo.sunday) {
            this.$message.error('不能所有时段都为空')
          } else {
            if (this.ruleInfo.timeRuleOption === '0') {
              this.ruleInfo.monday = this.ruleInfo.tuesday = this.ruleInfo.thursday = this.ruleInfo.wednesday = this.ruleInfo.friday = this.ruleInfo.saturday = this.ruleInfo.sunday = 1
              this.ruleInfo.timeStart2 = this.ruleInfo.timeStart3 = this.ruleInfo.timeStart4 = this.ruleInfo.timeStart5 = this.ruleInfo.timeStart6 = this.ruleInfo.timeStart7 = this.ruleInfo.timeStart1
              this.ruleInfo.timeEnd2 = this.ruleInfo.timeEnd3 = this.ruleInfo.timeEnd4 = this.ruleInfo.timeEnd5 = this.ruleInfo.timeEnd6 = this.ruleInfo.timeEnd7 = this.ruleInfo.timeEnd1
            }
            console.log(this.ruleInfo)
            if (this.ruleInfo.timeRuleId) {
              this.$axios.post('/api/pklot/updateTimeRule', this.ruleInfo).then(response => {
                if (response.data.data === 1) {
                  this.ruleDialogVisible = false
                  this.$message.success('修改成功')
                  this.getRulesList()
                }
              })
            } else {
              this.$axios.post('/api/pklot/addTimeRule', this.ruleInfo).then(response => {
                if (response.data.data === 1) {
                  this.ruleDialogVisible = false
                  this.$message.success('添加成功')
                  this.getRulesList()
                }
              })
            }
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
    // 取消提交
    cancelSubmit () {
      this.ruleDialogVisible = false
      this.showTag = true
      this.$refs['ruleInfoForm'].clearValidate()
    },
    // 打开删除包月弹出层
    deleteModel (ruleInfo) {
      this.deleteDialogVisible = true
      this.ruleInfo = ruleInfo
    },
    // 删除包月规则
    deleteRule () {
      this.$axios.post('/api/pklot/deleteTimeRule', {
        timeRuleId: this.ruleInfo.timeRuleId
      }).then(response => {
        if (response.data.data === 1) {
          this.deleteDialogVisible = false
          this.$message.success('删除成功')
          this.getRulesList()
        }
      })
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
  .rules-header {
    margin: 0px 0px 15px 0px;
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
  .rule-dialog {
    .rule-dialog-content {
      height: 350px;
      overflow: auto;
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
      .unified-label {
        height: 95px;
        .unified {
          position: absolute;
          left: -230px;
          width: 500px;
          top: 50px;
          /deep/ {
            .el-form-item {
              display: inline-block;
              margin-bottom: 0px;
              width: 220px;
              .el-input {
                width: 200px;
              }
            }
          }
        }
      }
      .day-set {
        height: 370px;
        .day-items {
          position: absolute;
          left: -250px;
          width: 500px;
          top: 50px;
          /deep/ {
            .el-form-item {
              display: inline-block;
              margin-bottom: 0px;
              border-bottom: 1px solid #ffffff;
              .el-form-item {
                width: 180px;
              }
              .el-input {
                width: 180px;
              }
            }
          }
        }
      }
      .remarks {
        .explain {
          left: -150px;
        }
        /deep/ {
          .el-input {
            width: 390px;
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
