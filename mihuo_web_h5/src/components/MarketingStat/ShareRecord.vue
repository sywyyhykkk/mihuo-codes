<template>
  <div>
    <el-table
      v-loading="isTableLoading"
      height="45vh"
      stripe
      :data="tableData"
      border
    >
      <el-table-column type="index" width="50" label="序号" />
      <el-table-column label="页面名称" prop="pageName" />
      <el-table-column label="页面路径" prop="pagePath" />
      <el-table-column label="页面内容" prop="params" />
      <el-table-column label="分享时间" prop="createTime" />
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
    url: '/order/bizsharecode/page',
    method: 'get',
    params: {
      referrerUserId: props.referrerUserId,
      current: currentPage.value,
      type: 2, // 用户分享出去
      size: 15,
      'orders[0].asc': false,
      'orders[0].column': 'id'
    }
  }).then((res: any) => {
    if (res.code === 0) {
      isTableLoading.value = false
      tableData.value = res.data.records
      total.value = res.data.total
    }
  })
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getData()
}

onMounted(() => {
  getData()
})
</script>

<style lang="less" scoped>

</style>
