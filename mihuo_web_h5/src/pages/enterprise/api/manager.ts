import { fetch } from '_@/axios-config/axios'

interface PropsData {
  params?: any
  data?: any
}
interface projectPattern {
  size?:any
  page?:any
  managerName?:any
  auditStatus?:any
  roleType?:String
}
// interface AuditPattern {
//   auditStatus?:number | undefined
//   skillId?:number
// }
export const loginApi = ({ data }: PropsData) => {
  return fetch({ url: '/auth/oauth/token', method: 'post', data })
}

export const projectmanager = (params : projectPattern) => {
  return fetch({ url: '/admin/companyworker/page', method: 'get', params })
}
export const skillauth = ({ data }: PropsData) => {
  return fetch({ url: '/basic/skillauth/audit', method: 'post', data })
}
