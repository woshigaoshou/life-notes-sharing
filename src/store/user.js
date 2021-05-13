const storage = window.localStorage

const userInfo = storage.getItem('userInfo') ? JSON.parse(storage.getItem('userInfo')) : {
  name: '',
  _id: '',
  phoneNum: '',
  password: '',
  avatar: '',
  description: '',
  fans: [],
  focus: [],
};

const state = {
  userInfo,
}

const getters = {
  GET_USER_INFO: state => state.userInfo,
}

const mutations = {
  SET_USER_INFO(state, payload) {
    state.userInfo = payload;    
    storage.setItem('userInfo', JSON.stringify(payload));  
  },
  UPDATE_USER_AVATAR(state, payload) {
    state.userInfo.avatar = payload;
  },
  UPDATE_USER_DESC(state, payload) {
    state.userInfo.description = payload;
  },
  UPDATE_USER_FANS(state, payload) {
    state.userInfo.fans = payload;
    storage.setItem('userInfo', JSON.stringify(state.userInfo));  
  },
  UPDATE_USER_FOCUS(state, payload) {
    state.userInfo.focus = payload;
    console.log(payload);
    
    storage.setItem('userInfo', JSON.stringify(state.userInfo));
  }
}


export default {
  namespaced: true,
  state,
  getters,
  mutations,
}
