<template>
  <div>
    <el-dialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="props.isEdit?'编辑项目':'添加项目'"
      width="57rem"
      @close="handelClose"
    >
      <div class="el-dialog-form" :inline="true">
        <el-form
          ref="ruleForms"
          :model="state.form"
          :rules="rules"
          label-width="13rem"
          :scroll-to-error="true"
        >
          <!--          <el-form-item label="项目地址" prop="address">-->
          <!--            <el-input v-model="state.form.address" maxlength="40" />-->
          <!--          </el-form-item>-->
          <el-form-item label="项目地址" prop="latAddress">
            <el-input
              type="text"
              :model-value="`${state.form.latAddress||''}${state.form.poiName||''}`"
              readonly
              @click="pickLocation()"
            />

          </el-form-item>
          <el-form-item label="详细地址" prop="latAddress">
            <el-input
              v-model="state.form.address"
              placeholder="栋-单元-门牌号"
            />
          </el-form-item>
          <el-form-item label="客户编码" prop="customerCode">
            <el-input v-model="state.form.customerCode" style="width: 19rem" />
          </el-form-item>
          <el-form-item label="客户姓名" prop="customerName">
            <el-input
              v-model="state.form.customerName"
              style="width: 19rem"
              maxlength="20"
              :disabled="props.isEdit"
            />
          </el-form-item>
          <el-form-item label="性别" prop="customerGender">
            <el-radio-group
              v-model="state.form.customerGender"
              :disabled="props.isEdit"
              @change="changeGender"
            >
              <el-radio label="2">女</el-radio>
              <el-radio label="1">男</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="联系电话" prop="customerPhone">
            <el-input
              v-model="state.form.customerPhone"
              :disabled="props.isEdit"
              style="width: 19rem"
              type="number"
              :autosize="true"
            />
          </el-form-item>
          <el-form-item label="备用电话">
            <el-input
              v-model="state.form.backupPhone"
              style="width: 19rem"
              type="number"
              :autosize="true"
            />
          </el-form-item>
          <el-form-item label="合同编号" prop="contractCode">
            <el-input v-model="state.form.contractCode" style="width: 19rem" />
          </el-form-item>
          <el-form-item label="合同金额" prop="contractAmount">
            <el-input
              v-model="state.form.contractAmount"
              type="tel"
              style="width: 19rem"
              oninput="value=value.replace(/[^0-9.]/g, '')"
            >
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="合同工期" prop="contractDuration">
            <el-input
              v-model="state.form.contractDuration"
              type="tel"
              oninput="value=value.replace(/[^0-9.]/g, '').replace('.','')"
              style="width: 19rem"
              @input="handelChangeDate"
            >
              <template #append>天</template>
            </el-input>
          </el-form-item>
          <el-form-item label="节假日施工" prop="ignoreGovHoliday">
            <el-radio-group v-model="state.form.ignoreGovHoliday" @change="handelChangeDate">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="周末施工" prop="ignoreWeekend">
            <el-radio-group v-model="state.form.ignoreWeekend" @change="handelChangeDate">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="合同开工日期" prop="contractStartDate">
            <el-date-picker
              v-model="state.form.contractStartDate"
              style="width:19rem"
              value-format="YYYY-MM-DD"
              type="date"
              @change="handelChangeDate"
            />
          </el-form-item>
          <el-form-item label="合同完工日期" prop="contractFinishDate">
            <el-date-picker
              v-model="state.form.contractFinishDate"
              style="width:19rem"
              disabled
              value-format="YYYY-MM-DD"
              type="date"
            />
          </el-form-item>
          <el-form-item label="户型" prop="model">
            <el-select
              v-model="state.form.model"
              filterable
              placeholder="请选择户型"
            >
              <el-option
                v-for="(item, index) in state.modelList"
                :key="index"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="房型" prop="roomType">
            <el-select
              v-model="state.form.roomType"
              filterable
              placeholder="请选择房型"
            >
              <el-option
                v-for="(item, index) in state.roomTypeList"
                :key="index"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="装修方式" prop="way">
            <el-select
              v-model="state.form.way"
              filterable
              placeholder="请选择装修方式"
            >
              <el-option
                v-for="(item, index) in state.wayList"
                :key="index"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="面积" prop="usableArea">
            <el-input
              v-model="state.form.usableArea"
              oninput="value=value.replace(/[^0-9.]/g, '')"
              style="width: 19rem"
            >
              <template #append>m²</template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            :loading="state.loading"
            @click="handleConfirm()"
          >确 定</el-button>
          <el-button @click="handelClose">取 消</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-model="projectDetialType"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :fullscreen="true"
    >
      <projectDetail v-if="projectDetialType" :detial-from="state.detailForm" />
    </el-dialog>
    <!--    <el-dialog-->
    <!--      v-if="state.mapDialogVisible"-->
    <!--      v-model="state.mapDialogVisible"-->
    <!--      :close-on-press-escape="false"-->
    <!--      :close-on-click-modal="true"-->
    <!--      title="地图"-->
    <!--      width="80rem"-->
    <!--    >-->
    <!--      <MapContainer-->
    <!--        v-if="state.mapDialogVisible"-->
    <!--        v-model="state.form"-->
    <!--        @getLocation="getLocation"-->
    <!--      />-->
    <!--    </el-dialog>-->

    <!--    //地图组件-->
    <mapNew v-model="state.mapDialogVisible" v-model:formData="state.form" />
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, watchEffect, ref, reactive, onMounted, watch } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { isPhone } from '@/utils/validate'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }, isEdit: {
    type: Boolean,
    default: false
  },
  projectId: {
    type: String || Number,
    default: ''
  }
})
const emit = defineEmits(['getData', 'update:modelValue'])

const dialogVisible = ref<boolean>(false)
const projectDetialType = ref<boolean>(false)
const ruleForms = ref<any>('')

const state = reactive({
  loading: false,
  form: {
    ignoreGovHoliday: 0,
    ignoreWeekend: 0
  } as any,
  detailForm: {} as any,
  mapDialogVisible: false,
  wayList: [
    { name: '清包' },
    { name: '半包' },
    { name: '全包' },
    { name: '整装' }
  ],
  roomTypeList: [
    { name: '平层' },
    { name: '跃层' },
    { name: '别墅' },
    { name: '复式' }
  ],
  modelList: [
    { name: '一室' },
    { name: '二室' },
    { name: '三室' },
    { name: '四室' },
    { name: '五室以上' }
  ]
})

const handelChangeDate = () => {
  if (state.form.contractStartDate && state.form.contractDuration) getProjectFinishDate()
}
const getProjectFinishDate = async () => {
  await fetch({
    url: '/order/bizproject/projectFinishDate/get',
    method: 'get',
    params: {
      days: state.form.contractDuration,
      ignoreGov: state.form.ignoreGovHoliday,
      ignoreWeekend: state.form.ignoreWeekend,
      startDate: state.form.contractStartDate
    }
  }).then((res: any) => {
    state.form.contractFinishDate = res.data
  })
}
const phoneValidator = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('请输入手机号'))
  } else if (!isPhone(value)) {
    callback(new Error('请输入正确手机号'))
  } else {
    callback()
  }
}

const rules = reactive({
  address: [
    { required: true, message: '请输入项目地址', trigger: 'blur' },
    { min: 0, max: 40, message: '长度不能超过40个字符', trigger: 'blur' }
  ],
  customerName: [
    { required: true, message: '客户姓名必填', trigger: 'blur' },
    { min: 0, max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
  ],
  model: [{ required: true, message: '请选择户型', trigger: 'change' }],
  contractStartDate: [{ required: true, message: '请选择合同开工日期', trigger: 'change' }],
  contractFinishDate: [{ required: true, message: '请选择合同完工日期', trigger: 'change' }],
  contractDuration: [{ required: true, message: '请填写合同工期', trigger: 'change' }],
  roomType: [{ required: true, message: '请选择房型', trigger: 'change' }],
  way: [{ required: true, message: '请选择装修方式', trigger: 'change' }],
  usableArea: [{ required: true, message: '面积必填', trigger: 'blur' }],
  latAddress: [{ required: true, message: '请选择位置信息', trigger: 'blur' }],
  customerGender: [
    { required: true, message: '性别必选', trigger: 'blur' }
  ],
  customerPhone: [
    { required: true, message: '联系电话格式不正确', trigger: 'blur', validator: phoneValidator }
  ]
})

const handleConfirm = () => {
  console.log(state.form)
  state.loading = true
  ruleForms.value.validate((valid: any) => {
    if (valid) {
      if (!props.isEdit) {
        addData()
      }
      if (props.isEdit) {
        editData()
      }
      state.loading = false
    } else {
      state.loading = false
      return false
    }
  })
}
// 点击选择位置
const pickLocation = async () => {
  state.mapDialogVisible = true
}

// const getLocation = (data: any) => {
//   console.log(data)
//   state.mapDialogVisible = false
//   state.form.latitude = data.location.lat
//   state.form.longitude = data.location.lng
//   state.form.latAddress = data.name
//   ruleForms.value.validateField('latAddress', (valid: any) => {
//
//   })
// }
const changeGender = () => {
  ruleForms.value.validateField('customerGender', (valid: any) => {

  })
}
const handelClose = () => {
  dialogVisible.value = false
  emit('update:modelValue', false)
  state.form = {
    poiName: '',
    latAddress: ''
  }
}

// 添加项目
const addData = async () => {
  await fetch({
    url: '/order/bizproject',
    method: 'post',
    data: state.form
  }).then((res: any) => {
    if (res.data) {
      handelClose()
      ElMessage.success('添加成功')
      emit('getData')
    }
  })
}
// 编辑项目
const editData = async () => {
  await fetch({
    url: '/order/bizproject',
    method: 'put',
    data: state.form
  }).then((res: any) => {
    if (res.data) {
      handelClose()
      ElMessage.success('编辑成功')
      emit('getData')
    } else {
      state.loading = false
    }
  })
}
// 编辑时根据项目id查询项目信息
const getProjectById = async () => {
  await fetch({
    url: `/order/bizproject/${props.projectId}`,
    method: 'get'
  }).then((res: any) => {
    state.form = res.data
  })
}

// onMounted(() => {
//   watch(() => props.modelValue, () => {
//     dialogVisible.value = props.modelValue
//     if (dialogVisible.value) {
//       if (props.isEdit) {
//         getProjectById()
//       } else {
//         state.form = {
//           ignoreGovHoliday: 0,
//           ignoreWeekend: 0
//         }
//       }
//     }
//   })
// })

watchEffect(() => {
  dialogVisible.value = props.modelValue
  if (dialogVisible.value) {
    if (props.isEdit) {
      getProjectById()
    } else {
      state.form = {
        ignoreGovHoliday: 0,
        ignoreWeekend: 0
      }
    }
  }
})

</script>

<style scoped>

</style>
