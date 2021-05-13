<template>
  <div class="mine">
    <div class="header">
      <div class="top">
        <a-page-header
          title=" "
          @back="$router.back(-1)"
        />
        <a-icon type="message" @click="$router.push({ name: 'message', params: { id: $route.params.id } })" />
      </div>
      <div class="info">
        <div class="avatar">
          <img :src="detail.avatar || '../../assets/avatar.jpg'">
          <input type="file">
        </div>
        <div class="user-info">
          <p>{{ detail.name }}</p>
          <p>{{ `账号ID：${detail._id}` }}</p>
        </div>
      </div>
      <div class="description">
        <p>个人简介：</p>  
        <p>{{ detail.description }}</p>
      </div>
      <div class="followers-info">
        <span>{{ `${detail.focus.length}\n关注` }}</span>
        <span>{{ `${detail.fans.length}\n粉丝` }}</span>
        <span>{{ `${appreciates}\n获赞与收藏` }}</span>
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
      <div class="note-list">
        <scroll
          ref="scroll"
          class="home-scroll" 
        >
          <div>
            <waterfall :data="notes" :col="2" :gutterWidth="40">
              <div class="note-item" v-for="(item, index) in notes" :key="index" @click="toNoteDetail(item._id)">
                <img :src="item.image[0]" alt="">
                <p>
                  {{ item.title }}
                </p>
                <p>
                  {{ item.author.name }}
                  <span>
                    <a-icon
                      v-if="item.appreciates.some(item => item.user_id === user._id)"
                      type="heart"
                      theme="twoTone"
                      two-tone-color="#eb2f96"
                      @click.stop="thumbUp('cancel', item)"
                    />
                    <a-icon v-else type="heart" @click.stop="thumbUp('add', item)" />
                    <i>{{ item.appreciates.length }}</i>
                  </span>
                </p>
              </div>
            </waterfall>
          </div>
        </scroll>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '@/api';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      tabs: ['笔记', '收藏', '赞过'],
      activeIndex: 0,
      isEditDesc: false,
      notes: [],
      note_content: '',
      appreciates: 0,
      showDrawer: false,
      showPopover: false,
      files: [],
      preview: [],
      note_title: '',
      detail: {
        focus: [],
        fans: [],
      },
    };
  },
  computed: {
    ...mapGetters('user', {
      user: 'GET_USER_INFO',
    })
  },
  methods: {
    getUserDetail() {
      Api.user.getUserDetail(this.$route.params.id)
        .then(res => {
          this.detail = res.data;
        })
    },
    tabClick(index) {
      this.activeIndex = index;
      this.$refs.scroll && this.$refs.scroll.scrollTo(0, 0, 0);
      Api.note.getClassifyList(index + 1, this.$route.params.id)
        .then(res => {
          this.notes = res.data.map(item => ({
            image: item.note_detail.note_image,
            title: item.note_detail.title,
            _id: item._id,
            author: {
              name: item.author_id.name,
            },
            appreciates: item.appreciates,
          }));
          if (index === 0) {
            this.appreciates = this.notes.reduce((prev, current) => {
              return prev + current.appreciates.length;
            }, 0);
          }
        })
      
    },
    toNoteDetail(id) {
      this.$router.push({ name: 'noteDetail', params: { id } });
    },
    thumbUp(type, data) {
      const date = this.$moment().format('YYYY-MM-DD HH:mm');
      const params = {
        type,
        note_id: data._id,
        user_id: this.user._id,
        date,
      };
      Api.note.thumbUp(params)
        .then(res =>{
          if (res.status === 200) {
            if (type === 'add') {
              data.appreciates.push({
                user_id: this.user._id,
                date,
              });
            } else {
              data.appreciates = data.appreciates.filter(item => item.user_id !== this.user._id);
            }
          }
        })
    },
  },
  created() {
    this.tabClick(0);
    this.getUserDetail();
  },
  deactivated() {
    this.activeIndex = 0;
  },
  mounted() {

  },
};
</script>

<style lang="scss">
.ant-page-header {

}
</style>

<style lang="scss" scoped>
@import "@/css/theme.scss";

.mine {
  height: 91vh;
  background-color: rgba(128, 89, 89, 0.61);
  .header {
    height: 34vh;
    padding: 6vh 3vh 2vh;
    .anticon-message {
      position: absolute;
      top: 20px;
      right: 7vw;
      font-size: 5vw;
    }
    .info {
      display: flex;
      // padding-top: 4vh;
      // padding-left: 3vh;
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
    .description {
      display: flex;
      align-items: center;
      height: 32px;
      margin-bottom: 16px;
      & > p:nth-child(1) {
        width: 70px;
      }
      p {
        margin: 0;
      }
      .ant-input, & > p + p {
        flex: 1;
      }
    }
    .followers-info {
      display: flex;
      text-align: center;
      // margin-left: 3vh;
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
    height: 66vh;
    display: flex;
    flex-direction: column;
    position: absolute;
    bottom: 0;
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
    .note-list {
      height: calc(100% - 2vh - 32px);
      padding: 0 12px;
      .home-scroll {
        height: 100%;
        overflow: hidden;
      }
      .vue-waterfall {
        // display: flex;
        // justify-content: space-between;
        &-column {
          // width: 43vw!important;
          .note-item {
            padding-bottom: 8px;
            background-color: #fff;
            border-radius: 3px;
            overflow: hidden;
            img {
              width: 100%;
              margin-bottom: 8px;
            }
            p {
              position: relative;
              padding: 0 20px;
              line-height: 24px;
              margin: 0;
              &:nth-last-child(1) {
                height: 24px;
                display: flex;
                align-items: center;
                padding-right: 60px;
                span {
                  display: inline-block;
                  position: absolute;
                  // top: 5px;
                  right: 32px;
                  vertical-align: top;
                  .anticon {
                    margin-right: 4px;
                    font-size: 16px;
                  }
                }
              }
            }
            & + .note-item {
              margin-top: 2vh;
            }
          }
          &:nth-child(2) {
            .note-item {
              margin-right: 1vw;
            }
          }
          &:nth-child(3) {
            .note-item {
              margin-left: 1vw;
            }
          }
        }
      }
    }
  }
}
</style>
