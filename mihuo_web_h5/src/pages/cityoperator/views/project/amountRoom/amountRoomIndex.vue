<template>
  <div>
    <measurementIndex prot-type="2" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import measurementIndex from '@/components/project/measurement/measurementIndex.vue'

export default defineComponent({
  name: '量房参数',
  components: {
    measurementIndex
  },
  setup() {
    return {}
  }
})
</script>

<style scoped lang="less">
</style>
