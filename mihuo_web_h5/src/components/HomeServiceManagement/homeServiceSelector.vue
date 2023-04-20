<template>
  <div>
    <el-dialog
      v-if="isShow"
      v-model="isShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="新增首页服务"
      @close="closeDialog"
    >
      <el-form>
        <el-form-item label="首页服务">
          <el-select
            v-model="serviceValue"
            placeholder="请选择首页服务"
            @change="changeService"
          >
            <el-option
              v-for="item in optionsList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="padding: 2rem">
          <el-button type="primary" @click="saveDialog">保存</el-button>
          <el-button @click="closeDialog">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  serviceListOptions: any[],
  modelValue: boolean,
}>()

const emit = defineEmits<{(event: 'close'): void, (event: 'save', newService: any, serviceValue: string): any}>()

const optionsList = ref(props.serviceListOptions)
const newService = ref<any>({})
const serviceValue = ref('')
const isShow = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newValue) => {
    isShow.value = newValue
  }
)

const changeService = (data: any) => {
  const find = optionsList.value.find((item: any) => item.code === data)
  if (find) {
    newService.value = find
  }
}

const saveDialog = () => {
  if (!serviceValue.value) {
    ElMessage.warning('请选择首页服务')
    return
  }
  emit('save', newService.value, serviceValue.value)
  closeDialog()
}

const closeDialog = () => {
  emit('close')
}
</script>

<style lang="less" scoped>

</style>
