<template>
  <img
    v-if="icon && !isHasChidlren"
    class="menu-icon"
    :class="{ guide: titleName == '塔台' }"
    :src="icon"
  />
  <el-icon v-else-if="icon && isHasChidlren"><component :is="icon" /></el-icon>
  <div v-else-if="!isHasChidlren" class="menu-icon-empty"></div>
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
      default: '',
    },
    title: {
      type: String as PropType<string>,
      default: '',
    },
    titleName: {
      type: String as PropType<string>,
      default: '',
    },
    isHasChidlren: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
  },
})
</script>

<style lang="less" scoped>
.anticon-item {
  transition: opacity 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  font-weight: 600;
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
.menu-icon-empty {
  height: 2.2rem;
  width: 2.2rem;
  margin: 0 1.6rem 0 0;
  background: #42a1ff;
  border-radius: 0.5rem;
}
</style>
