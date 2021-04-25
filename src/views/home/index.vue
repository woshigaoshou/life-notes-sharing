<template>
  <div>
    home
  </div>
</template>

<script>
import Api from '@/api';

export default {
  data() {
    return {

    };
  },
  methods: {
    getNotesList() {
      const params = {
        page: 1,
      }
      Api.note.getNotesList(params)
        .then(res => {

        })
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

</style>
