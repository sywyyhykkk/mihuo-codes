// 输入菜单名称得到下面的按钮权限
import wsCache from '@/cache'
import { appStore } from '_@/store/modules/app'
// 权限标识 menuName
export const getPression = (menuName: string) => {
  const powerData = wsCache.get(appStore.powerInfo)
  return powerData[menuName] || ''
}
