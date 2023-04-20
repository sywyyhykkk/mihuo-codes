<template>
  <div class="edit-word">
    {{ jsondata.content }}
  </div>
</template>

<script>
export default {
  name: 'edit-word',
  props: {
    jsondata: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style scoped lang="less">
.edit-word {
  margin-top: 20px;
  font-size: 26px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #141414;
  line-height: 36px;
}
</style>
