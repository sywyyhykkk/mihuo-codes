<template>
  <div class="container">
    <el-table
      ref="multipleTable"
      :data="tableData"
      style="height: calc(100vh - 28rem) !important"
      row-key="materialId"
      border
      :fit="false"
      :height="'0'"
      :tree-props="{
        children: 'dataList',
        hasChildren: 'hasChildren'
      }"
      default-expand-all
      class="order-item"
      :header-cell-style="{textAlign:'center'}"
      :row-class-name="tableRowClassName"
      :span-method="arraySpanMethod"
      @current-change="currentRow"
    >
      <el-table-column
        label="图片"
        width="110"
        prop="name"
        class="flex-box"
      >
        <template #default="scope">
          <span v-if="scope.row.dataList">{{ scope.row.name }}</span>
          <div
            v-else
            class="image-container"
          >
            <el-image
              v-if="scope.row.coverImg"
              preview-teleported
              style="height: 8rem; width: 8rem; margin: 0"
              lazy
              :src="$getUrl.getPicUrl(scope.row.coverImg, true)[0]"
              :preview-src-list="$getUrl.getPicUrl(scope.row.coverImg)"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="invalid"
        label="商品状态"
        align="center"
      >
        <template #default="scope">
          <el-tag v-if="!scope.row.invalid" type="primary"> 生效 </el-tag>
          <el-tag v-else type="danger"> 失效 </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="skuId"
        label="材料编码"
        width="160"
        align="center"
      />
      <el-table-column
        prop="name"
        label="材料名称"
        width="200"
        align="center"
      >
        <template #default="scope">
          <span v-if="!scope.row.invalid">{{ scope.row.name }}</span>
          <span v-else class="invalid-text">商品已失效，请重新选择</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="brandName"
        label="品牌"
        align="center"
      />
      <el-table-column
        prop=""
        label="规格型号"
        align="center"
      >
        <template #default="scope">
          <div v-if="scope.row.productSku">
            {{ scope.row.productSku[0].value }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="unit"
        label="标准单位"
        align="center"
      />
      <el-table-column
        align="right"
        width="120"
      >
        <template #header>
          <span>数量</span>
          <el-icon :size="10" style="margin-left:10px"><EditPen /></el-icon>
        </template>
        <template #default="scope">
          <el-input
            v-if="state.curData.materialId == scope.row.materialId && !scope.row.invalid"
            v-model="scope.row.quantity"
            style="width:100%"
            placeholder="请输入数量"
            type="number"
            :min="1"
            @blur="blur($event,scope.row)"
            @focus="focus($event,scope.row)"
          />
          <div v-else>{{ scope.row.quantity }}</div>
        </template>
      </el-table-column>
      <el-table-column
        width="100"
        prop="price"
        label="单价"
        align="right"
      />
      <el-table-column
        width="100"
        prop="totalPrice"
        label="总价"
        align="right"
      />
      <el-table-column
        width="150"
        prop="supplierName"
        label="供应商"
      />
      <el-table-column
        label="操作"
        width="80"
        fixed="right"
        align="center"
      >
        <template #default="scope">
          <el-button
            v-if="scope.row.skuId"
            type="text"
            size="mini"
            class="danger"
            icon="delete"
            @click="del(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang='ts' setup>
const tableData:any = inject('tableData')
const handleMaterials:any = inject('handleMaterials')
const del:any = inject('del')
const state = reactive({
  curData: {},
  rawData: null
})

const currentRow = (val:any) => {
  if (val) {
    state.curData = val
  }
}

const focus = (e:any, row:any) => {
  state.rawData = row.quantity
}

const blur = (e:any, row:any) => {
  if (state.rawData != row.quantity) {
    handleMaterials('save', row)
  }
}

const arraySpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
  if (row.dataList) {
    if (columnIndex === 0) {
      return [1, 11]
    } else if (columnIndex >= 1 && columnIndex <= 10) {
      return [0, 0]
    }
  }
}

const tableRowClassName = ({ row, rowIndex }: any) => {
  if (row.dataList) {
    return 'warning-row'
  }
}
</script>

<style scoped lang="less">
.image-container {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}

.invalid-text {
  color: #f56c6c;
  font-weight: bold;
}
</style>
