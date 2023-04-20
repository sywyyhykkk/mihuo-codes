import { fetch } from '_@/axios-config/axios'

export function getDataList(params: any) {
  return fetch({
    url: '/mall/pmscategorycontent/page',
    method: 'get',
    params
  })
}

export function addObj(data: any) {
  return fetch({ url: '/mall/pmscategorycontent/save', method: 'post', data })
}

export function delObj(id: any) {
  return fetch({
    url: '/mall/pmscategorycontent/removeById/' + id,
    method: 'post'
  })
}

export function putObj(obj: any) {
  return fetch({
    url: '/mall/pmscategorycontent/updateById',
    method: 'post',
    data: obj
  })
}
