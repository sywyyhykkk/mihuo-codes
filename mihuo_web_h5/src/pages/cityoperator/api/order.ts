import { fetch } from '_@/axios-config/axios'

interface SetReceiverPattern {
  orderId?: number,
  receiverCity?: string,
  receiverDetailAddress?: string,
  receiverName?: string,
  receiverPhone?: string,
  receiverProvince?: string,
  receiverRegion?: string,
  receiverPostCode?: string,
  status?: number,
}

// 订单分页查询
export const getOrderData = (params: any) => {
  return fetch({
    url: '/mall/order/getPage',
    method: 'get',
    params
  })
}

// 获取订单工种服务分类
export const getSkillsList = () => {
  return fetch({
    url: '/admin/sysjobskill/getJobSkillList',
    method: 'get',
    params: {
      type: 2
    }
  })
}

// 获取省份
export const getProvince = () => {
  return fetch({
    url: '/basic/region/province',
    method: 'get'
  })
}

// 获取城市
export const getCity = (agencyId: any) => {
  return fetch({
    url: `/basic/region/regionTree/${agencyId}`,
    method: 'get'
  })
}


// 修改收货地址
export const setReceiver = (data: SetReceiverPattern) => {
  return fetch({
    url: `/mall/order/receiverInfo`,
    method: 'put',
    data
  })
}

// 一键发货
export const sendShipping = (data: any) => {
  return fetch({
    url: '/mall/order/delivery',
    method: 'post',
    data
  })
}

// 一键关闭
export const closeOrder = (data: any) => {
  return fetch({
    url: '/mall/order/close',
    method: 'put',
    data
  })
}

// 发单
export const sendOrder = (data: any) => {
  return fetch({
    url: '/mall/order/assigns',
    method: 'post',
    data
  })
}

// 获取订单详情
export const getOrderDetail = (id: any) => {
  return fetch({
    url: `/mall/order/${id}`,
    method: 'get'
  })
}

// 获取商品规格详情
export const getProductCateDetail = (name: any) => {
  return fetch({
    url: `/mall/productattribute/page?name=${name}`,
    method: 'get'
  })
}

// 订单分页查询
export const getComment = (params: any) => {
  return fetch({
    url: '/mall/omsorderreply/page',
    method: 'get',
    params
  })
}

// 指派服务
export const assignOrder = (data: any) => {
  return fetch({
    url: '/mall/order/appointOrder',
    method: 'post',
    data
  })
}
