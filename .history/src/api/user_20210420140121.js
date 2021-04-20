import xhr from './api';
import config from '@/config';

const user = config.URL.user;

export default {
  register(params) {
    return xhr.post(`${user}/register`, params);
  },
  login(params) {
    return xhr.post(`${user}/login`, params);
  },
  retrieve(params) {
    return xhr.put(`${user}/retrieve`, params);
  }
}
