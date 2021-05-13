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

router.beforeEach((to,from,next)=>{
  const path = ['/login', '/index/home', '/noteDetail', '/index/mine']
	if(to.path === '/' || path.some(item => to.path.includes(item))){
    next();
    return;
  }
  const token = window.localStorage.getItem("token");
  
	//本地获取token，如果没有就返回登录页面
	if(token == null || token == undefined){
    Vue.prototype.$notification.error({
      message: '登录已过期，请重新登录',
      duration: 2,
    })
    next('/login');
    return;
  }
  console.log(1);
  
	next();
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
