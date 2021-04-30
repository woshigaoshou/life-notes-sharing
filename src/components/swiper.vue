<template>
  <swiper :options="swiperOption" ref="mySwiper" class="swiper">
    <!-- slides -->
    <swiper-slide v-for="(item,index) in banners" :key="index" class="swiper-item">
      <img :src="item" alt />
    </swiper-slide>
    <div class="swiper-pagination" slot="pagination"></div>
  </swiper>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
// import "vue-awesome-swiper/node_modules/swiper/dist/css/swiper.css";

export default {
  name: "customSwiper",
  components: {
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      swiperOption: {
        autoplay: 2000,
        loop: true,
        pagination: ".swiper-pagination",
        autoplayDisableOnInteraction: false
      }
    };
  },
  props: {
    banners: {
      type: Array,
      default() {
        return [];
      }
    }
  }
};
</script>
<style scoped>
.swiper-item {
  text-align: center;
  width: 99vw;
  border-radius: 10px;
  overflow: hidden;
}
.swiper-item img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  max-width: 99vw;
  /* height: 100%; */
  /* border-radius: 3vw; */
}
</style>
