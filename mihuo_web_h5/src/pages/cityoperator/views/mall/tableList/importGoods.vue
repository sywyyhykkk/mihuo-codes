<template>
  <div>
<!--    // import-type=1平台导入运营，import-type=2营运端导入企业-->
    <importGoods company-id="0" button-type="primary" prot-type="1" import-type="1"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import importGoods from '_c/mall/tableList/importGoodsTable.vue'

export default defineComponent({
  components: {
    importGoods
  },
  setup() {
    return {}
  }
})

</script>

<style scoped lang="less">

</style>
