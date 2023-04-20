<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="运费模版" name="0">
        <freight-management />
      </el-tab-pane>
      <el-tab-pane label="入户/安装费模版" name="1">
        <installation-template-management />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  name: '运费模版管理'
})
</script>
<script lang="ts" setup>
const activeName = ref('0')
</script>

<style lang="less" scoped>
</style>
