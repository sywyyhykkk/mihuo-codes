<template>
  <div class="order-index">
    <el-card>
      <el-input v-model="state.formSearch.orderSn" placeholder="订单号，商品名称" :prefix-icon="Search" />
      <el-input v-model="state.formSearch.buyer" placeholder="买家" :prefix-icon="Search" />
      <el-date-picker
        v-model="state.formSearch.date"
        type="daterange"
        value-format="YYYY-MM-DD"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="dateChange"
      />
      <el-select v-model="state.formSearch.sourceType" placeholder="订单来源" clearable>
        <el-option
          v-for="item in sourceTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <!--      <el-select v-model="state.formSearch.status" placeholder="订单状态" clearable>-->
      <!--        <el-option-->
      <!--          v-for="item in options"-->
      <!--          :key="item.value"-->
      <!--          :label="item.label"-->
      <!--          :value="item.value"-->
      <!--        >-->
      <!--        </el-option>-->
      <!--      </el-select>-->
      <el-select
        v-model="state.formSearch.type"
        placeholder="订单分类"
        clearable
      >
        <el-option
          v-for="item in typeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="state.formSearch.serviceType"
        placeholder="所需服务"
        clearable
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-button @click="search()" icon="Search" type="primary">查询</el-button>
      <el-button @click="resetSearch()" icon="refreshLeft">重置</el-button>
    </el-card>
    <el-tabs v-model="state.formSearch.isAssign" @tab-click="handleClick" class="demo-tabs">
      <el-tab-pane label="待派" name="0"></el-tab-pane>
      <el-tab-pane label="已派" name="1">
      </el-tab-pane>
      <el-tab-pane label="全部" name="2">
      </el-tab-pane>
      <order-table :searchData="state.formSearch" ref="myOrder"></order-table>
    </el-tabs>
  </div>
</template>

<script lang='ts' setup>
import { reactive, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

const myOrder = ref<any>('')
const sourceTypeOptions = ref<any>([
  { label: '全部', value: 3 },
  { label: 'PC订单', value: 0 },
  { label: 'app订单', value: 1 },
  { label: '供应商订单', value: 2 }
])
const typeOptions = ref<any>([
  { label: '全部', value: 2 },
  { label: '正常订单', value: 0 },
  { label: '秒杀订单', value: 1 }
])
const state = reactive({
  options: [],
  formSearch: {
    isAssign: '2'
  } as any
})
const dateChange = () => {
  state.formSearch.endTime = state.formSearch.date[1]
  state.formSearch.startTime = state.formSearch.date[0]
}

const search = () => {
  myOrder.value.getData()
}
const resetSearch = () => {
  state.formSearch = {
    isAssign: '2'
  }
  myOrder.value.getData()
}
const handleClick = () => {
  myOrder.value.getData()
}
</script>

<style scoped lang="less">
</style>
