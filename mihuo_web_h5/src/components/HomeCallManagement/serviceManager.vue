<template>
  <div>
    <el-dialog
      v-if="isShow"
      v-model="isShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="props.isEdit === true ? '编辑明星管家' : '新增明星管家'"
      width="30%"
      @close="closeDialog"
    >
      <div style="height: 45vh;">
        <el-form
          ref="rulesForm"
          :model="managerForm"
          :rules="formRules"
          label-width="10rem"
        >
          <el-form-item label="管家名称" prop="managerName">
            <el-input v-model="managerForm.managerName" placeholder="请输入管家名称" />
          </el-form-item>
          <el-form-item label="管家等级" prop="managerLevel">
            <el-input v-model="managerForm.managerLevel" placeholder="请输入管家等级" />
          </el-form-item>
          <el-form-item label="管家手机号" prop="managerPhone">
            <el-input v-model="managerForm.managerPhone" type="number" placeholder="请输入管家手机号" />
          </el-form-item>
          <el-form-item label="管家头像" prop="managerAvatar">
            <upload-image v-model="managerForm.managerAvatar" :max-count="1" :is-edits="true" />
          </el-form-item>
          <el-form-item label="案例数量" prop="caseNum">
            <el-input v-model="managerForm.caseNum" type="number" placeholder="请输入案例数量" />
          </el-form-item>
          <el-form-item label="服务次数" prop="serviceNum">
            <el-input v-model="managerForm.serviceNum" type="number" placeholder="请输入管家服务次数" />
          </el-form-item>
          <el-form-item label="管家好评率" prop="rate">
            <el-input v-model="managerForm.rate" type="number" placeholder="请输入管家好评率">
              <template #append>%</template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            v-preventRepeatClick
            type="primary"
            @click="saveDialog"
          >保存</el-button>
          <el-button @click="closeDialog">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps<{
  modelValue: boolean;
  isEdit: boolean;
  managerData: any;
}>()
const emit = defineEmits<{(event: 'update:modelValue', value: boolean): void;
  (event: 'save', type: string, data: any): void;
}>()

watch(
  () => props.modelValue,
  (newValue, oldValue) => {
    isShow.value = props.modelValue
  }
)

const isShow = ref(props.modelValue)

const formRules = ref({
  managerName: [
    { required: true, message: '请输入管家名称', trigger: 'blur' }
  ],
  managerPhone: [
    { required: true, message: '请输入管家手机号', trigger: 'blur' }
  ],
  managerAvatar: [
    { required: true, message: '请上传管家头像', trigger: 'blur' }
  ],
  managerLevel: [
    { required: true, message: '请输入管家等级', trigger: 'blur' }
  ],
  caseNum: [
    { required: true, message: '请输入案例数', trigger: 'blur' }
  ],
  serviceNum: [
    { required: true, message: '请输入服务数', trigger: 'blur' }
  ],
  rate: [
    { required: true, message: '请输入好评率', trigger: 'blur' }
  ]
})

const managerForm = ref(props.isEdit ? props.managerData : {
  managerName: '', // 管家名称
  managerLevel: '', // 管家等级
  managerPhone: '', // 管家电话
  managerAvatar: '', // 管家头像
  caseNum: null, // 案例数
  serviceNum: null, // 服务数
  rate: null // 好评率
})

const rulesForm = ref(null)

// 保存弹窗
const saveDialog = () => {
  const forms: any = unref(rulesForm)
  forms.validate((valid: boolean) => {
    if (valid) {
      emit('save', '管家', managerForm.value)
      closeDialog()
    }
  })
}

// 关闭弹窗
const closeDialog = () => {
  managerForm.value = {
    managerName: '', // 管家名称
    managerLevel: '', // 管家等级
    managerPhone: '', // 管家电话
    managerAvatar: '', // 管家头像
    caseNum: null, // 案例数
    serviceNum: null, // 服务数
    rate: null // 好评率
  }
  emit('update:modelValue', false)
}
</script>

<style lang="less" scoped>

</style>
