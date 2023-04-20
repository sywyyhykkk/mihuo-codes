<template>
  <el-config-provider :locale="locale">
    <router-view class="app" :class="{ grey__mode: greyMode }" />
  </el-config-provider>
</template>

<script lang="ts">
import { defineComponent, computed, provide } from 'vue'
import { appStore } from '_@/store/modules/app'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

export default defineComponent({
  name: 'App',
  components: {
    ElConfigProvider
  },
  setup() {
    const greyMode = computed(() => appStore.greyMode)
    provide('platformType', 1)
    return {
      greyMode,
      locale: zhCn
    }
  }
})
</script>

<style lang="less">
.size {
  min-width: @minWidth;
  width: 100%;
  height: 100%;
}

html,
body {
  .size;
  margin: 0;
  padding: 0;
}

#app {
  .size;
  background: @appBg;
}

.grey__mode {
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -o-filter: grayscale(100%);
  filter: grayscale(100%);
  filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
  //-ms-filter: grayscale(100%);
  //-webkit-filter: grayscale(100%);
  //-moz-filter: grayscale(100%);
  //-ms-filter: grayscale(100%);
  //-o-filter: grayscale(100%);
  //filter: grayscale(100%);
  //filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
}
</style>
