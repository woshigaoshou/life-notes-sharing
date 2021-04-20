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

  },
  created() {
    Api.login.login({a: 'a'})
      .then(res => console.log(res));
  },
  mounted() {

  },
};
</script>

<style lang='scss' scoped>

</style>
