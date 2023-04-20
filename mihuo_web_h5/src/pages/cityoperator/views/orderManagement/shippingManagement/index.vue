<template>
  <div>
    <el-card shadow="never">
      <el-input
        v-model="listQuery.orderSn"
        prefix-icon="Search"
        placeholder="订单编号"
      />
      <el-input
        v-model="listQuery.memberId"
        prefix-icon="Search"
        placeholder="用户账号"
      />
      <el-input
        v-model="listQuery.deliverySn"
        prefix-icon="Search"
        placeholder="物流单号"
      />
      <el-date-picker
        v-model="time"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="YYYY-MM-DD"
        @change="pickDate"
      >
      </el-date-picker>
      <el-select v-model="listQuery.status" placeholder="订单状态" clearable>
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select v-model="listQuery.orderType" placeholder="订单分类" clearable>
        <el-option
          v-for="item in typeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-button @click="handleSearchList()" icon="Search" type="primary">查询</el-button>
      <el-button @click="handleResetSearch()" icon="refreshLeft">重置</el-button>

    </el-card>
    <el-card class="el-card--body2">
      <div class="el-card-right">
        <el-select
          v-model="operateType"
          @change="getChangeOperateType"
          placeholder="批量操作"
          :clearable="true"
        >
          <el-option
            v-for="(item, index) in operates"
            :key="index"
            :label="item.label"
            :value="item"
          >
          </el-option>
        </el-select>
        <el-input
          v-if="operateType.value === 1"
          v-model="closeReason"
          placeholder="请输入关闭原因"
        ></el-input>
        <el-button
          type="primary"
          @click="batchOperation"
          v-if="operateType.value === 1"
        >
          确定
        </el-button>
      </div>
    </el-card>
    <div>
      <el-table
        stripe
        style="width: 100%;height: calc(100vh - 30rem)!important;"
        :data="tableData"
        :height="'0'"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        empty-text="暂无商品类订单"
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
        <el-table-column label="用户账号" align="center" width="120">
          <template #default="scope">
            {{ scope.row.memberUsername }}
          </template>
        </el-table-column>
        <el-table-column label="发货地址" width="240" align="center">
          <template #default="scope">
            {{ scope.row.companyAddress?.province
            }}{{ scope.row.companyAddress?.city
            }}{{ scope.row.companyAddress?.region
            }}{{ scope.row.companyAddress?.detailAddress }}
          </template>
        </el-table-column>
        <el-table-column label="收货地址" width="240" align="center">
          <template #default="scope">
            {{ scope.row.receiverProvince }}{{ scope.row.receiverCity
            }}{{ scope.row.receiverRegion
            }}{{ scope.row.receiverDetailAddress }}
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
        <el-table-column label="订单状态" align="center" width="150">
          <template #default="scope">
            <el-tag :type="getTextColorType(scope.row.status)">
              {{ getOrderStatus(scope.row.status) }}
            </el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="物流状态" align="center" width="140">
          <template #default="scope">
            <el-button type="text" @click="handleShowTrans(scope.row)">查看</el-button>
            <el-button type="text" @click="handleEditTrans(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="210">
          <template #default="scope">
            <el-button icon="view" style="color: #67C23A" @click="handleViewOrderDetail(scope.row)" type="text">查看
            </el-button>
            <el-button
              icon="van"
              @click="handleShipping(scope.row)"
              type="text"
              :disabled="scope.row.status == 1||scope.row.supplierStatus==4?false:true"
            >
              发货
              <!-- {{
                scope.row.status === 0
                  ? '未付款'
                  : scope.row.status === 1
                  ? '发货'
                  : '已发货'
              }} -->
            </el-button>
            <el-button
              icon="close"
              @click="handleCloseOrder(scope.row)"
              type="text"
              class="danger"
              :disabled="scope.row.status !== 3"
            >
              关闭
              <!-- {{ scope.row.status < 4 ? '未完成' : '关闭' }} -->
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
      v-model="isShowTrans"
      :title="isEditTrans ? '编辑物流' : '物流详情'"
      :destroy-on-close="true"
    >
      <TransDetail
        :isEditable="isEditTrans"
        :orderForm="selectedRow"
        @getData="getData"
      ></TransDetail>

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
import { ElMessage, ElMessageBox } from 'element-plus'
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
import TransDetail from '_@/views/orderManagement/shippingManagement/transDetail.vue'
import { getOrderData, sendShipping, closeOrder } from '_@/api/order'
import { fetch } from '_@/axios-config/axios'

export default defineComponent({
  components: { OrderDetail, TransDetail },
  setup() {
    const tableHeight = ref<any>(0)
    const listQueryForm = ref()
    const isShowViewDetail = ref<boolean>(false)
    const isShowTrans = ref<boolean>(false)
    const isEditTrans = ref<boolean>(false)
    const state = reactive<any>({
      total: 0,
      pageSize: 10,
      currentPage: 1,
      tableData: [],
      form: {},
      selectedRow: {},
      loading: false,
      time: [],
      closeReason: '',
      operates: [
        {
          value: 0,
          label: '一键发货'
        },
        {
          value: 1,
          label: '一键关闭'
        }
      ],
      statusOptions: [
        {
          value: '0',
          label: '待付款'
        },
        {
          value: '1',
          label: '待发货'
        },
        {
          value: '2',
          label: '已发货'
        },
        {
          value: '3',
          label: '已完成'
        },
        {
          value: '4',
          label: '已关闭'
        }
      ],
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
      operateType: '',
      batchOrders: [],
      listQuery: {
        // orderItemSn: '',
        // orderSn: '',
        // memberId: '',
        // startTime: null,
        // endTime: null,
        // status: '',
        // orderType: '',
        // deliverySn: '',
        serviceTypeList: '1001,1002'
      } as any
    })
    const getHeight = () => {
      tableHeight.value = document.documentElement.clientHeight - 250
    }

    watchEffect(() => {
      getHeight()
      // 增加监听事件，窗口变化时得到高度。
      window.addEventListener('resize', getHeight, false)
    })

    onMounted(() => {
      getData()
    })

    const handleSelectionChange = (row: any) => {
      state.batchOrders = []
      row.map((item: any) => {
        state.batchOrders.push(item)
      })
    }

    const getChangeOperateType = (e: any) => {
      ElMessageBox.confirm(`是否确定该批量操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        state.operateType = e
        batchOperation()
      })
    }

    const batchOperation = async () => {
      if (state.batchOrders.length === 0) {
        ElMessage({
          type: 'warning',
          message: `请选择批量操作订单!`
        })
        return
      }
      if (!state.operateType) {
        ElMessage({
          type: 'warning',
          message: `请选择批量操作条件!`
        })
        return
      }
      if (state.operateType.value === 0) {
        let data = [] as any
        let nopaymentOrders: { id: any; status: any; orderSn: any }[] = []
        state.batchOrders.forEach(
          (item: any) => {
            if ((item.sourceType == 0 && item.status !== 1) || (item.sourceType == 2 && item.supplierStatus !== 4)) {
              nopaymentOrders.push(item)
            } else {
              const obj = {
                deliveryCompany: item.deliveryCompany,
                deliverySn: item.deliverySn,
                orderId: item.id
              }
              data.push(obj)
            }
          }
        )
        console.log(nopaymentOrders, data)
        if (nopaymentOrders.length !== 0) {
          let msg = ''
          nopaymentOrders.forEach((item, index) => {
            msg = msg.concat(
              item.orderSn,
              index === nopaymentOrders.length - 1 ? '' : ','
            )
          })
          ElMessage({
            type: 'warning',
            message: `以下订单发货失败:${msg}, 原因:订单尚未付款或已被关闭!`
          })
        }
        if (data.length !== 0) {
          await sendShipping(data as Array<object>).then((res) => {
            ElMessage({
              type: 'success',
              message: '操作成功!'
            })
            getData()
          })
        }
      } else {
        let ids = ''
        let unfinishedOrders: { id: any; status: any; orderSn: any }[] = []
        state.batchOrders.forEach(
          (item: { id: any; status: any; orderSn: any }, index: number) => {
            if (item.status < 4) {
              unfinishedOrders.push(item)
            } else {
              ids = ids.concat(
                item.id,
                index === state.batchOrders.length - 1 ? '' : ','
              )
            }
          }
        )
        if (ids[ids.length - 1] === ',') {
          ids = ids.slice(0, -1)
        }
        if (unfinishedOrders.length !== 0) {
          let msg = ''
          unfinishedOrders.forEach((item, index) => {
            msg = msg.concat(
              item.orderSn,
              index === unfinishedOrders.length - 1 ? '' : ','
            )
          })
          ElMessage({
            type: 'warning',
            message: `以下订单关闭失败:${msg}, 原因:订单尚未完成!`
          })
        }
        if (ids.length !== 0) {
          const formData = new FormData()
          formData.append('ids', ids)
          formData.append('note', state.closeReason)
          await closeOrder(formData).then((res) => {
            ElMessage({
              type: 'success',
              message: '操作成功!'
            })
            getData()
          })
        }
      }
    }

    const handleCurrentChange = (val: number) => {
      state.currentPage = val
      getData()
    }

    const getData = async () => {
      isShowTrans.value = false
      state.operateType = ''
      const companyId = wsCache.get('companys')[0].companyId
      await getOrderData({
        size: state.pageSize,
        current: state.currentPage,
        // supplierStatus: state.listQuery.status,
        // orderSn: state.listQuery.orderSn,
        // memberUsername: state.listQuery.memberId,
        // startTime: state.listQuery.startTime,
        // endTime: state.listQuery.endTime,
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
      // unref(listQueryForm).resetFields()
      state.listQuery.startTime = null
      state.listQuery.endTime = null
      state.time = []
      state.listQuery = {
        serviceTypeList: '1001,1002'
      }
      getData()
    }

    const handleViewOrderDetail = (row: any) => {
      isShowViewDetail.value = !isShowViewDetail.value
      state.selectedRow = row
    }

    const handleShipping = async (row: any) => {
      state.selectedRow = row
      if (row.status == 1) {
        const data = {
          deliveryCompany: row.deliveryCompany || '',
          deliverySn: row.deliverySn || '',
          orderId: row.id
        }
        await sendShipping([data]).then((res) => {
          ElMessage({
            type: 'success',
            message: '操作成功!'
          })
          getData()
        })
      } else if (row.supplierStatus == 4) {
        const data = [{
          orderSn: row.orderSn,
          supplierStatus: 5
        }]
        await fetch({
          url: `/mall/order/updateSupplierOrderStatus`,
          method: 'post',
          data: data
        }).then((res) => {
          ElMessage({
            type: 'success',
            message: '发货成功!'
          })
          getData()
        })
      }
    }

    const handleCloseOrder = async (row: any) => {
      state.selectedRow = row
      const formData = new FormData()
      formData.append('ids', row.id)
      formData.append('note', 'test')
      await closeOrder(formData).then((res) => {
        ElMessage({
          type: 'success',
          message: '操作成功!'
        })
        getData()
      })
    }

    const handleShowTrans = (row: any) => {
      isShowTrans.value = !isShowTrans.value
      isEditTrans.value = false
      state.selectedRow = row
    }

    const handleEditTrans = (row: any) => {
      isShowTrans.value = !isShowTrans.value
      isEditTrans.value = true
      state.selectedRow = row
    }

    const pickDate = (e: any) => {
      const startTime = e[0].toLocaleDateString().replaceAll('/', '-')
      const endTime = e[1].toLocaleDateString().replaceAll('/', '-')
      state.time[0] = startTime
      state.time[1] = endTime
      state.listQuery.startTime = startTime
      state.listQuery.endTime = endTime
    }

    return {
      tableHeight,
      listQueryForm,
      getData,
      handleSearchList,
      handleResetSearch,
      handleCurrentChange,
      isShowViewDetail,
      getOrderStatus,
      getSkillName,
      getTextColorType,
      getServiceType,
      getColorTypeSupplier,
      getSourceType,
      getOrderStatusSupplier,
      handleViewOrderDetail,
      handleShipping,
      handleShowTrans,
      handleEditTrans,
      isShowTrans,
      isEditTrans,
      pickDate,
      getChangeOperateType,
      batchOperation,
      handleSelectionChange,
      handleCloseOrder,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">

</style>
