import { fetch } from '_@/axios-config/axios'

/*****************************SOP项目模板****************************************/
/**
 * @description 查询模板列表
 * */
export const templateGetList = (params: any) => {
  return fetch({ url: `/order/soptemplate/getList`, method: 'get', params })
}
/**
 * @description 单个模板查询
 * */
export const templateGetOne = (id: any) => {
  return fetch({ url: `/order/soptemplate/${id}`, method: 'get' })
}

/**
 * @description 新增模板
 * */
export const templateCreate = (data: any) => {
  return fetch({ url: '/order/soptemplate/create', method: 'post', data })
}

/**
 * @description 修改模板
 * */
export const templateUpdate = (data: any) => {
  return fetch({ url: '/order/soptemplate/update', method: 'post', data })
}

/**
 * @description 通过id删除SOP项目模板
 * */
export const templateDelete = (data: any) => {
  return fetch({ url: `/order/soptemplate/delete/${data.id}`, method: 'post' })
}


/**
 * @description 通过id查询SOP节点子项
 * */
export const projectGetChildList = (data: any) => {
  return fetch({ url: `/order/soptemplate/view/${data.id}`, method: 'get' })
}

/**
 * @description 新增SOP阶段
 * */
export const stageCreate = (data: any) => {
  return fetch({ url: '/order/soptemplate/stage/create', method: 'post', data })
}

/**
 * @description 修改SOP阶段
 * */
export const stageUpdate = (data: any) => {
  return fetch({ url: `/order/soptemplate/stage/update`, method: 'post', data })
}

/**
 * @description 删除SOP阶段
 * */
export const stageDelete = (data: any) => {
  return fetch({ url: `/order/soptemplate/stage/delete/${data.id}`, method: 'post' })
}

/**
 * @description 新增SOP项目(节点）
 * */
export const nodeCreate = (data: any) => {
  return fetch({ url: `/order/soptemplate/node/create`, method: 'post', data })
}

/**
 * @description 通过id删除SOP项目(节点）
 * */
export const nodeDelete = (data: any) => {
  return fetch({ url: `/order/soptemplate/node/${data.id}`, method: 'delete' })
}

/**
 * @description 修改SOP项目(节点）
 * */
export const nodeUpdate = (data: any) => {
  return fetch({ url: `/order/soptemplate/node/update`, method: 'post', data })
}

/**
 * @description 获取当前企业岗位列表
 * */
export const sysjobsList = (data: any) => {
  // 不传 查所有  传type = 1为岗位  2为工种
  if (data.type) {
    return fetch({ url: `/admin/sysjobskill/getJobSkillList?type=${data.type}`, method: 'get' })
  } else {
    return fetch({ url: `/admin/sysjobskill/getJobSkillList`, method: 'get' })
  }

}

/**
 * @description 通过字典类型查找字典
 * */
export const dictType = (data: any) => {
  return fetch({ url: `/admin/dict/type/${data.type}`, method: 'get' })
}


/**
 * @description 当前阶段节点列表
 * */
export const getListByCode = (params: any) => {
  return fetch({ url: `/order/soptemplate/stage/getNodeListBySid/${params.stageId}`, method: 'get' })
}

/*****************************问卷模板****************************************/

/**
 * @description 新增问卷模板
 * */
export const surveyTemplateAdd = (data: any) => {
  return fetch({ url: `/basic/surveytemplate/addTemplate`, method: 'post', data })
}

/**
 * @description 模板分页查询
 * */
export const surveyTemplatePage = (params: any) => {
  return fetch({ url: `/basic/surveytemplate/page`, method: 'get', params })
}

/**
 * @description 修改问卷模板
 * */
export const surveyTemplateUpdate = (data: any) => {
  return fetch({ url: `/basic/surveytemplate/updateTemplate`, method: 'post', data })
}

/**
 * @description 通过id删除问卷模板
 * */
export const surveyTemplateDelete = (data: any) => {
  return fetch({ url: `/basic/surveytemplate/delete/${data.id}`, method: 'post' })
}


/**
 * @description 通过id查询问卷模板明细
 * */
export const getTemplateDetailsById = (data: any) => {
  return fetch({ url: `/basic/surveytemplate/getTemplateDetailsById/${data.id}`, method: 'get' })
}

/**
 * @description 修改问卷模板明细
 * */
export const updateTemplateDetails = (data: any) => {
  return fetch({ url: `/basic/surveytemplate/updateTemplateDetails`, method: 'post', data, showErrorMessage: false })
}


/**
 * @description 获取所有验收模板列表
 * */
export const surveyTemplates = (data: any) => {
  return fetch({ url: `/basic/surveytemplate/getAllTemplates`, method: 'get' })
}


/*****************************处罚规则(自定义罚款)****************************************/

/**
 * @description 分页查询
 * */
export const bizCustomerForfeitPage = (params: any) => {
  return fetch({ url: `/basic/basicrewardrule/page`, method: 'get', params })
}

/**
 * @description 通过id删除自定义罚款表单
 * */
export const bizCustomerForfeitRemoveById = (data: any) => {
  return fetch({ url: `/basic/basicrewardrule/removeById/${data.ruleId}`, method: 'get' })
}

/**
 * @description 新增自定义罚款表单
 * */
export const bizCustomerForfeitSave = (data: any) => {
  return fetch({ url: `/basic/basicrewardrule`, method: 'post', data })
}

/**
 * @description 修改自定义罚款表单
 * */
export const bizCustomerForfeitUpdateById = (data: any) => {
  return fetch({ url: `/basic/basicrewardrule/updateById`, method: 'post', data })
}

/*****************************验收模板****************************************/

/**
 * @description 分页查询模板
 * */
export const acceptanceTemplateGetTemplates = (params: any) => {
  return fetch({ url: `/basic/acceptance_template/getTemplates`, method: 'get', params })
}

/**
 * @description 保存验收模板
 * */
export const acceptanceTemplateSave = (data: any) => {
  return fetch({ url: `/basic/acceptance_template/saveTemplate`, method: 'post', data })
}

/**
 * @description 通过id删除验收模板
 * */
export const acceptanceTemplateDelete = (data: any) => {
  return fetch({ url: `/basic/acceptance_template/deleteTemplate/${data.id}`, method: 'delete' })
}

/**
 * @description 保存验收项目
 * */
export const acceptanceTemplateSaveItem = (data: any) => {
  return fetch({ url: `/basic/acceptance_template/saveTemplateItem`, method: 'post', data })
}

/**
 * @description 通过id删除验收项目
 * */
export const acceptanceTemplateDeleteItem = (data: any) => {
  return fetch({ url: `/basic/acceptance_template/deleteTemplateItem/${data.templateItemId}`, method: 'delete' })
}

/**
 * @description 通过id查询验收项目
 * */
export const acceptanceTemplateGetTemplateItemById = (data: any) => {
  return fetch({ url: `/basic/acceptance_template/getTemplateItemById/${data.templateId}`, method: 'get' })
}

/**
 * @description 分页查询项目
 * */
export const acceptanceTemplateGetTemplate = (params: any) => {
  return fetch({ url: `/basic/acceptance_template/getTemplateItems`, method: 'get', params })
}

/**
 * @description 获取所有验收模板列表
 * */
export const getAllTemplates = (data: any) => {
  return fetch({ url: `/basic/acceptance_template/getAllTemplates`, method: 'get' })
}


/**
 * @description 获取登录状态
 * */
 export const getLoginResult = (data: any) => {
  return fetch({ url: `/admin/sys-fast/getLoginResult?guid=${data.guid}`, method: 'get' })
}


/**
 * @description 一键清空
 * */
 export const removeFileList = (data: any) => {
  return fetch({ url: `/admin/sys-fast/removeFileList?guid=${data.guid}`, method: 'get' })
}
