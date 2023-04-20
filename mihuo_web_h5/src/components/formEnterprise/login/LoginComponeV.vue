<template>
  <div class="form">
    <div class="loginTitle">
      <div class="welcome">Welcome to MiHuo</div>
      <div class="name">工程交付塔台系统</div>
    </div>
    <ul class="loginSwitch">
      <li
        v-for="(item, index) in formClass"
        :key="index"
        :class="[current === index ? 'addClass' : '']"
        @click="addClass(index)"
      >
        <span>{{ item }}</span>
      </li>
    </ul>
    <el-form
      ref="loginForm"
      :model="form"
      :rules="rules"
      class="login-form"
      label-width="6rem"
    >
      <div v-if="companyList.length <= 1">
        <el-form-item v-if="current == 0" prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输手机号"
            class="form--input"
          >
            <template #prefix>
              <i style="display: flex; align-items: center">
                <img
                  style="width: 1.8rem; height: 1.8rem; margin: 1.6rem 2rem"
                  src="@/assets/img/login_phone.png"
                  alt
                />
              </i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item
          v-if="current == 0"
          prop="password"
          style="margin: 3.6rem 0 0 0"
        >
          <el-input
            v-model="form.password"
            show-password
            :minlength="3"
            :maxlength="18"
            placeholder="请输入密码"
            class="form--input"
          >
            <template #prefix>
              <i style="display: flex; align-items: center">
                <img
                  style="width: 1.8rem; height: 1.8rem; margin: 1.6rem 2rem"
                  src="@/assets/img/login_password.png"
                  alt
                /> </i
            ></template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="current == 1" prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输手机号"
            class="form--input"
          >
            <template #prefix>
              <i style="display: flex; align-items: center">
                <img
                  style="width: 1.8rem; height: 1.8rem; margin: 1.6rem 2rem"
                  src="@/assets/img/login_phone.png"
                  alt
                /> </i
            ></template>
          </el-input>
        </el-form-item>

        <el-form-item
          v-if="current == 1"
          prop="code"
          style="margin: 3.6rem 0 0 0"
        >
          <el-row style="width: 100%">
            <el-col :span="15">
              <el-input
                v-model="form.code"
                :maxlength="6"
                placeholder="请输入验证码"
                class="form--input"
              >
                <template #prefix>
                  <i style="display: flex; align-items: center">
                    <img
                      style="width: 1.8rem; height: 1.8rem; margin: 1.6rem 2rem"
                      src="@/assets/img/login_code.png"
                      alt
                    />
                  </i>
                </template>
              </el-input>
            </el-col>
            <el-col :span="8" :offset="1">
              <MhButtomVue
                :class="{ activeCode: activeCode, center: activeCode }"
                :title="send"
                @buttonClick="getVerificationCode"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <div v-if="current == 2" style="height: 13.6rem" class="wechat-code">
          <iframe :src="wechatUrl" width="136" height="100%" />
        </div>
      </div>

      <div v-if="companyList.length > 1" class="my_company_select">
        <el-carousel
          :autoplay="false"
          :interval="4000"
          type="card"
          indicator-position="none"
          @change="caroucelChange"
        >
          <el-carousel-item v-for="item in companyList" :key="item.companyName">
            <div class="companyInfo">
              <div>
                <img
                  class="companyLogo"
                  :src="
                    $imageGlobal +
                    item.companyLogo
                      .replace('/admin/sys-file/mihuo-test/', '')
                      .replace($imageGlobal, '')
                  "
                />
                <div class="companyName">
                  {{ item.companyName }}
                </div>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <el-form-item style="margin: 2.5rem 0 0 0">
        <div class="form-flex-div form-flex-div-s" style="color: #fff">
          <el-checkbox
            v-model="checked"
            style="font-size: 1rem; transform: scale(0.9); margin-left: -0.5rem"
          >
            <div
              class="forgetPassword"
              style="line-height: 0.8; margin-left: -0.6rem"
            >
              <span>记住密码</span>
            </div>
          </el-checkbox>
        </div>
      </el-form-item>
      <el-form-item style="margin: 1rem 0 0 0">
        <div class="form-flex-div form-flex-div-s">
          <el-checkbox
            v-model="radio"
            style="font-size: 1rem; transform: scale(0.9); margin-left: -1.5rem"
          >
            <div
              class="prary"
              style="color: #999; line-height: 0.8; margin-left: -0.6rem"
            >
              我已阅读<span class="w" style="line-height: 0.8"
                >《隐私协议》</span
              >和<span class="w">《服务条款》</span>
            </div>
          </el-checkbox>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button
          class="loginbutton"
          color="#fff"
          size="large"
          :class="errorClass"
          @click="login"
        >
          <span v-loading="loading" style="line-height: 1">登录账号</span>
          <el-icon v-if="!loading" class="el-icon-right" size="17">
            <svg
              t="1644395997975"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="3463"
              width="200"
              height="200"
            >
              <path
                d="M621.248 877.248l320-320c24.992-24.992 24.992-65.504 0-90.496l-320-320c-24.992-24.992-65.504-24.992-90.496 0-24.992 24.992-24.992 65.504 0 90.496L741.504 448 128 448c-35.36 0-64 28.64-64 64s28.64 64 64 64l613.504 0L530.752 786.752C518.24 799.232 512 815.616 512 832s6.24 32.768 18.752 45.248C555.744 902.24 596.256 902.24 621.248 877.248z"
                p-id="3464"
              />
            </svg>
          </el-icon>
        </el-button>
        <div class="forgetPassword-text" @click="jumpRegister">
          没有账号？<span class="r">立即注册</span>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts">
import MhButtomVue from '@/components/MhButtom/MhButtom.vue'
import { imageGlobal } from '@/global'

import {
  defineComponent,
  ref,
  reactive,
  unref,
  computed,
  watchEffect,
  getCurrentInstance,
  toRefs,
  watch,
  h,
  onMounted
} from 'vue'
import { useStore } from 'vuex'
import { encryption, encryptions, decrypts } from '@/utils/utils'
import { fetch } from '_@/axios-config/axios'
import wsCache from '@/cache'
import { appStore } from '_@/store/modules/app'
import { permissionStore } from '_@/store/modules/permission'
import { ElMessage } from 'element-plus'
import { RouteRecordRaw, useRouter } from 'vue-router'
import { isPhone } from '@/utils/validate'
import { deepClone } from '@/utils'

interface FormModule {
  username: string
  password: string
  code: string
  randomStr: string
}

interface RulesModule {
  username: any[]
  password: any[]
  code: any[]
}

interface requstModule {
  code: any[]
  data: any[]
  msg: any[]
}

export default defineComponent({
  components: {
    MhButtomVue
  },
  props: {
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
  },

  setup(props, { emit }) {
    // const { proxy } = getCurrentInstance()
    const { push, addRoute, currentRoute } = useRouter()
    const store = useStore()
    const jumpRegisterr = () => {
      // const register = computed(() => store.getters['form/getRegister'])
      // store.commit('form/setRegister', !register.value)

      props.jumpRegister()
    }
    const wechatUrl = ref(
      'https://open.weixin.qq.com/connect/qrconnect?appid=wx63d402790645b7e6&redirect_uri=https%3A%2F%2Fgitee.com%2Fauth%2Fwechat%2Fcallback&response_type=code&scope=snsapi_login&state=ed775b0b1e54d99a3201673441cb63c11570204ad8de9cdd#wechat_redirect'
    )
    const showCode = ref<boolean>(false)
    const send = ref<string>('获取验证码')
    const times = ref<number>(60)
    const sendType = ref<boolean>(false)
    const errorClass = ref('')
    const state = reactive({
      companyList: [] as any,
      imageGlobal: imageGlobal,
      companyIndex: 0,
      access_token: '',
      activeCode: false,
      loging: false,
      initialIndex: 0,
    })
    const headers = reactive({
      // uaToken:'',
      // webUmidToken:'',
      val:{}
    }as any)
    const uabModule = ref() as any
    const windows = window as any
    const caroucelChange = (index: any) => {
      state.initialIndex = index
    }
    const getVerificationCode = async () => {
      if (!state.activeCode) return
      if (sendType.value) {
        return
      }
      await fetch({
        url: 'admin/mobile/' + form.username + '/SMSLOGIN',
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
          ElMessage('this is a message.')
          ElMessage.error(erro)
        })
    }
    const checked = ref<boolean>(false)
    const radio = ref<any>(true)
    const addClass = (x: number) => {
      current.value = x
      showCode.value = x !== 0
    }
    const current = ref<number>(0)
    const formClass = reactive(['帐号登录', '验证码登录'])

    const loginForm = ref<HTMLElement | null>(null)
    const form = reactive<FormModule>({
      username: '',
      password: '',
      code: '',
      randomStr: ''
    })
    const rules = reactive<RulesModule>({
      username: [{ required: true, message: ' ' }],
      password: [{ required: true, message: ' ' }],
      code: [{ required: true, message: ' ' }]
    })
    const upCompanyIndex = (index: number) => {
      if (index === 0 && state.companyIndex > 0) {
        state.companyIndex--
      }
      if (index === 1 && state.companyIndex < state.companyList.length - 1) {
        state.companyIndex++
      }
    }
    const getToken = async () => {
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
      await fetch({
        url: '/auth/oauth/token',
        method: 'post',
        data: {
          username: user.username,
          password: user.password,
          grant_type: 'password'
        }
      }).then((res2: any) => {
        wsCache.set('appToken', false)
        wsCache.set(appStore.userInfoDetail, Object.assign(res2))
        emit('update:modelValue', user.username)
        props.eidtPage()
      })
    }

    async function login(): Promise<void> {
      const formWrap = unref(loginForm) as any
      if (!formWrap) return
      try {
        formWrap.validate(async (valid: boolean) => {
          if (valid) {
            // 模拟登录接口之后返回角色信息
            if (!radio.value) {
              ElMessage.info('请同意隐私政策和服务协议')
              return
            }
            state.loging = true
            // 登录信息存储cookic中
            setCookie()
            const grant_type = 'password'
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
            // const user2: {
            //   username: string
            //   password: string
            //   randomStr: string
            //   code: string
            // } = encryption({
            //   data: {
            //     username: '',
            //     password:
            //       state.companyList.length > 0
            //         ? state.companyList[state.initialIndex].companyId.toString()
            //         : '',
            //     randomStr: '',
            //     code: ''
            //   },
            //   type: 'password',
            //   key: 'pigxpigxpigxpigx',
            //   param: ['password']
            // })
            //账号密码登录
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
            if (current.value === 1) {
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
              headers:{
                ...headers.val
              },
              showErrorMessage: false
            })
              .then((res: any) => {
                console.log(current.value)
                state.loging = false
                if (res.access_token) {
                  wsCache.set('appToken', false)
                  wsCache.set(appStore.userInfoDetail, Object.assign(res))
                  state.access_token = res.access_token
                } else if (res.data === 'corp_un_joined') {
                  //用户未加入企业
                  ElMessage.warning(res.msg)
                  wsCache.set('appToken', true)
                  getToken()
                } else if (res.data === 'invalid_exception') {
                  //未注册
                  ElMessage.warning(res.msg)
                } else if (res.data === 'corp_un_audited') {
                  //已提交，待审核
                  ElMessage.warning(res.msg)
                  props.eidtPageToAudit()
                } else if (res.data == 'sms_code_validate') {
                  ElMessage.error(res.msg)
                } else {
                  // console.log(res)
                  wsCache.set('appToken', false)
                  state.companyList = res.mData || res
                  if (state.companyList.length === 1) {
                    state.initialIndex = 0
                    console.log(state.companyList)
                    login()
                  }
                }
              })
              .catch((error: any) => {
                ElMessage.error(error.msg)
              })

            if (state.access_token) {
              await fetch({
                url: '/admin/person/info',
                method: 'get'
              }).then((res: any) => {
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
                    ElMessage.success('已提交企业信息，请耐心等待管理员审核')
                    props.eidtPageToAudit()
                  }
                  if (res.data.companys[0].auditStatus === 1) {
                    ElMessage.error('审核失败，请重新提交企业信息')
                    props.eidtPage2()
                  }
                  if (res.data.companys[0].auditStatus === 2) {
                    menu()
                  }
                }
              })
            }
          } else {
            ElMessage({
              message: h('p', null, [
                h('span', null, '您输入的登陆信息'),
                h('span', { style: 'color: #F56C6C' }, '不能为空')
              ])
            })
            errorClass.value = 'animate__animated animate__shakeX'
          }
        })
      } catch (err) {
        console.log(err)
      }
    }

    const menu = async () => {
      const role = await fetch({
        url: '/admin/menu',
        method: 'get'
      })
      if (role) {
        // eslint-disable-next-line no-empty
        // 这里的权限就很诡异
        if (!role.data) {
          ElMessage.error('您没有菜单权限，请联系管理员')
          return
        }
        if (!role.data[0].children) {
          ElMessage.info('您没有权限菜单,请联系管理员')
          return
        }
        const businessMap = role.data.find(
          (item: { name: string }) => item.name === '企业端'
        )
        if (businessMap.children && businessMap.children.length < 1) {
          ElMessage.info('您没有权限菜单,请联系管理员')
          return
        }
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
          push({ path: '/' })
        })
      }
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
      })
    }
    /**
     * 记住用户名和密码
     */
    // 存放cookie
    const setCookie = () => {
      if (checked.value) {
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
          }
        }
        if (keyvalue[0].trim() === 'radio') {
          console.log('radio', keyvalue[1])
          radio.value = keyvalue[1] == 'true' ? true : false
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
      //人机识别模块，只需初始化一次
      windows.AWSC.use("uab", function (state:any, uab:any) {
          if(state === "loaded") {
             //得到人机token
            headers.val.uaToken = uab.getUA();
          }
      });
      //设备指纹模块，得到设备token，只需初始化一次
      windows.AWSC.use("um", function (state:any, um:any) {
        if(state === "loaded") {
          um.init({
            //appName请直接使用'saf-aliyun-com'
            appName: 'saf-aliyun-com',
          }, function (initState:any, result:any) {
            if(initState === 'success') {
              headers.val.webUmidToken = result.tn;
            }
          });
        }
      });
      getCookie()
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
    watchEffect(() => {
      // if (form.username) {
      //   console.log(form.username)
      //   radio.value =
      //     localStorage.getItem(`radio_${form.username}`) &&
      //     localStorage.getItem(`radio_${form.username}`) == 'true'
      //       ? true
      //       : false || false
      //   console.log(radio.value)
      // }
    })

    return {
      wechatUrl,
      changeRadio,
      jumpRegisterr,
      getToken,
      showCode,
      getVerificationCode,
      loginForm,
      send,
      times,
      sendType,
      form,
      rules,
      login,
      current,
      formClass,
      addClass,
      checked,
      radio,
      errorClass,
      upCompanyIndex,
      menu,
      caroucelChange,
      ...toRefs(state),
      setCookie,
      getCookie,
      windows,
      headers,
      uabModule
    }
  }
})
</script>
<style scoped lang="less">
.loginTitle {
  color: #fff;
  text-align: center;

  .welcome {
    font-size: 4.8rem;
    font-weight: 200;
  }

  .name {
    margin: 3rem 0 5.4rem 0;
    font-size: 3.2rem;
    font-weight: 100;
  }
}

.login-form {
  :deep(.el-carousel__container) {
    height: 30rem;
  }

  :deep(.el-carousel__arrow) {
    .el-icon {
      width: 2rem;
      height: 2rem;

      svg {
        width: 2rem;
        height: 2rem;
      }
    }
  }

  :deep(.el-carousel__mask) {
    background: none;
  }

  :deep(.el-carousel) {
    width: 60rem;
  }

  :deep(.el-carousel__item h3) {
    color: #475669;
    font-size: 14px;
    opacity: 0.5;
    line-height: 200px;
    margin: 0;
    text-align: center;
  }

  //.activeCode
  :deep(.MhButtom.activeCode) {
    color: #fff;
    box-sizing: border-box;
    font-size: inherit;
    position: relative;
    vertical-align: middle;
    border-radius: 5rem;

    &::before,
    &::after {
      box-sizing: inherit;
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
    }

    &.center::before,
    &.center::after {
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      -webkit-transform-origin: center;
      transform-origin: center;
      border-radius: 5rem;
    }

    &.center::before {
      border-top: 0.2rem solid #fff;
      border-bottom: 0.2rem solid #fff;
      animation-name: borderAnamationTop;
      animation-duration: 0.5s;
    }

    &.center::after {
      border-left: 0.2rem solid #fff;
      border-right: 0.2rem solid #fff;
      animation-name: borderAnamation;
      animation-duration: 0.5s;
    }

    @keyframes borderAnamationTop {
      from {
        -webkit-transform: scale3d(0, 1, 1);
        transform: scale3d(0, 1, 1);
        border-radius: 5rem;
      }
      to {
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1);
        transition: -webkit-transform 0.5s;
        transition: transform 0.5s;
        transition: transform 0.5s, -webkit-transform 0.5s;
      }
    }
    @keyframes borderAnamation {
      from {
        -webkit-transform: scale3d(1, 0, 1);
        transform: scale3d(1, 0, 1);
      }
      to {
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1);
        transition: -webkit-transform 0.5s;
        transition: transform 0.5s;
        transition: transform 0.5s, -webkit-transform 0.5s;
      }
    }
  }

  :deep(.el-input) {
    width: 100%;
  }

  :deep(.el-input .el-input__inner) {
    height: 5rem !important;
    line-height: 5rem !important;
    width: 100% !important;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 3.2rem;
    color: rgba(255, 255, 255, 1);

    &::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }
  }

  :deep(.el-input__inner):focus {
    border: 1px solid rgba(255, 255, 255, 0.7) !important;
  }

  :deep(.el-input--medium .el-input__icon) {
    height: 5rem;
    line-height: 5rem;
  }

  :deep(.el-loading-spinner) {
    top: -1rem;
  }

  .loginbutton {
    width: 100%;
    border-radius: 10rem;
    line-height: 6rem;
    height: 6rem;
    font-size: 2rem;
    padding: 0;
    font-size: 600;
    color: @loginButtonColor;
  }

  .el-icon-right {
    margin: 0 0 0 1rem;
    font-weight: 600;
  }

  .form-flex-div-s :deep(.el-checkbox__inner) {
    margin: 0 0.5rem;
  }

  :deep(.el-checkbox__inner) {
    background: rgba(255, 255, 255, 0);
    border: 0.1rem solid rgba(255, 255, 255, 0.6);
  }

  :deep(.is-checked .el-checkbox__inner) {
    background: #fff;
  }

  :deep(.el-checkbox__inner::after) {
    border: 0.1rem solid #112c85;
    border-left: 0;
    border-top: 0;
    left: 0.3rem;
  }

  :deep(.el-input--prefix .el-input__inner) {
    padding-left: 6rem;
  }

  :deep(.el-checkbox__label) {
    display: inline-block;
    padding-left: 1rem;
    line-height: 1.9rem;
    font-size: 1.2rem;
    vertical-align: middle;
  }

  .forgetPassword-text {
    margin: 2rem 0;
  }
}

.addClass {
  border-bottom: none;
  color: #fff !important;
}

.loginSwitch {
  color: rgba(255, 255, 255, 0.4);
}

.my_company_select {
  display: grid;
  grid-template-columns: auto 200px auto;
  margin: 0 auto;
  justify-items: center;
  align-items: center;

  .iconfont {
    font-size: 2.5rem;
    float: left;
    line-height: 150px;
  }

  .companyLogo {
    width: 100px;
    height: 100px;
    transition: all 0.4s;
    text-align: center;
    border-radius: 0.6rem;
    background: #ffffff;
  }

  .companyName {
    text-align: center;
    line-height: 50px;
    color: #fff;
    position: relative;
    scrollbar-width: none; /* firefox */
    -ms-overflow-style: none; /* IE 10+ */
    transition: all 0.4s;
  }

  .companyInfo {
    width: 300px;
    height: 14rem;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
}

.wechat-code {
  height: 13.6rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
