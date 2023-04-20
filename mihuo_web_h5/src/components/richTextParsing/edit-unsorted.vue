<template>
  <li>
    <span class="edit-unsorted">
      {{ jsondata.content }}
    </span>
  </li>
</template>

<script>
export default {
  name: 'edit-unsorted',
  props: {
    jsondata: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style scoped lang="less">
li {
  content: ".";
  color: #FE6E32;
  margin-top: 10px;
  margin-left: 54px;
  font-size: 26px;
}

.edit-unsorted {
  font-size: 26px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #808080 !important;
  line-height: 46px;
}
</style>
