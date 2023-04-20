<template>
  <div class="site-no-one">
    <my-title title="工地收款预警" placement="right" />
    <div class="body-height">
      <ul v-if="carouselType" class="my-carousel">
        <li v-for="(item,index) in state.data" :key="index" :style="pageType==2?'border-bottom: solid 1px #F3F4F8;':''">
          <div class="li-number li-number__warning">{{ index + 1 }}</div>
          <div class="li-content" style="width: 40%">
            <div :class="`li-address_${pageType}`">{{ item.address }}</div>
            <div :class="`li-data-no-one_${pageType}`">
              <div>【项目经理】{{ item.pioneerName }}</div>
              <div>水电开槽【水电工】张三</div>
            </div>
          </div>

          <div class="site-collection-data">
            <span>隐蔽工程验收完成</span>
            <div class="data-tage">今天</div>
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
import { onMounted, reactive, inject, ref, computed } from 'vue'
import { fetch } from '../../pages/cityoperator/axios-config/axios'

const carouselType = ref<boolean>(true)
const total = ref<number>(3)
const currentPage = ref<number>(1)
const pagesize = ref<number>(4)
const pageType = inject('pageType')
const state = reactive({
  data: [] as any,
  data2: [{ address: '云纺国际商厦', pioneerName: '维维喂' },
    { address: '云纺国际商厦', pioneerName: '维维喂' }, { address: '云纺国际商厦', pioneerName: '维维喂' },
    { address: '云纺国际商厦', pioneerName: '维维喂' }, {
      address: '云纺国际商厦',
      pioneerName: '维维喂'
    }]
})
const dataList = computed(() => {
  return state.data2.slice(currentPage.value * pagesize.value - 4, currentPage.value * pagesize.value)
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
  state.data = state.data2
  carouselFun()
})
</script>

<style scoped lang="less">
@import "tower";

</style>
