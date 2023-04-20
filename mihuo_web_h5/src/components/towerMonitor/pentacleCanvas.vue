<template>
  <div class="my-canvas">
    <canvas id="canvas" />
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect, defineProps, nextTick, inject } from 'vue'

const props = defineProps({
  score: {
    type: Number,//left,right
    default: 0
  }
})
const pageType = inject('pageType')
const canvasWidth = ref(0)
const canvasHeight = ref(0)
const scoreValue = ref<number>(0)

// 角度转化成弧度
const getRadianFromAngle = (angle: any) => (Math.PI / 180) * angle
// 封装下cos  sin
const cos = (angle: any) => Math.cos(getRadianFromAngle(angle))
const sin = (angle: any) => Math.sin(getRadianFromAngle(angle))


const getStarPath = ({ x, y, R, r, rotate = 0 }: any) => {
  const canvas: any = document.querySelector('#canvas')
  canvas.width = canvasWidth.value
  canvas.height = canvasHeight.value

  const ctx = canvas.getContext('2d')

  let score = 100
  const timer = setInterval(() => {
    //
    score = score - 1
    if (score <= (5 - scoreValue.value) * 16) {
      score = (5 - scoreValue.value) * 16
      clearInterval(timer)
    }
    ctx.beginPath()//指定路径
    const horn = 5
    const angle = 360 / horn
    for (let i = 0; i < horn; i++) {
      ctx.lineTo(R * cos(18 + i * angle - rotate) + x, -R * sin(18 + i * angle - rotate) + y)
      ctx.lineTo(r * cos(54 + i * angle - rotate) + x, -r * sin(54 + i * angle - rotate) + y)
    }
    ctx.closePath()
    // 2.设置状态
    ctx.lineWidth = '1'//线条宽度
    ctx.strokeStyle = pageType == 2 ? '#fff' : '#051C48'//线条颜色
    ctx.fillStyle = pageType == 2 ? '#fff' : '#051C48'
    ctx.fill()
// 3.绘制
    ctx.stroke()
    ctx.closePath()
    // 创建渐变
    var gradient = ctx.createLinearGradient(0, y + R, 0, y - R + score)//线性渐变
    gradient.addColorStop('0', 'rgba(242, 170, 61, 0.1)')
    gradient.addColorStop('1', '#F2AA3D')
    gradient.addColorStop('1', pageType == 2 ? '#fff' : '#051C48')


    // 2.设置状态
    ctx.lineWidth = '1'
    // 用渐变进行填充
    ctx.strokeStyle = 'rgba(242, 170, 61, 0.5)' //线条颜色
    ctx.fillStyle = gradient //背景填充色
    ctx.fill()
    ctx.stroke()//绘制

    //中间字体
    ctx.font = '18px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = pageType==2?'#1A1A1A':'#fff' // text color
    ctx.fillText(scoreValue.value, x, y)
  }, 10)

}


watchEffect(() => {
  scoreValue.value = props.score
  nextTick(() => {
    const canvas: any = document.querySelector('.my-canvas')
    canvasWidth.value = canvas.clientWidth
    canvasHeight.value = canvas.clientHeight

    getStarPath({ x: canvas.clientWidth / 2, y: 50, R: 30, r: 18 })
  })

})

</script>

<style scoped>

</style>
