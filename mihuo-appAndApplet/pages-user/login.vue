<template>
	<view class="login-page">
		<!-- 公共组件-每个页面必须引入 -->
		<z-nav-bar @backClick="backClick" backState="3000"></z-nav-bar>
		<view class="welcome_title">
			<text>您好，</text>
			<view>
				<text>欢迎使用觅活</text>
			</view>
		</view>
		<button class="login-btn flex-center" open-type="getPhoneNumber" :loading="loading"
			@getphonenumber="onGetPhoneNumber">
			<view class="text">
				微信登录
			</view>
		</button>
	<!-- 	<view class="protocol-text flex-center">
			<u-checkbox shape="circle" class="checkbox" v-model="checked"></u-checkbox>
			我已阅读并同意 <text @click="viewProtocol(1)">《服务协议》</text>和 <text @click="viewProtocol(2)">《隐私政策》</text>
		</view> -->
	</view>
</template>
<script>
	import {
		encryption
	} from '@/plugins/utils.js'
	import {
		mapMutations
	} from 'vuex';
	export default {
		data() {
			const deviceInfo = uni.getStorageSync('deviceInfo');
			return {
				checked: false,
				loading: false,
			};
		},
		onLoad(e) {},
		onShow() {
			this.getCode()
		},
		//方法
		methods: {
			...mapMutations(['setUserInfo', 'setUserData', 'dispatchLoginCallback']),
			// 获取微信登录code
			getCode() {
				uni.login({
					provider: "weixin",
					success: (res) => {
						console.log(res)
						this.loginCode = res.code;
					},
				});
			},
			// 微信授权登录
			onGetPhoneNumber(e) {
				console.log(e)
				if (e.detail.errMsg === "getPhoneNumber:fail user deny") {
					this.getCode()
					return;
				} else {
					const obj = {
						grant_type: 'mini_app',
						code: this.loginCode,
						encryptedData: e.detail.encryptedData,
						iv: e.detail.iv,
					}
					console.log('======LOGIN INFO(wechat)======', obj);
					this.$httpApi.login(obj).then(res => {
						if (res.access_token) {
							this.setUserInfo(res)
							this.loginSuccess()
							wx.reportEvent('enter_app', {
							  'source_user': uni.getStorageSync('shareUserId') ? Number(uni.getStorageSync('shareUserId')) : 0,
							  'type': 2 // 用户注册
							})
						}
					}).catch(e => {
						console.log(e)
					})
				}
			},
			viewProtocol(type) {
				uni.navigateTo({
					url: `/pages-common/protocolWebView/protocolWebView?type=${type}`
				})
			},
			// 登录成功以后的回调
			loginSuccess() {
				this.$httpApi.getPersonInfo().then(async data => {
					if (!data) return
					this.setUserData(data); // 储存用户个人信息
					this.$httpApi.getPersonSettingInfo().then(userSetting => {
						uni.setStorageSync('userSetting', userSetting);
					}).catch(e => console.log(e));
					this.loading = false;
					
					const deviceInfo = uni.getStorageSync('deviceInfo');
					this.$httpApi.imToken().then(async (imRes) => {
						console.log(imRes)
						await this.$store.commit("WEBSOCKET_INIT", imRes);
						//await this.$store.commit("WEBSOCKET_SESSIONLIST")
					})
					// 服务端分享小程序开单跳转到确认订单页面
					if(this.isOrder){
						this.$httpApi.getOrderConfirmPreview(this.groupPricingId).then(res => {
							if(res){
								uni.setStorageSync('orderConfirmInfo', res)
								this.toPage('/pages-mall/submitOrder/submitOrder?type=1')
							}
						})
						return
					}
					let url = uni.getStorageSync('navigatePage')
					if (url) {
						uni.removeStorageSync('navigatePage')
						if (url === 'callback') {
							// 执行操作
							this.goBack()
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
		},
	};
</script>
<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.login-page {
		padding: calc(var(--status-bar-height) + 100rpx) 50rpx 50rpx 50rpx;
		background-color: #FFFFFF;
		min-height: 100vh;
		position: relative;

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
				color: $fontColor66
			}
		}

		.login-btn {
			width: 556rpx;
			height: 88rpx;
			background: $themeColor;
			border-radius: 10rpx;
			justify-content: center;
			margin: 300rpx auto 26rpx auto;

			.icon {
				width: 44rpx;
				height: 44rpx;
				margin-right: 10rpx;
			}

			.text {
				font-family: PingFang SC;
				font-style: normal;
				font-weight: 500;
				font-size: 28rpx;
				line-height: 88rpx;
				color: #FFFFFF;
			}
		}

		.protocol-text {
			width: 100%;
			height: 36rpx;
			margin-top: 70rpx;
			font-family: PingFang SC;
			font-style: normal;
			font-weight: 500;
			font-size: 26rpx;
			line-height: 36rpx;
			text-align: center;
			color: #909199;
			justify-content: center;

			.checkbox {
				width: 36rpx;
				height: 36rpx;
				margin-right: 12rpx;
			}

			text {
				font-family: PingFang SC;
				font-style: normal;
				font-weight: 500;
				font-size: 26rpx;
				line-height: 36rpx;
				text-align: center;
				color: $themeColor;
			}
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
