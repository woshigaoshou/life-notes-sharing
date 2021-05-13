import axios from 'axios'
import Vue from 'vue'
import router from '../router'


const baseURL = "http://192.168.0.110:3000/life-notes-sharing/";

const xhr = axios.create({
  baseURL,
})

xhr.interceptors.request.use(config => {
  config.headers.token = localStorage.getItem('token');
  return config
}, error => {
  return Promise.reject(error);
})

xhr.interceptors.response.use(response => {
  console.log(response.data);
  if (response.data.status === 403) {
    localStorage.removeItem('token');
    Vue.prototype.$notification.error({
      message: '登录已过期，请重新登录',
      duration: 2,
    })
    router.push({ path: '/login' });
  }
  return response.data;
}, error => {
  return Promise.reject(error)
})

axios.defaults.withCredentials = true;

export default xhr;
