import moment from "moment"
import { ImStore } from '_@/store/modules/im'
import { fetch } from '_@/axios-config/axios'
import imrequest from '@/utils/imrequest.ts'
const xsoftmsdk = require('@/xsoftimsdk.js')
moment.locale('zh-cn', {
  months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
  monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
  weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
  weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
  weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'YYYY-MM-DD',
    LL: 'YYYY年MM月DD日',
    LLL: 'YYYY年MM月DD日Ah点mm分',
    LLLL: 'YYYY年MM月DD日ddddAh点mm分',
    l: 'YYYY-M-D',
    ll: 'YYYY年M月D日',
    lll: 'YYYY年M月D日 HH:mm',
    llll: 'YYYY年M月D日dddd HH:mm'
  },
  meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
  meridiemHour: function (hour, meridiem) {
    if (hour === 12) {
      hour = 0;
    }
    if (meridiem === '凌晨' || meridiem === '早上' ||
      meridiem === '上午') {
      return hour;
    } else if (meridiem === '下午' || meridiem === '晚上') {
      return hour + 12;
    } else {
      // '中午'
      return hour >= 11 ? hour : hour + 12;
    }
  },
  meridiem: function (hour, minute, isLower) {
    const hm = hour * 100 + minute;
    if (hm < 600) {
      return '凌晨';
    } else if (hm < 900) {
      return '早上';
    } else if (hm < 1130) {
      return '上午';
    } else if (hm < 1230) {
      return '中午';
    } else if (hm < 1800) {
      return '下午';
    } else {
      return '晚上';
    }
  },
  calendar: {
    sameDay: '[今天]LT',
    nextDay: '[明天]LT',
    nextWeek: '[下]ddddLT',
    lastDay: '[昨天]LT',
    lastWeek: '[上]ddddLT',
    sameElse: 'L'
  },
  dayOfMonthOrdinalParse: /\d{1,2}(日|月|周)/,
  ordinal: function (number, period) {
    switch (period) {
    case 'd':
    case 'D':
    case 'DDD':
      return number + '日';
    case 'M':
      return number + '月';
    case 'w':
    case 'W':
      return number + '周';
    default:
      return number;
    }
  },
  relativeTime: {
    future: '%s内',
    past: '%s前',
    s: '几秒',
    ss: '%d秒',
    m: '1分钟',
    mm: '%d分钟',
    h: '1小时',
    hh: '%d小时',
    d: '1天',
    dd: '%d天',
    M: '1个月',
    MM: '%d个月',
    y: '1年',
    yy: '%d年'
  },
  week: {
    // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
})
//单人聊天的信息类型处理
export const toDescription = function (message) {
  const customer = message.CustomContent ? JSON.parse(message.CustomContent || '{}') : '';
  switch (message.Type) {
  case xsoftmsdk.enums.ContentType.Text:
    return message.Content;
  case xsoftmsdk.enums.ContentType.Link:
    return '[链接]';
  case xsoftmsdk.enums.ContentType.Image:
    return '[图片]';
  case xsoftmsdk.enums.ContentType.Voice:
    return '[语音]';
  case xsoftmsdk.enums.ContentType.Video:
    return '[视频]';
  case xsoftmsdk.enums.ContentType.File:
    return '[文件]';
  case xsoftmsdk.enums.ContentType.ReCall:
    if (message.MeaageType == xsoftmsdk.enums.MessageTypeEnum.Group) {
      return `'${message.SourceId}'撤回了一条消息`;
    }
    return "'对方'撤回了一条消息]";
  case xsoftmsdk.enums.ContentType.Custom:
    switch (customer.contentType) {
    case 1:
      return '[电话号码交换]';
    case 2:
      return '[订单确认]';
    case 12:
      return '[地理位置]'
    }
  }
}
//消息通知的处理
export const getNoticeDate = (d) => {
  if (!d) return "";
  const date = new Date(d.replace(/-/g, '/'));
  let oldDate = date.getDay();
  let newDate = new Date().getDay();
  if (oldDate == newDate) {
    return moment(d).format('a hh:mm');
  } else {
    let dStamp = new Date(d.replace(/-/g, '/')).getTime() / 1000;
    let nStamp = new Date().getTime() / 1000;
    let diffDate = (nStamp - dStamp) / (60 * 60 * 24);
    if (diffDate < 2) {
      return moment(d).calendar();
    }
  }
  const dateY = date.getFullYear();
  const currentDateY = new Date().getFullYear();
  if (dateY == currentDateY) {
    return moment(d).format('MM-DD HH:mm')
  }
  return moment(d).format('YYYY/MM/DD HH:mm')
}
//时间戳换算成会话列表的时间
export const getShowDate = (stamp, hm = true) => {
  let nowdate = parseInt(new Date().getTime() / 1000);
  let utc = nowdate - stamp;
  let diffDate = utc / (24 * 60 * 60);
  let messagedate = new Date(parseInt(stamp) * 1000)
  let oldDate = messagedate.getDay();
  let newDate = new Date().getDay();
  if (diffDate < 2) {
    if (newDate != oldDate) {
      return moment(messagedate).calendar();
    }
    return moment(messagedate).format('a hh:mm');
  }
  if (diffDate > 2 && diffDate < 7) {
    let s = hm ? 'dddd HH:mm' : 'dddd';
    return moment(messagedate).format(s);
  }
  let s = hm ? 'YYYY/MM/DD HH:mm' : 'YYYY/MM/DD';
  return moment(messagedate).format(s)
}
//聊天中的文件处理有就存取并且返回文件的本地路径
export const setLocalStorage = async (id, isThumb = true) => {
  let url = uni.getStorageSync('imUserInfo').baseUrl + `/api/Common/GetFile?fileId=${id}&isThumb=${isThumb}`;
  const [select] = storage.select({
    url
  }) // 查询缓存是否存在
  if (select) {
    const path = select.local
    if (await resolveFile(path)) return path // 判断本地文件是否存在 如果存在则显示本地文件
    storage.delete(select) // 如果本地文件不存在则删除缓存数据
  }
  const local = await download(url) // 下载文件
  if (local) storage.insert({
    url,
    local
  }); // 缓存数据
  return local;
}
export function resolveFile(url) {
  return new Promise(resolve => {
    // #ifdef APP-PLUS
    plus.io.resolveLocalFileSystemURL(url, resolve, () => resolve(null))
    // #endif

    // #ifndef APP-PLUS
    resolve(null)
    // #endif
  })
}
export function getCurrentTamp() {
  return Math.floor(new Date().getTime() / 1000)
}
export const openIm = (data, type = xsoftmsdk.enums.SessionType.Normal) => {
  fetch({
    url: `/basic/im/getimidbyuserid/${data.userId}`,
    method: 'get'
  }).then(async (res) => {
    console.log(res)
    const { sessionList } = ImStore
    const index = sessionList.findIndex(
      (item) => item.TargetId == Number(res.data.imId)
    )
    let userInfo = ImStore.userList.find(
      (item) => item.ImId == res.data.imId
    )
    if (!userInfo) {
      ImStore.GetUserList([
        { ImId: res.data.imId,Name:res.data.name,...res.data }
      ])
    }
    if (index < 0 || (sessionList[index] && !sessionList[index].Message.length)) {
      if (!sessionList[index]) {
        ImStore.AddSessionList([
        {
          TargetName: res.data.name,
          TargetId: res.data.imId,
          ChangeTime: getCurrentTamp(),
          Type: type == xsoftmsdk.enums.SessionType.Normal ? xsoftmsdk.enums.SessionType.Normal : xsoftmsdk.enums.SessionType.Group,
          Message: []
        }])
      }
      ImStore.SetImShow(true)
      if (type == xsoftmsdk.enums.SessionType.Group) {
        const result = await imrequest({
          url: '/api/Message/GetGroupMessages',
          params: {
            groupId: res.data.imId,
            index: 1,
            size: 20
          }
        })
        const session = ImStore.sessionList.find(item => item.TargetId == Number(res.data.imId))
        ImStore.SetToUser(session)
        if (result.Data.length) {
          ImStore.LoadGroupMessageList(result.Data.reverse())
        }
      } else {
        const result = await imrequest({
          url: 'api/Message/GetNormalMessages',
          params: {
            targetId: res.data.imId,
            index: 1,
            size: 20
          }
        })
        const session = ImStore.sessionList.find(item => item.TargetId == Number(res.data.imId))
        ImStore.SetToUser(session)
        if (result.Data.length) {

          ImStore.LoadNormalMessageList(result.Data.reverse())
        }
      }
    } else {
      //会话有了 但是还要判断是否有消息
      const session = ImStore.sessionList.find(item => item.TargetId == Number(res.data.imId))
      if (session.Message.length) {
        ImStore.SetToUser(session)
      } else {

      }
      ImStore.SetImShow(true)
    }
  })
}

function getLocalTime(nS) {
  return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
}