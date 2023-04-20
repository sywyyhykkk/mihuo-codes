/**
 * element配置
 */
// export interface ConfigElement {
//   zIndex: number
//   size: 'medium' | 'small' | 'mini'
//
const isdone = true

export interface ConfigElement<T> {
  zIndex: number
  size: 'medium' | 'small' | 'mini'
  arr: Array<T>
}
