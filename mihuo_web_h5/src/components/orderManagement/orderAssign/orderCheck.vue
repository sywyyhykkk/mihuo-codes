<template>
  <div>
    <el-drawer
      v-model="checkShow"
      title="订单查看"
      direction="rtl"
      @close="closeHandelDrawer"
    >
      <div class="my-drawer__body">
        <div class="body-arrow" @click="checkType=!checkType">
          <span>订单信息</span>
          <el-icon v-if="!checkType" color="#C0C4CC" size="1.2rem">
            <ArrowDown />
          </el-icon>
          <el-icon v-if="checkType" color="#C0C4CC" size="1.2rem">
            <ArrowUp />
          </el-icon>
        </div>
        <div v-if="checkType" class="body-info">
          <div v-for="(item,index) in dataTitleList" :key="index" class="body-item">
            <div class="body-title">{{ item.label }}</div>
            <div v-if="item.key=='productAttr'" class="body-text">{{ getSkuData(state.data[item.key]) }}</div>
            <div v-else-if="item.key=='totalAmount'" class="body-text total-amount">{{ `￥${state.data[item.key]}` }}
            </div>
            <div v-else-if="item.key=='payAmount'" class="body-text">{{ `￥${state.data[item.key]}` }}</div>
            <div v-else-if="item.key=='payType'" class="body-text">{{ getPayType(state.data[item.key]) }}</div>
            <div v-else-if="item.key=='sourceType'" class="body-text">{{ getSourceType(state.data[item.key]) }}</div>
            <div v-else-if="item.key=='orderType'" class="body-text">{{ state.data[item.key] == 0 ? '正常订单' : '秒杀订单' }}
            </div>
            <div v-else class="body-text text-person">
              <span>{{ state.data[item.key] }}</span>
              <div v-if="item.key=='orderSn'" class="user">
                <div class="people">
                  <img
                    class="avatar-img"
                    :src="$getUrl.avatarImage(state.data.memberId)"
                    @error="$getUrl.imageError($event)"
                  >
                  <span>{{ state.data.memberName }}</span>
                </div>
                <img
                  src="@/assets/img/message.png"
                  class="message-avatar"
                  @click="openIM({userId:state.data.memberId,name:state.data.memberName})"
                >
              </div>
            </div>
          </div>
        </div>
        <div class="order-content">
          <div class="position-info position-info-view">
            <div class="info-heda">
              <el-icon size="1.6rem" color="#303133">
                <Location />
              </el-icon>
              <div class="info-address">{{ state.data.receiverRegion }}{{ state.data.receiverDetailAddress
              }}（{{ state.data.receiverProvince }}{{ state.data.receiverCity }}）
              </div>
              <div class="view-right-tag">
                <el-tag type="success" effect="dark">{{ state.data.skillTypeName }}</el-tag>
              </div>

            </div>
            <div class="info-person">
              {{ state.data.receiverName }} {{ state.data.receiverPhone }}
            </div>
          </div>
          <el-empty
            v-if="state.data.isAssign==0"
            style="margin-top:2rem"
            :image-size="130"
            description="还没有派单~"
            :image="require('@/assets/img/empty/no_data.png')"
          />
          <div v-if="state.data.isAssign!=0" class="order-assign-info">
            <div class="assign-info-title">
              <div class="person-info">
                <img
                  class="person-img"
                  :src="$getUrl.avatarImage(3)"
                  @error="$getUrl.imageError($event)"
                >
                <span>{{ state.orderInfo.userName }}&nbsp;{{ state.orderInfo.created }}</span>
                <!--                <span style="color:#F56C6C;margin-left: 10px">发布了抢单</span>-->
                <span
                  v-if="state.orderInfo.assignType==1"
                  style="color:#2DA44E;margin-left: 10px"
                >指派了{{ state.orderInfo.skillName }}</span>
                <span v-if="state.orderInfo.assignType==2" style="color:#F56C6C;margin-left: 10px">发布了抢单</span>
              </div>
              <el-button icon="edit-pen" type="text" @click="handelClick('修改')">修改</el-button>
            </div>

            <div class="need-desc">{{ state.orderInfo.requirementDesc }}</div>
            <div class="desc-item">
              <div class="desc-img" />
            </div>
            <div class="desc-item">
              <audioPlay />
            </div>
            <div v-for="(item,index) in descList" :key="index" class="body-item desc-item">
              <div class="body-title" style="text-align: left;">{{ item.label }}</div>
              <div class="body-text">{{ item.prefix }}
                {{ state.orderInfo[item.key]
                }}{{ item.unit }}
              </div>
            </div>
            <worker-card
              v-for="(item,index) in state.offerList"
              :key="index"
              class="worker-card"
              :data="item"
            >
              <template #cardRight>
                <div v-if="props.data.assignType=='1'">
                  <el-button class="send-order-button" @click="handelClick('终止')">
                    终止
                  </el-button>
                </div>
                <div v-if="props.data.assignType == 2">
                  <div class="card-price">报价 {{ item.bidPrice }}元</div>
                  <div class="card-date">{{ item.created }}</div>
                  <el-button v-if="item.bidStatus!=3" class="send-order-button" @click="saveOffer(item.id)">
                    让他接单
                  </el-button>
                </div>
              </template>
            </worker-card>
          </div>

        </div>
      </div>
      <div
        v-if="state.data.isAssign==0&&!(state.data.serviceType=='1003'&&state.data.deliveryType==1)&&state.data.status!='1000'"
        class="drawer-footer"
      >
        <el-button type="primary" @click="handelClick('找人接单')">找人接单</el-button>
        <el-button type="danger" @click="handelClick('发布抢单')">发布抢单</el-button>
      </div>
    </el-drawer>
    <!--    //指派和抢单-->
    <orderAssignGrabSingle
      v-model="assignVisible"
      :data-form="state.data"
      :type="assignType"
      @getData="getApplyOrderData"
    />

    <!--//终止理由-->
    <termination-reason v-model="terminationShow" />
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, reactive, onMounted, watchEffect, ref, inject } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { getSkuData, getSourceType, openIM, getPayType } from '../order'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: { // 控制抽屉是否显示
    type: Boolean,
    default: false
  },
  orderId: { // 订单id
    type: String || Number,
    default: 0
  },
  data: { // row
    type: Object,
    default: {}
  }
})
const emit = defineEmits(['getData'])
const mainOrderId = inject('mainOrderId')

const checkShow = ref<boolean>(false)
const checkType = ref<boolean>(true)
const terminationShow = ref<boolean>(false)
const assignVisible = ref<boolean>(false)
const assignType = ref<string>('指派')
const descList = reactive([{ label: '上门时间', key: 'expectDate', unit: '', prefix: '' }, {
  label: '预计工期',
  key: 'expectDuration',
  unit: '天',
  prefix: ''
}, { label: '预估费用', key: 'price', unit: '', prefix: '￥' }])
const state = reactive({
  data: {} as any,
  orderInfo: {} as any,
  stepList: [] as any,
  offerList: [] as any
})

const dataTitleList = reactive([
  { label: '订单编号', key: 'orderSn' },
  { label: '创建时间', key: 'createTime' },
  { label: '订单状态', key: '' },
  { label: '订单分类', key: 'orderType' },
  { label: '订单来源', key: 'sourceType' },
  { label: '支付方式', key: 'payType' },
  { label: '商品', key: 'productName' },
  { label: '编号', key: 'productSkuId' },
  { label: '品牌', key: 'productBrand' },
  { label: '规格', key: 'productAttr' },
  { label: '单价', key: 'productPrice' },
  { label: '数量', key: 'productQuantity' },
  { label: '订单金额', key: 'totalAmount' },
  { label: '实收金额', key: 'payAmount' }
])

watchEffect(() => {
  checkShow.value = props.modelValue
  state.data = props.data
  if (checkShow.value) {
    getApplyOrderData()
  }
})

const closeHandelDrawer = () => {
  emit('update:modelValue', false)
}
const handelClick = (val: string) => {
  switch (val) {
    case '发布抢单':
      assignType.value = '抢单'
      assignVisible.value = true
      break
    case '找人接单':
      assignType.value = '指派'
      assignVisible.value = true
      break
    case '修改':
      break
  }
}

const saveOffer = async (offerId: any) => {
  await fetch({
    url: `order/biz_order/publisher/confirmPerson/${offerId}`,
    method: 'post'
  }).then((res: any) => {
    if (res.data) {
      ElMessage.success('指派成功')
      getOrderList()
      emit('getData')
    }
  })
}
const getOrderList = async () => {
  await fetch({
    url: '/order/bidorder/list',
    method: 'get',
    params: {
      orderId: state.orderInfo.id
    }
  }).then((res: any) => {
    state.offerList = res.data.offerList || []
  })
}
const getApplyOrderData = async () => {
  await fetch({
    url: `/mall/order/assignInfo`,
    method: 'get',
    params: {
      orderId: mainOrderId
    }
  }).then((res: any) => {
    state.orderInfo = res.data || {}
    if (state.orderInfo?.id) getOrderList()
  })
}

</script>

<style scoped lang="less">
@import "../orderTable";

.send-order-button {
  margin-top: 24px;
  background: linear-gradient(90deg, #0969DA, #228FFE);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #FFFFFF;
}

.card-date {
  font-size: 12px;
  font-weight: 400;
  color: #909399;
  margin-top: 10px;
}

.card-price {
  font-size: 14px;
  font-weight: bold;
  color: #F56C6C;
}

.worker-card {
  border: 1px solid #F3F4F8;
  border-radius: 4px;
  padding: 2rem;
}

.order-content {
  border-top: solid 1px #F3F4F8;
  padding: 2rem 4rem;
}

.body-arrow {
  font-size: 14px;
  color: #0969DA;
  margin: 2rem;
  padding: 0 7px;
  border-left: 3px #0969DA solid;
  display: flex;
  align-items: center;
  cursor: pointer;

  span {
    margin-right: 10px;
  }
}

.my-drawer__body {
  background: #ffffff !important;
  position: absolute;
  top: 73px;
  padding-bottom: 8.5rem !important;
  left: 0;
  right: 0;
  height: 100%;
  overflow-y: auto;

}

.body-info {
  background: #ffffff;
  //margin: 0 -2rem;
  padding: 0rem 4rem;

}

.body-item {
  display: flex;
  margin-bottom: 2rem;
  align-items: center;

  .body-title {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #909399;
    width: 70px;
    text-align: right;
    margin-right: 2rem;
  }

  .body-text {
    font-size: 14px;
    color: #303133;
  }

  .text-person {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .total-amount {
    text-decoration: underline;
  }
}

</style>
