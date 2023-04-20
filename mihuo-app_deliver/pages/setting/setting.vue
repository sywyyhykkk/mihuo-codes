<template>
	<view>
		<!-- 顶部导航栏 -->
		<z-nav-bar backState="1000">
			<view class="nav-bar" slot="default">账号设置</view>
		</z-nav-bar>
		<view class="header-container">
			<menu-item title="个人信息" @click="goToPersonalInfo"></menu-item>
			<menu-item title="首页信息展示设置" @click="goToHomeInfo" :border="true"></menu-item>
			<!-- <menu-item title="所属企业" @click="settingJump('所属企业')" :border="true"></menu-item> -->
		</view>
		<view class="main-container">
			<menu-item title="支付密码" @click="goToResetPaymentPwd" :border="false">
				<slot>
					<view class="slot-content" :class="accountState<=1?'no-payPwd':''">
						{{accountState>1 || isPayPwd ? '修改' : '未设置'}}
					</view>
				</slot>
			</menu-item>
			<menu-item title="登录密码" @click="goToResetLoginPwd" :border="true">
				<slot>
					<view class="slot-content">修改登录密码</view>
				</slot>
			</menu-item>
			<menu-item title="推送内容设置" @click="goToMessageSetting" :border="true"></menu-item>
			<menu-item title="技能认证" @click="goToSkill" :border="true"></menu-item>
			<menu-item title="帮助中心" @click="goToHelpCenter" :border="true"></menu-item>
			<menu-item title="关于我们" @click="goToAppupdate" :border="true">
				<text class="version_num" :class="{'active':hasNewVsesion}">版本 {{version}}</text>
			</menu-item>
			<menu-item title="账号注销" @click="goLogOff()" :border="true"></menu-item>
			<view class="login_btn log_out" @click="goLogOut()">退出登录</view>
		</view>
	</view>
</template>

<script>
	import tabInit from '@/plugins/im/tabInit.js';
	import imsdk from '@/plugins/im/imsdk.js'
	export default {
		data() {
			return {
				userSetting: {},
				version: 0,
				hasNewVsesion: false,
				isRealName: false,
				isPayPwd: false,
				accountState: ''
			}
		},
		onLoad() {
			// #ifdef APP-PLUS
			plus.runtime.getProperty(plus.runtime.appid, wgtinfo => {
				let app_name = wgtinfo.name;
				let version = wgtinfo.version;
				let system = uni.getSystemInfoSync().platform;
				this.version = version;
				//这里可以用code 但是安卓可能不支持
				let version_num = version.split('.').join('');
				let apptype = 0;
				apptype = system === 'ios' ? 3 : 2
				this.$httpApi.getAppVersion(apptype).then(res => {
					if (!res) return;
					if (res && res.id) {
						let oldVersion = version_num.replace('.', '');
						let newVersion = res.version.replace('.', '');
						111
						if (oldVersion >= newVersion) {
							return
						}
					}
					this.hasNewVsesion = true;
				})
			});
			// #endif
		},
		onShow() {
			this.getUserData()
			this.getAccountStatus()
			this.getPayPwdStatus()
		},
		methods: {
			//是否设置过支付密码（发布订单的时候只验证了手机号没有设置过支付密码的情况）
			getPayPwdStatus() {
				this.$httpApi.payPwdStatus().then(res => {
					if (res) {
						this.isPayPwd = res.password
						this.isRealName = res.idCard
					}
				})
			},

			getAccountStatus() {
				this.$httpApi.getPaymentAccountStatus().then(res => {
					for (let key in res) {
						this.accountState = key
					}
				}).catch(err => console.log(err))
			},
			getUserData() {
				// 获取用户工种信息
				this.$httpApi.getPersonSettingInfo().then(res => {
					this.userSetting = res;
					uni.setStorageSync('userSetting', res);
				}).catch(e => {});
			},
			goToAppupdate() {
				uni.navigateTo({
					url: '/pages/appInfo/appInfo'
				})
				// if (this.hasNewVsesion) {
				// 	uni.navigateTo({
				// 		url: '/pages/appUpdate/appUpdate'
				// 	})
				// } else {

				// }
			},
			goLogOff() {
				this.toPage('/pages/logOff/logOff');
			},
			goLogOut() {
				uni.showModal({
					title: '确认操作',
					content: '确认退出登录?',
					success: res => {
						if (res.confirm) {
							this.$httpApi.registerClientId({cid:''}).then(response => {
								this.$store.commit("emptyUserInfo");
								this.$util.removeTabBarBadge("all")
								uni.removeStorageSync('userData')
								uni.removeStorageSync('userInfo')
								uni.removeStorageSync('imUserInfo')
								uni.removeStorageSync('userPersonId')
								uni.removeStorageSync('userRole')
								// uni.removeStorageSync('userAddress')
								uni.removeStorageSync('userSetting')
								// uni.removeStorageSync('cityOperatorId')
								// uni.removeStorageSync('oldLocation')
								uni.removeStorageSync('sqliteDataVersion')
								uni.removeStorageSync('GUID')
								uni.removeTabBarBadge({
									index: 2
								})
								// #ifdef APP
								uni.removeStorageSync('devModeApi')
								plus.runtime.setBadgeNumber(0)
								tabInit.closeTableSQL();
								// #endif
								//数据库关闭 scoket 关闭
								uni.closeSocket({
									success() {

									},
									complete(res) {
										console.log(res)
										uni.reLaunch({
											url: '/pages/home/home'
										})
									}
								})
							})
							//清除与用户信息相关的本地缓存

						}
					}
				});
			},
			goLogin() {
				this.$store.commit('emptyUserInfo')
				if (this.$store.state.userInfo.name) {
					return;
				}
				this.toPage('/pages/user/login')
			},
			// 个人信息设置
			goToPersonalInfo() {
				uni.navigateTo({
					url: "/pages/setting/personalInfo"
				});
			},
			// 首页信息展示设置
			goToHomeInfo() {
				if (!this.isRealName) {
					uni.showModal({
						title: '确认操作',
						content: '完成实名认证之后才能修改首页信息展示，是否先去实名认证？',
						success: res => {
							if (res.confirm) {
								this.toPage('/pages/user/realName')
							}
						}
					});
					return;
				}
				uni.navigateTo({
					url: "/pages/setting/homeInfo"
				});
			},

			// 修改支付密码
			goToResetPaymentPwd() {
				//如果绑定过手机号没设置过支付密码先去设置支付密码，否则绑定手机和设置支付密码一起设置
				if (this.accountState > 1 && !this.isPayPwd) {
					this.toPage('/pages/setting/resetPayPassword?pegeType=设置支付密码')
					return
				} else if (this.accountState <= 1) {
					this.toPage('/pages/user/bindPhoneStep')
					return
				}
				uni.navigateTo({
					url: '/pages/setting/editPayPassword'
				})
			},
			// 修改登录密码
			goToResetLoginPwd() {
				uni.navigateTo({
					url: '/pages/setting/resetLoginPwd'
				})
			},
			//技能认证
			goToSkill() {
				//实名认证之后才能去技能认证
				if (!this.isRealName) {
					uni.showModal({
						title: '确认操作',
						content: '完成实名认证之后才能做技能认证，是否先去实名认证？',
						success: res => {
							if (res.confirm) {
								this.toPage('/pages/user/realName?pageType=技能认证')
							}
						}
					});
					return;
				}
				uni.navigateTo({
					url: "/pages/setting/skillCertification/skillCertificationPage"
				});
			},
			//新消息设置
			goToMessageSetting() {
				uni.navigateTo({
					url: "/pages/setting/pushSet"
				})
			},
			//帮助中心
			goToHelpCenter() {
				this.toPage('/pages/setting/helpCenter')
			},
			settingJump() { // 所属企业
				this.toPage('/pages/setting/belonging/belonging')
			},
			back() {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.login_btn {
		background: #EEEEEE;
		border-radius: 70rpx;
		line-height: 96rpx;
		font-size: $middleAddFontSize;
		text-align: center;
	}

	.log_out {
		color: $errorFontColor;
		margin: 68rpx 60rpx 0 60rpx;
	}

	.log_off {
		margin: 22rpx 60rpx 0 60rpx;
		color: $viceFontColor;
		text-align: right;
		@include safearea()
	}

	.version_num {
		font-size: 25rpx;
		color: #999;
		margin: 0 20rpx;
		position: relative;

		&.active::before {
			content: ' ';
			display: inline-block;
			width: 8rpx;
			height: 8rpx;
			border-radius: 50%;
			background-color: $themeColor;
			position: absolute;
			right: -12rpx;
			top: 2rpx;
		}
	}

	.nav-bar {
		width: 600rpx;
		font-family: PingFang SC;
		font-style: normal;
		font-weight: bold;
		font-size: 30rpx;
		line-height: 50rpx;
		color: #333333;
	}

	.header-container {
		// height: 248rpx;
		margin-top: 20rpx;
		// background-color: #fff;
	}

	.main-container {
		height: 744rpx;
		margin-top: 20rpx;
		background-color: #fff;

		.slot-content {
			font-family: PingFang SC;
			font-style: normal;
			font-weight: 400;
			font-size: 26rpx;
			line-height: 42rpx;
			color: #909199;
			margin-right: 20rpx;
		}

		.no-payPwd {
			color: $errorFontColor;
		}
	}
</style>
