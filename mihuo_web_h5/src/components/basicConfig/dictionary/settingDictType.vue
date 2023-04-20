<template>
  <el-dialog
    v-model="dialogVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :title="props.isEdit?'编辑字典类型':'添加字典类型'"
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
      <el-form-item label="类型" prop="type">
        <el-input v-model="state.form.type" />
      </el-form-item>
      <el-form-item label="字典类型" prop="system">
        <el-select
          v-model="state.form.system"
          filterable
          placeholder="请选择订单类型"
        >
          <el-option
            v-for="(item, index) in state.dictionaryList"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="字典描述" prop="description">
        <el-input v-model="state.form.description" maxlength="40" type="textarea" />
      </el-form-item>
      <el-form-item label="备注信息" prop="remarks">
        <el-input v-model="state.form.remarks" maxlength="40" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
          <span class="dialog-footer">
            <el-button
              type="primary"
              :loading="state.loading"
              @click="handleConfirm"
            >保存</el-button>
            <el-button @click="handelClose">取 消</el-button>
          </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>

import { defineEmits, defineProps, reactive, ref, watch, watchEffect } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: {}
  },
  isEdit: {//是否编辑
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue', 'getDta'])

const dialogVisible = ref<boolean>(false)
const ruleForms = ref<any>('')

const state = reactive({
  form: {} as any,
  loading: false,
  dictionaryList: [{
    label: '业务类',
    value: '0'
  }, {
    label: '系统类',
    value: '1'
  }]

})
const rules = reactive({
  system: [{ required: true, message: '请选择字典类型', trigger: 'change' }],
  type: [{ required: true, message: '请输入类型', trigger: 'blur' }]
})

const handleConfirm = () => {
  ruleForms.value.validate((valid: any) => {
    if (valid) {
      if (props.isEdit) {
        editData()
      } else {
        addData()
      }
    }
  })
}
const addData = async () => {
  await fetch({
    url: '/admin/dict',
    method: 'post',
    data: state.form
  }).then((res: any) => {
    if (res.code == '0') {
      ElMessage.success('添加成功')
      handelClose()
      emit('getData')
    }
  })
}
const editData = async () => {
  await fetch({
    url: '/admin/dict',
    method: 'put',
    data: state.form
  }).then((res: any) => {
    if (res.code == '0') {
      ElMessage.success('编辑成功')
      handelClose()
      emit('getData')
    }
  })
}

const handelClose = () => {
  emit('update:modelValue', false)
}


watchEffect(() => {
  dialogVisible.value = props.modelValue
  if (props.isEdit) {
    state.form = props.data
  } else {
    state.form = {}
  }
})

</script>

<style scoped>

</style>
