<template>
  <el-pagination
    :current-page="parseInt(props.currentPage)"
    :page-size="parseInt(props.pagesize)"
    :total="parseInt(props.total)"
    layout="total, prev, pager, next, jumper"
    @current-change="handleCurrentChange"
  />
</template>

<script setup>
import { defineEmits, defineProps } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number || String,
    default: 0
  },
  pagesize: {
    type: Number || String,
    default: 10
  },
  total: {
    type: Number || String,
    default: 0
  }
})

const emit = defineEmits(['currentChange'])

const handleCurrentChange = (val) => {
  emit('currentChange', val)
}
const handleSizeChange = (val, currentPage) => {
  emit('sizeChange', val, currentPage)
}
</script>

<style scoped>

</style>
