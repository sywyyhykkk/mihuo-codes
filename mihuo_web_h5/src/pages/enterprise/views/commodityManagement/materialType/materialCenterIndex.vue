<template>
  <materialCenterIndex platform-type="2"> </materialCenterIndex>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue'
import materialCenterIndex from '_c/mall/materialType/materialCenterIndex.vue'
import { importPlatformType } from '@/pages/cityoperator/api/mall'
import { ElMessage } from 'element-plus'
import wsCache from '@/cache'

export default defineComponent({
  name: '素材中心',
  components: {
    materialCenterIndex
  },
  setup() {
    const state = reactive({
      typeList: [],
      companyId: wsCache.get('companys')[0].companyId
    })
    return {
      ...toRefs(state)
    }
  }
})
</script>
<style lang="less" scoped>
</style>
