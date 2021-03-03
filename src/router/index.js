import Vue from 'vue'
import VueRouter from 'vue-router'

const _import = file => () => import(`@/views/${file}.vue`);

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/index',
  },
  {
    path: '/index',
    name: 'Index',
    component: _import('Index'),
  }
]

const router = new VueRouter({
  routes
})

export default router
