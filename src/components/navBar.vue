<template>
  <div class="navbar">
    <div
      class="navbar-item"
      v-for="(item,index) in nav"
      :key="index"
      :class="{active: currentIndex === index} "
      @click="itemClick(index)"
    >
      <i class="iconfont" :class="`icon${nav[index]['iconfont']}`"></i>
      <span class="title">{{ item.title }}</span>
      <!-- <router-link :to="`/index${nav[index]['path']}`" class="title">{{ item.title }}</router-link> -->
    </div>
    <!-- <slot></slot> -->
  </div>
</template>

<script>
export default {
  name: "NavBar",
  props: {
    nav: {
      type: Array,
      require: true,
    },
  },
  data() {
    return {
  
    };
  },
  computed: {
    currentIndex() {
      const index = this.nav.findIndex(item => this.$route.path.indexOf(item.path) !== -1);
      return index === -1 ? 0 : index; //读取属性时默认值为该值
    }
  },
  methods: {
    itemClick(index) {
      this.$emit("itemClick", this.nav[index], index);
      this.$router.push({path: `/index${this.nav[index]['path']}`});
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/css/theme.scss';

.navbar {
  width: 100%;
  height: 9vh;
  // padding: 0 12vw;
  padding-bottom: 1vh;
  margin-top: 1vh;
  display: flex;
  justify-content: space-evenly;
  text-align: center;
  font-size: 3.5vw;
  color: #000;
  background-color: #fff;
  &-item {
    padding: 0 4vw;
    .iconfont {
      display: block;
      font-size: $icon-size;
      color: #333;
    }
    .title {
      width: 100%;
      height: 100%;
      padding-bottom: 1.2vh;
      flex: 1;
      color: #000;
      text-decoration: none;
    }
  }
  .active {
    .title {
      // font-weight: 700;
      // border-bottom: 2px solid #fff;
      color: $theme-color;
    }
    .iconfont {
      color: $theme-color;
    }
  }
}
</style>
