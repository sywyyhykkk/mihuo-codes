<template>
  <div style="text-align: center; width: 150px">
    <div style="text-align: left">
      <span style="font-size: 10px">{{ title }}</span>
      <span style="font-size: 8px; color: #999999">(必填)</span>
    </div>
    <el-upload
      v-if="!imageUrl"
      action="https://jsonplaceholder.typicode.com/posts/"
      class="avatar-uploader"
      limit="1"
      auto-upload="false"
      list-type="picture-card"
      :on-success="handleAvatarSuccess"
      :on-error="handleAvatarError"
      :on-progress="handleAvatarError"
      :on-preview="handlePictureCardPreview"
      :on-change="handleChange"
    >
      <i class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
    <div v-if="imageUrl" class="backImage">
      <img :src="imageUrl" alt="" class="avatar" />
      <div v-if="deleteType" class="deleteImage" @click="deleteImage">
        <img :src="require('@/assets/img/delete.png')" />
      </div>
      <div
        v-if="!deleteType"
        style="color: red; font-size: 12px; margin-top: 25px"
      >
        上传成功
      </div>
    </div>
    <div style="height: 70px; line-height: 70px">
      <el-button
        v-if="deleteType && imageUrl"
        v-loading.fullscreen.lock="loading"
        type="primary"
        size="mini"
        style="width: 100px"
        plain
        @click="uploadeImage()"
        >上传
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { ElMessage } from 'element-plus'

export default defineComponent({
  props: {
    title: {
      type: String
    }
  },
  emits: ['uploadUrl'],
  setup(props, { emit }) {
    const state = reactive<any>({
      imageUrl: '',
      dialogImageUrl: '',
      dialogVisible: false,
      title: props.title,
      deleteType: true,
      loading: false
    })
    const imageFile = ref<any>('')
    const handleAvatarSuccess = (res: any, file: any) => {
      console.log('成功了的钩子')
      state.imageUrl = URL.createObjectURL(file.raw)
      // console.log(state.imageUrl)
    }
    const handleAvatarError = (res: any, file: any) => {
      console.log('失败了的钩子')
      state.imageUrl = URL.createObjectURL(file.raw)
      // console.log(state.imageUrl)
    }
    const handleAvatarUp = (res: any, file: any) => {
      console.log('上传时的钩子')
      state.imageUrl = URL.createObjectURL(file.raw)
      // console.log(state.imageUrl)
    }
    const handleChange = (file: any, fileList: any) => {
      imageFile.value = file.raw
      state.imageUrl = URL.createObjectURL(file.raw)
      // console.log(file)
      console.log(
        '文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用'
      )
    }
    const handleRemove = (file: any, fileList: any) => {
      console.log(1)
      // console.log(file, fileList)
    }
    const handlePictureCardPreview = (file: any) => {
      // console.log(file)
      state.dialogImageUrl = file.raw
      state.dialogVisible = true
    }
    // 删除图片
    const deleteImage = () => {
      state.imageUrl = ''
    }
    const uploadeImage = async () => {
      state.loading = true
      const formData = new FormData()
      formData.append('file', imageFile.value as any)
      await fetch({
        url: '/admin/sys-file/upload',
        method: 'post',
        data: formData
      }).then((res: any) => {
        // console.log(res.data.fileName)
        if (res.data.fileName) {
          state.deleteType = false
          state.loading = false
          emit('uploadUrl', state.title, res.data.url)
        } else {
          ElMessage.error('上传失败')
        }
      })
    }
    return {
      imageFile,
      ...toRefs(state),
      handleAvatarSuccess,
      handleRemove,
      handlePictureCardPreview,
      handleAvatarError,
      handleAvatarUp,
      handleChange,
      deleteImage,
      uploadeImage
    }
  }
})
</script>
<style scoped lang="less">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 130px;
  height: 130px;
  line-height: 130px;
  text-align: center;
}

.backImage {
  border: 1px dashed transparent;
  height: 145px;
  width: 145px;
  background: linear-gradient(white, white) padding-box,
    repeating-linear-gradient(-45deg, #ccc 0, #ccc 0.2em, white 0, white 0.25em);
  border-radius: 5px;
  text-align: center;
  padding: 1px;
}
.avatar {
  width: 143px;
  height: 143px;
  z-index: 0;
  display: flex;
}
.deleteImage {
  width: 30px;
  height: 30px;
  margin-top: -35px;
  margin-left: 110px;
  z-index: 1;
  display: flex;
}
</style>
