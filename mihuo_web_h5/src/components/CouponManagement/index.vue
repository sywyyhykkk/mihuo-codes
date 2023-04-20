<template>
  <div class="coupon-container">
    <el-card shadow="never" class="card-container flex-center">
      <el-input
        v-model="queryForm.name"
        style="width: 14rem !important"
        placeholder="请输入优惠券名称"
      />
      <span
        v-for="(item, index) of options"
        :key="index"
      >
        <el-select
          v-if="!item.formOnly"
          v-model="queryForm[item['prop']]"
          style="width: 14rem !important"
          :placeholder="`请选择${item.name}`"
          clearable
        >
          <el-option
            v-for="o in item['options']"
            :key="o.value"
            :label="o.label"
            :value="o.value"
          />
        </el-select>
      </span>
      <el-button
        type="primary"
        icon="Search"
        @click="getData()"
      >
        查询
      </el-button>
      <el-button
        icon="refreshLeft"
        @click="handleResetSearch()"
      >
        重置
      </el-button>
      <div class="el-card-right">
        <el-button
          v-if="$getPression('generator_smscoupon_add')"
          type="primary"
          icon="plus"
          @click="addCouponClick"
        >
          新增优惠券
        </el-button>
      </div>
    </el-card>
    <div class="table-container">
      <el-table
        v-loading="isTableLoading"
        stripe
        :data="tableData"
        :height="tableHeight"
        border
      >
        <el-table-column type="index" width="50" label="序号" />
        <el-table-column width="150" label="名称" prop="name" />
        <el-table-column width="100" label="优惠券类型" prop="type">
          <template #default="scope">
            {{ scope.row.type === 0 ? '满减' : '折扣' }}
          </template>
        </el-table-column>
        <el-table-column label="使用类型" prop="useType">
          <template #default="scope">
            {{ scope.row.useType === 0 ? '全场通用' : scope.row.useType === 1 ? '指定分类' : '指定商品' }}
          </template>
        </el-table-column>
        <el-table-column width="120" label="适用人群" prop="memberType">
          <template #default="scope">
            <span v-if="scope.row.issuanceType === 1">
              定向人群
            </span>
            <span v-else>
              {{ scope.row.memberType === 0 ? '所有用户' : scope.row.memberType === 1 ? '已注册' : '有购物记录' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column width="120" label="发放类型" prop="issuanceType">
          <template #default="scope">
            <el-tag v-show="scope.row.issuanceType === 0" type="success">条件发放</el-tag>
            <el-tag v-show="scope.row.issuanceType === 1" type="warning">定向发放</el-tag>
            <el-tag v-show="scope.row.issuanceType === 2" type="danger">自主购买</el-tag>
          </template>
        </el-table-column>
        <!--        <el-table-column width="120" label="发放时间类型" prop="releaseType">-->
        <!--          <template #default="scope">-->
        <!--            {{ scope.row.releaseType === 0 ? '立即发放' : '定时发放' }}-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column width="120" label="使用门槛(元)" prop="minPoint" />
        <el-table-column label="发放数量" prop="publishCount" />
        <el-table-column width="100" label="已领取数量" prop="receiveCount" />
        <el-table-column width="170" label="开放时间" prop="enableTime" />
        <!--        <el-table-column width="150" label="定时发放时间" prop="releaseTime" />-->
        <el-table-column width="170" label="有效期开始时间" prop="startTime" />
        <el-table-column width="170" label="有效期结束时间" prop="endTime" />
        <el-table-column width="200" fixed="right" label="操作">
          <template #default="scope">
            <el-button
              v-if="$getPression('generator_smscoupon_view')"
              type="text"
              icon="view"
              @click="viewCouponClick(scope.row)"
            >查看</el-button>
            <!--            <el-button-->
            <!--              v-if="$getPression('generator_smscoupon_edit')"-->
            <!--              type="text"-->
            <!--              icon="edit"-->
            <!--              @click="editCouponClick(scope.row)"-->
            <!--            >编辑</el-button>-->
            <el-button
              v-if="$getPression('generator_smscoupon_del')"
              type="text"
              class="danger"
              icon="delete"
              @click="deleteCouponClick(scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination-new
        style="position: fixed;"
        :current-page="+currentPage"
        :page-size="20"
        :total="+total"
        layout="total, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-drawer
      v-model="isShowDrawer"
      size="50%"
      destroy-on-close
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="isViewCoupon ? '查看优惠券' : '新增优惠券'"
      @close="hideDrawer"
    >
      <el-form
        ref="couponForms"
        :rules="couponRules"
        :model="couponForm"
        label-width="12rem"
        :disabled="isViewCoupon"
      >
        <span class="form-title">
          基本信息
        </span>
        <el-form-item label="名称" prop="name">
          <el-input v-model="couponForm.name" placeholder="请输入优惠券名称" />
        </el-form-item>
        <template
          v-for="(item, index) of options"
          :key="index"
        >
          <el-form-item
            v-if="item['prop'] === 'memberType' ? couponForm.issuanceType === 0 : true"
            :label="item['name']"
            :prop="item['prop']"
          >
            <el-select
              v-model="couponForm[item['prop']]"
              :placeholder="`请选择${item.name}`"
              clearable
            >
              <el-option
                v-for="o in item['options']"
                :key="o.value"
                :label="o.label"
                :value="o.value"
              />
            </el-select>
          </el-form-item>
        </template>
        <el-form-item v-if="couponForm.issuanceType === 1" label="定向发放" prop="givePhones">
          <el-input
            v-model="couponForm.givePhones"
            placeholder="请添加优惠券定向发放的手机号, 多个手机号使用逗号分隔"
            type="textarea"
            :autosize="{ minRows: 5 }"
          />
        </el-form-item>
        <el-form-item v-if="couponForm.issuanceType === 2" label="关联优惠券商品" prop="productId">
          <el-button @click="relateToCoupon">选择</el-button>
          <div v-if="relatedCoupon.id" style="margin-left: 1rem;">当前优惠券: {{ relatedCoupon.name }}</div>
        </el-form-item>
        <el-form-item v-if="couponForm.useType === 1" label="指定分类" prop="categoryTreeCodes">
          <el-cascader
            v-model="couponForm.categoryTreeCodes"
            placeholder="请选择指定的分类"
            collapse-tags
            :options="productCateOptions"
            :props=" { children: 'children', label: 'name', value: 'treeCode', checkStrictly: true, multiple: false, emitPath: false }"
          />
        </el-form-item>
        <el-form-item v-if="couponForm.useType === 2" label="指定商品" prop="productRelationList">
          <div class="product-container flex-center">
            <div
              v-for="(product, pIndex) in couponForm.productRelationList"
              :key="pIndex"
              class="product-item flex-center"
            >
              <el-image
                preview-teleported
                :src="$getUrl.getPicUrl(product.productCoverPic, true, true)"
                class="item-image"
              />
              <div style="text-align: center; margin-top: 1rem"> {{ product.productName }} </div>
              <el-button
                type="text"
                class="danger"
                icon="delete"
                style="margin-left: 0 !important;"
                @click="deleteProduct(pIndex)"
              >移除商品
              </el-button>
            </div>
          </div>
          <el-button @click="selectProduct">选择商品</el-button>
        </el-form-item>
        <el-form-item v-if="couponForm.type === null || couponForm.type === 0" label="额度" prop="amount">
          <el-input
            v-model="couponForm.amount"
            placeholder="请输入额度"
            type="number"
          >
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="couponForm.type === 1" label="折扣" prop="amount">
          <el-input
            v-model="couponForm.amount"
            placeholder="请输入折扣"
            type="number"
          >
            <template #append>%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="使用门槛" prop="minPoint">
          <el-input v-model="couponForm.minPoint" placeholder="请输入使用门槛" type="number">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="每人限领数量" prop="perLimit">
          <el-input v-model="couponForm.perLimit" placeholder="请输入每人限领数量" type="number" />
        </el-form-item>
        <el-form-item v-if="couponForm.issuanceType !== 1" label="发放数量" prop="publishCount">
          <el-input v-model="couponForm.publishCount" placeholder="请输入发放数量" type="number" />
        </el-form-item>
        <span class="form-title">
          时间配置
        </span>
        <el-form-item label="开放时间" prop="enableTime">
          <el-date-picker
            v-model="couponForm.enableTime"
            popper-class="coupon-date-picker"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="datetime"
            placeholder="请选择开放时间"
            :disabled-date="checkDate"
            :disabled-hours="checkHour"
            :disabled-minutes="checkMinutes"
          />
        </el-form-item>
        <!--        <el-form-item v-if="couponForm.releaseType === 1" label="发放时间" prop="releaseTime">-->
        <!--          <el-date-picker-->
        <!--            v-model="couponForm.releaseTime"-->
        <!--            popper-class="coupon-date-picker"-->
        <!--            value-format="YYYY-MM-DD HH:mm:ss"-->
        <!--            type="datetime"-->
        <!--            placeholder="请选择定时发放时间"-->
        <!--            :disabled-date="checkDateTime"-->
        <!--          />-->
        <!--        </el-form-item>-->
        <el-form-item label="有效期" prop="couponTime">
          <el-date-picker
            v-model="couponTime"
            popper-class="coupon-date-picker"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="datetimerange"
            start-placeholder="请选择开始时间"
            end-placeholder="请选择结束时间"
            :disabled-date="checkDateTimeRange"
          />
        </el-form-item>
        <el-form-item label="活动备注" prop="remark">
          <el-input v-model="couponForm.remark" placeholder="请输入备注" type="textarea" />
        </el-form-item>
        <span class="form-title">
          图片配置
        </span>
        <el-form-item label="首页弹窗图片" prop="mainImg">
          <uploadImage
            v-model="couponForm.mainImg"
            :max-count="1"
            :is-edits="isViewCoupon"
          />
        </el-form-item>
        <el-form-item label="封面图片" prop="coverImg">
          <uploadImage
            v-model="couponForm.coverImg"
            :max-count="1"
            :is-edits="isViewCoupon"
          />
        </el-form-item>
        <span class="form-title">
          使用规则
        </span>
        <el-form-item label="规则描述" prop="description">
          <AppTextEdit
            :key="1"
            v-model="couponForm.description"
            :is-editable="!isViewCoupon"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="padding: 2rem">
          <el-button v-if="!isViewCoupon" type="primary" @click="saveCouponForm">保存</el-button>
          <el-button @click="hideDrawer">取消</el-button>
        </div>
      </template>
    </el-drawer>
    <!-- 选择商品弹窗 -->
    <ChooseProduct
      v-model="isShowProduct"
      :single="isSingleSelect"
      :product-type="currentCustomCategory"
      @getGeneralMaterial="onSelectProduct"
    />
  </div>
</template>

<script lang="ts" setup>
import { fetch } from '_@/axios-config/axios'
import { ElMessageBox, ElMessage } from 'element-plus/es'
import moment from 'moment'
import { getProductDetail } from '_c/CaseManagement/api'

const queryForm = ref({
  name: '', // 优惠券名称
  type: '', // 优惠券类型 0->满减；1->折扣
  useType: null, // 使用类型 0->全场通用；1->指定分类；2->指定商品
  memberType: null, // 适用人群 0->所有用户；1->已注册；2->有购物记录
  issuanceType: null, // 发放类型 0->条件发放；1->定向发放；2->自主购买
  releaseType: null // 发放时间类型 0->立即发放；1->定时发放
})

// 是否单选商品
const isSingleSelect = ref(false)

// 优惠券有效期
const couponTime = ref([] as any)

// 优惠券表单
const couponForm = ref({
  id: null,
  // 发放类型为自主购买时关联的优惠券
  productId: null,
  // 名称
  name: '',
  // 类型 0->满减；1->折扣
  type: null,
  // 使用类型 0->全场通用；1->指定分类；2->指定商品
  useType: null,
  // 适用人群 0->所有用户；1->已注册；2->有购物记录
  memberType: null,
  // 发放类型 0->条件发放；1->定向发放；2->自主购买
  issuanceType: null,
  // 发放时间类型 0->立即发放；1->定时发放
  releaseType: 0,
  // 额度/折扣
  amount: 0,
  // 备注
  remark: '',
  // 开放时间
  enableTime: '',
  // 有效期开始时间
  startTime: '',
  // 有效期结束时间
  endTime: '',
  // 定时发放时间
  releaseTime: '',
  // 使用门槛
  minPoint: null,
  // 每人限领数量
  perLimit: null,
  // 发放数量
  publishCount: null,
  // 指定的平台商品分类(弃用)
  productCategoryRelationList: [] as any,
  // 指定的商品分类
  categoryTreeCodes: '',
  // 指定的商品
  productRelationList: [] as any,
  // 定向人群手机号
  givePhones: '',
  // 首页弹窗图片
  mainImg: '',
  // 封面图
  coverImg: '',
  // 规则描述
  description: '[]'
})

// 筛选条件
const options = ref({
  type: {
    name: '类型',
    formOnly: false,
    prop: 'type',
    options: [
      {
        label: '满减',
        value: 0
      },
      {
        label: '折扣',
        value: 1
      }
    ]
  },
  issuanceType: {
    name: '发放类型',
    formOnly: false,
    prop: 'issuanceType',
    options: [
      {
        label: '条件发放',
        value: 0
      },
      {
        label: '定向发放',
        value: 1
      },
      {
        label: '自主购买',
        value: 2
      }
    ]
  },
  memberType: {
    name: '适用人群',
    formOnly: true,
    prop: 'memberType',
    options: [
      {
        label: '所有用户',
        value: 0
      },
      {
        label: '已注册',
        value: 1
      },
      {
        label: '有购物记录',
        value: 2
      }
    ]
  },
  // releaseType: {
  //   name: '发放时间类型',
  //   formOnly: true,
  //   prop: 'releaseType',
  //   options: [
  //     {
  //       label: '立即发放',
  //       value: 0
  //     },
  //     {
  //       label: '定时发放',
  //       value: 1
  //     }
  //   ]
  // },
  useType: {
    name: '使用类型',
    formOnly: false,
    prop: 'useType',
    options: [
      {
        label: '全场通用',
        value: 0
      },
      {
        label: '指定分类',
        value: 1
      },
      {
        label: '指定商品',
        value: 2
      }
    ]
  }
})
const isTableLoading = ref(false)
const tableData = ref([])
const currentPage = ref(1)
const total = ref(0)

onMounted(() => {
  getData()
  getProductCategory()
})

// 获取优惠券
const getData = async () => {
  isTableLoading.value = true
  await fetch({
    url: 'mall/smscoupon/page',
    method: 'get',
    params: {
      current: currentPage.value,
      size: 20,
      ...queryForm.value
    }
  }).then((res: any) => {
    if (res.data) {
      total.value = res.data.total
      tableData.value = res.data.records
      isTableLoading.value = false
    }
  })
}

const tableHeight = ref(0)

const getHeight = () => {
  tableHeight.value = document.documentElement.clientHeight - 210
}

watchEffect(() => {
  getHeight()
  // 增加监听事件，窗口变化时得到高度。
  window.addEventListener('resize', getHeight, false)
})

// 分页查询下一页
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getData()
}

// 重置搜索
const handleResetSearch = () => {
  queryForm.value = {
    name: '', // 优惠券名称
    type: '', // 优惠券类型 0->满减；1->折扣
    useType: null, // 使用类型 0->全场通用；1->指定分类；2->指定商品
    memberType: null, // 适用人群 0->所有用户；1->已注册；2->有购物记录
    issuanceType: null, // 发放类型 0->条件发放；1->定向发放；2->自主购买
    releaseType: null // 发放时间类型 0->立即发放；1->定时发放
  }
  getData()
}

// 是否显示选择商品弹窗
const isShowProduct = ref(false)
// 关联的优惠券商品
const relatedCoupon = ref({})
const currentCustomCategory = ref('')

// 选择优惠券
const relateToCoupon = () => {
  isSingleSelect.value = true
  isShowProduct.value = true
  currentCustomCategory.value = '3'
}

// 选择商品
const selectProduct = () => {
  isShowProduct.value = true
  isSingleSelect.value = false
  currentCustomCategory.value = ''
}

// 确认选择商品
const onSelectProduct = async (products: any) => {
  if (!products.value || !products.value[0]) {
    ElMessage.warning('商品选择失败，请重新选择')
    return
  }
  if (products.value[0].length || products.value[0].id) {
    if (isSingleSelect.value) {
      // 自主购买类型的优惠券关联优惠券商品
      couponForm.value.productId = products.value[0].id
      relatedCoupon.value = products.value[0]
    } else {
      // 指定商品类型的优惠券关联商品
      let filterData = products.value[0].filter((item: any) => {
        return !couponForm.value.productRelationList.some((product: any) => product.id === item.id)
      })
      filterData = filterData.map((item: any) => {
        return {
          productId: item.id,
          productName: item.name,
          productSn: item.productSn,
          productCoverPic: item.coverImg
        }
      })
      couponForm.value.productRelationList.push(...filterData)
    }
    ElMessage.success('商品选择成功')
  } else {
    ElMessage.warning('商品选择失败，请重新选择')
  }
}

// 删除商品
const deleteProduct = (index: number) => {
  ElMessageBox.confirm('确认从指定商品中移除该商品?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    couponForm.value.productRelationList.splice(index, 1)
  })
}

// 平台分类
const productCateOptions = ref([])

// 获取平台分类
const getProductCategory = async () => {
  await fetch({
    url: `/mall/platformcategory/tree`,
    method: 'get'
  }).then((res: any) => {
    productCateOptions.value = res.data
  })
}

// 检查优惠券有效期开始时间不能早于发放时间
// true = 禁用
const checkDateTimeRange = (date: Date) => {
  const oneDay = 60 * 60 * 24 * 1000
  if (couponForm.value.releaseType === 1) {
    // 定时发放时 有效期开始时间不能早于定时发放时间releaseTime
    if (!couponForm.value.releaseTime) return true
    return date.getTime() + oneDay <= moment(couponForm.value.releaseTime).valueOf()
  } else {
    // 立即发放 有效期开始时间不能早于开放领取时间enableTime
    if (!couponForm.value.enableTime) return true
    return date.getTime() + oneDay <= moment(couponForm.value.enableTime).valueOf()
  }
}

// 检查时间是否是未来任意时刻
// true = 禁用
const checkDate = (date: Date) => {
  // 允许选当天的日期
  const oneDay = 60 * 60 * 24 * 1000
  return date.getTime() + oneDay < new Date().getTime()
}

const checkHour = () => {
  // 如果选择的日期大于当前日期 不用禁用小时
  const date = new Date(couponForm.value.enableTime)
  if (date.getTime() > new Date().getTime()) return []
  const nowHour = new Date().getHours()
  const result = []
  for (let i = nowHour - 1; i >= 0; i--) {
    result.push(i)
  }
  return result
}

const checkMinutes = (hour: number) => {
  const date = new Date(couponForm.value.enableTime)
  const nowMinutes = new Date().getMinutes()
  const nowHour = new Date().getHours()
  // 如果选择的小时大于当前小时或者选择的日期大于当前日期 不用禁用分钟
  if (hour > nowHour || date.getTime() > new Date().getTime()) return []
  const result = []
  // 不允许选择当前分钟
  for (let i = nowMinutes; i >= 0; i--) {
    result.push(i)
  }
  return result
}

// 表单规则
const couponRules = ref({
  name: [{ required: true, message: '优惠券名称不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '优惠券类型不能为空', trigger: 'blur' }],
  useType: [{ required: true, message: '优惠券使用类型不能为空', trigger: 'blur' }],
  memberType: [{ required: true, message: '优惠券适用人群不能为空', trigger: 'blur' }],
  issuanceType: [{ required: true, message: '优惠券发放类型不能为空', trigger: 'blur' }],
  // releaseType: [{ required: true, message: '优惠券发放时间类型不能为空', trigger: 'blur' }],
  amount: [{ required: true, message: '优惠券额度/折扣输入不正确', trigger: 'blur' }],
  description: [{ required: true, message: '优惠券规则描述不能为空', trigger: 'blur' }],
  mainImg: [{ required: true, message: '优惠券首页弹窗图片不能为空', trigger: 'blur' }],
  coverImg: [{ required: true, message: '优惠券封面图片不能为空', trigger: 'blur' }],
  minPoint: [{ required: true, message: '优惠券使用门槛输入不正确', trigger: 'blur' }],
  perLimit: [{ required: true, message: '优惠券每人限领数量不能为空', trigger: 'blur' }],
  publishCount: [{ required: true, message: '优惠券发放数量不能为空', trigger: 'blur' }],
  productCategoryRelationList: [{ required: true, message: '优惠券指定分类不能为空', trigger: 'blur' }],
  productRelationList: [{ required: true, message: '优惠券指定商品不能为空', trigger: 'blur' }],
  givePhones: [{ required: true, message: '优惠券定向发放人群不能为空', trigger: 'blur' }],
  enableTime: [{ required: true, message: '优惠券开放时间不能为空', trigger: 'blur' }],
  // releaseTime: [{ required: true, message: '优惠券定时发放时间不能为空', trigger: 'blur' }],
  couponTime: [{ required: true, message: '优惠券有效期不能为空', trigger: 'blur', validator: (val: any) => {
    if (!couponTime.value) return false
    return couponTime.value.length === 2
  } }]
})

// 是否显示表单抽屉
const isShowDrawer = ref(false)
// 是否查看优惠券
const isViewCoupon = ref(false)

const couponForms = ref(null)

// 保存表单
const saveCouponForm = () => {
  const forms: any = unref(couponForms)
  forms.validate(async (valid: Boolean) => {
    if (valid) {
      // 检查数据合法性
      if (!checkData()) {
        return
      }
      if (couponForm.value.id) {
        // 编辑
        await editData()
      } else {
        // 新增
        couponForm.value['startTime'] = couponTime.value[0]
        couponForm.value['endTime'] = couponTime.value[1]
        if (couponForm.value.issuanceType === 0) {
          // 立即发放的优惠券 发放时间=可以领取的时间
          couponForm.value['releaseTime'] = couponForm.value['enableTime']
        }
        await addData()
      }
    }
  })
}

// 检查数据合法性
const checkData = () => {
  const useType = couponForm.value.useType
  if (useType === 1) {
    // 1. 指定分类 useType = 1 productRelationList = [] givePhones = []
    couponForm.value['productRelationList'] = []
    couponForm.value.productCategoryRelationList = null // 弃用
  } else if (useType === 2) {
    // 2. 指定商品 useType = 2 productCategoryRelationList = [] givePhones = []
    couponForm.value['productCategoryRelationList'] = []
  }
  // const releaseType = couponForm.value.releaseType
  // if (releaseType === 0) {
  //   // 3. 立即发放 releaseType = 0 releaseTime = ''
  //   couponForm.value['releaseTime'] = ''
  // } else if (releaseType === 1) {
  //   // 4. 定时发放 releaseType = 1 enableTime = ''
  //   couponForm.value['enableTime'] = ''
  // }
  const type = couponForm.value.type
  if (type === 1) {
    if (!(couponForm.value.amount! > 0 && couponForm.value.amount! < 99)) {
      ElMessage.warning('优惠券折扣必须是1% - 99%')
      return false
    }
    couponForm.value['amount'] = Number(couponForm.value['amount']) / 100
  }
  if (type === 2) {
    if (couponForm.value.amount! < 0 || couponForm.value.amount! === 0) {
      ElMessage.warning('优惠券金额必须大于0元')
      return false
    }
  }
  if (Number(couponForm.value.amount!) > Number(couponForm.value.minPoint!)) {
    ElMessage.warning('优惠券额度不能大于使用门槛')
    return false
  }
  const issuanceType = couponForm.value.issuanceType
  if (issuanceType !== 2) {
    couponForm.value['productId'] = null
    relatedCoupon.value = {}
  }
  // 自主购买 优惠券关联商品为空时 提示选择商品
  if (issuanceType === 2 && !couponForm.value.productId) {
    ElMessage.warning('请选择优惠券关联商品')
    return false
  }
  if (new Date(couponForm.value.enableTime).valueOf() < new Date().getTime()) {
    ElMessage.warning('优惠券开放时间不能早于当前时间')
    return false
  }
  return true
}

// 编辑
const editData = async () => {
  await fetch({
    url: 'mall/smscoupon/edit',
    method: 'post',
    data: {
      ...couponForm.value
    }
  }).then((res: any) => {
    if (res.data) {
      ElMessage.success('编辑成功!')
      hideDrawer()
      getData()
    }
  })
}

// 新增
const addData = async () => {
  await fetch({
    url: 'mall/smscoupon/add',
    method: 'post',
    data: {
      ...couponForm.value
    }
  }).then((res: any) => {
    if (res.data) {
      ElMessage.success('新增成功!')
      hideDrawer()
      getData()
    }
  })
}

const hideDrawer = () => {
  couponForm.value = {
    id: null,
    // 发放类型为自主购买时关联的优惠券
    productId: null,
    // 名称
    name: '',
    // 类型 0->满减；1->折扣
    type: null,
    // 使用类型 0->全场通用；1->指定分类；2->指定商品
    useType: null,
    // 适用人群 0->所有用户；1->已注册；2->有购物记录
    memberType: null,
    // 发放类型 0->条件发放；1->定向发放；2->自主购买
    issuanceType: null,
    // 发放时间类型 0->立即发放；1->定时发放
    releaseType: 0,
    // 额度/折扣
    amount: 0,
    // 备注
    remark: '',
    // 开放时间
    enableTime: '',
    // 有效期开始时间
    startTime: '',
    // 有效期结束时间
    endTime: '',
    // 定时发放时间
    releaseTime: '',
    // 使用门槛
    minPoint: null,
    // 每人限领数量
    perLimit: null,
    // 发放数量
    publishCount: null,
    // 指定的平台商品分类(弃用)
    productCategoryRelationList: [] as any,
    // 指定的商品分类
    categoryTreeCodes: '',
    // 指定的商品
    productRelationList: [] as any,
    // 定向人群手机号
    givePhones: '',
    // 首页弹窗图片
    mainImg: '',
    // 封面图
    coverImg: '',
    // 规则描述
    description: '[]'
  }
  couponTime.value = []
  relatedCoupon.value = {}
  currentCustomCategory.value = ''
  isShowDrawer.value = false
  isViewCoupon.value = false
}

// 新增优惠券
const addCouponClick = () => {
  isShowDrawer.value = true
  isViewCoupon.value = false
}

// 查看优惠券
const viewCouponClick = async (row: any) => {
  await fetch({
    url: 'mall/smscoupon/queryById/' + row.id,
    method: 'get'
  }).then((res: any) => {
    if (res.data) {
      couponForm.value = JSON.parse(JSON.stringify(res.data))
      couponTime.value = [couponForm.value['startTime'], couponForm.value['endTime']]
      isShowDrawer.value = true
      isViewCoupon.value = true
    }
  })
}

// 立即发放 enableTime之前 可以修改、删除
// 定时发放 releaseTime之前 可以修改、删除

// 自主购买 可以修改、删除

// 立即发放 enableTime之后 只可以删除 未使用的删除 过期的删除
// 定时发放 releaseTime之前 只可以删除 未使用的删除 过期的删除

// 编辑优惠券
const editCouponClick = async (row: any) => {
  await fetch({
    url: 'mall/smscoupon/queryById/' + row.id,
    method: 'get'
  }).then((res: any) => {
    if (res.data) {
      couponForm.value = JSON.parse(JSON.stringify(res.data))
      couponTime.value = [couponForm['startTime'], couponForm['endTime']]
      isShowDrawer.value = true
      isViewCoupon.value = false
    }
  })
}

// 删除优惠券
const deleteCouponClick = (row: any) => {
  ElMessageBox.confirm(`是否确定要删除此条数据?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async (res) => {
    await fetch({
      url: 'mall/smscoupon/delete/' + row.id,
      method: 'post'
    }).then((response: any) => {
      if (response.code === 0) {
        ElMessage.success('删除成功')
        getData()
      }
    })
  }).catch(e => {})
}

</script>

<style lang="less" scoped>
.coupon-container {
  padding: 2rem;

  .card-container {
    flex-wrap: wrap;
    justify-content: space-between;
    gap: .5rem;
  }
}

.table-container {
  width: 100%;
  margin-top: 2rem;
}

.form-title {
  font-size: 1.8rem;
  font-weight: bold;
}

.product-container {
  padding: .1rem;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2rem;

  .product-item{
    width: 12rem;
    flex-direction: column;

    .item-image {
      width: 10rem;
      height: 10rem;
      border-radius: .4rem;
    }
  }
}

.flex-center {
  display: flex;
  align-items: center;
}
</style>

<style lang="less">
.coupon-date-picker {
   .el-picker-panel__footer{

      .el-button--text{
        span{
            display: none !important;
          }
        }
    }
}
</style>
