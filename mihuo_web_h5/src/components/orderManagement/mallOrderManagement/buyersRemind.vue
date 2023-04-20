<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="type?'给买家的提醒':'关闭订单'"
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
        <el-form-item :label="type?'内容':'关闭理由'" prop="content">
          <el-input type="textarea" v-model="state.form.content" />
        </el-form-item>
      </el-form>
      <template #footer>
          <span class="dialog-footer">
            <el-button
              type="primary"
              :loading="state.loading"
              @click="handleConfirm()"
            >确定</el-button>
            <el-button @click="handelClose">取 消</el-button>
          </span>
      </template>
    </el-dialog>
  </div>
</template>


<script lang="ts" setup>

import { defineEmits, defineProps, ref, onMounted, watchEffect, reactive, watch } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  dataForm: {
    type: Object,
    default: {}
  }, type: {//是否买家的提醒,true买家提醒，false关闭订单
    type: Boolean,
    default: true
  },
  orderId: {
    type: String || Number,
    default: ''
  }
})
const emit = defineEmits(['update:modelValue', 'getData'])

const dialogVisible = ref<boolean>(false)
const type = ref<boolean>(true)
const ruleForms = ref<any>('')

const state = reactive({
  form: {} as any
})
const rules = reactive({
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
})

const handleConfirm = () => {
  ruleForms.value.validate((valid: any) => {
    if (valid) {
      if (props.type) {
        saveData()
      } else {
        closeOrder()
      }

    }
  })
  //
}

//关闭订单
const closeOrder = async () => {
  await fetch({
    url: '/mall/order/close',
    method: 'post',
    params: {
      ids: props.orderId,
      note: state.form.content
    }
  }).then((res: any) => {
    if (res.code == '0') {
      ElMessage.success(`订单关闭成功`)
      handelClose()
      emit('getData')
    }
  })
}

//新增提醒内容
const saveData = async () => {
  await fetch({
    url: '/mall/order/trends/add',
    method: 'post',
    data: state.form
  }).then((res: any) => {
    if (res.code == '0') {
      ElMessage.success(`提醒成功`)
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
  if (dialogVisible.value) {
    type.value = props.type
    state.form.orderId = props.orderId
    state.form.content = ''
  }
})
</script>

<style scoped lang="less">


</style>
