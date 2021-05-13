import xhr from './api';
import config from '@/config';

const hotSearch = config.URL.hotSearch;

export default {
  getHotSearch() {
    return xhr.get(`${hotSearch}/fetch`);
  },
  addHotSearch(params) {
    return xhr.post(`${hotSearch}/add`, params);
  },
}
