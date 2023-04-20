<template>
  <div class="app-wrapper">
<!--    <div class="chat">消息</div>-->
    <component :is="layout" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import Classic from './modules/Classic.vue'
import Top from './modules/Top.vue'
import LeftTop from './modules/LeftTop.vue'
import { appStore } from '_@/store/modules/app'
export default defineComponent({
  name: 'Layout',
  components: {
    Classic,
    Top,
    LeftTop,
  },
  setup() {
    const layout = computed(() => appStore.layout)
    return {
      layout,
    }
  },
})
</script>

<style lang="less" scoped>
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  background: #ffffff;
  //overflow: hidden;
  //.chat {
  //  background: #000;
  //  width: 120px;
  //  height: 120px;
  //  z-index: 1999999;
  //}
}
</style>
