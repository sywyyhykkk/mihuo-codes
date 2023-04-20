<template>
  <div class="register-form">
    <div class="form-data" style="justify-content: center">
      <div style="text-align: center;margin-top: 12rem">
        <el-icon size="67px" color="#2DA44E">
          <success-filled />
        </el-icon>
        <div style="font-size: 20px; color: #2DA44E; line-height: 30px">
          提交成功
        </div>
        <div style="color: #999999; line-height: 30px">
          平台审核中,审核通过后,将通过短信通知您!
        </div>
      </div>
    </div>
    <div class="form-footer" style="margin-top: 20px">
      <div class="forgetPassword-text" style="margin-left: 10px;">
        已有企业?<span style="color:#0969DA;" @click="jumpRegister">立即登录</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits } from 'vue'

const emit = defineEmits(['jumpRegister'])


const jumpRegister = () => {
  emit('jumpRegister', 0)
}

</script>

<style scoped>

</style>
