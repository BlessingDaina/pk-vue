/**
* @author: daina
* @date: 2018/11/22
* @description:
*/
<template>
  <div class="all-content">
    <div class="content-top">
      <el-row :gutter="30">
        <el-col :span="6">
          <div class="box-style">
            1
          </div>
        </el-col>
        <el-col :span="6">
          <div class="box-style">2</div>
        </el-col>
        <el-col :span="6">
          <div class="box-style">3</div>
        </el-col>
        <el-col :span="6">
          <div class="box-style">4</div>
        </el-col>
      </el-row>
    </div>
    <div class="content-center">
      <div class="feature">
        <el-date-picker
          v-model="startDate"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
        <el-date-picker
          v-model="endDate"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
        <span style="font-size:20px;font-weight:bold;text-align:center;margin-left: 400px;">收入趋势</span>
        <div style="float:right">
          <el-button-group>
            <el-button type="primary" icon="el-icon-edit"></el-button>
            <el-button type="primary" icon="el-icon-share"></el-button>
            <el-button type="primary" icon="el-icon-delete"></el-button>
          </el-button-group>
        </div>
      </div>
      <revenue-trend></revenue-trend>
    </div>
  </div>
</template>

<script>
import revenueTrend from '../components/recenueTrend'

export default {
  name: 'parkingHome',
  data () {
    return {
      startDate: '',
      endDate: ''
    }
  },
  components: {
    revenueTrend
  }
}
</script>

<style scoped lang="scss">
  .all-content {
    width: 98%;
    height: 100%;
    margin: 0 auto;
  }

  .content-top {
    height: 15%;
    width: 100%;
    background-color: yellow;
    .el-row {
      height: 100% !important;
      .el-col {
        height: 100% !important;
      }
    }
    .box-style {
      width: 50%;
      height: 80%;
      background-color: #fff;
      box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.3);
    }
  }

  .content-center {
    height: 46%;
    width: 100%;
    background-color: #fff;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.3);
  }
</style>
