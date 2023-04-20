<template>
  <div>
    <el-dialog
      v-if="dialogShow"
      v-model="dialogShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="编辑节点"
      width="56rem"
      @close="handelClose"
    >
      <el-form
        ref="ruleForms"
        :model="state.form"
        :rules="rules"
        label-width="12rem"
      >
        <el-form-item label="节点名称" prop="nodeName">
          <el-input v-model="state.form.nodeName" maxlength="40" />
        </el-form-item>
        <el-form-item label="计划开始日期" prop="expectStartTime">
          <el-date-picker v-model="state.form.expectStartTime" value-format="YYYY-MM-DD" type="date" />
        </el-form-item>
        <el-form-item label="计划完成日期" prop="expectFinishTime">
          <el-date-picker v-model="state.form.expectFinishTime" value-format="YYYY-MM-DD" type="date" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="saveProjectNode">
            编辑节点
          </el-button>
          <el-button @click="handelClose">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>

import { defineEmits, defineProps, ref, watchEffect, reactive } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  nodeData: {
    type: Object,
    default: {}
  }
})
const emit = defineEmits(['getData', 'update:nodeData'])

const ruleForms = ref<any>('')
const dialogShow = ref<boolean>(false)

const state = reactive({
  form: {
    nodeId: props.nodeData.nodeId,
    expectFinishTime: props.nodeData.expectFinishTime,
    expectStartTime: props.nodeData.expectStartTime,
    nodeName: props.nodeData.nodeName
  } as any
})
const rules = reactive({
  expectFinishTime: [{ required: true, message: '请选择计划完工时间', trigger: 'blur' }],
  expectStartTime: [{ required: true, message: '请选择计划开始时间', trigger: 'blur' }],
  nodeName: [{ required: true, message: '请输入节点名称', trigger: 'blur' }]
})
const handelClose = () => {
  dialogShow.value = false
  emit('update:modelValue', false)
}

const saveProjectNode = () => {
  ruleForms.value.validate((valid: boolean) => {
    if (valid) {
      editProjectNode()
    }
  })
}

//编辑项目节点
const editProjectNode = async () => {
  await fetch({
    url: '/order/bizproject/projectnode/modify',
    method: 'post',
    data: state.form
  }).then((res: any) => {
    if (res.code == '0') {
      ElMessage.success('编辑节点成功')
      handelClose()
      emit('getData')
      emit('update:nodeData', { ...props.nodeData, ...state.form })
    }
  })
}

watchEffect(() => {
  dialogShow.value = props.modelValue
  // if(dialogShow.value){
  //   console.log(props.data)
  // }

})
</script>

<style scoped>

</style>
