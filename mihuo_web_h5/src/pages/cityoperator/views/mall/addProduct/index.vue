<template>
  <div>
    <addProduct :company-id="companyId" button-type="primary" :cityOperatorId="cityOperatorId" prot-type="3" :cityId="cityId"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs} from 'vue'
import addProduct from '@/components/mall/addProduct/addProduct.vue'
import wsCache from "@/cache";

export default defineComponent({
  components: {
    addProduct
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
