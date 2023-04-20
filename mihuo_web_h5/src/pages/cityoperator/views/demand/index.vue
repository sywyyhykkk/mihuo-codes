<template>
  <div>
    <DemandList prot-type="3" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import DemandList from '_c/Demand/index.vue'

export default defineComponent({
  name: '需求管理',
  components: {
    DemandList
  },
  setup() {}
})
</script>

<style scoped lang="less">
</style>
