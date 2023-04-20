<template>
  <div>
    <el-alert
      effect="dark"
      :closable="false"
      title="useWatermark，为整个系统提供水印功能。"
      type="info"
      style="margin-bottom: 20px;"
    />
    <el-button type="primary" @click="setWatermark('自定义')">创建水印</el-button>
    <el-button type="danger" @click="clear">清除水印</el-button>
    <el-button  type ="primary" @click="setWatermark('自定义新水印  ')">重置水印</el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useWatermark } from '@/hooks/useWaterMark'
export default defineComponent({
  // name: 'UseWatermarkDemo',
  setup() {
    const { setWatermark, clear } = useWatermark()
    return {
      setWatermark,
      clear
    }
  }
})
</script>

<style>
</style>
