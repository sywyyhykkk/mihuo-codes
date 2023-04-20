<template>
  <div>
    <classifyBrand
      :company-id="companyId"
      :city-operator-id="cityOperatorId"
      button-type="primary"
      prot-type="3"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import classifyBrand from '@/components/mall/brand/classifyBrand.vue'

export default defineComponent({
  name: '分类品牌管理',
  components: { classifyBrand },
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
