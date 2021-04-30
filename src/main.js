import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import '@/css/icon-font/iconfont.css';
import scroll from './components/scroll';
import swiper from './components/swiper';
import '@/icons';

import waterfall from 'vue-waterfall2'
Vue.use(waterfall)
import 'swiper/swiper-bundle.css'

Vue.component('customSwiper', swiper);


import moment from 'moment';
Vue.prototype.$moment = moment;

Vue.use(Antd)
Vue.component('scroll', scroll);

Vue.prototype.$bus = new Vue();

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
