<template>
  <div class="form">
    <ul
      v-if="!cityOperatorStatus || cityOperatorList.length == 0"
      class="loginSwitch"
    >
      <li
        v-for="(item, index) in formClass"
        :key="index"
        @click="addClass(index)"
      >
        <span :class="[current === index ? 'addClass' : '']">{{ item }}</span>
      </li>
    </ul>
    <el-form
      ref="loginForm"
      :model="form"
      :rules="rules"
      class="login-form"
      label-width="60px"
    >
      <div v-if="!cityOperatorStatus || cityOperatorList.length == 0" class="c">
        <el-form-item v-if="!showCode" prop="username" label="手机号">
          <el-input
            v-model="form.username"
            placeholder="请输手机号"
            style="width: 100%"
            class="form--input"
          />
        </el-form-item>
        <el-form-item v-if="!showCode" prop="password" label="密码">
          <el-input
            v-model="form.password"
            style="width: 100%"
            show-password
            :minlength="3"
            :maxlength="18"
            placeholder="请输入密码"
            class="form--input"
          />
        </el-form-item>
        <el-form-item v-if="showCode" prop="username" label="手机号">
          <el-input
            v-model="form.username"
            placeholder="请输手机号"
            style="width: 100%"
            class="form--input"
          />
        </el-form-item>
        <el-form-item v-if="showCode" prop="code" label="验证码">
          <el-row>
            <el-col :span="16">
              <el-input
                v-model="form.code"
                :maxlength="6"
                style="width: 22rem"
                placeholder="请输入验证码"
                class="form--input"
              />
            </el-col>
            <el-col :span="6" :offset="2">
              <MhButtomVue
                title="获取验证码"
                @buttonClick="getVerificationCode"
              />
            </el-col>
          </el-row>
        </el-form-item>
      </div>
      <div
        v-if="cityOperatorStatus && cityOperatorList.length > 0"
        class="city-contain"
      >
        <div class="select-left">
          <el-icon class="iconfont" @click="selectOperator('left')">
            <arrow-left />
          </el-icon>
        </div>
        <div class="operator-contain">
          <ul ref="operatorItemContain" class="operator-item-contain">
            <li
              v-for="(item, index) in cityOperatorList"
              :key="index"
              :class="[operatorActiveIndex === index ? 'active' : '']"
              class="operator-item"
            >
              <img
                class="operator-logo"
                :src="$getUrl.getPicUrl(item.operatorLogo, true)"
                alt=""
              >
            </li>
          </ul>
          <p class="operator-name">{{ cityOperatorName }}</p>
        </div>
        <div class="select-right">
          <el-icon class="iconfont" @click="selectOperator('right')">
            <arrow-right />
          </el-icon>
        </div>
      </div>
      <el-form-item>
        <div class="form-flex-div">
          <el-checkbox v-model="checked">记住登录状态</el-checkbox>
          <p class="forgetPassword-text">
            <!--            忘记密码?<span @click="jumpRegister">注册账号</span>-->
          </p>
        </div>
      </el-form-item>
      <el-form-item>
        <MhButtomVue title="立即登录" @buttonClick="login" />
      </el-form-item>
      <el-form-item>
        <div class="form-flex-div form-flex-div-s">
          <el-checkbox v-model="radio" style="margin-right: 5px" />
          <p>
            我已阅读并同意<span
              class="w"
              @click="openHandel('隐私协议')"
            >《隐私协议》</span>和
            <span class="w" @click="openHandel('服务条款')">《服务条款》</span>
          </p>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts">
import MhButtomVue from '@/components/MhButtom/MhButtom.vue'
import {
  defineComponent,
  ref,
  reactive,
  unref,
  onMounted,
  computed,
  toRefs
} from 'vue'
import { useStore } from 'vuex'
import { encryption, thumbnailImage } from '@/utils/utils'
import { fetch } from '_@/axios-config/axios'
import wsCache from '@/cache'
import { appStore } from '_@/store/modules/app'
import { permissionStore } from '_@/store/modules/permission'
import { RouteRecordRaw, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

interface FormModule {
  username: string
  password: string
  code: string
  randomStr: string
  operatorId: string
}

interface RulesModule {
  username: any[]
  password: any[]
  code: any[]
}

export default defineComponent({
  components: {
    MhButtomVue
  },
  setup() {
    // const { proxy } = getCurrentInstance()
    const { push, addRoute } = useRouter()
    const store = useStore()
    // const jumpRegister = () => {
    //   const register = computed(() => store.getters['form/getRegister'])
    //   store.commit('form/setRegister', !register.value)
    // }
    const operatorActiveIndex = ref(0)
    const operatorItemContain = ref<HTMLElement | null>(null)
    const cityOperatorList = ref<any>([])
    const cityOperatorStatus = ref<any>(false)
    const cityOperatorName = ref<any>('')
    const showCode = ref<boolean>(false)
    const times = ref<number>(60)
    const send = ref<string>('获取验证码')
    const checked = ref<boolean>(true)
    const radio = ref<boolean>(true)
    const sendType = ref<boolean>(false)
    const addClass = (x: number) => {
      current.value = x
      showCode.value = x !== 0
    }
    const current = ref<number>(0)
    const formClass = reactive(['登录账号', '验证码登录'])
    const loginForm = ref<any>('')
    const form = reactive<FormModule>({
      username: '',
      password: '',
      code: '',
      randomStr: '',
      operatorId: ''
    })
    const openHandel = (val: any) => {
      if (val == '隐私协议') {
        window.open('https://www.51mihuo.com/Server.html', '觅活隐私协议')
      }
      if (val == '服务条款') {
        window.open('https://www.51mihuo.com/Server.html', '觅活服务条款')
      }
    }
    const getVerificationCode = () => {
      if (sendType.value) {
        return
      }
      loginForm.value.validateField('username', (valid: boolean) => {
        if (!valid) {
          getLoginCode()
        }
      })
    }

    const getLoginCode = async () => {
      await fetch({
        url: 'admin/mobile/' + form.username + '/SMSLOGIN',
        method: 'get'
      }).then((res: any) => {
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
    }

    const getThumbnailImage = (url: any) => {
      return thumbnailImage(url, false)
    }
    const rules = reactive<RulesModule>({
      username: [{ required: true, message: '请输入手机号' }],
      password: [{ required: true, message: '请输入密码' }],
      code: [{ required: true, message: '请输入验证码' }]
    })

    async function login(): Promise<void> {
      const formWrap = unref(loginForm) as any
      const newRadio = unref(loginForm) as any
      // console.log(formWrap)
      if (!formWrap) return
      if (!radio.value) {
        ElMessage.info('请同意隐私政策和服务协议')
        return
      }
      try {
        formWrap.validate(async (valid: boolean) => {
          if (valid) {
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
            if (cityOperatorStatus.value) {
              // 选择运营商之后
              const dataObj = {
                username: user.username,
                password: user.password,
                grant_type: 'password',
                operatorId: form.operatorId
              }
              await fetch({
                url: '/auth/oauth/token',
                method: 'post',
                data: dataObj,
                showErrorMessage: false
              }).then((res: any) => {
                wsCache.set(appStore.userInfoDetail, Object.assign(res)) // 保存登录用户信息
                wsCache.set(
                  appStore.cityOperator,
                  cityOperatorList.value[operatorActiveIndex.value]
                ) // 保存登录运营商信息
                getMenu()
              })
            } else {
              // 未选择运营商时
              let dataObj: any = {
                username: user.username,
                password: user.password,
                grant_type: 'password'
              }
              if (current.value === 1) {
                dataObj = {
                  mobile: user.username,
                  code: form.code,
                  grant_type: 'sms_code'
                }
              }
              await fetch({
                url: `/auth/oauth/token`,
                method: 'post',
                data: dataObj,
                showErrorMessage: false
              }).then((res: any) => {
                if (res) {
                  cityOperatorList.value = res.mData || []
                  if (res.data === 'unbind_choice_operator' && res.mData) {
                  } else {
                    ElMessage.error(res.msg)
                  }
                  if (cityOperatorList.value.length === 1) {
                    form.operatorId = cityOperatorList.value[0].id
                    cityOperatorStatus.value = true
                    cityOperatorName.value = cityOperatorList.value[0].name
                    login()
                  } else if (cityOperatorList.value.length > 1) {
                    form.operatorId =
                      cityOperatorList.value[operatorActiveIndex.value].id
                    cityOperatorStatus.value = true
                    cityOperatorName.value = cityOperatorList.value[0].name
                  }
                } else {
                  wsCache.set(appStore.userInfoDetail, Object.assign(res)) // 保存登录用户信息
                  if (res && res.msg) {
                    console.log(res)
                  } else {
                    getMenu()
                  }
                }
              })
            }
          } else {
            return false
          }
        })
      } catch (err) {
        console.log(err)
      }
    }

    const getMenu = async () => {
      const role = await fetch({
        url: '/admin/menu',
        method: 'get'
      })
      if (role) {
        if (!role.data) {
          ElMessage.warning({
            message: '请配置菜单',
            type: 'warning'
          })
          return
        }
        const businessMap = role.data.find(
          (item: { name: string }) => item.name === '运营端'
        )
        if (!businessMap.children) {
          ElMessage.warning('您没有权限菜单,请联系管理员')
          cityOperatorStatus.value = false
          form.operatorId = ''
          cityOperatorName.value = ''
          wsCache.delete(appStore.userInfoDetail)
          return
        }
        form.password = ''
        form.operatorId = ''
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
    }
    // 按钮权限更新
    const updatePermission = () => {
      fetch({ url: '/admin/user/info', method: 'get' }).then((res: any) => {
        if (res.code !== 0) {
          ElMessage.error(res.msg)
          return
        }
        const tokenData = wsCache.get(appStore.userInfoDetail)
        wsCache.set(appStore.userInfoDetail, Object.assign(tokenData, res.data))
        const list = {}
        for (let i = 0; i < res.data.permissions.length; i++) {
          list[res.data.permissions[i]] = true
        }
        wsCache.set(appStore.powerInfo, list)
        push({ path: '/guide' })
      })
    }

    const selectOperator = (val: any) => {
      const oBtn = operatorItemContain.value as HTMLInputElement
      if (val === 'left') {
        if (operatorActiveIndex.value > 0) {
          operatorActiveIndex.value--
          oBtn.style.left =
            Number(oBtn.style.left.replace('px', '') as any) + 70 + 'px'
        }
      } else {
        if (operatorActiveIndex.value < cityOperatorList.value.length - 1) {
          operatorActiveIndex.value++
          oBtn.style.left =
            (oBtn.style.left.replace('px', '') as any) - 70 + 'px'
        }
      }
      form.operatorId = cityOperatorList.value[operatorActiveIndex.value].id
      cityOperatorName.value =
        cityOperatorList.value[operatorActiveIndex.value].name
    }

    return {
      // jumpRegister,
      openHandel,
      times,
      send,
      sendType,
      cityOperatorName,
      showCode,
      operatorItemContain,
      getVerificationCode,
      loginForm,
      form,
      rules,
      login,
      current,
      formClass,
      addClass,
      selectOperator,
      getThumbnailImage,
      getMenu,
      checked,
      radio,
      cityOperatorList,
      cityOperatorStatus,
      operatorActiveIndex
      // ...toRefs(cityOperator)
    }
  }
})
</script>
<style lang="less" scoped>
.addClass {
  border-bottom: 2px solid #ff5d35;
  color: #ff5d35 !important;
}

.city-contain {
  min-height: 150px;
  width: 400px;
  display: grid;
  grid-template-columns: auto 200px auto;
  margin: 0 auto;

  justify-items: center;
  align-items: center;

  .operator-contain {
    position: relative;
    width: 210px;
    overflow: hidden;

    .operator-item-contain {
      width: 7000px;
      padding: 0;
      list-style: none;
      position: absolute;
      transition: all 0.2s;
      left: 0;
      margin-left: 70px;
      overflow-y: hidden;
    }

    .operator-item {
      float: left;
      position: relative;
      scrollbar-width: none; /* firefox */
      -ms-overflow-style: none; /* IE 10+ */
      transition: all 0.2s;
      width: 70px;
      text-align: center;

      .operator-logo {
        width: 45px;
        height: 45px;
        transition: all 0.2s;
      }
    }

    .active {
      .operator-logo {
        width: 60px;
        height: 60px;
      }
    }

    .operator-name {
      position: relative;
      clear: both;
      text-align: center;
      margin-top: 70px;
      margin-bottom: 0;
    }
  }

  .select-right,
  .select-left {
    cursor: pointer;
  }

  .operator-name {
    font-size: 1.4rem;
  }

  .iconfont {
    font-size: 30px;
    color: #8c939d;
  }
}

::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
</style>
