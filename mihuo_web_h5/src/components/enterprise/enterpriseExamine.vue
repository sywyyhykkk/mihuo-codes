<template>
  <el-dialog
    v-model="visible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :append-to-body="true"
    title="查看"
    :before-close="handleClose"
    width="56rem"
  >
    <el-form label-width="12rem" :model="form">
      <el-form-item label="姓名">
        <el-input v-model="forms.name" readonly />
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="forms.phone" readonly />
      </el-form-item>
      <el-form-item v-if="forms.jobName" label="岗位">
        <el-input v-model="forms.jobName" readonly />
      </el-form-item>
      <el-form-item v-if="forms.skillName" label="工种">
        <el-input v-model="forms.skillName" readonly />
      </el-form-item>
      <el-form-item label="从业年限">
        <el-input v-model="forms.skillYearNum" readonly />
      </el-form-item>
      <el-form-item label="工作类型">
        <span>
          {{ getWorkType(forms.workType) }}
        </span>
      </el-form-item>
      <el-form-item label="自我介绍">
        <el-input v-model="forms.selfIntroduce" readonly />
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
      <el-form-item label="是否可接单">
        {{ forms.orderStatus === 1 ? '可接单' : '不能接单' }}
      </el-form-item>
      <el-form-item label="资格证书">
        <el-image
        fit="cover"
          class="experience-image"
          v-for="(item, index) in getImg(forms.certificateImage).images"
          :key="index"
          preview-teleported
          lazy
          :src="$getUrl.getPicUrl(item)"
          :preview-src-list="getImg(forms.certificateImage).images"
        />
      </el-form-item>
      <el-form-item label="项目经历">
        <el-image
        fit="cover"
          class="experience-image"
          v-for="(item, index) in getImg(forms.projectImage).images"
          :key="index"
          preview-teleported
          lazy
          :src="$getUrl.getPicUrl(item)"
          :preview-src-list="getImg(forms.projectImage).images"
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
import { imageGlobal } from '@/global'

export default defineComponent({
  props: {
    form: {
      type: Object as PropType<object>,
      default: () => {}
    }
  },
  emits: ['dialogVisible'],
  setup(props, { emit }) {
    const visible = ref<boolean>(false)
    const handleClose = () => {
      visible.value = false
      emit('dialogVisible')
    }

    const getWorkType = (type: string) => {
      switch (type) {
        case '0':
          return '全职'
        case '1':
          return '兼职'
        default:
          return type
      }
    }

    const forms: any = computed(() => {
      return props.form
    })

    const open = () => {
      visible.value = true
    }

    const getImg = (imgList: any) => {
      if (!imgList) return ''
      let images = []
      let url
      try {
        const arr = JSON.parse(imgList)
        images = arr.map((item: { url: any }) => imageGlobal + item.url)
        url = arr[0].url
      } catch (e) {
        imgList.split(',').forEach((item: string) => {
          images.push(imageGlobal + item)
        })
        url = images[0]
      }
      return { url, images }
    }

    return {
      forms,
      visible,
      getImg,
      getWorkType,
      open,
      handleClose
    }
  }
})
</script>
<style scoped>
.experience-image{
  margin-right: 5px;
  width: 10rem;
  height: 10rem;
}
</style>
