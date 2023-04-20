<template>
  <div class="file-contain">
    <div class="file-upload">
      <div v-if="fileType === 'img'" class="file-upload-item">
        <div
          v-for="(item, index) in imgUploadUrl"
          :key="index"
          class="file-image-list"
        >
          <el-image
            preview-teleported
            class="file-imag-item"
            lazy
            :src="item"
            :preview-src-list="[item]"
          />
          <div class="item-icon" @click="imgDelete(index)">
            <span class="icon-delete">删除</span>
          </div>
        </div>
        <!--                {{imgUploadUrl.length}}-->
      </div>
      <div v-if="fileType === 'video'" class="file-upload-item">
        <div
          v-for="(item, index) in videoUploadUrl"
          :key="index"
          class="file-video-list"
        >
          <video
            :id="'myVideo1' + 'index'"
            ref="videoId"
            :src="item"
            style="height: 150px; width: 150px; margin-right: 10px"
            autoplay="true"
            controls
            muted
          />
          <div class="item-icon">
            <span class="icon-delete" @click="videoDelete(index)">删除</span>
          </div>
        </div>
      </div>
      <div v-if="fileType === 'audio'">
        <div
          v-for="(item, index) in audioUploadUrl"
          :key="index"
          class="file-audio-list"
        >
          <audio controls :src="item" />
          <span class="audio-delete" @click="audioDelete(index)">删除</span>
        </div>
        <div
          v-if="fileType === 'audio'"
          class="file-imag-upload-contain"
          @click="openFile"
        >
          <i class="el-icon-plus" style="font-size: 30px; font-weight: bold" />
        </div>
      </div>
      <div
        v-if="fileType !== 'audio'"
        class="file-imag-upload-contain"
        @click="openFile"
      >
        <el-icon :size="40"><plus /></el-icon>
      </div>
    </div>
    <input
      ref="uploadInput"
      style="display: none"
      type="file"
      multiple
      :accept="
        fileType === 'img'
          ? 'image/*'
          : fileType === 'video'
          ? 'video/*'
          : 'audio/*'
      "
      @change="handleFileChange"
    />
  </div>
</template>

<script lang="ts">
/** 文件上传
 * */
import {
  defineComponent,
  onMounted,
  onUnmounted,
  PropType,
  reactive,
  ref,
  toRefs,
  watch,
} from 'vue'
import { getPic } from '@/getPic'
import fileUpload from '@/assets/img/fileUpload.png'
import { fetch } from '_@/axios-config/axios'
import { ElMessage } from 'element-plus'
// import Viewer from 'v-viewer'
// import 'viewerjs/dist/viewer.css'
export default defineComponent({
  name: 'Index',
  // components: { Viewer },
  props: {
    fileType: {
      type: String,
      default: '',
    },
    multiple: {
      type: String,
      default: 'multiple',
    },
    propUrlList: {
      type: Array,
      default: () => [],
    },
    isEditor: {
      type: Boolean,
      default: false,
    },
    formBatch: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['changeUpload'],
  setup(props, { emit }) {
    const uploadInput = ref<HTMLElement | null>(null)
    const imgUploadUrl = ref<any>([])
    const fileUploadImg = ref(fileUpload)
    const videoPlayStatus = ref(false)
    const fileUrlList = ref<any>([])
    const fileList = ref<any>([])
    const fileInput = ref(null)
    const fileSize = ref<any>(1024 * 1024 * 50)
    const accept = ref('image/*')
    const videoUploadUrl = ref<any>([])
    const audioUploadUrl = ref<any>([])
    // const fileType = ref<any>('')
    const { fileType } = toRefs(props)
    const state = reactive({
      src: '',
    })
    watch(
      () => props.fileType,
      (val: any) => {
        imgUploadUrl.value = []
        videoUploadUrl.value = []
      }
    )

    watch(
      () => props.propUrlList,
      (val: any) => {
        switch (fileType.value) {
          case 'img':
            imgUploadUrl.value = val
            audioUploadUrl.value = []
            videoUploadUrl.value = []
            break
          case 'video':
            videoUploadUrl.value = val
            imgUploadUrl.value = []
            audioUploadUrl.value = []
            break
          case 'audio':
            audioUploadUrl.value = val
            imgUploadUrl.value = []
            videoUploadUrl.value = []
            break
        }
      }
    )

    onUnmounted(() => {
      fileList.value = []
      console.log('关闭。。。')
    })

    const handleFileChange = (e: Event) => {
      const input = e.target as HTMLInputElement
      const files = input.files
      if (files) {
        for (const file of files) {
          if (files[0].size > fileSize.value) {
            ElMessage.warning({
              message: '文件不能超过50MB',
              type: 'warning',
            })
            return
          }
          preview(file).then((res: any) => {
            switch (fileType.value) {
              case 'img':
                if (!props.formBatch) {
                  imgUploadUrl.value = []
                }
                imgUploadUrl.value.push(res)
                break
              case 'video':
                if (!props.formBatch) {
                  videoUploadUrl.value = []
                }
                videoUploadUrl.value.push(res)
                break
              case 'audio':
                if (!props.formBatch) {
                  audioUploadUrl.value = []
                }
                audioUploadUrl.value.push(res)
                break
            }
          })
          fileList.value.push(file)
        }
        emit('changeUpload', fileList)
      }
    }

    const fileBlur = () => {}
    const preview = (file: any) => {
      // 获取预览图片的base64
      return new Promise((resolve, reject) => {
        const read = new FileReader()
        read.readAsDataURL(file)
        read.onload = function (e) {
          resolve(this.result)
        }
      })
    }

    const openFile = () => {
      const oBtn = uploadInput.value as HTMLInputElement
      oBtn.value = ''
      if (!props.formBatch) {
        fileList.value = []
      }
      oBtn.click()
    }

    const imgDelete = (index: any) => {
      if (props.isEditor) {
        fileList.value = []
      } else {
        fileList.value.splice(index, 1)
      }
      imgUploadUrl.value.splice(index, 1)
      emit('changeUpload', fileList)
    }

    const videoDelete = (index: any) => {
      if (props.isEditor) {
        fileList.value = []
      } else {
        fileList.value.splice(index, 1)
      }
      videoUploadUrl.value.splice(index, 1)
      emit('changeUpload', fileList)
    }

    const audioDelete = (index: any) => {
      if (props.isEditor) {
        fileList.value = []
      } else {
        fileList.value.splice(index, 1)
      }
      audioUploadUrl.value.splice(index, 1)
      emit('changeUpload', fileList)
    }

    onMounted(() => {
      if (props.isEditor) {
        switch (props.fileType) {
          case 'img':
            imgUploadUrl.value = props.propUrlList
            break
          case 'video':
            videoUploadUrl.value = props.propUrlList
            break
          case 'audio':
            audioUploadUrl.value = props.propUrlList
            break
        }
      }
    })
    return {
      uploadInput,
      imgUploadUrl,
      fileUrlList,
      fileList,
      accept,
      fileUploadImg,
      videoUploadUrl,
      audioUploadUrl,
      videoPlayStatus,
      fileInput,
      audioDelete,
      imgDelete,
      videoDelete,
      openFile,
      handleFileChange,
      fileBlur,
      ...toRefs(state),
    }
  },
})
</script>

<style lang="less" scoped>
.file-contain {
}

.file-upload {
  cursor: pointer;
  border-radius: 5px;

  .file-imag-upload-contain {
    width: 148px;
    height: 148px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px dashed #c0ccda;

    &:hover {
      border: 1px dashed #409eff;
    }

    .file-imag-upload {
      width: 48px;
      height: 48px;
      background: #fbfdff;
    }
  }

  .file-image-list {
    position: relative;
    width: 148px;
    height: 148px;
    margin-right: 10px;
    margin-bottom: 10px;
    display: inline-flex;

    .file-imag-item {
      width: 148px;
      height: 148px;
    }

    .item-icon {
      display: none;
    }

    .icon-delete {
      margin-right: 10px;
    }

    &:hover {
      .item-icon {
        display: block;
        position: absolute;
        width: 148px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        left: 0px;
        top: 110px;
        color: #fff1f0;
        background: rgba(59, 60, 61, 0.5);
        // box-sizing: content-box;
        z-index: 999;
        cursor: pointer;
      }
    }
  }
}

.file-video-list {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;

  .item-icon {
    display: none;
  }

  &:hover {
    .item-icon {
      display: block;
      position: absolute;
      width: 148px;
      height: 40px;
      line-height: 40px;
      left: 0px;
      top: 0px;
      color: #fff1f0;
      background: rgba(59, 60, 61, 0.5);
      // box-sizing: content-box;
      z-index: 999;
      cursor: pointer;
      text-align: right;

      .icon-delete {
        margin-right: 10px;
      }
    }
  }
}

.file-audio-list {
  margin-bottom: 20px;
  display: flex;
  align-items: center;

  audio {
    height: 45px;
  }

  .audio-delete {
    margin-left: 15px;

    &:hover {
      color: #fd6d34;
      text-decoration: underline;
    }
  }
}

.audio-upload {
  margin-left: 15px;

  &:hover {
    color: #2d8cf0;
    display: inline-block;
    text-decoration: underline;
  }
}

.file-upload-item {
  /*display: inline-flex;*/
}
</style>
