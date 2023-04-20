<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      v-if="dialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="退款"
      @close="handelClose"
      width="120rem"
    >
      <el-table
          stripe
          :data="state.form.data"
          border
        >
          <el-table-column label="商品" width="200" header-align="center">
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
          <el-table-column align="center" label="实付金额" prop="tempTotalAmount"/>
          <el-table-column align="center" label="退款金额" prop="amount">
            <template #default="scope">
              <el-input-number style="width:100%" v-model="scope.row.amount" :min="0" :max="scope.row.tempTotalAmount"/>
            </template>
          </el-table-column>
          <el-table-column align="center" label="商品数量" prop="productQuantity"/>
          <el-table-column align="center" label="退款数量" prop="quantity">
            <template #default="scope">
              <!-- <el-input
                style="width: 100%"
                type="number"
                v-model="scope.row.quantity"
                :min="0"
                :max="scope.row.productQuantity"
              >
              </el-input> -->
              <el-input-number style="width:100%" v-model="scope.row.quantity" :min="0" :max="scope.row.productQuantity"/>
            </template>
          </el-table-column>
          <el-table-column label="退款说明" prop="reason">
            <template #default="scope">
              <el-input
                style="width: 100%"
                v-model="scope.row.reason"
              >
              </el-input>
            </template>
          </el-table-column>
        </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            :loading="state.loading"
            @click="handleConfirm()"
            >确定</el-button
          >
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
const { proxy } = getCurrentInstance() as any
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  orderData: {
    type: Object,
    default: []
  },
  orderType: {
    type: Number,
    default: ()=> null
  },
  multiple: {
    //是否批量
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue', 'getData'])

const dialogVisible = ref<boolean>(false)
const multipleValue = ref<boolean>(false)
const showOrderSelectPerson = ref<boolean>(false)
const ruleForms = ref<any>('')

const state = reactive({
  amount: 0,
  dataForm: {} as any,
  form: {
    data: [] as any
  } as any,
  loading: false,
  priceWayList: [
    { label: '一口价', value: 1 },
    { label: '议价', value: 2 }
  ],
  orderStatusList: [
    { label: '企业抢单', value: 2 },
    { label: '外部抢单', value: 3 }
  ]
})
const rules = reactive(
  [
    { required: true, message: '请输入退款金额', trigger: 'blur' }
  ],
)

const changeVal = (val: any, item: any, i: number, name: string) => {
  let value: any = '' + val
  value =
    value
      .replace(/[^\d^\.]+/g, '')
      .replace(/^0+(\d)/, '$1')
      .replace(/^\./, '0.')
      .match(/^\d*(\.?\d{0,2})/g)[0] || ''
  const volid = {
    validator: (rule: any, value: any, callback: any) => {
      if (value === '') {
        callback(new Error('请输入退款金额'))
      } else {
        if (parseFloat(val) > item.tempTotalAmount) {
          callback(new Error('不能大于实付金额'))
        }
        callback()
      }
    },
    required: true,
    message: '不能大于实付金额',
    trigger: 'blur'
  }
  if (rules.length === 2) {
    rules.pop()
  }
  rules.push(volid)
  state.form.data[i][name] = value
}

const handleConfirm = () => {
  let list = JSON.parse(JSON.stringify(state.form.data))
    let data: any = []
    list.forEach((res: any) => {
      data.push({
        amount: res.amount,
        id: res.id,
        orderId: res.orderId,
        reason: res.reason || '',
        quantity:res.quantity
      })
    })
    saveData(data)
}
const saveData = async (data: any) => {
  fetch({
    url: '/mall/order/batchRefund',
    method: 'post',
    data: data
  }).then((res: any) => {
    if (res.code == '0') {
      showOrderSelectPerson.value = false
      ElMessage.success(`退款成功`)
      handelClose()
      emit('getData')
    }
  })
}

const handelClose = () => {
  state.form.data = []
  emit('update:modelValue', false)
}

watchEffect(() => {
  dialogVisible.value = props.modelValue
  multipleValue.value = props.multiple
  if (dialogVisible.value) {
    //整单退款
    // if (props.orderData && props.orderData.payAmount) {
    //   let list = [] as any
    //   let productNum = props.orderData.orderItems.reduce((pre: any, next:any) => {
    //       return pre + next.productQuantity
    //     }, 0)
    //   list.push({
    //     tempTotalAmount: props.orderData.payAmount,
    //     amount: props.orderData.payAmount,
    //     productQuantity: productNum,
    //     quantity:productNum
    //   })
    //   state.form.data = list
    //   return
    // }
    let list = [] as any
    list = props.orderData
    list.map((item: any) => {
      item.amount = proxy.$getNum.numAdd(item.totalAmount, item.diffAmount)
      item.tempTotalAmount = proxy.$getNum.numAdd(item.totalAmount, item.diffAmount)
      item.quantity = item.productQuantity
      item.reason = ''
    })
    state.form.data = list
  }
})
</script>

<style scoped lang="less">
@import '../orderTable';
:deep(.el-input){
  width: auto !important;
}
:deep(.el-dialog__body) {
  padding: 2rem;
}
</style>
