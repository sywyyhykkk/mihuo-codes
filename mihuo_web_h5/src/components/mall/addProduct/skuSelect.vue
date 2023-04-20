<template>
  <div>
    <div v-if="servicePackList.length > 0" style="margin-bottom: 20px">
      <div>已选商品及sku:</div>
      <div
        style="line-height: 30px; display: flex"
        v-for="item in servicePackList"
        :key="item.id"
      >
        <div>{{ item.productName }}</div>
        &nbsp;<span>{{ item.skuCode }}</span>
      </div>
    </div>
    <span>选择商品：</span>
    <el-select
      v-model="containsProduct"
      placeholder="请选择所需商品和服务"
      @change="selectProduct"
      @remove-tag="removeProduct"
      multiple
      filterable
      style="width: 80%"
    >
      <el-option
        v-for="item in productList"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </el-select>

    <!--    <el-input-->
    <!--      style="width: 90%"-->
    <!--      v-model="containsProduct"-->
    <!--      @click="showProductTable = true"-->
    <!--    ></el-input>-->

    <div style="margin-top: 10px">选择商品sku(只能选一条):</div>
    <el-table
      stripe
      style="width: 100%; margin-top: 20px; height: 350px"
      :data="skuList"
      v-loading="loading"
      border
    >
      <el-table-column label="SKU编号" align="center" prop="skuCode" />
      <el-table-column
        v-for="(item, index) in spData"
        :key="index"
        :label="item.key"
        align="center"
        :prop="item.key"
      >
        <template #default="scope">
          <!--          {{ item.value }}-->
          {{ getProductSkuSp(scope.row, index) }}
        </template>
      </el-table-column>
      <el-table-column label="销售价格" align="center" prop="price" />
      <el-table-column label="商品库存" align="center" prop="stock" />
      <el-table-column label="库存预警值" align="center" prop="lowStock" />
      <el-table-column label="转换系数" align="center" prop="convertValue" />
      <el-table-column label="操作" fixed="right" width="160" align="center">
        <template #default="scope">
          <el-button
            size="mini"
            type="text"
            @click="selectSku(scope.$index, scope.row)"
            >选择
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--    <productTable v-model="showProductTable" @getIds="getIds" />-->
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, reactive, toRefs } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { ElMessage } from 'element-plus'
import productTable from '@/components/mall/columnGroup/productTable.vue'

export default defineComponent({
  components: { productTable },
  props: {
    modelValue: {
      type: Object,
      default: null
    },
    protType: {
      type: Number,
      default: 2
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const state = reactive({
      showProductTable: false,
      loading: false,
      selectLength: 0,
      spData: [],
      skuList: [],
      productList: [],
      containsProduct: [] as any,
      servicePackList: props.modelValue as any,
      isEdit: props.isEdit
    })
    let protType = inject('protType')
    const getProductList = async () => {
      await fetch({
        url: `/mall/product/getList/${protType}`,
        method: 'get'
      }).then((res: any) => {
        state.productList = res.data
      })
    }
    const removeProduct = (row: any) => {
      console.log(row)
      console.log(state.servicePackList)
      state.servicePackList.forEach((item: any, index: any) => {
        if (row === item.productId) {
          state.servicePackList.splice(index, 1)
        }
      })
      console.log(state.servicePackList)
    }

    const selectProduct = async (row: any) => {
      if (row.length <= 0) {
        return
      }
      console.log(row)
      if (row.length - 1 > state.servicePackList.length) {
        ElMessage.warning('上一个商品的sku信息未选择,请选择商品对应的sku')
        state.containsProduct.splice(row.length - 1, 1)
        return
      }
      if (row.length < state.selectLength) {
        state.selectLength = row.length
        state.skuList = []
        console.log(row.length, state.selectLength)
        return
      } else {
        console.log(row.length, state.selectLength)
        state.selectLength = row.length
      }
      state.loading = true
      await fetch({
        url: `/mall/sku/${row[row.length - 1]}`,
        method: 'get'
      }).then((res) => {
        state.loading = false
        // state.skuList = res.data
        var productName: any = ''
        state.productList.forEach((item: any) => {
          if (item.id === row[row.length - 1]) {
            productName = item.name
            return
          }
        })
        var spData: any = []
        res.data.forEach((item: any) => {
          state.spData = JSON.parse(item.spData)
          item.skuId = item.id
          item.productId = row[row.length - 1]
          item.productName = productName
        })
        // state.spData={}

        state.skuList = res.data
      })
      // console.log(state.skuList)
    }
    const getProductSkuSp = (row: any, index: number) => {
      const spData = JSON.parse(row.spData)
      if (spData != null && index < spData.length) {
        return spData[index].value
      } else {
        return null
      }
    }
    const selectSku = (index: any, row: any) => {
      // console.log(row)
      state.servicePackList.push(row)
      state.skuList = []
    }
    const getIds = (val: any) => {
      // state.form.ids = val
      console.log('ssd', val)
    }
    onMounted(() => {
      if (state.isEdit) {
        state.servicePackList?.forEach((res: any) => {
          state.containsProduct.push(res.productId)
        })
      }
      getProductList()
    })
    return {
      getIds,
      getProductList,
      selectProduct,
      getProductSkuSp,
      selectSku,
      removeProduct,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
</style>
