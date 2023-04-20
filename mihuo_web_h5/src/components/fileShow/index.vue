<template>
  <div class="file-contain">
    <div class="file-upload" v-for="item in fileList" :key="item.url">
      <div v-if="item.type === 'img'" class="file-upload-item">
        <div class="file-image-list">
          <el-image
            preview-teleported
            class="file-imag-item"
            lazy
            :src="$getUrl.getPicUrl(item.url, true)"
            :preview-src-list="[$getUrl.getPicUrl(item.url, false)]"
          />
        </div>
        <!--                {{imgUploadUrl.length}}-->
      </div>
      <div v-if="item.type === 'video'" class="file-upload-item">
        <div class="file-video-list">
          <video
            :id="'myVideo1' + 'index'"
            ref="videoId"
            :src="$getUrl.getPicUrl(item.url, false)"
            style="height: 150px; width: 150px; margin-right: 10px"
            autoplay="false"
            controls
            muted
          />
        </div>
      </div>
      <div v-if="item.type === 'audio'" class="file-upload-item">
        <div class="file-audio-list">
          <audio controls :src="$getUrl.getPicUrl(item.url, false)" />
        </div>
      </div>
    </div>
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
  watch
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
      default: ''
    },
    multiple: {
      type: String,
      default: 'multiple'
    },
    propUrlList: {
      type: String,
      default: () => []
    },
    isEditor: {
      type: Boolean,
      default: false
    },
    formBatch: {
      type: Boolean,
      default: true
    }
  },
  emits: ['changeUpload'],
  setup(props, { emit }) {
    const uploadInput = ref<HTMLElement | null>(null)
    const imgUploadUrl = ref<any>([])
    const fileUploadImg = ref(fileUpload)
    const videoPlayStatus = ref(false)
    const fileUrlList = ref<any>([])
    const fileInput = ref(null)
    const fileSize = ref<any>(1024 * 1024 * 50)
    const accept = ref('image/*')
    const videoUploadUrl = ref<any>([])
    const audioUploadUrl = ref<any>([])
    // const fileType = ref<any>('')
    const { fileType } = toRefs(props)
    const state = reactive({
      src: '',
      fileList: []
    })
    console.log(props.propUrlList)
    state.fileList = props.propUrlList ? JSON.parse(props.propUrlList) : []
    watch(
      () => props.propUrlList,
      (val: any) => {
        state.fileList = JSON.parse(props.propUrlList)
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
    const handleFileChange = (e: Event) => {
      const input = e.target as HTMLInputElement
      const files = input.files
      if (files) {
        for (const file of files) {
          if (files[0].size > fileSize.value) {
            ElMessage.warning({
              message: '文件不能超过50MB',
              type: 'warning'
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
        }
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

    const openFile = () => {}

    const imgDelete = (index: any) => {}

    const videoDelete = (index: any) => {}

    const audioDelete = (index: any) => {}

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
      ...toRefs(state)
    }
  }
})
</script>

<style lang="less" scoped>
.file-contain {
  display: flex;
  flex-flow: wrap;
}

.file-upload {
  cursor: pointer;
  border-radius: 5px;
  margin: 1rem 0;

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
