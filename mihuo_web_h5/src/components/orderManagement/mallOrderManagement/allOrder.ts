import { ref } from 'vue'

// 订单状态：-1=其他订单 0=待付款；1=待发货；2=已发货(服务中-服务订单)；3待验收-服务订单；4=已完成（已收货）

// 商品订单
export const tabs0: any = [
  { label: '全部', value: '-1' },
  { label: '待付款', value: '0' },
  { label: '待发货', value: '1' },
  { label: '已发货', value: '2' },
  { label: '已完成', value: '4' },
  { label: '已关闭', value: '7' },
  { label: '退款中', value: '8' }
]
// 服务订单
export const tabs1: any = [
  { label: '全部', value: '-1' },
  { label: '待付款', value: '0' },
  { label: '待确认', value: '1' },
  { label: '服务中', value: '2' },
  { label: '待验收', value: '3' },
  { label: '已完成', value: '4' },
  { label: '已关闭', value: '7' },
  { label: '退款中', value: '8' }
]
// 协作订单
export const tabs2: any = [
  { label: '全部', value: '-1' },
  { label: '待付款', value: '0' },
  { label: '待确认', value: '1' },
  { label: '服务中', value: '2' },
  { label: '待验收', value: '3' },
  { label: '已完成', value: '4' },
  { label: '已关闭', value: '7' },
  { label: '退款中', value: '8' }
]
// 用户订单
// order matters
export const tabs3: any = [
  { label: '全部', value: '-1' },
  { label: '待审核', value: '7' },
  { label: '待确认', value: '0' },
  { label: '待付款', value: '1' },
  { label: '服务中', value: '2' },
  { label: '待结算', value: '3' },
  { label: '已完成', value: '4' },
  { label: '已关闭', value: '5' },
  { label: '退款中', value: '6' }
]

export const optionProduct0: any = [{ label: '商品名称', value: 'productName' },
  { label: '商品ID', value: 'productId' },
  { label: '商品货号', value: 'productSn' },
  { label: 'sku编码', value: 'skuCode' }]
export const optionProduct1: any = [{ label: '服务名称', value: 'productName' },
  { label: '服务ID', value: 'productId' },
  { label: '服务货号', value: 'productSn' },
  { label: 'sku编码', value: 'skuCode' }]
export const optionProduct2: any = [{ label: '服务包名称', value: 'productName' },
  { label: '服务包ID', value: 'productId' },
  { label: '服务包货号', value: 'productSn' },
  { label: 'sku编码', value: 'skuCode' }]

export const optionLogistics0: any = [{ label: '收货人姓名', value: 'receiverName' }, {
  label: '收货人手机号',
  value: 'receiverPhone'
}, {
  label: '下单人账号',
  value: 'buyer'
}]
export const optionLogistics1: any = [{ label: '服务人姓名', value: 'receiverName' }, {
  label: '服务人手机号',
  value: 'receiverPhone'
}, {
  label: '服务人账号',
  value: 'buyer'
}]

export const optionDate0: any = [{ label: '下单时间', value: 'createTime' }, { label: '支付时间', value: 'paymentTime' }, {
  label: '发货时间',
  value: 'deliveryTime'
}, { label: '订单完成时间', value: 'receiveTime' }]

export const optionDate1: any = [{ label: '创建时间', value: 'createTime' }, { label: '支付时间', value: 'paymentTime' }, {
  label: '服务时间',
  value: 'deliveryTime'
}, { label: '订单完成时间', value: 'receiveTime' }]

export const step0: any = ['买家下单', '买家付款', '商家发货', '交易完成']
export const step1: any = ['买家下单', '买家付款', '商家服务', '交易完成']
export const step2: any = ['买家下单', '买家付款', '申请退款', '退款完成']
export const step3: any = ['买家下单', '买家付款', '商家服务', '退款失败']
export const customStep = ['发布订单', '订单确认', '订单支付', '提交验收', '客户确认', '订单结算', '交易完成']
// 指派方式
export const assignTypeList = [
  {
    label: '指派',
    value: 1
  },
  {
    label: '抢单',
    value: 2
  }
]
// 定价方式
export const priceWayList = [
  {
    label: '一口价',
    value: 1
  },
  {
    label: '上门开单',
    value: 3
  }
]
// 需求类型
export const requirementTypeList = [
  {
    label: '装修',
    value: 1
  },
  {
    label: '维修',
    value: 2
  },
  {
    label: '安装',
    value: 3
  },
  {
    label: '设计',
    value: 4
  },
  {
    label: '其他',
    value: 5
  }
]
