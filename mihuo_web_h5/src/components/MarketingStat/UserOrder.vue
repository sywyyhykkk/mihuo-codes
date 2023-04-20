<template>
  <div>
    <el-table
      v-loading="isTableLoading"
      stripe
      height="45vh"
      :data="tableData"
      border
    >
      <el-table-column type="index" width="50" label="序号" />
      <el-table-column label="商品" width="150" prop="orderItems">
        <template #default="scope">
          {{ scope.row.orderItems[0]?.productName }}
        </template>
      </el-table-column>
      <el-table-column label="规格" width="200" prop="orderItems">
        <template #default="scope">
          {{ getSkuData(scope.row.orderItems[0]?.productAttr) }}
        </template>
      </el-table-column>
      <el-table-column label="单价" prop="orderItems">
        <template #default="scope">
          {{ scope.row.orderItems[0]?.productPrice }}
        </template>
      </el-table-column>
      <el-table-column label="数量" prop="orderItems">
        <template #default="scope">
          {{ scope.row.orderItems[0]?.productQuantity }}
        </template>
      </el-table-column>
      <el-table-column label="总金额" prop="totalAmount" />
      <el-table-column label="下单方式" width="150" prop="sourceType">
        <template #default="scope">
          {{ sourceOptions[scope.row.sourceType] }}
        </template>
      </el-table-column>
      <el-table-column label="下单时间" width="150" prop="createTime" />
      <el-table-column label="订单状态" prop="status">
        <template #default="scope">
          {{ getOrderStatus(scope.row.status, 0)?.text }}
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
import {
  getSkuData,
  getOrderStatus
} from '@/components/orderManagement/order'

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
    url: 'mall/order/page/new',
    method: 'get',
    params: {
      referrerUserId: props.referrerUserId,
      current: currentPage.value,
      cityOperatorFlag: 2,
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

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getData()
}

const sourceOptions = ref({
  0: 'PC订单',
  1: 'App订单',
  2: '供应商订单',
  4: '组合报价订单',
  5: '快速预算订单'
})

onMounted(() => {
  getData()
})
</script>

<style lang="less" scoped>

</style>
