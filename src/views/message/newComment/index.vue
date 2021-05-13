<template>
  <div class="new-comment">
    <a-page-header
      title="返回"
      @back="$router.push({ name: 'message' })"
    />
    <h3 class="page-title">收到的评论</h3>
    <div class="content">
      <div
        class="list-item"
        v-for="item in comment"
        :key="item._id"
        @click="$router.push({ name: 'noteDetail', params: { id: item.note_id } })"
      >
        <span class="avatar"><img :src="item.avatar" alt=""></span>
        <span class="text">
          <p>{{ item.user_name }}</p>
          <p>{{ `评论了你的笔记    ${item.date}` }}</p>
          <div class="comment_content">
            <span class="line"></span>
            <p>{{ `${item.comment_content}` }}</p> 
          </div>
        </span>
        <span class="cover"><img :src="item.cover" alt=""></span>
      </div>
    </div>
  </div>
</template>

<script >
import Api from '@/api';
import { mapGetters } from 'vuex';

export default {
  name: "",
  data() {
    return {
      comment: [],
    }
  },
  components: {

  },
  computed: {
    ...mapGetters('user', {
      user: 'GET_USER_INFO',
    }),
  },
  methods: {
    fetchComment() {
      Api.comment.getCommentHistory(this.user._id)
        .then(res => {
          this.comment = res.data.list.sort((a,b) => {
            if (this.$moment(a.date).isBefore(this.$moment(b.date))) {
              return -1;
            }
            return 1;
          })
        });
    },
  },
  created() {
    this.fetchComment();
  }
}
</script>

<style lang="scss" scoped>
.new-comment {
  .content {
    height: calc(100vh - 68px);
    border-top: 1px solid #ddd;
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
        display: inline-block;
        .comment_content {
          display: flex;
          margin-top: 4px;
          .line {
            display: inline-block;
            width: 2px;
            height: 24px;
            background-color: #999;
            margin-right: 5px;
          }
          p {
            margin: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        & > p {
          line-height: 3vh;
          margin: 0;
          &:nth-child(1) {
            margin-bottom: 4px;
          }
          &:nth-child(2) {
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
</style>
