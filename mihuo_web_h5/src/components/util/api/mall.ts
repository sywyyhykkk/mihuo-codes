import { fetch } from '_c/util/axios-config/axios'

/**
 *  素材分类
 * **/

// 商城-素材树结构获取
export const getSourceTree = () => {
  return fetch({ url: '/mall/pmsmaterialtype/tree', method: 'get' })
}

// 商城-素材id查询
export const sourceById = (params: any) => {
  return fetch({ url: '/mall/pmsmaterialtype/' + params, method: 'get'})
}

// 商城-素材分类分页查询
export const selectPmsMaterialType = (params: any) => {
  return fetch({ url: '/mall/pmsmaterialtype/page', method: 'get', params })
}

// 新增商城-素材分类
export const pmsMaterialType = (data: any) => {
  return fetch({ url: '/mall/pmsmaterialtype/save', method: 'post', data })
}

// 修改商城-素材分类
export const updatePmsMaterialType = (data: any) => {
  return fetch({ url: '/mall/pmsmaterialtype/updateById', method: 'post', data })
}

// 通过id删除商城-素材分类
export const deletePmsMaterialType = (params: any) => {
  return fetch({ url: '/mall/pmsmaterialtype/removeById/' + params, method: 'get' })
}


/**
 *  商品分类
 * **/
export const productCategoryCreate = (data: any) => {
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
  return fetch({ url: `/mall/productcategory/tree`, method: 'get' })
}

/**
 *  通用素材
 * **/

// 新增通用素材
export const addPmsCommonMaterial = (data:any) => {
  return fetch({ url: '/mall/pmscommonmaterial/save', method: 'post', data })
}

// 批量新增通用素材
export const addPmsCommonMaterialSaveBatch = (data:any) => {
  return fetch({ url: '/mall/pmscommonmaterial/saveBatch', method: 'post', data })
}

// 修改通用素材
export const updatePmsCommonMaterial = (data:any) => {
  return fetch({ url: '/mall/pmscommonmaterial/updateById', method: 'post', data })
}

// 分页查询通用素材
export const selectPmsCommonMaterial = (params:any) => {
  return fetch({ url: '/mall/pmscommonmaterial/page', method: 'get', params })
}
// 分页查询通用素材新
export const selectPmsCommonMaterialNew = (params:any) => {
  return fetch({ url: '/mall/pmscommonmaterial/page/new', method: 'get', params })
}

// 删除通用素材
export const deletePmsCommonMaterial = (data:any) => {
  return fetch({ url: `/mall/pmscommonmaterial/removeById/${data.id}`, method: 'get' })
}


// 获取素材分类列表
export const selectPmsMaterialTypeList = (params:any) => {
  return fetch({ url: '/mall/pmsmaterialtype/tree', method: 'get', params })
}

/**
 *  工序分类维护
 * **/

// 新增工序分类
export const addProcessCategory = (data:any) => {
  return fetch({ url: '/mall/processcategory/create', method: 'post', data })
}

// 删除通用素材
export const deleteProcessCategory = (data:any) => {
  return fetch({ url: `/mall/processcategory/delete/${data.id}`, method: 'post' })
}

// 修改工序分类
export const updateProcessCategory = (data:any) => {
  return fetch({ url: '/mall/processcategory/update', method: 'post', data })
}

// 工序分类分页查询
export const selectProcessCategory = (params:any) => {
  return fetch({ url: '/mall/processcategory/page', method: 'get', params })
}

// 获取工序类别树信息
export const selectProcessCategoryTree = (params:any) => {
  return fetch({ url: `/mall/processcategory/list/${params.type}`, method: 'get' })
}

/**
 *  工序详情管理
 * **/
// 新增工序信息
export const addPmsProcessDetail = (data:any) => {
  return fetch({ url: '/mall/pmsprocessdetail/create', method: 'post', data })
}

// 通过id删除工序信息
export const deletePmsProcessDetail = (data:any) => {
  return fetch({ url: `/mall/pmsprocessdetail/delete/${data.id}`, method: 'post', data })
}

// 根据cid查询工序列表
export const selectProcessCategoryList = (params:any) => {
  return fetch({ url: `/mall/pmsprocessdetail/list/${params.cid}`, method: 'get', params })
}

// 分页查询
export const selectProcessCategoryPage = (params:any) => {
  return fetch({ url: `/mall/pmsprocessdetail/page`, method: 'get', params })
}

// 修改工序信息
export const updateProcessCategoryPage = (data:any) => {
  return fetch({ url: `/mall/pmsprocessdetail/update`, method: 'post', data })
}

//图文素材的list
export const selectImageAndTextMaterial=(params:any)=>{
  return fetch({ url: `/mall/pmsimagematerial/page`, method: 'get', params })
}
//图文素材分页新
export const selectImageAndTextMaterialNew=(params:any)=>{
  return fetch({ url: `/mall/pmsimagematerial/page/new`, method: 'get', params })
}
//新增图文素材
export const addTextImageMaterial = (data:any) => {
  return fetch({ url: '/mall/pmsimagematerial/save', method: 'post', data })
}
// 删除图文素材
export const deleteTextImageMaterial = (data:any) => {
  return fetch({ url: `/mall/pmsimagematerial/removeById/${data.id}`, method: 'get' })
}
// 修改图文素材
export const updateImagesAndTextMaterial = (data:any) => {
  return fetch({ url: '/mall/pmsimagematerial/updateById', method: 'post', data })
}

