import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

import './common/stylus/index.styl'

fastclick.attach(document.body) //解决移动端300ms的延迟

/*注册懒加载*/
Vue.use(VueLazyLoad,{
  loading:require('./common/image/default.png')
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})
