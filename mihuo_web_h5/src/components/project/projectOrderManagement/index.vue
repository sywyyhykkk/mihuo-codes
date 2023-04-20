<template>
  <div>
    <!-- 项目开单管理 -->
    <el-card>
      <el-form v-model="formSearch" inline>
        <el-form-item label="订单编号" prop="orderSn">
          <el-input v-model="formSearch.orderSn" prefix-icon="Search" />
        </el-form-item>
        <el-form-item label="创建时间" prop="date">
          <el-date-picker
            v-model="formSearch.date"
            type="daterange"
            value-format="YYYY-MM-DD"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="dateChange"
          />
        </el-form-item>
        <el-form-item label="订单状态" prop="status">
          <el-select
            v-model="formSearch.status"
            placeholder="订单状态"
            clearable
          >
            <el-option
              v-for="item in orderStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="项目地址" prop="projectName">
          <el-input
            v-model="formSearch.projectAddress"
            disabled
            prefix-icon="Location"
          />
          <el-button type="primary" @click="selectProject">选择项目</el-button>
        </el-form-item>
      </el-form>
      <el-button icon="Search" type="primary" @click="getData">查询</el-button>
      <el-button icon="refreshLeft" @click="resetSearch">重置</el-button>
    </el-card>
    <el-table
      v-loading="loading"
      stripe
      style="height: calc(100vh - 35rem) !important; overflow-y: scroll"
      :data="tableData"
      border
      row-key="id"
    >
      <el-table-column label="序号" type="index" align="center" />
      <el-table-column label="订单编号" prop="orderSn" width="180" />
      <el-table-column
        v-if="props.companyType"
        label="所属企业"
        prop="companyName"
        width="180"
      />
      <el-table-column label="创建时间" prop="createTime" width="180" />
      <el-table-column label="项目地址" width="300">
        <template #default="scope">
          <span class="project-address" @click="goToProjectDetail(scope.row)">
            {{
              scope.row.receiverRegion +
                scope.row.receiverPoiName +
                scope.row.receiverDetailAddress
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center" width="150">
        <template #default="scope">
          <!--orderType 订单类型：0=商品订单；1=服务订单 2-协作订单 3-套餐-->
          <div>
            <el-tag
              :type="
                getOrderStatus(scope.row.status, scope.row.orderType)?.type
              "
            >
              {{ getOrderStatus(scope.row.status, scope.row.orderType)?.text }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="客户姓名" prop="memberUsername" width="180">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <img
              class="avatar-img"
              :src="$getUrl.avatarImage(scope.row.memberId)"
              @error="$getUrl.imageError($event)"
            >
            <span>
              {{ scope.row.memberUsername || scope.row.memberUsername }}
            </span>
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
        </template>
      </el-table-column>
      <el-table-column label="实收金额" prop="payAmount">
        <template #default="scope">
          ￥{{ scope.row.payAmount?.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        fixed="right"
        width="200"
      >
        <template #default="scope">
          <el-button
            v-if="scope.row.orderItems"
            type="text"
            icon="view"
            @click="viewOrderDetail(scope.row)"
          >查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination-new
      :current-page="+currentPage"
      :page-size="pageSize"
      :total="total"
      layout="total, prev, pager, next, jumper"
      @current-change="handleCurrentChange"
    />
    <!--查看订单详情-->
    <orderDetailCheck
      v-if="checkVisible"
      v-model="checkVisible"
      :order-type="'' + currentOrderType"
      :order-id="currentOrderId"
      :is-project="true"
      @getData="getData"
    />
    <!--选择关联项目-->
    <project-picker
      v-model="isShowProjectPicker"
      @projectPicked="projectPicked"
    />
  </div>
</template>

<script lang="ts" setup>
import { fetch } from '_@/axios-config/axios'
import { getOrderStatus, openIM } from '@/components/orderManagement/order'
import { ref } from 'vue'
import wsCache from '@/cache'
import { baseEncode } from '@/utils/utils'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
const props = defineProps({
  companyType: {
    type: String,
    default: null
  }
})
const tableData = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const checkVisible = ref(false)
const currentOrderType = ref(0)
const currentOrderId = ref('')
const formSearch = ref({
  status: '',
  date: '',
  orderSn: '',
  endTime: '',
  startTime: '',
  projectId: '',
  projectAddress: ''
})
// -1=其他订单 0=待付款；1=待发货；2=已发货(服务中-服务订单)；3待验收-服务订单；4=已完成（已收货）
//  5=待售后，6售后完成，7=（订单未支付，超时自动关闭，或者用户自己关闭）已关闭；8=退款；9=无效订单
const orderStatusOptions = ref([
  { label: '全部', value: '' },
  { label: '待付款', value: 0 },
  { label: '待发货/待确认', value: 1 },
  { label: '已发货/服务中', value: 2 },
  { label: '已收货/待验收', value: 3 },
  { label: '已完成', value: 4 },
  { label: '待售后', value: 5 },
  { label: '售后完成', value: 6 },
  { label: '已关闭', value: 7 },
  { label: '退款中', value: 8 },
  { label: '无效订单', value: 9 },
  { label: '其他订单', value: -1 }
])
const isShowProjectPicker = ref(false)

onMounted(() => {
  getData()
})

// 获取数据
const getData = async () => {
  let obj = {
    status: formSearch.value.status, // 订单状态,
    startTime: formSearch.value.startTime, // 订单创建时间
    endTime: formSearch.value.endTime // 订单创建时间,
  }
  if (formSearch.value.orderSn) {
    obj = {
      ...formSearch.value
    }
  }
  await fetch({
    url: '/mall/order/page/new',
    method: 'get',
    params: {
      size: pageSize.value,
      descs: 'id',
      current: currentPage.value,
      sourceType: 4, // 查询项目开单的数据,
      timeCategory: 'createTime', // 查询创建时间
      status: formSearch.value.status, // 订单状态,
      startTime: formSearch.value.startTime || null, // 订单创建时间
      endTime: formSearch.value.endTime || null, // 订单创建时间,
      orderSn: formSearch.value.orderSn || null, // 订单编号
      projectId: formSearch.value.projectId || null, // 项目ID
      cityOperatorFlag:2,
      cityOperatorId: wsCache.get('cityOperator')?.id
    }
  }).then((res: any) => {
    total.value = res.data.total
    tableData.value = res.data.records
  })
}

// 查询数据分页
const handleCurrentChange = (val: any) => {
  currentPage.value = val
  getData()
}

// 查看订单详情
const viewOrderDetail = (data: any) => {
  checkVisible.value = true
  currentOrderId.value = data.id
  currentOrderType.value = data.orderType
}

// 重置搜索条件
const resetSearch = () => {
  formSearch.value = {
    status: '',
    date: '',
    orderSn: '',
    endTime: '',
    startTime: '',
    projectId: '',
    projectAddress: ''
  }
  getData()
}

// 订单创建时间筛选
const dateChange = () => {
  formSearch.value.endTime = formSearch.value.date[1]
  formSearch.value.startTime = formSearch.value.date[0]
}

// 选择关联项目
const selectProject = () => {
  isShowProjectPicker.value = !isShowProjectPicker.value
}

// 确认选择项目
const projectPicked = (data: any) => {
  formSearch.value.projectId = data.id
  formSearch.value.projectAddress = data.poiName
}

const { push } = useRouter()
// 跳转到项目详情
const goToProjectDetail = async (row: any) => {
  await fetch({
    url: `/order/bizproject/${row.projectId}`,
    method: 'get'
  }).then((res: any) => {
    if (res.data) {
      wsCache.set('projectDetail', Object.assign(res.data))
      sessionStorage.setItem('detailFrom', JSON.stringify(res.data))
      sessionStorage.setItem('projectId', row.projectId)
      push({ path: `/bizproject/projectDetail/${baseEncode(row.projectId)}` })
    } else {
      ElMessage.warning('未找到对应项目')
    }
  })
}
</script>

<style lang="less" scoped>
.avatar-img {
  width: 1.8rem;
  height: 1.8rem;
  background: #0969da;
  border-radius: 50%;
  margin-right: 0.5rem;
}

.message-avatar {
  width: 1.5rem;
  height: 1.5rem;
  margin-left: 1rem;
  cursor: pointer;
}

.project-address {
  text-decoration: underline;
  color: #0969da;
  cursor: pointer;
}
</style>
