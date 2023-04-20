import { fetch } from '_@/axios-config/axios'

interface RolePattern {
  size?: any
  current?: any
  parentId?: any
  employeeName?:any
  name?:any
  employeeTitle?:any
}
interface AddPattern {
  name?: any
  parentId?: any
  sort?: any
}
interface DeleteWrokerPattern {
  deptId?: any
}

export const companydeptPage = (params: any) => {
  return fetch({ url: 'admin/companydept/'+params, method: 'get' })
}
export const addDepartment = (data: any) => {
  return fetch({ url: '/admin/companydept', method: 'post', data })
}
export const eidtDepartment = (data: any) => {
  return fetch({ url: '/admin/companydept', method: 'put', data })
}
export const addUpdate = (data: AddPattern) => {
  return fetch({ url: '/admin/companydept/tree', method: 'put', data })
}
export const addUserPermissions = (data:any) => {
  return fetch({ url: '/admin/role/menu' , method: 'put', data })
}
export const getUserPermissions = (params:any) => {
  return fetch({ url: '/admin/menu/tree/'+ params, method: 'get' })
}
export const getcompanyPermissions = () => {
  return fetch({ url: '/admin/menu', method: 'get' })
}
export const addUser = (data: any) => {
  return fetch({ url: '/admin/companyemployee', method: 'post', data })
}
export const eidtUser = (data: any) => {
  return fetch({ url: '/admin/companyemployee', method: 'put', data })
}
export const deleteUser = (params: any) => {
  return fetch({ url: '/admin/companyemployee/'+params, method: 'delete' })
}
export const deleteRole = (params: any) => {
  return fetch({ url: `/admin/companydept/`+params, method: 'delete' })
}
export const treePage = () => {
  return fetch({ url: '/admin/companydept/tree', method: 'get' })
}
export const roleListPage = () => {
  return fetch({ url: 'admin/role/rolelist', method: 'get' })
}
export const userPage = (params:any) => {
  return fetch({ url: '/admin/companyemployee/page' +
      '', method: 'get', params })
}

