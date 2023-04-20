<template>
  <div class="list-content">
    <el-image class="img" v-if="imgUrl" :src="imgUrl" />
    <div v-if="!imgUrl" class="img-none">
      <el-icon size="2.5rem" color="#afafaf">
        <Plus />
      </el-icon>
    </div>
    <div class="content">
      <div
        v-for="(item, index) in textList"
        :key="index"
        :class="item.type"
        :style="{color: fontColor}"
      >
        {{ item.text }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { imageGlobal } from '@/global'

const props = defineProps(['data'])
const list = reactive(props.data)
const textList = ref([] as any)
const fontColor = ref('#141414')

onMounted(() => {
  if (list.data.textContent) {
    textList.value = list.data.textContent
  }
  if (list.style.color) {
    fontColor.value = list.style.color.color
  }
})

const imgUrl = computed(() => {
  if (list.data.imgUrl) {
    return imageGlobal + list.data.imgUrl
  } else {
    return ''
  }
})

watch(list, (newVal) => {
  textList.value = []
  newVal.data.textContent.forEach((item: { type: any; text: any }) => {
    textList.value.push({
      type: item.type,
      text: item.text
    })
  })
  fontColor.value = newVal.style.color.color
})

</script>

<style scoped lang="less">
.list-content {
  width: 100%;
  height: 105px;
  display: flex;
  align-items: center;

  .img-none {
    width: 116px;
    height: 85px;
    border-radius: 8px;
    border: 1px dashed #afafaf;
    display: flex;
    align-items: center;
    justify-content: center;
  }

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
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;

    .title {
      width: 100%;
      height: 22px;
      line-height: 22px;
      font-size: 2.2rem;
      font-weight: 500;
      color: #141414;
      margin-bottom: 10px;
    }

    .price-title {
      width: max-content;
      height: 20px;
      line-height: 20px;
      font-size: 1.6rem;
      font-weight: 800;
      color: #141414;
    }

    .des {
      width: max-content;
      height: max-content;
      max-lines: 2;
      line-height: 20px;
      font-size: 1.6rem;
      font-weight: 500;
      color: #8C8C8C;
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
