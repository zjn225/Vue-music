import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '../components/recommend/recommend.vue'
import Singer from '../components/singer/singer.vue'
import Rank from '../components/rank/rank.vue'
import Search from '../components/search/search.vue'
import SingerDetail from '../components/singer-detail/singer-detail.vue'
import Disc from '../components/disc/disc'

Vue.use(Router)

export default new Router({
  routes: [
    /*默认在recommend页*/
    {
      path: '/',
      redirect: './recommend',
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [{
        path: ':id',  //不同ID值对应不同的子路由！！！
        component: Disc
      }]
    },
    {
      path: '/singer',
      component: Singer,
      children: [{
        path: ':id',  //不同ID值对应不同的子路由！！！
        component: SingerDetail
      }]
    },
    {
      path: '/rank',
      component: Rank
    },
    {
      path: '/search',
      component: Search
    }
  ]
})
