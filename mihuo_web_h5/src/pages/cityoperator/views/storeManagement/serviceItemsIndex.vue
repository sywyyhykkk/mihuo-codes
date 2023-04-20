<template>
  <el-container>
    <el-header class="header">
      <el-input
        clearable
        v-model="searchQuery.userName"
        :prefix-icon="Search"
        placeholder="请输入发布者"
      />
      <el-select v-model="searchQuery.verifyStatus" placeholder="审核状态">
        <el-option label="未审核" :value="0"></el-option>
        <el-option label="审核通过" :value="1"></el-option>
        <el-option label="审核不通过" :value="2"></el-option>
      </el-select>
      <el-button type="primary" icon="Search" @click="search">查询</el-button>
      <el-button icon="RefreshLeft" @click="reset">重置</el-button>
    </el-header>
    <el-main>
      <el-table
        border
        align="center"
        :data="tableData"
        v-loading="loading"
        :height="'calc(100vh - 22rem)'"
        :cell-style="{ 'text-align': 'center' }"
        :header-cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column prop="prop" label="编号" type="index" />
        <el-table-column prop="userName" label="发布者" />
        <el-table-column prop="created" label="发布时间" sortable />
        <el-table-column prop="title" label="服务标题"> </el-table-column>
        <el-table-column prop="coverImg" label="服务主图">
          <template #default="scope">
            <el-image
              v-if="setShowFile(scope.row.coverImg)[0]?.type === 'img'"
              style="width: 10rem; height: 10rem"
              preview-teleported
              lazy
              fit="cover"
              :src="scope.row.coverImg ? imgSrcList(scope.row.coverImg)[0] : ''"
              :preview-src-list="
                scope.row.coverImg ? imgSrcList(scope.row.coverImg) : ''
              "
            >
            </el-image>
            <video
              v-if="setShowFile(scope.row.coverImg)[0]?.type === 'video'"
              :src="
                $getUrl.getPicUrl(
                  setShowFile(scope.row.coverImg)[0]?.url,
                  false
                )
              "
              style="width: 130px; height: 80px; margin-right: 1rem"
              autoplay="false"
              controls
              muted
            />
          </template>
        </el-table-column>
        <el-table-column prop="price" label="服务价格">
          <template #default="scope">
            <span v-if="scope.row.price"
              >￥{{ scope.row.price.toFixed(2) + '/' + scope.row.unit }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="content" label="服务内容" />
        <el-table-column prop="address" label="服务区域"></el-table-column>
        <el-table-column prop="verifyStatus" label="审核状态">
          <template #default="scope">
            <el-tag type="warning" v-if="scope.row.verifyStatus == 0"
              >未审核</el-tag
            >
            <el-tag type="success" v-if="scope.row.verifyStatus == 1"
              >审核通过</el-tag
            >
            <el-tag type="danger" v-if="scope.row.verifyStatus == 2"
              >审核未通过</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="verifyReason" label="原因"> </el-table-column>
        <el-table-column prop="updated" label="最后操作时间"> </el-table-column>
        <el-table-column prop="updateByName" label="最后操作者">
        </el-table-column>
        <el-table-column prop="prop" label="操作" fixed="right">
          <template #default="scope">
            <el-button type="text" @click="seeDetail(scope.row.id)">
              查看
            </el-button>
            <el-button
              type="text"
              :disabled="scope.row.verifyStatus == 2"
              @click="audit(scope.row)"
            >
              审核
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-pagination-new
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
      />
    </el-footer>
    <!-- 查看详情 -->
    <ServiceDetail v-model="serviceDetailShow" :id="rowId" />
    <!-- 审核 -->
    <AuditDialog
      v-if="auditShow"
      v-model="auditShow"
      @submitForm="submitForm"
      :rowData="rowData"
    />
  </el-container>
</template>

<script lang="ts">
import AuditDialog from './components/auditDialog.vue'
import ServiceDetail from './components/serviceDetail.vue'
import { imgSrcList } from '@/utils/utils'
import { bottom } from '@antv/x6/lib/registry/port-layout/line'
import { defineComponent, reactive, toRefs, onMounted, ref, watch } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { async } from '@antv/x6/lib/registry/marker/async'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: '服务项目审核',
  components: {
    AuditDialog,
    ServiceDetail
  },
  setup() {
    const loading = ref<boolean>(false)
    const state = reactive({
      rowData: {},
      auditShow: false,
      serviceDetailShow: false,
      searchQuery: {},
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      id: '',
      rowId: ''
    })

    // 列表默认显示第一个
    const setShowFile = (file: any) => {
      let urls: any = [],
        arr: any = []
      if (file != '') {
        urls = JSON.parse(file)
      }
      if (!urls) return []
      urls.forEach((item: any) => {
        arr.push({
          type: item.type,
          url: item.url
        })
      })
      return arr
    }

    //审核
    const audit = (row: any) => {
      state.rowData = row
      state.auditShow = true
      state.id = row.id
    }

    //查看
    const seeDetail = (id: any) => {
      state.rowId = id
      state.serviceDetailShow = true
    }

    //审核提交
    const submitForm = async (formData: any) => {
      await fetch({
        url: '/mall/pmsserviceitems/updateByVerify',
        method: 'post',
        data: {
          id: state.id,
          ...formData
        }
      }).then((res: any) => {
        if (res.code == 0) {
          ElMessage.success('操作成功')
          state.auditShow = false
          getData()
        }
      })
    }

    const handleCurrentChange = (val: number) => {
      state.currentPage = val
      getData()
    }

    const reset = () => {
      state.searchQuery = {}
      getData()
    }

    const search = () => {
      getData()
    }

    const getData = async () => {
      loading.value = true
      await fetch({
        url: '/mall/pmsserviceitems/pageForAdmin',
        method: 'get',
        params: {
          current: state.currentPage,
          size: state.pageSize,
          status: 1,
          ...state.searchQuery
        }
      })
        .then((res: any) => {
          if (res.code == 0) {
            state.tableData = res.data.records
            state.total = res.data.total
          }
        })
        .finally(() => (loading.value = false))
    }

    onMounted(() => {
      getData()
    })

    return {
      setShowFile,
      seeDetail,
      submitForm,
      audit,
      imgSrcList,
      loading,
      reset,
      search,
      getData,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
.header {
  display: flex;
  align-items: flex-end;
  .el-input,
  .el-select {
    width: 20rem;
    margin-right: 2rem;
  }
}
</style>
