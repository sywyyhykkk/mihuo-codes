<template>
  <div id="bar-box" ref="barRef" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Bar } from '@antv/g2plot'

const barRef = ref()

onMounted(() => {
  renderBar()
})

function renderBar() {
  const data = [
    { label: '整装', value: 38, type: 'value' },
    { label: '局改', value: 52, type: 'value' },
    { label: '翻新', value: 61, type: 'value' },
    { label: '维修', value: 48, type: 'value' }
  ]
  // eslint-disable-next-line no-return-assign
  const total = data.reduce((prev, cur) => (prev += cur.value), 0)
  const arr = data.map((item) => ({ ...item, value: total, type: 'total' }))

  const bar = new Bar(barRef.value, {
    data: data.concat(arr),
    color: ['#409EFF', '#f0f0f0'],
    xField: 'value',
    yField: 'label',
    seriesField: 'type',
    isPercent: true,
    isStack: true,
    legend: false,
    tooltip: false,
    xAxis: false,
    interactions: [{ type: 'tooltip', enable: false }],
    label: {
      position: 'right',
      content: (item) => {
        if (item.type === 'value') {
          return (Math.round(item.value * 10000) / 100).toString() + '%'
        }
      },
      style: {
        fill: '#409EFF'
      }
    },
    barWidthRatio: 0.5
  })

  bar.render()
}
</script>

<style scoped lang="less">
#bar-box {
  width: 600px;
  height: 100%;
}
</style>
