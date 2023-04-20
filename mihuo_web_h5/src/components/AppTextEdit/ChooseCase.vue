<template>
  <div>
    <el-dialog
      v-model="showVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="handleClose"
      title="选择案列"
      append-to-body
      width="130rem"

    >
      <div style="height:calc(55vh + 15rem);overflow-y: hidden">
        <decorateCase :single="single" style="margin-right: 2rem" @current-change="handleSelectionChange" />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handelConfirm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watchEffect, defineEmits, defineProps, ref, markRaw } from 'vue'
import { getGuid } from '_c/util/utils'
import wsCache from '@/cache'
import { ElMessage } from 'element-plus'


const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue', 'getGeneralMaterial'])
const ruleForms = ref<any>('')
const cityOperatorId = ref(wsCache.get('cityOperator')?.id)
const showVisible = ref<boolean>(false)
const single = ref<boolean>(true)
const selectData = ref<any>({})

const rules = reactive({
  name: [{ required: true, message: '请输入链接名', trigger: 'blur' }]
})

const handleSelectionChange = (val: any) => {
  console.log(val)
  selectData.value = val
}
const handelConfirm = () => {
  if (!selectData.value.id) {
    ElMessage({
      message: '请选择案例',
      type: 'warning'
    })
  } else {
    console.log(selectData.value)
    emit('getGeneralMaterial', selectData.value)
    handleClose()
  }

}
const handleClose = () => {
  showVisible.value = false
  emit('update:modelValue', false)
}

watchEffect(() => {
  showVisible.value = props.modelValue
})
</script>

<style scoped>

</style>
