<template>
  <div>
    <commodityType
      :company-id="companyId"
      button-
      type="primary"
      prot-type="2"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import commodityType from '@/components/mall/commodityType/commodityType.vue'
import wsCache from '@/cache'

export default defineComponent({
  name: '商品类型',
  components: {
    commodityType
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
