<template>
  <el-config-provider :locale="locale">
    <router-view class="app" :class="{ grey__mode: greyMode }" />
  </el-config-provider>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  provide,
  getCurrentInstance,
  AsyncComponentLoader,
  onMounted,
  watch
} from 'vue'
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
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
// import {appStore} from '_@/store/modules/app'

export default defineComponent({
  name: 'App',
  components: {
    ElConfigProvider
  },
  setup() {
    const { push, addRoute, currentRoute } = useRouter()
    const greyMode = computed(() => appStore.greyMode)
    const proxy = getCurrentInstance()?.appContext.config.globalProperties
    const toDescription = (message: any) => {
      const customer = message.CustomContent
        ? JSON.parse(message.CustomContent || '{}')
        : ''
      switch (message.Type) {
        case proxy!.$imsdk.enums.ContentType.Text:
          return message.Content
        case proxy!.$imsdk.enums.ContentType.Link:
          return '[链接]'
        case proxy!.$imsdk.enums.ContentType.Image:
          return '[图片]'
        case proxy!.$imsdk.enums.ContentType.Voice:
          return '[语音]'
        case proxy!.$imsdk.enums.ContentType.Video:
          return '[视频]'
        case proxy!.$imsdk.enums.ContentType.File:
          return '[文件]'
        case proxy!.$imsdk.enums.ContentType.ReCall:
          if (message.MeaageType == proxy!.$imsdk.enums.MessageTypeEnum.Group) {
            return `'${message.SourceId}'撤回了一条消息`
          }
          return "'对方'撤回了一条消息]"
        case proxy!.$imsdk.enums.ContentType.Custom:
          switch (customer.contentType) {
            case 1:
              return '[电话号码交换]'
            case 2:
              return '[订单确认]'
            case 12:
              return '[地理位置]'
          }
      }
    }
    onMounted(() => {})
    provide('platformType', 2)
    //按钮权限更新
    const updatePermission = () => {
      fetch({ url: '/admin/user/info', method: 'get' }).then((res: any) => {
        if (res.code != 0) {
          ElMessage.error(res.msg)
          return
        }
        const list = {}
        for (let i = 0; i < res.data.permissions.length; i++) {
          list[res.data.permissions[i]] = true
        }
        wsCache.set(appStore.powerInfo, list)
      })
    }
    //menu的刷新
    return {
      greyMode,
      locale: zhCn
    }
  }
})
</script>

<style lang="less" scope>
.size {
  min-width: @minWidth;
  width: 100%;
  height: 100%;
}

html,
body {
  .size;
  margin: 0;
  padding: 0;
  font-size: 62.5%;
  -webkit-text-size-adjust: none;
}

#app {
  .size;
  background: @appBg;
}

.grey__mode {
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -o-filter: grayscale(100%);
  filter: grayscale(100%);
  filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
  //-ms-filter: grayscale(100%);
  //-webkit-filter: grayscale(100%);
  //-moz-filter: grayscale(100%);
  //-ms-filter: grayscale(100%);
  //-o-filter: grayscale(100%);
  //filter: grayscale(100%);
  //filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
}
</style>

