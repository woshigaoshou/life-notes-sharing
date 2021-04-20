import axios from 'axios'

const baseURL = "http://localhost:3000/life-notes-sharing/";

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

export default xhr;
