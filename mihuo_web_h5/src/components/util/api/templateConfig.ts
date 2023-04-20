
/** ***************************处罚规则(自定义罚款)****************************************/

import { fetch } from '_@/axios-config/axios'

/**
 * @description 分页查询
 * */
export const bizCustomerForfeitPage = (params: any) => {
  return fetch({ url: `/basic/basicrewardrule/page`, method: 'get', params })
}
/**
 * @description 用户分页查询
 * */
export const bizCustomeUser = (params: any) => {
  return fetch({ url: `/admin/user/page`, method: 'get', params })
}
/**
 * @description 通过禁用用户
 * */
export const bizCustomerForfeitRemoveById = (data: any) => {
  return fetch({ url: `/basic/basicrewardrule/removeById/${data.ruleId}`, method: 'get' })
}

/**
 * @description 新增自定义罚款表单
 * */
export const bizCustomerForfeitSave = (data: any) => {
  return fetch({ url: `/basic/basicrewardrule`, method: 'post', data })
}

/**
 * @description 修改自定义罚款表单
 * */
export const bizCustomerForfeitUpdateById = (data: any) => {
  return fetch({ url: `/basic/basicrewardrule/updateById`, method: 'post', data })
}

/**
 * @description 通过字典类型查找字典
 * */
export const dictType = (data: any) => {
  return fetch({ url: `/admin/dict/type?type=${data.type}`, method: 'get' })
}

/**
 * @description 获取当前企业岗位列表
 * */
export const sysjobsList = (data: any) => {
  // 不传 查所有  传type = 1为岗位  2为工种
  if (data.type) {
    return fetch({ url: `/admin/sysjobskill/getJobSkillList?type=${data.type}`, method: 'get' })
  } else {
    return fetch({ url: `/admin/sysjobskill/getJobSkillList`, method: 'get' })
  }
}
