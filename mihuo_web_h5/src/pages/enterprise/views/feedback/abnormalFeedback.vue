<template>
  <div>
    <el-card shadow="never">
      <el-input
        v-model="listQuery.code"
        style="width: 203px"
        prefix-icon="Search"
        placeholder="订单编号"
        @change="handleSearchList()"
      />
<!--      <el-button-->
<!--        class="btn-add"-->
<!--        style="margin-right: 10px"-->
<!--        size="small"-->
<!--        type="primary"-->
<!--        icon="Search"-->
<!--        @click=""-->
<!--      >-->
<!--        查询结果-->
<!--      </el-button>-->
<!--      <el-button-->
<!--        style="margin-right: 10px"-->
<!--        size="small"-->
<!--        icon="refreshLeft"-->
<!--        @click="handleResetSearch()"-->
<!--      >-->
<!--        重置-->
<!--      </el-button>-->
    </el-card>
    <div style="margin-top: 15px">
      <el-table
        stripe
        v-loading="loading"
        style="width: 100%"
        :data="tableData"
        :height="tableHeight"
        border
      >
        <el-table-column
          label="订单编号"
          prop="requirementDesc"
          align="center"
        />
        <el-table-column label="反馈内容" align="center">
          <template #default="scope">
            <el-image
              preview-teleported
              :src="$getUrl.getPicUrl(scope.row.imgUrl, true, true)"
              :preview-src-list="$getUrl.getPicUrl(scope.row.imgUrl)"
              style="height: 80px; width: 80px"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="反馈描述"
          prop="requirementDesc"
          align="center"
        />
        <el-table-column label="创建时间" prop="created" align="center" />
        <el-table-column label="操作" fixed="right" align="center">
          <template #default="scope">
            <el-button
              size="mini"
              icon="edit"
              type="text"
              @click="handleUpdateBanner(scope.row)"
            >
              编辑
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
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRefs,
  watchEffect,
} from 'vue'
import { bizOrderFeedbackPage } from '_@/api/feedback'

export default defineComponent({
  components: {},
  setup() {
    const state = reactive<any>({
      tableData: [],
      form: {},
      currentPage: 1,
      total: 0,
      pageSize: 10,
      listQuery: {
        code: '',
      },
    })
    const tableHeight = ref<any>(0)

    const getHeight = () => {
      tableHeight.value = document.documentElement.clientHeight - 230
    }

    watchEffect(() => {
      getHeight()
      // 增加监听事件，窗口变化时得到高度。
      window.addEventListener('resize', getHeight, false)
    })

    onMounted(() => {
      getData()
    })

    const handleCurrentChange = (val: number) => {
      state.currentPage = val
      getData()
    }

    const handleUpdateBanner = () => {}

    const handleSearchList = () => {
      getData()
    }

    const getData = async () => {
      await bizOrderFeedbackPage({
        size: state.pageSize,
        current: state.currentPage,
        ...state.listQuery,
      }).then((res) => {
        state.tableData = res.data.records
        state.total = res.data.total
        state.loading = false
      })
    }
    return {
      tableHeight,
      getData,
      handleCurrentChange,
      handleUpdateBanner,
      handleSearchList,
      ...toRefs(state),
    }
  },
})
</script>

<style scoped lang="less">
</style>
