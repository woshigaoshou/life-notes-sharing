const state = {
  name: '',
  phoneNum: '',
  password: '',
  profilePhoto: '',
  description: '',
}

const getters = {
  GET_USER_NAME: state => state.name,
  GET_USER_PROFILEPHOTO: state => state.profilePhoto,
  GET_USER_DESCRIPTION: state => state.description,
}

const mutation = {
  SET_USER_INFO(state, payload) {
    const {
      name,
      phoneNum,
      password,
      profilePhoto,
    } = payload;
  },
}


export default {
  namespaced: true,
  state,
  getters,
  mutation,
}
