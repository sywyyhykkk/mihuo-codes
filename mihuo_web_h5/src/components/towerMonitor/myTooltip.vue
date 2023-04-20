<template>
  <div class="my-tooltip" :style="`background:${props.dataColor.background}`">
    <div class="tooltip-content" :style="`color:${props.dataColor.color}`">{{ props.content }}</div>
    <div class="my-tooltip-arrow" :style="`border-left-color:${props.dataColor.arrowColor}`"></div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps } from 'vue'

const props = defineProps({
  color: {//文字颜色
    type: String,
    default: ''
  },
  background: {//背景颜色
    type: String,
    default: ''
  },
  arrowColor: {//箭头颜色
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  dataColor: {//颜色三合一
    type: Object,
    default: {}
  }
})
const emit = defineEmits()

</script>

<style scoped lang="less">
.my-tooltip {
  height: 30px;
  background: linear-gradient(90deg, rgba(255, 92, 96, 0.1), rgba(255, 92, 96, 0.6));
  border-radius: 2px;
  min-width: 84px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .tooltip-content {
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #F56C6C;
    margin-left: 8px;
  }

  .my-tooltip-arrow {
    width: 0px;
    height: 0px;
    border: 5px solid rgba(255, 92, 96, 0); /*以下四个样式对应四种三角形，任选其一即可实现*/
    border-bottom-color: rgba(255, 92, 96, 0);
    border-left-color: rgba(255, 92, 96, 0.6);
    margin-right: -10px;
  }
}

</style>
