<template>
  <div style="margin-bottom: -1.5rem">
    <!-- accept=".doc,.docx,.xlsx,.xls,.pdf,.png,.jpeg,.jpg" -->
    <el-upload
      :action="apiurl"
      :data="guid"
      :headers="headers"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :multiple="maxCount === 1 ? false : true"
      :on-success="uploadSuccess"
      :on-exceed="handleExceed"
      :on-error="handleAvatarError"
      :disabled="disabled"
    >
      <div class="picture-div">
        <div
          v-for="(item, index) in fileList"
          :key="index"
          class="img-only"
          @mouseover="mouseChange(true, index)"
          @mouseleave="mouseChange(false, index)"
        >
          <img
            v-if="getFileHouzhui(item.url) == 'pdf'"
            class="picture-img"
            :src="require('@/assets/img/pdf.png')"
            alt=""
            srcset=""
          >
          <img
            v-else-if="getFileHouzhui(item.url) == 'doc' || getFileHouzhui(item.url) == 'docx'"
            class="picture-img"
            :src="require('@/assets/img/word.png')"
            alt=""
            srcset=""
          >
          <img
            v-else-if="getFileHouzhui(item.url) == 'xlsx' || getFileHouzhui(item.url) == 'xls'"
            class="picture-img"
            :src="require('@/assets/img/excel.png')"
            alt=""
            srcset=""
          >
          <img
            v-else-if="getFileHouzhui(item.url) == 'ppt' || getFileHouzhui(item.url) == 'pptx'"
            class="picture-img"
            :src="require('@/assets/img/ppt.png')"
            alt=""
            srcset=""
          >
          <img
            v-else-if="getFileHouzhui(item.url) == 'cad'"
            class="picture-img"
            :src="require('@/assets/img/cad.png')"
            alt=""
            srcset=""
          >
          <img
            v-else
            class="picture-img_only"
            :src="item.url"
            alt=""
            srcset=""
          >
          <span v-show="isHover && index == current" class="image-shaom">
            <el-icon
              v-if="getFileHouzhui(item.url) == 'png' || getFileHouzhui(item.url) == 'jpeg' || getFileHouzhui(item.url) == 'jpg'"
              title="预览"
              @click.stop="handlePictureCardPreview(item.url)"
            >
              <zoom-in />
            </el-icon>
            <el-icon title="删除" @click.stop="deleteFile(item)">
              <delete />
            </el-icon>
          </span>
        </div>
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
  inject
} from 'vue'
import { imageGlobal } from '@/global'
import config from '_@/axios-config/config'

export default defineComponent({
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
    },
    guid: {
      type: Object,
      default: {}
    },
    apiUrl: {
      type: String,
      default: '/admin/sys-file/upload'
    }
  },
  setup(props, context) {
    const { default_headers, api_version } = config
    const userInfo = wsCache.get(appStore.userInfoDetail)

    const headers = ref({
      Authorization: !userInfo ? '' : userInfo.token_type + ' ' + userInfo.access_token,
      Headers: default_headers,
      VERSION: api_version
    })
    // 电脑快传时，处理未登录的情况
    if (JSON.stringify(props.guid) !== '{}') {
      const fileToken = localStorage.getItem('fileToken')
      headers.value.Authorization = 'bearer ' + fileToken
    }

    const apiurl = props.apiUrl as String
    const state = reactive({
      disabled: props.disabled,
      imageGlobal: imageGlobal,
      showViewer: false,
      imageFile: '' as any,
      fileList: [] as any,
      fileName: [] as any,
      maxCount: props.maxCount,
      imageValue: props.modelValue as any,
      fileListNew: [] as any,
      initialIndex: '',
      previewList: [] as any,
      isHover: false,
      current: 0,
      beforeImage: [] as any,
      apiUrl: props.apiUrl,
      guid: props.guid
    })

    // 上传前校验
    const beforeUpload = (file: any) => {
      if (state.fileList.length + state.beforeImage.length > props.maxCount) {
        ElMessage.warning(`最多只能上传${props.maxCount}张图片`)
        return false
      }
      const fileName = file.name.toLowerCase()
      const isExcel = (fileName.indexOf('.png') != -1 || fileName.indexOf('.jpeg') != -1 || fileName.indexOf('.jpg') != -1 ||
        fileName.indexOf('.doc') != -1 || fileName.indexOf('.docx') != -1 || fileName.indexOf('.xlsx') != -1 || fileName.indexOf('.xls') != -1 ||
        fileName.indexOf('.pdf') != -1 || fileName.indexOf('.ppt') != -1 || fileName.indexOf('.pptx') != -1 || fileName.indexOf('.cad') != -1)
      if (!isExcel) {
        ElMessage.error('支持上传doc、docx、xlsx、xls、pdf、ppt、pptx、cad、png、jpeg、jpg等格式文件!')
        return false
      }
      state.beforeImage.push(file)
    }

    const handlePictureCardPreview = (url: any) => {
      state.initialIndex = url
      state.showViewer = true
    }

    const handleAvatarError = (res: any, file: any) => {
      // 上传失败时的钩子
      context.emit('error', res)
      state.imageFile = file.raw
      // uploadeImage()
    }

    const uploadeImage = async () => {
      const formData = new FormData()
      formData.append('file', state.imageFile)
      fetch({
        url: '/admin/sys-file/upload',
        method: 'post',
        data: formData
      }).then((res: any) => {
        if (res.data.fileName) {
          state.fileList.push({
            url: imageGlobal + res.data.fileName,
            type: res.data.fileName,
            name: state.imageFile.name
          })
          const imgStr: any = []
          state.fileList.forEach((item: any) => {
            imgStr.push({
              url: item.url.replace(imageGlobal, ''),
              type: fileSuffix(item.type),
              name: item.name
            })
          })
          context.emit('update:modelValue', imgStr)
          ElMessage.success('上传成功')
        } else {
          ElMessage.error('上传失败')
        }
      })
    }
    const uploadSuccess = (res: any, file: any) => {
      // 上传成功时,清空上传前钩子中的图片
      state.beforeImage = []
      // 上传成功时的钩子
      state.fileListNew.push({
        url: imageGlobal + res.data.fileName,
        type: res.data.fileName,
        name: file.name
      })
      const imgStr: any = []
      const imgStrZs: any = []
      const preview: any = []
      state.fileListNew.concat(state.fileList).forEach((item: any) => {
        imgStr.push({
          url: item.url.replace(imageGlobal, ''),
          type: fileSuffix(item.type),
          name: item.name
        })
        imgStrZs.push({
          url: item.url,
          type: item.type,
          name: item.name
        })
      })
      state.fileList = imgStrZs
      state.fileListNew = []
      imgStr.map((v: any) => {
        if (v.type == 'img') {
          preview.push(imageGlobal + v.url)
        }
      })
      state.previewList = preview
      if (props.isJson) {
        context.emit('update:modelValue', JSON.stringify(imgStr))
      } else {
        context.emit('update:modelValue', imgStr)
      }
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

    // 批量删除事件
    const batchDeleteFile = () => {
      state.beforeImage = []
      state.fileList = []
      state.previewList = []
      context.emit('update:modelValue', [])
    }

    context.expose({ batchDeleteFile })

    // 删除事件
    const deleteFile = (item: any) => {
      // 删除时清空上传前钩子中的图片
      state.beforeImage = []

      const imgStr: any = []
      let imgStrDel: any = []
      imgStrDel = state.fileList
      imgStrDel.forEach((v: any, i: number) => {
        if (v.url == item.url) {
          imgStrDel.splice(i, 1)
        }
      })
      imgStrDel.forEach((item: any) => {
        imgStr.push({
          url: item.url.replace(imageGlobal, ''),
          type: fileSuffix(item.type),
          name: item.name
        })
      })
      const preview: any = []
      imgStr.map((v: any) => {
        if (v.type == 'img') {
          preview.push(imageGlobal + v.url)
        }
      })
      imgStrDel = state.fileList
      state.previewList = preview
      context.emit('update:modelValue', imgStr)
    }
    onMounted(() => {
      const imgStr: any = []
      if (props.isJson) {
        state.imageValue = state.imageValue && typeof state.imageValue === 'string' ? JSON.parse(state.imageValue) : []
      }
      if (state.imageValue && state.imageValue.length) {
        state.imageValue.forEach((item: any, index: any) => {
          state.fileList.push({
            url: imageGlobal + item.url.replace(imageGlobal, ''),
            name: item.name,
            type: item.url.replace(imageGlobal, '')
          })
          if (fileSuffix(item.url) == 'img') {
            imgStr.push(imageGlobal + item.url)
          }
        })
        state.previewList = imgStr
      }
    })

    return {
      handleAvatarError,
      handlePictureCardPreview,
      uploadeImage,
      apiurl,
      uploadSuccess,
      headers,
      beforeUpload,
      ...toRefs(state),
      fileSuffix,
      getFileHouzhui,
      mouseChange,
      deleteFile,
      batchDeleteFile
      // defineExpose({ batchDeleteFile })
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
