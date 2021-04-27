<template>
  <div class="home">
    <scroll
      class="home-scroll" 
    >
      <waterfall :data="notes" :col="2" :gutterWidth="40">
        <div class="note-item" v-for="item in notes" :key="item._id" @click="toNoteDetail(item._id)">
          <img :src="item.note_detail.note_image[0]" alt="">
          <p>{{ item.note_detail.title }}</p>
        </div>
      </waterfall>
    </scroll>
  </div>
</template>

<script>
import Api from '@/api';

export default {
  data() {
    return {
      notes: [],
    };
  },
  methods: {
    getNotesList() {
      const params = {
        page: 1,
      }
      Api.note.getNotesList(params)
        .then(res => {
          this.notes = res.data;
        })
    },
    toNoteDetail(id) {
      this.$router.push({ name: 'noteDetail', params: { id } });
    },
  },
  created() {
    this.getNotesList();
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
  padding-bottom: 2vh;
  // overflow: hidden;
  .home-scroll {
    height: 87vh;
    overflow: hidden;
  }
  .vue-waterfall {
    // display: flex;
    // justify-content: space-between;
    &-column {
      // width: 43vw!important;
      .note-item {
        background-color: #fff;
        border-radius: 3px;
        overflow: hidden;
        img {
          width: 100%;
        }
        p {
          padding: 0 20px;
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
