<template>
  <div class="list-content">
    <el-image :src="imgUrl" class="img" />
    <div class="content">
      <div class="title" :style="{color: fontColor}">
        这是一个商品名称样式
      </div>
      <div style="display: flex;">
        <div class="price-title">
          ¥1000
        </div>
        <div class="delete-line">
          ¥1200
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['data'])
const list = reactive(props.data)
const imgUrl = require('@/assets/img/product.png')
const fontColor = ref('#141414')

onMounted(() => {
  fontColor.value = list.style.color?.color
})

watch(list, () => {
  fontColor.value = list.style.color?.color
})
</script>

<style scoped lang="less">
.list-content {
  width: 100%;
  height: 105px;
  display: flex;
  align-items: center;

  .img {
    width: 116px;
    height: 85px;
    border-radius: 8px;
  }

  .content {
    width: 60%;
    height: 85px;
    margin-left: 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .title {
      width: max-content;
      height: 22px;
      line-height: 22px;
      font-size: 1.8rem;
      font-weight: 500;
      color: #141414;
      margin-bottom: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .price-title {
      width: max-content;
      height: 20px;
      line-height: 20px;
      font-size: 1.6rem;
      font-weight: 800;
      color: #141414;
    }

    .delete-line {
      width: max-content;
      height: 20px;
      line-height: 20px;
      font-size: 1.6rem;
      font-weight: 500;
      color: #8C8C8C;
      text-decoration: line-through;
      margin-left: 5px;
    }
  }
}

</style>
