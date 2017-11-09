import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'

import './common/stylus/index.styl'

fastclick.attach(document.body) //解决移动端300ms的延迟

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
