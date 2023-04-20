<template>
	<view class="page">
		<z-nav-bar backState="1000"></z-nav-bar>
		<view class="welcome-title">
			欢迎注册觅活
		</view>
		<view class="welcome-des">
			装修透明价 施工标准化
		</view>
		<view class="input_box">
			<view class="input-title">
				手机号
			</view>
			<input type="number" :placeholder-style="placeholderStyle" v-model="phone" placeholder="请输入手机号"
				maxlength="11" />
		</view>
		<view class="input_box">
			<view class="input-title">
				验证码
			</view>
			<input type="number" :placeholder-style="placeholderStyle" v-model="code" placeholder="请输入验证码" />
			<!-- 下面这个input是修复ios输入时闪烁的问题 不要删除 -->
			<input class="clear-input">
			<button class="active" @click="useVerify">{{ codeText }}</button>
		</view>
		<view class="input_box">
			<view class="input-title">
				密码
			</view>
			<input type="password" :placeholder-style="placeholderStyle" v-model="password" placeholder="请输入密码" />
		</view>
		<view class="input_box">
			<view class="input-title">
				确认密码
			</view>
			<input type="password" :placeholder-style="placeholderStyle" v-model="confirmPassword"
				placeholder="请再次输入密码" />
		</view>
		<view class="input_box">
			<view class="input-title">
				邀请码
			</view>
			<input :placeholder-style="placeholderStyle" v-model="invitationCode"
				placeholder="请输入邀请码(选填)" />
		</view>
		<view class="login-btn" @click="onSubmit" :style="{ opacity: disabled ? '0.3' : '1' }">
			注册
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
		<view class="register-text" @click="onJumpPage('')">
			已有账号，<text class="text">立即登录</text>
		</view>
		<Verify @success="success" :mode="'pop'" :captchaType="'blockPuzzle'"
			:imgSize="{ width: '330px', height: '155px' }" ref="verify"></Verify>
	</view>
</template>
<script>
	var clear;
	import Verify from "./components/verify/verify.vue";
	export default {
		components: {
			Verify
		},
		data() {
			return {
				placeholderStyle: `color: #A8A8A8;`,
				disabled: true,
				checked: false,
				phone: '', // 手机号
				password: '', // 密码
				confirmPassword: '', // 确认密码
				code: '', // 验证码
				invitationCode: '', // 邀请码
				codeText: '获取验证码',
				readonly: false, // 验证码已发
			};
		},
		//第一次加载
		onLoad(e) {},
		//页面显示
		onShow() {},
		watch: {
			phone() {
				if (!this.phone || !this.password || !this.checked || !this.code || !this.confirmPassword) this.disabled =
					true
				else this.disabled = false
			},
			password() {
				if (!this.phone || !this.password || !this.checked || !this.code || !this.confirmPassword) this.disabled =
					true
				else this.disabled = false
			},
			confirmPassword() {
				if (!this.phone || !this.password || !this.checked || !this.code || !this.confirmPassword) this.disabled =
					true
				else this.disabled = false
			},
			checked() {
				if (!this.phone || !this.password || !this.checked || !this.code || !this.confirmPassword) this.disabled =
					true
				else this.disabled = false
			},
			code() {
				if (!this.phone || !this.password || !this.checked || !this.code || !this.confirmPassword) this.disabled =
					true
				else this.disabled = false
			}
		},
		//方法
		methods: {
			success(params) {
				console.log(params)
				this.$refs.verify.closeBox()
				this.getCode({code:params.captchaVerification})
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
			viewProtocol(type) {
				uni.navigateTo({
					url: `/pages-common/protocolWebView/protocolWebView?type=${type}`
				})
			},
			onJumpPage(url) {
				if (!url) {
					uni.navigateBack();
					return;
				}
				uni.navigateTo({
					url: url
				});
			},
			// 获取验证码
			getCode(header) {
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
				this.$httpApi.getMSGCode(this.phone, 'SMSREGISTER',header)
					.then(res => {
						if (!res) {
							this.$util.toast('该手机号已被注册')
							return
						}
						this.getCodeState();
					}).catch((e) => {
						this.$util.toast('该手机号已被注册')
					});
			},
			//验证码按钮文字状态
			getCodeState() {
				const _this = this;
				this.readonly = true;
				this.codeText = '60s';
				var s = 60;
				clear = setInterval(() => {
					s--;
					_this.codeText = s + 's';
					if (s <= 0) {
						clearInterval(clear);
						_this.codeText = '获取验证码';
						_this.readonly = false;
					}
				}, 1000);
			},
			onSubmit() {
				if (this.disabled) return
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
				if (!this.code || this.code.length < 6) {
					uni.showToast({
						title: '请输入正确的验证码',
						icon: 'none'
					});
					return;
				}
				if (!this.password) {
					uni.showToast({
						title: '请输入密码',
						icon: 'none'
					});
					return;
				}
				if (this.password.length < 6) {
					uni.showToast({
						title: '密码长度不能少于6位',
						icon: 'none'
					});
					return;
				}
				if (!this.confirmPassword) {
					uni.showToast({
						title: '请输入确认密码',
						icon: 'none'
					});
					return;
				}
				if (this.password != this.confirmPassword) {
					uni.showToast({
						title: '两次密码不一致',
						icon: 'none'
					});
					return;
				}
				if (!this.checked) {
					uni.showToast({
						title: '请同意隐私政策和用户协议',
						icon: 'none'
					})
					return;
				}
				let httpData = {
					phone: this.phone,
					code: this.code,
					password: this.password,
					referrerInviteCode: this.invitationCode,
					username: this.phone
				};
				this.$httpApi.register(httpData).then(res => {
					if (res) {
						// #ifdef APP-PLUS
						// 注册成功后把手机号写入缓存, 返回登录页后直接获取
						let deviceInfo = uni.getStorageSync("deviceInfo");
						if (deviceInfo) {
							deviceInfo['username'] = this.phone
							if (deviceInfo.password) {
								deviceInfo.password = ''
								uni.setStorageSync('deviceInfo', deviceInfo)
							}
						} else {
							let deviceInfo = {
								username: this.phone
							}
							uni.setStorageSync('deviceInfo', deviceInfo)
						}
						uni.navigateBack();
						// #endif
					}
				});
			}
		},
	};
</script>
<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.page {
		width: 100vw;
		padding: 0rpx 30rpx;
		background-color: #ffffff;

		.welcome-title {
			width: 100%;
			height: 34rpx;
			font-size: 48rpx;
			font-family: Source Han Sans CN;
			font-weight: 500;
			color: #000000;
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
				color: #000000;
				line-height: 34rpx;
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

			.text {
				font-size: 24rpx;
				font-family: Source Han Sans CN;
				font-weight: 500;
				line-height: 34rpx;
				color: $themeColor;
			}
		}
	}
</style>
