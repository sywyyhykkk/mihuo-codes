<template>
  <div :class="`site-profile_${pageType}`">
    <my-title title="今日工地概况" />
    <div class="site-conter">
      <div v-for="item in state.chartsData" class="site-item">
        <div :class="`item-label_${pageType}`">{{ item.label }}</div>
        <div style="width: calc(100% - 14.5rem)">
          <div
            class="item-data"
            :style="`background:${item.color};width:${state.data[item.value]/state.data['totall']*100}%`"
          />
        </div>
        <div class="item-value" :style="pageType==2?`color:${item.dataColor}`:''">{{ state.data[item.value] }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, inject } from 'vue'
import { fetch } from '_@/axios-config/axios'

const pageType = inject('pageType')
const state = reactive({
  data: {
    overToday: 0,
    startThisMonth: 0,
    startToday: 0,
    stopToday: 0,
    totall: 0
  },
  chartsData: [{
    label: '在建工地',
    value: 'totall',
    color: 'linear-gradient(90deg, rgba(64, 158, 255, 0), #409EFF)',
    dataColor: '#409EFF'
  }, {
    label: '本月待开工',
    value: 'startThisMonth',
    color: 'linear-gradient(90deg, rgba(242, 170, 61, 0), #F2AA3D)',
    dataColor: '#F2AA3D'
  }, {
    label: '今日已开工',
    value: 'overToday',
    color: 'linear-gradient(90deg, rgba(64, 158, 255, 0), #409EFF)',
    dataColor: '#409EFF'
  }, {
    label: '今日已停工',
    value: 'stopToday',
    color: 'linear-gradient(90deg, rgba(245, 108, 108, 0), #F56C6C)',
    dataColor: '#F56C6C'
  }, {
    label: '今日已完工',
    value: 'overToday',
    color: 'linear-gradient(90deg, rgba(103, 194, 58, 0), #67C23A)',
    dataColor: '#67C23A'
  }]
})

onMounted(() => {

})

</script>

<style scoped lang="less">
.site-profile_1 {
  height: 30%;
}

.site-profile_2 {
  height: auto;
}

.site-conter {
  height: calc(100% - 6rem);
  margin-bottom: 1rem;
  padding: 0.5rem 0rem;
  overflow-y: auto;

  .site-item {
    margin: 24px 4rem 24px 3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .item-label_1 {
      font-size: 14px;
      color: #0969DA;
      margin-right: 1rem;
      width: 10rem;
    }

    .item-label_2 {
      font-size: 14px;
      color: #303133;
      margin-right: 1rem;
      width: 10rem;
    }

    .item-data {
      //width: 29rem;
      height: 10px;
      border-radius: 5px;
    }

    .item-value {
      width: 1.5rem;
      margin-left: 1rem;
      font-size: 16px;
      color: #FFFFFF;
    }
  }
}

::-webkit-scrollbar {
  display: none;
}
</style>
