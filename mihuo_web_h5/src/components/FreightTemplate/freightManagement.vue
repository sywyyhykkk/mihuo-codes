<template>
  <div class="freight-container">
    <div class="flex-center">
      <!-- 计费规则 -->
      <counting-rules :type="1" />
      <!-- 配送时长 -->
      <delivery-duration />
    </div>
    <el-card class="el-card--body2">
      <div class="el-card-right">
        <el-button
          v-if="$getPression('freightTemplate_add')"
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
        <el-table-column label="模版名称" prop="templateName" />
        <el-table-column label="运费规则">
          <template #default="scope">
            {{ getRules(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button
              v-if="$getPression('freightTemplate_view')"
              type="text"
              icon="view"
              @click="viewTemplate(scope.row)"
            >查看</el-button>
            <el-button
              v-if="$getPression('freightTemplate_edit')"
              type="text"
              icon="edit"
              @click="editTemplate(scope.row)"
            >编辑</el-button>
            <el-button
              v-if="$getPression('freightTemplate_del')"
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
      <freight-template-form
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { FreightTemplate } from '_c/FreightTemplate/types'
import { emptyTemplate } from '_c/FreightTemplate/data'
import { getFreightTemplate, deleteFreightTemplate } from '_c/FreightTemplate/api'

const isTableLoading = ref<Boolean>(false)
const currentPage = ref<Number>(1)
const total = ref<Number>(0)
const tableData = ref<FreightTemplate[]>()

onMounted(() => {
  getData()
})

// 分页查询
const getData = async () => {
  isTableLoading.value = true
  const res: any = await getFreightTemplate({
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

// 是否显示模版弹窗
const isShowTemplate = ref<Boolean>(false)
// 是否是查看模版
const isViewTemplate = ref<Boolean>(false)
// 是否是编辑模版
const isEditTemplate = ref<Boolean>(false)
// 是否是新增模版
const isAddTemplate = ref<Boolean>(false)
// 当前查看/编辑的模版
const currentRow = ref<FreightTemplate>(emptyTemplate)

// 新增模版
const addTemplate = () => {
  currentRow.value = JSON.parse(JSON.stringify(emptyTemplate))
  isAddTemplate.value = true
  isViewTemplate.value = false
  isEditTemplate.value = false
  isShowTemplate.value = true
}

// 查看模版
const viewTemplate = (row: FreightTemplate) => {
  currentRow.value = JSON.parse(JSON.stringify(row))
  isAddTemplate.value = false
  isViewTemplate.value = true
  isEditTemplate.value = false
  isShowTemplate.value = true
}

// 编辑模版
const editTemplate = (row: FreightTemplate) => {
  currentRow.value = JSON.parse(JSON.stringify(row))
  isAddTemplate.value = false
  isViewTemplate.value = false
  isEditTemplate.value = true
  isShowTemplate.value = true
}

// 删除模版
const deleteTemplate = (row: FreightTemplate) => {
  ElMessageBox.confirm(`此操作将永久删除${row.templateName}, 是否继续?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const res: any = await deleteFreightTemplate(row.templateId)
    if (res && res.code === 0) {
      ElMessage.success('删除成功')
      await getData()
    }
  }).catch(e => {})
}

// 关闭查看模版的弹窗
const hideDialog = () => {
  isAddTemplate.value = false
  isViewTemplate.value = false
  isEditTemplate.value = false
  isShowTemplate.value = false
  currentRow.value = JSON.parse(JSON.stringify(emptyTemplate))
}

// 获取规则描述
const getRules = (row: any) => {
  switch (row.freightMode) {
    case 1:
      return row.firstFreight.firstCases + '件以内，' + row.firstFreight.firstAmount + '元，每增加' + row.firstFreight.secondCases + '件，增加' + row.firstFreight.secondAmount + '元'
    case 2:
      return '固定运费' + row.firstFreight.fixedAmount + '元'
    case 3:
      return '卖家包邮'
    case 4:
      return '自定义协商：' + row.firstFreight.protocol
    default:
      return ''
  }
}
</script>

<style lang="less" scoped>
.freight-container {
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
