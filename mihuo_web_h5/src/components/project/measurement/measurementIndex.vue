<template>
  <div>
    <el-tabs v-model="pageType" @tab-click="handleClick">
      <el-tab-pane label="空间类型" name="0">
      </el-tab-pane>
      <el-tab-pane label="空间参数" name="1">
      </el-tab-pane>
      <el-tab-pane label="房屋参数" name="3">
      </el-tab-pane>
      <el-tab-pane label="房屋信息" name="2">
      </el-tab-pane>
    </el-tabs>
    <div style="position: relative">
      <el-card>
        <div class="el-card-right">
          <el-button
            type="primary"
            @click="buttonClick"
            v-if="pageType!=2"
            icon="plus"
          >新增
          </el-button>
        </div>
      </el-card>
      <DoorModel v-model="showDialog" v-if="pageType==0" />
      <HouseParam v-model="showDialogPar" :pageStatus="1" pageTitle="空间" v-if="pageType==1" />
      <HouseParam v-model="showDialogPar" :pageStatus="3" pageTitle="房屋" v-if="pageType==3" />
      <HouseInfo v-model="isEdit" v-if="pageType==2" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import DoorModel from '_c/project/measurement/doorModel.vue'
import HouseParam from '_c/project/measurement/houseParam.vue'
import HouseInfo from '_c/project/measurement/houseInfo.vue'

export default defineComponent({
  components: {
    DoorModel, HouseInfo, HouseParam
  },
  setup(props) {
    const state = reactive({
      pageType: '0',
      showDialog: false,
      showDialogPar: false,
      isEdit: false
    })
    const buttonClick = () => {
      console.log(state.pageType)
      if (state.pageType === '0') {
        state.showDialog = true
      }
      if (state.pageType === '1' || state.pageType === '3') {
        state.showDialogPar = true
      }
      if (state.pageType === '2') {
        state.isEdit = true
      }
    }
    return {
      buttonClick,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped>

</style>
