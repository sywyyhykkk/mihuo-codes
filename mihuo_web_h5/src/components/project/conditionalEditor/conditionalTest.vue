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
        v-if="dialogShow"
        style="
          margin-right: 2rem;
          position: relative;
          height: calc(50vh + 15rem);
        "
        :get-brand-name-type="true"
        @getSelectData="getSelectData"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            @click="handelConfirm"
          >测试表达式</el-button>
          <el-button @click="handelClose">取 消</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="isShowResult"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="表达式结果"
      width="70rem"
      @close="handelClose"
    >
      <div>
        <el-table
          :data="errorResult"
          style="width: 100%"
          stripe
          border
        >
          <el-table-column prop="key" label="表达式" align="center" />
          <el-table-column prop="value" label="结果" align="center">
            <template #default="scope">
              <el-tag
                :type="scope.row.value !== 'false' ? 'success' : 'danger'"
                style="margin-right: 0"
              >{{ scope.row.value !== 'false' ? '通过' : '不通过' }}</el-tag>
            </template></el-table-column>
        </el-table>
      </div>
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
  },
  singleExpressList: {
    type: Object,
    default: {} as any
  }
})
const emit = defineEmits(['update:modelValue', 'getData'])

const ruleForm = ref<any>('')
const dialogShow = ref(props.modelValue)
const state = reactive({
  form: {
    express: props.express,
    projectId: 0,
    singleExpressList: props.singleExpressList
  }
})

const getSelectData = (val: any) => {
  state.form.projectId = val.id
}

const handelConfirm = () => {
  if (!state.form.projectId) ElMessage.error('请选择项目')
  else testExpress()
}

const handelClose = () => {
  emit('update:modelValue', false)
}

const handelResultClose = () => {
  isShowResult.value = false
  errorResult.value = []
}

const isShowResult = ref(false)
const errorResult = ref([] as any)

// //测试表达式
const testExpress = async () => {
  await fetch({
    url: '/order/sopnodeexpressconfig/testExpress',
    method: 'post',
    data: state.form
  }).then((res: any) => {
    if (!res.code) {
      if (res.data.result === 'false') {
        errorResult.value = res.data.singleExpressListResult
        isShowResult.value = true
      } else {
        handelClose()
        ElMessage.success('表达式测试通过')
      }
    }
  })
}
</script>

<style scoped>
:deep(.el-dialog__body) {
  padding: 0 !important;
}
</style>
