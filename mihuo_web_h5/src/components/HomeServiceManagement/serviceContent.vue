<template>
  <div>
    <el-button type="primary" @click="addNewContent">
      新增服务内容
    </el-button>
    <div class="main-container">
      <el-card
        class="box-card flex-center"
        :style="{ justifyContent: serviceContents.length ? 'flex-start' : 'center' }"
        shadow="never"
      >
        <div
          v-for="(item, index) in serviceContents"
          :key="index"
          class="card-item"
        >
          <el-button
            type="text"
            class="primary"
            icon="edit"
            @click="editServiceContent(item, index)"
          >编辑
          </el-button>
          <el-button
            type="text"
            class="danger"
            icon="delete"
            @click="deleteServiceContent(index)"
          >删除
          </el-button>
          <el-form disabled>
            <el-form-item label="名称">
              <el-input
                v-model="item.name"
              />
            </el-form-item>
            <el-form-item label="说明">
              <el-input
                v-model="item.des"
                type="textarea"
                :rows="5"
              />
            </el-form-item>
          </el-form>
        </div>
        <el-empty v-if="!serviceContents.length" description="暂无服务内容" />
      </el-card>
      <div />
    </div>
    <el-dialog
      v-model="isShowContentDialog"
      destroy-on-close
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="`${isEditContent ? '编辑' : '新增' }服务内容`"
      @close="hideDialog"
    >
      <el-form
        ref="serviceContentFormRef"
        :model="serviceContentForm"
        :rules="serviceContentFormRules"
        label-width="8rem"
      >
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="serviceContentForm.name"
            placeholder="请输入名称"
          />
        </el-form-item>
        <el-form-item label="说明" prop="des">
          <el-input
            v-model="serviceContentForm.des"
            placeholder="请输入说明"
            type="textarea"
            autosize
          />
        </el-form-item>
        <el-form-item label="内容页" prop="content">
          <AppTextEdit v-model="serviceContentForm.content" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="padding: 2rem">
          <el-button type="primary" @click="saveContentDialog">保存</el-button>
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
  modelValue: any
}>()

const emit = defineEmits<{(e: 'update:modelValue', serviceList: any): void
}>()

const serviceContents = ref(props.modelValue || [])
// 服务内容表单
const serviceContentForm = ref({
  name: '',
  des: '',
  content: '[]'
})
const serviceContentFormRef = ref(null)

// 是否显示新增服务内容弹窗
const isShowContentDialog = ref(false)
// 是否编辑服务内容
const isEditContent = ref(false)
// 当前编辑的index
const currentIndex = ref(-1)

// 新增服务内容
const addNewContent = () => {
  isShowContentDialog.value = true
  isEditContent.value = false
}

// 隐藏弹窗
const hideDialog = () => {
  emit('update:modelValue', serviceContents.value)
  isShowContentDialog.value = false
  currentIndex.value = -1
  isEditContent.value = false
  serviceContentForm.value = {
    name: '',
    des: '',
    content: '[]'
  }
}

// 保存弹窗
const saveContentDialog = () => {
  const forms: any = unref(serviceContentFormRef)
  forms.validate(async (valid: any) => {
    if (valid) {
      if (isEditContent.value) {
        serviceContents.value[currentIndex.value] = serviceContentForm.value
      } else {
        serviceContents.value.push(serviceContentForm.value)
      }
      hideDialog()
    }
  })
}

// 编辑服务内容
const editServiceContent = (item: any, index: number) => {
  serviceContentForm.value = Object.assign({}, item)
  isEditContent.value = true
  isShowContentDialog.value = true
  currentIndex.value = index
}

// 删除服务内容
const deleteServiceContent = (index: number) => {
  ElMessageBox.confirm(`确定删除该服务内容吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    serviceContents.value.splice(index, 1)
    hideDialog()
  }).catch(e => {})
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
