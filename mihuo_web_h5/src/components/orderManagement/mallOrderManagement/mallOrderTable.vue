<template>
  <div class="order-table">
    <el-table
      ref="tableRef"
      v-loading="loading"
      style="height: calc(100vh - 43.4rem) !important"
      :data="tableData"
      :height="'0'"
      border
      highlight-current-row
      row-key="id"
      size="small"
      :span-method="arraySpanMethod"
      :row-class-name="tableRowClassName"
      :tree-props="{ children: 'orderItems', hasChildren: 'hasChildren' }"
      default-expand-all
    >
      <el-table-column
        :label="props.searchData.orderType != '3' ? '商品' : '需求描述'"
        width="700"
        header-align="center"
      >
        <template #default="scope">
          <div v-if="scope.row.orderItems">
            <div class="order-item" style="font-weight: bold">
              <el-tag
                v-if="[5].includes(scope.row.orderType)"
                size="mini"
                type="warning"
                effect="plain"
                style="font-weight: normal; margin-right:1rem"
              >优惠券</el-tag>
              <el-tag
                v-if="[4].includes(scope.row.orderType)"
                size="mini"
                type="warning"
                effect="plain"
                style="font-weight: normal; margin-right:1rem"
              >预付款</el-tag>
              <el-tag
                v-if="[3].includes(scope.row.orderType)"
                size="mini"
                effect="plain"
                style="font-weight: normal; margin-right:1rem"
              >套餐</el-tag>
              <div
                v-if="
                  setRefundTitle(scope.row)?.label &&
                    ['0', '1', '2'].includes(props.searchData.orderType)
                "
                class="marginLeft"
                :style="setRefundTitle(scope.row)?.style"
              >
                {{ setRefundTitle(scope.row)?.label }}
              </div>
              <div style="cursor: pointer; margin-right: 1rem">
                {{ scope.row.receiverName }}
                ({{ scope.row.receiverPhone }})
              </div>
              <div>
                {{
                  // (scope.row.receiverProvince || '') +
                  //   (scope.row.receiverCity || '') +
                  (scope.row.receiverRegion || '') +
                    (scope.row.receiverPoiName || '') +
                    (scope.row.receiverDetailAddress || '')
                }}
              </div>
              <div class="marginLeft">
                来源：{{ scope.row.projectId ? '项目' : '业主' }}
              </div>
              <div
                v-if="['0', '1', '2'].includes(props.searchData.orderType)"
                class="marginLeft"
              >
                应收金额：
                <sapn class="order-sn">
                  ￥{{ scope.row.payAmount?.toFixed(2) }}
                </sapn>
              </div>
            </div>
            <div class="order-item">
              <div class="order-sn marginLeft">
                订单编号：{{ scope.row.orderSn || scope.row.orderCode }}【{{
                  scope.row.projectId ? '项目开单' : '普通订单'
                }}】
              </div>
              <el-tag
                v-if="scope.row.deliveryType"
                :type="
                  scope.row.deliveryType == '0'
                    ? 'success'
                    : scope.row.deliveryType == '1'
                      ? ''
                      : 'warning'
                "
                effect="dark"
              >{{ getDeliveryType(scope.row.deliveryType) }}
              </el-tag>
              <div class="order-sn">创建时间：{{ scope.row.createTime }}</div>
              <div class="user marginLeft">
                <div class="people">
                  <img
                    class="avatar-img"
                    :src="$getUrl.avatarImage(scope.row.memberId)"
                    @error="$getUrl.imageError($event)"
                  >
                  <span>{{
                    scope.row.memberUsername || scope.row.memberUsername
                  }}</span>
                </div>
                <img
                  src="@/assets/img/message.png"
                  class="message-avatar"
                  @click="
                    openIM({
                      userId: scope.row.memberId,
                      name: scope.row.memberUsername
                    })
                  "
                >
              </div>
            </div>

            <div class="order-item">
              <!-- 服务订单 -->
              <div v-if="['1'].includes(props.searchData.orderType)">
                <el-popover
                  ref="dropdown"
                  trigger="hover"
                  placement="bottom"
                  width="auto"
                  :append-to-body="true"
                >
                  <template #reference>
                    <div v-if="scope.row.receiverName">
                      <!-- communicateStatus：1沟通过，0没沟通过
                          communicateIntention：1愿意接单，0不愿意接单
                      -->
                      <span
                        v-if="
                          scope.row.assignType != 0 &&
                            scope.row.communicateStatus == 1
                        "
                        class="marginLeft"
                        @click="
                          seeCommunicationRecord(
                            filterCloseBizOrder(scope.row.bizOrders)[0]?.id
                          )
                        "
                      >
                        沟通记录：{{
                          scope.row.communicateIntention == 1
                            ? '愿意接单'
                            : '不愿意接单'
                        }}
                      </span>
                      <span
                        v-if="
                          filterCloseBizOrder(scope.row.bizOrders)[0]?.price
                        "
                        class="marginLeft"
                      >
                        订单金额：{{
                          filterCloseBizOrder(
                            scope.row.bizOrders
                          )[0]?.price.toFixed(2)
                        }}
                      </span>
                    </div>
                  </template>
                  <!-- 服务订单指派抢单人员信息 -->
                  <template #default>
                    <div
                      v-if="
                        scope.row.assignType == 0 ||
                          !filterCloseBizOrder(scope.row.bizOrders)?.length
                      "
                    >
                      未指派
                    </div>
                    <div v-else>
                      <div v-if="scope.row.assignType == 1">已指派</div>
                      <div v-if="scope.row.assignType == 2">已抢单</div>
                      <div
                        v-if="
                          filterCloseBizOrder(scope.row.bizOrders)[0]
                            ?.orderOfferList?.length
                        "
                        class="user"
                      >
                        <img
                          src="@/assets/img/message.png"
                          class="message-avatar"
                          style="margin: 0 1rem 0 0"
                          @click="
                            openIM({
                              userId: filterCloseBizOrder(
                                scope.row.bizOrders
                              )[0]?.orderOfferList[0]?.bidUserId,
                              name: filterCloseBizOrder(scope.row.bizOrders)[0]
                                ?.orderOfferList[0]?.personName
                            })
                          "
                        >
                        <div>
                          {{
                            filterCloseBizOrder(scope.row.bizOrders)[0]
                              ?.orderOfferList[0]?.skillName
                          }}
                          {{
                            filterCloseBizOrder(scope.row.bizOrders)[0]
                              ?.orderOfferList[0]?.personName
                          }}
                          （{{
                            filterCloseBizOrder(scope.row.bizOrders)[0]
                              ?.orderOfferList[0]?.phone
                          }}）
                        </div>
                      </div>
                    </div>
                  </template>
                </el-popover>
              </div>
              <div
                v-if="
                  scope.row.receiverName &&
                    !['1'].includes(props.searchData.orderType)
                "
                class="marginLeft"
              >
                <!-- {{ scope.row.receiverName }}({{ scope.row.receiverPhone }}) -->
              </div>
            </div>
          </div>

          <div
            v-if="scope.row.productPic"
            class="goods"
            style="margin: -1rem 1rem 1rem 1rem"
          >
            <el-image
              :src="$getUrl.getPicUrl(scope.row.productPic)"
              :preview-src-list="$getUrl.getPicUrl(scope.row.productPic)"
              :preview-teleported="true"
              :fit="fit"
            />
            <div class="goods-info">
              <div class="product-name" @click="handelClick('商品', scope.row)">
                {{ scope.row.productName }}
              </div>
              <div class="goods-tag">
                <el-tag type="info">{{ scope.row.productSn }}</el-tag>
                <el-tag type="info">{{ scope.row.productBrand }}</el-tag>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center" width="150">
        <template #default="scope">
          <div v-if="['0'].includes(props.searchData.orderType)">
            <div
              v-if="!scope.row.orderItems"
            >
              <el-tag
                :type="
                  getOrderStatus(scope.row.status, props.searchData.orderType)
                    ?.type
                "
              >
                {{
                  getOrderStatus(scope.row.status, props.searchData.orderType)
                    ?.text
                }}
              </el-tag>
            </div>
            <!-- <div
              v-if="
                !scope.row.orderItems &&
                  (scope.row.status == 1 || scope.row.status == 2)
              "
            >
              <el-tag
                :type="
                  getDeliveryStatus(
                    scope.row.deliveryType
                  ).type
                "
              >
                {{
                  getDeliveryStatus(
                    scope.row.deliveryType
                  ).label
                }}
              </el-tag>
            </div> -->
          </div>
          <div
            v-if="
              !scope.row.orderItems &&
                ['1', '2'].includes(props.searchData.orderType)
            "
          >
            <el-tag
              :type="
                getOrderStatus(scope.row.status, props.searchData.orderType)
                  .type
              "
            >
              {{
                getOrderStatus(scope.row.status, props.searchData.orderType)
                  .text
              }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="['0', '1', '2'].includes(props.searchData.orderType)"
        label="退款状态"
        prop="payAmount"
        width="150"
        align="center"
      >
        <template #default="scope">
          <div
            v-if="scope.row && scope.row.refundStatus && scope.row.refundStatus > 0"
            :style="getRefundStatus(scope.row.refundStatus).style"
          >
            <div>{{ getRefundStatus(scope.row.refundStatus).label }}</div>
            <div>￥{{ scope.row.refundAmount.toFixed(2) }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="!['3'].includes(props.searchData.orderType)"
        label="单价（元）/单位"
        header-align="center"
        prop="productPrice"
        width="150"
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
      <el-table-column
        v-if="!['3'].includes(props.searchData.orderType)"
        label="数量"
        header-align="center"
        prop="productQuantity"
        align="center"
      />
      <el-table-column
        v-if="['0'].includes(props.searchData.orderType)"
        label="小计"
        header-align="center"
        prop=""
        width="150"
        align="center"
      >
        <template #default="scope">
          <div>￥{{ scope.row.totalAmount?.toFixed(2) }}</div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="!['3'].includes(props.searchData.orderType)"
        label="商品留言"
        width="180"
        align="center"
        prop="serviceNotes"
        show-overflow-tooltip
      >
        <template #default="scope">
          <div>{{ scope.row.serviceNotes }}</div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="['3'].includes(props.searchData.orderType)"
        label="呼叫类型"
        width="180"
        align="center"
        prop=""
      />
      <el-table-column
        v-if="['3'].includes(props.searchData.orderType)"
        label="期望报价"
        width="180"
        align="center"
        prop=""
      />
      <el-table-column
        v-if="['3'].includes(props.searchData.orderType)"
        label="需求工种"
        width="180"
        align="center"
        prop=""
      />
      <el-table-column
        v-if="['3'].includes(props.searchData.orderType)"
        label="期望上门时间"
        width="180"
        align="center"
        prop=""
      />
      <!-- <el-table-column
        v-if="['0', '1', '2'].includes(props.searchData.orderType)"
        label="实收金额"
        header-align="center"
        prop="payAmount"
        width="180"
        align="center"
      >
        <template #default="scope">
          <div v-if="!scope.row.orderItems">
            <div style="color: #4d4d4d; font-size: 12px; font-weight: bold">
              ￥{{ scope.row.totalAmountOrder?.toFixed(2) }}
            </div>
            <div
              v-if="['0'].includes(props.searchData.orderType)"
              style="color: #909399; font-size: 12px"
            >
              （含运费￥{{ scope.row.freightAmount?.toFixed(2) }}）
            </div>
          </div>
        </template>
      </el-table-column> -->
      <el-table-column
        v-if="['3'].includes(props.searchData.orderType)"
        label="付款金额"
        header-align="center"
        prop="payAmount"
        width="100"
        align="center"
      >
        <template #default="scope">
          <div v-if="!scope.row.orderItems" />
        </template>
      </el-table-column>
      <el-table-column
        v-if="['1', '2', '3'].includes(props.searchData.orderType)"
        label="变更金额"
        header-align="center"
        prop=""
        width="100"
        align="center"
      >
        <template #default="scope">
          <div
            v-if="!scope.row.orderItems"
            :class="{
              'change-amount-positive': Number(scope.row.changeAmount || 0) > 0,
              'change-amount-minus': Number(scope.row.changeAmount || 0) < 0
            }"
            @click="handelClick('变更金额', scope.row)"
          >
            {{
              Number(scope.row.changeAmount || 0) > 0
                ? '+'
                : Number(scope.row.changeAmount || 0) < 0
                  ? '-'
                  : ''
            }}
            ￥{{ scope.row.changeAmount?.toFixed(2) || 0 }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="['1'].includes(props.searchData.orderType)"
        label="派工状态"
        prop="payAmount"
        width="180"
        align="center"
      >
        <template #default="scope">
          <div
            v-if="
              getOrderAcceptStatus(
                scope.row.assignType,
                scope.row.bizOrders,
                scope.row.status
              )
            "
          >
            <el-tag>{{
              getOrderAcceptStatus(
                scope.row.assignType,
                scope.row.bizOrders,
                scope.row.status
              )
            }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="['1', '2', '3'].includes(props.searchData.orderType)"
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
      <el-table-column
        v-if="['1', '2'].includes(props.searchData.orderType)"
        label="所需工种"
        header-align="center"
        prop="skillName"
        width="100"
        align="center"
      />
      <el-table-column
        v-if="['3'].includes(props.searchData.orderType)"
        label="订单来源"
        header-align="center"
        prop="payAmount"
        width="180"
        align="center"
      >
        <template #default="scope">
          <div v-if="!scope.row.orderItems" />
        </template>
      </el-table-column>
      <!-- <el-table-column
        v-if="['1'].includes(props.searchData.orderType)"
        label="服务状态"
        header-align="center"
        prop="payAmount"
        width="180"
        align="center"
      >
        <template #default="scope">
          <div v-if="!scope.row.orderItems">
            <div
              :class="
                scope.row.isAssign == '1' ? 'service-type' : 'service-type2'
              "
            >
              <span>工人派单</span>
              <div>
                <el-icon v-if="scope.row.isAssign == '1'">
                  <Check />
                </el-icon>
              </div>
            </div>
            <div
              :class="
                scope.row.checkFlag == '1' ? 'service-type' : 'service-type2'
              "
            >
              <span>内部验收</span>
              <div>
                <el-icon v-if="scope.row.checkFlag == '1'">
                  <Check />
                </el-icon>
              </div>
            </div>
            <div
              :class="
                scope.row.deliveryTpe == '2'
                  ? 'service-type'
                  : 'service-type2'
              "
            >
              <span>客户确认</span>
              <div>
                <el-icon v-if="scope.row.deliveryTpe == 2">
                  <Check />
                </el-icon>
              </div>
            </div>
          </div>
        </template>
      </el-table-column> -->
      <el-table-column
        v-if="['2', '3'].includes(props.searchData.orderType)"
        label="客户确认"
        header-align="center"
        prop="payAmount"
        width="180"
        align="center"
      >
        <template #default="scope" />
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        fixed="right"
        width="300"
      >
        <template #default="scope">
          <el-button
            v-if="scope.row.orderItems"
            type="text"
            icon="view"
            @click="handelClick('查看', scope.row)"
          >查看
          </el-button>
          <el-button
            v-if="
              scope.row.orderItems &&
                props.searchData.orderType == 1 &&
                scope.row.status != 7
            "
            :disabled="scope.row.assignType > 0"
            type="text"
            icon="pointer"
            @click="handelClick('指派', scope.row)"
          >指派
          </el-button>
          <el-button
            v-if="
              scope.row.orderItems &&
                props.searchData.orderType == 1 &&
                scope.row.status != 7
            "
            :disabled="scope.row.assignType > 0"
            type="text"
            icon="promotion"
            @click="handelClick('抢单', scope.row)"
          >
            抢单
          </el-button>
          <el-button
            v-if="scope.row.orderItems && props.searchData.orderType == 1"
            :disabled="
              scope.row.assignType == 0 ||
                getOrderStopStatus(scope.row.bizOrders)
            "
            type="text"
            class="danger"
            icon="close"
            @click="handelClick('终止服务', scope.row)"
          >
            终止服务
          </el-button>
          <!-- orderStatus == 15 已报价可以选他 -->
          <el-button
            v-if="
              scope.row.orderItems &&
                props.searchData.orderType == 1 &&
                filterCloseBizOrder(scope.row.bizOrders)[0]?.orderOfferList[0]
                  ?.bidStatus == 2
            "
            type="text"
            @click="handelClick('确认选TA', scope.row)"
          >
            确认选TA
          </el-button>
          <el-button
            v-if="!scope.row.orderItems"
            :disabled="scope.row.status != 0"
            type="text"
            icon="edit-pen"
            @click="handelClick('修改', scope.row)"
          >修改
          </el-button>
          <el-button
            v-if="scope.row.orderItems"
            :disabled="scope.row.status != 7"
            type="text"
            icon="delete"
            class="danger"
            @click="handelClick('删除订单', scope.row)"
          >
            删除
          </el-button>
          <el-button
            v-if="
              !scope.row.orderItems &&
                ['0'].includes(props.searchData.orderType)
            "
            :disabled="scope.row.status != 7"
            type="text"
            icon="delete"
            class="danger"
            @click="handelClick('删除订单商品', scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination-new
      :current-page="currentPage"
      :page-size="pagesize"
      :total="total"
      layout="total, prev, pager, next, jumper"
      @current-change="handleCurrentChange"
    />
    <!-- 终止服务弹框 -->
    <el-dialog
      v-model="againReleaseVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="终止服务"
      append-to-body
      width="55rem"
    >
      <el-form
        ref="rulesFormRef"
        label-width="12rem"
        :rules="rules"
        :model="state.againRelease"
      >
        <el-form-item label="预结算金额" prop="amount">
          <el-input
            v-model="state.againRelease.amount"
            type="number"
            @input="(val) => changePrice(val)"
          >
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="state.againRelease.remark" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="againReleaseVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="againReleaseConfirm"
          >确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!--    //指派和抢单-->
    <orderAssignGrabSingle
      v-model="assignVisible"
      :data-form="formData"
      :type="assignType"
      @getData="getData"
    />

    <!--    //修改商品信息-->
    <editMallOrder
      v-model="dialogVisible"
      :data-form="formData"
      @getData="getData"
    />

    <!--    //订单查看？-->
    <orderDetailCheck
      v-if="checkVisible"
      v-model="checkVisible"
      :order-type="props.searchData.orderType"
      :order-id="formData.id"
      @getData="getData"
    />
    <!--    商品？商品-->
    <productDetailDrawer v-model="productDrawerShow" :product-id="productId" />

    <!--    //变更金额-->
    <changeAmountDrawer
      v-if="changeAmountShow"
      v-model="changeAmountShow"
      :order-type="props.searchData.orderType"
      :order-id="formData.id"
    />

    <!-- 沟通记录 -->
    <communicationRecord
      v-if="communication"
      v-model="communication"
      :order-id="communicateId"
      @getData="getData"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  onMounted,
  defineExpose,
  defineEmits,
  defineProps,
  watch
} from 'vue'
import { ImStore } from '_@/store/modules/im'
import wsCache from '@/cache'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetch } from '_@/axios-config/axios'
import {
  getSkuData,
  openIM,
  groupData,
  tableRowClassName,
  arraySpanMethod,
  getDeliveryType,
  getOrderStatus,
  getDeliveryStatus,
  getRefundStatus
} from '@/components/orderManagement/order'
import { inputLimtPrice } from '@/utils/utils'
import { valid } from 'mockjs'
import { assign } from 'lodash'

const props = defineProps({
  searchData: {
    type: Object,
    default: {}
  },
  current: {
    type: [Number, String],
    default: 0
  },
  protType: {
    type: [Number, String],
    default: ''
  }
})
const tableRef = ref<any>()
const total = ref<number>(0)
const currentPage = ref<number>(1)
const pagesize = ref<number>(15)
const tableData = ref([])
const loading = ref<boolean>(false)
const assignVisible = ref<boolean>(false) // 订单指派
const checkVisible = ref<boolean>(false) // 订单查看
const assignType = ref<string>('指派') // 指派,抢单
const dialogVisible = ref<boolean>(false) // 指派,抢单
const changeAmountShow = ref<boolean>(false) // 变更金额
const formData = ref({})
const productId = ref(0)
const communicateId = ref(0)
const preSettAmount = ref(0) // 终止合作的预结算金额
const communication = ref<boolean>(false) // 沟通记录
const againReleaseVisible = ref<boolean>(false)
const rulesFormRef = ref<any>('')
const state = reactive({
  againRelease: {
    remark: ''
  } as any
})

const rules = reactive({
  amount: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value == '' || value == 0) {
          callback(new Error('请输入金额'))
        } else {
          if (parseFloat(state.againRelease.amount) > preSettAmount.value) {
            callback(new Error('不能大于预结算金额'))
          }
          callback()
        }
      },
      required: true,
      trigger: 'blur'
    }
  ],
  remark: [
    {
      required: true,
      message: '请输入备注',
      trigger: 'blur'
    }
  ]
})

// 过滤掉关闭的bizOrder
const filterCloseBizOrder = (bizOrders: any) => {
  const list: any = bizOrders.filter((item: any) => item.orderStatus != -1)
  return list
}

const changePrice = (val: any) => {
  state.againRelease.amount = inputLimtPrice(val)
}

// 查看沟通记录
const seeCommunicationRecord = (orderId: any) => {
  communicateId.value = orderId
  communication.value = true
}

const getOrderAcceptStatus = (assignType: any, orders: any) => {
  if (!assignType || !orders) return ''
  const order = orders.find((item: any) => item.orderStatus > 0)
  if (order && assignType == 1) {
    const acceptStatus = order.orderOfferList[0]
    switch (acceptStatus.bidStatus) {
      case 0:
        return '已指派-待确认'
      case 1:
        return '已指派-接单方已拒绝'
      case 2:
        return '已指派-已接单'
      case 3:
        switch (order.orderStatus) {
          case 30:
            return '已指派-服务中'
          case 35:
            return '已指派-待验收'
          case 40:
            return '已指派-待结算'
          case 50:
            return '已指派-已完成'
          case 51:
            return '已指派-已完成'
        }
      case 4:
        return '已指派-发单方已拒绝'
    }
  }
  if (assignType == 2 && order) {
    const acceptStatus = order.orderOfferList[0]
    if (!acceptStatus) {
      return '已发布-待抢单'
    }
    switch (acceptStatus.bidStatus) {
      case 0:
        return '已发布-待确认'
      case 1:
        return '已发布-接单方已拒绝'
      case 2:
        return '已发布-已接单'
      case 3:
        switch (order.orderStatus) {
          case 30:
            return '已发布-服务中'
          case 35:
            return '已发布-待验收'
          case 40:
            return '已发布-待结算'
          case 50:
            return '已发布-已完成'
          case 51:
            return '已发布-已完成'
        }
      case 4:
        return '已发布-发单方已拒绝'
    }
  }
  return ''
}
const getOrderStopStatus = (data: any) => {
  const order = data.find((item: any) => item.orderStatus > 0)
  if (order && order.orderOfferList.length) {
    if (
      order.orderOfferList[0] &&
      (order.orderOfferList[0].bidStatus > 3 ||
        order.orderOfferList[0].bidStatus == 3)
    ) {
      return false
    }
  }
  return true
}
const setRefundTitle = (row: any) => {
  // refundStatus 0-未退款 1-已申请 2-已审核待退款 3-已退款
  const list = row.orderItems
  const not = list.filter((m: any) => m.refundStatus == 0).length
  const requested = list.filter((m: any) => m.refundStatus == 1).length
  const wait = list.filter((m: any) => m.refundStatus == 2).length
  const already = list.filter((m: any) => m.refundStatus == 3).length
  const count = list?.length
  switch (count) {
    case not:
      return {}
    case requested:
      return {
        label: '已申请退款',
        style: 'color: #67C23A'
      }
    case wait:
      return {
        label: '已审核待退款',
        style: 'color: #409EFF'
      }
    case already:
      return {
        label: '已退款',
        style: 'color:#F56C6C'
      }
  }
}

const handelClick = (val: string, data: any) => {
  switch (val) {
    case '修改':
      tableData.value.forEach((item: any) => {
        item.orderItems.forEach((item2: any) => {
          if (data.id == item2.id) {
            data.orderId = item.id
          }
        })
      })
      dialogVisible.value = true
      formData.value = data
      break
    case '删除订单':
      ElMessageBox.confirm(`此操作将永久删除该订单, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteOrder(data.id)
      })
      break
    case '删除订单商品':
      ElMessageBox.confirm(`此操作将永久删除该商品, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteOrderProduct(data.orderId, data.id)
      })
      break
    case '查看':
      checkVisible.value = true
      formData.value = data
      break
    case '变更金额':
      formData.value = data
      changeAmountShow.value = true
      break
    case '指派':
      // 预估费用不可更改
      assignVisible.value = true
      assignType.value = '指派'
      formData.value = data
      break
    case '抢单':
      // 订单类型、计价类型、报价不可更改
      assignVisible.value = true
      assignType.value = '抢单'
      formData.value = data
      break
    case '终止服务':
      againReleaseVisible.value = true
      state.againRelease.amount = preSettAmount.value = data.payAmount
      // 这里的id应该过滤 -1的状态的的
      const orderData = data.bizOrders.filter(
        (item: any) => item.orderStatus > -1
      )
      state.againRelease.orderId = orderData[0]?.id // 指派id
      state.againRelease.remark = ''
      break
    case '确认选TA':
      const offerId = data.bizOrders[0]?.orderOfferList[0]?.id
      chooseHim(offerId)
      break
  }
}

// 终止服务
const againReleaseConfirm = async () => {
  await rulesFormRef.value.validate((valid: any) => {
    if (valid) {
      fetch({
        url: '/order/bizproject/substitutionPerson',
        method: 'post',
        data: state.againRelease
      }).then((res: any) => {
        if (res.code == 0) {
          ElMessage.success('操作成功')
          againReleaseVisible.value = false
          getData(true)
        }
      })
    }
  })
}

// 确认选他
const chooseHim = async (offerId: any) => {
  await fetch({
    url: `order/biz_order/publisher/confirmPerson/${offerId}`,
    method: 'post'
  }).then((res: any) => {
    if (res.code == 0) {
      ElMessage.success('操作成功')
      getData()
    }
  })
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getData()
}

const getData = async (isSearch: any = true, resstart: any = false) => {
  if (resstart) {
    tableData.value = []
  }
  const search = JSON.parse(JSON.stringify(props.searchData))
  let url
  if (search.orderType == 3) {
    url = '/order/admin/order/page'
    search['orderCode'] = search['orderSn']
  } else {
    url = '/mall/order/page/new'
  }
  if (!isSearch) {
    search['orderSn'] = null
  }
  if (search.status === '-1') {
    search.status = null
  }
  await fetch({
    url: url,
    method: 'get',
    params: {
      size: pagesize.value,
      desc: 'id',
      current: currentPage.value,
      sourceType: 1, // 查询非项目开单的数据
      ...search
    }
  }).then((res: any) => {
    total.value = res.data.total
    tableData.value = res.data.records
    if (search.orderType == 3) return
    tableData.value.forEach((res: any, index: any) => {
      res.orderItems.forEach((res2: any) => {
        res2.orderId = res.id
        res2.status = res.status
        res2.freightAmount = res.freightAmount
        res2.totalAmountOrder = res.totalAmount
        // if (index % 2 === 0) {
        //   res.orderItems.push(res2)
        // } else {
        //   res.orderItems.push(res2)
        //   res.orderItems.push(res2)
        // }
      })
    })
  })
}
// 删除订单
const deleteOrder = async (orderId: any) => {
  await fetch({
    url: `/mall/order/delete`,
    method: 'get',
    params: {
      ids: orderId
    }
  }).then((res: any) => {
    if (res.code == '0') {
      ElMessage.success('删除订单成功')
      getData(false)
    }
  })
}
// 删除订单商品
const deleteOrderProduct = async (orderId: any, orderItemId: any) => {
  await fetch({
    url: `/mall/order/delOrderItem/${orderId}/${orderItemId}`,
    method: 'post'
  }).then((res: any) => {
    if (res.code == '0') {
      ElMessage.success('删除商品成功')
      getData(false)
    }
  })
}
const scrollBehavior = (e: any) => {
  const dom =
    tableRef.value.$refs.bodyWrapper.getElementsByClassName(
      'el-scrollbar__wrap'
    )[0]

  const { clientHeight, scrollTop, scrollHeight } = dom
}

watch(
  () => props.searchData.orderType,
  (newValue, oldValue) => {
    if (newValue) {
      currentPage.value = 1
    }
  }
)

watch(
  () => againReleaseVisible.value,
  (newValue, oldValue) => {
    if (!newValue) {
      state.againRelease = {}
      rulesFormRef.value.resetFields()
    }
  }
)

onMounted(() => {
  getData()
  // tableRef.value &&
  //   tableRef.value['$refs']['bodyWrapper'].addEventListener(
  //     'mousewheel'
  //     //scrollBehavior
  //   )
  // setTimeout(() => {
  //   const dom =
  //     tableRef.value.$refs.bodyWrapper.getElementsByClassName(
  //       'el-scrollbar__wrap'
  //     )[0]
  //   dom.scrollTop = 500
  // }, 1600)
})

defineExpose({ getData })
</script>

<style scoped lang="less">
@import '../orderTable';
:deep(.el-table .success-row) {
  --el-table-tr-bg-color: @errorBackColor;
}
.marginLeft {
  margin-left: 2rem;
}
.hidden-text {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
