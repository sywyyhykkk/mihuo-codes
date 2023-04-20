<template>
  <div>
    <tableList :company-id="companyId" button-type="primary" prot-type="2" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, watchEffect } from 'vue'
import tableList from '@/components/mall/tableList/index.vue'
import wsCache from '@/cache'

export default defineComponent({
  components: {
    tableList
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
