<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="终止理由"
      @close="handelClose"
      width="54rem"
    >
      <el-form
        ref="ruleForms"
        :model="form"
        :rules="rules"
        label-width="10rem"
        :scrollToError="true"
      >

        <el-form-item label="需求描述" prop="address">
          <el-input v-model="form.address" maxlength="40" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
          <span class="dialog-footer">
            <el-button
              type="primary"
              :loading="state.loading"
              @click="handleConfirm(title)"
            >保存</el-button>
            <el-button @click="handelClose">取 消</el-button>
          </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>

import { defineEmits, defineProps, ref, onMounted, watchEffect, reactive, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue'])

const dialogVisible = ref<boolean>(false)
const ruleForms = ref<any>('')

const form = reactive<any>({})
const state = reactive({
  loading: false

})

const handleConfirm = () => {

}

const handelClose = () => {
  emit('update:modelValue', false)
}

watchEffect(() => {
  dialogVisible.value = props.modelValue
})
</script>

<style scoped lang="less">
@import "../orderTable";

</style>
