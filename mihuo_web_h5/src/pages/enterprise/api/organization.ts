import { fetch } from '_@/axios-config/axios'

interface PropsData {
  params?: any
  data?: any
}
interface CompanydeptPattern {
  size?:any
  page?:any
}

export const loginApi = ({ data }: PropsData) => {
  return fetch({ url: '/auth/oauth/token', method: 'post', data })
}

export const companydept = (params : CompanydeptPattern) => {
  return fetch({ url: '/admin/companydept/page', method: 'get', params })
}
