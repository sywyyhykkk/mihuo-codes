<template>
    <el-dialog
        v-model="dialogVisible"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        title="添加材料"
        width="70%"
        custom-class="dialog-common"
        @close="handelClose"
    >
        <div class="main-table">
            <div class="main-table_left">
                <el-tree
                    :data="dataTree"
                    :props="{
                        children: 'children',
                        label: 'name',
                    }"
                    node-key="id"
                    highlight-current
                    ref="masterType"
                    :expand-on-click-node="false"
                    @node-click="nodeClick">
                </el-tree>
            </div>
            <div class="main-table_right">
                <div class="table-right_header">
                     <el-input
                        v-model="formSearch.keyword"
                        placeholder="请输入关键词搜索"
                        clearable
                        >
                        <template #append>
                            <el-button :icon="Search" @click="getDataList"/>
                        </template>
                    </el-input>
                    <div class="right" v-if="isShow">
                        <span>已开材料{{ billNum }}项</span>
                        <span>已选材料{{ arrMaterialsList.length}}项</span>
                    </div>
                </div>
                <div class="table-right_main">
                    <div class="right-main">
                        <el-table
                            ref="materialTable"
                            :data="tableData"
                            border
                            :height="'0'"
                            row-key="skuId"
                            style="height: calc(100vh - 43rem) !important;width:100% !important"
                            :header-cell-style="{textAlign:'center'}"
                            class="right-main_table"
                            @selection-change="handleSelectionChange"
                        >
                            <el-table-column 
                                reserve-selection 
                                align="center" 
                                type="selection"
                                width="50" 
                            />
                            <el-table-column
                                label="图片"
                                class="flex-box"
                            >
                                <template #default="scope" >
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
                                            style="height: 8rem; width: 8rem; margin: 0"
                                            preview-teleported
                                            lazy
                                            v-if="scope.row.coverImg"
                                            :src="$getUrl.getPicUrl(scope.row.coverImg, true)[0]"
                                            :preview-src-list="$getUrl.getPicUrl(scope.row.coverImg)"
                                        />
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="skuId"
                                label="材料编码"
                                width="150"
                                align="center"
                            />
                            <el-table-column
                                prop="name"
                                label="材料名称"
                                width="200"
                                align="center"
                            />
                            <el-table-column
                                prop="brandName"
                                label="品牌"
                                align="center"
                            />
                            <el-table-column
                                prop="spData"
                                label="规格型号"
                                align="center"
                            >
                            <template #default="scope" >
                                <div v-if="scope.row.spData">
                                    <div>{{ scope.row.spData[0].value}}</div>
                                </div>
                            </template>
                            </el-table-column>
                            <el-table-column
                                prop="unit"
                                label="标准单位"
                                align="center"
                            >
                            </el-table-column>
                            <el-table-column
                                width="100"
                                prop="price"
                                label="单价"
                                align="right"
                            />
                            <el-table-column
                                width="200"
                                prop="supplierName"
                                label="供应商"
                            />
                            <el-table-column
                                label="操作"
                                width="100"
                                fixed="right"
                                align="center"
                            >
                                <template #default="scope">
                                    <el-button type="primary" plain size="mini" @click="addDireMaster(scope.row)">直接添加</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="pagination-container">
                        <el-pagination-new
                        style="position: relative"
                        :current-page="pageObj.currentPage"
                        :page-size="pageObj.pagesize"
                        :total="pageObj.total"
                        layout="total, prev, pager, next, jumper"
                        @current-change="handleCurrentChange"
                        />
                    </div>
                </div> 
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="saveMaterial">确 定</el-button>
                <el-button @click="handelClose">取 消</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { fetch } from '_@/axios-config/axios'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: {}
  },
  isShow: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['update:modelValue', 'getData','addProductList'])
const dialogVisible = ref<any>(false)
const templateFormRef = ref<any>('')
const formData: any = inject('formData')
const templateId: any = inject('templateId')
const getTableList: any = inject('getTableList')
const addType:any = inject('addType') 
const billNum: any = inject('billNum') //已开单数量
const activeName:any = inject('activeName') //材料类型
const materialTable: any = ref(null)
const masterType:any = ref(null)
const rules = reactive({
  name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }]
})
const tableData: any = ref([])
const dataTree: any = ref([])
const pageObj = reactive({
  currentPage: 1,
  total: 0,
  pagesize: 10
} as any)
const formSearch: any = ref({})
const arrMaterialsList: any = ref([])

const handelClose = () => {
  arrMaterialsList.value = []
  materialTable.value.clearSelection()
  emit('update:modelValue', false)
}
const getMaterialsType = async () => {
  await fetch({
    url: `mall/platformcategory/tree`,
    method: 'get'
  }).then((res) => {
    if (res.data) {
      dataTree.value = res.data;
      if(addType && addType.value){
        res.data.some((item:any)=>{
          if(item.name.indexOf(addType.value) != -1){
            formSearch.value.platformTreeCode = item.treeCode;
            nextTick(()=>{
                masterType.value.setCurrentKey(item.id);
            })
            return true
          }
        })
      }else{
        formSearch.value.platformTreeCode = dataTree.value[0].treeCode;
        nextTick(()=>{
            masterType.value.setCurrentKey(dataTree.value[0].id);
        })
      }
      getDataList();
    }
  })
}
const getDataList = async () => {
  await fetch({
    url: `/mall/product/customer/skuProductPage`,
    method: 'get',
    params: {
      size: pageObj.pagesize,
      current: pageObj.currentPage,
      ...formSearch.value
    }
  }).then((res) => {
    res.data.records.map((item: any) => {
      item.spData = JSON.parse(item.spData)
    })
    tableData.value = res.data.records
    pageObj.total = res.data.total
  })
}
const addDireMaster = (row: any) => {
  arrMaterialsList.value = [row]
  saveMaterial()
}
const saveMaterial = async() => {
    if(!arrMaterialsList.value || arrMaterialsList.value.length === 0){
        ElMessage.warning("请选择需要添加的商品")
        return
    }
    if(props.isShow){
      let skuIds = arrMaterialsList.value.map((item:any)=> item.skuId)
      await fetch({
          url: `/order/bizordermaterialtemplateitem/addMaterial`,
          method: 'post',
          data:{
              orderMaterialTemplateId:templateId.value,
              materialCategoryType:activeName.value,
              skuIds:skuIds
          }
      }).then((res) => {
          if(res.data){
              ElMessage.success("保存成功");
              handelClose();
              getTableList();
          }
      })
    }else{
      emit('addProductList',arrMaterialsList.value)
      handelClose();
    }
}
const handleCurrentChange = (val: number) => {
  pageObj.currentPage = val
  getDataList()
}
const nodeClick = (node: any) => {
  formSearch.value.platformTreeCode = node.treeCode
  getDataList()
}
const handleSelectionChange = (data: any) => {
  arrMaterialsList.value = data
}
watchEffect(() => {
  dialogVisible.value = props.modelValue
})
watch(()=>dialogVisible.value,(news)=>{
    if(news){
        formSearch.value = {}
        getMaterialsType();
    }
  }
)
</script>
<style scoped lang="less">
.dialog-common{
  margin-left: 24rem !important;
}
.main-table {
  padding: 2rem 2rem 2rem 0;
  display: flex;
  height: calc(100vh - 30rem);
  box-sizing: border-box;
  .main-table_left {
    height: 100%;
    overflow-y: auto;
    width: 200px;
    flex-shrink: 0;
  }
  .main-table_right {
    flex: 1;
    .table-right_header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 1rem;
      .right {
        span {
          margin-left: 20px;
          color: #67c23a;
          &:last-child {
            color: #409eff;
          }
        }
      }
    }
    .table-right_main {
      width: 100%;
      height: calc(100% - 5rem);
      .right-main {
        width: 100%;
        height: calc(100% - 4rem);
        position: relative;
        .right-main_table {
          position: absolute;
        }
      }
    }
  }
}

</style>