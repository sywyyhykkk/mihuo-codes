import { fetch } from '_@/axios-config/axios'

export function getDataList(params: any) {
  return fetch({
    url: '/mall/sms_worker_tiptop/page',
    method: 'get',
    params
  })
}

export function addObj(data: any) {
  return fetch({ url: '/mall/sms_worker_tiptop', method: 'post', data })
}

export function delObj(id: any) {
  return fetch({
    url: 'mall/sms_worker_tiptop/' + id,
    method: 'delete'
  })
}

export function putObj(obj: any) {
  return fetch({
    url: '/mall/sms_worker_tiptop',
    method: 'put',
    data: obj
  })
}

export function getAllCompanies() {
  return fetch({
    url: 'admin/company/page',
    method: 'get',
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
