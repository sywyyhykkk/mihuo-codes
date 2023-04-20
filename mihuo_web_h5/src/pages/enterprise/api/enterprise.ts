import { fetch } from '_@/axios-config/axios'

interface CompanyPattern {
  size?: any
  page?: any
  current?: any
  companyName?: any
  contactTel?: any
  socialCreditNo?: any
  provinceCode?: any
  cityCode?: any
  areaCode?: any
  auditStatus?: any
  templateType?: any
  showStatus?: number
}
interface AuditPattern {
  auditStatus?: number | undefined
  companyId?: number
  auditRemark?: string
}
interface RequirementconfigSave {
  id: number | string
  materialTemplateId: number | string
  requirementType: number | string
  requirementTypeName: number | string
  sopTemplateId: number | string
}

export const requirementconfigList = (params: CompanyPattern) => {
  return fetch({ url: '/order/requirementconfig/list', method: 'get', params })
}
export const reqSaveuirementconfigList = (data: RequirementconfigSave) => {
  return fetch({ url: '/order/requirementconfig', method: 'post', data })
}

export const company = (params: CompanyPattern) => {
  return fetch({ url: '/admin/company/page', method: 'get', params })
}
export const companyAudit = (params: AuditPattern) => {
  return fetch({ url: '/admin/company/audit', method: 'post', params })
}

export const reqSopTempLateList = (params: CompanyPattern) => {
  return fetch({ url: '/order/soptemplate/getList', method: 'get', params })
}
