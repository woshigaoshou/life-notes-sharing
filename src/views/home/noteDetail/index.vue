<template>
  <div class="note-detail">
    <div class="top">
      <a-page-header
        title=" "
        @back="$router.push({ name: 'home' })"
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
    </div>
    <swiper class="swiper" :banners="banners"></swiper>
    <div class="content">
      {{ noteDetail.note_detail.note_content }}
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
          appreciates_num: 0,
          collect_num: 0,
          title: '',
        }
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
          this.banners = res.data.note_detail.note_image;         
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
  },
  async created() {
    await this.fetchFocusList();
    this.fetchNoteDetail();
  },
}
</script>

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
}
</style>
