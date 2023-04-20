import { fetch } from '_@/axios-config/axios'

/**
 *
 * @param 客服设置
 * @returns
 */
export const getCustomer = (params?:any) => {
  return fetch({ url: `admin/syscompanycustomerservicestaffs/page`, method: 'get' })
}
export const saveCustomer = (data:any) => {
  return fetch({ url: `admin/syscompanycustomerservicestaffs`, method: 'post', data })
}
export const updataCustomer = (data?:any) => {
  return fetch({ url: `admin/syscompanycustomerservicestaffs`, method: 'put', data })
}
export const delCustomer = (serverId:any) => {
  return fetch({ url: `admin/syscompanycustomerservicestaffs/${serverId}`, method: 'delete' })
}

/**
 *
 * @param 基本信息
 * @returns
 */
// export const getCompany = (companyId:any) => {
//     return fetch({ url: `/admin/company/find/${companyId}`, method: 'get' })
// }
export const getCompany = () => {
  return fetch({ url: `/admin/company/infos/basic`, method: 'get' })
}
//  export const getCompany = (companyId:any) => {
//     return fetch({ url: `admin/company/companies?companyIds=${companyId}`, method: 'get' })
// }
export const updataCompany = (data:any) => {
  return fetch({ url: `/admin/company/infos/basic`, method: 'post', data })
}

// 获取地址信息
export const getAddress = (data:object) => {
  return fetch({ url: `/basic/region/names`, method: 'post', data })
}
