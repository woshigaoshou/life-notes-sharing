import xhr from './xhr';

export default {
  login(params) {
    return xhr.get('/login', params);
  },
};