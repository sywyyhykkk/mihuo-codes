<template>
  <div class="list-content">
    <el-image :src="imgUrl" class="img" />
    <div class="content">
      <div class="title" :style="{color: fontColor}">
        这是一个案例名称样式
      </div>
      <div style="display: flex">
        <div class="des">
          描述描述描述描述描述
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, reactive } from 'vue'

const props = defineProps(['data'])
const list = reactive(props.data)
const imgUrl = ref(require('@/assets/img/case.png'))
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

    .des {
      width: 100%;
      height: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      line-height: 20px;
      font-size: 1.6rem;
      font-weight: 500;
      color: #8C8C8C;
    }
  }
}

</style>
