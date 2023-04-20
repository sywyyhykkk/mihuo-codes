<template>
  <el-dialog :close-on-press-escape="false" :close-on-click-modal="false"
    v-model="visible"
    :append-to-body="true"
    title="查看"
    :before-close="handleClose"
  >
    <el-form label-width="100px" :model="form">
      <el-form-item label="节点编号">
        <el-input v-model="form.id" readonly />
      </el-form-item>
      <el-form-item label="部门名称">
        <el-input v-model="form.name" readonly />
      </el-form-item>
      <el-form-item label="父级节点名称">
        <el-input v-model="form.parentId" readonly />
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model="form.sort" readonly />
      </el-form-item>
      <el-form-item label="所属企业">
        <el-input v-model="form.companyId" readonly />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleClose">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from 'vue'

export default defineComponent({
  emits: ['dialogVisible'],
  setup(props, { emit }) {
    const visible = ref<boolean>(false)
    const handleClose = () => {
      visible.value = false
      emit('dialogVisible')
    }
    const state = reactive({ form: { a: 1 }})
    const open = () => {
      visible.value = true
      console.log('visible :>> ', visible.value)
    }
    return {
      visible,
      open,
      handleClose,
      ...toRefs(state)
    }
  }
})
</script>
<style scoped></style>
