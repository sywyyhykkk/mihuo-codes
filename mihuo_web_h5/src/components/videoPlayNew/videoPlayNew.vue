<template>
  <teleport to="body" v-if="dialogVideo">
    <div
      v-if="dialogVideo"
      class="video-play"
      @click="onClose">
      <video @click.stop class="video-play-box" ref="videoRef" controls :src="videoSrc" />
      <!-- <span class="preview-image_close" @click="onClose">
          <el-icon><close-bold /></el-icon>
      </span> -->
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import { defineProps, onMounted, ref } from 'vue'

const videoRef = ref<any>(null)
const dialogVideo = ref<boolean>(false)
const emit = defineEmits([''])
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: () => false
  },
  videoSrc: {
    type: String,
    default: () => ''
  }
})
const onClose = () => {
  dialogVideo.value = false
  emit('update:modelValue', dialogVideo.value)
}
onMounted(() => {

})
watchEffect(() => {
  dialogVideo.value = props.modelValue
})
</script>

<style lang="less" scoped>
.video-play {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: rgba(0, 0, 0, .4);
  overflow: hidden;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;

  .video-play-box {
    max-height: 80%;
    max-width: 80%;
  }

  .preview-image_close {
    z-index: 99;
    position: absolute;
    top: 2rem;
    right: 2rem;
    background: #606266;
    padding: 1rem;
    border-radius: 50%;
    cursor: pointer;

    &:hover {
      background: #909399;
    }

    .el-icon {
      color: #fff;
      font-size: 1.6rem;
    }
  }
}
</style>
