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
// #ifdef APP-PLUS
let settingWritePhotosAlbum = false;
let locationAuthorize = true;
import Loading from './loading.js'
const gdMapKey = '165379f5f2521b2a3bcc1eae14be9ca5'
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
// 金额过滤
Vue.filter('money', function(val) {
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
// 获取商品金额小数点后两位
Vue.filter('priceFormat', (val) => {
	if (val) {
		return '.' + Number(val).toFixed(2).split('.')[1]
	}
})
// 时间格式化距现在时间
Vue.filter('dateDiff', function(val) {
	if (val) {
		return clickDateDiff(val);
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
// 隐藏加载动画
uni.setLoadingVisible = function(isShow = true) {
	Loading.setVisible(isShow)
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
	if (Loading.isShowing) return
	Loading.show()
}
// 重写app弹窗
uni.showModal = function(options) {
	let optionsObj = Object.assign({
		title: "提示",
		content: "自定义内容",
		align: "center", // 对齐方式 left/center/right
		cancelText: "取消", // 取消按钮的文字
		cancelColor: "#8F8F8F", // 取消按钮颜色
		confirmText: "确定", // 确认按钮文字
		confirmColor: "#000", // 确认按钮颜色
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
			key: '165379f5f2521b2a3bcc1eae14be9ca5',
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
			key: '165379f5f2521b2a3bcc1eae14be9ca5',
			keywords: keywords,
			extensions: 'all',
			types: '090000|120000|130000|140000|160000|170000',
			region: city,
			page_size: 30
		},
		success: ({
			data
		}) => {
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
				reject(info)
			}
		},
		fail: err => {
			reject(err)
		}
	})
})
// 高德地图获取各地市区
export const getAllCity = (keywords) => new Promise((resolve, reject) => {
	uni.request({
		url: `https://restapi.amap.com/v3/config/district?parameters`,
		method: 'GET',
		data: {
			// key: gdMapKey,
			key: '165379f5f2521b2a3bcc1eae14be9ca5',
			keywords: keywords || '',
			subdistrict: 2
		},
		success: ({
			data
		}) => {
			const {
				status,
				info
			} = data
			if (status === '1') {
				if (data.districts && data.districts.length) {
					resolve(data.districts[0].districts)
				}
				resolve(data.districts)
			} else {
				reject(info)
			}
		},
		fail: err => {
			reject(err)
		}
	})
})


// 判断是否登录 、实名认证、银行卡绑定
export const certification = () => {
	let userData = uni.getStorageSync('userData')
	let userInfo = uni.getStorageSync('userInfo')
	if (userData.sysUser) {
		if (userData.sysUser.userauthFlag) {
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
export function debounce(fn, delay) {
	let self = this,
		args = arguments;
	timer && clearTimeout(timer);
	timer = setTimeout(function() {
		fn.apply(self, args);
	}, delay);
}

// 获取sku信息
export function getSkuStr(spData) {
	const arr = JSON.parse(spData)
	let skuStr = ''
	arr.forEach((each, index) => {
		skuStr += `${each.value}${index == arr.length - 1 ? '' : '/'}`
	})
	return skuStr
}

//点击复制内容
export function copy(value, tips = "已为您复制至剪切板") {
	uni.setClipboardData({
		data: value,
		success: function() {
			uni.showToast({
				title: tips,
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

// 获取入户搬运费规则 -- by mode
export function getRule2(caseRule, type, mode, mode2) {
	let result = ''
	if (type == 1) {
		switch (mode) {
			case 1:
				result += `入户/安装费：计件收费；默认收费：每件${caseRule.firstAmount}元`
				break
			case 2:
				result += `入户/安装费：固定收费；默认收费：${caseRule.fixedAmount}元`
				break
			case 3:
				result += '免入户/安装费'
				break
			case 4:
				result += '入户/安装费：' + caseRule.protocol
				break
			default:
				result = ''
				break
		}
	} else {
		switch (mode2) {
			case 1:
				result += `上楼费：计件收费；默认收费：每件每层${caseRule.firstAmount}元`
				break
			case 2:
				result += `上楼费：固定收费；默认收费：${caseRule.fixedAmount}元`
				break
			case 3:
				result += '免上楼费'
				break
			case 4:
				result += '上楼费：' + caseRule.protocol
				break
			default:
				result = ''
				break
		}
	}
	return result
}

// 获取入户搬运费规则
export function getInstallationRule(installation) {
	return getRule2(installation.installationFirst, 1, installation.installationMode, '') + '；' + getRule2(installation
		.stairwayFirst, 2, '', installation.stairwayMode)
}

// 获取运费规则 -- by caseRule
export function getRule(caseRule, mode) {
	switch (mode) {
		case 1:
			return `${caseRule.firstCases}件以内，${caseRule.firstAmount}元；每增加${caseRule.secondCases}件，增加${caseRule.secondAmount}元`
		case 2:
			return '固定运费金额' + caseRule.fixedAmount + '元 '
		case 3:
			return '卖家包邮'
		case 4:
			return caseRule.protocol
		default:
			return ''
	}
}

// 获取运费规则
export function getFreightRule(freight) {
	if (!freight.templateId) return ''
	// 1=阶梯计价 2=固定运费 3=卖家包邮 4=自定义协商
	const mode = freight.freightMode
	const caseRule = freight.firstFreight
	return getRule(caseRule, mode)
}

// 获取商品sku信息
export function getGoodsInfo(commodity) {
	const skuData = commodity.skuStocks
	const goodsInfo = {
		id: commodity.id,
		name: commodity.name,
		goods_thumb: commodity.coverImg,
		sku_list: [],
		spec_list: []
	}

	function getSkuArr(sku) {
		if (!sku) return []
		const skuArr = JSON.parse(sku)
		const result = []
		if (!Array.isArray(skuArr)) return []
		skuArr.forEach(ele => {
			result.push(ele.value)
		})
		return result
	}

	function getSkuMap(sku) {
		const skuResult = []
		sku.forEach(item => {
			const skuCode = item.skuCode;
			let obj = JSON.parse(item.spData);
			if (obj.spData) {
				obj = obj.spData;
			}
			obj.forEach((each, index) => {
				skuResult.push(each)
			});
		})
		let map = new Map();
		for (let item of skuResult) {
			if (!map.has(item.key)) {
				let m = new Array()
				m.push(item.value)
				map.set(item.key, m);
			} else {
				let m2 = map.get(item.key)
				if (m2.indexOf(item.value) === -1) {
					m2.push(item.value)
				}
			}
		}
		return [...map]
	}

	const skuMap = getSkuMap(skuData)
	skuMap.forEach(skuEle => {
		const obj = {
			name: skuEle[0],
			list: []
		}
		skuEle[1].forEach(ele => {
			const itemObj = {
				name: ele
			}
			obj['list'].push(itemObj)
		})
		goodsInfo['spec_list'].push(obj)
	})

	skuData.forEach(item => {
		const skuObj = {
			_id: item.id,
			goods_id: commodity.id,
			goods_name: commodity.name,
			image: item.pic,
			price: item.price || 0,
			sku_name_arr: getSkuArr(item.spData),
			stock: item.stock
		}
		goodsInfo['sku_list'].push(skuObj)
	})
	return goodsInfo
}

const gdMapKey1 = '165379f5f2521b2a3bcc1eae14be9ca5'
// 生成静态地图
export function getStaticMap(latitude, longitude, width = 670, height = 230, pois = []) {
	// https://lbs.amap.com/api/webservice/guide/api/staticmaps/
	if (pois.length > 9) {
		console.error('最多支持10个标记点')
		return
	}
	const markers = pois.map(item => {
		return item.lng + ',' + item.lat
	}).join(';')
	const location = `${longitude},${latitude}`
	const size = `${width}*${height}`
	// console.log(`http://restapi.amap.com/v3/staticmap?location=${location}&zoom=17&scale=2&size=${size}&markers=mid,,A:${longitude},${latitude || ''}&destName=''&hideRouteIcon=1&key=${gdMapKey1}`);
	return `http://restapi.amap.com/v3/staticmap?location=${location}&zoom=17&scale=2&size=${size}&markers=mid,,A:${longitude},${latitude || ''}&destName=''&hideRouteIcon=1&key=${gdMapKey1}`
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
	// return true
	let flag = true
	let files
	if (!jsonFile) {
		// 这里有时候用户选择了图片，但image-upload-new组件一开始会返回一个空字符串
		// 这样就会和没选择图片时的判断条件一样
		return false
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
 * @description Array.findLastIndex
 */
export function findLastIndex(array, callback) {
	if (!array && !array.length) return -1
	for (let i = array.length - 1; i >= 0; i--) {
		if (callback(array[i], i, array)) {
			return i
		}
	}
	return -1
}
