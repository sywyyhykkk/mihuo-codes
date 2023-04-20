<template>
	<view>
		<z-nav-bar>
			<view class="nav-bar" slot="default">
				账号注销
			</view>
		</z-nav-bar>
		<view class="title"><text class="title_des">离开前给我们一些建议吧～</text></view>
		<view style="background-color: #FFFFFF;">
			<view class="list_content">
				<textarea class="input" v-model="reason" placeholder="您的宝贵意见" maxlength="300" />
			</view>
		</view>
		<view @click="logOff">
			<common-mh-waves rippleBackgroundColor="#e9532d" class="log_off">
				<text style="color: #FFFFFF;font-size: 15px;">注销</text>
			</common-mh-waves>
		</view>
	</view>
</template>

<script>
	import tabInit from '@/plugins/im/tabInit.js';
	import imsdk from '@/plugins/im/imsdk.js'
	export default {
		data() {
			return {
				reason: ''
			}
		},
		methods: {
			logOff() {
				uni.showModal({
					title: "确认操作",
					content: "账户注销后无法找回账号，需重新注册新账号。是否确认注销账户？",
					cancelText: "取消",
					confirmText: "确认",
					confirmColor: "#FE6E32",
					success: (res) => {
						if (res.confirm) {
							uni.showLoading();
							this.$httpApi.userLogOff({
								reason: this.reason || ''
							}).then(data => {
								if (data) {
									uni.hideLoading()
									uni.showToast({
										title: '已为您注销账户',
										icon: 'none',
										duration: 1000,
										success: () => {
											// #ifdef APP-PLUS
											imsdk.onclose()
											// 数据库关闭 scoket 关闭
											tabInit.closeTableSQL();
											// #endif
											uni.removeStorageSync('imUserInfo')
											uni.removeStorageSync('userRole')
											uni.removeStorageSync('COUPON-ARRAY')
											uni.removeStorageSync('userData');
											uni.removeStorageSync('userInfo');
											uni.removeStorageSync('userPostAddress');
											uni.removeStorageSync('userAddress');
											uni.removeStorageSync('userSetting');
											uni.removeStorageSync('roomAddress');
											uni.removeStorageSync('myHomeInfo')
											uni.reLaunch({
												url: '/pages/home/home'
											})
										}
									})
								}
							})
						}
					},
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.title {
		background: #FFFFFF;
		padding: 15rpx 24rpx;

		.title_des {
			font-size: 32rpx;
			color: #666;
		}
	}

	.list_content {
		background: #FFFFFF;
		padding: 15rpx 0;
		margin: 0 24rpx;

		.input {
			width: 100%;
			height: 150rpx;

		}
	}

	.log_off {
		background: #e74016;
		width: 80vw;
		margin: 20rpx auto;
		border-radius: 10rpx;
		height: 90rpx;
		line-height: 90rpx;
		display: flex;
		justify-content: center;
	}
</style>
