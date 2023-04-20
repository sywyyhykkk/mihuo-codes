<template>
  <!--  -->
  <div class="m-">
    <el-form :inline="true" :model="formTop" class="demo-form-inline">
      <el-form-item label="企业名称">
        <el-input v-model="formTop.companyName" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="formTop.contactTel" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="统一社会信用编号">
        <el-input v-model="formTop.socialCreditNo" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select v-model="formTop.auditStatus" placeholder="请选择">
          <el-option
            v-for="item in [
              { value: 0, label: '未审核' },
              { value: 1, label: '审核未通过' },
              { value: 2, label: '审核通过' },
            ]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getData">查询</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table stripe  v-loading="loading" :data="tableData" border style="width: 100%">
      <el-table-column prop="companyName" label="企业名称" />
      <el-table-column prop="legalPerson" label="联系电话" />
      <el-table-column prop="socialCreditNo" label="统一社会信用编号" />
      <el-table-column prop="auditStatus" label="审核状态" />
      <el-table-column label="操作" fixed="right" width="200">
        <template #default="scope">
          <el-button type="text" size="small" @click="open(scope.row)"
            >查看</el-button
          >
          <el-button type="text" size="small" @click="audit(scope.row)"
            >审核</el-button
          >
          <el-button v-if="scope.row.auditStatus == 2" type="text" size="small"
            >审核通过</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <enterpriseExamineVue
      v-if="enterpriseExamineVue"
      ref="enterpriseExamineRef"
      :form="forms"
    />
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      v-model="dialogVisible"
      title="提示"
      :before-close="handleClose"
      :close="(auditStatusV = 0)"
    >
      <el-radio v-model="auditStatusV" :label="1">审核未通过</el-radio>
      <el-radio v-model="auditStatusV" :label="2">审核通过</el-radio>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="audits">确 定</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { company, companyAudit } from '../../api/enterprise'
import enterpriseExamineVue from '@/components/enterprise/enterpriseExamine.vue'

export default defineComponent({
  components: {
    enterpriseExamineVue,
  },
  setup() {
    const enterpriseExamineRef = ref<HTMLElement | null>(null)
    const OrganizationAddRef = ref<HTMLElement | null>(null)
    const enterpriseExamineVue = ref<boolean>(false)
    const OrganizationAddVue = ref<boolean>(false)
    const dialogVisible = ref<boolean>(false)
    const auditStatusV = ref<number | undefined>(0)
    const companyId = ref<number | undefined>(0)
    const deletes = () => {
      ElMessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          ElMessage({
            type: 'success',
            message: '删除成功!',
          })
        })
        .catch(() => {})
    }
    const initForm = () => {
      return {
        companyName: '',
        contactTel: '',
        socialCreditNo: '',
        provinceCode: '',
        cityCode: '',
        areaCode: '',
        auditStatus: '',
      }
    }
    const formTop = reactive(initForm())
    const reset = () => {
      Object.assign(formTop, initForm())
      getData()
    }
    const getData = async () => {
      const res = await company({
        size: 10,
        page: 1,
        companyName: formTop.companyName,
        contactTel: formTop.contactTel,
        socialCreditNo: formTop.socialCreditNo,
        provinceCode: formTop.provinceCode,
        cityCode: formTop.cityCode,
        areaCode: formTop.areaCode,
        auditStatus: formTop.auditStatus,
      })
      if (res) {
        console.log('res :>> ', res)
        state.tableData = res.data.records
        state.loading = false
      }
    }
    const audit = (e: any) => {
      console.log(e)
      dialogVisible.value = true
      companyId.value = e.companyId
    }
    const audits = () => {
      companyAudit({
        companyId: companyId.value,
        auditStatus: auditStatusV.value,
      }).then((res) => {
        if (res) {
          if (auditStatusV.value === 1) {
            ElMessage.warning({
              message: '审核未通过',
              type: 'warning',
            })
            dialogVisible.value = false
          } else if (auditStatusV.value === 2) {
            ElMessage.success({
              message: '审核通过',
              type: 'success',
            })
            dialogVisible.value = false
          }
        }
      })
    }
    onMounted(() => {
      getData()
    })
    const getDialogVisible = () => {
      setTimeout(() => {
        enterpriseExamineVue.value = false
      }, 300)
    }
    const getOrganizationAdd = () => {
      setTimeout(() => {
        OrganizationAddVue.value = false
      }, 300)
    }
    const state = reactive({
      tableData: [],
      loading: true,
      forms: { companyName: '' },
    })
    const open = (e: any) => {
      enterpriseExamineVue.value = true
      setTimeout(() => {
        state.forms = e
        ;(enterpriseExamineRef.value as any).open()
      }, 30)
    }
    const openAdd = () => {
      OrganizationAddVue.value = true
      setTimeout(() => {
        ;(OrganizationAddRef.value as any).open()
      }, 30)
    }
    return {
      reset,
      formTop,
      getData,
      audits,
      companyId,
      auditStatusV,
      dialogVisible,
      audit,
      OrganizationAddVue,
      OrganizationAddRef,
      enterpriseExamineRef,
      enterpriseExamineVue,
      deletes,
      openAdd,
      getOrganizationAdd,
      getDialogVisible,
      open,
      ...toRefs(state),
    }
  },
})
</script>
<style scoped></style>
