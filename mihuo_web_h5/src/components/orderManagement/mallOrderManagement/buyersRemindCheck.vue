<template>
  <div>
    <el-drawer
      v-model="checkShow"
      title="给买家的提醒"
      direction="rtl"
      @close="closeHandelDrawer"
    >
      <div class="detail-drawer remind-check">
        <ul>
          <li v-for="(item,index) in state.orderLogList" :key="index">
            <div class="remind-dot">
              <div :style="index==0?'background: #F2AA3D;':''"></div>
              <div></div>
            </div>
            <div class="check-tag">
              <el-tag v-if="index==0" size="small" effect="dark" type="warning">最新</el-tag>
            </div>
            <div class="remind-content">
              <div>
                <span class="remind-date">{{ item.created }}</span>
              </div>
              <div class="remind-remark">{{ item.content }}</div>
            </div>
          </li>
        </ul>

      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, reactive, onMounted, watchEffect, ref } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { getSkuData, getSourceType, openIM, getPayType } from '../order'

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
  }
})
const emit = defineEmits()

const checkShow = ref<boolean>(false)
const state = reactive({
  orderLogList: []
})

//获取订单动态
const getOrderLog = async () => {
  await fetch({
    url: `/mall/order/trends/list/${props.orderId}`,
    method: 'get'
  }).then((res: any) => {
    state.orderLogList = res.data
  })

}

watchEffect(() => {
  checkShow.value = props.modelValue
  if (checkShow.value) getOrderLog()
})

const closeHandelDrawer = () => {
  emit('update:modelValue', false)
}
</script>

<style scoped lang="less">
@import "../orderTable";
</style>
