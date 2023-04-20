<template>
  <div style="margin-bottom: -1.5rem">
    <el-upload
      :action="actionUrl"
      :headers="headers"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :data="{
        'pictureKey':pictureKey
      }"
      :show-file-list="true"
      :file-list="fileList"
      :before-upload="beforeAvatarUpload"
      :multiple="maxCount === 1 ? false : true"
      :limit="maxCount"
      :on-success="uploadSuccess"
      :on-exceed="handleExceed"
      :on-error="handleAvatarError"
      :class="fileListNew.concat(fileList).length >= maxCount ? 'el-upload--pic' : ''"
    >
      <!-- <img class="upload-img"
        v-if="imgFile"
        :src="imgFile"
        alt=""
        srcset=""
        style="border-radius: 0.6rem;width:11rem;height:11rem"> -->
      <el-icon size="4rem">
        <plus />
      </el-icon>
    </el-upload>
    <!-- 预览图片 -->
        <preview-image
            v-model="showViewer"
            :current="initialIndex"
            :src-list="previewList"
            ></preview-image>
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
  inject,
  nextTick,
  watch
} from 'vue'
import { imageGlobal } from '@/global'
import config from '_@/axios-config/config'

export default defineComponent({
  props: {
    // 图片属性数组
    modelValue:{
      type:String,
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
    pictureKey: {
      type: String||Number,
      default: ''
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
    const showViewer = ref<boolean>(false)
    const previewList = ref<any>([])
    const initialIndex = ref<any>()
    const state = reactive({
      imageGlobal: imageGlobal,
      dialogImageUrl: '',
      dialogVisible: false,
      imageFile: '' as any,
      fileList: [] as any,
      fileName: [] as any,
      maxCount: props.maxCount,
      imageValue: props.modelValue as string,
      fileListNew: [] as any,
      imgFile: '' as any,
      pictureKey: props.pictureKey,
      actionUrl:`/pay/account/company/image/${props.pictureKey}`
    })
    //上传前校验
    const beforeAvatarUpload = (file: any) => {
      let fileName = file.name.toLowerCase()
      const isExcel =
        fileName.indexOf('.png') != -1 ||
        fileName.indexOf('.jpeg') != -1 ||
        fileName.indexOf('.jpg') != -1
      if (!isExcel) {
        ElMessage.error('支持上传png、jpeg、jpg格式图片!')
        return false
      }

      //限定文件上传大小
      const isLt500KB= Number(file.size / 1024) < 500;
      if (!isLt500KB) {
          ElMessage.error('上传图片大小不能超过 500KB!');
          return false;
      }
    }
    const handleRemove = (file: any, fileList: any) => {
      //删除图片时的钩子
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
    const deleteImg = () => {
      state.fileList = []
      const imgStrr: any = []
      context.emit('update:modelValue', imgStrr.join())
    }
    const handlePictureCardPreview = (file: any) => {
      initialIndex.value = file.url
      showViewer.value = true
    }

    const handleExceed = (files: any, fileList: any) => {
      ElMessage({
        message: '最多只能上传' + props.maxCount + '张图片',
        type: 'warning',
        duration: 1000
      })
    }

    const handleAvatarError = (res: any, file: any) => {
      // 上传失败时的钩子
      state.imageFile = file;
      // uploadeImage()
    }
    const uploadeImage = async () => {
      const formData = new FormData()
      formData.append('pictureKey', props.pictureKey)
      formData.append('file', state.imageFile.raw)
      fetch({
        url: `/pay/account/company/image/${props.pictureKey}`,
        method: 'post',
        data: formData
      }).then((res: any) => {
        if (res.code == '0') {
          ElMessage.success('上传成功');
          state.fileList = [state.imageFile]
          context.emit('update:modelValue', state.fileList.join())
        }
      })
    }
    const uploadSuccess = (res: any, file: any) => {
      // element-plus2.1.0版本之后采用,element数据返回格式变了
      // state.fileList.forEach((item: any, index: any) => {
      //   if (item.response) {
      //     item.url = imageGlobal + item.response.data.fileName
      //   }
      // })
      if (res.code === 1) {
        // 图片上传失败， 一般是因为不合规
        // const data = JSON.parse(res.data.check)
        // console.log(data)
        // ElMessage.warning(`图片上传失败，${data.data[0].msg}`)
        ElMessage.error(`图片上传失败，${res.data.msg}`)
        state.fileList = []
      } else {
        // element-plus2.0.4版本
        state.fileListNew.push({
          url: imageGlobal + file.raw.name
        })
        const imgStr: any = []
        state.fileListNew.concat(state.fileList).forEach((item: any) => {
          imgStr.push(item.url.replace(imageGlobal, ''))
        })
        context.emit('update:modelValue', imgStr.join())
        ElMessage.success('上传成功')
      }
    }
    onMounted(() => {
      nextTick(()=>{
        if(props.modelValue){
          state.fileList = [
              {
                url:props.modelValue
              }
            ]
        }
      })
    })
    return {
      handleRemove,
      handleAvatarError,
      handlePictureCardPreview,
      handleExceed,
      uploadeImage,
      deleteImg,
      uploadSuccess,
      headers,
      beforeAvatarUpload,
      ...toRefs(state),
      showViewer,
      previewList,
      initialIndex
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

</style>
