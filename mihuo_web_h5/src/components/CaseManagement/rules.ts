// 案例基本信息表单规则
export const caseBaseInfoRules = {
  name: [
    { required: true, message: '案例名称不能为空', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '案例描述不能为空', trigger: 'blur' }
  ],
  coverPic: [
    { required: true, message: '请选择案例封面图', trigger: 'blur' }
  ],
  imagesHouseType: [
    { required: true, message: '请选择案例户型图', trigger: 'blur' }
  ],
  houseArea: [
    { required: true, message: '请输入装修面积', trigger: 'blur' }
  ],
  way: [
    { required: true, message: '请选择装修方式', trigger: 'blur' }
  ],
  houseType: [
    { required: true, message: '请选择房屋户型', trigger: 'blur' }
  ],
  houseStyle: [
    { required: true, message: '请选择装修风格', trigger: 'blur' }
  ]
}

// 案例服务日志表单规则
export const caseLogRules = {
  content: [
    { required: true, message: '请输入日志内容', trigger: 'blur' }
  ],
  time: [
    { required: true, message: '请选择日志发布时间', trigger: 'blur' }
  ],
  personId: [
    { required: true, message: '请选择关联人员', trigger: 'blur' }
  ],
  logType: [
    { required: true, message: '请选择日志类型', trigger: 'blur' }
  ]
}

// 案例施工阶段表单规则
export const caseStageRules = {
  stageName: [
    { required: true, message: '请输入阶段名称', trigger: 'blur' }
  ],
  personId: [
    { required: true, message: '请选择关联人员', trigger: 'blur' }
  ]
}

// 案例评价表单规则
export const caseCommentRules = {
  comment: [
    { required: true, message: '请输入评价内容', trigger: 'blur' }
  ],
  userId: [
    { required: true, message: '请选择关联人员', trigger: 'blur' }
  ],
  personId: [
    { required: true, message: '请选择关联人员', trigger: 'blur' }
  ],
  personName: [
    { required: true, message: '请选择关联人员', trigger: 'blur' }
  ],
  personSkillName: [
    { required: true, message: '请选择关联人员', trigger: 'blur' }
  ],
  stars: [
    { required: true, message: '请选择评价星级', trigger: 'blur' }
  ],
  reviewer: [
    { required: true, message: '请输入评价人昵称', trigger: 'blur' }
  ],
  time: [
    { required: true, message: '请选择评价时间', trigger: 'blur' }
  ],
  reviewerAvatar: [
    { required: true, message: '请选择评价人头像', trigger: 'blur' }
  ]
}

// 案例日志评论表单规则
export const caseLogCommentRules = {
  comment: [
    { required: true, message: '请输入评价内容', trigger: 'blur' }
  ],
  reviewer: [
    { required: true, message: '请输入评价人昵称', trigger: 'blur' }
  ],
  time: [
    { required: true, message: '请选择评价时间', trigger: 'blur' }
  ],
  reviewerAvatar: [
    { required: true, message: '请选择评价人头像', trigger: 'blur' }
  ]
}

// 校验数字
const validateNumber = (rule: any, value: any, callback: any) => {
  if (!value.name || !value.code)callback(new Error())
  callback()
}

// 案例报价清单表单规则
export const groupPricingRules = {
  productId: [
    { required: true, message: '请选择商品', trigger: 'change' }
  ],
  productName: [
    { required: true, message: '请输入商品名称', trigger: 'change' }
  ],
  skuLabel: [
    { required: true, message: '请选择商品规格', trigger: 'blur' }
  ]
}
