<template>
  <div>
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      v-if="showDialogPwa"
      v-model="showDialogPwa"
      :title="props.title"
      width="57rem"
      @close="handleCancel"
    >
      <el-form
        ref="ruleForms"
        :model="state.formData"
        label-width="13rem"
        :rules="rules">
        <slot name="payTitle">
        </slot>
        <div style="height: 3rem"></div>
        <div v-for="(item,index) in state.factorList" class="my-message" :key="index"
             :style="state.factorData[item.param]?'':'background:#FEF0F0; '">
          <div class="message-text">{{ item.lable }}</div>
          <el-icon :color="state.factorData[item.param]?'#67C23A':'#F56C6C'" size="15">
            <circle-check-filled v-if="state.factorData[item.param]" />
            <circle-close-filled v-else />
          </el-icon>
        </div>
        <div style="height: 1.8rem"></div>
        <div v-if="needVerify">
          <el-form-item label="绑定手机号" prop="phone">
            <div style="display: flex;justify-content: space-between;width: calc(100% - 4rem);align-items: center">
              <div>
                {{ state.formData.phone }}
              </div>
              <el-button @click="getVerificationCode" type="primary">{{ send }}
              </el-button>
            </div>

          </el-form-item>
          <el-form-item label="验证码" prop="smsCode">
            <el-input v-model="state.formData.smsCode"></el-input>
          </el-form-item>
          <div style="height: 0.1rem"></div>
        </div>
        <el-form-item label="支付密码" prop="password">
          <div class="payment-data">
            <div class="num" v-for="(item,index) in 6" :key="item">
              <div class="mun_encryption" v-if="text[index]"></div>
            </div>
            <input :maxlength="6" type="tel" v-model="state.formData.password" :focus="inputFocus"
                   @input="changeText" />
          </div>
        </el-form-item>
        <div class="forget-password" @click="forgetPwd">忘记密码</div>
      </el-form>


      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handelConfirmPay">确认</el-button>
          <el-button @click="handleCancel">取 消</el-button>
        </span>
      </template>
    </el-dialog>
    <!--    //忘记密码-->
    <forget-password />
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, ref, watchEffect, reactive, onMounted, provide } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '付款'
  },
  getHandelData: {
    type: Function,
    default: null
  },
  needVerify: {//是否需要二次校验
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['getHandelData', 'forgetPwd', 'update:modelValue'])
const dialogVisibleForget = ref<boolean>(false)
provide('dialogVisibleForget', dialogVisibleForget)
const send = ref('发送验证码')
const times = ref<number>(60)
const showDialogPwa = ref<any>(false)
const ruleForms = ref<any>('')
const needVerify = ref<any>(false)
const text = ref<any>([])
const inputValue = ref<any>()
const rules = reactive({
  smsCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
  password: [{ required: true, message: '请输入支付密码', trigger: 'blur' }]
})
const state = reactive({
  factorList: [
    { lable: '是否常用地登录', param: 'isFrequentlyPlace' },
    { lable: '是否常用设备', param: 'isFrequentlyDevice' },
    { lable: '账号与绑定手机是否匹配', param: 'isBindPhoneMatch' }
  ],
  factorData: {} as any,
  formData: {
    phone: '',
    smsCode: '',
    smsSessionKey: '',
    password: null as any
  }
})
const windows = window as any
const headerSdk: any = ref({})
const forgetPwd = () => {
  dialogVisibleForget.value = true
  // emit('forgetPwd', '忘记密码')
  // console.log('3456324536')
}
const changeText = (e: any) => {
  const strings = state.formData.password.toString().split('')
  text.value = []
  strings.map((item: any) => {
    text.value.push(item)
  })
}
const handelConfirmPay = () => {
  ruleForms.value.validate((valid: any) => {
    if (valid) {
      checkPassword()
    }
  })
  // showDialogPwa.value = false
  // emit('update:modelValue', showDialogPwa.value)
}

const handleCancel = () => {
  showDialogPwa.value = false
  emit('update:modelValue', showDialogPwa.value)
}
//校验和密码
const checkPassword = async () => {
  await fetch({
    url: '/admin/mfa/verify/ppwd',
    method: 'post',
    data: state.formData
  }).then((res: any) => {
    if (res.data) {
      // handleCancel()
      emit('getHandelData', '支付密码确认', res.data)
    }
  })
}
// 获取验证码
const getVerificationCode = async () => {
  if (times.value != 60) {
    ElMessage.warning('操作太频繁！')
    return
  }
  await fetch({
    url: '/admin/mfa/smscode/send',
    method: 'post'
  })
    .then((res: any) => {
      if (res.data) {
        state.formData.smsSessionKey = res.data.sessionKey
        ElMessage.success('短信已发送，请注意查收')
        const timer = setInterval(() => {
          times.value--
          if (times.value <= 0) {
            send.value = '发送验证码'
            clearInterval(timer)
            times.value = 60
          } else {
            send.value = times.value + '秒后重试'
          }
        }, 1000)
      }
    })
    .catch((erro) => {
      ElMessage.error(erro)
    })
}
// 获取企业绑定手机号
const getPhone = async () => {
  await fetch({
    url: '/admin/mfa/info/get',
    method: 'get'
  }).then((res: any) => {
    if (res.code == 0) {
      state.formData.phone = res.data.phone
    }
  })
}
//多重因素认证
const getFactor = async () => {
  state.factorData = {}
  await fetch({
    url: '/admin/mfa/check',
    method: 'get',
    headers: {
      ...headerSdk.value
    }
  }).then((res: any) => {
    state.factorData = res.data
    needVerify.value = res.data.needVerify
  })
}

watchEffect(() => {
  console.log(props.modelValue)
  showDialogPwa.value = props.modelValue
  state.formData.password = ''
  state.formData.smsCode = ''
  text.value = []
  if (showDialogPwa.value) {
    getFactor()
    getPhone()
  }
})
onMounted(() => {
  //人机识别模块，只需初始化一次
  windows.AWSC.use('uab', function(state: any, uab: any) {
    console.log(state, uab, 'uab')
    if (state === 'loaded') {
      //得到人机token
      headerSdk.value.uaToken = uab.getUA()
    }
  })
  //设备指纹模块，得到设备token，只需初始化一次
  windows.AWSC.use('um', function(state: any, um: any) {
    if (state === 'loaded') {
      um.init({
        //appName请直接使用'saf-aliyun-com'
        appName: 'saf-aliyun-com'
      }, function(initState: any, result: any) {
        if (initState === 'success') {
          headerSdk.value.webUmidToken = result.tn
        }
      })
    }
  })
})
</script>

<style scoped lang="less">
.my-message {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 4rem 0 2rem;
  height: 4rem;
  background: #F0F9EB;
  border-radius: 4px;
  padding: 0 2rem;

  .message-text {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #303133;
  }
}

.pay-data-money {
  font-size: 30px;
  color: #67C23A;
  width: 100%;
  margin-left: -2rem;
  text-align: center;
  margin-top: 2rem;
}

.forget-password {
  width: calc(100% - 4rem);
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #909399;
  cursor: pointer;
  text-align: right;
  margin-bottom: 4rem;
}

.payment-data {
  display: flex;
  justify-content: space-between;
  width: calc(100% - 4rem);
  //position: relative;

  .num {
    width: 4.7rem;
    height: 4.7rem;
    border-radius: 0.4rem;
    border: solid 1px #EEEEEE;
    display: flex;
    justify-content: center;
    align-items: center;
    //position: relative;
    //float: left;
    //margin-right: 1rem;
  }

  .mun_encryption {
    background: #000000;
    height: 10px;
    width: 10px;
    border-radius: 10px;
  }

  input {
    position: absolute;
    width: 100%;
    height: 4.7rem;
    left: 0;
    z-index: 200;
    opacity: 0;
  }


  .payment-code {
    //margin-top: 4rem;
    display: flex;
    height: 5rem;
    align-items: center;
    justify-content: space-between;
    //padding: 0 4rem 0 2rem;
    margin-bottom: 4rem;


    .pay-code-text {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #2DA44E;
    }


  }


}


</style>
