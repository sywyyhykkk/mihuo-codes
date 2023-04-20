import baseConfig from '@/config/common.js'
import {
	getQueryString,
	encryptMethod,
	decryptMethod,
	wordMatch
} from '@/plugins/utils.js'
import $http from '@/config/requestConfig'

const currentMode = uni.getStorageSync('devModeApi')
let common = baseConfig
if (currentMode) {
	common = currentMode
}
const random = (min, max) => {
	return Math.floor(Math.random() * (max - min)) + min;
}
const util = {
	//创建口令
	createWordLink(data, path) {
		const getString = wordMatch.find(data => data.path == path)
		const code = encryptMethod(data)
		//首尾的字符串决定要跳转的界面
		//data的格式 参数1@参数2@参数3
		const link = `${random(1,100)}:/复制打开觅活工匠，查看具体信息，${getString.start}${code}${getString.end} 「觅活口令」`
		uni.setClipboardData({
			data: link,
			success() {
				// 判断平台  
				if (plus.os.name == 'Android') {
					plus.runtime.launchApplication({
							pname: 'com.tencent.mm'
						},
						(e) => {
							console.log('Open system default browser failed: ' + e.message);
						}
					);
				} else if (plus.os.name == 'iOS') {
					plus.runtime.launchApplication({
						action: 'weixin://'
					}, (e) => {
						console.log('Open system default browser failed: ' + e.message);
					});
				}
			}
		})
	},
	loading(title = '加载中') {
		uni.showLoading({
			title
		})
	},
	toast(title = '', icon = 'none') {
		return uni.showToast({
			title,
			icon
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
	 *   messageType 0单聊 1群聊（聊天的类型 0是单人聊天联系师傅、联系设计师这些一对一的都是单聊 ，联系客户、联系商家都是群聊）
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
			case 'market':
				idName = 'orderId'
				break;
			case 'insurance':
				idName = 'orderId'
				break;
			default:
				idName = ''
				break;
		};
		let str = idName ? `${idName}=${id}` : '';
		!messageType ? uni.navigateTo({
			url: `/pages/message/chat/index?type=${type}&toUserId=${targetUserId}&toUserName=${targetUserName}&${str}`
		}) : uni.navigateTo({
			url: `/pages/message/group/index?type=${type}&toUserId=${targetUserId}&toUserName=${targetUserName}&${str}`
		});
		// #endif
	},
	/* *
	 *	请求支付
	 *  paymentWay 1-微信扫码，2-微信原生App，3-微信小程序，4-支付宝扫码，5-支付宝原生App，6-余额
	 * 	type mallOrder-商城订单 workOrder-找师傅订单 changeItem-变更项
	 * 	paymentWay为4的时候 data是支付宝的https链接
	 * 	paymentWay为3的时候 data是订单号
	 *  这个方法只能发起支付，无法确认支付状态，需要单独处理
	 */
	requestPay(paymentWay, data, type) {
		let platform = uni.getSystemInfoSync().platform
		switch (paymentWay) {
			case 4:
				// 支付宝扫码
				// 实际还是唤起支付宝类似原生app支付
				if (platform == "android") {
					if (!plus.runtime.isApplicationExist({
							pname: 'com.eg.android.AlipayGphone',
						})) {
						uni.showToast({
							title: '您还未安装支付宝，请先去安装',
							icon: 'none'
						})
						plus.runtime.openURL(data);
						return
					}
				} else {
					if (!plus.runtime.isApplicationExist({
							action: 'alipay://'
						})) {
						uni.showToast({
							title: '您还未安装支付宝，请先去安装',
							icon: 'none'
						})
						plus.runtime.openURL(data);
						return
					}
				}
				console.log('pay by alipay')
				let urllink = `alipays://platformapi/startapp?saId=10000007&qrcode=${data}?_s=web-other`;
				if (platform == 'android') {
					plus.runtime.openURL(urllink)
				} else if (platform == 'ios') {
					plus.runtime.launchApplication({
						action: urllink
					})
				}
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
						plus.runtime.openURL(data);
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
						plus.runtime.openURL(data);
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
					// 唤醒微信小程序
					if (sweixin) {
						let miniProgramType = process.env.NODE_ENV === 'production' ? 0 : 1
						const userInfo = uni.getStorageSync('userInfo');
						const token = userInfo.token_type + ' ' + userInfo.access_token;
						const query =
							`orderInfo=${JSON.stringify(data)}&payMethodKey=${3}&token=${token}&type=${type}`
						sweixin.launchMiniProgram({
							id: 'gh_d70e3f34c452', //
							type: miniProgramType, //小程序版本  0-正式版； 1-测试版； 2-体验版。
							path: `pages/wxPay/wxPay?${query}` //小程序的页面,用传的参数在小程序接值判断跳转指定页面
						});
					}
				});
				break
			default:
				console.error('不支持的支付方式')
				break
		}
	},

	// 相对时间
	relativeTime(val) {
		let cTime = new Date().getTime(); // 当前时间
		let tTime = Date.parse(new Date(val.replace(/-/g,
			'/'))); // 目标时间 ios支持的时间格式为 ‘2022/08/05 0:0:0’，当前的时间格式为 ‘2022-08-05 0:0:0’，需要将“-”替换为“/”
		let diffTime = cTime - tTime;
		//秒-分-时-日-月-年
		if (diffTime < 1000) {
			return "刚刚"
		} else if (diffTime <= 60 * 1000) {
			return parseInt(diffTime / 1000) + "秒前";
		} else if (diffTime <= 60 * 60 * 1000) {
			return parseInt(diffTime / (60 * 1000)) + "分种前";
		} else if (diffTime <= 24 * 60 * 60 * 1000) {
			return parseInt(diffTime / (60 * 60 * 1000)) + "小时前";
		} else if (diffTime <= 30 * 24 * 60 * 60 * 1000) {
			return parseInt(diffTime / (24 * 60 * 60 * 1000)) + "天前";
		} else if (diffTime <= 12 * 30 * 24 * 60 * 60 * 1000) {
			return parseInt(diffTime / (30 * 24 * 60 * 60 * 1000)) + "月前";
		} else {
			return parseInt(diffTime / (12 * 30 * 24 * 60 * 60 * 1000)) + "年前";
		}
	},

	/**计算距离
	 * lon1, lat1当前位置
	 * lon2, lat2目标位置
	 */
	calculateDistance(lon1, lat1, lon2, lat2) {
		let red1 = lat1 * Math.PI / 180.0;
		let red2 = lat2 * Math.PI / 180.0;
		let a = red1 - red2;
		let b = lon1 * Math.PI / 180 - lon2 * Math.PI / 180.0;
		let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(red1) * Math.cos(red2) * Math.pow(
			Math.sin(b / 2), 2)));
		s = s * 6378.137;
		s = Math.round(s * 10000) / 10000;
		s = Number(s).toFixed(1);
		if (parseFloat(s) > 0.3 && parseFloat(s) < 0.5) {
			return parseFloat(s) * 1000 + 'm'
		} else if (parseFloat(s) >= 0 && parseFloat(s) <= 0.3) {
			return '附近'
		} else {
			return parseFloat(s) + 'km'
		}
	},

	//隐藏手机号 tel电话号码 type是否隐藏
	displayTel(tel, type) {
		if (!tel) return
		if (type == 1) {
			return tel
		} else if (type == 0) {
			return tel.replace(/(\d{3})\d{5}(\d{3})/, "$1*****$2")
		}
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
		// #ifdef APP-PLUS
		uni.navigateTo({
			url: '/pages-appInfo/univerifyLogin/univerifyLogin'
		})
		// #endif
	},
	//清除角标
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
	//图片压缩
	compressImage(path) {
		return new Promise((resolve, reject) => {
			uni.getFileInfo({
				filePath: path,
				success(data) {
					if (data.size / (1024 * 1000) > 1.8) {
						uni.compressImage({
							src: path,
							width: '50%',
							success(res) {
								resolve(res)
							},
							fail(error) {
								reject(error)
							},
							complete(data) {

							}
						})
					} else {
						resolve({
							tempFilePath: path
						})
					}

				}
			})

		})
	},
	pxToRpx(px) {
		//计算比例
		let scale = uni.upx2px(100) / 100;
		return px / scale
	},
	/**
	 * @description 下载报告
	 * @param id 报告id
	 * @param type 报告类型 变更=1 交底=2 验收=3 巡检=4  B端报告
	 * @param fileName 文件名称
	 */
	downloadPdfReport(id, type, fileName, reportName = '') {
		if (!reportName) reportName = fileName
		let urlEnv = 0

		console.log('common.env', common.env);

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
			duration: 4000
		});
		$http.get(url).then((response) => {
			if (response && response.url) {
				// #ifdef APP-PLUS
				if (uni.getSystemInfoSync().platform == "android") {
					try {
						plus.runtime.openURL(
							common.imageGlobal + response.url
						);
						uni.hideLoading();
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

					uni.hideLoading();
				}
				// #endif
				// #ifdef H5
				uni.openDocument({
					filePath: common.imageGlobal + response.url,
				});

				uni.hideLoading();
				// #endif
			}
		});
	},
	/**
	 * @description 套餐分组
	 * @param list 数据
	 * @param typeList 分组依据
	 */
	group(list, typeList) {
		if (list.length == 0 || typeList.length == 0) {
			return []
		}
		typeList.map((item) => {
			// debugger
			let childrenList = []
			item.children = []
			item['show'] = true
			list.forEach((val) => {
				if (item.treeCode == val.category) {
					childrenList.push(val)
				}
			})

			item.children = childrenList.reduce((pre, cur, index) => {
				let findIfTypeExist = pre.findIndex((cd) => {
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
	getRoute() {
		let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
		let curRoute = routes[routes.length - 1].route // 获取当前页面路由，也就是最后一个打开的页面路由
		return curRoute
	},
	phoneConfound(phone) {
		if (phone) {
			return phone.replace(/(\d{3})\d{5}(\d{3})/, "$1*****$2")
		}
		return phone
	},
	//联系客服
	goToWeixin() {
		// #ifdef APP
		// let data = this.commodity
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
	 * @description 下载文件并打开
	 * @param down_url 下载地址
	 * @param typeList 文件名称
	 * @param fileType 文件类型
	 */
	downFileStream(down_url, fileName = '新的文件', fileType) {
		if (!down_url) {
			return
		}
		if (!fileType) {
			return
		}
		const fileTypeList = ['xlsx']
		let resultFileType = fileTypeList.find(item => item == fileType)
		uni.showLoading({
			title: '加载中',
			mask: true
		});
		uni.downloadFile({
			url: down_url,
			header: {
				'Content-type': 'application/vnd.ms-excel',
				'Authorization': uni.getStorageSync('userInfo').token_type + ' ' + uni.getStorageSync(
					'userInfo').access_token,
				'VERSION': baseConfig.apiVersion
			},
			success: async (res) => {
				if (res) {
					if (res.statusCode !== 200) {
						uni.hideLoading()
						console.error('下载失败', res);
						return
					}
					// 拿到临时文件的绝对路径
					let filepathss = plus.io.convertLocalFileSystemURL(res.tempFilePath);
					// 通过这个路径来拿到他
					plus.io.resolveLocalFileSystemURL(filepathss, function(entry) {
						const tempFileName = entry.name;
						entry.getParent(function(parentDicEntry) {
							console.log(parentDicEntry.fullPath)
							entry.moveTo({
								fullPath: parentDicEntry.fullPath + '/'
							}, fileName, function(newFile) {
								uni.openDocument({
									fileType: resultFileType,
									filePath: newFile.fullPath,
									success: function(res2) {
										console.log('打开文档成功');
									},
									fail: function(err) {
										uni.hideLoading()
										if (err.errCode == 1 || err
											.code == 1) {
											uni.showToast({
												title: `未找到能打开xlsx类型文件的手机应用`,
												icon: 'none'
											})
										}
										console.log(err)
									}
								});
							}, function(moveError) {
								uni.showToast({
									title: `已在第三方应用中打开过，请在第三方应用查看时保存`,
									icon: 'none'
								})
							})
						})
					})
				}
			}
		})
	},

	conversionUnit(latitude, longitude, callback) {
		uni.getLocation({
			type: 'gcj02',
			geocode: true, //设置该参数为true可直接获取经纬度及城市信息
			isHighAccuracy: true,
			success: (res) => {
				let distance = this.distance(res.latitude, res.longitude, latitude, longitude)
				let resultDistance = this.getDistance(distance * 1000)
				callback && callback(resultDistance)
			},
			fail: function() {
				console.error('获取地址失败，将导致部分功能不可用')
			}
		});
	},
	distance(la1, lo1, la2, lo2) {
		let La1 = la1 * Math.PI / 180.0;
		let La2 = la2 * Math.PI / 180.0;
		let La3 = La1 - La2;
		let Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
		let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(
			Math.sin(Lb3 / 2), 2)));
		// s = s * 6378.137; //地球半径  
		s = s * 6371.393; //地球半径  
		s = Math.round(s * 10000) / 10000;
		return s
	},
	//换算距离
	getDistance(value) {
		if (!value) return ''
		let distance = '';
		let val = Number(value);
		if (val >= 1000) {
			distance = (val / 1000).toFixed(1) + 'km';
		} else {
			distance = val.toFixed(1) + 'm';
		}
		return distance;
	},



}
export default util
