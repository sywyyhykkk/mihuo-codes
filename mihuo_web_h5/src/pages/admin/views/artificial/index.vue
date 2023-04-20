<template>
  <div>
    <el-form :inline="true" :model="formTop" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input v-model="formTop.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="formTop.phone" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select v-model="formTop.auditStatus" placeholder="请选择">
          <el-option
            v-for="item in [
              { value: 0, label: '待审核' },
              { value: 1, label: '审核失败' },
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
    <el-table
      stripe
      v-loading="loading"
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column prop="name" label="姓名" align="center" />
      <el-table-column prop="phone" label="联系电话" align="center" />
      <el-table-column
        v-if="routeTypeName === '工人'"
        align="center"
        prop="skillName"
        label="工种"
      />
      <el-table-column prop="skillYearNum" label="从业年限" align="center" />
      <el-table-column prop="workType" label="工作类型" align="center" />
      <el-table-column
        label="资格证书"
        prop="certificateImge"
        align="center"
        width="100"
      >
        <template #default="scope">
          <el-image
            preview-teleported
            lazy
            :src="scope.row.certificateImgeSl"
            :preview-src-list="[scope.row.certificateImgeYl]"
          />
        </template>
      </el-table-column>
      <el-table-column prop="selfIntroduce" label="自我介绍" />
      <el-table-column prop="auditStatus" label="审核状态" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.auditStatus === 2" type="success"
            >审核通过
          </el-tag>
          <el-tag v-if="scope.row.auditStatus === 1" type="danger"
            >审核失败
          </el-tag>
          <el-tag v-if="scope.row.auditStatus === 0" type="primary"
            >待审核
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="200">
        <template #default="scope">
          <el-button type="primary" size="mini" plain @click="open(scope.row)"
            >查看
          </el-button>
          <el-button
            v-if="scope.row.auditStatus !== 2"
            type="danger"
            size="mini"
            plain
            @click="audit(scope.row)"
            >审核
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination-new
      :current-page="currentPage"
      :page-size="pagesize"
      :total="total"
      @current-change="handleCurrentChange"
    />
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
    >
      <div class="item-input">
        <div class="item-input-label">审核意见</div>
        <div class="item-input-value">
          <el-input
            v-model="auditRemark"
            type="textarea"
            placeholder="请输入审核意见"
            :clearable="clearable"
            :autosize="{ minRows: 2, maxRows: 4 }"
            show-word-limit
          />
        </div>
      </div>
      <el-radio-group v-model="auditStatusV">
        <el-radio :label="1">审核未通过</el-radio>
        <el-radio :label="2">审核通过</el-radio>
      </el-radio-group>
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
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import { workers, workersAudit } from '@/pages/admin/api/enterprise'
import enterpriseExamineVue from '@/components/enterprise/enterpriseExamine.vue'
import { useRoute } from 'vue-router'
import { thumbnailImage } from '@/utils/utils'
export default defineComponent({
  components: {
    enterpriseExamineVue,
  },
  setup() {
    const enterpriseExamineRef = ref<HTMLElement | null>(null)
    const enterpriseExamineVue = ref<boolean>(false)
    const clearable = ref<boolean>(true)
    const dialogVisible = ref<boolean>(false)
    const auditStatusV = ref<number | undefined>(1)
    const personId = ref<number | undefined>(0)
    const auditRemark = ref<string>('')
    const routeTypeName = ref<string>('工人')
    const roleType = ref<string>('')
    const total = ref<number>(0)
    const currentPage = ref<number>(1)
    const pagesize = ref<number>(20)
    const route = useRoute() // 第一步
    const handleCurrentChange = (val: number) => {
      currentPage.value = val
      getData()
    }
    const routeType = () => {
      console.log('route.path', route.path)
      switch (route.path) {
        case '/business/artificial':
          routeTypeName.value = '工人'
          roleType.value = 'R_WORKER'
          break
        case '/business/manager':
          routeTypeName.value = '项目经理'
          roleType.value = 'R_PROJECT_MANAGER'
          break
        case '/business/supervision':
          routeTypeName.value = '监理'
          roleType.value = 'R_PROJECT_SUPERVISION'
          break
      }
    }
    const initForm = () => {
      return {
        name: '',
        phone: '',
        auditStatus: '',
      }
    }
    const formTop = reactive(initForm())
    const reset = () => {
      Object.assign(formTop, initForm())
      getData()
    }
    const getData = async () => {
      // 项目经理查询
      // roleType 角色类型(工人：R_COMPANY_WORKER 经理：R_COMPANY_MANAGER 监理：R_COMPANYSUPERVISION)
      const res = await workers({
        size: pagesize.value,
        current: currentPage.value,
        roleType: roleType.value,
        ...formTop,
      })
      if (res) {
        state.tableData = res.data.records
        state.tableData.map((item: any) => {
          item.certificateImgeYl = thumbnailImage(
            item.certificateImge,
            false,
            ''
          )
          item.certificateImgeSl = thumbnailImage(
            item.certificateImge,
            true,
            ''
          )
          item.certificateImgeInfo = thumbnailImage(
            item.certificateImge,
            false,
            'info'
          )
        })
        console.log('state.tableData', state.tableData)
        state.loading = false
        total.value = res.data.total
      }
    }
    const audit = (e: any) => {
      dialogVisible.value = true
      auditRemark.value = ''
      personId.value = e.personId
    }
    const audits = () => {
      workersAudit({
        auditRemark: auditRemark.value,
        auditStatus: auditStatusV.value,
        personId: personId.value,
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
          getData()
        }
      })
    }
    onMounted(() => {
      routeType()
      getData()
    })
    const getDialogVisible = () => {
      setTimeout(() => {
        enterpriseExamineVue.value = false
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
        state.forms['roleType'] = routeTypeName.value
        state.forms = e
        ;(enterpriseExamineRef.value as any).open()
      }, 30)
    }
    const handleClose = () => {
      dialogVisible.value = false
    }
    return {
      formTop,
      total,
      pagesize,
      personId,
      auditRemark,
      clearable,
      auditStatusV,
      dialogVisible,
      currentPage,
      enterpriseExamineRef,
      enterpriseExamineVue,
      route,
      routeTypeName,
      roleType,
      reset,
      getData,
      audits,
      audit,
      getDialogVisible,
      open,
      handleCurrentChange,
      handleClose,
      routeType,
      ...toRefs(state),
    }
  },
})
</script>
<style scoped>
.item-input-label {
  margin-bottom: 10px;
}
.item-input {
  margin-bottom: 10px;
}
.user-header {
  cursor: pointer;
}
:deep(.el-image__error) {
  font-size: 12px;
  background: #ffffff;
}
</style>
