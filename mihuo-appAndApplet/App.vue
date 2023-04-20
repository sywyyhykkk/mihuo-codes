<script>
	import store from '@/store/index.js'
	import imsdk from '@/plugins/im/imsdk.js'
	import tabInit from '@/plugins/im/tabInit.js'
	import CryptoJS from '@/plugins/crypto-js.js'
	import {
		tabSqls
	} from '@/plugins/im/tabSqls.js'
	// #ifdef H5
	import util from '@/static/js/util.js'
	// #endif
	import permision from '@/plugins/permission.js'
	export default {
		globalData: {
			productSearchText: '',
			systemNotice: 0
		},
		computed: {
			msgList() {
				return this.$store.state.messageSessionList
			}
		},
		watch: {
			msgList() {}
		},
		methods: {
			networkStatusChangeCallback(res) {
				if (res.isConnected) {
					this.$store.commit('lisinNetStatus', true)
					this.$httpApi.imToken().then(res => {
						this.$store.commit('WEBSOCKET_INIT', res)
					})
				} else {
					this.$store.commit('lisinNetStatus', false)
					uni.showToast({
						title: '网络不给力，请检查网络',
						icon: 'none'
					})
				}
			},
			getVersion() {
				plus.runtime.getProperty(plus.runtime.appid, wgtinfo => {
					let version = wgtinfo.version
					let version_num = version
					let apptype = 0
					let app_name = wgtinfo.name
					let system = uni.getSystemInfoSync().platform
					switch (app_name) {
						case '觅活':
							apptype = system === 'ios' ? 1 : 0
							break
						default:
							apptype = 10
					}
					this.$httpApi.getAppVersion(apptype).then(res => {
						if (!res) return
						if (res && res.id) {
							let oldVersion = version_num.replace(/\./g, '')
							let newVersion = res.version.replace(/\./g, '')
							if (Number(oldVersion) >= Number(newVersion)) {
								return
							}
							uni.setStorageSync('versionInfo', res)
							uni.navigateTo({
								url: '/pages-appInfo/appUpdate/appUpdate'
							})
						}
					})
				})
			},
			// 监听截屏
			listenScreenshot() {
				const superModuleScreenshotListen = uni.requireNativePlugin('Super-Module-ScreenshotListen')
				if (superModuleScreenshotListen) {
					superModuleScreenshotListen.onStartListenScreenshot(result => {
						let routes = getCurrentPages()
						let curRoute = routes[routes.length - 1].route
						let curParam = routes[routes.length - 1].options
						let userInfo = uni.getStorageSync('imUserInfo')
						// 截图信息上报
						uni.report('用户截图', {
							...(userInfo ? userInfo : {}),
							routePath: curRoute,
							params: curParam
						})
					})
				}
			},
			// 取消截屏监听
			stopListenScreenshot() {
				const superModuleScreenshotListen = uni.requireNativePlugin('Super-Module-ScreenshotListen')
				if (superModuleScreenshotListen) {
					superModuleScreenshotListen.onStopListenScreenshot(result => {})
				}
			},
			// 消息通知跳转im
			goToIm(payload) {
				if (payload.groupId) {
					let groupId = payload.groupId
					let sourceName = payload.sourceName
					this.$store.commit('WEBSOCKET_GROUP', {
						TargetId: groupId
					})
					this.toPage('/pages-message/group/index?toUserId=' + groupId + '&toUserName=' + sourceName)
					return
				}
				if (payload.sourceId) {
					let sourceId = payload.sourceId
					let sourceName = payload.sourceName
					this.$store.commit('WEBSOCKET_NORMAL', {
						TargetId: sourceId
					})
					this.toPage('/pages-message/chat/index?toUserId=' + sourceId + '&toUserName=' + sourceName)
					return
				}
			},
			// 节点审查
			goToNodeReview(data, noticeId) {
				switch (data.nodeType) {
					case '1000': //无类型
						this.toPage(
							`/pages-myHome/otherForm/otherForm?nodeId=${data.nodeId}&reviewId=${data.reviewId}&projectId=${data.projectId}&noticeId=${noticeId}`
						)
						break
					case '1002': //派单
						this.toPage(
							`/pages-myHome/distributeForm/distributeForm?nodeId=${data.nodeId}&reviewId=${data.reviewId}&projectId=${data.projectId}&noticeId=${noticeId}`
						)
						break
					case '1003': //预算
						this.toPage(
							`/pages-myHome/estimated-cost?nodeId=${data.nodeId}&reviewId=${data.reviewId}&projectId=${data.projectId}&noticeId=${noticeId}`
						)
						break
					case '1004': //施工
						this.toPage(
							`/pages-myHome/reviewNode/constructionCheck?nodeId=${data.nodeId}&reviewId=${data.reviewId}&noticeId=${noticeId}`
						)
						break
					case '1005': //验收
						this.toPage(
							`/pages-myHome/reviewNode/checkReport?nodeId=${data.nodeId}&reviewId=${data.reviewId}&noticeId=${noticeId}`
						)
						break
					case '1006': //上传
						this.toPage(
							`/pages-myHome/houseUploadView?nodeId=${data.nodeId}&reviewId=${data.reviewId}&projectId=${data.projectId}&noticeId=${noticeId}`
						)
						break
					case '1010': //交底
						this.toPage(
							`/pages-myHome/reviewNode/discloseReport?nodeId=${data.nodeId}&reviewId=${data.reviewId}&noticeId=${noticeId}`
						)
						break
					case '1011': //量房
						this.toPage(
							`/pages-myHome/measureForm/measureForm?nodeId=${data.nodeId}&reviewId=${data.reviewId}&projectId=${data.projectId}&noticeId=${noticeId}`
						)
						break
					default:
						break
				}
			},
		},
		onLaunch: function(e) {
			// 获取设备唯一标识
			// #ifdef MP-WEIXIN
			uni.login({
				provider: "weixin",
				success: (res) => {
					const deviceInfo = uni.getDeviceInfo();
					this.$http
						.get('admin/weChat/getOpenId?clientId=cmini' + '&code=' + res.code)
						.then(res => {
							//然后将信息回传
							uni.setStorageSync('APP-UUID', res)
							this.$store.commit('SET_UUID', res)
							//然后将信息回传
							res && this.$http.post('admin/user/device/refresh', {
								"clientId": 'cmini',
								"deviceId": res,
								"deviceName": deviceInfo.deviceModel,
								"remark": ""
							}).then(data => {

							})
						});
				},
			});
			// #endif
			// #ifdef APP
			if (!uni.getStorageSync('APP-UUID')) {
				const uuid = uni.$u.guid(20)
				uni.setStorageSync('APP-UUID', uuid)
				this.$store.commit('SET_UUID', uuid)
				this.$store.user.uuid = uuid;
				const deviceInfo = uni.getDeviceInfo();
				this.$http.post('admin/user/device/refresh', {
					"clientId": 'capp',
					"deviceId": uuid,
					"deviceName": deviceInfo.deviceModel,
					"remark": ""
				}).then(data => {

				})
			} else {
				this.$store.commit('SET_UUID', uni.getStorageSync('APP-UUID'))
			}
			// #endif
			// #ifdef MP-WEIXIN
			// 微信小程序事件上报
			const {
				scene
			} = e
			// 储存分享来源的邀请码到本地
			uni.setStorageSync('invitatonCode', e.query.invitationCode)
			if (e.path !== 'pages-mall/productDetail/productDetail') {
				// 商品详情页处理上报事件
				const source = e.query.scene || e.query.source
				const scanSourceCode = [1047, 1048, 1049]
				if (source && scanSourceCode.includes(scene)) {
					let base64Code = source.replace('source%3D', '')
					base64Code = base64Code.replace(/-/g, '+').replace(/_/g, '/')
					while (base64Code.length % 4) {
						base64Code += '='
					}
					const result = CryptoJS.enc.Base64.parse(base64Code).toString(CryptoJS.enc.Utf8)
					uni.setStorageSync('APP-SOURCE', result)
					wx.reportEvent('scan_qr', {
						source: result
					})
				}
			}
			// #endif
			// 路由重复拦截
			uni.addInterceptor('navigateTo', {
				invoke(args) {
					// request 触发前拼接 url
					// 需要特殊处理的路由 例如店铺等路由不能无限跳转
					let pages = getCurrentPages()
					const special = [
						'/pages-mall/shopInformation/shopInformation',
						'/pages-mall/shoppingCart/shoppingCart'
					]
					if (!pages[pages.length - 1]) {
						return false
					}
					if (args.url) {
						let url = pages[pages.length - 1].route
						let argsUrl = args.url.split('?')[0]
						let pageUrl = '/' + url
						if (pageUrl == argsUrl) {
							return false
						}
						if (special.includes(argsUrl)) {
							for (let path of pages) {
								let history = '/' + path.route
								if (history == argsUrl) {
									uni.navigateBack()
									return false
								}
							}
						}
					}
					// 这里是不需要登录的界面路由
					const customRoute = [
						'/pages/home/home',
						'/pages/home/article',
						'/pages/category/category',
						'/pages-user/login',
						'/pages-user/register',
						'/pages-user/appLogin/appLogin',
						'/pages-appInfo/univerifyLogin/univerifyLogin',
						'/pages-mall/productDetail/productDetail',
						'/pages-mall/productDetail/productComment',
						'/pages-mall/cateList/cateList',
						'/pages-mall/shopInformation/shopInformation',
						'/pages-common/brandZone/brandZone',
						'/pages-common/case/recommend/detail',
						'/pages-common/operatorSelectCity/operatorSelectCity',
						'/pages-common/searchPage/searchPage',
						'/pages-common/homeSearchResult/homeSearchResult',
						'/pages-processstabdard/processstabdard',
						'/pages-common/protocolWebView/protocolWebView',
						'/pages-homeCall/typeOfDecoration/typeOfDecoration',
						'/pages-user/forgetPassword',
						'/pages-homeCall/callMasterPage/callMasterPage',
						'/pages-mine/cms',
						'/pages-homeCall/typeOfDecoration/contentPage',
						'/pages-common/case/recommend/expensesList',
						'/pages-common/case/report/reportList',
						'/pages-common/case/report/questionnaireTemplate',
						'/pages-common/case/report/checkTemplate',
						'/pages-mine/helpCenter',
						'/pages-user/miyou/miyou',
						'/pages-user/miyou/miyouDetail',
						'/pages-mall/productDetail/productPackage',
						'/pages-mall/couponDetail/couponDetail',
						'/pages-mall/groupDeal/groupDeal'
					]
					let argsUrl = args.url.split('?')[0]
					let urlOptions = args.url.split('?')[1]
					if (!customRoute.includes(argsUrl)) {
						if (!uni.getStorageSync('userInfo') || !uni.getStorageSync('userData')) {
							// 未登录时先去登录页面
							// console.log(argsUrl)
							// 这里不能包含登录页本身
							if (!argsUrl.toLowerCase().includes('login')) {
								// 带上页面options
								uni.setStorageSync('navigatePage', argsUrl + (urlOptions ? `?${urlOptions}` :
									''))
							}
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
							return false
						}
					}
					return true
				},
				success(args) {}
			})
			// #ifdef APP-PLUS
			// 消息推送的业务逻辑
			uni.subscribePush({
				provider: 'unipush',
				success: res => {
					plus.push.addEventListener('click', msg => {
						// 清空通知栏
						plus.push.clear()
						// 监听消息点击事件
						let payload
						//this.$util.setNotice("sub", 1)
						// iOS 环境下
						if (uni.getSystemInfoSync().platform == 'ios') {
							if (msg.type == 'click') {
								// APP离线点击包含click属性，这时payload是JSON对象
								payload = msg.payload
							} else {
								// APP在线，收到消息不会包含type属性,这时的payload是JSON字符串，需要转为JSON对象
								payload = msg.payload
							}
							if (payload != null || payload != undefined) {
								// 此处是预防两次响应推送后的执行事件，此处很玄乎
								// onLaunch 生命周期里，页面跳转有问题,跳不过去
								// 应该是页面还没加载，加上定时后，就可以了；
								setTimeout(() => {
									// 其他业务的跳转
									const navUrl = payload.params
									switch (payload.type) {
										case 'ORDER_HANDLE':
											this.toPage(
												'/pages-order/callOrderDetails?id=' +
												navUrl.orderId +
												'&noticeId=' +
												payload.id
											)
											break
										case 'IM':
											let messageBody = navUrl.MessageBody
											this.goToIm(messageBody)
											break
										case 'OMS_ORDER_HANDLE':
											this.toPage(
												'/pages-order/payOrderDetails?id=' +
												navUrl.omsOrderId +
												'&noticeId=' +
												payload.id
											)
											break
										case 'NODE_REVIEW':
											this.goToNodeReview(navUrl, payload.id)
											break
										default:
											return ''
									}
								}, 500)
							}
						} else {
							// Android
							payload = msg.payload
							console.log(payload)
							if (payload != null || payload != undefined) {
								// 此处是预防两次响应推送后的执行事件，此处很玄乎
								// onLaunch 生命周期里，页面跳转有问题,跳不过去
								// 应该是页面还没加载，加上定时后，就可以了
								setTimeout(() => {
									const navUrl = payload.params
									switch (payload.type) {
										case 'ORDER_HANDLE':
											console.log(navUrl)
											this.toPage(
												'/pages-order/callOrderDetails?id=' +
												navUrl.orderId +
												'&noticeId=' +
												payload.id
											)
											break
										case 'IM':
											let messageBody = navUrl.MessageBody
											this.goToIm(messageBody)
											break
										case 'OMS_ORDER_HANDLE':
											this.toPage(
												'/pages-order/orderDetails?id=' +
												navUrl.omsOrderId +
												'&noticeId=' +
												payload.id
											)
											break
										case 'NODE_REVIEW':
											this.goToNodeReview(navUrl, payload.id)
											break
										default:
											return ''
									}
								}, 500)
							}
						}
					})
					// 收到透传消息
					// 只有APP在线时，才会触发receive事件，透传消息不会触发系统消息,需要创建本地消息
					plus.push.addEventListener('receive', msg => {
						console.log('receive', msg)
						// 业务代码
						this.$util.setNotice('add', 1)
						// IOS
						if (uni.getSystemInfoSync().platform == 'ios') {
							//console.log('receive', msg);
							//【APP离线】收到消息，但没有提醒（发生在一次收到多个离线消息时，只有一个有提醒，但其他的没有提醒）
							//【APP在线】收到消息，不会触发系统消息,需要创建本地消息，但不能重复创建。必须加msg.type验证去除死循环
							if (msg.type == 'receive') {
								// 创建本地消息,发送的本地消息也会被receive方法接收到，但没有type属性，且aps是null
								const messageContent = msg.payload ? msg.payload.content : ''
								plus.push.createMessage(messageContent || '新消息点击查看', msg.payload ||
								{}, {
									cover: false,
									sound: 'system',
									title: msg.title
								})
							}
						} else {
							// Android
							var payload = msg.payload
							var messageTitle = payload.title
							var messageContent = payload.content
							plus.push.createMessage(messageContent, payload, {
								title: messageTitle
							})
						}
					})
				}
			})
			// 检查app版本更新
			this.getVersion()
			// 一键登录预登录，可以显著提高登录速度
			const univerifyManager = uni.getUniverifyManager()
			// 预登录 只是为了提高一键登录的效率
			univerifyManager.preLogin()
			// #endif
			//上报初始化
			this.$util.eventEscalationInit();
		},
		onShow: async function() {
			// 开始监听屏幕截图事件
			this.$store.commit('SET_DEVICEHIDESTATUS', false)
			// #ifndef H5
			uni.onNetworkStatusChange(this.networkStatusChangeCallback)
			// #endif
			// #ifdef MP
			const imUserInfo = uni.getStorageSync('imUserInfo')
			if (imUserInfo) {
				this.$store.commit('WEBSOCKET_INIT', imUserInfo)
				this.$store.commit('UPDATE_NOTICE')
			}
			// 截图事件上报
			uni.onUserCaptureScreen(() => {
				let routes = getCurrentPages()
				let curRoute = routes[routes.length - 1].route
				let curParam = routes[routes.length - 1].options
				const uuid = uni.getStorageSync('APP-UUID')
				wx.reportEvent("screenshot", {
					user_id: imUserInfo.appUserId ? Number(imUserInfo.appUserId.split('_')[1]) : 0,
					user_name: imUserInfo.name || '未登录',
					uuid: uuid + ''
				})
			})
			// #endif
			// #ifdef APP
			// 这里只是为了调试模式下面的正常
			await tabInit.fileTableInit()
			await tabInit.init()
			await tabInit.closeTableSQL()
			let device = uni.getSystemInfoSync().platform
			let userInfo = uni.getStorageSync('userInfo')
			const imUserInfo = uni.getStorageSync('imUserInfo')
			if (imUserInfo) {
				this.$store.commit('WEBSOCKET_INIT', imUserInfo)
				this.$store.commit('UPDATE_NOTICE')
			}
			this.listenScreenshot()
			this.getVersion()
			// #endif
			//#ifdef MP
			this.$util.eventEscalationInit();
			// #endif
		},
		onHide() {
			uni.showTabBar({
				animation: true
			})
			// #ifndef H5
			// 取消监听网络状态变化
			uni.offNetworkStatusChange(this.networkStatusChangeCallback)
			// #endif
			// #ifdef APP
			this.$store.commit('SET_DEVICEHIDESTATUS', true)
			this.stopListenScreenshot()
			// #endif
			// #ifdef MP
			uni.offUserCaptureScreen(() => {})
			// #endif
		}
	}
</script>

<style lang="scss">
	/* #ifndef APP-NVUE */
	@import 'colorui/main.css';
	@import url('@/style/base.css');
	@import 'uview-ui/index.scss';
	@import './style/common.scss';
	@import './style/input.scss';
	@import './style/table.scss';
	/* #endif */

	/* #ifdef H5 */
	
	uni-tabbar {
		.uni-tabbar~.uni-placeholder {
			height: 0rpx !important;
		}
	}
	
	//修复H5底部导航挡住内容bug
	uni-app {
		height: auto;
	}

	//修复H5输入框上下不居中bug
	.uni-input-form {
		height: 100%;
	}

	//去除地图上高德地图标识符
	.amap-copyright {
		display: none !important;
	}

	.amap-logo {
		display: none !important;
	}

	.amap-ui-control-zoom {
		width: 60rpx !important;
	}

	.amap-ui-control-zoom>* {
		width: 60rpx !important;
		height: 60rpx !important;
		line-height: 60rpx !important;
	}

	.amap-ui-control-theme-dark {
		display: none !important;
	}

	/* #endif */

	@supports (bottom: constant(safe-area-inset-bottom)) or (bottom: env(safe-area-inset-bottom)) {
		.iphonex-bottom {
			padding-bottom: constant(safe-area-inset-bottom); // tabBar留出底部安全距离, 兼容 iOS < 11.2
			padding-bottom: env(safe-area-inset-bottom); // 兼容 iOS >= 11.2
		}
	}

	.nav-bar {
		@include nav-bar-title(#000000);
	}
	
	.main-title {
		font-size: 26rpx;
		font-family: Noto Sans S Chinese;
		font-weight: 500;
		color: #000000;
		line-height: 34rpx;
	}

	@font-face {
		font-family: 'HuXiaoBo-NanShen';
		/* #ifdef MP-WEIXIN */
		src: url('https://www.51mihuo.com/static/font/HuXiaoBoNanShenTi-2.otf') format('truetype');
		/*  #endif  */
		/* #ifndef MP-WEIXIN */
		src: url('/static/font/HuXiaoBoNanShenTi-2.otf') format('truetype');
		/*  #endif  */
	}
	
</style>
