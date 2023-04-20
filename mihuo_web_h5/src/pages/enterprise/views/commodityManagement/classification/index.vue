<template>
  <div>
    <productCategory platform-type="2" :prop-company-id="companyId">
      <!--      <el-button-->
      <!--        class="btn-add"-->
      <!--        size="mini"-->
      <!--        @click="handleAddProductCate()"-->
      <!--      >-->
      <!--        导入-->
      <!--      </el-button>-->
    </productCategory>
  </div>
</template>
<script lang="ts">
import {defineComponent, reactive, toRefs} from 'vue'
import productCategory from '_c/mall/classification/index.vue'
import wsCache from "@/cache"
export default defineComponent({
  components: {
    productCategory
  },
  setup() {
    const state = reactive({
      companyId: wsCache.get('companys')[0].companyId
    })
    const handleAddProductCate = () => {

    }
    return {
      handleAddProductCate,
      ...toRefs(state)
    }
  }
})
</script>
<style lang="less" scoped>
.contain-header{
  border-radius:4px ;
  padding: 10px 20px;
  background: #ffffff;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

</style>
