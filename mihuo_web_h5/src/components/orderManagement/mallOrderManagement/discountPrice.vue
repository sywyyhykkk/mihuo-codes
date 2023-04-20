<template>
  <div>
    <el-dialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="优惠金额"
      width="54rem"
      @close="handelClose"
    >
      <el-form
        ref="discountFormRef"
        :model="state.form"
        :rules="rules"
        label-width="10rem"
        :scroll-to-error="true"
      >
        <el-form-item label="优惠金额" prop="price">
          <el-input v-model="state.form.price" type="number" @input="(val) => changePrice(val)">
            <template #append>元</template>
          </el-input>
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
import { ElMessage } from 'element-plus'
import { inputLimtPrice } from '@/utils/utils'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  orderId: {
    type: [String, Number],
    default: ''
  }
})
const emit = defineEmits(['update:modelValue', 'getData'])

const dialogVisible = ref<boolean>(false)
const discountFormRef = ref<any>('')

const state = reactive({
  form: {} as any
})
const rules = reactive({
  price: [{ required: true, message: '请输入优惠金额', trigger: 'blur' }]
})

const changePrice = (val:any) => {
  state.form.price = inputLimtPrice(val)
}

const handleConfirm = async () => {
  await discountFormRef.value.validate((valid: any) => {
    if (valid) {
      fetch({
        url: '/mall/order/standardOrderPriceModify',
        method: 'post',
        data: {
          orderId: props.orderId,
          discountAmount: parseFloat(state.form.price),
          promotionInfo: ''
        }
      }).then((res: any) => {
        if (res.code == '0') {
          ElMessage.success(`操作成功`)
          handelClose()
          emit('getData')
        }
      })
    }
  })
}

const handelClose = () => {
  state.form = {}
  emit('update:modelValue', false)
}

watchEffect(() => {
  dialogVisible.value = props.modelValue
})
</script>

<style scoped lang="less">
@import '../orderTable';
</style>
