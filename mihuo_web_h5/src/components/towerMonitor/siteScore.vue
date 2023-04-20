<template>
  <div style="height:30%">
    <my-title title="工地评分" />
    <div class="site-score-data">
      <div class="data-left">
        <pentacle-canvas :score="state.data.averageScore" style="height:15rem;width: 100%;margin-top: -2.5rem" />
        <div :class="`chart-title2_${pageType}`">工地平均分</div>
      </div>
      <div class="data-left">
        <echart :options="semicircleEchatOptions" width="100%" height="15rem" />
        <div :class="`chart-title_${pageType}`">工地好评率</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { semicircleOptions, pieOptions, barOptions } from './echart-data'
import type { EChartOption } from 'echarts'
import { fetch } from '_@/axios-config/axios'
import { onMounted, reactive, ref, computed, inject } from 'vue'

const pageType = inject('pageType')
const percent = ref<number>(0)
const current = computed(() => {
  return 270 * percent.value
})
const all = ref<number>(270)
const semicircleEchatOptions = ref<EChartOption>({})
const state = reactive({
  data: {} as any
})

onMounted(() => {
  semicircleEchatOptions.value = {
    title: [{
      text: '80%',
      textStyle: {
        color: pageType == 1 ? '#ffffff' : '#409EFF',
        fontSize: 18,
        fontWeight: 400
      },
      left: 'center',
      top: 'center'
    }], angleAxis: {
      // 起始角度，180 也可以是 225
      startAngle: 180,
      max: 360,
      clockwise: true, // 逆时针
      // 隐藏刻度线
      show: false
    },
    radiusAxis: {
      type: 'category',
      show: true,
      axisLabel: {
        show: false
      },
      axisLine: {
        show: false

      },
      axisTick: {
        show: false
      }
    },
    polar: {
      center: ['50%', '50%'],
      radius: '170%' // 图形大小
    },
    series: [
      {
        type: 'bar',
        z: 2,
        // 数值
        data: [144],
        showBackground: true,
        backgroundStyle: {
          color: 'transparent'
        },
        coordinateSystem: 'polar',
        roundCap: true,
        barWidth: 7,
        barGap: '-100%',
        itemStyle: {
          normal: {
            opacity: 1,
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
                  color: 'rgba(64,158,255,1)' // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            },
            shadowBlur: 5,
            shadowColor: '#2A95F9'
          }
        }
      },
      {
        type: 'bar',
        z: 1,
        // 需要的圆环跨度大小，可以是180,270等
        data: [180],
        coordinateSystem: 'polar',
        roundCap: true,
        barWidth: 7,
        barGap: '-100%',
        itemStyle: {
          normal: {
            opacity: 1,
            color: 'rgba(64,158,255,0.1)'
          }
        }
      }
    ] as any
  }
})

</script>

<style scoped lang="less">
.site-score-data {
  display: flex;

  .data-left {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50%;
    flex-flow: column;

    .chart-title_1 {
      text-align: center;
      font-size: 14px;
      color: #FFFFFF;
      border-bottom: #409EFF 3px solid;
      margin: -4rem 0 3rem 0;
      padding-bottom: 1rem;
    }

    .chart-title2_1 {
      text-align: center;
      font-size: 14px;
      color: #FFFFFF;
      border-bottom: #F2AA3D 3px solid;
      margin: -4rem 0 0 0;
      padding-bottom: 1rem;
    }

    .chart-title_2 {
      text-align: center;
      font-size: 14px;
      color: #303133;
      border-bottom: #409EFF 3px solid;
      margin: -4rem 0 3rem 0;
      padding-bottom: 1rem;
    }

    .chart-title2_2 {
      text-align: center;
      font-size: 14px;
      color: #303133;
      border-bottom: #F2AA3D 3px solid;
      margin: -4rem 0 0 0;
      padding-bottom: 1rem;
    }
  }

}

</style>
