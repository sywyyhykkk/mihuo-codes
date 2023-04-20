<template>
  <div>
    <brand :company-id="companyId" button- type="primary" prot-type="2" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import brand from '@/components/mall/brand/brand.vue'
import wsCache from '@/cache'

export default defineComponent({
  name: '品牌管理',
  components: {
    brand
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
