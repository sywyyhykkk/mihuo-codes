<template>
  <div class="image-grid">
    <div
      v-for="item in 9"
      :key="item"
      class="grid-item"
      :style="{ width: gridStyle['width'] }"
    >
      <el-image
        class="image"
        :src="imgUrl"
        :style="[gridStyle]"
      />
      <div class="title-container" :style="{ justifyContent: gridType === 9 ? 'center': '' }">
        <span
          v-if="gridType === 9"
          class="title"
        >{{ `${gridSrc === 'brand' ? '品牌' : gridSrc === 'category' ? '分类' : ''}标题` }}</span>
        <span
          v-if="gridType === 4"
          class="title"
        >{{ `${gridSrc === 'brand' ? '品牌' : gridSrc === 'category' ? '分类' : ''}标题` }}</span>
        <span v-if="gridType === 4" class="des">描述描述描述描述</span>
      </div>
    </div>
    <div
      v-if="isShowEmptyBox"
      class="grid-item"
      :style="{ width: gridStyle['width']}"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, reactive, markRaw, computed, onMounted, watch } from 'vue'

const props = defineProps(['data'])
const list = reactive(props.data)
const imgUrl = require('@/assets/img/product.png')
const gridSize = markRaw({
  nine: {
    width: '55px',
    height: '55px'
  },
  four: {
    width: '101px',
    height: '68px',
    borderRadius: '4px'
  }
})
const gridType = ref(9)
const gridStyle = ref(gridSize['nine'])
const isShowEmptyBox = computed(() => {
  return gridType.value === 4
})
const gridSrc = ref('')

onMounted(() => {
  gridType.value = list.data.gridType === 'four' ? 4 : 9
  gridStyle.value = gridSize[list.data.gridType] || gridSize['nine']
  gridSrc.value = list.data.gridSrc
})

watch(list, () => {
  gridType.value = list.data.gridType === 'four' ? 4 : 9
  gridStyle.value = gridSize[list.data.gridType] || gridSize['nine']
  gridSrc.value = list.data.gridSrc
})

</script>

<style scoped lang="less">
.image-grid {
  width: 355px;
  height: max-content;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;

  .grid-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;

    .title-container {
      width: 100%;
      display: flex;
      margin-top: 10px;

      .title {
        height: 12px;
        line-height: 12px;
        font-size: 12px;
        font-weight: 500;
        color: #141414;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap
      }

      .des {
        width: 40%;
        height: 12px;
        margin-left: 10px;
        line-height: 12px;
        font-size: 9px;
        font-weight: 400;
        color: #141414;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

}
</style>
