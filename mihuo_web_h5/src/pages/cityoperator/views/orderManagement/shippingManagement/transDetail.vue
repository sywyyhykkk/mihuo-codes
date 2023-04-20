<template>
  <div>
    <el-card shadow="never">
      <el-form
        ref="ruleForms"
        :model="form"
        label-width="120px"
        style="width: 600px"
        size="small"
      >
        <el-form-item label="订单编号:">
          {{ form.id }}
        </el-form-item>
        <el-form-item label="用户账号:">
          {{ form.memberId }}
        </el-form-item>
        <el-form-item label="创建时间:">
          {{ form.createTime }}
        </el-form-item>
        <el-form-item label="订单金额:">
          {{ form.realAmount * form.productQuantity }}
        </el-form-item>
        <el-form-item label="订单状态:">
          {{ getOrderStatus(form.status) }}
        </el-form-item>
        <el-form-item label="订单类型:">
          {{ getServiceType(form.serviceType) }}
        </el-form-item>
        <el-form-item label="订单分类:">
          {{ form.orderType === 1 ? '秒杀订单' : '正常订单' }}
        </el-form-item>
        <el-form-item label="支付方式:">
          {{
            form.payType === 1
              ? '支付宝支付'
              : form.payType === 2
                ? '微信支付'
                : '未支付'
          }}
        </el-form-item>
        <el-form-item label="发货地址:">
          {{ form.companyAddress?.province }}{{ form.companyAddress?.city
          }}{{ form.companyAddress?.region
          }}{{ form.companyAddress?.detailAddress }}
        </el-form-item>
        <el-form-item label="收货人姓名:" prop="receiverName">
          <el-input
            v-model="receiverName"
            placeholder="收货人姓名"
            :disabled="!isEditable"
            required
          />
        </el-form-item>
        <el-form-item label="收货人电话:">
          <el-input
            v-model="receiverPhone"
            placeholder="收货人电话"
            :disabled="!isEditable"
            required
          />
        </el-form-item>
        <el-form-item label="收货地址省份:" prop="receiverProvince">
          <el-select
            v-model="receiverProvince"
            placeholder="请选择省份"
            :disabled="!isEditable"
            @change="getCityList"
          >
            <el-option
              v-for="item in provinceList"
              :key="item.id"
              :label="item.name"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="收货地址城市:" prop="receiverCity">
          <el-select
            v-model="receiverCity"
            placeholder="请选择城市"
            :disabled="!isEditable"
            no-data-text="请先选择省份"
            @change="getRegionList"
          >
            <el-option
              v-for="item in cityList"
              :key="item.id"
              :label="item.name"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="收货地址区/县:" prop="receiverRegion">
          <el-select
            v-model="receiverRegion"
            placeholder="请选择区/县"
            :disabled="!isEditable"
            no-data-text="请先选择城市"
            @change="getRegion"
          >
            <el-option
              v-for="item in regionList"
              :key="item.id"
              :label="item.name"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址:" prop="receiverDetailAddress">
          <el-input
            v-model="receiverDetailAddress"
            style="margin-top: 5px"
            placeholder="请输入详细地址"
            :disabled="!isEditable"
          />
        </el-form-item>
        <el-form-item label="物流单号:">
          <el-input
            v-model="form.deliverySn"
            placeholder="请输入物流单号"
            :disabled="!isEditable"
          />
        </el-form-item>
        <el-form-item label="物流公司:">
          <el-input
            v-model="form.deliveryCompany"
            placeholder="输入物流单号自动获取物流公司"
            disabled
          />
        </el-form-item>
        <el-form-item label="物流状态:" />
        <el-form-item v-if="isEditable" label="操作:">
          <el-button size="mini" @click="handleSaveForm(form)">保存 </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getOrderStatus, getServiceType } from '@/utils/utils'
import { getProvince, getCity, setReceiver } from '_@/api/order'

export default defineComponent({
  components: {},
  props: {
    orderForm: {
      type: Object,
      default: null
    },
    isEditable: {
      type: Boolean,
      default: false
    }
  },
  emits: ['getData'],
  setup(props, { emit }) {
    const ruleForms = ref<any>('')
    const state = reactive({
      isEditable: props.isEditable,
      form: props.orderForm,
      receiverProvince: '',
      receiverCity: '',
      receiverRegion: '',
      receiverDetailAddress: '',
      receiverName: '',
      receiverPhone: '',
      receiverPostCode: '',
      deliverySn: '',
      provinceList: [],
      cityList: [],
      regionList: []
    })

    onMounted(() => {
      getProvinceList()
      getForm()
    })

    const getForm = () => {
      state.receiverProvince = state.form.receiverProvince
      state.receiverCity = state.form.receiverCity
      state.receiverRegion = state.form.receiverRegion
      state.receiverDetailAddress = state.form.receiverDetailAddress
      state.receiverName = state.form.receiverName
      state.receiverPhone = state.form.receiverPhone
      state.receiverPostCode = state.form.receiverPostCode
      state.deliverySn = state.form.deliverySn
    }

    const getProvinceList = async () => {
      await getProvince().then((res) => {
        state.provinceList = res.data
      })
    }

    const getCityList = async (e: any) => {
      state.receiverProvince = e.name
      const { agencyId } = e
      await getCity(agencyId).then((res) => {
        state.cityList = res.data
      })
    }

    const getRegionList = (e: any) => {
      state.receiverCity = e.name
      state.regionList = e.children
    }

    const getRegion = (e: any) => {
      state.receiverRegion = e.name
    }

    const handleSaveForm = async (form: any) => {
      if (
        state.receiverProvince === '' ||
        state.receiverCity === '' ||
        state.receiverRegion === '' ||
        state.receiverDetailAddress === '' ||
        state.receiverName === '' ||
        state.receiverPhone === ''
      ) {
        ElMessage.warning('请输入全部信息!')
        return
      }
      const data = {
        orderId: form.id,
        receiverCity: state.receiverCity,
        receiverDetailAddress: state.receiverDetailAddress,
        receiverName: state.receiverName,
        receiverPhone: state.receiverPhone,
        receiverProvince: state.receiverProvince,
        receiverRegion: state.receiverRegion,
        receiverPostCode: state.receiverPostCode,
        status: form.status
      }
      await setReceiver(data).then((res) => {
        ElMessage.success('保存成功!')
        emit('getData')
      })
    }

    return {
      ruleForms,
      getOrderStatus,
      getCityList,
      getRegionList,
      getRegion,
      handleSaveForm,
      getServiceType,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
</style>
