<template>
  <div>
    <el-card>
      <el-input
        v-model="listQuery.orderSn"
        placeholder="订单编号"
        prefix-icon="Search"
      />
      <el-input
        prefix-icon="Search"
        v-model="listQuery.memberUsername"
        placeholder="买家"
      />
       <el-date-picker
        v-model="listQuery.date"
        type="daterange"
        value-format="YYYY-MM-DD"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="dateChange"
      />
      <el-select v-model="listQuery.sourceType" placeholder="订单来源" clearable>
        <el-option
          v-for="item in serviceTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select v-if="listQuery.sourceType==1" v-model="listQuery.status" placeholder="订单状态" clearable>
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select v-if="listQuery.sourceType==2" v-model="listQuery.supplierStatus" placeholder="订单状态" clearable>
        <el-option
          v-for="item in statusOptionsSupplier"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="listQuery.orderType"
        placeholder="订单分类"
        clearable
      >
        <el-option
          v-for="item in typeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="listQuery.skillType"
        placeholder="所需服务"
        clearable
      >
        <el-option
          v-for="item in skillsList"
          :key="item.skillId"
          :label="item.skillName"
          :value="item.skillId"
        >
        </el-option>
      </el-select>
      <el-button @click="handleSearchList()" icon="Search" type="primary">查询</el-button>
      <el-button @click="handleResetSearch()" icon="refreshLeft">重置</el-button>
    </el-card>
    <el-card class="el-card--body2">
      <div class="el-card-right">
        <el-button type="primary" @click="batchAssign" size="mini">
          批量指派
        </el-button>
      </div>
    </el-card>
    <div>
      <el-table
        stripe
        style="height: calc(100vh - 30rem) !important;"
        :data="tableData"
        :height="'0'"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        empty-text="暂无服务类订单"
        border
      >
        <el-table-column
          type="selection"
          width="60"
          align="center"
        ></el-table-column>
        <el-table-column label="订单编号" width="180" align="center">
          <template #default="scope">
            {{ scope.row.orderSn }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="160" align="center">
          <template #default="scope">
            {{ scope.row.createTime }}
          </template>
        </el-table-column>
        <el-table-column label="用户账号" width="120" align="center">
          <template #default="scope">
            {{ scope.row.memberUsername }}
          </template>
        </el-table-column>
        <el-table-column label="订单金额" align="center">
          <template #default="scope">
            <div style="font-weight: bold;color: #4D4D4D;font-size: 1.2rem;text-align: right">
              {{ scope.row.realAmount * scope.row.productQuantity || scope.row.totalAmount.toFixed(2) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="指派状态" align="center">
          <template #default="scope">
            {{ scope.row.isAssign === 0 ? '暂未指派' : '已指派' }}
          </template>
        </el-table-column>
        <el-table-column label="订单来源" width="150" align="center">
          <template #default="scope">
            {{ getSourceType(scope.row.sourceType) }}
          </template>
        </el-table-column>
        <el-table-column label="订单状态" align="center" width="150">
          <template #default="scope">
            <el-tag v-if="scope.row.sourceType==1" :type="getTextColorType(scope.row.status)">
              {{ getOrderStatus(scope.row.status) }}
            </el-tag>
            <el-tag v-if="scope.row.sourceType==2" :type="getColorTypeSupplier(scope.row.supplierStatus)">
              {{ getOrderStatusSupplier(scope.row.supplierStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="订单分类" align="center">
          <template #default="scope">
            {{ scope.row.orderType === 1 ? '秒杀订单' : '正常订单' }}
          </template>
        </el-table-column>
        <el-table-column label="所需工种" align="center">
          <template #default="scope">
            {{ getSkillName(Number(scope.row.skillId)) }}
            <!-- <el-button size="mini" @click="handleShowServiceList(scope.row)"
              >查看
            </el-button> -->
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="240">
          <template #default="scope">
            <el-button icon="view" type="text" style="color: #67C23A" @click="handleViewOrderDetail(scope.row)">查看
            </el-button>
            <el-button
              type="text"
              icon="pointer"
              @click="handleAssignment(scope.row)"
              :disabled="scope.row.isAssign === 1"
            >指派
            </el-button>
            <el-button
              @click="createOrder(scope.row)"
              type="text"
              icon="promotion"
              class="danger"
              :disabled="scope.row.isAssign === 1"
            >
              一键发单
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-pagination-new
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      v-model="isShowViewDetail"
      title="订单详情"
      :destroy-on-close="true"
    >
      <div style="height: 70vh; overflow: auto">
        <OrderDetail :orderForm="selectedRow"></OrderDetail>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      v-model="isShowAssignment"
      title="订单指派"
      :destroy-on-close="true"
    >
      <div style="height: 50vh; overflow: auto">
        <Assignment
          :orderForm="selectedRow"
          :people="peopleOptions"
          @getData="getData"
        ></Assignment>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      v-model="isShowServiceList"
      title="所需服务"
      :destroy-on-close="true"
    >
      <div style="height: 20vh; overflow: auto">
        {{ getSkillName(Number(selectedRow.skillId)) }}
      </div>
    </el-dialog>
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      v-model="isShowCreateOrder"
      title="订单发单"
      :destroy-on-close="true"
    >
      <div style="height: 70vh; overflow: auto">
        <CreateOrder :orderForm="selectedRow" @getData="getData"></CreateOrder>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      v-model="isShowBatchAssign"
      title="批量指派"
      :destroy-on-close="true"
    >
      <div style="height: 60vh; overflow: auto">
        <el-table stripe :data="batchOrders"
                  style="width: 100%"
                  show-summary
                  :summary-method="getSummaries"
        >
          <el-table-column prop="orderSn" label="订单编号"></el-table-column>
          <el-table-column prop="skillType" label="所需服务">
            <template #default="scope">
              {{ getSkillName(Number(scope.row.skillId)) }}
            </template>
          </el-table-column>
          <el-table-column prop="totalAmount" label="订单金额">
          </el-table-column>
        </el-table>
        <el-select
          style="margin-top: 15px; margin-right: 15px"
          v-model="person"
          size="mini"
          placeholder="请选择要指派的人员"
          :clearable="true"
        >
          <el-option
            v-for="item in peopleOptions"
            :key="item.value"
            :label="item.label"
            :value="item"
          >
          </el-option>
        </el-select>
        <el-button
          style="margin-top: 15px"
          size="mini"
          @click="saveBatchAssignment"
        >指派
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRefs,
  watch,
  unref,
  watchEffect
} from 'vue'
import wsCache from '@/cache'
import {
  getOrderStatus,
  getSkillName,
  getTextColorType,
  getServiceType,
  getColorTypeSupplier,
  getSourceType,
  getOrderStatusSupplier
} from '@/utils/utils'
import OrderDetail from '_@/views/orderManagement/orderDetail/index.vue'
import Assignment from '_@/views/orderManagement/orderAssign/assignment.vue'
import CreateOrder from '_@/views/orderManagement/orderAssign/createOrder.vue'
import {
  getOrderData,
  getSkillsList,
  assignOrder,
  sendOrder
} from '_@/api/order'
import { userPage } from '_@/api/department'
import { ElMessage } from 'element-plus'

export default defineComponent({
  components: { OrderDetail, Assignment, CreateOrder },
  setup() {
    const tableHeight = ref<any>(0)
    const listQueryForm = ref()
    const isShowViewDetail = ref<boolean>(false)
    const isShowAssignment = ref<boolean>(false)
    const isShowServiceList = ref<boolean>(false)
    const isShowCreateOrder = ref<boolean>(false)
    const isShowBatchAssign = ref<boolean>(false)
    const state = reactive<any>({
      tableData: [],
      selectedRow: {},
      total: 0,
      pageSize: 20,
      currentPage: 0,
      operateType: null,
      batchOrders: [],
      isAssignedOrders: [],
      loading: false,
      peopleOptions: [] as any,
      person: '',
      statusOptions: [
        { value: '0', label: '待付款' },
        { value: '1', label: '待发货/待处理' },
        { value: '2', label: '已发货/未验收' },
        { value: '3', label: '服务中' },
        { value: '4', label: '已完成' },
        { value: '5', label: '待售后' },
        { value: '6', label: '售后完成' },
        { value: '7', label: '已关闭' },
        { value: '8', label: '退款' },
        { value: '9', label: '无效订单' }],
      statusOptionsSupplier: [{ value: '0', label: '未下单' },
        { value: '1', label: '已下单' },
        { value: '2', label: '未接收' },
        { value: '3', label: '已接收' },
        { value: '4', label: '未发货' },
        { value: '5', label: '未验收' },
        { value: '6', label: '未验收' },
        { value: '7', label: '已验收' },
        { value: '8', label: '退货' },
        { value: '9', label: '无效订单' },
        { value: '10', label: '取消订单' }],
      typeOptions: [
        {
          value: '0',
          label: '正常订单'
        },
        {
          value: '1',
          label: '秒杀订单'
        }
      ],
      serviceTypeOptions: [
        {
          value: 0,
          label: 'PC端'
        },
        {
          value: 1,
          label: 'C端APP'
        },
        {
          value: 2,
          label: 'B端供应商'
        }
      ],
      skillsList: [],
      listQuery: {
        orderItemSn: '',
        memberId: '',
        memberUsername: '',
        status: '',
        sourceType: '',
        supplierStatus: '',
        orderType: '',
        startDate:'',
        endDate:'',
        date:null,
        serviceTypeList: '1003,1004'
      } as any
    })
    // const getHeight = () => {
    //   tableHeight.value = document.documentElement.clientHeight - 256
    // }
    //
    // watchEffect(() => {
    //   getHeight()
    //   // 增加监听事件，窗口变化时得到高度。
    //   window.addEventListener('resize', getHeight, false)
    // })

    onMounted(() => {
      getData()
      getSkills()
      getEmployee()
    })
    const getEmployee = async () => {
      const companyId = wsCache.get('companys')[0].companyId
      await userPage({ companyId }).then((res) => {
        state.peopleOptions = []
        res.data.records.forEach((item: { employeeName: any; userId: any }) => {
          state.peopleOptions.push({
            label: item.employeeName,
            value: item.userId
          })
        })
      })
    }

    const handleViewOrderDetail = (row: any) => {
      isShowViewDetail.value = !isShowViewDetail.value
      state.selectedRow = row
    }

    const handleAssignment = (row: any) => {
      isShowAssignment.value = !isShowAssignment.value
      state.selectedRow = row
    }

    const handleCurrentChange = (val: number) => {
      state.currentPage = val
      getData()
    }

    const getData = async () => {
      isShowCreateOrder.value = false
      isShowAssignment.value = false
      await getOrderData({
        size: state.pageSize,
        current: state.currentPage,
        ...state.listQuery
      }).then((res: any) => {
        state.tableData = res.data.records
        state.total = res.data.total
        state.loading = false
      })
    }

    const handleSelectionChange = (row: any) => {
      state.batchOrders = []
      row.map((item: any) => {
        if (item.isAssign === 0) {
          state.batchOrders.push(item)
        } else {
          state.isAssignedOrders.push(item)
        }
      })
    }

    const getSkills = async () => {
      await getSkillsList().then((res: any) => {
        state.skillsList = res.data.records
      })
    }

    const handleSearchList = () => {
      getData()
    }

    const handleResetSearch = () => {
      state.listQuery = {
        orderItemSn: '',
        memberId: '',
        memberUsername: '',
        status: '',
        sourceType: '',
        supplierStatus: '',
        orderType: '',
        startDate:'',
        endDate:'',
        date:null,
        serviceTypeList: '1003,1004'
      }
      getData()
    }

    const createOrder = async (row: any) => {
      // isShowCreateOrder.value = !isShowCreateOrder.value
      state.selectedRow = row
      await sendOrder([row.orderItemSn]).then((res) => {
        ElMessage.success('操作成功!')
        getData()
      })
    }

    const handleShowServiceList = (row: any) => {
      isShowServiceList.value = !isShowServiceList.value
      state.selectedRow = row
    }

    const batchAssign = () => {
      if (
        state.batchOrders.length === 0 &&
        state.isAssignedOrders.length !== 0
      ) {
        ElMessage({
          type: 'warning',
          message: `所选订单已被指派!`
        })
        return
      }
      if (state.batchOrders.length === 0) {
        ElMessage({
          type: 'warning',
          message: `请选择批量操作订单!`
        })
        return
      }
      isShowBatchAssign.value = !isShowBatchAssign.value
    }

    const saveBatchAssignment = async () => {
      if (state.isAssignedOrders.length !== 0) {
        let msg = ''
        state.isAssignedOrders.forEach(
          (item: { orderItemSn: string }, index: number) => {
            msg = msg.concat(
              item.orderItemSn,
              index === state.isAssignedOrders.length - 1 ? '' : ','
            )
          }
        )
        ElMessage({
          type: 'warning',
          message: `以下订单指派失败:${msg}, 原因:订单已被指派!`
        })
      }
      let items = [] as any
      state.batchOrders.forEach((item: { orderItemSn: any }) => {
        items.push({
          orderItemSn: item.orderItemSn,
          person: state.person.value
        })
      })
      await assignOrder(items).then((res) => {
        isShowBatchAssign.value = false
        ElMessage.success('指派成功!')
        getData()
      })
    }

    const getSummaries = (params: any) => {
      const { columns, data } = params
      const sums = [] as any
      columns.forEach(
        (column: { property: string | number }, index: number) => {
          if (index === 0) {
            sums[index] = '总计金额'
            return
          }
          if (index === 1) {
            sums[index] = ''
            return
          }
          const values = data.map((item: { [x: string]: any }) =>
            Number(item[column.property])
          )
          if (!values.every((value: number) => isNaN(value))) {
            sums[index] = values.reduce((prev: any, curr: any) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            if (index === 2) {
              sums[index] += '元'
            }
          } else {
            sums[index] = 'N/A'
          }
        }
      )
      return sums
    }

    watch(()=>state.listQuery.date,(news)=>{
      if(news){
        state.listQuery.startDate = news[0];
        state.listQuery.endDate = news[1];
      }
    },)

    return {
      tableHeight,
      listQueryForm,
      getColorTypeSupplier,
      getSourceType,
      getData,
      handleSearchList,
      handleResetSearch,
      handleCurrentChange,
      getSkills,
      getOrderStatus,
      getSkillName,
      handleViewOrderDetail,
      handleAssignment,
      isShowViewDetail,
      isShowAssignment,
      isShowServiceList,
      handleShowServiceList,
      createOrder,
      isShowCreateOrder,
      handleSelectionChange,
      batchAssign,
      isShowBatchAssign,
      saveBatchAssignment,
      getSummaries,
      getTextColorType,
      getOrderStatusSupplier,
      getServiceType,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
.operate-container {
  :deep(.el-card__body) {
    display: flex;
    justify-content: space-between;
  }
}

.filter-container {
  margin-bottom: 20px;
}
</style>
