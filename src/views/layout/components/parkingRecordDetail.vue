/**
* @author: daina
* @date: 2019/4/10
* @description:
*/
<template>
  <div>
    <el-card class="parking-record-detail" shadow="hover" :body-style="{ padding: '0px',height:'100%' }">
      <div class="detail-list">
        <div class="carlicense">
          {{detail.carLicense}}
        </div>
        <!--<el-steps direction="vertical" :active="activeIndex" :space=150>-->
          <!--<el-step v-for="(detail, index) in detailsData" :title="detail.parkinglotName" :key="index" description="点击查看详情" @click.native="selectDetail(index)">-->
          <!--</el-step>-->
        <!--</el-steps>-->
      </div>
      <div class="detail-cont">
        <el-scrollbar style="height: 100%">
          <el-card :body-style="{ padding: '0px' }" shadow="never">
            <img v-if="detail.entrancePhoto" :src="require('../../images/'+detail.entrancePhoto)">
            <img v-else src="../../images/defaultimg.png">
            <div class="detail-des">
              <span>入场通道：{{ detail.entranceName }}</span>
              <div class="bottom clearfix">
                <time class="time">入场时间：{{ detail.entranceTime }}</time>
              </div>
            </div>
          </el-card>
          <el-card :body-style="{ padding: '0px' }" shadow="never">
            <img v-if="detail.exitPhoto" :src="require('../../images/'+ detail.exitPhoto)" class="image">
            <img v-else src="../../images/defaultimg.png">
            <div class="detail-des">
              <span>出场通道：{{ detail.exitName }}</span>
              <div class="bottom clearfix">
                <time class="time">出场时间：{{ detail.exitTime }}</time>
              </div>
            </div>
          </el-card>
          <el-card :body-style="{ padding: '10px' }" shadow="never" class="price">
            <div class="detail-price">
              <p>停车时长：<i v-show="detail.datsum !== null">{{ countDuration(detail.datsum) }}</i></p>
              <p>产生费用：<i v-show="detail.amountTotal !== null">{{ detail.amountTotal }} 元</i></p>
              <p>支付费用：<i v-show="detail.amountFinal !== null">{{ detail.amountFinal }} 元</i></p>
            </div>
          </el-card>
        </el-scrollbar>
      </div>
    </el-card>
    <div class="shade" style="left:200px" @click="hideDetail"></div>
  </div>
</template>

<script>
export default {
  name: 'parkingRecordDetail',
  props: ['recordId', 'isShowDetail'],
  data () {
    return {
      isShow: false,
      activeIndex: 0, // 选中step
      detailsData: [],
      detail: {
        amountFinal: '',
        amountTotal: '',
        carLicense: '',
        datsum: '',
        entranceId: '',
        entranceName: '',
        entrancePhoto: '',
        entranceTime: '',
        exitId: '',
        exitName: '',
        exitPhoto: '',
        exitTime: '',
        licenseColor: '',
        parkingLotId: '',
        parkingType: '',
        parkinglotName: ''
      }
    }
  },
  watch: {
    isShowDetail: function (val, oldVal) {
      this.activeIndex = 0
      this.isShow = val
      if (this.isShow) {
        this.parkingRecordDetails()
      }
    }
  },
  methods: {
    // 查看停车记录详情
    parkingRecordDetails () {
      this.$axios.post('/api/pklot/getParkingRecordInfo', {recordId: this.recordId}).then(response => {
        this.detailsData = response.data.data
        console.log(this.detailsData)
        this.detail = this.detailsData
      }).catch(error => {
        console.log(error)
        this.$message.error('服务器错误')
      })
    },
    // 嵌套停车场点击切换详情
    selectDetail (index) {
      this.detail = this.detailsData[index]
      this.activeIndex = index
    },
    // 点击遮罩，关闭详情
    hideDetail () {
      this.isShow = false
      this.$emit('closeShade', this.isShow)
    },
    // 转换时长
    countDuration (duration) {
      let day = duration / (60 * 60 * 24)
      let hour = duration / (60 * 60) - day * 24
      let min = duration / 60 - hour * 60 - day * 24 * 60
      let sec = duration - min * 60 - hour * 60 * 60 - day * 60 * 60 * 24
      let totalTime = (day === 0 ? '' : (day + '天')) + (hour === 0 ? '' : (hour + '小时')) + (min === 0 ? '' : (min + '分')) + sec + '秒'
      return totalTime
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
  .parking-record-detail{
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 600px;
    background-color: #fff;
    z-index: 1000;
  }
  .shade {
    position: fixed;
    top: 50px;
    right: 0;
    bottom: 0;
    background-color: rgba(200, 200, 200, .5);
    z-index: 999;
  }
  .detail-list{
    width: 200px;
    height: 100%;
    border-right: 1px solid #c3c3c3;
    box-sizing: border-box;
    float: left;
    .carlicense{
      line-height: 50px;
      text-align: center;
      border-bottom: 1px dashed #c3c3c3;
      color: #2b2b2b;
    }
  }
  .el-steps{
    // margin-top: 15px;
    padding:10px;
    .el-step{
      cursor: pointer;
    }
    /deep/ .el-step__title{
      font-size: 14px;
    }
    /deep/ .el-step.is-vertical .el-step__main{
      padding-left: 8px;
    }
    /deep/ .el-step.is-vertical .el-step__head{
      width: 20px;
      .el-step__icon{
        width: 20px;
        height: 20px;
      }
      .el-step__icon.is-text{
        border:1px solid;
      }
    }
    /deep/ .el-step.is-vertical .el-step__line{
      top: 24px;
      left: 9px;
    }
  }
  .detail-cont{
    display: inline-block;
    width: 400px;
    height: 100%;
    .el-card{
      // height: 350px;
      img {
        width: 100%;
        height: 280px;
      }
    }
    .detail-des{
      padding: 10px;
      font-size: 14px;
      line-height: 24px;
      color: #5d5d5d;
    }
  }
  .detail-price p{
    color: #409EFF;
    margin: 0;
    line-height: 2;
    font-size: 15px;
    font-weight: 500;
    i{
      color:red;
    }
  }
</style>
