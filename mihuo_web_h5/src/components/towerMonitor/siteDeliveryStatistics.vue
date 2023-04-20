<template>
  <div :class="`deliver-static_${pageType}`">
    <div class="site-deliver-static">
      <my-title title="工地按期交付统计" placement="right" :style="pageType==2?'margin-left:-3rem':''" />
      <div class="delivery-data">
        <div style="width: 35%">
          <echart :options="circleEchatOptions" width="100%" :height="'calc(100% - 6rem)'" />
        </div>
        <div :class="`data-statis-right_${pageType}`" :style="pageType==2?'margin-right:-3rem':''">
          <div style="margin-bottom: 2rem" v-for="item in 4">
            <div class="progress-text"><span>水电阶段</span>&nbsp;<span
              :style="pageType==1?'opacity: 0.5':'opacity: 0.5;color: #909399;' ">当前工地&nbsp;100</span></div>
            <linear-progress :data="Number(0.8)" :background="pageType==2?'#F3F4F8':''" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { pieOptions, barOptions } from './echart-data'
import type { EChartOption } from 'echarts'
import { inject, reactive } from 'vue'


const pageType = inject('pageType')
let percent = 0.8 //percent
let current = 270 * percent // 当前用量 = all * percent
let all = 270 //彩色部分总大小，自定义，和最下方bottom的值一起决定环形图的角度
const circleOptions: EChartOption = {
  title: [{
    text: '按期交付率',
    left: 'center',
    bottom: 25,
    textStyle: {
      color: 'rgba(34, 143, 254, 0.5)',
      fontSize: 12
    }
  }, {
    text: '75%',
    textStyle: {
      color: 'linear-gradient(-90deg, #67C23A 0.146484375%, #52C5FF 100%)',
      fontSize: 18,
      fontWeight: 400
    },
    left: 'center',
    top: 'center'
  }], angleAxis: {
    max: 100, // 满分
    clockwise: false, // 逆时针
    // 隐藏刻度线
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      show: false
    },
    splitLine: {
      show: false
    }
  },
  radiusAxis: {
    type: 'category',
    // 隐藏刻度线
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      show: false
    },
    splitLine: {
      show: false
    }
  },
  polar: {
    center: ['50%', '50%'],
    radius: '140%' //图形大小
  }, series: [{
    type: 'bar',
    data: [{
      name: '按期交付率',
      value: 75,
      itemStyle: {
        normal: {
          color: { // 完成的圆环的颜色
            colorStops: [{
              offset: 0,
              color: '#409EFF' // 0% 处的颜色
            }, {
              offset: 1,
              color: '#67C23A' // 100% 处的颜色
            }]
          }
        }
      }
    }],
    coordinateSystem: 'polar',
    roundCap: true,
    barWidth: 8,
    barGap: '-100%', // 两环重叠
    radius: ['49%', '52%'],
    z: 2
  }, { // 灰色环
    type: 'bar',
    data: [{
      value: 100,
      itemStyle: {
        color: pageType == 1 ? '#051C48' : '#D9ECFF'
      }
    }],
    coordinateSystem: 'polar',
    roundCap: true,
    barWidth: 8,
    barGap: '-110%', // 两环重叠
    radius: ['48%', '53%'],
    z: 1
  }]
}

const circleEchatOptions = reactive<EChartOption>(circleOptions)

</script>

<style scoped lang="less">
.deliver-static_1 {
  height: 45%;
}

.deliver-static_2 {
  height: auto;
}

.site-deliver-static {
  //position: absolute;
  //left: 0;
  //right: 0;
  //top: 0;
  //height: 30rem;
}

.delivery-data {
  display: flex;
  justify-content: space-between;
  height: calc(100% - 6rem);

  .charts-data {
    text-align: center;
    font-size: 12px;
    color: rgba(34, 143, 254, 0.5);
    line-height: 21px;
  }

  .data-statis-right_1 {
    width: calc(65% - 6rem);
    padding: 3rem;
    height: calc(100% - 6rem);
    overflow-y: auto;

    .progress-text {
      font-size: 13px;
      color: #228FFE;
      line-height: 24px;
      margin-bottom: 1rem;
    }

  }

  .data-statis-right_2 {
    width: calc(65% - 6rem);
    padding: 3rem;
    height: calc(100% - 6rem);
    overflow-y: auto;

    .progress-text {
      font-size: 13px;
      color: #228FFE;
      line-height: 24px;
      margin-bottom: 1rem;
    }

  }
}

::-webkit-scrollbar {
  display: none;
}
</style>
