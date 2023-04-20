import { fetch } from '_@/axios-config/axios'

export function fetchList(query: any) {
  return fetch({
    url: '/basic/express/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj: any) {
  return fetch({
    url: '/basic/express/save',
    method: 'post',
    data: obj
  })
}

export function getObj(id: any) {
  return fetch({
    url: '/basic/express/' + id,
    method: 'get'
  })
}

export function delObj(id: any) {
  return fetch({
    url: '/basic/express/removeById/' + id,
    method: 'get'
  })
}

export function putObj(obj: any) {
  return fetch({
    url: '/basic/express/updateById',
    method: 'post',
    data: obj
  })
}
