<template>
  <div class="column">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="栏目管理" name="0">
        <columnIndex
          v-if="activeName == 0"
          :company-id="companyId"
          :cityOperatorId="cityOperatorId"
          button-type="primary"
          prot-type="2"
        />
      </el-tab-pane>
      <el-tab-pane label="栏目商品" name="1">
        <columnProduct
          v-if="activeName == 1"
          :company-id="companyId"
          :cityOperatorId="cityOperatorId"
          button-type="primary"
          prot-type="2"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import columnIndex from '_c/mall/columnGroup/column.vue'
import columnProduct from '_c/mall/columnGroup/columnProduct.vue'

export default defineComponent({
  name: '栏目管理',
  components: {
    columnIndex,
    columnProduct
  },
  setup() {
    const state = reactive({
      companyId: 0,
      activeName: 0
    })
    return {
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
.column {
}
</style>
