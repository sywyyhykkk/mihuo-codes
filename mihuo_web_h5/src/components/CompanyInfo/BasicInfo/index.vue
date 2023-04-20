<template>
  <div v-loading="loading" class="container">
    <div class="main">
      <el-form
        :label-position="labelPosition"
        label-width="10rem"
        :model="formData.val"
        size="small"
        disabled
        class="flex_form_item"
      >
        <el-form-item
          label="企业logo"
          prop="name"
          class="textarea"
        >
          <!-- <el-image
                        preview-teleported
                        style="height: 80px; min-width:80px; border-radius: 5px"
                        lazy
                        :src="formData.val.companyLogo"
                        :preview-src-list="[formData.val.companyLogo]"
                        fit="cover"
                    /> -->
          <el-image
            preview-teleported
            style="height: 80px; min-width:80px; border-radius: 5px"
            lazy
            :src="$getUrl.getPicUrl(formData.val.companyLogo, true)"
            :preview-src-list="$getUrl.getPicUrl(formData.val.companyLogo)"
          />
        </el-form-item>
        <el-form-item label="企业名称">
          <el-input v-model="formData.val.companyName" />
        </el-form-item>
        <el-form-item label="企业简称">
          <el-input v-model="formData.val.companyShortName" />
        </el-form-item>
        <el-form-item label="企业规模">
          <el-input v-model="formData.val.companyScale_" />
        </el-form-item>
        <el-form-item label="联系邮箱">
          <el-input v-model="formData.val.contactEmail" />
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="formData.val.contactName" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="formData.val.contactTel" />
        </el-form-item>
        <el-form-item label="公司所在地" class="textarea">
          <el-input v-model="formData.val.address" />
        </el-form-item>
        <!--        <el-form-item label="企业邀请码">-->
        <!--          <el-input v-model="formData.val.inviteCode" />-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="二维码">-->
        <!--          <Qrcode-->
        <!--            :text="getQRCode" :width="200"-->
        <!--          />-->
        <!--        </el-form-item>-->
      </el-form>
      <div class="button">
        <el-button
          type="primary"
          :icon="EditPen"
          @click="edit"
        >修改</el-button>
      </div>
    </div>
    <Dialog />
  </div>
</template>

<script lang='ts'>
import { defineComponent, inject, onMounted, provide, reactive, ref, computed } from 'vue'
import { EditPen } from '@element-plus/icons-vue'
import { formFiled } from './FormSet'
import Dialog from '../Dialog.vue'
import { updataCompany } from '_@/api/companyInfo'
import { ElMessage } from 'element-plus'
import { fetch } from '_@/axios-config/axios'
import Qrcode from '_c/Qrcode/index.vue'
import wsCache from '@/cache'

export default defineComponent({
  components: {
    Dialog,
    Qrcode
  },
  setup(props:any, { emit }) {
    // form设定
    const { formSetting, formRules } = formFiled
    const loadingBtn = ref<boolean>(false)
    provide('formSetting', formSetting)
    provide('formRules', formRules)
    provide('loadingBtn', loadingBtn)
    const enumObj = {
      companyScale: [
        { text: '0~20人', id: '0' },
        { text: '20~50人', id: '1' },
        { text: '50~100人', id: '2' },
        { text: '100~500人', id: '3' },
        { text: '500~1000人', id: '4' },
        { text: '1000人以上', id: '5' }
      ]
    } as any
    provide('enumObj', enumObj)
    // 弹出框
    const dialogVisible = ref(false)
    const pageTitle = ref('编辑')
    const labelPosition = inject('labelPosition')
    const formData = reactive({
      val: {} as any
    }as any)
    const formEdit = reactive({
      val: {}
    }as any)
    provide('formData', formEdit)
    provide('dialogVisible', dialogVisible)
    provide('pageTitle', pageTitle)
    const loading = ref<boolean>(false)
    const url:any = inject('url')
    const edit = () => {
      pageTitle.value = '修改基本信息'
      formEdit.val = Object.assign({}, formData.val)
      formEdit.val.provinceCode_ = formData.val.provinceCode
      formEdit.val.cityCode_ = formData.val.cityCode
      formEdit.val.areaCode_ = formData.val.areaCode
      dialogVisible.value = true
    }

    const getQRCode = computed(() => {
      const obj = {
        companyId: formData.val.companyId,
        companyInviteCode: formData.val.inviteCode,
        companyName: formData.val.companyName
      }
      return JSON.stringify(obj)
    })

    const getTypeName = (code:string, list:any) => {
      let name = ''
      code = '' + code
      if (code) {
        if (list && list.length > 0) {
          list.some((val:any) => {
            if (val.id == code) {
              name = val.text
              return true
            }
          })
        }
      }
      return name
    }
    const save = () => {
      loadingBtn.value = true
      updataCompany(formEdit.val).then((res:any) => {
        if (res.code == '0') {
          ElMessage.success('更新成功')
          dialogVisible.value = false
          getCompanyData()
        }
      }).finally(() => {
        loadingBtn.value = false
      })
    }
    provide('save', save)
    const getCompanyData = async() => {
      loading.value = true
      const res:any = await fetch({ url: '/admin/company/infos/basic', method: 'get' }).then((res:any) => {
        if (res.code == '0') {
          formData.val = res.data
          url.value = res.data
          formData.val.companyScale_ = getTypeName(formData.val.companyScale, enumObj.companyScale)
          formData.val.provinceCode = parseInt(formData.val.provinceCode)
          formData.val.cityCode = parseInt(formData.val.cityCode)
          formData.val.areaCode = parseInt(formData.val.areaCode)
          addressDetail()
        }
      }).finally(() => {
        loading.value = false
      })
    }
    const addressDetail = async () => {
      const params = {
        provinceCode: formData.val.provinceCode,
        cityCode: formData.val.cityCode,
        areaCode: formData.val.areaCode
      }
      const res:any = await fetch({ url: '/basic/region/names', method: 'post', data: params })
      if (res.code == '0') {
        formData.val.address = (res.data?.provinceCode||'') + (res.data?.cityCode || '') + 
        (res.data?.areaCode||'') + (formData.val?.completeAddress || '')
      }
    }
    const company:any = ref({})
    onMounted(async() => {
      if (sessionStorage.getItem('companys')) {
        const obj = JSON.parse(sessionStorage.getItem('companys') || '')
        company.value = JSON.parse(obj.v)[0]
      }
      getCompanyData()
    })
    return {
      labelPosition,
      formData,
      formEdit,
      dialogVisible,
      loadingBtn,
      loading,
      pageTitle,
      company,
      EditPen,
      getQRCode,
      getCompanyData,
      edit,
      save,
      getTypeName
    }
  }
})
</script>

<style scoped lang="less">
.main{
    display: flex;
    justify-content: space-between;
    .button{
        margin-top: 20px;
    }
    .flex_form_item{
        width: 78rem;
        display: flex;
        justify-content: space-between;
        flex-flow: row wrap;
        /deep/.el-form-item{
        margin: 0 !important;
        width: calc(50% - 10px);
        margin-top: 1rem !important;
        &:first-child{
            margin-top: 2rem !important;
        }
        .el-form-item__label{
            color: #909399;
            font-size: 1.2rem;
            margin-bottom: 0;
        }
        .el-form-item__content{
            .el-input{
                // width: 380px;
                .el-input__inner{
                    color: #303133;
                    border: none !important;
                    padding: 0 .9rem;
                    font-size: 1.4rem;
                    cursor: default;
                }
            }
        }
        }
        .textarea{
            width: 100%;
            .el-input{
                width: 100%;
            }
        }
    }
}
</style>
