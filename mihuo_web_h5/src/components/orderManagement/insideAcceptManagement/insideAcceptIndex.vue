<template>
  <div class="order-index">
    <el-card>
      <el-input v-model="state.formSearch.orderSn" placeholder="订单号，商品名称" :prefix-icon="Search" />
      <el-input v-model="state.formSearch.memberUsername" placeholder="买家" :prefix-icon="Search" />
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
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="state.formSearch.orderType"
        placeholder="订单分类"
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
      <el-select
        v-model="state.formSearch.orderType"
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
    <el-tabs v-model="state.activeName" class="demo-tabs">
      <el-tab-pane label="待验" name="first">
        <accept-table></accept-table>
      </el-tab-pane>
      <el-tab-pane label="已验" name="second">
        <accept-table></accept-table>
      </el-tab-pane>
      <el-tab-pane label="全部" name="third">
        <accept-table></accept-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang='ts' setup>
import { reactive } from 'vue'
import { Search } from '@element-plus/icons-vue'

const state = reactive({
  options: [],
  activeName: 'first',
  formSearch: {}
})

const search = () => {

}
const resetSearch = () => {

}
</script>

<style scoped lang="less">
</style>
