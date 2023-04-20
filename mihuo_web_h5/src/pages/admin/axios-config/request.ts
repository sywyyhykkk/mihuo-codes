import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

import { Message } from '_c/Message'

import qs from 'qs'

import config from './config'
import wsCache from '@/cache'
import { appStore } from '_@/store/modules/app'
import { resetRouter } from '_@/router'
import { tagsViewStore } from '_@/store/modules/tagsView'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

// const { replace } = useRouter()

const { result_code, base_url } = config

const PATH_URL: string = base_url[process.env.VUE_APP_CURENV as string]

// 创建axios实例
const service: AxiosInstance = axios.create({
  timeout: config.request_timeout // 请求超时时间
})
let showErrorMessage: boolean

// request拦截器
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    showErrorMessage = config.headers?.showErrorMessage
    if (config.method === 'post' && config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      config.data = qs.stringify(config.data)
    }
    return config
  },
  (error: AxiosError) => {
    // Do something with request error
    console.log('error:' + error) // for debug
    Promise.reject(error)
  }
)

async function loginOut(): Promise<void> {
  // wsCache.clear()
  wsCache.delete(appStore.userInfo)
  useRouter().replace('/login')// 跳到首页
  await resetRouter() // 重置静态路由表
  await tagsViewStore.delAllViews() // 删除所有的tags标签页
}

// response 拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data.code === result_code || !response.data.code) {
      return response.data
    } else {
      response.config.headers.showErrorMessage && Message.error(response.data.message || response.data.msg)
      return response.data
    }
  },
  (error: AxiosError) => {
    const errorData: any = error.response?.data
    if (error.response?.status === 401) {
      loginOut()
    }
    if (error.response?.status === 424) {
      loginOut()
      error.config.headers.showErrorMessage && ElMessage.warning('登录过期，请重新登录！')
    }
    if (error.response?.status === 426) {
      ElMessage.error(errorData.msg)
    }
    if (error.response?.status === 502) {
      loginOut()
      ElMessage.warning('服务器连接中断了，请稍后重试！')
    }
    if (error.response?.status === 503) {
      ElMessage.warning('服务器连接中断了，请稍后重试！')
    }
    if (error.response?.status === 500 && !errorData.msg) {
      error.config.headers.showErrorMessage && ElMessage.warning('服务器连接超时，请稍后再试！')
    }
    if ((error.response?.status != 200 || errorData.code == 1) && errorData.msg) {
      error.config.headers.showErrorMessage && Message.error(error.response?.data.msg)
    }
    console.log(errorData.code)
    return Promise.reject(error)
  }
)

export default service
