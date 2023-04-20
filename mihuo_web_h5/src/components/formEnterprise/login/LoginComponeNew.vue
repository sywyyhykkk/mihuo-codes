<template>
  <div class="login-item">
    <!--    <div class="login-title">-->
    <!--      <img :src="require('@/assets/video/LOGO.png')" class="login-logo" />-->
    <!--      <div class="login-name">觅活</div>-->
    <!--      <div class="login-name-title">工程塔台交付系统</div>-->
    <!--    </div>-->

    <div class="login-new">
      <div class="login-tabs">
        <!--        登录-->
        <div
          v-for="(item, index) in tabsClass"
          v-if="!isRegister && state.companyList.length <= 1"
          :key="item"
          class="tabs-item"
          @click="changeTabs(index)"
        >
          <div
            class="tabs-name"
            :class="[current === index ? 'active-name' : '']"
          >
            {{ item }}
          </div>
          <div
            class="tabs-wire"
            :class="[current === index ? 'active-wire' : '']"
          />
        </div>
        <!--        注册-->
        <div
          v-if="isRegister && state.companyList.length <= 1"
          class="tabs-item"
        >
          <span class="tabs-name active-name"> 用户账号注册 </span>
        </div>
        <div v-if="state.companyList.length > 1" class="tabs-item">
          <span class="tabs-name active-name"> 子公司选择 </span>
        </div>
      </div>

      <el-form
        v-if="state.companyList.length <= 1"
        ref="loginForm"
        :model="form"
        :rules="rules"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输手机号"
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
        <el-form-item
          v-if="current == 0 || isRegister"
          prop="password"
          style="margin: 3rem 0 0 0"
        >
          <el-input
            v-model="form.password"
            show-password
            :minlength="3"
            :maxlength="18"
            placeholder="请输入密码"
            class="login-input"
          >
            <template #prefix>
              <el-icon
                class="icon-focus"
                size="1.6rem"
                style="margin-top: 1rem"
              >
                <lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item
          v-if="isRegister"
          prop="confirmPassword"
          style="margin: 3rem 0 0 0"
        >
          <el-input
            v-model="form.confirmPassword"
            show-password
            :minlength="3"
            :maxlength="18"
            placeholder="确认密码"
            class="login-input"
          >
            <template #prefix>
              <el-icon
                class="icon-focus"
                size="1.6rem"
                style="margin-top: 1rem"
              >
                <lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item
          v-if="current == 1 || isRegister"
          prop="code"
          style="margin: 3rem 0 0 0"
        >
          <el-input
            v-model="form.code"
            :maxlength="6"
            placeholder="请输入验证码"
            class="login-input"
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
            <template #suffix>
              <span
                class="send-text"
                :style="sendType ? 'color:#8B8B8B;' : ''"
                @click="getVerificationCode"
              >{{ send }}</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <div class="form-flex-radio">
            <el-checkbox v-model="radio" />
            <div class="prary">
              我已阅读
              <span
                style="color: #0969da"
                @click="openHandel('隐私协议')"
              >《隐私协议》</span>和<span
                style="color: #0969da"
                @click="openHandel('服务条款')"
              >《服务条款》</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="login-button"
            @click="loginOrRegister"
          >{{ isRegister ? '注册' : '登录' }}
          </el-button>
        </el-form-item>
        <div
          class="forgetPassword-text"
          style="margin-top: 2.5rem"
          @click="jumpRegister"
        >
          {{ isRegister ? '已有账号' : '没有账号' }} ,<span
            style="color: #0969da"
          >{{ isRegister ? '立即登录' : '注册企业' }}</span>
        </div>
      </el-form>

      <div v-if="state.companyList.length > 1" class="my_company_select">
        <el-carousel
          :autoplay="false"
          :interval="4000"
          type="card"
          indicator-position="none"
          @change="caroucelChange"
        >
          <el-carousel-item
            v-for="item in state.companyList"
            :key="item.companyName"
          >
            <div class="companyInfo">
              <div>
                <div v-if="item.auditStatus == 0" style="color: #0969da">
                  审核中
                </div>
                <div v-if="item.auditStatus == 1" style="color: #f56c6c">
                  未通过
                </div>
                <div v-else>&nbsp;</div>
                <img
                  class="companyLogo"
                  :src="$getUrl.getPicUrl(item.companyLogo)"
                >
                <div class="companyName">
                  {{ item.companyName }}
                </div>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
        <div style="padding: 5rem 4rem 0 6rem">
          <el-button
            type="primary"
            class="login-button"
            @click="getLogin"
          >确定</el-button>
        </div>
        <div
          class="forgetPassword-text"
          style="margin-top: 2.5rem; width: 100%"
          @click=";(state.companyList = []), (current = 0)"
        >
          账号不对?<span style="color: #0969da">重新登录</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, defineProps, defineEmits, watch } from 'vue'
import { decrypts, encryption, encryptions } from '@/utils/utils'
import { fetch } from '_@/axios-config/axios'
import wsCache from '@/cache'
import { appStore } from '_@/store/modules/app'
import { ElMessage } from 'element-plus'
import { deepClone } from '@/utils'
import { permissionStore } from '_@/store/modules/permission'
import { useRouter } from 'vue-router'
import { isPhone } from '@/utils/validate'

const props = defineProps({
  modelValue: {
    type: Number || String,
    default: ''
  },
  eidtPage: {
    type: Function,
    default: null
  },
  eidtPage2: {
    type: Function,
    default: null
  },
  eidtPageToAudit: {
    type: Function,
    default: null
  },
  jumpRegister: {
    type: Function,
    default: null
  }
})
const emit = defineEmits(['jumpRegister'])

const tabsClass = ref(['账号登录', '验证码登录'])
const current = ref(0)
const rules = reactive<any>({
  username: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码 ', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请输入确认密码 ', trigger: 'blur' }
  ],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
})
const form = reactive<any>({})
const send = ref<any>('点击获取')
const times = ref<number>(60)
const sendType = ref(false)
const radio = ref(false)
const checked = ref(false)
const isRegister = ref(false) // 是否注册
const loginForm = ref<any>('')
const state = reactive({
  companyList: [] as any, // 企业信息
  initialIndex: 0, // 选中的企业index
  access_token: '',
  activeCode: false
})
const openHandel = (val: any) => {
  if (val == '隐私协议') {
    window.open('https://www.51mihuo.com/Privacy.html', '觅活隐私协议')
  }
  if (val == '服务条款') {
    window.open('https://www.51mihuo.com/Server.html', '觅活服务条款')
  }
}
const headers = reactive({
  // uaToken:'',
  // webUmidToken:'',
  val: {}
} as any)
const windows = window as any
const { push, addRoute, currentRoute } = useRouter()

// 密码登录和验证码登录的tabs切换事件
const changeTabs = (index: number) => {
  current.value = index
  loginForm.value.resetFields()
}
// 登录注册的切换事件
const jumpRegister = () => {
  // isRegister.value = isRegister.value ? false : true
  // loginForm.value.resetFields()
  // props.eidtPageToAudit()
  emit('jumpRegister', 1)
}

// 登录或注册的点击事件
const loginOrRegister = () => {
  loginForm.value.validate((valid: any) => {
    if (valid) {
      if (!radio.value) {
        ElMessage.info('请同意隐私政策和服务协议')
        return
      }
      // 登录信息存储cookic中
      setCookie()
      if (isRegister.value) {
        getRegister() // 注册
      } else {
        getLogin() // 登录
      }
    }
  })
}
// 选择企业时触发的事件
const caroucelChange = (index: any) => {
  state.initialIndex = index
}
// 获取验证码触发的事件
const getVerificationCode = async () => {
  loginForm.value.validateField('username', () => {})
  if (!state.activeCode) return
  if (sendType.value) {
    return
  }
  await fetch({
    url: `admin/mobile/${form.username}/${
      isRegister.value ? 'SMSREGISTER' : 'SMSLOGIN'
    }`,
    method: 'get'
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
// 注册接口
const getRegister = async () => {
  const dataObj = {
    username: form.username,
    password: form.password,
    code: form.code,
    recommend: ''
  }
  await fetch({
    url: '/admin/user/register',
    method: 'post',
    data: dataObj
  }).then((res: any) => {
    if (!res.data) {
    } else {
      getLogin()
    }
  })
}
// 登录接口
const getLogin = async () => {
  const user: {
    username: string
    password: string
    randomStr: string
    code: string
  } = encryption({
    data: form,
    type: 'password',
    key: 'pigxpigxpigxpigx',
    param: ['password']
  })
  // 账号密码登录
  let dataObj: any = {
    username: user.username,
    password: user.password,
    grant_type: 'password',
    companyId:
      state.companyList.length > 0
        ? state.companyList[state.initialIndex].companyId
        : ''
    // companyId: user2.password
  }
  // 验证码登录
  if (current.value === 1 && !isRegister.value) {
    dataObj = {
      mobile: user.username,
      code: form.code,
      grant_type: 'sms_code',
      companyId:
        state.companyList.length > 0
          ? state.companyList[state.initialIndex].companyId
          : ''
      // companyId: user2.password
    }
  }
  await fetch({
    url: '/auth/oauth/token',
    method: 'post',
    data: dataObj,
    headers: {
      ...headers.val
    },
    showErrorMessage: false
  })
    .then((res: any) => {
      if (res.access_token) {
        wsCache.set('appToken', false)
        wsCache.set(appStore.userInfoDetail, Object.assign(res))
        state.access_token = res.access_token
      } else if (res.data === 'corp_un_joined') {
        // 用户未加入企业
        ElMessage.warning(res.msg)
        wsCache.set('appToken', true)
        getLogin()
        emit('jumpRegister', 1)
      } else if (res.data === 'invalid_exception') {
        // 未注册
        ElMessage.warning(res.msg)
      } else if (res.data === 'corp_un_audited') {
        // 已提交，待审核
        emit('jumpRegister', 2)
      } else if (res.data == 'sms_code_validate') {
        ElMessage.error(res.msg)
      } else {
        // console.log(res)
        wsCache.set('appToken', false)
        state.companyList = res.mData || res
        if (state.companyList.length === 1) {
          state.initialIndex = 0
          getLogin()
        }
      }
    })
    .catch((error: any) => {
      ElMessage.error(error.msg)
    })

  if (state.access_token) {
    await fetch({
      url: '/admin/person/info',
      method: 'get',
      showErrorMessage: false
    }).then((res: any) => {
      if (res.data) {
        if (res.data.companys.length <= 0) {
          ElMessage.warning('请完善企业信息')
          emit('update:modelValue', user.username)
          props.eidtPage()
        } else {
          wsCache.set('companys', Object.assign(res.data.companys))
          wsCache.set(
            appStore.userInfoDetail,
            deepClone({
              ...res.data,
              ...wsCache.get(appStore.userInfoDetail)
            })
          )
          appStore.SetLogoTitle(res.data?.companys[0].companyName || '')
          if (res.data.companys[0].auditStatus === 0) {
            ElMessage.success('平台审核中，请耐心等待')
            emit('jumpRegister', 2)
          }
          if (res.data.companys[0].auditStatus === 1) {
            ElMessage.error('审核失败，请重新提交企业信息')
            const data = {
              ...res.data.companys[0],
              adminName: res.data.sysUser.realName || res.data.sysUser.username,
              adminPhone: res.data.sysUser.username
            }
            emit('jumpRegister', 1, '审核失败', data)
          }
          if (res.data.companys[0].auditStatus === 2) {
            getMenu()
          }
        }
      } else {
        emit('update:modelValue', user.username)
        props.eidtPage()
        state.access_token = ''
        getLogin()
      }
    })
  }
}

// 获取菜单接口
const getMenu = async () => {
  await fetch({
    url: '/admin/menu',
    method: 'get'
  }).then((res: any) => {
    // eslint-disable-next-line no-empty
    // 这里的权限就很诡异
    if (!res.data) {
      ElMessage.info('您没有菜单权限，请联系管理员')

      // 这两行很重要
      state.companyList = []
      state.access_token = ''
      return
    }
    if (!res.data[0].children) {
      ElMessage.info('您没有权限菜单,请联系管理员')
      // 这两行很重要
      state.companyList = []
      state.access_token = ''
      return
    }
    const businessMap = res.data.find(
      (item: { name: string }) => item.name === '企业端'
    )
    if (businessMap.children && businessMap.children.length < 1) {
      ElMessage.info('您没有权限菜单,请联系管理员')
      // 这两行很重要
      state.companyList = []
      state.access_token = ''
      return
    }
    if (res.data) {
      wsCache.set(
        appStore.userInfo,
        Object.assign(form, { checkedNodes: businessMap.children })
      )
      permissionStore.GenerateRoutes().then(async () => {
        for (const route of permissionStore.addRouters) {
          await addRoute(route.name!, route) // 动态添加可访问路由表
        }
        permissionStore.SetIsAddRouters(true)
        await updatePermission()
      })
    }
  })
}
// 按钮权限更新
const updatePermission = () => {
  fetch({ url: '/admin/user/info', method: 'get' }).then((res: any) => {
    if (res.code !== 0) {
      ElMessage.error(res.msg)
      return
    }
    const list = {}
    for (let i = 0; i < res.data.permissions.length; i++) {
      list[res.data.permissions[i]] = true
    }
    wsCache.set(appStore.powerInfo, list)
    push({ path: '/' })
  })
}

/**
 * 记住用户名和密码
 */
// 存放cookie
const setCookie = () => {
  if (radio.value) {
    var date = new Date()
    // 设置一周后过期
    date.setTime(date.getTime() + 7 * 24 * 3600 * 1000)
    // 密码加密存储
    const paw = encryptions(form.password)
    document.cookie =
      'user=' + (form.username + ':' + paw) + '; expires =' + date
  } else {
    document.cookie = 'user=;expires = ' + -1
  }
}
// 获取cookie
const getCookie = () => {
  const cookies = document.cookie.split(';')
  // console.log(cookies)
  for (var i in cookies) {
    var keyvalue: any = cookies[i].split('=')
    if (keyvalue[0].trim() === 'user') {
      const uname = keyvalue[1].split(':')[0]
      const pwa = keyvalue[1].split(':')[1]
      if (uname && pwa) {
        form.username = uname
        // 密码解密
        form.password = decrypts(pwa)
        checked.value = true
        radio.value = true
      }
    }
    if (keyvalue[0].trim() === 'radio') {
      console.log('radio', keyvalue[1])
      radio.value = keyvalue[1] == 'true'
    }
  }
}
const changeRadio = (val: any) => {
  // console.log(val)
  // localStorage.setItem('radio_' + form.username, val)
  if (radio.value) {
    var date = new Date()
    // 设置一周后过期
    date.setTime(date.getTime() + 7 * 24 * 3600 * 1000)
    // 密码加密存储
    document.cookie = 'radio=' + radio.value + '; expires =' + date
  } else {
    document.cookie = 'radio=' + radio.value + ';expires = ' + -1
  }
}
onMounted(() => {
  getCookie()
  // 人机识别模块，只需初始化一次
  windows.AWSC.use('uab', function (state: any, uab: any) {
    if (state === 'loaded') {
      // 得到人机token
      headers.val.uaToken = uab.getUA()
    }
  })
  // 设备指纹模块，得到设备token，只需初始化一次
  windows.AWSC.use('um', function (state: any, um: any) {
    if (state === 'loaded') {
      um.init(
        {
          // appName请直接使用'saf-aliyun-com'
          appName: 'saf-aliyun-com'
        },
        function (initState: any, result: any) {
          if (initState === 'success') {
            headers.val.webUmidToken = result.tn
          }
        }
      )
    }
  })
})
watch(
  () => form.username,
  (n, o) => {
    if (isPhone(n)) {
      state.activeCode = true
    } else {
      state.activeCode = false
    }
  }
)
</script>

<style scoped lang="less">
.my_company_select {
  //display: grid;
  //grid-template-columns: auto 10rem auto;
  margin-top: 6rem;

  :deep(.el-carousel) {
    height: 17rem !important;
    width: 100%;

    .el-carousel__container {
      height: 17rem !important;

      //.el-carousel__arrow {
      //  height: 17rem;
      //}
    }

    .el-carousel__arrow {
      width: 3rem;
      height: 3rem;
    }

    .el-carousel__mask {
      display: block;
    }

    .el-carousel__item {
      margin-left: 3rem;
    }
  }

  .companyInfo {
    width: 12rem;
    height: 16rem;
    font-size: 1.2rem;
    display: flex;
    justify-content: center;
    text-align: center;
  }

  .companyLogo {
    margin-top: 1rem;
    width: 9rem;
    height: 9rem;
    transition: all 0.4s;
    text-align: center;
    background: #ffffff;
    border-radius: 50%;
  }

  .companyName {
    text-align: center;
    line-height: 50px;
    font-size: 1.2rem;
    //color: #fff;
    position: relative;
    scrollbar-width: none; /* firefox */
    -ms-overflow-style: none; /* IE 10+ */
  }
}

.login-button {
  width: 100%;
  height: 48px;
  box-shadow: 0px 10px 10px 0px rgba(73, 149, 239, 0.27);
  border-radius: 24px;
}

.login-form {
  margin: 4rem 4rem 0rem 4rem;

  .form-flex-radio {
    display: flex;
    align-items: center;

    div {
      margin-left: 1rem;
    }

    .prary {
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #666666;

      span {
        cursor: pointer;
      }
    }
  }

  .login-input {
    .send-text {
      font-size: 15px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #0969da;
      cursor: pointer;
    }

    :deep(.el-input__prefix) {
      position: absolute;
      left: 0 !important;
    }

    :deep(.el-input__inner) {
      border-radius: 0;
      border-top: none;
      border-left: none;
      border-right: none;
      border-bottom: 1px solid #dee0ef;
      font-family: FZYunDongHeiS-M-GB;
      font-weight: bold;
      color: #333333;
      &:-webkit-autofill {
        // 字体颜色
        -webkit-text-fill-color: #1a1a1a !important;
      }

      &::-webkit-input-placeholder {
        /* WebKit browsers */
        font-weight: 400;
      }

      &:focus {
        border-radius: 0;
        border-top: none !important;
        border-left: none !important;
        border-right: none !important;
        border-bottom: 1px solid #0969da !important;

        & + .el-input__prefix {
          color: #0969da;
        }
      }
    }
  }
}

.login-tabs {
  display: flex;
  justify-content: center;
  width: 100%;
  padding-top: 3rem;
  cursor: pointer;

  .tabs-item {
    display: flex;
    flex-flow: column;
    justify-content: center;
    width: auto;
    align-items: center;

    .active-name {
      color: #000000 !important;
    }

    .active-wire {
      background: #3963fd;
    }

    .tabs-wire {
      width: 16px;
      height: 6px;
      border-radius: 2px;
      font-weight: bold;
      color: #000000;
    }

    .tabs-name {
      font-size: 18px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #b9babd;
      margin-bottom: 1rem;
      margin-left: 1.6rem;
      margin-right: 1.6rem;
    }
  }
}

.login-item {
  position: relative;

  .login-title {
    display: flex;
    margin-bottom: 4rem;
    align-items: center;
    justify-content: center;
    width: 38.1rem;

    .login-logo {
      width: 3.3rem;
      height: 3.3rem;
    }

    .login-name {
      font-size: 24px;
      margin-left: 1.5rem;
      font-weight: 500;
      color: @loginButtonColor;
    }

    .login-name-title {
      font-size: 22px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #333333;
      margin-left: 1.9rem;
    }
  }
}

.login-new {
  width: 38.1rem;
  //height: 438px;
  background: #ffffff;
  box-shadow: 0px 6px 6px 0px rgba(9, 105, 218, 0.08);
  border-radius: 27px;
  padding-bottom: 4rem;
}
.forgetPassword-text {
  font-size: 1.2rem;
}
</style>
