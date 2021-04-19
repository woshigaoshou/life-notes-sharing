import instance from './api';

export default {
  register(params) {
    return instance.post('/save', params);
  },
}
