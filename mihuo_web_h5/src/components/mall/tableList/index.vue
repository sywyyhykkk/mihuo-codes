<template>
  <div>
    <el-card>
      <el-input
        v-model="listQuery.keyword"
        prefix-icon="Search"
        placeholder="关键字、商品名称"
      />
      <el-input
        v-model="listQuery.productSn"
        prefix-icon="Search"
        placeholder="商品货号"
      />
      <el-cascader
        v-model="listQuery.treeCode"
        class="el-input-search"
        :props="defaultProps"
        :options="productCateOptions"
        placeholder="商品分类"
        @change="handleChange"
      />
      <el-select
        v-model="listQuery.brandId"
        class="el-input-search"
        placeholder="品牌"
        clearable
      >
        <el-option
          v-for="item in brandOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="listQuery.publishStatus"
        class="el-input-search"
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
        class="el-input-search"
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

      <el-button type="primary" icon="Search" @click="handleSearchList()">
        查询
      </el-button>
      <el-button icon="refreshLeft" @click="handleResetSearch()">
        重置
      </el-button>
    </el-card>
    <el-card class="el-card--body2">
      <div class="el-card-right">
        <el-select
          v-model="operateType"
          placeholder="批量操作"
          class="el-input-search"
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
          icon="plus"
          @click="handleAddProductCate()"
        >
          添加商品
        </el-button>
      </div>
    </el-card>
    <div>
      <el-table
        ref="productCateTable"
        v-loading="loading"
        stripe
        :data="tableData"
        :height="'0'"
        border
        :style="tableStyleHeight"
        @selection-change="handleSelectionChange"
      >
        <!-- :height="tableHeight" -->
        <el-table-column type="selection" align="center" width="80" />
        <el-table-column label="商品图片" align="center" width="110">
          <template #default="scope">
            <div
              style="
                display: flex;
                width: 100%;
                height: 100%;
                justify-content: center;
                align-items: center;
              "
            >
              <el-image
                preview-teleported
                style="height: 8rem; width: 8rem; margin: 0"
                :src="$imageGlobal + scope.row.coverImg"
                :preview-src-list="$getUrl.getPicUrl(scope.row.coverImg)"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center" width="250">
          <template #default="scope">
            <p>{{ scope.row.name }}</p>
            <p>品牌：{{ scope.row.brandName }}</p>
            <p>关键字：{{ scope.row.keywords }}</p>
          </template>
        </el-table-column>
        <el-table-column label="分类" align="center" width="80">
          <template #default="scope">
            {{ getOrderCustomCategory(scope.row.customCategory) }}
          </template>
        </el-table-column>
        <el-table-column label="供应商" prop="companyName" />
        <el-table-column label="联系人" prop="companyContact" />
        <el-table-column label="联系电话" prop="companyTel" />
        <el-table-column label="价格/货号" align="center" width="200">
          <template #default="scope">
            <p>价格：￥{{ scope.row.price }}</p>
            <p>货号：{{ scope.row.productSn }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="评价信息"
          align="center"
          width="200"
        >
          <template #default="scope">
            <div style="cursor: pointer" @click="evaluate(scope.row)">
              <el-rate v-model="scope.row.newScore" disabled allow-half />
              <p v-if="scope.row.newScore">{{ scope.row.newScore }}分</p>
              <p v-if="scope.row.commentNum">评价数量: {{ scope.row.commentNum }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="标签" align="center" width="200">
          <template #default="scope">
            <p
              style="margin-bottom: -0.5rem"
              @click="handlePublishStatusChange(scope.row)"
            >
              上架：
              <el-switch
                v-model="scope.row.publishStatus"
                :active-value="1"
                :inactive-value="0"
                :active-color="buttonType === 'warning' ? '#fd6d34' : ''"
              />
            </p>
            <p
              style="margin-bottom: -0.5rem"
              @click="handleNewStatusChange(scope.row)"
            >
              新品：
              <el-switch
                v-model="scope.row.newStatus"
                :active-value="1"
                :inactive-value="0"
                :active-color="buttonType === 'warning' ? '#fd6d34' : ''"
              />
            </p>
            <p
              style="margin-bottom: -0.5rem"
              @click="handleRecommendStatusChange(scope.row)"
            >
              推荐：
              <el-switch
                v-model="scope.row.recommandStatus"
                :active-value="1"
                :inactive-value="0"
                :active-color="buttonType === 'warning' ? '#fd6d34' : ''"
              />
            </p>
            <p
              style="margin-bottom: -0.5rem"
              @click="handleHotsaleStatusChange(scope.row)"
            >
              热卖：
              <el-switch
                v-model="scope.row.hotsaleStatus"
                :active-value="1"
                :inactive-value="0"
                :active-color="buttonType === 'warning' ? '#fd6d34' : ''"
              />
            </p>
          </template>
        </el-table-column>
        <el-table-column label="商品标签" width="200" align="center">
          <template #default="scope">
            <div class="tags">
              <el-tag
                v-for="(item,index) in scope.row.tags&&scope.row.tags.split(',')"
                :key="index"
                type="info"
              >
                {{ item }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="排序"
          prop="sort"
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
        <el-table-column label="销量" prop="sale" align="center" />
        <el-table-column label="审核状态" width="100" align="center">
          <template #default="scope">
            <el-button
              v-if="scope.row.verifyStatus == 0"
              icon="warning-filled"
              type="text"
              style="color: #c0c4cc"
              class="el-button-underline"
              @click="handleShowVerifyDetail(scope.$index, scope.row)"
            >未审核
            </el-button>
            <el-button
              v-if="scope.row.verifyStatus == 1"
              icon="circle-check-filled"
              type="text"
              style="color: #67c23a"
              class="el-button-underline"
              @click="handleShowVerifyDetail(scope.$index, scope.row)"
            >
              通过
            </el-button>
            <el-button
              v-if="scope.row.verifyStatus == 2"
              icon="circle-close-filled"
              type="text"
              class="danger el-button-underline"
              @click="handleShowVerifyDetail(scope.$index, scope.row)"
            >
              驳回
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="240"
          align="center"
        >
          <template #default="scope">
            <p>
              <!--              <el-button-->
              <!--                size="mini"-->
              <!--                @click="handleShowProduct(scope.$index, scope.row)"-->
              <!--              >查看-->
              <!--              </el-button>-->
              <el-button
                size="mini"
                type="text"
                icon="documentCopy"
                style="color: #67c23a"
                @click="copyProduct(scope.row)"
              >复制
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="edit"
                @click="handleUpdateProduct(scope.row)"
              >编辑
              </el-button>
              <!--              <el-button-->
              <!--                size="mini"-->
              <!--                @click="handleShowLog(scope.$index, scope.row)"-->
              <!--              >日志-->
              <!--              </el-button>-->
              <el-button
                size="mini"
                type="text"
                class="danger"
                icon="delete"
                @click="handleDelete(scope.row)"
              >删除
              </el-button>
              <el-button
                type="text"
                icon="plus"
                @click="handleAddRelation(scope.row)"
              >
                添加关联
              </el-button>
              <el-button
                type="text"
                icon="picture"
                @click="generateCode(scope.row)"
              >
                生成小程序码
              </el-button>
            </p>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination-new
        style="position: fixed"
        :current-page="currentPage"
        :page-size="pagesize"
        :total="total"
        layout="total, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog
      v-model="formDialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="编辑货品信息"
      width="110rem"
    >
      <div
        class="m-container"
        style="height: 60vh; overflow-y: auto; padding-right: 2rem"
      >
        <span>sku号：</span>
        <span>{{ editSkuInfo.productSn }}</span>
        <el-input
          v-model="editSkuInfo.keyword"
          placeholder="按sku编号搜索"
          style="width: 19rem; margin-left: 20px"
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
              <el-input v-model="scope.row.skuCode" style="width: 18rem" />
            </template>
          </el-table-column>
          <el-table-column
            v-for="(item, index) in editSkuInfo.spData"
            :key="index"
            :label="item.key"
            align="center"
          >
            <template #default="scope">
              {{ getProductSkuSp(scope.row, index) }}
            </template>
          </el-table-column>
          <el-table-column label="销售价格" width="80px" align="center">
            <template #default="scope">
              <el-input
                v-model="scope.row.price"
                type="tel"
                oninput="value=value.replace(/[^0-9.]/g, '')"
                style="width: 6rem"
              />
            </template>
          </el-table-column>
          <el-table-column label="结算价" width="80" align="center">
            <template #default="scope">
              <el-input
                v-model="scope.row.billPrice"
                type="tel"
                oninput="value=value.replace(/[^0-9.]/g, '')"
                style="width: 6rem"
              />
            </template>
          </el-table-column>
          <el-table-column label="商品库存" width="80px" align="center">
            <template #default="scope">
              <el-input v-model="scope.row.stock" style="width: 6rem" />
            </template>
          </el-table-column>
          <el-table-column label="库存预警值" width="100px" align="center">
            <template #default="scope">
              <el-input v-model="scope.row.lowStock" style="width: 8rem" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="submitSku">确 定</el-button>
          <el-button @click="formDialogVisible = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-if="addProductShow"
      v-model="addProductShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="isCopy ? '复制商品' : isEdit === true ? '编辑商品' : '添加商品'"
      width="112rem"
      top="4rem"
    >
      <addProduct
        :is-copy="isCopy"
        :company-id="companyId"
        :button-type="buttonType"
        :prot-type="protType"
        :is-edit="isEdit"
        :default-product-param="defaultProductParam"
        :city-operator-id="cityOperatorId"
        @getData="getData"
        @handleAddProductCate="handleAddProductCate2"
      />
      <template #footer>
        <span class="dialog-footer" />
      </template>
    </el-dialog>

    <el-dialog
      v-model="batchAuditType"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="商品审核详情"
    >
      <el-form
        ref="productSaleForm"
        :model="formAudit"
        disabled
        label-width="120px"
        style="width: calc(100% - 150px)"
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
      <template #footer>
        <span v-if="!batchAuditButtonType">
          <el-button type="primary" @click="batchAuditUpdate">确 定</el-button>
          <el-button @click="blanceAudtio">取 消</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 关联模版 -->
    <el-dialog
      v-model="isShowLinkTemplate"
      destroy-on-close
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="关联模版"
    >
      <el-form>
        <el-form-item v-if="templateType === 1" label="运费模版">
          <el-select v-model="selectedTemplateId">
            <el-option
              v-for="item in freightTemplateList"
              :key="item.templateId"
              :label="item.templateName"
              :value="item.templateId"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="templateType === 2" label="入户/安装费模版">
          <el-select v-model="selectedTemplateId">
            <el-option
              v-for="item in installationTemplateList"
              :key="item.templateId"
              :label="item.templateName"
              :value="item.templateId"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="padding: 2rem">
          <el-button type="primary" @click="saveTemplate">确 定</el-button>
          <el-button @click="cancelTemplate">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 关联商品 -->
    <relationGoodsTable
      v-if="relationShow"
      v-model="relationShow"
      :relation-id="relationId"
      @getData="getData"
      @handleShowSkuEditDialog="handleShowSkuEditDialog"
    />

    <!-- 商品标签设置 -->
    <el-dialog
      v-model="tagsDialog"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="tagsType == 1 ? '添加' : '取消' + '商品标签'"
      width="50rem"
    >
      <el-form
        ref="tagForms"
        :model="tagsForm"
        label-width="13rem"
      >
        <el-form-item
          label="商品标签名称"
          style="margin-right:3rem"
          prop="tags"
          :rules="[{ required: true, message: '请添加标签', trigger: 'blur' }]"
        >
          <el-select
            v-model="tagsForm.tags"
            v-defaultTagDel="[defTags]"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请输入商品标签名称"
            @change="changeTag"
          >
            <el-option
              v-for="item in tagOptions"
              :key="item"
              :label="item"
              :value="item"
              :disabled="defTags.includes(item) && tagsType == 1"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="tagsDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitTags">{{ tagsType == 1 ? '添 加' : '确 认' }}</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 商品评价信息 -->
    <commodityEvaluationInformation
      v-if="evaluateShow"
      v-model="evaluateShow"
      :sku-data="skuData"
      :product-info="productInfo"
      :prot-type="protType"
      @getData="getData"
    />

    <!-- 生成小程序码 -->
    <product-q-r-code
      v-if="qRCodeShow"
      v-model="qRCodeShow"
      :product-info="productInfo"
    />

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
  watchEffect,
  watch,
  getCurrentInstance,
  computed,
  provide
} from 'vue'
import { addRole, addUpdate } from '_@/api/role'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetch } from '_@/axios-config/axios'
import { useRouter } from 'vue-router'
import addProduct from '@/components/mall/addProduct/addProduct.vue'
import importGoods from '_c/mall/tableList/importGoodsTable.vue'
import { Message } from '_c/Message'
import { tagsViewStore } from '_@/store/modules/tagsView'
import { baseEncode } from '@/utils/utils'
import { async } from '@antv/x6/lib/registry/marker/async'
import wsCache from '@/cache'
import { valid } from 'mockjs'
import ProductQRCode from '_c/mall/columnGroup/productQRCode.vue'

export default defineComponent({
  components: { ProductQRCode, addProduct },
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
    },
    cityOperatorId: {
      type: Number || String,
      default: ''
    }
  },
  setup(props) {
    const cityOperatorId = ref(wsCache.get('cityOperator')?.id)
    const total = ref<number>(0)
    const router = useRouter()
    const currentPage = ref<number>(1)
    // const pageSize = ref<number>(5)
    const formDialogVisible = ref<boolean>(false)
    const addProductShow = ref<boolean>(false)
    const isEdit = ref<boolean>(false)
    const isCopy = ref<boolean>(false)
    const formType = ref<string>('')
    const tagForms = ref<any>('')
    const tableHeight = ref<any>(0)
    const listQueryForm = ref()
    const defaultProductParam = ref<any>({})
    const skuForm = ref()
    const proxy = getCurrentInstance()?.appContext.config.globalProperties
    const productPower =
      props.protType == 2 ? proxy?.$getPression('pmsproduct_publishstatus') : ''
    const visitedViews = computed(() => tagsViewStore.visitedViews)

    const editSkuInfo = ref({
      tableData: [],
      spData: [],
      keyword: ''
    })
    const state = reactive<any>({
      // 是否显示生成小程序码弹窗
      qRCodeShow: false,
      skuData: [],
      defTags: [],
      tagsForm: {},
      tagOptions: [],
      tagsType: '',
      tagsDialog: false,
      relationId: '',
      relationShow: false,
      evaluateShow: false,
      selectMallIds: [],
      groupData: [],
      groupCode: '',
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
      operatesProduct: [
        {
          label: '商品上架',
          value: '1-1-publishStatus',
          optionKey: 'publishStatus'
        },
        {
          label: '商品下架',
          value: '1-0-publishStatus',
          optionKey: 'publishStatus'
        }
      ],
      operates: [
        ...(productPower
          ? [
            {
              label: '商品上架',
              value: '1-1-publishStatus',
              optionKey: 'publishStatus'
            },
            {
              label: '商品下架',
              value: '1-0-publishStatus',
              optionKey: 'publishStatus'
            }
          ]
          : []),
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
          label: '设为热卖',
          value: '4-1-hotsaleStatus',
          optionKey: 'hotsaleStatus'
        },
        {
          label: '取消热卖',
          value: '4-0-hotsaleStatus',
          optionKey: 'hotsaleStatus'
        },
        {
          label: '批量关联运费模版',
          value: '5-0-freightTemplateId',
          optionKey: 'freightTemplateId'
        },
        {
          label: '批量关联入户/安装费模版',
          value: '6-0-freightInstallationTemplateId',
          optionKey: 'freightInstallationTemplateId'
        },
        {
          label: '添加商品标签',
          value: '7-1-setUpTags',
          optionKey: 'addTags'
        },
        {
          label: '取消商品标签',
          value: '7-0-setUpTags',
          optionKey: 'cancelTags'
        }
      ],
      isShowLinkTemplate: false, // 是否显示关联模版的弹窗
      templateType: 0, // 关联模版的类型
      freightTemplateList: [] as any,
      installationTemplateList: [] as any,
      selectedTemplateId: '',
      listQuery: {
        keyword: '',
        productSn: '',
        brandId: '',
        publishStatus: '',
        verifyStatus: '',
        treeCode: '' as any
        // cityOperatorId: cityOperatorId.value
      },
      productInfo: {}
    })

    const getOrderCustomCategory = (customCategory: any) => {
      return {
        '1001': '材料',
        '1002': '服务',
        '1003': '套餐',
        '1020': '优惠券',
        '1025': '预付款'
      }[customCategory]
    }

    const tableStyleHeight = computed(() => {
      console.log(props.protType)
      if (props.protType == 2) {
        return {
          height: 'calc(100vh - 39rem) !important'
        }
      } else {
        return {
          height: 'calc(100vh - 30rem) !important'
        }
      }
    })

    // 评价信息
    const evaluate = (row:any) => {
      handleShowSkuEditDialog(row, 'evaluate')
      state.productInfo = row
      state.evaluateShow = true
    }

    const changeTag = (val:any) => {
      state.tagOptions = val
      let list:any = state.defTags
      list = [...state.defTags, ...val.slice(state.defTags.length, val.length)]
      state.tagsForm.tags = state.tagOptions = [...new Set(list)]
    }

    // 批量设置商品标签
    const submitTags = async() => {
      await tagForms.value.validate((valid:any) => {
        if (valid) {
          if (state.tagsType == 1) {
            // 添加
            fetch({
              url: '/mall/product/updateTags',
              method: 'post',
              data: {
                ids: state.mallIds,
                str: state.tagsForm.tags ? state.tagsForm.tags.join() : ''
              }
            }).then((res:any) => {
              if (res.code == 0) {
                ElMessage.success('设置成功')
                state.tagsDialog = false
                getData()
              }
            })
          } else {
            // 取消
            fetch({
              url: '/mall/product/delTags',
              method: 'post',
              data: {
                ids: state.mallIds,
                str: state.tagsForm.tags ? state.tagsForm.tags.join() : ''
              }
            }).then((res:any) => {
              if (res.code == 0) {
                ElMessage.success('设置成功')
                state.tagsDialog = false
                getData()
              }
            })
          }
        }
      })
    }

    // 复制商品
    const copyProduct = (row: any) => {
      // getDefaultProductParam(row.id, 'copy')
      visitedViews.value.forEach((res: any, index: any) => {
        if (res.path == '/mall/addProductNew') {
          visitedViews.value.splice(index, 1)
        }
      })
      jumpTitle = '复制商品'
      push({
        path: '/mall/addProductNew',
        query: {
          ...(baseEncode({
            isEdit: '3',
            id: row.id,
            companyId: props.companyId,
            protType: props.protType
          }) as any)
        }
      })
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

    // 生成商品小程序码
    const generateCode = (row: any) => {
      state.productInfo = row
      state.qRCodeShow = true
    }

    // 关联
    const handleAddRelation = (row: any) => {
      state.relationShow = true
      state.relationId = row.id
    }

    // 查询

    onMounted(() => {
      getData()
      getBrandTypeList()
      getClassificationGoods()
      getGroupData()
      getTemplates()
    })

    const getGroupData = async () => {
      await fetch({
        url: '/mall/productgroup/tree',
        method: 'get'
      }).then((res: any) => {
        state.groupData = res.data
      })
    }
    let jumpTitle: any = '添加商品'
    const { push, addRoute, currentRoute, beforeEach } = useRouter()
    const handleAddProductCate = () => {
      // addProductShow.value = !addProductShow.value
      // isEdit.value = false
      visitedViews.value.forEach((res: any, index: any) => {
        if (res.path == '/mall/addProductNew') {
          visitedViews.value.splice(index, 1)
        }
      })
      jumpTitle = '添加商品'
      push({
        path: '/mall/addProductNew',
        query: {
          ...(baseEncode({
            isEdit: '1',
            id: '0',
            companyId: props.companyId,
            protType: props.protType
          }) as any)
        }
      })
    }
    const handleAddProductCate2 = () => {
      addProductShow.value = !addProductShow.value
      isEdit.value = false
      getData()
    }

    // 编辑商品
    const handleUpdateProduct = (e: any) => {
      // getDefaultProductParam(e.id)
      visitedViews.value.forEach((res: any, index: any) => {
        if (res.path === '/mall/addProductNew') {
          visitedViews.value.splice(index, 1)
        }
      })
      jumpTitle = '编辑商品'
      push({
        path: '/mall/addProductNew',
        query: {
          ...baseEncode({
            isEdit: '2',
            id: e.id,
            companyId: props.companyId,
            protType: props.protType
          })
        }
      })
    }
    // 全局后置钩子
    router.afterEach((to, from) => {
      if (to.path == '/mall/addProductNew') {
        to.meta.title = jumpTitle
      }
    })

    const handleCurrentChange = (val: number) => {
      state.currentPage = val
      getData()
    }

    // 保存关联表单
    const saveTemplate = async () => {
      if (!state.selectedTemplateId) {
        ElMessage.warning('请选择要关联的模版')
        return
      }
      await fetch({
        url: `/mall/product/batchUpdate`,
        method: 'post',
        data: {
          ids: state.mallIds,
          optionKey: state.batchObject[2],
          optionValue: state.selectedTemplateId
        }
      }).then((res: any) => {
        if (res.data) {
          ElMessage.success('设置成功')
          cancelTemplate()
          getData()
        }
      })
    }

    // 取消关联表单
    const cancelTemplate = () => {
      state.mallIds = []
      state.isShowLinkTemplate = false
      state.templateType = 0
      state.batchObject = []
      state.operateType = ''
      state.selectedTemplateId = ''
    }

    const getTemplates = async () => {
      await fetch({
        url: '/mall/pmsFreightTemplate/page',
        method: 'get',
        params: {
          size: 99
        }
      }).then((res: any) => {
        state.freightTemplateList = res.data && res.data.records
      })

      await fetch({
        url: '/mall/pmsFreightInstallationTemplate/page',
        method: 'get',
        params: {
          size: 99
        }
      }).then((res: any) => {
        state.installationTemplateList = res.data && res.data.records
      })
    }

    const getData = async () => {
      state.loading = true
      await fetch({
        url: '/mall/product/page',
        method: 'get',
        params: {
          size: state.pageSize,
          current: state.currentPage,
          ...state.listQuery
        }
      }).then((res: any) => {
        res.data.records?.forEach((item:any) => {
          if (item.score) {
            item['newScore'] = (item.score + '').substring(0, (item.score + '').indexOf('.') + 2)
          }
        })
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
      let url
      if (+props.protType === 2) {
        // 企业端查询商品分类
        url = '/mall/productcategory/tree'
      } else {
        // 运营端和平台端查询平台分类
        url = '/mall/platformcategory/tree'
      }
      await fetch({
        url,
        method: 'get'
      }).then((res: any) => {
        state.productCateOptions = res.data
      })
    }
    const defaultProps = reactive({
      children: 'children',
      label: 'name',
      value: 'treeCode',
      checkStrictly: true
    })

    const handleSearchList = () => {
      // state.listQuery.treeCode = typeof state.listQuery.treeCode !== 'string' ? state.listQuery.treeCode[state.listQuery.treeCode.length - 1] : state.listQuery.treeCode
      getData()
    }
    const handleChange = (value: any) => {
      state.listQuery.treeCode = value[value.length - 1]
    }

    const handleResetSearch = () => {
      state.listQuery.keyword = ''
      state.listQuery.productSn = ''
      state.listQuery.brandId = ''
      state.listQuery.publishStatus = ''
      state.listQuery.verifyStatus = ''
      state.listQuery.treeCode = ''
      state.listQuery.companyId = ''
      getData()
    }

    const handleShowSkuEditDialog = async (e: any, type:string) => {
      if (!type) {
        formDialogVisible.value = !formDialogVisible.value
        skuForm.value = e
      }
      await fetch({
        url: `/mall/sku/${e.id}`,
        method: 'get'
      }).then((res) => {
        res.data.map((item: any) => {
          state.spData = JSON.parse(item.spData)
        })
        editSkuInfo.value['tableData'] = res.data
        editSkuInfo.value['spData'] = state.spData
        state.skuData = res.data
      })
    }

    const submitSku = async () => {
      editSkuInfo.value.tableData.map((item: any) => {
        item.spData = item.spData
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
      // state.formAudit.ids.push(row.id)
      // state.formAudit.optionKey = 'verifyStatus'
      state.batchAuditType = true
      state.batchAuditButtonType = true
    }

    const handleShowProduct = () => {}

    const handleShowLog = () => {}

    const handlePublishStatusChange = (e: any) => {
      // 上下架
      mallStatusUpdate([e.id], 'publishStatus', e.publishStatus)
    }

    const handleNewStatusChange = (e: any) => {
      mallUpdate([e.id], 'newStatus', e.newStatus)
    }

    const handleRecommendStatusChange = (e: any) => {
      mallUpdate([e.id], 'recommendStatus', e.recommandStatus)
    }
    const handleHotsaleStatusChange = (e: any) => {
      mallUpdate([e.id], 'hotsaleStatus', e.hotsaleStatus)
    }

    const mallStatusUpdate = async (id: any, key: any, value: any) => {
      await fetch({
        url: `/mall/product/updatePublishStatus`,
        method: 'post',
        data: {
          ids: id,
          optionKey: key,
          optionValue: value
        }
      })
        .then((res: any) => {
          if (res.data) {
            ElMessage.success('设置成功')
            state.mallIds = []
            getData()
          }
        })
        .catch((data: any) => {
          state.mallIds = []
          getData()
        })
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
        if (res.data) {
          ElMessage.success('设置成功')
          state.mallIds = []
          getData()
        }
      })
    }

    const getChangeOperateType = (e: any) => {
      state.batchObject = e.split('-')
      ElMessageBox.confirm(`是否确定该批量操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchOperation()
      })
    }

    const batchOperation = () => {
      if (!state.batchObject) {
        ElMessage({
          type: 'warning',
          message: `请选择批量操作条件!`
        })
        return
      }

      if (state.mallIds.length > 0 && state.batchObject.length > 0) {
        if (state.batchObject[2] === 'publishStatus') {
          mallStatusUpdate(state.mallIds, 'publishStatus', state.batchObject[1])
        } else if (state.batchObject[2] === 'freightTemplateId') {
          // 批量关联运费模版
          state.isShowLinkTemplate = true
          state.templateType = 1
        } else if (state.batchObject[2] === 'freightInstallationTemplateId') {
          // 批量关联入户/安装费模版
          state.isShowLinkTemplate = true
          state.templateType = 2
        } else if (state.batchObject[2] === 'setUpTags') {
          // 设置商品标签
          let tagStr = ''
          state.tableData.forEach((item:any) => {
            state.mallIds.forEach((item2:any) => {
              if (item.id == item2 && item.tags != '') {
                tagStr += ',' + item.tags
              }
            })
          })
          let list = [] as any
          list = tagStr ? tagStr.slice(1).split(',') : tagStr.split('')// 处理一下为空的时候
          state.tagOptions = [...new Set(list)]
          if (state.batchObject[1] == 1) {
            state.tagsType = 1// 添加
            state.tagsForm.tags = state.defTags = state.tagOptions
          } else if (state.batchObject[1] == 0) {
            state.tagsType = 0// 取消
            state.tagsForm.tags = []
          }
          state.tagsDialog = true
        } else {
          mallUpdate(state.mallIds, state.batchObject[2], state.batchObject[1])
        }
      } else {
        state.batchObject = []
        state.operateType = ''
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
    const getProductSkuSp = (row: any, index: number) => {
      const spData = JSON.parse(row.spData)
      if (spData != null && index < spData.length) {
        return spData[index].value
      } else {
        return null
      }
    }

    const getHeight = () => {
      tableHeight.value = document.documentElement.clientHeight - 240
    }

    watchEffect(() => {
      getHeight()
      // 增加监听事件，窗口变化时得到高度。
      window.addEventListener('resize', getHeight, false)
    })

    watch(() => state.tagsDialog, (newv) => {
      if (!newv) {
        state.operateType = ''
      }
    }, { deep: true, immediate: true })

    return {
      tableHeight,
      evaluate,
      changeTag,
      tagForms,
      submitTags,
      handleAddRelation,
      total,
      currentPage,
      // pageSize,
      formDialogVisible,
      formType,
      listQueryForm,
      defaultProps,
      skuForm,
      editSkuInfo,
      addProductShow,
      isEdit,
      isCopy,
      defaultProductParam,
      generateCode,
      copyProduct,
      getGroupData,
      getProductSkuSp,
      handleSearchEditSku,
      submitSku,
      batchOperation,
      handleSelectionChange,
      mallUpdate,
      getData,
      handleChange,
      handleShowSkuEditDialog,
      handleShowVerifyDetail,
      handleShowProduct,
      handleUpdateProduct,
      handleDelete,
      handleSearchList,
      handleResetSearch,
      handleShowLog,
      handleAddProductCate,
      handleAddProductCate2,
      handlePublishStatusChange,
      handleNewStatusChange,
      handleRecommendStatusChange,
      handleHotsaleStatusChange,
      getBrandTypeList,
      getClassificationGoods,
      handleCurrentChange,
      getChangeOperateType,
      cancelTemplate,
      saveTemplate,
      tableStyleHeight,
      getOrderCustomCategory,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
.tags{
  display: flex;
  justify-content: left;
  align-items: center;
  flex-wrap: wrap;
  .el-tag{
    margin:2px;
  }
}
</style>
