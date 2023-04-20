<template>
  <div class="edit-sorted">
    <div>
      <!--      <div class="point">-->
      <!--        POINT-->
      <!--      </div>-->
      <div class="edit-sorted-title">
        <span>{{ jsondata.data.sortIndex ? jsondata.data.sortIndex : '' }}</span>
        {{ jsondata.content }}
      </div>
      <!--      <div class="edit-sorted-bottom"></div>-->
    </div>
  </div>
</template>

<script>
export default {
  name: 'edit-sorted',
  props: {
    jsondata: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style scoped lang="less">
.edit-sorted {
  display: flex;

  .point {
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #141414;
  }

  .edit-sorted-title {
    margin-top: 10px;
    font-size: 26px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #808080;
    line-height: 43px;
  }


}

</style>
