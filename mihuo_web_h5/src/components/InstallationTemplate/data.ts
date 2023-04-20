import { SecondRule, Address, CaseRule, InstallationTemplate } from '_c/InstallationTemplate/types'

// 默认地址
export const emptyAddress = <Address>{
  name: '',
  code: ''
}

// 默认一级规则
export const emptyFirstRule = <CaseRule>{
  firstCases: undefined,
  firstAmount: undefined,
  secondCases: undefined,
  secondAmount: undefined,
  fixedAmount: undefined,
  protocol: undefined
}

// 默认二级规则
export const emptySecondRule = <SecondRule>{
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

// 默认入户/安装费模版
export const emptyTemplate = <InstallationTemplate>{
  templateName: undefined,
  installationMode: 1,
  stairwayMode: 1,
  installationFirst: emptyFirstRule,
  installationSecond: [],
  stairwayFirst: emptyFirstRule,
  stairwaySecond: []
}
