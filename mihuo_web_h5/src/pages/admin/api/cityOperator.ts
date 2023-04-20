import { fetch } from '_@/axios-config/axios'

//新增运营商
export const addCityOperator = (data: any) => {
  return fetch({ url: '/admin/cityoperator/create', method: 'post', data })
}

//分页查询
export const selectCityOperatorPage = (params: any) => {
  return fetch({ url: '/admin/cityoperator/page', method: 'get', params })
}

//删除基础节点
export const deleteCityOperator = (params: any) => {
  return fetch({ url: `/admin/cityoperator/delete/${params.id}`, method: 'post'})
}

//修改基础节点
export const updateCityOperatorPage = (data: any) => {
  return fetch({ url: '/admin/cityoperator/update', method: 'post', data })
}

// 分页查询用户
export const selectUserPage = (params: any) => {
  return fetch({ url: '/admin/user/page', method: 'get', params })
}

// 绑定人员
export const addUserPage = (data: any) => {
  return fetch({ url: '/admin/cityoperator/addUser', method: 'post', data })
}

// 解除人员绑定
export const removeUser = (params: any) => {
  return fetch({ url: `/admin/cityoperator/removeUser`, method: 'post', params })
}

// 通过城市运营id查询绑定用户
export const selectCityOperatorList = (params: any) => {
  return fetch({ url: `/admin/cityoperator/list/${params.id}`, method: 'get'})
}





