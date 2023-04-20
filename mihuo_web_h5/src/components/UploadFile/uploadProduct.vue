<template>
  <div style="margin-bottom: -1.5rem">
    <!-- accept=".doc,.docx,.xlsx,.xls,.pdf,.png,.jpeg,.jpg" -->
    <el-upload
      :action="apiurl"
      :headers="headers"
      :show-file-list="false"
      :before-upload="beforeAvatarUpload"
      :multiple="maxCount === 1 ? false : true"
      :on-success="uploadSuccess"
      :on-exceed="handleExceed"
      :on-error="handleAvatarError"
      :disabled="disabled"
    >
      <div class="picture-div">
        <draggable
          v-model="fileList"
          tag="div"
          draggable="div"
          style="display: flex; flex-wrap: wrap;"
        >
          <div
            v-for="(item, index) in fileList"
            :key="index"
            class="img-only"
            @mouseover="mouseChange(true, index)"
            @mouseleave="mouseChange(false, index)"
          >
            <img
              v-if="item.type == 'img'"
              class="picture-img_only"
              :src="item.url"
              alt=""
              srcset=""
            >
            <video
              v-if="item.type =='video'"
              autoplay
              :src="item.url"
              style="height: 11rem; width: 11rem"
            />
            <span
              v-show="isHover && index == current"
              class="image-shaom"
            >
              <el-icon
                v-if="getFileHouzhui(item.url) == 'png' || getFileHouzhui(item.url) == 'jpeg' || getFileHouzhui(item.url) == 'jpg'"
                title="预览"
                @click.stop="handlePictureCardPreview(item.url)"
              ><zoom-in /></el-icon>
              <el-icon
                v-if="item.type == 'video'"
                title="观看"
                :size="24"
                @click.stop="handleVideoPlay(item.url)"
              ><CaretRight /></el-icon>
              <el-icon title="删除" @click.stop="deleteFile(item)"><delete /></el-icon>
            </span>
          </div>
        </draggable>
        <el-icon
          v-if="(fileList.length + beforeImage.length) < maxCount"
          size="4rem"
          class="el-icon_upload"
          color="#8c939d"
        >
          <plus />
        </el-icon>
      </div>
    </el-upload>
    <!-- 预览图片 -->
    <preview-image
      v-model="showViewer"
      :current="initialIndex"
      :src-list="previewList"
      :down-file="false"
    />
    <!-- 视频播放 -->
    <videoPlayNew
      v-model="videoPlay"
      :video-src="videoSrc"
    />
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
  ref,
  nextTick,
  inject, watch
} from 'vue'
import { imageGlobal } from '@/global'
import config from '_@/axios-config/config'
import { VueDraggableNext } from 'vue-draggable-next'

export default defineComponent({
  components: {
    draggable: VueDraggableNext
  },
  props: {
    // 图片属性数组
    modelValue: [String, Array],
    // 最大上传图片数量
    maxCount: {
      type: Number,
      default: 1
    },
    isEdits: {
      type: Boolean,
      default: false
    },
    isJson: { // 是否返回JOSN格式的数据
      type: Boolean,
      default: false
    },
    change: {
      type: Function,
      default: null
    },
    disabled: { // 是否禁用
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    const { default_headers, api_version } = config
    const testArr = ref([])
    const fileList = ref<any []>([])
    const userInfo = wsCache.get(appStore.userInfoDetail)
    const headers = ref({
      Authorization: !userInfo ? '' : userInfo.token_type + ' ' + userInfo.access_token,
      Headers: default_headers,
      VERSION: api_version
    })
    const apiurl = ref('/admin/sys-file/upload')
    const state = reactive({
      disabled: props.disabled,
      imageGlobal: imageGlobal,
      showViewer: false,
      imageFile: '' as any,
      fileName: [] as any,
      maxCount: props.maxCount,
      imageValue: props.modelValue as any,
      fileListNew: [] as any,
      initialIndex: '',
      previewList: [] as any,
      isHover: false,
      current: 0,
      beforeImage: [] as any,
      videoPlay: false,
      videoSrc: ''
    })

    watch(
      fileList,
      (v, v2) => {
        const dataFile = fileList.value.map((v: any) => v.url.replace(imageGlobal, ''))
        context.emit('update:modelValue', dataFile.join())
        context.emit('change')
      },
      { deep: true, immediate: false }
    )

    const handleVideoPlay = (url:any) => {
      state.videoPlay = true
      state.videoSrc = url
    }
    // 上传前校验
    const beforeAvatarUpload = (file: any) => {
      state.beforeImage.push(file)
      if (fileList.value.length + state.beforeImage.length > props.maxCount) {
        ElMessage.warning(`最多只能上传${props.maxCount}张图片`)
        return false
      }
      const fileName = file.name.toLowerCase()
      const isExcel = (fileName.indexOf('.png') != -1 || fileName.indexOf('.jpeg') != -1 || fileName.indexOf('.jpg') != -1 ||
        fileName.indexOf('.mp4') != -1)
      if (!isExcel) {
        ElMessage.error('支持上传doc、docx、xlsx、xls、pdf、ppt、pptx、cad、png、jpeg、jpg等格式文件!')
        return false
      }
    }

    const handlePictureCardPreview = (url: any) => {
      state.initialIndex = url
      state.showViewer = true
    }

    const handleAvatarError = (res: any, file: any) => {
      // 上传失败时的钩子
      state.imageFile = file.raw
    }

    const uploadSuccess = (res: any, file: any) => {
      // 上传成功时,清空上传前钩子中的图片
      state.beforeImage = []
      // 上传成功时的钩子
      state.fileListNew.push({
        url: imageGlobal + res.data.fileName,
        type: fileSuffix(res.data.fileName)
      })
      const imgStr: any = []
      const imgStrZs: any = []
      const preview: any = []
      fileList.value.concat(state.fileListNew).forEach((item: any) => {
        imgStr.push({
          url: item.url.replace(imageGlobal, ''),
          type: item.type
        })
        imgStrZs.push({
          url: item.url,
          type: item.type
        })
      })
      fileList.value = imgStrZs
      state.fileListNew = []
      const dataFile = imgStr.map((v: any) => v.url)
      state.previewList = preview
      context.emit('update:modelValue', dataFile.join())
      context.emit('change')
    }
    // 获取文件类型
    const fileSuffix = (url: string) => {
      const suffix = (url.split('.')[1]).toLowerCase()
      if (suffix == 'png' || suffix == 'jpeg' || suffix == 'jpg') {
        return 'img'
      }
      if (suffix == 'mp4' || suffix == 'm4v' || suffix == 'avi' || suffix == 'dat' || suffix == 'mkv' || suffix == 'flv' || suffix == 'vob') {
        return 'video'
      }
      return suffix
    }
    const getFileHouzhui = (type: any) => {
      if (type) {
        const hzou = type.replace(imageGlobal, '')
        return (hzou.split('.')[1]).toLowerCase()
      }
    }
    // 鼠标移入移除事件
    const mouseChange = (flag: boolean, index: number) => {
      state.isHover = flag
      state.current = index
    }
    // 删除事件
    const deleteFile = (item: any) => {
      // 删除时清空上传前钩子中的图片
      state.beforeImage = []
      const imgStr: any = []
      let imgStrDel: any = []
      imgStrDel = fileList.value
      imgStrDel.forEach((v: any, i: number) => {
        if (v.url == item.url) {
          imgStrDel.splice(i, 1)
        }
      })
      imgStrDel.forEach((item: any) => {
        imgStr.push({
          url: item.url.replace(imageGlobal, ''),
          type: item.type
        })
      })
      const preview: any = []
      const dataFile = imgStr.map((item:any) => item.url)
      imgStrDel = fileList.value
      state.previewList = preview
      context.emit('update:modelValue', dataFile.join())
    }
    onMounted(() => {
      const imgStr: any = []
      if (props.isJson) {
        state.imageValue = state.imageValue && typeof state.imageValue === 'string' ? JSON.parse(state.imageValue) : []
      }
      if (state.imageValue && state.imageValue.length) {
        const fileArr = state.imageValue.split(',')
        fileArr.forEach((item: any, index: any) => {
          fileList.value.push({
            url: imageGlobal + item.replace(imageGlobal, ''),
            type: fileSuffix(item)
          })
          // if (fileSuffix(item.url) == 'img') {
          //   imgStr.push(imageGlobal + item)
          // }
        })
        state.previewList = imgStr
      }
    })
    return {
      handleAvatarError,
      handlePictureCardPreview,
      apiurl,
      uploadSuccess,
      headers,
      beforeAvatarUpload,
      ...toRefs(state),
      fileSuffix,
      getFileHouzhui,
      mouseChange,
      deleteFile,
      handleVideoPlay,
      testArr,
      fileList
    }
  }
})
</script>
<style lang="less" scoped>
.el-upload--pic {
  .el-upload {
    display: none;
  }
}

.picture-div {
  display: flex;
  flex-flow: row wrap;
  // .picture-img{
  //   height: 11rem;
  //   width: 11rem;
  //   border-radius: 0.6rem;
  //   margin-bottom: 1rem;
  //   margin-right: 2rem;
  // }
  .img-only {
    height: 11rem;
    width: 11rem;
    border-radius: .6rem;
    object-fit: cover;
    position: relative;
    margin-bottom: 1rem;
    margin-right: 2rem;
    border: 1px #DCDFE6 solid;

    .image-shaom {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: .6rem;
      left: 0;
      top: 0;
      background-color: rgba(0, 0, 0, .5);
      display: flex;
      justify-content: center;
      align-items: center;

      &:hover {
        opacity: 1;
      }

      .el-icon {
        color: #fff;
        font-size: 2.4rem;
        padding: .5rem;
        cursor: pointer;
      }
    }

    img {
      width: 100%;
      height: 100%;
      border-radius: .6rem;
      object-fit: cover;

      &.picture-img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50%;
        height: 50%;
      }

      &.picture-img_only {
        position: absolute;
        top: 50%;
        left: 50%;
        border-radius: 0;
        transform: translate(-50%, -50%);
        height: 80%;
        object-fit: cover;
      }
    }
  }
}

.el-icon_upload {
  height: 11rem;
  width: 11rem;
  border-radius: 0.6rem;
  border: 1px dashed #d9d9d9;
  margin-bottom: 1rem;

  &:hover {
    border: 1px dashed #409EFF;
  }
}
</style>
