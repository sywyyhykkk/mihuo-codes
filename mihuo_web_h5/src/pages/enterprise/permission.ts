import { toRaw } from '@vue/reactivity'
import router from './router'

import NProgress from 'nprogress' // 引入进度条

import 'nprogress/nprogress.css' // 进度条样式

import { appStore } from '_@/store/modules/app'
import getPageTitle from '@/utils/get-page-title'
import wsCache from '@/cache'
import { fetch } from '_@/axios-config/axios'
import { ElMessage } from 'element-plus'

// import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress configuration

import { permissionStore } from '_@/store/modules/permission'

import { RouteRecordRaw } from 'vue-router'
import { tagsViewStore } from '_@/store/modules/tagsView'

const whiteList: string[] = ['/login', '/sopFileUpload'] // 不重定向白名单
router.beforeEach(async (to, from, next) => {
  const visitedViews: any[] = toRaw(tagsViewStore.visitedViews)
  const haspath = visitedViews.find(
    (item: RouteRecordRaw) => item.path == to.path
  )
  if (!haspath) {
    NProgress.start()
  }
  if (wsCache.get(appStore.userInfo)) {
    if (to.path === '/login') {
      next()
    } else {
      if (permissionStore.isAddRouters) {
        return next()
      }

      await menu()
      await permissionStore.GenerateRoutes()
      permissionStore.addRouters.forEach((route: RouteRecordRaw) => {
        router.addRoute(route.name!, route) // 动态添加可访问路由表
      })

      const redirectPath = (from.query.redirect || to.path) as string
      const redirect = decodeURIComponent(redirectPath)

      const nextData =
        to.path === redirect ? { ...to, replace: true } : { path: redirect }
      permissionStore.SetIsAddRouters(true)
      next(nextData)
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      // 否则全部重定向到登录页
      next({
        path: '/login'
      })
    }
  }
})
const menu = async () => {
  const role = await fetch({
    url: '/admin/menu',
    method: 'get'
  })
  if (role) {
    // eslint-disable-next-line no-empty
    const businessMap = role.data.find(
      (item: { name: string }) => item.name === '企业端'
    )
    if (businessMap.children && businessMap.children.length < 1) {
      ElMessage.info('您没有权限菜单,请联系管理员')
      return
    }
    wsCache.set(
      appStore.userInfo,
      Object.assign(wsCache.get(appStore.userInfo), {
        checkedNodes: businessMap.children
      })
    )
    // permissionStore.GenerateRoutes().then((res) => {
    //   permissionStore.SetIsAddRouters(true)
    // })
  }
}

router.afterEach((to) => {
  document.title = getPageTitle(to.meta.title as string, appStore.title)
  NProgress.done() // 结束进度条
})
