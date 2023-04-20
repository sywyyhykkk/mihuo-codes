<template>
  <div>
    <el-dialog
      v-model="innerVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="handleClose"
      title="链接"
      append-to-body
    >
      <el-form
        ref="ruleForms"
        label-width="9rem"
        style="width: 100%"
        :rules="rules"
      >
        <el-form-item label="链接名称">
          <el-input v-model="newLink.form.name" placeholder="请输入链接名称" />
        </el-form-item>
        <el-form-item label="内容类型">
          <el-radio-group v-model="newLink.form.linkType">
            <el-radio label="0">文本</el-radio>
            <el-radio label="1">素材</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="newLink.form.linkType == 0" label="文本内容">
          <el-input
            v-model="newLink.form.textContent"
            type="text"
            placeholder="请输入文本内容"
          />
        </el-form-item>
        <el-form-item v-if="newLink.form.linkType == 1" label="选取素材">
          <ul class="el-upload-list el-upload-list--picture-card">
            <li
              v-for="(item, index) in newLink.form.linkPics"
              :key="index"
              tabindex="0"
              class="el-upload-list__item is-success"
            >
              <img
                style="width: 100%; height: 100%"
                :src="$getUrl.getPicUrl(item) "
              >
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-delete"
                  @click="removeData('移除素材',index)"
                ><el-icon><delete /></el-icon></span>
              </span>
            </li>
          </ul>
          <div
            class="el-upload el-upload--picture-card"
            @click="addMaterial('images', 1)"
          >
            <el-icon>
              <plus />
            </el-icon>
          </div>
        </el-form-item>
        <el-form-item label="app页面">
          <el-select
            v-model="newLink.form.appPage"
            placeholder="请选择要跳转的页面"
            @change="handelChange"
          >
            <el-option
              v-for="pname in appPages"
              :key="pname"
              :label="pname.name"
              :value="pname.path"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="newLink.form.appPage === appPages[10].path"
          label="活动页面"
        >
          <el-select v-model="newLink.form.link" placeholder="请选择活动页面">
            <el-option
              v-for="activity in appActivityPages"
              :key="activity"
              :label="activity.title"
              :value="activity.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="newLink.form.appPage === appPages[2].path || newLink.form.appPage === appPages[3].path || newLink.form.appPage === appPages[8].path"
          label="链接分类"
        >
          <el-cascader
            v-model="newLink.form.link"
            placeholder="请选择要关联的分类"
            :options="productCateOptions"
            :props=" { children: 'children',label: 'name', value: 'treeCode', checkStrictly:true}"
            @change="handleChangeSelected"
          />
        </el-form-item>
        <el-form-item
          v-if="newLink.form.appPage === appPages[3].path"
          label="链接品牌"
        >
          <el-select
            v-model="newLink.form.linkBrand"
            filterable
            placeholder="请选择要关联的品牌"
          >
            <el-option
              v-for="(item, index) in brandOptions"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="newLink.form.appPage === appPages[0].path"
          label="链接商品"
        >
          <ul class="el-upload-list el-upload-list--picture-card">
            <li
              v-for="(item, index) in newLink.form.linkItem"
              :key="index"
              tabindex="0"
              class="el-upload-list__item is-success"
            >
              <img
                style="width: 100%; height: 100%"
                :src="$getUrl.getPicUrl(item.coverPic)"
              >
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-delete"
                  @click="removeData('删除商品',index)"
                ><el-icon><delete /></el-icon></span>
              </span>
            </li>
          </ul>
          <div
            class="el-upload el-upload--picture-card"
            @click="handelAdd('选择商品')"
          >
            <el-icon>
              <plus />
            </el-icon>
          </div>
        </el-form-item>
        <el-form-item
          v-if="newLink.form.appPage === appPages[1].path"
          label="链接文案"
        >
          <ul class="el-upload-list el-upload-list--picture-card">
            <li
              v-for="(item, index) in newLink.form.linkCms"
              :key="index"
              tabindex="0"
              class="el-upload-list__item is-success"
            >
              <img
                style="width: 100%; height: 100%"
                :src=" $getUrl.getPicUrl(item.facePic)"
              >
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-delete"
                  @click="removeData('删除文案',index)"
                ><el-icon>
                  <delete />
                </el-icon>
                </span>
              </span>
            </li>
          </ul>
          <div class="el-upload el-upload--picture-card" @click="handelAdd('选择文案')">
            <el-icon>
              <plus />
            </el-icon>
          </div>
        </el-form-item>
        <el-form-item
          v-if="newLink.form.appPage === appPages[6].path"
          label="链接案例"
        >
          <ul class="el-upload-list el-upload-list--picture-card">
            <li
              v-for="(item, index) in newLink.form.linkItem"
              :key="index"
              tabindex="0"
              class="el-upload-list__item is-success"
            >
              <img
                style="width: 100%; height: 100%"
                :src=" $getUrl.getPicUrl(item.coverPic)"
              >
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-delete"
                  @click="removeData('删除案列',index)"
                ><el-icon>
                  <delete />
                </el-icon>
                </span>
              </span>
            </li>
          </ul>
          <div class="el-upload el-upload--picture-card" @click="handelAdd('选择案例')">
            <el-icon>
              <plus />
            </el-icon>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="addLinkMaterial">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <ChooseGeneralMaterial
      v-model="showMaterial"
      :title="materialType"
      platform-type="3"
      @getGeneralMaterial="getGeneralMaterial"
    />
    <ChooseProduct
      v-model="showProduct"
      :single="single"
      @getGeneralMaterial="getGeneralMaterial"
    />
    <ChooseCms
      v-model="showCms"
      :city-operator-id="+cityOperatorId"
      @getGeneralMaterial="getGeneralMaterial"
    />
    <ChooseCase
      v-model="showCase"
      @getGeneralMaterial="getGeneralMaterial"
    />
  </div>
</template>

<script lang="ts" setup>
import { reactive, watchEffect, defineEmits, defineProps, ref, markRaw } from 'vue'
import { getGuid } from '_c/util/utils'
import wsCache from '@/cache'
import { fetch } from '_@/axios-config/axios'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  linkData: {
    type: Object,
    default: {}
  }
})
const emit = defineEmits(['update:modelValue', 'update:linkData'])
const innerVisible = ref<boolean>(false)
const ruleForms = ref<any>('')
const cityOperatorId = ref(wsCache.get('cityOperator')?.id)
// 注意appPages数组的顺序不要改
const appPages = markRaw([
  { name: '客户端-商品详情', path: '/pages-mall/productDetail/productDetail' },
  { name: '客户端-文案详情', path: '/pages/home/article' },
  { name: '客户端-分类页面', path: '/pages/category/category' },
  { name: '客户端-分类页面-关联品牌', path: '/pages/category/category?brandId=' },
  { name: '服务端-注册页面', path: '/pages-user/register' },
  { name: '服务端-找人页面', path: '/pages/home/morePeople' },
  { name: '服务端-找活页面', path: '/pages/home/moreWork' },
  {
    name: '客户端-装修案例',
    path: '/pages-common/case/design/details'
  },
  { name: '客户端-分类列表', path: '/pages-mall/cateList/cateList' },
  { name: '客户端-品牌专区', path: '/pages-common/brandZone/brandZone' },
  {
    name: '客户端-活动报名',
    path: '/pages-mine/mihuoActivityPoster/mihuoActivityPoster'
  }
])
const newLink = reactive({ form: {} as any })
const materialType = ref(0)
const showMaterial = ref(false)
const showCms = ref(false)
const showCase = ref(false)
const single = ref(false)
const showProduct = ref(false)
const showStatus = ref<string>('')
const productCateOptions = ref<any>([])
const brandOptions = ref<any[]>([])
const rules = reactive({
  name: [{ required: true, message: '请输入链接名', trigger: 'blur' }]
})

// 素材添加到链接
const addMaterial = (mtype: any, titleText = 0) => {
  materialType.value = titleText
  showMaterial.value = true
  showStatus.value = '选择素材'
}

// 移除链接
const removeData = (val: string, index: number) => {
  switch (val) {
    case '删除商品':
      newLink.form.linkItem.splice(index, 1)
      break
    case '删除案列':
      newLink.form.linkItem.splice(index, 1)
      break
    case '删除文案':
      newLink.form.linkCms.splice(index, 1)
      break
    case '移除素材':
      newLink.form.linkPics.splice(index, 1)
      break
  }
}
const handelAdd = (val: string) => {
  switch (val) {
    case '选择商品':
      single.value = true
      showProduct.value = true
      showStatus.value = '选择商品'
      break
    case '选择文案':
      single.value = true
      showCms.value = true
      showStatus.value = '选择文案'
      break
    case '选择案例':
      showCase.value = true
      single.value = true
      showStatus.value = '选择案例'
      break
  }
}

const handelChange = (val: any) => {
  newLink.form.linkItem = []
}
const getGeneralMaterial = (data: any) => {
  switch (showStatus.value) {
    case '选择素材':
      newLink.form.linkPics = data.value
      break
    case '选择商品':
      console.log(data)
      // newLink.form.
      const productData = {
        coverPic: data.value[0].coverImg,
        id: data.value[0].id,
        name: data.value[0].name
      }
      newLink.form.linkItem = [productData]
      break
    case '选择文案':
      newLink.form.linkCms = newLink.form.linkCms ? newLink.form.linkCms.concat(data.value) : data.value
      break
    case '选择案例':
      console.log(data)
      const caseData = {
        coverPic: data.coverPic.split(',').length > 0 ? data.coverPic.split(',')[0] : '',
        id: data.id,
        name: data.name
      }
      newLink.form.linkItem = [caseData]
      break
  }
}

// 选择关联分类
const handleChangeSelected = (val: any) => {
  newLink.form.link = val?.length > 0 ? val[val?.length - 1] : ''
}

// 确定按钮事件
const addLinkMaterial = () => {
  emit('update:linkData', newLink.form)
  handleClose()
}

const handleClose = () => {
  innerVisible.value = false
  emit('update:modelValue', false)
}

const productcategoryPlat = async () => {
  await fetch({
    url: `/mall/platformcategory/tree`,
    method: 'get'
  }).then((res: any) => {
    productCateOptions.value = res.data
  })
}

// 获取平台品牌
const getBrandData = async () => {
  await fetch({
    url: '/mall/brand/page',
    method: 'get',
    params: {
      size: 999
    }
  }).then((res: any) => {
    brandOptions.value = res.data.records
  })
}

onMounted(() => {
  productcategoryPlat()
  getBrandData()
  getAppActivity()
})
const appActivityPages = ref([])
// 获取活动列表
const getAppActivity = async () => {
  await fetch({
    url: `/basic/basicevents/page`,
    method: 'get'
  }).then((res) => {
    appActivityPages.value = res.data.records
  })
}

watchEffect(() => {
  innerVisible.value = props.modelValue
  newLink.form = props.linkData
})

</script>

<style scoped>

</style>
