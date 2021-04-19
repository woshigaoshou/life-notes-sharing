import axios from 'axios'

const instance = axios.create({
  baseURL: "http://localhost:3000/"
})
// console.log(instance(config));
instance.interceptors.request.use(config => {
  // console.log(config);

  // config.headers.withCredentials = true;
  return config
})

instance.interceptors.response.use(response => {
  return response.data;
}, error => {
  return Promise.reject(error)
})

function getRequest(url) {
  return instance.get(url);
}

function postRequest(url, params) {
  console.log(params);
  
  return instance.post(url, params, {
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // }
  });
}

function deleteRequest(url, params) {
  return instance.delete(url, params);
}

function putRequest(url, params) {
  return instance.put(url, params);
  
}

export default {
  get: getRequest,
  post: postRequest,
  delete: deleteRequest,
  put: putRequest,
};
