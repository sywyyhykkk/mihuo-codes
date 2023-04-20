
// 校验caseRule
export const validateDefaultTemplate = (rule: any, value: any, callback: any) => {
  if (rule.field === 'caseRule') {
    if (JSON.stringify(value) === '{}') callback(new Error())
    if (value === undefined) callback()
    if (typeof value === 'number') {
      if (value <= 0) callback(new Error())
    } else if (typeof value === 'string') {
      if (Number(value) <= 0) callback(new Error())
    } else {
      for (const k in value) {
        if (value[k] !== null) {
          if (typeof value[k] === 'number') {
            if (Number(value[k]) <= 0) {
              callback(new Error())
            }
          } else if (typeof value[k] === 'string') {
            if (value[k].length === 0) {
              callback(new Error())
            }
          }
        }
      }
    }
    callback()
  } else if (rule.field === 'minimumAmount') {
    if (!value) callback(new Error())
    if (JSON.stringify(value) === '{}') callback(new Error())
  } else if (rule.field === 'firstFreight') {
    if (JSON.stringify(value) === '{}') callback()
    if (Object.keys(value).length !== 0) {
      for (const k in value) {
        if (value[k] !== null && Number(value[k]) <= 0) {
          callback(new Error())
        }
      }
    }
    callback()
  } else if (rule.field === 'days') {
    if (Number(value) <= 0) callback(new Error())
  }
  callback()
}

// 校验单选地区
const validateAddress = (rule: any, value: any, callback: any) => {
  if (!value.name || !value.code)callback(new Error())
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
  address: [
    { required: true, message: '发货地区不能为空', trigger: 'blur', validator: validateAddress }
  ],
  freightMode: [
    { required: true, message: '运费设置不能为空', trigger: 'blur' }
  ],
  firstFreight: [
    { required: true, message: '输入的数字不能小于或等于0或为空', trigger: 'blur', validator: validateDefaultTemplate }
  ]
}

// 添加地区校验规则
export const addAreaRule = {
  addresses: [
    { required: true, message: '发货地区不能为空', trigger: 'blur', validator: validateAddressMulti }
  ],
  caseRule: [
    { required: true, message: '输入的数字不能小于或等于0或为空', trigger: 'blur', validator: validateDefaultTemplate }
  ],
  days: [
    { required: true, message: '输入的数字不能小于或等于0或为空', trigger: 'blur', validator: validateDefaultTemplate }
  ],
  minimumAmount: [
    { required: true, message: '输入的数字不能小于或等于0或为空', trigger: 'blur', validator: validateDefaultTemplate }
  ]
}
