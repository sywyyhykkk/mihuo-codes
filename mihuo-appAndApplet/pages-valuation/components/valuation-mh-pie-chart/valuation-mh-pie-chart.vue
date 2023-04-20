<template>
  <view class="pie-chart flex-center">
    <view
      class="chart"
      v-if="chartData.length > 1"
      :style="{ width: chartSize, height: chartSize, background: pieChart }"
    ></view>
    <view
      class="chart"
      v-else
      :style="{ width: chartSize, height: chartSize, background: pieChart }"
    ></view>
    <view
      class="mask-chart flex-center"
      :style="{ width: maskSize, height: maskSize, backgroundColor: maskColor }"
      v-if="isShowMask"
    >
      <view class="total-number" v-if="isShowTotal"> {{ chartTotal }} </view>
    </view>
  </view>
</template>

<script>
const MAGIC_NUMBER = 3.1415
export default {
  name: 'valuation-mh-pie-chart',
  props: {
    // 中间显示的数值
    chartTotal: {
      type: Number,
      default: 0
    },
    // 是否显示中间数字
    isShowTotal: {
      type: Boolean,
      default: true
    },
    // 饼图数据 最多只显示6种
    chartData: {
      type: Array,
      default: () => {
        return [10, 10, 10, 10, 10, 10]
      }
    },
    // 是否显示中间遮罩
    isShowMask: {
      type: Boolean,
      default: false
    },
    // 遮罩颜色
    maskColor: {
      type: String,
      default: '#FFFFFF'
    },
    // 饼图的颜色
    colors: {
      type: Array,
      default: () => {
        return [
          '#fe6e32',
          '#f8de4b',
          '#81c462',
          '#62b3d7',
          '#f8be47',
          '#31945f',
          '#e74d53'
        ]
      }
    },
    // 饼图尺寸
    chartSize: {
      type: String,
      default: '250rpx'
    },
    // 遮罩尺寸
    maskSize: {
      type: String,
      default: '200rpx'
    }
  },
  data() {
    return {
      pieChart: '',
      total: 0,
      backColors:[]   //新返颜色组合
    }
  },
  mounted() {
    if (this.chartData.length === 0) {
      this.generateChart([10, 10, 10, 10, 10, 10])
    } else {
      this.generateChart(this.chartData.slice(0, 6))
    }
  },
  methods: {
    // 生成饼图
    generateChart(dataArr) {
      if (dataArr.length == 1) {
        this.totalCost = dataArr[0]
        this.pieChart = this.colors[0]
        return
      }

      let gapCount = 0

      function getSum(arr) {
        if (!arr.length) return 0
        const result = arr.reduce((pre, next) => pre + next)
        return result == 360 ? '' : result + 'deg'
      }

      let arr = JSON.parse(JSON.stringify(dataArr))
      let arrCopy = JSON.parse(JSON.stringify(dataArr))

      if (this.isShowMask) {
        for (let i = 1; i < dataArr.length * 2 - 1; i += 2) {
          arrCopy.splice(i, 0, 'gap')
        }
      }

      let total = getSum(arr)

      if (total) total = total.replace('deg', '')

      this.total = total

      arr = arrCopy.map(item => {
        if (this.isShowMask) {
          if (item != 'gap') {
            return (item / total) * (360 - arr.length * MAGIC_NUMBER)
          } else {
            gapCount++
            return MAGIC_NUMBER
          }
        } else {
          return (item / total) * 360
        }
      })

      let str = []

      arr.unshift(0)

      for (let i = 1; i < arr.length; i++) {
        let pre = getSum(arr.slice(0, i))
        let next = getSum(arr.slice(0, i + 1))
        let sum
        if (next) {
          sum = pre + ' ' + next
        } else {
          sum = pre
        }
        str.push(sum)
      }

      if (this.isShowMask) {
        const last = str[str.length - 1].split(' ')[1].replace('deg', '')
        str.push(`${last}deg 360deg`)
      }
      let colorStr = 'conic-gradient('
      let colorsCopy = this.colors
      this.backColors = []
      for (let i = 0; i < str.length; i++) {
        if (this.isShowMask) {
          const last1 = str[i].split(' ')[0].replace('deg', '')
          const last2 = str[i].split(' ')[1].replace('deg', '')
          if (Math.abs(last1 - last2).toFixed(4) == MAGIC_NUMBER) {
            // 白色gap
            colorStr += '#FFFFFF' + ' ' + str[i] + ', '
          } else {
            // 真实数据
            let index = i > gapCount ? i - gapCount : i
            colorStr += colorsCopy[index] + ' ' + str[i] + ', '
            // 避免重复颜色
            this.backColors.push(colorsCopy[index])
            colorsCopy.splice(i, 1)
          }
        } else {
          colorStr += colorsCopy[i] + ' ' + str[i] + ', '
        }
      }

      colorStr = colorStr.slice(0, colorStr.length - 2)
      colorStr += ')'
      // 最终生成一个background-image的css样式
      this.pieChart = colorStr
      // 新组合的颜色数组，返给父组件，保持颜色一致
      if(this.backColors && this.backColors.length) this.$emit("newColors",this.backColors)
    }
  }
}
</script>

<style lang="scss" scoped>
.pie-chart {
  justify-content: center;

  .chart {
    width: 250rpx;
    height: 250rpx;
    border-radius: 50%;
  }

  .mask-chart {
    border-radius: 50%;
    background-color: #ffffff;
    position: absolute;
    justify-content: center;

    .total-number {
      font-size: 30rpx;
      font-weight: bold;
    }
  }
}

.flex-center {
  display: flex;
  align-items: center;
}
</style>
