<template>
  <div>
    <el-collapse v-model="activeNames" style="margin-top: 15px">
      <el-collapse-item title="订单基本信息:" name="1">
        <el-form
          :model="form"
          label-width="12rem"
          size="small"
        >
          <el-form-item label="订单编号:">
            {{ form.orderSn }}
          </el-form-item>
          <el-form-item label="创建时间:">
            {{ form.createTime }}
          </el-form-item>
          <el-form-item label="用户账号:">
            {{ form.memberId }}
          </el-form-item>
          <el-form-item label="订单金额:">
            {{ form.realAmount * form.productQuantity || form.totalAmount }}
          </el-form-item>
          <el-form-item label="实付金额:">
            {{ form.realAmount * form.productQuantity || form.payAmount }}
          </el-form-item>
          <el-form-item label="订单状态:">
            {{ form.sourceTypeget == 1 ? OrderStatus(form.status) : getOrderStatusSupplier(form.supplierStatus) }}
          </el-form-item>
          <el-form-item label="指派状态:">
            {{ form.isAssign === 0 ? '暂未指派' : '已指派' }}
          </el-form-item>
          <el-form-item label="订单来源:">
            {{ getSourceType(form.sourceType) }}
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
          <el-form-item label="所需工种:">
            {{ getSkillName(form.skillId) }}
          </el-form-item>
          <el-form-item label="发货地址:">
            {{ form.companyAddress?.province }}{{ form.companyAddress?.city
            }}{{ form.companyAddress?.region
            }}{{ form.companyAddress?.detailAddress }}
          </el-form-item>
          <el-form-item label="收货人姓名:">
            {{ form.receiverName }}
          </el-form-item>
          <el-form-item label="收货人电话:">
            {{ form.receiverPhone }}
          </el-form-item>
          <el-form-item label="收货地址:">
            {{ form.receiverProvince }}{{ form.receiverCity
            }}{{ form.receiverRegion }}{{ form.receiverDetailAddress }}
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="物流信息:" name="2">
        <el-form
          :model="form"
          label-width="12rem"
          size="small"
        >
          <el-form-item label="物流公司:">
            {{ form.deliveryCompany }}
          </el-form-item>
          <el-form-item label="物流单号:">
            {{ form.deliverySn }}
          </el-form-item>
          <el-form-item label="物流状态:"></el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="订单包含商品/服务:" name="3">
        <div>
          <el-table stripe :data="orderItemList" style="width: 100%" border>
            <el-table-column prop="productSn" label="编号"></el-table-column>
            <el-table-column prop="productBrand" label="品牌">
            </el-table-column>
            <el-table-column prop="productName" label="名称"></el-table-column>
            <el-table-column prop="productAttr" label="规格">
              <template #default="scope">
                {{
                  JSON.parse(scope.row.productAttr)[0]
                    ? JSON.parse(scope.row.productAttr)[0].value
                    : JSON.parse(scope.row.productAttr).label
                }}
              </template>
            </el-table-column>
            <el-table-column prop="productPrice" label="价格">
            </el-table-column>
            <el-table-column prop="productQuantity" label="数量">
            </el-table-column>
          </el-table>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, onMounted } from 'vue'
import { getOrderStatus, getSkillName, getServiceType, getOrderStatusSupplier,getSourceType } from '@/utils/utils'
import { getOrderDetail } from '_@/api/order'

export default defineComponent({
  components: {},
  props: {
    orderForm: {
      type: Object,
      default: null
    },
    isShowAssignment: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const state = reactive({
      form: props.orderForm,
      orderItemList: [],
      activeNames: ['1']
    })

    onMounted(() => {
      getData()
    })

    const getData = async () => {
      await getOrderDetail(state.form.id).then((res) => {
        state.orderItemList = res.data.orderItemList
      })
    }

    return {
      getSourceType,
      getOrderStatusSupplier,
      getOrderStatus,
      getSkillName,
      getServiceType,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
</style>
