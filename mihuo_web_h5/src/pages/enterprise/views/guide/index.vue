<template>
  <div>
    <el-alert
      effect="dark"
      :closable="false"
      title=" 引导页对于一些第一次进入项目的人很有用，你可以简单介绍下项目的功能。引导页基于 intro.js"
      type="info"
      style="margin-bottom: 20px"
    />
    <el-button type="primary" @click.prevent.stop="guide"> 开始引导 </el-button>
  </div>
</template>

<script lang="ts">
import IntroJs from 'intro.js'
import 'intro.js/introjs.css'
import steps from './steps'
import { defineComponent, onMounted, ref, getCurrentInstance } from 'vue'
import { appStore } from '_@/store/modules/app'
import { ImStore } from '_@/store/modules/im'
import imrequest from '@/utils/imrequest'
import getDate, { Format } from '@/getDate'
import { ElMessage } from 'element-plus'
import { fetch } from '_@/axios-config/axios'
import wsCache from '@/cache'
import { permissionStore } from '_@/store/modules/permission'
import { RouteRecordRaw, useRouter } from 'vue-router'
import { previewProps } from '@/components/Preview/props'
export default defineComponent({
  name: 'GuideDemo',
  setup() {
    const driver = ref<any>(null)
    onMounted(() => {
      driver.value = new (IntroJs as any)()
      driver.value.setOptions({
        prevLabel: '上一步',
        nextLabel: '下一步',
        skipLabel: '跳过',
        doneLabel: '结束',
        steps
      })
      const proxy = getCurrentInstance()?.appContext.config.globalProperties
      
    })

    function guide() {
      driver.value.start()
    }

    return {
      guide
    }
  }
})
</script>

<style>
</style>
