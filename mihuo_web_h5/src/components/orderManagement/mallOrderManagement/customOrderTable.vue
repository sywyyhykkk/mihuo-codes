<template>
  <div class="order-table">
    <el-table
      v-loading="loading"
      highlight-current-row
      style="height: calc(100vh - 43.4rem) !important"
      :data="tableData"
      :height="'0'"
      border
      row-key="id"
      size="small"
      :row-class-name="custoRowClassName"
      default-expand-all
    >
      <el-table-column label="订单编号" width="350">
        <template #default="scope">
          <div class="order-item">
            <div class="order-sn hidden-text">
              {{ scope.row.orderCode }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="需求描述" width="350">
        <template #default="scope">
          <div class="goods-info">
            <div class="product-name">
              {{ scope.row.requirementDesc }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="发单方信息" width="350">
        <template #default="scope">
          <div class="user" style="margin: 1rem 0">
            <div class="people hidden-text" style="width: 18rem">
              <img
                class="avatar-img"
                :src="$getUrl.avatarImage(scope.row.userId)"
                @error="$getUrl.imageError($event)"
              >
              <span>{{ scope.row.userName || scope.row.userName }}</span>
            </div>
            <img
              src="@/assets/img/message.png"
              class="message-avatar"
              @click="
                openIM({
                  userId: scope.row.userId,
                  name: scope.row.userName
                })
              "
            >
          </div>
          <div
            v-if="scope.row.contactName"
            style="min-width: 30rem; margin-bottom: 1rem"
          >
            联系人信息：{{ scope.row.contactName }}({{
              scope.row.contactPhone
            }})
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创建日期" width="350">
        <template #default="scope">
          <div class="order-sn hidden-text" style="width: 26rem">
            {{ scope.row.created }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center" width="150">
        <template #default="scope">
          <div>
            <el-tag :type="getCustomOrderStatus(scope.row.orderStatus,scope.row.deliveryType,scope.row.communicateStatus)?.type">
              {{ getCustomOrderStatus(scope.row.orderStatus,scope.row.deliveryType,scope.row.communicateStatus)?.label }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="位置"
        header-align="center"
        prop=""
        width="500"
        align="center"
      >
        <template #default="scope">
          <div @click="handelClick('变更金额', scope.row)">
            {{
              (scope.row.districtName || '') +
                (scope.row.poiName || '') +
                (scope.row.address || '')
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="呼叫类型"
        width="180"
        align="center"
        prop="source"
      >
        <template #default="scope">
          <div>
            {{ getPriceWay(scope.row.priceWay) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="期望报价"
        width="180"
        align="center"
        prop="price"
      />
      <el-table-column
        label="需求工种"
        width="180"
        align="center"
        prop="skillName"
      />
      <el-table-column
        label="期望上门时间"
        width="180"
        align="center"
        prop="expectDate"
      />
      <el-table-column
        label="沟通记录"
        header-align="center"
        prop=""
        width="200"
        align="center"
      >
        <template #default="scope">
          <span
            v-if="scope.row.orderItems && !scope.row.communicateStatus"
            style="color: #f56c6c; font-size: 1.2rem"
          >未沟通</span>
          <view v-if="scope.row.orderItems || scope.row.communicateStatus">
            <el-button
              v-if="scope.row.orderItems && scope.row.communicateStatus"
              type="text"
              @click="handelClick('沟通记录', scope.row.orderItems[0])"
            >
              <span
                v-if="scope.row.communicateIntention"
                style="font-size: 1.2rem"
              >有接单意向</span>
              <span v-else style="font-size: 1.2rem">无接单意向</span>
            </el-button>
          </view>
        </template>
      </el-table-column>
      <el-table-column
        label="付款金额"
        prop=""
        width="180"
        align="center"
      />
      <el-table-column
        label="变更金额"
        header-align="center"
        prop=""
        width="100"
        align="center"
      >
        <template #default="scope">
          <div
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
          <div class="total-amount">￥{{ scope.row.price }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="订单来源"
        width="180"
        align="center"
        prop="source"
      >
        <template #default="scope">
          <div>
            {{ getSource(scope.row.source) }}
          </div>
        </template></el-table-column>
      <el-table-column
        label="客户确认"
        header-align="center"
        prop="payAmount"
        width="180"
        align="center"
      >
        <template #default="scope">
          <div>
            <span :style="getCustomStatus(scope.row.orderStatus)?.type">
              {{ getCustomStatus(scope.row.orderStatus)?.label }}
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        fixed="right"
        width="280"
      >
        <template #default="scope">
          <el-button
            v-if="scope.row.orderItems"
            type="text"
            icon="view"
            @click="handelClick('查看', scope.row.orderItems[0])"
          >查看
          </el-button>
          <div v-if="scope.row.orderStatus>5">
            <el-button
              :disabled="scope.row.status != 0"
              type="text"
              icon="delete"
              class="danger"
              @click="handelClick('删除订单商品', scope.row)"
            >
              退款
            </el-button>
            <el-button
              type="text"
              icon="pointer"
              @click="handelClick('推送播报', scope.row)"
            >推送播报
            </el-button>
          </div>
          <div v-if="scope.row.orderStatus==5 && $getPression('biz_requirement_order_operation')">
            <el-button
              type="text"
              icon="pointer"
              @click="handelClick('指派', scope.row)"
            >指派
            </el-button>
            <el-button
              type="text"
              icon="promotion"
              @click="handelClick('抢单', scope.row)"
            >
              抢单
            </el-button>
            <el-button
              type="text"
              class="danger"
              icon="close"
              @click="handelClick('拒绝', scope.row)"
            >
              拒绝
            </el-button>
          </div>
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

    <!-- 沟通记录 -->
    <communicationRecord
      v-if="communication"
      v-model="communication"
      :order-data="formData"
      :order-id="formData.id"
      @getData="getData"
    />
    <!-- 播报语音 -->
    <orderVoiceAnnouncements
      v-if="voiceVisible"
      v-model="voiceVisible"
      :data-form="formData"
      :type="assignType"
      @getData="getData"
    />

    <!--    //订单查看？-->
    <customOrderDetailCheck
      v-if="checkVisible"
      v-model="checkVisible"
      :order-type="props.searchData.orderType"
      :order-id="formData.id"
      :order-data="formData"
      @getData="getData"
    />

    <!--    //变更查看-->
    <changeDetailCheck
      v-if="changeAmountShow"
      v-model="changeAmountShow"
      :order-id="formData.id"
      @getData="getData"
    />

    <!-- 拒绝订单需求 -->
    <customOrderRefused
      v-if="refusedVisible"
      v-model="refusedVisible"
      :order-id="formData.id"
      @getData="getData"
    />

    <customOrderAccept
      v-if="assignVisible"
      v-model="assignVisible"
      :order-data="formData"
      :title="title"
      @getData="getData"
    />

  </div>
</template>

<script lang='ts' setup>
import { ref, onMounted, defineExpose, defineEmits, defineProps } from 'vue'
import { ImStore } from '_@/store/modules/im'
import wsCache from '@/cache'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetch } from '_@/axios-config/axios'
import {
  getSkuData,
  openIM,
  groupData,
  custoRowClassName,
  arraySpanMethod,
  getDeliveryType,
  getCustomOrderStatus,
  getDeliveryStatus
} from '@/components/orderManagement/order'
import { isFullscreen } from 'screenfull'

const props = defineProps({
  searchData: {
    type: Object,
    default: {}
  }
})

const total = ref<number>(0)
const currentPage = ref<number>(1)
const pagesize = ref<number>(15)
const tableData = ref([])
const title = ref('') // 标题
const loading = ref<boolean>(false)
const assignVisible = ref<boolean>(false) // 订单指派,抢单
const refusedVisible = ref<boolean>(false) // 拒绝订单
const checkVisible = ref<boolean>(false) // 订单查看
const assignType = ref<string>('指派') // 指派,抢单
const dialogVisible = ref<boolean>(false) // 指派,抢单
const changeAmountShow = ref<boolean>(false) // 变更金额
const formData = ref<any>({})
const productId = ref(0)
const voiceVisible = ref<boolean>(false)
// 订单状态
const status = [10, 20, 30, 40, 50, -1, 60, 5]
const communication = ref<boolean>(false)

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
    case '推送播报':
      voiceVisible.value = true
      formData.value = data
      break
    case '沟通记录':
      communication.value = true
      formData.value = data
      break
    case '指派':
      data.assignType = 1
      formData.value = Object.assign({}, data)
      formData.value.skillId = null
      formData.value.orderId = data.id
      title.value = '订单指派'
      assignVisible.value = true
      break
    case '抢单':
      data.assignType = 2
      formData.value = Object.assign({}, data)
      title.value = '订单抢单'
      formData.value.orderId = data.id
      assignVisible.value = true
      break
    case '拒绝':
      formData.value = data
      refusedVisible.value = true
      break
  }
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getData(true)
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
const getSource = (data: any) => {
  switch (data) {
    case 1:
      return 'C端'
    case 2:
      return '服务端'
    case 3:
      return '企业端'
    case 4:
      return '平台端'
    default:
      return '其他'
  }
}
const getCustomStatus = (status: any) => {
  if (status > 15) {
    return {
      type: { color: '#C0C4CC' },
      label: '已确认'
    }
  } else {
    return {
      type: { color: '#409EFF' },
      label: '待确认'
    }
  }
}

const getData = async (isRefresh: any = true, resstart: any = false) => {
  if (resstart) {
    tableData.value = []
  }
  const search = JSON.parse(JSON.stringify(props.searchData))
  if (!isRefresh) {
    search['orderCode'] = null
  } else {
    search['orderCode'] = search['orderSn']
  }
  search['orderSn'] = null
  if (search.status == '-1') {
    search.status = null
  }
  let cancelFlag: any = ''
  if (search.status == '6') {
    cancelFlag = 1
  }
  const url = '/order/admin/order/page'
  await fetch({
    url: url,
    method: 'get',
    params: {
      size: pagesize.value,
      current: currentPage.value,
      descs: 'id',
      cancelFlag: cancelFlag || '',
      orderStatus: !cancelFlag ? status[search.status] : '',
      source: search.sourceType || '',
      assignType: search.type || '',
      ...search
    }
  }).then((res: any) => {
    total.value = res.data.total
    const result = res.data.records || []
    result.forEach((item: any, index: any) => {
      item.orderItems = [{ ...item, id: item.id }]
      // 不知道为什么加order,所以注释
      // item.id = 'order' + item.id
    })
    tableData.value = result
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
      getData(true)
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
      getData(true)
    }
  })
}

defineExpose({ getData })
</script>

<style scoped lang="less">
@import '../orderTable';
:deep(.el-table .success-row) {
  --el-table-tr-bg-color: @errorBackColor;
}
.order-sn {
  min-width: 30rem;
}
.hidden-text {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
