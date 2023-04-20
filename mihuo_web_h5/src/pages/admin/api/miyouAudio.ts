import { fetch } from '_@/axios-config/axios'

interface miyouAuditObject {
    id?: number
    reason?: string
    status?: number
}

export const getMiyouPage = (params: any) => {
  return fetch({ url: `mall/smsfindcircle/admin/page`, method: 'get', params })
}

export const auditsMiyou = (data: miyouAuditObject) => {
  return fetch({ url: 'mall/smsfindcircle/admin/verify', method: 'put', data })
}

export const deleteMiyouComment = (id: any) => {
  return fetch({ url: `mall/smsfindcircle/deleteComment/${id}`, method: 'get' })
}

export const editMiyouCommentVisible = (data: any) => {
  return fetch({ url: 'mall/smsfindcircle/admin/comment/status', method: 'put', data })
}

export const getMiyouComment = (data: any) => {
  return fetch({ url: `mall/smsfindcircle/admin/comment/page`, method: 'post', data })
}
