import xhr from './api';
import config from '@/config';

const comment = config.URL.comment;

export default {
  emitComment(params) {
    return xhr.post(`${comment}/save`,params);
  },
  getCommentList(id) {
    return xhr.get(`${comment}/fetch/${id}`);
  },
  getCommentHistory(id) {
    return xhr.get(`${comment}/history/${id}`);
  },
  thumbUpComment(params) {
    return xhr.put(`${comment}/thumbUp`, params);
  },
  delComment(id) {
    return xhr.delete(`${comment}/delete/${id}`);
  },
}
