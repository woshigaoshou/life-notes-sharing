<template>
  <div class="mine">
    <div class="header">
      <a-popover class="btn" title="操作" trigger="click" placement="bottomRight">
        <template slot="content">
          <p @click="createNote">新建笔记</p>
          <input type="file" v-show="false" ref="createNote">
        </template>
        <a-icon type="ellipsis" />
      </a-popover>
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
      <div class="description">
        <p>个人简介：</p>  
        <p v-if="!isEditDesc" @click="isEditDesc = true">{{ description }}</p>
        <a-input v-else @blur="editDesc" v-model="description" />
      </div>
      <div class="followers-info">
        <span>{{ `${user.focus.length}\n关注` }}</span>
        <span>{{ `${user.fans.length}\n粉丝` }}</span>
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
import { mapGetters, mapMutations } from 'vuex';

export default {
  data() {
    return {
      tabs: ['笔记', '收藏', '赞过'],
      activeIndex: 0,
      description: '',
      isEditDesc: false,
      notes: [],
      appreciates: 0,
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
      setDesc: 'UPDATE_USER_DESC',
    }),
    tabClick(index) {
      this.activeIndex = index;
      this.$refs.scroll && this.$refs.scroll.scrollTo(0, 0, 0);
      Api.note.getClassifyList(index + 1, this.user._id)
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
    uploadAvatar(e) {
      const fileData = e.target.files[0];
      const params = new FormData();
      params.append('file', fileData);
      params.append('phoneNum', this.user.phoneNum);
      
      Api.user.uploadAvatar(params).then(res => {
        this.setAvatar(res.avatar);
      });
    },
    selectPhoto() {
      this.$refs.upload.click();
    },
    editDesc() {
      this.isEditDesc = false;
      const params = {
        user_id: this.user._id,
        desc: this.description,
      }
      Api.user.editDesc(params)
        .then(res => {
          if (res.status === 200) {
            this.$notification.success({
              message: '修改简介成功',
              duration: 2,
            })
            this.setDesc(this.description);
            window.localStorage.setItem('userInfo', this.user);          

          } else {
            this.$notification.success({
              message: '修改简介失败，请稍后重试',
              duration: 2,
            })
            this.description = this.user.description;
          }
        });
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
    createNote() {
      this.$refs.createNote.click();
    },
  },
  created() {
    this.description = this.user.description;
    this.tabClick(0);
  },
  deactivated() {
    this.activeIndex = 0;
  },
  mounted() {

  },
};
</script>

<style lang="scss">
.ant-popover {
  p {
    margin: 0!important;
    &:hover {
      background-color: #cfe8fc!important;
    }
  }
}
</style>

<style lang="scss" scoped>
@import "@/css/theme.scss";

.mine {
  height: 91vh;
  background-color: rgba(128, 89, 89, 0.61);
  .header {
    height: 34vh;
    padding: 4vh 3vh;
    .anticon-ellipsis {
      position: absolute;
      top: 2vh;
      right: 7vw;
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
    height: 60vh;
    display: flex;
    flex-direction: column;
    position: absolute;
    bottom: 9vh;
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
