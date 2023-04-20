<template>
  <div>
    <el-dialog
      v-model="relationShow"
      destroy-on-close
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="关联商品"
      width="110rem"
      @close="handelClose"
    >
      <div style="height: 70vh; padding: 2rem 2rem 2rem 0">
        <el-table
          ref="defRelationTable"
          v-loading="state.loading"
          stripe
          style="height: calc(100vh - 37rem) !important"
          :data="state.tableData"
          :height="'0'"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            align="center"
            :selectable="selected"
          />
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
                  lazy
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
              {{
                scope.row.customCategory == '1001'
                  ? '材料'
                  : scope.row.customCategory == '1002'
                    ? '服务'
                    : scope.row.customCategory == '1003'
                      ? '服务包'
                      : ''
              }}
            </template>
          </el-table-column>
          <el-table-column label="价格/货号" align="center" width="200">
            <template #default="scope">
              <p>价格：￥{{ scope.row.price }}</p>
              <p>货号：{{ scope.row.productSn }}</p>
            </template>
          </el-table-column>
          <el-table-column label="标签" align="center" width="200">
            <template #default="scope">
              <p
                v-if="$getPression('pmsproduct_publishstatus')"
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
        </el-table>
        <el-pagination-new
          small
          style="position: absolute !important; bottom: 9rem"
          :hide-on-single-page="false"
          :current-page="state.currentPage"
          :page-size="state.pagesize"
          :total="state.total"
          layout="total, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
        />
      </div>

      <template #footer>
        <div style="padding: 2rem">
          <el-button type="primary" @click="saveRelation">确 定</el-button>
          <el-button @click="handelClose">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  defineEmits,
  defineProps,
  watchEffect,
  reactive,
  onMounted,
  ref
} from 'vue'
import { ElMessage } from 'element-plus'
import { fetch } from '_@/axios-config/axios'
import { async } from '@antv/x6/lib/registry/marker/main'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  relationId: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['getData', 'update:modelValue', 'handleShowSkuEditDialog'])
const { proxy } = getCurrentInstance() as any
const relationShow = ref<boolean>(false)

const state = reactive<any>({
  relationedData: [],
  relatedProducts: [],
  loading: false,
  currentPage: 1,
  total: 0,
  pagesize: 10
})

const handleShowSkuEditDialog = (row:any) => {
  emit('handleShowSkuEditDialog', row)
}

// 查询关联过的商品
const getRelationed = async () => {
  await fetch({
    url: `/mall/product/getRelatedProductIds/${props.relationId}`,
    method: 'get'
  }).then((res: any) => {
    if (res.code == 0 && res.data) {
      state.relationedData = res.data
      nextTick(() => {
        const list = [] as any
        state.tableData.forEach((res: any) => {
          state.relationedData && state.relationedData.forEach((res2: any) => {
            if (res.id == res2) {
              list.push(res)
            }
          })
        })
        list.forEach((item:any) => {
          proxy.$refs.defRelationTable.toggleRowSelection(item)
        })
      })
    }
  })
}

// 判断要关联的商品是否为当前商品
const selected = (row: any, index:number) => {
  // for(let i = 0; i < state.relationedData.length; i ++){
  //   if(row.id == state.relationedData[i]){
  //     return false //不可勾选
  //   }
  // }
  if (row.id == props.relationId) {
    return false // 不可勾选
  }
  return true
}

// 关联保存
const saveRelation = async () => {
  if (!state.relatedProducts.length) {
    ElMessage.warning({
      message: '请选择需要关联的商品'
    })
    return
  }
  await fetch({
    url: '/mall/product/addRelateProducts',
    method: 'post',
    data: {
      isEdit: 1,
      productId: props.relationId,
      relatedProducts: state.relatedProducts
    }
  }).then((res: any) => {
    if (res.code == 0) {
      ElMessage.success({
        message: '关联成功',
        type: 'success'
      })
      handelClose()
      emit('getData')
    }
  })
}

const handleSelectionChange = (row: any) => {
  state.relatedProducts = []
  row.map((item: any) => {
    state.relatedProducts.push(item.id)
  })
}

const getRelationGoods = async () => {
  state.loading = true
  await fetch({
    url: '/mall/product/page',
    method: 'get',
    params: {
      size: state.pageSize,
      current: state.currentPage
    }
  }).then((res: any) => {
    state.tableData = res.data.records
    state.total = res.data.total
    state.loading = false
    getRelationed()
  })
}

const handelClose = () => {
  emit('update:modelValue', false)
}
const handleCurrentChange = (val: number) => {
  state.currentPage = val
  getRelationGoods()
}

onMounted(() => {
  getRelationGoods()
})

watchEffect(() => {
  relationShow.value = props.modelValue
})
</script>
