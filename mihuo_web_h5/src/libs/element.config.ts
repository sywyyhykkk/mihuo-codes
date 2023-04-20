/**
 * 为了保持多页element组件的样式统一，提供全局配置的方法。
 */

import { ConfigElement } from '@/libs/types'

const elementConfig: ConfigElement<string> = {
  /**
   * 尺寸
   */
  size: 'medium',
  arr: ['ggg'],

  /**
   * 层级
   */
  zIndex: 2000
}
export default elementConfig
