<template>
  <div class="login-wrap" @keydown.enter="login">
    <div class="login-con">
      <el-card class="box-card">
        <template #header>
          <span class="login--header">登录</span>
        </template>
        <el-form
          ref="loginForm"
          :model="form"
          :rules="rules"
          class="login-form"
        >
          <el-form-item prop="userName">
            <el-input
              v-model="form.userName"
              placeholder="请输入账号  or test"
              class="form--input"
            >
              <template #prefix>
                <span class="svg-container">
                  <svg-icon icon-class="user" />
                </span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="passWord">
            <el-input
              v-model="form.passWord"
              show-password
              :minlength="3"
              :maxlength="18"
              placeholder="请输入密码  or test"
              class="form--input"
            >
              <template #prefix>
                <span class="svg-container">
                  <svg-icon icon-class="password" />
                </span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              type="primary"
              class="login--button"
              @click="login"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, unref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { permissionStore } from '_@/store/modules/permission'
import { appStore } from '_@/store/modules/app'
import wsCache from '@/cache'
import { ElNotification } from 'element-plus'

import { loginApi, getRoleDetApi } from './api'
import Obj = echarts.EChartOption.Tooltip.Position.Obj

interface FormModule {
  userName: string
  passWord: string
}
interface RulesModule {
  userName: any[]
  passWord: any[]
}

export default defineComponent({
  name: 'Login',
  setup() {
    const { push, addRoute, currentRoute } = useRouter()
    const loginForm = ref<HTMLElement | null>(null)
    const loading = ref<boolean>(false)
    const redirect = ref<string>('')
    watch(
      () => {
        return currentRoute.value
      },
      (route) => {
        redirect.value = (route.query && route.query.redirect) as string
      },
      {
        immediate: true,
      }
    )
    const form = reactive<FormModule>({
      userName: '',
      passWord: '',
    })
    const rules = reactive<RulesModule>({
      userName: [{ required: true, message: '请输入账号' }],
      passWord: [{ required: true, message: '请输入密码' }],
    })
    async function login(): Promise<void> {
      const formWrap = unref(loginForm) as any
      if (!formWrap) return
      loading.value = true
      try {
        formWrap.validate(async (valid: boolean) => {
          if (valid) {
            // 模拟登录接口之后返回角色信息
            const res = await loginApi({ data: form })
            if (res) {
              // 获取权限信息
              const role = await getRoleDetApi({
                params: {
                  id: res.data.roleId,
                },
              })
              if (role) {
                wsCache.set(appStore.userInfo, Object.assign(form, role.data))
                permissionStore.GenerateRoutes().then(() => {
                  permissionStore.addRouters.forEach(
                    async (route: RouteRecordRaw) => {
                      await addRoute(route.name!, route) // 动态添加可访问路由表
                    }
                  )
                  permissionStore.SetIsAddRouters(true)
                  push({ path: redirect.value || '/' })
                })
              }
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } catch (err) {
        console.log(err)
      } finally {
        loading.value = false
      }
    }

    ElNotification({
      title: '提示',
      message:
        '这是测试的mock提供的登陆暂时使用admin/admin，查看效果后期在网络请求那里配置成为自己的接口就行',
      duration: 60000,
    })

    return {
      loginForm,
      loading,
      redirect,
      form,
      rules,
      login,
    }
  },
})
</script>

<style lang="less" scoped>
.login-wrap {
  width: 100%;
  height: 100%;
  background-image: url('~@/assets/img/login-bg.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
  .box-card {
    width: 400px;
    .login--header {
      font-size: 24px;
      font-weight: 600;
    }
    .svg-container {
      color: #889aa4;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }
    .form--input {
      width: 100%;
      @{deep} .el-input__inner {
        padding-left: 40px;
      }
    }
    .login--button {
      width: 100%;
    }
  }
  .login-con {
    position: absolute;
    right: 160px;
    top: 50%;
    transform: translateY(-60%);
  }
}
</style>
