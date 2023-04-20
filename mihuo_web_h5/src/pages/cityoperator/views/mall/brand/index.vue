<template>
  <div>
    <brand
      :company-id="companyId"
      :cityOperatorId="cityOperatorId"
      button-type="primary"
      prot-type="3"
    />
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
