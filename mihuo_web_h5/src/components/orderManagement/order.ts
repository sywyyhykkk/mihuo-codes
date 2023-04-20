import { fetch } from '_@/axios-config/axios'
import { ImStore } from '_@/store/modules/im'
import { openIm } from '@/utils/chat'

export const getParse = (val: any) => {
  try {
    let data: any = []
    if (typeof val === 'string') {
      data = getParse(JSON.parse(val))
    } else {
      data = val
    }
    return data
  } catch (e) {
    return []
  }
}

export const getSkuData = (data: any) => {
  if (data) {
    const sku: any = []
    getParse(data).forEach((res: any) => {
      sku.push(`${res.key}:${res.value}`)
    })
    return sku.toString()
  } else {
    return ''
  }
}

// 订单来源
export const getSourceType = (data: any) => {
  switch (data) {
    case 0:
      return 'PC订单'
      break
    case 1:
      return 'app订单'
      break
    case 2:
      return '供应商订单'
      break
  }
}
// 支付方式：1-微信扫码，2-微信原生App，3-微信小程序，4-支付宝扫码，5-支付宝原生App，6-余额，7-预付款抵扣
export const getPayType = (data: any) => {
  switch (data) {
    case 0:
      return '未支付'
    case 1:
    case 2:
    case 3:
      return '微信'
    case 4:
    case 5:
      return '支付宝'
    case 6:
      return '余额'
    case 7:
      return '预付款抵扣'
    default:
      return
  }
}

// 获取退款状态
export const getRefundStatus = (data: any) => {
  switch (data) {
    case 0:
      return {
        label: '',
        style: ''
      }
      break
    case 1:
      return {
        label: '已申请',
        style: 'color: #67C23A'
      }
      break
    case 2:
      return {
        label: '已审核待退款',
        style: 'color: #409EFF'
      }
      break
    case 3:
      return {
        label: '已退款',
        style: 'color:#F56C6C'
      }
      break
    case 4:
      return {
        label: '已拒绝',
        style: 'color:#F2AA3D'
      }
      break
    default:
      return {
        label: '',
        style: ''
      }
      break
  }
}

// 聊天
export const openIM = (data: any) => {
  openIm(data)
}

/**
 * [groupingData 根据共同字段将数据分组]
 * @param {[type]} arr [数据源]
 * @param {[type]} field [字段名]
 */
// 传入两个参数 一个是待分组的数据 一个是按照哪个字段进行分组
export const groupData = (data: any, filed: any) => {
  // map用来保存存过的字段 为下边添加新对象或者将相同字段的数据保存到同一个list中
  const map = {}
  // dest主要保存分组后的数据
  const dest: any = []
  // 循环遍历传入的data
  data.forEach((item: any, index: any) => {
    // 判断map对象中是否有遍历时data的key 如果没有则向dest数组中推入一个新的对象(包含两个属性，一个要分组的字段名，一个保存相同字段名数据的数组)
    if (!map[item[filed]]) {
      dest.push({
        id: index,
        [filed]: item[filed],
        children: [item]
      })
      // 进行一次新添对象的记录
      map[item[filed]] = item
      // 如果在map中有data遍历的key(字段相同) 则向dest数组里面的相同字段的list下推入数据
    } else {
      dest.forEach((dItem: any) => {
        if (dItem[filed] == item[filed]) {
          dItem.children.push(item)
        }
      })
    }
  })
  return dest
}

// 树形结构表格颜色
export const tableRowClassName = ({ row, rowIndex }: any) => {
  if (row.orderItems && row.innerFlag) {
    return 'success-row'
  }
}
// 单据是否内部人员的标记
export const custoRowClassName = ({ row, rowIndex }: any) => {
  if (row.innerFlag) {
    return 'success-row'
  } else {
    return ''
  }
}

let startRow = 1 // 合并行的起点行（实收金额）
let mergeRowLen = 1 // 合并行的长度（实收金额）

let startRow2 = 1 // 合并行的起点行（订单状态）
let mergeRowLen2 = 1 // 合并行的长度（订单状态）
// 合并表格
export const arraySpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
  if (row.orderItems) {
    startRow = rowIndex + 1
    mergeRowLen = row.orderItems.length
    if (row.status == 0 || row.status == 4 || row.status == 7) {
      startRow2 = rowIndex + 1
      mergeRowLen2 = row.orderItems.length
    } else {
      mergeRowLen2 = 1
    }
    if (rowIndex % 2 === 0) {
      if (columnIndex === 0) {
        return [1, 7]
      } else if (columnIndex >= 1 && columnIndex <= 6) {
        return [0, 0]
      }
    }
  } else {
    if (columnIndex === 6) {
      if (rowIndex === startRow) {
        return {
          rowspan: mergeRowLen,
          colspan: 1
        }
      } else {
        return {
          rowspan: 1,
          colspan: 0
        }
      }
    }
    if (columnIndex === 6 && mergeRowLen2 > 1) {
      if (rowIndex === startRow) {
        return {
          rowspan: mergeRowLen2,
          colspan: 1
        }
      } else {
        return {
          rowspan: 1,
          colspan: 0
        }
      }
    }
  }
}

// 获取配送方式
export const getDeliveryType = (data: any) => {
  switch (Number(data)) {
    case 0:
      return '送货上门'
      break
    case 1:
      return '快递配送'
      break
    case 2:
      return '自提点自提'
      break
  }
}
// 获取发货状态
export const getDeliveryStatus = (data: any) => {
  switch (Number(data)) {
    case 0:
      return {
        label: '待发货',
        style: `font-size: 12px;color: #909399;`,
        type: 'warning'
      }
    case 1:
      return {
        label: '已发货',
        style: `font-size: 12px;color: #409EFF;`,
        type: ''
      }
    case 2:
      return {
        label: '已收货',
        style: `font-size: 12px;color: #67C23A;`,
        type: 'success'
      }
    default:
      return {
        label: '',
        style: ``
      }
  }
}

// 获取定单状态
/**
 *
 * @param data 状态
 * @param orderType 订单类型：1=服务订单 2-协作订单
 * @returns
 */
export const getOrderStatus = (data: any, orderType?: string | number) => {
  switch (Number(data)) {
    case 0:
      return {
        text: '待付款',
        type: 'info'
      }
      break
    case 1:
      return {
        text: orderType == 0 ? '待发货' : orderType && ['1', '2', '3'].includes(orderType.toString()) ? '待确认' : '',
        type: 'warning'
      }
      break
    case 2:
      return {
        text: orderType == 0 ? '已发货' : orderType && ['1', '2', '3'].includes(orderType.toString()) ? '服务中' : '',
        type: ''
      }
      break
    case 3:
      return {
        text: orderType == 0 ? '已收货' : orderType && ['1', '2', '3'].includes(orderType.toString()) ? '待验收' : '',
        type: 'success'
      }
      break
    case 4:
      return {
        text: orderType == 0 ? '交易完成' : orderType && ['1', '2', '3'].includes(orderType.toString()) ? '已完成' : '',
        type: 'success'
      }
      break
    case 5:
      return {
        text: '无效订单',
        type: 'info'
      }
      break
    case 7:
      return {
        text: '已关闭',
        type: 'info'
      }
      break
    case 8:
      return {
        text: '退款中',
        type: 'info'
      }
      break
  }
}

// 获取输入框提示语
export const getPlaceHolder = (data: any, val: string) => {
  if (val) {
    let list: any = JSON.parse(JSON.stringify(data))
    list = list.filter((res: any) => {
      if (res.value == val) {
        return true
      }
    })
    return list[0].label
  } else {
    return ''
  }
}

// 客户订单的来源
/**
 *
 * @param data 转台
 * @param deliveryType 0：非sop, 1:sop
 * @param recordStatus 沟通记录状态
 * @returns
 */
export const getCustomOrderStatus = (data: any, deliveryType:any, recordStatus:any) => {
  switch (data) {
    case -1:
      return { type: 'danger', label: '已关闭' }
    case 0:
      return { type: 'info', label: '发布订单' }
    case 5:
      return { type: 'info', label: '待审核' }
    case 10:
      return { type: 'info', label: '待接单' }
    case 15:
      if (deliveryType == 0) {
        if (recordStatus == 1) {
          return { type: 'info', label: '待确认' }
        } else {
          return { type: 'info', label: '待确认（待沟通）' }
        }
      } else {
        if (recordStatus == 1) {
          return { type: 'info', label: '待确认（已沟通）' }
        } else {
          return { type: 'info', label: '待确认（待沟通）' }
        }
      }
    case 20:
      return { type: 'info', label: '待付款' }
    case 25: return { type: 'info', label: '待开工' }
    case 30: return { type: '', label: '服务中' }
    case 35: return { type: 'info', label: '待验收' }
    case 40: return { type: 'warning', label: '待结算' }
    case 45: return { type: 'info', label: '待评价(结算完成)' }
    case 50: return { type: 'success', label: '已完成' }
    case 51: return { type: 'info', label: '已评价' }
    case 55: return { type: 'info', label: '待售后' }
    case 60: return { type: 'info', label: '退款中' }
    case 65: return { type: 'info', label: '取消' }
  }
}
