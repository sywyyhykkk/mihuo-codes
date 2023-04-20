// 按需加载element
import type { App } from 'vue'

import ElementConfig from './element.config'

// element全局配置项
const { size, zIndex } = ElementConfig
import {
  ElInfiniteScroll,
  ElLoading,
  ElMessageBox,
  ElNotification,
  ElMessage
} from 'element-plus'
import * as Icons from '@element-plus/icons-vue';
const plugins = [
  ElInfiniteScroll,
  ElLoading,
  ElMessageBox,
  ElNotification,
  ElMessage
]
export function setupElement(app: App<Element>): void {
  plugins.forEach((plugin: any) => {
    app.use(ElMessage)
  })
  for (const key in Icons) {
    app.component(key, Icons[key])
  }
  // 全局配置
  app.config.globalProperties.$ELEMENT = { size: size, zIndex: zIndex }
}
