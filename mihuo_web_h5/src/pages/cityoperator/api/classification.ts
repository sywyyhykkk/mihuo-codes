import { fetch } from '_@/axios-config/axios'

interface RolePattern {
  companyId?: any
  description?: any
  icon?: any
  id?: any
  name?: any
  navStatus?: any
  parentId?: any
  productAttributeIdList?: any
  showStatus?: any
  sort?: any
}

export const productCategoryCreate = (data: RolePattern) => {
  return fetch({ url: '/mall/productcategory/create', method: 'post', data })
}

export const productCategoryPage = (params:any) => {
  return fetch({ url: '/mall/productcategory/page', method: 'get', params })
}

export const productCategoryUpdate = (data:any) => {
  return fetch({ url: '/mall/productcategory/update', method: 'post', data })
}

export const productCategoryDelete = (data:any) => {
  return fetch({ url: '/mall/productcategory/delete/'+data, method: 'post', data })
}

export const productCategoryTree = (data:any) => {
  return fetch({ url: '/mall/productcategory/tree/'+data, method: 'get', data })
}
