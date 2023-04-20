import request from './request'
import wsCache from '@/cache'
import { appStore } from '_@/store/modules/app'
import config from './config'
import { AxiosPromise, ResponseType } from 'axios'

const { default_headers, api_version, request_timeout } = config

interface Config {
  timeout?: number,
  params?: any
  data?: any
  url: string
  method: 'get' | 'post' | 'delete' | 'put'
  headersType?: string
  headers?: any
  responseType?: ResponseType
  showErrorMessage?: boolean
}

// @ts-ignore
function fetch({ url, method, params, data, headers, headersType, responseType, showErrorMessage, timeout = 0 }: Config): AxiosPromise {
  const userInfo = wsCache.get(appStore.userInfoDetail)
  const type = url.indexOf('auth/oauth/token') > 0 ? 'application/x-www-form-urlencoded' : (headersType || default_headers)
  return request({
    url: url,
    method,
    params,
    data,
    timeout: timeout || request_timeout,
    responseType: responseType,
    headers: {
      ...headers,
      'showErrorMessage': typeof showErrorMessage === 'undefined' ? true : !!showErrorMessage,
      'Authorization': (!userInfo || url.indexOf('auth/oauth/token') > 0) ? 'Basic Y2l0eW9wZXJhdG9yOmNpdHlvcGVyYXRvcg==' : userInfo.token_type + ' ' + userInfo.access_token,
      'Content-Type': type,
      'VERSION': api_version
    }
  })
}

const { result_code, base_url } = config
const PATH_URL: string = base_url[process.env.VUE_APP_CURENV as string]
export { fetch, PATH_URL }
