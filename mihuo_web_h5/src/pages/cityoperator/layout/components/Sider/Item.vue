<template>
  <slot name="title">
    <span class="anticon-item">{{ title }}</span>
  </slot>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'Item',
  props: {
    icon: {
      type: String as PropType<string>,
      default: ''
    },
    title: {
      type: String as PropType<string>,
      default: ''
    },
    titleName: {
      type: String as PropType<string>,
      default: ''
    },
    isHasChidlren: {
      type: Boolean as PropType<boolean>,
      default: true
    }
  }
})
</script>

<style lang="less" scoped>
.anticon-item {
  transition: opacity 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.menu-icon {
  height: 2.2rem;
  width: 2.2rem;
  margin: 0 1.6rem 0 0;
  &.guide {
    transform: scale(2.5);
    margin-top: -0.5rem;
  }
}
</style>
