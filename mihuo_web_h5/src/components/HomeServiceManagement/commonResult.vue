<template>
  <div>
    <el-button type="primary" @click="addNewItem">
      新增{{ props.type === 1 ? '交付成果' : '常见问题' }}
    </el-button>
    <div class="main-container">
      <el-card
        class="box-card flex-center"
        :style="{ justifyContent: commonList.length ? 'flex-start' : 'center' }"
        shadow="never"
      >
        <div
          v-for="(item, index) in commonList"
          :key="index"
          class="box-card flex-center"
        >
          <el-button
            type="text"
            class="primary"
            icon="edit"
            @click="editCommonItem(item, index)"
          >编辑
          </el-button>
          <el-button
            type="text"
            class="danger"
            icon="delete"
            @click="deleteCommonItem(index)"
          >删除
          </el-button>
          <el-form disabled>
            <el-form-item :label="props.type === 1 ? '名称' : '问题' ">
              <el-input
                v-model="item.name"
              />
            </el-form-item>
            <el-form-item v-if="props.type === 1" label="图标">
              <uploadImage
                v-model="item.icon"
                disabled
                :max-count="1"
                :is-edits="false"
              />
            </el-form-item>
            <el-form-item v-if="props.type !== 1" label="答案">
              <el-input
                v-model="item.value"
              />
            </el-form-item>
          </el-form>
        </div>
        <el-empty v-if="!commonList.length" :description="`暂无${props.type === 1 ? '交付成果' : '常见问题'}`" />
      </el-card>
    </div>
    <el-dialog
      v-model="isShowDialog"
      destroy-on-close
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="`${isEdit ? '编辑' : '新增' }${props.type === 1 ? '交付成果' : '常见问题'}`"
      @close="hideDialog"
    >
      <el-form
        ref="commonFormRef"
        :model="commonForm"
        :rules="serviceContentFormRules"
        label-width="8rem"
      >
        <el-form-item :label="props.type === 1 ? '名称' : '问题'" prop="name">
          <el-input
            v-model="commonForm.name"
            :placeholder="`请输入${props.type === 1 ? '交付名称' : '常见问题'}`"
          />
        </el-form-item>
        <el-form-item v-if="props.type === 1" label="图标" prop="icon">
          <uploadImage
            v-model="commonForm.icon"
            :max-count="1"
            :is-edits="true"
          />
        </el-form-item>
        <el-form-item v-if="props.type === 2" label="答案" prop="value">
          <el-input
            v-model="commonForm.value"
            type="textarea"
            autosize
            placeholder="请输入答案"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="padding: 2rem">
          <el-button type="primary" @click="saveDialog">保存</el-button>
          <el-button @click="hideDialog">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { serviceContentFormRules } from '_c/HomeServiceManagement/data'
import { ElMessageBox } from 'element-plus/es'

const props = defineProps<{
  modelValue: any,
  type: number
}>()

const emit = defineEmits<{(e: 'update:modelValue', serviceList: any): void
}>()

const commonList = ref(props.modelValue || [])
// 交付成果/常见问题表单
const commonForm = ref({
  name: '',
  value: '',
  icon: ''
})
const commonFormRef = ref(null)

// 当前编辑的表单
const currentIndex = ref(-1)
const isShowDialog = ref(false)
const isEdit = ref(false)

// 新增交付成果/常见问题
const addNewItem = () => {
  isEdit.value = false
  isShowDialog.value = true
}
// 隐藏弹窗
const hideDialog = () => {
  emit('update:modelValue', commonList.value)
  isShowDialog.value = false
  isEdit.value = false
  commonForm.value = {
    name: '',
    value: '',
    icon: ''
  }
}

// 编辑交付成果/常见问题
const editCommonItem = (item: any, index: number) => {
  isShowDialog.value = true
  isEdit.value = true
  currentIndex.value = index
  commonForm.value = Object.assign({}, item)
}

// 删除交付成果/常见问题
const deleteCommonItem = (index: number) => {
  ElMessageBox.confirm(`确定删除该服务内容吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    commonList.value.splice(index, 1)
    hideDialog()
  }).catch(e => {})
}

// 保存弹窗
const saveDialog = () => {
  const forms: any = unref(commonFormRef)
  forms.validate(async (valid: boolean) => {
    if (valid) {
      if (isEdit.value) {
        // 编辑
        commonList.value[currentIndex.value] = commonForm.value
      } else {
        // 新增
        commonList.value.push(commonForm.value)
      }
      hideDialog()
    }
  })
}
</script>

<style lang="less" scoped>
.main-container {
  width: 100%;
  padding: 1rem 0;

  .box-card {
    width: 90%;
    height: max-content;
    border: .1rem solid #a8a8a8;
    padding: 1rem;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;

    .card-item {
      width: 20rem;
      height: max-content;
      padding: 1rem;
      border: .1rem solid #a8a8a8;
    }
  }
}

.flex-center {
  display: flex;
  align-items: center;
}
</style>
