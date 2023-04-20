<template>
  <div>
    <el-dialog
      v-if="dialogShow"
      v-model="dialogShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="条件编辑器"
      width="110rem"
      @close="handelClose"
    >
      <!--      <conditionalEditor v-model="state.form" />-->
      <conditionalEditor v-model="state.form" :type="props.type" />
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" :disabled="!state.form.express" @click="handelTest">表达式检测</el-button>
          <el-button type="primary" @click="edionHandel">确 定</el-button>
          <el-button @click="handelClose">取 消</el-button>
        </span>
      </template>
    </el-dialog>
    <!--    //条件检测-->
    <conditionalTest
      v-if="testShow"
      v-model="testShow"
      :express="state.form.express"
      :single-express-list="singleExpressList"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, defineEmits, defineProps, watchEffect, provide } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { ElMessage } from 'element-plus'

const props = defineProps({
  templateId: {
    type: String || Number,
    default: 0
  }, nodeId: {
    type: String || Number,
    default: 0
  }, modelValue: {
    type: Boolean,
    default: false
  }, type: { // 表达式类型：开始条件：type=start 结束条件：type=end 启用条件：type=enable
    type: String,
    default: 'enablel'
  },
  data: {
    type: Object,
    default: () => {}
  }
})
provide('templateId', props.templateId)
const emit = defineEmits(['update:modelValue', 'getData', 'getExpressTranslate'])

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

const singleExpressList = ref([] as any)

// 开启条件检测
const handelTest = () => {
  singleExpressList.value = []
  const arr = JSON.parse(state.form.expressJson)
  arr.forEach((item: any) => {
    if (item.express.trim() !== '且' && item.express.trim() !== '或' && item.express.trim() !== '(' && item.express.trim() !== ')') {
      const obj = {
        key: item.expressTranslate,
        value: item.express
      }
      singleExpressList.value.push(obj)
    }
  })
  testShow.value = true
}

// 设置启用条件
const edionHandel = async () => {
  emit('getExpressTranslate', props.type, state.form)
  handelClose()
  // return
  // await fetch({
  //   url: '/order/sopnodeexpressconfig/saveOrUpdateExpress',
  //   method: 'post',
  //   data: state.form
  // }).then((res: any) => {
  //   if (res.code == '0') {
  //     emit('getExpressTranslate', props.type, state.form)
  //     handelClose()
  //     ElMessage.success('条件设置成功')
  //   }
  // })
}

const handelClose = () => {
  emit('update:modelValue', false)
}

watchEffect(() => {
  if (props.modelValue) {
    state.form = {
      express: props.data?.express || '',
      expressMacro: props.data?.expressMacro || '',
      expressVar: props.data?.expressVar || '',
      id: props.data?.id || 0,
      templateId: props.templateId,
      templateNodeId: props.nodeId,
      type: props.type,
      expressTranslate: props.data?.expressTranslate || '',
      expressJson: props.data?.expressJson || ''
    }
    dialogShow.value = props.modelValue
  } else {
    dialogShow.value = false
  }
})

</script>

<style scoped>

</style>
