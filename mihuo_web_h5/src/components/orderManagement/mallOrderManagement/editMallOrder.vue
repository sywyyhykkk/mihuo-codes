<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="修改商品信息"
      @close="handelClose"
      width="54rem"
    >
      <el-form
        ref="ruleForms"
        :model="state.form"
        :rules="rules"
        label-width="10rem"
        :scrollToError="true"
      >
        <div
          class="goods"
          style="
            margin-top: 2.2rem;
            padding-left: 2rem;
            width: calc(100% - 4rem);
          "
        >
          <el-image
            :src="$getUrl.getPicUrl(props.dataForm.productPic)"
            :preview-src-list="$getUrl.getPicUrl(props.dataForm.productPic)"
            :preview-teleported="true"
            :fit="fit"
          ></el-image>
          <div class="goods-info">
            <div class="product-name">{{ props.dataForm.productName }}</div>
            <div
              class="speci"
              v-for="(item, index) in state.productAttr"
              :key="index"
            >
              {{ item.key + ':' + item.value }}
            </div>
            <div class="goods-tag">
              <el-tag type="info">{{ props.dataForm.productSn }}</el-tag>
              <el-tag type="info">{{ props.dataForm.productBrand }}</el-tag>
            </div>
          </div>
        </div>
        <!-- <el-form-item label="商品规格" prop="skuData">
          <el-input v-model="state.form.skuData" autocomplete="off" suffix-icon="ArrowRight"
                    readonly @click="selectProductType=true" />
        </el-form-item> -->
        <el-form-item label="商品单价" prop="productPrice">
          <el-input
            style="width: 19rem"
            type="tel"
            @input="(value) => changeVal(value)"
            v-model="state.form.productPrice"
            @blur="handelBlur"
          >
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="数量" prop="productQuantity">
          <el-input
            style="width: 19rem"
            type="number"
            @blur="handelBlur"
            v-model="state.form.productQuantity"
            oninput="value=value.replace(/^(0+)|[^\d]+/g,'')"
          />
        </el-form-item>
        <el-form-item label="小计" prop="">
          <div>￥{{ state.form.totalAmount?.toFixed(2) }}</div>
        </el-form-item>
        <el-form-item label="商品留言" prop="serviceNotes">
          <el-input type="textarea" v-model="state.form.serviceNotes" />
        </el-form-item>
      </el-form>
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
    <el-dialog
      v-model="selectProductType"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="选择商品规格"
      width="110rem"
    >
      <div style="height: 55vh; overflow-y: auto">
        <SkuTable
          v-if="selectProductType"
          v-model="state.form.skuData"
          :is-edit="isEdit"
          :product-id="props.dataForm.productId"
          @close="cancelSelect"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="confirmSelect">确 定</el-button>
          <el-button @click="cancelSelect">取 消</el-button>
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
import { getSkuData } from '@/components/orderManagement/order'
import getNum from '@/utils/arithmetic'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  dataForm: {
    type: Object,
    default: {}
  }
})
const emit = defineEmits(['update:modelValue', 'getData'])

const dialogVisible = ref<boolean>(false)
const selectProductType = ref<boolean>(false)
const isEdit = ref<boolean>(true)
const ruleForms = ref<any>('')

const state = reactive({
  productAttr: [],
  dataForm: {} as any,
  form: {} as any,
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
const rules = reactive({
  productPrice: [
    { required: true, message: '请输入商品单价', trigger: 'blur' }
  ],
  productQuantity: [
    { required: true, message: '请输入商品数量', trigger: 'blur' }
  ],
  skuData: [{ required: true, message: '请选择商品规格', trigger: 'change' }]
})

const changeVal = (val: any) => {
  let value: any = "" + val;
    value =
      value
        .replace(/[^\d^\.]+/g, "")
        .replace(/^0+(\d)/, "$1")
        .replace(/^\./, "0.")
        .match(/^\d*(\.?\d{0,2})/g)[0] || "";
  state.form.productPrice = value
}

const handelBlur = () => {
  state.form.totalAmount = getNum.numMulti(
    state.form.productPrice || 0,
    state.form.productQuantity || 0
  )
}

const confirmSelect = () => {
  console.log(state.form.skuData)
  if (state.form.skuData?.id) {
    state.form.productSkuId = state.form.skuData.id
    state.form.productAttr = JSON.parse(
      JSON.stringify(state.form.skuData.spData)
    )
    state.form.skuData = getSkuData(state.form.productAttr)
    selectProductType.value = false
    console.log('到这了', state.form)
  } else {
    state.form.skuData = state.form.productAttr
      ? getSkuData(state.form.productAttr)
      : ''
    selectProductType.value = false
  }
}
const cancelSelect = () => {
  state.form.skuData = state.form.productAttr
    ? getSkuData(state.form.productAttr)
    : ''
  selectProductType.value = false
}

const handleConfirm = () => {
  ruleForms.value.validate((valid: any) => {
    if (valid) {
      saveData()
    }
  })
}
const saveData = async () => {
  state.form.itemId = state.form.id
  let obj = {
    items: [
      {
        orderItemId: state.form.id,
        productPrice: state.form.productPrice,
        productQuantity: state.form.productQuantity,
        serviceNotes: state.form.serviceNotes
      }
    ],
    orderId: state.form.orderId
  }

  fetch({
    url: '/mall/order/standardOrderItemPriceModify',
    method: 'post',
    data: obj
  }).then((res: any) => {
    if (res.code == '0') {
      ElMessage.success(`修改成功`)
      handelClose()
      emit('getData')
    }
  })
}

const handelClose = () => {
  emit('update:modelValue', false)
}

onMounted(() => {
  watch(
    () => props.modelValue,
    () => (dialogVisible.value = props.modelValue)
  )
  watch(
    () => props.dataForm,
    () => {
      state.form = JSON.parse(JSON.stringify(props.dataForm))
      let list = [] as any
      if (state.form && state.form.productAttr) {
        list = state.form.productAttr
        state.productAttr = list ? JSON.parse(list) : []
      }
    }
  )

  if (dialogVisible.value) {
    state.form.skuData = state.form.productAttr
      ? getSkuData(state.form.productAttr)
      : ''
  }

  // console.log('监听到了')
})
</script>

<style scoped lang="less">
@import '../orderTable';
</style>
