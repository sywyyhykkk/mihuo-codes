<template>
  <div>
    <el-dialog
      v-if="isShow"
      v-model="isShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="props.isEdit === true ? '编辑服务阶段' : '新增服务阶段'"
      width="30%"
      @close="closeDialog"
    >
      <div style="height: max-content; max-height: 50vh;">
        <el-form
          ref="rulesForm"
          :model="stageForm"
          :rules="formRules"
          label-width="8rem"
        >
          <el-form-item label="阶段名称" prop="stageName">
            <el-input v-model="stageForm.stageName" placeholder="请输入阶段名称" />
          </el-form-item>
          <el-form-item label="阶段描述" prop="des">
            <el-input
              v-model="stageForm.des"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 5 }"
              placeholder="请输入阶段描述"
            />
          </el-form-item>
        </el-form>
        <el-button @click="addProduct">关联商品({{ stageForm.products.length }})</el-button>
        <div class="product-container">
          <div
            v-for="(product, pIndex) in stageForm.products"
            :key="pIndex"
            class="product-item flex-center"
          >
            <el-image
              preview-teleported
              :src="$getUrl.getPicUrl(product.coverImg, true, true)"
              class="item-image"
            />
            <div style="text-align: center; margin-top: 1rem"> {{ product.name }} </div>
            <el-button
              type="text"
              class="danger"
              icon="delete"
              style="margin-left: 0 !important;"
              @click="deleteProduct(pIndex)"
            >取消关联
            </el-button>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            v-preventRepeatClick
            type="primary"
            @click="saveDialog"
          >确定</el-button>
          <el-button @click="closeDialog">取消</el-button>
        </span>
      </template>
    </el-dialog>
    <ChooseProduct
      v-model="isShowProduct"
      :single="false"
      :product-type="0"
      @getGeneralMaterial="onSelectProduct"
    />
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps<{
  modelValue: boolean;
  isEdit: boolean;
  stageData: any;
}>()
const emit = defineEmits<{(event: 'update:modelValue', value: boolean): void;
  (event: 'save', type: string, data: any): void;
}>()

watch(
  () => props.modelValue,
  (newValue, oldValue) => {
    isShow.value = props.modelValue
  }
)

const isShow = ref(props.modelValue)

const stageForm = ref(props.isEdit ? props.stageData : {
  stageName: '', // 阶段名称
  products: [] as any, // 关联商品
  des: '' // 阶段描述
})

const formRules = ref({
  stageName: [
    { required: true, message: '请输入服务阶段名称', trigger: 'blur' }
  ]
})

const rulesForm = ref(null)

// 保存弹窗
const saveDialog = () => {
  const forms: any = unref(rulesForm)
  forms.validate((valid: boolean) => {
    if (valid) {
      emit('save', '阶段', stageForm.value)
      closeDialog()
    }
  })
}

// 关闭弹窗
const closeDialog = () => {
  isShow.value = false
  stageForm.value = {
    stageName: '', // 阶段名称
    products: [] as any, // 关联商品
    des: '' // 阶段描述
  }
  emit('update:modelValue', false)
}

// 是否显示选择商品弹窗
const isShowProduct = ref(false)

// 关联商品
const addProduct = () => {
  isShowProduct.value = true
}

// 选择商品回调
const onSelectProduct = async (data: any) => {
  // 过滤掉已关联的商品
  const filterData = data.value[0].filter((item: any) => {
    return !stageForm.value.products.some((product: any) => product.id === item.id)
  })
  stageForm.value.products.push(...filterData)
}

// 删除商品
const deleteProduct = (index: number) => {
  ElMessageBox.confirm('确认从当前阶段中取消关联该商品?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    stageForm.value.products.splice(index, 1)
  })
}
</script>

<style lang="less" scoped>
.product-container {
  padding: .1rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2rem;

  .product-item{
    flex-direction: column;

    .item-image {
      width: 14rem;
      height: 14rem;
      border-radius: 1rem;
    }
  }
}

.flex-center {
  display: flex;
  align-items: center;
}
</style>
