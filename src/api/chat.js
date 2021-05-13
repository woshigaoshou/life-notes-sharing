import xhr from './api';
import config from '@/config';

const chat = config.URL.chat;

export default {
  getChatList(id) {
    return xhr.get(`${chat}/fetch/${id}`);
  },
  createChat(params) {
    return xhr.post(`${chat}/create`, params);
  },
  deleteChat(params) {
    return xhr.delete(`${chat}/detele`, params);
  },
}
