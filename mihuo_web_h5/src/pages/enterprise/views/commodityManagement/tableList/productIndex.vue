<template>
  <div class="column">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="商品管理" name="0">
        <tableList
          :company-id="companyId"
          button-type="primary"
          prot-type="2"
        />
      </el-tab-pane>
      <el-tab-pane
        v-if="$getPression('product_classification')"
        label="商品分类"
        name="1"
      >
        <productCategory platform-type="2" :prop-company-id="companyId" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import productCategory from '_c/mall/classification/index.vue'
import tableList from '@/components/mall/tableList/index.vue'
import wsCache from '@/cache'

export default defineComponent({
  name: '商品管理',
  components: {
    productCategory,
    tableList,
  },
  setup() {
    const state = reactive({
      activeName: 0,
      companyId: wsCache.get('companys')[0].companyId,
    })
    return {
      ...toRefs(state),
    }
  },
})
</script>

<style scoped lang="less">
</style>
