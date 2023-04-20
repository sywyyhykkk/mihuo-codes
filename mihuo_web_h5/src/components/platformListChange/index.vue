<template>
  <div class="source-contain-all">
    <span class="label">数据来源：</span>
    <el-select v-model="platform" size="small" placeholder="请选择数据来源" clearable @change="getFileType">
      <el-option
        v-for="(item,index) in platformList"
        :key="index"
        :label="item.typeName"
        :value="item.typeId"
      />
    </el-select>
  </div>

</template>

<script lang="ts">

import { defineComponent, ref } from 'vue'

export default defineComponent({
  emits: ['change'],
  setup(props, { emit }) {
    const platform = ref('')
    const platformList = ref([
      { typeName: '全部', typeId: 0 },
      { typeName: '平台端', typeId: 1 },
      { typeName: '企业端', typeId: 2 },
      { typeName: '运营端', typeId: 3 }]
    )

    const getFileType = (e:any) => {
      if (!e) {
        return
      }
      emit('change', platformList.value.filter(item => item.typeId === e)[0])
    }

    return {
      platformList,
      platform,
      getFileType

    }
  }

})

</script>

<style lang="less" scoped>
  .source-contain-all{
    display: inline-block;
    .label{
      color: #606266;
      font-size: 16px;
    }
  }
</style>
