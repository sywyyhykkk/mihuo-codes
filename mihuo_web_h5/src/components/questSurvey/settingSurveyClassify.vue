<template>
  <div>
    <el-dialog
      v-if="dialogShow"
      v-model="dialogShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      @close="handelClose"
      width="55rem"
      :title="props.isEdit?'编辑分类':'新增分类'">
      <el-form
        ref="ruleForms"
        :rules="rules"
        :model="state.form"
        label-width="11rem"
      >
        <el-form-item label="分类名称" prop="typeName">
          <el-input v-model="state.form.typeName" />
        </el-form-item>
        <el-form-item label="分类描述" prop="typeDesc">
          <el-input v-model="state.form.typeDesc" type="textarea" />
        </el-form-item>
        <el-form-item label="启用" prop="enableFlag">
          <el-switch
            v-model="state.form.enableFlag"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handelConfirm">{{ props.isEdit ? '编辑分类' : '创建分类' }}</el-button>
          <el-button @click="handelClose">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, reactive, ref, watchEffect } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }, data: {
    type: Object,
    default: {}
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['getData'])
const dialogShow = ref<boolean>(false)
const ruleForms = ref<any>('')
const state = reactive({
  form: {} as any
})
const rules = reactive({
  typeName: [{ required: true, message: '请输入分类名称名称', trigger: 'blur' }]
})

const handelConfirm = () => {
  ruleForms.value.validate((valid: boolean) => {
    if (valid) {
      if (props.isEdit) {
        editData()
      } else {
        addData()
      }
    }
  })
}
const handelClose = () => {
  dialogShow.value = false
  emit('update:modelValue', false)
}
const addData = async () => {
  await fetch({
    url: '/basic/surveytype/save',
    method: 'post',
    data: state.form
  }).then((res: any) => {
    if (res.code == '0') {
      ElMessage.success('新增分类成功')
      emit('getData')
      handelClose()
    }
  })
}
const editData = async () => {
  await fetch({
    url: '/basic/surveytype/save',
    method: 'post',
    data: state.form
  }).then((res: any) => {
    if (res.code == '0') {
      ElMessage.success('编辑分类成功')
      emit('getData')
      handelClose()
    }
  })
}

watchEffect(() => {
  dialogShow.value = props.modelValue
  if (props.isEdit) {
    state.form = props.data
  }else{
    state.form = {
      id:'0'
    }
  }
})
</script>

<style scoped>

</style>
