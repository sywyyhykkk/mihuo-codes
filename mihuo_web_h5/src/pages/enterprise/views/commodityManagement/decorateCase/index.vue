<template>
  <div>
    <decorateCase
      :company-id="companyId"
      button-
      type="primary"
      prot-type="2"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import decorateCase from '@/components/mall/decorateCase/index.vue'
import wsCache from '@/cache'

export default defineComponent({
  name: '装修案例',
  components: {
    decorateCase
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
