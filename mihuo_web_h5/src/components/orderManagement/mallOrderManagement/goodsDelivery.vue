<template>
  <div v-if="dialogVisible">
    <el-dialog
      v-model="dialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="商品发货"
      width="106rem"
      @close="handelClose"
    >
      <div class="goods-delivery">
        <div class="goods-delivery-title">
          选择商品：待发货{{ tableData.length }}
        </div>
        <el-table
          ref="multipleTableRef"
          stripe
          style="height: 40vh !important"
          :data="tableData"
          :height="'0'"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="商品" header-align="center">
            <template #default="scope">
              <div v-if="scope.row.productPic" class="goods">
                <el-image
                  :src="$imageGlobal + scope.row.productPic"
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
                  <div class="goods-tag">
                    <el-tag type="info">{{ scope.row.productSn }}</el-tag>
                    <el-tag type="info">{{ scope.row.productBrand }}</el-tag>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="数量"
            prop="productQuantity"
            width="100"
            align="center"
          />
          <el-table-column
            label="发货状态"
            width="180"
            align="center"
            prop="remark"
            show-overflow-tooltip
          />
        </el-table>

        <div class="goods-delivery-title2">
          <span>收货信息</span>
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

        <div class="delivery-detail">
          <div>联系人</div>
          <div>{{ state.data.receiverName }}</div>
        </div>
        <div class="delivery-detail">
          <div>联系电话</div>
          <div>{{ state.data.receiverPhone }}</div>
        </div>
        <div class="delivery-detail">
          <div>收货地址</div>
          <div>
            {{ state.data.receiverProvince }}{{ state.data.receiverCity
            }}{{ state.data.receiverRegion
            }}{{ state.data.receiverDetailAddress }}
          </div>
        </div>
        <el-form
          ref="ruleForms"
          :model="state.form"
          :rules="rules"
          label-width="10rem"
          :scroll-to-error="true"
        >
          <el-form-item label="发货方式">
            <el-radio-group
              v-model="state.form.deliveryType"
              fill="#ffffff"
              text-color="#1890FF"
            >
              <el-radio-button :label="3">本地配送 </el-radio-button>
              <el-radio-button :label="1">快递物流</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="state.form.deliveryType == 1"
            label="物流公司"
            prop="deliveryCompany"
          >
            <el-select
              v-model="state.form.deliveryCompany"
              filterable
              placeholder="请选择物流公司"
            >
              <el-option
                v-for="(item, index) in state.logisticsCompanyList"
                :key="index"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="state.form.deliveryType == 1"
            label="运单号"
            prop="deliverySn"
          >
            <el-input
              v-model="state.form.deliverySn"
              type="text"
              maxlength="30"
            />
          </el-form-item>
          <el-form-item
            v-if="state.form.deliveryType == 3"
            label="配送信息"
            prop="deliveryInfo"
          >
            <el-input
              v-model="state.form.deliveryInfo"
              placeholder="输入配送信息"
              type="textarea"
              :autosize="{ minRows: 3 }"
              show-word-limit
              maxlength="100"
            />
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            :loading="state.loading"
            @click="handleConfirm"
          >确定</el-button>
          <el-button @click="handelClose">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  defineEmits,
  defineProps,
  ref,
  onMounted,
  watchEffect,
  reactive,
  watch
} from 'vue'
import { fetch } from '_@/axios-config/axios'
import { ElMessage, ElTable } from 'element-plus'
import { getDeliveryType } from '@/components/orderManagement/order'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: () => ({})
  },
  orderItemIds: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['update:modelValue', 'getData'])
const { proxy } = getCurrentInstance() as any

const dialogVisible = ref<boolean>(false)
const ruleForms = ref<any>('')
const tableData = ref<any>([])
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<any>([])

const state = reactive({
  logisticsCompanyList: [
    { label: '中通快递' },
    { label: '申通快递' },
    { label: '圆通快递' },
    { label: '韵达快递' },
    { label: '极兔快递' },
    { label: '京东快递' },
    { label: '邮政包裹' },
    { label: '顺丰快递' },
    { label: '百世快递' },
    { label: '优速快递' },
    { label: '德邦快递' }
  ],
  form: { deliveryType: 3, deliverySn: props.data.orderSn } as any,
  data: {} as any,
  orderItemIds: [] as any
})
const rules = reactive({
  deliveryCompany: [
    { required: true, message: '请选择物流公司', trigger: 'change' }
  ],
  deliverySn: [{ required: true, message: '请输入物流单号', trigger: 'blur' }],
  deliveryInfo: [
    { required: true, message: '输入配送信息', trigger: 'blur' },
    { max: 100, message: '最多支持填写100个字符', trigger: 'blur' }
  ]
})

const handleSelectionChange = (row: any) => {
  state.orderItemIds = row
}

const handleConfirm = () => {
  ruleForms.value.validate((valid: any) => {
    if (valid) {
      state.form.orderItemIds = []
      state.form.orderId = state.data.id
      state.orderItemIds.forEach((res: any) => {
        state.form.orderItemIds.push(res.id)
      })
      if (state.form.orderItemIds.length <= 0) {
        ElMessage.warning('请选择需要发货的商品')
      } else {
        saveData()
      }
    }
  })
}

// 发货。批量发货
const saveData = async () => {
  if (state.form.deliveryType === 1) {
    state.form.deliveryInfo = ''
  } else if (state.form.deliveryType === 3) {
    state.form.deliveryCompany = ''
    state.form.deliverySn = ''
  }

  fetch({
    url: '/mall/order/delivery',
    method: 'post',
    data: state.form
  }).then((res: any) => {
    if (res.code == '0') {
      ElMessage.success(`发货成功`)
      handelClose()
      emit('getData')
    }
  })
}

const handelClose = () => {
  emit('update:modelValue', false)
}

onMounted(() => {
  nextTick(() => {
    const list = [] as any
    state.orderItemIds = props.orderItemIds
    tableData.value.forEach((res: any) => {
      state.orderItemIds.forEach((res2: any) => {
        if (res2 == res.id) {
          list.push(res)
        }
      })
    })
    list.forEach((item: any) => {
      multipleTableRef!.value!.toggleRowSelection(item, true)
    })
  })
})
watchEffect(() => {
  dialogVisible.value = props.modelValue
  state.data = props.data
  // 过滤掉已申请退款的商品，已申请退款的商品不能发货
  tableData.value = state.data.orderItems.filter(
    (item: any) => item.refundStatus != 1
  )
})
</script>

<style scoped lang="less">
@import '../orderTable';

:deep(.is-active .el-radio-button__inner) {
  border: 1px solid !important;
}
</style>
