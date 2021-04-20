<template>
  <div class="login">
    <a-page-header
      title="返回"
      @back="back"
    />
    <h2>登录后更精彩</h2>
    <div class="content" v-show="showModule === 'login'">
      <a-input placeholder="请输入手机号码" v-model="loginForm['phoneNum']" />
      <a-input placeholder="请输入密码" v-model="loginForm['password']" />
      <p class="tip">登录注册代表同意用户协议和隐私政策<i>找回密码</i></p>
      <a-button class="login-btn" @click="login">同意协议并登录</a-button>
      <a-button class="login-btn" @click="showModule = 'register'">注册账号</a-button>
    </div>
    <div class="register" v-show="showModule === 'register'">
      <a-input placeholder="请输入用户名" v-model="registerForm['name']" />
      <a-input placeholder="请输入手机号码" v-model="registerForm['phoneNum']" />
      <a-input placeholder="请输入密码" v-model="registerForm['password']" />
      <a-button class="login-btn" @click="register">注册账号</a-button>
    </div>
    <div class="retrieve" v-show="showModule === 'retrieve'">
      <a-input placeholder="请输入手机号码" v-model="retrieveForm['phoneNum']" />
      <a-input placeholder="请输入旧密码" v-model="retrieveForm['password']" />
      <a-input placeholder="请输入新密码" v-model="retrieveForm['newPassword']" />
      <a-button class="login-btn" @click="retrieve">找回密码</a-button>
    </div>
  </div>
</template>

<script>
import Api from '@/api';

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
    register() {
      const keys = Object.keys(this.registerForm);
      if (keys.some(key => this.registerForm[key] === '')) {
        this.$notification.error({
          message: '必填信息不能为空',
          duration: 1,
        });
        return;
      }
      
      Api.login.register(this.registerForm).then(res => {
        this.$notification.success({
          message: '注册成功',
          duration: 1,
        })
      });
    },
    login() {
      const keys = Object.keys(this.loginForm);
      if (keys.some(key => this.loginForm[key] === '')) {
        this.$notification.error({
          message: '必填信息不能为空',
          duration: 1,
        });
        return;
      }
      
      Api.login.login(this.loginForm).then(res => {
        if (res.status === 200) {
          this.$notification.success({
            message: '登录成功',
            duration: 1,
          })
        } else {
          this.$notification.error({
            message: '登录失败，请检查账号密码是否无误',
            duration: 1,
          })
        }
      });
    },
    retrieve() {
      const keys = Object.keys(this.retrieveForm);
      if (keys.some(key => this.retrieveForm[key] === '')) {
        this.$notification.error({
          message: '必填信息不能为空',
          duration: 1,
        });
        return;
      }
      
      Api.login.register(this.retrieveForm).then(res => {
        this.$notification.success({
          message: '找回密码成功',
          duration: 1,
        })
      });
    },
    back() {
      if (this.showModule !== 'login') {
        this.showModule = 'login'
      } else {
        this.$router.push({ name: 'Index' })
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
    padding: 10vh 0;
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
    .ant-input + .ant-input {
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
