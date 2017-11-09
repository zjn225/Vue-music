<template>
  <div id="app">
    <!--顶部组件-->
    <m-header></m-header>
    <!--切换路由-->
    <tab></tab>
    <!--keep-alive确保了切换tab时不会重复请求-->
    <keep-alive>
      <!--路由渲染到这里，前提需要tab切换-->
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import MHeader from './components/m-header/m-header.vue'
  import Tab from './components/Tab/Tab.vue'

  export default {
    components: {
      MHeader,  //顶部组件
      Tab
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "common/stylus/variable.styl"

</style>
