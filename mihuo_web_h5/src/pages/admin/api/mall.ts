import { fetch } from '_@/axios-config/axios'

//新增基础节点
export const addPmsProcessNode = (data: any) => {
  return fetch({ url: '/mall/pmsbasicnode', method: 'post', data })
}

//基础节点分页查询
export const selectPmsProcessNode = (params: any) => {
  return fetch({ url: '/mall/pmsbasicnode/page', method: 'get', params })
}

//删除基础节点
export const deletePmsProcessNode = (params: any) => {
  return fetch({ url: `/mall/pmsbasicnode/${params.id}`, method: 'delete'})
}

//修改基础节点
export const updatePmsProcessNode = (data: any) => {
  return fetch({ url: '/mall/pmsbasicnode', method: 'put', data })
}



