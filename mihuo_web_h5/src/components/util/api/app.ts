import { fetch } from '_c/util/axios-config/axios'

/**
 *  素材分类
 * **/
// 退出登陆

export const loginOut=()=>{
  return fetch({ url: '/auth/token/logout', method: 'delete'})
}

