<template>
  <el-drawer
    v-model="checkShow"
    title="报价清单"
    direction="rtl"
    :append-to-body="true"
    @close="closeHandelDrawer"
    size="40rem"
  >
    <div class="title">
      <div class="circle">
        <img
          class="worker-img"
          :src="
            props.data.avatar
              ? $getUrl.getPicUrl(state.bizOrder.avatar, true)
              : $getUrl.avatarImage(state.bizOrder.userId)
          "
          @error="$getUrl.imageError($event)"
        />
      </div>
      <div>
        <span>{{ state.bizOrder?.contactName }}</span>
        <span>{{ '  (  ' + state.bizOrder?.skillName + '  )  ' }}</span>
        <span>{{ state.bizOrder.created }}</span>
        <span class="quotext"> 报价</span>
      </div>
    </div>
    <div class="quodes">报价说明</div>
    <div class="total">
      <span class="totalname">共{{}}个项目</span>
      <span>
        <span class="totalM">合计</span>
        <span class="money">{{ 0 }}</span>
      </span>
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
  bizOrder: {} as any,
  communications: [] as any
})
//
const getDetailOrder = async () => {
  await fetch({
    url: `/order/bidorder/list`,
    method: 'get',
    params: {
      orderId: Number(props.orderId)
    }
  }).then((res: any) => {
    if (res.code == '0') {
      state.orderData = res.data
      state.bizOrder = res.data.bizOrder
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
    .worker-img {
      width: 100%;
      height: 100%;
      border-radius: 24px;
    }
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
.communications {
  margin: 2rem;
}
.communicationsdetail {
  h4 {
    margin: 2rem 0;
  }
  p {
    color: #666;
  }
}
</style>
