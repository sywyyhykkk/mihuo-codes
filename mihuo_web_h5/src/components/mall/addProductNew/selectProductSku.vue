<template>
  <div>
    <el-dialog
      v-model="selectProductType"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="选择商品"
      width="106rem"
      @close="handelClose"
    >
      <div
        style="
          height: 55vh;
          overflow-y: auto;
          padding-right: 2rem;
          padding-top: 2rem;
        "
      >
        <div v-if="servicePackList.length > 0" style="margin-bottom: 20px">
          <div>已选商品及sku:</div>
          <div
            style="line-height: 30px; display: flex; align-items: center"
            v-for="item in servicePackList"
            :key="item.id"
          >
            <div>
              {{ item.productName }}
            </div>
            &nbsp;<span>{{ item.skuCode }}</span>
            <el-icon
              style="margin: 0 1rem 0 1rem"
              color="#F56C6C"
              @click="deleteSku(item)"
              ><DeleteFilled
            /></el-icon>
          </div>
        </div>
        <span>选择商品：</span>
        <el-select
          v-model="state.containsProduct"
          placeholder="请选择所需商品和服务"
          @change="selectProduct"
          @remove-tag="removeProduct"
          multiple
          filterable
          style="width: 100%; margin-top: 2rem"
        >
          <el-option
            v-for="item in state.productList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-table
          stripe
          style="width: 100%; margin-top: 20px; height: 350px"
          :data="state.skuList"
          border
        >
          <el-table-column label="SKU编号" align="center" prop="skuCode" />
          <el-table-column
            v-for="(item, index) in state.spData"
            :key="index"
            :label="item.key"
            align="center"
          >
            <template #default="scope">
              <!--          {{ item.value }}-->
              {{ getProductSkuSp(scope.row, index) }}
            </template>
          </el-table-column>
          <el-table-column label="销售价格" align="center" prop="price" />
          <el-table-column label="商品库存" align="center" prop="stock" />
          <el-table-column label="库存预警值" align="center" prop="lowStock" />
          <el-table-column
            label="转换系数"
            align="center"
            prop="convertValue"
          />
          <el-table-column
            label="操作"
            fixed="right"
            width="160"
            align="center"
          >
            <template #default="scope">
              <el-button
                size="mini"
                type="text"
                @click="getSelectSku(scope.$index, scope.row)"
                >选择
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handelConfirm">确 定</el-button>
          <el-button @click="handelClose">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  watchEffect,
  defineEmits,
  defineProps,
  onMounted,
  inject,
  reactive
} from 'vue'
import { fetch } from '_@/axios-config/axios'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: []
  },
  protType: {
    type: Number || String,
    default: '0'
  }
})
const emit = defineEmits(['update:modelValue', 'update:data'])
const selectProductType = ref<boolean>(false)
const servicePackList = ref<any>([])
let protType = inject('protType')
const state = reactive({
  productList: [],
  containsProduct: [] as any,
  selectLength: 0,
  spData: [],
  skuList: []
})

const handelConfirm = () => {
  emit('update:data', servicePackList.value)
  console.log(servicePackList.value)
  emit('update:modelValue', false)
}

const handelClose = () => {
  emit('update:modelValue', false)
  emit('update:data', props.data)
}
const getSelectSku = (index: any, row: any) => {
  const hasData = servicePackList.value.find((item: any) => item.id == row.id)
  if (hasData) {
    ElMessage.error('不能重复选择')
    return
  }
  servicePackList.value.push(row)
  //state.skuList = []
}

const removeProduct = (row: any) => {
  servicePackList.value = servicePackList.value.filter(
    (data: any) => data.productId != row
  )
}

const selectProduct = async (row: any) => {
  console.log(row)
  if (row.length <= 0) {
    servicePackList.value = []
    return
  }
  if (row.length - 1 > servicePackList.value.length) {
    ElMessage.warning('上一个商品的sku信息未选择,请选择商品对应的sku')
    state.containsProduct.splice(row.length - 1, 1)
    return
  }
  if (row.length < state.selectLength) {
    state.selectLength = row.length
    state.skuList = []
    return
  } else {
    state.selectLength = row.length
  }
  await fetch({
    url: `/mall/sku/${row[row.length - 1]}`,
    method: 'get'
  }).then((res) => {
    var productName: any = ''
    state.productList.some((item: any) => {
      if (item.id === row[row.length - 1]) {
        productName = item.name
        return
      }
    })
    var spData: any = []
    let list = JSON.parse(JSON.stringify(res.data))
    list.forEach((item: any) => {
      state.spData = JSON.parse(item.spData)
      item.skuId = item.id
      item.productId = row[row.length - 1]
      item.productName = productName
    })
    state.skuList = list
  })
}

//
const getProductSkuSp = (row: any, index: number) => {
  const spData = JSON.parse(row.spData)
  if (spData != null && index < spData.length) {
    return spData[index].value
  } else {
    return null
  }
}

//获取商品列表
const getProductList = async () => {
  await fetch({
    url: `/mall/product/getList/${protType}`,
    method: 'get'
  }).then((res: any) => {
    state.productList = res.data
  })
}
//删除逻辑
const deleteSku = (data: any) => {
  console.log(data)
  servicePackList.value = servicePackList.value.filter(
    (item: any) => item.id != data.id
  )
  //看下剩下的数据里面时候还有存在的分类id
  const hasProduct = servicePackList.value.find(
    (item: any) => item.productId == data.productId
  )
  if (!hasProduct) {
    state.containsProduct = state.containsProduct.filter(
      (value: any) => value != data.productId
    )
    if (!state.containsProduct.length) {
      state.skuList = []
    }
  }
}

onMounted(async () => {
  selectProductType.value = props.modelValue
  servicePackList.value = props.data
    ? JSON.parse(JSON.stringify(props.data))
    : []
  await getProductList()
  if (props.isEdit) {
    servicePackList.value?.forEach((res: any) => {
      state.containsProduct = state.containsProduct.filter(
        (item: any) => item != res.productId
      )
      state.containsProduct.push(res.productId)
    })
  }
})
</script>

<style scoped>
</style>
