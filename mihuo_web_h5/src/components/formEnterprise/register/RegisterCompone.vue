<template>
  <div class="form">
    <div class="loginTitle">
      <div class="welcome">Welcome to MiHuo</div>
      <div class="name">工程交付塔台系统</div>
    </div>
    <!-- <ul class="loginSwitch">
      <li
        v-for="(item, index) in formClass"
        :key="index"
        @click="addClass(index)"
      >
        <span :class="[current === index ? 'addClass' : '']">{{ item }}</span>
      </li>
    </ul> -->
    <el-form
      ref="loginForm"
      :model="form"
      :rules="rules"
      class="login-form"
      label-width="6rem"
    >
      <el-form-item prop="username">
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
            </i> </template
        ></el-input>
      </el-form-item>
      <el-form-item prop="password" style="margin: 3.6rem 0">
        <el-input
          v-model="form.password"
          placeholder="请输入密码"
          show-password
          :minlength="3"
          :maxlength="18"
          class="form--input"
        >
          <template #prefix>
            <i style="display: flex; align-items: center">
              <img
                style="width: 1.8rem; height: 1.8rem; margin: 1.6rem 2rem"
                src="@/assets/img/login_password.png"
                alt
              />
            </i>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input
          v-model="form.confirmPassword"
          placeholder="请输入确认密码"
          show-password
          :minlength="3"
          :maxlength="18"
          class="form--input"
        >
          <template #prefix>
            <i style="display: flex; align-items: center">
              <img
                style="width: 1.8rem; height: 1.8rem; margin: 1.6rem 2rem"
                src="@/assets/img/login_password.png"
                alt
              />
            </i>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="code" style="margin: 3.6rem 0 2.5rem 0">
        <el-row style="width: 100%">
          <el-col :span="16">
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
          <el-col :span="7" :offset="1">
            <MhButtomVue
              :class="{ activeCode: activeCode, center: activeCode }"
              :title="send"
              @buttonClick="getVerificationCode"
            />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
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
          >注册</el-button
        >
        <div class="forgetPassword-text" @click="jumpRegister">
          已有账号？<span class="r">立即登录</span>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts">
import MhButtomVue from '@/components/MhButtom/MhButtom.vue'
import { defineComponent, ref, reactive, unref, watch, toRefs, h } from 'vue'
import { useRouter } from 'vue-router'
import { isPhone } from '@/utils/validate'
import { fetch } from '_@/axios-config/axios'
import { ElMessage } from 'element-plus'
import wsCache from '@/cache'
import { appStore } from '_@/store/modules/app'
import { encryption } from '@/utils/utils'

interface FormModule {
  username: string
  code: string
  password: string | number
  confirmPassword: string | number
}

interface RulesModule {
  username: any[]
  code: any[]
  password: any[]
  confirmPassword: any[]
}

export default defineComponent({
  components: {
    MhButtomVue,
  },
  props: {
    modelValue: {
      type: Number || String,
      default: '',
    },
    eidtPage: {
      type: Function,
      default: null,
    },
    jumpRegister: {
      type: Function,
      default: null,
    },
  },
  // emits: ['eidtPage'], // click事件没有检验
  setup(props, { emit }) {
    const router = useRouter()
    const send = ref<string>('获取验证码')
    const times = ref<number>(60)
    const sendType = ref<boolean>(false)
    const state = reactive({
      activeCode: false,
    })
    const getVerificationCode = async () => {
      if (!state.activeCode) return
      if (sendType.value) {
        return
      }
      await fetch({
        url: 'admin/mobile/' + form.username + '/SMSREGISTER',
        method: 'get',
      }).then((res: any) => {
        if (res.data) {
          ElMessage.success({
            message: '短信已发送，请注意查收',
            type: 'success',
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
        } else {
          /**
           * 此处错误信息提示，接口封装处已处理，避免二次提示
           */
          // ElMessage.error(res.msg)
        }
      })
    }
    const checked = ref<boolean>(false)
    const radio = ref<boolean>(false)
    const addClass = (x: number) => {
      current.value = x
      console.log('x :>> ', x)
    }
    const current = ref<number>(0)
    const formClass = reactive(['注册账号'])
    const loginForm = ref<HTMLElement | null>(null)
    const form = reactive<FormModule>({
      username: '',
      code: '',
      password: '',
      confirmPassword: '',
    })
    const phoneValidator = (rule: any, value: any, callback: any) => {
      if (!value) {
        callback(new Error('请输入确认密码'))
      } else if (form.password !== form.confirmPassword) {
        callback(new Error('确认密码错误'))
      } else {
        callback()
      }
    }
    const rules = reactive<RulesModule>({
      username: [{ required: true, message: ' ' }],
      code: [{ required: true, message: ' ' }],
      password: [{ required: true, message: ' ' }],
      confirmPassword: [{ required: true, message: ' ' }],
    })
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
        param: ['password'],
      })
      const dataObj = {
        username: user.username,
        password: user.password,
        grant_type: 'password',
      }
      await fetch({
        url: '/auth/oauth/token',
        method: 'post',
        data: dataObj,
      }).then((res: any) => {
        if (res.code === 'L0002') {
          ElMessage.warning('请完善企业信息')
          wsCache.set('appToken', true)
          getToken()
        } else {
          wsCache.set(appStore.userInfoDetail, Object.assign(res))
          emit('update:modelValue', user.username)
          props.eidtPage()
        }
      })
    }

    async function login(): Promise<void> {
      const formWrap = unref(loginForm) as any
      if (!formWrap) return
      try {
        formWrap.validate(async (valid: boolean) => {
          if (valid) {
            if (!radio.value) {
              ElMessage.info('请同意隐私政策和服务协议')
              return
            }
            const dataObj = {
              username: form.username,
              password: form.password,
              code: form.code,
              recommend: '',
            }
            await fetch({
              url: '/admin/user/register',
              method: 'post',
              data: dataObj,
            })
              .then((res: any) => {
                // router.push('/register')
                if (!res.data) {
                  /**
                   * 此处错误信息提示，接口封装处已处理
                   */
                  // ElMessage.error(res.msg)
                } else {
                  getToken()
                }
              })
              .catch((erro) => {
                console.log(erro)
              })
          } else {
            ElMessage({
              message: h('p', null, [
                h('span', null, '请完善您的'),
                h('span', { style: 'color: #F56C6C' }, '注册信息'),
              ]),
            })
            return false
          }
        })
      } catch (err) {
        console.log(err)
      }
    }
    const jumpRegisterr = () => {
      // const register = computed(() => store.getters['form/getRegister'])
      // store.commit('form/setRegister', !register.value)

      props.jumpRegister()
    }
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

    return {
      getVerificationCode,
      loginForm,
      form,
      jumpRegisterr,
      rules,
      send,
      times,
      sendType,
      login,
      current,
      formClass,
      addClass,
      checked,
      radio,
      ...toRefs(state),
      getToken,
    }
  },
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
  :deep(.el-input__inner) {
    height: 5rem;
    line-height: 5rem;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 3.2rem;
    color: rgba(255, 255, 255, 1);
    &::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }
  }
  :deep(.el-input--medium .el-input__inner):focus {
    border: 1px solid #fff;
  }
  :deep(.el-input--medium .el-input__icon) {
    height: 5rem;
    line-height: 5rem;
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
  :depp(.el-checkbox__label) {
    display: inline-block;
    padding-left: 1rem;
    line-height: 1.9rem;
    font-size: 1.2rem;
  }
  .forgetPassword-text {
    margin: 2rem 0;
  }
}
.addClass {
  border-bottom: 0.2rem solid rgba(255, 255, 255, 0.6);
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
  }

  .companyName {
    text-align: center;
    line-height: 50px;
    position: relative;
    scrollbar-width: none; /* firefox */
    -ms-overflow-style: none; /* IE 10+ */
    transition: all 0.4s;
  }

  .companyInfo {
    float: left;
    width: 300px;
    height: 150px;
    text-align: center;
  }
}
</style>
