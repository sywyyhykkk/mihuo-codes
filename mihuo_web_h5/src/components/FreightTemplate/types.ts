// 运费模版
export type FreightTemplate = {
  // 模版ID
  templateId?: string | undefined,
  // 发货地址
  address: Address,
  // 模版名称
  templateName?: string | undefined,
  // 运费设置 1=阶梯计价 2=固定运费 3=卖家包邮 4=自定义协商
  freightMode: number | undefined,
  // 默认运费 (一级规则)
  firstFreight?: CaseRule,
  // 地址地区运费 (二级规则)
  secondFreight?: SecondFreight[],
  // 指定条件免运费 (三级规则)
  thirdFreight?: ThirdFreight[],
  // 限制下单区域 (四级规则)
  fourthFreight?: Address[],
}

// 计件规则
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

// 区域计价规则
export type SecondFreight = {
   // 区域列表
  addresses?: Address[],
  // 计件规则
  caseRule: CaseRule
}

// 指定条件规则
export type ThirdFreight = {
  // 区域列表
  addresses?: Address[],
  // 满减金额
  minimumAmount: number | undefined
}

// 发货地区
export type Address = {
  // 地区名称
  name: string,
  // 地区编码
  code: string
}

export type DeliveryDuration = {
  // 区域列表
  addresses?: Address[],
  days: number | undefined,
}
