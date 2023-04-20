<template>
  <div>
    <el-drawer
      v-model="checkShow"
      title="订单详情"
      direction="rtl"
      @close="closeHandelDrawer"
      size="114rem"
    >
      <div class="detail-drawer">
        <div class="detail-drawer-title" style="height: 12rem">
          <div class="drawer-title-steps">
            <el-steps :active="stepActive" align-center>
              <el-step
                v-for="(item, index) in steps"
                :key="index"
                :icon="stepActive == -1 && index == 6 ? 'CircleCheck' : ''"
              >
                <template #icon>
                  <el-icon
                    v-if="index == 0 && state.bizOrder.orderStatus == 10"
                  >
                    <Check />
                  </el-icon>
                  <el-icon
                    v-if="index == 1 && state.bizOrder.orderStatus == 20"
                  >
                    <Check />
                  </el-icon>
                  <el-icon
                    v-if="index == 2 && state.bizOrder.orderStatus == 30"
                  >
                    <Check />
                  </el-icon>
                  <el-icon
                    v-if="index == 3 && state.bizOrder.orderStatus == 35"
                  >
                    <Check />
                  </el-icon>
                  <el-icon
                    v-if="index == 4 && state.bizOrder.orderStatus == 40"
                  >
                    <Check />
                  </el-icon>
                  <el-icon
                    v-if="index == 5 && state.bizOrder.orderStatus == 50"
                  >
                    <Check />
                  </el-icon>
                  <el-icon
                    v-if="index == 6 && state.bizOrder.orderStatus == 51"
                  >
                    <Check />
                  </el-icon>
                </template>
                <template #title>
                  <div
                    class="step-title"
                    :class="
                      index <= stepActive
                        ? 'title-isactive'
                        : stepActive == -1 && index == 6
                        ? 'is-icon'
                        : ''
                    "
                  >
                    {{ stepActive == -1 && index == 6 ? '交易关闭' : item }}
                  </div>
                </template>
                <!-- <template #description>
                  <div class="step-desc">
                    <span v-if="index == 0">{{ state.data.createTime }}</span>
                    <span v-if="index == 1">{{ state.data.paymentTime }}</span>
                    <span v-if="index == 2">{{ state.data.deliveryTime }}</span>
                    <span v-if="index == 3 && stepActive == 4">{{
                      state.data.receiveTime
                    }}</span>
                  </div>
                </template> -->
              </el-step>
            </el-steps>
          </div>
        </div>
        <div class="mall-order-info">
          <div class="info-hander">
            <span style="margin-right: 1rem">服务信息</span>
            <!-- <el-icon
              size="1.4rem"
              color="#0969DA"
              style="cursor: pointer"
              @click="handelClick('修改收货信息', {})"
            >
              <edit-pen />
            </el-icon> -->
          </div>
          <div class="info-content">
            <div>
              <div>联系人</div>
              <div>{{ state.bizOrder?.contactName }}</div>
            </div>
            <div>
              <div>联系电话</div>
              <div>{{ state.bizOrder?.contactPhone }}</div>
            </div>
            <div>
              <div>收货地址</div>
              <div>
                {{ state.bizOrder?.latAddress || '' }}
              </div>
            </div>
          </div>
          <div class="info-hander" style="margin-top: 1.5rem">
            <span style="margin-right: 1rem">付款信息</span>
          </div>
          <div class="info-content">
            <div>
              <div>实付金额</div>
              <div v-if="state.payInfo?.payAmount">
                ￥{{ state.payInfo.payAmount?.toFixed(2) }}
              </div>
            </div>
            <div>
              <div>付款方式</div>
              <div>
                {{ getPayType(state.payInfo?.payMethod) }}
              </div>
            </div>
            <div>
              <div>付款时间</div>
              <div v-if="state.payInfo?.created">
                {{ state.payInfo.created }}
              </div>
            </div>
          </div>
        </div>

        <div class="order-detail-info">
          <div>
            <span style="margin-right: 1rem"
              >订单编号：{{ state.data?.orderCode }}</span
            >
            <el-tag
              v-if="state.data.deliveryType"
              :type="
                state.data.deliveryType == '0'
                  ? 'success'
                  : state.data.deliveryType == '1'
                  ? ''
                  : 'warning'
              "
              effect="dark"
              >{{ getDeliveryType(state.data.deliveryType) }}
            </el-tag>
          </div>
          <div>创建时间：{{ state.data.created }}</div>

          <div>
            <span class="buyer">买家</span>
            <div class="user">
              <div class="people">
                <img
                  class="avatar-img"
                  :src="$getUrl.avatarImage(state.data.userId)"
                  @error="$getUrl.imageError($event)"
                />
                <span>{{ state.data.userName }}</span>
              </div>
              <img
                @click="
                  openIM({
                    userId: state.data.memberId,
                    name: state.data.memberName
                  })
                "
                src="@/assets/img/message.png"
                class="message-avatar"
              />
            </div>
          </div>
          <div>
            <el-button
              type="primary"
              @click="agree()"
              :disabled="state.bizOrder.cancelFlag != 1"
              >同意</el-button
            >
            <el-button
              type="danger"
              @click="refuse()"
              :disabled="state.bizOrder.cancelFlag != 1"
              >拒绝</el-button
            >
          </div>
        </div>
        <div class="customer-order-info">
          <div class="info-hander">
            <span style="margin-right: 1rem">客户需求</span>
          </div>
          <div class="info-content">
            <div style="width: 100%">
              <div>需求描述</div>
              <div>{{ state.bizOrder?.requirementDesc }}</div>
            </div>
          </div>
          <div class="info-content">
            <div>
              <div>呼叫类型</div>
              <div>
                {{ getPriceWay(state.bizOrder.priceWay) || '' }}
              </div>
            </div>
            <div>
              <div>期望报价</div>
              <div>￥{{ state.bizOrder.price?.toFixed(2) || '' }}</div>
            </div>
            <div>
              <div>需求工种</div>
              <div>{{ state.bizOrder.skillName || '' }}</div>
            </div>
            <div>
              <div>期望上门时间</div>
              <div>{{ state.bizOrder.expectDate || '' }}</div>
            </div>
          </div>
        </div>
        <worker-card
          v-for="item in state.offerList"
          :key="item.id"
          :data="item"
        >
          <template #cardRight>
            <!-- <el-button @click="quotatioShow = true"> 报价清单 </el-button> -->
          </template>
        </worker-card>
      </div>
    </el-drawer>
    <!-- 同意取消订单并退款 -->
    <el-dialog
      v-model="dialogVisibleRefund"
      v-if="dialogVisibleRefund"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="退款"
      @close="handelClose"
      width="54rem"
    >
      <el-form
        ref="refundFormRef"
        :model="state.formRefund"
        :rules="rules"
        label-width="10rem"
        :scrollToError="true"
      >
        <el-form-item label="实付金额" prop="payAmount">
          <el-input
            v-model="state.formRefund.payAmount"
            autocomplete="off"
            readonly
          />
        </el-form-item>
        <el-form-item label="退款金额" :rules="rules" prop="refundAmount">
          <el-input
            type="number"
            @input="(val) => changeVal(val)"
            v-model.trim="state.formRefund.refundAmount"
          >
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="退款说明" prop="reason">
          <el-input type="textarea" v-model="state.formRefund.reason" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            :loading="state.loading"
            @click="confirmRefund()"
            >确定</el-button
          >
          <el-button @click="handelClose">取 消</el-button>
        </span>
      </template>
    </el-dialog>

    <!--报价清单 -->
    <quotationList
      :orderId="state.bizOrder.id"
      v-if="quotatioShow"
      v-model="quotatioShow"
    />
    <!-- 订单退款查看-->
    <checkRefund v-model="checkRefundShow" :orderItemId="orderItemId" />
    <!--去验收-->
    <acceptQuestDrawer
      v-if="acceptQuestShow"
      v-model="acceptQuestShow"
      :data="state.checkStandard"
      :disabled="true"
    />
  </div>
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
import { async } from '@antv/x6/lib/registry/marker/main'
import { valid } from 'mockjs'

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

const emit = defineEmits(['getData', 'update:modelValue'])
const buyersRemindShow = ref<boolean>(false) //新增给买家的提醒//关闭订单
const isRemindType = ref<boolean>(true) //是否买家的提醒,true买家提醒，false关闭订单
const buyersRemindCheckShow = ref<boolean>(false) //给买家的提醒查看
const editRecordShow = ref<boolean>(false) //订单修改记录
const goodsDeliveryShow = ref<boolean>(false) //商品发货
const orderRefundShow = ref<boolean>(false) //订单退款
const checkRefundShow = ref<boolean>(false) //查看订单退款
const multiple = ref<boolean>(false) //false单个退款，true批量退款
const dialogVisible = ref<boolean>(false) //商品修改
const dialogVisibleRefund = ref<boolean>(false) //同意取消订单后退款
const assignVisible = ref<boolean>(false) //订单指派
const acceptQuestShow = ref<boolean>(false) //验收
const checkVisible = ref<boolean>(false) //订单查看
const assignType = ref<string>('指派') //指派,抢单
const orderItemId = ref<string | number>(0)
const refundFormRef = ref<any>('')

const checkShow = ref<boolean>(false)
const quotatioShow = ref<boolean>(false)
const stepActive = ref<number>(0)
const steps = ref<any>(customStep)
const tableData = ref<any>([{}])
const state = reactive({
  payInfo: {},
  loading: false,
  formRefund: {} as any,
  cancelReason: '',
  cancelOrderReasonList: [],
  orderData: [] as any,
  data: props.orderData,
  orderLogList: [],
  afterOfferList: [],
  bizOrder: {} as any,
  offerList: [],
  dataForm: {} as any,
  orderItemIds: [] as any,
  checkStandard: [] as any //验收
})

const handelClose = () => {
  emit('update:modelValue', false)
}

// 退款
const confirmRefund = async () => {
  await refundFormRef.value.validate((valid: any) => {
    if (valid) {
      fetch({
        url: '/order/admin/order/executeCancelOrder',
        method: 'post',
        data: {
          orderId: props.orderId,
          reason: state.formRefund.reason,
          refundAmount: state.formRefund.refundAmount
        }
      }).then((res: any) => {
        if (res.code == 0) {
          ElMessage.success('退款成功')
          dialogVisibleRefund.value = false
          getDetailOrder()
        }
      })
    }
  })
}

// 同意
const agree = () => {
  if (state.offerList && state.offerList.length) {
    state.offerList.some((item: any) => {
      if (item.bidStatus == 3) {
        //发单方接受的才可以退款
        state.formRefund.refundAmount = item.bidPrice
        state.formRefund.payAmount = item.bidPrice
        dialogVisibleRefund.value = true
        return true
      }
    })
  }
}

// 拒绝用户申请关闭订单
const refuse = async () => {
  await ElMessageBox.confirm(`是否拒绝关闭订单?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    fetch({
      url: '/order/admin/order/rejectCancelOrder',
      method: 'post',
      data: {
        orderId: Number(props.orderId)
      }
    }).then((res: any) => {
      if (res.code == 0) {
        ElMessage.success('操作成功')
        getDetailOrder()
      }
    })
  })
}

const rules = reactive([
  { required: true, message: '请输入退款金额', trigger: 'blur' }
])

const changeVal = (val: any) => {
  let v: any = '' + val
  v =
    v
      .replace(/[^\d^\.]+/g, '')
      .replace(/^0+(\d)/, '$1')
      .replace(/^\./, '0.')
      .match(/^\d*(\.?\d{0,2})/g)[0] || ''
  const volid = {
    validator: (rule: any, value: any, callback: any) => {
      if (value == '' || value == 0) {
        callback(new Error('请输入退款金额'))
      } else {
        if (parseFloat(v) > state.formRefund.payAmount) {
          callback(new Error('不能大于实付金额'))
        }
        callback()
      }
    }
  } as any
  if (rules.length === 2) {
    rules.pop()
  }
  rules.push(volid)
  state.formRefund.refundAmount = parseFloat(v)
}

const handelClick = (val: string, data?: any) => {
  switch (val) {
    case '新增':
      buyersRemindShow.value = true
      isRemindType.value = true
      break
    case '查看更多':
      buyersRemindCheckShow.value = true
      break
    case '修改':
      dialogVisible.value = true
      state.dataForm = data
      state.dataForm.orderId = props.orderId
      break
    case '修改记录':
      editRecordShow.value = true
      break
    case '关闭订单':
      buyersRemindShow.value = true
      isRemindType.value = false
      break
    case '发货':
      state.orderItemIds = [data]
      goodsDeliveryShow.value = true
      break
    case '批量发货':
      state.orderItemIds = []
      tableData.value.forEach((res: any) => {
        state.orderItemIds.push(res.id)
      })
      goodsDeliveryShow.value = true
      break
    case '收货':
      let obj = {
        orderId: props.orderId,
        orderItemIds: [data.id]
      }

      break
    case '批量收货':
      let orderItemIds: any = []
      tableData.value.forEach((res: any) => {
        orderItemIds.push(res.id)
      })
      let obj1: any = {
        orderId: props.orderId,
        orderItemIds: orderItemIds
      }

      break
    case '退款':
      data.orderId = props.orderId
      data.amount = data.totalAmount
      multiple.value = false
      state.orderData = []
      state.orderData.push(JSON.parse(JSON.stringify(data)))
      orderRefundShow.value = true
      break
    case '批量退款':
      orderRefundShow.value = true
      multiple.value = true
      let list = JSON.parse(JSON.stringify(tableData.value))
      list.forEach((res: any) => {
        res.orderId = props.orderId
        res.amount = res.totalAmount
      })
      state.orderData = list
      break
    case '查看退款':
      orderItemId.value = data
      checkRefundShow.value = true
      break
    case '删除订单':
      ElMessageBox.confirm(`此操作将永久删除订单, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteOrder()
      })
      break
    case '订单指派':
      state.data.skillId = state.data?.orderItems[0]?.skillId
      state.data.orderItemSn = state.data?.orderItems[0]?.orderItemSn
      assignVisible.value = true
      break
    case '查看派单':
      console.log(data)
      state.dataForm = Object.assign(
        JSON.parse(JSON.stringify(state.data)),
        JSON.parse(JSON.stringify(data))
      )
      checkVisible.value = true
      break
  }
}

const getPriceWay = (data: any) => {
  switch (data) {
    case 1:
      return '一口价'
    case 2:
      return '议价模式'
    case 3:
      return '快速呼叫'
    default:
      return '其他'
  }
}

//订单
const deleteOrder = async () => {
  await fetch({
    url: `/mall/order/delete`,
    method: 'get',
    params: {
      ids: props.orderId
    }
  }).then((res: any) => {
    if (res.code == '0') {
      ElMessage.success('删除订单成功')
      closeHandelDrawer()
    }
  })
}
const getDetailOrder = async () => {
  await fetch({
    url: `/order/bidorder/list`,
    method: 'get',
    params: {
      orderId: Number(props.orderId)
    }
  }).then((res: any) => {
    if (res.code == '0') {
      state.afterOfferList = res.data.afterOfferList
      state.offerList = res.data.offerList
      state.bizOrder = res.data.bizOrder
      //订单状态: 10=已发布/待确认；15=已报价；20=已确认/待付款；30=已付款/服务中；35=已申请/待验收；40=待结算；50=已完成/待评价；51=已完成/已评价；-1=已取消
      switch (state.bizOrder.orderStatus) {
        case 10:
          stepActive.value = 0
          break
        case 20:
          stepActive.value = 1
          break
        case 30:
          stepActive.value = 2
          break
        case 35:
          stepActive.value = 3
          break
        case 40:
          stepActive.value = 4
          break
        case 50:
          stepActive.value = 5
          break
        case 51:
          stepActive.value = 6
          break
        case -1:
          stepActive.value = -1
          break
        default:
          stepActive.value = 0
      }
    }
  })
}
// 获取支付信息
const getPayInfo = async () => {
  await fetch({
    url: `/order/orderpaylog/getOrderByBusinessId?businessId=${props.orderId}`,
    method: 'get'
  }).then((res: any) => {
    if (res.code == 0) {
      state.payInfo = res.data && res.data[0]
    }
  })
}

onMounted(() => {
  checkShow.value = props.modelValue
  if (checkShow.value) {
    getDetailOrder()
    getPayInfo()
  }
})

const closeHandelDrawer = () => {
  emit('update:modelValue', false)
  emit('getData', false)
}
</script>

<style scoped lang="less">
@import '../orderTable';

.is-icon {
  color: #f56c6c !important;
}

:deep(.is-icon) {
  color: #f56c6c;
}
</style>
