<template>
  <div class="inspection-today">
    <my-title title="今日巡检验收执行" placement="right" />
    <div class="body-height">
      <ul v-if="carouselType" class="my-carousel">
        <li v-for="(item,index) in dataList" :key="index">
          <div v-if="item.dataIndex>3" class="li-number li-number__primary">{{ item.dataIndex }}</div>
          <img v-if="item.dataIndex==1" src="@/assets/img/tower/medal_ranking_1.png" class="medal-ranking">
          <img v-if="item.dataIndex==2" src="@/assets/img/tower/medal_ranking_2.png" class="medal-ranking">
          <img v-if="item.dataIndex==3" src="@/assets/img/tower/medal_ranking_3.png" class="medal-ranking">

          <div class="li-skill-name" style="margin-left: 2rem">
            <img :src="$getUrl.getPicUrl(item.avatar)" class="skill-name-avatar" @error="$getUrl.imageError($event)">
            <div class="skill-name-text">{{ item.name }}</div>
          </div>
          <div class="li-skill-name" style="justify-content: center">{{ item.skillName }}</div>
          <div class="check-number " :class="item==4?'no-number':''">{{ item.inspectNum }}次巡检</div>
          <div class="acceptance-number">{{ item.acceptanceNum }}次验收</div>
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
import { fetch } from '../../pages/admin/axios-config/axios'
import { computed, inject, onMounted, reactive, ref } from 'vue'

const pageType = inject('pageType')
const carouselType = ref<boolean>(true)
const total = ref<number>(3)
const currentPage = ref<number>(1)
const pagesize = ref<number>(7)
const state = reactive({
  data: []
})

const dataList = computed(() => {
  return state.data.slice(currentPage.value * pagesize.value - pagesize.value, currentPage.value * pagesize.value)
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
