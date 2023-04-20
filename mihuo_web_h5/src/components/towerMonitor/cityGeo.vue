<template>
  <div class="city-geo">
    <echart
      :options="cityEchartOptions"
      height="calc(100% - 15rem)"
      class="geo-echart"
    />

    <div
      class="up-down"
      :style="pageType == 2 ? 'background:rgba(243, 244, 248, 0.4)' : ''"
    >
      <ul>
        <li v-for="item in 20">
          <span :style="pageType == 2 ? 'color:#4C4C4C' : ''"
            >【工人】张三获得五星好评{{ item }}</span
          >
          <span :style="pageType == 2 ? 'color:#C0C4CC' : ''"
            >云纺国际商厦A座1603</span
          >
          <span :style="pageType == 2 ? 'color:#C0C4CC' : ''"> 11:32</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { cityOptions } from './echart-data'
import type { EChartOption } from 'echarts'

const cityEchartOptions = reactive<EChartOption>(cityOptions)
const pageType = inject('pageType')
</script>

<style scoped lang="less">
@import 'tower';

.city-geo {
  height: 100%;
}

.geo-echart {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 15.4rem;
}

.up-down {
  position: absolute;
  width: 456px;
  height: 120px;
  background: rgba(5, 28, 72, 0.4);
  border-radius: 10px;
  margin-left: calc(100% - 536px);
  padding: 2rem;
  overflow-y: hidden;
  bottom: 1rem;
}

ul {
  position: absolute;
  width: calc(100% - 4rem);
  -webkit-animation: up-down-by 30s linear infinite;
  animation: up-down-by 30s linear infinite;

  li {
    width: 100%;
    font-size: 12px;
    margin-bottom: 15px;
    display: flex;

    &:before {
      content: '\2022'; //圆点
      color: #67c23a; //颜色
      font-size: 16px; //大小
    }

    span:nth-child(1) {
      width: 50%;
      color: rgba(255, 255, 255, 0.4);
    }

    span:nth-child(2) {
      width: 40%;
      color: rgba(255, 255, 255, 0.2);
    }

    span:nth-child(3) {
      width: 10%;
      color: rgba(255, 255, 255, 0.2);
    }
  }
}

::-webkit-scrollbar {
  display: none;
}
</style>
