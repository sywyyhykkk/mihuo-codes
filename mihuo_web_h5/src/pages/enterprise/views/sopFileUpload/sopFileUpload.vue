<template>
  <div class="file-upload-contain">
    <div class="code-contian">
      <div class="item-left">
        <div v-if="state.loginStatus" class="item-login">
          <div id="item-code" class="item-code" />
        </div>

        <div v-if="!state.loginStatus && state.token" class="item-file">
          <uploadFile ref="upLoadFile" v-model="state.uploadItemList" :max-count="9"
            apiUrl="admin/sys-fast/uploadPattern" :guid="state.dto" @error="error" />
        </div>

        <div v-if="!state.loginStatus && state.token" class="item-button" @click="emptyFile">一键清空</div>

      </div>
      <div class="item-right">
        <div class="item-introduce">
          <img src="@/assets/img/sopFile.png" alt="" class="item-image">
          <text class="item-desc" v-if="state.loginStatus">扫码登录成功之后即可上传文件~</text>
          <div class="item-upload-tip" v-if="!state.loginStatus">
            支持上传doc、docx、xlsx、xls、pdf、ppt、pptx、cad、png、jpeg、jpg格式文件，文件最多能上传9个</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>

import QRCode from 'qrcodejs2'
import { guid } from '@/utils/utils'
import { nextTick, onMounted, reactive } from 'vue'
import {
  getLoginResult,
  removeFileList
} from '_@/api/basicConfig'

const state = reactive({
  GUID: {} as string,
  uploadItemList: [],
  loginStatus: false as Boolean,
  token: '',
  // upLoadShow: false as Boolean,
  errorIndex: 1,
  dto: {
    guid: ''
  }
} as any)
const upLoadFile = ref()
const timer = ref({})

onMounted(() => {
  nextTick(() => {
    state.GUID = guid()
    const tempGuid = localStorage.getItem('fileGuId')
    if (tempGuid) {
      state.GUID = tempGuid
      state.dto.guid = tempGuid
      getLogin()
    } else {
      state.loginStatus = true
      nextTick(() => {
        getCode()
      })
      state.dto.guid = state.GUID
      timer.value = setInterval(async () => {
        timingLogin()
      }, 3000)
    }
  })
})

onUnmounted(() => {
  clearInterval(timer.value as string)
})

/**
 * 判断是否登录
 */
const getLogin = async () => {
  getLoginResult({ guid: state.GUID }).then(res => {
    if (res.data.token) {
      state.token = res.data.token
      localStorage.setItem('fileGuId', state.GUID)
      localStorage.setItem('fileToken', res.data.token)
      state.loginStatus = false
    } else {
      state.loginStatus = true
      nextTick(() => {
        getCode()
      })
      timer.value = setInterval(async () => {
        timingLogin()
      }, 3000)
    }
  })
}

const timingLogin = async () => {
  getLoginResult({ guid: state.GUID }).then(res => {
    if (res.data.token) {
      state.token = res.data.token
      // 如果有失效Token，则对比Token 是否相同
      const invalidToken = localStorage.getItem('invalidToken')
      if (invalidToken) {
        if (invalidToken == res.data.token) {
          state.loginStatus = true
        } else {
          localStorage.setItem('invalidToken', '')
          localStorage.setItem('fileGuId', state.GUID)
          localStorage.setItem('fileToken', res.data.token)
          state.loginStatus = false
          clearInterval(timer.value as string)
        }
      } else {
        state.loginStatus = false
        localStorage.setItem('fileGuId', state.GUID)
        localStorage.setItem('fileToken', res.data.token)
        clearInterval(timer.value as string)
      }

    } else {
      state.loginStatus = true
    }
  })
}

/**
 * 生成登录二维码
 */
const getCode = async () => {
  new QRCode(document.getElementById('item-code'), {
    width: 260,
    height: 260, // 高度
    text: state.GUID, // 二维码内容
    render: 'canvas', // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
    background: '#f0f', // 背景色
    foreground: '#ff0', // 前景色
    correctLevel: QRCode.CorrectLevel.H
  })
}

// 清空文件
const emptyFile = () => {
  upLoadFile.value.batchDeleteFile()
  // removeFileList({ guid: state.GUID }).then(res => {
  //   if (res) {
  //   }
  // })
}

const error = (res: any) => {
  const tempRes = JSON.stringify(res)
  const resultRes = JSON.parse(tempRes)
  state.errorIndex++
  if (resultRes.status == 424) {
    // 保存失效Token
    localStorage.setItem('invalidToken', localStorage.getItem('fileToken') as '')
    state.loginStatus = true
    if (state.errorIndex == 2) {
      // state.GUID = guid()
      nextTick(() => {
        state.GUID = guid()
        state.dto.guid = state.GUID
        getCode()
      })
      timer.value = setInterval(async () => {
        timingLogin()
      }, 3000)
    }
    setTimeout(() => {
      localStorage.setItem('fileGuId', '')
      localStorage.setItem('fileToken', '')
    }, 1000)
  }
}

</script>
<style scoped lang="less">
/* @import url(); 引入css类 */

.file-upload-contain {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background: linear-gradient(225deg, #80a0c4, #386fb4);
}

.code-contian {
  display: flex;
  align-items: center;
  // justify-content: space-around;
  width: 65%;
  height: 80vh;
  background-color: #fff;
  border-radius: 10px;
  min-width: 90rem;
  min-height: 45rem;
  padding: 1rem;
}

.item-left {
  width: 70%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.item-right {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  border-left: 0.2rem solid #d9d9d9;
}

.item-login {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.item-introduce {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 4rem;

  .item-image {
    height: 28rem;
  }

  .item-desc {
    font-size: 2.2rem;
    color: #303111;
    margin-top: 2rem;
  }

}

.item-file {
  padding: 40px;
}

.item-upload-tip {
  font-size: 2.2rem;
  color: #909199;
  margin-top: 4rem;
  width: 40rem;
  line-height: 2.6rem;
}

.item-button {
  background-color: #0969DA;
  height: 4rem;
  width: 9rem;
  text-align: center;
  line-height: 4rem;
  color: #fff;
  font-size: 1.4rem;
  border-radius: 2rem;

}

.item-button:hover {
  cursor: pointer;
  opacity: 0.8;
}
</style>
