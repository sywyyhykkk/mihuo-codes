<template>
  <div>
    <classifyBrand button- type="primary" prot-type="2" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import classifyBrand from '@/components/mall/brand/classifyBrand.vue'
import wsCache from '@/cache'

export default defineComponent({
  name: '营销品牌管理',
  components: {
    classifyBrand
  },
  setup() {
    const state = reactive({
      companyId: wsCache.get('companys')[0].companyId
    })
    return {
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
</style>

