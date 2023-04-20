export const homeServiceData = {
  serviceImages: '', // 服务相册
  serviceBanner: [], // 服务相册(带链接)
  estimateCostDes: '', // 预估费用说明
  estimateCost: {
    questions: [],
    items: []
  }, // 预估费用
  decorationProcess: [] // 装修流程
}

export const questionFormRules = {
  label: [{ required: true, message: '请输入选项', trigger: 'blur' }],
  icon: [{ required: true, message: '请选择图标', trigger: 'blur' }],
  value: [{ required: true, message: '请输入值', trigger: 'blur' }]
}

export const processFormRules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  day: [{ required: true, message: '请输入工期', trigger: 'blur' }],
  price: [{ required: true, message: '请输入费用', trigger: 'blur' }],
  skillName: [{ required: true, message: '请选择服务者工种', trigger: 'blur' }]
}

export const serviceContentFormRules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  des: [{ required: true, message: '请输入说明', trigger: 'blur' }],
  value: [{ required: true, message: '请输入说明', trigger: 'blur' }],
  icon: [{ required: true, message: '请选择图标', trigger: 'blur' }]
}

export const serviceBannerRules = {
  imgUrl: [{ required: true, message: '请选择服务相册图片', trigger: 'blur' }],
}
