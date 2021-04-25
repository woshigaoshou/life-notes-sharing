import xhr from './api';
import config from '@/config';

const note = config.URL.note;

export default {
  getNotesList(params) {
    return xhr.get(`${note}/list`,params);
  },
}
