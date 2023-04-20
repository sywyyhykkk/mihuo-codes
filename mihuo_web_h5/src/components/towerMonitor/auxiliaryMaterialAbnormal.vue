<template>
  <div class="fixed-product-anomaly auxiliary-material">
    <my-title title="辅材配合异常" placement="right" :style="pageType==2?'margin-left:-3rem':''" />
    <div class="body-height">
      <ul v-if="carouselType" class="my-carousel" :style="pageType==2?'margin-left:-3rem':''">
        <li v-for="item in 5" :style="pageType==2?'border-bottom: solid 1px #F3F4F8;':''">
          <div class="li-head">
            <div class="li-head-title">
              <div class="li-num">1</div>
              <div :class="`li-text-title_${pageType}`">云纺国际商厦A座1601</div>
            </div>
            <div class="li-head-text">
              开工准备
            </div>
          </div>
          <div>
            <div v-for="item in 2" class="li-data-item">
              <div class="custom-made">
                <img class="custom-made-img" src="@/assets/img/tower/auxiliary_material.png">
                <div :class="`custom-made-text_${pageType}`">橱柜</div>
              </div>
              <div :class="`item-status_${pageType}`">
                未下单GHJGs
              </div>
              <div class="days-overdue">
                <span>超期60天</span>
                <img v-for="item in 3" class="overdue-img" src="@/assets/img/tower/overdue.png">
              </div>
            </div>
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
import { fetch } from '_@/axios-config/axios'

const carouselType = ref<boolean>(true)
const total = ref<number>(3)
const currentPage = ref<number>(1)
const pagesize = ref<number>(4)
const pageType = inject('pageType')
const state = reactive({
  data: []
})

const dataList = computed(() => {
  return state.data.slice(currentPage.value * pagesize.value - 4, currentPage.value * pagesize.value)
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
})
</script>

<style scoped lang="less">
@import "tower";

</style>
