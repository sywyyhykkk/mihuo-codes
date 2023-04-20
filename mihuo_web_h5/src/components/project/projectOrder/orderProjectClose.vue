<template>
  <div>
    <el-dialog
      v-model="dialogShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :append-to-body="true"
      :title="props.type === '1' ? '关闭订单' : '终止服务'"
      @close="handelClose"
    >
      <el-form ref="ruleForms" :model="state.form" label-width="9rem">
        <el-form-item
          :label="props.type === '1' ? '关闭理由' : '终止理由'"
          prop="templateId"
        >
          <el-input v-model="state.form.reason" type="textarea" />
        </el-form-item>
        <el-form-item
          v-if="props.type === '2'"
          label="预结算金额"
          prop="amount"
        >
          <el-input v-model="state.form.amount" type="number" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" :loading="loading" @click="handleConfirm()"
            >保存</el-button
          >
          <el-button @click="handelClose">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { fetch } from '_@/axios-config/axios'
import {
  defineEmits,
  defineProps,
  reactive,
  ref,
  watchEffect,
  onMounted,
  watch
} from 'vue'
import { ElMessage } from 'element-plus'
import wsCache from '@/cache'

const props = defineProps({
  modelValue: {
    // 状态
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: () => {
      return {}
    }
  },
  // type=1 关闭订单 type=2 终止合作
  type: {
    type: String,
    default: '1'
  }
})

const emit = defineEmits(['getSendOrderList', 'update:modelValue'])
const dialogShow = ref<boolean>(false)
const state = reactive({
  form: {} as any
})

const handelClose = () => {
  state.form = {}
  emit('update:modelValue', false)
}

const handleConfirm = async () => {
  console.log(props.data)
  if (props.type === '1') {
    // 关闭订单
    if (!state.form.reason) {
      ElMessage.warning('请输入关闭理由')
      return
    }
    fetch({
      url: '/order/biz_order/cancel',
      method: 'post',
      data: {
        id: props.data.id,
        reason: state.form.reason
      }
    }).then((res: any) => {
      if (res.data) {
        ElMessage.success('订单已关闭')
        handelClose()
        emit('getSendOrderList', 1) // 1查询关闭的订单
      }
    })
  } else {
    // 终止合作
    if (!state.form.reason) {
      ElMessage.warning('请输入终止服务理由')
      return
    }
    if (!state.form.amount) {
      ElMessage.warning('请输入预结算金额')
      return
    }
    if (
      props.data.payAmount &&
      Number(state.form.amount) >
        Number(props.data.payAmount || state.form.price)
    ) {
      ElMessage.warning('预结算金额不能大于订单金额')
      return
    }
    const dataObj = {
      orderId: props.data.constructionOrderId || props.data.id, // 施工单ID
      amount: state.form.amount,
      remark: state.form.reason
    }
    fetch({
      url: '/order/bizproject/substitutionPerson',
      method: 'post',
      data: dataObj
    }).then((res: any) => {
      if (res.data) {
        ElMessage.success('订单已终止合作')
        handelClose()
        emit('getSendOrderList', 1) // 1查询关闭的订单
      }
    })
  }
}

watch(
  () => state.form.amount,
  () => {
    state.form.amount = state.form.amount
      ? state.form.amount.replace(/[^0-9.]/g, '')
      : null
  }
)

watchEffect(() => {
  dialogShow.value = props.modelValue
})
</script>

<style scoped lang="less">
</style>
