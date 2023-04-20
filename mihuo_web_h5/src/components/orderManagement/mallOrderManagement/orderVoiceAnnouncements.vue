<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="title"
      width="54rem"
      @close="handelClose"
    >
      <el-form
        ref="ruleForms"
        :model="state.form"
        :rules="rules"
        label-width="10rem"
        :scroll-to-error="true"
      >
        <el-form-item label="播报内容" prop="requirementDesc">
          <span>{{ state.form.tex }}</span>
        </el-form-item>
        <el-form-item label="范围设置" prop="expectDuration">
          <el-radio-group v-model="state.form.distance">
            <el-radio :label="5">常住地≤5km</el-radio>
            <el-radio :label="10">常住地≤10km</el-radio>
            <el-radio :label="15">常住地≤15km</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="自定义" prop="expectDuration">
          <el-input
            v-model="state.form.distance"
            type="number"
            @input="changeInput"
          >
            <template #append>km</template>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            :loading="state.loading"
            @click="handleConfirm(title)"
            >推 送</el-button
          >
          <el-button @click="handelClose">取 消</el-button>
        </span>
      </template>
    </el-dialog>
    <!--    找人接单-->
    <orderSelectPerson
      v-model="showOrderSelectPerson"
      :data="state.dataForm"
      @saveData="saveData"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  defineEmits,
  defineProps,
  ref,
  onMounted,
  watchEffect,
  reactive,
  watch
} from 'vue'
import { fetch } from '_@/axios-config/axios'
import { ElMessage } from 'element-plus'
import { sysjobsList } from '_@/api/basicConfig'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  dataForm: {
    type: Object,
    default: {}
  },
  type: {
    // 表单类型
    type: String,
    default: '指派'
  }
})
const emit = defineEmits(['update:modelValue', 'getData'])

const dialogVisible = ref<boolean>(false)
const title = ref<string>('语音播报')
const showOrderSelectPerson = ref<boolean>(false)
const loading = ref<boolean>(false)
const ruleForms = ref<any>('')

const state = reactive({
  dataForm: {} as any,
  form: props.dataForm,
  loading: false,
  priceWayList: [
    { label: '一口价', value: 1 },
    { label: '议价', value: 2 }
  ],
  orderStatusList: [
    { label: '企业抢单', value: 2 },
    { label: '外部抢单', value: 3 }
  ]
})
const rules = reactive({
  expectDate: []
})
// 得到播报内容
const getVoiceTitle = () => {
  fetch({
    url: '/order/biz_order/voice/template',
    method: 'get',
    params: { orderId: Number(state.form.id) }
  })
    .then((res: any) => {
      if (res.code == '0') {
        state.form.tex = res.data
      }
    })
    .finally(() => {
      loading.value = false
    })
}

const handleConfirm = () => {
  saveData({})
}

const saveData = async (row: any) => {
  if (!state.form.distance) {
    ElMessage.warning('请填写播报距离')
    return
  }

  await fetch({
    url: `/order/biz_order/voice/play?distance=${Number(
      state.form.distance
    )}&orderId=${Number(state.form.id)}`,
    method: 'post'
  })
    .then((res: any) => {
      if (res.code == '0') {
        ElMessage.success(`播报推送成功`)
        handelClose()
      }
    })
    .finally(() => {
      loading.value = false
    })
}

const handelClose = () => {
  emit('update:modelValue', false)
}
const changeInput = () => {
  const pattern = /^[1-9][0-9]*$/
  if (!pattern.test(state.form.distance)) {
    if (Math.ceil(state.form.distance)) {
      state.form.distance = Math.ceil(state.form.distance)
    } else {
      state.form.distance = ''
    }
  }
}

watchEffect(() => {
  dialogVisible.value = props.modelValue
  state.form = props.dataForm
  props.modelValue && getVoiceTitle()
})
</script>

<style scoped lang="less">
@import '../orderTable';
</style>
