<<<<<<< HEAD
import xhr from './api';

export default {
  register(params) {
    return xhr.post('/save', params);
=======
import instance from './api';

export default {
  register(params) {
    return instance.post('/save', params);
>>>>>>> 89c0105e8420b8c54ba8ffbff1b2ce817937d8e8
  },
}
