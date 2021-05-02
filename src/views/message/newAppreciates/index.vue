<template>
  <div class="new-appreciates">
    <a-page-header
      title="返回"
      @back="$router.push({ name: 'message' })"
    />
    <h3 class="page-title">收到的赞和收藏</h3>
    <div class="content">
      <div
        class="list-item"
        v-for="item in list"
        :key="item._id"
        @click="$router.push({ name: 'noteDetail', params: { id: item.note_id } })"
      >
        <span class="avatar"><img :src="item.avatar" alt=""></span>
        <span class="text">
          <p>{{ item.name }}</p>
          <p>{{ `${item.type === 'collect' ? '收藏了你的笔记' : '赞了你的笔记  '}   ${item.date}` }}</p>
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
      list: [],
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
    getList() {
      Api.note.getAppreciatesList(this.user._id)
        .then(res => {
          this.list = res.data.sort((a, b) => {
            const result = this.$moment(a.date).isBefore(this.$moment(b.date));
            return result ? 1 : -1;
          });
        })
    }
  },
  created() {
    this.getList();
  }
}
</script>

<style lang="scss" scoped>
.new-appreciates {
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
        p {
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
