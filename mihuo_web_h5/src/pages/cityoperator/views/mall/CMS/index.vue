<template>
  <div>
    <cmsClassify :company-id="companyId" button-type="primary" prot-type="3" :cityOperatorId="cityOperatorId" :cityId="cityId"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs} from 'vue'
import cmsClassify from '@/components/mall/CMS/index.vue'
import wsCache from "@/cache";

export default defineComponent({
  components: {
    cmsClassify
  },
  setup() {
    console.log(wsCache.get('cityOperator'))
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
