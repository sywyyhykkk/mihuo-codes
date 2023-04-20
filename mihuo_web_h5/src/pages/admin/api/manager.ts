import { fetch } from '_@/axios-config/axios'

interface PropsData {
  params?: any
  data?: any
}
interface projectPattern {
  size?:number
  current?:number
  roleType?:string
}
interface AuditPattern {
  auditStatus?:number | undefined
  skillId?:number
}
export const loginApi = ({ data }: PropsData) => {
  return fetch({ url: '/auth/oauth/token', method: 'post', data })
}
export const projectManager = (params : projectPattern) => {
  return fetch({ url: '/admin/person/page', method: 'get', params })
}
export const skillAuth = ({ data }: PropsData) => {
  return fetch({ url: '/admin/skillauth/audit', method: 'post', data })
}
