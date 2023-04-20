<template>
	<view>
		<!-- 顶部导航栏 -->
		<z-nav-bar backState="1000">
			<view slot="default" class="nav-bar-title">
				设置
			</view>
		</z-nav-bar>
		<view class="header-container">
			<user-mh-menu-item title="个人信息" @click="goToPersonalInfo"></user-mh-menu-item>
		</view>
		<view class="main-container">
			<user-mh-menu-item title="邀请码" @click="goToInvitation">
				<view class="invited-code" :style="{color: inviteCode ? '#333333' : '#B3B3B3' }">
					{{ inviteCode || '未填写' }}
				</view>
			</user-mh-menu-item>
			<user-mh-menu-item title="实名认证" @click="goToRealName">
				<view class="slot-content" :class="!isRealName ? 'no-real' : ''">
					{{ isRealName ? '已实名' : '未实名' }}
				</view>
			</user-mh-menu-item>
			<user-mh-menu-item title="修改登录密码" @click="()=>goToResetLoginPwd(0)"></user-mh-menu-item>
			<user-mh-menu-item title="推送内容设置" @click="()=>goToResetLoginPwd(1)"></user-mh-menu-item>
			<user-mh-menu-item v-for="(item,index) in itemList" :key="index" :title="item.title" @click="goPage(item)">
			</user-mh-menu-item>
			<user-mh-menu-item title="关于觅活" @click="goToAppupdate">
				<text class="version_num" :class="{'active':hasNewVsesion}">版本 {{version}}</text>
			</user-mh-menu-item>
		</view>
		<view class="log_out" @click="logout()">
			<user-mh-waves rippleBackgroundColor="#ff5d35">
				<view style="color:#fff">退出登录</view>
			</user-mh-waves>
		</view>
		<view class="log_off" @click="goLogOff()">
			<text style="color: #FF9A52;font-size: 28rpx;">账号注销</text>
		</view>
	</view>
</template>

<script>
	import imsdk from '@/plugins/im/imsdk.js'
	export default {
		data() {
			return {
				typeTreeCode: '',
				userSetting: {},
				isRealName: false,
				itemList: [{
						title: '意见反馈',
						url: '/pages-mine/feedback'
					}
				],
				version: 0,
				hasNewVsesion: false,
				accountState: '',
				inviteCode: ''
			}
		},
		onLoad() {
			this.$httpApi.getPersonSettingInfo().then(res => {
				this.userSetting = res;
				uni.setStorageSync('userSetting', res);
			}).catch(e => console.log(e));
			const userData = uni.getStorageSync('userData')
			let apptype = 0;
			// #ifdef MP-WEIXIN
			const accountInfo = uni.getAccountInfoSync();
			this.version = accountInfo.miniProgram.version;
			// #endif
			// #ifdef APP-PLUS
			plus.runtime.getProperty(plus.runtime.appid, wgtinfo => {
				let app_name = wgtinfo.name;
				let version = wgtinfo.version;
				let system = uni.getSystemInfoSync().platform;
				this.version = version;
				//这里可以用code 但是安卓可能不支持
				let version_num = version.split('.').join('');
				switch (app_name) {
					case '觅活':
						apptype = system === 'ios' ? 1 : 0
						break
					default:
						apptype = 10
				}
				this.$httpApi.getAppVersion().then(res => {
					if (!res) return;
					if (res && res.id) {
						let oldVersion = version_num.replace('.', '');
						let newVersion = res.version.replace('.', '');
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
			this.getPayPwdStatus()
			this.getAccountStatus()
			this.inviteCode = uni.getStorageSync('userData').referrerInviteCode
		},
		methods: {
			// 邀请码页面
			goToInvitation(){
				this.toPage('/pages-mine/recommendMihuo/invitationCode')
			},
			getAccountStatus() {
				this.$httpApi.getPaymentAccountStatus().then(res => {
					for (let key in res) {
						if (key == 0) {
							this.$httpApi.registerPaymentAccount().catch(err => console.log(err))
						}
					}
				}).catch(err => console.log(err))
			},
			// 是否设置过支付密码（发布订单的时候只验证了手机号没有设置过支付密码的情况）
			getPayPwdStatus() {
				this.$httpApi.payPwdStatus().then(res => {
					if (res) {
						this.isRealName = res.idCard
					}
				})
			},
			goToAppupdate() {
				uni.navigateTo({
					url: '/pages-appInfo/appInfo/appInfo'
				})
			},
			goBackPage() {
				this.goBack();
			},
			goPage(item) {
				uni.navigateTo({
					url: item.url
				});
			},
			logout() {
				uni.showModal({
					title: '确认操作',
					content: '确认退出登录?',
					success: res => {
						if (res.confirm) {
							// #ifdef APP
							this.$httpApi.registerClientId({
								cid: ''
							}).then(response => {
								//清除与用户信息相关的本地缓存
								this.$util.removeTabBarBadge("all")
								this.$store.commit("emptyUserInfo");
								imsdk.onclose()
								this.removeStorage()
							})
							// #endif
							// #ifndef APP-PLUS
							this.removeStorage()
							// #endif
						}
					}
				});
			},
			removeStorage() {
				uni.removeStorageSync('COUPON-ARRAY')
				uni.removeStorageSync('userData')
				uni.removeStorageSync('userInfo')
				uni.removeStorageSync('imUserInfo')
				uni.removeStorageSync('userRole')
				uni.removeStorageSync('userSetting')
				uni.removeStorageSync('roomAddress')
				uni.removeStorageSync('userPostAddress')
				uni.removeStorageSync('sqliteDataVersion')
				uni.removeStorageSync('myHomeInfo')
				uni.removeStorageSync("noticeNum")
				uni.reLaunch({
					url: '/pages/home/home'
				})
			},
			goLogOff() {
				this.toPage('/pages-common/logOff/logOff');
			},
			// 个人信息设置
			goToPersonalInfo() {
				uni.navigateTo({
					url: "/pages-user/setting/personalInfo"
				});
			},
			// 实名认证
			goToRealName() {
				if (this.isRealName) {
					uni.showToast({
						title: '您已完成实名认证',
						icon: 'none'
					});
					return;
				}
				uni.navigateTo({
					url: '/pages-user/realName'
				})
			},
			// 重置登录密码 新消息通知
			goToResetLoginPwd(type) {
				switch (type) {
					case 0:
						// 编辑登录密码
						uni.navigateTo({
							url: '/pages-user/setting/resetLoginPwd'
						})
						break;
					case 1:
						// 推送内容设置
						uni.navigateTo({
							url: '/pages-user/setting/pushSetting'
						})
						break;
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.log_out {
		@include theme('btn_bg');
		border-radius: 70rpx;
		line-height: 96rpx;
		font-weight: bold;
		font-size: 30rpx;
		color: #fff;
		text-align: center;
		margin: 100rpx 60rpx 0 60rpx;
	}

	.log_off {
		font-weight: bold;
		font-size: 16rpx;
		text-align: right;
		margin: 20rpx 60rpx 0 60rpx;
	}

	.version_num {
		font-size: 28rpx;
		color: #B3B3B3;
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

	.header-container {
		margin-top: 20rpx;
		background-color: #fff;
	}

	.main-container {
		background-color: #fff;

		.no-real {
			color: #FF5D35;
		}
	}

	.slot-content {
		margin-right: 10rpx;
		font-family: PingFang SC;
		font-style: normal;
		font-size: 28rpx;
		line-height: 34rpx;
		color: #B3B3B3;
	}
	
	.invited-code {
		margin-right: 10rpx;
		line-height: 34rpx;
		font-size: 28rpx;
		font-family: Noto Sans S Chinese;
		font-weight: 400;
		color: #000000;
	}
</style>
