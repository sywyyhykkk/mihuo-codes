<template>
  <div>
    <generalMaterial platform-type="3"> </generalMaterial>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, reactive, toRefs } from 'vue'
import generalMaterial from '_c/mall/generalMaterial/index.vue'
import {
  importCommonMaterial,
  importCommonMaterialType,
  selectPmsMaterialType,
  selectPmsMaterialTypeList,
} from '@/pages/cityoperator/api/mall'
import { ElMessage } from 'element-plus'
import wsCache from '@/cache'
import { appStore } from '_@/store/modules/app'
export default defineComponent({
  components: {
    generalMaterial,
  },
  setup() {
    const form = reactive({
      addCompanyId: 12,
      addType: 3,
      queryCompanyId: 13,
    })
    const cityOperatorId = computed(() => {
      return wsCache.get(appStore.cityOperator).areaCode
    })
    const state = reactive({
      typeList: [],
    })

    const handleAddProductCate = () => {
      importCommonMaterial(form).then((res) => {
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
    onMounted(() => {
      // getData()
    })

    const getCommand = (e: any) => {
      importCommonMaterial({
        addCompanyId: 12,
        addType: 3,
        importTypeIds: Number(e.id),
        queryCompanyId: 13,
        queryType: 1,
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
      // selectPmsMaterialType({ current: 1, size: 9999 }).then(res => {
      //   if (res) {
      //     state.typeList = res.data
      //   }
      // })
    }

    return {
      form,
      cityOperatorId,
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
