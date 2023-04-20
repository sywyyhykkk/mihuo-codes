import { fetch } from '_@/axios-config/axios'

interface demandAuditObject {
    id?: number
    publishStatus?: number 
    verifyReason?: string
    verifyStatus?: number
  }

/**
 * 
 * @param 配置接口
 * @returns 
 */
export const getDemandPage = (params: any) => {
    return fetch({ url: `order/bizdemandconsultation/page`, method: 'get',params })
}

export const auditsDemand = (data: demandAuditObject) => {
    return fetch({ url: 'order/bizdemandconsultation/update/publish', method: 'post', data })
}

export const upDownShelf = (data: demandAuditObject) => {
    return fetch({ url: 'order/bizdemandconsultation/update/upAndDown', method: 'post', data })
}