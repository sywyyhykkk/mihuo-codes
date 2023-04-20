<template>
  <div class="container">
    <el-card shadow="never">
      <el-form ref="formRef" class="container-search" :model="formSearch">
        <el-form-item label="活动时间：" prop="date">
          <el-date-picker
            v-model="formSearch.date"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            @change="(e)=>{
              formSearch.startDate= e?e[0]:'';
              formSearch.endDate=e?e[1]:''
            }"
          />
        </el-form-item>
        <el-form-item label="活动名称：" prop="title">
          <el-input
            v-model="formSearch.title"
            placeholder="活动名称"
            clearable
            prefix-icon="search"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" @click="getListData">查询</el-button>
          <el-button icon="refresh" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="el-card-right">
        <el-button
          v-if="$getPression('mall_smsflashpromotion_add')"
          type="primary"
          icon="plus"
          @click="()=>dialogVisible=true"
        >新增</el-button>
      </div>
    </el-card>
    <div class="container-main">
      <div class="container-main_main">
        <el-table
          ref="multipleTable"
          v-loading="loading"
          stripe
          :data="tableData"
          border
          :height="'calc(100vh - 25rem)'"
          style="width:100%"
        >
          <el-table-column
            type="index"
            label="序号"
            width="50"
            align="center"
          />
          <el-table-column label="编号" align="center" prop="id" />
          <el-table-column label="活动名称" align="center" prop="title">
            <template v-if="$getPression('mall_smsflashpromotion_view')" #default="scope">
              <el-link type="primary" @click="groupLink(scope.row)">{{ scope.row.title }}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="活动时间" align="center" width="300">
            <template #default="scope">
              {{ scope.row.startDate }}至{{ scope.row.endDate }}
            </template>
          </el-table-column>
          <el-table-column label="商品数量" align="center" prop="productCount" />
          <el-table-column label="活动备注" align="center" prop="remark" />
          <el-table-column
            label="操作"
            fixed="right"
            width="150"
            align="center"
          >
            <template #default="scope">
              <el-button
                v-if="$getPression('mall_smsflashpromotion_edit')"
                size="small"
                type="text"
                icon="edit"
                @click="edit(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                v-if="$getPression('mall_smsflashpromotion_del')"
                size="small"
                type="text"
                class="danger"
                icon="delete"
                @click="del(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="container-footer">
      <el-pagination-new
        :current-page="page.currentPage"
        :page-size="page.size"
        :total="page.total"
        layout="total, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="handleClose"
      title="拼团管理"
      append-to-body
      width="140rem"
    >
      <el-form
        ref="ruleForm"
        label-width="10rem"
        style="width: 100%"
        :rules="rules"
        :model="fromData"
      >
        <label class="label_title">基础信息</label>
        <el-form-item label="活动名称" prop="title">
          <el-input v-model="fromData.title" placeholder="请输入活动名称" clearable />
        </el-form-item>
        <label class="label_title">商品配置信息</label>
        <el-form-item>
          <el-button
            style="margin-bottom:1rem"
            type="primary"
            icon="plus"
            size="mini"
            @click="()=>productVisible=true"
          >添加商品</el-button>
          <el-table
            ref="product"
            stripe
            :data="fromData.promotionProductRelationList"
            border
            size="mini"
            class="product"
            style="width:calc(100% - 2rem);height:auto !important"
          >
            <el-table-column width="50" label="#" type="index" align="center" />
            <el-table-column label="商品SKU" prop="skuId" align="center" />
            <el-table-column label="商品名称" prop="productName" align="center" />
            <el-table-column label="商品规格" prop="spData" align="center">
              <template #default="scope">
                <div v-if="scope.row?.spData && scope.row.spData !='[]'">
                  <div v-for="(item,index) in JSON.parse(scope.row.spData)" :key="index">
                    <span>{{ item.value }}</span>
                    <span v-if="index +1 <JSON.parse(scope.row.spData).length">-</span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="商品价格" prop="price" align="center">
              <template #default="scope">
                {{ scope.row.pmsSkuStock?.price }}
              </template>
            </el-table-column>
            <el-table-column label="成本价" prop="innerPrice" align="center">
              <template #default="scope">
                {{ scope.row.pmsSkuStock?.innerPrice }}
              </template>
            </el-table-column>
            <el-table-column label="当前库存(件)" prop="stock" align="center">
              <template #default="scope">
                {{ scope.row.pmsSkuStock?.stock }}
              </template>
            </el-table-column>
            <el-table-column label="团购库存(件)" align="center">
              <template #default="scope">
                <el-input
                  v-model="scope.row.flashPromotionStock"
                  type="number"
                  :min="0"
                  oninput="if(value<0)value=0"
                  placeholder="团购库存(件)"
                />
              </template>
            </el-table-column>
            <el-table-column label="成团人数" align="center">
              <template #default="scope">
                <el-input
                  v-model="scope.row.groupCount"
                  type="number"
                  :min="0"
                  oninput="if(value<0)value=0"
                  placeholder="成团人数"
                />
              </template>
            </el-table-column>
            <el-table-column label="团购价格" align="center">
              <template #default="scope">
                <el-input
                  v-model="scope.row.flashPromotionPrice"
                  type="number"
                  :min="0"
                  oninput="if(value<0)value=0"
                  placeholder="团购价格"
                />
              </template>
            </el-table-column>
            <el-table-column label="已拼数量" align="center">
              <template #default="scope">
                <el-input
                  v-model="scope.row.flashPromotionCount"
                  type="number"
                  :min="0"
                  oninput="if(value<0)value=0"
                  placeholder="已拼数量"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="70"
              fixed="right"
              align="center"
            >
              <template #default="scope">
                <el-button
                  size="small"
                  type="text"
                  class="danger"
                  icon="delete"
                  @click="delProduct(scope.row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <label class="label_title">其他信息</label>
        <el-form-item label="活动时间" prop="date">
          <el-date-picker
            v-model="fromData.date"
            style="width: 38rem;"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            end-placeholder="结束时间"
            @change="(e)=>{
              fromData.startDate= e?e[0]:'';
              fromData.endDate=e?e[1]:''
            }"
          />
        </el-form-item>
        <el-form-item label="活动备注" prop="remark">
          <el-input
            v-model="fromData.remark"
            :autosize="{ minRows: 4}"
            type="textarea"
            clearable
            placeholder="请输入活动备注"
          />
        </el-form-item>
      </el-form>
      <!-- 添加材料 -->
      <add-materials v-model="productVisible" :is-show="false" @addProductList="addProductList" />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang='ts' setup>
import { fetch } from '_@/axios-config/axios'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
const { push, afterEach } = useRouter()
const loading = ref<boolean>(false)
const dialogVisible = ref<boolean>(false)
const productVisible = ref<boolean>(false)
const formRef = ref<any>(null)
const ruleForm = ref<any>(null)
const tableData = ref([])
const curProudct = ref<any>({})
const formSearch = reactive({
  type: 0
}as any)
const fromData = ref({
  promotionProductRelationList: [],
  isFlag: 1, // 1:代表新增
  type: 0 // 类型(0团购，1秒杀)
}as any)
const rules = reactive({
  title: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  date: [{ required: true, message: '请选择活动日期', trigger: 'blur' }],
  promotionProductRelationList: [{ required: true, message: '请填写商品信息', trigger: 'blur' }]
})
const page = reactive({
  size: 20,
  currentPage: 1,
  total: 0
} as any)

onMounted(() => {
  getListData()
})

const getListData = async() => {
  loading.value = true
  await fetch({
    url: `/mall/smsflashpromotion/page`,
    method: 'get',
    params: formSearch
  }).then((res: any) => {
    if (res.code == 0) {
      tableData.value = res.data.records
      page.total = res.data.total
    }
  }).finally(() => {
    loading.value = false
  })
}
const edit = async(row:any) => {
  curProudct.value = row
  getEditData('edit')
}
// 获取修改数据
const getEditData = async(type:string) => {
  await fetch({
    url: `/mall/smsflashpromotion/query/${curProudct.value.id}`,
    method: 'get'
  }).then((res: any) => {
    if (res.code == 0) {
      fromData.value = res.data
      fromData.value.date = [res.data?.startDate, res.data?.endDate]
      fromData.value.promotionProductRelationList = fromData.value.promotionProductRelationList &&
            fromData.value.promotionProductRelationList.length ? fromData.value.promotionProductRelationList : []
      if (type == 'edit') dialogVisible.value = true
    }
  })
}
const del = (row:any) => {
  ElMessageBox.confirm(`是否确定要删除该次拼团活动?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async(res) => {
    await fetch({
      url: `/mall/smsflashpromotion/del/${row.id}`,
      method: 'post'
    }).then((res: any) => {
      if (res.code == 0) {
        ElMessage.success('删除成功')
        getListData()
      }
    })
  })
}
const reset =()=> {
  formRef.value.resetFields()
  formSearch.startDate= '';
  formSearch.endDate=''
  getListData()
}

const groupLink = (row:any) => {
  push({ path: `/marketing/groupBookDetail/${row.id}` })
  afterEach((to, from) => {
    to.meta.title = '拼团详情'
  })
}
const save = () => {
  let url = ''
  if (fromData.value.isFlag == 1) {
    url = `/mall/smsflashpromotion/add`
  } else {
    url = `/mall/smsflashpromotion/edit`
  }
  ruleForm.value.validate((valid: any) => {
    if (valid) {
      if (fromData.value.promotionProductRelationList.length === 0) {
        ElMessage.warning('请配置商品信息')
        return
      }
      fetch({
        url: url,
        method: 'post',
        data: fromData.value
      }).then((res: any) => {
        if (res.code == 0) {
          ElMessage.success('保存成功')
          dialogVisible.value = false
          getListData()
        }
      })
    }
  })
}
const handleClose = () => {
  ruleForm.value.resetFields()
  dialogVisible.value = false
  fromData.value = {
    promotionProductRelationList: [],
    isFlag: 1,
    type: 0
  }
}
const handleCurrentChange = (val: number) => {
  page.currentPage = val
  getListData()
}
const addProductList = (data:any) => {
  const products = [] as any
  data.some((item:any) => {
    const obj = {
      pmsSkuStock: {} as any
    } as any
    obj.skuId = item.skuId
    obj.productId = item.productId
    obj.productName = item.name
    obj.spData = JSON.stringify(item.spData)
    obj.pmsSkuStock.price = item.price
    obj.pmsSkuStock.innerPrice = item.innerPrice
    obj.pmsSkuStock.stock = item.stock
    products.push(obj)
  })
  fromData.value.promotionProductRelationList = fromData.value.promotionProductRelationList.concat(products)
}
const delProduct = async(data:any) => {
  if (data.id) {
    await fetch({
      url: `/mall/smsflashpromotion/delProductRelation/${data.id}`,
      method: 'post'
    }).then((res: any) => {
      if (res.code == 0) {
        getEditData('refresh')
      }
    })
  } else {
    fromData.value.promotionProductRelationList.some((item:any, i:number) => {
      if (item.skuId == data.skuId) {
        fromData.value.promotionProductRelationList.splice(i, 1)
        return
      }
    })
  }
}
</script>

<style scoped lang="less">
.container{
    padding:0 0 2rem;
    .container-search{
        display: flex;
        align-items: center;
    }
    .container-main{
        .container-main_top{
            display: flex;
            justify-content: flex-end;
            padding-bottom: 2rem;
        }
    }
}
:deep(.el-card__body){
    padding: 0;
}
:deep(.el-input-number .el-input){
    width: auto !important;
}
.label_title{
    font-size: 1.8rem;
    font-weight: bold;
    display: block;
    margin-top: 2rem;
}
// .dialog-footer{
//     display: flex;
//     justify-content: center;
// }
.product{
    :deep(.el-input){
        width: 100% !important;
    }
}
:deep(.el-table){
  max-height: none !important;
}
</style>
