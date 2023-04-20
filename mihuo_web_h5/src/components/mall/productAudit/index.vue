<template>
  <div>
    <el-card shadow="never">
      <el-input
        v-model="listQuery.keyword"
        style="margin-right: 10px; width: 150px"
        placeholder="关键字、商品名称"
      />
      <el-input
        v-model="listQuery.productSn"
        style="margin-right: 10px; width: 150px"
        placeholder="商品货号"
      />
      <el-cascader
        v-model="listQuery.treeCode"
        class="el-input-search"
        :props="treeCodeDefaultProps"
        :options="productCateOptions"
        placeholder="商品分类"
        @change="handleTreeCodeChange"
      />
      <el-select
        v-model="listQuery.publishStatus"
        style="margin-right: 10px; width: 150px"
        placeholder="上架状态"
        clearable
      >
        <el-option
          v-for="item in publishStatusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="listQuery.verifyStatus"
        style="margin-right: 10px; width: 150px"
        placeholder="审核状态"
        clearable
      >
        <el-option
          v-for="item in verifyStatusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="listQuery.companyId"
        filterable
        :filter-method="dataFilter"
        style="margin-right: 10px; width: 150px"
        placeholder="供应商"
        clearable
      >
        <el-option
          v-for="item in companys"
          :key="item.companyId"
          :label="item.companyName"
          :value="item.companyId"
        />
      </el-select>
      <el-button
        style="margin-right: 10px"
        :type="buttonType"
        size="small"
        class="btn-add"
        icon="Search"
        @click="handleSearchList()"
      >
        查询
      </el-button>
      <el-button
        style="margin-right: 10px"
        size="small"
        @click="handleResetSearch()"
      >
        重置
      </el-button>

      <div class="el-card-right">
        <el-select
          v-model="operateType"
          size="small"
          placeholder="批量操作"
          @change="getChangeOperateType"
        >
          <el-option
            v-for="(item, index) in operates"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button
          :type="buttonType"
          style="margin-left: 5px"
          size="small"
          class="btn-add"
          @click="batchOperation()"
        >
          确定
        </el-button>
      </div>
    </el-card>
    <div>
      <el-table
        ref="productCateTable"
        v-loading="loading"
        stripe
        style="width: 100%"
        :data="tableData"
        :height="tableHeight"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="60" align="center" />
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
        <el-table-column label="供应商" align="center" prop="companyName" />
        <el-table-column label="标签" align="center">
          <template #default="scope">
            <p @click="handlePublishStatusChange(scope.row)">
              上架：
              <el-switch
                v-model="scope.row.publishStatus"
                :active-value="1"
                :inactive-value="0"
              />
            </p>
            <!--            <p @click="handleNewStatusChange(scope.row)">-->
            <!--              新品：-->
            <!--              <el-switch-->
            <!--                v-model="scope.row.newStatus"-->
            <!--                :active-value="1"-->
            <!--                :inactive-value="0"-->
            <!--              />-->
            <!--            </p>-->
            <!--            <p @click="handleRecommendStatusChange(scope.row)">-->
            <!--              推荐：-->
            <!--              <el-switch-->
            <!--                v-model="scope.row.recommandStatus"-->
            <!--                :active-value="1"-->
            <!--                :inactive-value="0"-->
            <!--              />-->
            <!--            </p>-->
            <p @click="handleHomeRecommendStatusChange(scope.row)">
              首页推荐：
              <el-switch
                v-model="scope.row.operatorRecommand"
                :active-value="1"
                :inactive-value="0"
              />
            </p>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          label="排序"
          prop="operatorSort"
          width="80"
          align="center"
        />
        <el-table-column label="SKU库存" width="100" align="center">
          <template #default="scope">
            <el-button
              :type="buttonType"
              icon="edit"
              circle
              @click="handleShowSkuEditDialog(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="销量"
          prop="sale"
          width="100"
          align="center"
        />
        <el-table-column label="审核状态" width="100" align="center">
          <template #default="scope">
            <!--            <p>{{ scope.row.verifyStatus }}</p>-->
            <el-tag
              style="
                margin-left: 5px;
                margin-top: 5px;
                background: linear-gradient(to right, #fd8e4b, #fd6d34);
                color: white;
              "
              type="success"
              size="small"
              disable-transitions
            >{{
              scope.row.verifyStatus == 0
                ? '未审核'
                : scope.row.verifyStatus == 1
                  ? '通过'
                  : '驳回'
            }}
            </el-tag>
            <p>
              <el-button
                type="text"
                @click="handleShowVerifyDetail(scope.$index, scope.row)"
              >审核详情
              </el-button>
            </p>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="160"
          align="center"
        >
          <template #default="scope">
            <p>
              <el-button
                size="small"
                @click="handleUpdateProduct(scope.row)"
              >审核
              </el-button>
              <el-button
                size="small"
                @click="handleEdit(scope.row)"
              >排序
              </el-button>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination-new
      :current-page="currentPage"
      :page-size="+pageSize"
      :total="+total"
      layout="total, prev, pager, next, jumper"
      @current-change="handleCurrentChange"
    />

    <el-dialog
      v-model="formDialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="编辑货品信息"
      width="110rem"
    >
      <div class="m-container">
        <span>sku号：</span>
        <span>{{ editSkuInfo.productSn }}</span>
        <el-input
          v-model="editSkuInfo.keyword"
          placeholder="按sku编号搜索"
          size="small"
          style="width: 50%; margin-left: 20px"
        >
          <template #append>
            <el-button icon="Search" @click="handleSearchEditSku" />
          </template>
        </el-input>
        <el-table
          stripe
          style="width: 100%; margin-top: 20px"
          :data="editSkuInfo.tableData"
          border
        >
          <el-table-column label="SKU编号" align="center">
            <template #default="scope">
              <el-input v-model="scope.row.skuCode" />
            </template>
          </el-table-column>
          <el-table-column
            v-for="(item, index) in editSkuInfo.spData"
            :key="index"
            :label="item.key"
            align="center"
          >
            <template #default="scope">
              {{ item.value }}
            </template>
          </el-table-column>
          <el-table-column label="销售价格" width="80" align="center">
            <template #default="scope">
              <el-input v-model="scope.row.price" />
            </template>
          </el-table-column>
          <el-table-column label="商品库存" width="80" align="center">
            <template #default="scope">
              <el-input v-model="scope.row.stock" />
            </template>
          </el-table-column>
          <el-table-column label="库存预警值" width="100" align="center">
            <template #default="scope">
              <el-input v-model="scope.row.lowStock" />
            </template>
          </el-table-column>
        </el-table>
        <div class="m-container-footer">
          <el-button type="primary" @click="submitSku">确 定</el-button>
          <el-button @click="formDialogVisible = false">取 消</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      v-if="addProductShow"
      v-model="addProductShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="isEdit === true ? '编辑商品' : '添加商品'"
      width="60%"
      top="5vh"
      center
    >
      <div class="c" style="height: 78vh; overflow: auto">
        <addProduct
          :company-id="companyId"
          :button-type="buttonType"
          :prot-type="+protType"
          :is-edit="isEdit"
          :default-product-param="defaultProductParam"
          @getData="getData"
          @handleAddProductCate="handleAddProductCate2"
        />
      </div>
    </el-dialog>

    <el-dialog
      v-model="batchAuditType"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="batchAuditButtonType ? '商品审核详情' : '商品审核'"
      width="50%"
      center
    >
      <el-form
        ref="productSaleForm"
        :disabled="batchAuditButtonType"
        :model="formAudit"
        label-width="120px"
        style="width: calc(100% - 150px)"
        size="small"
      >
        <el-form-item label="审核状态">
          <el-radio-group v-if="batchAuditType" v-model="formAudit.optionValue">
            <el-radio :label="0">未审核</el-radio>
            <el-radio :label="1">通过</el-radio>
            <el-radio :label="2">驳回</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="原因备注">
          <el-input v-model="formAudit.auditRemark" />
        </el-form-item>
      </el-form>
      <div v-if="!batchAuditButtonType" class="m-container-footer">
        <el-button type="primary" @click="batchAuditUpdate">确 定</el-button>
        <el-button @click="blanceAudtio">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-model="editShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="商品排序"
      width="50%"
      center
    >
      <el-form
        :model="formEdit"
        label-width="120px"
        style="width: calc(100% - 150px)"
        size="small"
      >
        <el-form-item label="排序">
          <el-input-number
            v-model="formEdit.operatorSort"
            controls-position="right"
            :min="0"
          />
        </el-form-item>
      </el-form>
      <div class="m-container-footer">
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
        <el-button @click="cancelEdit">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRefs,
  unref,
  watchEffect
} from 'vue'
import { addRole, addUpdate } from '_@/api/role'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetch } from '_@/axios-config/axios'
import { useRouter } from 'vue-router'
import addProduct from '@/components/mall/addProduct/addProduct.vue'
import { async } from '@antv/x6/lib/registry/marker/async'

export default defineComponent({
  components: {
    addProduct
  },
  props: {
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
  setup(props) {
    const total = ref<number>(0)
    const router = useRouter()
    const currentPage = ref<number>(1)
    const formDialogVisible = ref<boolean>(false)
    const addProductShow = ref<boolean>(false)
    const editShow = ref<boolean>(false)
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

    const treeCodeDefaultProps = reactive({
      children: 'children',
      label: 'name',
      value: 'treeCode',
      checkStrictly: true
    })

    const state = reactive<any>({
      companys: [], // 供应商
      loading: false,
      batchAuditType: false,
      batchAuditButtonType: false,
      tableData: [],
      operateType: '',
      mallIds: [],
      spData: [],
      form: {},
      currentPage: 1,
      total: 0,
      pageSize: 10,
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
        },
        {
          label: '批量审核',
          value: '4-0-verifyStatus',
          optionKey: 'verifyStatus'
        },
        {
          label: '批量排序',
          value: '5-operatorSort'
        }
      ],
      listQuery: {
        keyword: '',
        productSn: '',
        brandId: '',
        publishStatus: '',
        verifyStatus: '',
        productCategoryId: '',
        treeCode: '',
        companyId: ''
      },
      formAudit: {
        auditRemark: '',
        ids: [],
        optionKey: '',
        optionValue: 0
      },
      formEdit: {
        ids: [],
        operatorSort: 0
      }
    })

    const getHeight = () => {
      tableHeight.value = document.documentElement.clientHeight - 200
    }

    watchEffect(() => {
      getHeight()
      // 增加监听事件，窗口变化时得到高度。
      window.addEventListener('resize', getHeight, false)
    })

    const dataFilter = (val: string) => {
      const value = val.replace(/\s*/g, '')
      if (value) {
        const listCopy = state.companys
        state.companys = listCopy.filter((item: any) => {
          if (
            !!~item.companyName.indexOf(value) ||
            !!~item.companyName.toUpperCase().indexOf(value.toUpperCase())
          ) {
            return true
          }
        })
      } else {
        // val为空时，还原数组
        getSupplier()
      }
    }

    // 获取所有供应商
    const getSupplier = async () => {
      await fetch({
        url: '/admin/cityoperator/getCompanyInfo',
        method: 'get'
      }).then((res: any) => {
        if (res.code == 0) {
          state.companys = res.data
        }
      })
    }

    // 排序修改
    const handleEdit = (row: any) => {
      state.formEdit.ids = []
      editShow.value = true
      state.formEdit.operatorSort = row.operatorSort
      state.formEdit.ids.push(row.id)
    }

    // 提交确认编辑
    const confirmEdit = () => {
      fetch({
        url: '/mall/product/updateOperatorSorts',
        method: 'post',
        data: state.formEdit
      }).then((res: any) => {
        if (res) {
          ElMessage({
            type: 'success',
            message: `操作成功!`
          })
          editShow.value = false
          state.mallIds = []
          state.formEdit.ids = []
          state.formEdit.operatorSort = 0
        }
        getData()
      })
    }

    // 取消排列编辑
    const cancelEdit = () => {
      editShow.value = false
      state.formEdit.ids = []
      state.formEdit.operatorSort = 0
    }

    const confirms = async () => {
      if (state.addORupdate === 'add') {
        // 新增
        addRole(state.form).then((res) => {
          if (res.data) {
            state.dialogFormVisible = false
            ElMessage.success({
              message: '新增成功',
              type: 'success'
            })
            // getData()
          } else {
            ElMessage.success({
              message: '新增失败，请检查手机号和姓名是否重复',
              type: 'success'
            })
            // getData()
          }
        })
      } else {
        // 修改
        addUpdate(state.form).then((res) => {
          if (res.data) {
            state.dialogFormVisible = false
            ElMessage.success({
              message: '修改成功',
              type: 'success'
            })
            // getData()
          }
        })
      }
    }

    const handleDelete = async (e: any) => {
      ElMessageBox.confirm(`是否确定要删除此条数据?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        fetch({
          url: `/mall/product/delete/${e.id}`,
          method: 'post'
        }).then((res: any) => {
          if (res) {
            ElMessage({
              type: 'success',
              message: `${e.name}删除成功!`
            })
          }
          getData()
        })
      })
    }
    // 查询

    onMounted(() => {
      getData()
      // getBrandTypeList()
      getClassificationGoods()
      getSupplier()
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
        console.log(res.data.containsProduct)

        defaultProductParam.value.containsProduct = res.data.containsProduct
          ? res.data.containsProduct.split(',')
          : ''
        defaultProductParam.value.skillType = res.data.skillType
        // defaultProductParam.value.brandId = res.data.brandId.toString()
      })
    }

    const handleUpdateProduct = (e: any) => {
      state.formAudit.ids = []
      state.batchAuditType = true
      state.batchAuditButtonType = false
      state.formAudit.ids.push(e.id)
      state.formAudit.optionKey = 'verifyStatus'
      state.formAudit.optionValue = e.verifyStatus
      state.formAudit.auditRemark = e.auditRemark
    }

    const handleCurrentChange = (val: number) => {
      state.currentPage = val
      getData()
    }

    const getData = async () => {
      state.loading = true
      await fetch({
        url: '/mall/product/page',
        method: 'get',
        params: {
          size: state.pageSize,
          current: state.currentPage,
          platformType: props.protType,
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
      })
    }

    const defaultProps = reactive({
      children: 'children',
      label: 'name',
      value: 'id',
      checkStrictly: true
    })

    const handleSearchList = () => {
      getData()
    }

    const handleChange = (value: any) => {
      for (const key in value) {
        state.listQuery.productCategoryId = value[key]
      }
    }

    const handleResetSearch = () => {
      state.listQuery.keyword = ''
      state.listQuery.productSn = ''
      state.listQuery.brandId = ''
      state.listQuery.publishStatus = ''
      state.listQuery.verifyStatus = ''
      state.listQuery.productCategoryId = ''
      state.listQuery.treeCode = ''
      state.listQuery.companyId = ''
      getData()
    }

    const handleShowSkuEditDialog = async (e: any) => {
      formDialogVisible.value = !formDialogVisible.value
      skuForm.value = e
      await fetch({
        url: `/mall/sku/${e.id}`,
        method: 'get'
      }).then((res) => {
        res.data.map((item: any) => {
          item.spData = JSON.parse(item.spData)
          state.spData = item.spData
        })
        editSkuInfo.value['tableData'] = res.data
        editSkuInfo.value['spData'] = state.spData
      })
    }

    const submitSku = async () => {
      editSkuInfo.value.tableData.map((item: any) => {
        item.spData = JSON.stringify(item.spData)
      })
      await fetch({
        url: `/mall/sku/update/${skuForm.value.id}`,
        method: 'post',
        data: editSkuInfo.value.tableData
      }).then((res: any) => {
        if (res) {
          ElMessage({
            type: 'success',
            message: `操作成功!`
          })
          formDialogVisible.value = !formDialogVisible.value
        }
      })
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
          item.spData = JSON.parse(item.spData)
          state.spData = item.spData
        })
        editSkuInfo.value['tableData'] = res.data
        editSkuInfo.value['spData'] = state.spData
      })
    }

    const handleShowVerifyDetail = (index: any, row: any) => {
      state.batchAuditType = true
      state.batchAuditButtonType = true
      state.formAudit.auditRemark = row.auditRemark
      state.formAudit.optionValue = parseInt(row.verifyStatus)
      state.formAudit.ids.push(row.id)
      state.formAudit.optionKey = 'verifyStatus'
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

    const handleHomeRecommendStatusChange = (e: any) => {
      mallUpdate([e.id], 'operatorRecommand', e.operatorRecommand)
    }

    const mallUpdate = async (id: any, key: any, value: any) => {
      if (key === 'verifyStatus') {
        console.log(id, key, value)
        state.batchAuditType = true
        state.formAudit.ids = id
        state.formAudit.optionKey = key
        return
      }
      await fetch({
        url: `/mall/product/batchUpdate`,
        method: 'post',
        data: {
          ids: id,
          optionKey: key,
          optionValue: value
        }
      }).then((res: any) => {
        if (res.code == 0) {
          state.batchAuditType = false
          state.mallIds = []
          state.formAudit.optionValue = 0
          state.formAudit.auditRemark = ''
          state.formAudit.ids = []
          state.formAudit.optionKey = ''
          ElMessage.success('操作成功')
          getData()
        } else {
          ElMessage.success(res.msg)
        }
      })
    }

    const blanceAudtio = () => {
      state.batchAuditType = false
      state.batchAuditButtonType = false
      state.formAudit.optionValue = 0
      state.formAudit.auditRemark = ''
      state.formAudit.ids = []
      state.formAudit.optionKey = ''
    }

    const batchAuditUpdate = async () => {
      await fetch({
        url: `/mall/product/batchUpdate`,
        method: 'post',
        data: state.formAudit
      }).then((res: any) => {
        if (res.code == 0) {
          state.mallIds = []
          state.formAudit.ids = []
          state.batchAuditType = false
          state.formAudit.optionValue = 0
          state.formAudit.auditRemark = ''
          state.formAudit.ids = []
          state.formAudit.optionKey = ''

          ElMessage.success('操作成功')
          getData()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }

    const getChangeOperateType = (e: any) => {
      state.batchObject = e.split('-')
    }

    const handleTreeCodeChange = (value: any) => {
      state.listQuery.treeCode = value[value.length - 1]
    }

    const batchOperation = () => {
      if (!state.batchObject) {
        ElMessage({
          type: 'warning',
          message: `请选择批量操作条件!`
        })
        return
      }

      if (state.mallIds.length > 0 && state.batchObject[1] == 'operatorSort') {
        state.formEdit.ids = state.mallIds
        confirmEdit()
      } else if (state.mallIds.length > 0 && state.batchObject.length > 0) {
        mallUpdate(state.mallIds, state.batchObject[2], state.batchObject[1])
      } else {
        ElMessage({
          type: 'warning',
          message: `请选择数据!`
        })
      }
    }

    const handleSelectionChange = (row: any) => {
      state.mallIds = []
      row.map((item: any) => {
        state.mallIds.push(item.id)
      })
    }

    return {
      confirmEdit,
      handleEdit,
      cancelEdit,
      total,
      currentPage,
      formDialogVisible,
      formType,
      tableHeight,
      listQueryForm,
      defaultProps,
      treeCodeDefaultProps,
      skuForm,
      editSkuInfo,
      addProductShow,
      editShow,
      isEdit,
      defaultProductParam,
      handleTreeCodeChange,
      handleSearchEditSku,
      submitSku,
      batchOperation,
      handleSelectionChange,
      mallUpdate,
      getData,
      handleChange,
      handleShowSkuEditDialog,
      handleShowVerifyDetail,
      handleUpdateProduct,
      handleDelete,
      handleSearchList,
      handleResetSearch,
      handleAddProductCate,
      handleAddProductCate2,
      handlePublishStatusChange,
      handleNewStatusChange,
      handleRecommendStatusChange,
      handleHomeRecommendStatusChange,
      getBrandTypeList,
      getClassificationGoods,
      handleCurrentChange,
      getChangeOperateType,
      getDefaultProductParam,
      batchAuditUpdate,
      blanceAudtio,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
//.btn-add {
//  float: right;
//}

.tableList {
  margin-top: 20px;
}

.filter-container {
  margin-bottom: 20px;
}

.operate-container {
  :deep(.el-card__body) {
    display: flex;
    justify-content: space-between;
  }
}

.m-container-footer {
  text-align: right;
  margin-top: 25px;
}
/deep/.el-input-number.is-controls-right .el-input__inner {
  width: 120px;
}
</style>
