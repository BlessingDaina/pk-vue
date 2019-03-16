<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import index from './views/layout/index.vue'
import '@/assets/css/normalize.css'

export default {
  name: 'app',
  components: {
    index
  }
}
</script>
<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 0px;
  }
</style>
