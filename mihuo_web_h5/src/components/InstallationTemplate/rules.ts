
// 校验caseRule
export const validateDefaultTemplate = (rule: any, value: any, callback: any) => {
  if (!value) callback(new Error())
  if (typeof value === 'number') {
    if (value <= 0) callback(new Error())
  } else if (typeof value === 'string') {
    if (Number(value) <= 0) callback(new Error())
  } else {
    if (value && Object.keys(value).length === 0) callback(new Error())
    for (const k in value) {
      if (value[k] !== null) {
        if (typeof value[k] === 'string') {
          if (value[k].length === 0) {
            callback(new Error())
          }
          if (Number(value[k]) <= 0) callback(new Error())
        } else if (typeof value[k] === 'number') {
          if (Number(value[k]) <= 0) {
            callback(new Error())
          }
        }
      }
    }
  }
  callback()
}

// 校验多选地区
const validateAddressMulti = (rule: any, value: any, callback: any) => {
  if (Array.isArray(value)) {
    if (value.length === 0) callback(new Error())
  }
  callback()
}

// 添加模版表单校验规则
export const dataRule = {
  templateName: [
    { required: true, message: '模版名称不能为空', trigger: 'blur' }
  ],
  addresses: [
    { required: true, message: '发货地区不能为空', trigger: 'blur', validator: validateAddressMulti }
  ],
  installationMode: [
    { required: true, message: '入户/安装费设置不能为空', trigger: 'blur' }
  ],
  stairwayMode: [
    { required: true, message: '上楼费设置不能为空', trigger: 'blur' }
  ],
  installationFirst: [
    { required: true, message: '输入不能小于或等于0或为空', trigger: 'blur', validator: validateDefaultTemplate }
  ],
  stairwayFirst: [
    { required: true, message: '输入不能小于或等于0或为空', trigger: 'blur', validator: validateDefaultTemplate }
  ]
}

// 添加地区校验规则
export const addAreaRule = {
  addresses: [
    { required: true, message: '发货地区不能为空', trigger: 'blur', validator: validateAddressMulti }
  ],
  caseRule: [
    { required: true, message: '输入不能小于或等于0或为空', trigger: 'blur', validator: validateDefaultTemplate }
  ]
}
