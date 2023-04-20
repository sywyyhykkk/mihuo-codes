<template>
  <div class="empty">
    <el-empty :description="text"></el-empty>
  </div>
</template>

<script>
export default {
  name: 'ChatEmpty',
  props: {
    text: {
      type: String,
      default: '空空的',
    },
    size: {
      default: '5rem',
    },
  },
  computed: {},
}
</script>
<style scoped  lang='less'>
.empty {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
</style>
