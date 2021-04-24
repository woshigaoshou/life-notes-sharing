<template>
  <div class="new-focus">
    <a-page-header
      title="返回"
      @back="$router.push({ name: 'message' })"
    />
    <h3 class="page-title">新增关注</h3>
    <div class="content">
      <div
        class="list-item"
        v-for="item in focusList"
        :key="item._id"
      >
        <span class="avatar"><img :src="item.avatar" alt=""></span>
        <span class="text">
          <p>{{ item.name }}</p>
          <p>{{ `开始关注你了   ${item.date}` }}</p>
        </span>
        <a-button v-if="!item.bothWay" type="danger" ghost @click="changeFocusStatus(item)">回粉</a-button>
        <a-button v-else @click="changeFocusStatus(item)">已关注</a-button>
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
      focusList: [],
    };
  },
  computed: {
    ...mapGetters('user', {
      user: 'GET_USER_INFO',
    }),
  },
  methods: {
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
        isFocus: !data.bothWay,
        focus_id: data._id,
        date: this.$moment().format('YYYY-MM-DD'),
      }
      Api.user.changeFocusStatus(params)
        .then(res => {
          if (res.status === 200) {
            this.$notification.success({
              message: res.data.bothWay ? '取消关注成功' : '关注成功',
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
  },
  created() {
    this.fetchFocusList();
  },
  mounted() {

  },
}

</script>
<style lang="scss" scoped>
.new-focus {
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
      & > button {
        position: absolute;
        right: 2vh;
      }
    }
  }
}
</style>
