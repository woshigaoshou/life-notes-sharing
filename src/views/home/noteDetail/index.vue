<template>
  <div class="note-detail">
    <div class="top">
      <a-page-header
        title=" "
        @back="$router.back(-1)"
      />
      <div
        class="avatar"
        @click="$router.push({ name: 'userDetail', params:{ id: noteDetail.author_id._id } })"
      >
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
    <scroll class="detail-scroll" :key="scrollKey">
      <swiper class="swiper" :banners="banners"></swiper>
      <div class="content">
        {{ noteDetail.note_detail.note_content }}
      </div>
      <div class="comment">
        <div style="margin: 10px;">{{ `共${comment.length}条评论` }}</div>
        <div
          class="list-item"
          v-for="item in comment"
          :key="item._id"
        >
          <span class="avatar"><img :src="item.avatar" alt=""></span>
          <span class="text">
            <p>
              {{ item.user_name }}
              <span style="float: right;">
                <a-icon
                  v-if="item.comment_appreciates.some(item => item === user._id)"
                  type="heart"
                  theme="twoTone"
                  two-tone-color="#eb2f96"
                  @click="thumbUpComment('remove', item)"
                />
                <a-icon
                  v-else
                  type="heart"
                  @click="thumbUpComment('add', item)"
                />
                {{ item.comment_appreciates.length }}
              </span>
            </p>
            <p>
              {{ `${item.comment_content}\n${item.date}` }}
              <a-icon
                class="delete"
                v-if="item.user_id === user._id"
                type="delete"
                @click="delComment(item)"
              />
            </p>
          </span>
        </div>
      </div>
    </scroll>
    <div class="handle">
      <a-input placeholder="说点什么..." v-model="commentText" />
      <a-button type="primary" @click="emitComment">发送</a-button>
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
import { mapGetters, mapMutations } from 'vuex';

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
      list: [],
      comment: [],
      commentText: '',
      scrollKey: Math.random(),
    }
  },
  watch: {
    comment: {
      handler() {
        this.scrollKey = Math.random();        
      },
      deep: true,
    },
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
    ...mapMutations('user', {
      updateFocus: 'UPDATE_USER_FOCUS',
    }),
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
    fetchComment() {
      Api.comment.getCommentList(this.$route.params.id)
        .then(res => {
          this.comment = res.data.list.sort((a,b) => {
            if (a.comment_appreciates.length < b.comment_appreciates.length
              || 
              (a.comment_appreciates.length === b.comment_appreciates && this.$moment(a.date).isBefore(this.$moment(b.date)))
              ) {
              return 1;
            }
            return -1;
          })
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
            let newVal = [];
            if (res.data.bothWay) {
              this.updateFocus([...this.user.focus, this.noteDetail.author_id._id]);
            } else {
              this.updateFocus(this.user.focus.filter(item => item !== this.noteDetail.author_id._id));
            }
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
    thumbUpComment(type, data) {
      const params = {
        comment_id: data._id,
        user_id: this.user._id,
        type,
      };
      Api.comment.thumbUpComment(params)
        .then(res => {
          if (res.status === 200) {
            if (type === 'add') {
              data.comment_appreciates.push(this.user._id);
            } else {
              data.comment_appreciates = data.comment_appreciates.filter(item => item !== this.user._id);
            }
          }
        })
    },
    delComment(data) {
      Api.comment.delComment(data._id)
        .then(res => {
          if (res.status === 200) {
            this.$notification.success({
              message: '删除评论成功',
              duration: 2,
            })
          } else {
            this.$notification.success({
              message: '删除评论失败',
              duration: 2,
            })
          }
        })
        .finally(() => {
          this.fetchComment();
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
    getList() {
      Api.note.getAppreciatesList(this.user._id)
        .then(res => {
          this.list = res.data.sort((a, b) => {
            const result = this.$moment(a.date).isBefore(this.$moment(b.date));
            return result ? 1 : -1;
          });
        })
    },
    emitComment() {
      if (this.commentText === '') {
        this.$notification.error({
          message: '发送信息不能为空',
          duration: 2,
        });
      } else {
        const params = {
          note_id: this.noteDetail._id,
          user_id: this.user._id,
          comment_content: this.commentText,
          date: this.$moment().format('YYYY-MM-DD HH:mm'),
        }
        Api.comment.emitComment(params)
          .then(res => {
            console.log(res);
            this.$notification.success({
              message: '发送成功',
              duration: 2,
            });
            this.commentText = '';
            this.fetchComment();
          })
      }
    },
  },
  async created() {
    await this.fetchFocusList();
    this.fetchNoteDetail();
    this.fetchComment();
    // this.getList();
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
  padding-top: 7vh;
  padding-bottom: 32px;
  .top {
    background-color: #fff;
    z-index: 9;
    width: 100%;
    position: fixed;
    top: 0;
    display: flex;
    align-items: center;
    padding: 0 45px;
    height: 7vh;
    .avatar {
      z-index: 10000;
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
  .detail-scroll {
    height: calc(93vh - 34px);
    overflow: hidden;
    .swiper {
      height: 60vh;
      overflow: hidden;
    }
    .content {
      min-height: 40vh;
      margin-top: 2vh;
      padding: 0 2vw;
    }
    .comment {
      border-top: 1px solid #ddd;
      padding-bottom: 32px;
      .list-item {
        position: relative;
        display: flex;
        align-items: center;
        height: 8vh;
        padding: 2vh;
        border-bottom: 1px solid #eee;
        box-sizing: content-box;
        .avatar {
          display: inline-block;
          width: 6vh;
          height: 6vh;
          margin: 0 3vw;
          border-radius: 50% 50%;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .text {
          position: relative;
          flex: 1;
          display: inline-block;
          .delete {
            position: absolute;
            bottom: 5px;
            right: 16px;
          }
          p {
            display: flex;
            align-items: center;
            line-height: 3vh;
            margin: 0;
            white-space: pre-wrap;
            &:nth-child(1) {
              justify-content: space-between;
              margin-bottom: 4px;
            }
            i {
              color: #999;
            }
          }
        }
        .cover {
          position: absolute;
          right: 2vw;
          display: inline-block;
          width: 6vh;
          height: 6vh;
          margin: 0 3vw;
          border-radius: 10px;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }


  .handle {
    // height: 34px;
    width: 100%;
    padding-left: 2vw;
    padding: 4vw 0 5vw 2vw;
    position: fixed;
    bottom: 0px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
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
