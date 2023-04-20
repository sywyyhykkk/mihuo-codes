<template>
  <div>
    <el-dialog
      v-if="dialogShow"
      v-model="dialogShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="变量计算"
      width="110rem"
      @close="handelClose"
    >
      <!--      <conditionalEditor v-model="state.form" />-->
      <collectionEditor v-model="state.form" :type="props.type" />
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            :disabled="!state.form.express"
            @click="handelTest"
            >表达式检测</el-button
          >
          <el-button type="primary" @click="edionHandel">确 定</el-button>
          <el-button @click="handelClose">取 消</el-button>
        </span>
      </template>
    </el-dialog>
    <!--    //条件检测-->
    <collectionTest
      v-model="testShow"
      v-if="testShow"
      :express="state.form.express"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  reactive,
  onMounted,
  defineEmits,
  defineProps,
  watchEffect
} from 'vue'
import { fetch } from '_@/axios-config/axios'
import { ElMessage } from 'element-plus'

const props = defineProps({
  templateId: {
    type: String || Number,
    default: 0
  },
  nodeId: {
    type: String || Number,
    default: 0
  },
  modelValue: {
    type: Boolean,
    default: false
  },
  type: {
    //表达式类型：开始条件：type=start 结束条件：type=end 启用条件：type=enable
    type: String,
    default: 'enablel'
  }
})
const emit = defineEmits([
  'update:modelValue',
  'getData',
  'getCollectionShowTranslate'
])

const ruleForm = ref<any>('')
const dialogShow = ref(false)
const testShow = ref(false)
const state = reactive({
  form: {
    express: '',
    expressMacro: '',
    expressVar: '',
    id: 0,
    templateId: props.templateId,
    templateNodeId: props.nodeId,
    expressTranslate: '',
    type: '',
    expressJson: ''
  } as any
})

//开启条件检测
const handelTest = () => {
  testShow.value = true
}
//设置启用条件
const edionHandel = async () => {
  console.log(state.form)
  // return
  await fetch({
    url: '/order/sopnodeexpressconfig/saveOrUpdateExpress',
    method: 'post',
    data: state.form
  }).then((res: any) => {
    if (res.code == '0') {
      emit(
        'getCollectionShowTranslate',
        props.type,
        state.form.expressTranslate
      )
      handelClose()
      ElMessage.success('收款计算式设置成功')
    }
  })
}

const handelClose = () => {
  emit('update:modelValue', false)
}
watchEffect(() => {
  if (props.modelValue) {
    state.form = {
      express: '',
      expressMacro: '',
      expressVar: '',
      id: 0,
      templateId: props.templateId,
      templateNodeId: props.nodeId,
      type: props.type,
      expressTranslate: '',
      expressJson: ''
    }
    dialogShow.value = props.modelValue
  } else {
    dialogShow.value = false
  }
})
</script>

<style scoped>
</style>
