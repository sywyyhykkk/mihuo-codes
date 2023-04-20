<template>
  <div>
    <el-drawer
      v-model="isShowDrawer"
      size="40%"
      destroy-on-close
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="isCopy ? '复制案例' : isAdd ? '新增案例' : isEdit ? '编辑案例' : '查看案例'"
      @close="hideDrawer"
    >
      <el-card
        class="box-card"
      >
        <template #header>
          <div class="flex-center" style="width: 100%; justify-content: space-between;">
            <span>关联项目信息</span>
            <el-button
              type="primary"
              :disabled="!isEdit && !isAdd"
              plain
              @click="relateProject"
            >关联项目</el-button>
          </div>
        </template>
        <el-form
          :model="caseBaseInfo"
          label-width="24rem"
        >
          <el-form-item prop="customerName" label="业主姓名">
            <el-input
              v-model="caseBaseInfo.customerName"
              disabled
              placeholder="关联项目业主姓名"
            />
          </el-form-item>
          <el-form-item prop="address" label="项目地址">
            <el-input
              v-model="caseBaseInfo.address"
              disabled
              placeholder="关联项目地址"
            />
          </el-form-item>
        </el-form>
      </el-card>
      <el-card header="案例基础信息" class="box-card">
        <el-form
          ref="caseBaseInfoForms"
          :rules="caseBaseInfoRules"
          :model="caseBaseInfo"
          label-width="12rem"
          :disabled="!isEdit && !isAdd && !isCopy"
        >
          <el-form-item prop="name" label="案例名称">
            <el-input
              v-model="caseBaseInfo.name"
              maxlength="20"
              placeholder="请输入案例名称"
            />
          </el-form-item>
          <el-form-item prop="description" label="案例描述">
            <el-input
              v-model="caseBaseInfo.description"
              type="textarea"
              placeholder="请输入案例描述"
            />
          </el-form-item>
          <el-form-item label="封面图片" prop="coverPic">
            <div class="flex-center" style="align-items: flex-start; flex-direction: column;">
              <div>
                <uploadImage
                  v-model="caseBaseInfo.coverPic"
                  :max-count="1"
                  :is-edits="!isEdit && !isAdd"
                />
              </div>
              <div v-if="importedCoverPic">
                <div style="margin: 2rem 0;">
                  <p style="font-size: 1rem;">从项目导入:</p>
                </div>
                <el-image
                  v-for="(item, index) in importedCoverPic.split(',')"
                  :key="index"
                  class="img"
                  :src=" $getUrl.getPicUrl(item)"
                />
              </div>
              <div>
                <el-button
                  :disabled="!isEdit && !isAdd"
                  style="margin-top: 2rem !important;"
                  type="primary"
                  @click="importImg(1)"
                >从项目导入</el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="户型图" prop="imagesHouseType">
            <div class="flex-center" style="align-items: flex-start; flex-direction: column;">
              <div>
                <uploadImage
                  v-model="caseBaseInfo.imagesHouseType"
                  :max-count="5"
                  :is-edits="!isEdit && !isAdd"
                />
              </div>
              <div v-if="importedImagesHouseType">
                <div style="margin: 2rem 0;">
                  <p style="font-size: 1rem;">从项目导入:</p>
                </div>
                <el-image
                  v-for="(item, index) in importedImagesHouseType.split(',')"
                  :key="index"
                  class="img"
                  :src=" $getUrl.getPicUrl(item)"
                />
              </div>
              <div>
                <el-button
                  :disabled="!isEdit && !isAdd"
                  style="margin-top: 2rem !important;"
                  type="primary"
                  @click="importImg(2)"
                >从项目导入</el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="案例视频" prop="caseVideo">
            <uploadImage
              v-model="caseBaseInfo.caseVideo"
              :max-count="1"
              :is-video="true"
              :is-edits="!isEdit && !isAdd"
            />
          </el-form-item>
          <el-form-item label="装修面积" prop="houseArea">
            <el-input
              v-model="caseBaseInfo.houseArea"
              type="number"
              placeholder="请输入装修面积"
            >
              <template #append>m²</template>
            </el-input>
          </el-form-item>
          <el-form-item label="装修方式" prop="way">
            <el-select
              v-model="caseBaseInfo.way"
              filterable
              placeholder="请选择装修方式"
            >
              <el-option
                v-for="(item, index) in decorateWay"
                :key="index"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="房屋户型" prop="houseType">
            <el-select
              v-model="caseBaseInfo.houseType"
              filterable
              placeholder="请选择房屋户型"
            >
              <el-option
                v-for="(item, index) in modelList"
                :key="index"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="装修风格" prop="houseStyle">
            <el-select
              v-model="caseBaseInfo.houseStyle"
              filterable
              placeholder="请选择装修风格"
            >
              <el-option
                v-for="(item, index) in styleList"
                :key="index"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否推荐" prop="recommendStatus">
            <el-switch v-model="caseBaseInfo.recommendStatus" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item prop="collectNum" label="收藏数">
            <el-input
              v-model="caseBaseInfo.collectNum"
              maxlength="20"
              type="number"
              placeholder="请输入收藏数"
            />
          </el-form-item>
          <el-form-item prop="likeNum" label="点赞">
            <el-input
              v-model="caseBaseInfo.likeNum"
              maxlength="20"
              type="number"
              placeholder="请输入点赞数"
            />
          </el-form-item>
          <el-form-item prop="designPrice" label="设计费用">
            <el-input
              v-model="caseBaseInfo.designPrice"
              maxlength="20"
              type="number"
              placeholder="请输入设计费用"
            />
          </el-form-item>
          <el-form-item prop="sort" label="排序">
            <el-input
              v-model="caseBaseInfo.sort"
              maxlength="20"
              type="number"
              placeholder="请输入排序"
            />
          </el-form-item>
        </el-form>
      </el-card>
      <template #footer>
        <div style="padding: 2rem">
          <el-button type="primary" @click="saveBaseInfoForm">保存</el-button>
          <el-button @click="hideDrawer">取消</el-button>
        </div>
      </template>
    </el-drawer>
    <!-- 关联项目弹窗 -->
    <project-picker v-model="isShowProjectPicker" @projectPicked="projectPicked" />
    <!-- 导入项目图片弹窗 -->
    <image-picker
      v-model="isShowImagePicker"
      :project-id="caseBaseInfo.relationProjectId"
      @imagePicked="imagePicked"
    />
  </div>
</template>

<script lang="ts" setup>
import { caseBaseInfoRules } from '../rules'
import { dictType } from '_c/util/api/templateConfig'
import { addCase, editCase } from '../api'
import { ElMessage } from 'element-plus'

const props = defineProps({
  isAdd: {
    type: Boolean,
    default: false
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  isCopy: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Boolean,
    default: false
  },
  row: {
    type: Object,
    default: () => ({})
  }
})

onMounted(() => {
  if (props.isEdit || props.isAdd) {
    getHouseTypeDictionary()
    getHouseStyleDictionary()
    getDecorateWay()
  }
})

// 控制表单的显示/隐藏
const emit = defineEmits(['update:modelValue', 'getData'])
const isShowDrawer = ref(false)

const hideDrawer = () => {
  isShowDrawer.value = false
  caseBaseInfo.value = {
    id: '',
    name: '', // 案例名称
    description: '', // 案例描述
    way: '', // 装修方式
    houseArea: null, // 面积
    houseType: '', // 户型
    houseStyle: '', // 风格
    collectNum: null, // 收藏数
    likeNum: null, // 点赞数
    sort: null, // 排序
    recommendStatus: 0, // 是否推荐 0否 1是
    coverPic: '', // 案例封面图
    imagesHouseType: '', // 案例户型图
    caseVideo: '', // 案例视频
    relationProjectId: null, // 关联的项目ID
    customerName: '',
    address: '',
    designPrice: null
  }
  emit('update:modelValue', false)
}

watchEffect(() => {
  isShowDrawer.value = props.modelValue
})

const isShowProjectPicker = ref(false)

const relateProject = () => {
  isShowProjectPicker.value = true
}

// 关联项目
const projectPicked = (project: any) => {
  isShowProjectPicker.value = false
  caseBaseInfo.value.houseArea = caseBaseInfo.value.houseArea ?? project.usableArea
  caseBaseInfo.value.relationProjectId = project.id
  caseBaseInfo.value.customerName = project.customerName + '_' + project.customerPhone
  caseBaseInfo.value.address = project.poiName
}

// 案例基础信息表单
const caseBaseInfo = ref({
  id: props.row.id || null,
  // 案例名称
  name: props.row.name || null,
  // 案例描述
  description: props.row.description || null,
  // 装修方式
  way: props.row.way || null,
  // 面积
  houseArea: props.row.houseArea || null,
  // 户型
  houseType: props.row.houseType || null,
  // 风格
  houseStyle: props.row.houseStyle || null,
  // 收藏数
  collectNum: props.row.collectNum || null,
  // 点赞数
  likeNum: props.row.likeNum || null,
  // 排序
  sort: props.row.sort,
  // 是否推荐 0否 1是
  recommendStatus: props.row.recommendStatus || null,
  // 案例封面图
  coverPic: props.row.coverPic ? JSON.parse(props.row?.coverPic).join(',') : '',
  // 案例户型图
  imagesHouseType: props.row.imagesHouseType ? JSON.parse(props.row?.imagesHouseType).join(',') : '',
  // 案例视频
  caseVideo: props.row.caseVideo ? JSON.parse(props.row?.caseVideo).join(',') : null,
  relationProjectId: props.row.relationProjectId || null,
  // 关联项目业主姓名
  customerName: props.row.customerName || null,
  // 关联项目地址
  address: props.row.address || null,
  // 案例设计费用
  designPrice: props.row.designPrice || null
})

const decorateWay = ref([]) // 装修方式
const modelList = ref([]) // 户型
const styleList = ref([]) // 装修风格

// 获取户型字典
const getHouseTypeDictionary = async() => {
  await dictType({ type: 'house_type' }).then((res: any) => {
    if (res.data) {
      modelList.value = res.data
    }
  })
}

// 获取装修风格字典
const getHouseStyleDictionary = async() => {
  await dictType({ type: 'house_style' }).then((res: any) => {
    if (res.data) {
      styleList.value = res.data
    }
  })
}

// 获取装修方式
const getDecorateWay = async () => {
  await dictType({ type: 'decorate_way' }).then((res: any) => {
    if (res.data) {
      decorateWay.value = res.data
    }
  })
}

const caseBaseInfoForms = ref<any>('')

// 保存案例基础信息表单
const saveBaseInfoForm = () => {
  const forms: any = unref(caseBaseInfoForms)
  forms.validate(async (valid: Boolean) => {
    if (valid) {
      const data = {
        ...props.row,
        ...caseBaseInfo.value
      }
      if (data['caseVideo']) {
        data['caseVideo'] = JSON.stringify(caseBaseInfo.value.caseVideo.split(','))
      }
      data['coverPic'] = JSON.stringify(caseBaseInfo.value.coverPic.split(','))
      data['imagesHouseType'] = JSON.stringify(caseBaseInfo.value.imagesHouseType.split(','))
      if (props.isEdit) {
        const res = await editCase(data)
        if (res.data) {
          hideDrawer()
          emit('getData')
          ElMessage.success('编辑成功')
        }
      } else if (props.isAdd) {
        const res = await addCase(data)
        if (res.data) {
          hideDrawer()
          emit('getData')
          ElMessage.success('新增成功')
        }
      } else if (props.isCopy) {
        data['id'] = null
        const res = await addCase(data)
        if (res.data) {
          hideDrawer()
          emit('getData')
          ElMessage.success('复制成功')
        }
      }
    }
  })
}

// 是否显示从项目导入图片弹窗
const isShowImagePicker = ref(false)
// 导入项目的图片类型 1封面图 2户型图
const importImgType = ref(-1)
// 导入的封面图
const importedCoverPic = ref('')
// 导入的户型图
const importedImagesHouseType = ref('')

// 从项目导入图片
const importImg = (type: any) => {
  if (!caseBaseInfo.value.relationProjectId) {
    ElMessage.warning('当前案例未关联项目！')
    return
  }
  importImgType.value = type
  isShowImagePicker.value = true
}

const imagePicked = (data: any) => {
  if (importImgType.value === 1) {
    caseBaseInfo.value.coverPic += (caseBaseInfo.value.coverPic ? ',' : '') + data.img.url
    importedCoverPic.value += (importedCoverPic.value ? ',' : '') + data.img.url
  } else if (importImgType.value === 2) {
    caseBaseInfo.value.imagesHouseType += (caseBaseInfo.value.imagesHouseType ? ',' : '') + data.img.url
    importedImagesHouseType.value += (importedImagesHouseType.value ? ',' : '') + data.img.url
  }
  importImgType.value = -1
}
</script>

<style lang="less" scoped>
.box-card {
  width: 100%;
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
