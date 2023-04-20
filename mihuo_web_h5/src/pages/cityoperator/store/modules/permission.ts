import router, { asyncRouterMap, constantRouterMap } from '_@/router'
import { deepClone } from '@/utils'
import store from '../index'
import {
  VuexModule,
  getModule,
  Module,
  Mutation,
  Action
} from 'vuex-module-decorators'
import { AppRouteRecordRaw } from '_@/router/types'
import wsCache from '@/cache'
import { isExternal } from '@/utils/validate'
import path from 'path'
import { getParentLayout } from '_@/router/utils'

import { appStore } from '_@/store/modules/app'

/* Layout */
const Layout = () => import('_@/layout/index.vue')

export interface PermissionState {
  routers: AppRouteRecordRaw[]
  addRouters: AppRouteRecordRaw[]
  isAddRouters: boolean
  activeTab: string
  menuTabRouters: AppRouteRecordRaw[]
}

@Module({ dynamic: true, namespaced: true, store, name: 'permission' })
class Permission extends VuexModule implements PermissionState {
  public routers = [] as any[]
  public addRouters = [] as any[]
  public isAddRouters = false
  public menuTabRouters = [] as any[]
  public activeTab = ''

  @Mutation
  private SET_ROUTERS(routers: AppRouteRecordRaw[]): void {
    // 动态路由，404一定要放到最后面
    this.addRouters = routers.concat([
      {
        path: '/:path(.*)*',
        redirect: { name: '404' },
        name: '404',
        meta: {
          hidden: true,
          breadcrumb: false
        }
      }
    ])
    // 渲染菜单的所有路由
    this.routers = deepClone(constantRouterMap, ['component']).concat(routers)
  }
  @Mutation
  private SET_ISADDROUTERS(state: boolean): void {
    this.isAddRouters = state
  }
  @Mutation
  private SET_MENUTABROUTERS(routers: AppRouteRecordRaw[]): void {
    this.menuTabRouters = routers
  }
  @Mutation
  private SET_ACTIVETAB(activeTab: string): void {
    this.activeTab = activeTab
  }

  @Action({ rawError: true })
  // { rawError: true } 有异常时能正确抛出异常
  public GenerateRoutes(): Promise<unknown> {
    return new Promise<void>((resolve) => {
      // 路由权限控制
      // 这里由于暂时还没有接口先用前端空中路由，后面接口有路由再使用后端接口控制路由
      let routerMap: AppRouteRecordRaw[] = []
      const businessMap = wsCache.get(appStore.userInfo).checkedNodes
      const resilvemap = []
      for (const rmap of businessMap) {
        for (const amap of asyncRouterMap) {
          if (amap.path === rmap.path) {
            let router = {} as AppRouteRecordRaw
            router = {
              ...amap,
              ...{
                icon: rmap.icon,
                name: rmap.name,
                meta: { title: rmap.name, icon: amap.meta.icon, ...amap.meta }
              }
            }
            router.children = []
            if (rmap.children && rmap.children.length > 0) {
              for (const rchild of rmap.children) {
                for (const achild of amap.children as AppRouteRecordRaw[]) {
                  if (achild.name === rchild.name) {
                    router.children.push({
                      ...achild,
                      ...{
                        icon: rchild.icon,
                        name: rchild.name,
                        meta: {
                          title: rchild.name,
                          icon: achild.meta.icon,
                          ...achild.meta
                        }
                      }
                    })
                  }
                }
              }
            }
            resilvemap.push(router)
          }
        }
      }
      routerMap = getFilterRoutes(resilvemap)
      this.SET_ROUTERS(routerMap)
      resolve()
    })
  }
  @Action
  public SetIsAddRouters(state: boolean): void {
    this.SET_ISADDROUTERS(state)
  }
  @Action
  public SetMenuTabRouters(routers: AppRouteRecordRaw[]): void {
    this.SET_MENUTABROUTERS(routers)
  }
  @Action
  public SetAcitveTab(activeTab: string): void {
    this.SET_ACTIVETAB(activeTab)
  }
}
// 模拟后端过滤路由
function getFilterRoutes(routes: any[]): any[] {
  const res = []
  for (const route of routes) {
    const data: any = {
      path: route.path,
      name: route.name
    }
    data.meta = Object.assign(
      {},
      route.meta || {},
      { title: route.name || '' },
      { icon: route.meta.icon }
    )
    if (route.component) {
      // 动态加载路由文件，可根据实际情况进行自定义逻辑
      data.component = route.component
    }
    // recursive child routes
    if (route.children) {
      data.children = getFilterRoutes(route.children)
    }
    res.push(data)
  }
  return res
}

export const permissionStore = getModule<Permission>(Permission)
