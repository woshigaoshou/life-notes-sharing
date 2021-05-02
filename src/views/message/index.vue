<template>
  <div class="message">
    <h3 class="page-title">
      消息
      <!-- <span class="create">创建聊天</span> -->
    </h3>
    <div class="top-func">
      <span
        v-for="item in feature"
        :key="item.key"
        @click="iconPage(item.key)"
      >
        <!-- <i :class="item['icon']"></i> -->
        <!-- <img :src="item.icon" alt=""> -->
        <svg-icon :icon-class="item.icon"></svg-icon>
        <span>{{ item.text }}</span>
      </span>
    </div>
    <div class="frame"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      feature: [
        {
          icon: 'aixin',
          text: '赞和收藏',
          key: 'appreciates',
        },
        {
          icon: 'user',
          text: '新增关注',
          key: 'focus',
        },
        {
          icon: 'message',
          text: '评论和@',
          key: 'comment',
        },
      ],
    };
  },
  methods: {
    iconPage(key) {
      const map = {
        appreciates: 'newAppreciates',
        focus: 'newFocus',
        comment: 'comment',
      }
      this.$router.push({ name: map[key] });
    },
  },
  created() {

  },
  mounted() {

  },
};
</script>

<style lang='scss' scoped>
.message {
  .top-func {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin: 5vh 10vw 0;
    padding-bottom: 5vh;    
    & > span {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      width: 66px;
      height: 66px;
      // font-size: 20px;
      text-align: center;
      svg {
        font-size: 35px;
      }
      &:nth-child(2) {
        svg {
          margin-top: -5px;
          font-size: 46px;
        }
      }
    }
  }
  .frame {
    height: 10vh;
    margin: 0 4vw;
    border-top: 1px solid #ccc;
  }
  // 关注+socket
}
</style>
