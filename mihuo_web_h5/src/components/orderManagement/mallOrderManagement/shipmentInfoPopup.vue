<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="修改发货信息"
      width="54rem"
      @close="handelClose"
    >
      <el-form
        ref="ruleForms"
        :model="formData"
        :rules="rules"
        label-width="10rem"
        :scroll-to-error="true"
      >
        <el-form-item label="发货方式">
          <el-radio-group
            v-model="formData.deliveryType"
            fill="#ffffff"
            text-color="#1890FF"
          >
            <el-radio-button :label="3">本地配送</el-radio-button>
            <el-radio-button :label="1">快递物流</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="formData.deliveryType == 1"
          label="物流公司"
          prop="deliveryCompany"
        >
          <el-select
            v-model="formData.deliveryCompany"
            filterable
            placeholder="请选择物流公司"
          >
            <el-option
              v-for="(item, index) in logisticsCompanyList"
              :key="index"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="formData.deliveryType == 1"
          label="运单号"
          prop="deliverySn"
        >
          <el-input v-model="formData.deliverySn" type="text" maxlength="30" />
        </el-form-item>
        <el-form-item
          v-if="formData.deliveryType == 3"
          label="配送信息"
          prop="deliveryInfo"
        >
          <el-input
            v-model="formData.deliveryInfo"
            placeholder="输入配送信息"
            type="textarea"
            :autosize="{ minRows: 3 }"
            show-word-limit
            maxlength="100"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleConfirm()">确定</el-button>
          <el-button @click="handelClose">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  orderData: {
    type: Object,
    default: () => ({})
  },
  orderId: {
    type: String || Number,
    default: ''
  },
  orderItemIds: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'getData'): void
}>()

const dialogVisible = computed({
  set(newVal: boolean) {
    emit('update:modelValue', newVal)
  },
  get() {
    return props.modelValue
  }
})
const ruleForms = ref<any>('')
const curOrderInfo = ref(props.orderData.at(-1))
const logisticsCompanyList = [
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
]
const formData = ref({
  deliveryType: curOrderInfo.value?.deliveryType ?? 3,
  deliveryCompany: curOrderInfo.value?.deliveryCompany,
  deliverySn: curOrderInfo.value?.orderItemSn,
  orderId: props.orderId,
  orderItemIds: props.orderItemIds,
  deliveryInfo: curOrderInfo.value?.deliveryInfo
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

const handleConfirm = () => {
  ruleForms.value.validate((valid: any) => {
    if (valid) {
      if (!formData.value.orderItemIds.length) {
        ElMessage.warning('请选择需要发货的商品')
      } else {
        saveData()
      }
    }
  })
}

// 新增提醒内容
const saveData = async () => {
  if (formData.value.deliveryType === 1) {
    formData.value.deliveryInfo = ''
  } else if (formData.value.deliveryType === 3) {
    formData.value.deliveryCompany = ''
    formData.value.deliverySn = ''
  }
  fetch({
    url: '/mall/order/modifyOrderDeliveryInfo',
    method: 'post',
    data: formData.value
  }).then((res: any) => {
    if (res.code == '0') {
      ElMessage.success(`发货信息修改成功`)
      handelClose()
      emit('getData')
    }
  })
}

const handelClose = () => {
  emit('update:modelValue', false)
}
</script>

<style scoped lang="less">
:deep(.is-active .el-radio-button__inner) {
  border: 1px solid !important;
}
</style>
