import { fetch } from '_@/axios-config/axios'
import { DeliveryDuration, FreightTemplate } from '_c/FreightTemplate/types'

export const addFreightTemplate = (data: FreightTemplate) => {
  return fetch({ url: '/mall/pmsFreightTemplate/create', method: 'post', data })
}

export const getFreightTemplate = (params: any) => {
  return fetch({ url: '/mall/pmsFreightTemplate/page', method: 'get', params })
}

export const editFreightTemplate = (data: FreightTemplate) => {
  return fetch({ url: '/mall/pmsFreightTemplate/edit', method: 'post', data })
}

export const deleteFreightTemplate = (data: any) => {
  return fetch({ url: `/mall/pmsFreightTemplate/delete?templateId=${data}`, method: 'post', data })
}

// 获取运费模版计费规则
export const getFreightTemplateRule = () => {
  return fetch({ url: `/mall/pmsFreightTemplate/getRule`, method: 'get' })
}

// 设置运费模版计费规则
export const setFreightTemplateRule = (data: any) => {
  return fetch({ url: `/mall/pmsFreightTemplate/setRule?freightRule=${data}`, method: 'post', data })
}

// 获取入户/安装费计费规则
export const getInstallationTemplateRule = () => {
  return fetch({ url: `/mall/pmsFreightInstallationTemplate/getRule`, method: 'get' })
}

// 设置入户/安装费计费规则
export const setInstallationTemplateRule = (data: any) => {
  return fetch({ url: `/mall/pmsFreightInstallationTemplate/setRule?installationRule=${data}`, method: 'post', data })
}

// 获取配送时长分页
export const getDeliveryDuration = (params: any) => {
  return fetch({ url: `/mall/pmsFreightTemplate/time/page`, method: 'get', params })
}

// 新增配送时长
export const addDeliveryDuration = (data: DeliveryDuration) => {
  return fetch({ url: `/mall/pmsFreightTemplate/time/create`, method: 'post', data })
}

// 新增配送时长
export const editDeliveryDuration = (data: any) => {
  return fetch({ url: `/mall/pmsFreightTemplate/time/edit`, method: 'post', data })
}

// 删除配送时长
export const deleteDeliveryDuration = (data: any) => {
  return fetch({ url: `/mall/pmsFreightTemplate/time/delete?id=${data}`, method: 'post', data })
}
