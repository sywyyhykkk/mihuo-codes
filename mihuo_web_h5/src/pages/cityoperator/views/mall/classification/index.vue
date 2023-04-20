<template>
  <div>
    <classIfication platform-type="3" prop-company-id="0" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, watchEffect } from 'vue'
import classIfication from '@/components/mall/classification/index.vue'

export default defineComponent({
  components: {
    classIfication
  },
  setup() {
    return {}
  }
})

</script>

<style scoped lang="less">

</style>
