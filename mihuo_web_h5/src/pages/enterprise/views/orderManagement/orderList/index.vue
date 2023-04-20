<template>
  <div>
    <el-card>
      <el-input
        v-model="listQuery.orderSn"
        prefix-icon="Search"
        placeholder="订单编号"
      />
      <el-input
        v-model="listQuery.memberUsername"
        prefix-icon="Search"
        placeholder="用户账号"
      />
      <el-date-picker
        v-model="time"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="YYYY-MM-DD"
        @change="pickDate"
      />
      <el-select v-model="listQuery.sourceType" placeholder="订单来源" clearable>
        <el-option
          v-for="item in serviceTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-if="listQuery.sourceType==1"
        v-model="listQuery.status"
        placeholder="订单状态"
        clearable
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-if="listQuery.sourceType==2"
        v-model="listQuery.supplierStatus"
        placeholder="订单状态"
        clearable
      >
        <el-option
          v-for="item in statusOptionsSupplier"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="listQuery.orderType" placeholder="订单分类" clearable>
        <el-option
          v-for="item in typeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="listQuery.payType"
        placeholder="支付方式"
        clearable
      >
        <el-option
          v-for="item in paymentTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button icon="Search" type="primary" @click="handleSearchList()">查询</el-button>
      <el-button icon="refreshLeft" @click="handleResetSearch()">重置</el-button>
    </el-card>
    <div>
      <el-table
        v-loading="loading"
        stripe
        style="width: 100%"
        :data="tableData"
        :height="tableHeight"
        border
      >
        <el-table-column
          label="序号"
          type="index"
          width="50"
          align="center"
        />
        <el-table-column
          label="订单编号"
          width="180"
          align="center"
          prop="orderSn"
        />
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          width="200"
        />
        <el-table-column label="用户账号" align="center">
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
        <!--        <el-table-column label="订单分类" align="center">-->
        <!--          <template #default="scope">-->
        <!--            {{ scope.row.orderType === 1 ? '秒杀订单' : '正常订单' }}-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column label="支付方式" align="center">
          <template #default="scope">
            {{
              scope.row.payType === 1
                ? '支付宝支付'
                : scope.row.payType === 2
                  ? '微信支付'
                  : scope.row.payType === 3
                    ? '银联支付'
                    : '未支付'
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="200"
          fixed="right"
          align="center"
        >
          <template #default="scope">
            <el-button
              style="color: #67C23A"
              type="text"
              icon="view"
              @click="handleViewOrderDetail(scope.row)"
            >
              查看
            </el-button>
            <el-button
              icon="document-checked"
              :disabled="scope.row.supplierStatus==1?false:true"
              type="text"
              @click="handelOrderStatus(scope.row,3)"
            >
              接单
            </el-button>
            <el-button
              icon="document-delete"
              :disabled="scope.row.supplierStatus==1?false:true"
              class="danger"
              type="text"
              @click="handelOrderStatus(scope.row,2)"
            >
              拒单
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination-new
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      v-model="isShowViewDetail"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="订单详情"
      :destroy-on-close="true"
    >
      <OrderDetail :order-form="selectedRow" />
    </el-dialog>
    <el-dialog
      v-model="remarkShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="拒单原因"
      :destroy-on-close="true"
    >
      <el-form-item label="拒单原因" prop="" label-width="9rem">
        <el-input v-model="note" />
      </el-form-item>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleConfirm()">确 定</el-button>
          <el-button @click="remarkShow=false;note=''">取 消</el-button>
        </span>
      </template>
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
  unref,
  watchEffect
} from 'vue'
import wsCache from '@/cache'
import OrderDetail from '_@/views/orderManagement/orderDetail/index.vue'
import {
  getOrderStatus,
  getTextColorType,
  getServiceType,
  getSourceType,
  getOrderStatusSupplier,
  getColorTypeSupplier
} from '@/utils/utils'
import { getOrderData } from '_@/api/order'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetch } from '_@/axios-config/axios'

export default defineComponent({
  components: { OrderDetail },
  setup() {
    const tableHeight = ref<any>(0)
    const listQueryForm = ref()
    const isShowViewDetail = ref<boolean>(false)
    const state = reactive<any>({
      orderForm: [] as any,
      remarkShow: false,
      note: '',
      tableData: [],
      selectedRow: {},
      total: 0,
      pageSize: 20,
      currentPage: 1,
      time: [],
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
        { value: '5', label: '已发货/未验收' },
        // { value: '6', label: '未验收' },
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
      paymentTypeOptions: [
        {
          value: '0',
          label: '未支付'
        },
        {
          value: '1',
          label: '支付宝支付'
        },
        {
          value: '2',
          label: '微信支付'
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
      loading: false,
      listQuery: {
        serviceTypeList: ''
      } as any
    })
    const getHeight = () => {
      tableHeight.value = document.documentElement.clientHeight - 190
    }

    onMounted(() => {
      getData()
    })

    watchEffect(() => {
      getHeight()
      // 增加监听事件，窗口变化时得到高度。
      window.addEventListener('resize', getHeight, false)
    })

    const handleViewOrderDetail = (row: any) => {
      isShowViewDetail.value = !isShowViewDetail.value
      state.selectedRow = row
    }

    const handleCurrentChange = (val: number) => {
      state.currentPage = val
      getData()
    }

    const pickDate = (e: any) => {
      console.log(e)
      const startTime = e ? e[0].toLocaleDateString().replaceAll('/', '-') : null
      const endTime = e ? e[1].toLocaleDateString().replaceAll('/', '-') : null
      state.listQuery.startTime = startTime
      state.listQuery.endTime = endTime
      if (startTime && endTime) {
        state.time[0] = startTime
        state.time[1] = endTime
      } else {
        state.time = []
      }
    }

    const getData = async () => {
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

    const handleSearchList = () => {
      getData()
    }

    const handleResetSearch = () => {
      state.listQuery = {
        orderSn: '',
        orderItemSn: '',
        memberId: '',
        memberUsername: '',
        status: '',
        sourceType: '',
        supplierStatus: '',
        orderType: '',
        serviceTypeList: '1003,1004'
      }
      state.listQuery.startTime = null
      state.listQuery.endTime = null
      state.time = []
      getData()
    }

    const handleConfirm = () => {
      state.orderForm.forEach((res: any) => {
        res.note = state.note
      })
      updateSupplierOrderStatus(2)
    }
    const handelOrderStatus = (row: any, status: Number) => {
      ElMessageBox.confirm(`${status === 2 ? '拒绝' : '接受'}订单:${row.orderSn}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        state.orderForm = [{ orderSn: row.orderSn, supplierStatus: status, note: '' }]
        if (status === 3) {
          updateSupplierOrderStatus(status)
        }
        if (status === 2) {
          state.remarkShow = true
        }
      })
    }

    const updateSupplierOrderStatus = async (status: any) => {
      await fetch({
        url: `/mall/order/updateSupplierOrderStatus`,
        method: 'post',
        data: state.orderForm
      }).then((res: any) => {
        if (res.code === 0) {
          state.remarkShow = false
          state.note = ''
          ElMessage.success(`${status === 2 ? '拒单' : '接单'}成功`)
          getData()
        }
      })
    }
    return {
      handleConfirm,
      tableHeight,
      listQueryForm,
      handelOrderStatus,
      updateSupplierOrderStatus,
      getData,
      handleSearchList,
      handleResetSearch,
      handleCurrentChange,
      handleViewOrderDetail,
      isShowViewDetail,
      getOrderStatus,
      pickDate,
      getTextColorType,
      getOrderStatusSupplier,
      getColorTypeSupplier,
      getServiceType,
      getSourceType,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">

</style>
