<template>
  <div class="header">
    <p class="name">{{ toUser.TargetName || '' }}</p>
    <el-icon @click="close" class="close"><close-bold size="50" /></el-icon>
  </div>
</template>

<script>
import { computed, defineComponent } from '@vue/runtime-core'
import { ImStore } from '_@/store/modules/im'
export default defineComponent({
  name: 'Header',
  setup() {
    const toUser = computed(() => ImStore.toUser)
    const close = () => {
      ImStore.SetImShow(false)
    }
    return {
      toUser,
      close
    }
  }
})
</script>

<style scoped lang='less'>
.header {
  background-image: -webkit-linear-gradient(-45deg, lang= 'less', '#42a1ff');
  margin: 0 auto;
  align-items: center;
  height: 60px;
  position: relative;
  color: #fff;
  background: #0969da;
  display: flex;
  .close {
    cursor: pointer;
    margin: 0 20px;
    font-size: 20px;
  }
  .name {
    font-size: 18px;
    padding-left: 20px;
    line-height: 60px;
    font-weight: 600;
    flex: 1;
  }
}
</style>
