const CryptoJS = require('crypto-js')

const domain = 'https://mihuo-test.obs.cn-east-3.myhuaweicloud.com'
const parameter = '?x-image-process=image/resize,m_fixed,'
const parameterInfo = '?x-image-process=image/resize,m_fixed,'
// https://support.huaweicloud.com/fg-obs/obs_01_0430.html
export const encryption = (params: { data: any; type: any; param: any; key: any }) => {
  let {
    data,
    type,
    param,
    key
  } = params
  const result = JSON.parse(JSON.stringify(data))
  if (type === 'Base64') {
    param.forEach((ele: string | number) => {
      result[ele] = btoa(result[ele])
    })
  } else {
    param.forEach((ele: string | number) => {
      const data = result[ele]
      key = CryptoJS.enc.Latin1.parse(key)
      const iv = key
      // 加密
      const encrypted = CryptoJS.AES.encrypt(
        data,
        key, {
        iv: iv,
        mode: CryptoJS.mode.CFB,
        padding: CryptoJS.pad.NoPadding
      })
      result[ele] = encrypted.toString()
    })
  }
  return result
}

/**
 * 设置每个页面的title信息
 * @param {String} url: 图片地址
 * @param {Boolean} thumbnail: 是否添加缩略图后缀
 * @param {width} width: 缩略图默认宽度
 * */
import { imageGlobal } from '@/global'

export const thumbnailImage = (url: string, thumbnail: boolean, width = 120) => {
  let parameters = thumbnail ? parameterInfo + `w_${width}` : ''
  if (!url) {
    return ''
  }
  return imageGlobal + url.replace('/admin/sys-file/mihuo-test/', '') + parameters
}

export const avatarImage = (userId: [string, number], thumbnail: boolean, width = 100) => {
  const parameterInfo = '?x-image-process=image/resize,m_fixed,'
  let parameters = thumbnail ? parameterInfo + `w_${width}` : ''
  return imageGlobal + 'avatar/' + userId + '.png' + parameters;
}

// 多个图片放大查看imgs：json
export const imgSrcList = (imgsData: any) => {
  let tempImgs = [] as any
  if (typeof imgsData == 'string' && imgsData != '') {
    tempImgs = JSON.parse(imgsData)
  }
  if (!tempImgs) return []
  let arr = [] as any
  tempImgs.forEach((item: any) => {
    if (item.type === 'img')
      arr.push(thumbnailImage(item.url, false))
  })
  return arr
}

export const getOrderStatus = (status: any) => {
  switch (status) {
    case 0:
      return '待付款'
    case 1:
      return '待发货'
    case 2:
      return '已发货'
    case 3:
      return '服务中'
    case 4:
      return '已完成'
    case 5:
      return '待售后'
    case 6:
      return '售后完成'
    case 7:
      return '已关闭'
    case 8:
      return '退款'
    default:
      return '无效订单'
  }
}

export const getSkillName = (skillId: any) => {
  switch (Number(skillId)) {
    case 0:
      return '其他'
    case 1:
      return '木工'
    case 2:
      return '水电'
    case 3:
      return '瓦泥'
    case 4:
      return '拆除'
    case 5:
      return '美缝'
    case 6:
      return '油漆'
    default:
      return '其他'
  }
}

export const getTextColorType = (status: any) => {
  switch (Number(status)) {
    case 0:
      return 'info'
    case 1:
      return 'warning'
    case 2:
      return ''
    case 3:
      return 'warning'
    case 4:
      return 'success'
    case 5:
      return 'info'
    case 6:
      return 'danger'
    case 7:
      return 'danger'
    default:
      return ''
  }
}

export const getServiceType = (type: any) => {
  let typeNumber = Number(type) || type
  switch (typeNumber) {
    case 0:
      return '未选'
    case 1001:
      return '主材'
    case 1002:
      return '辅材'
    case 1003:
      return '人工'
    case 1004:
      return '服务'
    default:
      return ''
  }
}
export const getOrderStatusSupplier = (status: any) => {
  switch (status) {
    case 0:
      return '未下单'
    case 1:
      return '已下单'
    case 2:
      return '已拒绝'
    case 3:
      return '已接收'
    case 4:
      return '未发货'
    case 5:
      return '已发货/未验收'
    // case 6:
    //   return '未验收'
    case 7:
      return '已验收'
    case 8:
      return '退货单'
    case 9:
      return '无效订单'
    case 10:
      return '取消订单'
  }
}
export const getColorTypeSupplier = (status: any) => {
  switch (Number(status)) {
    case 0:
      return 'info'
    case 1:
      return 'success'
    case 2:
      return 'danger'
    case 3:
      return 'success'
    case 4:
      return 'info'
    case 5:
      return 'success'
    case 6:
      return 'info'
    case 7:
      return 'success'
    case 8:
      return 'warning'
    case 9:
      return 'info'
    case 10:
      return 'info'
  }
}

export const getSourceType = (type: any) => {
  let typeNumber = Number(type) || type
  switch (typeNumber) {
    case 0:
      return 'PC端'
    case 1:
      return 'C端App'
    case 2:
      return 'B端供应商'
    default:
      return ''
  }
}

/**
 * CryptoJS
 * 加密方式Hex 、Base64
 */
const key = CryptoJS.enc.Utf8.parse('cmp_security_key')
const options = {
  mode: CryptoJS.mode.ECB,
  padding: CryptoJS.pad.Pkcs7
}

export const encryptions = (value: string | number, type?: any) => {
  if (type == 'Base64') {
    return CryptoJS.AES.encrypt(value, key, options).toString()
  } else {
    return CryptoJS.AES.encrypt(value, key, options).ciphertext.toString()
  }
}

export const decrypts = (value: string | number, type?: any) => {
  if (type == 'Base64') {
    return CryptoJS.AES.decrypt(value, key, options).toString(CryptoJS.enc.Utf8)
  } else {
    return CryptoJS.AES.decrypt(CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(value)), key, options).toString(CryptoJS.enc.Utf8)
  }
}

/**
 * @description 获取人员信息,根据userId数组获取
 */
import { fetch } from '_@/axios-config/axios'

export const getPersonIdUser = async (data: object, callback: any) => {
  await fetch({
    url: `/admin/person/getPersonsByIds`,
    method: 'post',
    data: data
  }).then((res: any) => {
    if (res) {
      callback(res)
    }
  })
}

//深拷贝
export const deepClone = (target: any) => {
  // 定义一个变量
  let result: any = null
  // 如果当前需要深拷贝的是一个对象的话
  if (typeof target === 'object') {
    // 如果是一个数组的话
    if (Array.isArray(target)) {
      result = [] // 将result赋值为一个数组，并且执行遍历
      for (let i in target) {
        // 递归克隆数组中的每一项
        result.push(deepClone(target[i]))
      }
      // 判断如果当前的值是null的话；直接赋值为null
    } else if (target === null) {
      result = null
      // 判断如果当前的值是一个RegExp对象的话，直接赋值
    } else if (target.constructor === RegExp) {
      result = target
    } else {
      // 否则是普通对象，直接for in循环，递归赋值对象的所有值
      result = {}
      for (let i in target) {
        result[i] = deepClone(target[i])
      }
    }
    // 如果不是对象的话，就是基本数据类型，那么直接赋值
  } else {
    result = target
  }
  // 返回最终结果
  return result
}


// Base64的加密
export const baseEncode = (val: any) => {
  let data: any = val
  if (!val || val == undefined || val == null) {
    return val
  }
  if (typeof data == 'object') {
    Object.keys(data).forEach((res: string) => {
      data[res] = window.btoa(data[res])
    })
  } else {
    data = window.btoa(data)
  }
  // js原生base64加密
  return data
}
// Base64的解密
export const baseDecode = (val: any) => {
  // js原生base64解密
  let data: any = val
  if (!val || val == undefined || val == null) {
    return val
  }
  if (typeof data == 'object') {
    Object.keys(data).forEach((res: string) => {
      data[res] = window.atob(data[res])
    })
  } else {
    data = window.atob(data)
  }
  return data
}


// 图片路径转文件
//图片路径转blob,base64
// 使用xhr请求图片,并设置返回的文件类型为Blob对象[xhr.responseType = "blob"]
// 使用FileReader 对象接收blob
export const getBase64 = (imgUrl: string, callback: any) => {
  window.URL = window.URL || window.webkitURL
  var xhr = new XMLHttpRequest()
  xhr.open('get', imgUrl, true)
  // 至关重要
  xhr.responseType = 'blob'
  let base64: any = ''
  xhr.onload = (data: any) => {
    if (data.target.status == 200) {
      //得到一个blob对象
      var blob = data.target.response
      console.log('blob', blob)
      // //  至关重要
      // let oFileReader = new FileReader()
      // oFileReader.onloadend = (e: any) => {
      //   base64 = e.target.result
      //   // console.log('方式一》》》》》》》》》', base64)
      //   callback(base64)
      // }
      callback(blob)
      // oFileReader.readAsDataURL(blob)
    }
  }
  xhr.send()
}

// 限制输入的金额，正数小数点后两位val输入的金额
export const inputLimtPrice = (val: any) => {
  if (!val) return
  let value: any = "" + val;
  value =
    value
      .replace(/[^\d^\.]+/g, "")
      .replace(/^0+(\d)/, "$1")
      .replace(/^\./, "0.")
      .match(/^\d*(\.?\d{0,2})/g)[0] || "";
  return value
}

export const guid = () => {
  return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
}

const S4 = function () {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
}

//复制组建仅名称不同
/**
 * 将指定组件设置自定义名称
 *
 * @param {String} name 组件自定义名称
 * @param {Component | Promise<Component>} component
 * @return {Component}
 */