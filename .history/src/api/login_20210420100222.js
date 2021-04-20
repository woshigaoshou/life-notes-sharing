import xhr from './api';

export default {
  register(params) {
    return xhr.post('/save', params);
  },
}
