import { fetch } from '_@/axios-config/axios'

// 商城-素材分类分页查询
export const selectPmsMaterialType = (params: any) => {
  // return fetch({ url: '/mall/pmsmaterialtype/page', method: 'get', params })
}

// 获取素材分类列表
export const selectPmsMaterialTypeList = (params:any) => {
  return fetch({ url: '/mall/pmsmaterialtype/list', method: 'get', params })
}

// 新增商城-素材分类
export const pmsMaterialType = (data: any) => {
  return fetch({ url: '/mall/pmsmaterialtype', method: 'post', data })
}

// 修改商城-素材分类
export const updatePmsMaterialType = (data: any) => {
  return fetch({ url: '/mall/pmsmaterialtype', method: 'put', data })
}

// 通过id删除商城-素材分类
export const deletePmsMaterialType = (params: any) => {
  return fetch({ url: `/mall/pmsmaterialtype/${params}`, method: 'delete' })
}


// (运营端)导入平台分类
export const importPlatformType = (data: any) => {
  return fetch({ url: `/mall/pmsmaterialtype/importPlatformType`, method: 'post',data })
}

// (运营端)导入平台通用素材
export const importCommonMaterial = (data: any) => {
  return fetch({ url: `/mall/pmscommonmaterial/importCommonMaterial`, method: 'post',data })
}

// (运营端)根据素材类型,导入平台通用素材
export const importCommonMaterialType = (data: any) => {
  return fetch({ url: `/mall/pmscommonmaterial/importMaterial`, method: 'post',data })
}

//图文素材列表的获取
export const getImageAndTextMaterial=(params:any)=>{
  return fetch({ url: '/mall/pmsmaterialtype/list', method: 'get', params })
};
