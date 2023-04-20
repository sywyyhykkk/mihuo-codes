<template>
  <div class="form">
    <ul class="loginSwitch">
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
      <el-form-item
        v-if="!showCode"
        prop="username"
        label="手机号"
      >
        <el-input
          v-model="form.username"
          placeholder="请输手机号"
          style="width: 100%"
          class="form--input"
        />
      </el-form-item>
      <el-form-item
        v-if="!showCode"
        prop="password"
        label="密码"
      >
        <el-input
          v-model="form.password"
          show-password
          :minlength="3"
          :maxlength="18"
          placeholder="请输入密码"
          style="width: 100%"
          class="form--input"
        />
      </el-form-item>
      <el-form-item
        v-if="showCode"
        prop="username"
        label="手机号"
      >
        <el-input
          v-model="form.username"
          placeholder="请输手机号"
          class="form--input"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item
        v-if="showCode"
        prop="code"
        label="验证码"
      >
        <el-row>
          <el-col
            :span="16"
          >
            <el-input
              v-model="form.code"
              :maxlength="6"
              style="width: 22rem"
              placeholder="请输入验证码"
              class="form--input"
            />
          </el-col>
          <el-col
            :span="6"
            :offset="2"
          >
            <MhButtomVue
              title="获取验证码"
              @buttonClick="getVerificationCode"
            />
          </el-col>
        </el-row>
      </el-form-item>
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
            我已阅读并同意<span class="w" @click="openHandel('隐私协议')">《隐私协议》</span>和
            <span class="w" @click="openHandel('服务条款')">《服务条款》</span>
          </p>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts">
import MhButtomVue from '@/components/MhButtom/MhButtom.vue'
import { defineComponent, ref, reactive, unref, computed } from 'vue'
import { useStore } from 'vuex'
import { encryption } from '@/utils/utils'
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
    const times = ref<number>(60)
    const send = ref<string>('获取验证码')
    const showCode = ref<boolean>(false)
    const sendType = ref<boolean>(false)
    const checked = ref<boolean>(true)
    const radio = ref<boolean>(true)
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
      randomStr: ''
    })
    const rules = reactive<RulesModule>({
      username: [{ required: true, message: '请输入手机号' }],
      password: [{ required: true, message: '请输入密码' }],
      code: [{ required: true, message: '请输入验证码' }]
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
      loginForm.value.validateField('username', (valid: boolean) => {
        if (valid) {

        } else {
          getLoginCode()
        }
      })
    }
    const getLoginCode = async () => {
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
        }).catch((erro: any) => {
          ElMessage.warning(erro)
        })
    }

    async function login(): Promise<void> {
      const formWrap = unref(loginForm) as any
      if (!formWrap) return
      if (!radio.value) {
        ElMessage.info('请同意隐私政策和服务协议')
        return
      }
      try {
        formWrap.validate(async (valid: boolean) => {
          if (valid) {
            // 模拟登录接口之后返回角色信息
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
            const dataObj = {
              username: user.username,
              password: user.password,
              grant_type: 'password'
            }
            const res = (await fetch({
              url: '/auth/oauth/token',
              method: 'post',
              data: dataObj
            })) as Object
            wsCache.set(appStore.userInfoDetail, Object.assign(res))
            const role = await fetch({
              url: '/admin/menu',
              method: 'get'
            })
            if (role.data) {
              // eslint-disable-next-line no-empty
              const businessMap = role.data.find(
                (item: { name: string }) => item.name === '平台端'
              )
              if (!businessMap.children) {
                ElMessage.warning('您没有权限菜单,请联系管理员')
                wsCache.delete(appStore.userInfoDetail)
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
              })
            } else {
              ElMessage.error('用户没有可操作的权限')
            }
          }
        })
      } catch (err) {
        console.log(err)
      }
    }

    // 按钮权限更新
    const updatePermission = () => {
      fetch({ url: '/admin/user/info', method: 'get' }).then((res: any) => {
        if (res.code != 0) {
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

    return {
      // jumpRegister,
      openHandel,
      showCode,
      getVerificationCode,
      loginForm,
      form,
      rules,
      login,
      current,
      formClass,
      addClass,
      checked,
      radio
    }
  }
})
</script>
<style>
.addClass {
  border-bottom: 2px solid #ff5d35;
  color: #ff5d35 !important;
}
</style>
