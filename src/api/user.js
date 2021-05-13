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
  },
  uploadAvatar(params) {
    return xhr.post(`${user}/upload/avatar`, params);
  },
  getFocusList(id) {
    return xhr.get(`${user}/focusList/${id}`);
  },
  changeFocusStatus(params) {
    return xhr.put(`${user}/changeFocusStatus`, params);
  },
  editDesc(params) {
    return xhr.put(`${user}/editDesc`, params);
  },
  getUserDetail(id) {
    return xhr.get(`${user}/detail/${id}`);
  },
}
