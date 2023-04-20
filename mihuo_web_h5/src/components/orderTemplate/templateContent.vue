<template>
  <div>
    <div class="el-card-form">
      <div
        class="el-card-formLeft"
        style="height: calc(100vh - 14rem)"
      >
        <el-button
          icon="plus"
          type="text"
          style="margin: 1rem 0 2rem 1rem"
          class="main-button"
          @click="handleTemlate('add',{})"
        >新增模板
        </el-button>
        <div class="left-data">
          <div
            v-for="(item, index) in state.templateDataList"
            :key="index"
            :class="[
              templateActive === index
                ? 'template-item-active'
                : ''
            ]"
            class="template-item"
            @click="templateNode(item, index)"
          >
            <div class="left-data_item">
              <div class="name">
                <el-tooltip
                    class="box-item"
                    effect="dark"
                    :content="item.templateName"
                    placement="bottom"
                    :enterable="false"
                  >
                  {{ item.templateName }}
                  </el-tooltip>
              </div>
              <div class="operation">
                <el-icon size="12px" :color="templateActive === index?'#FFFFFF':'#409EFF'" @click.stop="handleTemlate('edit',item)">
                  <edit />
                </el-icon>
                <el-icon size="12px" color="#F56C6C" @click.stop="handleTemlate('del',item)">
                  <delete />
                </el-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="el-card-formRight">
        <el-tabs v-model="activeName" class="bill-tabs" @tab-click="handleClick">
          <el-tab-pane label="人工" name="1003">
            <div class="el-card-left">
              <el-button
                size="mini"
                icon="plus"
                type="primary"
                @click="add('人工')"
              >
                新增人工
              </el-button>
            </div>
            <template-table style="height:100%" />
          </el-tab-pane>
          <el-tab-pane label="主材" name="1001">
            <div class="el-card-left">
              <el-button
                size="mini"
                icon="plus"
                type="primary"
                @click="add('主材')"
              >
                新增主材
              </el-button>
            </div>
            <template-table />
          </el-tab-pane>
          <el-tab-pane label="辅材" name="1002">
            <div class="el-card-left">
              <el-button
                size="mini"
                icon="plus"
                type="primary"
                @click="add('辅材')"
              >
                新增辅材
              </el-button>
            </div>
            <template-table />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!-- 类型新增 -->
    <dialog-templateType v-model="state.dialogShow" :data="state.curTypeData" />
    <!-- 添加材料 -->
    <add-materials v-model="state.dialogVisible" />
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetch } from '_@/axios-config/axios'
import wsCache from '@/cache'
const state = reactive({
  templateDataList: [] as any,
  rawData: null,
  dialogShow: false as boolean,
  dialogVisible: false as boolean
})
const cityOperatorId = ref(wsCache.get('cityOperator')?.id)
const tableData = ref([]) as any
const templateId:any = ref()
provide('templateId', templateId)
provide('tableData', tableData)
const formData:any = ref({})
const templateActive = ref(0)
const billNum = ref(0)
const activeName:any = ref('1003')
provide('formData', formData)
provide('billNum', billNum)
provide('activeName', activeName)

onMounted(() => {
  getTemplateData()
})
const handleTemlate = (type:string, row:any) => {
  row.deleteStatus = 1
  switch (type) {
    case 'del':
      ElMessageBox.confirm(`此操作将永久删除${row.templateName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await fetch({
          url: `/order/bizordermaterialtemplate/saveOrUpdateOrderMaterialTemplate`,
          method: 'post',
          data: row
        }).then((res) => {
          if (res.data) {
            ElMessage.success('删除成功')
            getTemplateData()
          }
        })
      })
      break
    default:
      formData.value = Object.assign({}, row)
      state.dialogShow = true
      break
  }
}
const getTemplateData = async() => {
  await fetch({
    url: `/order/bizordermaterialtemplate/getMaterialTemplateByCityOperatorId?cityOperatorId=${cityOperatorId.value}`,
    method: 'get'
  }).then((res) => {
    if (res.data) {
      state.templateDataList = res.data
      if (res.data && res.data.length) {
        templateId.value = state.templateDataList[0].id
        getTableList()
      }
    }
  })
}
provide('getTemplateData', getTemplateData)

const templateNode = (data:any, index:number) => {
  templateActive.value = index
  templateId.value = data.id
  if (data) {
    getTableList()
  }
}

const getTableList = async() => {
  let arrBill = [] as any
  await fetch({
    url: `/order/bizordermaterialtemplateitem/getOrderMaterialTemplateItems`,
    method: 'post',
    data: {
      orderMaterialTemplateId: [templateId.value],
      materialCategoryType: Number(activeName.value)
    }
  }).then((res) => {
    if (res.data) {
      tableData.value = res.data
      tableData.value.map((item:any) => {
        item.name = item.platformCategoryName
        item.materialId = item.platformCategoryId
        if (item.dataList && item.dataList) {
          item.dataList.map((v:any) => {
            v.productSku = JSON.parse(v.productSku)
          })
        }
      })
    }
    // 计算开单种类数量
    res.data.map((item:any) => {
      if (item.dataList && item.dataList.length) {
        arrBill = arrBill.concat(item.dataList)
      }
    })
    billNum.value = arrBill.length
  })
}
provide('getTableList', getTableList)
const handleMaterials = async(type:string, data:any) => {
  const params = {
    deleteStatus: type == 'save' ? 0 : 1,
    id: data.materialId,
    quantity: data.quantity
  }
  await fetch({
    url: `/order/bizordermaterialtemplateitem/updateMaterial`,
    method: 'post',
    data: params
  }).then((res) => {
    if (res.data) {
      ElMessage.success(type == 'save' ? '保存成功' : '删除成功')
      getTableList()
    }
  })
}
provide('handleMaterials', handleMaterials)

const del = (data:any) => {
  ElMessageBox.confirm(`此操作将删除${data.name || '该条无效记录'}, 是否继续?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    handleMaterials('del', data)
  })
}
provide('del', del)

const handleClick = (data:any) => {
  tableData.value = []
  getTableList()
}
const addType:any = ref('')
provide('addType', addType)
const add = (type:any) => {
  addType.value = type
  state.dialogVisible = true
}
</script>

<style scoped lang="less">
// /deep/.cell{
//     display: flex !important;
//     align-items: center !important;
// }
.left-data{
    height: calc(100vh - 25rem) !important;
    box-sizing: border-box;
    width: calc(100% - 2rem);
    .left-data_item{
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        .name{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            flex: 1;
        }
        .operation{
            flex-shrink: 0;
        }
    }
}
.bill-tabs{
    height: calc(100% - 3rem);
    width: 100%;
}
.el-card-left{
    padding: 2rem 0;
}
</style>
