<template>
  <el-dialog
    v-if="visibleSync"
    v-model="visibleSync"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    append-to-body
    width="130rem"
    title="选择商品"
    @close="handleClose"
  >
    <div class="bodyInfo">
      <el-card>
        <el-input
          v-model="listQuery.keyword"
          style="width: 203px"
          placeholder="关键字、商品名称"
          prefix-icon="search"
        />
        <el-input
          v-model="listQuery.productSn"
          style="width: 203px"
          placeholder="商品货号"
          prefix-icon="search"
        />
        <el-cascader
          v-model="treeCode"
          placeholder="请选择商品分类"
          clearable
          :props="defaultProps"
          :options="productCateOptions"
          @change="handleChange"
        />

        <el-select
          v-model="listQuery.brandId"
          placeholder="请选择品牌"
          clearable
        >
          <el-option
            v-for="item in brandOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <!--        <el-select-->
        <!--          v-model="listQuery.publishStatus"-->
        <!--          placeholder="上架状态"-->
        <!--          clearable-->
        <!--        >-->
        <!--          <el-option-->
        <!--            v-for="item in publishStatusOptions"-->
        <!--            :key="item.value"-->
        <!--            :label="item.label"-->
        <!--            :value="item.value"-->
        <!--          />-->
        <!--        </el-select>-->

        <!--        <el-select-->
        <!--          v-model="listQuery.verifyStatus"-->
        <!--          placeholder="审核状态"-->
        <!--          clearable-->
        <!--        >-->
        <!--          <el-option-->
        <!--            v-for="item in verifyStatusOptions"-->
        <!--            :key="item.value"-->
        <!--            :label="item.label"-->
        <!--            :value="item.value"-->
        <!--          />-->
        <!--        </el-select>-->

        <div class="el-card-right" style="display: flex">
          <el-button type="primary" icon="Search" @click="handleSearchList()">
            查询
          </el-button>
          <el-button icon="refreshLeft" @click="handleResetSearch()">
            重置
          </el-button>
        </div>
      </el-card>
      <div>
        <el-table
          ref="productCateTable"
          v-loading="loading"
          stripe
          :highlight-current-row="single"
          :data="tableData"
          border
          :height="'0'"
          style="height: 60vh !important"
          @current-change="handleSelectionChange"
          @selection-change="handleSelectionChange"
          @row-click="handleRowClick"
        >
          <el-table-column
            v-if="!single"
            type="selection"
            align="center"
            width="80"
          />
          <el-table-column label="商品图片" width="80" align="center">
            <template #default="scope">
              <el-image
                preview-teleported
                lazy
                :src="$imageGlobal + scope.row.coverImg"
                :preview-src-list="$getUrl.getPicUrl(scope.row.coverImg)"
              />
            </template>
          </el-table-column>
          <el-table-column label="商品名称" align="center">
            <template #default="scope">
              <p>{{ scope.row.name }}</p>
              <p>品牌：{{ scope.row.brandName }}</p>
              <p>关键字：{{ scope.row.keywords }}</p>
            </template>
          </el-table-column>
          <el-table-column label="价格/货号" align="center">
            <template #default="scope">
              <p>价格：￥{{ scope.row.price }}</p>
              <p>货号：{{ scope.row.productSn }}</p>
            </template>
          </el-table-column>
          <el-table-column label="标签" align="center">
            <template #default="scope">
              <p @click="handlePublishStatusChange(scope.row)">
                上架：
                <el-switch
                  v-model="scope.row.publishStatus"
                  disabled
                  :active-value="1"
                  :inactive-value="0"
                  :active-color="buttonType === 'warning' ? '#fd6d34' : ''"
                />
              </p>
              <p @click="handleNewStatusChange(scope.row)">
                新品：
                <el-switch
                  v-model="scope.row.newStatus"
                  disabled
                  :active-value="1"
                  :inactive-value="0"
                  :active-color="buttonType === 'warning' ? '#fd6d34' : ''"
                />
              </p>
              <p @click="handleRecommendStatusChange(scope.row)">
                推荐：
                <el-switch
                  v-model="scope.row.recommandStatus"
                  disabled
                  :active-value="1"
                  :inactive-value="0"
                  :active-color="buttonType === 'warning' ? '#fd6d34' : ''"
                />
              </p>
            </template>
          </el-table-column>
          <el-table-column
            label="排序"
            prop="sort"
            width="60"
            align="center"
          />
          <el-table-column label="销量" prop="sale" align="center" />
        </el-table>
      </div>
      <div class="pagination-container">
        <el-pagination-new
          style="position: relative"
          :current-page="currentPage"
          :page-size="pagesize"
          :total="total"
          layout="total, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="appendData">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  inject,
  reactive,
  ref,
  toRefs,
  unref,
  watchEffect,
  watch
} from 'vue'
import { ElMessage } from 'element-plus'
import { fetch } from '_@/axios-config/axios'

export default defineComponent({
  components: {},
  props: {
    modelValue: Boolean,
    single: {
      type: Boolean,
      default: false
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
    // 1 => customCategory = 1001(材料)  2 => customCategory = 1002(服务) 3 => customCategory = 1020(优惠券)
    productType: {
      type: Number || String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const platformType = inject('platformType')
    const visibleSync = ref(props.modelValue)
    const total = ref<number>(0)
    const currentPage = ref<number>(1)
    const pageSize = ref<number>(5)
    const formDialogVisible = ref<boolean>(false)
    const addProductShow = ref<boolean>(false)
    const isEdit = ref<boolean>(false)
    const formType = ref<string>('')
    const tableHeight = ref<any>(0)
    const listQueryForm = ref()
    const defaultProductParam = ref<any>({})
    const skuForm = ref()
    const editSkuInfo = ref({
      tableData: [],
      spData: [],
      keyword: ''
    })
    const state = reactive<any>({
      customCategory: '',
      formAudit: {
        auditRemark: '',
        ids: [],
        optionKey: '',
        optionValue: 0
      },
      batchAuditType: false,
      batchAuditButtonType: false,
      tableData: [],
      operateType: '',
      mallIds: [],
      spData: [],
      form: {},
      currentPage: 1,
      total: 0,
      pagesize: 10,
      productCateOptions: [],
      brandOptions: [],
      batchList: [],
      publishStatusOptions: [
        {
          value: 1,
          label: '上架'
        },
        {
          value: 0,
          label: '下架'
        }
      ],
      verifyStatusOptions: [
        {
          value: 2,
          label: '驳回'
        },
        {
          value: 1,
          label: '通过'
        },
        {
          value: 0,
          label: '未审核'
        }
      ],
      operates: [
        {
          label: '商品上架',
          value: '1-1-publishStatus',
          optionKey: 'publishStatus'
        },
        {
          label: '商品下架',
          value: '1-0-publishStatus',
          optionKey: 'publishStatus'
        },
        {
          label: '设为推荐',
          value: '2-1-recommendStatus',
          optionKey: 'recommendStatus'
        },
        {
          label: '取消推荐',
          value: '2-0-recommendStatus',
          optionKey: 'recommendStatus'
        },
        {
          label: '设为新品',
          value: '3-1-newStatus',
          optionKey: 'newStatus'
        },
        {
          label: '取消新品',
          value: '3-0-newStatus',
          optionKey: 'newStatus'
        }
      ],
      listQuery: {
        keyword: '',
        productSn: '',
        brandId: '',
        publishStatus: '1',
        verifyStatus: '1',
        productCategoryId: ''
      },
      treeCode: ''
    })
    watch(
      () => props.modelValue,
      (newValue, oldValue) => {
        visibleSync.value = props.modelValue
        visibleSync.value && getClassificationGoods()
      }
    )

    onMounted(() => {
      getBrandTypeList()
      getClassificationGoods()
      // 获取分类名称
    })

    const handleAddProductCate = () => {
      addProductShow.value = !addProductShow.value
      isEdit.value = false
    }
    const handleAddProductCate2 = () => {
      addProductShow.value = !addProductShow.value
      isEdit.value = false
      getData()
    }
    const getDefaultProductParam = async (id: any) => {
      await fetch({
        url: '/mall/product/updateInfo/' + id,
        method: 'get'
      }).then((res: any) => {
        addProductShow.value = !addProductShow.value
        isEdit.value = true
        defaultProductParam.value = res.data as any
        defaultProductParam.value.containsProduct = res.data.containsProduct
          ? res.data.containsProduct.split(',')
          : ''
        defaultProductParam.value.skillType = res.data.skillType
      })
    }
    const handleUpdateProduct = (e: any) => {
      getDefaultProductParam(e.id)
    }
    const appendData = () => {
      emit('getGeneralMaterial', ref(state.mallIds))
      visibleSync.value = false
      emit('update:modelValue', false)
      emit('input', false)
    }

    const handleClose = () => {
      state.treeCode = ''
      state.customCategory = ''
      state.tableData = []
      state.currentPage = 0
      visibleSync.value = false
      state.tableData = []
      emit('update:modelValue', false)
      emit('input', false)
    }

    const handleCurrentChange = (val: number) => {
      state.currentPage = val
      getData()
    }
    const getData = async () => {
      await fetch({
        url: '/mall/product/page',
        method: 'get',
        params: {
          size: state.pageSize,
          // companyId: props.companyId,
          current: state.currentPage,
          treeCode: state.treeCode,
          customCategory: state.customCategory,
          // platformType: platformType,
          ...state.listQuery
        }
      }).then((res: any) => {
        state.tableData = res.data.records
        state.total = res.data.total
        state.loading = false
      })
    }

    const getBrandTypeList = async () => {
      await fetch({
        url: `/mall/brand/list`,
        method: 'get'
      }).then((res: any) => {
        state.brandOptions = res.data
      })
    }

    const getClassificationGoods = async () => {
      await fetch({
        url: `/mall/platformcategory/tree`,
        method: 'get'
      }).then((res: any) => {
        state.productCateOptions = res.data
        if (props.productType == 1) {
          // 服务
          state.customCategory = '1002'
        }
        if (props.productType == 2) {
          // 材料
          state.customCategory = '1001'
        }
        if (props.productType == 3) {
          // 优惠券
          state.customCategory = '1020'
        }
        if (res.data) {
          getData()
        }
      })
    }

    const defaultProps = reactive({
      children: 'children',
      label: 'name',
      value: 'treeCode',
      // value: 'id',
      checkStrictly: true
    })

    const handleSearchList = () => {
      getData()
    }
    const handleChange = (value: any) => {
      for (const key in value) {
        state.treeCode = value[key]
        // state.listQuery.productCategoryId = value[key]
      }
    }

    const handleResetSearch = () => {
      unref(listQueryForm).resetFields()
      getData()
    }
    const handleSearchEditSku = async () => {
      await fetch({
        url: `/mall/sku/${skuForm.value.id}`,
        method: 'get',
        params: {
          keyword: editSkuInfo.value.keyword
        }
      }).then((res) => {
        res.data.map((item: any) => {
          // item.spData = JSON.parse(item.spData)
          state.spData = JSON.parse(item.spData)
        })
        editSkuInfo.value['tableData'] = res.data
        editSkuInfo.value['spData'] = state.spData
      })
    }
    const handleShowVerifyDetail = (index: any, row: any) => {
      state.formAudit.auditRemark = row.auditRemark
      state.formAudit.optionValue = row.verifyStatus
      state.batchAuditType = true
      state.batchAuditButtonType = true
    }
    const handlePublishStatusChange = (e: any) => {
      // 上下架
      mallUpdate([e.id], 'publishStatus', e.publishStatus)
    }
    const handleNewStatusChange = (e: any) => {
      mallUpdate([e.id], 'newStatus', e.newStatus)
    }

    const handleRecommendStatusChange = (e: any) => {
      mallUpdate([e.id], 'recommendStatus', e.recommandStatus)
    }
    const mallUpdate = async (id: any, key: any, value: any) => {
      await fetch({
        url: `/mall/product/batchUpdate`,
        method: 'post',
        data: {
          ids: id,
          optionKey: key,
          optionValue: value
        }
      }).then((res: any) => {
        state.mallIds = []
        getData()
      })
    }

    const getChangeOperateType = (e: any) => {
      state.batchObject = e.split('-')
    }

    // 多选
    const handleSelectionChange = (row: any) => {
      state.mallIds = []
      if (!props.single) {
        state.mallIds.push(row)
      }
    }

    // 单选
    const handleRowClick = (row: any) => {
      if (props.single) {
        state.mallIds.push(row)
      }
    }

    const getProductSkuSp = (row: any, index: number) => {
      const spData = JSON.parse(row.spData)
      if (spData != null && index < spData.length) {
        return spData[index].value
      } else {
        return null
      }
    }

    return {
      total,
      currentPage,
      pageSize,
      formDialogVisible,
      formType,
      tableHeight,
      listQueryForm,
      defaultProps,
      skuForm,
      editSkuInfo,
      addProductShow,
      isEdit,
      visibleSync,
      defaultProductParam,
      getProductSkuSp,
      handleSearchEditSku,
      handleSelectionChange,
      handleRowClick,
      mallUpdate,
      getData,
      handleChange,
      handleShowVerifyDetail,
      handleUpdateProduct,
      handleSearchList,
      handleResetSearch,
      handleAddProductCate,
      handleAddProductCate2,
      handlePublishStatusChange,
      handleNewStatusChange,
      handleRecommendStatusChange,
      getBrandTypeList,
      getClassificationGoods,
      handleCurrentChange,
      getChangeOperateType,
      getDefaultProductParam,
      appendData,
      handleClose,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
//.bodyInfo {
//  //width: -webkit-fill-available;
//  //width: fill-available;
//  //height: 75vh;
//  overflow-y: auto;
//}
//
//.tableList {
//  margin-top: 20px;
//}
//
//.filter-container {
//  margin-bottom: 20px;
//}
//
//.operate-container {
//  :deep(.el-card__body) {
//    display: flex;
//    justify-content: space-between;
//  }
//}
//
//.m-container-footer {
//  text-align: right;
//  margin-top: 25px;
//}
</style>
