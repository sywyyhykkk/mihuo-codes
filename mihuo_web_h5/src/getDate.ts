const getDate = {

  Format(date: any, fmt: any) { //author: meizz
    const getdate: any = new Date(date)
    var o = {
      'M+': getdate.getMonth() + 1, //月份
      'd+': getdate.getDate(), //日
      'h+': getdate.getHours(), //小时
      'm+': getdate.getMinutes(), //分
      's+': getdate.getSeconds(), //秒
      'q+': Math.floor((getdate.getMonth() + 3) / 3), //季度
      'S': getdate.getMilliseconds() //毫秒
    }
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (getdate.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (var k in o)
      if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    return fmt
  }

}

export default getDate
export const Format = (date: any, fmt: any) => { //author: meizz
  const getdate: any = new Date(date)
  var o = {
    'M+': getdate.getMonth() + 1, //月份
    'd+': getdate.getDate(), //日
    'h+': getdate.getHours(), //小时
    'm+': getdate.getMinutes(), //分
    's+': getdate.getSeconds(), //秒
    'q+': Math.floor((getdate.getMonth() + 3) / 3), //季度
    'S': getdate.getMilliseconds() //毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (getdate.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  return fmt
}
