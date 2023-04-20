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
      <el-form-item label="姓名">
        <el-input v-model="forms.username" readonly />
      </el-form-item>
      <el-form-item label="身份证号">
        <el-input v-model="forms.idcard" readonly />
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
      <el-form-item label="身份证照">
        <el-image
          preview-teleported
          style="margin-right: 10px; max-height: 100px"
          :src="getThumbnailImage(forms.idcardFront, true)"
          :preview-src-list="[getThumbnailImage(forms.idcardFront, false)]"
        />
        <el-image
          preview-teleported
          style="max-height: 100px"
          :src="getThumbnailImage(forms.idcardBack, true)"
          :preview-src-list="[getThumbnailImage(forms.idcardBack, false)]"
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
<style scoped></style>
