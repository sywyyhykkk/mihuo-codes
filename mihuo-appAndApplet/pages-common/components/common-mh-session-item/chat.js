import moment from "@/static/js/moment.js"
import {imgcache} from '@/plugins/storage.js'
const xsoftmsdk = require('@/plugins/im/xsoftimsdk.js')
import imConfig from "@/config/baseUrl.js"
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
	meridiemHour: function(hour, meridiem) {
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
	meridiem: function(hour, minute, isLower) {
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
	ordinal: function(number, period) {
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
export const toDescription = function(message) {
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
			return "'对方'撤回了一条消息";
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
// 消息通知的处理
export const getNoticeDate = (d) => {
	if(!d) return "";
	const date = new Date(d.replace(/-/g,'/'));
	let oldDate = date.getDay();
	let newDate = new Date().getDay();
	if (oldDate == newDate) {
		return moment(d).format('a hh:mm');
	}else{
		let dStamp = new Date(d.replace(/-/g,'/')).getTime()/1000;
		let nStamp = new Date().getTime()/1000;
		let diffDate = (nStamp-dStamp)/(60*60*24);
		if(diffDate<2){
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
// 时间戳换算成会话列表的时间
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
// 聊天中的文件处理有就存取并且返回文件的本地路径
export const setLocalStorage = async (id, isThumb = true) => {
	let url = uni.getStorageSync('imUserInfo').baseUrl + `/api/Common/GetFile?fileId=${id}&isThumb=${isThumb}`;
	const [select] = imgcache.select({
		url
	}) // 查询缓存是否存在
	if (select) {
		const path = select.local
		if (await resolveFile(path)) return path // 判断本地文件是否存在 如果存在则显示本地文件
		imgcache.delete(select) // 如果本地文件不存在则删除缓存数据
	}
	const local = await download(url) // 下载文件
	if (local) imgcache.insert({
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
// 聊天图片的下载
function download(url, dir = '') {
	return new Promise(resolve => {
		uni.downloadFile({
			url: url,
			header: {
				'Content-Type': 'application/json;charset=UTF-8',
				'Authorization': 'Bearer' + ' ' + uni.getStorageSync('imUserInfo').token,
				'VERSION': imConfig.VERSION
			},
			success: (res) => {
				uni.saveFile({
					tempFilePath: res.tempFilePath,
					success: (data) => {
						let savedFilePath = data.savedFilePath;
						resolve(savedFilePath || null);
					}
				});
			}
		})
	})
};

function getLocalTime(nS) {
	return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
}
  /* 通过文字二进制得到文字字节数 */
function getByteByBinary(binaryCode) {
    /**
     * 二进制 Binary system,es6表示时以0b开头
     * 八进制 Octal number system,es5表示时以0开头,es6表示时以0o开头
     * 十进制 Decimal system
     * 十六进制 Hexadecimal,es5、es6表示时以0x开头
     */
  var byteLengthDatas = [0, 1, 2, 3, 4]
  var len = byteLengthDatas[Math.ceil(binaryCode.length / 8)]
  return len
}
/* 通过文字十六进制得到文字字节数 */
function getByteByHex(hexCode) {
  return getByteByBinary(parseInt(hexCode, 16).toString(2))
}
/**
 *  字符串截取 支持emojj表情  maxLength 字节长度 字符长度*2
 * @param {*} str
 * @param {*} maxLength
 */
export const substringByByte = function(str, maxLength) {
  var result = ''
  var flag = false
  var len = 0
  var length = 0
  var length2 = 0
  for (var i = 0; i < str.length; i++) {
    var code = str.codePointAt(i).toString(16)
    if (code.length > 4) {
      i++
      if ((i + 1) < str.length) {
        flag = str.codePointAt(i + 1).toString(16) == '200d'
      }
    }
    if (flag) {
      len += getByteByHex(code)
      if (i == str.length - 1) {
        length += len
        if (length <= maxLength) {
          result += str.substr(length2, i - length2 + 1)
        } else {
          break
        }
      }
    } else {
      if (len != 0) {
        length += len
        length += getByteByHex(code)
        if (length <= maxLength) {
          result += str.substr(length2, i - length2 + 1)
          length2 = i + 1
        } else {
          break
        }
        len = 0
        continue
      }
      length += getByteByHex(code)
      if (length <= maxLength) {
        if (code.length <= 4) {
          result += str[i]
        } else {
          result += str[i - 1] + str[i]
        }
        length2 = i + 1
      } else {
        break
      }
    }
  }
  return result
}
