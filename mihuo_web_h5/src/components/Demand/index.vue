<template>
  <div>
    <el-card>
      <el-input v-model="formTop.customerName" placeholder="姓名" />
      <el-input v-model="formTop.customerPhone" placeholder="联系电话" />
      <el-select v-model="formTop.verifyStatus" placeholder="审核状态">
        <el-option
          v-for="item in [
            { value: 0, label: '待审核' },
            { value: 1, label: '审核通过' },
            { value: 2, label: '审核未通过' }
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
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="50"
      />
      <el-table-column prop="customerName" label="姓名" align="center" />
      <el-table-column prop="customerPhone" label="联系电话" align="center" />
      <el-table-column
        prop="created"
        label="发布时间"
        align="center"
        width="200"
      >
        <template #default="scope">
          {{ scope.row.created }}
        </template>
      </el-table-column>

      <el-table-column
        label="施工地点"
        prop="districtName,poiName"
        align="center"
      >
        <template #default="scope">
          {{ scope.row.districtName + scope.row.poiName }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="描述" align="center" />
      <el-table-column prop="endDate" label="过期状态" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.endDate" :type="getStatus(scope.row.endDate)?.type">
            {{ getStatus(scope.row.endDate)?.text }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="auditStatus" label="审核状态" align="center">
        <template #default="scope">
          <el-tag
            v-if="scope.row.verifyStatus === 1"
            type="success"
          >审核通过
          </el-tag>
          <el-tag
            v-if="scope.row.verifyStatus === 2"
            type="danger"
          >审核未通过
          </el-tag>
          <el-tag
            v-if="scope.row.verifyStatus === 0"
            type="warning"
          >待审核
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        align="center"
        width="230"
      >
        <template #default="scope">
          <el-button
            type="text"
            size="small"
            icon=""
            @click="open(scope.row)"
          >查看
          </el-button>
          <el-button
            :disabled="scope.row.publishStatus !== 1 && scope.row.verifyStatus !== 2 ? false : true"
            type="text"
            size="small"
            icon=""
            @click="setShelf('upShelf', scope.row)"
          >上架
          </el-button>
          <el-button
            :disabled="scope.row.publishStatus === 1 ? false : true"
            type="text"
            size="small"
            icon=""
            @click="setShelf('downShelf', scope.row)"
          >下架
          </el-button>
          <el-button
            :disabled="scope.row.verifyStatus === 0 ? false : true"
            type="text"
            icon="edit"
            :style="scope.row.verifyStatus === 0 ? 'color: red' : ''"
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
    <demandDetailDialog
      v-if="enterpriseExamineVue"
      ref="enterpriseExamineRef"
      v-model="enterpriseExamineVue"
      :row="forms"
      @getData="getData"
      @hideDialog="hideDialog"
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

      <el-radio-group v-model="auditStatusV">
        <el-radio :label="1">审核通过</el-radio>
        <el-radio :label="2">审核未通过</el-radio>
      </el-radio-group>

      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="audits()">确 定</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getDemandPage,
  auditsDemand,
  upDownShelf
} from '@/pages/cityoperator/api/demand'
import { useRoute } from 'vue-router'
import { imageGlobal } from '@/global'
import wsCache from '@/cache'

export default defineComponent({
  setup() {
    const cityOperatorId = ref(wsCache.get('cityOperator')?.id)
    const enterpriseExamineRef = ref<HTMLElement | null>(null)
    const enterpriseExamineVue = ref<boolean>(false)
    const clearable = ref<boolean>(true)
    const dialogVisible = ref<boolean>(false)
    const auditStatusV = ref<number | undefined>(1)
    const auditId = ref<number | undefined>(0)
    const auditRemark = ref<string>('')
    const total = ref<number>(0)
    const currentPage = ref<number>(1)
    const pagesize = ref<number>(15)
    const route = useRoute() // 第一步
    const handleCurrentChange = (val: number) => {
      currentPage.value = val
      getData()
    }

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

    const initForm = () => {
      return {
        customerName: '',
        customerPhone: '',
        verifyStatus: ''
      }
    }

    const formTop = reactive(initForm())

    const reset = () => {
      Object.assign(formTop, initForm())
      getData()
    }

    const getData = async () => {
      const res = await getDemandPage({
        size: pagesize.value,
        current: currentPage.value,
        cityOperatorId: cityOperatorId.value,
        ...formTop
      })
      if (res) {
        state.tableData = res.data.records
        state.loading = false
        total.value = res.data.total
      }
    }

    const audit = (e: any) => {
      dialogVisible.value = true
      auditRemark.value = ''
      auditStatusV.value = 1 // 默认不通过
      auditId.value = Number(e.id)
    }

    const audits = () => {
      auditsDemand({
        id: auditId.value,
        verifyReason: auditRemark.value,
        verifyStatus: auditStatusV.value
      }).then((res) => {
        if (res) {
          if (auditStatusV.value === 2) {
            ElMessage.warning({
              message: '审核未通过',
              type: 'warning'
            })
          } else if (auditStatusV.value === 1) {
            ElMessage.success({
              message: '审核通过',
              type: 'success'
            })
          }
          dialogVisible.value = false
          getData()
        }
      })
    }

    const upAndDownShelf = (type: string, row: any) => {
      upDownShelf({
        id: row.id,
        publishStatus: type !== 'upShelf' ? 0 : 1
      }).then((res: any) => {
        if (res && res.code == 0) {
          ElMessage({
            type: 'success',
            message: type !== 'upShelf' ? '下架成功!' : '上架成功'
          })
        }
        getData()
      })
    }

    // 获取需求过期状态
    const getStatus = (endTime: string) => {
      console.log(Date.parse(endTime), Date.now())
      return Date.parse(endTime) > Date.now() ? {
        text: '未过期',
        type: 'success'
      } : {
        text: '已过期',
        type: 'danger'
      }
    }

    const setShelf = (type: string, row: any) => {
      if (type !== 'upShelf') {
        ElMessageBox.confirm(`确定要下架吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          upAndDownShelf(type, row)
        })
      } else {
        upAndDownShelf(type, row)
      }
    }

    onMounted(() => {
      getData()
    })

    const state = reactive({
      jobCode: '',
      tableData: [],
      loading: true,
      forms: {}
    })

    const hideDialog = () => {
      enterpriseExamineVue.value = false
    }

    const open = (e: any) => {
      enterpriseExamineVue.value = true
      state.forms = e
    }

    const handleClose = () => {
      dialogVisible.value = false
    }

    return {
      cityOperatorId,
      formTop,
      total,
      pagesize,
      auditId,
      auditRemark,
      clearable,
      auditStatusV,
      dialogVisible,
      currentPage,
      enterpriseExamineRef,
      enterpriseExamineVue,
      route,
      hideDialog,
      getWorkType,
      getImg,
      reset,
      getData,
      setShelf,
      upAndDownShelf,
      audits,
      audit,
      open,
      handleCurrentChange,
      handleClose,
      getStatus,
      ...toRefs(state)
    }
  }
})
</script>
<style scoped>
.item-input-label {
  margin: 10px 0;
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
