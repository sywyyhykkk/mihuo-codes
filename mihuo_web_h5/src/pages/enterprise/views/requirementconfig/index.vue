<template>
  <div class="m-">
    <el-table
      v-loading="loading"
      stripe
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        type="index"
        width="50"
        align="center"
        label="序号"
      />
      <el-table-column prop="requirementTypeName" label="需求类型">
        <template #default="scope">
          <span
            v-if="scope.row.requirementTypeName"
          >{{ scope.row.requirementTypeName }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="sopTemplateName" label="sop模版">
        <template #default="scope">
          <span
            v-if="scope.row.sopTemplateName"
          >{{ scope.row.sopTemplateName }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="materialTemplateName" label="选材模版">
        <template #default="scope">
          <span
            v-if="scope.row.materialTemplateName"
          >{{ scope.row.materialTemplateName }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="120"
      >
        <template #default="scope">
          <el-button
            type="text"
            size="small"
            @click="open(scope.row)"
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <requirementconfigEtide
      v-if="requirementconfigEtide"
      ref="enterpriseExamineRef"
      :form="forms"
      :soptemplate-list="SoptemplateList"
      :get-data="getData"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref, onMounted } from 'vue'
import { requirementconfigList, reqSopTempLateList } from '../../api/enterprise'
import requirementconfigEtide from '@/components/requirementconfigEtide/index.vue'

export default defineComponent({
  components: {
    requirementconfigEtide
  },
  setup() {
    const enterpriseExamineRef = ref<HTMLElement | null>(null)
    const requirementconfigEtide = ref<boolean>(false)
    const initForm = () => {
      return {
        companyName: '',
        contactTel: '',
        socialCreditNo: '',
        provinceCode: '',
        cityCode: '',
        areaCode: ''
      }
    }
    const formTop = reactive(initForm())
    const reset = () => {
      Object.assign(formTop, initForm())
      getData()
    }

    const getData = async () => {
      getSeselteList()
      const res = await requirementconfigList({
        size: 100,
        page: 1,
        templateType: 1
      })
      if (res) {
        console.log('res :>> ', res)
        state.tableData = res.data
        state.loading = false
      }
    }
    const getSeselteList = async () => {
      const res2 = await reqSopTempLateList({
        size: 1000,
        page: 1,
        templateType: 1
      })

      if (res2) {
        state.SoptemplateList = res2.data
        state.loading = false
      }
    }
    onMounted(() => {
      getData()
    })
    const getDialogVisible = () => {
      setTimeout(() => {
        requirementconfigEtide.value = false
      }, 300)
    }
    const state = reactive({
      tableData: [],
      SoptemplateList: [],
      loading: true,
      forms: { companyName: '' }
    })
    const open = (e: any) => {
      requirementconfigEtide.value = true
      setTimeout(() => {
        state.forms = { companyName: '' }
        state.forms = e
        ;(enterpriseExamineRef.value as any).open()
      }, 30)
    }
    return {
      reset,
      formTop,
      getData,
      enterpriseExamineRef,
      requirementconfigEtide,
      getDialogVisible,
      open,
      ...toRefs(state)
    }
  }
})
</script>
<style scoped></style>
