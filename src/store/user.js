const storage = window.localStorage

const userInfo = storage.getItem('userInfo') ? JSON.parse(storage.getItem('userInfo')) : {
  name: '',
  _id: '',
  phoneNum: '',
  password: '',
  avatar: '',
  description: '',
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
  },
  UPDATE_USER_AVATAR(state, payload) {
    state.userInfo.avatar = payload;
  },
}


export default {
  namespaced: true,
  state,
  getters,
  mutations,
}
