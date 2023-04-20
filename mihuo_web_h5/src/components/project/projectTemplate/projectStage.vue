<template>
  <div>
    <el-dialog
      v-if="dialogShow"
      v-model="dialogShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="54rem"
      title="配置阶段"
      @close="handelClose"
    >
      <div class="c">
        <el-form
          ref="ruleForm"
          :rules="rules"
          :model="state.form"
          label-width="10rem"
        >
          <el-form-item label="阶段名称" prop="name">
            <el-input v-model="state.form.name" />
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input
              v-model="state.form.sort"
              type="number"
              style="width: 19rem"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handelConfirm">确 定</el-button>
          <el-button @click="handelClose">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, defineEmits, defineProps, watchEffect } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { ElMessage } from 'element-plus'

const props = defineProps({
  stageData: {
    type: Object,
    default: {}
  }, modelValue: {
    type: Boolean,
    default: false
  }, isEdit: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['getData'])

const ruleForm = ref<any>('')
const dialogShow = ref(false)
const state = reactive({
  form: {} as any
})
const rules = reactive({
  name: [{ required: true, message: '请输入阶段名称', trigger: 'blur' }]
})

const handelConfirm = () => {
  ruleForm.value.validate((valid: boolean) => {
    if (valid) {
      if (props.isEdit) {
        editData()
      } else {
        addData()
      }
    }
  })
}
//编辑阶段
const editData = async () => {
  await fetch({
    url: `/order/soptemplate/stage/update`,
    method: 'post',
    data: state.form
  }).then((res: any) => {
    if (res.data) {
      ElMessage({
        type: 'success',
        message: `修改阶段成功!`
      })
      handelClose()
      emit('getData')
    }
  })
}

//新增阶段
const addData = async () => {
  await fetch({
    url: '/order/soptemplate/stage/create',
    method: 'post',
    data: state.form
  }).then((res: any) => {
    if (res.data) {
      ElMessage({
        type: 'success',
        message: `新增阶段成功!`
      })
      handelClose()
      emit('getData')
    }
  })
}

const handelClose = () => {
  emit('update:modelValue', false)
}
watchEffect(() => {
  dialogShow.value = props.modelValue
  state.form = props.stageData
})
</script>

<style scoped>

</style>
