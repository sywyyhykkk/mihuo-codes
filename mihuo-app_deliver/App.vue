<script>
	import store from "@/store/index.js";
	import imHttp from "@/config/imRequest.js";
	import imsdk from "@/plugins/im/imsdk.js";
	import tabInit from "@/plugins/im/tabInit.js";
	// #ifdef H5
	import "@/plugins/awsc.js";
	// #endif
	import {
		tabSqls
	} from "@/plugins/im/tabSqls.js";
	// #ifdef H5
	import {
		h5Login
	} from "@/config/html5Utils";
	// #endif
	// #ifdef APP-PLUS
	import APPUpdate from "@/uni_modules/mihuo-APPUpdate/js_sdk/appUpdate";
	import Voice from "@/plugins/QS-baiduyy.js";
	import {
		getQueryString,
		encryptMethod,
		decryptMethod,
		wordMatch,
	} from "@/plugins/utils.js";
	const xsoftmsdk = require("@/plugins/im/xsoftimsdk.js");
	const MihuoPaster = uni.requireNativePlugin("MihuoPaster-Func");
	// #endif
	export default {
		globalData: {
			uabModule: "",
			webUmidToken: "",
			systemNotice: 0,
		},
		computed: {
			msgList() {
				return this.$store.state.messageSessionList;
			},
		},
		watch: {
			msgList() {
				let unread = 0;
				let notice = getApp().globalData.systemNotice || 0;
				this.msgList.forEach((item) => {
					unread += item.UnreadCount;
				});
				if (!notice) {
					notice = 0;
				}
				if (notice >= 99) {
					unread = "99+";
				} else {
					unread = unread + parseInt(notice);
				}
				// #ifdef APP-PLUS
				// 设置桌面图标角标
				plus.runtime.setBadgeNumber(+unread);
				// #endif
				// 设置底部导航栏
				if (unread === 0) {
					uni.removeTabBarBadge({
						index: 2,
					});
				} else {
					if (unread === NaN || !unread) {
						unread = 0;
					}
					uni.setTabBarBadge({
						index: 2,
						text: `${unread}`,
					});
				}
			},
		},
		methods: {
			networkStatusChangeCallback(res) {
				if (res.isConnected) {
					this.$store.commit("lisinNetStatus", true);
					const imUserInfo = uni.getStorageSync("imUserInfo");
					if (imUserInfo) {
						this.$store.commit("WEBSOCKET_INIT", imUserInfo);
					}
				} else {
					this.$store.commit("lisinNetStatus", false);
					const imUserInfo = uni.getStorageSync("imUserInfo");
					if (imUserInfo) {
						this.$store.commit("WEBSOCKET_INIT", imUserInfo);
					}
					uni.showToast({
						title: "网络不给力，请检查网络",
						icon: "none",
					});
				}
			},
			getVersion() {
				plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
					let version = wgtinfo.version;
					let version_num = version;
					let apptype = 0;
					let app_name = wgtinfo.name;
					let system = uni.getSystemInfoSync().platform;
					switch (app_name) {
						case "觅活工匠":
							apptype = system === "ios" ? 3 : 2;
							break;
						default:
							apptype = 10;
					}
					this.$httpApi.getAppVersion(apptype).then((res) => {
						if (!res) return;
						if (res && res.id) {
							let oldVersion = version_num.replace(/\./g, "");
							let newVersion = res.version.replace(/\./g, "");
							if (Number(oldVersion) >= Number(newVersion)) {
								return;
							}
							uni.setStorageSync("versionInfo", res);
							uni.navigateTo({
								url: "/pages/appUpdate/appUpdate",
							});
						}
					});
				});
			},
			async setTabBarBadge() {
				this.$http
					.get(
						"basic/basicmessage/list", {}, {
							header: {
								isShowMessage: false,
							},
						}
					)
					.then((res) => {
						if (res) {
							let notice = 0;
							res.map((item) => {
								notice += item.unreadMessage || 0;
							});
							if (notice > 0) {
								if (notice > 99) {
									getApp().globalData.systemNotice = 99;
									notice = "99+";
								} else {
									getApp().globalData.systemNotice = +notice;
									notice = notice.toString();
								}
								// 不在这里设置，在watch里统一设置
								// uni.setTabBarBadge({
								// 	index: 2,
								// 	text: notice
								// })
							} else {
								getApp().globalData.systemNotice = 0;
							}
						}
					});
			},
			//监听截屏
			ListenScreenshot() {
				const superModuleScreenshotListen = uni.requireNativePlugin(
					"Super-Module-ScreenshotListen"
				);
				if (superModuleScreenshotListen) {
					superModuleScreenshotListen.onStartListenScreenshot((result) => {
						let routes = getCurrentPages();
						let curRoute = routes[routes.length - 1].route;
						let curParam = routes[routes.length - 1].options;
						let userInfo = uni.getStorageSync("imUserInfo");
						// 截图信息上报
						uni.report("用户截图", {
							...(userInfo ? userInfo : {}),
							routePath: curRoute,
							params: curParam,
						});
					});
				}
			},
			//取消截屏监听
			stopListenScreenshot() {
				const superModuleScreenshotListen = uni.requireNativePlugin(
					"Super-Module-ScreenshotListen"
				);
				if (superModuleScreenshotListen) {
					superModuleScreenshotListen.onStopListenScreenshot((result) => {});
				}
			},
			//口令方法
			getCliData() {
				uni.getClipboardData({
					success: (res) => {
						let text = res.data;
						//遍历规则路由
						for (let item of wordMatch) {
							let strim = text.replace(/\s*/g, "");
							let reg = RegExp(item.start + "(\\S*)" + item.end);
							let regText = strim.match(reg);
							if (regText) {
								const code = regText[1];
								const decode = decryptMethod(code);
								const paramsnum = decode ? decode.split("@") : [];
								let paramstext = "";
								for (let index in item.params) {
									paramstext =
										paramstext +
										`${index > 0 ? "&" : "?"}${item.params[index]}=${paramsnum[index]}`;
								}
								uni.setStorageSync("wordPageUrl", `${item.path}${paramstext}`);
								uni.setClipboardData({
									data: "",
									showToast: false,
								});
								uni.navigateTo({
									url: `/pages/wordPage/wordPage`,
								});
								return;
							}
						}
					},
					fail(error) {
						console.log(error);
					},
					complete(data) {
						console.log(data);
					},
				});
			},
		},
		onLaunch: async function(e) {
			// https://uniapp.dcloud.io/api/system/network.html 这文档写了跟没写一样
			// #ifdef APP
			if (!uni.getStorageSync('APP-UUID')) {
				const uuid = uni.$u.guid(20)
				uni.setStorageSync('APP-UUID', uuid)
				const deviceInfo = uni.getDeviceInfo();
				this.$store.commit('SET_UUID', uuid)
				this.$http.post('admin/user/device/refresh', {
					"clientId": 'app',
					"deviceId": uuid,
					"deviceName": deviceInfo.deviceModel,
					"remark": ""
				}).then(data => {

				})
			} else {
				this.$store.commit('SET_UUID', uni.getStorageSync('APP-UUID'))
			}
			// #endif
			// 路由重复拦截
			uni.addInterceptor("navigateTo", {
				invoke(args) {
					return new Promise((resolve, reject) => {
						setTimeout(() => {
							// request 触发前拼接 url
							let pages = getCurrentPages();
							if (!pages[pages.length - 1]) {
								resolve(args);
								return;
							}
							if (args.url) {
								let url = pages[pages.length - 1].route;
								let argsUrl = args.url.split("?")[0];
								let pageUrl = "/" + url;
								if (pageUrl == argsUrl) {
									reject(args);
								}
								resolve(args);
							} else {
								resolve(args);
							}
						}, 100);
					});
				},
				success(args) {},
			});
			// 中间按钮
			uni.onTabBarMidButtonTap(() => {
				this.$httpApi
					.getPersonSettingInfo()
					.then((res) => {
						if (res) {
							uni.navigateTo({
								url: "/pages/demandMarket/releaseDemand",
							});
						} else {}
					})
					.catch((data) => {
						// #ifdef APP-PLUS
						uni.navigateTo({
							url: "/pages/univerifyLogin/univerifyLogin",
						});
						// #endif
						// #ifdef H5
						this.$util.toast("请先登录");
						// #endif
					});
			});
			// #ifndef H5
			plus.screen.lockOrientation("portrait-primary");
			// #endif
			// #ifdef APP-PLUS
			// 一键登录预登录，可以显著提高登录速度
			const univerifyManager = uni.getUniverifyManager();
			// 预登录 只是为了提高一键登录的效率
			univerifyManager.preLogin();
			// 消息推送的业务逻辑
			uni.subscribePush({
				provider: "unipush",
				success: (res) => {
					plus.push.addEventListener("click", (msg) => {
						// console.log('click', msg);
						// 监听消息点击事件
						let payload;
						// iOS 环境下
						if (uni.getSystemInfoSync().platform == "ios") {
							if (msg.type == "click") {
								// APP离线点击包含click属性，这时payload是JSON对象
								payload = msg.payload;
							} else {
								// APP在线，收到消息不会包含type属性,这时的payload是JSON字符串，需要转为JSON对象
								payload = JSON.parse(msg.payload);
							}
							if (payload != null || payload != undefined) {
								// 此处是预防两次响应推送后的执行事件，此处很玄乎
								// onLaunch 生命周期里，页面跳转有问题,跳不过去
								// 应该是页面还没加载，加上定时后，就可以了；
								setTimeout(async () => {
									// 做相应的跳转
									// 具体逻辑业务的处理 跳转等
									// im聊天
									// 跳转单聊
									if (
										payload.TargetId &&
										payload.Type == xsoftmsdk.enums.SessionType
										.Normal
									) {
										let {
											TargetId,
											TargetName
										} = payload;
										this.$store.commit("WEBSOCKET_NORMAL", {
											TargetId,
										});
										this.toPage(
											"/pages/message/chat/index?toUserId=" +
											TargetId +
											"&toUserName=" +
											TargetName
										);
										return;
									}
									// 跳转群聊
									if (
										payload.TargetId &&
										payload.Type == xsoftmsdk.enums.SessionType
										.Group
									) {
										let {
											TargetId,
											TargetName
										} = payload;
										this.$store.commit("WEBSOCKET_GROUP", {
											TargetId,
										});
										this.toPage(
											"/pages/message/group/index?toUserId=" +
											TargetId +
											"&toUserName=" +
											TargetName
										);
										return;
									}
									// 跳转app页面
									if (payload.url) {
										this.toPage(payload.url + "&projectId=" +
											payload.projectId);
										return;
									}
									// 离线跳转单聊
									if (payload.targetId && payload.messageType == 0) {
										let TargetId = payload.targetId;
										let TargetName = payload.title;
										this.$store.commit("WEBSOCKET_NORMAL", {
											TargetId,
										});
										this.toPage(
											"/pages/message/chat/index?toUserId=" +
											TargetId +
											"&toUserName=" +
											TargetName
										);
										return;
									}
									// 离线跳转群聊
									if (payload.targetId && payload.messageType == 1) {
										let TargetId = payload.targetId;
										let TargetName = payload.title;
										this.$store.commit("WEBSOCKET_GROUP", {
											TargetId,
										});
										this.toPage(
											"/pages/message/group/index?toUserId=" +
											TargetId +
											"&toUserName=" +
											TargetName
										);
										return;
									}
								}, 100);
							}
						} else {
							// Android
							payload = msg.payload;
							if (payload != null || payload != undefined) {
								// 此处是预防两次响应推送后的执行事件，此处很玄乎
								// onLaunch 生命周期里，页面跳转有问题,跳不过去
								// 应该是页面还没加载，加上定时后，就可以了；
								setTimeout(() => {
									// 做相应的跳转
									// 具体的业务逻辑消息
								}, 100);
							}
						}
					});
					// 收到透传消息
					// 只有APP在线时，才会触发receive事件，透传消息不会触发系统消息,需要创建本地消息
					plus.push.addEventListener("receive", (msg) => {
						// 业务代码
						// IOS
						// console.log(msg)
						if (msg.payload) {
							if (msg.payload.contentType == 1 && msg.payload.messageType == 2) {
								if (msg.payload.navUrl) {
									const navUrl = JSON.parse(msg.payload.navUrl);
									if (navUrl.voiceUrl) {
										Voice(navUrl.voiceUrl);
									}
									// let url = getQueryString(msg.payload.navUrl, 'voiceUrl')
								}
							}
						}
						if (uni.getSystemInfoSync().platform == "ios") {
							//【APP离线】收到消息，但没有提醒（发生在一次收到多个离线消息时，只有一个有提醒，但其他的没有提醒）
							//【APP在线】收到消息，不会触发系统消息,需要创建本地消息，但不能重复创建。必须加msg.type验证去除死循环
							if (msg.type == "receive") {
								console.log("创建本地消息");
								// 创建本地消息,发送的本地消息也会被receive方法接收到，但没有type属性，且aps是null
								const messageContent = msg.payload ? msg.payload.content : "";
								plus.push.createMessage(
									messageContent || "新消息点击查看",
									msg.payload || {}, {
										cover: false,
										sound: "system",
										title: msg.title,
									}
								);
							}
						} else {
							// Android
							var payload = msg.payload;
							var messageTitle = payload.title;
							var messageContent = payload.content;
							plus.push.createMessage(messageContent, JSON.stringify(payload), {
								title: messageTitle,
							});
						}
					});
				},
			});
			// #endif
			// #ifdef H5
			if (uni.getStorageSync("uabToken")) {
				this.$store.state.uabModule = uni.getStorageSync("uabToken");
				return;
			} else {
				AWSC.use("uab", (state, uab) => {
					if (state === "loaded") {
						uni.setStorageSync("uabToken", uab.getUA());
						this.$store.state.uabModule = uab.getUA();
					}
				});
			}
			// 设备指纹模块，得到设备token，只需初始化一次
			if (uni.getStorageSync("webUmidToken")) {
				this.$store.state.webUmidToken = uni.getStorageSync("webUmidToken");
				return;
			} else {
				AWSC.use("um", (state, um) => {
					if (state === "loaded") {
						um.init({
								appName: "saf-aliyun-com",
							},
							(initState, result) => {
								if (initState === "success") {
									let webUmidToken = result.tn;

									uni.setStorageSync("webUmidToken", webUmidToken);
									this.$store.state.webUmidToken = webUmidToken;
								}
							}
						);
					}
				});
			}
			// #endif
			// 安全信息验证 (由于是插件的模式) 涉及到原生 uniapp就开始扯淡了。
			// #ifdef APP-PLUS
			let appKey;
			if (!uni.getStorageSync("deviceToken")) {
				if (uni.getSystemInfoSync().platform == "ios") {
					appKey = "31fafece26e0f6485fdeeb8fc4689221";
					const AliyunDeviceModule = uni.requireNativePlugin("AliyunDevicePugin");
					if (AliyunDeviceModule) {
						AliyunDeviceModule.initDeviceSDK(appKey, function(data) {
							AliyunDeviceModule.getDeviceToken((res) => {
								if (uni.getStorageSync("deviceToken")) {
									return;
								}
								uni.setStorageSync("deviceToken", res.deviceToken);
							});
						});
					}
				} else {
					appKey = "7c7eb6f1418c05fa40ce4e693749ed1f";
					const AliyunDeviceModule =
						uni.requireNativePlugin("AliyunDeviceModule");
					if (AliyunDeviceModule) {
						AliyunDeviceModule.initAliyunDeviceSDK({
								ALIYUN_APPKEY: appKey,
							},
							function(data) {
								AliyunDeviceModule.getDeviceToken((res) => {
									console.log(res);
									if (uni.getStorageSync("deviceToken")) {
										return;
									}
									uni.setStorageSync("deviceToken", res.deviceToken);
								});
							}
						);
					}
				}
			}
			// #endif
		},
		onShow: async function(e) {
			//口令
			//ios和安卓分开
			// #ifdef APP-PLUS
			if (uni.getSystemInfoSync().platform == "ios" && MihuoPaster) {
				MihuoPaster.init();
				// 口令的原生api是异步方法。
				setTimeout(() => {
					let isMihuoWord = MihuoPaster.isMihuoWord();
					if (isMihuoWord) {
						this.getCliData();
					}
				}, 800);

			} else {
				//这里主要针对华为的审核
				if (plus.runtime.isAgreePrivacy()) {
					this.getCliData();
				}
			}
			// #endif
			//this.getCliData();
			//看这里匹配到什么字母
			// #ifndef H5
			uni.onNetworkStatusChange(this.networkStatusChangeCallback);
			// #endif
			// #ifdef APP
			const imUserInfo = uni.getStorageSync("imUserInfo");
			await tabInit.fileTableInit();
			await tabInit.init();
			tabInit.closeTableSQL();
			if (imUserInfo) {
				this.$store.commit("WEBSOCKET_INIT", imUserInfo);
			}
			this.ListenScreenshot();
			this.getVersion();
			// #endif
			// 角标设置
			this.setTabBarBadge();
		},
		onHide: function() {
			uni.showTabBar();
			uni.offNetworkStatusChange(this.networkStatusChangeCallback);
			this.stopListenScreenshot();

			// 进入后台运行时清除保存缓存的定时器
			if (uni.getStorageSync("eliminateTiming")) {
				clearInterval(uni.getStorageSync("eliminateTiming"));
			}
			// 清除电脑快传的定时器
			if (uni.getStorageSync("fileTiming")) {
				clearInterval(uni.getStorageSync("fileTiming"));
			}
		},
	};
</script>

<style lang="scss">
	/* #ifndef APP-NVUE */
	@import "colorui/main.css";
	@import "colorui/icon.css";
	@import url("@/style/base.css");
	@import "uview-ui/index.scss";
	@import "./style/common.scss";
	@import "./style/input.scss";
	@import "./style/table.scss";
	@import "./style/mixin.scss";

	page {
		background-color: #f5f5f5;
	}

	/* #endif */

	/* #ifdef H5 */
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

	.public-node-disable {
		opacity: 0.5;
	}

	/* #endif */

	.display-center {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.display-align_center {
		display: flex;
		align-items: center;
	}
	
	.display-flex_direction {
		display: flex;
		flex-direction:column;
	}
	.display-justify_center {
		display: flex;
		justify-content: center;
	}
	
	.display-justify_between {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	
</style>
