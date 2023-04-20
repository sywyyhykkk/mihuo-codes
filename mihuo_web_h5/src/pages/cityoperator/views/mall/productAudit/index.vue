<template>
  <div>
    <productAudit
      :company-id="companyId"
      :cityOperatorId="cityOperatorId"
      button-type="primary"
      prot-type="2"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue'
import productAudit from '@/components/mall/productAudit/index.vue'
import wsCache from '@/cache'

export default defineComponent({
  name: '商品审核',
  components: {
    productAudit
  },
  setup() {
    const state = reactive({
      companyId: 0
    })
    return {
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
</style>
