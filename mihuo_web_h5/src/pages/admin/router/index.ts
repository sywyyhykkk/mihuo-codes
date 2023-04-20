import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { AppRouteRecordRaw } from './types'
import { App } from 'vue'

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
    name: 'NoFind',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  },
  {
    path: '/mall',
    component: Layout,
    meta: {
      title: '添加商品',
      icon: 'icon-dingdan',
      alwaysShow: true,
      hidden: true
    },
    children: [
      {
        path: 'addProductNew',
        component: () => import('_v/mall/addProductNew/addProductNew.vue'),
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
    path: '/',
    component: Layout,
    name: 'Root',
    redirect: '/guide',
    meta: {
      title: '引导',
      icon: 'guide'
    },
    children: [
      {
        path: 'guide',
        component: () => import('_v/dashboard/index.vue'),
        name: 'GuideDemo',
        meta: {
          title: '引导页',
          icon: 'guide',
          affix: true
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
    path: '/operator',
    component: Layout,
    name: '运营商管理',
    meta: {
      title: '运营商管理',
      icon: 'guide',
      alwaysShow: true,
      noCache: true
    },
    children: [
      {
        path: 'manager',
        component: () => import('_v/operator/index.vue'),
        name: '运营商管理',
        meta: {
          title: '运营商管理',
          icon: 'guide',
          noCache: true
        }
      },
      {
        path: 'company',
        component: () => import('_v/operator/companyIndex.vue'),
        name: '企业管理',
        meta: {
          title: '企业管理',
          icon: 'guide',
          noCache: true
        }
      }
    ]
  },
  // {
  //   path: '/qualification',
  //   component: Layout,
  //   meta: {
  //     title: '资质审核',
  //     icon: 'guide'
  //   },
  //   children: [
  //     {
  //       path: 'enterprise',
  //       component: () => import('_v/enterprise/admin.vue'),
  //       name: '企业资质审核',
  //       meta: {
  //         title: '企业资质审核',
  //         icon: 'guide'
  //       }
  //     },
  //     {
  //       path: 'authentication',
  //       component: () => import('_v/authentication/admin.vue'),
  //       name: '实名认证审核',
  //       meta: {
  //         title: '实名认证审核',
  //         icon: 'guide'
  //       }
  //     }
  //   ]
  // },
  {
    path: '/mall',
    component: Layout,
    meta: {
      title: '商城管理',
      icon: 'guide'
    },
    children: [
      {
        path: 'cmsClassify',
        component: () => import('_v/mall/CMS/index.vue'),
        name: '内容分类管理',
        meta: {
          title: '内容分类管理',
          icon: 'icon-guiji'
        }
      },
      {
        path: 'cms',
        component: () => import('_v/mall/CMS/cms.vue'),
        name: '内容管理',
        meta: {
          title: '内容管理',
          icon: ''
        }
      },
      {
        path: 'productcategory',
        component: () => import('_v/mall/productCategory/index.vue'),
        name: '商品分类',
        meta: {
          title: '商品分类',
          icon: 'icon-guiji'
        }
      },
      {
        path: 'pmsnode',
        component: () => import('_v/mall/basisNode/index.vue'),
        name: '基础节点',
        meta: {
          title: '基础节点',
          icon: 'guide'
        }
      },
      {
        path: 'mallNodeStep',
        component: () => import('_v/mall/mallNodeStep/index.vue'),
        name: '基础节点步骤',
        meta: {
          title: '基础节点步骤',
          icon: 'guide'
        }
      },
      {
        path: 'pmsmaterialtype',
        component: () => import('_v/mall/materialType/materialCenterIndex.vue'),
        name: '素材中心',
        meta: {
          title: '素材中心',
          icon: require('@/assets/enterprise/menu/material-center.png'),
          noCache: true
        }
      },
      // {
      //   path: 'pmsmaterialtype',
      //   component: () => import('_v/mall/pmsmaterialtype/dictionary.vue'),
      //   name: '素材分类',
      //   meta: {
      //     title: '素材分类',
      //     icon: 'icon-guiji'
      //   }
      // },
      // {
      //   path: 'imageAndText',
      //   component: () => import('_v/mall/imageAndText/dictionary.vue'),
      //   name: '图文素材',
      //   meta: {
      //     title: '图文素材',
      //     icon: 'icon-guiji'
      //   }
      // },
      // {
      //   path: 'generalMaterial',
      //   component: () => import('_v/mall/generalMaterial/dictionary.vue'),
      //   name: '通用素材',
      //   meta: {
      //     title: '通用素材',
      //     icon: 'icon-guiji'
      //   }
      // },
      // {
      //   path: 'processType',
      //   component: () => import('_v/mall/processType/admin.vue'),
      //   name: '工序分类',
      //   meta: {
      //     title: '工序分类',
      //     icon: 'icon-guiji'
      //   }
      // },
      // {
      //   path: 'processDetails',
      //   component: () => import('_v/mall/processDetails/admin.vue'),
      //   name: '工序详情',
      //   meta: {
      //     title: '工序详情',
      //     icon: 'icon-guiji'
      //   }
      // },
      {
        path: 'tableList',
        component: () => import('_v/mall/tableList/index.vue'),
        name: '商品列表',
        meta: {
          title: '商品列表',
          icon: 'icon-guiji'
        }
      },
      // {
      //   path: 'addProduct',
      //   component: () => import('_v/mall/addProduct/admin.vue'),
      //   name: '添加商品',
      //   meta: {
      //     title: '添加商品',
      //     icon: 'icon-guiji'
      //   }
      // },
      {
        path: 'type',
        component: () => import('_v/mall/commodityType/index.vue'),
        name: '商品类型',
        meta: {
          title: '商品类型',
          icon: 'dashboard',
          noCache: true
        }
      },
      {
        path: 'brand',
        component: () => import('_v/mall/brand/index.vue'),
        name: '品牌管理',
        meta: {
          title: '品牌管理',
          icon: 'dashboard',
          noCache: true
        }
      },
      {
        path: 'classifyBrand',
        component: () => import('_v/mall/brand/classifyBrand.vue'),
        name: '分类品牌管理',
        meta: {
          title: '分类品牌管理',
          icon: 'dashboard',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/basic',
    component: Layout,
    meta: {
      title: '基础配置',
      icon: 'icon-dingdan',
      alwaysShow: true
    },
    children: [
      {
        path: 'job',
        // component: () => import('_v/staff/admin.vue'),
        component: () => import('_v/systemManagement/jobManagement.vue'),
        name: '岗位管理',
        meta: {
          title: '岗位管理',
          icon: 'icon-caidanguanli',
          noCache: false
        }
      },
      {
        path: 'acceptancetemplate/index',
        component: () => import('_v/basicConfiguration/acceptance.vue'),
        name: '验收模板',
        meta: {
          title: '验收模板',
          icon: require('@/assets/enterprise/menu/acceptance-template.png'),
          noCache: false
        }
      },
      {
        path: 'punishment',
        component: () => import('_v/basicConfiguration/punishment.vue'),
        name: '奖惩规则',
        meta: {
          title: '奖惩规则',
          icon: 'icon-caidanguanli',
          noCache: true
        }
      },
      {
        path: 'commonstatement',
        component: () => import('_v/basicConfiguration/usefulExpressions.vue'),
        name: '发单常用语句管理',
        meta: {
          title: '发单常用语',
          icon: 'icon-caidanguanli',
          noCache: true
        }
      },
      {
        path: 'dictionary',
        component: () => import('_v/dictionary/index.vue'),
        name: '数据字典',
        meta: {
          title: '数据字典',
          icon: 'icon-caidanguanli',
          noCache: false
        }
      },
      {
        path: 'holiday',
        component: () => import('_v/basicConfiguration/holidaysIndex.vue'),
        name: '节假日维护',
        meta: {
          title: '节假日维护',
          icon: 'icon-caidanguanli',
          noCache: true
        }
      },
      {
        path: 'miyouAudio',
        component: () => import('_v/miyouAudio/index.vue'),
        name: '觅友圈管理',
        meta: {
          title: '觅友圈管理',
          icon: 'icon-caidanguanli',
          noCache: true
        }
      },
      {
        // mall_smstopic_edit
        path: 'miyou-topic',
        component: () => import('_v/topicOfConversation/index.vue'),
        name: '觅友圈话题管理',
        meta: {
          title: '觅友圈话题管理',
          icon: '',
          noCache: false
        }
      },
      {
        path: 'blackout',
        component: () => import('_v/blackout/index.vue'),
        name: '平台用户管理',
        meta: {
          title: '平台用户管理',
          icon: 'icon-caidanguanli',
          noCache: false
        }
      },
      {
        path: 'deviceBlack',
        // component: () => import('_v/staff/admin.vue'),
        component: () => import('_v/blackout/deviceBlack.vue'),
        name: '设备拉黑',
        meta: {
          title: '设备拉黑',
          icon: 'icon-caidanguanli',
          noCache: false
        }
      }
    ]
  },
  {
    path: '/retention',
    component: Layout,
    meta: {
      title: '质保金管理',
      icon: 'guide'
    },
    children: [
      {
        path: 'overview',
        component: () => import('_v/warrantyMoneyOverview/index.vue'),
        name: '总览',
        meta: {
          title: '总览',
          icon: 'guide'
        }
      },
      {
        path: 'rules',
        component: () => import('_v/ruleSetting/index.vue'),
        name: '规则设定',
        meta: {
          title: '规则设定',
          noCache: true
        }
      },
      {
        path: 'detail',
        component: () => import('_v/runningRecord/index.vue'),
        name: '流水记录',
        meta: {
          title: '流水记录',
          icon: 'guide'
        }
      }
    ]
  },
  {
    path: '/integralSystem',
    component: Layout,
    meta: {
      title: '工匠积分制度',
      icon: 'guide'
    },
    children: [
      {
        path: 'gradeEquityConfig',
        component: () => import('_v/integralSystem/gradeEquityConfigIndex.vue'),
        name: '等级/权益配置',
        meta: {
          title: '等级/权益配置',
          icon: 'guide'
        }
      },
      {
        path: 'rulesConfig',
        component: () => import('_v/integralSystem/rulesConfigIndex.vue'),
        name: '奖惩规则配置',
        meta: {
          title: '奖惩规则配置',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/capital_management',
    component: Layout,
    meta: {
      title: '资金管理',
      icon: 'guide'
    },
    children: [
      {
        path: 'capitalBalance',
        component: () => import('_v/capitalManagement/capitalBalance.vue'),
        name: '资金余额',
        meta: {
          title: '资金余额',
          icon: '',
          noCache: true
        }
      },
      {
        path: 'capitalFlow',
        component: () => import('_v/capitalManagement/capitalFlow.vue'),
        name: '资金流水',
        meta: {
          title: '资金流水',
          icon: '',
          noCache: true
        }
      },
      {
        path: 'capitalProject',
        component: () => import('_v/capitalManagement/capitalProject.vue'),
        name: '项目结算管理',
        meta: {
          title: '项目结算管理',
          icon: '',
          noCache: true
        }
      },
      {
        path: 'capitalOrder',
        component: () => import('_v/capitalManagement/capitalOrder.vue'),
        name: '服务订单管理',
        meta: {
          title: '服务订单管理',
          icon: '',
          noCache: true
        }
      },
      {
        path: 'capitalSupplier',
        component: () => import('_v/capitalManagement/capitalSupplier.vue'),
        name: '供应商结算管理',
        meta: {
          title: '供应商结算管理',
          icon: '',
          noCache: true
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes: constantRouterMap as RouteRecordRaw[]
})

export function resetRouter(): void {
  const resetWhiteNameList = [
    'Redirect',
    'Login',
    'Root',
    'GuideDemo',
    'Page404'
  ]
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !resetWhiteNameList.includes(name as string)) {
      // console.log(name)
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export function setupRouter(app: App<Element>) {
  app.use(router)
}

export default router
