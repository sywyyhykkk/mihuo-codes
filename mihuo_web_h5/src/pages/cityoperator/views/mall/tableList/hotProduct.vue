<template>
  <div>
    <hotProduct
      :company-id="companyId"
      button-type="primary"
      prot-type="3"
      :cityOperatorId="cityOperatorId"
      :cityId="cityId"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import hotProduct from '@/components/mall/tableList/hotProduct.vue'
import wsCache from '@/cache'

export default defineComponent({
  name: '热销商品推荐管理',
  components: {
    hotProduct
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
