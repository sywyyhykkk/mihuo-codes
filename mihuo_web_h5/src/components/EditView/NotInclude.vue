<template>
  <div>
    <img class="not-include" :src="require('@/assets/img/product/not_include.png')" />
  </div>
</template>

<script>
import { defineComponent, reactive, computed } from 'vue'

export default defineComponent({
  name: 'NotInclude',
  props: ['data'],
  setup(props) {
    return {}
  }
})
</script>

<style scoped lang="less">
.not-include {
  width: 50px;
  height: 22px;
  margin-top: 30px;
}
</style>
