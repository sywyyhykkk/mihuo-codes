<template>
  <div>
    <cms :company-id="companyId" button-type="primary" prot-type="3" :cityOperatorId="cityOperatorId" :cityId="cityId"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs} from 'vue'
import cms from '@/components/mall/CMS/cms.vue'

export default defineComponent({
  components: {
    cms
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
