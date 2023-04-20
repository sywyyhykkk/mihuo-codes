<template>
  <div class="edit-images">
    <div v-if="jsondata && jsondata.listdata.length > 0">
      <img
        class="images-item"
        v-for="(item, index) in jsondata.listdata"
        :key="index"
        :src="$getUrl.getPicUrl(item.url)"
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'edit-images',
  props: {
    jsondata: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style scoped lang="less">
.edit-images {
  margin-top: 37px;

  .images-item {
    width: 100%;
    border-radius: 12px;
  }
}


</style>
