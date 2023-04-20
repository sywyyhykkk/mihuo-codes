<template>
  <div>
    <div class="progress-bar">
      <div class="progress-back" :style="`width:${props.percentage*100}%`"></div>
    </div>
    <div class="buttom-bar">
      <div class="finish-project"><span
        style="color: #2DA44E;margin-right: 0.5rem">{{ props.finishProject }}</span>/&nbsp;{{ props.allProject }}项
      </div>
      <div class="finish-project" :style="`color:#${props.percentage?'2DA44E':'909399'}`">
        {{ $getNum.numMulti(Number(props.percentage), 100) }}%
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps } from 'vue'

const props = defineProps({
  percentage: { //百分比
    type: Number || String,
    default: 0
  },
  allProject: {//总项
    type: Number || String,
    default: 0
  },
  finishProject: {//完成项
    type: Number || String,
    default: 0
  }
})
const emit = defineEmits()


</script>

<style scoped lang="less">
.buttom-bar {
  margin-top: 1.2rem;
  display: flex;
  justify-content: space-between;

  .finish-project {
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #262626;
  }
}

.progress-bar {
  height: 0.4rem;
  width: 100%;
  background: #E4E7ED;
  border-radius: 2px;

  .progress-back {
    height: 0.4rem;
    background: #2DA44E;
    border-radius: 0.2rem;
  }
}
</style>
