<template>
  <div class="mine">
    <div class="header">
      <div class="info">
        <div class="avatar">
          <img :src="user.avatar || '../../assets/avatar.jpg'" @click="selectPhoto">
          <input type="file" ref="upload" @change="uploadAvatar">
        </div>
        <div class="user-info">
          <p>{{ user.name }}</p>
          <p>{{ `账号ID：${user._id}` }}</p>
        </div>
      </div>
      <p style="padding-left: 3vh;">{{ `个人简介：${user.description}` }}</p>
      <div class="followers-info">
        <span>{{ `${user.focus}\n关注` }}</span>
        <span>{{ `${user.fans}\n粉丝` }}</span>
        <span>{{ `${user.appreciates}\n获赞与收藏` }}</span>
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
import Api from '@/api';
import { mapGetters, mapMutations } from 'vuex';

export default {
  data() {
    return {
      tabs: ['笔记', '收藏', '赞过'],
      activeIndex: 0,
    };
  },
  computed: {
    ...mapGetters('user', {
      user: 'GET_USER_INFO',
    })
  },
  methods: {
    ...mapMutations('user', {
      setAvatar: 'UPDATE_USER_AVATAR',
    }),
    tabClick(index) {
      this.activeIndex = index;
    },
    uploadAvatar(e) {
      const fileData = e.target.files[0];
      const params = new FormData();
      params.append('file', fileData);
      params.append('phoneNum', this.user.phoneNum);
      
      Api.user.uploadAvatar(params).then(res => {
        console.log(res);
        this.setAvatar(res.avatar);
      });
    },
    selectPhoto() {
      this.$refs.upload.click();
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
      padding-top: 5vh;
      padding-left: 3vh;
      margin-bottom: 20px;
      .avatar {
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
    .followers-info {
      display: flex;
      text-align: center;
      margin-left: 3vh;
      span {
        white-space: pre-line;
        & + span {
          margin-left: 5vw;
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
