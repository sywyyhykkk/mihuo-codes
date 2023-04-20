<template>
  <div>
    <el-drawer
      v-model="isShowDrawer"
      size="40%"
      destroy-on-close
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="案例图片维护"
      @close="hideDrawer"
    >
      <el-button
        type="primary"
        style="margin-bottom: 2rem;"
        @click="addImageGroup()"
      >新增图片分组</el-button>
      <el-card
        v-for="(item, index) in imageGroups"
        :key="index"
        class="box-card"
      >
        <template #header>
          <div class="flex-center" style="justify-content: space-between;">
            <span>{{ item.groupName }}</span>
            <div class="flex-center">
              <el-button
                plain
                @click="editGroup(index)"
              >编辑分组</el-button>
              <el-button
                type="text"
                class="danger"
                icon="delete"
                @click="deleteGroup(index)"
              >删除分组</el-button>
            </div>
          </div>
        </template>

        <div class="flex-center" style="align-items: flex-start; flex-direction: column">
          <div>
            <uploadImage
              v-model="item.images"
              :max-count="30"
              :is-edits="true"
            />
          </div>
          <div v-if="item.importedImages">
            <div style="margin: 2rem 0;">
              <p style="font-size: 1rem;">从项目导入:</p>
            </div>
            <el-image
              v-for="(img, index2) in item.importedImages.split(',')"
              :key="index2"
              class="img"
              :src=" $getUrl.getPicUrl(img)"
            />
          </div>
          <div>
            <el-button
              style="margin-top: 2rem !important;"
              type="primary"
              @click="importImg(index)"
            >从项目导入</el-button>
          </div>
        </div>
      </el-card>
      <template #footer>
        <div style="padding: 2rem">
          <el-button type="primary" @click="saveDrawer">保存</el-button>
          <el-button @click="hideDrawer">取消</el-button>
        </div>
      </template>
    </el-drawer>
    <!-- 导入项目图片弹窗 -->
    <image-picker v-model="isShowImagePicker" :project-id="projectId" @imagePicked="imagePicked" />
    <el-dialog
      v-model="isShowImageGroup"
      destroy-on-close
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="新增图片分组"
      @close="hideDialog"
    >
      <el-form
        :model="imageGroupForm"
        label-width="10rem"
      >
        <el-form-item label="分组名称" prop="groupName">
          <el-input
            v-model="imageGroupForm.groupName"
            maxlength="8"
            placeholder="请输入分组名称"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="padding: 2rem">
          <el-button type="primary" @click="saveImageGroup">保存</el-button>
          <el-button @click="hideDialog">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus/es'
import { editCase } from '../api'

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

// 关联的项目ID
const projectId = ref(props.row?.relationProjectId)
// 案例ID
const caseId = ref(props.row?.id)

// 控制表单的显示/隐藏
const isShowDrawer = ref(false)

const hideDrawer = () => {
  isShowDrawer.value = false
  emit('update:modelValue', false)
}

// 保存图片维护
const saveDrawer = async () => {
  const finalData = JSON.parse(JSON.stringify(imageGroups.value))
  finalData.forEach((item: any) => {
    if (item['importedImages']) {
      item['images'] += ',' + item['importedImages']
      item['importedImages'] = ''
    }
  })
  const res: any = await editCase({
    id: caseId.value,
    ...props.row,
    images: JSON.stringify(finalData)
  })
  if (res && res.code === 0) {
    hideDrawer()
    emit('getData')
  }
}

watchEffect(() => {
  isShowDrawer.value = props.modelValue
})

// 是否显示从项目导入图片弹窗
const isShowImagePicker = ref(false)

// 当前选中的图片分组index
const currentGroupIndex = ref(-1)

// 显示从项目导入图片弹窗
const importImg = (index: number) => {
  if (!projectId.value) {
    ElMessage.warning('当前案例未关联项目！')
    return
  }
  currentGroupIndex.value = index
  isShowImagePicker.value = true
}

// 导入图片
const imagePicked = (data: any) => {
  imageGroups.value[currentGroupIndex.value]['importedImages'] += data.img.url
  currentGroupIndex.value = -1
}

// 图片分组
const imageGroups = ref<any []>(props.row?.images ? JSON.parse(props.row?.images) : [])
// 是否编辑图片分组
const isEditGroup = ref(false)
// 是否显示新增图片分组弹窗
const isShowImageGroup = ref(false)
// 图片分组表单
const imageGroupForm = ref({
  groupName: '',
  images: '', // 上传的图片
  importedImages: '' // 导入的图片
})

// 新增图片分组
const addImageGroup = () => {
  isShowImageGroup.value = true
}

// 保存新增分组
const saveImageGroup = () => {
  if (!imageGroupForm.value.groupName) {
    ElMessage.warning('请输入分组名称')
    return
  }
  if (isEditGroup.value) {
    imageGroups.value[currentGroupIndex.value] = imageGroupForm.value
  } else {
    imageGroups.value.push(imageGroupForm.value)
  }
  hideDialog()
}

// 隐藏弹窗
const hideDialog = () => {
  imageGroupForm.value = {
    groupName: '',
    images: '', // 上传的图片
    importedImages: '' // 导入的图片
  }
  isEditGroup.value = false
  isShowImageGroup.value = false
}

// 编辑分组
const editGroup = (index: number) => {
  currentGroupIndex.value = index
  imageGroupForm.value = JSON.parse(JSON.stringify(imageGroups.value[index]))
  isShowImageGroup.value = true
  isEditGroup.value = true
}

// 删除分组
const deleteGroup = (index: number) => {
  ElMessageBox.confirm(`此操作将删除该图片分组, 是否继续?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    ElMessage.success('删除成功')
    imageGroups.value.splice(index, 1)
  }).catch(e => {})
}
</script>

<style lang="less" scoped>
.box-card {
  width: 70rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: var(--el-box-shadow-light) !important;
}

.img {
  width: 11rem;
  height: 11rem;
  border-radius: .5rem;
  margin-right: 2rem;
}

.flex-center{
  display: flex;
  align-items: center;
}
</style>
