<template>
  <div>
    <!--    <panel-group />-->
    <!--    <el-row :gutter="20">-->
    <!--      <el-col :span="10">-->
    <!--        <div class="chart__wrap">-->
    <!--          <echart :options="pieEchatOptions" :height="'300px'" />-->
    <!--        </div>-->
    <!--      </el-col>-->
    <!--      <el-col :span="14">-->
    <!--        <BoxshowContainer>-->
    <!--          <div class="chart__wrap">-->
    <!--            <echart :options="barEchatOptions" :height="'300px'" />-->
    <!--          </div>-->
    <!--        </BoxshowContainer>-->
    <!--      </el-col>-->
    <!--    </el-row>-->
    <!--    <BoxshowContainer>-->
    <!--      <div class="chart__wrap">-->
    <!--        <echart :options="lineEchatOptions" :height="'300px'" />-->
    <!--      </div>-->
    <!--    </BoxshowContainer>-->
    <tower-monitor-index v-if="pageType==1" v-model="pageType" />
    <tower-monitor-wite v-if="pageType==2" v-model="pageType" />
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, provide, reactive, ref } from 'vue'
import Echart from '_c/Echart/index.vue'
import { lineOptions, pieOptions, barOptions } from './echart-data'
import type { EChartOption } from 'echarts'

const pageType = ref<number>(2)
const lineEchatOptions = reactive<EChartOption>(lineOptions)
const pieEchatOptions = reactive<EChartOption>(pieOptions)
const barEchatOptions = reactive<EChartOption>(barOptions)
const isdones = ref<boolean>(true)
</script>

<style lang="less" scoped>
.chart__wrap {
  margin-bottom: 20px;
  border-radius: 5px;
  background-color: @contentBg;
  padding: 10px;
}
</style>
