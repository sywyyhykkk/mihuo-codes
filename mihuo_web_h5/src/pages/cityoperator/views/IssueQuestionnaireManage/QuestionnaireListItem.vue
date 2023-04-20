<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
// import TabItemStatement from './TabItemStatement.vue'
import TabItemEdit from './TabItemEdit.vue'
import LockManager from '@/utils/Lock'
const props = defineProps<{ id: number; title: string }>()

const route = useRoute()

// const activeName = ref('manage')

onBeforeMount(() => {
  route.meta.title = route.query.title || '问卷信息'
})
</script>

<template>
  <div class="questionnaire">
    <TabItemEdit />
    <!-- <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane name="overview">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Odometer /></el-icon>
            <span> 概述/报表</span>
          </span>
        </template>
        <TabItemStatement />
      </el-tab-pane>
      <el-tab-pane name="manage">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Edit /></el-icon>
            <span>问卷管理</span>
          </span>
        </template>
        <TabItemEdit />
      </el-tab-pane>
    </el-tabs> -->
  </div>
</template>

<style scoped lang="less"></style>
