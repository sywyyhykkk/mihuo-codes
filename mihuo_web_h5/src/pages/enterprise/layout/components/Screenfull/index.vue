<template>
  <el-tooltip placement="bottom" :content="isFullscreen ? '退出全屏' : '全屏'">
    <div id="screenfull-container" class="screenfull-svg" @click="click">
      <img
        v-if="!isFullscreen"
        :src="require('@/assets/enterprise/fullscreen.png')"
      />
      <img v-else :src="require('@/assets/enterprise/exit-fullscreen.png')" />
    </div>
  </el-tooltip>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import screenfull from 'screenfull'

export default defineComponent({
  name: 'Screenfull',
  setup() {
    const isFullscreen = ref<boolean>(false)
    const sf = screenfull

    function init(): void {
      if (sf.isEnabled) {
        sf.on('change', () => {
          isFullscreen.value = sf.isFullscreen
        })
      }
    }

    function click(): void | Boolean {
      if (!sf.isEnabled) {
        // message.warning('you browser can not work')
        return false
      }
      sf.toggle()
    }

    onMounted(() => {
      init()
    })

    return {
      isFullscreen,
      click,
    }
  },
})
</script>

<style scoped lang="less">
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  width: 30px;
  height: 30px;
  text-align: center;
  &:hover {
    background: @navDividerColor;
  }
  img {
    width: 18px;
    height: 18px;
    margin: 6px;
  }
}
</style>
