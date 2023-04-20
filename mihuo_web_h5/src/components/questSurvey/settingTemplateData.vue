<template>
  <div>
    <el-dialog
      v-if="dialogShow"
      v-model="dialogShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      @close="handelClose"
      :title="props.isEdit?'编辑问卷':'新增问卷'">
      <el-form
        ref="ruleForms"
        :rules="rules"
        :model="state.form"
        label-width="9rem"
      >
        <el-form-item label="模板名称" prop="surveyName">
          <el-input v-model="state.form.surveyName" />
        </el-form-item>
        <el-form-item label="所属分类" prop="surveyTypeId">
          <el-select
            v-model="state.form.surveyTypeId"
            placeholder="请选择所属分类"
            clearable
          >
            <div v-for="(item,index) in state.surveyTypeList" :key="item.index">
              <el-option
                :label="item.typeName"
                :value="item.id"
              />
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="模板描述" prop="surveyDesc">
          <el-input v-model="state.form.surveyDesc" type="textarea" />
        </el-form-item>
        <el-form-item label="启用" prop="enableFlag">
          <el-switch
            v-model="state.form.enableFlag"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handelConfirm">{{ props.isEdit ? '编辑问卷' : '创建问卷' }}</el-button>
          <el-button @click="handelClose">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, reactive, ref, watchEffect } from 'vue'
import { surveyTemplateAdd, surveyTemplateUpdate } from '_@/api/basicConfig'
import { ElMessage } from 'element-plus'
import { fetch } from '_@/axios-config/axios'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }, data: {
    type: Object,
    default: {}
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['getData'])
const dialogShow = ref<boolean>(false)
const ruleForms = ref<any>('')
const state = reactive({
  surveyTypeList: [],
  form: {
    surveyTypeId: '',
    surveyName: '',
    surveyDesc: '',
    enableFlag: 0
  } as any
})
const rules = reactive({
  surveyName: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
  surveyTypeId: [{ required: true, message: '请选择所属分类', trigger: 'blur' }]

})

const handelConfirm = () => {
  ruleForms.value.validate((valid: boolean) => {
    if (valid) {
      if (props.isEdit) {
        editData()
      } else {
        addData()
      }
    }
  })
}
const handelClose = () => {
  dialogShow.value = false
  emit('update:modelValue', false)
}
const addData = async () => {
  surveyTemplateAdd(state.form).then((res: any) => {
    if (res.code == '0') {
      ElMessage({
        type: 'success',
        message: `新增问卷模板成功!`
      })
      emit('getData')
      handelClose()
    }
  })
}
const editData = async () => {
  surveyTemplateUpdate(state.form).then((res: any) => {
    if (res.code == 0) {
      ElMessage({
        type: 'success',
        message: `修改问卷模板成功!`
      })
      emit('getData')
      handelClose()
    }
  })
}

//查询全部启用的分类
const getEnableTypeList = async () => {
  await fetch({
    url: '/basic/surveytype/enable/list',
    method: 'get'
  }).then((res: any) => {
    state.surveyTypeList = res.data
  })
}

watchEffect(() => {
  dialogShow.value = props.modelValue
  if (dialogShow.value) {
    getEnableTypeList()
  }
  if (props.isEdit) {
    state.form = props.data
  } else {
    state.form = {
      surveyTypeId: '',
      surveyName: '',
      surveyDesc: '',
      enableFlag: 0
    }
  }
})
</script>

<style scoped>

</style>
