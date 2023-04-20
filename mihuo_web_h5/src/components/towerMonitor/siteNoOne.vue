<template>
  <div class="site-no-one">
    <my-title title="工地无人情况" :style="pageType==2?'margin-left:-3rem':''">
      <template #content>
        <div class="progess-info" :style="pageType==2?'margin-right:3rem':''">
          <div class="progess-value" />
          <div class="progess-text">无人天数</div>
        </div>
      </template>
    </my-title>
    <div class="body-height">
      <ul v-if="carouselType" class="my-carousel" :style="pageType==2?'padding:0rem 3rem 0rem 0':''">
        <li v-for="(item,index) in dataList" :style="pageType==2?'border-bottom: solid 1px #F3F4F8;':''">
          <div class="li-number">{{ item.dataIndex }}</div>
          <div class="li-content">
            <div :class="`li-address_${pageType}`">{{ item.address }}</div>
            <div :class="`li-data-no-one_${pageType}`">
              <div>【项目经理】{{ item.pioneerName }}</div>
              <div>水电开槽【水电工】张三</div>
            </div>
          </div>

          <div class="progess-info ">
            <div class="progess-value" :style="`width:${item*2}rem;`" />
            <div class="progess-text">{{ getDaysBetween(item.expectFinishTime, new Date()) }}天</div>
          </div>
        </li>
      </ul>
    </div>
    <carouselPagination
      v-if="pageType==2"
      :current-page="currentPage"
      :page-size="pagesize"
      :total="total"
      @getCurrent="getCurrent"
    />
  </div>
</template>

<script lang="ts" setup>
import { fetch } from '../../pages/cityoperator/axios-config/axios'
import { onMounted, reactive, inject, ref, computed } from 'vue'
import { getDaysBetween } from '@/components/project/projectItem/projectDetailNewData'

const carouselType = ref<boolean>(true)
const total = ref<number>(3)
const currentPage = ref<number>(1)
const pagesize = ref<number>(5)
const pageType = inject('pageType')
const state = reactive({
  data: [] as any,
  data2: [{ dataIndex: 1, address: '云纺国际商厦A座1603', pioneerName: '喂喂喂', expectFinishTime: '2022-6-23' },
    { dataIndex: 2, address: '云纺国际商厦A座1603', pioneerName: '喂喂喂', expectFinishTime: '2022-6-23' },
    { dataIndex: 3, address: '云纺国际商厦A座1603', pioneerName: '喂喂喂', expectFinishTime: '2022-6-23' },
    { dataIndex: 4, address: '云纺国际商厦A座1603', pioneerName: '喂喂喂', expectFinishTime: '2022-6-23' },
    { dataIndex: 5, address: '云纺国际商厦A座1603', pioneerName: '喂喂喂', expectFinishTime: '2022-6-23' },
    { dataIndex: 6, address: '云纺国际商厦A座1603', pioneerName: '喂喂喂', expectFinishTime: '2022-6-23' },
    { dataIndex: 7, address: '云纺国际商厦A座1603', pioneerName: '喂喂喂', expectFinishTime: '2022-6-23' },
    { dataIndex: 8, address: '云纺国际商厦A座1603', pioneerName: '喂喂喂', expectFinishTime: '2022-6-23' },
    { dataIndex: 9, address: '云纺国际商厦A座1603', pioneerName: '喂喂喂', expectFinishTime: '2022-6-23' },
    { dataIndex: 10, address: '云纺国际商厦A座1603', pioneerName: '喂喂喂', expectFinishTime: '2022-6-23' },
    { dataIndex: 11, address: '云纺国际商厦A座1603', pioneerName: '喂喂喂', expectFinishTime: '2022-6-23' },
    { dataIndex: 12, address: '云纺国际商厦A座1603', pioneerName: '喂喂喂', expectFinishTime: '2022-6-23' },
    { dataIndex: 13, address: '云纺国际商厦A座1603', pioneerName: '喂喂喂', expectFinishTime: '2022-6-23' }]
})
const dataList = computed(() => {
  return state.data2.slice(currentPage.value * pagesize.value - pagesize.value, currentPage.value * pagesize.value)
})

const getCurrent = (data: any) => {
  currentPage.value = data
  carouselType.value = false
  setTimeout(() => {
    carouselType.value = true
  }, 100)
}

// 轮播图事件
const carouselFun = () => {
  setInterval(() => {
    currentPage.value++
    if (currentPage.value > total.value) {
      currentPage.value = 1
    }
    carouselType.value = false
    setTimeout(() => {
      carouselType.value = true
    }, 100)
  }, 5000)
}
onMounted(() => {
  carouselFun()
  state.data = state.data2
})

</script>

<style scoped lang="less">
@import "tower";

</style>
