
import {
  FreightTemplate,
  Address,
  CaseRule,
  SecondFreight,
  ThirdFreight,
  DeliveryDuration
} from '_c/FreightTemplate/types'

// 默认地址
export const emptyAddress = <Address>{
  name: '',
  code: ''
}

// 默认一级规则
export const emptyFirstFreight = <CaseRule>{
  firstCases: undefined,
  firstAmount: undefined,
  secondCases: undefined,
  secondAmount: undefined,
  fixedAmount: undefined,
  protocol: undefined
}

// 默认二级规则
export const emptySecondFreight = <SecondFreight>{
  addresses: [],
  caseRule: {
    firstCases: undefined,
    firstAmount: undefined,
    secondCases: undefined,
    secondAmount: undefined,
    fixedAmount: undefined,
    protocol: undefined
  }
}

// 默认三级规则
export const emptyThirdFreight = <ThirdFreight>{
  addresses: [],
  minimumAmount: undefined
}

// 默认四级规则
export const emptyFourthFreight = []

// 默认运费模版
export const emptyTemplate = <FreightTemplate>{
  templateName: undefined,
  freightMode: 1,
  address: emptyAddress,
  firstFreight: emptyFirstFreight,
  secondFreight: [],
  thirdFreight: [],
  fourthFreight: []
}

export const emptyDeliveryDuration = <DeliveryDuration>{
  addresses: [],
  companyId: undefined,
  days: undefined
}

// 获取所选地区名称
export const getAllAddressName = (row: any) => {
  const addresses = row.addresses || row
  if (Array.isArray(addresses)) {
    let result = ''
    addresses.forEach((item: any) => {
      result += item.name + '；'
    })
    return result.substring(0, result.length - 1)
  } else {
    return addresses.name
  }
}
