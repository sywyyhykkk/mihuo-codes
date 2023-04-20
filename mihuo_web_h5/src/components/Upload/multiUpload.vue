<template>
  <div>
    <el-upload
      action="ddsd"
      :data="useOss ? dataObj : null"
      list-type="picture-card"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-preview="handlePreview"
      :limit="maxCount"
      :on-exceed="handleExceed"
      :on-error="handleAvatarError"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      v-model:visible="dialogVisible"
    >
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script lang="js">
// import { policy } from '@/api/oss'

import wsCache from '@/cache'
import { appStore } from '_@/store/modules/app'
import { fetch } from '_@/axios-config/axios'
import { ElMessage } from 'element-plus'

export default {
  name: 'MultiUpload',
  props: {
    // 图片属性数组
    value: Array,
    // 最大上传图片数量
    maxCount: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      dataObj: {
        policy: '',
        signature: '',
        key: '',
        ossaccessKeyId: '',
        dir: '',
        host: ''
      },
      dialogVisible: false,
      dialogImageUrl: null,
      useOss: false, // 使用oss->true;使用MinIO->false
      ossUploadUrl: 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com',
      minioUploadUrl: 'http://localhost:8080/admin/sys-file/upload',
      token: wsCache.get(appStore.userInfoDetail).token_type + ' ' + wsCache.get(appStore.userInfoDetail).access_token
    }
  },
  computed: {
    fileList() {
      const fileList = []
      if (this.value) {
        for (let i = 0; i < this.value.length; i++) {
          fileList.push({ url: this.value[i] })
        }
      }

      return fileList
    }
  },
  methods: {
    handleAvatarError(res, file) {
      console.log(res, file)
      // 上传失败时的钩子
      this.imageFile = file.raw
      this.fileList.push(file)
      this.uploadeImage()
    },
    uploadeImage() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias

      const formData = new FormData()
      formData.append('file', this.imageFile)
      fetch({ url: '/admin/sys-file/upload', method: 'post', data: formData }).then((res) => {
        if (res.data.fileName) {
          value.push(res.data.fileName)
          console.log(this.value)
          ElMessage.success('上传成功')
        } else {
          ElMessage.error('上传失败')
        }
      })
    },
    emitInput(fileList) {
      const value = []
      for (let i = 0; i < fileList.length; i++) {
        value.push(fileList[i].url)
      }
      this.$emit('input', value)
    },
    handleRemove(file, fileList) {
      this.emitInput(fileList)
    },
    handlePreview(file) {
      this.dialogVisible = true
      this.dialogImageUrl = file.url
    },
    beforeUpload(file) {
      const _self = this
      if (!this.useOss) {
        // 不使用oss不需要获取策略
        return true
      }
      return new Promise((resolve, reject) => {
        policy().then(response => {
          _self.dataObj.policy = response.data.policy
          _self.dataObj.signature = response.data.signature
          _self.dataObj.ossaccessKeyId = response.data.accessKeyId
          _self.dataObj.key = response.data.dir + '/${filename}'
          _self.dataObj.dir = response.data.dir
          _self.dataObj.host = response.data.host
          resolve(true)
        }).catch(err => {
          console.log(err)
          reject(false)
        })
      })
    },
    handleUploadSuccess(res, file) {
      let url = this.dataObj.host + '/' + this.dataObj.dir + '/' + file.name
      if (!this.useOss) {
        // 不使用oss直接获取图片路径
        url = res.data.url
      }
      this.fileList.push({ name: file.name, url: url })
      this.emitInput(this.fileList)
    },
    handleExceed(files, fileList) {
      this.$message({
        message: '最多只能上传' + this.maxCount + '张图片',
        type: 'warning',
        duration: 1000
      })
    }
  }
}
</script>
<style>
</style>

