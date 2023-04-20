<template>
  <div>
    <el-card>
      <el-input v-model="formTop.companyName" placeholder="企业名称" />
      <el-input v-model="formTop.legalPhone" placeholder="法人电话" />
      <!--      <el-form-item label="统一社会信用编号">-->
      <!--        <el-input v-model="formTop.socialCreditNo" placeholder="请输入" />-->
      <!--      </el-form-item>-->
      <el-select v-model="formTop.auditStatus" placeholder="审核状态">
        <el-option
          v-for="item in [
            { value: 0, label: '待审核' },
            { value: 1, label: '审核未通过' },
            { value: 2, label: '审核通过' }
          ]"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button type="primary" icon="search" @click="getData">查询</el-button>
      <el-button icon="" @click="reset">重置</el-button>
    </el-card>
    <div>
      <el-table
        v-loading="loading"
        stripe
        height="'0"
        :data="tableData"
        border
        style="width: 100%; height: calc(100vh - 24rem) !important"
      >
        <el-table-column-image
          label="logo"
          prop="companyLogo"
          width="100"
          align="center"
        >
          <!--          <template #default="scope">-->
          <!--            <el-image-->
          <!--              preview-teleported-->
          <!--              style="max-height: 60px"-->
          <!--              :src="scope.row.companyLogo"-->
          <!--              :preview-src-list="[scope.row.companyLogo]"-->
          <!--            />-->
          <!--          </template>-->
        </el-table-column-image>
        <el-table-column prop="companyName" label="企业名称" />
        <el-table-column prop="areaInfo" width="200" label="企业地址" />
        <el-table-column prop="legalPhone" label="法人电话" align="center" />
        <el-table-column prop="socialCreditNo" label="统一社会信用编号" />
        <el-table-column-image
          label="证书-反"
          prop="legalIdcardBack"
          width="100"
          align="center"
        >
          <!-- <template #default="scope">
            <el-image
preview-teleported
              lazy
              style="max-height: 60px"
              :src="scope.row.legalIdcardBack"
              :preview-src-list="[scope.row.legalIdcardBack]"
            />
          </template> -->
        </el-table-column-image>
        <el-table-column-image
          label="证书-正"
          prop="legalIdcardFront"
          width="100"
          align="center"
        >
          <!--          <template #default="scope">-->
          <!--            <el-image-->
          <!--              preview-teleported-->
          <!--              lazy-->
          <!--              style="max-height: 60px"-->
          <!--              :src="scope.row.legalIdcardFront"-->
          <!--              :preview-src-list="[scope.row.legalIdcardFront]"-->
          <!--            />-->
          <!--          </template>-->
        </el-table-column-image>
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
        <el-table-column label="运营商默认企业" width="120" align="center">
          <template #default="scope">
            <el-tooltip
              effect="dark"
              :content="
                scope.row.isDefault
                  ? '当前运营商默认企业'
                  : '设置运营商默认企业'
              "
              placement="top"
              :enterable="false"
            >
              <el-switch
                v-model="scope.row.isDefault"
                :disabled="scope.row.isDefault"
                @change="setUpDefault($event, scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="180" align="center">
          <template #default="scope">
            <el-button type="text" @click="open(scope.row)">查看 </el-button>
            <el-button
              v-if="scope.row.auditStatus !== 2"
              type="text"
              style="color: red"
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
      v-model="dialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
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
import { ElMessageBox, ElMessage } from 'element-plus'
import { company, companyAudit } from '_@/api/enterprise'
import enterpriseExamineVue from '@/components/enterprise/enterpriseExamine.vue'
import viewInfo from './view.vue'
import { thumbnailImage } from '@/utils/utils'
import { fetch } from '_@/axios-config/axios'
interface StateVerify {
  tableData: Array<any>
  loading: Boolean
  forms: {}
}

export default defineComponent({
  name: '企业资质审核',
  components: {
    enterpriseExamineVue,
    viewInfo
  },
  setup() {
    const total = ref<number>(0)
    const currentPage = ref<number>(1)
    const pagesize = ref<number>(20)
    const enterpriseExamineRef = ref<HTMLElement | null>(null)
    const OrganizationAddRef = ref<HTMLElement | null>(null)
    const enterpriseExamineVue = ref<boolean>(false)
    const OrganizationAddVue = ref<boolean>(false)
    const dialogVisible = ref<boolean>(false)
    const auditStatusV = ref<number | undefined>(1)
    const auditRemark = ref<string>('')
    const companyId = ref<number | undefined>(0)
    const viewInfo = ref<boolean>(false)
    const imgUrl = ref<string>('')
    const curDefault = ref<string>('')
    const handleCurrentChange = (val: number) => {
      currentPage.value = val
      getData()
    }
    const deletes = () => {
      ElMessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          ElMessage({
            type: 'success',
            message: '删除成功!'
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
        isDefault: false
      }
    }
    const formTop = reactive(initForm())
    const reset = () => {
      Object.assign(formTop, initForm())
      getData()
    }
    // 设置运营商默认企业
    const setUpDefault = async (e: any, row: any) => {
      curDefault.value = row
      if (e) {
        await fetch({
          url: `/admin/cityoperator/setDefaultCompany?companyId=${row.companyId}`,
          method: 'post'
        }).then((res: any) => {
          if (res.data) {
            // getData()
            state.tableData.map((item: any) => {
              if (item.companyId == row.companyId) {
                item.isDefault = true
              } else {
                item.isDefault = false
              }
            })
            // getDefaultCompany(state.tableData)
          }
        })
      }
    }
    const getData = async () => {
      state.loading = true
      const res = await company({
        size: pagesize.value,
        current: currentPage.value,
        companyName: formTop.companyName,
        contactTel: formTop.contactTel,
        auditStatus: formTop.auditStatus
      })
      if (res) {
        // state.tableData = res.data.records;
        let data = res.data.records
        total.value = res.data.total
        state.loading = false
        getDefaultCompany(data)
      }
    }
    // 获取运营商默认企业
    const getDefaultCompany = async (list: any) => {
      await fetch({
        url: '/admin/cityoperator/getDefaultCompany',
        method: 'post'
      }).then((res: any) => {
        if (res.data) {
          list.map((item: any) => {
            if (item.companyId == res.data) {
              item.isDefault = true
            } else {
              item.isDefault = false
            }
          })
        }
        state.tableData = list
      })
    }
    const getThumbnailImage = (url: any, thumbnail: any) => {
      return thumbnailImage(url, thumbnail)
    }

    const audit = (e: any) => {
      dialogVisible.value = true
      auditRemark.value = ''
      companyId.value = e.companyId
    }

    const audits = () => {
      companyAudit({
        companyId: companyId.value,
        auditRemark: auditRemark.value,
        auditStatus: auditStatusV.value
      }).then((res) => {
        if (res) {
          if (auditStatusV.value === 1) {
            ElMessage.warning({
              message: '审核未通过',
              type: 'warning'
            })
            dialogVisible.value = false
          } else if (auditStatusV.value === 2) {
            ElMessage.success({
              message: '审核通过',
              type: 'success'
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
      forms: { companyName: '' }
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
      handleCurrentChange,
      getData,
      audits,
      reset,
      audit,
      deletes,
      openAdd,
      getOrganizationAdd,
      getDialogVisible,
      open,
      handleClose,
      getThumbnailImage,
      imgUrl,
      // thumbnailImage,
      total,
      viewInfo,
      pagesize,
      currentPage,
      formTop,
      auditRemark,
      companyId,
      auditStatusV,
      dialogVisible,
      OrganizationAddVue,
      OrganizationAddRef,
      enterpriseExamineRef,
      enterpriseExamineVue,
      ...toRefs(state),
      getDefaultCompany,
      setUpDefault,
      curDefault
    }
  }
})
</script>
<style scoped>
.item-input-label {
  margin-bottom: 10px;
}

.item-input {
  margin-bottom: 10px;
}

:deep(.el-image__preview) .el-image__preview {
  /*height: auto;*/
}

:deep(.el-image__error) {
  font-size: 12px;
  background: #ffffff;
}
</style>
