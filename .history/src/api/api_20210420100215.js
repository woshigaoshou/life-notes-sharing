import axios from 'axios'

const baseURL = "http://localhost:3000/";

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

export default {
  get(url) {
    return xhr.get(url);
  },
  post(url, params) {
    return xhr.post(url, params, {
      // headers: {
      //   'Content-Type': 'application/x-www-form-urlencoded'
      // }
    });
  },
  delete(url, params) {
    return xhr.delete(url, params);
  },
  put(url, params) {
    return xhr.put(url, params);
  },
};
