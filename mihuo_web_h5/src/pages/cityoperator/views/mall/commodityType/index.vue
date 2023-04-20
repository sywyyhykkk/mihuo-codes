<template>
  <div>
    <commodityType
      :company-id="companyId"
      button-type="primary"
      prot-type="3"
      :cityOperatorId="cityOperatorId"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRefs,
  watchEffect
} from 'vue'
import commodityType from '@/components/mall/commodityType/commodityType.vue'
import wsCache from '@/cache'

export default defineComponent({
  name: '商品类型',
  components: {
    commodityType
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
