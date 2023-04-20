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
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="form.roleName" />
      </el-form-item>
      <el-form-item label="角色标识" prop="roleCode">
        <el-input v-model="form.roleCode" />
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="form.roleDesc" type="textarea" />
      </el-form-item>
      <el-form-item label="数据权限" prop="dsType">
        <el-select
          v-model="form.dsType"
          style="width: 100%"
          placeholder="请选择"
        >
          <el-option
            v-for="item in [
              { value: 0, label: '全部' },
              { value: 1, label: '自定义' },
              { value: 2, label: '本级及子级' },
              { value: 3, label: '本级' },
            ]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
import { addRole } from '_@/api/role'

interface FormModule {
  roleName: string | number
  roleCode: string
  roleDesc: number | string
  dsType: number | string
}
interface RulesModule {
  roleName: any[]
  roleCode: any[]
  dsType: any[]
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
      roleName: '',
      roleCode: '',
      dsType: '',
      roleDesc: '',
    })
    const validatorKey = (rule: any, value: any, callback: any) => {
      const acount = /^[A-Z_]+$/
      if (value && !acount.test(value)) {
        callback(new Error('请输入大写英文、下划线'))
      } else {
        callback()
      }
    }
    const rules = reactive<RulesModule>({
      roleName: [{ required: true, message: '角色名称' }],
      roleCode: [{ required: true, validator: validatorKey }],
      dsType: [{ required: true, message: '数据权限' }],
    })

    const open = () => {
      visible.value = true
      console.log('visible :>> ', visible.value)
    }
    const confirms = async () => {
      const formWrap = unref(rulesForm) as any
      if (!formWrap) return
      try {
        formWrap.validate(async (valid: boolean) => {
          if (valid) {
            const res = await addRole(form)
            if (res) {
              ElMessage({
                type: 'success',
                message: `新增${form.roleName}成功`,
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
