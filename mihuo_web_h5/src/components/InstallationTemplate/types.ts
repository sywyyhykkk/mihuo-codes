// 入户/安装费模版
export type InstallationTemplate = {
  // 模版ID
  templateId?: string | undefined,
  // 模版名称
  templateName?: string | undefined,
  // 入户/安装费设置  1=记件收费 2=固定费用 3=免入户/安装费 4=自定义协商
  installationMode: number | undefined,
  // 上楼费设置  1=记件收费 2=固定费用 3=免入户/安装费 4=自定义协商
  stairwayMode?: number | undefined,
  // 默认入户/安装费 (一级规则)
  installationFirst?: CaseRule,
  // 指定地区入户/安装费 (二级规则)
  installationSecond?: SecondRule[],
  // 默认上楼费 (一级规则)
  stairwayFirst?: CaseRule,
  // 指定地区上楼费 (二级规则)
  stairwaySecond: SecondRule[]
}

// 费用规则
export type CaseRule = {
  // 首件数量
  firstCases: number | undefined,
  // 首件金额
  firstAmount: number | undefined,
  // 递增数量
  secondCases: number | undefined,
  // 递增金额
  secondAmount: number | undefined,
  // 固定金额
  fixedAmount: number | undefined,
  // 协商内容
  protocol: string | undefined
}

// 指定地区入户/安装费 (二级规则)
export type SecondRule = {
  // 区域列表
  addresses?: Address[],
  // 费用规则
  caseRule: CaseRule
}

// 指定地区
export type Address = {
  // 地区名称
  name: string,
  // 地区编码
  code: string
}
