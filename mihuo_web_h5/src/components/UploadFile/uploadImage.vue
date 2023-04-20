<template>
  <div style="margin-bottom: -1.5rem">
    <el-upload
      :disabled="disabled"
      :action="apiUrl"
      :accept="isVideo ? 'video/*' : 'image/*'"
      :headers="headers"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :show-file-list="!isVideo"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :multiple="maxCount === 1 ? false : true"
      :limit="maxCount"
      :on-success="uploadSuccess"
      :on-exceed="handleExceed"
      :on-error="handleError"
      :class="fileListNew.concat(fileList).length >= maxCount ? 'el-upload--pic' : ''"
    >
      <el-icon size="4rem">
        <plus />
      </el-icon>
    </el-upload>
    <div v-if="isVideo && videoUrl" class="video-container">
      <!--  视频只允许有一个 -->
      <video
        autoplay
        :src="videoUrl"
        muted
        class="video-item"
      />
      <el-button
        type="text"
        style="margin: 0 !important;"
        class="danger"
        icon="delete"
        @click="handleVideoRemove"
      >移除视频</el-button>
    </div>
    <!--    <el-dialog-->
    <!--      v-model="dialogVisible"-->
    <!--      :close-on-press-escape="false"-->
    <!--      :close-on-click-modal="false"-->
    <!--      title="图片预览"-->
    <!--    >-->
    <!--      <el-image-->
    <!--        v-if="dialogVisible"-->
    <!--        :src="dialogImageUrl"-->
    <!--        alt=""-->
    <!--        :preview-src-list="fileList"-->
    <!--        :initial-index="0"-->
    <!--      />-->
    <!--    </el-dialog>-->

    <!--    //传送门-->
    <teleport v-if="dialogVisible" to="body">
      <el-image-viewer
        v-if="dialogVisible"
        :initial-index="imgStrIndex"
        :url-list="imgStr"
        @close="dialogVisible = false"
      />
    </teleport>
  </div>
</template>
<script lang="ts">
import { fetch } from '_@/axios-config/axios'
import { appStore } from '_@/store/modules/app'
import { ElMessage } from 'element-plus'
import wsCache from '@/cache'
import {
  defineComponent,
  reactive,
  toRefs,
  onMounted,
  watchEffect,
  ref
} from 'vue'
import { imageGlobal } from '@/global'
import config from '_@/axios-config/config'

export default defineComponent({
  props: {
    // 是否允许上传视频
    isVideo: {
      type: Boolean,
      default: false
    },
    // 图片属性数组
    modelValue: {
      type: String,
      default: ''
    },
    // 最大上传图片数量
    maxCount: {
      type: Number,
      default: 1
    },
    isEdits: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isBinary: { // 是否返回二进制文件流
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    const { default_headers, api_version } = config
    const userInfo = wsCache.get(appStore.userInfoDetail)
    // console.log(userInfo)
    const headers = ref({
      Authorization: !userInfo ? '' : userInfo.token_type + ' ' + userInfo.access_token,
      Headers: default_headers,
      VERSION: api_version
    })
    const apiUrl = ref('/admin/sys-file/upload')
    const state = reactive({
      videoUrl: '',
      disabled: props.disabled,
      imgStrIndex: 0,
      imgStr: [],
      imageGlobal: imageGlobal,
      dialogImageUrl: '',
      dialogVisible: false,
      imageFile: '',
      isVideo: props.isVideo,
      fileList: [] as any,
      fileName: [] as any,
      maxCount: props.maxCount,
      imageValue: props.modelValue as string,
      fileListNew: [] as any
    })

    // 上传前校验
    const beforeUpload = (file: any) => {
      const fileName = file.name.toLowerCase()
      const fileSize = file.size / 1024 / 1024 // 文件大小 单位MB
      const MAX_FILE_SIZE = state.isVideo ? 20 : 5
      if (fileSize > MAX_FILE_SIZE) {
        ElMessage.error(`${state.isVideo ? '视频' : '图片'}大小不能超过${MAX_FILE_SIZE}MB！请重新选择。`)
        return false
      }
      if (state.isVideo) {
        const isVideo = fileName.indexOf('.mp4') !== -1
        if (!isVideo) {
          ElMessage.error('视频类型仅支持上传mp4格式!')
          return false
        }
      } else {
        const isImage =
          fileName.indexOf('.png') !== -1 ||
          fileName.indexOf('.jpeg') !== -1 ||
          fileName.indexOf('.jpg') !== -1
        if (!isImage) {
          ElMessage.error('图片类型仅支持上传png、jpeg、jpg格式!')
          return false
        }
      }
    }

    // 移除视频
    const handleVideoRemove = () => {
      state.fileList = []
      state.fileListNew = []
      state.videoUrl = ''
      context.emit('update:modelValue', '')
    }

    // 删除图片时的钩子
    const handleRemove = (file: any, fileList: any) => {
      const imgStr: any = []
      fileList.forEach((item: any) => {
        if (item.response) {
          imgStr.push(item.response.data.fileName)
        } else {
          imgStr.push(item.url.replace(imageGlobal, ''))
        }
      })
      state.fileList = fileList
      state.fileListNew = []
      context.emit('update:modelValue', imgStr.toString())
    }

    // 点击预览的事件
    const handlePictureCardPreview = (file: any) => {
      const imgStr: any = []
      state.fileList.forEach((item: any, index: any) => {
        if (file.url == item.url) {
          state.imgStrIndex = index
        }
        imgStr.push(item.url)
      })
      state.imgStr = imgStr
      state.dialogImageUrl = file.url
      state.dialogVisible = true
    }

    // 图片上传数量超出限制
    const handleExceed = (files: any, fileList: any) => {
      ElMessage({
        message: '最多只能上传' + props.maxCount + (state.isVideo ? '个视频' : '张图片'),
        type: 'warning',
        duration: 1000
      })
    }

    const handleError = (res: any, file: any) => {
      // 上传失败时的钩子
      state.imageFile = file.raw
      const formData = new FormData()
      formData.append('file', state.imageFile)
      state.fileList.push({ url: file.url })
      context.emit('update:modelValue', state.imageFile)
    }

    // 上传成功时的钩子,版本更新后会有bug
    const uploadSuccess = (res: any, file: any) => {
      // element-plus2.1.0版本之后采用,element数据返回格式变了
      // state.fileList.forEach((item: any, index: any) => {
      //   if (item.response) {
      //     item.url = imageGlobal + item.response.data.fileName
      //   }
      // })
      if (res.code === 1) {
        // 图片上传失败， 一般是因为不合规
        const data = JSON.parse(res.data?.check)
        console.log(data)
        ElMessage.warning(`图片上传失败，${data.data[0].msg}`)
        state.fileList = []
      } else {
        // element-plus2.0.4版本
        const isVideo = res.data.fileName.indexOf('.mp4') !== -1
        if (isVideo) {
          state.videoUrl = imageGlobal + res.data.fileName
          state.fileListNew.push({
            url: imageGlobal + res.data.fileName,
            type: 'video'
          })
        } else {
          state.fileListNew.push({
            url: imageGlobal + res.data.fileName,
            type: 'image'
          })
        }
        const imgStr: any = []
        state.fileListNew.concat(state.fileList).forEach((item: any) => {
          if (item.type === 'video') {
            imgStr.push(item.url.replace(imageGlobal, ''))
          } else if (item.type === 'image') {
            imgStr.push(item.url.replace(imageGlobal, ''))
          }
        })
        context.emit('update:modelValue', imgStr.join())
        ElMessage.success('上传成功')
      }
    }

    onMounted(() => {
      apiUrl.value = props.isBinary ? '#' : '/admin/sys-file/upload'
      if (
        props.modelValue !== '' &&
        props.modelValue !== null &&
        props.modelValue !== undefined
      ) {
        const imageList: any = state.imageValue.split(',')
        imageList.forEach((item: any, index: any) => {
          const isVideo = item.indexOf('.mp4') !== -1
          if (isVideo) {
            state.videoUrl = imageGlobal + item
            state.isVideo = true
          }
          state.fileList.push({
            url: imageGlobal + item.replace(imageGlobal, ''),
            name: index,
            status: 0,
            uid: index
          })
        })
      }
    })

    return {
      handleRemove,
      handleVideoRemove,
      handleError,
      handlePictureCardPreview,
      handleExceed,
      apiUrl,
      uploadSuccess,
      headers,
      beforeUpload,
      ...toRefs(state)
    }
  }
})
</script>
<style lang="less">
.el-upload--pic {
  .el-upload {
    display: none;
  }
}

.video-container {
  width: 11rem;
  height: 14rem;
  margin-bottom: 1.5rem;

  .video-item {
    width: 11rem;
    height: 11rem;
  }
}
</style>
