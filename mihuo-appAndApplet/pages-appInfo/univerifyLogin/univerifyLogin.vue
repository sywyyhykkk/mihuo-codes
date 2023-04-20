<template>

</template>
<script>
	import {
		encryption
	} from "@/plugins/utils.js";
	import {
		univerifyStyle
	} from "@/static/app-plus/univerifyStyle.js";
	let clear;
	import {
		mapState,
		mapMutations
	} from "vuex";
	export default {
		data() {
			const deviceInfo = uni.getStorageSync("deviceInfo");
			return {
				isLogin: false,
				checked: false, // 是否同意协议
				loading: false,
				type: 2,
				system: 0, // 系统版本
				code: "",
				isInstallWX: false,
				bindingPhone: '',
				phone: deviceInfo.username,
				password: deviceInfo.password,
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
		onInit() {},
		//第一次加载
		onLoad(e) {
			// #ifdef APP-PLUS
			this.isIos = plus.os.name == "iOS";
			// 唤起一键登录
			this.univerifyLogin();
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
			this.phone = deviceInfo.username
		},
		//方法
		methods: {
			...mapMutations(["setUserInfo", "setUserData", "dispatchLoginCallback"]),
			viewProtocol(type) {
				uni.navigateTo({
					url: `../protocolWebView/protocolWebView?type=${type}`
				})
			},
			onChangePhone(input) {
				this.password = ''
			},
			univerifyLogin() {
				const univerifyManager = uni.getUniverifyManager();
				univerifyManager.login({
					univerifyStyle: univerifyStyle,
					success: (res) => {
						// 先删除旧的auth info
						uni.removeStorageSync("userData");
						uni.removeStorageSync("userInfo");
						this.$httpApi.login({
							access_token: res.authResult.access_token,
							openid: res.authResult.openid,
							grant_type: "univerify",
						}).then((response) => {
							if (response) {
								this.setUserInfo(response); // 储存用户auth信息
								this.isLogin = true;
								this.loginSuccess(true);
								univerifyManager.close();
							} else {
								this.isLogin = false;
							}
						}).catch(e => console.log(e));
					},
					fail: (res) => {
						// 关闭授权页面 3005没有电话卡的错误 这里是异常
						if (!res) {
							univerifyManager.close();
							uni.redirectTo({
								url: '/pages-user/appLogin/appLogin'
							})
							return
						}
						if (res.code != "30003") {
							univerifyManager.close()
							uni.redirectTo({
								url: '/pages-user/appLogin/appLogin'
							})
							return
						}
						if (res.code == "30003") {
							//这是用户关闭的操作
							univerifyManager.close();
							const url = uni.getStorageSync('navigatePage')
							if (url) {
								const pages = getCurrentPages()
								if (pages.length > 1) {
									uni.navigateBack()
								} else {
									uni.reLaunch({
										url: '/pages/home/home'
									})
								}
								uni.removeStorageSync('navigatePage')
							} else {
								uni.reLaunch({
									url: '/pages/home/home'
								})
							}
						} else {
							univerifyManager.close()
							uni.navigateBack()
						}
					},
				});
				const callback = (res) => {
					// 获取一键登录弹框协议勾选状态
					univerifyManager.getCheckBoxState({
						success(res) {
							// console.log("getCheckBoxState res: ", res);
							if (res.state) {
								// 关闭一键登录弹框
								univerifyManager.close();
								uni.navigateBack()
							}
						},
					});
				};
				univerifyManager.onButtonsClick(callback);
			},
			// 登录成功以后的回调
			loginSuccess(status = false) {
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
					this.loading = false;
					// #ifdef H5
					this.toTab("/pages/home/home");
					// #endif
					// #ifdef APP-PLUS
					const deviceInfo = uni.getStorageSync("deviceInfo");
					//为了 im挂了不影响这边的业务 这里就加延时来初始化
					this.$httpApi.imToken().then(async (imRes) => {
						await this.$store.commit("DELETE_IMUSER");
						await this.$store.commit("WEBSOCKET_INIT", imRes);
					});
					setTimeout(async () => {
						const info = plus.push.getClientInfo();
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
					})
					// 这里还是加个延时验证
					if (uni.getStorageSync("deviceToken")) {
						this.$httpApi.mfaConf()
					} else {
						setTimeout(() => {
							this.$httpApi.mfaConf()
						}, 2000)
					}
					// #endif
					this.$httpApi.getPersonSettingInfo().then(userInfo => {
						if (userInfo) {
							uni.setStorageSync('userSetting', userInfo);
							let url = uni.getStorageSync("navigatePage");
							if (url) {
								if (url === "callback") {
									uni.navigateBack({
										delta: status ? 2 : 1
									})
									this.$store.commit("dispatchLoginCallback");
								} else {
									if (status) {
										uni.navigateBack({
											delta: 1
										})
										this.toPage(url);
									}
								}
								uni.removeStorageSync("navigatePage");
							} else {
								uni.navigateBack({
									delta: status ? 2 : 1
								})
							}
						}
					})
				});
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
			onSetCode() {
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
				this.$httpApi.getMSGCode(phone, 'SMSLOGIN').then((res) => {
					this.getCodeState();
				}).catch(e => {
					this.$util.toast(e.errMsg);
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
						this.$refs.bindPhonePopup.open()
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
	};
</script>
<style lang="scss" scoped>
	@import "@/style/mixin.scss";

	page {
		background: transparent;
	}

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

	.thirdLogin {
		display: flex;
		justify-content: center;
	}

	.third_party_login_box {
		bottom: 40rpx;
		width: 100%;
		left: 0;
		height: 230rpx;
		padding: 0 30rpx;

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

		.third_party_content {
			height: 150rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			margin: 0 20rpx;

			image {
				width: 32px;
				height: 32px;
			}
		}
	}


	.input_box {
		display: flex;
		align-items: center;
		border-bottom: 2rpx solid #e5e5e5;
		padding: 30rpx 0;
		margin-top: 20rpx;

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
