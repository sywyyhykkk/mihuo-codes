import { fetch } from '_@/axios-config/axios'

interface PropsData {
  params?: any
  data?: any
}
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

interface WorkersObject {
  size?:number
  current?:number
  roleType?:string
}

interface workersAuditObject {
  auditRemark?:string
  auditStatus?:number
  personId?:number
}

interface userauthAuditObject {
  userAuthId?:any
  auditStatus?:any
  auditRemark?:any
}

interface companyAuditObject {
  auditRemark?:string
  auditStatus?:number
  companyId?:number
}

interface authenticationObj {
  size?:any
  current?:any
  username?:any
  idcard?:any
  auditStatus?:any
}
export const loginApi = ({ data }: PropsData) => {
  return fetch({ url: '/auth/oauth/token', method: 'post', data })
}
// 企业审核列表
export const company = (params : CompanyPattern) => {
  return fetch({ url: '/admin/company/page', method: 'get', params })
}
// 企业审核
export const companyAudit = (data:companyAuditObject) => {
  return fetch({ url: '/admin/company/audit', method: 'post', data })
}

// 工人、项目经理、监理  审核列表
export const workers = (params : WorkersObject) => {
  return fetch({ url: '/admin/person/page', method: 'get', params })
}

// 工人、项目经理、监理 审核
export const workersAudit = (data : workersAuditObject) => {
  return fetch({ url: '/admin/person/skillaudit', method: 'post', data })
}

// 实名认证列表
export const authentication = (params : authenticationObj) => {
  return fetch({ url: '/admin/userauth/page', method: 'get', params })
}

// 实名认证
export const userauthAudit = (data :userauthAuditObject) => {
  return fetch({ url: '/admin/userauth/audit', method: 'post', data })
}

// 获取运营商默认企业
export const defaultCompany = () => {
  return fetch({ url: '/admin/cityoperator/getDefaultCompany', method: 'post' })
}

export const reqSopTempLateList = (params: CompanyPattern) => {
  return fetch({ url: '/order/soptemplate/getList', method: 'get', params })
}

// 工种支付规则 -列表
export const reqSkillPayRuleList = (params: CompanyPattern) => {
  return fetch({
    url: '/order/bizorderdoubtperiodconfig/page',
    method: 'get',
    params
  })
}
// 工种支付规则 -列表删除
export const reqSkillPayRuleDelete = (data: any) => {
  return fetch({
    url: `/order/bizorderdoubtperiodconfig/remove/${data.id}`,
    method: 'delete'
  })
}
// 工种支付规则 -启用
export const reqSkillPayRuleEnable = (data: any) => {
  return fetch({
    url: `order/bizorderdoubtperiodconfig/enable/${data.id}`,
    method: 'post'
  })
}
// 工种支付规则 -启用
export const reqSkillPayRuleDisable = (data: any) => {
  return fetch({
    url: `/order/bizorderdoubtperiodconfig/disable/${data.id}`,
    method: 'post'
  })
}
// 工种支付规则 -新增保存
export const reqSkillPayRuleAddSave = (data: any) => {
  return fetch({
    url: '/order/bizorderdoubtperiodconfig/save',
    method: 'post',
    data
  })
}
// 工种支付规则 -编辑保存
export const reqSkillPayRuleEditUpdate = (data: any) => {
  return fetch({
    url: '/order/bizorderdoubtperiodconfig/update',
    method: 'put',
    data
  })
}
// 工种支付规则 -新增&编辑的岗位下拉数据
export const reqSkillPayRuleCompanyIdList = (params: any) => {
  return fetch({
    url: `admin/sysjobskill/page`,
    method: 'get',
    params
  })
}

