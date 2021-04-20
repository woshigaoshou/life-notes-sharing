<template>
  <div class="login">
    <a-page-header
      title="返回"
      @back="back"
    />
    <h2>登录后更精彩</h2>
    <div class="content" v-show="!isRegister">
      <a-input placeholder="请输入手机号码" />
      <a-input placeholder="请输入密码" />
      <p class="tip">登录注册代表同意用户协议和隐私政策</p>
      <a-button class="login-btn">同意协议并登录</a-button>
      <a-button class="login-btn" @click="isRegister = true">注册账号</a-button>
    </div>
    <div class="register" v-show="isRegister">
      <a-input placeholder="请输入用户名" v-model="form['name']" />
      <a-input placeholder="请输入手机号码" v-model="form['phoneNum']" />
      <a-input placeholder="请输入密码" v-model="form['password']" />
      <a-button class="login-btn" @click="register">注册账号</a-button>
    </div>
  </div>
</template>

<script>
import Api from '@/api';

export default {
  data() {
    return {
      isRegister: false,
      form: {
        name: '',
        phoneNum: '',
        password: '',
      }
    };
  },
  methods: {
    register() {
      const keys = Object.keys(this.form);
      if (keys.some(key => this.form[key] === '')) {
        this.$notification.error({
          message: '必填信息不能为空',
          duration: 1,
        });
        return;
      }
      
      Api.login.register(this.form).then(res => {
        this.$notification.success({
          message: '注册成功',
          duration: 1,
        })
      });
    },
    back() {
      if (this.isRegister) {
        this.isRegister = false;
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
  .content, .register {
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
      margin: 6px 0;
      font-size: 12px;
      color: #fff;
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
