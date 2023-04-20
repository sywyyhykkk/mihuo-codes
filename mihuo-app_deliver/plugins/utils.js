// #ifdef APP-PLUS
import {
	judgePermission
} from './permission'
// #endif
import Vue from 'vue';
const CryptoJS = require("./crypto-js");
import $http from '@/config/requestConfig'
import store from '@/store';
import base from '@/config/baseUrl';
import moment from "@/static/js/moment.js"
// #ifdef H5
import {
	getLatLonH5,
	publicShareFun,
	wxPublicPay,
	getBrowser,
	appMutual
} from '@/config/html5Utils';
// 公众号分享
export const publicShare = publicShareFun;
// #endif
// #ifdef APP-PLUS
import appShareFun, {
	closeShare
} from '@/uni_modules/mihuo-APPshare/js_sdk/appShare';
import {
	onLogin
} from '../config/login';
import Loading from './loading.js'
import Toast from './toast.js'
//加密
const CryptoKey = CryptoJS.enc.Utf8.parse('mh_aes_v1')
// APP分享
let settingWritePhotosAlbum = false;
let locationAuthorize = true;
let system = uni.getSystemInfoSync();
const gdMapKey = '165379f5f2521b2a3bcc1eae14be9ca5'

//口令类别
export const wordType = {}

/**
 * 加密方法
 * @param data
 * @returns {string}
 */
export const encryptMethod = (word) => {
	const key = CryptoJS.enc.Utf8.parse('47FC4124CF94E070') // 密钥
	const iv = CryptoJS.enc.Utf8.parse('ovOh2xYoRdfATob6') // 密钥偏移量
	let srcs = CryptoJS.enc.Utf8.parse(word);

	let encrypted = CryptoJS.AES.encrypt(srcs, key, {
		iv,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.ZeroPadding
	});
	return encrypted.toString();
}
/**
 * 解密方法
 * @param word
 * @returns {string}
 */
export const decryptMethod = (word) => {
	const key = CryptoJS.enc.Utf8.parse('47FC4124CF94E070') // 密钥
	const iv = CryptoJS.enc.Utf8.parse('ovOh2xYoRdfATob6') // 密钥偏移量
	var decrypt = CryptoJS.AES.decrypt(word, key, {
		iv,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.ZeroPadding
	});
	return decrypt.toString(CryptoJS.enc.Utf8);
}
export const appShare = function(data, callbcak) {
	let userInfo = store.state.userInfo;
	if (!(userInfo && userInfo.uid)) {
		userInfo = uni.getStorageSync("userInfo");
	}
	let shareData = {
		shareTitle: data.shareTitle || base.share.title,
		shareUrl: data.shareUrl || base.share.link,
		shareContent: data.shareContent || base.share.desc,
		shareImg: data.shareImg || base.share.imgUrl,
	}
	if (userInfo && userInfo.uid) {
		if (data.shareUrl) {
			if (data.shareUrl.indexOf("?") >= 0) {
				shareData.shareUrl = data.shareUrl + "&recommend=" + userInfo.uid
			} else {
				shareData.shareUrl = data.shareUrl + "?recommend=" + userInfo.uid
			}
		} else if (base.share && base.share.link) {
			if (base.share.link.indexOf("?") >= 0) {
				shareData.shareUrl = base.share.link + "&recommend=" + userInfo.uid
			} else {
				shareData.shareUrl = base.share.link + "?recommend=" + userInfo.uid
			}
		}
	}
	return appShareFun({
		shareTitle: data.shareTitle || base.share.title,
		shareUrl: data.shareUrl || base.share.link,
		shareContent: data.shareContent || base.share.desc,
		shareImg: data.shareImg || base.share.imgUrl,
	}, callbcak);
};
export const closeAppShare = closeShare;
// #endif

// #ifdef MP-WEIXIN
// 微信小程序分享
export const wxShare = function(data = {}) {
	console.log('hahahaha')
	let shareInfo = {
		title: data.title || base.share.title,
	};
	if (data.path && typeof(data.path) == "string") {
		shareInfo.path = data.path;
	} else if (data.path != 1) {
		shareInfo.path = "pages/home/home";
	}
	if (data.imageUrl) {
		shareInfo.imageUrl = data.imageUrl;
	}
	let userInfo = store.state.userInfo;
	if (!(userInfo && userInfo.uid)) {
		userInfo = uni.getStorageSync("userInfo");
	}
	if (userInfo && userInfo.uid) {
		if (data.query && typeof(data.query) == "object") {
			data.query.recommendCode = userInfo.uid;
		} else {
			data.query = {
				recommendCode: userInfo.uid
			};
		}
	}
	if (data.query && typeof(data.query) == "object") {
		Object.keys(data.query).forEach((key, index) => {
			if (index > 0 && shareInfo.query) {
				shareInfo.query += "&" + key + "=" + data.query[key];
				shareInfo.path += "&" + key + "=" + data.query[key];
			} else {
				shareInfo.query = key + "=" + data.query[key];
				shareInfo.path += "?" + key + "=" + data.query[key];
			}
		});
	}
	return shareInfo;
}
// #endif

//支付（APP微信支付、APP支付宝支付、微信小程序支付）
export const setPay = function(payInfo, callback) {
	let httpUrl = "";
	if (payInfo.type == 'wxpay') {
		// APP微信支付
		httpUrl = 'api/pay/v1/pay_sign_wx'
	} else if (payInfo.type == 'alipay') {
		// APP支付宝支付
		httpUrl = 'api/pay/v1/pay_sign_ali'
	} else if (payInfo.type == 'smallPay') {
		// 微信小程序支付
		httpUrl = 'api/pay/v1/small_pay_sign_wx'
	}
	$http.get(httpUrl, {
		orderNo: payInfo.orderNo
	}).then(data => {
		let payData = {
			success: function(res) {
				callback && callback({
					success: true,
					data: res
				});
				console.log('success:' + JSON.stringify(res));
			},
			fail: function(err) {
				callback && callback({
					success: false,
					data: err
				});
				console.log('fail:' + JSON.stringify(err));
			}
		};
		if (payInfo.type == 'smallPay') {
			// 小程序
			payData.provider = 'wxpay';
			payData.timeStamp = data.timeStamp;
			payData.nonceStr = data.nonceStr;
			payData.package = data.package;
			// payData.package = "prepay_id=" + data.prepayid;
			payData.signType = "MD5";
			payData.paySign = data.sign;
		} else if (payInfo.type == 'wxpay') {
			// app微信
			payData.provider = 'wxpay';
			payData.orderInfo = data;
		} else if (payInfo.type == 'alipay') {
			// app 支付宝
			payData.provider = 'alipay';
			payData.orderInfo = data;
		} else if (payInfo.type == 'baidu') {
			payData.provider = 'baidu';
			payData.orderInfo = data;
		}
		console.log("支付参数", payData);
		uni.requestPayment(payData);
	}, err => {
		callback && callback({
			success: false,
			data: err
		});
	});
}
// 支付统一分配
export const setPayAssign = function(orderInfo, callback) {
	orderInfo.price = orderInfo.price || orderInfo.pricePay;
	orderInfo.title = orderInfo.title || orderInfo.orderTitle;
	//支付
	// #ifdef APP-PLUS
	uni.navigateTo({
		url: '/pages/home/weChatPay?orderNo=' + orderInfo.orderNo + '&price=' + orderInfo.price +
			'&title=' + orderInfo.title
	});
	// #endif
	// #ifdef MP-WEIXIN
	setPay({
		...orderInfo,
		type: "smallPay"
	}, res => {
		if (res.success) {
			uni.redirectTo({
				url: "/pages/shopCar/paySuccess?orderNo=" + orderInfo.orderNo
			});
		}
	});
	// #endif
	// #ifdef H5
	if (getBrowser() === '微信') {
		wxPublicPay({
			orderNo: orderInfo.orderNo
		}, function() {
			uni.redirectTo({
				url: "/pages/shopCar/paySuccess?orderNo=" + orderInfo.orderNo
			});
		});
	} else {
		appMutual('setJumpPay', orderInfo);
	}
	// #endif
}
// 获取地址信息 （微信小程序、APP、公众号）
export const getLatLon = function(tip) {
	return new Promise((resolve, reject) => {
		const successProcess = function(res) {
			store.commit("setCurrentAddress", {
				latitude: res.latitude,
				longitude: res.longitude
			});
			resolve(res);
		};
		const errProcess = function(err) {
			reject(err);
			if (tip) {
				uni.showToast({
					title: err,
					icon: "none"
				});
			}
		};
		// #ifdef H5
		getLatLonH5(successProcess, errProcess);
		// #endif
		// #ifndef H5
		getAppWxLatLon(successProcess, errProcess);
		// #endif
	});
}
// 身份证格式校验
export const checkIdCard = function(sIdCard) {
	//Wi 加权因子 Xi 余数0~10对应的校验码 Pi省份代码
	let Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
		Xi = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2],
		Pi = [11, 12, 13, 14, 15, 21, 22, 23, 31, 32, 33, 34, 35, 36, 37, 41, 42, 43, 44, 45, 46, 50, 51, 52, 53,
			54,
			61, 62, 63, 64, 65, 71, 81, 82, 91
		],
		checkStatus = 0;
	// 检查身份证长度
	if (sIdCard.length == 18) {
		checkStatus += 1;
	}
	//检验输入的省份编码是否有效
	if (checkStatus >= 1) {
		let p2 = sIdCard.substr(0, 2);
		for (let i = 0; i < Pi.length; i++) {
			if (Pi[i] == p2) {
				checkStatus += 1;
			}
		}
	}
	//检验18位身份证号码出生日期是否有效
	//parseFloat过滤前导零，年份必需大于等于1900且小于等于当前年份，用Date()对象判断日期是否有效。
	if (checkStatus >= 2) {
		let year = parseFloat(sIdCard.substr(6, 4));
		let month = parseFloat(sIdCard.substr(10, 2));
		let day = parseFloat(sIdCard.substr(12, 2));
		let checkDay = new Date(year, month - 1, day);
		let nowDay = new Date();
		if (1900 <= year && year <= nowDay.getFullYear() && month == (checkDay.getMonth() + 1) && day == checkDay
			.getDate()) {
			checkStatus += 1;
		}
	}
	//检验校验码是否有效
	if (checkStatus >= 3) {
		let aIdCard = sIdCard.split("");
		let sum = 0;
		for (let j = 0; j < Wi.length; j++) {
			sum += Wi[j] * aIdCard[j]; //线性加权求和
		}
		let index = sum % 11; //求模，可能为0~10,可求对应的校验码是否于身份证的校验码匹配
		if (Xi[index] == aIdCard[17].toUpperCase()) {
			checkStatus += 1;
		}
	}
	if (checkStatus == 4) {
		return true;
	} else {
		return false;
	}
};
// 时间距离现在多少天前
Vue.filter('dateDiff', function(val) {
	if (val) {
		return clickDateDiff(val);
	} else {
		return "";
	}
});
/**
 * 时间转换为XX前
 */
export const clickDateDiff = function(value) {
	let dataValue = value;
	if (typeof value == "string") {
		dataValue = new Date(value.replace(/-/g, "/")).getTime();
	}
	var result;
	var minute = 1000 * 60;
	var hour = minute * 60;
	var day = hour * 24;
	var month = day * 30;
	var now = new Date().getTime();
	var diffValue = parseInt(now) - parseInt(dataValue);
	if (diffValue < 0) {
		return;
	}
	var monthC = diffValue / month;
	var weekC = diffValue / (7 * day);
	var dayC = diffValue / day;
	var hourC = diffValue / hour;
	var minC = diffValue / minute;
	if (monthC >= 1) {
		result = "" + parseInt(monthC) + '月前';
	} else if (weekC >= 1) {
		result = "" + parseInt(weekC) + '周前';
	} else if (dayC >= 1) {
		result = "" + parseInt(dayC) + '天前';
	} else if (hourC >= 1) {
		result = "" + parseInt(hourC) + '小时前';
	} else if (minC >= 1) {
		result = "" + parseInt(minC) + '分钟前';
	} else {
		result = '刚刚';
	}
	return result;
};
/**
 * 时间戳转换为想要的时间格式
 */
//时间戳转换为时间 format('yyyy-MM-dd hh:mm:ss')
//时间格式转换
Date.prototype.format = function(fmt = 'yyyy-MM-dd hh:mm:ss') { //author: meizz
	var o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"h+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : ((
			"00" + o[
				k]).substr(("" + o[k]).length)));
	return fmt;
}
// 保存图片
export const saveImg = function(url, callback) {
	if (url) {
		// #ifdef MP-WEIXIN
		if (settingWritePhotosAlbum) {
			uni.getSetting({
				success: res => {
					if (res.authSetting['scope.writePhotosAlbum']) {
						uni.showLoading({
							title: '正在下载'
						});
						uni.downloadFile({
							url: url,
							success: data => {
								if (data.statusCode == 200) {
									uni.saveImageToPhotosAlbum({
										filePath: data.tempFilePath,
										success: () => {
											uni.hideLoading();
											callback && callback();
											uni.showToast({
												title: '保存成功'
											});
										},
										fail(e) {
											uni.hideLoading();
											tip({
												title: '下载失败，错误原因：' + e
													.errMsg,
												icon: "none"
											});
										}
									});
								} else {
									uni.hideLoading();
									uni.showToast({
										title: '下载失败',
										icon: "none"
									});
								}
							},
							fail(e) {
								uni.hideLoading();
								uni.showToast({
									title: '下载失败，错误原因：' + e.errMsg,
									icon: "none"
								});
							}
						});
					} else {
						uni.showModal({
							title: '提示',
							content: '请先在设置页面打开“保存相册”使用权限',
							confirmText: '去设置',
							cancelText: '算了',
							success: data => {
								if (data.confirm) {
									uni.openSetting();
								}
							}
						});
					}
				}
			});
		} else {
			settingWritePhotosAlbum = true;
			uni.authorize({
				scope: 'scope.writePhotosAlbum',
				success: () => {
					uni.showLoading({
						title: '正在下载'
					});
					uni.downloadFile({
						url: url,
						success: data => {
							if (data.statusCode == 200) {
								uni.saveImageToPhotosAlbum({
									filePath: data.tempFilePath,
									success: () => {
										uni.hideLoading();
										callback && callback();
										uni.showToast({
											title: '保存成功'
										});
									},
									fail(e) {
										uni.hideLoading();
										tip({
											title: '下载失败，错误原因：' + e.errMsg,
											icon: "none"
										});
									}
								});
							} else {
								uni.hideLoading();
								uni.showToast({
									title: '下载失败',
									icon: "none"
								});
							}
						},
						fail(e) {
							uni.hideLoading();
							uni.showToast({
								title: '下载失败，错误原因：' + e.errMsg,
								icon: "none"
							});
						}
					});
				}
			});
		}
		// #endif
		// #ifdef H5
		uni.showLoading({
			title: '正在下载'
		});
		uni.downloadFile({
			url: url,
			success: data => {
				uni.hideLoading();
				if (data.statusCode == 200) {
					callback && callback();
					window.open(data.tempFilePath);
				} else {
					uni.showToast({
						title: '下载失败',
						icon: "none"
					});
				}
			},
			fail(e) {
				uni.hideLoading();
				uni.showToast({
					title: '下载失败，错误原因：' + e.errMsg,
					icon: "none"
				});
			}
		});
		// #endif
		// #ifdef APP-PLUS
		uni.showLoading({
			title: '正在下载'
		});
		uni.saveImageToPhotosAlbum({
			filePath: url,
			success: () => {
				uni.hideLoading();
				callback && callback();
				uni.showToast({
					title: '保存成功'
				});
			},
			fail(e) {
				uni.hideLoading();
				uni.showToast({
					title: '下载失败，错误原因：' + e.errMsg,
					icon: "none"
				});
			}
		});
		// #endif
	} else {
		uni.showToast({
			title: '未找到图片',
			icon: 'none'
		});
	}
};
// 保存视频
function tip(data) {
	setTimeout(() => {
		uni.showToast(data);
	}, 500);
}
export const saveVideo = function(url, callback) {
	if (url) {
		// #ifdef MP-WEIXIN
		if (settingWritePhotosAlbum) {
			uni.getSetting({
				success: res => {
					if (res.authSetting['scope.writePhotosAlbum']) {
						// let urlArr = url.split("/");
						// let updateUrl = urlArr[urlArr.length - 1];
						// let  filePath = wx.env.USER_DATA_PATH + '/' + updateUrl;
						uni.showLoading({
							title: '正在下载'
						});
						uni.downloadFile({
							url: url,
							// filePath: filePath,
							success: data => {
								if (data.statusCode == 200) {
									uni.saveVideoToPhotosAlbum({
										filePath: data.tempFilePath,
										success: () => {
											uni.hideLoading();
											callback && callback();
											tip({
												title: '保存成功'
											});
										},
										fail(e) {
											uni.hideLoading();
											tip({
												title: '下载失败，错误原因：' + e
													.errMsg,
												icon: "none"
											});
										}
									});
								} else {
									uni.hideLoading();
									tip({
										title: '下载失败',
										icon: "none"
									});
								}
							},
							fail(e) {
								uni.hideLoading();
								tip({
									title: '下载失败，错误原因：' + e.errMsg,
									icon: "none"
								});
							}
						});
					} else {
						uni.showModal({
							title: '提示',
							content: '请先在设置页面打开“保存相册”使用权限',
							confirmText: '去设置',
							cancelText: '算了',
							success: data => {
								if (data.confirm) {
									uni.openSetting();
								}
							}
						});
					}
				}
			});
		} else {
			settingWritePhotosAlbum = true;
			uni.authorize({
				scope: 'scope.writePhotosAlbum',
				success: () => {
					// let urlArr = url.split("/");
					// let updateUrl = urlArr[urlArr.length - 1];
					// let filePath = wx.env.USER_DATA_PATH + '/' + updateUrl;
					uni.showLoading({
						title: '正在下载'
					});
					uni.downloadFile({
						url: url,
						// filePath: filePath,
						success: data => {
							if (data.statusCode == 200) {
								uni.saveVideoToPhotosAlbum({
									filePath: data.tempFilePath,
									success: () => {
										uni.hideLoading();
										callback && callback();
										tip({
											title: '保存成功'
										});
									},
									fail(e) {
										uni.hideLoading();
										tip({
											title: '下载失败，错误原因：' + e.errMsg,
											icon: "none"
										});
									}
								});
							} else {
								uni.hideLoading();
								tip({
									title: '下载失败，错误原因：' + data.errMsg,
									icon: "none"
								});
							}
						},
						fail(e) {
							uni.hideLoading();
							tip({
								title: '下载失败，错误原因：' + e.errMsg,
								icon: "none"
							});
						}
					});
				}
			});
		}
		// #endif
		// #ifdef H5
		uni.showLoading({
			title: '正在下载'
		});
		uni.downloadFile({
			url: url,
			success: data => {
				uni.hideLoading();
				if (data.statusCode == 200) {
					callback && callback();
					window.open(data.tempFilePath);
				} else {
					tip({
						title: '下载失败',
						icon: "none"
					});
				}
			},
			fail(e) {
				uni.hideLoading();
				tip({
					title: '下载失败，错误原因：' + e.errMsg,
					icon: "none"
				});
			}
		});
		// #endif
		// #ifdef APP-PLUS
		uni.showLoading({
			title: '正在下载'
		});
		uni.saveVideoToPhotosAlbum({
			filePath: url,
			success: () => {
				uni.hideLoading();
				callback && callback();
				tip({
					title: '保存成功'
				});
			},
			fail(e) {
				uni.hideLoading();
				tip({
					title: '下载失败，错误原因：' + e.errMsg,
					icon: "none"
				});
			}
		});
		// #endif
	} else {
		tip({
			title: '未找到视频',
			icon: 'none'
		});
	}
};
// 微信小程序获取定位权限判断
function wxAppletsLocation(successCallback, errCallback) {
	uni.getSetting({
		success: res => {
			if (res.authSetting['scope.userLocation']) {
				uni.getLocation({
					type: 'gcj02',
					success: res => {
						successCallback(res);
					},
					fail: (err) => {
						console.log("位置信息错误", err);
						errCallback("位置信息获取失败");
					}
				});
			} else {
				errCallback("“位置信息”未授权");
				uni.showModal({
					title: '提示',
					content: '请先在设置页面打开“位置信息”使用权限',
					confirmText: '去设置',
					cancelText: '再逛会',
					success: res => {
						if (res.confirm) {
							uni.openSetting();
						}
					}
				});
			}
		}
	});
}
// 获取地址信息
export const getAppWxLatLon = function(successCallback, errCallback) {
	const _this = this;
	// #ifdef MP
	if (locationAuthorize) {
		uni.authorize({
			scope: 'scope.userLocation',
			success: () => {
				wxAppletsLocation(successCallback, errCallback);
				locationAuthorize = false;
			},
			fail: () => {
				locationAuthorize = false;
			}
		});
	} else {
		wxAppletsLocation(successCallback, errCallback);
	}
	// #endif
	// #ifdef APP-PLUS
	judgePermission("location", function(result) {
		if (result == 1) {
			uni.getLocation({
				type: 'gcj02',
				success: res => {
					successCallback(res);
				},
				fail: (err) => {
					errCallback("位置信息获取失败");
				}
			});
		}
	});
	// #endif
}

//金额过滤
Vue.filter('money', function(val) {
	console.log(val);
	if (val) {
		let value = Math.round(parseFloat(val) * 100) / 100;
		let valMoney = value.toString().split(".");
		if (valMoney.length == 1) {
			value = value.toString() + ".00";
			return value;
		}
		if (valMoney.length > 1) {
			if (valMoney[1].length < 2) {
				value = value.toString() + "0";
			}
			return value;
		}
		return value;
	} else {
		return "0.00";
	}
});
// 时间格式化
Vue.filter('timeFormat', function(val, fmt = 'yyyy-MM-dd hh:mm:ss') {
	if (val) {
		if (typeof val == "string") {
			let timeText = val.replace(/-/g, "/");
			return new Date(timeText).format(fmt);
		} else if (typeof val == "number") {
			return new Date(val).format(fmt);
		}
	} else {
		return "";
	}
});
// #ifdef APP-PLUS
// 文字换行
function drawtext(text, maxWidth) {
	let textArr = text.split("");
	let len = textArr.length;
	// 上个节点
	let previousNode = 0;
	// 记录节点宽度
	let nodeWidth = 0;
	// 文本换行数组
	let rowText = [];
	// 如果是字母，侧保存长度
	let letterWidth = 0;
	// 汉字宽度
	let chineseWidth = 16;
	// otherFont宽度
	let otherWidth = 8;
	for (let i = 0; i < len; i++) {
		if (/[\u4e00-\u9fa5]|[\uFE30-\uFFA0]/g.test(textArr[i])) {
			if (letterWidth > 0) {
				if (nodeWidth + chineseWidth + letterWidth * otherWidth > maxWidth) {
					rowText.push({
						type: "text",
						content: text.substring(previousNode, i)
					});
					previousNode = i;
					nodeWidth = chineseWidth;
					letterWidth = 0;
				} else {
					nodeWidth += chineseWidth + letterWidth * otherWidth;
					letterWidth = 0;
				}
			} else {
				if (nodeWidth + chineseWidth > maxWidth) {
					rowText.push({
						type: "text",
						content: text.substring(previousNode, i)
					});
					previousNode = i;
					nodeWidth = chineseWidth;
				} else {
					nodeWidth += chineseWidth;
				}
			}
		} else {
			if (/\n/g.test(textArr[i])) {
				rowText.push({
					type: "break",
					content: text.substring(previousNode, i)
				});
				previousNode = i + 1;
				nodeWidth = 0;
				letterWidth = 0;
			} else if (textArr[i] == "\\" && textArr[i + 1] == "n") {
				rowText.push({
					type: "break",
					content: text.substring(previousNode, i)
				});
				previousNode = i + 2;
				nodeWidth = 0;
				letterWidth = 0;
			} else if (/[a-zA-Z0-9]/g.test(textArr[i])) {
				letterWidth += 1;
				if (nodeWidth + letterWidth * otherWidth > maxWidth) {
					rowText.push({
						type: "text",
						content: text.substring(previousNode, i + 1 - letterWidth)
					});
					previousNode = i + 1 - letterWidth;
					nodeWidth = letterWidth * otherWidth;
					letterWidth = 0;
				}
			} else {
				if (nodeWidth + otherWidth > maxWidth) {
					rowText.push({
						type: "text",
						content: text.substring(previousNode, i)
					});
					previousNode = i;
					nodeWidth = otherWidth;
				} else {
					nodeWidth += otherWidth;
				}
			}
		}
	}
	if (previousNode < len) {
		rowText.push({
			type: "text",
			content: text.substring(previousNode, len)
		});
	}
	return rowText;
}
// 重写loading
uni.showLoading = function(options) {
	if (options && options.duration) {
		Loading.setDuration(options.duration)
	} else {
		Loading.setDuration(500)
	}
	if (options && options.isFullScreen == false) {
		Loading.setFullScreen(options.isFullScreen)
	} else {
		Loading.setFullScreen(true)
	}
	if (options && options.title) {
		Loading.setTitle(options.title)
	} else {
		Loading.setTitle('')
	}
	if (options && options.mask == false) {
		Loading.setMask(options.mask)
	} else {
		Loading.setMask(true)
	}
	Loading.show()
}

uni.hideLoading = function() {
	Loading.hide()
}

// 重写toast
// uni.showToast = function(options) {
// 	const toast = new Toast(options)
// 	toast.show()
// }

// 重写app弹窗
uni.showModal = function(options) {
	let optionsObj = Object.assign({
		title: "提示",
		content: "自定义内容",
		align: "center", // 对齐方式 left/center/right
		cancelText: "取消", // 取消按钮的文字
		cancelColor: "#8F8F8F", // 取消按钮颜色
		confirmText: "确定", // 确认按钮文字
		confirmColor: "#002FA5", // 确认按钮颜色
		showCancel: true, // 是否显示取消按钮，默认为 true
	}, options);
	// 以下为计算菜单的nvue绘制布局，为固定算法；
	const screenWidth = plus.screen.resolutionWidth;
	const screenHeight = plus.screen.resolutionHeight;
	//弹窗容器宽度
	const popupViewWidth = screenWidth * 0.8;
	// 弹窗容器的Padding
	const viewContentPadding = 20;

	// 弹窗容器的宽度
	const viewContentWidth = parseInt(popupViewWidth - (viewContentPadding * 2));
	// 描述的列表
	const descriptionList = drawtext(optionsObj.content, viewContentWidth);
	// 弹窗高度
	let popupViewHeight = 168;
	// 弹窗遮罩层
	let maskLayer = new plus.nativeObj.View("maskLayer", { //先创建遮罩层
		top: '0px',
		left: '0px',
		height: '100%',
		width: '100%',
		backgroundColor: 'rgba(0,0,0,0.5)'
	});
	let popupViewContentList = [{
		tag: 'font',
		id: 'title',
		text: optionsObj.title,
		textStyles: {
			size: '18px',
			color: "#333",
			weight: "bold",
			whiteSpace: "normal"
		},
		position: {
			top: viewContentPadding + "px",
			left: viewContentPadding + "px",
			width: viewContentWidth + "px",
			height: "30px",
		}
	}];
	const textHeight = 22;
	let contentTop = 65;
	descriptionList.forEach((item, index) => {
		if (index > 0) {
			popupViewHeight += textHeight;
			contentTop += textHeight;
		}
		popupViewContentList.push({
			tag: 'font',
			id: 'content' + index + 1,
			text: item.content,
			textStyles: {
				size: '16px',
				color: "#333",
				lineSpacing: "50%",
				align: optionsObj.align
			},
			position: {
				top: contentTop + "px",
				left: viewContentPadding + "px",
				width: viewContentWidth + "px",
				height: textHeight + "px",
			}
		});
		if (item.type == "break") {
			contentTop += 10;
			popupViewHeight += 10;
		}
	});
	popupViewContentList.push({
		tag: 'rect',
		id: 'lineTop',
		rectStyles: {
			color: "#f1f1f1",
		},
		position: {
			top: contentTop + 50 + "px",
			left: "0px",
			width: "100%",
			height: "1px",
		}
	});
	if (optionsObj.showCancel) {
		popupViewContentList.push({
			tag: 'rect',
			id: 'line',
			rectStyles: {
				color: "#f1f1f1",
			},
			position: {
				top: contentTop + 50 + "px",
				left: popupViewWidth / 2 + "px",
				width: "1px",
				height: "50px",
			}
		});
		popupViewContentList.push({
			tag: 'font',
			id: 'cancelText',
			text: optionsObj.cancelText,
			textStyles: {
				size: '16px',
				color: optionsObj.cancelColor,
			},
			position: {
				top: contentTop + 50 + "px",
				left: "0px",
				width: popupViewWidth / 2 + "px",
				height: "50px",
			}
		});
		popupViewContentList.push({
			tag: 'font',
			id: 'confirmText',
			text: optionsObj.confirmText,
			textStyles: {
				size: '16px',
				color: optionsObj.confirmColor,
			},
			position: {
				top: contentTop + 50 + "px",
				left: popupViewWidth / 2 + "px",
				width: popupViewWidth / 2 + "px",
				height: "50px",
			}
		});
	} else {
		popupViewContentList.push({
			tag: 'font',
			id: 'confirmText',
			text: optionsObj.confirmText,
			textStyles: {
				size: '16px',
				color: optionsObj.confirmColor,
			},
			position: {
				top: contentTop + 50 + "px",
				left: "0px",
				width: "100%",
				height: "50px",
			}
		});
	}
	// 弹窗内容
	let popupView = new plus.nativeObj.View("popupView", { //创建底部图标菜单
		tag: "rect",
		top: (screenHeight - popupViewHeight) / 2 + "px",
		left: '10%',
		height: popupViewHeight + "px",
		width: "80%"
	});
	// 绘制白色背景
	popupView.drawRect({
		color: "#FFFFFF",
		radius: "8px"
	}, {
		top: "0px",
		height: popupViewHeight + "px",
	});
	popupView.draw(popupViewContentList);
	popupView.addEventListener("click", function(e) {
		if (optionsObj.showCancel) {
			if (e.clientY > popupViewHeight - 50 && e.clientX < popupViewWidth / 2) {
				// 取消
				maskLayer.close();
				popupView.close();
				options.success && options.success({
					confirm: false,
					cancel: true
				});
			} else if (e.clientY > popupViewHeight - 50 && e.clientX > popupViewWidth / 2) {
				// 确定
				maskLayer.close();
				popupView.close();
				options.success && options.success({
					confirm: true,
					cancel: false
				});
			}
		} else {
			if (e.clientY > popupViewHeight - 50) {
				// 确定
				maskLayer.close();
				popupView.close();
				options.success && options.success({
					confirm: true,
					cancel: false
				});
			}
		}
	});
	// 显示弹窗
	maskLayer.show();
	popupView.show();
	posToCity
	options.complete && options.complete();
};
// #endif

//口令的加密解密





//加密
export const encryption = (params) => {
	let {
		data,
		type,
		param,
		key
	} = params
	const result = JSON.parse(JSON.stringify(data))
	if (type === 'Base64') {
		param.forEach((ele) => {
			result[ele] = btoa(result[ele])
		})
	} else {
		param.forEach((ele) => {
			let data = result[ele]
			key = CryptoJS.enc.Latin1.parse(key)
			let iv = key
			// 加密
			let encrypted = CryptoJS.AES.encrypt(
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
// 高德坐标解析
export const posToCity = async (location, extensions = 0) => new Promise((resolve, reject) => {
	uni.request({
		url: `https://restapi.amap.com/v3/geocode/regeo`,
		method: 'GET',
		data: {
			key: gdMapKey,
			location: `${location.longitude},${location.latitude}`,
			extensions: extensions ? 'all' : 'base'
		},
		success: ({
			data
		}) => {
			const {
				status,
				info,
				regeocode
			} = data
			if (status === '1') {
				if ('pois' in regeocode) {
					regeocode.pois = regeocode.pois.filter(item => typeof item.address ===
						'string' && typeof item.location === 'string').map(item => ({
						id: item.id,
						title: item.name,
						adcode: regeocode.addressComponent.adcode,
						address: item.address,
						pname: regeocode.addressComponent.province,
						cityname: regeocode.addressComponent.city,
						adname: regeocode.addressComponent.district,
						...item,
						location: {
							lat: item.location.split(',')[1],
							lng: item.location.split(',')[0]
						}
					}))
				}
				resolve(regeocode)
			} else {
				reject(info)
			}
		},
		fail: err => {
			reject(err)
		}
	})
})
//高德地图的搜索
export const searchAddress = async (keywords, city) => new Promise((resolve, reject) => {
	uni.request({
		url: `https://restapi.amap.com/v3/place/text`,
		method: 'GET',
		data: {
			key: gdMapKey,
			keywords: keywords,
			types: '090000|120000|130000|140000|160000|170000',
			extensions: 'all',
			region: city,
			page_size: 30
		},
		success: ({
			data
		}) => {
			// console.log(data);
			const {
				status,
				info
			} = data
			if (status === '1') {
				if ('pois' in data) {
					data.pois = data.pois.filter(item => typeof item.address ===
						'string' && typeof item.location === 'string').map(item => ({
						title: item.name,
						...item,
						location: {
							lat: item.location.split(',')[1],
							lng: item.location.split(',')[0]
						}
					}))
				}
				resolve(data)
			} else {
				reject(data)
			}
		},
		fail: err => {
			reject(err)
		}
	})
})



// 判断是否登录 、实名认证、银行卡绑定
export function certification() {
	let userInfo = uni.getStorageSync('userData')
	if (userInfo.sysUser) {
		// userauthFlag 0 未实名认证 1已认证
		// cardFlag 0 未绑定银行卡 1已绑定银行卡
		if (userInfo.sysUser.userauthFlag) {
			// 待开发
			if (!userInfo.sysUser.cardFlag) {
				uni.showToast({
					title: '请进行绑卡',
					icon: 'none'
				});
				return false
			}
			return true
		} else {
			uni.showToast({
				title: '请进行实名认证及绑卡',
				icon: 'none'
			});
			return false
		}
		return true
	} else {
		uni.showToast({
			title: '请登录,并进行实名认证及绑卡',
			icon: 'none'
		});
		return false
	}
}

// 防止多次点击,防抖
let timer;
export const debounce = function(fn, delay) {
	let self = this,
		args = arguments;
	timer && clearTimeout(timer);
	timer = setTimeout(function() {
		fn.apply(self, args);
	}, delay);
}


// 节流
let timerThrottle = null;
export const throttle = function(fn, delay) {
	let self = this,
		args = arguments; // 首先设定一个变量，没有执行定时器时,默认为 null
	if (timerThrottle) return; // 当定时器没有执行的时候timerThrottle永远是false,后面无需执行
	timerThrottle = setTimeout(() => {
		fn.apply(self, args);
		// 最后在setTimeout执行完毕后再把标记设置为true(关键)
		// 表示可以执行下一次循环了。
		timerThrottle = null;
	}, delay);
}


// 检测对象是否为一个安全对象
export const isVaildObject = (obj) => {
	return typeof obj === 'object' && !Array.isArray(obj) && Object.keys(obj).length
}


export function setBlur(callback, value) {
	if (value !== '') {
		callback && callback(Math.abs(value))
	}
}

export function setInput(callback, value) {
	if (value.includes('.')) {
		debounce(() => {
			let temp = value.toString().replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
			let tempBefore = temp.split('.')[0]
			let tempAfter = temp.split('.')[1]
			// console.log('tempAfter',tempAfter,tempAfter.length);
			if (tempBefore.length > 7) {
				let tempBeforeResult = tempBefore.slice(0, 7) + '.' + temp.split('.')[1]
				callback && callback(Math.abs(tempBeforeResult))
			} else {
				callback && callback(tempBefore + '.' + temp.split('.')[1])
				// callback && callback(Math.abs(temp))
			}
		}, 50)
	} else {
		debounce(() => {
			if (value.length > 7) {
				let temp = value.slice(0, 7)
				callback && callback(Math.abs(temp))
			} else {
				if (value) {
					// callback && callback(Math.abs(value))
					callback && callback(value)
				}
			}
		}, 50)
	}
}
//点击复制内容
export function copy(value) {
	uni.setClipboardData({
		data: value,
		success: function() {
			uni.showToast({
				title: "已为您复制至剪切板",
				icon: 'none'
			})
		}
	})
}

//获取订单状态
export function getStatus(value) {
	switch (Number(value)) {
		case 0:
			return '发布订单';
		case 5:
			return '等待报价';
		case 10:
			return '待确认';
		case 15:
			return '待付款';
		case 20:
			return '已付款';
		case 25:
			return '待开工';
		case 30:
			return '开工中';
		case 35:
			return '待验收';
		case 40:
			return '待结算';
		case 45:
			return '待评价';
		case 50:
			return '已完成';
		case 55:
			return '待售后';
		case 60:
			return '售后中';
		default:
			return '';
	}
}

//获取工种类型
export function getSkillType(value) {
	switch (Number(value)) {
		case 1:
			return '水电';
		case 2:
			return '木工';
		case 3:
			return '泥瓦';
		case 4:
			return '拆除';
		case 5:
			return '美缝';
		case 6:
			return '油漆';
		default:
			return '其他';
	}
}

//获取订单需求类型
export function getRequirementType(value) {
	switch (Number(value)) {
		case 1:
			return '装修';
		case 2:
			return '维修';
		case 3:
			return '安装';
		case 4:
			return '设计';
		case 5:
			return '其他';
		default:
			return '其他';
	}
}

//换算距离
export function getDistance(value) {
	if (!value) return ''
	let distance = '';
	let val = Number(value);
	if (val >= 1000) {
		distance = (val / 1000).toFixed(1) + 'km';
	} else {
		distance = val.toFixed(1) + 'm';
	}
	return distance;
}

export function deepClone(target) {
	// 定义一个变量
	let result;
	// 如果当前需要深拷贝的是一个对象的话
	if (typeof target === 'object') {
		// 如果是一个数组的话
		if (Array.isArray(target)) {
			result = []; // 将result赋值为一个数组，并且执行遍历
			for (let i in target) {
				// 递归克隆数组中的每一项
				result.push(deepClone(target[i]))
			}
			// 判断如果当前的值是null的话；直接赋值为null
		} else if (target === null) {
			result = null;
			// 判断如果当前的值是一个RegExp对象的话，直接赋值
		} else if (target.constructor === RegExp) {
			result = target;
		} else {
			// 否则是普通对象，直接for in循环，递归赋值对象的所有值
			result = {};
			for (let i in target) {
				result[i] = deepClone(target[i]);
			}
		}
		// 如果不是对象的话，就是基本数据类型，那么直接赋值
	} else {
		result = target;
	}
	// 返回最终结果
	return result;
}


export function storeSetProjectInfo(project) {
	store.commit('setProjectInfo', {
		projectId: project.id,
		roomImg: project.roomImg,
		roomRemark: project.roomRemark,
		latAddress: project.latAddress,
		longitude: project.longitude,
		latitude: project.latitude,
		paidAmount: project.paidAmount,
		totalPrice: project.totalPrice,
		pioneerJobName: project.pioneerJobName,
		address: project.address,
		addressId: project.addressId,
		pioneerName: project.pioneerName,
		addressId: project.addressId,
		expectFinishTime: project.expectFinishTime,
		poiName: project.poiName,
		districtName: project.districtName,
		cityName: project.cityName,
		source: project.source,
		customerId: project.customerId,
		customerName: project.customerName,
		expectStartTime: project.expectStartTime,
		expectFinishTime: project.expectFinishTime,
	})
}

export function storeOrderInfo(orderData) {
	store.commit('setOrderInfo', {
		offerPersonId: orderData.offerPersonId,
		orderId: orderData.id,
		price: orderData.price,
		companyId: orderData.cityOperatorId,
		// companyId: orderData.companyId,
		cityOperatorId: orderData.cityOperatorId,
		address: orderData.address,
		avatarList: orderData.avatarList,
		orderCode: orderData.orderCode,
		longitude: orderData.longitude,
		latitude: orderData.latitude,
		jobCode: orderData.jobCode,
		skillId: orderData.skillId,
		skillName: orderData.skillName,
		publishType: orderData.publishType,
		source: orderData.source,
		expectDate: orderData.expectDate,
		expectCompleteDate: orderData.expectCompleteDate,
		userId: orderData.userId,
		userName: orderData.userName,
		orderStatus:orderData.orderStatus
	})
}




// 通过团队成员列表获取发起人信息
export function getOriginator(callback) {
	if (store.state.projectInfo.projectId) {
		setTimeout(() => {
			this.$httpApi.getMemberList({
				projectId: store.state.projectInfo.projectId // 项目id
			}).then(res => {
				if (res) {
					let tempDetails = res.find(item => Number(item.personId) === store.state.orderInfo
						.offerPersonId)
					// console.log('tempDetails',store.state.userPersonId);
					if (tempDetails) {
						let temp = tempDetails.personId
						store.commit('setUserPersonInfo', tempDetails)
						callback(temp)
					} else {
						store.commit('setUserPersonInfo', {
							personId: store.state.userPersonId
						})
					}
				}
			})
		}, 200)
	}
}

function sortArr(attr) {
	return function(a, b) {
		return a[attr] - b[attr]
	}
}

const tempJob = [{
	label: 'JOB_MANAGER',
	code: 'R_PROJECT_MANAGER',
	sort: 1
}, {
	label: 'JOB_SUPERVISION',
	code: 'R_PROJECT_SUPERVISION',
	sort: 2
}, {
	label: 'JOB_DESIGNER',
	code: 'R_DESGINER',
	sort: 3
}, {
	label: 'JOB_WORKER',
	code: 'R_WORKER',
	sort: 4
}]




// 消息通知跳转时赋值相应信息
export function notificationsJump(option, callback) {
	if (!option.projectId) {
		console.error('未获取到项目id')
		this.$util.toast('未获取到项目id');
		return
	}
	this.$httpApi.getProjectDetails({
		id: option.projectId
	}).then(res => {
		if (res) {
			storeSetProjectInfo(res)
			this.$httpApi.getMemberList({
				projectId: option.projectId
			}).then(res => {
				if (res) {
					// 1.判断权限 (JOB_MANAGER > JOB_SUPERVISION > JOB_DESIGNER > JOB_WORKER)
					let userList = res.filter(item => item.userId == uni.getStorageSync('userData')
						.sysUser.userId)
					let tempJobCode = []
					if (userList.length > 0) {
						userList.map(item => {
							tempJob.map(ev => {
								if (ev.label == item.jobCode) {
									ev['skillId'] = item.skillId
									tempJobCode.push(ev)
								}
							})
						})
					} else {
						console.error('团队成员里没有当前登录人员')
						this.$util.toast('团队成员里没有当前登录人员');
						return
					}
					if (tempJobCode.length > 0) {
						tempJobCode = tempJobCode.sort(sortArr('sort'))
						let skillId = tempJobCode[0].skillId
						let temp = userList.find(item => item.skillId == skillId)
						if (temp) {
							let userRole = tempJob.find(item => item.label == temp.jobCode).code
							store.commit('setUserPersonInfo', temp)
							store.commit('setUserRole', userRole)
							// 如果有nodeId，则查询Node详情
							if (option.nodeId) {
								this.$httpApi.sopNodeTemplate({
									nodeId: option.nodeId
								}).then(res => {
									if (res) {
										if (option.callbackStatus) {
											this.$store.commit('setNodeInfo', res)
											callback()
										}
									}
								})
							} else {
								if (option.callbackStatus) {
									callback()
								}
							}
						}
					}
				}
			})
		}
	})
}


/**
 * @description 获取人员信息
 */
export function getPersonIdUser(data, callback) {
	this.$httpApi.getListById(data).then(res => {
		if (res) {
			callback(res)
		}
	})
}


/**
 * @description 获取订单详情
 */
export function getOrderDetails(data, callback) {
	this.$httpApi.getOrderDetails(data).then(res => {
		if (res) {
			callback(res)
		}
	})
}


/**
 * @description 查询距离节点完成时间还剩多少天
 */
export function remainingDays() {
	let tempTime = this.getDateNumber(store.state.nodeInfo.expectFinishTime, store.state.nodeInfo.realEndTime)
	// status 1 等待中  3 已完成
	if ([1, 3].includes(Number(store.state.nodeInfo.status))) {
		store.commit('setRemainingDays', '')
	} else {
		if (store.state.nodeInfo.planDay !== 0) {
			store.commit('setRemainingDays', tempTime.time)
		} else {
			store.commit('setRemainingDays', '')
		}
	}
}

/**
 * @description 根据岗位id列表获取岗位信息
 */
export function getListJobByIds(data, callback) {
	this.$httpApi.listJobByIds(data).then(res => {
		if (res) {
			callback(res)
		}
	})
}

/**
 * @description 重新赋值node详情
 */
export function getNodeDetails(callback) {
	if (store.state.nodeInfo.nodeId) {
		this.$httpApi.sopNodeTemplate({
			nodeId: store.state.nodeInfo.nodeId
		}).then(res => {
			if (res) {
				store.commit('setNodeInfo', res)
				callback(res)
			}
		})
	}

}

/**
 * @description 数字转中文数码
 *
 * @param {Number|String}   num     数字[正整数]
 * @param {String}          type    文本类型，lower|upper，默认upper
 *
 * @example number2text(100000000) => "壹亿元整"
 */
export function number2text(number, type = 'lower') {
	// 配置
	const originNumber = number + ''
	const confs = {
		lower: {
			num: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'],
			unit: ['', '十', '百', '千', '万'],
			level: ['', '万', '亿']
		},
		upper: {
			num: ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'],
			unit: ['', '拾', '佰', '仟'],
			level: ['', '万', '亿']
		},
		decimal: {
			unit: ['分', '角']
		},
		maxNumber: 999999999999.99
	};

	// 过滤不合法参数
	if (Number(number) > confs.maxNumber) {
		console.error(
			`The maxNumber is ${confs.maxNumber}. ${number} is bigger than it!`
		);
		return false;
	}

	const conf = confs[type];
	const numbers = String(Number(number).toFixed(2)).split('.');
	const integer = numbers[0].split('');
	const decimal = Number(numbers[1]) === 0 ? [] : numbers[1].split('');

	// 四位分级
	const levels = integer.reverse().reduce((pre, item, idx) => {
		let level = pre[0] && pre[0].length < 4 ? pre[0] : [];
		let value =
			item === '0' ? conf.num[item] : conf.num[item] + conf.unit[idx % 4];
		level.unshift(value);

		if (level.length === 1) {
			pre.unshift(level);
		} else {
			pre[0] = level;
		}

		return pre;
	}, []);

	// 整数部分
	const _integer = levels.reduce((pre, item, idx) => {
		let _level = conf.level[levels.length - idx - 1];
		let _item = item.join('').replace(/(零)\1+/g, '$1'); // 连续多个零字的部分设置为单个零字

		// 如果这一级只有一个零字，则去掉这级
		if (_item === '零') {
			_item = '';
			_level = '';

			// 否则如果末尾为零字，则去掉这个零字
		} else if (_item[_item.length - 1] === '零') {
			_item = _item.slice(0, _item.length - 1);
		}

		return pre + _item + _level;
	}, '');

	// 小数部分
	let _decimal = decimal.map((item, idx) => {
		const unit = confs.decimal.unit;
		const _unit = item !== '0' ? unit[unit.length - idx - 1] : '';

		return `${conf.num[item]}${_unit}`;
	}).join('');

	// 如果是整数，则补个整字
	if (originNumber.length === 2 && originNumber[0] === '1') {
		let midResult = `${_integer}`.split('')
		midResult.shift()
		return midResult.join('')
	} else {
		return `${_integer}`;
	}
};

/**
 * @description 上传图片
 */
export function fileUpload(fileJson, callback) {

}


/**
 * @description 根据jobCode获取图片
 */
export function getImgByJobCode(jobCode) {
	let url
	switch (jobCode) {
		// 个人发布
		case 'R_PROJECT_MANAGER':
			url = require("@/static/images/order-user/manager.png")
			break;
		case 'R_PROJECT_SUPERVISION':
			url = require("@/static/images/order-user/supervision.png")
			break;
		case 'R_DESIGNER':
			url = require("@/static/images/order-user/designer.png")
			break;
		case 'R_WORKER':
			url = require("@/static/images/order-user/work_0.png")
			break;
			// 企业发布
		case 'JOB_MANAGER':
			url = require("@/static/images/order-user/manager.png")
			break;
		case 'JOB_SUPERVISION':
			url = require("@/static/images/order-user/supervision.png")
			break;
		case 'JOB_DESIGNER':
			url = require("@/static/images/order-user/designer.png")
			break;
		case 'JOB_WORKER':
			url = require("@/static/images/order-user/work_0.png")
			break;
		default:
			url = require("@/static/images/order-user/work_4.png")
			break;
	}
	return url
}

/**
 * @description 
 */
export function getLogTypeName(type) {
	if (!type) {
		return
	}

	let tempName = ''
	switch (type) {
		case 'assign':
			tempName = '指派'
			break
		case 'change':
			tempName = '变更'
			break
		case 'change_pay':
			tempName = '变更支付'
			break
		case 'no_order_offer':
			tempName = '工人未报价'
			break
		case 'no_confirm_order_offer':
			tempName = '业主未确认报价'
			break
		case 'no_risk_order_offer':
			tempName = '业主确认报价,未确认风险'
			break
		case 'no_pay_order_offer':
			tempName = '业主确认报价,未付款'
			break
		case 'no_again_order_offer':
			tempName = '业主不确认报价，价格不合理，重新商讨'
			break
		case 'modify_order_offer':
			tempName = '修改报价'
			break
		case 'cancel_order_offer':
			tempName = '取消报价'
			break
		case 'submit_acceptance':
			tempName = '工人提交验收'
			break
		case 'confirm_acceptance':
			tempName = '业主确认验收'
			break
		case 'c_reply':
			tempName = '业主评价'
			break
		default:
			break
	}
	return tempName
}

export function isJSON(str) {
	if (typeof str == 'string') {
		try {
			var obj = JSON.parse(str);
			if (typeof obj == 'object' && obj) {
				return true;
			} else {
				return false;
			}

		} catch (e) {
			// console.log('error：'+str+'!!!'+e);
			return false;
		}
	}
	// console.log('It is not a string!')
}

// 手动创建本地消息
export const createTopMessage = (message) => {
	let msgJson = message.payload;
	let options = {
		cover: false,
		sound: 'system',
		title: message.title
	};
	plus.push.createMessage(message.content || "", msgJson, options);
}

/**
 * 
 * @param {*} jsonFile 
 * 返回ture 说明文件上传成功，可以提交表单
 * 返回false 说明文件还没上传完，也可能是没有url或localPathStatus
 * 用户体验最佳的步骤：
 * 1. 先用button disabled 来控制是否提交表单
 * 2. 检查图片url是否是网络路径
 * 3. 把callback传进来上传完成后自动执行（用户只用点按钮一次）
 * 4. 可以参考 pages/construction/drawings/upload
 */
export const checkUploadProcess = (jsonFile, callback) => {
	return true
	let flag = true
	let files
	if (!jsonFile) {
		// 这里有时候用户选择了图片，但image-upload-new组件一开始会返回一个空字符串
		// 这样就会和没选择图片时的判断条件一样
		// return false
		// 暂时先这样弄一下
		return true
	}
	if (jsonFile === '[]') {
		// 有时候会传一个[]进来， 但其实是有选择图片的
		uni.showLoading({
			duration: 2000,
			isFullScreen: true
		})
		// return false
		// 暂时先这样弄一下
		return true
	}
	try {
		files = JSON.parse(jsonFile)
		if (files) {
			files.forEach(item => {
				if (!item.localPathStatus) {
					flag = item.localPathStatus
					return flag
				}
			})
		}
	} catch (e) {
		console.log('路径解析失败, 不是正确的JSON格式', jsonFile);
		return false
	}
	if (!flag) {
		// 根据文件数量添加延时，每个文件600ms
		uni.showLoading({
			duration: files.length * 600,
			isFullScreen: true
		})
	} else {
		callback && callback()
	}
	return flag
}

/**
 * 
 * @param {*} list 
 * 返回ture 说明校验通过
 *
 */
export function questionnaireVerification(list, callback) {
	if (list && list.length > 0) {
		let tempQuestionnaire = JSON.parse(JSON.stringify(list))
		let tempStatus = false
		// let tempTop
		try {
			tempQuestionnaire.forEach(item => {
				item.surveyTemplateQuesDTOList.forEach((el, index) => {
					// 如果不确认，就不需要校验
					if (!el.confirmStatus) {
						if (Number(el.requiredFlag)) {
							if (el.quesType == 4) {
								if (JSON.parse(el.answer).length == 0) {
									if (el.allowAddDescFlag == 1) {
										if (!el.supplementAnswerText) {
											throw {
												name: el.quesName,
												index: index + 1,
												partName: item.partName,
												top: el.top,
												id: el.id
											}
										}
									} else {
										throw {
											name: el.quesName,
											index: index + 1,
											partName: item.partName,
											top: el.top,
											id: el.id
										}
									}
								}
							} else {
								// 1.如果有设置，是否允许补充说明(文本输入 = allowAddDescFlag)、是否允许(上传文件 = allowUploadFileFlag)
								// 2.则判断对应字段是否有值 supplementAnswerText、supplementAnswerFile
								if (!el.answer) {
									if (el.allowAddDescFlag == 1) {
										if (!el.supplementAnswerText) {
											throw {
												name: el.quesName,
												index: index + 1,
												partName: item.partName,
												top: el.top,
												id: el.id
											}
										}
									} else if (el.allowUploadFileFlag == 1) {
										if (JSON.parse(el.supplementAnswerFile).length == 0) {
											throw {
												name: el.quesName,
												index: index + 1,
												partName: item.partName,
												top: el.top,
												id: el.id
											}
										}
									} else {
										throw {
											name: el.quesName,
											index: index + 1,
											partName: item.partName,
											top: el.top,
											id: el.id
										}
									}
								}
							}
						}
					}
				})
			})
		} catch (e) {
			console.log('e', e);
			uni.showToast({
				icon: 'none',
				title: `${e.partName}，第${e.index}题：${e.name}，答案不能为空~`,
				duration: 3000
			})
			tempStatus = true
			// uni.pageScrollTo({
			// 	duration: 0,
			// 	scrollTop: e.top - 180,
			// 	// scrollTop: e.top - 120
			// })
			callback && callback(e)
		}
		return tempStatus
	}

}

//去除特殊字符~!@#$^-&*()=|{}':;',\[].<>/?~！@#￥……&*（）——|{}【】'；：""'。，、？
export function trimSpecial(string) {

	//替换字符串中的所有特殊字符（包含空格）
	if (string != "") {
		const pattern = /[`~!@#$^\-&*()=|{}':;',\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？\s]/g;
		string = string.replace(pattern, "");
	}
	return string
}


export const CustomForeach = async (arr, callback) => {
	const length = arr.length;
	const O = Object(arr);
	let k = 0;
	while (k < length) {
		if (k in O) {
			const kValue = O[k];
			await callback(kValue, k, O);
		}
		k++;
	}
};
export const getQueryString = (init, name) => {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = init.substr(0).match(reg);
	if (r != null) return decodeURI(r[2]);
	return null;
}


//见tfs 26436
export function setNodeSkipStatus(option) {
	if (store.state.nodeInfo.skipStatus == 1 && ([1, 10].includes(store.state.nodeInfo.status))) {
		switch (option) {
			case 'class': // 控制样式
				return 'public-node-disable'
			case 'status': // 控制是否显示、是否能点击
				this.$util.toast(`请等待「${store.state.preNodeStatus}」完成后再执行当前工序`)
				return false
			case 'tips': // 弹出提示
				return this.$util.toast(`请等待「${store.state.preNodeStatus}」完成后再执行当前工序`)
				break
			case 'show': // 控制是否显示
				return false
		}
	} else {
		return true
	}
}

// 如果有图片、语音，则备注不用必填
export function remarksVerification({
	desc,
	pic,
	audio
}, placeholder) {
	if (pic == '[]') {
		if (audio == '') {
			if (!desc) {
				this.$util.toast(`请填写${placeholder}~`)
				return true
			}
		}
	} else if (audio == '') {
		if (pic == '[]') {
			if (!desc) {
				this.$util.toast(`请填写${placeholder}~`)
				return true
			}
		}
	}
	return false
}

// 上传时需要
export function setFileType(item) {
	let suffix = item.substring(item.lastIndexOf("."));
	if (['.mp3', '.mp4', '.3gp'].includes(suffix)) {
		return 'video'
	} else {
		return 'img'
	}
}


// 返回协议需要显示的数据
export function serviceInfo(item, callback) {
	let tempUserData = uni.getStorageSync('userData') && uni.getStorageSync('userData').sysUser
	let tempAddress =
		`${item.provinceName || ''}${item.districtName || '暂无'}${item.latAddress ||  ''}${item.poiName || ''}`
	tempAddress = tempAddress.replace('undefined', '')
	let tempEwntrustedContent = `${item.poiName || ''}需要${item.requirementTypeName || ''}${item.skillName || ''}`
	tempEwntrustedContent = tempEwntrustedContent.replace('undefined', '')

	let serviceInfo = {
		contactName: item.contactName || '', // 甲方联系名称
		contactPhone: item.contactPhone && item.contactPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') ||
			'', // 甲方联系电话
		workerName: tempUserData.realName || '', // 乙方联系名称
		workerPhone: tempUserData.phone || '', // 乙方联系电话
		address: tempAddress, // 工程详细地址
		ewntrustedContent: tempEwntrustedContent, // 委托任务内容
		amount: item.price > 0 ? item.price : '', // 项目金额
		time: moment().format('YYYY-MM-DD'),
		// contactTime: moment(item.created).format('YYYY-MM-DD') , // 甲方发单时间
		// workTime: moment().format('YYYY-MM-DD') // 乙方接单时间
	}
	callback && callback(serviceInfo)
	// this.serviceType = item.skillName
}


// 判断是否有前置节点
export function getPreNodeStatus(item, callback) {
	let title = store.state.preNodeStatus
	if (title) {
		this.$util.toast(`请等待「${title}」完成后再执行当前工序`)
		callback && callback(false)
	} else {
		callback && callback(true)
	}
}


// 根据数组指定字段去重
export function getUnique(arr, key) {
	let map = new Map()
	arr.forEach((item, index) => {
		if (!map.has(item[key])) {
			map.set(item[key], item)
		}
	})
	return [...map.values()]
}

// 压缩封面图

export function compressImage(coverImg, callback) {
	uni.downloadFile({
		url: coverImg,
		success: (images) => {
			// 获取图片信息,大于20KB 则进行压缩
			let fileSize = 20 * 1024
			uni.getFileInfo({
				filePath: images.tempFilePath,
				success: imgInfo => {
					if (imgInfo.size > fileSize) {
						uni.compressImage({
							src: images.tempFilePath,
							quality: 20,
							width: '60%',
							height: '60%',
							success: res => {
								callback(res.tempFilePath)
							}
						})
					} else {
						callback(coverImg)
					}
				}
			})
		}
	});
}
//生成guid
export function GUID() {
	var guid = ""
	for (var i = 1; i <= 32; i++) {
		var n = Math.floor(Math.random() * 16.0).toString(16);
		guid += n;
	}
	return guid;
}
// 特殊字符匹配路由
export const wordMatch = [
	//西里尔字母表 АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ 采用这种字母表主要是让用户无法输入
	//params 路由参数名称
	//开始字母和结束字母是用来判断路由的
	{
		start: '##',
		end: '##',
		path: '/pages/quickBilling/billingDetails',
		params: ['detailId', 'shareType']
	},
	{
		start: 'ЦЦ',
		end: 'Я',
		path: '',
		params: []

	}
]

// 获取金额小数点后两位
Vue.filter('priceFormat', (val) => {
	if (val) {
		return '.' + Number(val).toFixed(2).split('.')[1]
	}
})

// 金额取整
Vue.filter('priceFloor', (val) => {
	if (val) {
		return Math.floor(val)
	}
})
