<template>
  <div class="case-container">
    <el-card shadow="never">
      <el-input
        v-model="keywords"
        placeholder="请输入案例名称"
      />
      <el-button
        type="primary"
        icon="Search"
        @click="getData()"
      >
        查询
      </el-button>
      <el-button
        icon="refreshLeft"
        @click="handleResetSearch()"
      >
        重置
      </el-button>
      <div class="el-card-right">
        <el-button
          v-if="$getPression('case_add')"
          type="primary"
          icon="plus"
          @click="addCaseClick"
        >
          添加案例
        </el-button>
      </div>
    </el-card>
    <div>
      <!-- 案例表格 -->
      <el-table
        v-loading="isTableLoading"
        stripe
        :data="tableData"
        :height="tableHeight"
        border
      >
        <el-table-column type="index" width="50" label="序号" />
        <el-table-column prop="name" label="案例名称" width="200" />
        <el-table-column prop="houseArea" label="面积(m²)" width="100" />
        <el-table-column prop="houseType" label="户型" width="140" />
        <el-table-column prop="houseStyle" label="装修风格" width="160" />
        <el-table-column label="案例图片" width="100">
          <template #default="scope">
            <el-button
              v-if="$getPression('case_edit')"
              type="text"
              icon="picture"
              @click="addCaseImageClick(scope.row)"
            >图片维护</el-button>
          </template>
        </el-table-column>
        <el-table-column label="案例阶段" width="100">
          <template #default="scope">
            <el-button
              v-if="$getPression('case_edit')"
              type="text"
              icon="connection"
              @click="addCaseStageClick(scope.row)"
            >阶段维护</el-button>
          </template>
        </el-table-column>
        <el-table-column label="案例报告" width="100">
          <template #default="scope">
            <el-button
              v-if="$getPression('case_edit')"
              type="text"
              icon="document"
              @click="addSurveyClick(scope.row)"
            >报告维护</el-button>
          </template>
        </el-table-column>
        <el-table-column label="日志/评价" width="180">
          <template #default="scope">
            <el-button
              v-if="$getPression('case_edit')"
              type="text"
              icon="notebook"
              @click="addLogClick(scope.row)"
            >日志</el-button>
            <el-button
              v-if="$getPression('case_edit')"
              type="text"
              icon="comment"
              @click="addCaseCommentClick(scope.row)"
            >评价</el-button>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template #default="scope">
            <el-button
              v-if="$getPression('case_view')"
              type="text"
              icon="view"
              @click="viewCaseClick(scope.row)"
            >查看</el-button>
            <el-button
              v-if="$getPression('case_add')"
              type="text"
              icon="connection"
              @click="copyCaseClick(scope.row)"
            >复制</el-button>
            <!--            <el-button-->
            <!--              v-if="$getPression('case_edit')"-->
            <!--              type="text"-->
            <!--              icon="money"-->
            <!--              @click="groupPriceClick(scope.row)"-->
            <!--            >报价清单</el-button>-->
            <el-button
              v-if="$getPression('case_edit')"
              type="text"
              icon="edit"
              @click="editCaseClick(scope.row)"
            >编辑</el-button>
            <el-button
              v-if="$getPression('case_del')"
              type="text"
              class="danger"
              icon="delete"
              @click="deleteCaseClick(scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination-new
        style="position: fixed;"
        :current-page="+currentPage"
        :page-size="20"
        :total="+total"
        layout="total, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 添加案例表单 -->
    <add-case
      v-if="isShowAddDrawer"
      v-model="isShowAddDrawer"
      :is-add="isAddCase"
      :is-edit="isEditCase"
      :is-copy="isCopy"
      :row="currentRow"
      @getData="getData"
    />
    <!-- 案例图片维护 -->
    <add-case-image
      v-if="isShowImgDrawer"
      v-model="isShowImgDrawer"
      :row="currentRow"
      @getData="getData"
    />
    <!-- 案例报告维护 -->
    <add-case-report
      v-if="isShowReportDrawer"
      v-model="isShowReportDrawer"
      :row="currentRow"
      @getData="getData"
    />
    <!-- 案例日志维护 -->
    <add-case-log
      v-if="isShowLogDrawer"
      v-model="isShowLogDrawer"
      :row="currentRow"
      @getData="getData"
    />
    <!-- 案例阶段维护 -->
    <add-case-stage
      v-if="isShowStageDrawer"
      v-model="isShowStageDrawer"
      :row="currentRow"
      @getData="getData"
    />
    <!-- 案例评价维护 -->
    <add-case-comment
      v-if="isShowCommentDrawer"
      v-model="isShowCommentDrawer"
      :row="currentRow"
      @getData="getData"
    />
    <!-- 报价清单维护 -->
    <!--    <group-pricing-->
    <!--      v-if="isGroupPriceDialog"-->
    <!--      v-model="isGroupPriceDialog"-->
    <!--      :row="currentRow"-->
    <!--      @getData="getData"-->
    <!--    />-->
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCasePage, deleteCaseById } from './api'

const isTableLoading = ref(false)
const tableData = ref([])
const currentPage = ref(1)
const total = ref(0)
const keywords = ref('')

onMounted(() => {
  getData()
})

// 获取案例
const getData = async () => {
  isTableLoading.value = true
  const res = await getCasePage({
    current: currentPage.value,
    name: keywords.value,
    size: 20
  })
  if (res.data) {
    total.value = res.data.total
    tableData.value = res.data.records
    isTableLoading.value = false
  }
}

const tableHeight = ref(0)

const getHeight = () => {
  tableHeight.value = document.documentElement.clientHeight - 210
}

watchEffect(() => {
  getHeight()
  // 增加监听事件，窗口变化时得到高度。
  window.addEventListener('resize', getHeight, false)
})

// 分页查询下一页
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getData()
}

// 重置搜索
const handleResetSearch = () => {
  keywords.value = ''
  getData()
}

// 是否显示案例表单
const isShowAddDrawer = ref(false)
// 是否编辑案例
const isEditCase = ref(false)
// 是否新增案例
const isAddCase = ref(false)
// 当前选中的行
const currentRow = ref({})

// 显示新增案例的表单
const addCaseClick = () => {
  currentRow.value = {}
  isShowAddDrawer.value = true
  isAddCase.value = true
  isEditCase.value = false
}

// 查看案例
const viewCaseClick = (row: any) => {
  currentRow.value = JSON.parse(JSON.stringify(row))
  isShowAddDrawer.value = true
  isAddCase.value = false
  isEditCase.value = false
}

// 是否是复制案例
const isCopy = ref(false)

// 复制案例
const copyCaseClick = (row: any) => {
  currentRow.value = JSON.parse(JSON.stringify(row))
  isShowAddDrawer.value = true
  isCopy.value = true
  isAddCase.value = false
  isEditCase.value = false
}

// 编辑案例
const editCaseClick = (row: any) => {
  currentRow.value = JSON.parse(JSON.stringify(row))
  isShowAddDrawer.value = true
  isAddCase.value = false
  isEditCase.value = true
}

// 删除案例
const deleteCaseClick = (row: any) => {
  ElMessageBox.confirm(`此操作将永久删除${row.name}, 是否继续?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const res: any = await deleteCaseById({
      id: row.id
    })
    if (res && res.code === 0) {
      ElMessage.success('删除成功')
      await getData()
    }
  }).catch(e => {})
}

// 是否显示图片维护弹窗
const isShowImgDrawer = ref(false)

// 维护案例图片
const addCaseImageClick = (row: any) => {
  currentRow.value = JSON.parse(JSON.stringify(row))
  isShowImgDrawer.value = true
}

// 是否显示报告维护弹窗
const isShowReportDrawer = ref(false)

// 案例报告
const addSurveyClick = (row: any) => {
  currentRow.value = JSON.parse(JSON.stringify(row))
  isShowReportDrawer.value = true
}

// 是否显示日志维护弹窗
const isShowLogDrawer = ref(false)

// 维护案例服务日志
const addLogClick = (row: any) => {
  currentRow.value = JSON.parse(JSON.stringify(row))
  isShowLogDrawer.value = true
}

// 是否显示阶段维护弹窗
const isShowStageDrawer = ref(false)

// 维护案例施工阶段
const addCaseStageClick = (row: any) => {
  currentRow.value = JSON.parse(JSON.stringify(row))
  isShowStageDrawer.value = true
}

// 是否显示评价维护弹窗
const isShowCommentDrawer = ref(false)

// 维护案例评价
const addCaseCommentClick = (row: any) => {
  currentRow.value = JSON.parse(JSON.stringify(row))
  isShowCommentDrawer.value = true
}

// 是否显示报价清单维护
const isGroupPriceDialog = ref(false)

// 维护报价清单
const groupPriceClick = (row: any) => {
  currentRow.value = JSON.parse(JSON.stringify(row))
  isGroupPriceDialog.value = true
}
</script>

<style lang="less" scoped>
.case-container {
  padding: 2rem;
}

.table-container {
  width: 100%;
  height: calc(100vh - 51rem) !important;
}

.flex-center {
  display: flex;
  align-items: center;
}
</style>
