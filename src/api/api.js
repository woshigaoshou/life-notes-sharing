import axios from 'axios'

const baseURL = "http://192.168.1.105:3000/life-notes-sharing/";

const xhr = axios.create({
  baseURL,
})

xhr.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error);
})

xhr.interceptors.response.use(response => {
  return response.data;
}, error => {
  return Promise.reject(error)
})

axios.defaults.withCredentials = true;

export default xhr;
