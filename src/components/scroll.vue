  
<template>
  <div class="wrapper" ref="wrapper">
    <div class="common-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
  name: "scroll",
  data() {
    return {
      scroll: null
    };
  },
  methods: {
    scrollTo(x, y, time = 300) {
      this.scroll && this.scroll.scrollTo(x, y, time);
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    getSaveY() {
      return this.scroll ? this.scroll.y : 0;
    }
  },
  props: {
    probeType: {
      type: Number,
      default: 0
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    },
    scrollX: {
      type: Boolean,
      default: false
    }
    // width: {
    //   type: Number,
    //   default: 0
    // }
  },
  mounted() {
    // console.log(this.$refs.wrapper);
    this.scroll = new BScroll(this.$refs.wrapper, {
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad,
      click: true,
      scrollX: this.scrollX,
      scrollY: !this.scrollX
    });
    // console.log(this.probeType);
    if (this.probeType === 2 || this.probeType === 3) {
      this.scroll.on("scroll", position => {
        // console.log(position);
        this.$emit("scroll", position);
      });
    }
    // this.$nextTick(() => {
    //   if (!this.width) {
    //     this.$refs.content.style.width = this.width + "vw";
    //   }
    // });
    // this.scroll.on("pullingUp", () => {
    //   // console.log("下拉加载更多");
    //   this.$emit("pullingUp");
    //   this.scroll.finishPullUp();
    // });
  }
};
</script>
<style>
.common-content {
  padding-bottom: 8vh;
}
</style>