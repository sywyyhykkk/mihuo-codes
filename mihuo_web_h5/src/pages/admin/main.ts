/**
 * Options API形式的组件生命周期钩子和Composition API之间的实际对应关系
 * beforeCreate -> setup()
 * created -> setup()
 * beforeMount -> onBeforeMount
 * mounted -> onMounted
 * beforeUpdate -> onBeforeUpdate
 * updated -> onUpdated
 * beforeDestroy -> onBeforeUnmount
 * destroyed -> onUnmounted
 * errorCaptured -> onErrorCaptured
 */

import { createApp } from 'vue'

import App from './App.vue' // 入口组件

import router, { setupRouter } from './router' // 路由
import 'default-passive-events'
import { setupStore } from './store' // 状态管理
import { fetch } from './axios-config/axios'
import './permission' // 路由守卫
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { setupElement } from '@/libs/element' // element UI

import { setupGlobCom } from '@/components' // 全局公用组件

import { setupDirectives } from '@/directives' // 自定义指令

import { getPression } from '@/utils/getPression'// 权限

import getNum from '@/utils/arithmetic'// 加减乘除

import { mockXHR } from '../../../mock'
import './styles/reset.css' // 重置不同浏览器之间的标签默认样式
import '@/assets/css/style.less'
import './styles/index.less'
import 'default-passive-events'
import '@/rem'
import { imageGlobal } from '@/global' // px转rem
import getUrl from '@/getPic'
const directivePlugin = {
  install(app: any) {
    app.directive('preventRepeatClick', {
      // 图片懒加载逻辑
      mounted(el: any, binding: any) {
        // el.focus()
        el.addEventListener('click', () => {
          if (!el.disabled) {
            el.disabled = true
            setTimeout(() => {
              el.disabled = false
            }, binding.value || 5000)
          }
        })
      }
    })
  }
}
const app = createApp(App)
import { appStore } from '_@/store/modules/app'
import { getPersonIdUser } from '@/utils/utils'
setupRouter(app) // 引入路由

setupStore(app) // 引入状态管理

setupElement(app) // 引入element组件

setupGlobCom(app) // 注册全局公用组件

setupDirectives(app) // 注册全局自定义指令
app.use(directivePlugin)
mockXHR() // mock注册
app.config.globalProperties.$axios = fetch
app.config.globalProperties.$imageGlobal = imageGlobal
app.config.globalProperties.$getUrl = getUrl
app.config.globalProperties.$getNum = getNum
app.config.globalProperties.$getPression = getPression
app.config.globalProperties.$getUserById = getPersonIdUser
router.isReady().then(() => {
  app.mount('#app')
})

