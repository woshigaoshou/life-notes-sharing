import xhr from './api';
import config from '@/config';

const user = config.URL.user;

export default {
  register(params) {
    return xhr.post(`${user}/save`, params);
  },
}
