<template>
  <div>
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="导入模板"
      v-model="downloadType"
      width="55rem"
    >
      <el-form ref="ruleForms" :model="state.form" :rules="state.rules" label-width="11rem">
        <el-form-item label="模板名称" prop="templateId">
          <el-select
            v-model="state.form.templateId"
            filterable
            placeholder="请选择模板"
          >
            <el-option
              v-for="(item, index) in state.templateList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker
            v-model="state.form.startDate"
            type="date"
            placeholder="选择日期"
            style="width: 19rem"
          >
          </el-date-picker>
        </el-form-item>
        <!--        <el-form-item label="节假日施工" prop="ignoreGovHoliday">-->
        <!--          <el-radio-group v-model="state.form.ignoreGovHoliday">-->
        <!--            <el-radio :label="0">否</el-radio>-->
        <!--            <el-radio :label="1">是</el-radio>-->
        <!--          </el-radio-group>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="周末施工" prop="ignoreWeekend">-->
        <!--          <el-radio-group v-model="state.form.ignoreWeekend">-->
        <!--            <el-radio :label="0">否</el-radio>-->
        <!--            <el-radio :label="1">是</el-radio>-->
        <!--          </el-radio-group>-->
        <!--        </el-form-item>-->
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" :loading="loading" @click="handleConfirm()"
          >确 定</el-button
          >
          <el-button @click="downloadType = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, reactive, ref, watchEffect, onMounted } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { ElMessage } from 'element-plus'
import { Format } from '@/getDate'

const props = defineProps({
  modelValue: {//状态
    type: Boolean,
    default: false
  }, data: {
    type: Object,
    default: {}
  }
})
const emit = defineEmits(['getProjectData'])
const downloadType = ref(false)
const ruleForms = ref<any>('')
const state = reactive({
  rules: {
    startDate: [
      { required: true, message: '请选择开始日期', trigger: 'blur' }
    ],
    templateId: [{ required: true, message: '请选择模板', trigger: 'blur' }]
  },
  form: {} as any,
  templateList: []
})

const handleConfirm = () => {
  ruleForms.value.validate((valid: any) => {
    if (valid) {
      state.form.startDate = Format(state.form.startDate, 'yyyy-MM-dd')
      addImportTemplate()
    }
  })
}
//导入模板
const addImportTemplate = async () => {
  await fetch({
    url: ` /order/bizproject/soptempalte`,
    method: 'put',
    data: state.form
  }).then((res: any) => {
    if (res.data) {
      ElMessage.success('导入成功')
      downloadType.value = false
      emit('update:modelValue', false)
      emit('getProjectData')
    }
  })
}
//获取项目模板列表
const getTemplateList = async () => {
  await fetch({
    url: ` /order/soptemplate/getList`,
    method: 'get',
    params: {
      showStatus: 0
    }
  }).then((res: any) => {
    state.templateList = res.data
    if (state.templateList.length === 0) {
      ElMessage.warning('您还没创建项目模板')
    }
    if (state.templateList.length > 0) {
      state.templateList.forEach((item: any) => {
        if (item.defaultFlag === 1) {
          state.form.templateId = item.id
        }
      })
      if (!state.form.templateId) {
        ElMessage.warning('您还没创建项目模板')
      }
    }
  })
}

watchEffect(() => {
  downloadType.value = props.modelValue
  state.form = props.data
})
onMounted(() => {
  getTemplateList()
})

</script>

<style scoped>

</style>
