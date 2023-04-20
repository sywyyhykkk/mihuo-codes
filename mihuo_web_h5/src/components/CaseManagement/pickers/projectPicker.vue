<template>
  <div>
    <el-dialog
      v-model="isShow"
      width="75vw"
      destroy-on-close
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="关联项目"
      @close="hideDialog"
    >
      <projectIndex prot-type="3" :is-readonly="true" @projectPicked="handleProjectPicked" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue', 'projectPicked'])
const isShow = ref(false)

const hideDialog = () => {
  isShow.value = false
  emit('update:modelValue', false)
}

const handleProjectPicked = (row: any) => {
  isShow.value = false
  emit('projectPicked', row)
  emit('update:modelValue', false)
}

watchEffect(() => {
  isShow.value = props.modelValue
})
</script>

<style lang="less" scoped>
:deep(.el-dialog__body){
  max-height: none !important
}
</style>
