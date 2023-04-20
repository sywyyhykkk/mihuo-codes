<template>
  <el-dialog
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    v-model="visible"
    :append-to-body="true"
    title="查看"
    :before-close="handleClose"
  >
    <el-form label-width="9rem" :model="form">
      <el-form-item label="企业名称">
        <el-input v-model="forms.companyName" readonly />
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="forms.contactTel" readonly />
      </el-form-item>
      <el-form-item label="统一社会信用编号">
        <el-input v-model="forms.socialCreditNo" readonly />
      </el-form-item>
      <el-form-item label="审核状态">
        {{
          forms.auditStatus === 0
            ? '待审核'
            : forms.auditStatus === 1
            ? '审核失败'
            : '审核通过'
        }}
      </el-form-item>
      <el-form-item label="Logo">
        <el-image
          preview-teleported
          lazy
          style="margin-right: 20px; max-height: 100px"
          :src="getThumbnailImage(forms.companyLogo, true)"
          :preview-src-list="[getThumbnailImage(forms.companyLogo, false)]"
        />
      </el-form-item>
      <el-form-item label="证件照">
        <el-image
          preview-teleported
          lazy
          style="margin-right: 20px; max-height: 100px"
          :src="getThumbnailImage(forms.legalIdcardBack, true)"
          :preview-src-list="[getThumbnailImage(forms.legalIdcardBack, false)]"
        />
        <el-image
          preview-teleported
          lazy
          style="max-height: 100px"
          :src="getThumbnailImage(forms.legalIdcardFront, true)"
          :preview-src-list="[getThumbnailImage(forms.legalIdcardFront, false)]"
        />
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
import { thumbnailImage } from '@/utils/utils'
export default defineComponent({
  props: {
    form: {
      type: Object as PropType<object>,
      default: () => {},
    },
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
    const getThumbnailImage = (url: any, thumbnail: any) => {
      return thumbnailImage(url, thumbnail)
    }
    return {
      forms,
      visible,
      getThumbnailImage,
      open,
      handleClose,
    }
  },
})
</script>
<style scoped>
</style>
