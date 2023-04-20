<template>
  <div class="order-report">
    <div>
      <div class="query-wper">
        <el-space :size="20">
          <el-space :size="10">
            <span>收货地址:</span>
            <el-input
              v-model="address"
              placeholder="请输入收货地址进行查询"
              @keyup.enter="handleQuery"
            />
          </el-space>
          <el-button type="primary" style="width: 80px" @click="handleQuery"
            >查询</el-button
          >
          <el-button style="width: 80px" @click="handleReset">重置</el-button>
        </el-space>
      </div>
    </div>

    <el-table
      border
      stripe
      v-loading="state.loading"
      :data="state.tableData"
      row-style="height: 50px;"
      header-row-style="height: 50px;"
      style="width: 100%"
      :max-height="'calc(100vh - 24rem)'"
    >
      <el-table-column
        prop="name"
        width="200"
        align="center"
        label="订单号/时间"
      >
        <template #default="{ row }">
          <el-button type="text" @click="onGoodsDetail(row)">
            {{ row.orderSn }}</el-button
          >
          <div>{{ row.createTime }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="receiverAddress" width="200" label="收货地址" />
      <el-table-column prop="receiverName" align="center" label="客户姓名" />
      <el-table-column prop="receiverPhone" align="center" label="电话号码" />
      <el-table-column prop="companyName" align="center" label="企业" />
      <el-table-column align="center" label="金额">
        <template #default="{ row }">
          <span>￥{{ getSeparator(row.totalAmount) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :total="state.total"
      :current-page="state.current"
      layout="total, prev, pager, next, jumper"
      @current-change="currentChange"
    />

    <el-dialog
      v-model="dialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :append-to-body="true"
      title="商品详情"
      :before-close="handleClose"
      width="40rem"
    >
      <template v-for="(item, index) in state.goodsList" :key="index">
        <el-divider v-if="index > 0" style="width: calc(100% - 2.4rem)">
          <el-icon><Guide /></el-icon>
        </el-divider>
        <el-form class="oreder-report-form" label-width="12rem" :model="item">
          <el-form-item label="商品名称">
            <el-input v-model="item.productName" readonly />
          </el-form-item>
          <el-form-item label="规格">
            <el-input v-model="item.spec" readonly />
          </el-form-item>
          <el-form-item label="下单数量">
            <el-input v-model="item.productQuantity" readonly />
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="item.serviceNotes"
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              readonly
            />
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="danger" @click="handleClose">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  name: '订单报表',
  components: {},
  setup() {}
})
</script>
<script setup lang="ts">
import { ref } from 'vue'
import { fetch } from '../../axios-config/axios'

const address = ref('')
const dialogVisible = ref(false)

const state = ref({
  loading: false,
  tableData: [],
  total: 0,
  current: 1,
  goodsList: [] as any
})

onMounted(() => {
  fetchData()
})

const fetchData = async () => {
  state.value.loading = true
  try {
    const res: any = await fetch({
      url: '/mall/order/payOrderInfoPage',
      method: 'get',
      params: {
        current: state.value.current,
        address: address.value
      }
    })
    if (res.code === 0) {
      const { total, current, records } = res.data
      state.value.total = Number(total)
      state.value.current = Number(current)
      state.value.tableData = records
    } else {
      throw new Error(res)
    }
    state.value.loading = false
  } catch (error) {
    console.error(error)
    state.value.loading = false
  }
}

const fetchGoodsInfo = async (orderSn: any) => {
  try {
    const res: any = await fetch({
      url: '/mall/order/getOrderItemsByOrderSn',
      method: 'get',
      params: { orderSn }
    })
    if (res.code === 0) {
      state.value.goodsList = res.data
    } else {
      throw new Error(res)
    }
    dialogVisible.value = true
  } catch (error) {
    console.error(error)
  }
}

const onGoodsDetail = (row: any) => {
  fetchGoodsInfo(row.orderSn)
}

const currentChange = (page: any) => {
  state.value.current = page
  fetchData()
}

const handleQuery = () => {
  fetchData()
}

const handleReset = () => {
  address.value = ''
  fetchData()
}

const handleClose = () => {
  dialogVisible.value = false
}

const getSeparator = (value: number) => {
  const reg = /(?!^)(?=(\d{3})+$)/g
  return value
    .toString()
    .replace(/\d+/, (n) => n.replace(reg, ($1) => $1 + ','))
}
</script>

<style scoped lang="less">
.query-wper {
  margin: 2rem 0;
  :deep(.el-input) {
    width: 30rem !important;
  }
}
</style>
