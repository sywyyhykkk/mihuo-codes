<template>
  <div v-if="dialogStatus" id="video-play-contain" class="video-play-contain" @click="getClose">
    <div class="video-container">
      <div class="video-box" @click.stop="">
        <video ref="videoRef" autoplay controls :src="propsSrc" />
      </div>
    </div>
    <span class="video-close" @click="getClose">
      <i class="el-icon-close item-video" style="font-size: 30px"></i
    ></span>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
  name: 'video-play',
  props: {
    propsSrc: {
      type: String,
      default: '',
    },
    dialogStatus: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['getClose'],
  setup(props, { emit }) {
    const videoRef = ref<any>(null)
    onMounted(() => {})

    const getClose = () => {
      emit('getClose')
    }
    return {
      videoRef,
      getClose,
    }
  },
})
</script>

<style lang="less" scoped>
.video-play-contain {
  position: absolute;
  right: 0;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 2000;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  .video-close {
    position: absolute;
    cursor: pointer;
    top: 13px;
    right: 10px;
    font-size: 22px;
    color: #ffff;
    transition: all 0.4s;

    &:hover {
      transform: rotate(180deg);
    }
  }
  .video-container {
    padding: 80px 30px 30px;
    left: 5px;
    top: 0;
    right: 0;
    position: absolute;
    bottom: 0;
    .video-box {
      width: 100%;
      height: 95%;
      background-color: #000;

      video {
        /*padding: 10px;*/
        border-radius: 6px;
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
