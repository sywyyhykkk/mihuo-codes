<template>
  <materialType platform-type="2"> </materialType>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue'
import materialType from '_c/mall/materialType/index.vue'
import { importPlatformType } from '@/pages/cityoperator/api/mall'
import { ElMessage } from 'element-plus'
import wsCache from '@/cache'

export default defineComponent({
  components: {
    materialType,
  },
  setup() {
    const materialType = ref(null)
    const state = reactive({
      typeList: [],
      companyId: wsCache.get('companys')[0].companyId,
    })
    const handleAddProductCate = () => {
      importPlatformType({
        addCompanyId: wsCache.get('companys')[0].companyId,
        addType: 2,
        queryCompanyId: 12,
        queryType: 3,
      }).then((res: any) => {
        if (res) {
          ElMessage.success({
            message: '导入成功',
            type: 'success',
          })
          // materialType.value.getData()
        } else {
          ElMessage.error({
            message: '导入失败',
            type: 'error',
          })
        }
      })
    }
    return {
      materialType,
      handleAddProductCate,
      ...toRefs(state),
    }
  },
})
</script>
<style lang="less" scoped>
.contain-header {
  border-radius: 4px;
  padding: 10px 20px;
  background: #ffffff;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
