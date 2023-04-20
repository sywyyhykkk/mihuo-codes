<template>
  <el-dialog :close-on-press-escape="false" :close-on-click-modal="false"
             v-model="visible"
             :append-to-body="true"
             title="查看"
             :before-close="handleClose"
  >
    <el-form label-width="140px" :model="form">
      <el-form-item label="企业名称">
        <el-input v-model="forms.companyName" readonly />
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="forms.contactTel" readonly />
      </el-form-item>
      <el-form-item label="统一社会信用编号">
        <el-input v-model="forms.socialCreditNo" readonly />
      </el-form-item>
      <el-form-item label="省编号">
        <el-input v-model="forms.provinceCode" readonly />
      </el-form-item>
      <el-form-item label="市编号">
        <el-input v-model="forms.cityCode" readonly />
      </el-form-item>
      <el-form-item label="区编号">
        <el-input v-model="forms.areaCode" readonly />
      </el-form-item>
      <el-form-item label="审核状态">
        <el-input v-model="forms.auditStatus" readonly />
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
import { defineComponent, ref, PropType, computed } from 'vue'

export default defineComponent({
  props: {
    form: {
      type: Object as PropType<object>,
      default: () => {
      }
    }
  },
  emits: ['dialogVisible'],
  setup(props, { emit }) {
    const visible = ref<boolean>(false)
    const handleClose = () => {
      visible.value = false
      emit('dialogVisible')
    }
    const forms = computed(() => {
      return props.form
    })
    console.log('props :>> ', forms)
    const open = () => {
      visible.value = true
      console.log('visible :>> ', visible.value)
    }
    return {
      forms,
      visible,
      open,
      handleClose
    }
  }
})
</script>
<style scoped></style>
