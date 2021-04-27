<template>
  <div class="noteDetail">
    {{ $route.params.id }}
  </div>
</template>

<script >
import Api from '@/api';

export default {
  name: "",
  data() {
    return {

    }
  },
  components: {

  },
  methods: {
    fetchNoteDetail() {
      Api.note.getNoteDetail(this.$route.params.id)
        .then(res => {

        })
    }
  },
  created() {
    this.fetchNoteDetail();
  },
}
</script>

<style lang="scss" scoped>

</style>
