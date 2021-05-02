<template>
  <div class="home">
    <a-input-search v-model="keyword" @search="handleSearch" placeholder="可搜索标题/内容" />
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
</template>

<script>
import Api from '@/api';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      notes: [],
      keyword: '',
    };
  },
  computed: {
    ...mapGetters('user', {
      user: 'GET_USER_INFO',
    }),
  },
  methods: {
    getNotesList() {
      const params = {
        page: 1,
      }
      Api.note.getNotesList(params)
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
        })
    },
    toNoteDetail(id) {
      this.$router.push({ name: 'noteDetail', params: { id } });
    },
    handleSearch() {
      const params = {
        page: 1,
        keyword: this.keyword,
      }
      Api.note.getNotesList(params)
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
                user_id:this.user._id,
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
    this.getNotesList();
  },
  activated() {
    this.$refs.scroll && this.$refs.scroll.scrollTo(0, 0, 0);
  },
  mounted() {

  },
};
</script>

<style lang='scss' scoped>
.home /deep/ {
  padding: 0 3vw;
  background-color: #eee;
  height: 89vh!important;
  // padding-bottom: 2vh;
  // overflow: hidden;
  .ant-input {
    height: 32px;
    margin: 16px 0;
  }
  .home-scroll {
    height: calc(87vh - 64px);
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
</style>
