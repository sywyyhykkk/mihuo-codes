<template>
  <div>
    <el-card shadow="never">
      <el-button
        class="btn-add"
        style="margin-right: 10px"
        size="small"
        type="primary"
        icon="Search"
        @click="handleSearchList()"
      >
        查询
      </el-button>
      <el-button
        style="margin-right: 10px"
        size="small"
        icon="refreshLeft"
        @click="handleResetSearch()"
      >
        重置
      </el-button>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <div>
        <i class="el-icon-tickets" style="margin-top: 5px" />
        <span style="margin-top: 5px">数据列表</span>
      </div>
      <el-button
        v-if="$getPression('express_add')"
        class="btn-add"
        type="primary"
        size="mini"
        style="float: right"
        icon="plus"
        @click="addExpressClicked"
      >
        添加快报
      </el-button>
    </el-card>
    <div style="margin-top: 15px">
      <el-table
        v-loading="loading"
        stripe
        style="width: 100%"
        :data="tableData"
        border
        :height="tableHeight"
      >
        <el-table-column label="序号" type="index" align="center" />
        <el-table-column label="快报编号" prop="expressId" align="center" />
        <el-table-column label="描述" prop="description" align="center" />
        <el-table-column label="昵称" prop="nickName" align="center" />
        <el-table-column label="技能" prop="skillName" align="center" />
        <el-table-column label="金额" prop="price" align="center" />
        <el-table-column label="发布时间" prop="createTime" align="center" />
        <el-table-column label="是否显示" prop="status" align="center">
          <template #default="scope">
            {{ scope.row.status === '0' ? '显示' : '不显示' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center">
          <template #default="scope">
            <el-button
              v-if="$getPression('express_edit')"
              size="mini"
              type="text"
              icon="edit"
              @click="handleUpdateBanner(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="$getPression('express_del')"
              size="mini"
              type="text"
              class="danger"
              icon="delete"
              @click="handleDeleteBanner(scope.row)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination-new
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      v-if="addExpressShow"
      v-model="addExpressShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="isEdit === true ? '编辑快报' : '添加快报'"
    >
      <addExpress
        :is-edit="isEdit"
        :row="selectedRow"
        @hideDialog="hideDialog"
        @getData="getData"
      />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { fetchList, delObj } from '../util/api/express'
import { ElMessage, ElMessageBox } from 'element-plus'
import wsCache from '@/cache'

const addExpressShow = ref<boolean>(false)
const isEdit = ref<boolean>(false)
const tableHeight = ref<any>(0)
const tableData = ref<any>([])
const total = ref<number>(0)
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)
const loading = ref<boolean>(false)
const selectedRow = ref<any>({})
const list = ref<any>([])
const listQuery = ref<any>({})
const cityOperatorId = wsCache.get('cityOperator').id || -1

const getHeight = () => {
  tableHeight.value = document.documentElement.clientHeight - 430
}

watchEffect(() => {
  getHeight()
  // 增加监听事件，窗口变化时得到高度。
  window.addEventListener('resize', getHeight, false)
})

onMounted(() => {
  getData()
})

const getData = async () => {
  addExpressShow.value = false
  await fetchList({
    size: pageSize.value,
    current: currentPage.value,
    cityOperatorId: cityOperatorId,
    ...listQuery.value
  }).then((res) => {
    tableData.value = res.data.records
    total.value = res.data.total
    loading.value = false
  })
}

const handleUpdateBanner = (row: any) => {
  isEdit.value = true
  addExpressShow.value = true
  selectedRow.value = row
}

const addExpressClicked = () => {
  selectedRow.value = {}
  isEdit.value = false
  addExpressShow.value = true
}

const hideDialog = () => {
  addExpressShow.value = false
}

const handleDeleteBanner = async (row: any) => {
  ElMessageBox.confirm(`是否确定要删除此条数据?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await delObj(row.expressId).then((res) => {
      ElMessage.success('删除成功')
      getData()
    })
  })
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getData()
}

const handleSearchList = () => {
  getData()
}

const handleResetSearch = () => {
  getData()
}
</script>

<style scoped lang="less">
.operate-container {
  :deep(.el-card__body) {
    display: flex;
    justify-content: space-between;
  }
}
</style>
