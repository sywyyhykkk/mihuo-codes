<template>
  <div>
    <el-card shadow="never">
      <el-input
        v-model="listQuery.orderSn"
        prefix-icon="Search"
        placeholder="订单编号"
      />
      <el-select
        v-model="listQuery.replyType"
        placeholder="评价方式"
        clearable
      >
        <el-option
          v-for="item in commentTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="listQuery.productScore"
        placeholder="评价等级"
        clearable
      >
        <el-option
          v-for="item in commentLevelOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-button type="primary" icon="Search" @click="handleSearchList()">查询</el-button>
      <el-button @click="handleResetSearch()" icon="refreshLeft">重置</el-button>
    </el-card>

    <div>
      <el-table
        stripe
        style="width: 100%"
        :data="tableData"
        :height="tableHeight"
        v-loading="loading"
        border
      >
        <el-table-column label="订单编号" align="center">
          <template #default="scope">
            {{ scope.row.orderSn }}
          </template>
        </el-table-column>
        <el-table-column label="评价时间" align="center">
          <template #default="scope">
            {{ scope.row.createTime }}
          </template>
        </el-table-column>
        <el-table-column label="用户账号" align="center">
          <template #default="scope">
            {{ scope.row.memberId }}
          </template>
        </el-table-column>
        <el-table-column label="评价方式" align="center">
          <template #default="scope">
            {{ getCommentWay(scope.row.replyType) }}
          </template>
        </el-table-column>
        <el-table-column label="评价等级" align="center">
          <template #default="scope">
            {{ getCommentLevel(scope.row.productScore) }}
          </template>
        </el-table-column>
        <el-table-column label="评价内容" align="center">
          <template #default="scope">
            {{ scope.row.comment }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center">
          <template #default="scope">
            <el-button size="mini" @click="handleShowComment(scope.row)"
            >查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-pagination-new
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      v-model="isShowComment"
      title="评价详情"
      :destroy-on-close="true"
    >
      <div style="height: 60vh; overflow: auto">
        <CommentDetail :comment="selectedRow"></CommentDetail>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRefs,
  unref,
  watchEffect
} from 'vue'
import CommentDetail from '_@/views/orderManagement/commentManagement/commentDetail.vue'
import { getComment } from '_@/api/order'
import wsCache from '@/cache'

export default defineComponent({
  components: { CommentDetail },
  setup() {
    const tableHeight = ref<any>(0)
    const listQueryForm = ref()
    const isShowComment = ref<Boolean>(false)
    const state = reactive<any>({
      tableData: [],
      form: {},
      total: 0,
      pageSize: 10,
      currentPage: 1,
      selectedRow: {},
      loading: false,
      commentTypeOptions: [
        {
          value: 0,
          label: '普通评价'
        },
        {
          value: 1,
          label: '带图评价'
        }
      ],
      commentLevelOptions: [
        {
          value: '1',
          label: '一星'
        },
        {
          value: '2',
          label: '二星'
        },
        {
          value: '3',
          label: '三星'
        },
        {
          value: '4',
          label: '四星'
        },
        {
          value: '5',
          label: '五星'
        }
      ],
      listQuery: {
        orderId: '',
        replyType: '',
        productScore: ''
      }
    })
    const getHeight = () => {
      tableHeight.value = document.documentElement.clientHeight - 190
    }

    watchEffect(() => {
      getHeight()
      // 增加监听事件，窗口变化时得到高度。
      window.addEventListener('resize', getHeight, false)
    })

    onMounted(() => {
      getData()
    })

    const getCommentWay = (way: any) => {
      switch (way as number) {
        case 0:
          return '普通评价'
        case 1:
          return '带图评价'
        default:
          return ''
      }
    }

    const getCommentLevel = (score: any) => {
      switch (score as number) {
        case 1:
          return '一星'
        case 2:
          return '二星'
        case 3:
          return '三星'
        case 4:
          return '四星'
        case 5:
          return '五星'
        default:
          return ''
      }
    }

    const handleCurrentChange = (val: number) => {
      state.currentPage = val
      getData()
    }
    const getData = async () => {
      const companyId = wsCache.get('companys')[0].companyId

      await getComment({
        size: state.pageSize,
        current: state.currentPage,
        companyId,
        ...state.listQuery
      }).then((res: any) => {
        state.tableData = res.data.records
        state.total = res.data.total
        state.loading = false
      })
    }

    const handleSearchList = () => {
      getData()
    }

    const handleChange = (value: any) => {
      for (const key in value) {
        state.listQuery.productCategoryId = value[key]
      }
    }

    const handleResetSearch = () => {
      unref(listQueryForm).resetFields()
      getData()
    }

    const handleShowComment = (row: any) => {
      isShowComment.value = !isShowComment.value
      state.selectedRow = row
    }

    return {
      tableHeight,
      listQueryForm,
      getData,
      handleChange,
      handleSearchList,
      handleResetSearch,
      handleCurrentChange,
      handleShowComment,
      isShowComment,
      getCommentWay,
      getCommentLevel,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
.operate-container {
  :deep(.el-card__body) {
    display: flex;
    justify-content: space-between;
  }
}

.filter-container {
  margin-bottom: 20px;
}
</style>
