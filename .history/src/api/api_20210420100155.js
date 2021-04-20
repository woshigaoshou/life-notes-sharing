import axios from 'axios'

<<<<<<< HEAD
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
=======
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
>>>>>>> 89c0105e8420b8c54ba8ffbff1b2ce817937d8e8
  return response.data;
}, error => {
  return Promise.reject(error)
})

<<<<<<< HEAD
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
=======
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
>>>>>>> 89c0105e8420b8c54ba8ffbff1b2ce817937d8e8
};
