import { fetch } from '_@/axios-config/axios'

export function getDataList(params: any) {
  return fetch({
    url: '/basic/activity/page',
    method: 'get',
    params
  })
}

export function addObj(data: any) {
  return fetch({ url: '/basic/activity/save', method: 'post', data })
}

export function getObj(id: any) {
  return fetch({
    url: '/basic/activity/getById' + id,
    method: 'get'
  })
}

export function delObj(id: any) {
  return fetch({
    url: '/basic/activity/removeById/' + id,
    method: 'get'
  })
}

export function putObj(obj: any) {
  return fetch({
    url: '/basic/activity/updateById',
    method: 'post',
    data: obj
  })
}
