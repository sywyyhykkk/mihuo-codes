import { createRouter, createWebHashHistory } from 'vue-router'
import { RouteRecordRaw } from 'vue-router'
import { AppRouteRecordRaw } from './types'
import { App } from 'vue'
// import { getParentLayout } from './utils'

/* Layout */
const Layout = () => import('../layout/index.vue')
// 这里的备注不能删除，以免被忘记

/**
 * redirect: noredirect        当设置 noredirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'          设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    hidden: true              当设置 true 的时候该路由不会再侧边栏出现 如404，login等页面(默认 false)
    alwaysShow: true          当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式，
                              只有一个时，会将那个子路由当做根路由显示在侧边栏，
                              若你想不管路由下面的 children 声明的个数都显示你的根路由，
                              你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，
                              一直显示根路由(默认 false)
    title: 'title'            设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'          设置该路由的图标
    noCache: true             如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    breadcrumb: false         如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
    affix: true               如果设置为true，则会一直固定在tag项中(默认 false)
    noTagsView: true           如果设置为true，则不会出现在tag中(默认 false)
    activeMenu: '/dashboard'  显示高亮的路由路径
    followAuth: '/dashboard'  跟随哪个路由进行权限过滤
    showMainRoute: true       设置为true即使hidden为true，也依然可以进行路由跳转(默认 false)
    followRoute: '/dashboard' 为路由设置跟随其他路由的权限
  }
 **/

export const constantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    name: 'Redirect',
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('_c/Redirect/index.vue'),
        meta: {}
      }
    ],
    meta: {
      hidden: true
    }
  },
  {
    path: '/404',
    component: () => import('_c/Error/404.vue'),
    name: '404',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  },
  {
    path: '/login',
    component: () => import('../views/form/login.vue'),
    meta: {
      hidden: true,
      title: '登录',
      noTagsView: true
    },
    children: [
      {
        meta: {
          hidden: true,
          title: '登录',
          noTagsView: true
        },
        path: '/login',
        name: 'Login',
        component: () => import('../views/form/logins.vue')
      },
      {
        meta: {
          hidden: true,
          title: '注册',
          noTagsView: true
        },
        path: '/register',
        component: () => import('../views/form/register.vue')
      }
    ]
  },
  {
    path: '/sopFileUpload',
    component: () => import('../views/sopFileUpload/sopFileUpload.vue'),
    meta: {
      hidden: true,
      title: '文件上传',
      noTagsView: true
    },
    children: [
      {
        meta: {
          hidden: true,
          title: '文件上传',
          noTagsView: true
        },
        path: '/sopFileUpload',
        name: 'sopFileUpload',
        component: () => import('../views/sopFileUpload/sopFileUpload.vue')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    name: 'Root',
    redirect: '/guide',
    meta: {
      title: '引导'
    },
    children: [
      {
        path: 'guide',
        component: () => import('_v/dashboard/index.vue'),
        name: 'GuideDemo',
        meta: {
          title: '塔台',
          icon: require('@/assets/enterprise/menu/guide.gif'),
          affix: true
        }
      }
    ]
  },
  {
    path: '/mall',
    component: Layout,
    name: 'addMallProduct',
    meta: {
      title: '添加',
      icon: 'icon-dingdan',
      alwaysShow: true,
      hidden: true
    },
    children: [
      {
        path: 'addProductNew',
        component: () =>
          import('_v/commodityManagement/addProductNew/addProductNew.vue'),
        name: 'addProduct',
        meta: {
          title: '添加商品',
          icon: require('@/assets/enterprise/menu/add-item.png'),
          noCache: false,
          hidden: true
        }
      }
    ]
  },
  {
    path: '/bizproject',
    component: Layout,
    name: 'bizprojectDetail',
    meta: {
      title: '查看详情',
      icon: 'icon-dingdan',
      hidden: true
    },
    children: [
      {
        path: 'projectDetail/:id',
        component: () => import('_v/project/projectDetail.vue'),
        name: 'projectDetail',
        meta: {
          title: '项目详情',
          icon: require('@/assets/img/block.png'),
          hidden: true
        }
      },
      {
        path: 'projectAbolish/:id',
        component: () => import('_v/project/projectAbolish.vue'),
        name: 'projectAbolish',
        meta: {
          title: '项目作废',
          icon: require('@/assets/img/block.png'),
          hidden: true
        }
      }
    ]
  },
  {
    path: '/job',
    component: Layout,
    name: 'jobSettingData',
    meta: {
      title: '岗位',
      icon: 'icon-dingdan',
      alwaysShow: true,
      hidden: true
    },
    children: [
      {
        path: 'jobSetting',
        component: () => import('_v/systemManagement/jobSetting.vue'),
        name: 'jobSetting',
        meta: {
          title: '岗位配置',
          icon: 'icon-caidanguanli',
          noCache: false,
          hidden: true
        }
      }
    ]
  }
]

export const asyncRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/mallOrder',
    component: Layout,
    name: '订单',
    meta: {
      title: '订单管理',
      icon: 'postcard',
      alwaysShow: true
    },
    children: [
      {
        path: 'orders',
        component: () => import('_v/orderManagement/orders.vue'),
        name: '订单管理',
        meta: {
          title: '订单管理',
          icon: require('@/assets/enterprise/menu/order-management.png'),
          noCache: false
        }
      }
    ]
  },
  {
    path: '/marketing',
    component: Layout,
    name: '营销',
    meta: {
      title: '营销',
      icon: 'present',
      alwaysShow: true
    },
    children: [
      {
        path: 'banner',
        component: () => import('_v/bannerManagement/index.vue'),
        name: 'banner',
        meta: {
          title: 'banner',
          icon: require('@/assets/enterprise/menu/banner.png'),
          noCache: false
        }
      },
      {
        path: 'column',
        component: () =>
          import('_v/commodityManagement/columnGroup/column.vue'),
        name: '栏目管理',
        meta: {
          title: '栏目管理',
          icon: require('@/assets/enterprise/menu/column-management.png')
        }
      },
      {
        path: 'decorateCase',
        component: () =>
          import('_v/commodityManagement/decorateCase/index.vue'),
        name: '装修案例',
        meta: {
          title: '装修案例',
          icon: require('@/assets/enterprise/menu/decoration-case.png'),
          noCache: false
        }
      }
    ]
  },
  {
    path: '/commodity',
    component: Layout,
    name: '商品',
    meta: {
      title: '商品',
      icon: 'goods',
      alwaysShow: true
    },
    children: [
      {
        path: 'tableList',
        component: () =>
          import('_v/commodityManagement/tableList/productIndex.vue'),
        name: '商品管理',
        meta: {
          title: '商品管理',
          icon: require('@/assets/enterprise/menu/goods-management.png'),
          noCache: false
        }
      },
      {
        path: 'type',
        component: () =>
          import('_v/commodityManagement/commodityType/commodityType.vue'),
        name: '商品类型',
        meta: {
          title: '商品类型',
          icon: require('@/assets/enterprise/menu/commodity-type.png'),
          noCache: false
        }
      },
      {
        path: 'brand',
        component: () => import('_v/commodityManagement/brand/brand.vue'),
        name: '品牌管理',
        meta: {
          title: '品牌管理',
          icon: require('@/assets/enterprise/menu/brand-management.png'),
          noCache: false
        }
      },
      {
        path: 'classifyBrand',
        component: () =>
          import('_v/commodityManagement/brand/classifyBrand.vue'),
        name: '营销品牌管理',
        meta: {
          title: '营销品牌管理',
          icon: require('@/assets/enterprise/menu/marketing-brand-management.png'),
          noCache: false
        }
      },
      {
        path: 'pmsmaterialtype',
        component: () =>
          import('_v/commodityManagement/materialType/materialCenterIndex.vue'),
        name: '素材中心',
        meta: {
          title: '素材中心',
          icon: require('@/assets/enterprise/menu/material-center.png'),
          noCache: false
        }
      },
      {
        path: 'freightTemplate',
        component: () => import('_v/basicConfiguration/freightTemplate.vue'),
        name: '运费模版管理',
        meta: {
          title: '运费模版管理',
          icon: require('@/assets/enterprise/menu/project-template.png'),
          noCache: false
        }
      },
    ]
  },
  {
    path: '/capital',
    component: Layout,
    meta: {
      title: '资金',
      icon: 'creditCard',
      alwaysShow: true
    },
    children: [
      {
        path: 'capitalFlow',
        component: () => import('_v/capital/capitalFlow.vue'),
        name: '资金流水',
        meta: {
          title: '资金流水',
          icon: require('@/assets/enterprise/menu/capitalFlow.png'),
          noCache: false
        }
      },
      {
        path: 'assetsBalance',
        component: () => import('_v/capital/assetsBalance.vue'),
        name: '资产余额',
        meta: {
          title: '资产余额',
          icon: require('@/assets/enterprise/menu/assetsBalance.png'),
          noCache: false
        }
      }
    ]
  },
  {
    path: '/management',
    component: Layout,
    name: '系统配置',
    meta: {
      title: '系统配置',
      icon: 'set-up',
      alwaysShow: true
    },
    children: [
      {
        path: 'company',
        component: () => import('_v/systemManagement/companyInfo.vue'),
        name: '企业信息',
        meta: {
          title: '企业信息',
          icon: require('@/assets/enterprise/menu/complanyInfo.png'),
          noCache: false
        }
      },
      {
        path: 'role',
        component: () => import('_v/systemManagement/roleManagement.vue'),
        name: '角色管理',
        meta: {
          title: '角色管理',
          icon: require('@/assets/enterprise/menu/role-management.png'),
          noCache: false
        }
      },
      {
        path: 'department',
        component: () => import('_v/systemManagement/staffManagement.vue'),
        name: '组织机构',
        meta: {
          title: '组织机构',
          icon: require('@/assets/enterprise/menu/organization.png'),
          noCache: false
        }
      },
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes: constantRouterMap as RouteRecordRaw[]
})

export function resetRouter(): void {
  // 不需要权限控制的路由一定要在这里添加，静态路由重置的时候才会跟着被重置
  const resetWhiteNameList = [
    'Redirect',
    'Login',
    'Root',
    'GuideDemo',
    '404',
    'bizprojectDetail',
    'projectDetail',
    'addProduct',
    'addMallProduct',
    'jobSettingData',
    'jobSetting',
    'projectAbolish',
    'sopFileUpload'
  ]
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !resetWhiteNameList.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export function setupRouter(app: App<Element>) {
  app.use(router)
}

export default router
