<template>
  <div>
    <el-dialog
      v-model="isShow"
      width="75vw"
      destroy-on-close
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="从项目导入"
      @close="hideDialog"
    >
      <ElEmpty
        v-if="imageList.length === 0"
        description="当前关联项目内暂无图纸"
      />
      <div v-else class="flex-center container">
        <div
          v-for="(item, index) in imageList"
          :key="index"
          class="img-container flex-center"
          @click="handleImagePicked(item)"
        >
          <el-image class="img" :src="$getUrl.getPicUrl(item.img.url) " />
          <span>来源: {{ item.sourceName }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { getProjectImages } from '../api'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  projectId: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update:modelValue', 'imagePicked'])
const isShow = ref(false)

onMounted(() => {
  getAllImages()
})

const imageList = ref<any[]>([])
// 获取所有图片
const getAllImages = async () => {
  const res = await getProjectImages({ projectId: props.projectId })
  imageList.value = []
  if (res && res.data.length !== 0) {
    res.data.forEach((item: any) => {
      item.sopUploadList.forEach((images: any) => {
        images.uploadItemList.forEach((img: any) => {
          imageList.value.push({
            img,
            sourceName: item.groupName
          })
        })
      })
    })
  }
}

const hideDialog = () => {
  isShow.value = false
  emit('update:modelValue', false)
}

// 选择图片
const handleImagePicked = (item: any) => {
  isShow.value = false
  emit('imagePicked', item)
  emit('update:modelValue', false)
}

watchEffect(() => {
  isShow.value = props.modelValue
})
</script>

<style lang="less" scoped>
.container {
  flex-wrap: wrap;
  padding: 2rem;

  .img-container {
    flex-direction: column;
    justify-content: center;
    margin: 2rem;
    border-radius: 1rem;

    .img {
      width: 14rem;
      height: 14rem;
      border-radius: 1rem;
      margin-bottom: 1rem;
    }
  }
}

.flex-center {
  display: flex;
  align-items: center;
}

</style>
