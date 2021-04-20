<template>
  <div class="home">
    <!-- <scroll> -->
      <keep-alive>
        <router-view />
      </keep-alive>
    <!-- </scroll> -->
    <nav-bar :nav="nav" />
  </div>
</template>

<script>
import navBar from '@/components/navBar';

export default {
  components: {
    navBar,
  },
  data() {
    return {
      nav: [
        {
          title: '首页',
          path: '/home',
          iconfont: 'zhuye-fill',
        },
        {
          title: '发现',
          path: '/discover',
          iconfont: 'icon-',
        },
        {
          title: '消息',
          path: '/message',
          iconfont: 'xiaoxi',
        },
        {
          title: '我的',
          path: '/mine',
          iconfont: 'wode',
        }
      ],
    };
  },
  methods: {

  },
  created() {

  },
  mounted() {

  },
};
</script>

<style lang='scss' scoped>
.home {
  position: relative;
  height: 100vh;
  /deep/ .navbar {
    position: absolute;
    // bottom: -1px;
  }
}
</style>
