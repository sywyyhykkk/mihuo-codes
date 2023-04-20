<template>
  <div class="register-form">
    <div class="form-data">
      <el-form
        ref="ruleForms"
        :model="state.ruleForm"
        :rules="rules"
        label-width="14rem"
        size="mini"
        :scroll-to-error="true"
      >
        <div style="margin-bottom: 1rem">
          <span>基本信息</span>
          <span class="promptInformation"
            >（请如实填写以下信息，如发现弄虚作假，隐瞒真实情况，不予以审核通过）</span
          >
        </div>
        <el-row style="margin-bottom: -2rem">
          <el-col :span="10">
            <el-form-item label="企业名称" prop="companyName">
              <el-input v-model="state.ruleForm.companyName" />
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="企业简称" prop="companyShortName">
              <el-input v-model="state.ruleForm.companyShortName" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: -2rem">
          <el-col :span="10">
            <el-form-item label="法人姓名" prop="legalPerson">
              <el-input v-model="state.ruleForm.legalPerson" />
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="企业规模" prop="companyScale">
              <el-select
                v-model="state.ruleForm.companyScale"
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
        <el-row style="margin-bottom: -2rem">
          <el-col :span="10">
            <el-form-item label="智装用户" prop="wisdomNum">
              <el-select
                v-model="state.ruleForm.wisdomNum"
                placeholder="是否是云智装、智装用户"
              >
                <el-option label="否" :value="0" />
                <el-option label="是" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="法人电话" prop="legalPhone">
              <el-input v-model="state.ruleForm.legalPhone" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: -2rem">
          <el-col :span="10">
            <el-form-item label="联系邮箱">
              <el-input v-model="state.ruleForm.contactEmail" />
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="组织机构代码" prop="socialCreditNo">
              <el-input v-model="state.ruleForm.socialCreditNo" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: -2rem; margin-top: -1.5rem">
          <el-col :span="22">
            <el-form-item label="公司所在地" prop="address">
              <el-cascader
                v-model="state.ruleForm.address"
                collapse-tags
                placeholder="请选择地区"
                :props="getAreaOption()"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: -2rem; margin-top: -1.5rem">
          <el-col :span="22">
            <el-form-item label="公司详细地址" prop="completeAddress">
              <el-input
                v-model="state.ruleForm.completeAddress"
                style="width: 33.3%; margin-left: 1.5rem"
                placeholder="请输入详细地址"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div style="margin: 2.2rem 0 3rem 0">
          <span>企业证件</span>
          <span class="promptInformation"
            >（请您上传清晰\无污物\完整的证件原件照片或者彩色扫描件）</span
          >
        </div>
        <el-row style="margin-left: 100px; margin-bottom: 3rem">
          <el-col :span="6">
            <el-form-item
              class="form-item-up"
              label="企业logo"
              prop="companyLogo"
            >
              <uploadImage
                v-model="state.ruleForm.companyLogo"
                :max-count="1"
                :is-edits="isEdit"
                :is-binary="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              class="form-item-up"
              label="营业执照"
              prop="certificateImge"
            >
              <uploadImage
                v-model="state.ruleForm.certificateImge"
                :max-count="1"
                :is-edits="isEdit"
                :is-binary="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              class="form-item-up"
              label="法人身份证正面"
              prop="legalIdcardFront"
            >
              <uploadImage
                v-model="state.ruleForm.legalIdcardFront"
                :max-count="1"
                :is-edits="isEdit"
                :is-binary="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              class="form-item-up"
              label="法人身份证反面"
              prop="legalIdcardBack"
            >
              <uploadImage
                v-model="state.ruleForm.legalIdcardBack"
                :max-count="1"
                :is-edits="isEdit"
                :is-binary="true"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div style="margin: 2.2rem 0 3rem 0">
          <span>管理员信息</span>
          <span class="promptInformation"
            >（请认真填写，管理员手机号将作为登录名进行登录）</span
          >
        </div>
        <el-form-item prop="adminName" label="管理员姓名">
          <el-input
            v-model="state.ruleForm.adminName"
            :disabled="props.isEdit"
            placeholder=""
            class="login-input"
          >
            <template #prefix>
              <el-icon
                class="icon-focus"
                size="1.6rem"
                style="margin-top: 1rem"
              >
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="adminPhone" label="管理员手机号">
          <el-input
            v-model="state.ruleForm.adminPhone"
            :disabled="props.isEdit"
            placeholder=""
            :maxlength="11"
            type="tel"
            class="login-input"
          >
            <template #prefix>
              <el-icon
                class="icon-focus"
                size="1.6rem"
                style="margin-top: 1rem"
              >
                <iphone />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="smsCode" label="验证码">
          <el-input
            v-model="state.ruleForm.smsCode"
            :maxlength="6"
            type="tel"
            placeholder=""
            style="width: 25rem"
          >
            <template #prefix>
              <el-icon
                class="icon-focus"
                size="1.6rem"
                style="margin-top: 1rem"
              >
                <Key />
              </el-icon>
            </template>
          </el-input>
          <div style="width: 13rem; display: flex; justify-content: right">
            <el-button type="text" :disabled="sendType" @click="onShow">{{
              send
            }}</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="form-footer">
      <el-button type="primary" :loading="loading" @click="registerSave"
        >注册企业</el-button
      >
      <div class="forgetPassword-text" style="margin-left: 10px">
        已有企业?<span style="color: #0969da" @click="jumpRegister"
          >立即登录</span
        >
      </div>
    </div>
    <verify
      ref="verifValue"
      mode="pop"
      :captcha-type="captchaType"
      :img-size="{ width: '400px', height: '200px' }"
      @success="handleSuccess"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  defineEmits,
  reactive,
  ref,
  onMounted,
  defineProps,
  defineComponent,
  watchEffect
} from 'vue'
import { fetch } from '_@/axios-config/axios'
import { ElMessage } from 'element-plus'
import getUrl from '@/getPic'
import { getBase64 } from '@/utils/utils'
import verify from '@/components/verifition/Verify.vue'

const component = defineComponent({
  verify
})
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['jumpRegister'])
const ruleForms = ref<any>('')
const isEdit = ref<boolean>(false)
const loading = ref<boolean>(false)
const times = ref<any>(60)
const send = ref<any>('获取验证码')
const sendType = ref<boolean>(false)
const state = reactive<any>({
  provinceList: [],
  cityList: [],
  regionList: [],
  ruleForm: {} as any
})
const rules = reactive({
  adminName: [
    { required: true, message: '请输入管理员姓名', trigger: 'change' }
  ],
  adminPhone: [
    { required: true, message: '请输入管理员手机号', trigger: 'change' }
  ],
  smsCode: [{ required: true, message: '请输入验证码', trigger: 'change' }],
  companyName: [
    { required: true, message: '请输入企业名称', trigger: 'change' }
  ],
  companyScale: [
    { required: true, message: '请选择企业规模', trigger: 'change' }
  ],
  companyShortName: [
    { required: true, message: '请输入企业简称', trigger: 'change' }
  ],
  address: [{ required: true, message: '请选择省市区', trigger: 'change' }],
  completeAddress: [
    { required: true, message: '请输入详细地址', trigger: 'change' }
  ],
  legalPerson: [
    { required: true, message: '请输入法人姓名', trigger: 'change' }
  ],
  legalPhone: [
    { required: true, message: '请输入法人电话', trigger: 'change' }
  ],
  cityCode: [{ required: true, message: '请选择所属城市', trigger: 'change' }],
  areaCode: [{ required: true, message: '请选择所属区/县', trigger: 'change' }],
  provinceCode: [
    { required: true, message: '请选择所属省份', trigger: 'change' }
  ],
  cityList: [{ required: true, message: '请选择所属区/县', trigger: 'change' }],
  wisdomNum: [
    {
      required: true,
      message: '请选择是否是智装、云智装用户',
      trigger: 'change'
    }
  ],
  companyLogo: [{ required: true, message: '请上传logo', trigger: 'change' }],
  legalIdcardBack: [
    { required: true, message: '法人身份证反面', trigger: 'change' }
  ],
  legalIdcardFront: [
    { required: true, message: '法人身份证正面', trigger: 'change' }
  ],
  certificateImge: [{ required: true, message: '营业执照', trigger: 'change' }],
  socialCreditNo: [
    { required: true, message: '请输入企业组织机构代码', trigger: 'change' }
  ]
})
const verifValue = ref()
const captchaType = ref('blockPuzzle')
const onShow = () => {
  ruleForms.value.validateField('adminPhone', () => {})
  if (sendType.value || !state.ruleForm.adminPhone) {
    return
  }
  verifValue.value.show()
}
const handleSuccess = (res: any) => {
  ruleForms.value.validateField('adminPhone', () => {})
  if (sendType.value || !state.ruleForm.adminPhone) {
    return
  }
  handelSend(res)
}

// 提交注册信息
const addCompany = async () => {
  const formData = new FormData()
  Object.keys(state.ruleForm).forEach((res: any) => {
    if (
      (res == 'legalIdcardBack' ||
        res == 'companyLogo' ||
        res == 'legalIdcardFront' ||
        res == 'certificateImge') &&
      typeof state.ruleForm[res] === 'string'
    ) {
      getBase64(getUrl.getPicUrl(state.ruleForm[res], false), (data: any) => {
        formData.append(res, data)
      })
    } else {
      formData.append(res, state.ruleForm[res])
    }
  })

  setTimeout(() => {
    loading.value = false
    fetch({
      url: '/admin/company',
      method: 'post',
      data: formData
    }).then((res: any) => {
      if (res.code == '0') {
        ElMessage.success('企业信息填写成功，请等待审核')
        emit('jumpRegister', 2)
      }
    })
  }, 2000)
}
// 根据省市区编号获取省市区全名
const getAreaName = async (dataObj: any) => {
  await fetch({
    url: '/basic/region/names',
    method: 'post',
    data: dataObj
  }).then((res: any) => {
    state.ruleForm.areaInfo =
      res.data.provinceCode +
      res.data.cityCode +
      res.data.areaCode +
      state.ruleForm.completeAddress
    addCompany()
  })
}

const registerSave = () => {
  loading.value = true
  ruleForms.value.validate((valid: any) => {
    if (valid) {
      state.ruleForm.cityCode = state.ruleForm.address[1]
      state.ruleForm.areaCode = state.ruleForm.address[2]
      getAreaName({
        areaCode: state.ruleForm.address[2],
        cityCode: state.ruleForm.address[1],
        provinceCode: state.ruleForm.address[0]
      })
    } else {
      loading.value = false
    }
  })
}

// 选择公司所在地
const getAreaOption = () => {
  return {
    lazy: true,
    multiple: false,
    checkStrictly: false, // 单选时必须选到省-市-区
    lazyLoad: async (node: any, resolve: any) => {
      const { level } = node
      const nodes = [] as any
      if (level === 0) {
        await fetch({
          url: `/basic/region/province`,
          method: 'get'
        }).then((res: any) => {
          res.data.forEach((item: any) => {
            nodes.push({
              value: item.agencyId,
              label: item.name,
              areaCode: item.agencyId,
              leaf: false,
              children: [] as any
            })
          })
        })
        state.provinceList = nodes
        resolve(nodes)
      } else if (level === 1) {
        await fetch({
          url: `/basic/region/regionTree/${node.data.areaCode}`,
          method: 'get'
        }).then((res: any) => {
          res.data.forEach((item: any) => {
            nodes.push({
              value: item.agencyId,
              label: item.name,
              areaCode: item.agencyId,
              leaf: false
            })
          })
          state.cityList = nodes
          resolve(nodes)
        })
      } else if (level === 2) {
        await fetch({
          url: `/basic/region/regionTree/${node.data.areaCode}`,
          method: 'get'
        }).then((res: any) => {
          res.data.forEach((item: any) => {
            nodes.push({
              value: item.agencyId,
              label: item.name,
              areaCode: item.agencyId,
              leaf: true
            })
          })
          state.regionList = nodes
          resolve(nodes)
        })
      }
    }
  }
}

const jumpRegister = () => {
  emit('jumpRegister', 0)
}

// 获取验证码触发的事件
const handelSend = async (res: any) => {
  ruleForms.value.validateField('adminPhone', () => {})
  if (sendType.value || !state.ruleForm.adminPhone) {
    return
  }
  await fetch({
    url: `admin/mobile/${
      state.ruleForm.adminPhone
    }/REGCORP?code=${encodeURIComponent(res?.captchaVerification)}`,
    method: 'get',
    headers: {
      code: res?.captchaVerification
    }
  })
    .then((res: any) => {
      if (res.data) {
        ElMessage.success({
          message: '短信已发送，请注意查收',
          type: 'success'
        })
        const timer = setInterval(() => {
          times.value--
          if (times.value <= 0) {
            send.value = '获取验证码'
            clearInterval(timer)
            times.value = 60
            sendType.value = false
          } else {
            send.value = times.value + '秒后重试'
            sendType.value = true
          }
        }, 1000)
      }
    })
    .catch((erro) => {
      console.log(erro)
      ElMessage.error(erro)
    })
}
</script>
<style scoped lang="less">
@import 'login';
</style>
