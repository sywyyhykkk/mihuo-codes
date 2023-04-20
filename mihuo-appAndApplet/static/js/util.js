import baseConfig from '@/config/common.js'
import $http from '@/config/requestConfig'

const currentMode = uni.getStorageSync('devModeApi')
let common = baseConfig
if (currentMode) {
	common = currentMode
}
const util = {
	loading(title = '加载中') {
		uni.showLoading({
			title
		})
	},
	toast(title = '', icon = 'none') {
		return uni.showToast({
			title,
			icon,
			duration: 2000
		})
	},
	getHeader() {
		return {
			'Authorization': uni.getStorageSync('userToken')
		}
	},
	timerout(callback, timer = 1000) {
		let _timer = setTimeout(() => {
			if (typeof callback === 'function') {
				callback();
			}
			clearTimeout(_timer);
		}, timer);
	},
	/**
	 * 设置每个页面的title信息
	 * @param {String} url: 图片地址
	 * @param {Boolean} thumbnail: 是否添加缩略图后缀
	 * @param {width} width: 缩略图默认宽度
	 * */
	thumbnailImage(url, thumbnail, width = 750) {
		const parameterInfo = '?x-image-process=image/resize,m_fixed,'
		let parameters = thumbnail ? parameterInfo + `w_${width}/marker,u_plus` : ''
		if (!url) {
			return '';
		}
		return common.imageGlobal + '' + url.replace('/admin/sys-file/mihuo-test/', '').replace(common.imageGlobal,
			'') + parameters
	},
	avatarImage(userId, thumbnail, width = 100) {
		const parameterInfo = '?x-image-process=image/resize,m_fixed,'
		let parameters = thumbnail ? parameterInfo + `w_${width}` : ''
		return common.imageGlobal + 'avatar/' + userId + '.png' + parameters;
	},
	avatarImImage(avatar, thumbnail, width = 100, type = "Normal") {
		if (!avatar) return;
		const {
			baseUrl
		} = uni.getStorageSync('imUserInfo');
		if (type == "Normal") {
			return baseUrl + '/api/Common/GetAvatar?userId=' + avatar
		} else {
			return baseUrl + '/api/Common/GetGroupAvatar?groupId=' + avatar
		}

	},
	/**
	 * 获取视频的封面图
	 * @param {String} url: 视频地址
	 * @param {width} width: 缩略图默认宽度
	 * */
	thumbnailVideo(url, thumbnail, width = 750) {
		const parameterInfo = '?vframe/jpeg/offset/1'
		if (!url) {
			return '';
		}
		return common.imageGlobal + '' + url.replace('/admin/sys-file/mihuo-test/', '').replace(common.imageGlobal,
			'') + parameterInfo
	},
	/**
	 * 获取视频的地址
	 * @param {String} url: 视频地址
	 * @param {width} width: 缩略图默认宽度
	 * */
	getFileUrl(url, thumbnail, width = 750) {
		const parameterInfo = ''
		if (!url) {
			return '';
		}
		return common.imageGlobal + '' + url.replace('/admin/sys-file/mihuo-test/', '').replace(common.imageGlobal,
			'') + parameterInfo
	},
	numberSort(num) {
		if (num < 10) {
			return '0' + num
		} else {
			return num
		}
	},

	translateNumberToChinese(val) {
		if (!~~val) {
			return '零'
		} else {
			//最后一个@为占位符，没其他用
			var unit = "千百十亿千百十万千百十@",
				str = "",
				num = val + '';
			unit = unit.substr(unit.length - num.length - 1);
			for (var i = 0; i < num.length; i++) {
				str += '零一二三四五六七八九十'.charAt(num.charAt(i)) + unit.charAt(i + 1);
			}
			str = str.replace(/零(千|百|十)/g, "零").replace(/(零)+/g, "零").replace('@', '').replace(/零$/, '');
			return (val > 9 && val < 20) ? str.replace('一', '') : str;
		}
	},

	// im附件的地址
	getImFiles(id, isThumb = true, needToken = false) {
		const imUserInfo = uni.getStorageSync("imUserInfo");
		return imUserInfo.baseUrl + `/api/Common/GetFile?fileId=${id}&isThumb=${isThumb}` + (needToken ? `&token=` +
			imUserInfo.token : '');
	},

	/**
	 *	跳转到聊天
	 *  targetUserId 单聊这个就是userid 群聊这个是企业id
	 *  targetUserName 单聊是用户名称 群不用管可以不传 这里会生成
	 *  type 是进去的位置 是材料订单还是施工订单
	 *  id 是如果材料订单就是材料订单id 施工订单就是施工订单id 
	 *  messageType 0单聊 1群聊（聊天的类型 0是单人聊天联系师傅、联系设计师这些一对一的都是单聊 ，联系客户、联系商家都是群聊）
	 *  参数不要乱传 不确定就问。
	 */
	goToChat(targetUserId, targetUserName = '', type = "", id = 0, messageType = 0) {
		// #ifdef H5
		console.warn('H5端无法跳转到IM');
		return
		// #endif
		// #ifndef H5
		const imUserInfo = uni.getStorageSync('imUserInfo')
		if (!imUserInfo) {
			this.$util.toast('聊天服务启用失败，请稍候再试')
			return
		}
		if (targetUserId == imUserInfo.appUserId.split('_')[1]) {
			this.$util.toast('您不能给自己发送消息')
			return
		}
		let toUserName = targetUserId
		if (targetUserName) {
			toUserName = targetUserName;
		}
		let idName = ''
		switch (type) {
			case 'constructionOrder':
				idName = 'orderId'
				break;
			case 'supplierMaterial':
				idName = 'materialId'
				break;
			case 'supplierOrder':
				idName = 'orderId'
				break;
			default:
				idName = ''
				break;
		};
		let str = idName ? `${idName}=${id}` : '';
		if (messageType) {
			// #ifdef APP
			let data = this.commodity
			let sweixin = null
			plus.share.getServices(res => {
				sweixin = res.find(i => i.id === 'weixin')
				if (sweixin) {
					sweixin.openCustomerServiceChat({
						corpid: 'ww2ee7ab2359e6830c',
						url: 'https://work.weixin.qq.com/kfid/kfc79013d82ddd47934',
					}, suc => {
						console.log("success", JSON.stringify(res))
					}, err => {
						console.log("error", JSON.stringify(err))
					})
				} else {
					plus.nativeUI.alert('当前环境不支持微信操作!')
				}
			}, function() {
				uni.showToast({
					title: "获取服务失败，不支持该操作。" + JSON.stringify(e),
					icon: 'error'
				})
			});
			// #endif
			// #ifdef MP
			wx.openCustomerServiceChat({
				extInfo: {
					url: 'https://work.weixin.qq.com/kfid/kfc79013d82ddd47934'
				},
				corpId: 'ww2ee7ab2359e6830c',
				success(res) {
					console.log(res)
				}
			})
			// #endif
			return;
		}!messageType ? uni.navigateTo({
			url: `/pages-message/chat/index?type=${type}&toUserId=${targetUserId}&toUserName=${targetUserName}&${str}`
		}) : uni.navigateTo({
			url: `/pages-message/group/index?type=${type}&toUserId=${targetUserId}&toUserName=${targetUserName}&${str}`
		});
		// #endif
	},
	//联系客服
	goToWeixin() {
		// #ifdef APP
		let data = this.commodity
		let sweixin = null
		plus.share.getServices(res => {
			sweixin = res.find(i => i.id === 'weixin')
			if (sweixin) {
				sweixin.openCustomerServiceChat({
					corpid: 'ww2ee7ab2359e6830c',
					url: 'https://work.weixin.qq.com/kfid/kfc79013d82ddd47934',
				}, suc => {
					console.log("success", JSON.stringify(res))
				}, err => {
					console.log("error", JSON.stringify(err))
				})
			} else {
				plus.nativeUI.alert('当前环境不支持微信操作!')
			}
		}, function() {
			uni.showToast({
				title: "获取服务失败，不支持该操作。" + JSON.stringify(e),
				icon: 'error'
			})
		});
		// #endif
		// #ifdef MP
		wx.openCustomerServiceChat({
			extInfo: {
				url: 'https://work.weixin.qq.com/kfid/kfc79013d82ddd47934'
			},
			corpId: 'ww2ee7ab2359e6830c',
			success(res) {
				console.log(res)
			}
		})
		// #endif
	},
	/**
	 *	@description 请求支付
	 *  @param paymentWay 1-微信扫码，2-微信原生App，3-微信小程序，4-支付宝扫码，5-支付宝原生App，6-余额
	 * 	@param orderData 订单id(废弃)
	 * 	@param queryData 接口参数
	 *  @param type mallOrder-商城订单 workOrder-找师傅订单 changeItem-变更项 nodePay-节点支付
	 *  @param callback 支付成功后的回调
	 * 	@param isUsePrepayment 是否使用预付款支付
	 */
	requestPay(paymentWay, queryData, type, callback, isUsePrepayment = false) {
		// #ifdef H5
		console.error('无法调用支付功能')
		return
		// #endif
		// #ifdef MP-WEIXIN
		uni.login({
			success: (res) => {
				switch (type) {
					case 'mallOrder':
						// 支付商城订单
						$http.post('mall/order/carOrderPay', {
							clientId: 'cmini',
							code: res.code,
							payMethod: 3,
							bizType: 40,
							usePrepayment: isUsePrepayment,
							orderIds: queryData.orderId.orderIds,
						}).then(result => {
							if (!result) {
								this.$util.toast('网络异常，请稍候再试～')
								return
							}
							if (result.payStatus === 'SUCCESS') {
								if (queryData.orderId.orderIds.length === 1) {
									// 只有一个订单时，跳转到订单详情页
									uni.redirectTo({
										url: `/pages-order/orderDetails?id=${this.payOrderInfo.orderIds[0]}&type=${type}`,
									})
								} else {
									// 多个订单跳转到订单列表页
									uni.redirectTo({
										url: `/pages-order/orderList?index=-1&status=0&autoReirect=1`
									})
								}
								return
							}
							if (result.splitFlag) {
								// 分段支付
								uni.$emit('splitPayOrder', result.payOrderNo)
								return
							}
							const data = JSON.parse(result.payInfo);
							uni.requestPayment({
								provider: 'wxpay',
								timeStamp: String(data.timeStamp),
								nonceStr: data.nonceStr,
								package: data.package,
								signType: data.signType,
								paySign: data.paySign,
								success: function(res) {
									// 支付成功
									uni.hideLoading()
									callback && callback()
								},
								fail: function(err) {
									console.log('fail:' + JSON.stringify(err));
								}
							});

						})
						break
					case 'workOrder':
						// 支付施工订单
						$http.post('order/customer/pay/order', {
							orderId: queryData.orderId,
							amount: queryData.amount,
							payMethod: 3,
							code: res.code,
							clientId: 'cmini'
						}).then(result => {
							if (result) {
								const data = JSON.parse(result.payInfo);
								uni.requestPayment({
									provider: 'wxpay',
									timeStamp: String(data.timeStamp),
									nonceStr: data.nonceStr,
									package: data.package,
									signType: data.signType,
									paySign: data.paySign,
									success: function(res) {
										// 支付成功
										uni.hideLoading()
										callback && callback()
									},
									fail: function(err) {
										console.log('fail:' + JSON.stringify(err));
									}
								});
							} else {
								this.$util.toast('网络异常，请稍候再试～')
								return
							}
							const data = JSON.parse(result.payInfo);
							uni.requestPayment({
								provider: 'wxpay',
								timeStamp: String(data.timeStamp),
								nonceStr: data.nonceStr,
								package: data.package,
								signType: data.signType,
								paySign: data.paySign,
								success: function(res) {
									// 支付成功
									uni.hideLoading()
									callback && callback()
								},
								fail: function(err) {
									console.log('fail:' + JSON.stringify(err));
								}
							});

						})
						break
					case 'changeItem':
						// 支付订单变更项
						$http.post('order/customer/pay/alteration', {
							ids: queryData.ids,
							payAmount: queryData.payAmount,
							payType: 3,
							code: res.code,
							clientId: 'cmini'
						}).then(result => {
							if (!result) {
								this.$util.toast('网络异常，请稍候再试～')
								return
							}
							const data = JSON.parse(result.payInfo);
							uni.requestPayment({
								provider: 'wxpay',
								timeStamp: String(data.timeStamp),
								nonceStr: data.nonceStr,
								package: data.package,
								signType: data.signType,
								paySign: data.paySign,
								success: function(res) {
									// 支付成功
									uni.hideLoading()
									callback && callback()
								},
								fail: function(err) {
									console.log('fail:' + JSON.stringify(err));
								}
							});

						})
						break
					case 'nodePay':
						// sop节点支付
						$http.post('order/sopreceiptrecords/pay', {
							nodeId: queryData.nodeId,
							payMethod: 3,
							code: res.code,
							clientId: 'cmini',
							payAmount: queryData.payAmount
						}).then(result => {
							if (!result) {
								this.$util.toast('网络异常，请稍候再试～')
								return
							}
							const data = JSON.parse(result.payInfo);
							uni.requestPayment({
								provider: 'wxpay',
								timeStamp: String(data.timeStamp),
								nonceStr: data.nonceStr,
								package: data.package,
								signType: data.signType,
								paySign: data.paySign,
								success: function(res) {
									// 支付成功
									uni.hideLoading()
									callback && callback()
								},
								fail: function(err) {
									console.log('fail:' + JSON.stringify(err));
								}
							});

						})
						break
					default:
						break
				}
			}
		})
		// #endif
		// #ifndef MP
		let platform = uni.getSystemInfoSync().platform.toLowerCase()
		switch (paymentWay) {
			case 4:
				let urllink =
					`alipays://platformapi/startapp?saId=10000007&qrcode=${queryData.orderId ? queryData.orderId : queryData}?_s=web-other`;
				if (platform == 'android') {
					plus.runtime.openURL(urllink)
				} else if (platform == 'ios') {
					plus.runtime.launchApplication({
						action: urllink
					})
				}
				callback && callback()
				break
			case 3:
				// 微信小程序支付
				if (platform == 'android') {
					if (!plus.runtime.isApplicationExist({
							pname: 'com.tencent.mm',
							action: 'weixin://'
						})) {
						uni.showToast({
							title: '您还未安装微信，请先去安装',
							icon: 'none'
						});
						return
					}
				} else {
					if (!plus.runtime.isApplicationExist({
							action: 'weixin://'
						})) {
						uni.showToast({
							title: '您还未安装微信，请先去安装',
							icon: 'none'
						})
						return
					}
				}
				console.log('pay by miniprogram')
				plus.share.getServices(res => {
					let sweixin = null;
					for (let i in res) {
						if (res[i].id == 'weixin') {
							sweixin = res[i];
						}
					}
					// #ifdef APP-PLUS || MP-WEIXIN
					uni.showLoading({
						duration: 6000
					})
					// #endif
					// 唤醒微信小程序
					if (sweixin) {
						const userInfo = uni.getStorageSync('userInfo');
						const token = userInfo.token_type + ' ' + userInfo.access_token;
						const query =
							`orderInfo=${queryData.orderId.orderIds}&payMethodKey=${3}&token=${token}&type=${type}&amount=${queryData.amount}&isUsePrepayment=${isUsePrepayment}`
						sweixin.launchMiniProgram({
							id: 'gh_d70e3f34c452', // c端小程序
							type: common.appletVersion, // 小程序版本  0-正式版 1-开发版 2-体验版
							path: `pages/wxPay/wxPay?${query}` // 小程序的页面,用传的参数在小程序接值判断跳转指定页面
						});
					}
				});
				callback && callback()
				break
			default:
				console.error('不支持的支付方式')
				break
		}
		// #endif
	},
	goToLoginPage() {
		// #ifdef MP-WEIXIN
		uni.navigateTo({
			url: '/pages-user/login'
		})
		// #endif
		// #ifdef H5 || MP-TOUTIAO
		uni.navigateTo({
			url: '/pages-user/appLogin/appLogin'
		})
		// #endif
		// #ifdef APP
		uni.navigateTo({
			url: '/pages-appInfo/univerifyLogin/univerifyLogin'
		})
		// #endif
	},
	/**
	 * @description 套餐分组
	 * @param list 数据
	 * @param typeList 分组依据
	 */
	group(list, typeList) {
		if (!list) return
		if (list.length == 0 || typeList.length == 0) {
			return []
		}
		typeList.map((item) => {
			let childrenList = []
			item.children = []
			list.forEach((val) => {
				if (item.treeCode == val.category) {
					childrenList.push(val)
				}
			})
			item.children = childrenList.reduce((pre, cur, index) => {
				var findIfTypeExist = pre.findIndex((cd) => {
					return cd.type === cur.type;
				})
				cur['checkbox'] = false
				cur['show'] = true
				if (findIfTypeExist === -1) {
					let obj = {
						type: cur.type,
						products: [cur],
						checkboxList: [],
						show: false
					}
					pre.push(obj)
				} else {
					pre[findIfTypeExist].products.push(cur)
				}
				return pre;
			}, []);
		})
		return typeList.filter(item => item.children.length)
	},
	// 清除角标
	removeTabBarBadge(num) {
		if (num == "all") {
			for (let i = 0; i < 5; i++) {
				uni.removeTabBarBadge({
					index: i
				})
			}
		} else {
			uni.removeTabBarBadge({
				index: num
			})
		}
	},
	// 消息角标设置
	// type 是增加还是减少
	setNotice(type = "add", num) {
		//console.log(num)
		const localNum = uni.getStorageSync("noticeNum");
		if (localNum) {
			const hasnum = Number(localNum)
			const typeNum = Number(num)
			let total = 0;
			switch (type) {
				case "add":
					total = hasnum + typeNum;
					break;
				case "update":
					uni.setStorageSync("noticeNum", num)
					if (num > 0) {
						let text = num > 99 ? '99+' : num + '';
						// #ifdef APP-PLUS
						plus.runtime.setBadgeNumber(num)
						// #endif
						uni.setTabBarBadge({
							index: 3,
							text: text
						})
					} else {
						uni.removeTabBarBadge({
							index: 3
						})
						// #ifdef APP
						plus.runtime.setBadgeNumber(0)
						// #endif
					}
					return false;
				case "sub":
					total = hasnum - typeNum;
					break;
			}
			uni.setStorageSync("noticeNum", total)
			if (total > 0) {
				let text = total > 99 ? '99+' : total + '';
				// #ifdef APP
				plus.runtime.setBadgeNumber(total)
				// #endif
				uni.setTabBarBadge({
					index: 3,
					text: text
				})
			} else {
				uni.removeTabBarBadge({
					index: 3
				})
				// #ifdef APP
				plus.runtime.setBadgeNumber(0)
				// #endif
			}
		} else {
			uni.setStorageSync("noticeNum", num)
			let text = num > 99 ? '99+' : num > 0 ? num + '' : '';
			// #ifdef APP
			plus.runtime.setBadgeNumber(num)
			// #endif
			if (num > 0) {
				uni.setTabBarBadge({
					index: 3,
					text: text
				})
			} else {
				uni.removeTabBarBadge({
					index: 3
				})
			}
		}
	},
	readNotice(id) {
		$http.get(`basic/notification/get/${id}`).then(res => {
			if (res) {
				if (!res.readFlag) {
					$http.get(`basic/notification/read/${id}`).then(res => {
						this.setNotice('sub', 1)
					})
				}
			}
		})
	},
	// 小程序上报事件的初始化
	eventEscalationInit() {
		// #ifndef H5
		// 小程序的openid
		// 这里还需要先上报一次home页面
		const uuid = uni.getStorageSync('APP-UUID');
		const userData = uni.getStorageSync('userData');
		const data = {
			path: 'pages/home/home',
			uuid: uuid,
			...(userData || {})
		};
		// 这里还需要先上报一次home页面
		uni.onAppRoute((route) => {
			//上报页面的事件
			const userData = uni.getStorageSync('userData');
			const edata = {
				uuid: uuid,
				...route,
				...(userData || {})
			};
			// 上报接口上报
		})
		// #endif
	},
	// 自定义上报方法
	customEventEscalation(data) {
		const uuid = uni.getStorageSync('APP-UUID');
		//如果登陆了那么用户的信息也需要一起上报
		const userData = uni.getStorageSync('userData');
		const form = {
			...data,
			uuid: uuid,
			...(userData || {})

		};
		//上报
	},
	/**
	 * @description 下载报告
	 * @param id 报告id
	 * @param type 报告类型 变更=1 交底=2 验收=3 巡检=4
	 * @param fileName 文件名称
	 */
	downloadPdfReport(id, type, fileName, reportName = '') {
		if (!reportName) reportName = fileName
		let urlEnv = 0
		switch (common.env) {
			case "dev":
				urlEnv = 1;
				break;
			case "test":
				urlEnv = 2;
				break;
			case "uat":
				urlEnv = 3;
				break;
			case "pro":
				urlEnv = 4;
				break;
			default:
				urlEnv = 4;
				break;
		}
		const url =
			`https://api.51mihuo.com/reports?type=${type}&id=${id}&urlEnv=${urlEnv}&log=1&fileName=${encodeURIComponent(fileName)}`;
		uni.showLoading({
			duration: 5000
		});
		$http.get(url).then((response) => {
			if (response && response.url) {
				// #ifdef APP-PLUS
				if (uni.getSystemInfoSync().platform == "android") {
					try {
						plus.runtime.openURL(
							common.imageGlobal + response.url
						);
					} catch (error) {
						console.log(error);
					}
				} else {
					uni.downloadFile({
						url: common.imageGlobal + response.url,
						success: (res) => {
							const filePath = res.tempFilePath;
							uni.openDocument({
								filePath: filePath,
								showMenu: true,
								fileType: "pdf",
								success: (res) => {},
							});
						},
					});
				}
				// #endif
				// #ifdef MP-WEIXIN
				uni.downloadFile({
					url: common.imageGlobal + response.url,
					filePath: wx.env.USER_DATA_PATH + "/" + reportName + ".pdf",
					success: (res) => {
						const filePath = res.filePath;
						uni.openDocument({
							filePath: filePath,
							showMenu: true,
							fileType: "pdf",
							success: (res) => {},
						});
					},
				});
				// #endif
				// #ifdef H5
				uni.openDocument({
					filePath: common.imageGlobal + response.url,
				});
				// #endif
			}
		});
	},
	/**
	 * @description 分享页面到微信
	 * @param title 分享标题
	 * @param coverImage 分享封面
	 * @param path 分享页面
	 * @param pageName 页面名称
	 * @param isReport 是否上报
	 * @param type 分享到微信会话=1 APP分享到小程序=2
	 * @param shareDesc 分享描述
	 */
	shareToWechat(title, coverImage, path, pageName, isReport, type, shareDesc = '') {
		// #ifdef H5
		return
		// #endif
		// #ifdef APP-PLUS
		if (type === 1) return
		// #endif
		// #ifdef MP-WEIXIN
		if (type === 2) return
		// #endif
		let userId = -1
		let invitationCode = ''
		const userData = uni.getStorageSync('userData')
		if (userData) {
			userId = userData.sysUser.userId
			invitationCode = userData.sysUser.inviteCode
		}
		let pages = getCurrentPages()
		const url = pages[pages.length - 1].route
		const options = pages[pages.length - 1].options
		if (isReport) {
			$http.post('order/bizsharecode/add', {
				uuid: uni.getStorageSync('APP-UUID'),
				type: 2, // 用户发送分享
				sourceId: userId, // 分享人userId
				params: JSON.stringify(options),
				pageName: pageName,
				pagePath: url,
			}).then(res => {})
		}
		if (type === 1) {
			return {
				title: title,
				withShareTicket: true,
				imageUrl: coverImage,
				desc: shareDesc,
				path: path + `&userId=${userId}&invitationCode=${invitationCode}`
			}
		} else if (type === 2) {
			uni.share({
				provider: 'weixin',
				scene: 'WXSceneSession',
				type: 5, // 微信小程序
				imageUrl: coverImage,
				title: title,
				miniProgram: {
					id: 'gh_d70e3f34c452', // c端小程序原始id
					path: path + `&userId=${userId}&invitationCode=${invitationCode}`, // 分享到小程序的页面
					// type: 1,
					type: common.appletVersion, // 小程序版本  0-正式版 1-开发版 2-体验版
					webUrl: 'https://www.51mihuo.com/' // 兼容低版本的网页链接
				},
				success: (res) => {
					this.$util.toast('分享成功~')
				}
			})
		}
	},
	/**
	 * @description 分享至微信朋友圈
	 * @param title 分享标题
	 * @param href 分享页面
	 * @param href 页面名称
	 * @param isReport 是否上报
	 */
	shareToWechatTimeLine(title, href, pageName, isReport) {
		if (isReport) {
			const userData = uni.getStorageSync('userData')
			let userId
			if (userData) {
				userId = userData.sysUser.userId
			}
			let pages = getCurrentPages()
			const url = pages[pages.length - 1].route
			const options = pages[pages.length - 1].options
			$http.post('order/bizsharecode/add', {
				uuid: uni.getStorageSync('APP-UUID'),
				type: 2, // 用户发送分享
				sourceId: userId, // 分享人userId
				params: JSON.stringify(options),
				pageName: pageName,
				pagePath: url,
			}).then(res => {})
		}
		uni.share({
			provider: "weixin",
			scene: "WXSceneTimeline",
			// type: 0, // 只有正式版可以附带链接 不知道为什么
			type: common.appletVersion, // 小程序版本  0-正式版 1-开发版 2-体验版
			title: title,
			href: href,
			imageUrl: 'https://www.51mihuo.com/static/icon/app-logo.png',
			// imageUrl: 'https://web-assets.dcloud.net.cn/unidoc/zh/uni@2x.png',
			// imageUrl: '@/static/app-plus/client-logo.png',
			success: function(res) {
				this.$util.toast('分享成功~')
			},
			fail: function(err) {
				console.log("fail:" + JSON.stringify(err));
			}
		});
	},
	/**
	 * @description 打开分享页面后上报
	 * @param pathName 页面名称
	 * @param coverImage 页面路径
	 * @param sourceUserId 分享来源ID
	 * @param params 页面参数
	 */
	reportShareEvent(pathName, url, sourceUserId, params = {}) {
		let userId = -1
		const userData = uni.getStorageSync('userData')
		if (userData) {
			userId = userData.sysUser.userId
		}
		$http.post('order/bizsharecode/add', {
			uuid: uni.getStorageSync('APP-UUID'),
			type: 1, // 打开分享链接
			sourceId: sourceUserId, // 分享来源userId
			receiverId: userId, // 分享人的用户ID 
			params: JSON.stringify(params),
			pageName: pathName,
			pagePath: url,
		}).then(res => {})
	},
	getBigNumber(number) {
		const result = {
			1: '一',
			2: '二',
			3: '三',
			4: '四',
			5: '五',
			6: '六',
			7: '七',
			8: '八',
			9: '九',
			10: '十',
		} [number]
		if (result) return result
		return number
	},
}
export default util
