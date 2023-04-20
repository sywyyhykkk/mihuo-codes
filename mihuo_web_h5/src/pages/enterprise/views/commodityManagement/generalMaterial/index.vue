<template>
  <div>
    <generalMaterial platform-type="2"> </generalMaterial>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import generalMaterial from '_c/mall/generalMaterial/index.vue'
import {
  importCommonMaterial,
  importCommonMaterialType,
  selectPmsMaterialTypeList,
} from '@/pages/cityoperator/api/mall'
import { ElMessage } from 'element-plus'
import wsCache from '@/cache'
export default defineComponent({
  components: {
    generalMaterial,
  },
  setup() {
    const form = reactive({
      addCompanyId: wsCache.get('companys')[0].companyId,
      addType: 2,
      queryCompanyId: 12,
    })
    const state = reactive({
      typeList: [1111],
      // companyId: wsCache.get('companys')[0].companyId
    })

    const handleAddProductCate = () => {
      importCommonMaterial(form).then((res) => {
        if (res) {
          ElMessage.success({
            message: '引入成功',
            type: 'success',
          })
          // materialType.value.getData()
        } else {
          ElMessage.error({
            message: '引入失败',
            type: 'error',
          })
        }
      })
    }
    onMounted(() => {
      // getData()
    })

    const getCommand = (e: any) => {
      importCommonMaterial({
        // addCompanyId: wsCache.get('companys')[0].companyId,
        addType: 2,
        importTypeIds: Number(e.id),
        queryCompanyId: 12,
        queryType: 3,
      }).then((res) => {
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

    const getData = () => {
      // selectPmsMaterialTypeList({ type: 3, companyId: 12 }).then(res => {
      //   if (res) {
      //     state.typeList = res.data
      //   }
      // })
    }

    return {
      form,
      getData,
      getCommand,
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
