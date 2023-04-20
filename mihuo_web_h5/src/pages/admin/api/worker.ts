import { fetch } from '_@/axios-config/axios'

interface WorkerPattern {
  size?: any
  current?: any
  name?: any
  phone?: any
  workTypeId?: any
  roleType?: String
}

/* eslint-disable */
interface AddWokerPattern<T> {
  name: string | number
  // idcard: number | string
  phone: number | string
  // workTypeIds: Array<T> | string
  remark: string
  roleType: string
  workId?: number
}

interface DeleteWokerPattern {
  personId?: string | number
}


// interface DictPattern {
//   work_type?: string | number
// }

export const companyWorkerPage = (params: any) => {
  return fetch({ url: '/admin/person/page', method: 'get', params })
}

export const addUpdate = (data: AddWokerPattern<any>) => {
  return fetch({ url: '/admin/person', method: 'put', data })
}

export const sysworkertype = (params: any) => {
  return fetch({
    url: `/admin/sysjobskill/getJobSkillList`, method: 'get', params: {
      type: params
    }
  })
}
