<template>
  <div class="main-container">
    <el-card shadow="never">
      <el-input
        v-model="keywordsForm.nickName"
        placeholder="请输入用户名称"
      />
      <el-input
        v-model="keywordsForm.mark"
        placeholder="请输入用户标记"
      />
      <el-input
        v-model="keywordsForm.phone"
        type="number"
        maxlength="11"
        placeholder="请输入联系电话"
      />
      <el-select
        v-model="keywordsForm.source"
        placeholder="请选择来源"
      >
        <el-option
          v-for="item in sourcesOptions"
          :key="item"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
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
          type="text"
          icon="View"
          size="large"
          style="margin-right: 2rem"
          @click="viewOverview"
        >
          查看总计
        </el-button>
      </div>
    </el-card>
    <div>
      <el-table
        v-loading="isTableLoading"
        stripe
        :height="tableHeight"
        :data="tableData"
        border
      >
        <el-table-column type="index" width="50" label="序号" />
        <el-table-column label="用户名" width="150" prop="nickName" />
        <el-table-column label="联系电话" width="150" prop="phone" />
        <el-table-column label="用户姓名" width="150" prop="username" />
        <el-table-column label="标记" width="200" prop="mark" />
        <el-table-column
          width="100"
          sortable
          label="分享次数"
          prop="shareCount"
        >
          <template #default="scope">
            <span class="clickable-item" @click="handleClick(scope.row, 4, scope.row.shareCount)">{{ scope.row.shareCount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          sortable
          label="打开次数"
          prop="openCount"
        >
          <template #default="scope">
            <span class="clickable-item" @click="handleClick(scope.row, 5, scope.row.openCount)">{{ scope.row.openCount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          label="注册用户"
          width="100"
          prop="registerCount"
        >
          <template #default="scope">
            <span class="clickable-item" @click="handleClick(scope.row, 1, scope.row.registerCount)">{{ scope.row.registerCount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="注册率(%)" prop="registerRate" />
        <el-table-column
          width="100"
          sortable
          label="下单人数"
          prop="orderMemberCount"
        />
        <!--          <template #default="scope">-->
        <!--            <span class="clickable-item" @click="handleClick(scope.row, 2, scope.row.orderMemberCount)">{{ scope.row.orderMemberCount }}</span>-->
        <!--          </template>-->
        <el-table-column
          width="100"
          sortable
          label="下单量"
          prop="orderCount"
        >
          <template #default="scope">
            <span class="clickable-item" @click="handleClick(scope.row, 2, scope.row.orderCount)">{{ scope.row.orderCount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          sortable
          label="下单金额"
          prop="orderAmount"
        />
        <el-table-column label="人均消费金额" width="100" prop="averageConsumption" />
        <el-table-column label="均单值" prop="averageOrder" />
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
    <el-dialog
      v-if="isShowDialog"
      v-model="isShowDialog"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="dialogTitle"
      width="70%"
      @close="closeDialog"
    >
      <div style="padding: 2rem; height: max-content; min-height: 45vh; max-height: 50vh">
        <!-- 注册用户 -->
        <register-user-table v-if="currentDialogType === 1" :referrer-user-id="currentRow.userId" />
        <!-- 下单记录 -->
        <user-order v-if="currentDialogType === 2" :referrer-user-id="currentRow.userId" />
        <!-- 总计 -->
        <marketing-overview v-if="currentDialogType === 3" />
        <!-- 分享次数 -->
        <share-record v-if="currentDialogType === 4" :referrer-user-id="currentRow.userId" />
        <!-- 打开次数 -->
        <open-record v-if="currentDialogType === 5" :referrer-user-id="currentRow.userId" />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="closeDialog">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { fetch } from '_@/axios-config/axios'
import UserOrder from '_c/MarketingStat/UserOrder.vue'

const keywordsForm = ref({
  nickName: '', // 用户昵称
  phone: '', // 手机号
  referrerUserId: '', // 分享人ID
  source: null, // 来源
  mark: ''
})
const tableData = ref([])
const isTableLoading = ref(false)
const currentPage = ref(1)
const total = ref(0)
const tableHeight = ref(0)
const dialogTitle = ref('')

onMounted(() => {
  getData()
})

const getHeight = () => {
  tableHeight.value = document.documentElement.clientHeight - 210
}

watchEffect(() => {
  getHeight()
  // 增加监听事件，窗口变化时得到高度。
  window.addEventListener('resize', getHeight, false)
})

const currentRow = ref({} as any)
// 1=查看注册用户 2=查看订单 3=查看总计
const currentDialogType = ref(-1)

// 查看总计
const viewOverview = () => {
  currentDialogType.value = 3
  dialogTitle.value = '总计'
  isShowDialog.value = true
}

const isShowDialog = ref(false)

// 点击事件
const handleClick = (row: any, type: number, val: number) => {
  if (Number(val) === 0) return
  currentRow.value = JSON.parse(JSON.stringify(row))
  currentDialogType.value = type
  const user = `(${currentRow.value.nickName}-${currentRow.value.phone})`
  switch (type) {
    case 1:
      dialogTitle.value = '注册用户' + user
      break
    case 2:
      dialogTitle.value = '下单记录' + user
      break
    case 4:
      dialogTitle.value = '分享记录' + user
      break
    case 5:
      dialogTitle.value = '打开记录' + user
      break
    default:
      break
  }
  isShowDialog.value = true
}

// 关闭弹窗
const closeDialog = () => {
  isShowDialog.value = false
  currentDialogType.value = -1
}

// 获取数据
const getData = async () => {
  isTableLoading.value = true
  await fetch({
    url: '/order/bizsharecode/userShareStatistic',
    method: 'get',
    params: {
      ...keywordsForm.value,
      current: currentPage.value,
      size: 20
    }
  }).then((res: any) => {
    if (res.code === 0) {
      isTableLoading.value = false
      tableData.value = res.data.records
      total.value = res.data.total
    }
  })
}

const sourcesOptions = [
  {
    label: '系统',
    value: 0
  },
  {
    label: 'C端',
    value: 1
  },
  {
    label: '服务端',
    value: 2
  },
  {
    label: '企业端',
    value: 3
  },
  {
    label: '智装',
    value: 4
  },
  {
    label: '服务端小程序',
    value: 5
  },
  {
    label: 'C端小程序',
    value: 6
  }
]

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getData()
}

// 重置搜索条件
const handleResetSearch = () => {
  keywordsForm.value = {
    nickName: '',
    phone: '',
    referrerUserId: '',
    source: null,
    mark: ''
  }
  getData()
}
</script>

<style lang="less" scoped>
.main-container {
  .clickable-item {
    color: @mainColor;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    text-decoration: underline;
  }
}

:deep(.el-dialog__body) {
  padding: 0rem !important;
}

.flex-center {
  display: flex;
  align-items: center;
}
</style>
