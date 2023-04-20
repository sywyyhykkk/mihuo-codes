<template>
  <!--  -->
  <div>
    <el-form :inline="true" :model="formTop" class="demo-form-inline">
      <el-form-item label="项目经理">
        <el-input v-model="formTop.managerName" placeholder="请输入" />
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
        <el-button type="primary" @click="getData">查询 </el-button>
        <el-button type="primary" @click="reset">重置 </el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-table stripe  v-loading="loading" :data="tableData" border style="width: 100%">
        <el-table-column prop="managerName" label="项目经理" />
        <el-table-column prop="auditStatu" label="审核状态" />
        <el-table-column label="操作" fixed="right" width="200">
          <template #default="scope">
            <el-button
              type="text"
              size="small"
              @click="open(scope.row)"
            >查看
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="audit(scope.row)"
            >审核
            </el-button>
            <el-button
              v-if="scope.row.auditStatus == 2"
              type="text"
              size="small"
            >审核通过
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--      :page-size="pagesize"-->
      <el-pagination-new
        :current-page="currentPage"
        :total="total"
        layout="total, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
      />
    </div>
    <ManagerVue
      v-if="2>1"
      ref="ManagerRef"
      :form="forms"
    />
    <el-dialog :close-on-press-escape="false" :close-on-click-modal="false"
      v-model="dialogVisible"
      title="提示"
      :before-close="handleClose"
    >
      <el-radio v-model="auditStatusV" :label="1">审核未通过 </el-radio>
      <el-radio v-model="auditStatusV" :label="2">审核通过 </el-radio>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消 </el-button>
          <el-button type="primary" @click="audits">确 定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import { projectSupervision } from '../../api/supervision'
import ManagerVue from '@/components/manager/Manager.vue'
import { appStore } from '_@/store/modules/app'

interface StateVerify {
  tableData: Array< any >
  loading: Boolean
  forms: {}
}

export default defineComponent({
  components: {
    ManagerVue
  },
  setup() {
    const total = ref<number>(0)
    const enterpriseExamineRef = ref<HTMLElement | null>(null)
    const OrganizationAddRef = ref<HTMLElement | null>(null)
    const currentPage = ref<number>(1)
    // const pagesize = ref<number>(1)
    const enterpriseExamineVue = ref<boolean>(false)
    const OrganizationAddVue = ref<boolean>(false)
    const dialogVisible = ref<boolean>(false)
    const auditStatusV = ref<number | undefined>(0)
    const skillId = ref<number | undefined>(0)
    const handleCurrentChange = (val: number) => {
      currentPage.value = val
      getData()
    }
    const deletes = () => {
      // ElMessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //     ElMessage({
      //       type: 'success',
      //       message: '删除成功!'
      //     })
      //   })
      //   .catch(() => {})
    }
    const initForm = () => {
      return {
        managerName: '',
        auditStatus: ''
      }
    }
    const formTop = reactive(initForm())
    const reset = () => {
      Object.assign(formTop, initForm())
      getData()
    }
    const getData = async() => {
      state.loading = true
      // 项目经理查询
      // roleType 角色类型(工人：R_COMPANY_WORKER 经理：R_COMPANY_MANAGER 监理：R_COMPANYSUPERVISION)
      const res = await projectSupervision({
        size: 20,
        current: 0,
        roleType: 'R_COMPANYSUPERVISION'
      })
      if (res) {
        state.tableData = res.data.records
        total.value = res.data.total
        state.tableData.forEach(i => {
          i.auditStatu = i.auditStatus === 0 ? '未审核' : i.auditStatus === 1 ? '审核通过' : '审核未通过'
        })
        state.loading = false
      }
    }
    const audit = (e: any) => {
      console.log(e)
      dialogVisible.value = true
      // skillId.value = e.managerId
    }
    const audits = () => {
      // if (auditStatusV) {
      //   skillAuth({
      //     data: {
      //       skillId: skillId.value,
      //       auditStatus: auditStatusV.value
      //     }
      //   }).then((res) => {
      //     if (res) {
      //       if (!(auditStatusV) || auditStatusV.value === 1) {
      //         ElMessage.warning({
      //           message: '审核未通过',
      //           type: 'warning'
      //         })
      //         dialogVisible.value = false
      //       } else if (auditStatusV && auditStatusV.value === 2) {
      //         ElMessage.success({
      //           message: '审核通过',
      //           type: 'success'
      //         })
      //         dialogVisible.value = false
      //       }
      //     }
      //   })
      // }
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
    const state = reactive<StateVerify>({
      tableData: [],
      loading: true,
      forms: {}
    })
    const open = (e: any) => {
      enterpriseExamineVue.value = true
      setTimeout(() => {
        state.forms = e

        if (enterpriseExamineRef.value) {
          (enterpriseExamineRef.value as any).open()
        }
      }, 30)
    }
    const openAdd = () => {
      OrganizationAddVue.value = true
      setTimeout(() => {
        if (OrganizationAddRef.value) {
          (OrganizationAddRef.value as any).open()
        }
      }, 30)
    }
    const handleClose = () => {

    }
    return {
      reset,
      formTop,
      getData,
      audits,
      skillId,
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
      ...toRefs(state)
    }
  }
})
</script>
<style scoped></style>
