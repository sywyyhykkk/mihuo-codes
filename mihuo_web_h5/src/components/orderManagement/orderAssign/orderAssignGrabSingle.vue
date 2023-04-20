<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="title"
      width="54rem"
      @close="handelClose"
    >
      <el-form
        ref="ruleForms"
        :model="state.form"
        :rules="rules"
        label-width="10rem"
        :scroll-to-error="true"
      >
        <div v-if="state.dataForm.receiverDetailAddress" class="position-info">
          <div class="info-heda">
            <el-icon size="1.6rem" color="#303133">
              <Location />
            </el-icon>
            <div class="info-address">
              {{ state.dataForm.receiverRegion
              }}{{ state.dataForm.receiverLatAddress
              }}{{ state.dataForm.receiverPoiName }}（{{
                state.dataForm.receiverProvince
              }}{{ state.dataForm.receiverCity }}）
            </div>
          </div>
          <div class="info-person">
            {{ state.dataForm.receiverName }} {{ state.dataForm.receiverPhone }}
          </div>
        </div>
        <el-form-item label="需求名称" prop="requirementDesc">
          <el-input
            v-model="state.form.requirementDesc"
            maxlength="40"
            type="text"
          />
        </el-form-item>
        <el-form-item label="上门时间" prop="expectDate">
          <el-date-picker
            v-model="state.form.expectDate"
            type="date"
            value-format="YYYY-MM-DD"
            style="width: 19rem"
          />
        </el-form-item>
        <el-form-item label="预计工期" prop="expectDuration">
          <el-input
            v-model="state.form.expectDuration"
            style="width: 19rem"
            type="tel"
            oninput="value=value.replace(/[^0-9.]/g, '').replace('.','')"
          >
            <template #append>天</template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="title === '指派'" label="预估费用" prop="price">
          <el-input
            v-model="state.form.price"
            disabled
            style="width: 19rem"
            type="number"
            oninput="value=value.replace(/[^0-9.]/g, '')"
          >
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item
          v-if="title === '抢单'"
          label="订单类型"
          prop="publishType"
        >
          <el-select
            v-model="state.form.publishType"
            disabled
            filterable
            placeholder="请选择订单类型"
          >
            <el-option
              v-for="(item, index) in state.orderStatusList"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="title === '抢单'" label="计价类型" prop="priceWay">
          <el-select
            v-model="state.form.priceWay"
            disabled
            filterable
            placeholder="请选择计价类型"
          >
            <el-option
              v-for="(item, index) in state.priceWayList"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="title === '抢单'" label="报价" prop="price">
          <el-input
            v-model="state.form.price"
            disabled
            style="width: 19rem"
            type="number"
            oninput="value=value.replace(/[^0-9.]/g, '')"
          >
            <template #append>元</template>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            v-if="title === '抢单'"
            type="danger"
            :loading="loading"
            class=""
            @click="handleConfirm(title)"
          >发布抢单</el-button>
          <el-button
            v-if="title === '指派'"
            type="primary"
            :loading="state.loading"
            @click="handleConfirm(title)"
          >找人接单</el-button>
          <el-button @click="handelClose">取 消</el-button>
        </span>
      </template>
    </el-dialog>
    <!--    找人接单-->
    <orderSelectPerson
      v-model="showOrderSelectPerson"
      :data="state.dataForm"
      @saveData="saveData"
    />
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, ref, watchEffect, reactive } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { ElMessage } from 'element-plus'
import { sysjobsList } from '_@/api/basicConfig'
import { async } from '@antv/x6/lib/registry/marker/main'
import { on } from '@/utils/dom-utils'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  dataForm: {
    type: Object,
    default: {}
  },
  type: {
    // 表单类型
    type: String,
    default: '指派'
  }
})
const emit = defineEmits(['update:modelValue', 'getData'])

const dialogVisible = ref<boolean>(false)
const title = ref<string>('')
const showOrderSelectPerson = ref<boolean>(false)
const loading = ref<boolean>(false)
const ruleForms = ref<any>('')

const state = reactive({
  dataForm: {} as any,
  form: {} as any,
  loading: false,
  priceWayList: [
    { label: '一口价', value: 1 },
    { label: '议价', value: 2 }
  ],
  orderStatusList: [
    { label: '企业抢单', value: 2 },
    { label: '外部抢单', value: 3 }
  ]
})

const rules = reactive({
  expectDate: [
    { required: true, message: '请选择期望上门日期', trigger: 'change' }
  ],
  expectDuration: [
    { required: true, message: '请输入期望工期', trigger: 'blur' }
  ],
  price: [{ required: true, message: '请输入期望价格', trigger: 'blur' }],
  priceWay: [{ required: true, message: '请选择计价类型', trigger: 'change' }],
  publishType: [
    { required: true, message: '请选择订单类型', trigger: 'change' }
  ],
  requirementDesc: [
    { required: true, message: '请输入需求描述', trigger: 'change' }
  ]
})

const handleConfirm = () => {
  ruleForms.value.validate((valid: any) => {
    if (valid) {
      state.form.orderItemSn =
        state.dataForm.orderItemSn || state.dataForm.orderSn
      if (props.type === '指派') {
        state.form.assignType = 1
        showOrderSelectPerson.value = true
        console.log(state.dataForm)
      }
      if (props.type === '抢单') {
        state.form.assignType = 2
        loading.value = true
        saveData({})
      }
    }
  })
}
const getOrderDetail = async () => {
  await fetch({
    url: `/mall/order/detail/${props.dataForm.id}`,
    method: 'get'
  })
    .then((res: any) => {
      if (res.code == '0') {
        state.dataForm = res.data
        state.dataForm.skillId = state.dataForm.skillType
          ? state.dataForm.skillType
          : state.dataForm.skillId

        sysjobsList({}).then((res) => {
          let serviceName: any = ''
          let serviceskillName: any = ''
          res.data.some((item: any) => {
            if (item.skillId === state.dataForm.skillId) {
              serviceskillName = item.skillName
              if (item.jobCode === 'JOB_WORKER') {
                serviceName = '施工'
              } else {
                serviceName = '服务'
              }
              return
            }
          })
          state.form.requirementDesc =
            state.dataForm.receiverRegion +
            state.dataForm.receiverDetailAddress +
            '需要' +
            serviceskillName +
            serviceName
        })
        state.form.price = state.dataForm.payAmount
        if (props.type === '抢单') {
          state.form.publishType = 3
          state.form.priceWay = 1
        }
      }
    })
    .finally(() => {
      loading.value = false
    })
}

const saveData = async (row: any) => {
  if (state.form.assignType == 1) {
    state.form.assignPersonId = row.personId
    state.form.assignPersonName = row.name
    state.form.priceWay = 1
    state.form.publishType = 2
  }
  state.form.orderId = state.dataForm.id

  await fetch({
    url: '/mall/order/assign',
    method: 'post',
    data: state.form
  })
    .then((res: any) => {
      if (res.code == '0') {
        showOrderSelectPerson.value = false
        ElMessage.success(`${props.type}发布成功`)
        handelClose()
        emit('getData')
      }
    })
    .finally(() => {
      loading.value = false
    })
}

const handelClose = () => {
  emit('update:modelValue', false)
}

watchEffect(() => {
  dialogVisible.value = props.modelValue
  if (dialogVisible.value) {
    state.form = {}
    title.value = props.type
    getOrderDetail()
  }
})
</script>

<style scoped lang="less">
@import '../orderTable';
</style>
