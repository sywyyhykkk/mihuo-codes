import { imageGlobal } from '@/global'

export const getPic = (e: any) => {
  const imageData: any = []
  e.split(',').forEach((res: any) => {
    imageData.push(imageGlobal + res.replace(imageGlobal, ''))
  })
  return imageData
}

const getUrl = {
  /**
   *
   * @param {String} url: 图片地址
   * @param {Boolean} picType: url类型
   * @param {Boolean} isPrueImg: 是否添加缩略图后缀
   * @param {width} width: 缩略图默认宽度
   * */
  getPicUrl(url: any, picType: boolean, isPrueImg = true, width = 120) {
    const parameterInfo = '?x-image-process=image/resize,m_fixed,'

    const parameters = isPrueImg ? parameterInfo + `w_${width}` : ''
    if (!url) {
      return []
    }
    if (typeof url === 'object') {
      const urls: any = []
      url.forEach((res: any) => {
        if (res.type == 'img') {
          urls.push(res.url)
        }
      })
      if (urls.length == 0) {
        return null
      }
      if (picType) {
        return imageGlobal + urls[0].replace(imageGlobal, '').replace('/admin/sys-file/mihuo-test/', '') + parameters
      } else {
        var imageData: any = []
        urls.forEach((res: any) => {
          imageData.push(imageGlobal + res.replace(imageGlobal, '').replace('/admin/sys-file/mihuo-test/', ''))
        })
      }
    } else {
      // if (isPrueImg) {
      //   if (picType) {
      //     return imageGlobal + url.split(',')[0].replace(imageGlobal, '').replace('/admin/sys-file/mihuo-test/', '') + parameters
      //   } else {
      //     return imageGlobal + url.replace(imageGlobal, '').replace('/admin/sys-file/mihuo-test/', '') + parameters
      //   }
      // }
      var imageData: any = []
      if (picType) {
        imageData.push(imageGlobal + url.split(',')[0].replace(imageGlobal, '').replace('/admin/sys-file/mihuo-test/', '') + parameters)
      } else {
        var imageData: any = []
        url.split(',').forEach((res: any) => {
          imageData.push(imageGlobal + res.replace(imageGlobal, '').replace('/admin/sys-file/mihuo-test/', ''))
        })
      }
    }

    return imageData
  },

  // 根据userId获取头像
  avatarImage(userId: any, thumbnail: any, width = 100) {
    const parameterInfo = '?x-image-process=image/resize,m_fixed,'
    const parameters = thumbnail ? parameterInfo + `w_${width}` : ''
    return imageGlobal + 'avatar/' + userId + '.png' + parameters + `&time=${new Date().getTime()}`
  },
  // 当没有头像时，破图时
  imageError(e: any) {
    const img = e.srcElement
    img.src = `${require('@/assets/img/avatar_new.png')}`
    img.onerror = null // 防止闪图
  }
}

export default getUrl
