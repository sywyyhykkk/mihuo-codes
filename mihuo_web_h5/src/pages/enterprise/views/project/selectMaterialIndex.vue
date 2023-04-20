<template>
  <div>
    <selectMaterialIndex prot-type="2" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import selectMaterialIndex from '@/components/project/selectMaterialTemplate/index.vue'

export default defineComponent({
  name: '选材模版',
  components: {
    selectMaterialIndex
  },
  setup() {
    return {}
  }
})
</script>

<style scoped lang="less">
</style>
