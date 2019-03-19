/**
* @author: daina
* @date: 2019/3/17
* @description:
*/
<template>
  <div><parkList v-on:getSelectedParkLotId="getParkLotIdFromList"/></div>
</template>

<script>
import parkList from '../components/parkingList'
export default {
  name: 'parkInfo',
  data () {
    return {
      parkingLotId: ''
    }
  },
  components: {
    parkList
  },
  methods: {
    // 从停车场列表组件获取当前选中的停车场id
    getParkLotIdFromList (data) {
      this.parkingLotId = data.selectedParkId
    }
  }
}
</script>

<style scoped lang="scss">

</style>
