<template>
  <div class="add-product-new">
    <productStep :active="active" :tabs="tabs" @handelActive="handelActive" />

    <!--    //商品信息-->
    <productInfo
      v-if="active == '1'"
      ref="rulesProduct"
      v-model="state.form"
      :is-edit="isEdit"
    />

    <productDetailNew
      v-if="active == '2'"
      ref="rulesProduct"
      v-model="state.form"
      :is-edit="isEdit"
    />
    <template v-if="active == '3'">
      <setMealInfo
        v-if="state.form.customCategory == '1003'"
        ref="rulesProduct"
        v-model="state.form"
        @updata="getDefaultProductParam"
      />
      <productConstruction
        v-else
        ref="rulesProduct"
        v-model="state.form"
        :is-edit="isEdit"
      />
    </template>

    <div class="bottom-footer">
      <el-button v-show="active != '1'" @click="lastStep">上一步</el-button>
      <el-button
        v-show="active != tabs.length"
        @click="productNextStep"
      >下一步</el-button>
      <el-button type="primary" @click="saveHandel">保存</el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, watchEffect, onMounted, computed, provide } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { tagsViewStore } from '_@/store/modules/tagsView'
import { baseDecode } from '@/utils/utils'

const visitedViews = computed(() => tagsViewStore.visitedViews)
const active = ref<number>(0)
const tabs = ref<any>([])
const rulesProduct = ref<any>('')

const router = useRouter()
const route = useRoute()

const query = ref<any>(baseDecode(JSON.parse(JSON.stringify(route.query))))
const isEdit = ref<any>(query.value.isEdit == '2')
const productId = ref<any>(query.value.id)
const protType = ref<any>(query.value.protType)

provide('protType', protType.value)

const state = reactive({
  form: {
    payStagesEnable: 0, // 是否开启分期付款
    payStages: [], // 分期付款
    pmsProductAttributeParam: [], // 新加的商品属性和productAttributeValueList一模一样
    minAmountDescription: '',
    companyId: query.value.companyId,
    albumPics: '',
    bannerImg: '',
    coverImg: '',
    brandId: null,
    brandName: '',
    deleteStatus: 0,
    description: '',
    detailDesc: '[]' as any,
    detailHtml: '',
    detailMobileHtml: '',
    detailTitle: '',
    feightTemplateId: 0,
    flashPromotionCount: 0,
    flashPromotionId: 0,
    flashPromotionPrice: 0,
    flashPromotionSort: 0,
    giftPoint: 0,
    giftGrowth: 0,
    keywords: '',
    lowStock: 0,
    name: '',
    newStatus: 0,
    note: '',
    originalPrice: null,
    site: '', // 产地
    pic: '',
    // 会员价格{memberLevelId: 0,memberPrice: 0,memberLevelName: null}
    memberPriceList: [],
    platformType: query.value.protType, // 1平台端，2企业端，3运营端,所属平台
    // 商品满减
    productFullReductionList: [{ fullPrice: 0, reducePrice: 0 }],
    // 商品阶梯价格
    productLadderList: [{ count: 0, discount: 0, price: 0 }],
    previewStatus: 0,
    price: null,
    productAttributeCategoryId: '',
    // 商品属性相关{productAttributeId: 0, value: ''}
    productAttributeValueList: [],
    // 商品sku库存信息{lowStock: 0, pic: '', price: 0, sale: 0, skuCode: '', spData: '', stock: 0}
    skillType: '',
    skillTypeName: '',
    skuStockList: [] as any,
    customCategory: '',
    // 商品相关专题{subjectId: 0}
    subjectProductRelationList: [],
    // 商品相关优选{prefrenceAreaId: 0}
    prefrenceAreaProductRelationList: [],
    productCategoryId: null,
    productCategoryName: '',
    treeCode: '',
    platformCategoryId: null,
    platformCategoryName: '',
    platformTreeCode: '',
    productSn: '',
    promotionEndTime: '',
    promotionPerLimit: 0,
    promotionPrice: null,
    promotionStartTime: '',
    promotionType: 0,
    publishStatus: 0,
    recommandStatus: 0,
    hotsaleStatus: 0,
    sale: 0,
    serviceIds: '',
    sort: 0,
    stock: null,
    subTitle: '',
    innerPrice: '', // 内部价
    minAmount: 0, // 最低金额
    unit: '',
    usePointLimit: 0,
    verifyStatus: 0,
    sopTemplateId: '' as any, // sop模板id
    type: '',
    weight: null,
    deliveryType: '' as any, // 交付方式
    containsProduct: [], // 如果是服务包，选择商品和服务
    productProcess: {
      buildContent: '[]' as any,
      buildProcess: JSON.stringify([
        {
          title: '',
          description: '',
          processPic: ''
        }
      ]) as any,
      buildStandard: '[]' as any,
      checkStandard: JSON.stringify([
        {
          title: '',
          description: '',
          processPic: '',
          score: 0,
          indexStatus: 0 as number
        }
      ]),
      id: 0,
      productId: 0,
      prompt: '[]' as any,
      qualityRight: '[]' as any,
      constructionScene: JSON.stringify([
        {
          title: '',
          description: '',
          processPic: ''
        }
      ]) as any, // 施工现场图片
      scope: '[]' as any, // 适用范围
      priceDescription: '[]' as any // 报价说明
    } as any,
    supplierId: '' as any, // 供应商id
    supplierName: '' as any, // 供应商名称
    purchasePrice: 0 as any, // 采购价
    installFlag: 0 as any, // 是否需要安装0不需要，1需要
    measureFlag: 0 as any, // 是否需要测量0不需要，1需要
    templateJson: [
      {
        templateId: '' as any
      }
    ] as any, // 是否需要测量模板json
    materialFlag: 0 as any // 是否材料库选材0商品，1是选材
  } as any
})

const handelActive = (value: any) => {
  rulesProduct.value.handleFinishCommit((val: any) => {
    if (val) {
      active.value = value
    }
  })
}

// 下一步
const productNextStep = () => {
  console.log(state.form.keywords)
  rulesProduct.value.handleFinishCommit((val: any) => {
    if (val) {
      if (active.value < tabs.value.length) {
        active.value = active.value + 1
      }
    }
  })
}
// 上一步
const lastStep = () => {
  if (active.value > 1) {
    active.value -= 1
  }
}

// 保存
const saveHandel = () => {
  let obj: any = {}
  rulesProduct.value.handleFinishCommit((val: any) => {
    if (val) {
      obj = JSON.parse(JSON.stringify(state.form))
      obj.keywords = obj.keywords.toString()
      obj.tags = obj.tags.toString()
      obj.containsProduct = obj.containsProduct.toString()
      obj.templateJson = JSON.stringify(obj.templateJson)
      // 把分期方式为百分比的ratio值除以100
      obj.payStages?.forEach((item: any) => {
        if (item.type === 1) {
          item.ratio = item.ratio / 100
        }
      })
      if (isEdit.value) {
        editData(obj)
      } else {
        addData(obj)
      }
    }
  })
}
// 关闭当前标签
async function closeSelectedTag(view: any) {
  const views: any = await tagsViewStore.delView(view)
  if (views && views.visitedViews) {
    const latestView = views.visitedViews.slice(-1)[0]
    if (latestView) {
      router.push(latestView)
    } else {
      router.push('/')
    }
  }
}
const saveFinish = () => {
  router.push({ path: '/commodity/tableList' })
  closeSelectedTag(router.currentRoute.value)
  // 为解决复制保存bug,点击保存后直接返回
  // if(active.value == tabs.value.length){
  // }else{
  //   active.value +=1;
  // }
}
const addData = async (obj: any) => {
  await fetch({
    url: '/mall/product/create',
    method: 'post',
    data: obj
  }).then((res: any) => {
    if (res.code === 0) {
      ElMessage.success('商品添加成功')
      active.value = 0
      saveFinish()
    }
  })
}

// 编辑商品
const editData = async (obj: any) => {
  await fetch({
    url: '/mall/product/update/' + state.form.id,
    method: 'post',
    data: obj
  }).then((res: any) => {
    if (res.code === 0) {
      ElMessage.success('商品编辑成功')
      saveFinish()
    }
  })
}

// 根据商品id查询商品信息
const getDefaultProductParam = async (flag:boolean) => {
  await fetch({
    url: '/mall/product/updateInfo/' + productId.value,
    method: 'get'
  })
    .then((res: any) => {
      state.form = res.data as any
      if (res.data.templateJson) {
        for (let i = 0; i < 5; i++) {
          if (typeof JSON.parse(res.data.templateJson) === 'string') {
            res.data.templateJson = JSON.parse(res.data.templateJson)
          } else {
            state.form.templateJson = JSON.parse(res.data.templateJson)
            break
          }
        }
      } else {
        state.form.templateJson = [{ templateId: '' as any }]
      }
      state.form.containsProduct = res.data.containsProduct
        ? res.data.containsProduct.split(',')
        : ''
      state.form.keywords = state.form.keywords?.split(',')[0]
        ? state.form.keywords?.split(',')
        : []
      state.form.tags = state.form.tags?.split(',')[0]
        ? state.form.tags?.split(',')
        : []
      state.form.productProcess.priceDescription = state.form.productProcess
        ?.priceDescription
        ? state.form.productProcess.priceDescription
        : '[]'
      state.form.productProcess.scope = state.form.productProcess.scope
        ? state.form.productProcess.scope
        : '[]'
      state.form.productProcess.constructionScene = state.form.productProcess
        .constructionScene
        ? state.form.productProcess.constructionScene
        : (JSON.stringify([
          {
            title: '',
            description: '',
            processPic: ''
          }
        ]) as any)
      if (query.value.isEdit == '3') {
        state.form.id = ''
      }
      if (!flag) active.value = 1
    })
    .catch((e: T) => {
      ElMessage.error(e.toString())
    })
}

onMounted(() => {
  if (query.value.isEdit == '2' || query.value.isEdit == '3') {
    getDefaultProductParam(false)
  } else {
    active.value = 1
  }
})
watchEffect(() => {
  if (
    state.form.customCategory == '1002'
  ) {
    tabs.value = ['商品信息', '商品详情', '施工信息']
  } else if (state.form.customCategory == '1003') {
    tabs.value = ['商品信息', '商品详情', '套餐信息']
  } else {
    tabs.value = ['商品信息', '商品详情']
  }
})
</script>

<style scoped lang="less">
.add-product-new {
  background: #fafafa;
  position: relative;
  height: calc(100vh - 11rem);
  margin: 0 -2rem;
  padding: 0 2rem;

  .bottom-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 86px;
    background: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;

    .el-button {
      margin-right: 2rem;
    }
  }
}
</style>
