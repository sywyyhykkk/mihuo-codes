import { fetch } from '_@/axios-config/axios'

interface RolePattern {
  size?: any
  current?: any
  roleName?: any
  roleCode?: any
  dsType?: any
}
interface AddRolePattern {
  roleName?: any
  roleCode?: any
  roleDesc?: any
  dsType?: any
  roleId?:any
}
interface DeleteWrokerPattern {
  roleId?: any
}

export const rolePage = (params: any) => {
  return fetch({ url: '/admin/role/page', method: 'get', params })
}
export const addRole = (data: AddRolePattern) => {
  return fetch({ url: '/admin/role', method: 'post', data })
}
export const addUpdate = (data: AddRolePattern) => {
  return fetch({ url: '/admin/role', method: 'put', data })
}
export const deleteRole = (params: DeleteWrokerPattern) => {
  return fetch({ url: `/admin/role/${params}`, method: 'delete' })
}
