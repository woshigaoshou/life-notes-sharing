import Axios from 'axios';

const baseURL = 'http://127.0.0.1:3000/';

const xhr = Axios.create({
  baseURL,
})

xhr.interceptors.request.use(config => {
  return config;
}, error => {
  return Promise.reject(error);
})

xhr.interceptors.response.use(res => {
  return res;
}, error => {
  return Promise.reject(error);
})

export default {
  get(url, params) {
    return xhr.get(url, params);
  },
  post(url, params) {
    return xhr.post(url, params);
  },
  put(url, params) {
    return xhr.put(url, params);
  },
  delete(url, params) {
    return xhr.push(url, params);
  },
}