<template>
  <div>
    <el-dialog
      v-if="isShowDialog"
      v-model="isShowDialog"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="查看"
      width="60%"
      @close="closeDialog"
    >
      <div style="height: 50vh;">
        <el-table
          v-loading="isTableLoading"
          stripe
          style="height: 50vh !important; overflow-y: scroll;"
          :data="tableData"
          :height="0"
          border
        >
          <el-table-column type="index" width="50" label="序号" />
          <el-table-column width="150" label="评论人" prop="userName" />
          <el-table-column width="150" label="评论时间" prop="commentDate" />
          <el-table-column label="评论内容" prop="comment" />
          <el-table-column label="操作">
            <template #default="scope">
              <el-button
                type="text"
                icon="view"
                @click="hideComment(scope.row)"
              >
                <!-- 0 隐藏 1 显示 默认值null 默认显示-->
                {{ (scope.row.status === 1 || scope.row.status === null) ? '隐藏' : '显示' }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  getMiyouComment,
  deleteMiyouComment,
  editMiyouCommentVisible
} from '@/pages/admin/api/miyouAudio'

import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  row: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'getData'])

const { row } = toRefs(props)
const isShowDialog = ref(props.modelValue)

watchEffect(() => {
  isShowDialog.value = props.modelValue
})

const tableData = ref([])

const getData = () => {
  getMiyouComment({ circleId: row.value.id }).then((res: any) => {
    if (res.code === 0) {
      tableData.value = res.data.records
    }
  })
}

onMounted(() => {
  getData()
})

const closeDialog = () => {
  isShowDialog.value = false
  row.value = {}
  tableData.value = []
  emit('update:modelValue', false)
  emit('getData')
}

// 隐藏评论
const hideComment = (row: any) => {
  editMiyouCommentVisible({
    ids: [row.id],
    status: row.status === 0 ? 1 : 0
  }).then((res: any) => {
    if (res.code === 0) {
      ElMessage.success('操作成功')
      getData()
    }
  })
}
</script>

<style lang="less" scoped>

</style>
