<template>
  <div class="main-container flex-center">
    <div v-for="(value, key) in overviewData" :key="key" class="item-container flex-center">
      <div class="item-number">
        {{ value }}
      </div>
      <div class="item-title">
        {{ getLabel(key) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import { fetch } from '_@/axios-config/axios'

const overviewData = ref({} as any)

const getData = async () => {
  await fetch({
    url: '/order/bizsharecode/shareStatistic',
    method: 'get',
    params: {}
  }).then((res: any) => {
    if (res.code === 0) {
      overviewData.value = res.data
    }
  })
}

onMounted(() => {
  getData()
})

const getLabel = (key: any) => {
  return {
    averageConsumption: '人均消费金额',
    averageOrder: '均单值',
    openCount: '打开次数',
    orderAmount: '下单金额',
    orderCount: '下单量',
    orderMemberCount: '下单人数',
    registerCount: '注册用户数量',
    registerRate: '注册率(%)',
    rewardsCount: '奖励次数',
    shareCount: '分享次数'
  }[key]
}
</script>

<style lang="less" scoped>
.main-container {
  width: 100%;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: space-between;

  .item-container {
    width: 20%;
    height: 10rem;
    flex-direction: column;
    justify-content: center;

    .item-number {
      font-weight: bold;
      font-size: 4rem;
      color: black;
    }

    .item-title {
      color: #a8a8a8;
      font-size: 1rem;
      margin-top: 2rem;
    }
  }
}

.flex-center {
  display: flex;
  align-items: center;
}
</style>
