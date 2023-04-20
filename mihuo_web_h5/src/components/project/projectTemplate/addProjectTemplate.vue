<template>
  <el-dialog
    v-model="addTemplateShow"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    title="配置模板"
    top="8rem"
    @close="handelClose"
  >
    <div class="c">
      <el-form
        ref="templateFormRef"
        :rules="rules"
        :model="state.templateForm"
        label-width="9rem"
      >
        <el-form-item label="模板名称" prop="name">
          <el-input v-model="state.templateForm.name" />
        </el-form-item>
        <el-form-item label="岗位标识" prop="jobCode">
          <el-select v-model="state.templateForm.jobCode" placeholder="请选择岗位标识">
            <el-option
              v-for="item in jobCodeList"
              :key="item"
              :label="item.name"
              :value="item.jobCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="启用" prop="showStatus">
          <el-switch
            v-model="state.templateForm.showStatus"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="saveTemplate">确 定</el-button>
          <el-button @click="handelCloseData">取 消</el-button>
        </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits, watchEffect, reactive, unref } from 'vue'
import { templateCreate, templateUpdate } from '_@/api/basicConfig'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }, data: {
    type: Object,
    default: {}
  }, isEdit: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue', 'getData', 'handelClose'])

const addTemplateShow = ref<any>(false)
const templateFormRef = ref<any>('')
const state = reactive<any>({
  templateForm: {
    showStatus: 1,
    parentId: 0,
    name: '',
    jobCode: '',
  }
})
const rules = reactive({
  name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
  jobCode: [{ required: true, message: '请选择岗位标识', trigger: 'blur' }],
})
const jobCodeList = ref([
  {
    name:"项目管家",
    jobCode:"JOB_MANAGER"
  },
  {
    name:"设计师",
    jobCode:"JOB_DESIGNER"
  },
  {
    name:"项目监理",
    jobCode:"JOB_SUPERVISION"
  },
  {
    name:"工人",
    jobCode:"JOB_WORKER"
  },
])
const saveTemplate = (typeName: any) => {
  templateFormRef.value.validate((valid: boolean) => {
    if (valid) {
      if (props.isEdit) {
        templateUpdate({
          ...state.templateForm
        }).then((res) => {
          if (res.data) {
            ElMessage({
              type: 'success',
              message: `修改模板成功!`
            })
            handelClose()
            emit('getData')
          }
        })
      } else {
        templateCreate(state.templateForm).then((res) => {
          if (res.data) {
            ElMessage({
              type: 'success',
              message: `新增模板成功!`
            })
            handelClose()
            emit('getData')
          }
        })
      }
    }
  })
}
const handelClose = () => {
  emit('update:modelValue', false)
}
const handelCloseData = () => {
  emit('update:modelValue', false)
  if (!props.isEdit) {
    emit('handelClose')
  }
}
watchEffect(() => {
  addTemplateShow.value = props.modelValue
  if (props.isEdit) {
    state.templateForm = props.data
  }
})

</script>

<style scoped>

</style>
