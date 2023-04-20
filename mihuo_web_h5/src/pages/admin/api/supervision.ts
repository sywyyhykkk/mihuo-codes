import { fetch } from '_@/axios-config/axios'

interface PropsData {
  params?: any
  data?: any
}
interface projectPattern {
  size?:number
  current?:number
  roleType?:string
}
export const projectSupervision = (params : projectPattern) => {
  return fetch({ url: '/admin/person/page', method: 'get', params })
}

