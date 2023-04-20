<template>
  <div class="home-service">
    <el-form v-model="service" label-width="12rem">
      <el-form-item label="服务名称">
        <el-input
          v-model="service.name"
          disabled
        />
      </el-form-item>
      <el-form-item label="AI报价">
        <el-select v-model="service.aiPrice" placeholder="请选择">
          <el-option
            v-for="item in AIoptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="服务相册">
        <el-button type="primary" @click="doBanner('add',{},null)">新增服务相册</el-button>
        <div class="banner">
            <div class="banner-item" v-if="service.serviceBanner && service.serviceBanner.length">
              <template v-for="item,index in service.serviceBanner" :key="index">
                  <el-card class="banner-item_card">
                    <el-image
                      fit="scale-down"
                      class="image"
                      preview-teleported
                      :src="$getUrl.getPicUrl(item.imgUrl, true, true)"
                      :preview-src-list="$getUrl.getPicUrl(item.imgUrl)"
                      style="width: 100%"
                    />
                    <div class="banner-item_main">
                      <div class="banner-item_title">
                          <span>服务相册名称：</span>
                          <span>{{ item.name || ''  }}</span>
                      </div>
                      <div class="banner-item_title">
                          <span>链接地址：</span>
                          <span>{{ item.title || '' }}</span>
                      </div>
                      <div class="bottom">
                        <el-button
                          type="text"
                          class="primary"
                          icon="edit"
                          @click="doBanner('edit',item,index)"
                        >编辑
                        </el-button>
                        <el-button
                          type="text"
                          class="danger"
                          icon="delete"
                          @click="doBanner('delete',item,index)"
                        >删除
                        </el-button>
                      </div>
                    </div>
                  </el-card>
              </template>
            </div>
            <el-empty v-else description="暂无服务相册"/>
        </div>
      </el-form-item>
      <el-form-item label="预估费用说明">
        <el-input
          v-model="service.estimateCostDes"
          placeholder="请输入预估费用说明"
          type="textarea"
          autosize
        />
      </el-form-item>
      <el-form-item label="预估费用">
        <estimateCost
          :estimate-cost="service.estimateCost"
          :current="service"
          @addItem="addEstimateCostItem"
          @editItem="editEstimateCostItem"
          @deleteItem="deleteEstimateCostItem"
        />
      </el-form-item>
      <el-form-item label="装修流程">
        <decoration-process :process-list="service.decorationProcess" />
      </el-form-item>
    </el-form>
    <!-- 操作服务相册 -->
    <el-dialog
      v-model="isShowdDialog"
      width="60rem"
      destroy-on-close
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="`${editBanner?'编辑':'新增'}服务相册`"
      @close="closeServiceBanner"
    >
      <el-form ref="formRef" :model="formBanner" :rules="serviceBannerRules" label-width="15rem">
        <el-form-item label="服务相册名称">
          <el-input v-model="formBanner.name" placeholder="服务相册名称"></el-input>
        </el-form-item>
        <el-form-item label="服务相册图片" prop="imgUrl">
          <uploadImage
            v-model="formBanner.imgUrl"
            :max-count="1"
            :is-edits="false"
          />
        </el-form-item>
        <el-form-item label="链接页面">
          <el-input v-model="formBanner.title" @click="showCms = true" placeholder="链接页面"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="padding: 2rem">
          <el-button type="primary" @click="saveServiceBanner">保存</el-button>
          <el-button @click="closeServiceBanner">取消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 链接页面 -->
     <chooseCms
      v-model="showCms"
      :city-operator-id="cityOperatorId"
      @getGeneralMaterial="getGeneralMaterial"
    />
  </div>
</template>

<script lang="ts" setup>
import DecorationProcess from '_c/HomeServiceManagement/decorationProcess.vue'
import { serviceBannerRules } from '_c/HomeServiceManagement/data'
import { fetch } from '_@/axios-config/axios'
import wsCache from '@/cache'
const props = defineProps<{
  modelValue: any,
}>()
const emit = defineEmits<{(e: 'update:modelValue', service: any): void
}>()
const title = ref('新增服务相册')
const isShowdDialog = ref(false)
const editBanner = ref(false)
const curIndex = ref<any>(null)
const curType = ref<any>('')
const showCms = ref(false)
const AIoptions = ref([])
const formBanner = ref({
  name:"",
  imgUrl:"",
  url:'',
  title:''
})
const cityOperatorId = ref(wsCache.get('cityOperator')?.id)
const formRef = ref(null)
const service = ref(props.modelValue ? JSON.parse(props.modelValue) : {
  name: '',
  aiPrice:'',
  serviceImages: '',
  serviceBanner: [],
  estimateCostDes: '',
  estimateCost: {
    questions: [],
    items: []
  },
  decorationProcess: []
} as any)
watch(() => service.value, (val) => {
  emit('update:modelValue', val)
}, {
  deep: true
})
onMounted(()=>{
  getAiSurvey()
})
// 新增预估费用项
const addEstimateCostItem = (type: number, data: any) => {
  if (type === 1) {
    service.value.estimateCost.questions.push(data)
  } else {
    service.value.estimateCost.items.push(data)
  }
}

// 编辑预估费用项
const editEstimateCostItem = (type: number, index: number, data: any) => {
  if (type === 1) {
    service.value.estimateCost.questions[index] = data
  } else {
    service.value.estimateCost.items[index] = data
  }
}

// 删除预估费用项
const deleteEstimateCostItem = (type: number, index: number) => {
  if (type === 1) {
    service.value.estimateCost.questions.splice(index, 1)
  } else {
    service.value.estimateCost.items.splice(index, 1)
  }
}

// 服务相册保存
const doBanner = (type:string,data:any,index:number) =>{
  switch (type) {
    case 'delete':
      service.value.serviceBanner.splice(index,1)
      break;
    default:
      formBanner.value = Object.assign({},data);
      curIndex.value = index;
      curType.value = type;
      editBanner.value = type == 'edit'?true:false
      isShowdDialog.value = true
      break;
  }
}
const closeServiceBanner = ()=>{
  formBanner.value = {
    name:"",
    imgUrl:"",
    url:'',
    title:''
  }
  curIndex.value = null;
  isShowdDialog.value = false;
}
const saveServiceBanner = () =>{
  const forms: any = unref(formRef)
    forms.validate(async (valid: Boolean) => {
      if (valid) {
        if(curType.value == 'add'){
          service.value.serviceBanner.push(formBanner.value);
        }
        if(curType.value == 'edit'){
          service.value.serviceBanner[curIndex.value] = formBanner.value;
        }
        closeServiceBanner();
      }
    })
}
const getGeneralMaterial = (val: any) => {
  formBanner.value.url = val.value ? val.value[0].id : ''
  formBanner.value.title = val.value ? val.value[0].title : ''
}


const getAiSurvey=async()=>{
  await fetch({
        url: `basic/standard/survey/project/list?size=999&current=1`,
        method:'get',
    }).then((res: any) => {
        if(res.code == '0'){
            AIoptions.value = res.data.records;
        }
    })
}
</script>

<style lang="less" scoped>
.home-service {
  width: 100%;
  .banner{
    margin-top: 1rem;
    border: 0.1rem solid #a8a8a8;
    width: 100%;
    min-height: 17rem;
    border-radius: .5rem;
    .banner-item{
      display: flex;
      flex-flow: row wrap;
      /deep/.el-card{
          margin: 2rem;
          box-shadow: 0px 0px 1rem rgba(0, 0, 0, .12);
          width: 25rem;
        .el-card__body{
          flex-direction: column;
          border:.1rem solid #e4e7ed;
          padding: 0;
          .image{
            height: 10rem;
            width: 100%;
            background: #f5f7fa;
          }
          .banner-item_main{
            padding: 1rem;
            width: 100%;
            box-sizing: border-box;
          }
        }
      }
    }
  }
}
</style>
