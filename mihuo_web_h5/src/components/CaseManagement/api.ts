import { fetch } from '_@/axios-config/axios'

// 案例分页查询
export const getCasePage = (params: any) => {
  return fetch({ url: '/order/bizconstructioncase/page', method: 'get', params })
}
// 新增案例
export const addCase = (data: any) => {
  return fetch({ url: '/order/bizconstructioncase/add', method: 'post', data })
}

// 编辑案例
export const editCase = (data: any) => {
  return fetch({ url: '/order/bizconstructioncase/edit', method: 'post', data })
}

// 根据案例ID删除案例
export const deleteCaseById = (params: any) => {
  return fetch({ url: '/order/bizconstructioncase/delete', method: 'post', params })
}

// 获取运营商人员
export const getCityOperatorPerson = (params: any) => {
  return fetch({ url: '/admin/person/page', method: 'get', params })
}

// 获取当前项目下所有图片(图纸，日志图片)
export const getProjectImages = (params: any) => {
  return fetch({ url: '/order/sopupload/group/myhome', method: 'get', params })
}

// 获取问卷模版列表
export const getSurveyTemplate = (params: any) => {
  return fetch({ url: '/basic/surveytemplate/page', method: 'get', params })
}

// 获取运营商验收模版
export const getAcceptanceTemplate = (params: any) => {
  return fetch({ url: '/basic/acceptance_template/getAllTemplates', method: 'get', params })
}

// 根据模版id查询问卷明细
export const getSurveyTemplateById = (id: any) => {
  return fetch({ url: `/basic/surveytemplate/getTemplateDetailsById/${id}`, method: 'get' })
}

// 获取商品详细信息
export const getProductDetail = (id: any) => {
  return fetch({ url: `/mall/product/updateInfo/${id}`, method: 'get' })
}
