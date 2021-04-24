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
    component: _import('Index'),
    children: [
      {
        path: '/',
        redirect: '/index/home',
      },
      {
        path: 'home',
        name: 'home',
        component: _import('home/index'),
      },
      {
        path: 'discover',
        name: 'discover',
        component: _import('discover/index'),
      },
      {
        path: 'message',
        name: 'message',
        component: _import('message/index'),
        children: [],
      },
      {
        path: 'mine',
        name: 'mine',
        component: _import('mine/index'),
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: _import('Login'),
  },
  {
    path: '/newFocus',
    name: 'newFocus',
    component: _import('message/newFocus/index'),
  },
]

const router = new VueRouter({
  routes
})

export default router
