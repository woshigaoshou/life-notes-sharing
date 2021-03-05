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
    children: [
      {
        path: '/',
        redirect: '/index/home',
      },
      {
        path: 'home',
        name: 'home',
        component: _import('home/home'),
      },
      {
        path: 'discover',
        name: 'discover',
        component: _import('discover/discover'),
      },
      {
        path: 'message',
        name: 'message',
        component: _import('message/message'),
      },
      {
        path: 'mine',
        name: 'mine',
        component: _import('mine/mine'),
      },
    ],
  }
]

const router = new VueRouter({
  routes
})

export default router
