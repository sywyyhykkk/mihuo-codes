<template>
  <div>
    <addProduct :company-id="companyId" button- type ="primary" prot-type="2"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import addProduct from '@/components/mall/addProduct/addProduct.vue'
import wsCache from '@/cache'

export default defineComponent({
  components: {
    addProduct
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
