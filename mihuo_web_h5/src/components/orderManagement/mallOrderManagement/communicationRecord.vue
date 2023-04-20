<template>
  <el-drawer
    v-model="checkShow"
    title="沟通记录"
    direction="rtl"
    :append-to-body="true"
    @close="closeHandelDrawer"
    size="50rem"
  >
    <!--沟通记录-->
    <div v-if="state.communications.length" class="communications">
      <el-timeline>
        <el-timeline-item
          v-for="activity in state.communications"
          :key="activity.id"
          color="#0bbd87"
          placement="top"
          :timestamp="activity.created"
        >
          <div class="communicationsdetail">
            <worker-card :data="activity.personInfo" :showReceived="false" />
            <div style="margin: 1rem">
              <div class="order-communication_tags">
                <div>
                  <span class="tags-tag">{{
                    activity.type == 0 ? '线上沟通' : '线下沟通'
                  }}</span>
                </div>
                <div>
                  <span class="tags-tag">{{
                    setResult(activity.intention)
                  }}</span>
                  <span class="tags-tag" v-if="activity.requirementTypeName">
                    {{ activity.requirementTypeName }}</span
                  >
                  <span class="tags-tag" v-if="activity.abandonedReason">{{
                    activity.abandonedReason
                  }}</span>
                </div>
              </div>
              <p>{{ activity.description }}</p>
              <div>
                <fileShow v-if="activity.annex" :propUrlList="activity.annex" />
              </div>
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
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
import { imgSrcList } from '@/utils/utils'
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
const imgList = (data: any) => {
  return imgSrcList(data)
}
const setResult = (intention: any) => {
  const tempResultMap = {
    '1': '愿意接单',
    '0': '不是平台单',
    '-1': '个人弃单'
  }
  return tempResultMap[intention] ?? ''
}
//
const getDetailOrder = async () => {
  await fetch({
    url: `/order/bidorder/list`,
    method: 'get',
    params: {
      orderId: props.orderId
    }
  }).then((res: any) => {
    if (res.code == '0') {
      state.orderData = res.data
      let communications = [] as any
      //这里需要处理下
      const offerList = []
      res.data &&
        res.data.offerList.map((item: any) => {
          let communicationItem = item.communications.map((mini: any) => {
            return {
              ...mini,
              personInfo: item.personInfo
            }
          })
          communications.push(...communicationItem)
        })
      state.communications = communications
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
  .quospan {
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
.order-communication_tags {
  display: flex;
  align-items: center;
  width: 100%;
  margin-top:2rem;
  // justify-content: flex-start;
  flex-flow: row wrap;
  &>div{
    margin-bottom: 2rem;
  }
  .tags-tag {
    color: #fe6e32;
    font-size: 14px;
    font-family: NotoSansHans;
    padding: 5px 10px;
    background: #fff0ea;
    border-radius: 6px;
    font-weight: 550;
    margin-right: 20px;
  }
}
</style>
