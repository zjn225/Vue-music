<template>
  <div id="app">
    <!--顶部组件-->
    <m-header></m-header>
    <!--切换路由-->
    <tab></tab>
    <!--keep-alive确保了切换tab时不会重复请求-->
    <keep-alive>
      <!--路由渲染到这里-->
      <router-view></router-view>
    </keep-alive>
    <!--播放器，独立的一个层，不受其他影响-->
    <player></player>
  </div>
</template>

<script>
  import MHeader from './components/m-header/m-header.vue'
  import Tab from './components/Tab/Tab.vue'
  import Player from './components/player/player.vue'

  export default {
    components: { //注册组件
      MHeader,
      Tab,
      Player
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "common/stylus/variable.styl"

</style>
