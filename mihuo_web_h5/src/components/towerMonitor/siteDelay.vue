<template>
  <div class="site-delay">
    <my-title title="在建工地延期情况" />
    <div class="site-delay-scroll body-height">
      <ul v-if="carouselType" class="my-carousel">
        <li v-for=" item in dataList">
          <my-tooltip :content="`延期${item.finishNum}天`" :data-color="getMyColor(item.finishNum)" />
          <div class="li-right">
            <div :class="`li-title_${pageType}`">{{ item.address }}</div>
            <div class="li-dot" :style="`background:${getMyColor(item.finishNum).color}`" />
            <div :class="`li-data_${pageType}`" style="width: 110%">
              <div>【项目经理】{{ item.pioneerName }}</div>
              <div>水电开槽【水电工】张三</div>
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
import { ref, reactive, onMounted, inject, computed } from 'vue'
import { fetch } from '_@/axios-config/axios'

const pageType = inject('pageType')
const visible = ref<boolean>(true)
const carouselType = ref<boolean>(true)
const total = ref<number>(3)
const currentPage = ref<number>(1)
const pagesize = ref<number>(4)
const state = reactive({
  data: [] as any,
  data2: [{ finishNum: 1000, pioneerName: '威威', address: '云纺国际商厦' }, {
    finishNum: 190,
    pioneerName: '威威',
    address: '云纺国际商厦'
  },
  { finishNum: 90, pioneerName: '威威', address: '云纺国际商厦' },
  { finishNum: 68, pioneerName: '威威', address: '云纺国际商厦' }, {
    finishNum: 28,
    pioneerName: '威威',
    address: '云纺国际商厦'
  }, {
    finishNum: 6,
    pioneerName: '威威',
    address: '云纺国际商厦'
  }, {
    finishNum: 5,
    pioneerName: '威威',
    address: '云纺国际商厦'
  }, {
    finishNum: 2,
    pioneerName: '威威',
    address: '云纺国际商厦'
  }]
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

const getMyColor = (data: any) => {
  if (data >= 1000) {
    return {
      color: '#F56C6C',
      background: 'linear-gradient(90deg, rgba(255, 92, 96, 0.1), rgba(255, 92, 96, 0.6))',
      arrowColor: 'rgba(255, 92, 96, 0.6)'
    }
  }
  if (data >= 100 && data < 1000) {
    return {
      color: '#F2AA3D',
      background: 'linear-gradient(90deg, rgba(242, 170, 61, 0.1), rgba(242, 170, 61, 0.6))',
      arrowColor: 'rgba(242, 170, 61, 0.6)'
    }
  }
  if (data >= 10 && data < 100) {
    return {
      color: '#B965E0',
      background: 'linear-gradient(90deg, rgba(185, 101, 224, 0.1), rgba(185, 101, 224, 0.6));',
      arrowColor: 'rgba(185, 101, 224, 0.6)'
    }
  }
  if (data < 10) {
    return {
      color: '#409EFF',
      background: 'linear-gradient(90deg, rgba(64, 158, 255, 0.1), rgba(64, 158, 255, 0.6));',
      arrowColor: 'rgba(64, 158, 255, 0.6)'
    }
  }
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
