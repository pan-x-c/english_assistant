// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import echarts from 'echarts'
import App from './App'
import * as AI from '../static/js/face-api.js'

// import Camera from '@/components/Camera'
// import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '../static/vendor/magnific-popup/magnific-popup.css'
import '../static/css/freelancer.css'

Vue.use(BootstrapVue)
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
Vue.prototype.$AI = AI

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})

