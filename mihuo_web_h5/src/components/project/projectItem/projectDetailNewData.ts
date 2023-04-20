interface CardType {
  row: any,
  time: any
}

interface GroupType {
  row: any,
  time: any
}

import moment from 'moment'
//startDate 开始日期 endDate 结束日期
export const getWorkTime = (startDate:string,endDate:string) => {
  if(!startDate || !endDate) return 0
  var differTime = moment(endDate).valueOf() - moment(startDate).valueOf()
  if(differTime && differTime <= 0) return 0
  //计算相差天数
  var days = Math.floor(differTime/(24*60*60*1000))
  //计算小时数
  var remainingM = differTime%(24*60*60*1000)//计算天数后剩余的毫秒数
  var hours = Math.floor(remainingM/(60*60*1000))
  //计算相差分钟数
  var remainingM2 = remainingM%(60*60*1000)//计算呢小时数后剩余的毫秒数
  var minutes = Math.floor(remainingM2/(60*1000))
  //计算相差秒数
  var remainingM3 = remainingM2%(60*1000)//计算分钟数后剩余的毫秒数
  var seconds = Math.round(remainingM3/1000)
  var totalTime = ''
  if(days>0){
    totalTime = days + '天' + hours + '小时' + minutes + '分钟'
  }else{
    if(hours>0){
      totalTime = hours + '小时' + minutes + '分钟'
    }else{
      totalTime = minutes + '分钟'
    }
  }
  return totalTime
}

//分组数据处理
export const getGroupType = ({ row, time }: GroupType) => {
  row.forEach((item: any, index: number) => {
    let groupType0 = 0, groupType1 = 0, groupType2 = 0, groupType3 = 0
    item.nodes.forEach((item2: any) => {
      // item2.cardType = item2.status - 1
      item2.cardType = getCardType({ row: item2, time: time })
      switch (item2.cardType) {
        case 1://进行中
          groupType1 = groupType1 + 1
          break
        case 2://已完成
          groupType2 = groupType2 + 1
          break
        case 3://已超期
          groupType3 = groupType3 + 1
          break
        default://未开始，默认
          groupType0 = groupType0 + 1
          break
      }
    })
    //未开始
    if (groupType0 > 0 && groupType1 == 0 && groupType2 == 0 && groupType3 == 0) {
      item.groupType = 0
      item.groupAbnormal = groupType0
    }
    //进行中
    if (groupType0 >= 0 && groupType1 > 0 && groupType2 >= 0 && groupType3 == 0) {
      item.groupType = 1
      item.groupAbnormal = groupType1
    } //已完成
    if (groupType0 == 0 && groupType1 == 0 && groupType2 > 0 && groupType3 == 0) {
      item.groupType = 2
      item.groupAbnormal = groupType2
    }//已超期
    if (groupType0 >= 0 && groupType1 >= 0 && groupType2 >= 0 && groupType3 > 0) {
      item.groupType = 3
      item.groupAbnormal = groupType3
    }
  })
  return row

}

// console.log(getDaysBetween('2022-04-17', '2022-04-17'))    答案==0
// time,项目的计划完工日期
export const getCardType = ({ row, time }: CardType) => {
  // if (row.planDay == 0 && !row.expectFinishTime) {
  //   row.expectStartTime = ''
  //   return 0
  // }
  // //当天日期小于计划开始日期且没有完工时间的表示未开始
  // if (row.expectStartTime && getDaysBetween(row.expectStartTime, new Date()) < 0 && !row.realEndTime) {
  //   // console.log('未开始')
  //   return 0
  // }
  // //  //当天日期大于等于计划开始日期且当天日期小于等于计划完工日期且没有完工时间的表示进行中
  // if (row.expectStartTime && getDaysBetween(row.expectStartTime, new Date()) >= 0 && row.expectFinishTime && getDaysBetween(row.expectFinishTime, new Date()) <= 0 && !row.realEndTime) {
  //   // console.log('进行中')
  //   return 1
  // }
  // //有完工日期的表示已完成
  // if (row.realEndTime) {
  //   // console.log('已完成')
  //   return 2
  // }

  //	任务状态： 0=未派单；1=已派单（未执行）2=执行中（开工中）3=执行结束（完工）4=异常（风险）
  if (row.status == '0') {
    if (getDaysBetween(time, new Date()) > 0) {
      return 3
    }
    if(getDaysBetween(row.expectStartTime, new Date()) < 0 && !row.realEndTime){
      return 0
    }

  }
  if (row.status == '1') {
    if (row.businessType == '1002') return 2
    else return 0
  }
  if (row.status == '2') {
    return 1
  }
  if (row.status == '3') {
    return 2
  }

  //有延期天数且没有实际完工日期的表示已超期 或者 当前日期大于计划完工日期且没有实际完工日期的
  if ((row.delayDays || row.expectFinishTime && getDaysBetween(row.expectFinishTime, new Date()) > 0) && !row.realEndTime) {
    // console.log('已超期')
    return 3
  }
  if (!row.expectFinishTime && getDaysBetween(time, new Date()) > 0) {
    row.expectFinishTime = time
    row.expectStartTime = ''
    return 3
  }
  return 0
}
// 计算两个日期之间得天数
// dateString1减数
// dateString2被减数
import { Format } from '@/getDate'

export const getDaysBetween = (dateString1: any, dateString2: any) => {
  if (!dateString1 || !dateString2) {
    return 0
  } else {
    var startDate = Date.parse(Format(dateString1, 'yyyy-MM-dd'))
    var endDate = Date.parse(Format(dateString2, 'yyyy-MM-dd'))
    var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000)
    return days
  }
}

export const getStatusImg = (index: any) => {
  switch (index) {
    case 0 ://未开始
      return 'statusNotStart.png'
      break
    case 1://进行中
      return 'statusProcess.png'
      break
    case 2://已完成
      return 'statusFinish.png'
      break
    case 3://已超期
      return 'statusExceed.png'
      break
    case 4://已停工
      return 'statusLockout.png'
      break
    default :
      return 'statusNotStart.png'
      break
  }
}

export const getStyle = (index: any) => {
  switch (index) {
    case 1:
      return 'background: #ECF5FF;'
      break
    case 2:
      return 'background: #F0F9EB;'
      break
    case 3:
      return 'background: #FEF0F0;'
      break
    case 4:
      return 'background: #F7F7F7;'
      break
    default :
      return 'background: #F7F7F7;'
      break
  }
}

export const getStyleBorder = (index: any) => {
  switch (index) {
    case 0 ://未开始
      return ' border-left: 6px solid #C0C4CC;'
      break
    case 1://进行中
      return 'border-left: 6px solid #409EFF;'
      break
    case 2://已完成
      return 'border-left: 6px solid #2DA44E;'
      break
    case 3://已超期
      return 'border-left: 6px solid #F56C6C;'
      break
    case 4://已停工
      return 'border-left: 6px solid #409EFF;'
      break
    default :
      return 'border-left: 6px solid #C0C4CC;'
      break
  }
}

// 解析url
let imageGlobal: any
// if (process.env.NODE_ENV === 'development') {
// 	imageGlobal=process.env.VUE_APP_FILES_PATH
// } else if (process.env.NODE_ENV === 'production') {
// 	imageGlobal=process.env.VUE_APP_FILES_PATH
// }
export const thumbnailImage = (url: any) => {
  imageGlobal = process.env.VUE_APP_FILES_PATH
  if (!url) {
    return ''
  }
  return imageGlobal + '' + url.replace('/admin/sys-file/mihuo-test/', '').replace(imageGlobal, '')
}
import getDate from '@/getDate'


// 计算时间差
export const getDateDiff = (dateTimeStamp: any) => {
  var minute = 1000 * 60
  var hour = minute * 60
  var day = hour * 24
  var halfamonth = day * 15
  var month = day * 30
  var now = new Date().getTime()
  var diffValue = now - Date.parse(new Date(dateTimeStamp).toString())//格式化时间
  // console.log('sdsd', dateTimeStamp)

  var monthC: any = diffValue / month
  var weekC: any = diffValue / (7 * day)
  var dayC: any = diffValue / day
  var hourC: any = diffValue / hour
  var minC: any = diffValue / minute

  let result = ''
  let style = ''
  let days = 0
  if (diffValue < 0) {
    if (Math.abs(parseInt(dayC)) == 0) {
      result = '明天'
      style = `
        color: #FFFFFF !important;
        background: #409EFF !important;
        border: none !important;
      `
    } else if (Math.abs(parseInt(dayC)) == 1) {
      result = '后天'
      style = `
        color: #FFFFFF !important;
        background: #409EFF !important;
        border: none !important;
      `
    } else if (Math.abs(parseInt(dayC)) > 1 && Math.abs(parseInt(dayC)) <= 2) {
      result = '' + Math.abs(parseInt(dayC)).toString() + '天后'
      style = `
        color: #FFFFFF !important;
        background: #409EFF !important;
        border: none !important;
      `
    } else if (Math.abs(parseInt(dayC)) > 2 && Math.abs(parseInt(dayC)) < 90) {
      result = getDate.Format(dateTimeStamp, 'MM月dd日')
      style = `
        color: #909399 !important;
        background: #F5F7FA !important;
        border: none !important;
      `
    } else {
      result = getDate.Format(dateTimeStamp, 'yyyy年MM月dd日')
      style = `
        color: #909399 !important;
        background: #F5F7FA !important;
        border: none !important;
      `
    }
  } else {
    days = parseInt(dayC)
    if (monthC >= 1) {
      result = getDate.Format(dateTimeStamp, 'yy年MM月dd日')
    } else if (weekC >= 1) {
      result = getDate.Format(dateTimeStamp, 'MM月dd日')
    } else if (parseInt(dayC) == 0) {
      result = '今天'
    } else if (parseInt(dayC) == 1) {
      result = '昨天'
    } else if (parseInt(dayC) > 1) {
      result = '' + parseInt(dayC).toString() + '天前'
    } else if (hourC >= 1) {
      result = '' + parseInt(hourC).toString() + '小时前'
    } else if (minC >= 1) {
      result = '' + parseInt(minC).toString() + '分钟前'
    } else {
      result = '刚刚'
    }
  }
  return {
    'days': days,
    'result': result,
    'style': style
  }
}

//获取订单需求类型
export const getRequirementType = (val: any) => {
  switch (val) {
    case 1:
      return '装修'
      break
    case 2:
      return '维修'
      break
    case 3:
      return '安装'
      break
    case 4:
      return '设计'
      break
    case 5:
      return '其他'
      break
  }
}

export const getBusinessType = (businessType: any) => {
  switch (businessType) {
    case '1001' :
      return '选材'
      break
    case '1002' :
      return '派单'
      break
    case '1003' :
      return '预算'
      break
    case '1004' :
      return '施工'
      break
    case '1005' :
      return '验收'
      break
    case '1006' :
      return '上传'
      break
    case '1009' :
      return '评价'
      break
    case '1010' :
      return '交底'
      break
    case '1011' :
      return '量房'
      break
    case '1012' :
      return '收款'
      break
    default :
      return '未知'
      break
  }
}

export const getTooltip = (checkStatus: any, businessType: any) => {
  let name: any = ''
  if (businessType == '1004') {//施工
    if (checkStatus == '0') {
      name = '未完工'
    }
    if (checkStatus == '1') {
      name = '待验收'
    }
    if (checkStatus == '2') {
      name = '待整改'
    }
  }
  if (businessType == '1005') {//验收
    if (checkStatus == '0') {
      name = '未验收'
    }
    if (checkStatus == '1') {
      name = '待验收'
    }
  }
  return name
}

//获取项目状态
export const getProjectStatus = (status: any) => {
  switch (status) {
    case 0 :
      return '<span style="color:#f2aa3d ">【施工中】</span>'
      break
    case 1 :
      return '<span style="color:#f56c6c ">【已停工】</span>'
      break
    case 2 :
      return '<span style="color:#f2aa3d ">【施工中】</span>'
      break
    case 3 :
      return '<span style="color:#67c23a ">【已完工】</span>'
      break
  }
}

//团队成员工人分组
export const getGroupByWorker = (data: object[]) => {
  let list: any = data.length > 0 ? JSON.parse(JSON.stringify(data)) : []
  let workerList: any = []
  let idx = -1
  list.forEach((res: any, index: number) => {
    if (res.jobCode == 'JOB_WORKER') {
      idx = index
      workerList = groupData(res.members, 'skillId', 'skillName')
    }
  })

  if (idx < 0) return list
  else return list.concat(workerList)

}
const groupData = (data: any, filed: any, lable: string) => {
  // map用来保存存过的字段 为下边添加新对象或者将相同字段的数据保存到同一个list中
  let map = {}
  // dest主要保存分组后的数据
  let dest: any = []
  data.forEach((item: any, index: any) => {
    // 判断map对象中是否有遍历时data的key 如果没有则向dest数组中推入一个新的对象(包含两个属性，一个要分组的字段名，一个保存相同字段名数据的数组)
    if (!map[item[filed]]) {
      dest.push({
        [filed]: item[filed],
        members: [item],
        [lable]: item[lable],
        jobCode: 'JOB_WORKER'
      })
      // 进行一次新添对象的记录
      map[item[filed]] = item
      // 如果在map中有data遍历的key(字段相同) 则向dest数组里面的相同字段的list下推入数据
    } else {
      dest.forEach((dItem: any) => {
        if (dItem[filed] == item[filed]) {
          dItem.members.push(item)
        }
      })
    }
  })

  return dest
}
