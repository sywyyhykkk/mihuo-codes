<template>
  <!--login  -->
  <div class="login">
    <div class="tops">
      <div class="top">
        <div class="top_left">
          <img :src="require('@/assets/img/logo-mh.png')">
          <span v-if="!register" class="account">登录账号</span>
          <span v-if="register" class="account">注册账号</span>
        </div>
        <div v-if="register" class="top_right" @click="jumpRegister">
          已有账号？<span class="r">立即登录</span>
        </div>
      </div>
    </div>
    <!--    <router-view />-->
    <!--    <Logins :lregister="register" />-->
    <div v-if="pageType === 0" class="main">
      <div class="mains">
        <div class="img" />
        <div class="forms">
          <LoginComponeV
            v-if="!register"
            v-model="ruleForm.username"
            :eidt-page="eidtPage"
            :eidt-page2="eidtPage2"
            :eidt-page-to-audit="eidtPageToAudit"
            :jump-register="jumpRegister"
          />
          <RegisterCompone
            v-if="register"
            v-model="ruleForm.username"
            :eidt-page="eidtPage"
          />
        </div>
      </div>
    </div>
    <div v-show="pageType === 1 && register">
      <div class="mainTo">
        <div class="titleTop" />

        <!--        <div class="stepsStype">-->
        <!--          <el-steps :space="400" :active="activeType" finish-status="success" align-center>-->
        <!--            <el-step title="账号信息" />-->
        <!--            <el-step title="企业信息" />-->
        <!--            <el-step title="提交信息" />-->
        <!--          </el-steps>-->
        <div class="my_step">
          <div v-for="(item, index) in stepTitle" :key="index">
            <div v-if="index + 1 !== 1" class="step_border" />
            <div class="step">
              <div class="step_value_border">
                <div
                  class="step_value"
                  :style="index + 1 <= activeType ? 'color:#FF9A52' : ''"
                >
                  {{ index + 1 <= activeType ? '√' : index + 1 }}
                </div>
              </div>
              <div class="step_title">{{ item.name }}</div>
            </div>
          </div>
        </div>

        <div class="lgoinForm">
          <el-form
            v-if="!nextType"
            ref="ruleForms"
            :model="ruleForm"
            :rules="rules"
            label-width="100px"
            class="demo-ruleForm"
            size="mini"
          >
            <div style="margin-bottom: 20px">
              <span>基本信息</span><span
                class="promptInformation"
              >（请如实填写以下信息，如发现弄虚作假，隐瞒真实情况，不予以审核通过）</span>
            </div>
            <el-row>
              <el-col :span="10">
                <el-form-item label="企业名称" prop="companyName">
                  <el-input
                    v-model="ruleForm.companyName"
                    placeholder="请输入企业名称"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="10" :offset="2">
                <el-form-item label="企业简称" prop="companyShortName">
                  <el-input
                    v-model="ruleForm.companyShortName"
                    placeholder="请输入企业简称"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="法人姓名" prop="legalPerson">
                  <el-input
                    v-model="ruleForm.legalPerson"
                    placeholder="请输入法人姓名"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="10" :offset="2">
                <el-form-item label="企业规模" prop="companyScale">
                  <el-select
                    v-model="ruleForm.companyScale"
                    style="width: 100%"
                    placeholder="请选择企业规模"
                  >
                    <el-option label="0~20人" value="0" />
                    <el-option label="20~50人" value="1" />
                    <el-option label="50~100人" value="2" />
                    <el-option label="100~500人" value="3" />
                    <el-option label="500~1000人" value="4" />
                    <el-option label="1000人以上" value="5" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="智装用户" prop="wisdomNum">
                  <el-select
                    v-model="ruleForm.wisdomNum"
                    style="width: 100%"
                    placeholder="是否是云智装、智装用户"
                  >
                    <el-option label="否" value="0" />
                    <el-option label="是" value="1" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10" :offset="2">
                <el-form-item label="法人电话" prop="legalPhone">
                  <el-input
                    v-model="ruleForm.legalPhone"
                    placeholder="请输入法人电话"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="联系邮箱">
                  <el-input
                    v-model="ruleForm.contactEmail"
                    placeholder="请输入企业邮箱"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="10" :offset="2">
                <el-form-item label="组织机构代码" prop="socialCreditNo">
                  <el-input
                    v-model="ruleForm.socialCreditNo"
                    placeholder="请输入企业组织机构代码"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="公司所在地" required prop="completeAddress">
              <el-row>
                <el-col :span="4">
                  <el-select
                    v-model="ruleForm.provinceCode"
                    style="width: 100%"
                    placeholder="==请选择省份=="
                  >
                    <el-option
                      v-for="item in provinceList"
                      :key="item.agencyId"
                      :label="item.name"
                      :value="item.agencyId"
                    />
                  </el-select>
                </el-col>
                <span>-</span>
                <el-col :span="8">
                  <el-cascader
                    v-model="ruleForm.cityList"
                    :options="regionTree"
                    :props="props"
                    placeholder="==请选择市(区/县）=="
                    style="width: 100%"
                  />
                </el-col>
                <span>-</span>
                <el-col :span="9">
                  <el-input
                    v-model="ruleForm.completeAddress"
                    placeholder="请输入详细地址"
                    style="width: 100%"
                  />
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item>
              <div
                style="
                  margin-bottom: 10px;
                  text-align: left;
                  margin-left: -100px;
                "
              >
                <span>企业证件信息</span><span
                  class="promptInformation"
                >（请您上传清晰\无污物\完整的证件原件照片或者彩色扫描件）</span>
              </div>
            </el-form-item>
            <el-form-item>
              <el-row>
                <el-col :span="6">
                  <div style="text-align: left">
                    <span style="font-size: 10px"> 营业执照 </span>
                    <span style="font-size: 8px; color: #999999">(必填)</span>
                  </div>
                  <uploadImage
                    v-model="ruleForm.certificateImge"
                    :max-count="1"
                    :is-edits="isEdit"
                  />
                  <!--                  <UploadImg title="营业执照" @uploadUrl="uploadUrl" />-->
                </el-col>
                <el-col :span="6">
                  <div style="text-align: left">
                    <span style="font-size: 10px"> 法人身份证正面 </span>
                    <span style="font-size: 8px; color: #999999">(必填)</span>
                  </div>
                  <uploadImage
                    v-model="ruleForm.legalIdcardFront"
                    :max-count="1"
                    :is-edits="isEdit"
                  />
                  <!--                  <UploadImg title="法人身份证正面" @uploadUrl="uploadUrl" />-->
                </el-col>
                <el-col :span="6">
                  <div style="text-align: left">
                    <span style="font-size: 10px"> 法人身份证反面 </span>
                    <span style="font-size: 8px; color: #999999">(必填)</span>
                  </div>
                  <uploadImage
                    v-model="ruleForm.legalIdcardBack"
                    :max-count="1"
                    :is-edits="isEdit"
                  />
                  <!--                  <UploadImg title="法人身份证反面" @uploadUrl="uploadUrl" />-->
                </el-col>
                <el-col :span="6">
                  <div style="text-align: left">
                    <span style="font-size: 10px"> 企业logo </span>
                    <span style="font-size: 8px; color: #999999">(必填)</span>
                  </div>
                  <uploadImage
                    v-model="ruleForm.companyLogo"
                    :max-count="1"
                    :is-edits="isEdit"
                  />
                  <!--                  <UploadImg title="企业logo" @uploadUrl="uploadUrl" />-->
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>

          <div v-if="nextType" style="text-align: center; height: 70%">
            <img
              :src="require('@/assets/img/vector.png')"
              style="
                text-align: center;
                width: 134px;
                height: 134px;
                margin-top: 20px;
              "
            >
            <div style="font-size: 20px; color: #ff6a32; line-height: 30px">
              提交成功
            </div>
            <div style="color: #999999; line-height: 25px">
              平台审核中,审核通过后
            </div>
            <div style="color: #999999; line-height: 25px">
              将通过短信通知您!
            </div>
          </div>

          <div class="next" @click="resetForm()">
            {{ nextType ? '登陆账号' : '下一步' }}
          </div>
        </div>
      </div>
    </div>
    <FootersVue />
  </div>
</template>
<script lang="ts">
import FootersVue from '_c/form/footer/Footers.vue'
import { defineComponent, ref, reactive, toRefs, watch } from 'vue'
import LoginComponeV from '_c/formEnterprise/login/LoginComponeV.vue'
import RegisterCompone from '_c/formEnterprise/register/RegisterCompone.vue'
// import UploadImg from './uploadImg.vue'
import uploadFile from '_c/UploadFile/uploadImage.vue'
import { fetch } from '_@/axios-config/axios'
import { ElMessage } from 'element-plus'
import wsCache from '@/cache'

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
        ruleForms.value.validate((valid: any) => {
          if (valid) {
            addCompanyForm()
          } else {
            alert('请完善企业信息')
            state.ruleForm.resetFields()
            return false
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
          r.children.forEach((e: any) => {
            e.label = e.name
            e.value = e.agencyId
          })
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
</script>
<style lang="less">
.addClass {
  border-bottom: 2px solid #ff5d35;
  color: #ff5d35 !important;
}

.my_step {
  margin-top: 3%;
  z-index: 1;
  margin-bottom: 70px;
  padding-left: 10px;
  padding-right: 10px;
  width: 70vw;
  height: 10px;

  .step {
    width: 20%;
    height: 40px;
    float: left;

    .step_value_border {
      background-color: #ffffff;
      width: 30px;
      height: 30px;
      border-radius: 30px;
      margin: 0 auto;
      // padding-top: 6rpx;
      opacity: 0.9;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }

    .step_value_unborder {
      // background-color: #e2e4ef;
      //background-color: #FFFFFF;
      width: 26px;
      height: 26px;
      border-radius: 26px;
      margin: 4px auto;
      // padding-top: 6rpx;
    }

    .step_value {
      font-size: 12px;
      color: #999999;
      background-color: #ffffff;
      width: 20px;
      height: 20px;
      border-radius: 20px;
      text-align: center;
      line-height: 20px;

      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      // margin-left: calc((14.5%)/2);
    }

    .step_title {
      text-align: center;
      font-size: 12px;
      color: #ffffff;
      margin-top: 8px;
    }
  }

  .step_border {
    height: 1px;
    width: calc(20% - 12px);
    background-color: #d2d2d2;
    float: left;
    margin-top: 14px;
    margin-left: 5px;
    margin-right: 5px;
  }
}
</style>
