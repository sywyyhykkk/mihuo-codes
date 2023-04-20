<template>
  <div>
    <el-card>
      <!--      <el-input-->
      <!--        v-model="state.listQuery.productName"-->
      <!--        placeholder="项目名称"-->
      <!--        prefix-icon="Search"-->
      <!--        clearable-->
      <!--        style="width: 26rem !important;"-->
      <!--        @change="handleSearchList"-->
      <!--      />-->
      <el-input
        v-model="state.listQuery.productName"
        placeholder="材料名称"
        prefix-icon="Search"
        clearable
        @change="handleSearchList"
      />

    </el-card>
    <el-tabs v-model="state.activeName" @tab-click="handleClick" style="margin-top: -1rem">
      <el-tab-pane label="全部" name="-1">
      </el-tab-pane>
      <el-tab-pane label="未测量" name="0">
      </el-tab-pane>
      <el-tab-pane label="已测量" name="1">
      </el-tab-pane>
      <measuringMaterialTable ref="tabelList" />
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, provide, nextTick, onMounted } from 'vue'
import type { TabsPaneContext } from 'element-plus'

const tabelList: any = ref(null)
const state = reactive({
  skillList: [],
  activeName: '-1',
  listQuery: {}
} as any)
provide('listQuery', state.listQuery)
// const handleResetSearch = () => {
//   state.listQuery = {}
//   tabelList.value.getData()
// }
const handleSearchList = () => {
  state.listQuery.measureFlag = state.activeName == -1 ? '' : state.activeName
  state.listQuery.productName = state.listQuery.productName ? state.listQuery.productName : null
  tabelList.value.getData()
}

const handleClick = (tab: TabsPaneContext, event: Event) => {
  // state.listQuery.payStatus = tab.props.name
  state.listQuery.measureFlag = state.activeName == -1 ? '' : state.activeName
  tabelList.value.getData()

}
onMounted(() => {

})
</script>

<style scoped>

</style>
