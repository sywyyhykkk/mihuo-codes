<template>
  <div>
    <el-form
      ref="ruleForm"
      :model="ruleForms"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="城市编号:" prop="cityId">
        <el-input v-model="ruleForms.cityId" disabled />
      </el-form-item>
      <el-form-item label="施工地址:" prop="address">
        <el-input v-model="ruleForms.address" placeholder="施工地址" disabled />
      </el-form-item>
      <el-form-item label="上门时间:">
        <el-input
          v-model="ruleForms.expectDate"
          placeholder="上门时间"
          disabled
        />
      </el-form-item>
      <el-form-item label="预期工期:">
        <el-input v-model="ruleForms.expectDuration" disabled />
      </el-form-item>
      <el-form-item label="服务工种:">
        <el-input :placeholder="getSkillName(ruleForms.skillType)" disabled />
      </el-form-item>
      <el-form-item label="期望价格:" prop="price">
        <el-input v-model="ruleForms.price" />
      </el-form-item>
      <el-form-item label="定价方式:">
        <el-radio-group v-model="ruleForms.priceWay">
          <el-radio :label="Number(1)">一口价</el-radio>
          <el-radio :label="Number(2)">议价</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="联系人姓名:">
        <el-input v-model="ruleForms.contactName" disabled />
        <el-radio-group v-model="ruleForms.contactGender" disabled>
          <el-radio :label="Number(1)">先生</el-radio>
          <el-radio :label="Number(2)">女士</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="联系人电话:">
        <el-input v-model="ruleForms.contactPhone" disabled />
      </el-form-item>
      <el-form-item label="需求描述:">
        <el-input
          v-model="ruleForms.requirementDesc"
          disabled
          placeholder="需求描述"
        />
      </el-form-item>
      <el-form-item label="所含商品/服务:">
        <el-table stripe  :data="orderItemList" style="width: 100%" border>
          <el-table-column prop="productSn" label="编号" />
          <el-table-column prop="productBrand" label="品牌" />
          <el-table-column prop="productName" label="名称" width="160" />
          <el-table-column prop="productAttr" label="型号">
            <template #default="scope">
              <div
                v-for="item in JSON.parse(scope.row.productAttr)"
                :key="item"
              >
                {{ item.key }}:{{ item.value }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="productPrice" label="价格" />
          <el-table-column prop="productQuantity" label="数量" />
          <el-table-column label="操作" fixed="right">
            <template #default="scope">
              <el-button @click="editOrderDetail(scope.row)" size="mini"
                >发单</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="编辑发单详情"
      center
      append-to-body
      v-model="show"
      width="20%"
      :destroy-on-close="true"
    >
      <div>
        <el-form ref="form" :model="form" label-width="9rem">
          <el-form-item
            :label="`${item.key}:`"
            v-for="(item, index) in options1"
            :key="item.key"
          >
            <el-select v-model="value[index]" size="mini" clearable>
              <el-option
                v-for="o in options2[index]"
                :key="o"
                :label="o"
                :value="o"
                clearable
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button class="btn-add" size="mini" @click="saveOrder"
              >确认发单</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus'
import { defineComponent, reactive, toRefs, ref, onMounted } from 'vue'
import wsCache from '@/cache'
import { getSkillName } from '@/utils/utils'
import { getOrderDetail, getProductCateDetail } from '_@/api/order'

export default defineComponent({
  components: {},
  props: {
    orderForm: {
      type: Object,
      default: null,
    },
  },
  emits: ['getData'],
  setup(props, { emit }) {
    const companyId = wsCache.get('companys')[0].companyId
    const show = ref<boolean>(false)
    const state = reactive({
      ruleForms: {
        address:
          props.orderForm.receiverProvince +
          props.orderForm.receiverCity +
          props.orderForm.receiverRegion +
          props.orderForm.receiverDetailAddress,
        attachments: null,
        cityId: 5301,
        cityName: props.orderForm.receiverCity,
        // companyId: companyId,
        contactGender: props.orderForm.contactGender || 1,
        contactName: props.orderForm.receiverName,
        contactPhone: props.orderForm.receiverPhone,
        expectDate: props.orderForm.expectDate || '2999-12-31',
        expectDuration: props.orderForm.expectDuration || 0,
        latitude: props.orderForm.latitude,
        longitude: props.orderForm.latitude,
        orderStatus: props.orderForm.status,
        price: props.orderForm.totalAmount,
        priceWay: 1,
        publishType: 2,
        referencePrice: 0,
        requirementDesc: props.orderForm.requirementDesc,
        requirementName: getSkillName(props.orderForm.skillId),
        requirementType: props.orderForm.requirementType,
        roleType: props.orderForm.roleType || 'R_WORKER',
        skillType: props.orderForm.skillIds,
      },
      orderForm: props.orderForm,
      orderItemList: [],
      form: {},
      options1: [] as any,
      options2: [] as any,
      value: [] as any,
    })

    onMounted(() => {
      getData()
    })

    const getData = async () => {
      await getOrderDetail(state.orderForm.id).then((res) => {
        state.orderItemList = res.data.orderItemList
      })
    }

    const editOrderDetail = async (row: any) => {
      state.options1 = []
      state.options2 = []
      state.value = []
      show.value = !show.value
      state.options1 = JSON.parse(row.productAttr)
      for await (const item of state.options1) {
        await getProductCateDetail(item.key).then(
          (res: { data: { records: any[] } }) => {
            let list = [] as any
            let result = [] as any
            res.data.records.forEach((ele: any) => {
              list.push(ele)
            })
            list.forEach((item: { inputList: any }) => {
              if (item.inputList) {
                result = result.concat(item.inputList.split(','))
              }
            })
            state.options2.push(result)
          }
        )
      }
    }

    const saveOrder = async () => {
      if (state.value.length !== state.options2.length || !state.value[0]) {
        ElMessage.warning('请选择规格!')
        return
      }
      console.log('发单', state.ruleForms, state.value)
      show.value = !show.value
    }

    const rules = reactive({
      price: [{ required: true, message: '请输入期望价格', trigger: 'blur' }],
    })

    return {
      rules,
      getSkillName,
      saveOrder,
      editOrderDetail,
      show,
      ...toRefs(state),
    }
  },
})
</script>

<style scoped lang="less">
.el-select {
  margin-top: 5px;
  margin-right: 1px;
}
</style>
