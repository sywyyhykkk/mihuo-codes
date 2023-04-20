<template>
  <div class="grid-data">
    <div class="grid-item" v-for="item in data.data.textContent"
         :style="`width:calc((100%/${Number(data.data.gridNum)}) - 2rem)`">
      <img :src="$getUrl.getPicUrl(item.imageUrl)" :class="`grid-num_${data.data.gridNum}`" />
      <div class="grid-title_3" v-if="data.data.titleShow=='1'">{{ item.title.toString() }}</div>
      <div class="grid-subtitle_3" v-if="data.data.subtitleShow=='1'">{{ item.subtitle.toString() }}</div>
    </div>
    <div v-if="!data.data.textContent||data.data.textContent.length==0"
         style="color: #909399;line-height: 30px;width: 100%;text-align: center">
      请编辑内容
    </div>
  </div>
</template>

<script lang="ts" setup>

import { defineProps, onMounted, watchEffect, ref } from 'vue'

const props = defineProps(['data'])
const data = ref<any>(props.data)

watchEffect(() => {
  // console.log('网格图文', props.data)
  data.value = props.data
})

</script>

<style scoped lang="less">
.grid-data {
  display: flex;
  flex-wrap: wrap !important;

}

.grid-item {
  padding: 10px 0;
  //height: 200px;
  margin: 8px;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;

  .grid-num_3 {
    width: 55px;
    height: 55px;
    border-radius: 4px;
  }

  .grid-num_2 {
    width: calc(100% - 20px);
    height: 120px;
    border-radius: 8px;
  }

  .grid-num_1 {
    width: calc(100% - 20px);
    height: 160px;
    border-radius: 4px;
  }

  .grid-title_3 {
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 800;
    color: #141414;
    margin-top: 10px;
    width: 100%;
    text-align: center;
    height: 20px;
    line-height: 20px;
    white-space: nowrap;
    /*文本溢出显示省略号*/
    text-overflow: ellipsis;
    /*溢出的部分隐藏*/
    overflow: hidden;
  }

  .grid-subtitle_3 {
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #141414;
    margin-top: 10px;
    width: 100%;
    text-align: center;
    height: 20px;
    line-height: 20px;
    white-space: nowrap;
    /*文本溢出显示省略号*/
    text-overflow: ellipsis;
    /*溢出的部分隐藏*/
    overflow: hidden;
  }
}

</style>
