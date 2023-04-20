<template>
  <div class="carousel-data">
    <div v-for="item in props.total">
      <div class="carousel-dto" :class="item==props.currentPage?'carousel-dto-active':''"
           @click="handelClick(item)"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number || String,
    default: 1
  }, total: {
    type: Number || String,
    default: 0
  }
})

const emit = defineEmits(['update:modelValue', 'getCurrent'])

const handelClick = (item: any) => {
  emit('getCurrent', item)
}
</script>

<style scoped lang="less">
@import "tower";

</style>
