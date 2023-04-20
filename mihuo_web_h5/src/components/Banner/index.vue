<template>
  <div>
    <el-card shadow="never">
      <el-select
        v-model="state.listQuery.clientType"
        placeholder="Banner类型"
        clearable
      >
        <el-option
          v-for="item in state.bannerOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled"
        />
      </el-select>
      <el-select
        v-model="state.listQuery.sizeType"
        placeholder="尺寸类型"
        clearable
      >
        <el-option
          v-for="item in state.sizeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button
        type="primary"
        icon="Search"
        @click="handleSearchList()"
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
          type="primary"
          icon="plus"
          @click="addBannerClick"
        >
          添加Banner
        </el-button>
      </div>
    </el-card>
    <div>
      <el-table
        v-loading="state.loading"
        stripe
        style="width: 100%"
        :height="tableHeight"
        :data="state.tableData"
        border
      >
        <el-table-column
          label="序号"
          type="index"
          align="center"
        />
        <!--        <el-table-column-->
        <!--          label="Banner编号" prop="activityId"-->
        <!--          align="center"-->
        <!--        />-->
        <el-table-column
          label="Banner名称"
          prop="activityName"
          align="center"
        />
        <el-table-column
          label="Banner图片"
          align="center"
          width="120"
        >
          <template #default="scope">
            <el-image
              preview-teleported
              :src="$getUrl.getPicUrl(scope.row.imgUrl, true, true)"
              :preview-src-list="$getUrl.getPicUrl(scope.row.imgUrl)"
              style="width: 100%"
            />
          </template>
        </el-table-column>
        <el-table-column label="平台类型" align="center">
          <template #default="scope">
            {{
              scope.row.clientType === ''
                ? '所有平台'
                : scope.row.clientType === 'capp'
                  ? '客户端'
                  : scope.row.clientType === 'mini'
                    ? '小程序'
                    : scope.row.clientType === 'app'
                      ? '服务端'
                      : '未知'
            }}
          </template>
        </el-table-column>
        <el-table-column label="尺寸类型" align="center">
          <template #default="scope">
            {{
              scope.row.sizeType === 0
                ? '首页横屏'
                : scope.row.sizeType === 1
                  ? '首页竖屏'
                  : scope.row.sizeType === 2
                    ? '首页MINI'
                    : '大屏'
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="链接页面"
          prop="url"
          align="center"
        />
        <el-table-column
          label="描述"
          prop="description"
          align="center"
        />
        <el-table-column
          label="操作"
          fixed="right"
          align="center"
          width="200"
        >
          <template #default="scope">
            <el-button
              v-preventRepeatClick
              size="small"
              type="text"
              icon="edit"
              @click="handleUpdateBanner(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-preventRepeatClick
              size="small"
              type="text"
              class="danger"
              icon="delete"
              @click="handleDeleteBanner(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination-new
        :current-page="state.currentPage"
        :page-size="state.pageSize"
        :total="+state.total"
        layout="total, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
      />
    </div>
    <addBanner
      v-model="addBannerShow"
      :is-edit="isEdit"
      :row="state.selectedRow"
      :client-id="clientId"
      :client-type="state.clientType"
      @hideDialog="hideDialog"
      @getData="getData"
    />
  </div>
</template>

<script setup lang="ts">
import { getDataList, delObj } from '../util/api/banner'
import { ElMessage, ElMessageBox } from 'element-plus'
import wsCache from '@/cache'

const props = defineProps(['protType'])
const clientId = ref('')
switch (props.protType) {
  case '1':
    clientId.value = '0'
    break
  case '2':
    clientId.value = wsCache.get('companys')[0]?.companyId
    break
  case '3':
    clientId.value = wsCache.get('cityOperator')?.id
    break
}

const addBannerShow = ref<boolean>(false)
const isEdit = ref<boolean>(false)
const tableHeight = ref<any>('0')
const state = reactive<any>({
  showCms: '',
  tableData: [],
  form: {},
  currentPage: 1,
  total: 0,
  pageSize: 10,
  pages: 0,
  loading: true,
  bannerOptions: [
    {
      value: '',
      label: '所有平台',
      disabled: props.protType === '2'
    },
    {
      value: 'capp',
      label: '客户端',
      disabled: props.protType === '2'
    },
    {
      value: 'app',
      label: '服务端',
      disabled: props.protType === '2'
    },
    {
      value: 'mini',
      label: '小程序'
    }
  ],
  sizeOptions: [
    {
      value: '',
      label: '全部'
    },
    {
      value: 0,
      label: '首页横屏'
    },
    {
      value: 1,
      label: '首页竖屏'
    },
    {
      value: 2,
      label: '首页MINI'
    },
    {
      value: 3,
      label: '大屏'
    }
  ],
  clientType: props.protType,
  selectedRow: {},
  listQuery: {
    sizeType: '',
    clientType: props.protType === '2' ? 'mini' : '' // 企业端
  }
})

const getHeight = () => {
  tableHeight.value = document.documentElement.clientHeight - 210
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
  addBannerShow.value = false
  await getDataList({
    size: state.pageSize,
    current: state.currentPage,
    ...state.listQuery
  }).then((res) => {
    state.pages = res.data.pages
    state.total = res.data.total
    state.tableData = res.data.records
    state.loading = false
  })
}

const handleUpdateBanner = (row: any) => {
  state.selectedRow = row
  isEdit.value = true
  addBannerShow.value = true
}

const addBannerClick = () => {
  state.selectedRow = {}
  isEdit.value = false
  addBannerShow.value = true
}

const hideDialog = () => {
  addBannerShow.value = false
}

const handleDeleteBanner = (row: any) => {
  ElMessageBox.confirm(`是否确定要删除此条数据?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then((res) => {
    delObj(row.activityId).then((data) => {
      if (data) {
        ElMessage.success('删除成功')
        getData()
      }
    })
  }).catch(e => {
    getData()
  })
}

const handleCurrentChange = (val: number) => {
  if (val) {
    state.currentPage = val
    getData()
  }
}

const handleSearchList = () => {
  getData()
}

const handleResetSearch = () => {
  state.listQuery.clientType = props.protType === '2' ? 'mini' : ''
  state.listQuery.sizeType = ''
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
