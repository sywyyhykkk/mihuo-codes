<template>
  <div class="stage-static-data">
    <div class="stage-static">
      <my-title title="工序/阶段验收统计" placement="right" :style="pageType==2?'margin-left:-3rem':''" />
      <div class="process-stage-data">
        <div class="process-stage-left" :style="pageType==2?'margin-right:-3rem':''">
          <div class="data-item">
            <div class="item-img">
              <span>3日</span>
            </div>
            <div :class="pageType==2?'pageColor':''">工序待验收</div>
            <div>109</div>
          </div>
          <div class="data-item">
            <div class="item-img">
              <span>今日</span>
            </div>
            <div :class="pageType==2?'pageColor':''">工序待验收</div>
            <div>109</div>
          </div>
          <echart :options="circleEchatOptions" width="100%" :height="'11rem'" style="margin-top: 3rem" />
          <div class="charts-title" :class="pageType==2?'pageColor':''">
            工序验收合格率
          </div>

          <div style="margin-bottom: 2rem" v-for="item in 4">
            <div class="progress-text"><span :class="pageType==2?'pageColor':''">水电阶段</span>&nbsp;<span
              :class="pageType==2?'pageColor2':''" style="opacity: 0.5 ">当前工地&nbsp;100</span></div>
            <linear-progress :data="Number(0.8)" color="linear-gradient(90deg, rgba(64, 158, 255, 0.2), #409EFF)" />
          </div>

        </div>
        <div class="process-stage-right" :style="pageType==2?'margin-right:-3rem':''">
          <div class="data-item">
            <div class="item-img2"><span>3日</span></div>
            <div :class="pageType==2?'pageColor':''">工序待验收</div>
            <div>109</div>
          </div>
          <div class="data-item">
            <div class="item-img2"><span>今日</span></div>
            <div :class="pageType==2?'pageColor':''">工序待验收</div>
            <div>109</div>
          </div>
          <echart :options="circleEchatOptions2" width="100%" :height="'11rem'" style="margin-top: 3rem" />
          <div class="charts-title" :class="pageType==2?'pageColor':''">
            工序验收合格率
          </div>

          <div style="margin-bottom: 2rem" v-for="item in 4">
            <div class="progress-text"><span :class="pageType==2?'pageColor':''">水电阶段</span>&nbsp;<span
              :class="pageType==2?'pageColor2':''" style="opacity: 0.5 ">当前工地&nbsp;100</span></div>
            <linear-progress :data="Number(0.8)" color="linear-gradient(90deg, rgba(103, 194, 58, 0.2), #67C23A)" />
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { barOptions } from './echart-data'
import type { EChartOption } from 'echarts'
import { inject } from 'vue'

const pageType = inject('pageType')
let percent = 0.8 //percent
let current = 270 * percent // 当前用量 = all * percent
let all = 270 //彩色部分总大小，自定义，和最下方bottom的值一起决定环形图的角度
const circleOptions2: EChartOption = {
  title: [{
    text: '75%',
    textStyle: {
      color: pageType == 1 ? '#ffffff' : '#409EFF',
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
    radius: '180%' //图形大小
  }, series: [{
    type: 'bar',
    data: [{
      value: 75,
      itemStyle: {
        normal: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(64, 158, 255, 0)' // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgba(64, 158, 255,0.99)' // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        }
      }
    }],
    coordinateSystem: 'polar',
    roundCap: true,
    barWidth: 5,
    barGap: '-100%', // 两环重叠
    radius: ['49%', '52%'],
    z: 2
  }, { // 灰色环
    type: 'bar',
    data: [{
      value: 100,
      itemStyle: { color: 'rgba(64,158,255,0.1)' }
    }],
    coordinateSystem: 'polar',
    barWidth: 5,
    barGap: '-110%', // 两环重叠
    radius: ['48%', '53%'],
    z: 1
  }]
}

const circleOptions3: EChartOption = {

  title: [{
    text: '75%',
    textStyle: {
      color: pageType == 1 ? '#ffffff' : '#67C23A',
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
    radius: '180%' //图形大小
  }, series: [{
    type: 'bar',
    data: [{
      value: 75,
      itemStyle: {
        normal: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: ' rgba(103, 194, 58, 0)' // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgba(103, 194, 58, 0.99)' // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        }
      }
    }],
    coordinateSystem: 'polar',
    roundCap: true,
    barWidth: 5,
    barGap: '-100%', // 两环重叠
    radius: ['49%', '52%'],
    z: 2
  }, { // 灰色环
    type: 'bar',
    data: [{
      value: 100,
      itemStyle: { color: 'rgba(64,158,255,0.1)' }
    }],
    coordinateSystem: 'polar',
    barWidth: 5,
    barGap: '-110%', // 两环重叠
    radius: ['48%', '53%'],
    z: 1
  }]
}

const circleEchatOptions = reactive<EChartOption>(circleOptions2)
const circleEchatOptions2 = reactive<EChartOption>(circleOptions3)

</script>

<style scoped lang="less">
@pageColor: #303133;
@pageColor2: #909399;
.pageColor {
  color: @pageColor;
}

.pageColor2 {
  color: @pageColor2;
}

.stage-static-data {
  height: auto;
}

.stage-static {
  //position: absolute;
  //bottom: 0;
  //left: 0;
  //right: 0;
  //top: 30rem;
  //height: calc(100% - 30rem);
}

.process-stage-data {
  display: flex;
  justify-content: space-between;
  height: calc(100% - 6rem);

  .process-stage-left {
    width: 50%;
    overflow-y: auto;
    padding-right: 3rem;
    color: #409EFF;
    height: 100%;
  }

  .process-stage-right {
    width: 50%;
    height: 100%;
    overflow-y: auto;
    padding-right: 3rem;
    color: #67C23A;
  }

  .progress-text {
    font-size: 13px;
    line-height: 24px;
    margin-bottom: 1rem;
  }

  .data-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 3rem;
    width: 80%;

    .item-img {
      background-image: url('~@/assets/img/tower/rocess_acceptance.png');
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 35px;

      span {
        font-size: 12px;
        margin-top: 1rem;
      }
    }

    .item-img2 {
      background-image: url('~@/assets/img/tower/intermediate_acceptance.png');
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 35px;

      span {
        font-size: 12px;
        margin-top: 1rem;
      }
    }
  }

  .charts-title {
    text-align: center;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }

}

::-webkit-scrollbar {
  display: none;
}
</style>
