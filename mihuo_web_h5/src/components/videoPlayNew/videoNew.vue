<template>
  <div class="video-play" :style="`width:${props.size}rem;height:${props.size}rem`">
    <video
      :src="props.src"
      class="video-item"
      playbackRate="1"
      loop="loop"
      muted="muted"
    />
    <div class="play-background" @click="openVideo">
      <el-icon :size="`${props.size*0.3}rem`" color="#ffffff">
        <caret-right />
      </el-icon>
    </div>
    <video-play-new v-model="dialogStatus" :videoSrc="src" />
  </div>

</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref } from 'vue'

const props = defineProps({
  size: {
    type: Number,
    default: 11
  },
  src: {
    type: String,
    default: ''
  }
})
const emit = defineEmits()
const dialogStatus = ref<boolean>(false)

const openVideo = () => {
  dialogStatus.value = !dialogStatus.value
}
</script>

<style scoped lang="less">
.play-button {
  width: 30% !important;
  height: 30% !important;
}

.play-posation {
  position: fixed;
  z-index: 9999;
  inset: 0;
  background: #303133;
  opacity: 0.5;
}

.video-play {
  position: relative;
  background: white;
}

.play-background {
  width: 60%;
  height: 60%;
  background: #000000;
  opacity: 0.3;
  border-radius: 100%;
  position: absolute;
  left: 20%;
  top: 20%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.5;
  }
}

.video-item {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  object-fit: cover;
}

</style>
