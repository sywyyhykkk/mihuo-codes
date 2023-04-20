<template>
  <div>
    <el-dialog
      v-model="isShowDialog"
      destroy-on-close
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="`报价清单 总计 ¥${totalCost}元`"
      width="75%"
      @close="hideDialog"
    >
      <div class="dialog-container">
        <el-tabs v-model="activeName" class="demo-tabs">
          <el-tab-pane label="人工费" name="laborData">
            <el-card shadow="never">
              <template #header>
                <div class="flex-center" style="justify-content: space-between;">
                  <span>总计 ¥{{ laborCost }}元</span>
                  <el-button
                    type="primary"
                    icon="plus"
                    @click="addCostItem(1)"
                  >
                    添加人工费
                  </el-button>
                </div>
              </template>
              <el-table
                v-loading="false"
                stripe
                style="height: 60rem !important; overflow-y: scroll;"
                :data="laborTableData"
                :height="0"
                border
              >
                <el-table-column type="index" label="序号" />
                <el-table-column prop="productName" label="商品名称" width="150" />
                <el-table-column prop="skuLabel" label="规格" width="100" />
                <el-table-column prop="price" label="单价" width="100" />
                <el-table-column prop="quantity" label="数量" width="100" />
                <el-table-column prop="total" label="总价" width="100">
                  <template #default="scope">
                    ¥{{ (scope.row.price * scope.row.quantity).toFixed(2) }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="selfBuy"
                  label="业主自购"
                  width="100"
                  align="center"
                >
                  <template #default="scope">
                    {{ scope.row.selfBuy?"是":"否" }}
                  </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注说明" />
                <el-table-column label="操作" width="330" fixed="right">
                  <template #default="scope">
                    <el-button
                      plain
                      icon="sort-up"
                      @click="sortUpCost(scope.$index, 1, scope.row)"
                    >上移</el-button>
                    <el-button
                      plain
                      icon="sort-down"
                      @click="sortDownCost(scope.$index, 1, scope.row)"
                    >下移</el-button>
                    <el-button
                      type="text"
                      icon="edit"
                      @click="editCostItem(scope.row, scope.$index, 1)"
                    >编辑</el-button>
                    <el-button
                      type="text"
                      class="danger"
                      icon="delete"
                      @click="deleteCostItem(scope.row, scope.$index, 1)"
                    >删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="主材费" name="materialData">
            <el-card shadow="never">
              <template #header>
                <div class="flex-center" style="justify-content: space-between;">
                  <span>
                    总计 ¥{{ materialCost }}元
                  </span>
                  <el-button
                    type="primary"
                    icon="plus"
                    @click="addCostItem(2)"
                  >
                    添加主材
                  </el-button>
                </div>
              </template>
              <el-table
                v-loading="false"
                stripe
                style="height: 60rem !important; overflow-y: scroll;"
                :data="materialTableData"
                :height="0"
                border
              >
                <el-table-column type="index" label="序号" />
                <el-table-column prop="selfBuy" label="商品来源" width="100">
                  <template #default="scope">
                    {{ scope.row.selfBuy ? '自购' : '平台' }}
                  </template>
                </el-table-column>
                <el-table-column prop="productName" label="商品名称" width="150" />
                <el-table-column prop="skuLabel" label="规格" width="100" />
                <el-table-column prop="price" label="单价" width="100" />
                <el-table-column prop="quantity" label="数量" width="100" />
                <el-table-column prop="total" label="总价" width="100">
                  <template #default="scope">
                    ¥{{ (scope.row.price * scope.row.quantity).toFixed(2) }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="selfBuy"
                  label="业主自购"
                  width="100"
                  align="center"
                >
                  <template #default="scope">
                    {{ scope.row.selfBuy?"是":"否" }}
                  </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注说明" />
                <el-table-column label="操作" width="330" fixed="right">
                  <template #default="scope">
                    <el-button
                      plain
                      icon="sort-up"
                      @click="sortUpCost(scope.$index, 2, scope.row)"
                    >上移</el-button>
                    <el-button
                      plain
                      icon="sort-down"
                      @click="sortDownCost(scope.$index, 2, scope.row)"
                    >下移</el-button>
                    <el-button
                      type="text"
                      icon="edit"
                      @click="editCostItem(scope.row, scope.$index, 2)"
                    >编辑</el-button>
                    <el-button
                      type="text"
                      class="danger"
                      icon="delete"
                      @click="deleteCostItem(scope.row, scope.$index, 2)"
                    >删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="辅材费" name="auxiliaryMaterialData">
            <el-card shadow="never">
              <template #header>
                <div class="flex-center" style="justify-content: space-between;">
                  <span>
                    总计 ¥{{ auxiliaryMaterialCost }}元
                  </span>
                  <el-button
                    type="primary"
                    icon="plus"
                    @click="addCostItem(3)"
                  >
                    添加辅材
                  </el-button>
                </div>
              </template>
              <el-table
                v-loading="false"
                stripe
                style="height: 60rem !important; overflow-y: scroll;"
                :data=" auxiliaryMaterialsTableData"
                :height="0"
                border
              >
                <el-table-column type="index" label="序号" />
                <el-table-column prop="selfBuy" label="商品来源" width="100">
                  <template #default="scope">
                    {{ scope.row.selfBuy ? '自购' : '平台' }}
                  </template>
                </el-table-column>
                <el-table-column prop="productName" label="商品名称" width="150" />
                <el-table-column prop="skuLabel" label="规格" width="100" />
                <el-table-column prop="price" label="单价" width="100" />
                <el-table-column prop="quantity" label="数量" width="100" />
                <el-table-column prop="total" label="总价" width="100">
                  <template #default="scope">
                    ¥{{ (scope.row.price * scope.row.quantity).toFixed(2) }}
                  </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注说明" />
                <el-table-column label="操作" width="330" fixed="right">
                  <template #default="scope">
                    <el-button
                      plain
                      icon="sort-up"
                      @click="sortUpCost(scope.$index, 3, scope.row)"
                    >上移</el-button>
                    <el-button
                      plain
                      icon="sort-down"
                      @click="sortDownCost(scope.$index, 3, scope.row)"
                    >下移</el-button>
                    <el-button
                      type="text"
                      icon="edit"
                      @click="editCostItem(scope.row, scope.$index, 3)"
                    >编辑</el-button>
                    <el-button
                      type="text"
                      class="danger"
                      icon="delete"
                      @click="deleteCostItem(scope.row, scope.$index, 3)"
                    >删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-tab-pane>
        </el-tabs>
      </div>
      <template #footer>
        <div style="padding: 2rem">
          <el-button type="primary" @click="saveGroupPricingDialog">保存</el-button>
          <el-button @click="hideDialog">取消</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="isShowFormDialog"
      destroy-on-close
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="isEditForm ? '编辑报价清单' : '新增报价清单'"
      width="40%"
      @close="hideFormDialog"
    >
      <div>
        <el-form
          ref="groupPricingForms"
          :model="groupPricingForm"
          label-width="10rem"
          :rules="groupPricingRules"
        >
          <el-form-item label="业主自购" prop="selfBuy">
            <el-switch v-model="groupPricingForm.selfBuy" />
          </el-form-item>
          <el-form-item label="商品" prop="productId">
            <el-input
              v-model="groupPricingForm.productName"
              placeholder="请选择商品"
              @change="onChangeProcuct"
            />
            <el-button style="margin-left: 1rem;" @click="selectProduct">选择商品</el-button>
          </el-form-item>
          <el-form-item v-if="groupPricingForm.selfBuy" label="商品封面图" prop="productCoverPic">
            <uploadImage
              v-model="groupPricingForm.productCoverPic"
              :max-count="1"
              :is-edits="false"
            />
          </el-form-item>
          <el-form-item v-if="!groupPricingForm.selfBuy" label="商品规格" prop="skuLabel">
            <el-select
              v-model="groupPricingForm.skuLabel"
              filterable
              placeholder="请选择商品规格"
              @change="onSkuChange"
            >
              <el-option
                v-for="(option, index) in skuList"
                :key="index"
                :label="option.label"
                :value="option.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="groupPricingForm.selfBuy" label="商品规格" prop="skuLabel">
            <el-input
              v-model="groupPricingForm.skuLabel"
              placeholder="请输入商品规格"
            />
          </el-form-item>
          <el-form-item label="商品单价" prop="price">
            <el-input
              v-model="groupPricingForm.price"
              placeholder="请输入商品单价"
              type="number"
            />
          </el-form-item>
          <el-form-item label="商品数量" prop="quantity">
            <el-input
              v-model="groupPricingForm.quantity"
              placeholder="请输入商品数量"
              type="number"
              @input="onQuantityInput"
            />
          </el-form-item>
          <el-form-item label="备注说明" prop="remark">
            <el-input
              v-model="groupPricingForm.remark"
              placeholder="请输入备注说明"
              type="textarea"
              maxlength="80"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div style="padding: 2rem">
          <el-button type="primary" @click="saveForm">保存</el-button>
          <el-button @click="hideFormDialog">取消</el-button>
        </div>
      </template>
    </el-dialog>
    <ChooseProduct
      v-model="isShowProduct"
      :single="true"
      :product-type="currentType"
      @getGeneralMaterial="onSelectProduct"
    />
  </div>
</template>

<script lang="ts" setup>
import { groupPricingRules } from '../rules'
import { ElMessage, ElMessageBox } from 'element-plus'
import { editCase, getProductDetail } from '_c/CaseManagement/api'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  stage: {
    type: Object,
    default: () => ({})
  }
})

// 当前tab
const activeName = ref('laborData')

const onQuantityInput = (val: any) => {
  groupPricingForm.value.quantity = val.replace(/[^0-9]/g, '')
}

const emit = defineEmits(['update:modelValue', 'updateData'])
// 控制表单的显示/隐藏
const isShowDialog = ref(false)
// 人工费总计
const laborCost = computed(() => {
  return laborTableData.value.reduce((pre, cur) => pre + Number(cur.price) * Number(cur.quantity), 0).toFixed(2)
})
// 主材费总计
const materialCost = computed(() => {
  return materialTableData.value.reduce((pre, cur) => pre + Number(cur.price) * Number(cur.quantity), 0).toFixed(2)
})
// 辅材费总计
const auxiliaryMaterialCost = computed(() => {
  return auxiliaryMaterialsTableData.value.reduce((pre, cur) => pre + Number(cur.price) * Number(cur.quantity), 0).toFixed(2)
})
// 报价清单总计
const totalCost = computed(() => {
  return (Number(laborCost.value) + Number(materialCost.value) + Number(auxiliaryMaterialCost.value)).toFixed(2)
})
// 当前表单类型 1=人工费 2=材料费
const currentType = ref(0)
provide('currentType', currentType)
// 当前表格记录index
const currentFormIndex = ref(-1)

// 人工费表格
const laborTableData = ref<any[]>(props.stage.groupPrice?.laborCosts || [])
// 主材费表格
const materialTableData = ref<any[]>(props.stage.groupPrice?.mainMaterials || [])
// 辅材费表格
const auxiliaryMaterialsTableData = ref<any[]>(props.stage.groupPrice?.auxiliaryMaterials || [])

watchEffect(() => {
  isShowDialog.value = props.modelValue
})

// 保存报价清单
const saveGroupPricingDialog = async () => {
  const laborCosts = laborTableData.value
  const mainMaterials = materialTableData.value
  const auxiliaryMaterials = auxiliaryMaterialsTableData.value
  emit('updateData', { laborCosts, mainMaterials, auxiliaryMaterials, totalPrice: totalCost.value })
}

const hideDialog = () => {
  emit('update:modelValue', false)
}

// 新增表格记录
const addCostItem = (type: number) => {
  currentType.value = type
  isShowFormDialog.value = true
}

// 编辑人工费记录
const editCostItem = (row: any, index: any, type: number) => {
  currentType.value = type
  isEditForm.value = true
  currentFormIndex.value = index
  groupPricingForm.value = {
    productId: row.productId,
    productName: row.productName,
    skuLabel: row.skuLabel,
    price: row.price,
    quantity: row.quantity,
    selfBuy: row.selfBuy,
    remark: row.remark,
    coverImg: row.coverImg,
    customCategory: row.customCategory,
    platformCategoryName: row.platformCategoryName,
    productCoverPic: row.productCoverPic || null
  }
  isShowFormDialog.value = true
}

// 删除表格记录
const deleteCostItem = (row: any, index: any, type: number) => {
  currentType.value = type
  currentFormIndex.value = index
  if (currentType.value === 1) {
    // 人工费
    laborTableData.value.splice(index, 1)
  } else if (currentType.value === 2) {
    // 主材费
    materialTableData.value.splice(index, 1)
  } else {
    auxiliaryMaterialsTableData.value.splice(index, 1)
  }
}

// 上移动表格记录 type=1 人工费记录 type=2 材料费记录
const sortUpCost = (index: any, type: number, item: any) => {
  if (index === 0) return
  if (type === 1) {
    // 人工费记录上移
    const pre = laborTableData.value[index - 1]
    laborTableData.value[index - 1] = item
    laborTableData.value[index] = pre
  } else if (type === 2) {
    // 主材费记录上移
    const pre = materialTableData.value[index - 1]
    materialTableData.value[index - 1] = item
    materialTableData.value[index] = pre
  } else {
    // 辅材费记录上移
    const pre = auxiliaryMaterialsTableData.value[index - 1]
    auxiliaryMaterialsTableData.value[index - 1] = item
    auxiliaryMaterialsTableData.value[index] = pre
  }
}

// 下移表格记录 type=1 人工费记录 type=2 材料费记录
const sortDownCost = (index: any, type: number, item: any) => {
  if (type === 1) {
    if (index === laborTableData.value.length - 1) return
    // 人工费记录下移
    const next = laborTableData.value[index + 1]
    laborTableData.value[index + 1] = item
    laborTableData.value[index] = next
  } else if (type === 2) {
    if (index === materialTableData.value.length - 1) return
    // 主材费记录下移
    const next = materialTableData.value[index + 1]
    materialTableData.value[index + 1] = item
    materialTableData.value[index] = next
  } else {
    if (index === auxiliaryMaterialsTableData.value.length - 1) return
    // 辅材费记录下移
    const next = auxiliaryMaterialsTableData.value[index + 1]
    auxiliaryMaterialsTableData.value[index + 1] = item
    auxiliaryMaterialsTableData.value[index] = next
  }
}

// 是否显示表单弹窗
const isShowFormDialog = ref(false)
// 是否是编辑表单
const isEditForm = ref(false)
// 组价表单
const groupPricingForm = ref({
  productId: '',
  productCoverPic: '',
  productName: '',
  skuLabel: '',
  price: '',
  quantity: null,
  selfBuy: false,
  remark: '',
  coverImg: '',
  customCategory: '',
  platformCategoryName: ''
})
const groupPricingForms = ref('')
// 商品规格列表
const skuList = ref([])
// 是否显示选择商品弹窗
const isShowProduct = ref(false)

// 选择商品
const selectProduct = () => {
  isShowProduct.value = true
}

const onChangeProcuct = (val: any) => {
  if (groupPricingForm.value.selfBuy) {
    groupPricingForm.value.productId = '99999'
  }
}

// 选择商品
const onSelectProduct = async (product: any) => {
  if (!product?.value[0]?.id) return
  const res = await getProductDetail(product.value[0].id)
  if (res && res.data) {
    groupPricingForm.value.skuLabel = ''
    skuList.value = res.data.skuStockList.map((item: any) => {
      return {
        ...item,
        label: JSON.parse(item.spData).map((sku: any) => `${sku.key}: ${sku.value}`).join('，')
      }
    })
    groupPricingForm.value.productName = product.value[0]?.name
    groupPricingForm.value.productId = product.value[0]?.id
    groupPricingForm.value.price = product.value[0]?.price
    groupPricingForm.value.coverImg = product.value[0]?.coverImg
    groupPricingForm.value.customCategory = product.value[0]?.customCategory
    groupPricingForm.value.platformCategoryName = product.value[0]?.platformCategoryName
  } else {
    ElMessage.warning('选择商品失败，请重新选择')
  }
}

// 选择商品sku
const onSkuChange = (val: any) => {
  const selectedSku: any = skuList.value.find((item: any) => item.label === val)
  if (selectedSku) {
    groupPricingForm.value.price = selectedSku.price
  }
}

// 保存表单
const saveForm = () => {
  const forms: any = unref(groupPricingForms)
  forms.validate(async (valid: Boolean) => {
    if (valid) {
      if (!isEditForm.value) {
        // 新增表格记录
        if (currentType.value === 1) {
          // 人工费
          laborTableData.value.push(groupPricingForm.value)
        } else if (currentType.value === 2) {
          // 主材费
          materialTableData.value.push(groupPricingForm.value)
        } else {
          // 辅材费
          auxiliaryMaterialsTableData.value.push(groupPricingForm.value)
        }
      } else {
        // 编辑表格
        if (currentType.value === 1) {
          // 人工费
          laborTableData.value[currentFormIndex.value] = groupPricingForm.value
        } else if (currentType.value === 2) {
          // 主材费
          materialTableData.value[currentFormIndex.value] = groupPricingForm.value
        } else {
          // 辅材费
          auxiliaryMaterialsTableData.value[currentFormIndex.value] = groupPricingForm.value
        }
      }
      hideFormDialog()
    }
  })
}

// 隐藏表单弹窗
const hideFormDialog = () => {
  currentFormIndex.value = -1
  currentType.value = 0
  skuList.value = []
  groupPricingForm.value = {
    productId: '',
    productCoverPic: '',
    productName: '',
    skuLabel: '',
    price: '',
    quantity: null,
    selfBuy: false,
    remark: '',
    coverImg: '',
    customCategory: '',
    platformCategoryName: ''
  }
  isShowFormDialog.value = false
  isEditForm.value = false
}
</script>

<style lang="less" scoped>

:deep(.el-dialog__body) {
  padding: 0 2rem !important;
}

.dialog-container {
  height: 70vh;
}

.flex-center {
  display: flex;
  align-items: center;
}
</style>
