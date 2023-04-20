<template>
  <div class="container">
    <div class="flex-center">
      <!-- 计费规则 -->
      <counting-rules :type="2" />
    </div>
    <el-card class="el-card--body2">
      <div class="el-card-right">
        <el-button
          type="primary"
          plain
          icon="plus"
          @click="addTemplate"
        >
          新增模版
        </el-button>
      </div>
    </el-card>
    <div class="table-container">
      <el-table
        v-loading="isTableLoading"
        stripe
        style="height: calc(100vh - 55rem) !important; overflow-y: scroll;"
        :data="tableData"
        :height="0"
        border
      >
        <el-table-column type="index" width="50" />
        <el-table-column
          label="模版名称"
          prop="templateName"
          width="200"
        />
        <el-table-column label="入户/安装费规则">
          <template #default="scope">
            {{ getRules(scope.row, 1) }}
          </template>
        </el-table-column>
        <el-table-column label="上楼费规则">
          <template #default="scope">
            {{ getRules(scope.row, 2) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button
              type="text"
              icon="view"
              @click="viewTemplate(scope.row)"
            >查看</el-button>
            <el-button
              type="text"
              icon="edit"
              @click="editTemplate(scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              class="danger"
              icon="delete"
              @click="deleteTemplate(scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination-new
        style="position: fixed;"
        :current-page="+currentPage"
        :page-size="10"
        :total="+total"
        layout="total, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-drawer
      v-model="isShowTemplate"
      size="50%"
      destroy-on-close
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="isViewTemplate ? '查看模版' : isEditTemplate ? '编辑模版' : '新增模版'"
      @close="hideDialog"
    >
      <installation-template-form
        :row="currentRow"
        :is-edit="isEditTemplate"
        :is-add="isAddTemplate"
        :is-view="isViewTemplate"
        @getData="getData"
        @hideDialog="hideDialog"
      />
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { emptyTemplate } from '_c/InstallationTemplate/data'
import { InstallationTemplate } from '_c/InstallationTemplate/types'
import { getInstallationTemplate, deleteInstallationTemplate } from '_c/InstallationTemplate/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import { watchEffect } from 'vue'

const isTableLoading = ref<Boolean>(false)
const currentPage = ref<Number>(1)
const total = ref<Number>(0)
const tableData = ref()

// 是否显示模版弹窗
const isShowTemplate = ref<Boolean>(false)
// 是否是查看模版
const isViewTemplate = ref<Boolean>(false)
// 是否是编辑模版
const isEditTemplate = ref<Boolean>(false)
// 是否是新增模版
const isAddTemplate = ref<Boolean>(false)
// 当前查看/编辑的模版
const currentRow = ref<InstallationTemplate>(emptyTemplate)

onMounted(() => {
  getData()
})

// 获取规则描述
const getRules = (row: any, type: number) => {
  if (type === 1) {
    // 入户/安装费
    switch (row.installationMode) {
      case 1:
        return '计件费用；默认收费：每件' + row.installationFirst.firstAmount + '元'
      case 2:
        return '固定费用；默认收费：' + row.installationFirst.fixedAmount + '元'
      case 3:
        return '免入户/安装费'
      case 4:
        return '自定义协商：' + row.installationFirst.protocol
      default:
        return ''
    }
  } else {
    // 上楼费
    switch (row.stairwayMode) {
      case 1:
        return '计件费用；默认收费：每件每层' + row.stairwayFirst.firstAmount + '元'
      case 2:
        return '固定费用；默认收费：' + row.stairwayFirst.fixedAmount + '元'
      case 3:
        return '免上楼费'
      case 4:
        return '自定义协商：' + row.stairwayFirst.protocol
      default:
        return ''
    }
  }
}

// 关闭查看模版的弹窗
const hideDialog = () => {
  isAddTemplate.value = false
  isViewTemplate.value = false
  isEditTemplate.value = false
  isShowTemplate.value = false
  currentRow.value = JSON.parse(JSON.stringify(emptyTemplate))
}

// 新增模版
const addTemplate = () => {
  currentRow.value = JSON.parse(JSON.stringify(emptyTemplate))
  isShowTemplate.value = true
  isAddTemplate.value = true
  isEditTemplate.value = false
  isViewTemplate.value = false
}

// 查看模版
const viewTemplate = (row: any) => {
  currentRow.value = JSON.parse(JSON.stringify(row))
  isShowTemplate.value = true
  isAddTemplate.value = false
  isEditTemplate.value = false
  isViewTemplate.value = true
}

// 编辑模版
const editTemplate = (row: any) => {
  currentRow.value = JSON.parse(JSON.stringify(row))
  isShowTemplate.value = true
  isAddTemplate.value = false
  isEditTemplate.value = true
  isViewTemplate.value = false
}

// 删除模版
const deleteTemplate = (row: any) => {
  ElMessageBox.confirm(`此操作将永久删除${row.templateName}, 是否继续?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const res: any = await deleteInstallationTemplate(row.templateId)
    if (res && res.code === 0) {
      ElMessage.success('删除成功')
      await getData()
    }
  }).catch(e => {})
}

// 分页查询
const getData = async () => {
  isTableLoading.value = true
  const res: any = await getInstallationTemplate({
    size: 10,
    current: currentPage.value
  })
  if (res && res.code === 0) {
    isTableLoading.value = false
    tableData.value = res.data.records
    total.value = res.data.total
  }
}

// 分页查询下一页
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getData()
}
</script>

<style lang="less" scoped>
.container {
  padding: 2rem;
}

.table-container {
  width: 100%;
  height: calc(100vh - 54rem) !important;
}

.flex-center {
  display: flex;
  align-items: center;
}
</style>
