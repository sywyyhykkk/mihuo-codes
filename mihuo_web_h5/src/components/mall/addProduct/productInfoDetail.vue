<template>
  <div style="margin-top: 10px; width: 100%">
    <div style="height: 60vh; overflow-y: scroll">
      <el-form
        ref="ruleForms"
        :model="dataValue"
        :rules="rules"
        label-width="13rem"
        style="width: 100%"
        size="small"
      >
        <el-row style="margin-bottom: -2rem">
          <el-col :span="12">
            <el-form-item label="商品分类(平台)" prop="platformCategoryId">
              <el-cascader
                v-model="selectProductCateValue2"
                :options="productCateOptions2"
                :props="defaultProps"
                @change="handleProductChange2"
              />
            </el-form-item>
            <el-form-item label="分类" prop="customCategory">
              <el-select
                v-model="dataValue.customCategory"
                placeholder="请选择分类"
                @change="handleSelectType"
              >
                <el-option
                  v-for="(item, index) in typeList"
                  :key="index"
                  :label="item.typeName"
                  :value="item.type"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="dataValue.customCategory == '1003'"
              label="商品及sku"
              prop="servicePackList"
            >
              <div>
                <el-button
                  :type="buttonType"
                  size="mini"
                  class="btn-add"
                  @click="selectProductType = true"
                >编辑商品
                </el-button>
                <div
                  v-for="(item,index) in dataValue.servicePackList"
                  :key="index"
                  style="display: flex"
                >
                  <div style="width: 150px; float: left">{{ item.productName }}</div>
                  &nbsp;<span>{{ item.skuCode }}</span>
                </div>
              </div>
            </el-form-item>

            <el-form-item
              v-if="dataValue.customCategory == '1003' ||dataValue.customCategory == '1002'"
              label="所需工种"
              prop="skillType"
            >
              <el-select
                v-model="dataValue.skillType"
                placeholder="请选择工种"
                @change="handleSkillTypeChange"
              >
                <el-option
                  v-for="(item, index) in skillTypeList"
                  :key="index"
                  :label="item.skillName"
                  :value="item.skillId"
                />
              </el-select>
            </el-form-item>

            <!--      <el-form-item label="选择商品" prop="skillType" v-if="value.type=='1005'">-->
            <!--        <el-select-->
            <!--          v-model="value.containsProduct"-->
            <!--          placeholder="请选择所需商品和服务"-->
            <!--          multiple-->
            <!--          filterable-->
            <!--        >-->
            <!--          <el-option-->
            <!--            v-for="item in productList"-->
            <!--            :key="item.id"-->
            <!--            :label="item.name"-->
            <!--            :value="item.id"-->
            <!--          />-->
            <!--        </el-select>-->
            <!--      </el-form-item>-->

            <el-form-item label="商品(服务)名称" prop="name">
              <el-input v-model="dataValue.name" />
            </el-form-item>
            <el-form-item label="副标题" prop="subTitle">
              <el-input v-model="dataValue.subTitle" />
            </el-form-item>
            <el-form-item label="商品品牌" prop="brandId">
              <el-select
                v-model="dataValue.brandId"
                filterable
                placeholder="请选择品牌"
                @change="handleBrandChange"
              >
                <el-option
                  v-for="(item, index) in brandOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="产地" prop="">
              <el-input v-model="dataValue.site" />
            </el-form-item>
            <el-form-item label="商品介绍" prop="description">
              <el-input
                v-model="dataValue.description"
                :auto-size="true"
                type="textarea"
                placeholder="请输入内容"
              />
            </el-form-item>
            <el-form-item label="商品货号" prop="productSn">
              <el-input v-model="dataValue.productSn" />
            </el-form-item>
            <el-form-item label="采购价" prop="price">
              <el-input
                v-model="dataValue.purchasePrice"
                disabled
                type="number"
                style="width: 19rem"
              >
                <template #append>元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="商品售价" prop="price">
              <el-input v-model="dataValue.price" type="number" style="width: 19rem">
                <template #append>元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="市场价">
              <el-input v-model="dataValue.originalPrice" type="number" />
            </el-form-item>
            <el-form-item label="商品库存">
              <el-input v-model="dataValue.stock" type="number" />
            </el-form-item>
            <el-form-item label="商品销量">
              <el-input v-model="dataValue.sale" type="number" />
            </el-form-item>
            <el-form-item label="计量单位" prop="unit">
              <el-input v-model="dataValue.unit" />
            </el-form-item>
            <el-form-item label="商品重量">
              <el-input v-model="dataValue.weight" type="number" style="width: 19rem">
                <template #append>千克</template>
              </el-input>
              <!--        <span style="margin-left: 20px">克</span>-->
            </el-form-item>
            <el-form-item label="排序">
              <el-input v-model="dataValue.sort" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="protType == 2"
              label="商品分类(企业)"
              prop="productCategoryId"
            >
              <el-cascader
                v-model="selectProductCateValue"
                :options="productCateOptions"
                :props="defaultProps"
                @change="handleProductChange"
              />
            </el-form-item>
            <el-form-item label="是否需要测量">
              <el-switch
                v-model="dataValue.measureFlag"
                :active-value="1"
                :inactive-value="0"
              />
            </el-form-item>
            <div v-if="dataValue.measureFlag==1">
              <div v-for="(item,index) in dataValue.templateJson" :key="item.id">
                <el-form-item
                  :label="`第${index+1}次测量问卷`"
                  :prop="`templateJson.${index}.templateId`"
                  :rules="[{ required: true, message: `请选择第${index+1}次测量问卷`, trigger: 'blur'}]"
                >
                  <el-select v-model="item.templateId" clearable>
                    <el-option
                      v-for="item2 in templateList"
                      :key="item2.id"
                      :label="item2.surveyName"
                      :value="item2.id"
                    />
                  </el-select>
                  <el-button
                    v-if="dataValue.templateJson.length>1"
                    icon="delete"
                    style="margin-left: 1rem"
                    type="text"
                    class="danger"
                    @click="deleteTemplateItem(index)"
                  />
                </el-form-item>
                <el-form-item v-if="(index+1)==dataValue.templateJson.length">
                  <el-button icon="plus" type="text" @click="addTemplateList">添加</el-button>
                </el-form-item>
              </div>
            </div>
            <el-form-item label="是否需要安装">
              <el-switch
                v-model="dataValue.installFlag"
                :active-value="1"
                :inactive-value="0"
              />
            </el-form-item>
            <el-form-item label="默认供应商">
              <el-select v-model="dataValue.supplierId" filterable @change="selectSupplier">
                <el-option
                  v-for="(item,index) in supplierList"
                  :key="index"
                  :label="item.supplierName"
                  :value="item.supplierCompanyId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div style="text-align: center; margin-top: 2.2rem;position: absolute;width: 100%">
      <el-button
        type="primary"
        size="medium"
        @click="handleNext()"
      >下一步，填写商品促销
      </el-button>
    </div>
    <el-dialog
      v-model="selectProductType"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="选择商品"
      width="106rem"
    >
      <div style="height: 55vh; overflow-y: auto;padding-right: 2rem;padding-top: 2rem">
        <SkuSelect
          v-model="dataValue.servicePackList"
          :is-edit="isEdit"
          :prot-type="protType"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="confirmSelect">确 定</el-button>
          <el-button @click="cancelSelect">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  onMounted,
  ref,
  computed
} from 'vue'
import { fetch } from '_@/axios-config/axios'
import SkuSelect from './skuSelect.vue'

export default defineComponent({
  components: { SkuSelect },

  props: {
    modelValue: {
      type: Object,
      default: null
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
    }
  },
  setup(props, { emit }) {
    const ruleForms = ref<any>('')
    const state = reactive({
      supplierList: [],
      templateList: [],
      typeList: [
        {
          typeName: '材料',
          type: '1001'
        },
        {
          typeName: '服务',
          type: '1002'
        },
        {
          typeName: '服务包',
          type: '1003'
        }
      ],
      selectProductType: false,
      skillTypeList: [] as any,
      hasEditCreated: false,
      dataValue: props.modelValue as any,
      brandOptions: [
        {
          id: 0 as any,
          name: '' as any
        }
      ],
      selectProductCateValue: [] as any,
      selectProductCateValue2: [] as any,
      productCateOptions: [],
      productCateOptions2: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id'
      },
      productList: []
    })
    const rules = reactive({
      name: [
        { required: true, message: '请输入商品名称', trigger: 'blur' }
        // { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
      ],
      subTitle: [
        { required: true, message: '请输入商品副标题', trigger: 'blur' }
      ],
      customCategory: [{ required: true, message: '请选择商品分类', trigger: 'blur' }],
      productCategoryId: [
        { required: true, message: '请选择商品企业分类', trigger: 'blur' }
      ],
      platformCategoryId: [
        { required: true, message: '请选择商品平台分类', trigger: 'blur' }
      ],
      servicePackList: [
        { required: true, message: '请选择商品及sku', trigger: 'blur' }
      ],
      skillType: [{ required: true, message: '请选择工种', trigger: 'blur' }],
      brandId: [{ required: true, message: '请选择商品品牌', trigger: 'blur' }],
      description: [
        { required: true, message: '请输入商品介绍', trigger: 'blur' }
      ],
      productSn: [{ required: true, message: '该项为必填项', trigger: 'blur' }],
      price: [{ required: true, message: '售价必填', trigger: 'blur' }],
      unit: [{ required: true, message: '单位必填', trigger: 'blur' }]
    })
    const selectSupplier = (val: any) => {
      state.supplierList.map((res: any) => {
        if (res.supplierCompanyId == val) {
          state.dataValue.supplierName = res.supplierName
          return
        }
      })
    }
    const getSupplierData = async () => {
      await fetch({
        url: '/admin/companysupplier/page',
        method: 'get',
        params: {
          size: 999,
          current: 1
        }
      }).then((res: any) => {
        state.supplierList = res.data.records
      })
    }
    const addTemplateList = () => {
      state.dataValue.templateJson.push({
        templateId: '' as any
      })
    }
    const deleteTemplateItem = (index: any) => {
      state.dataValue.templateJson.splice(index, 1)
    }
    const getTemplateList = async () => {
      await fetch({
        url: `/basic/surveytemplate/getAllTemplates`,
        method: 'get'
      }).then((res: any) => {
        state.templateList = res.data
      })
    }
    const setName = (datas: any, id: any) => {
      if (datas.id === id) {
        state.dataValue.productCategoryName = datas.name
        state.dataValue.treeCode = datas.treeCode
      } else if (datas.children && datas.children.length > 0) {
        datas.children.forEach((item: any) => {
          setName(item, id)
        })
      }
    }
    const getCateNameById = (id: any) => {
      state.productCateOptions.forEach((item: any) => {
        if (item.id === id) {
          state.dataValue.productCategoryName = item.name
          state.dataValue.treeCode = item.treeCode
          state.selectProductCateValue.push[item.id]
        } else {
          setName(item, id)
        }
      })
    }
    const setName2 = (datas: any, id: any) => {
      if (datas.id === id) {
        state.dataValue.platformCategoryName = datas.name
        state.dataValue.platformTreeCode = datas.treeCode
      } else if (datas.children && datas.children.length > 0) {
        datas.children.forEach((item: any) => {
          setName2(item, id)
        })
      }
    }
    const getCateNameById2 = (id: any) => {
      state.productCateOptions2.forEach((item: any) => {
        if (item.id === id) {
          state.dataValue.platformCategoryName = item.name
          state.dataValue.platformTreeCode = item.treeCode
          state.selectProductCateValue2.push[item.id]
        } else {
          setName2(item, id)
        }
      })
    }

    const handleNext = () => {
      ruleForms.value.validate((valid: any) => {
        console.log(state.dataValue)
        if (valid) {
          emit('nextStep')
        } else {
          // emit('nextStep')
          alert('请把信息填写完整')
          // return false
        }
      })
    }
    const productcategory = async () => {
      await fetch({
        url: `/mall/productcategory/tree`,
        method: 'get'
      }).then((res: any) => {
        state.productCateOptions = res.data
      })
    }
    const productcategoryPlat = async () => {
      await fetch({
        url: `/mall/platformcategory/tree`,
        method: 'get'
      }).then((res: any) => {
        state.productCateOptions2 = res.data
      })
    }
    const getProductList = async () => {
      await fetch({
        url: `/mall/product/getList/${props.protType}`,
        method: 'get'
      }).then((res: any) => {
        state.productList = res.data
      })
    }
    const getBrandList = async () => {
      await fetch({
        url: `/mall/brand/list`,
        method: 'get'
      }).then((res: any) => {
        state.brandOptions = res.data
      })
    }
    const handleBrandChange = (val: any) => {
      let brandName = ''
      for (let i = 0; i < state.brandOptions.length; i++) {
        if (state.brandOptions[i].id === val) {
          brandName = state.brandOptions[i].name
          break
        }
      }
      state.dataValue.brandName = brandName
    }
    const handleSkillTypeChange = (val: any) => {
      for (let i = 0; i < state.skillTypeList.length; i++) {
        if (state.skillTypeList[i].skillId === val) {
          state.dataValue.skillTypeName = state.skillTypeList[i].skillName
          break
        }
      }
    }
    const handleSelectType = (val: any) => {
      if (val === '1003') {
        state.selectProductType = true
      }
    }
    const handleProductChange2 = (val: any) => {
      state.productCateOptions2.forEach((item: any) => {
        if (item.id === state.selectProductCateValue2[0]) {
          state.dataValue.type = item.treeCode
          // if (item.treeCode === '1005') {
          //   state.selectProductType = true
          // }
        }
      })
      state.dataValue.platformCategoryId =
        state.selectProductCateValue2[state.selectProductCateValue2.length - 1]
      getCateNameById2(state.dataValue.platformCategoryId)
    }

    const handleProductChange = (val: any) => {
      state.dataValue.productCategoryId =
        state.selectProductCateValue[state.selectProductCateValue.length - 1]
      getCateNameById(state.dataValue.productCategoryId)
    }
    const getSkillType = async () => {
      await fetch({
        url: '/admin/sysjobskill/getJobSkillList',
        method: 'get',
        params: {
          type: 2
        }
      }).then((res: any) => {
        state.skillTypeList = res.data
      })
    }
    const productId = computed(() => {
      return state.dataValue.id
    })
    const cancelSelect = () => {
      props.isEdit ? '' : state.dataValue.servicePackList = []
      state.selectProductType = false
    }
    const confirmSelect = () => {
      state.selectProductType = false
    }

    onMounted(() => {
      state.selectProductCateValue = state.dataValue.productCategoryId
      state.selectProductCateValue2 = state.dataValue.platformCategoryId
      state.dataValue.skillType = state.dataValue.skillType
        ? state.dataValue.skillType
        : ''
      // state.dataValue.skillType = state.dataValue.skillType
      productcategory()
      productcategoryPlat()
      getBrandList()
      getSkillType()
      getTemplateList()
      getSupplierData()
      // getProductList()
    })
    return {
      rules,
      ruleForms,
      productId,
      deleteTemplateItem,
      selectSupplier,
      addTemplateList,
      cancelSelect,
      confirmSelect,
      setName,
      getCateNameById,
      setName2,
      getCateNameById2,
      handleNext,
      productcategory,
      productcategoryPlat,
      getBrandList,
      handleBrandChange,
      getSkillType,
      handleSkillTypeChange,
      handleProductChange,
      handleSelectType,
      handleProductChange2,
      getProductList,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
:deep(.el-dialog) {
  height: 78vh;
  overflow: auto;
}
</style>
