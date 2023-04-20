<template>
  <div>
    <img class="not-include" :src="require('@/assets/img/product/not_include.png')" />
  </div>
</template>

<script>
export default {
  name: 'edit-notInclude',
  props: {
    jsondata: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style scoped lang="less">
.not-include {
  width: 93px;
  height: 37px;
  margin-top: 71px;
}
</style>
