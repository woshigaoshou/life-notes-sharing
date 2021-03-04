<template>
  <div>
    <nav-bar :nav="nav" />
    <router-view></router-view>
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
        },
        {
          title: '发现',
          path: '/discover',
        },
        {
          title: '消息',
          path: '/message',
        },
        {
          title: '我的',
          path: '/mine',
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

</style>
