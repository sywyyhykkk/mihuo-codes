<template>
  <div class="form-container">
    <!--    <el-card class="form-container" shadow="never">-->
    <el-steps
      :active="active"
      finish-status="success"
      align-center
    >
      <el-step title="填写商品信息" />
      <el-step title="填写商品促销" />
      <el-step title="填写商品属性" />
      <!--        <el-step title="填写施工信息" />-->
      <!--        服务有施工信息、服务包没有施工信息（老版）-->
      <!--        服务、服务包都要有施工信息（1.1）-->
      <el-step
        v-if="
          productParam.customCategory == '1002' ||
            productParam.customCategory == '1003'
        "
        title="填写施工信息"
      />
    </el-steps>

    <product-info-detail
      v-if="showStatus[0]"
      v-model="productParam"
      :is-edit="isEdits"
      :company-id="companyId"
      :button-type="buttonType"
      :prot-type="protType"
      @nextStep="nextStep"
    />
    <product-sale-detail
      v-if="showStatus[1]"
      v-model="productParam"
      :is-edit="isEdits"
      :company-id="companyId"
      :button-type="buttonType"
      :prot-type="protType"
      @nextStep="nextStep"
      @prevStep="prevStep"
    />
    <productAttrDetail
      v-if="showStatus[2]"
      v-model="productParam"
      :is-edit="isEdits"
      :company-id="companyId"
      :button-type="buttonType"
      :prot-type="protType"
      @nextStep="nextStep"
      @prevStep="prevStep"
      @finishCommit="finishCommit"
    />
    <productConstructionDetail
      v-if="showStatus[3]"
      v-model="productParam"
      :is-edit="isEdits"
      :company-id="companyId"
      :button-type="buttonType"
      :prot-type="protType"
      @nextStep="nextStep"
      @prevStep="prevStep"
      @finishCommit="finishCommit"
    />
    <!--    </el-card>-->
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import productInfoDetail from './productInfoDetail.vue'
import productSaleDetail from './productSaleDetail.vue'
import productAttrDetail from './productAttrDetail.vue'
import productConstructionDetail from './productConstructionDetail.vue'
import { fetch } from '_@/axios-config/axios'

export default defineComponent({
  components: {
    productInfoDetail,
    productSaleDetail,
    productAttrDetail,
    productConstructionDetail
  },
  props: {
    defaultProductParam: {
      type: Object,
      default: null
    },
    isCopy: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    protType: {
      //	type=1平台分类，type=2企业分类,type=3运营
      type: Number,
      default: 2
    },
    companyId: {
      // 企业编号(type=2必传)
      type: Number || String,
      default: 0
    },
    buttonType: {
      type: String,
      default: 'primary'
    },
    cityOperatorId: {
      type: Number || String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const ruleForms = ref<any>('')
    const defaultProductParam = {
      // 服务/服务包customCategory=1002/customCategory=1003
      applicable: '', // 适用说明
      issueDescription: '', // 发包说明
      hoursDescription: '', // 工时说明
      billingDescription: '', // 计费说明
      settlementDescription: '', // 结算说明
      // 材料类商品customCategory=1001
      quoteDescription: '', // 定额说明
      deliveryDescription: '', // 发货说明
      refundDescription: '', // 退货说明
      configuration: '', // 配置说明
      freightInstallationTemplateId: '', // 入户/安装费模版id
      freightTemplateId: '', // 运费模版id
      // cityOperatorId:props.cityOperatorId,
      // companyId: props.companyId,
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
      // 商品满减
      productFullReductionList: [{ fullPrice: 0, reducePrice: 0 }],
      // 商品阶梯价格
      productLadderList: [{ count: 0, discount: 0, price: 0 }],
      previewStatus: 0,
      price: null,
      productAttributeCategoryId: '0',
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
      unit: '',
      usePointLimit: 0,
      verifyStatus: 0,
      type: '',
      weight: null,
      platformType: props.protType, // 1平台端，2企业端，3运营端
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
        scope: '[]' as any // 适用范围
      } as any,
      supplierId: '' as any, // 供应商id
      supplierName: '' as any, // 供应商名称
      purchasePrice: 0 as any, // 采购价
      installFlag: 0 as any, // 是否需要安装0不需要，1需要
      measureFlag: 0 as any, // 是否需要测量0不需要，1需要
      templateJson: [{
        templateId: '' as any
      }] as any, // 是否需要测量模板json
      materialFlag: 0 as any // 是否材料库选材0商品，1是选材
    }
    const state = reactive({
      active: 0,
      productParam:
        props.isEdit === true ? props.defaultProductParam : defaultProductParam,
      showStatus: [true, false, false, false],
      isEdits: props.isEdit,
      isCopy: props.isCopy,
      form: {
        name: ''
      }
    })

    const hideAll = () => {
      for (let i = 0; i < state.showStatus.length; i++) {
        state.showStatus[i] = false
      }
    }
    const prevStep = () => {
      if (state.active > 0 && state.active < state.showStatus.length) {
        state.active--
        hideAll()
        state.showStatus[state.active] = true
      }
    }
    const nextStep = () => {
      if (state.active < state.showStatus.length - 1) {
        state.active++
        hideAll()
        state.showStatus[state.active] = true
      }
    }
    const addData = async () => {
      await fetch({
        url: '/mall/product/create',
        method: 'post',
        data: state.productParam
      }).then((res: any) => {
        if (res.code === 0) {
          ElMessage.success('商品添加成功')
          state.active = 0
          state.showStatus = [true, false, false]
          emit('handleAddProductCate')
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
    const editData = async () => {
      await fetch({
        url: '/mall/product/update/' + state.productParam.id,
        method: 'post',
        data: state.productParam
      }).then((res: any) => {
        if (res.code === 0) {
          ElMessage.success('商品编辑成功')
          state.active = 0
          state.showStatus = [true, false, false]
          emit('handleAddProductCate')
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
    const finishCommit = () => {
      state.productParam.companyId = props.companyId
      state.productParam.containsProduct = state.productParam.containsProduct.toString()
      state.productParam.templateJson = JSON.stringify(state.productParam.templateJson)
      ElMessageBox.confirm('是否要提交该产品', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (props.isEdit && props.isCopy) {
          state.productParam.verifyStatus = 0
          addData()
        } else if (props.isEdit) {
          editData()
        } else {
          addData()
        }
      })
    }

    return {
      // rules,
      ruleForms,
      hideAll,
      nextStep,
      prevStep,
      addData,
      editData,
      finishCommit,
      // getDefaultProductParam,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
.form-container {
  width: 110rem;
  margin: 0 auto;
  padding-top: 2rem;
}
</style>
