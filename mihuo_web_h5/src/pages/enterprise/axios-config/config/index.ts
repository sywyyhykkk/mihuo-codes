/**
 * request全局配置
 */
import { ConfigOptions } from './types'

const config: ConfigOptions = {
  /**
   * api请求基础路径
   */
  base_url: {
    // 开发环境接口前缀
    dev: 'http://mihuo-gateway:9999/',
    // 生产环境接口前缀
    pro: '',
    // 测试环境接口前缀
    test: ''
  },

  /**
   * 接口成功返回状态码
   */
  result_code: 0,

  /**
   * 接口请求超时时间
   */
  request_timeout: 5000,

  /**
   * 默认接口请求类型
   * 可选值：application/x-www-form-urlencoded multipart/form-data
   */
  default_headers: 'application/json; charset=UTF-8',
  api_version: 'A'
}

export default config
