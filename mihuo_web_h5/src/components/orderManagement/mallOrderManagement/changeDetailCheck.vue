<template>
  <el-drawer
    v-model="checkShow"
    title="变更金额"
    direction="rtl"
    @close="closeHandelDrawer"
    size="40rem"
  >
    <div class="">
      <el-table
        stripe
        :data="tableData"
        :height="'0'"
        v-loading="loading"
        border
        row-key="id"
        size="small"
        :row-class-name="tableRowClassName"
        default-expand-all
      >
        <el-table-column label="变更单编号" width="350" header-align="center">
          <template #default="scope"> </template>
        </el-table-column>
        <el-table-column
          label="变更事项"
          width="180"
          align="center"
          prop="source"
        >
          <template #default="scope">
            <div v-if="!scope.row.orderItems">
              {{ getPriceWay(scope.row.priceWay) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="变更图片"
          width="180"
          align="center"
          prop="price"
        />
        <el-table-column
          label="变更项"
          width="180"
          align="center"
          prop="skillName"
        />
        <el-table-column
          label="变更金额"
          width="180"
          align="center"
          prop="expectDate"
        />
        <el-table-column
          label="状态"
          header-align="center"
          prop=""
          width="100"
          align="center"
        >
          <template #default="scope">
            <div
              v-if="!scope.row.orderItems"
              @click="handelClick('变更金额', scope.row)"
              :class="{
                'change-amount-positive':
                  Number(scope.row.changeAmount || 0) > 0,
                'change-amount-minus': Number(scope.row.changeAmount || 0) < 0
              }"
            >
              {{
                Number(scope.row.changeAmount || 0) > 0
                  ? '+'
                  : Number(scope.row.changeAmount || 0) < 0
                  ? '-'
                  : ''
              }}
              ￥{{ scope.row.changeAmount?.toFixed(2) || 0 }}
              {{ scope.row.changedList?.length }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="合计金额"
          header-align="center"
          prop=""
          width="100"
          align="center"
        >
          <template #default="scope">
            <div v-if="!scope.row.orderItems" class="total-amount">
              ￥{{ scope.row.totalAmount }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import {
  defineEmits,
  defineProps,
  reactive,
  onMounted,
  watchEffect,
  ref
} from 'vue'
import { fetch } from '_@/axios-config/axios'

import {
  getDeliveryType,
  getSkuData,
  getSourceType,
  openIM,
  getPayType,
  getDeliveryStatus,
  getRefundStatus,
  getOrderStatus
} from '@/components/orderManagement/order'
import { ElMessage, ElMessageBox } from 'element-plus'
import { customStep } from '@/components/orderManagement/mallOrderManagement/allOrder'

const props = defineProps({
  modelValue: {
    //控制抽屉是否显示
    type: Boolean,
    default: false
  },
  orderId: {
    //订单id
    type: String || Number,
    default: 0
  },
  data: {
    //row
    type: Object,
    default: {}
  },
  orderData: {
    type: Object,
    default: () => ({})
  },
  orderType: {
    //订单类型0商品订单，1服务订单，2协作订单，3用户订单
    type: String || Number,
    default: 0
  }
})
console.log(props)
const emit = defineEmits(['getData'])
const buyersRemindShow = ref<boolean>(false) //新增给买家的提醒//关闭订单
const isRemindType = ref<boolean>(true) //是否买家的提醒,true买家提醒，false关闭订单
const buyersRemindCheckShow = ref<boolean>(false) //给买家的提醒查看
const editRecordShow = ref<boolean>(false) //订单修改记录
const checkShow = ref<boolean>(false)

const state = reactive({
  orderData: [] as any,
  bizOrder: {} as any
})
//信息
const getDetailOrder = async () => {
  await fetch({
    url: `/order/bizorderalteration/getNewAlteration`,
    method: 'get',
    params: {
      orderId: Number(props.orderId)
    }
  }).then((res: any) => {
    if (res.code == '0') {
    }
  })
}
//收货//批量收货
onMounted(() => {
  getDetailOrder()
  checkShow.value = props.modelValue
})

const closeHandelDrawer = () => {
  emit('update:modelValue', false)
  emit('getData', false)
}
</script>

<style scoped lang="less">
@import '../orderTable';
.title {
  background: #f5f7fa;
  display: flex;
  padding: 10px;
  margin: 21px;
  align-items: center;
  border-radius: 17px;
  font-size: 12px;
  color: #1a1a1a;
  .circle {
    width: 24px;
    height: 24px;
    margin-right: 10px;
    border-radius: 24px;
    background: @mainColor;
  }
  .quotext {
    color: #f56c6c;
  }
}
.quodes {
  margin: 0 20px;
  padding-bottom: 20px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #303133;
  border-bottom: 1px solid #f3f4f8;
}
.totalname {
  color: #909399;
  font-size: 14px;
}
.total {
  display: flex;
  margin: 20px;
  justify-content: space-between;
}
.totalM {
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 600;
}
.money {
  font-size: 16px;
  margin-left: 10px;
  color: #f56c6c;
  font-weight: 600;
}
</style>
