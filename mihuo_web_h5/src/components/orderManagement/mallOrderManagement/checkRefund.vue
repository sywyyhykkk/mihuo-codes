<template>
  <div>
    <el-drawer
      v-model="checkShow"
      title="售后详情"
      direction="rtl"
      @close="closeHandelDrawer"
    >
      <div class="detail-drawer remind-check ">
        <ul>
          <li v-for="(item,index) in state.afterSalesData" :key="index">
            <div class="remind-dot">
              <div></div>
              <div></div>
            </div>
            <div class="check-tag" style="width: 7rem">
            </div>
            <div class="remind-content">
              <div class="refund-title">{{item.remark}}</div>
              <div class="refund-date">{{moment(item.updated).format('YYYY-MM-DD HH:mm')}}</div>
              <div class="refund-content" v-for="(em,id) in item.infoList.modifyRecords" :key="id">
                {{em.property}}：{{em.newValue}}
              </div>
            </div>
          </li>
        </ul>

      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import moment from 'moment'
import { defineEmits, defineProps, reactive, onMounted, watchEffect, ref } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { getSkuData, getSourceType, openIM, getPayType } from '../order'

const props = defineProps({
  modelValue: { //控制抽屉是否显示
    type: Boolean,
    default: false
  },
  orderItemId: {//订单id
    type: String || Number,
    default: 0
  },
  data: {//row
    type: Object,
    default: {}
  }
})
const emit = defineEmits(['update:modelValue'])

const checkShow = ref<boolean>(false)

const state = reactive({
  afterSalesData: []
})

const getRefundList = async () => {
  await fetch({
    url: `/mall/order/refund/log/${props.orderItemId}`,
    method: 'get'
  }).then((res:any) => {
    if(res.code == 0){
      res.data&&res.data.map((item:any) => {
        item['infoList'] = JSON.parse(item.payload)
      })
      state.afterSalesData = res.data
    }
  })
}


watchEffect(() => {
  checkShow.value = props.modelValue
  getRefundList()
})

const closeHandelDrawer = () => {
  emit('update:modelValue', false)
}
</script>

<style scoped lang="less">
@import "../orderTable";
</style>
