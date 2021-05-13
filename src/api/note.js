import xhr from './api';
import config from '@/config';

const note = config.URL.note;

export default {
  getNotesList(params) {
    return xhr.get(`${note}/list`,{ params });
  },
  getNoteDetail(id) {
    return xhr.get(`${note}/detail/${id}`);
  },
  thumbUp(params) {
    return xhr.put(`${note}/thumbup`, params);
  },
  collect(params) {
    return xhr.put(`${note}/collect`, params);
  },
  getClassifyList(type, id) {
    return xhr.get(`${note}/classifyList/${type}/${id}`);
  },
  getAppreciatesList(id) {
    return xhr.get(`${note}/appreciatesList/${id}`);
  },
  delNote(id) {
    return xhr.delete(`${note}/delNote/${id}`);
  },
  createNote(params) {
    return xhr.post(`${note}/createNote`, params, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
}
