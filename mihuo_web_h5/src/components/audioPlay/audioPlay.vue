<template>
  <div class="dropdown-menu_main-audio">
    <img
      @click="handlePlayAudio"
      :src="isPlay?require('@/assets/img/stop.png'):require('@/assets/img/play.png')"
    >
    <audio
      ref="audio"
      :src="props.src"
      @ended="audioEnd"
      @timeupdate="updateTime"
      @durationchange='audioDate'
      @canplay="getDuration"
    ></audio>
    <div v-if="isPlay" class="audio-play">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div v-else class="audio-stop">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    <span class="audio-time">
            <i>{{ currentTime + 's' }}</i>
        </span>
  </div>
</template>

<script lang='ts' setup>
import { defineComponent, onMounted, ref, defineProps } from 'vue'
import { thumbnailImage } from '_c/project/projectItem/projectDetailNewData'

const audio: any = ref(null)
const isPlay = ref<boolean>(false)
const duration = ref<any>('00:00')
const currentTime = ref<number>(0)
const totaltime = ref<any>()
const timer = ref<any>()
const props = defineProps({
  src: {
    type: String,
    default: () => ''
  }
})
// 开始播放音频
const interval = () => {
  timer.value = setInterval(() => {
    currentTime.value--
    if (currentTime.value <= 0) {
      currentTime.value = totaltime.value
      clearInterval(timer.value)
    }
  }, 1000)
}
const handlePlayAudio = () => {
  isPlay.value = !isPlay.value
  if (isPlay.value) {
    audio.value.play()
    interval()
  } else {
    audio.value.pause()
    clearInterval(timer.value)
  }
}
// 音频播放结束
const audioEnd = () => {
  isPlay.value = false
  clearInterval(timer.value)
  currentTime.value = totaltime.value
}
// 获取视频时长
const updateTime = (e: any) => {
  // currentTime.value = parseInt(e.target.currentTime)
}
// 获取音乐总时长
const audioDate = (e: any) => {
  totaltime.value = parseInt(e.target.duration)
  currentTime.value = totaltime.value
}
// 计算音乐进度
const progress = () => {
  let length: Number = currentTime.value / duration.value *
    100
}

// 秒数转换分+秒
const changeDate = (s: any) => {
  var h: any
  h = Math.floor(s / 60)
  s = s % 60
  h += ''
  s += ''
  h = (h.length == 1) ? '0' + h : h
  s = (s.length == 1) ? '0' + s : s
  if (isNaN(h)) {
    return ''
  }
  return h + ':' + s
}

</script>

<style scoped lang="less">
.dropdown-menu_main-audio {
  padding: .5rem 1rem;
  color: #0969DA;
  margin: 0 !important;
  display: flex;
  align-items: center;
  background: #ECF5FF;
  border-radius: 1.4rem;
  min-width: 8rem;

  .audio-time {
    margin-left: auto;

    i {
      font-style: normal;
    }
  }

  img {
    width: 2rem;
    height: 2rem;
    cursor: pointer;
  }

  .audio-play {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 1rem;
    padding-left: .5rem;
    span {
      width: .1rem;
      background: #0969DA;
      -webkit-animation: bodong 0.5s infinite ease;

      &:first-child {
        -webkit-animation-delay: .3s;
      }

      &:nth-child(2) {
        -webkit-animation-delay: .4s;
      }

      &:nth-child(3) {
        -webkit-animation-delay: .5s;
      }

      &:nth-child(4) {
        -webkit-animation-delay: .3s;
      }
    }
  }

  .audio-stop {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 1rem;
    padding-left: .5rem;

    span {
      width: .1rem;
      height: .3rem;
      background: #0969DA;

      &:nth-child(2) {
        height: .5rem;
      }

      &:nth-child(3) {
        height: 1rem;
      }

      &:nth-child(4) {
        height: 1.5rem;
      }
    }
  }
}

@-webkit-keyframes bodong {
  0% {
    height: .5rem;
    background: #0969DA;
  }
  30% {
    height: 1.5rem;
    background: #0969DA;
  }
  60% {
    height: 2rem;
    background: #0969DA;
  }
  80% {
    height: 1.5rem;
    background: #0969DA;
  }
  100% {
    height: .5rem;
    background: #0969DA;
  }
}
</style>
