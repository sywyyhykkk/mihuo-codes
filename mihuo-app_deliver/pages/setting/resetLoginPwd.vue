<template>
	<view>
		<public-module></public-module>
		<z-nav-bar fontColor="#333333" bgColor="#ffffff">
			<view slot="default" class="nav_bar">修改登录密码</view>
		</z-nav-bar>
		<view class="form_list" style="margin-top: 16rpx;">
			<view class="form_list_title">手机号</view>
			<input class="form_list_input" disabled v-model="mobile" maxlength="11" type="number"
				placeholder="请输入手机号" />
		</view>
		<view class="form_list">
			<view class="form_list_title">验证码</view>
			<input class="form_list_input2" @confirm="submitEidt" v-model="code" type="number" maxlength="6"
				placeholder="请输入短信验证码" />
			<view class="get_code" @click="getCode">{{send}}</view>
		</view>

		<view class="form_list" style="margin-top: 20rpx;">
			<view class="form_list_title">新密码</view>
			<input class="form_list_input" type="text" @confirm="submitEidt" v-model="payPwd" password
				placeholder="请输入新密码" />
		</view>
		<view class="form_list">
			<view class="form_list_title">确认密码</view>
			<input class="form_list_input" type="text" @confirm="submitEidt" v-model="confirmPwd" password
				placeholder="请再次输入新密码" />
		</view>
		<view class="submit" @click="submitEidt">确认修改</view>
	</view>
</template>

<script>
	import {
		encryption
	} from '@/plugins/utils.js';
	import tabInit from '@/plugins/im/tabInit.js';
	import imsdk from '@/plugins/im/imsdk.js'

	export default {
		data() {
			return {
				phone: '',
				mobile: '',
				code: '',
				payPwd: '',
				confirmPwd: '',
				times: 60,
				send: '获取验证码',
				sendType: false
			}
		},
		onLoad() {
			this.getPersonInfo()
		},
		methods: {
			// 个人信息-手机号
			getPersonInfo() {
				this.$httpApi.getPersonSettingInfo().then(res => {
					if (res) {
						this.mobile = res.phone;
						this.phone = res.phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")
					}
				})
			},
			getCode() {
				if (this.sendType) {
					return;
				}
				if (!this.$base.phoneRegular.test(this.mobile)) {
					uni.showToast({
						title: "手机号码格式不正确",
						icon: "none",
					});
					return;
				}
				let showMessage = true
				this.$httpApi.getMSGCode(this.mobile, 'SMSMSG', showMessage, {}).then(res => {
					if (res) {
						const timer = setInterval(() => {
							this.times--;
							if (this.times <= 0) {
								this.send = '获取验证码';
								clearInterval(timer);
								this.times = 60;
								this.sendType = false;
							} else {
								this.send = this.times + '秒后重试';
								this.sendType = true;
							}
						}, 1000)
						uni.showToast({
							title: '验证码发送成功',
							icon: 'none'
						});
					}
				})
			},
			submitEidt() {
				if (!this.payPwd) {
					uni.showToast({
						title: '请输入密码',
						icon: 'none'
					});
					return;
				}
				if (this.payPwd.length < 6) {
					uni.showToast({
						title: '密码长度最低为6位',
						icon: 'none'
					});
					return;
				}
				if (this.payPwd !== this.confirmPwd) {
					uni.showToast({
						title: '确认密码错误',
						icon: 'none'
					});
					return;
				}
				// if (!this.mobile) {
				// 	uni.showToast({
				// 		title: '请输入手机号码',
				// 		icon: 'none'
				// 	});
				// 	return;
				// }
				// if (!this.$base.phoneRegular.test(this.mobile)) {
				// 	uni.showToast({
				// 		title: '手机号码格式不正确',
				// 		icon: 'none'
				// 	});
				// 	return;
				// }
				if (!this.code) {
					uni.showToast({
						title: '请输入验证码',
						icon: 'none'
					});
					return;
				}
				//加密
				const user = encryption({
					data: {
						username: this.mobile,
						password: this.payPwd,
						code: '',
						randomStr: ''
					},
					type: 'password',
					key: 'pigxpigxpigxpigx',
					param: ['password']
				})
				this.$http.put("admin/user/password/updateByMobile", {
					code: this.code,
					mobile: this.mobile,
					password: this.payPwd
				}).then(res => {
					if (res) {
						uni.showToast({
							title: '登录密码修改成功',
							icon: 'none'
						});
						this.$store.commit("emptyUserInfo");
						uni.removeStorageSync('userData')
						uni.removeStorageSync('userInfo')
						uni.removeStorageSync('imUserInfo')
						uni.removeStorageSync('userPersonId')
						uni.removeStorageSync('userRole')
						uni.removeStorageSync('userAddress')
						uni.removeStorageSync('userSetting')
						uni.removeStorageSync('cityOperatorId')
						uni.removeStorageSync('oldLocation')
						uni.removeStorageSync('sqliteDataVersion')
						// 把本地储存的密码清空
						let deviceInfo = uni.getStorageSync('deviceInfo')
						deviceInfo.password = ''
						uni.setStorageSync('deviceInfo', deviceInfo)
						//数据库关闭 scoket 关闭
						tabInit.closeTableSQL();
						imsdk.onclose();
						setTimeout(() => {
							uni.reLaunch({
								url: '../user/login'
							})
						}, 1000)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';
	
	.nav_bar {
		@include nav-bar-title($fontColor33)
	}

	.submit {
		line-height: 90rpx;
		background: linear-gradient(90deg, $themeColor 0%, $themeColor 100%);
		border-radius: 10rpx;
		font-weight: bold;
		font-size: 28rpx;
		text-align: center;
		color: #FFFFFF;
		margin-left: 60rpx;
		margin-right: 60rpx;
		margin-top: 400rpx;
	}

	.form_list {
		height: 120rpx;
		width: 100%;
		background: #FFFFFF;
		border-bottom: solid 2rpx #EEEEEE;

		.form_list_title {
			float: left;
			width: 160rpx;
			text-align: right;
			line-height: 120rpx;
			font-weight: 400;
			font-size: 30rpx;
			color: $seconFontColor;
		}

		.form_list_input {
			float: left;
			margin-left: 30rpx;
			width: calc(100% - 300rpx);
			height: 120rpx;
			font-weight: 400;
			font-size: $middleFontSize;
			color: $viceFontColor;
			line-height: 120rpx;
		}

		.form_list_input2 {
			float: left;
			margin-left: 30rpx;
			width: calc(100% - 480rpx);
			height: 120rpx;
			font-weight: 400;
			font-size: 28rpx;
			color: #909199;
			line-height: 120rpx;
		}

		.get_code {
			width: 180rpx;
			line-height: 60rpx;
			background: linear-gradient(90deg, $themeColor 0%, $themeColor 100%);
			border-radius: 10rpx;
			font-weight: 400;
			font-size: 24rpx;
			color: #FFFFFF;
			text-align: center;
			float: right;
			margin-right: 40rpx;
			margin-top: 30rpx;
		}
	}
</style>
