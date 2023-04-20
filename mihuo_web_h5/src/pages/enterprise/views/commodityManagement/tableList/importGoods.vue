<template>
  <div>
    <!--    // import-type=1平台导入运营，import-type=2营运端导入企业,import-type=2时企业id必传-->
    <importGoods :company-id="companyId" button- type ="primary" prot-type="3" import-type="2"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs} from 'vue'
import importGoods from '_c/mall/tableList/importGoodsTable.vue'
import wsCache from '@/cache'

export default defineComponent({
  components: {
    importGoods
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
