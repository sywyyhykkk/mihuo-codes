<template>
  <div class="card-content">
    <div class="card">
      <div class="title">
        <span class="order-no">{{ orderDetail.orderSn }}</span
        ><span class="material-num"
          >共{{ orderDetail.orderItemList.length }}条材料</span
        >
      </div>
      <div class="orderTime">
        下单日期：<span class="date">{{
          resolveDate(orderDetail.createTime)
        }}</span>
      </div>
      <div class="requestime">
        预计到达时间：<span class="date">{{
          resolveDate(orderDetail.estimateTime)
        }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  orderDetail: {
    type: Object,
    default: () => ({})
  }
})
const resolveDate = (date: any) => {
  if (!date) return ''
  return date.substr(0, 10)
}
</script>
<style lang="less" scoped>
.card-content {
  background-color: #fff;
  padding: 10px;
  border-radius: 10px;
}
.title {
  font-size: 18px;
  line-height: 21px;
  color: #303133;
  margin-bottom: 5px;
  display: flex;
  .order-no {
    font-weight: 600;
    flex: 1;
  }
  .material-num {
    color: @mainColor;
    font-size: 16px;
    margin-left: 5px;
  }
}
.requestime,
.orderTime {
  font-size: 12px;
  color: #999;
  margin: 5px 0;
  .date {
    font-size: 12px;
    color: #999;
  }
}
</style>
