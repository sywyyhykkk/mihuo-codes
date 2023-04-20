<template>
  <div class="linear-progress">
    <div class="progress-data" :style="`background:${pageType==1?props.background:'#F3F4F8'}`">
      <div :style="`--progress-width:${data*100}%;width:${data*100}%;background:${props.color};`"
           class="progress-data-value"></div>
    </div>
    <div class="progress-value">
      {{ props.data * 100 }}%
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, inject } from 'vue'

const props = defineProps({
  color: {
    type: String,//left,right
    default: 'linear-gradient(-90deg, #67C23A, #52C5FF)'
  },
  background: {
    type: String,
    default: '#051C48'
  },
  data: {
    type: Number,
    default: 0
  }
})
const emit = defineEmits()
const pageType = inject('pageType')

</script>

<style scoped lang="less">
@import "tower";

.linear-progress {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .progress-data {
    width: calc(100% - 3rem);
    height: 8px;
    border-radius: 4px;

    .progress-data-value {
      --progress-width: 0%;
      --progress-time: 2s;
      height: 8px;
      border-radius: 4px;
      .keyframesFunction(my-progress-content, {
        0% {
          width: 0%;
        }
        100% {
          width: var(--progress-width);
        }
      });
      -webkit-animation: my-progress-content 1s linear 1;
      animation: my-progress-content 1s linear 1;
    }
  }

  .progress-value {
    width: 3rem;
    font-size: 13px;
    color: #FFFFFF;
    text-align: right;
    margin-left: 1rem;
  }

}


</style>
