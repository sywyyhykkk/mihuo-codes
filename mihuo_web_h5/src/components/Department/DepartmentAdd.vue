<template>
  <el-dialog
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    v-model="visible"
    :append-to-body="true"
    title="新增"
    :before-close="handleClose"
  >
    <el-form ref="rulesForm" label-width="100px" :model="form" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="部门排序" prop="sort">
        <el-input v-model="form.sort" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="confirms">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs, unref } from 'vue'
import { ElMessage } from 'element-plus'
import { addDepartment } from '_@/api/department'

interface FormModule {
  name: string | number
  parentId: string | number
  sort: number | string
}
interface RulesModule {
  name: any[]
  sort: any[]
}
export default defineComponent({
  emits: ['Add'],
  setup(props, { emit }) {
    const visible = ref<boolean>(false)
    const rulesForm = ref<HTMLElement | null>(null)
    const handleClose = () => {
      visible.value = false
      emit('Add')
    }
    const form = reactive<FormModule>({
      name: '',
      parentId: '',
      sort: '',
    })

    const rules = reactive<RulesModule>({
      name: [{ required: true, message: '请输入部门名称' }],
      sort: [{ required: true, message: '请输入部门排序' }],
    })

    const open = (e: any) => {
      visible.value = true
      form.parentId = e
      console.log('visible :>> ', visible.value)
    }
    const confirms = async () => {
      const formWrap = unref(rulesForm) as any
      if (!formWrap) return
      try {
        formWrap.validate(async (valid: boolean) => {
          if (valid) {
            const res = await addDepartment(form)
            if (res) {
              ElMessage({
                type: 'success',
                message: `新增${form.name}成功`,
              })
              visible.value = false
              emit('Add', true)
            }
          } else {
            return false
          }
        })
      } catch (err) {
        console.log(err)
      }
    }
    return {
      rulesForm,
      confirms,
      rules,
      visible,
      open,
      handleClose,
      form,
    }
  },
})
</script>
<style scoped></style>
