import Vue from 'vue'
import VueRouter from 'vue-router'

const _import = file => () => import(`@/views/${file}.vue`);


// 捕获无权限时跳转login报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

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
  {
    path: '/newAppreciates',
    name: 'newAppreciates',
    component: _import('message/newAppreciates/index'),
  },
  {
    path: '/newComment',
    name: 'newComment',
    component: _import('message/newComment/index'),
  },
  {
    path: '/noteDetail/:id',
    name: 'noteDetail',
    component: _import('home/noteDetail/index'),
  },
  {
    path: '/userDetail/:id',
    name: 'userDetail',
    component: _import('user/index'),
  }
]

const router = new VueRouter({
  routes
})

export default router
