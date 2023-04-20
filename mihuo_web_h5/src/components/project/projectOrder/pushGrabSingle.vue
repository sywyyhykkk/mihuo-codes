<template>
  <div>
    <el-dialog
      v-model="showDialog"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="发布抢单"
      width="56rem"
      @close="handelClose"
    >
      <el-form
        ref="ruleForms"
        :disabled="isDisabled"
        :model="state.form"
        :rules="rules"
        label-width="12rem"
      >

        <el-form-item label="订单类型" prop="publishType">
          <el-select
            v-model="state.form.publishType"
            filterable
            placeholder="请选择订单类型"
          >
            <el-option
              v-for="(item, index) in state.orderStatusList"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="计价类型" prop="priceWay">
          <el-select
            v-model="state.form.priceWay"
            filterable
            placeholder="请选择计价类型"
          >
            <el-option
              v-for="(item, index) in state.priceWayList"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="报价" prop="price">
          <el-input
            v-model="state.form.price"
            style="width: 19rem"
            type="tel"
            oninput="value=value.replace(/[^0-9.]/g, '')"
          >
            <template #append>元</template>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="danger" class="" @click="handleConfirm">发布抢单</el-button>
          <el-button @click="handelClose">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, watchEffect, ref, reactive, watch, inject } from 'vue'
import getDate from '@/getDate'
import { fetch } from '_@/axios-config/axios'
import { ElMessage } from 'element-plus'
import wsCache from '@/cache'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: () => {
      return {}
    }
  },
  projectId: {
    type: String || Number,
    default: 0
  },
  orderSkillId: {
    type: String || Number,
    default: 0
  }
})
const emit = defineEmits(['getSendOrderList', 'update:modelValue'])

// 当前查看的项目
const project = ref(wsCache.get('projectDetail'))

const isDisabled = ref(false)

onMounted(() => {
  checkOrderType()
})

// 如果project.source=2(呼叫订单生成) 或 source=3(商城订单生成) 不允许修改 tfs #27888
const checkOrderType = async () => {
  if (+project.value.source === 2 || +project.value.source === 3) {
    isDisabled.value = true
    // project.source=2(呼叫订单生成) 或 source=3(商城订单生成) 订单类型为外部抢单，计价类型为一口价
    state.form.priceWay = 1
    state.form.publishType = 3
    await fetch({
      url: '/order/project/createPublisherGroupPrice',
      method: 'get',
      params: {
        projectId: project.value.id,
        skillId: props.orderSkillId
      }
    }).then((res: any) => {
      if (res.data) {
        if (res.data.length === 0) {
          // 为0时说明还未开单 订单价格为0
          state.form.price = 0
        } else {
          state.form.price = res.data.reduce((pre: any, next: { totalPrice: any; }) => {
            return pre + next.totalPrice
          }, 0)
        }
      }
    })
  } else {
    isDisabled.value = false
  }
}

const showDialog = ref<boolean>(true)
const ruleForms = ref<any>('')
const state = reactive({
  form: { 
    publishType:3
  } as any,
  priceWayList: [{ label: '一口价', value: 1 }, { label: '议价', value: 2 }],
  // 现在只有外部抢单 [{ label: '企业抢单', value: 2 }, { label: '外部抢单', value: 3 }]
  orderStatusList: [{ label: '外部抢单', value: 3 }]
})
const rules = reactive({
  priceWay: [{ required: true, message: '请选择计价类型', trigger: 'change' }],
  publishType: [{ required: true, message: '请选择订单类型', trigger: 'change' }]
  // price: [{ required: true, message: '请输入报价,且报价大于零', trigger: 'change' }]
})

const handelClose = () => {
  emit('update:modelValue', false)
}

const handleConfirm = () => {
  ruleForms.value.validate((valid: any) => {
    if (valid) {
      saveOrder()
    }
  })
}

// 保存订单
const saveOrder = async () => {
  state.form = {
    publishType: state.form.publishType, // 订单类型
    personId: 0, // 创建人id
    assignType: 2, // 指派方式1，直接指派，2抢单
    assignPersonId: 0, // 被派人员id
    assignPersonName: '', // 被派人员name
    expectDuration: props.data.expectDuration || 0,
    nodeId: props.data.nodeId,
    price: state.form.price,
    priceWay: state.form.priceWay, // 定价方式1一口价,2议价
    projectId: props.projectId,
    referencePrice: state.form.referencePrice, // 参考价格
    requirementDesc: props.data.requirementDesc,
    expectDate: getDate.Format(props.data.expectDate || new Date(), 'yyyy-MM-dd')// 期望工期
  }
  await fetch({
    url: '/order/project/assign',
    method: 'post',
    data: state.form
  }).then((res: any) => {
    if (res.data) {
      ElMessage.success('派单成功')
      handelClose()
      emit('getSendOrderList')
    }
  })
}

watchEffect(() => {
  showDialog.value = props.modelValue
  if (showDialog.value) {
    state.form.price = state.form.price || props.data.price || 0
  }
})

</script>

<style scoped lang="less">

</style>
