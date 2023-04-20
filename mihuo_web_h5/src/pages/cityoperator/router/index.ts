import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { AppRouteRecordRaw } from './types'
import { App } from 'vue'

/* Layout */
const Layout = () => import('../layout/index.vue')
import review from '_v/artificial/index.vue'
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
    name: '商品',
    meta: {
      title: '商品',
      icon: 'icon-dingdan',
      alwaysShow: true,
      hidden: true
    },
    children: [
      {
        path: 'addProductNew',
        component: () => import('_v/mall/addProductNew/addProductNew.vue'),
        name: '添加商品',
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
  }
]

export const asyncRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/business',
    component: Layout,
    meta: {
      title: '技能认证审核',
      icon: 'guide',
      alwaysShow: true
    },
    children: [
      {
        path: 'manager',
        component: {
          components: { review },
          name: '项目经理审核',
          template: '<review />'
        },
        name: '项目经理审核',
        meta: {
          title: '项目经理审核',
          icon: 'guide'
        }
      },
      {
        path: 'artificial',
        component: {
          components: { review },
          name: '工人审核',
          template: '<review />'
        },
        name: '工人审核',
        meta: {
          title: '工人审核',
          icon: 'guide'
        }
      },
      {
        path: 'supervision',
        component: {
          components: { review },
          name: '项目监理审核',
          template: '<review />'
        },
        name: '项目监理审核',
        meta: {
          title: '项目监理审核',
          icon: 'guide',
          noCache: false
        }
      },
      {
        path: 'designer',
        component: {
          components: { review },
          name: '设计师审核',
          template: '<review />'
        },
        name: '设计师审核',
        meta: {
          title: '设计师审核',
          icon: 'guide'
        }
      }
    ]
  },
  {
    path: '/qualification',
    component: Layout,
    meta: {
      title: '资质管理',
      icon: 'guide'
    },
    children: [
      {
        path: 'enterprise',
        component: () => import('_v/enterprise/index.vue'),
        name: '企业资质审核',
        meta: {
          title: '企业资质审核',
          icon: 'guide',
          noCache: false
        }
      },
      {
        path: 'authentication',
        component: () => import('_v/authentication/index.vue'),
        name: '实名认证审核',
        meta: {
          title: '实名认证审核',
          icon: 'guide',
          noCache: false
        }
      }
    ]
  },
  {
    path: '/mall',
    component: Layout,
    meta: {
      title: '商城管理',
      icon: ''
    },
    children: [
      {
        path: 'cms',
        component: () => import('_v/mall/CMS/cms.vue'),
        name: '内容管理',
        meta: {
          title: '内容管理',
          icon: '',
          noCache: false
        }
      },
      {
        path: 'pmsmaterialtype',
        component: () => import('_v/mall/materialType/materialCenterIndex.vue'),
        name: '素材中心',
        meta: {
          title: '素材中心',
          icon: '',
          noCache: false
        }
      },
      {
        path: 'column',
        component: () => import('_v/mall/columnGroup/column.vue'),
        name: '栏目管理',
        meta: {
          title: '栏目管理',
          icon: 'icon-guiji',
          noCache: false
        }
      },
      // {
      //   path: 'columnProduct',
      //   component: () => import('_v/mall/columnGroup/columnProduct.vue'),
      //   name: '栏目商品管理',
      //   meta: {
      //     title: '栏目商品管理',
      //     icon: 'icon-guiji',
      //     noCache: false
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
      // {
      //   path: 'productAudit',
      //   component: () => import('_v/mall/productAudit/index.vue'),
      //   name: '商品审核',
      //   meta: {
      //     title: '商品审核',
      //     icon: 'icon-guiji',
      //     noCache: false
      //   }
      // },
      // {
      //   path: 'importGoods',
      //   component: () => import('_v/mall/tableList/importGoodsTable.vue'),
      //   name: '导入商品',
      //   meta: {
      //     title: '导入商品',
      //     icon: 'icon-guiji'
      //   }
      // },
      // {
      //   path: 'tableList',
      //   component: () => import('_v/mall/tableList/index.vue'),
      //   name: '商品列表',
      //   meta: {
      //     title: '商品列表',
      //     icon: 'icon-guiji',
      //     noCache: false
      //   }
      // },
      // {
      //   path: 'addProduct',
      //   component: () => import('_v/mall/addProduct/admin.vue'),
      //   name: '添加商品',
      //   meta: {
      //     title: '添加商品',
      //     icon: 'icon-guiji'
      //   }
      // },
      // {
      //   path: 'classification',
      //   component: () => import('_v/mall/classification/equationEdion.vue'),
      //   name: '商品分类',
      //   meta: {
      //     title: '商品分类',
      //     icon: 'dashboard',
      //     noCache: true
      //   }
      // },
      // {
      //   path: 'type',
      //   component: () => import('_v/mall/commodityType/index.vue'),
      //   name: '商品类型',
      //   meta: {
      //     title: '商品类型',
      //     icon: 'dashboard',
      //     noCache: false
      //   }
      // },
      // {
      //   path: 'brand',
      //   component: () => import('_v/mall/brand/index.vue'),
      //   name: '品牌管理',
      //   meta: {
      //     title: '品牌管理',
      //     icon: 'dashboard',
      //     noCache: false
      //   }
      // },
      {
        path: 'categoryContent',
        component: () => import('_v/mall/categoryContent/index.vue'),
        name: '分类内容页管理',
        meta: {
          title: '分类内容页管理',
          icon: 'dashboard',
          noCache: false
        }
      },
      {
        path: 'banner_list',
        component: () => import('_v/banner/index.vue'),
        name: 'banner管理',
        meta: {
          title: 'banner管理',
          icon: '',
          noCache: false
        }
      },
      {
        path: 'home_service',
        component: () => import('_v/homeService/index.vue'),
        name: '首页服务管理',
        meta: {
          title: '首页服务管理',
          icon: '',
          noCache: false
        }
      },
      {
        path: 'home_call',
        component: () => import('_v/homeCall/index.vue'),
        name: '首页呼叫工种管理',
        meta: {
          title: '首页呼叫工种管理',
          icon: '',
          noCache: false
        }
      },
      {
        path: 'coupon',
        component: () => import('_v/couponManagement/index.vue'),
        name: '优惠券管理',
        meta: {
          title: '优惠券管理',
          icon: '',
          noCache: false
        }
      }
    ]
  },
  {
    path: '/commodity',
    component: Layout,
    meta: {
      title: '商品管理',
      icon: ''
    },
    children: [
      {
        path: 'columnProduct',
        component: () => import('_v/mall/columnGroup/columnProduct.vue'),
        name: '栏目商品管理',
        meta: {
          title: '栏目商品管理',
          icon: 'icon-guiji',
          noCache: false
        }
      },
      {
        path: 'productAudit',
        component: () => import('_v/mall/productAudit/index.vue'),
        name: '商品审核',
        meta: {
          title: '商品审核',
          icon: 'icon-guiji',
          noCache: false
        }
      },
      {
        path: 'tableList',
        component: () => import('_v/mall/tableList/index.vue'),
        name: '商品列表',
        meta: {
          title: '商品列表',
          icon: 'icon-guiji',
          noCache: false
        }
      },
      {
        path: 'type',
        component: () => import('_v/mall/commodityType/index.vue'),
        name: '商品类型',
        meta: {
          title: '商品类型',
          icon: 'dashboard',
          noCache: false
        }
      },
      {
        path: 'brand',
        component: () => import('_v/mall/brand/index.vue'),
        name: '品牌管理',
        meta: {
          title: '品牌管理',
          icon: 'dashboard',
          noCache: false
        }
      },
      {
        path: 'classifyBrand',
        component: () => import('_v/mall/brand/classifyBrand.vue'),
        name: '分类品牌管理',
        meta: {
          title: '分类品牌管理',
          icon: 'dashboard',
          noCache: false
        }
      },
      {
        path: 'hotProduct',
        component: () => import('_v/mall/tableList/hotProduct.vue'),
        name: '热销商品推荐管理',
        meta: {
          title: '热销商品推荐管理',
          icon: 'dashboard',
          noCache: false
        }
      }
    ]
  },
  {
    path: '/operator',
    component: Layout,
    meta: {
      title: '运营管理',
      icon: ''
    },
    children: [
      {
        path: 'demand_list',
        component: () => import('_v/demand/index.vue'),
        name: '需求管理',
        meta: {
          title: '需求管理',
          icon: '',
          noCache: false
        }
      },
      {
        path: 'case_list',
        component: () => import('_v/caseManagement/index.vue'),
        name: '案例管理',
        meta: {
          title: '案例管理',
          icon: '',
          noCache: false
        }
      },
      {
        path: 'Issue-questionnaire',
        component: () =>
          import('_v/IssueQuestionnaireManage/QuestionnaireList.vue'),
        name: '发单问卷管理',
        meta: {
          title: '发单问卷管理',
          icon: '',
          noCache: false
        }
      },
      {
        path: 'QuestionnaireListItem',
        component: () =>
          import('_v/IssueQuestionnaireManage/QuestionnaireListItem.vue'),
        name: '问卷信息',
        meta: {
          title: '',
          icon: '',
          noCache: true,
          hidden: true
        }
      },
      {
        path: 'commission-ratio_list',
        component: () => import('_v/commissionRatio/index.vue'),
        name: '抽成比例设置',
        meta: {
          title: '抽成比例设置',
          icon: '',
          noCache: false
        }
      },
      {
        path: 'express_list',
        component: () => import('_v/express/index.vue'),
        name: '交易快报管理',
        meta: {
          title: '交易快报管理',
          icon: '',
          noCache: false
        }
      },
      {
        path: 'feedback',
        component: () => import('_v/mall/feedback/index.vue'),
        name: '意见反馈',
        meta: {
          title: '意见反馈',
          icon: 'dashboard',
          noCache: false
        }
      },
      {
        path: 'service_items_index',
        component: () => import('_v/storeManagement/serviceItemsIndex.vue'),
        name: '服务项目审核',
        meta: {
          title: '服务项目审核',
          icon: 'guide',
          noCache: false
        }
      },
      {
        path: 'work_case_index',
        component: () => import('_v/storeManagement/workCaseIndex.vue'),
        name: '工作案例审核',
        meta: {
          title: '工作案例审核',
          icon: 'guide',
          noCache: false
        }
      },
      {
        path: 'marketing_stat',
        component: () => import('_v/MarketingStat/index.vue'),
        name: '推广统计',
        meta: {
          title: '推广统计',
          icon: '',
          noCache: false
        }
      },
      {
        path: 'statement_list',
        component: () => import('_v/statement/index.vue'),
        name: '统计报表',
        meta: {
          title: '统计报表',
          icon: '',
          noCache: false
        }
      },
      {
        path: 'search_keyword',
        component: () => import('_v/searchKeyword/index.vue'),
        name: '搜索关键词管理',
        meta: {
          title: '搜索关键词管理',
          icon: '',
          noCache: false
        }
      }
    ]
  },
  {
    path: '/mallOrder',
    component: Layout,
    name: '订单',
    meta: {
      title: '订单管理',
      icon: ''
    },
    children: [
      {
        path: 'orders',
        component: () => import('_v/orderManagement/orders.vue'),
        name: '订单列表',
        meta: {
          title: '订单列表',
          icon: require('@/assets/enterprise/menu/order-management.png'),
          noCache: false
        }
      },
      {
        path: 'projectDetail/:id',
        component: () => import('_v/project/projectDetail.vue'),
        name: '项目详情',
        meta: {
          title: '项目详情',
          icon: require('@/assets/img/block.png'),
          hidden: true
        }
      },
      {
        path: 'order-report_list',
        component: () => import('_v/orderReport/index.vue'),
        name: '订单报表',
        meta: {
          title: '订单报表',
          icon: '',
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
      title: '营销管理',
      icon: ''
    },
    children: [
      {
        path: 'groupBooking',
        component: () => import('_v/marketing/groupBooking.vue'),
        name: '拼团管理',
        meta: {
          title: '拼团管理',
          icon: require('@/assets/enterprise/menu/order-management.png'),
          noCache: false
        }
      },
      {
        path: 'groupBookDetail/:id',
        component: () => import('_v/marketing/groupBookDetail.vue'),
        name: '拼团详情',
        meta: {
          title: '拼团详情',
          icon: require('@/assets/img/block.png'),
          hidden: true
        }
      },
      {
        path: 'seckill',
        component: () => import('_v/marketing/activitySeckill.vue'),
        name: '秒杀管理',
        meta: {
          title: '秒杀管理',
          icon: require('@/assets/img/block.png'),
          noCache: false
        }
      },
      {
        path: 'activitySeckillDetail/:id',
        component: () => import('_v/marketing/activitySeckillDetail.vue'),
        name: '秒杀详情',
        meta: {
          title: '秒杀详情',
          icon: require('@/assets/img/block.png'),
          hidden: true
        }
      },
      {
        path: 'activityRegistration',
        component: () => import('_v/marketing/activityRegistration.vue'),
        name: '活动报名',
        meta: {
          title: '活动报名',
          icon: '',
          noCache: false
        }
      }
    ]
  },
  {
    path: '/insurance',
    component: Layout,
    name: '保险管理',
    meta: {
      title: '保险管理',
      alwaysShow: true
    },
    children: [
      {
        path: 'overview',
        component: () => import('_v/insurance/overview.vue'),
        name: '保险总览',
        meta: {
          title: '保险总览',
          noCache: false
        }
      },
      {
        path: 'set-meal',
        component: () => import('_v/insurance/setMeal.vue'),
        name: '套餐查看',
        meta: {
          title: '套餐查看',
          noCache: false
        }
      }
    ]
  },
  {
    path: '/bizproject',
    component: Layout,
    name: '项目管理',
    meta: {
      title: '项目',
      icon: 'takeaway-box'
    },
    children: [
      {
        path: 'projectItem',
        component: () => import('_v/project/projectItem.vue'),
        name: '项目列表',
        meta: {
          title: '项目列表',
          icon: require('@/assets/enterprise/menu/project-management.png'),
          noCache: false
        }
      },
      {
        path: 'projectDetail/:id',
        component: () => import('_v/project/projectDetail.vue'),
        name: '项目详情',
        meta: {
          title: '项目详情',
          icon: require('@/assets/img/block.png'),
          hidden: true
        }
      },
      {
        path: 'projectAbolish/:id',
        component: () => import('_v/project/projectAbolish.vue'),
        name: '项目作废',
        meta: {
          title: '项目作废',
          icon: require('@/assets/img/block.png'),
          hidden: true
        }
      },
      {
        path: 'projectItemObsolete',
        component: () => import('_v/project/projectItemObsolete.vue'),
        name: '项目作废管理',
        meta: {
          title: '项目作废管理',
          icon: require('@/assets/enterprise/menu/project-management.png'),
          noCache: false
        }
      },
      {
        path: 'measuringMaterial',
        component: () =>
          import(
            '_v/orderManagement/measuringMaterial/measuringMaterialIndex.vue'
          ),
        name: '测量材料管理',
        meta: {
          title: '测量材料管理',
          icon: require('@/assets/enterprise/menu/measuring_material.png'),
          noCache: false
        }
      },
      {
        path: 'projectOrder',
        component: () => import('_v/project/projectOrder/index.vue'),
        name: '项目开单管理',
        meta: {
          title: '项目开单管理',
          icon: require('@/assets/enterprise/menu/projectSettlement.png'),
          noCache: false
        }
      }
    ]
  },
  {
    path: '/capital',
    component: Layout,
    name:'资金',
    meta: {
      title: '资金管理',
      icon: 'creditCard',
      alwaysShow: true
    },
    children: [
      {
        path: 'billSettl',
        component: () => import('_v/capital/billSettl.vue'),
        name: '单据结算',
        meta: {
          title: '单据结算',
          icon: require('@/assets/enterprise/menu/assetsBalance.png'),
          noCache: false
        }
      }
    ]
  },
  {
    path: '/basic',
    component: Layout,
    name: '基础数据',
    meta: {
      title: '基础数据',
      icon: 'data-board',
      alwaysShow: true
    },
    children: [
      {
        path: 'servicePackIndex',
        component: () => import('_v/basicConfiguration/servicePackIndex.vue'),
        name: 'SOP模板',
        meta: {
          title: 'SOP模板',
          icon: require('@/assets/enterprise/menu/project-template.png'),
          noCache: false
        }
      },
      {
        path: 'billTemplate',
        component: () => import('_v/billTemplate/index.vue'),
        name: '开单模板',
        meta: {
          title: '开单模板',
          icon: require('@/assets/enterprise/menu/project-template.png'),
          noCache: false
        }
      },
      {
        path: 'amountRoom',
        component: () => import('_v/project/amountRoom/amountRoomIndex.vue'),
        name: '量房参数',
        meta: {
          title: '量房参数',
          icon: require('@/assets/enterprise/menu/measuring-room.png'),
          noCache: false
        }
      },
      {
        path: 'punishment',
        component: () => import('_v/basicConfiguration/punishment.vue'),
        name: '奖惩规则',
        meta: {
          title: '奖惩规则',
          icon: require('@/assets/enterprise/menu/punishment-rules.png'),
          noCache: false
        }
      },
      {
        path: 'surveytemplate/index',
        component: () => import('_v/basicConfiguration/customForms.vue'),
        name: '问卷调查',
        meta: {
          title: '问卷调查',
          icon: require('@/assets/enterprise/menu/questionnaire.png'),
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
        path: 'remindTemplate',
        component: () => import('_v/remindTemplate/remindTemplate.vue'),
        name: '提醒模板',
        meta: {
          title: '提醒模板',
          icon: require('@/assets/enterprise/menu/remindTemplate.png'),
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
        path: 'qrcode_generator',
        component: () => import('_v/QRCodeGenerator/index.vue'),
        name: '生成小程序码',
        meta: {
          title: '生成小程序码',
          icon: 'guide',
          noCache: false
        }
      },
      {
        path: 'sop-delivery-onfiguration',
        component: () => import('_v/systemManagement/sop-delivery.vue'),
        name: 'SOP交付配置',
        meta: {
          title: 'SOP交付配置',
          icon: require('@/assets/enterprise/menu/complanyInfo.png'),
          noCache: false
        }
      },
      {
        path: 'dictionary',
        component: () => import('_v/dictionary/index.vue'),
        name: '数据字典',
        meta: {
          title: '数据字典',
          icon: require('@/assets/enterprise/menu/dictionaries.png'),
          noCache: false
        }
      },
      {
        path: 'job_list',
        component: () => import('_v/systemManagement/jobManagement.vue'),
        name: '岗位管理',
        meta: {
          title: '岗位管理',
          icon: 'icon-caidanguanli',
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
      }
    ]
  },
  {
    path: '/integralSystem',
    component: Layout,
    meta: {
      title: '工匠管理',
      icon: 'guide'
    },
    children: [
      {
        path: 'worker_management_index',
        component: () => import('_v/workerManagement/index.vue'),
        name: '工人管理',
        meta: {
          title: '工人管理',
          icon: 'guide',
          noCache: false
        }
      },
      {
        path: 'sms_worker_tiptop',
        component: () => import('_v/rank/index.vue'),
        name: '明星工匠管理',
        meta: {
          title: '明星工匠管理',
          icon: '',
          noCache: false
        }
      },
      {
        path: 'income_tiptop',
        component: () => import('_v/rank/incomeRank.vue'),
        name: '赚钱工匠管理',
        meta: {
          title: '赚钱工匠管理',
          icon: '',
          noCache: false
        }
      },
      {
        path: 'gradeEquityConfig',
        component: () => import('_v/integralSystem/gradeEquityConfigIndex.vue'),
        name: '等级/权益配置',
        meta: {
          title: '等级/权益配置',
          icon: require('@/assets/enterprise/menu/dictionaries.png'),
          noCache: false
        }
      },
      {
        path: 'rulesConfig',
        component: () => import('_v/integralSystem/rulesConfigIndex.vue'),
        name: '奖惩规则配置',
        meta: {
          title: '奖惩规则配置',
          icon: require('@/assets/enterprise/menu/dictionaries.png'),
          noCache: false
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
    'Page404',
    'QuestionnaireListItem',
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
