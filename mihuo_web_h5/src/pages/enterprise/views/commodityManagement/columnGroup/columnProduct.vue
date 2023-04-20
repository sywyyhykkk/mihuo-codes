<template>
  <div>
    <columnProduct :company-id="companyId" :cityOperatorId="cityOperatorId" button-type="primary" prot-type="2" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import columnProduct from '_c/mall/columnGroup/columnProduct.vue'

export default defineComponent({
  components: {
    columnProduct
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
