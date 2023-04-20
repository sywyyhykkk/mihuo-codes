<template>
  <div>
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      v-model="auditVisible"
      title="审核"
      width="35rem"
      @close="handleClose"
    >
      <el-form ref="auditFormRef" :model="auditForm" label-width="11rem">
        <el-form-item label="是否通过">
          <el-radio-group v-model="auditForm.verifyStatus">
            <el-radio :label="1" size="large">审核通过</el-radio>
            <el-radio :label="2" size="large">审核未通过</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="原因" prop="content">
          <el-input type="text" v-model="auditForm.verifyReason" />
          <div style="margin-top: 10px">
            <uploadImage
              v-model="auditForm.verifyAnnex"
              :max-count="6"
              :is-edits="true"
            />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="auditVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirm()">确 认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  reactive,
  watchEffect,
  defineEmits,
  defineProps,
  ref,
  markRaw,
  watch
} from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  rowData: {
    type: Object,
    default: () => {}
  }
})
const emit = defineEmits(['update:modelValue', 'submitForm'])
const ruleForms = ref<any>('')
const auditVisible = ref<boolean>(false)
const auditForm = ref<any>({ verifyStatus: 1 })

const confirm = () => {
  emit('submitForm', auditForm.value)
}

const handleClose = () => {
  emit('update:modelValue', false)
}

watchEffect(() => {
  auditVisible.value = props.modelValue
  if (props.modelValue) {
    auditForm.value.verifyStatus = props.rowData.verifyStatus ? props.rowData.verifyStatus : 1 //未审核的时候为0，所以这里给个默认通过的值
    auditForm.value.verifyReason = props.rowData.verifyReason
    auditForm.value.verifyAnnex = props.rowData.verifyAnnex
  }else{
      auditForm.value = {}
  }
})
</script>
