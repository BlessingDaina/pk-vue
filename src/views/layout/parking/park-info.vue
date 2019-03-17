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
  },
  components: {
    parkList
  }
}
</script>

<style scoped lang="scss">

</style>
