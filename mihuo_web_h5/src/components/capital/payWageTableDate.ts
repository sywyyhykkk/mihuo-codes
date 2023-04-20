// 计算时间差
export const getDateDiff = (dateTimeStamp: any) => {
  var minute = 1000 * 60
  var hour = minute * 60
  var day = hour * 24
  var halfamonth = day * 15
  var month = day * 30
  var now = new Date().getTime()
  var diffValue = now - Date.parse(new Date(dateTimeStamp).toString())//格式化时间
  console.log('sdsd', diffValue)
  if (diffValue < 0) {
    return
  }
  var monthC: any = diffValue / month
  var weekC: any = diffValue / (7 * day)
  var dayC: any = diffValue / day
  var hourC: any = diffValue / hour
  var minC: any = diffValue / minute

  let result = ''
  let color = ''

  if (monthC >= 1) {
    result = '' + parseInt(monthC).toString() + '个月前'
    color='#F56C6C'
  } else if (weekC >= 1) {
    result = '' + parseInt(weekC).toString() + '周前'
    color='#F2AA3D'
  } else if (dayC >= 1) {
    result = '' + parseInt(dayC).toString() + '天前'
    color='#F2AA3D'
  } else if (hourC >= 1) {
    result = '' + parseInt(hourC).toString() + '小时前'
    color='#67C23A'
  } else if (minC >= 1) {
    result = '' + parseInt(minC).toString() + '分钟前'
    color='#67C23A'
  } else {
    result = '刚刚'
    color='#67C23A'
  }
  return {
    'result': result,
    'color': color
  }
}

