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
 * errorCaptured -> onErrorCapturedf
 */

import { createApp } from 'vue'

import App from './App.vue' // 入口组件

import router, { setupRouter } from './router' // 路由


import getNum from '@/utils/arithmetic'//加减乘除

import { setupStore } from './store' // 状态管理
import { fetch } from './axios-config/axios'
import getUrl, { getPic } from '@/getPic'//图片显示公用方法
import './permission' // 路由守卫
import getDate from '@/getDate'//时间格式化工具

import { setupElement } from '@/libs/element' // element UI

import { setupGlobCom } from '@/components' // 全局公用组件

import { setupDirectives } from '@/directives' // 自定义指令

import { Search } from '@element-plus/icons-vue'
//import { mockXHR } from '../../../mock'
import '@/rem' // px转rem
import '_@/styles/reset.css' // 重置不同浏览器之间的标签默认样式
import '_@/styles/index.less'
import 'animate.css'
import { imageGlobal } from '@/global'

const imsdk = require('@/xsoftimsdk.js')
import Vue3DraggableResizable from 'vue3-draggable-resizable'
//default styles
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'
import { getPression } from '@/utils/getPression'
import { getPersonIdUser } from '@/utils/utils'

const directivePlugin = {
  install(app: any) {
    app.directive('preventRepeatClick', {
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
app.use(Vue3DraggableResizable)
app.use(directivePlugin)
app.component('Search', Search)

setupRouter(app) // 引入路由

setupStore(app) // 引入状态管理

setupElement(app) // 引入element组件

setupGlobCom(app) // 注册全局公用组件

setupDirectives(app) // 注册全局自定义指令
//mockXHR() // mock注册
app.config.globalProperties.$axios = fetch
app.config.globalProperties.$imageGlobal = imageGlobal
app.config.globalProperties.$getUrl = getUrl
app.config.globalProperties.$getPic = getPic
app.config.globalProperties.$imsdk = imsdk
app.config.globalProperties.$getDate = getDate
app.config.globalProperties.$getPression = getPression
app.config.globalProperties.$getNum = getNum
app.config.globalProperties.$getUserById = getPersonIdUser
router.isReady().then(() => {
  app.mount('#app')
})

