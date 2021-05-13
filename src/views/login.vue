<template>
  <div class="login">
    <a-page-header
      title="返回"
      @back="back"
    />
    <h2>登录后更精彩</h2>
    <div class="content" v-show="showModule === 'login'">
      <a-input placeholder="请输入账号" v-model="loginForm['phoneNum']" />
      <a-input-password placeholder="请输入密码" v-model="loginForm['password']" />
      <p class="tip">登录注册代表同意用户协议和隐私政策<i @click="showModule = 'retrieve'">找回密码</i></p>
      <a-button class="login-btn" @click="login">同意协议并登录</a-button>
      <a-button class="login-btn" @click="showModule = 'register'">注册账号</a-button>
    </div>
    <div class="register" v-show="showModule === 'register'">
      <a-input placeholder="请输入用户名" v-model="registerForm['name']" />
      <a-input placeholder="请输入账号" v-model="registerForm['phoneNum']" />
      <a-input-password placeholder="请输入密码" v-model="registerForm['password']" />
      <a-button class="login-btn" @click="register">注册账号</a-button>
    </div>
    <div class="retrieve" v-show="showModule === 'retrieve'">
      <a-input placeholder="请输入账号" v-model="retrieveForm['phoneNum']" />
      <a-input-password placeholder="请输入旧密码" v-model="retrieveForm['password']" />
      <a-input-password placeholder="请输入新密码" v-model="retrieveForm['newPassword']" />
      <a-button class="login-btn" @click="retrieve">找回密码</a-button>
    </div>
  </div>
</template>

<script>
import Api from '@/api';
import { mapMutations } from 'vuex';

export default {
  data() {
    return {
      showModule: 'login',
      registerForm: {
        name: '',
        phoneNum: '',
        password: '',
      },
      retrieveForm: {
        phoneNum: '',
        password: '',
        newPassword: '',
      },
      loginForm: {
        phoneNum: '',
        password: '',
      },
    };
  },
  methods: {
    ...mapMutations('user', {
      setUserInfo: 'SET_USER_INFO',
    }),
    register() {
      const keys = Object.keys(this.registerForm);
      if (keys.some(key => this.registerForm[key] === '')) {
        this.$notification.error({
          message: '必填信息不能为空',
          duration: 2,
        });
        return;
      }
      
      Api.user.register(this.registerForm).then(res => {
        if (res.status === 200) {
          this.$notification.success({
            message: '注册成功',
            duration: 2,
          })
          this.showModule = 'login';
          this.registerForm = {
            name: '',
            phoneNum: '',
            password: '',
          };
        } else {
          this.$notification.error({
            message: res.message,
            duration: 2,
          })
        }
      });
    },
    login() {      
      const keys = Object.keys(this.loginForm);
      if (keys.some(key => this.loginForm[key] === '')) {
        this.$notification.error({
          message: '必填信息不能为空',
          duration: 2,
        });
        return;
      }
      
      Api.user.login(this.loginForm).then(res => {

        if (res.status === 200) {
          this.$notification.success({
            message: '登录成功',
            duration: 2,
          })
          
          const storage = window.localStorage;
          // 初始化信息存储到vuex
          this.setUserInfo(res.data);
          storage.setItem('token', res.token);
          // storage.removeItem('userInfo');
          // storage.setItem('userInfo', JSON.stringify(res.data));          

          this.$router.push({ path: '/' });
        } else {
          this.$notification.error({
            message: res.msg,
            duration: 2,
          })
        }
      });
    },
    retrieve() {
      const keys = Object.keys(this.retrieveForm);
      if (keys.some(key => this.retrieveForm[key] === '')) {
        this.$notification.error({
          message: '必填信息不能为空',
          duration: 2,
        });
        return;
      }
      
      Api.user.retrieve(this.retrieveForm).then(res => {
        if (res.status === 200) {
          this.$notification.success({
            message: '找回密码成功',
            duration: 2,
          })
        } else {
          this.$notification.error({
            message: '原始密码错误',
            duration: 2,
          })
        }
      });
    },
    back() {
      if (this.showModule !== 'login') {
        this.showModule = 'login'
      } else {
        this.$router.push({ path: '/' })
      }
    },
  },
  created() {

  },
  mounted() {

  },
}

</script>
<style lang="scss" scoped>
@import "@/css/theme.scss";

.login /deep/{
  background: url('../assets/login.jpg') 50% 50%;
  .ant-page-header-heading-title,.anticon-arrow-left {
    color: #fff;
  }
  h2 {
    padding: 15vh 0 10vh;
    text-align: center;
    color: #fff;
  }
  .content, .register, .retrieve {
    width: 85vw;
    height: 30vh;
    margin: 5vh auto;
    text-align: center;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    // background-color: #fff;
    & > [class^=ant-input] + [class^=ant-input] {
      margin-top: 3vh;
    }
    .tip {
      position: relative;
      margin: 6px 0;
      font-size: 12px;
      color: #fff;
      i {
        position: absolute;
        right: 2px;
        color: $blue-color;
      }
    }
    .login-btn {
      margin-top: 5vh;
      & + .login-btn {
        margin-left: 5vw;
      }
    }
  }
}
</style>
