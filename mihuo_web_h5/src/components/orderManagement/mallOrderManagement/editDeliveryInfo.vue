<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="修改收货信息"
      width="55rem"
      @close="handelClose"
    >
      <el-form
        ref="ruleForms"
        :model="state.form"
        :rules="rules"
        label-width="10rem"
        :scroll-to-error="true"
      >
        <el-form-item label="联系人" prop="receiverName">
          <el-input v-model="state.form.receiverName" type="text" />
        </el-form-item>
        <el-form-item label="联系电话" prop="receiverPhone">
          <el-input v-model="state.form.receiverPhone" type="tel" />
        </el-form-item>
        <el-form-item label="收货地址" prop="projectAddress">
          <el-input v-model="state.form.projectAddress" readonly placeholder="请选择收货地址">
            <template #append>
              <el-button icon="LocationInformation" @click="selectAddress" />
            </template>
          </el-input>
        </el-form-item>
        <!-- <el-select
            v-model="state.form.receiverProvince"
            placeholder="省"
            style="width: calc(50% - 3.5rem)"
            @change="handelChangeProvince"
          >
            <el-option
              v-for="item in state.provinceList"
              :key="item.agencyId"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
          <span style="width: 1.5rem; text-align: center">-</span>
          <el-cascader
            style="width: calc(50% - 2rem)"
            v-model="state.form.receiverRegionn"
            :options="state.regionTree"
            :props="state.props"
            placeholder="市(区/县)"
            @change="handelChangeCity"
          /> -->
        <el-form-item prop="receiverDetailAddress" label="详细信息">
          <el-input
            v-model="state.form.receiverDetailAddress"
            type="textarea"
            placeholder="详细地址"
          />
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
    <!-- 修改地址 -->
    <mapNew v-model="state.mapDialogVisible" v-model:formData="state.formData" @newAddress="newAddress" />
  </div>
</template>

<script lang="ts" setup>

import { defineEmits, defineProps, ref, onMounted, watchEffect, reactive, watch } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: {}
  }
})
const emit = defineEmits(['update:modelValue', 'getData'])

const dialogVisible = ref<boolean>(false)
const ruleForms = ref<any>('')

const state = reactive({
  form: {} as any,
  formData: {} as any,
  provinceList: [],
  regionTree: [],
  props: {
    label: 'name',
    value: 'name'
  },
  obj: {} as any,
  mapDialogVisible: false
})
const rules = reactive({
  receiverName: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
  receiverPhone: [{ required: true, message: '请输入联系人电话', trigger: 'blur' }],
  projectAddress: [{ required: true, message: '请选择收获地址', trigger: 'change' }]
})

const handelChangeCity = (row: object) => {
  state.form.receiverCity = row[0]
  state.form.receiverRegion = row[1]
}
// 修改收货地址
const selectAddress = () => {
  state.formData.provinceName = props.data?.receiverProvince
  state.formData.city = props.data?.receiverCity
  state.formData.cityName = props.data?.receiverCity
  state.formData.region = props.data?.receiverRegion
  state.formData.districtName = props.data.districtName
  state.formData.latitude = props.data?.receiverLatitude
  state.formData.longitude = props.data?.receiverLongitude
  state.formData.latAddress = props.data?.receiverLatAddress
  state.formData.poiName = props.data?.receiverPoiName
  state.mapDialogVisible = true
}

const newAddress = (data:any) => {
  state.form.receiverProvince = data?.province
  state.form.receiverCity = data?.city
  state.form.receiverRegion = data?.region
  state.form.districtName = data?.districtName
  state.form.receiverLatitude = data?.latitude
  state.form.receiverLongitude = data?.longitude
  state.form.receiverLatAddress = data?.latAddress
  state.form.receiverPoiName = data?.poiName
  state.form.projectAddress = data?.projectAddress
}
const handleConfirm = () => {
  ruleForms.value.validate((valid: any) => {
    if (valid) {
      saveData()
    }
  })
  //
}
const saveData = async () => {
  fetch({
    url: '/mall/order/modifyOrderReceiverInfo',
    method: 'post',
    data: state.form
  }).then((res: any) => {
    if (res.code == '0') {
      ElMessage.success(`修改收货信息成功`)
      handelClose()
      emit('getData')
    }
  })
}
const handelChangeProvince = (row: any) => {
  state.provinceList.forEach((res: any) => {
    if (res.name == row) {
      getRegionTree(res.agencyId)
    }
  })
}
// 获取城市信息
const getRegionTree = async (par: any) => {
  await fetch({
    url: 'basic/region/regionTree/' + par,
    method: 'get'
  }).then((res: any) => {
    state.regionTree = res.data
  })
}
// 获取省份信息
const getProvince = async () => {
  await fetch({ url: '/basic/region/province', method: 'get' }).then(
    (res: any) => {
      state.provinceList = res.data
      if (state.form.receiverProvince) {
        state.form.receiverRegionn = [state.form.receiverCity, state.form.receiverRegion]
        state.provinceList.forEach((res: any) => {
          if (res.name == state.form.receiverProvince) {
            getRegionTree(res.agencyId)
          }
        })
      }
    }
  )
}

const handelClose = () => {
  emit('update:modelValue', false)
}

watchEffect(() => {
  dialogVisible.value = props.modelValue
  state.form = JSON.parse(JSON.stringify(props.data))
  state.form.orderId = props.data.id
  state.form.projectAddress = props.data?.receiverLatAddress + props.data?.receiverPoiName
  // state.form = {
  //   orderId: props.data.id,
  //   receiverCity: props.data.receiverCity,
  //   receiverDetailAddress: props.data.receiverDetailAddress,
  //   receiverName: props.data.receiverName,
  //   receiverPhone: props.data.receiverPhone,
  //   receiverPostCode: '',
  //   receiverProvince: props.data.receiverProvince,
  //   receiverRegion: props.data.receiverRegion
  // }
  if (dialogVisible.value) {
    getProvince()
  }
})
</script>

<style scoped lang="less">

</style>
