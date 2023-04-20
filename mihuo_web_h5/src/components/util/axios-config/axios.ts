import request from './request'
import wsCache from '@/cache'
import {appStore} from '_@/store/modules/app'
import config from './config'
import {AxiosPromise, ResponseType} from 'axios'
const {default_headers, api_version} = config
interface Config {
  params?: any
  data?: any
  url: string
  method: 'get' | 'post' | 'delete' | 'put'
  headersType?: string
  headers?: any
  responseType?: ResponseType
}

// @ts-ignore
function fetch({url, method, params, data, headers, headersType, responseType}: Config): AxiosPromise {
  const userInfo = wsCache.get(appStore.userInfoDetail)
  const type = url.indexOf('auth/oauth/token') > 0 ? 'application/x-www-form-urlencoded' : (headersType || default_headers)
  return request({
    url: url,
    method,
    params,
    data,
    responseType: responseType,
    headers: {
      ...headers,
      'Authorization': (!userInfo || url.indexOf('auth/oauth/token') > 0) ? `Basic ${getAuthorization(params.platformType)}` : userInfo.token_type + ' ' + userInfo.access_token,
      'Content-Type': type,
      'VERSION': api_version
    }
  })
}

function getAuthorization(type: any) {
  // 1->平台;2->企业;3->运营
  switch (type) {
    case 1:
      return 'cGxhdGZvcm06cGxhdGZvcm0'
    case 2:
      return 'Y29tcGFueXdlYjpjb21wYW55d2Vi'
    case 3:
      return 'Y2l0eW9wZXJhdG9yOmNpdHlvcGVyYXRvcg'
  }
}

export {fetch}
