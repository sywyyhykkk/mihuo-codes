import { fetch } from '_@/axios-config/axios'

interface PropsData {
  params?: any
  data?: any
}
interface CompanyPattern {
  size?: any
  current?: any
  companyName?: any
  contactTel?: any
  socialCreditNo?: any
  provinceCode?: any
  cityCode?: any
  areaCode?: any
  auditStatus?: any
}

interface WorkersObject {
  size?: number
  current?: number
  roleType?: string
}

interface workersAuditObject {
  auditRemark?: string
  auditStatus?: number
  personId?: number
  orderStatus?: number
}

interface userauthAuditObject {
  userAuthId?: any
  auditStatus?: any
  auditRemark?: any
}

interface companyAuditObject {
  auditRemark?: string
  auditStatus?: number
  companyId?: number
}

interface authenticationObj {
  size?: any
  current?: any
  username?: any
  idcard?: any
  auditStatus?: any
}
export const loginApi = ({ data }: PropsData) => {
  return fetch({ url: '/auth/oauth/token', method: 'post', data })
}
// 企业审核列表
export const company = (params: CompanyPattern) => {
  return fetch({ url: '/admin/company/page', method: 'get', params })
}
// 企业审核
export const companyAudit = (data: companyAuditObject) => {
  return fetch({ url: '/admin/company/audit', method: 'post', data })
}

// 工人、项目经理、监理  审核列表
export const workers = (params: any) => {
  return fetch({ url: '/admin/person/page', method: 'get', params })
}

// 工人、项目经理、监理 审核
export const workersAudit = (data: workersAuditObject) => {
  return fetch({ url: '/admin/person/skillaudit', method: 'post', data })
}

// 实名认证列表
export const authentication = (params: authenticationObj) => {
  return fetch({ url: '/admin/userauth/page', method: 'get', params })
}

// 实名认证
export const userauthAudit = (data: userauthAuditObject) => {
  return fetch({ url: '/admin/userauth/audit', method: 'post', data })
}
