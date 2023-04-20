<template>
	<view>
		<view class="title"><text class="title_des">离开前给我们一些建议吧～</text></view>
		<view style="background-color: #FFFFFF;">
			<view class="list_content">
				<textarea class="input" v-model="reason" placeholder="您的宝贵意见" maxlength="300" />
			</view>
		</view>
		<view class="log_off" @click="logOff">
			<waves rippleBackgroundColor="#e9532d">
				<text style="color: #FFFFFF;font-size: 15px;">注销</text>
			</waves>
		</view>
	</view>
</template>

<script>
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
					confirmColor: "#002FA5",
					success: (res) => {
						if (res.confirm) {
							uni.showLoading();
							this.$http.post('admin/user/cancellation', {
								reason: this.reason || ''
							}).then(data => {
								if (data) {
									uni.hideLoading()
									uni.showToast({
										title: '已为您注销账户',
										icon: 'none',
										duration: 1000,
										success: () => {
											uni.removeStorageSync('userData');
											uni.removeStorageSync('userInfo');
											uni.removeStorageSync('userPostAddress');
											uni.removeStorageSync('userAddress');
											uni.removeStorageSync('userSetting');
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
		margin: 30rpx;
		border-radius: 10rpx;
		height: 90rpx;
		line-height: 90rpx;
	}
</style>
