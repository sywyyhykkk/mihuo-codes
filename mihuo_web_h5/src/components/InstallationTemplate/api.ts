import { fetch } from '_@/axios-config/axios'
import { InstallationTemplate } from '_c/InstallationTemplate/types'

export const addInstallationTemplate = (data: InstallationTemplate) => {
  return fetch({ url: '/mall/pmsFreightInstallationTemplate/create', method: 'post', data })
}

export const getInstallationTemplate = (params: any) => {
  return fetch({ url: '/mall/pmsFreightInstallationTemplate/page', method: 'get', params })
}

export const editInstallationTemplate = (data: InstallationTemplate) => {
  return fetch({ url: '/mall/pmsFreightInstallationTemplate/edit', method: 'post', data })
}

export const deleteInstallationTemplate = (data: any) => {
  return fetch({ url: `/mall/pmsFreightInstallationTemplate/delete?templateId=${data}`, method: 'post', data })
}
