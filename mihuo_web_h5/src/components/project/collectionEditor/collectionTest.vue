<template>
  <div>
    <el-dialog
      v-model="dialogShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="选择项目"
      width="140rem"
      @close="handelClose"
    >
      <projectIndex
        style="
          margin-right: 2rem;
          position: relative;
          height: calc(50vh + 15rem);
        "
        @getSelectData="getSelectData"
        v-if="dialogShow"
        :getBrandNameType="true"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handelConfirm"
            >测试表达式</el-button
          >
          <el-button @click="handelClose">取 消</el-button>
        </span>
      </template>
    </el-dialog>
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
  express: {
    type: String,
    default: ''
  },
  modelValue: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue', 'getData'])

const ruleForm = ref<any>('')
const dialogShow = ref(props.modelValue)
const state = reactive({
  form: {
    express: props.express,
    projectId: 0
  }
})

const getSelectData = (val: any) => {
  console.log(val)
  state.form.projectId = val.id
}

const handelConfirm = () => {
  if (!state.form.projectId) ElMessage.error('请选择项目')
  else testExpress()
}

const handelClose = () => {
  emit('update:modelValue', false)
}

// //测试表达式
const testExpress = async () => {
  await fetch({
    url: '/order/sopnodeexpressconfig/testExpress',
    method: 'post',
    data: state.form
  }).then((res: any) => {
    if (!res.code) {
      handelClose()
      if (typeof res.data.result != 'number') {
        ElMessage.success(res.data.result ? '表达式测试通过' : '456')
      } else {
        ElMessage.success(
          res.data.errorList.length
            ? JSON.stringify(res.data.errorList)
            : res.data.result + ''
        )
      }
    }
  })
}
</script>

<style scoped>
</style>
