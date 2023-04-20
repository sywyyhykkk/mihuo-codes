<template>
  <div style="height: 50vh">
    <div style="height: 40vh">
      <el-form
        ref="ruleForm"
        :model="dataForm"
        :rules="dataRule"
        label-width="9rem"
      >
        <el-form-item label="描述" prop="description">
          <el-input v-model="dataForm.description" placeholder="描述" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="dataForm.nickName" placeholder="昵称" />
        </el-form-item>
        <el-form-item label="技能" prop="skillName">
          <el-input v-model="dataForm.skillName" placeholder="技能" />
        </el-form-item>
        <el-form-item label="金额" prop="price">
          <el-input v-model="dataForm.price" placeholder="金额" />
        </el-form-item>
        <el-form-item label="页面地址" prop="url">
          <el-input v-model="dataForm.url" placeholder="页面地址" />
        </el-form-item>
        <el-form-item label="是否显示" prop="status">
          <el-select v-model="dataForm.status" placeholder="是否显示">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div style="text-align: center">
      <el-button type="primary" @click="confirm">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { putObj, addObj } from '../util/api/express'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['getData', 'hideDialog'])

const props = defineProps({
  row: {
    type: Object,
    default: () => ({})
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

// 是否为编辑状态
const isEditable = ref<Boolean>(props.isEdit)

const ruleForm = ref<any>('')

const dataRule = {
  nickName: [{ required: true, message: '昵称不能为空', trigger: 'blur' }],
  skillName: [{ required: true, message: '技能不能为空', trigger: 'blur' }],
  price: [{ required: true, message: '金额不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '是否显示不能为空', trigger: 'blur' }],
  description: [{ required: true, message: '描述不能为空', trigger: 'blur' }]
}

const dataForm = reactive({
  description: props.row?.description,
  nickName: props.row?.nickName,
  skillName: props.row?.skillName,
  price: props.row?.price,
  status: props.row?.status || '0',
  url: props.row?.url,
  expressId: props.row?.expressId
})

const options = [
  {
    value: '0',
    label: '显示'
  },
  {
    value: '1',
    label: '不显示'
  }
]

// 表单提交
const confirm = () => {
  ruleForm.value.validate((valid: any) => {
    if (valid) {
      if (isEditable.value) {
        putObj(dataForm)
          .then((data) => {
            if (data) {
              console.log('修改成功')
              // ElMessage.success('编辑成功!')
              emit('getData')
              emit('hideDialog')
            }
          })
          .catch(() => {})
      } else {
        addObj(dataForm)
          .then((data) => {
            if (data) {
              ElMessage.success('添加成功!')
              emit('getData')
              emit('hideDialog')
            }
          })
          .catch(() => {})
      }
    }
  })
}

// 取消
const cancel = () => {
  emit('getData')
  emit('hideDialog')
}
</script>

<style scoped lang="less"></style>
