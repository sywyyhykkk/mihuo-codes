<template>
  <div class="my-login">
    <video :src="require('@/assets/video/video_Trim.mp4')"
           class="login-video"
           autoplay="autoplay"
           playbackRate="1"
           loop="loop"
           muted="muted"></video>
    <div class="login-title">
      <img :src="require('@/assets/video/logoNew.png')" class="login-logo" />
    </div>
    <div>
      <!--      登录？-->
      <LoginComponeNew v-if="tabs==0" v-model="state.ruleForm.username" @jumpRegister="jumpRegister" />
      <!--     注册 -->
      <RegisterEnterprise
        v-if="tabs==1"
        :isEdit="isEdit"
        :data="state.ruleForm"
        @jumpRegister="jumpRegister"
      />
      <!--     审核中 -->
      <UnderReview v-if="tabs==2" @jumpRegister="jumpRegister" />
    </div>
  </div>
</template>

<script lang="ts" setup>

import { reactive, ref } from 'vue'

const tabs = ref<number>(0)
const isEdit = ref<boolean>(false)
const state = reactive<any>({
  ruleForm: {
    username: '' as any
  }
})

const jumpRegister = (val: number, edit: string, data: any) => {
  tabs.value = val
  if (edit == '审核失败') {
    isEdit.value = true
    state.ruleForm = data
  } else {
    isEdit.value = false
  }
}
</script>

<style scoped lang="less">
@import "login";
</style>
