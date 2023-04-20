<template>
  <div>
    <el-drawer
      v-model="checkShow"
      title="订单详情"
      direction="rtl"
      size="114rem"
      @close="closeHandelDrawer"
    >
      <div class="detail-drawer">
        <div class="detail-drawer-title">
          <div class="drawer-title-status">
            <span v-if="stepActive == 7" style="color: #f56c6c">交易关闭</span>
            <span v-else>{{
              getOrderStatus(stepActive, props.orderType).text
            }}</span>
          </div>
          <div class="drawer-title-steps">
            <el-steps :active="stepActive" align-center>
              <el-step
                v-for="(item, index) in steps"
                :key="index"
                :icon="stepActive == 7 && index == 3 ? 'CircleCheck' : ''"
              >
                <template #icon>
                  <el-icon v-if="index == 0 && state.data.createTime">
                    <Check />
                  </el-icon>
                  <el-icon v-if="index == 1 && state.data.paymentTime">
                    <Check />
                  </el-icon>
                  <el-icon v-if="index == 2 && state.data.deliveryTime">
                    <Check />
                  </el-icon>
                  <el-icon
                    v-if="
                      index == 3 && stepActive == 4 && state.data.receiveTime
                    "
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
                        : stepActive == 7 && index == 3
                          ? 'is-icon'
                          : ''
                    "
                  >
                    {{ stepActive == 7 && index == 3 ? '交易关闭' : item }}
                  </div>
                </template>
                <template #description>
                  <div class="step-desc">
                    <span v-if="index == 0">{{ state.data.createTime }}</span>
                    <span v-if="index == 1">{{ state.data.paymentTime }}</span>
                    <span v-if="index == 2">{{ state.data.deliveryTime }}</span>
                    <span v-if="index == 3 && stepActive == 4">{{
                      state.data.receiveTime
                    }}</span>
                  </div>
                </template>
              </el-step>
            </el-steps>
          </div>
        </div>

        <div class="buyers-remind" style="align-items: self-start">
          <div class="remind-left">
            <span class="left-text">订单动态</span>
            <template v-if="state.orderLogList.length">
              <div style="flex: 1; margin-right: 20px">
                <div
                  class="remind-left"
                  style="display: flex; align-items: center"
                >
                  <el-tag effect="dark" type="warning">最新</el-tag>
                  <span>{{ curFirstOrderInfo.created }}</span>
                  <div class="check-more" @click="handelClick('查看更多', {})">
                    查看更多
                    <el-icon>
                      <ArrowRight />
                    </el-icon>
                  </div>
                </div>
                <div class="remind-info">
                  {{ curFirstOrderInfo.content }}
                </div>
              </div>
            </template>
          </div>
        </div>

        <div class="mall-order-info">
          <div class="info-hander">
            <span style="margin-right: 1rem">收货信息</span>
          </div>
          <div class="info-content">
            <div>
              <div>联系人</div>
              <div>{{ state.data?.receiverName }}</div>
            </div>
            <div>
              <div>联系电话</div>
              <div>{{ state.data?.receiverPhone }}</div>
            </div>
            <div>
              <div>收货地址</div>
              <div>
                {{ state.data.receiverRegion || ''
                }}{{ state.data.receiverLatAddress || ''
                }}{{ state.data.receiverPoiName || ''
                }}{{ state.data.receiverDetailAddress || '' }}
              </div>
            </div>
          </div>
          <div class="info-hander" style="margin-top: 1.5rem">
            <span style="margin-right: 1rem">付款信息</span>
          </div>
          <div class="info-content">
            <div>
              <div>实付金额</div>
              <div>
                {{
                  stepActive > 0
                    ? '￥' + state.data.payAmount?.toFixed(2)
                    : '待买家付款'
                }}
              </div>
            </div>
            <div>
              <div>付款方式</div>
              <div>
                {{
                  stepActive > 0 ? getPayType(state.data.payType) : '待买家付款'
                }}
              </div>
            </div>
            <div>
              <div>付款时间</div>
              <div>
                {{ stepActive > 0 ? state.data.paymentTime : '待买家付款' }}
              </div>
            </div>
          </div>
        </div>

        <el-table
          v-loading="loading"
          stripe
          style="height: 40vh !important"
          :data="tableData"
          :height="'0'"
          border
        >
          <el-table-column label="商品" width="300" header-align="center">
            <template #default="scope">
              <div v-if="scope.row.productPic" class="goods">
                <el-image
                  :src="$getUrl.getPicUrl(scope.row.productPic)"
                  :preview-src-list="$getUrl.getPicUrl(scope.row.productPic)"
                  :preview-teleported="true"
                  :fit="fit"
                />
                <div class="goods-info">
                  <div
                    class="product-name"
                    @click="handelClick('商品', scope.row)"
                  >
                    {{ scope.row.productName }}
                  </div>
                  <div v-if="state.data?.orderType == 2">
                    <el-tag
                      v-if="!state.data.projectId"
                      type="info"
                    >未关联项目</el-tag>
                    <el-tag
                      v-else
                      class="already"
                      type="info"
                      @click="goProjectDetail"
                    >
                      已关联项目：{{
                        state.data?.receiverLatAddress +
                          state.data?.receiverDetailAddress
                      }}
                    </el-tag>
                  </div>
                  <div class="goods-tag">
                    <el-tag type="info">{{ scope.row.productSn }}</el-tag>
                    <el-tag type="info">{{ scope.row.productBrand }}</el-tag>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="规格"
            header-align="center"
            prop="productAttr"
            width="150"
            align="center"
          >
            <template #default="scope">
              <div
                v-if="
                  scope.row.productAttr &&
                    JSON.parse(scope.row.productAttr)?.length
                "
              >
                <div
                  v-for="(item, index) in JSON.parse(scope.row.productAttr)"
                  :key="index"
                  class="productAttr"
                >
                  <span>{{ item.value || '' }}</span>
                  <span
                    v-if="index < JSON.parse(scope.row.productAttr).length - 1"
                  >/</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="单价（元）/单位"
            header-align="center"
            prop="productPrice"
            width="120"
            align="center"
          >
            <template #default="scope">
              <div>
                ￥{{ scope.row.productPrice?.toFixed(2) }}/{{
                  scope.row.productUnit
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="productQuantity" align="center" />
          <el-table-column label="退款金额" prop="refundAmount" align="center">
            <template #default="scope">
              <span
                v-if="scope.row.refundStatus == 3"
              >￥{{ scope.row.refundAmount?.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="['0'].includes(props.orderType)"
            label="小计"
            prop=""
            width="90"
            align="center"
          >
            <template #default="scope">
              <div>￥{{ scope.row.totalAmount?.toFixed(2) }}</div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="['0'].includes(props.orderType)"
            label="发货状态"
            width="100"
            align="center"
          >
            <template #default="scope">
              <el-tooltip placement="bottom">
                <template #content>
                  <div>物流公司：{{ scope.row.deliveryCompany }}</div>
                  <div>运单号：{{ scope.row.deliverySn }}</div>
                </template>
                <div :style="getDeliveryStatus(scope.row.deliveryStatus).style">
                  {{ getDeliveryStatus(scope.row.deliveryStatus).label }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            v-if="['1'].includes(props.orderType)"
            label="派单状态"
            prop="payAmount"
            width="100"
            align="center"
          >
            <template #default="scope">
              <div
                style="cursor: pointer"
                :class="
                  scope.row.assignType == '1' ? 'service-type' : 'service-type2'
                "
                @click="handelClick('', scope.row)"
              >
                <span>{{
                  scope.row.assignType == '1' ? '已指派' : '未指派'
                }}</span>
                <div>
                  <el-icon v-if="scope.row.assignType == '1'">
                    <Check />
                  </el-icon>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="['1'].includes(props.orderType)"
            label="内验状态"
            prop="payAmount"
            width="100"
            align="center"
          >
            <template #default="scope">
              <div
                :class="
                  scope.row.checkFlag == '1' ? 'service-type' : 'service-type2'
                "
              >
                <span>{{
                  scope.row.checkFlag == '1' ? '已验收' : '未验收'
                }}</span>
                <div>
                  <el-icon v-if="scope.row.checkFlag == '1'">
                    <Check />
                  </el-icon>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="['1'].includes(props.orderType)"
            label="客户确认"
            prop="payAmount"
            width="100"
            align="center"
          >
            <template #default="scope">
              <div
                :class="
                  scope.row.deliveryStatus == '2'
                    ? 'service-type'
                    : 'service-type2'
                "
              >
                <span>{{
                  scope.row.deliveryStatus == '2' ? '已确认' : '未确认'
                }}</span>
                <div>
                  <el-icon v-if="scope.row.deliveryStatus == 2">
                    <Check />
                  </el-icon>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="['0', '1', '2'].includes(props.orderType)"
            label="退款状态"
            prop="payAmount"
            width="150"
            align="center"
          >
            <template #default="scope">
              <div
                v-if="scope.row.refundStatus > 0"
                style="cursor: pointer"
                :style="getRefundStatus(scope.row.refundStatus).style"
                @click="handelClick('查看退款', scope.row.id)"
              >
                <div>{{ getRefundStatus(scope.row.refundStatus).label }}</div>
                <div>￥{{ scope.row.refundAmount.toFixed(2) }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            header-align="center"
            prop=""
            width="180"
            align="center"
          >
            <template #default="scope">
              <p style="text-align: center">{{ scope.row.refundReason }}</p>
              <div v-if="scope.row.refundPics?.length">
                <el-image
                  lazy
                  class="refund-img"
                  preview-teleported
                  fit="cover"
                  :src="imgSrcList(JSON.stringify(scope.row.refundPics))[0]"
                  :preview-src-list="
                    imgSrcList(JSON.stringify(scope.row.refundPics))
                  "
                >
                  <template #error>
                    <div class="image-slot">
                      <el-icon :size="20"><PictureFilled /></el-icon>
                    </div>
                  </template>
                </el-image>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="申请退款时间" align="center" width="120">
            <template #default="scope">
              <span>{{ scope.row.refundTime?.slice(0, 16) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-for="(item, index) in state.orderList" :key="index" style="margin:0 4rem">
        <orderCard :order-data="item" :is-look="false" />
      </div>

      <template #footer>
        <div class="total-pice-info">
          <div class="info-item">
            <span class="label">商品总价：</span>
            <span>￥{{ state.data.totalAmount?.toFixed(2) }}</span>
          </div>
          <div class="info-item">
            <span class="label">运费：</span>
            <span>￥{{ state.data.freightAmount?.toFixed(2) }}</span>
          </div>
          <div class="info-item">
            <span class="label">安装费：</span>
            <span>￥{{ state.data.freightInstallationAmount?.toFixed(2) }}</span>
          </div>
          <div class="info-item">
            <span class="label">上楼费：</span>
            <span>￥{{ state.data.freightStairwayAmount?.toFixed(2) }}</span>
          </div>
          <div class="info-item">
            <span class="label">补齐金额：</span>
            <span>￥{{ state.data.totalDiffAmount?.toFixed(2) }}</span>
          </div>
          <div class="info-item">
            <span class="label">后台优惠金额：</span>
            <span v-if="state.data.discountAmount">￥{{ state.data.discountAmount?.toFixed(2) }}</span>
            <span v-else>¥0.00</span>
          </div>
          <div class="info-item">
            <span class="label">预付款抵扣金额：</span>
            <span v-if="state.data.prePayAmount">￥{{ state.data.prePayAmount?.toFixed(2) }}</span>
            <span v-else>¥0.00</span>
          </div>
          <div class="info-item">
            <span class="label">优惠券优惠金额：</span>
            <span>￥{{ state.data.couponAmount?.toFixed(2) }}</span>
          </div>
          <div class="info-item">
            <span class="label">优惠金额：</span>
            <span>￥{{ state.data.promotionAmount?.toFixed(2) }}</span>
          </div>
          <div class="info-item pay-amount">
            <span class="label">{{
              state.data.status == 0 ? '待买家付款：' : state.data.status == 7 ? '订单金额：' : '买家已付款：'
            }}</span>
            <span class="amount">￥{{ state.data.payAmount?.toFixed(2) }}</span>
          </div>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import {
  defineEmits,
  defineProps,
  reactive,
  onMounted,
  watchEffect,
  ref,
  provide
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
import {
  step0,
  step1,
  step2,
  step3
} from '@/components/orderManagement/mallOrderManagement/allOrder'
import { useRouter } from 'vue-router'
import { imgSrcList } from '@/utils/utils'
import { baseEncode } from '@/utils/utils'
import wsCache from '@/cache'

const props = defineProps({
  modelValue: {
    // 控制抽屉是否显示
    type: Boolean,
    default: false
  },
  orderId: {
    // 订单id
    type: String || Number,
    default: 0
  },
  data: {
    // row
    type: Object,
    default: {}
  },
  orderType: {
    // 订单类型0商品订单，1服务订单，2协作订单，3用户订单
    type: String || Number,
    default: 0
  }
})
const emit = defineEmits(['getData', 'update:modelValue'])
provide('mainOrderId', props.orderId)

const { push } = useRouter()
const sendOutShow = ref<boolean>(false) // 修改发货信息
const buyersRemindShow = ref<boolean>(false) // 新增给买家的提醒//关闭订单
const isRemindType = ref<boolean>(true) // 是否买家的提醒,true买家提醒，false关闭订单
const buyersRemindCheckShow = ref<boolean>(false) // 给买家的提醒查看
const editRecordShow = ref<boolean>(false) // 订单修改记录
const editDeliveryShow = ref<boolean>(false) // 修改收货信息
const goodsDeliveryShow = ref<boolean>(false) // 商品发货
const orderRefundShow = ref<boolean>(false) // 订单退款
const checkRefundShow = ref<boolean>(false) // 查看订单退款
const multiple = ref<boolean>(false) // false单个退款，true批量退款
const dialogVisible = ref<boolean>(false) // 商品修改
const assignVisible = ref<boolean>(false) // 订单指派
const acceptQuestShow = ref<boolean>(false) // 验收
const checkVisible = ref<boolean>(false) // 订单查看
const assignType = ref<string>('指派') // 指派,抢单
const orderItemId = ref<string | number>(0)
const batchRefund = ref<boolean>(false) // 控制批量退款按钮
const discountShow = ref<boolean>(false) // 优惠金额
const discountType = ref<string>('') // 优惠类型主订单、子订单
const showTerminateOrderDialog = ref(false) // 终止服务弹窗
const checkShow = ref<boolean>(false)
// 0=待付款, 1=待发货, 2=已发货, 3=待验收, 4=交易成功/待评价, 5=待售后, 6=售后完成, 7=已关闭, 8=退款, 9=无效订单
const stepActive = ref<number>(0)
const steps = ref<any>(step0)
const tableData = ref<any>([{}])
const state = reactive({
  isRefund: 0, // 是否有申请退款
  isRefundRail: 0, // 是否有退款失败的
  orderData: [] as any,
  data: {} as any,
  orderList: {} as any,
  orderLogList: [],
  dataForm: {} as any,
  orderItemIds: [] as any,
  checkStandard: [] as any, // 验收
  constructionOrder: {} as any // 施工单
})

const curFirstOrderInfo = computed(() => state.orderLogList[0])

const goProjectDetail = () => {
  const projectId = state.data?.projectId
  push({ path: `/bizproject/projectDetail/${baseEncode(projectId)}` })
}

const handelClick = (val: string, data?: any) => {
  switch (val) {
    case '修改发货信息':
      state.orderItemIds = tableData.value.map((item: any) => item.id)
      sendOutShow.value = true
      break
    case '新增':
      buyersRemindShow.value = true
      isRemindType.value = true
      break
    case '查看更多':
      buyersRemindCheckShow.value = true
      break
    case '修改收货信息':
      editDeliveryShow.value = true
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
        if (res.refundStatus !== 1) {
          // 状态为1，已经申请退款的商品不能发货
          state.orderItemIds.push(res.id)
        }
      })
      goodsDeliveryShow.value = true
      break
    case '收货':
      const obj = {
        orderId: props.orderId,
        orderItemIds: [data.id]
      }
      postReceive(obj)
      break
    case '批量收货':
      const orderItemIds: any = []
      tableData.value.forEach((res: any) => {
        orderItemIds.push(res.id)
      })
      const obj1: any = {
        orderId: props.orderId,
        orderItemIds: orderItemIds
      }
      postReceive(obj1)
      break
    case '退款':
      // 判断是否已有关联派单 assignType  指派方式：0-未指派；1-指派；2-抢单
      // if (state.data.assignType !== 0) {
      //   ElMessage.warning('订单已有关联派单，不允许退款')
      //   return
      // }
      // 协作订单判断是否已有关联项目
      // orderType 订单类型：0=商品订单；1=服务订单 2-协作订单
      if (state.data.orderType === 2 && state.data.projectId) {
        ElMessageBox.confirm(`该订单已关联项目，请作废项目进行退款`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            // 有关联项目跳转到项目作废页面
            push({
              path: `/bizproject/projectAbolish/${baseEncode(
                state.data?.projectId
              )}`
            })
          })
          .catch((e) => {})
        return
      }
      data.orderId = props.orderId
      data.amount = data.totalAmount
      multiple.value = true
      state.orderData = []
      state.orderData.push(JSON.parse(JSON.stringify(data)))
      orderRefundShow.value = true
      break
    case '批量退款':
      // 判断是否已有关联派单 assignType  指派方式：0-未指派；1-指派；2-抢单
      // if (state.data.assignType !== 0) {
      //   ElMessage.warning('订单已有关联派单，不允许退款')
      //   return
      // }
      // 协作订单判断是否已有关联项目
      // orderType 订单类型：0=商品订单；1=服务订单 2-协作订单
      if (state.data.orderType === 2 && state.data.projectId) {
        ElMessageBox.confirm(`该订单已关联项目，请作废项目进行退款`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            // 有关联项目跳转到项目作废页面
            push({
              path: `/bizproject/projectAbolish/${baseEncode(
                state.data?.projectId
              )}`
            })
          })
          .catch((e) => {})
        return
      }
      orderRefundShow.value = true
      multiple.value = false
      state.orderData = data
      break
    case '终止服务':
      if (!state.data.constructionOrderId) {
        ElMessage.warning('订单暂未关联施工单')
        return
      }
      // console.log(state.data)
      multiple.value = false
      state.constructionOrder = {
        id: state.data.constructionOrderId,
        payAmount: state.data.payAmount
      }
      state.orderData = []
      showTerminateOrderDialog.value = true
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
      state.dataForm = Object.assign(
        JSON.parse(JSON.stringify(state.data)),
        JSON.parse(JSON.stringify(data))
      )
      checkVisible.value = true
      break
    case '优惠金额':
      discountShow.value = true
      break
    case '验收':
      getProductDetail(state.data.orderItems[0].productId)
      break
    default:
      break
  }
}

// 查询商品详情
const getProductDetail = async (productId: any) => {
  await fetch({
    url: `/mall/product/updateInfo/${productId}`,
    method: 'get'
  }).then((res: any) => {
    state.checkStandard = res.data?.productProcess?.checkStandard
      ? JSON.parse(res.data?.productProcess?.checkStandard)
      : []
    acceptQuestShow.value = true
  })
}

// 删除订单
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
// 收货//批量收货
const postReceive = async (data: any) => {
  await fetch({
    url: `/mall/order/receive`,
    method: 'post',
    data: data
  }).then((res: any) => {
    if (res.code == '0') {
      ElMessage.success('确认收货成功')
      getOrderDetail()
    }
  })
}

// 获取订单动态
const getOrderLog = async () => {
  await fetch({
    url: `/mall/order/trends/list/${props.orderId}`,
    method: 'get'
  }).then((res: any) => {
    state.orderLogList = res.data
  })
  await getOrderDetail()
}
const getOrderList = async () => {
  await fetch({
    url: '/order/biz_order/getByOmsOrderId',
    method: 'get',
    params: {
      omsOrderId: props.orderId // cancelStatus 取消单是否查询，1>查询; 0>不查询，默认为0或者null  不查询取消单
    }
  }).then((res: any) => {
    state.orderList = res.data
  })
}
const getSendOrderList = (val: number) => {
  getOrderList()
  // emit('getByData')
}

// 订单详情
const getOrderDetail = async () => {
  await fetch({
    url: `/mall/order/${props.orderId}`,
    method: 'get'
  }).then((res: any) => {
    res.data.orderItems.map((item: any) => {
      // 单个商品退款状态：0-未退款 1-已申请 2-已审核待退款 3-已退款
      if (!item.refundStatus) {
        batchRefund.value = true
      }
    })
    res.data.orderItems.map((item: any) => {
      item['assignType'] = res.data.assignType
    })
    state.data = res.data
    stepActive.value = res.data.status
    tableData.value = res.data.orderItems
    state.data.totalDiffAmount = tableData.value.reduce(
      (n: any, m: { diffAmount: any }) => {
        return n + m.diffAmount
      },
      0
    )
  })
}

onMounted(() => {
  checkShow.value = props.modelValue
  if (checkShow.value) {
    getOrderLog()
  }
  if (props.orderType == '0') {
    steps.value = step0
  }
  if (props.orderType == '1') {
    steps.value = step1
  }
  getOrderList()
})

const closeHandelDrawer = () => {
  emit('update:modelValue', false)
  emit('getData')
}
</script>

<style scoped lang="less">
@import url('./index.module.less');

.is-icon {
  color: #f56c6c !important;
}

.refund-img {
  width: 10rem;
  height: 8rem;
}

:deep(.is-icon) {
  color: #f56c6c;
}
.productAttr {
  display: inline-block;
}
.total-pice-info{
  display: flex;
  justify-content: start;
  .info-item{
    width: 22rem;
    text-align: left;
    .label{
      font-weight: bold;
    }
  }
}
</style>
