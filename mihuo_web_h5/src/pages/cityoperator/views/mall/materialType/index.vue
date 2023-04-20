<template>
  <materialType platform-type="3"> </materialType>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import materialType from '_c/mall/materialType/index.vue'
import { importPlatformType } from '@/pages/cityoperator/api/mall'
import { ElMessage } from 'element-plus'
import wsCache from '@/cache'
import { appStore } from '_@/store/modules/app'

export default defineComponent({
  components: {
    materialType,
  },
  setup() {
    const materialType = ref(null)
    const cityOperatorId = computed(() => {
      return wsCache.get(appStore.cityOperator).areaCode
    })
    const handleAddProductCate = () => {
      importPlatformType({
        addCompanyId: 12,
        addType: 3,
        queryCompanyId: 1,
        queryType: 1,
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
      cityOperatorId,
      handleAddProductCate,
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
