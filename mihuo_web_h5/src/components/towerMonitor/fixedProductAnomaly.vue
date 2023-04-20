<template>
  <div class="fixed-product-anomaly" :style="pageType==2?'margin-right:3rem;':''">
    <my-title title="定制品异常工地排行"></my-title>
    <div :class="pageType==2?'body-height':''">
      <ul v-if="carouselType" class="my-carousel">
        <li v-for="item in 3" :style="pageType==2?'border-bottom: solid 1px #F3F4F8;':''">
          <div class="li-head">
            <div class="li-head-title">
              <div class="li-num" style="color: #fff;margin-right: 1rem">1</div>
              <div class="li-text-title">云纺国际商厦A座1601</div>
            </div>
            <div class="li-head-text">
              开工准备
            </div>
          </div>

          <div class="li-data-all">
            <div v-for="item in 6" :style="pageType==2?'width:30%':'width:100%'" class="li-data-item">
              <div class="custom-made">
                <img class="custom-made-img" src="@/assets/img/tower/custom_made.png" />
                <div class="custom-made-text" style="margin-left: 1rem">橱柜</div>
              </div>
              <div class="item-status" style="color:#909399;">
                未下单GHJGs
              </div>
              <div class="days-overdue">
                <span>超期60天</span>
                <img v-for="item in 3" class="overdue-img" src="@/assets/img/tower/overdue.png" />
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <carouselPagination
      v-if="pageType==2"
      @getCurrent="getCurrent"
      :current-page="currentPage"
      :page-size="pagesize"
      :total="total" />
  </div>
</template>

<script lang="ts" setup>

import { computed, inject, ref, reactive, onMounted } from 'vue'

const pageType = inject('pageType')
const carouselType = ref<boolean>(true)
const total = ref<number>(3)
const currentPage = ref<number>(1)
const pagesize = ref<number>(3)
const state = reactive({
  data2: []
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
//轮播图事件
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
