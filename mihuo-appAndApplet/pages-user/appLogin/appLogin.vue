<template>
	<view class="login-page">
		<z-nav-bar @backClick="backClick" backState="3000" />
		<view class="welcome-title">
			欢迎登录觅活
		</view>
		<view class="welcome-des">
			装修透明价 施工标准化
		</view>
		<view style="height: 30rpx;"></view>
		<view class="input_box">
			<view class="input-title">
				手机号
			</view>
			<input type="number" :placeholder-style="placeholderStyle" @input="onPhoneInput" v-model="phone"
				maxlength="11" placeholder="请输入您的手机号码" />
			<!-- 下面这个input是修复ios输入时闪烁的问题 不要删除 -->
			<input class="clear-input" />
		</view>
		<view class="input_box" v-if="type == 1">
			<view class="input-title">
				验证码
			</view>
			<input type="number" v-model="code" :placeholder-style="placeholderStyle" placeholder="请输入短信验证码"
				maxlength="6" @confirm="onSubmit" />
			<button class="active" @click="useVerify">{{ codeText }}</button>
		</view>
		<view class="input_box" v-if="type == 2">
			<view class="input-title">
				密码
			</view>
			<input type="text" v-model="password" :placeholder-style="placeholderStyle" password placeholder="请输入密码"
				@confirm="onSubmit" />
			<text class="forget-password" @click="onPageJump('/pages-user/forgetPassword')">忘记密码？</text>
		</view>
		<view class="change-type" @click="setType">
			<view class="text">
				{{ type === 2 ? '验证码登录' : '密码登录' }}
			</view>
			<view class="arrow-icon"></view>
		</view>
		<view class="login-btn" @click="onSubmit" :style="{ opacity: buttonDiasabled ? '0.3' : '1' }">
			登录
		</view>
		<view class="privacy">
			<u-checkbox shape="circle" size="24" active-color="#ff5d35" v-model="checked">
				<view class="privacy-content">
					<view class="privacy-title">
						我已阅读并同意
					</view>
					<text class="text-color" @click.stop="viewProtocol(2)">《隐私政策》</text>
					<view class="privacy-title">
						和
					</view>
					<text class="text-color" @click.stop="viewProtocol(1)">《用户协议》</text>
				</view>
			</u-checkbox>
		</view>
		<view class="register-text" @click="onPageJump('/pages-user/register')">
			新用户注册
		</view>
		<!-- #ifdef APP-PLUS -->
		<!-- <view class="station" v-if="!isIos"></view>
		<view class="third_party_login_box">
			<view class="third_party_title"><text>第三方登录</text></view>
			<view class="third-login">
				<view class="third_party_content">
				</view>
				<view class="third_party_content" v-if="isIos">
				</view>
			</view>
		</view> -->
		<!-- #endif -->
		<u-popup v-model="isShowPopup" mode="bottom" border-radius="20" :mask-close-able="false">
			<view class="bind-phone">
				<view class="bind-phone-title">
					应国家法律法规要求, 您的账号需要绑定您的手机号码。
				</view>
				<view class="input_box">
					<view class="input-title">
						手机号
					</view>
					<input :placeholder-style="placeholderStyle" type="number" v-model="bindingPhone" maxlength="11"
						placeholder="请输入您的手机号码" />
				</view>
				<view class="input_box">
					<view class="input-title">
						验证码
					</view>
					<input type="number" :placeholder-style="placeholderStyle" v-model="code" placeholder="请输入短信验证码"
						maxlength="6" @confirm="onSubmit" />
					<button class="active" @click="useVerify">{{ codeText }}</button>
				</view>
				<user-mh-primary-button class="bind-phone-btn login_button" :loading="loading" title="绑定并登录"
					:onclick="onSubmit" :btnStyle="btnStyle" />
			</view>
		</u-popup>
		<Verify @success="success" :mode="'pop'" :captchaType="'blockPuzzle'"
			:imgSize="{ width: '330px', height: '155px' }" ref="verify"></Verify>
	</view>
</template>
<script>
	import {
		univerifyStyle
	} from '@/static/app-plus/univerifyStyle.js'
	import md5 from '@/plugins/im/md5'
	import {
		encryption
	} from '@/plugins/utils.js'
	const xsoftmsdk = require('@/plugins/im/xsoftimsdk.js')
	let clear
	import {
		mapMutations
	} from 'vuex'
	import Verify from "../components/verify/verify.vue";
	export default {
		components: {
			Verify
		},
		data() {
			const deviceInfo = uni.getStorageSync('deviceInfo')
			return {
				placeholderStyle: `color: #A8A8A8;`,
				isShowPopup: false,
				checked: false,
				loading: false,
				type: 2, // 1=验证码登录 2=密码登录
				code: '', // 验证码
				phone: deviceInfo.username || '',
				bindingPhone: '',
				password: deviceInfo.password || '',
				//验证码
				codeText: '获取验证码',
				//验证码已发
				readonly: false,
				isIos: true,
				hasWechat: false,
				btnStyle: {
					'font-size': '14px',
					'font-weight': 700,
					height: '80rpx'
				},
				mCode: '', // 微信登录未绑定时进行绑定的mcode
				isBinding: false
			}
		},
		computed: {
			buttonDiasabled() {
				return !(this.phone && ((this.code && this.type == 1) || (this.password && this.type != 1)) && this
					.checked && this.password.length > 5)
			}
		},
		watch: {

		},
		onLoad(e) {
			// #ifdef APP-PLUS
			this.isIos = plus.os.name == 'iOS'
			if (
				plus.runtime.isApplicationExist({
					pname: 'com.tencent.mm',
					action: 'weixin://'
				})
			) {
				// 安装了微信
				this.hasWechat = true
			} else {
				// 未安装微信
				this.hasWechat = false
			}
			// #endif
		},
		onShow() {
			const deviceInfo = uni.getStorageSync('deviceInfo')
			this.phone = this.phone || deviceInfo.username || ''
			this.password = deviceInfo.password || ''
		},
		//方法
		methods: {
			...mapMutations(['setUserInfo', 'setUserData', 'dispatchLoginCallback']),
			success(params) {
				this.$refs.verify.closeBox()
				this.onSetCode({
					code: params.captchaVerification
				})
				// params 返回的二次验证参数, 和登录参数一起回传给登录接口，方便后台进行二次验证
			},
			useVerify() {
				if (this.readonly) {
					uni.showToast({
						title: '验证码已发送',
						icon: 'none'
					});
					return;
				}
				if (!this.phone) {
					uni.showToast({
						title: '请输入手机号',
						icon: 'none'
					});
					return;
				}
				if (!this.$base.phoneRegular.test(this.phone)) {
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none'
					});
					return;
				}
				this.$refs.verify.show()
			},
			// 运营商一键登录
			univerifyLogin() {
				const univerifyManager = uni.getUniverifyManager()
				univerifyManager.login({
					univerifyStyle: univerifyStyle,
					success: (res) => {
						// 先删除旧的auth info
						uni.removeStorageSync('userData')
						uni.removeStorageSync('userInfo')
						this.$httpApi
							.login({
								access_token: res.authResult.access_token,
								openid: res.authResult.openid,
								grant_type: 'univerify'
							})
							.then((response) => {
								if (response) {
									this.setUserInfo(response) // 储存用户auth信息
									this.isLogin = true
									this.loginSuccess()
									univerifyManager.close()
								} else {
									this.isLogin = false
								}
							})
					},
					fail: (res) => {
						// 关闭授权页面
						univerifyManager.close()
					}
				})
				const callback = (res) => {
					// 获取一键登录弹框协议勾选状态
					univerifyManager.getCheckBoxState({
						success(res) {
							console.log('getCheckBoxState res: ', res)
							if (res.state) {
								//关闭一键登录弹框
								univerifyManager.close()
							}
						}
					})
				}
				univerifyManager.onButtonsClick(callback)
			},
			onPhoneInput() {
				this.password = ''
			},
			viewProtocol(type) {
				uni.navigateTo({
					url: `/pages-common/protocolWebView/protocolWebView?type=${type}`
				})
			},
			// 登录成功以后的回调
			loginSuccess() {
				this.isShowPopup = false
				this.$httpApi.getPersonInfo().then(async (data) => {
					if (!data) return
					this.setUserData(data); // 储存用户个人信息
					this.$httpApi
						.getPersonSettingInfo()
						.then((userSetting) => {
							uni.setStorageSync('userSetting', userSetting)
						})
						.catch((e) => console.log(e));
					this.loading = false;
					// #ifdef APP-PLUS
					const deviceInfo = uni.getStorageSync('deviceInfo')
					setTimeout(async () => {
						const info = plus.push.getClientInfo()
						if (info && info.clientid) {
							await this.$httpApi
								.registerClientId({
									cid: info.clientid
								})
								.then(async (device) => {
									uni.setStorageSync('deviceInfo', {
										...info,
										...{
											username: this.isBinding ? this
												.bindingPhone : this.phone,
											password: this.password
										}
									})
								})
						}
					}, 500)
					this.$httpApi.imToken().then(async (imRes) => {
						await this.$store.commit("DELETE_IMUSER");
						await this.$store.commit('WEBSOCKET_INIT', imRes)
					})
					this.$store.commit("UPDATE_NOTICE")
					// #endif
					let url = uni.getStorageSync('navigatePage')
					if (url) {
						uni.removeStorageSync('navigatePage')
						if (url === 'callback') {
							// 执行操作
							uni.navigateBack({
								delta: 1
							})
						} else {
							// 跳转页面
							const tabPage = url.split('/')[1]
							if (tabPage === 'pages') {
								this.toTab(url)
							} else {
								uni.redirectTo({
									url: url
								})
							}
						}
					} else {
						uni.navigateBack()
					}
				})
			},
			// Apple
			loginByApple() {
				if (!this.checked) {
					uni.showToast({
						title: '请同意隐私政策和用户协议',
						icon: 'none'
					})
					return
				}
				uni.getProvider({
					service: 'oauth',
					success: (res) => {
						uni.login({
							provider: 'apple',
							success: (loginRes) => {
								// 获取token
								let obj = {
									mobile: `APPLE@${loginRes.authResult.access_token}`,
									code: loginRes.authResult.openid,
									grant_type: 'mobile'
								}
								this.$httpApi
									.login(obj)
									.then((res) => {
										this.setUserInfo(res) // 储存用户auth信息
										this.loginSuccess()
									})
									.catch((e) => {
										if (e.mData.mCode) {
											this.$util.toast('请先绑定手机号码~')
											// 打开绑定手机号的弹窗
											this.isShowPopup = true
											this.type = 1
											this.mCode = e.mData.mCode
											// 绑定手机号
											this.isBinding = true
										}
									})
							},
							fail: (err) => {
								// 登录失败
								this.$util.toast('调用Apple服务失败, 请稍后再试~')
								console.log(err)
							}
						})
					}
				})
			},
			// 微信登录
			loginByWechat() {
				if (!this.checked) {
					uni.showToast({
						title: '请同意隐私政策和用户协议',
						icon: 'none'
					})
					return
				}
				uni.getProvider({
					service: 'oauth',
					success: (res) => {
						//支持微信、qq和微博等
						if (~res.provider.indexOf('weixin')) {
							uni.login({
								provider: 'weixin',
								onlyAuthorize: true,
								success: (loginRes) => {
									this.getAppLoginData(loginRes) // 微信登录请求登录接口方法
								},
								fail: (err) => {
									if (err.code == -1002) {
										this.$util.toast('您没有微信客户端, 不能使用微信登录~')
										return
									}
									this.$util.toast(err.errMsg)
								}
							})
						}
					}
				})
			},
			// 请求登录接口方法
			getAppLoginData(data) {
				// 这边是前端自己去调微信用户信息的接口，根据接口需要请求，如果不需要前端去获取的话就交给后端，可省去次操作
				let obj = {
					grant_type: 'mobile',
					code: data.code,
					mobile: `WX@${data.code}`
				}
				uni.removeStorageSync('userInfo')
				this.$httpApi
					.login(obj)
					.then((res) => {
						this.setUserInfo(res) // 储存用户auth信息
						this.loginSuccess()
					})
					.catch((e) => {
						// 如果没有绑定过手机号则需要先引导用户绑定
						if (e.mData.mCode) {
							this.$util.toast('请先绑定手机号码~')
							// 打开绑定手机号的弹窗
							this.isShowPopup = true
							this.type = 1
							this.mCode = e.mData.mCode
							// 绑定手机号
							this.isBinding = true
						}
					})
			},
			// 选中某个单选框时，由radio时触发
			radioChange(e) {
				// console.log(e);
			},
			// 选中任一radio时，由radio-group触发
			radioGroupChange(e) {
				// console.log(e);
			},
			backClick() {
				const url = uni.getStorageSync('navigatePage')
				uni.removeStorageSync('navigatePage')
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
			},
			setType() {
				this.type = this.type == 1 ? 2 : 1
			},
			onPageJump(url) {
				uni.navigateTo({
					url: url
				})
			},
			// 验证码按钮文字状态
			getCodeState() {
				clear && clearInterval(clear)
				const _this = this
				this.readonly = true
				this.codeText = '60s'
				var s = 60
				clear = setInterval(() => {
					s--
					_this.codeText = s + 's'
					if (s <= 0) {
						clearInterval(clear)
						_this.codeText = '获取验证码'
						_this.readonly = false
					}
				}, 1000)
			},
			// 发送验证码
			onSetCode(header) {
				let phone = this.isBinding ? this.bindingPhone : this.phone
				if (!phone) {
					uni.showToast({
						title: '请输入手机号码',
						icon: 'none'
					})
					return
				}
				if (!this.$base.phoneRegular.test(phone)) {
					uni.showToast({
						title: '手机号码格式不正确',
						icon: 'none'
					})
					return
				}
				this.$httpApi
					.getMSGCode(phone, 'SMSLOGIN', header)
					.then((res) => {
						this.getCodeState()
					})
					.catch((e) => {
						this.$util.toast(e.errMsg)
					})
			},
			onSubmit() {
				if (this.buttonDiasabled) return
				uni.removeStorageSync('userData')
				uni.removeStorageSync('userInfo')
				let phone = this.isBinding ? this.bindingPhone : this.phone
				if (!phone) {
					uni.showToast({
						title: '请输入手机号码',
						icon: 'none'
					})
					return
				}
				if (!this.$base.phoneRegular.test(phone)) {
					uni.showToast({
						title: '手机号码格式不正确',
						icon: 'none'
					})
					return
				}
				if (!this.checked) {
					uni.showToast({
						title: '请同意隐私政策和用户协议',
						icon: 'none'
					})
					return
				}
				let dataObj
				if (this.type === 1) {
					if (!this.code) {
						uni.showToast({
							title: '请输入验证码',
							icon: 'none'
						})
						return
					}
					// 验证码登录
					dataObj = {
						mobile: phone,
						code: this.code,
						grant_type: 'sms_code'
					}
				} else {
					// 密码登录
					if (!this.password) {
						uni.showToast({
							title: '请输入密码',
							icon: 'none'
						})
						return
					}
					const user = encryption({
						data: {
							username: phone,
							password: this.password,
							code: this.code
						},
						type: 'password',
						key: 'pigxpigxpigxpigx',
						param: ['password']
					})
					dataObj = {
						username: user.username,
						password: user.password,
						grant_type: 'password'
					}
				}
				this.loading = true
				this.$httpApi
					.login(dataObj)
					.then((res) => {
						if (!res) {
							this.isLogin = false
							this.loading = false
							return
						}
						this.setUserInfo(res) // 储存用户auth信息
						this.isLogin = true
						// 登录成功
						this.loginSuccess()
					})
					.catch((e) => {
						this.loading = false
					})
			}
		},
	}
</script>
<style lang="scss" scoped>
	.login-page {
		width: 100vw;
		padding: 0rpx 30rpx;
		background-color: #ffffff;

		.welcome-title {
			width: 100%;
			height: 34rpx;
			font-size: 48rpx;
			font-family: Source Han Sans CN;
			font-weight: 500;
			color: #FE6E32;
			line-height: 34rpx;
			margin-top: 72rpx;
			padding-left: 30rpx;
		}

		.welcome-des {
			width: 100%;
			height: 34rpx;
			font-size: 24rpx;
			font-family: Source Han Sans CN;
			font-weight: 400;
			color: #000000;
			line-height: 34rpx;
			margin-top: 40rpx;
			padding-left: 30rpx;
		}

		.input_box {
			width: 690rpx;
			height: 100rpx;
			border-radius: 20rpx;
			display: flex;
			align-items: center;
			padding: 30rpx;
			margin-top: 30rpx;
			background-color: #F7F7F7;

			.input-title {
				width: 120rpx;
				height: 100rpx;
				font-size: 28rpx;
				font-family: Source Han Sans CN;
				font-weight: 500;
				color: #000000;
				line-height: 100rpx;
			}

			.forget-password {
				font-size: 24rpx;
				font-family: Source Han Sans CN;
				font-weight: 500;
				color: #FE6E32;
				line-height: 34rpx;
			}

			.clear-input {
				max-width: 0 !important;
				height: 0 !important;
				min-height: 0 !important;
				overflow: hidden !important;
			}

			input {
				flex: 1;
				font-size: 28rpx;
				font-family: Source Han Sans CN;
				font-weight: 400;
				line-height: 34rpx;
				color: #000000;
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
					color: #fe6e32;
					background-color: transparent;
				}
			}
		}

		.change-type {
			width: 100%;
			margin-top: 30rpx;
			display: flex;
			align-items: center;

			.text {
				font-size: 24rpx;
				font-family: Source Han Sans CN;
				font-weight: 500;
				color: #000000;
				line-height: 34rpx;
			}

			.arrow-icon {
				width: 0;
				height: 0;
				border-top: 6rpx solid transparent;
				border-bottom: 6rpx solid transparent;
				border-left: 8rpx solid #000000;
				margin-left: 10rpx;
			}
		}

		.login-btn {
			width: 100%;
			height: 100rpx;
			margin-top: 60rpx;
			background: #000000;
			border-radius: 20rpx;
			text-align: center;
			font-size: 28rpx;
			font-family: Source Han Sans CN;
			font-weight: 500;
			color: #FFFFFF;
			line-height: 100rpx;
		}

		.privacy {
			width: 100%;
			margin-top: 30rpx;
			display: flex;
			align-items: center;

			.privacy-content {
				display: flex;
				align-items: center;

				.privacy-title {
					font-size: 24rpx;
					font-family: Source Han Sans CN;
					font-weight: 400;
					color: #808080;
					line-height: 34rpx;
				}

				.text-color {
					font-size: 24rpx;
					font-family: Source Han Sans CN;
					font-weight: 400;
					line-height: 34rpx;
					color: #000000;
				}
			}
		}

		.register-text {
			width: 690rpx;
			height: 34rpx;
			position: fixed;
			bottom: calc(60rpx + env(safe-area-inset-bottom));
			text-align: center;
			font-size: 24rpx;
			font-family: Source Han Sans CN;
			font-weight: 500;
			color: #000000;
			line-height: 34rpx;
		}

		.station {
			height: 230rpx;
		}

		.third_party_login_box {
			position: absolute;
			bottom: 0;
			width: 100%;
			left: 0;
			height: 230rpx;
			padding: 0 30rpx;

			.third_party_title {
				display: flex;
				align-items: center;

				&:before,
				&:after {
					content: '';
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

			.third-login {
				display: flex;
				justify-content: center;

				.third_party_content {
					height: 150rpx;
					flex: 1;
					margin: 20rpx 0;
					text-align: center;

					.icon {
						width: 32px;
						margin: auto;
						height: 32px;
					}
				}
			}
		}

		.bind-phone {
			width: 100vw;
			height: 60vh;
			background-color: #ffffff;
			border-radius: 20rpx 20rpx 0 0;
			padding: 100rpx 30rpx;

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
	}
</style>
