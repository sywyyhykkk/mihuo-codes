<template>
  <div>
    <AppTextEdit v-model="json"  />
  </div>
</template>

<script>
import { defineComponent, reactive, ref, markRaw, computed, toRefs, toRaw } from 'vue'
import AppTextEdit from '@/components/AppTextEdit/index'

export default defineComponent({
  components: {
    AppTextEdit
  },
  setup() {
    const json = ref('[]')
    return {
      json
    }
  }
})
</script>
<style lang="less">

</style>
