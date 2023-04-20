<template>
  <div>
    <el-form :inline="true" :model="formTop" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input v-model="formTop.username" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="身份证号">
        <el-input v-model="formTop.idcard" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select v-model="formTop.auditStatus" placeholder="请选择">
          <el-option
            v-for="item in [
              { value: 0, label: '待审核' },
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
    <div>
      <el-table
        stripe
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column prop="username" label="姓名" align="center" />
        <el-table-column prop="idcard" label="身份证号" align="center" />
        <el-table-column label="身份证照-反" prop="idcardFront" align="center">
          <template #default="scope">
            <el-image
              preview-teleported
              :src="scope.row.idcardFrontSl"
              :preview-src-list="[scope.row.idcardFrontYl]"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="身份证照-正"
          width="100"
          prop="idcardBack"
          align="center"
        >
          <template #default="scope">
            <el-image
              preview-teleported
              :src="scope.row.idcardBackSl"
              :preview-src-list="[scope.row.idcardBackYl]"
            />
          </template>
        </el-table-column>
        <el-table-column prop="auditStatus" align="center" label="审核状态">
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
              >查看</el-button
            >
            <el-button
              v-if="scope.row.auditStatus !== 2"
              type="danger"
              size="mini"
              plain
              @click="audit(scope.row)"
              >审核</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination-new
        :current-page="currentPage"
        :page-size="pagesize"
        :total="total"
        layout="total, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
      />
    </div>
    <enterpriseExamineVue
      v-if="enterpriseExamineVue"
      ref="enterpriseExamineRef"
      :form="forms"
    />
    <viewInfo v-if="viewInfo" ref="viewInfo" :form="forms" />
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
            :autosize="{ minRows: 2, maxRows: 4 }"
            show-word-limit
          />
        </div>
      </div>
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
import { ElMessage } from 'element-plus'
import { authentication, userauthAudit } from '@/pages/admin/api/enterprise'
import enterpriseExamineVue from '@/components/enterprise/enterpriseExamine.vue'
import viewInfo from './view.vue'
import { thumbnailImage } from '@/utils/utils'
interface StateVerify {
  tableData: Array<any>
  loading: Boolean
  forms: {}
}
export default defineComponent({
  components: {
    enterpriseExamineVue,
    viewInfo,
  },
  setup() {
    const total = ref<number>(0)
    const currentPage = ref<number>(1)
    const pagesize = ref<number>(20)
    const enterpriseExamineRef = ref<HTMLElement | null>(null)
    const OrganizationAddRef = ref<HTMLElement | null>(null)
    const enterpriseExamineVue = ref<boolean>(false)
    const viewInfo = ref<boolean>(false)
    const OrganizationAddVue = ref<boolean>(false)
    const dialogVisible = ref<boolean>(false)
    const auditStatusV = ref<number | undefined>(1)
    const userAuthId = ref<number | undefined>(0)
    const auditRemark = ref<string>('')
    const previewImg = ref<string>('')
    const previewImgList = ref<any>()

    const handleCurrentChange = (val: number) => {
      currentPage.value = val
      getData()
    }
    const initForm = () => {
      return {
        username: '',
        contactTel: '',
        idcard: '',
        auditStatus: '',
      }
    }
    const formTop = reactive(initForm())
    const reset = () => {
      Object.assign(formTop, initForm())
      getData()
    }
    const getData = async () => {
      state.loading = true
      const res = await authentication({
        size: pagesize.value,
        current: currentPage.value,
        username: formTop.username,
        idcard: formTop.idcard,
        auditStatus: formTop.auditStatus,
      })
      if (res) {
        state.tableData = res.data.records
        total.value = res.data.total
        state.tableData.map((i) => {
          i.idcardFrontSl = thumbnailImage(i.idcardFront, true, '')
          i.idcardFrontYl = thumbnailImage(i.idcardFront, false, '')
          i.idcardFrontInfo = thumbnailImage(i.idcardFront, false, 'info')
          i.idcardBackSl = thumbnailImage(i.idcardBack, true, '')
          i.idcardBackYl = thumbnailImage(i.idcardBack, false, '')
          i.idcardBackInfo = thumbnailImage(i.idcardBack, false, 'info')
        })
        state.loading = false
      }
    }
    const audit = (e: any) => {
      dialogVisible.value = true
      userAuthId.value = e.userAuthId
    }
    const audits = () => {
      userauthAudit({
        userAuthId: userAuthId.value,
        auditRemark: auditRemark.value,
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
          getData()
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
    const state = reactive<StateVerify>({
      tableData: [],
      loading: true,
      forms: { companyName: '' },
    })
    const open = (e: any) => {
      viewInfo.value = true
      setTimeout(() => {
        state.forms = e
        ;(viewInfo.value as any).open()
      }, 30)
    }
    const openAdd = () => {
      OrganizationAddVue.value = true
      setTimeout(() => {
        ;(OrganizationAddRef.value as any).open()
      }, 30)
    }
    const handleClose = () => {
      dialogVisible.value = false
    }
    return {
      total,
      pagesize,
      currentPage,
      formTop,
      userAuthId,
      auditStatusV,
      dialogVisible,
      auditRemark,
      OrganizationAddVue,
      OrganizationAddRef,
      enterpriseExamineRef,
      enterpriseExamineVue,
      viewInfo,
      previewImg,
      previewImgList,
      handleClose,
      audit,
      getData,
      handleCurrentChange,
      reset,
      audits,
      openAdd,
      getOrganizationAdd,
      getDialogVisible,
      open,
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

:deep(.el-image__error) {
  font-size: 12px;
  background: #ffffff;
}
</style>
