<template>
  <el-drawer
    v-model="showDrawer"
    title="变更金额"
    direction="rtl"
    @close="closeHandelDrawer"
    size="114rem"
  >
    <div style="padding: 4rem">
      <el-table :data="tableData" border show-summary
                sum-text="合计"
                style="width: 100%">
        <el-table-column prop="orderId" label="变更单编号" width="180" />
        <el-table-column prop="alterationReason" label="变更事项" />
        <el-table-column prop="pics" label="变更图片" />
        <el-table-column prop="status" label="变更项" />
        <!--        <el-table-column prop="amount3" sortable label="人工费" />-->
        <el-table-column prop="alterationMoney" sortable label="变更金额" />
        <el-table-column prop="payStatus" label="状态" />
      </el-table>
    </div>


  </el-drawer>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, ref, watchEffect } from 'vue'
import { fetch } from '_@/axios-config/axios'

const props = defineProps({
  modelValue: { //控制抽屉是否显示
    type: Boolean,
    default: false
  },
  orderId: {//订单id
    type: String || Number,
    default: 0
  },
  data: {//row
    type: Object,
    default: {}
  },
  orderType: {//订单类型0商品订单，1服务订单，2协作订单，3用户订单
    type: String || Number,
    default: 0
  }
})
const emit = defineEmits(['getData'])
const showDrawer = ref<boolean>(false)
const tableData = ref<any>([])

const getChangeList = async () => {
  await fetch({
    url: 'order/bizorderalteration/alterationPage',
    method: 'get',
    params: {
      orderId: props.orderId,
      size: 999
    }
  }).then((res: any) => {
    tableData.value = res.data.records
  })

}

onMounted(() => {
  showDrawer.value = props.modelValue
  getChangeList()
})

</script>

<style scoped>

</style>
