<template>
	<view class="register_page">
		<z-nav-bar @backClick="backClick" backState="3000"></z-nav-bar>
		<view class="welcome_title">
			<text>您好，</text>
			<view>
				<text>欢迎使用觅活工匠</text>
			</view>
		</view>
		<view class="input_box">
			<input type="number" v-model="phone" placeholder="请输入手机号码" @input="onChangePhone" maxlength="11" />
			<!-- 下面这个input是修复ios输入时闪烁的问题 不要删除 -->
			<input class="clear-input">
		</view>
		<view class="input_box" v-if="type == 1">
			<input type="number" v-model="code" placeholder="请输入短信验证码" maxlength="6" @confirm="onSubmit" />
			<button class="active" @click="onSetCode">{{ codeText }}</button>
		</view>
		<view v-if="type == 2" class="password_input">
			<view class="input_box"><input type="text" v-model="password" password placeholder="请输入密码"
					@confirm="onSubmit" /></view>
			<text class="forget_password" @click="onPageJump('/pages/user/forgetPassword')">忘记密码？</text>
		</view>
		<view class="privacy">
			<u-checkbox-group style="transform: scale(0.8); margin-left: -35rpx">
				<u-checkbox shape="circle" active-color="$themeColor" v-model="checked">
					我已阅读并同意<text class="textcolor" @click.stop="toPage('/pages/privacy/privacy')">《隐私政策》</text>和<text
						class="textcolor" @click.stop="toPage('/pages/serviceAgreement/serviceAgreement')">《用户协议》</text>
				</u-checkbox>
			</u-checkbox-group>
		</view>
		<mh-primary-button class="login_button" :loading="loading" title="登录" :onclick="onSubmit"
			:btnStyle="btnStyle" />
		<view class="nav_box" v-if="type == 2">
			<text>快速下单找工匠，</text>
			<text class="color" @click="onPageJump('/pages/user/register')">免费注册</text>
		</view>
		<view class="message_login" @click="() => setType()">
			<text>{{ type == 2 ? "验证码登录" : "密码登录" }}</text>
		</view>
		<!-- #ifdef APP-PLUS -->
		<view class="station" v-if="!isIos"></view>
		<view class="third_party_login_box">
			<view class="third_party_title"><text>其他登录方式</text></view>
			<view class="thirdLogin">
				<view class="third_party_content">
					<image src="/static/phone-login.png" @click="univerifyLogin" mode="aspectFit"></image>
				</view>
				<view class="third_party_content" v-if="system >= 13 && isIos">
					<image src="/static/iphone.png" @click="handleAppleLogin" mode="aspectFit"></image>
				</view>
				<view v-if="isInstallWX" class="third_party_content">
					<image src="/static/wechat.png" @click="handleWeixinLoginApp" mode="aspectFit"></image>
				</view>
			</view>
		</view>
		<!-- #endif -->
		<!-- 首次第三方登录时要求用户绑定手机号的弹窗 -->
		<u-popup v-model="isShowPopup" mode="bottom" border-radius="20" :mask-close-able="false">
			<view class="bind-phone">
				<view class="bind-phone-title">
					应国家法律法规要求, 您的账号需要绑定您的手机号码。
				</view>
				<view class="input_box"><input type="digit" v-model="bindingPhone" maxlength="11"
						placeholder="请输入您的手机号码" />
				</view>
				<view class="input_box">
					<input type="number" v-model="code" placeholder="请输入短信验证码" maxlength="6" @confirm="onSubmit" />
					<button class="active" @click="useVerify">{{ codeText }}</button>
				</view>
				<mh-primary-button class="bind-phone-btn login_button" :loading="loading" title="绑定并登录"
					:onclick="onSubmit" :btnStyle="btnStyle" />
			</view>
		</u-popup>
		<Verify @success="success" :mode="'pop'" :captchaType="'blockPuzzle'"
			:imgSize="{ width: '330px', height: '155px' }" ref="verify"></Verify>
	</view>
</template>
<script>
	import Verify from "@/components/verify/verify.vue";
	import {
		encryption
	} from "@/plugins/utils.js";
	import {
		univerifyStyle
	} from "@/static/js/univerifyStyle.js";
	const xsoftmsdk = require("@/plugins/im/xsoftimsdk.js");
	let clear;
	import {
		mapState,
		mapMutations
	} from "vuex";
	export default {
		components: {
			Verify
		},
		data() {
			const deviceInfo = uni.getStorageSync("deviceInfo");
			return {
				isShowPopup: false,
				isLogin: false,
				checked: false, // 是否同意协议
				loading: false,
				type: 2,
				system: 0, // 系统版本
				code: "",
				isInstallWX: false,
				bindingPhone: '',
				phone: deviceInfo.username || '',
				password: deviceInfo.password || '',
				codeText: "获取验证码", // 验证码
				readonly: false, // 验证码已发
				isIos: true,
				btnStyle: {
					"font-size": "14px",
					"font-weight": 700,
					height: "80rpx",
				},
				mCode: "", // 微信登录未绑定时进行绑定的mcode
				isBinding: false,
			};
		},
		onInit() {
			//this.univerifyLogin();
		},
		//第一次加载
		onLoad(e) {
			// #ifdef APP-PLUS
			this.isIos = plus.os.name == "iOS";
			uni.getSystemInfo({
				success: (res) => {
					//这里的接口已经被修改了 可能默认都是13以上 但是并不是
					if (res.system) {
						this.system = res.system.split(' ')[1].substr(0, 2) || 0
					}
				},
				fail: (err) => {},
				complete: () => {}
			})
			// 唤起一键登录
			// this.univerifyLogin();
			// #endif
			// #ifdef APP-PLUS
			if (plus.runtime.isApplicationExist({
					pname: 'com.tencent.mm',
					action: 'weixin://'
				})) {
				// 安装了微信
				this.isInstallWX = true;
			} else {
				// 未安装微信
				this.isInstallWX = false;
			}
			// #endif
		},
		//页面显示
		onShow() {
			const deviceInfo = uni.getStorageSync("deviceInfo");
			this.phone = this.phone || deviceInfo.username || ''
			this.password = deviceInfo.password || process.env.NODE_ENV == 'development' ? '123456' : ''
		},
		//方法
		methods: {
			...mapMutations(["setUserInfo", "setUserData", "dispatchLoginCallback"]),
			// 登录成功以后的回调
			success(params) {
				console.log(params)
				this.$refs.verify.closeBox()
				this.onSetCode({
					code: params.captchaVerification
				})
				// params 返回的二次验证参数, 和登录参数一起回传给登录接口，方便后台进行二次验证
			},
			useVerify() {
				let phone
				if (this.isBinding) {
					// 绑定手机号
					phone = this.bindingPhone
				} else {
					// 登录/注册手机号
					phone = this.phone
				}
				if (!this.$base.phoneRegular.test(phone)) {
					uni.showToast({
						title: "手机号码格式不正确",
						icon: "none",
					});
					return;
				}
				this.$refs.verify.show()
			},
			loginSuccess() {
				this.isShowPopup = false
				let phone
				if (this.isBinding) {
					// 绑定手机号
					phone = this.bindingPhone
				} else {
					// 登录/注册手机号
					phone = this.phone
				}
				this.$httpApi.getPersonInfo().then(async (data) => {
					this.setUserData(data); //储存用户个人信息
					this.setTabBarBadge()
					this.loading = false;
					// #ifdef H5
					this.toTab("/pages/home/home");
					// #endif
					// #ifdef APP-PLUS
					setTimeout(async () => {
						const info = plus.push.getClientInfo();
						//console.log(info)
						if (info && info.clientid) {
							await this.$httpApi.registerClientId({
								cid: info.clientid,
							}).then(async (device) => {
								uni.setStorageSync("deviceInfo", {
									...info,
									...{
										username: phone,
										password: this.password,
									},
								});
							});
						}
					}, 500)
					const deviceInfo = uni.getStorageSync("deviceInfo");
					// 为了im挂了不影响这边的业务 这里就加延时来初始化
					this.$httpApi.imToken().then(async (imRes) => {
						await this.$store.commit("WEBSOCKET_INIT", imRes);
					});
					// #endif
					this.$httpApi.getPersonSettingInfo().then(userInfo => {
						if (userInfo) {
							uni.setStorageSync('userSetting', userInfo);
							let url = uni.getStorageSync("navigatePage");
							if (url) {
								if (url === "callback") {
									this.goBack();
									this.$store.commit("dispatchLoginCallback");
								} else {
									this.toPage(url);
								}
								uni.removeStorageSync("navigatePage");
							} else {
								let pages = getCurrentPages(); // 当前页面路由
								let beforePage = pages[pages.length - 3]; // 上一个页面路由
								let curRoute = pages[pages.length - 1].route; //获取当前页面路由
								if (beforePage && beforePage.route == 'pages/mine/personalCenter') {
									this.toTab(`/${beforePage.route}`)
									return;
								}
								this.toTab("/pages/home/home");
								// this.goBack();
							}
						}
					}).catch(e => {
						this.$util.toast('您的账号状态异常~')
						console.log(e)
					});
				});
			},
			viewProtocol(type) {
				uni.navigateTo({
					url: `../protocolWebView/protocolWebView?type=${type}`
				})
			},
			onChangePhone(input) {
				this.password = ''
			},
			// 运营商一键登录
			univerifyLogin() {
				const univerifyManager = uni.getUniverifyManager();
				univerifyManager.login({
					univerifyStyle: univerifyStyle,
					success: (res) => {
						// 先删除旧的auth info
						uni.removeStorageSync("userInfo");
						this.$httpApi.login({
							access_token: res.authResult.access_token,
							openid: res.authResult.openid,
							grant_type: "univerify",
						}).then((response) => {
							if (response) {
								this.setUserInfo(response); // 储存用户auth信息
								this.isLogin = true;
								this.loginSuccess();
								univerifyManager.close();
							} else {
								this.isLogin = false;
							}
						});
					},
					fail: (res) => {
						// 关闭授权页面
						univerifyManager.close();
					},
				});
				const callback = (res) => {
					// 获取一键登录弹框协议勾选状态
					univerifyManager.getCheckBoxState({
						success(res) {
							console.log("getCheckBoxState res: ", res);
							if (res.state) {
								//关闭一键登录弹框
								univerifyManager.close();
							}
						},
					});
				};
				univerifyManager.onButtonsClick(callback);
			},
			// 设置未读消息角标
			setTabBarBadge() {
				this.$http.get('basic/basicmessage/list', {}, {
					header: {
						isShowMessage: false
					}
				}).then((res) => {
					if (res) {
						let notice = 0
						res.map((item) => {
							notice += item.unreadMessage || 0
						})
						if (notice > 0) {
							if (notice > 99) {
								getApp().globalData.systemNotice = 99
								notice = '99+'
							} else {
								getApp().globalData.systemNotice = +notice
								notice = notice.toString()
							}
							if (!notice || notice === NaN) {
								notice = '0'
							}
							uni.setTabBarBadge({
								index: 2,
								text: notice
							})
						} else {
							getApp().globalData.systemNotice = 0
						}
					}
				})
			},
			backClick() {
				const pages = getCurrentPages();
				if (pages.length > 1) {
					// if (!this.$store.state.userInfo.active) {
					// 	this.$util.toast("暂未登录~");
					// 	return;
					// }
					uni.reLaunch({
						url: "/pages/home/home",
					});
				} else {
					uni.reLaunch({
						url: "/pages/home/home",
					});
				}
			},
			setType() {
				this.type = this.type == 1 ? 2 : 1;
			},
			onPageJump(url) {
				uni.navigateTo({
					url: url,
				});
			},
			// 验证码按钮文字状态
			getCodeState() {
				clear && clearInterval(clear);
				const _this = this;
				this.readonly = true;
				this.codeText = "60s";
				var s = 60;
				clear = setInterval(() => {
					s--;
					_this.codeText = s + "s";
					if (s <= 0) {
						clearInterval(clear);
						_this.codeText = "获取验证码";
						_this.readonly = false;
					}
				}, 1000);
			},
			// 发送验证码
			onSetCode(header = {}) {
				let phone
				if (this.isBinding) {
					// 绑定手机号
					phone = this.bindingPhone
				} else {
					// 登录/注册手机号
					phone = this.phone
				}
				if (!this.$base.phoneRegular.test(phone)) {
					uni.showToast({
						title: "手机号码格式不正确",
						icon: "none",
					});
					return;
				}
				if (this.readonly) {
					this.$util.toast("验证码已发送，稍后再试");
					return;
				}
				this.$httpApi.getMSGCode(phone, 'SMSLOGIN', true, header).then((res) => {
					this.getCodeState();
				}).catch(e => {
					this.$util.toast(e.errMsg);
				});
			},
			async onSubmit() {
				uni.removeStorageSync("userInfo");
				let phone
				if (this.isBinding) {
					// 绑定手机号
					phone = this.bindingPhone
				} else {
					// 登录/注册手机号
					phone = this.phone
				}
				if (!phone) {
					uni.showToast({
						title: "请输入手机号码",
						icon: "none",
					});
					return;
				}
				if (!this.$base.phoneRegular.test(phone)) {
					uni.showToast({
						title: "手机号码格式不正确",
						icon: "none",
					});
					return;
				}
				if (!this.checked) {
					uni.showToast({
						title: "请同意隐私政策和用户协议",
						icon: "none",
					});
					return;
				}
				let dataObj;
				if (this.type === 1) {
					// 验证码登录
					if (!this.code) {
						uni.showToast({
							title: "请输入验证码",
							icon: "none",
						});
						return;
					}
					if (this.mCode) {
						dataObj = {
							mobile: phone,
							code: this.code,
							grant_type: "sms_code",
							mCode: this.mCode,
						};
					} else {
						dataObj = {
							mobile: phone,
							code: this.code,
							grant_type: "sms_code",
						};
					}
				} else {
					// 密码登录
					if (!this.password) {
						uni.showToast({
							title: "请输入密码",
							icon: "none",
						});
						return;
					}
					const user = encryption({
						data: {
							username: phone,
							password: this.password,
							code: this.code,
						},
						type: "password",
						key: "pigxpigxpigxpigx",
						param: ["password"],
					});
					dataObj = {
						username: user.username,
						password: user.password,
						grant_type: "password",
					};
				}
				this.loading = true;
				// console.log(dataObj);
				this.$httpApi.login(dataObj).then((res) => {
					if (!res) {
						this.isLogin = false;
						this.loading = false;
						return;
					}
					this.setUserInfo(res); // 储存用户auth信息
					this.isLogin = true;
					this.loginSuccess();
				}).catch(() => {
					this.loading = false;
					this.$util.toast(error.errMsg || "登录出现错误");
				});
			},
			// 苹果登录
			handleAppleLogin() {
				if (!this.checked) {
					uni.showToast({
						title: "请同意隐私政策和用户协议",
						icon: "none",
					});
					return;
				}
				uni.getProvider({
					service: "oauth",
					success: (res) => {
						uni.login({
							provider: "apple",
							success: (loginRes) => {
								// 获取token
								let obj = {
									mobile: `APPLE@${loginRes.authResult.access_token}`,
									code: loginRes.authResult.openid,
									grant_type: "mobile",
								};
								this.$httpApi.login(obj).then((res) => {
									this.setUserInfo(res); // 储存用户auth信息
									this.loginSuccess();
								}).catch((e) => {
									if (e.mData.mCode) {
										this.$util.toast("请先绑定手机号码~");
										// 打开绑定手机号的弹窗
										this.isShowPopup = true
										this.type = 1;
										this.mCode = e.mData.mCode;
										this.isBinding = true
									}
								});
								uni.getUserInfo({
									provider: "apple",
									success(res) {
										// 获取用户信息成功
										// console.log(res);
									},
								});
							},
							fail: (err) => {
								// 登录失败
								this.$util.toast("调用Apple服务失败, 请稍后再试~");
								console.log(err);
							},
						});
					},
				});
			},
			// 微信登录
			handleWeixinLoginApp() {
				if (!this.checked) {
					uni.showToast({
						title: "请同意隐私政策和用户协议",
						icon: "none",
					});
					return;
				}
				uni.getProvider({
					service: "oauth",
					success: (res) => {
						//支持微信、qq和微博等
						if (~res.provider.indexOf("weixin")) {
							uni.login({
								provider: "weixin",
								onlyAuthorize: true,
								success: (loginRes) => {
									this.getAppLoginData(loginRes); // 微信登录请求登录接口方法
								},
								fail: (err) => {
									if (err.code == -1002) {
										this.$util.toast("您没有微信客户端, 不能使用微信登录~");
										return;
									}
									this.$util.toast(err.errMsg);
								},
							});
						}
					},
				});
			},
			// 请求登录接口方法
			getAppLoginData(data) {
				// 这边是前端自己去调微信用户信息的接口，根据接口需要请求，如果不需要前端去获取的话就交给后端，可省去次操作
				let obj = {
					grant_type: "mobile",
					code: data.code,
					mobile: `WX@${data.code}`,
				};
				uni.removeStorageSync("userInfo");
				this.$httpApi.login(obj).then((res) => {
					this.setUserInfo(res); // 储存用户auth信息
					this.loginSuccess();
					console.log(res);
				}).catch((e) => {
					// 如果没有绑定过手机号则需要先引导用户绑定
					console.log(e);
					if (e.mData.mCode) {
						this.$util.toast("请先绑定手机号码~");
						// 打开绑定手机号的弹窗
						this.isShowPopup = true
						this.type = 1;
						this.mCode = e.mData.mCode;
						this.isBinding = true
					}
				});
			},
		},
		//页面隐藏
		onHide() {},
		//页面卸载
		onUnload() {},
		//页面下来刷新
		onPullDownRefresh() {},
		//页面上拉触底
		onReachBottom() {},
		//用户点击分享
		onShareAppMessage(e) {
			return this.wxShare();
		},
	};
</script>
<style lang="scss" scoped>
	@import "@/style/mixin.scss";

	.register_page {
		padding: calc(var(--status-bar-height) + 80rpx) 100rpx 50rpx 100rpx;
		background-color: #fff;
		min-height: 100vh;
		position: relative;

		.login_button {
			line-height: 120rpx;
			height: 100rpx;
		}

		.message_login {
			width: max-content;
			margin: 5vh auto 5vh auto;

			text {
				line-height: 34rpx;
				color: $fontColor66;
				font-size: $smallFontSize;
			}
		}

		.bg_pic {
			position: absolute;
			right: 0rpx;
			bottom: 0rpx;

			image {
				width: 520rpx;
				height: 466rpx;
			}
		}

		.welcome_title {
			margin-bottom: 50rpx;
			align-items: center;
			font-weight: 600;

			text {
				font-size: 36rpx;
				color: $fontColor33;
			}
		}

		.password_input {
			position: relative;

			.forget_password {
				position: absolute;
				right: 0;
				top: 40rpx;
				font-size: 24rpx;
				color: $fontColor66;
			}
		}

		.privacy {
			font-size: 10rpx;
			margin: 24rpx 0 30rpx 0;
			color: $fontColor99;
			text-align: left;

			.textcolor {
				color: $themeColor;
			}
		}

		.agreement {
			font-size: 24rpx;
			color: #999999;
			text-align: center;

			>text {
				color: $themeColor;
			}
		}

		.password_register {
			margin-top: 110rpx;
			text-align: center;

			text {
				font-size: 24rpx;
				color: $fontColor33;
				text-decoration: underline;
			}
		}

		.nav_box {
			margin-top: 62rpx;
			text-align: center;

			>text {
				font-size: 24rpx;
				color: $fontColor99;

				&.color {
					color: $themeColor;
				}
			}
		}
	}

	.station {
		height: 230rpx;
	}

	.third_party_login_box {
		bottom: 40rpx;
		width: 100%;
		left: 0;
		height: 230rpx;
		padding: 0 50rpx;

		.third_party_title {
			display: flex;
			align-items: center;

			&:before,
			&:after {
				content: "";
				flex: 1;
				height: 2rpx;
				background-color: #f5f5f5;
			}

			text {
				font-size: 24rpx;
				color: #999999;
				flex-shrink: 0;
				padding: 0 20rpx;
			}
		}

		.thirdLogin {
			display: flex;
			justify-content: center;

			.third_party_content {
				height: 150rpx;
				flex: 1;
				margin: 20rpx 0;
				text-align: center;

				image {
					width: 32px;
					margin: auto;
					height: 32px;
				}
			}
		}
	}

	.input_box {
		display: flex;
		align-items: center;
		border-bottom: 2rpx solid #e5e5e5;
		padding: 30rpx 0;
		margin-top: 20rpx;

		.clear-input {
			max-width: 0 !important;
			height: 0 !important;
			min-height: 0 !important;
			overflow: hidden !important;
		}

		input {
			flex: 1;
			font-size: 32rpx;
			color: $fontColor33;
			height: 60rpx;
		}

		button {
			height: 60rpx;
			background-color: #f7f7f7;
			font-size: 24rpx;
			border-radius: 8rpx;
			padding: 0 14rpx;
			color: $fontColor33;
			line-height: 60rpx;
			margin-left: 20rpx;

			&.active {
				@include theme("btn_bg");
				color: #fff;
			}
		}
	}

	.bind-phone {
		width: 100vw;
		height: 60vh;
		background-color: #FFFFFF;
		border-radius: 20rpx 20rpx 0 0;
		padding: 100rpx;

		.bind-phone-title {
			font-family: 'PingFang SC';
			font-style: normal;
			font-weight: 400;
			font-size: 32rpx;
			line-height: 44rpx;
			color: #333333;
		}

		.bind-phone-btn {
			margin-top: 200rpx;
		}
	}
</style>
