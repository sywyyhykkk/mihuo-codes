<template>
  <div>
    <login-new />
  </div>
  <!--login  -->
  <!--  <div class="login">-->
  <!--    <video :src="require('@/assets/video/video_Trim.mp4')"-->
  <!--           style="width: 100%;height: 100%;object-fit: cover;position: absolute;top: 0;left: 0;"-->
  <!--           autoplay="autoplay"-->
  <!--           playbackRate="1"-->
  <!--           loop="loop"-->
  <!--           muted="muted"></video>-->
  <!--    <div class="tops">-->
  <!--      <div class="top">-->
  <!--        <div class="top_left">-->
  <!--          <img :src="require('@/assets/img/login_logo.png')" />-->
  <!--        </div>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    &lt;!&ndash;    <router-view />&ndash;&gt;-->
  <!--    &lt;!&ndash;    <Logins :lregister="register" />&ndash;&gt;-->
  <!--    <div v-if="pageType === 0" class="main">-->
  <!--      <div class="login-title">-->
  <!--        <img :src="require('@/assets/video/logoNew.png')" class="login-logo" />-->
  <!--      </div>-->
  <!--      <LoginComponeNew-->
  <!--        v-model="ruleForm.username"-->
  <!--        :eidt-page="eidtPage"-->
  <!--        :eidt-page2="eidtPage2"-->
  <!--        :eidt-page-to-audit="eidtPageToAudit"-->
  <!--      />-->
  <!--      &lt;!&ndash;            <div class="mains">&ndash;&gt;-->
  <!--      &lt;!&ndash;              <div class="img" />&ndash;&gt;-->

  <!--      &lt;!&ndash;              <div class="forms">&ndash;&gt;-->
  <!--      &lt;!&ndash;                <LoginComponeV&ndash;&gt;-->
  <!--      &lt;!&ndash;                  v-if="!register"&ndash;&gt;-->
  <!--      &lt;!&ndash;                  :eidt-page="eidtPage"&ndash;&gt;-->
  <!--      &lt;!&ndash;                  :eidt-page2="eidtPage2"&ndash;&gt;-->
  <!--      &lt;!&ndash;                  :eidt-page-to-audit="eidtPageToAudit"&ndash;&gt;-->
  <!--      &lt;!&ndash;                  :jump-register="jumpRegister"&ndash;&gt;-->
  <!--      &lt;!&ndash;                  v-model="ruleForm.username"&ndash;&gt;-->
  <!--      &lt;!&ndash;                />&ndash;&gt;-->
  <!--      &lt;!&ndash;                <RegisterCompone&ndash;&gt;-->
  <!--      &lt;!&ndash;                  v-model="ruleForm.username"&ndash;&gt;-->
  <!--      &lt;!&ndash;                  v-if="register"&ndash;&gt;-->
  <!--      &lt;!&ndash;                  :eidtPage="eidtPage"&ndash;&gt;-->
  <!--      &lt;!&ndash;                  :jump-register="jumpRegister"&ndash;&gt;-->
  <!--      &lt;!&ndash;                />&ndash;&gt;-->
  <!--      &lt;!&ndash;              </div>&ndash;&gt;-->
  <!--      &lt;!&ndash;            </div>&ndash;&gt;-->
  <!--      &lt;!&ndash;      <FootersVue />&ndash;&gt;-->
  <!--    </div>-->
  <!--    <div v-if="pageType === 1 && register">-->
  <!--      <div class="mainTo">-->
  <!--        <div class="lgoinForm">-->
  <!--          &lt;!&ndash;          <div style="padding-top: 3rem">&ndash;&gt;-->
  <!--          &lt;!&ndash;            <el-steps :space="400" :active="activeType" finish-status="success" align-center>&ndash;&gt;-->
  <!--          &lt;!&ndash;              <el-step title="账号信息" />&ndash;&gt;-->
  <!--          &lt;!&ndash;              <el-step title="企业信息" />&ndash;&gt;-->
  <!--          &lt;!&ndash;              <el-step title="提交信息" />&ndash;&gt;-->
  <!--          &lt;!&ndash;            </el-steps>&ndash;&gt;-->
  <!--          &lt;!&ndash;          </div>&ndash;&gt;-->
  <!--          <div class="center-form">-->
  <!--            <el-form-->
  <!--              v-if="!nextType"-->
  <!--              ref="ruleForms"-->
  <!--              :model="ruleForm"-->
  <!--              :rules="rules"-->
  <!--              label-width="14rem"-->
  <!--              size="mini"-->
  <!--            >-->
  <!--              <div style="margin-bottom: 1rem;">-->
  <!--                <span>基本信息</span>-->
  <!--                <span class="promptInformation">（请如实填写以下信息，如发现弄虚作假，隐瞒真实情况，不予以审核通过）</span>-->
  <!--              </div>-->
  <!--              <el-row style="margin-bottom: -2rem">-->
  <!--                <el-col :span="10">-->
  <!--                  <el-form-item label="企业名称" prop="companyName">-->
  <!--                    <el-input-->
  <!--                      v-model="ruleForm.companyName"-->
  <!--                    />-->
  <!--                  </el-form-item>-->
  <!--                </el-col>-->
  <!--                <el-col :span="10" :offset="2">-->
  <!--                  <el-form-item label="企业简称" prop="companyShortName">-->
  <!--                    <el-input-->
  <!--                      v-model="ruleForm.companyShortName"-->
  <!--                    />-->
  <!--                  </el-form-item>-->
  <!--                </el-col>-->
  <!--              </el-row>-->
  <!--              <el-row style="margin-bottom: -2rem">-->
  <!--                <el-col :span="10">-->
  <!--                  <el-form-item label="法人姓名" prop="legalPerson">-->
  <!--                    <el-input-->
  <!--                      v-model="ruleForm.legalPerson"-->
  <!--                    />-->
  <!--                  </el-form-item>-->
  <!--                </el-col>-->
  <!--                <el-col :span="10" :offset="2">-->
  <!--                  <el-form-item label="企业规模" prop="companyScale">-->
  <!--                    <el-select-->
  <!--                      v-model="ruleForm.companyScale"-->
  <!--                      placeholder="请选择企业规模"-->
  <!--                    >-->
  <!--                      <el-option label="0~20人" value="0" />-->
  <!--                      <el-option label="20~50人" value="1" />-->
  <!--                      <el-option label="50~100人" value="2" />-->
  <!--                      <el-option label="100~500人" value="3" />-->
  <!--                      <el-option label="500~1000人" value="4" />-->
  <!--                      <el-option label="1000人以上" value="5" />-->
  <!--                    </el-select>-->
  <!--                  </el-form-item>-->
  <!--                </el-col>-->
  <!--              </el-row>-->
  <!--              <el-row style="margin-bottom: -2rem">-->
  <!--                <el-col :span="10">-->
  <!--                  <el-form-item label="智装用户" prop="wisdomNum">-->
  <!--                    <el-select-->
  <!--                      v-model="ruleForm.wisdomNum"-->
  <!--                      placeholder="是否是云智装、智装用户"-->
  <!--                    >-->
  <!--                      <el-option label="否" value="0" />-->
  <!--                      <el-option label="是" value="1" />-->
  <!--                    </el-select>-->
  <!--                  </el-form-item>-->
  <!--                </el-col>-->
  <!--                <el-col :span="10" :offset="2">-->
  <!--                  <el-form-item label="法人电话" prop="legalPhone">-->
  <!--                    <el-input-->
  <!--                      v-model="ruleForm.legalPhone"-->
  <!--                    />-->
  <!--                  </el-form-item>-->
  <!--                </el-col>-->
  <!--              </el-row>-->
  <!--              <el-row style="margin-bottom: -2rem">-->
  <!--                <el-col :span="10">-->
  <!--                  <el-form-item label="联系邮箱">-->
  <!--                    <el-input-->
  <!--                      v-model="ruleForm.contactEmail"-->
  <!--                    />-->
  <!--                  </el-form-item>-->
  <!--                </el-col>-->
  <!--                <el-col :span="10" :offset="2">-->
  <!--                  <el-form-item label="组织机构代码" prop="socialCreditNo">-->
  <!--                    <el-input-->
  <!--                      v-model="ruleForm.socialCreditNo"-->
  <!--                    />-->
  <!--                  </el-form-item>-->
  <!--                </el-col>-->
  <!--              </el-row>-->
  <!--              <el-row style="margin-bottom: -2rem;margin-top: -1.5rem;">-->
  <!--                <el-col :span="22">-->
  <!--                  <el-form-item label="公司所在地" prop="completeAddress">-->

  <!--                    <el-select-->
  <!--                      v-model="ruleForm.provinceCode"-->
  <!--                      placeholder="==请选择省份=="-->
  <!--                      style="width: calc(33.3% - 2rem)"-->
  <!--                    >-->
  <!--                      <el-option-->
  <!--                        v-for="item in provinceList"-->
  <!--                        :key="item.id"-->
  <!--                        :label="item.name"-->
  <!--                        :value="item.agencyId"-->
  <!--                      />-->
  <!--                    </el-select>-->
  <!--                    <span style="width: 2rem;text-align: center;">-</span>-->
  <!--                    <el-cascader-->
  <!--                      style="width: calc(33.3% - 2rem)"-->
  <!--                      v-model="ruleForm.cityList"-->
  <!--                      :options="regionTree"-->
  <!--                      :props="props"-->
  <!--                      placeholder="==请选择市(区/县）=="-->
  <!--                    />-->
  <!--                    <span style="width: 2rem;text-align: center">-</span>-->
  <!--                    <el-input-->
  <!--                      v-model="ruleForm.completeAddress"-->
  <!--                      style="width: 33.3%"-->
  <!--                      placeholder="详细地址"-->
  <!--                    />-->
  <!--                  </el-form-item>-->
  <!--                </el-col>-->
  <!--              </el-row>-->
  <!--              <div style="margin: 2.2rem 0 3rem 0">-->
  <!--                <span>企业证件</span>-->
  <!--                <span class="promptInformation">（请您上传清晰\无污物\完整的证件原件照片或者彩色扫描件）</span>-->
  <!--              </div>-->
  <!--              <el-row style="margin-left: 100px;margin-bottom: 3rem">-->
  <!--                <el-col :span="6">-->
  <!--                  <div style="margin-bottom: 1rem">-->
  <!--                    <span style="color: red">*</span>-->
  <!--                    <span style="font-size: 10px"> 企业logo </span>-->
  <!--                  </div>-->
  <!--                  <uploadImage-->
  <!--                    v-model="ruleForm.companyLogo"-->
  <!--                    :maxCount="1"-->
  <!--                    :is-edits="isEdit"-->
  <!--                  />-->
  <!--                </el-col>-->
  <!--                <el-col :span="6">-->
  <!--                  <div style="margin-bottom: 1rem">-->
  <!--                    <span style="color: red">*</span>-->
  <!--                    <span style="font-size: 10px"> 营业执照 </span>-->
  <!--                  </div>-->
  <!--                  <uploadImage-->
  <!--                    v-model="ruleForm.certificateImge"-->
  <!--                    :maxCount="1"-->
  <!--                    :is-edits="isEdit"-->
  <!--                  />-->
  <!--                </el-col>-->
  <!--                <el-col :span="6">-->
  <!--                  <div style="margin-bottom: 1rem">-->
  <!--                    <span style="color: red">*</span>-->
  <!--                    <span style="font-size: 10px"> 法人身份证正面 </span>-->
  <!--                  </div>-->
  <!--                  <uploadImage-->
  <!--                    v-model="ruleForm.legalIdcardFront"-->
  <!--                    :maxCount="1"-->
  <!--                    :is-edits="isEdit"-->
  <!--                  />-->
  <!--                </el-col>-->
  <!--                <el-col :span="6">-->
  <!--                  <div style="margin-bottom: 1rem">-->
  <!--                    <span style="color: red">*</span>-->
  <!--                    <span style="font-size: 10px"> 法人身份证反面 </span>-->
  <!--                  </div>-->
  <!--                  <uploadImage-->
  <!--                    v-model="ruleForm.legalIdcardBack"-->
  <!--                    :maxCount="1"-->
  <!--                    :is-edits="isEdit"-->
  <!--                  />-->
  <!--                </el-col>-->
  <!--              </el-row>-->
  <!--            </el-form>-->
  <!--          </div>-->
  <!--          <div v-if="nextType" style="text-align: center;margin-top: 12rem">-->
  <!--            <el-icon size="67px" color="#2DA44E">-->
  <!--              <success-filled />-->
  <!--            </el-icon>-->
  <!--            <div style="font-size: 20px; color: #2DA44E; line-height: 30px">-->
  <!--              提交成功-->
  <!--            </div>-->
  <!--            <div style="color: #999999; line-height: 30px">-->
  <!--              平台审核中,审核通过后,将通过短信通知您!-->
  <!--            </div>-->
  <!--          </div>-->
  <!--          <div class="bottom-button">-->
  <!--            <div class="next" @click="resetForm()">-->
  <!--              {{ nextType ? '登录账号' : '注册企业' }}-->
  <!--            </div>-->
  <!--          </div>-->

  <!--        </div>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    &lt;!&ndash; <FootersVue /> &ndash;&gt;-->
  <!--  </div>-->
</template>
<script lang="ts">
import FootersVue from '_c/form/footer/Footers.vue'
import { defineComponent, ref, reactive, toRefs, watch, onMounted } from 'vue'
import LoginComponeV from '_c/formEnterprise/login/LoginComponeV.vue'
import RegisterCompone from '_c/formEnterprise/register/RegisterCompone.vue'
// import UploadImg from './uploadImg.vue'
import uploadFile from '_c/UploadFile/uploadImage.vue'
import { fetch } from '_@/axios-config/axios'
import { ElMessage } from 'element-plus'
import wsCache from '@/cache'
import meteor from './start'

export default defineComponent({
  components: { FootersVue, LoginComponeV, RegisterCompone, uploadFile },
  setup() {
    const register = ref<boolean>(false)
    const pageType = ref<number>(0)
    const ruleForms = ref<any>('')
    const state = reactive<any>({
      stepTitle: [
        {
          name: '账号信息'
        },
        {
          name: '企业信息'
        },
        {
          name: '提交信息'
        }
      ],
      activeType: 1,
      nextType: false,
      isEdit: false,
      ruleForm: {
        username: '' as any,
        areaCode: '',
        auditRemark: '',
        auditStatus: 0,
        auditTime: '',
        belongCityId: 0,
        certificateImge: '',
        cityCode: '',
        companyId: 0,
        companyLogo: '',
        companyName: '',
        companyScale: '',
        companyShortName: '',
        completeAddress: '',
        contactEmail: '',
        contactName: '',
        contactTel: '',
        createBy: 0,
        createTime: '',
        delFlag: '',
        detaiAddress: '',
        legalIdcardBack: '',
        legalIdcardFront: '',
        legalPerson: '',
        legalPhone: '',
        principalPhone: '',
        provinceCode: '',
        registerAddress: '',
        socialCreditNo: '',
        updateBy: 0,
        updateTime: '',
        wisdomNum: '',
        cityList: []
      },
      provinceList: [],
      regionTree: [],
      provinceCode2: '',
      companyType: 'add'
    })
    const rules = reactive({
      companyName: [
        { required: true, message: '请输入企业名称', trigger: 'change' }
      ],
      companyScale: [
        { required: true, message: '请选择企业规模', trigger: 'change' }
      ],
      companyShortName: [
        { required: true, message: '请输入企业简称', trigger: 'change' }
      ],
      completeAddress: [
        { required: true, message: '请输入详细地址', trigger: 'change' }
      ],
      legalPerson: [
        { required: true, message: '请输入法人姓名', trigger: 'change' }
      ],
      legalPhone: [
        { required: true, message: '请输入法人电话', trigger: 'change' }
      ],
      cityCode: [
        { required: true, message: '请选择所属城市', trigger: 'change' }
      ],
      areaCode: [
        { required: true, message: '请选择所属区/县', trigger: 'change' }
      ],
      provinceCode: [
        { required: true, message: '请选择所属省份', trigger: 'change' }
      ],
      cityList: [
        { required: true, message: '请选择所属区/县', trigger: 'change' }
      ],
      wisdomNum: [
        {
          required: true,
          message: '请选择是否是智装、云智装用户',
          trigger: 'change'
        }
      ],
      socialCreditNo: [
        {
          required: true,
          message: '请输入企业组织机构代码',
          trigger: 'change'
        }
      ]
    })
    // 获取省份信息
    const getProvince = async () => {
      await fetch({ url: '/basic/region/province', method: 'get' }).then(
        (res: any) => {
          state.provinceList = res.data
        }
      )
    }
    // 注册时切换页面到填写企业信息
    const eidtPage = () => {
      // ruleForms.value.resetFields()
      console.log(state.ruleForm)
      pageType.value = 1
      register.value = true
      state.nextType = false
      getProvince()
    }
    // 审核失败
    const eidtPage2 = () => {
      // ruleForms.value.resetFields()
      pageType.value = 1
      state.activeType = 2
      register.value = true
      state.companyType = 'eidt'
      state.isEdit = true
      state.ruleForm.companyId = wsCache.get('companys')[0].companyId
      getProvince()
    }
    // 登录时切换页面到等待审核页
    const eidtPageToAudit = () => {
      console.log('执行了')
      pageType.value = 1
      register.value = true
      state.nextType = true
      state.activeType = 3
    }
    const jumpRegister = () => {
      if (register.value) {
        register.value = false
        pageType.value = 0
      } else {
        register.value = true
        pageType.value = 0
      }
    }
    const checked = ref<boolean>(false)
    const radio = ref<number>(2)
    const addClass = (x: number) => {
      current.value = x
      console.log('x :>> ', x)
    }
    const current = ref<number>(0)
    const formClass = reactive(['登录账号', '验证码登录'])
    const resetForm = () => {
      if (!state.nextType) {
        console.log(state.ruleForm)
        ruleForms.value.validate((valid: any) => {
          if (valid) {
            getAreaName({
              areaCode: state.ruleForm.areaCode,
              cityCode: state.ruleForm.cityCode,
              provinceCode: state.ruleForm.provinceCode
            })
          }
        })
      } else {
        jumpRegister()
      }
    }
    // 获取城市信息
    const getRegionTree = async (par: any) => {
      await fetch({
        url: 'basic/region/regionTree/' + par,
        method: 'get'
      }).then((res: any) => {
        res.data.forEach((r: any) => {
          r.label = r.name
          r.value = r.agencyId
          r.children ? r.children.forEach((e: any) => {
            e.label = e.name
            e.value = e.agencyId
          }) : ''
        })
        state.regionTree = res.data[0].children
      })
    }
    // const uploadUrl = (title: any, imgName: any) => {
    //   switch (title) {
    //     case '营业执照' :
    //       state.ruleForm.certificateImge = imgName
    //       break
    //     case '法人身份证正面' :
    //       state.ruleForm.legalIdcardFront = imgName
    //       break
    //     case '法人身份证反面' :
    //       state.ruleForm.legalIdcardBack = imgName
    //       break
    //     case '企业logo' :
    //       state.ruleForm.companyLogo = imgName
    //       break
    //   }
    //   console.log(title, imgName)
    // }
    const getAreaName = async (dataObj: any) => {
      await fetch({
        url: '/basic/region/names',
        method: 'post',
        data: dataObj
      }).then((res: any) => {
        state.ruleForm.areaInfo = res.data.provinceCode + res.data.cityCode + res.data.areaCode + state.ruleForm.completeAddress
        addCompanyForm()
      })
    }

    const addCompanyForm = async () => {
      if (
        !state.ruleForm.certificateImge ||
        Object.keys(state.ruleForm.certificateImge).length === 0
      ) {
        ElMessage.error('营业执照没有上传成功')
        return
      }
      if (
        !state.ruleForm.legalIdcardFront ||
        Object.keys(state.ruleForm.legalIdcardFront).length === 0
      ) {
        ElMessage.error('法人身份证正面照片没有上传成功')
        return
      }
      if (
        !state.ruleForm.legalIdcardBack ||
        Object.keys(state.ruleForm.legalIdcardBack).length === 0
      ) {
        ElMessage.error('法人身份证反面照片没有上传成功')
        return
      }
      if (
        !state.ruleForm.companyLogo ||
        Object.keys(state.ruleForm.companyLogo).length === 0
      ) {
        ElMessage.error('企业logo没有上传成功')
        return
      }

      if (state.companyType === 'add') {
        await fetch({
          url: '/admin/company',
          method: 'post',
          data: state.ruleForm
        }).then((res: any) => {
          if (res.data) {
            ElMessage.success('企业信息填写成功，请等待审核')
            state.activeType = 3
            state.nextType = true
          } else {
            ElMessage.error('企业信息填写失败')
          }
        })
      } else if (state.companyType === 'eidt') {
        state.ruleForm.auditStatus = 0
        await fetch({
          url: '/admin/company',
          method: 'put',
          data: state.ruleForm
        }).then((res: any) => {
          if (res.data) {
            ElMessage.success('企业信息修改成功，请等待审核')
            state.activeType = 3
            state.nextType = true
          } else {
            ElMessage.error('企业信息修改失败')
          }
        })
      }
    }
    watch(
      [state.ruleForm, state.cityList],
      (values) => {
        if (state.provinceCode2 !== state.ruleForm.provinceCode) {
          state.provinceCode2 = state.ruleForm.provinceCode
          getRegionTree(state.ruleForm.provinceCode)
        }
        state.ruleForm.cityCode = state.ruleForm.cityList[0]
        // state.ruleForm.cityCode = state.ruleForm.cityList[0]
        state.ruleForm.areaCode = state.ruleForm.cityList[1]
        // console.log(state.ruleForm.cityList[0], '打印')
      },
      {
        immediate: true, // 是否初始化立即执行一次, 默认是false
        deep: true // 是否是深度监视, 默认是false
      }
    )
    onMounted(() => {
    })

    return {
      pageType,
      register,
      rules,
      jumpRegister,
      current,
      formClass,
      addClass,
      checked,
      radio,
      ruleForms,
      eidtPage,
      eidtPage2,
      resetForm,
      getProvince,
      getRegionTree,
      // uploadUrl,
      addCompanyForm,
      eidtPageToAudit,
      ...toRefs(state)
    }
  }
})
// 流星雨部分
</script>
<style lang="less" scope>
.login-title {
  position: absolute;
  left: 4rem;
  top: 3rem;

  .login-logo {
    width: 9.5rem;
    height: 4rem;
  }
}

body {
  background: #000;
}

.addClass {
  border-bottom: 2px solid #ff5d35;
  color: #ff5d35 !important;
}

</style>
