<template>
  <div class="note-detail">
    <div class="top">
      <a-page-header
        title=" "
        @back="$router.back(-1)"
      />
      <div class="avatar">
        <img :src="noteDetail.author_id.avatar" alt="">
      </div>
      <i>{{ noteDetail.author_id.name }}</i>
      <div class="btn" v-if="user._id !== noteDetail.author_id._id  ">
        <a-button v-if="!isFocus" type="danger" ghost @click="changeFocusStatus">
          {{ '关注' }}
        </a-button>
        <a-button v-else @click="changeFocusStatus">已关注</a-button>
      </div>
      <a-popover v-else class="btn" title="操作" trigger="click" placement="bottomRight">
        <template slot="content">
          <p @click="deleteNote(noteDetail)">删除</p>
        </template>
        <a-icon type="ellipsis" />
      </a-popover>
    </div>
    <swiper class="swiper" :banners="banners"></swiper>
    <div class="content">
      {{ noteDetail.note_detail.note_content }}
    </div>
    <div class="comment">
      <a-input placeholder="说点什么..." />
      <a-button type="primary">发送</a-button>
      <div class="icon">
        <a-icon
          v-if="noteDetail.appreciates.some(item => item.user_id === user._id)"
          type="heart"
          theme="twoTone"
          two-tone-color="#eb2f96"
          @click.stop="thumbUp('cancel', noteDetail)"
        />
        <a-icon v-else type="heart" @click.stop="thumbUp('add', noteDetail)" />
        <span>{{ noteDetail.appreciates.length }}</span>
        <a-icon
          v-if="noteDetail.collect.some(item => item.user_id === user._id)"
          type="star"
          theme="twoTone"
          two-tone-color="#eb2f96"
          @click.stop="handleCollect('cancel', noteDetail)"
        />
        <a-icon v-else type="star" @click.stop="handleCollect('add', noteDetail)" />
        <span>{{ noteDetail.collect.length }}</span>
      </div>
    </div>
  </div>
</template>

<script >
import Api from '@/api';
import swiper from '@/components/swiper';
import { mapGetters } from 'vuex';

export default {
  name: "",
  components: {
    swiper,
  },
  data() {
    return {
      noteDetail: {
        author_id: {
          name: '',
          avatar: '',
          _id: 0,
        },
        note_detail: {
          note_content: '',
          title: '',
        },
        appreciates: [],
        collect: [],
      },
      banners: [],
      focusList: [],
    }
  },
  computed: {
    ...mapGetters('user', {
      user: 'GET_USER_INFO',
    }),
    isFocus() {
      return this.focusList.some(item => item._id === this.noteDetail.author_id._id && item.bothWay);
    },
  },
  methods: {
    fetchNoteDetail() {
      Api.note.getNoteDetail(this.$route.params.id)
        .then(res => {
          this.noteDetail = res.data;
          this.banners = res.data.note_detail.note_image.reverse();        
        })
    },
    fetchFocusList() {
      Api.user.getFocusList(this.user._id)
        .then(res => {
          if (res.status === 200) {
            this.focusList = res.data.list;
          } else {
            this.$notification.error({
              message: '获取列表错误，请稍后重试',
              duration: 2,
            })
          }
        });
    },
    changeFocusStatus(data) {
      const params = {
        handler_id: this.user._id,
        isFocus: !this.isFocus,
        focus_id: this.noteDetail.author_id._id,
        date: this.$moment().format('YYYY-MM-DD'),
      }
      Api.user.changeFocusStatus(params)
        .then(res => {
          if (res.status === 200) {
            this.$notification.success({
              message: res.data.bothWay ? '关注成功' : '取消关注成功',
              duration: 2,
            })
            this.fetchFocusList();
          } else {
            this.$notification.error({
              message: '操作失败，请稍后重试',
              duration: 2,
            })
          }
        })
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
    handleCollect(type, data) {
      const date = this.$moment().format('YYYY-MM-DD HH:mm');
      const params = {
        type,
        note_id: data._id,
        user_id: this.user._id,
        date,
      };
      Api.note.collect(params)
        .then(res =>{
          if (res.status === 200) {
            if (type === 'add') {
              data.collect.push({
                user_id: this.user._id,
                date,
              });
            } else {
              data.collect = data.collect.filter(item => item.user_id !== this.user._id);
            }
          }
        })
    },
    deleteNote(data) {
      Api.note.delNote(data._id)
        .then(res => {
          if (res.status === 200) {
            this.$notification.success({
              message: '删除成功',
              duration: 2,
            })
          } else {
             this.$notification.error({
              message: '删除失败，请稍后重试',
              duration: 2,
            })
          }
        })
    },
  },
  async created() {
    await this.fetchFocusList();
    this.fetchNoteDetail();
  },
}
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
.note-detail {
  .top {
    display: flex;
    align-items: center;
    padding: 0 45px;
    height: 7vh;
    .avatar {
      width: 4vh;
      height: 4vh;
      border-radius: 50% 50%;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    i {
      margin-left: 8px;
    }
    .btn {
      position: absolute;
      right: 20px;
    }
  }
  .swiper {
    height: 60vh;
    overflow: hidden;
  }
  .content {
    margin-top: 2vh;
    padding: 0 2vw;
  }
  .comment {
    width: 100%;
    position: absolute;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .ant-btn {
      margin-left: 12px;
      margin-right: 12px;
    }
    .icon {
      display: flex;
      align-items: center;
      height: 32px;
      .anticon {
        display: flex;
        align-items: center;
        padding: 0 6px;
        line-height: 32px;
        font-size: 16px;
        vertical-align: middle;
      }
      & > span {
        width: 32px;
        height: 32px;
        line-height: 32px;
        margin-top: -2px;
      }
    }
  }
}
</style>
