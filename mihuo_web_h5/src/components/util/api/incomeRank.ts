import { fetch } from '_@/axios-config/axios'

// 赚钱英雄榜
export function getDataList2(params: any) {
  return fetch({
    url: '/order/income_tiptop/page',
    method: 'get',
    params
  })
}

export function addObj2(data: any) {
  return fetch({ url: '/order/income_tiptop', method: 'post', data })
}

export function delObj2(id: any) {
  return fetch({
    url: 'order/income_tiptop/' + id,
    method: 'delete'
  })
}

export function putObj2(obj: any) {
  return fetch({
    url: '/order/income_tiptop',
    method: 'put',
    data: obj
  })
}


