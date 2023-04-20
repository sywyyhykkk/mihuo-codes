<template>
  <div>
    <el-card>
      <el-input v-model="formTop.name" placeholder="姓名" />
      <el-input v-model="formTop.phone" placeholder="联系电话" />
      <el-select v-model="formTop.auditStatus" placeholder="审核状态">
        <el-option
          v-for="item in [
            { value: 0, label: '待审核' },
            { value: 1, label: '审核失败' },
            { value: 2, label: '审核通过' }
          ]"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <el-button type="primary" icon="search" @click="getData">查询 </el-button>
      <el-button icon="refreshLeft" @click="reset">重置 </el-button>
    </el-card>
    <el-table
      v-loading="loading"
      stripe
      :data="tableData"
      border
      height="'0'"
      style="width: 100%; height: calc(100vh - 23rem) !important"
    >
      <el-table-column label="序号" type="index" align="center" width="50" />
      <el-table-column prop="name" label="姓名" align="center" />
      <el-table-column prop="phone" label="联系电话" align="center" />
      <el-table-column prop="jobCode" label="岗位" align="center" width="200">
        <template #default="scope">
          <el-tag v-if="scope.row.jobCode" type="success"
            >{{ scope.row.skillName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="routeTypeName === '工人'"
        align="center"
        prop="skillName"
        label="工种"
      />
      <el-table-column prop="skillYearNum" label="从业年限" align="center" />
      <el-table-column prop="workType" label="工作类型" align="center">
        <template #default="scope">
          {{ getWorkType(scope.row.workType) }}
        </template>
      </el-table-column>
      <el-table-column
        label="资格证书"
        prop="certificateImage"
        align="center"
        width="100"
      >
        <template #default="scope">
          <el-image
            fit="cover"
            class="experience-image"
            v-if="scope.row.certificateImage"
            preview-teleported
            lazy
            :src="
              $getUrl.getPicUrl(getImg(scope.row.certificateImage).url, true)[0]
            "
            :preview-src-list="getImg(scope.row.certificateImage).images"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="项目经历"
        prop="projectImage"
        align="center"
        width="100"
      >
        <template #default="scope">
          <el-image
            fit="cover"
            class="experience-image"
            v-if="scope.row.projectImage"
            preview-teleported
            lazy
            :src="
              $getUrl.getPicUrl(getImg(scope.row.projectImage).url, true)[0]
            "
            :preview-src-list="getImg(scope.row.projectImage).images"
          />
        </template>
      </el-table-column>
      <el-table-column prop="selfIntroduce" label="自我介绍" align="center" />
      <el-table-column prop="auditStatus" label="审核状态" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.auditStatus === 2" type="success"
            >审核通过
          </el-tag>
          <el-tag v-if="scope.row.auditStatus === 1" type="danger"
            >审核失败
          </el-tag>
          <el-tag v-if="scope.row.auditStatus === 0" type="warning"
            >待审核
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否可接单" align="center">
        <template #default="{ row }">
          <span>{{ row.orderStatus === 1 ? '可接单' : '不能接单' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="200">
        <template #default="scope">
          <el-button
            type="text"
            size="small"
            icon="el-icon-view"
            @click="open(scope.row)"
            >查看
          </el-button>
          <!-- <el-button
            :disabled="scope.row.auditStatus !== 2 ? false : true"
            type="text"
            icon="edit"
            :style="scope.row.auditStatus !== 2 ? 'color: red' : ''"
            size="small"
            @click="audit(scope.row)"
          >
            审核
          </el-button> -->
          <el-button
            type="text"
            icon="edit"
            size="small"
            @click="audit(scope.row)"
          >
            审核
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination-new
      :current-page="currentPage"
      :page-size="pagesize"
      :total="+total"
      @current-change="handleCurrentChange"
    />
    <enterpriseExamineVue
      v-if="enterpriseExamineVue"
      ref="enterpriseExamineRef"
      :form="forms"
    />
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
            :clearable="clearable"
            :autosize="{ minRows: 2, maxRows: 4 }"
            show-word-limit
          />
        </div>
      </div>
      <el-space :size="30">
        <el-radio-group v-model="auditStatusV">
          <el-radio :label="1">审核未通过</el-radio>
          <el-radio :label="2">审核通过</el-radio>
        </el-radio-group>
        <el-space>
          <el-switch
            v-model="orderStatus"
            :active-value="1"
            :inactive-value="2"
          />
          <span>{{ orderStatus === 1 ? '可接单' : '不能接单' }}</span>
        </el-space>
      </el-space>
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
import { imageGlobal } from '@/global'

export default defineComponent({
  name: '项目经理审核',
  components: {
    enterpriseExamineVue
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
    const pagesize = ref<number>(15)
    const route = useRoute() // 第一步
    const handleCurrentChange = (val: number) => {
      currentPage.value = val
      getData()
    }
    const orderStatus = ref(1)

    const getImg = (imgList: any) => {
      if (!imgList) return ''
      let images = []
      let url
      try {
        const arr = JSON.parse(imgList)
        images = arr.map((item: { url: any }) => imageGlobal + item.url)
        url = arr[0].url
      } catch (e) {
        imgList.split(',').forEach((item: string) => {
          images.push(imageGlobal + item)
        })
        url = images[0]
      }
      return { url, images }
    }

    const getWorkType = (type: string) => {
      switch (type) {
        case '0':
          return '全职'
        case '1':
          return '兼职'
        default:
          return type
      }
    }

    const routeType = () => {
      switch (route.path) {
        case '/business/artificial':
          routeTypeName.value = '工人'
          roleType.value = 'R_WORKER'
          state.jobCode = 'JOB_WORKER'
          break
        case '/business/manager':
          routeTypeName.value = '项目经理'
          roleType.value = 'R_PROJECT_MANAGER'
          state.jobCode = 'JOB_MANAGER'
          break
        case '/business/supervision':
          routeTypeName.value = '监理'
          roleType.value = 'R_PROJECT_SUPERVISION'
          state.jobCode = 'JOB_SUPERVISION'
          break
        case '/business/designer':
          routeTypeName.value = '设计师'
          roleType.value = 'R_PROJECT_DESIGNER'
          state.jobCode = 'JOB_DESIGNER'
          break
      }
    }

    const initForm = () => {
      return {
        name: '',
        phone: '',
        auditStatus: ''
      }
    }

    const formTop = reactive(initForm())

    const reset = () => {
      Object.assign(formTop, initForm())
      getData()
    }

    const getData = async () => {
      const res = await workers({
        size: pagesize.value,
        current: currentPage.value,
        code: state.jobCode, // 这里接口用的是code
        source: '',
        ...formTop
      })
      if (res) {
        state.tableData = res.data.records
        state.loading = false
        total.value = res.data.total
      }
    }

    const getJobCode = (jobCode: string) => {
      const jobCodeArr = ['WORKER', 'MANAGER', 'SUPERVISION', 'DESIGNER']
      let flag = ''
      for (const job of jobCodeArr) {
        if (jobCode.includes(job)) {
          flag = job
          if (flag === 'SUPERVISION') {
            return '项目监理'
          } else if (flag === 'DESIGNER') {
            return '设计师'
          } else if (flag === 'MANAGER') {
            return '项目经理'
          } else {
            return '工人'
          }
        }
      }
    }

    const audit = (evt: any) => {
      dialogVisible.value = true
      auditRemark.value = ''
      auditStatusV.value = evt.auditStatus // 默认不通过
      personId.value = evt.personId
      orderStatus.value = evt.orderStatus
    }

    const audits = () => {
      workersAudit({
        auditRemark: auditRemark.value,
        auditStatus: auditStatusV.value,
        personId: personId.value,
        orderStatus: orderStatus.value
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
      routeType()
      getData()
    })

    const getDialogVisible = () => {
      setTimeout(() => {
        enterpriseExamineVue.value = false
      }, 300)
    }

    const state = reactive({
      jobCode: '',
      tableData: [],
      loading: true,
      forms: { companyName: '' }
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
      getWorkType,
      getImg,
      reset,
      getData,
      audits,
      audit,
      getDialogVisible,
      open,
      handleCurrentChange,
      handleClose,
      routeType,
      getJobCode,
      orderStatus,
      ...toRefs(state)
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

.user-header {
  cursor: pointer;
}

:deep(.el-image__error) {
  font-size: 12px;
  background: #ffffff;
}
</style>
