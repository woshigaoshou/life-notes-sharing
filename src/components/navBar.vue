<template>
  <div class="NavBar">
    <div
      class="NavBar-item"
      v-for="(item,index) in nav"
      :key="index"
      :class="{active: currentIndex === index} "
      @click="itemClick(index)"
    >
      <router-link :to="`/index${nav[index]['path']}`" class="title">{{ item.title }}</router-link>
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
      // currentIndex: this.path.indexOf(this.$route.path.slice(5))
    };
  },
  computed: {
    currentIndex() {
      const index = this.nav.findIndex(item => item.path === this.$route.path);
      return index === -1 ? 0 : index; //读取属性时默认值为该值
      // return this.currentIndex;
      // console.log(index);
    }
  },
  methods: {
    itemClick(index) {
      // this.currentIndex = index;
      // console.log(this.currentIndex);
      // this.$router.replace(this.path[index]);
      this.$emit("itemClick", this.nav[index], index);
    }
  }
};
</script>
<style scoped>
.NavBar {
  height: 3vh;
  display: flex;
  justify-content: space-evenly;
  text-align: center;
  font-size: 4.5vw;
  color: #000;
  padding: 0 12vw;
  margin-bottom: 6.5vh;
  margin-top: 1vh;
}
.NavBar .title {
  width: 100%;
  height: 100%;
  padding-bottom: 1.2vh;
  flex: 1;
  color: #000;
  text-decoration: none;
}
.active .title {
  font-weight: 700;
  border-bottom: 2px solid #fff;
}
</style>