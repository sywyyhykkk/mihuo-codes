<template>
  <div>
    <el-dialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="props.title"
      width="60rem"
      @close="handelClose"
    >
      <el-form
        ref="ruleForms"
        :model="state.form"
        :rules="rules"
        label-width="12rem"
        :scroll-to-error="true"
      >
        <el-form-item label="指派方式" prop="assignType">
          <el-select v-model="state.form.assignType" placeholder="指派方式" disabled>
            <el-option
              v-for="item in assignTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="定价方式" prop="priceWay">
          <el-select v-model="state.form.priceWay" placeholder="定价方式">
            <el-option
              v-for="item in priceWayList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="期望上门日期" prop="expectDate">
          <el-date-picker
            v-model="state.form.expectDate"
            type="date"
            placeholder="期望上门日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="期望工期" prop="expectDuration">
          <el-input
            v-model="state.form.expectDuration"
            placeholder="期望工期"
            type="number"
          >
            <template #append>
              <span>天</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="期望价格" prop="price">
          <el-input
            v-model="state.form.price"
            placeholder="期望价格"
            type="number"
          />
        </el-form-item>
        <el-form-item label="需求名称22" prop="requirementName">
          <el-input
            v-model="state.form.requirementName"
            placeholder="需求名称"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="需求描述" prop="requirementDesc">
          <el-input
            v-model="state.form.requirementDesc"
            type="textarea"
            placeholder="需求描述"
          />
        </el-form-item>
        <el-form-item label="需求类型" prop="requirementType">
          <el-select v-model="state.form.requirementType" placeholder="需求类型">
            <el-option
              v-for="item in requirementTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="岗位" prop="skillId">
          <el-select v-model="state.form.skillId" placeholder="岗位" @change="changeSkill">
            <el-option
              v-for="item in skillList"
              :key="item.skillId"
              :label="item.skillName"
              :value="item.skillId"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="state.form.assignType == 1" label="指派人员" prop="assignPersonId">
          <el-input
            v-model="state.form.name"
            placeholder="指派人员"
            disabled
          >
            <template #append>
              <el-button icon="user" @click="showOrder" />
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            :loading="state.loading"
            @click="handleConfirm()"
          >确定</el-button>
          <el-button @click="handelClose">取 消</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 找人接单 -->
    <orderSelectPerson
      v-model="showOrderSelectPerson"
      :data="curData"
      @saveData="selectPerson"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  defineEmits,
  defineProps,
  ref,
  onMounted,
  watchEffect,
  reactive,
  watch
} from 'vue'
import { fetch } from '_@/axios-config/axios'
import { ElMessage } from 'element-plus'
import { assignTypeList, requirementTypeList, priceWayList } from './allOrder'
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  orderData: {
    type: Object,
    default: {}
  },
  title: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update:modelValue', 'getData'])
const dialogVisible = ref<boolean>(false)
const showOrderSelectPerson = ref<boolean>(false)
const ruleForms = ref<any>('')
const skillList = ref([])
const curData = ref({
  skillId: props.orderData.skillId,
  jobCode: props.orderData.jobCode
})
const state = reactive({
  form: props.orderData
} as any)
const rules = reactive({
  expectDate: [
    { required: true, message: '请选择希望上门日期', trigger: 'blur' }
  ],
  requirementName: [
    { required: true, message: '请填写需求名称', trigger: 'blur' }
  ],
  skillId: [
    { required: true, message: '请选择岗位', trigger: 'blur' }
  ],
  assignPersonId: [
    { required: true, message: '请选择指派人员', trigger: 'blur' }
  ]
})

const handleConfirm = () => {
  ruleForms.value.validate((valid: any) => {
    if (valid) {
      saveData()
    }
  })
}
const showOrder = () => {
  const jobCode = skillList.value.find((item:any) => item.skillId == curData.value.skillId)
  if (jobCode && jobCode == 'JOB_DEFAULT') {
    return
  }
  showOrderSelectPerson.value = true
}

onMounted(() => {
  getSkill()
})

const getSkill = async () => {
  fetch({
    url: '/admin/sysjobskill/getPlatformJobSkill',
    method: 'get',
    data: state.form
  }).then((res: any) => {
    if (res.code == '0') {
      if (state.form.assignType == 1) {
        skillList.value = res.data.filter((item:any) => item.jobCode != 'JOB_DEFAULT')
      } else {
        skillList.value = res.data
      }
    }
  })
}
const saveData = async () => {
  fetch({
    url: '/order/biz_order/publishRequirementOrder',
    method: 'post',
    data: state.form
  }).then((res: any) => {
    if (res.code == '0') {
      ElMessage.success(`发布成功`)
      handelClose()
      emit('getData')
    }
  })
}

const handelClose = () => {
  state.form = {}
  emit('update:modelValue', false)
}
// 岗位变动
const changeSkill = (data:any) => {
  const skillType: any = skillList.value.find((item: any) => item.skillId === data)
  state.form.requirementName = state.form.poiName + '需要' + skillType.skillName
  curData.value.skillId = data
}

const selectPerson = (data:any) => {
  state.form.assignPersonId = data?.personId
  state.form.name = data?.name
  showOrderSelectPerson.value = false
}

watchEffect(() => {
  dialogVisible.value = props.modelValue
})
</script>

<style scoped lang="less">
</style>
