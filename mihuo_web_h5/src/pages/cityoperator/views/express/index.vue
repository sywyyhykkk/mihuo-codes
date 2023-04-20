<template>
  <div>
    <ExpressList prot-type="3" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import ExpressList from '_c/Express/index.vue'

export default defineComponent({
  name: '交易快报管理',
  components: {
    ExpressList
  },
  setup() {}
})
</script>

<style scoped lang="less">
</style>
