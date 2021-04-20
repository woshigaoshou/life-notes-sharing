<template>
  <div class="mine">
    <div class="header">
      <div class="info">
        <div class="profile-photo">
          <img src="../../assets/login.jpg">
        </div>
        <div class="user-info">
          <p>{{ 'userName' }}</p>
          <p>{{ 'description' }}</p>
        </div>
      </div>
      <div class="followers-info">
        <span>{{ focus }}</span>
        <span>{{ fans }}</span>
        <span>{{ appreciates }}</span>
      </div>
    </div>
    <div class="content">
      <div class="tabs">
        <span
          :class="{ active: index === activeIndex }"
          v-for="(item, index) in tabs"
          :key="index"
          @click="tabClick(index)"
        >
          {{ item }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      tabs: ['笔记', '收藏', '赞过'],
      activeIndex: 0,
    };
  },
  computed: {
    ...mapGetters('user', {
      userName: 'GET_USER_NAME',
      profilephoto: 'GET_USER_PROFILEPHOTO',
      description: 'GET_USER_DESCRIPTION',
    })
  },
  methods: {
    tabClick(index) {
      this.activeIndex = index;
    },
  },
  created() {

  },
  mounted() {

  },
};
</script>

<style lang="scss" scoped>
@import "@/css/theme.scss";

.mine {
  height: 89vh;
  background-color: rgba(128, 89, 89, 0.61);
  .header {
    height: 30vh;
    .info {
      display: flex;
      padding-top: 7vh;
      padding-left: 5vh;
      .profile-photo {
        width: 70px;
        height: 70px;
        margin-right: 5vw;
        border-radius: 50% 50%;
        overflow: hidden;
        img {
          height: 100%;
          width: 100%;
        }
      }
      .user-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        p {
          margin: 0;
          &:nth-child(1) {
            margin-bottom: 5px;
          }
        }
      }
    }
  }
  .content {
    width: 100vw;
    height: 60vh;
    position: absolute;
    bottom: 10vh;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    background-color: #fff;
    .tabs {
      padding: 1vh 2vw;
      line-height: 36px;
      vertical-align: middle;
      text-align: center;
      border-bottom: 1px solid rgba(228, 225, 225, 0.267);
      span {
        font-size: 16px;
        display: inline-block;
        height: 100%;
        padding: 0 3vw;
        margin: 0 2vw;
      }
      .active {
        border-bottom: 1px solid $theme-color;
      }
    }
  }
}
</style>
