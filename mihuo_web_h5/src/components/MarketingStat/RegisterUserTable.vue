<template>
  <div>
    <el-table
      v-loading="isTableLoading"
      stripe
      :data="tableData"
      height="45vh"
      border
    >
      <el-table-column type="index" width="50" label="序号" />
      <el-table-column label="用户名" width="150" prop="nickName" />
      <el-table-column label="联系电话" width="150" prop="phone" />
      <el-table-column label="注册时间" width="150" prop="registerTime" />
      <el-table-column label="注册方式" prop="registerWay" />
      <el-table-column label="来源" prop="source">
        <template #default="scope">
          {{ getSourceTag(scope.row.source) }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination-new
      style="position: relative;"
      :current-page="+currentPage"
      :page-size="10"
      :total="+total"
      layout="total, prev, pager, next, jumper"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { fetch } from '_@/axios-config/axios'

const props = defineProps({
  referrerUserId: {
    type: String,
    default: ''
  }
})
const tableData = ref([])
const isTableLoading = ref(false)
const currentPage = ref(1)
const total = ref(0)

const getData = async () => {
  isTableLoading.value = true
  await fetch({
    url: '/admin/user/getStatisticsPage',
    method: 'get',
    params: {
      referrerUserId: props.referrerUserId,
      current: currentPage.value,
      size: 10
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

const getSourceTag = (source: number) => {
  return sourcesOptions.find(item => item.value === source)!.label
}

onMounted(() => {
  getData()
})
</script>

<style lang="less" scoped>

</style>
