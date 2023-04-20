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
      <el-form-item prop="userName" label="手机号">
        <el-input
          v-model="form.userName"
          placeholder="请输手机号"
          class="form--input"
        />
      </el-form-item>
      <el-form-item prop="code" label="验证码">
        <el-row>
          <el-col
            :span="16"
          ><el-input
            v-model="form.code"
            :maxlength="6"
            placeholder="请输入验证码"
            class="form--input"
          /></el-col>
          <el-col
            :span="6"
            :offset="2"
          ><MhButtomVue
            title="获取验证码"
            @buttonClick="getVerificationCode"
          /></el-col>
        </el-row>
      </el-form-item>
      <!-- <el-form-item>
        <div class="form-flex-div">
          <el-checkbox v-model="checked">记住登录状态</el-checkbox>
          <p class="forgetPassword-text">忘记密码?<span>注册账号</span></p>
        </div>
      </el-form-item> -->
      <el-form-item>
        <MhButtomVue title="注册" @buttonClick="login" />
      </el-form-item>
      <el-form-item>
        <div class="form-flex-div form-flex-div-s">
          <el-radio v-model="radio" label=" " />
          <p>
            我已阅读并同意<span class="w">《服务协议》</span>和<span
              class="w"
            >《隐私政策》</span>
          </p>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts">
import MhButtomVue from '@/components/MhButtom/MhButtom.vue'
import { defineComponent, ref, reactive, unref } from 'vue'
import { useRouter } from 'vue-router'
interface FormModule {
  userName: string
  code: string
}
interface RulesModule {
  userName: any[]
  code: any[]
}
export default defineComponent({
  components: {
    MhButtomVue
  },
  setup() {
    const router = useRouter()
    const getVerificationCode = () => {
      console.log('object :>> ')
    }
    const checked = ref<boolean>(false)
    const radio = ref<number>(2)
    const addClass = (x: number) => {
      current.value = x
      console.log('x :>> ', x)
    }
    const current = ref<number>(0)
    const formClass = reactive(['注册账号'])
    const loginForm = ref<HTMLElement | null>(null)
    const form = reactive<FormModule>({
      userName: '',
      code: ''
    })
    const rules = reactive<RulesModule>({
      userName: [{ required: true, message: '请输入手机号' }],
      code: [{ required: true, message: '请输入验证码' }]
    })
    async function login(): Promise<void> {
      const formWrap = unref(loginForm) as any
      if (!formWrap) return
      try {
        formWrap.validate(async(valid: boolean) => {
          if (valid) {
            router.push('/register')
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } catch (err) {
        console.log(err)
      } finally {
        console.log('finally')
      }
    }

    return {
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
