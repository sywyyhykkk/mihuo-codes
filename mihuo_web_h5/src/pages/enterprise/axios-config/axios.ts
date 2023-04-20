import request from './request'
import wsCache from '@/cache'
import { appStore } from '_@/store/modules/app'
import config from './config'

import { AxiosPromise, ResponseType } from 'axios'

const { default_headers, api_version, base_url, request_timeout } = config

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
export const fetch = function({ url, method, params, data, headers, headersType, responseType, showErrorMessage, timeout = 0 }: Config): AxiosPromise {
  const userInfo = wsCache.get(appStore.userInfoDetail)
  const appToken = wsCache.get('appToken')
  let token = (!userInfo || url.indexOf('auth/oauth/token') > 0) ? 'Basic Y29tcGFueXdlYjpjb21wYW55d2Vi' : userInfo.token_type + ' ' + userInfo.access_token
  if (appToken) {
    token = 'Basic YXBwOmFwcA=='
  }
  const type = url.indexOf('auth/oauth/token') > -1 ? 'application/x-www-form-urlencoded' : (headersType || default_headers)
  // console.log(showErrorMessage, typeof showErrorMessage === 'undefined' ? true : showErrorMessage ? true : false)
  // let messageType: boolean = typeof showErrorMessage === 'undefined' ? true : showErrorMessage ? true : false
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
      'Authorization': token,
      'Content-Type': type,
      'Version': api_version
      // 'Version': 'qzf'
    }
  })
}

