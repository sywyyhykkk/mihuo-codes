<template>
  <div>
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :append-to-body="true"
      :title="state.dialogTitle"
      v-model="dialogShow"
      @close="handelClose"
    >
      <el-form ref="ruleForms" :model="props.type==='start'?state.form:state.endForm" :rules="rules">
        <!-- <div v-if="props.type!=='start'">
         <el-form-item label="开始日期" prop="endDate">
            <el-date-picker style="width:19rem" @change="handelChangeDate" v-model="state.endForm.endDate"
                            value-format="YYYY-MM-DD" type="date" />
          </el-form-item>
          <el-form-item label="完成日期" prop="startDate">
            <el-date-picker style="width:19rem" @change="handelChangeDate" v-model="state.endForm.startDate"
                            value-format="YYYY-MM-DD" type="date" />
          </el-form-item>
        </div> -->
        <div v-if="props.type==='start'">
          <el-form-item label="备注" prop="startRemark" label-width="9rem">
            <el-input type="textarea" v-model="state.form.startRemark"></el-input>
          </el-form-item>
          <el-form-item label="图片" label-width="9rem">
            <uploadImage
              v-model="state.startImgs"
              :max-count="9"
              :is-edits="isEdit"
            />
          </el-form-item>
        </div>

        <div v-else>
          <el-form-item label="备注" prop="finishRemark" label-width="9rem">
            <el-input type="textarea" v-model="state.endForm.finishRemark"></el-input>
          </el-form-item>
          <el-form-item label="图片" label-width="9rem">
            <uploadImage
              v-model="state.completeImgs"
              :max-count="9"
              :is-edits="isEdit"
            />
          </el-form-item>
        </div>
      </el-form>

       <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" :loading="loading" @click="handleConfirm">提交</el-button>
            <el-button @click="handelClose">取 消</el-button>
          </span>
        </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { async } from '@antv/x6/lib/registry/marker/main'
import { defineEmits, defineProps, reactive, ref, watchEffect, onMounted,inject } from 'vue'
import { ElMessage } from 'element-plus'
import { fetch } from '_@/axios-config/axios'

const { proxy } = getCurrentInstance() as any
const props = defineProps({
  modelValue: {//状态
    type: Boolean,
    default: false
  }, data: {
    type: Object,
    default: {}
  },type: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update:modelValue','getData'])
const ruleForms = ref<any>('')
const dialogShow = ref<boolean>(false)
const rules = reactive({
  startRemark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
  finishRemark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
})
const state = reactive({
  projectId:inject('projectId'),
  dialogTitle: '',
  startImgs: '',
  completeImgs: '',
  form: {
    nodeId: props.data.nodeId,
		projectId: 0,
		startAttachments: [],
		
		startRemark: ''
  } as any,
  endForm: {
		nodeId: props.data.nodeId,
		projectId: 0,
		finishRemark: '',
		finishAttachments: [],
		
   
	} as any
})

const handleConfirm = () => {
  ruleForms.value.validate(async (valid: any) => {
    if (valid) {
      saveForm()
    }
  })
}

const saveForm = async() => {
  let list = [] as any
    if(props.type==='start'){//开始
      state.startImgs.split(',').map((item:any) =>{
        list.push({
          type:'img',
          url: item
        })
      })
      state.form.startAttachments = list
      state.form.projectId = state.projectId
      await fetch({
        url: `/order/project/projectNode/start`,
        method: 'post',
        data: state.form
      }).then((res: any) => {
        if (res.data) {
          handelClose()
          ElMessage.success('操作成功')
          state.form = {}
          state.startImgs = ''
          emit('getData')
        }
      })
    }else{//结束
      state.completeImgs.split(',').map((item:any) =>{
        list.push({
          type:'img',
          url: item
        })
      })
      state.endForm.finishAttachments = list
      state.endForm.projectId = state.projectId
      await fetch({
        url: '/order/project/projectNode/complete',
        method: 'post',
        data: state.endForm
      }).then((res: any) => {
        if (res.data) {
          handelClose()
          ElMessage.success('操作成功')
          state.endForm = {}
          state.completeImgs = ''
          emit('getData')
        }
      })
    }
}

const handelClose = () => {
  emit('update:modelValue', false)
}

watchEffect(() => {
  dialogShow.value = props.modelValue
  state.dialogTitle = props.type==='start'?'开始（' + props.data.nodeName + '）':'完成（' + props.data.nodeName + '）'
})


</script>

<style scoped lang="less">


</style>
