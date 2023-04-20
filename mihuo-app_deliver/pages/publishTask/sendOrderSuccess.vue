<template>
	<view class="order-success-page">
		<public-module></public-module>
		<z-nav-bar backState="3000" bgColor="#002FA5" fontColor="#FFFFFF" @backClick="goBackPage">
			<view slot="default" style="color: #FFFFFF;">
				{{ option.typeName }}
			</view>
			<view slot="right">
				<image src="../../static/icon/share.png" class="icon" @click="shareOrder"></image>
			</view>
		</z-nav-bar>
		<view class="success-page">
			<view class="success-icon">
				<u-icon size="176" color="#002FA5" name="checkmark-circle-fill"></u-icon>
			</view>
			<view class="success-text">{{option.typeName}}</view>
			<view class="success-prompt" v-if="option.typeName !== '指派成功'">您的需求将广播给附近的师傅</view>
		<!-- 	<view class="order-code" v-show="option.orderCode">
				<text class="code-item">订单编号</text>
				<text class="code-num">{{option.orderCode}}</text>
				<u-icon size="36" name="file-text-fill" color="#999999" class="code-copy" @click="codeCopy"></u-icon>
			</view> -->
			<view class="order-operation">
				<view class="operation-detail" @click="orderDetail">订单详情</view>
				<view v-if="option.typeName === '发布成功'" class="operation-come" @click="orderSend">继续发布</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				option: {

				}
			}
		},
		onLoad(option) {
			this.option = option
		},
		methods: {
			// 分享订单
			shareOrder() {
				let miniProgramType = process.env.NODE_ENV === 'production' ? 0 : 1
				uni.share({
					provider: 'weixin',
					scene: "WXSceneSession",
					type: 5, // 微信小程序
					imageUrl: '',
					title: '我给你分享了一个订单, 有钱一起赚~',
					miniProgram: {
						id: 'gh_b091d7f9d23e', // 服务端小程序原始id
						path: `pages-order/orderReceiving/orderReceiving?sharedOrderId=${this.option.orderId}`, // 分享到小程序的页面
						type: miniProgramType, // 0-正式版； 1-测试版； 2-体验版
						webUrl: 'https://www.51mihuo.com/' // 兼容低版本的网页链接
					},
				});
			},
			goBackPage() {
				uni.navigateBack({
					delta: 2
				})
			},
			orderDetail() {
				if (this.option.htmlType == 2) {
					// SOP任务节点发布订单
					uni.navigateTo({
						url: '../construction/assignmentDetail/assignmentDetail'
					});
					// uni.navigateTo({
					// 	url: `/pages/orderReceiving/orderReceiving?id=${this.option.orderId}&typeName=发单详情`
					// });
				} else {
					// 直接发布的订单
					// uni.navigateTo({
					// 	url: `/pages/orderReceiving/orderReceiving?id=${this.option.id}&typeName=发单详情`
					// });
					this.toPage(`/pages/orderReceiving/releaseOrderDetails?pageType=发单&id=${this.option.id}`)
				}
			},
			orderSend() {
				uni.navigateTo({
					url: `/pages/publishTask/sendOrder`
				});
			},
			codeCopy() {
				uni.setClipboardData({
					data: this.option.orderCode,
					success: function() {
						console.log('success', this.option.orderCode);
					}
				});
			}
		},
	}
</script>

<style lang="scss" scoped>
	.icon {
		width: 44rpx;
		height: 44rpx;
		margin-right: 40rpx;
	}
	
	.success-page {
		background-color: #FFFFFF;
		text-align: center;
		margin-top: 16rpx;
		height: 93.5vh;
		padding-top: 190rpx;
	}

	.success-icon {
		margin-bottom: 14rpx;
	}

	.success-text {
		margin-bottom: 20rpx;
		color: #333333;
		font-size: 40rpx;
		font-weight: bold;
		line-height: 56rpx;
	}

	.success-prompt {
		margin: 0 180rpx 86rpx;
		color: #999999;
		font-size: 24rpx;
		line-height: 1.5;
	}

	.order-code {
		margin-bottom: 254rpx;

		.code-item,
		.code-num {
			color: #999999;
			font-size: 24rpx;
		}

		.code-item {
			margin-right: 20rpx;
		}

		.code-num {
			margin-right: 10rpx;
		}
	}

	.order-operation {
		display: flex;
		justify-content: center;
	}

	.operation-detail {
		width: 268rpx;
		color: $themeColor;
		border: 2rpx solid $themeColor;
		margin-right: 24rpx;
	}

	.operation-come {
		width: 268rpx;
		color: #FFFFFF;
		background: linear-gradient(90deg, $themeColor 0%, $themeColor 100%);
	}

	.operation-come,
	.operation-detail {
		padding: 24rpx 40rpx;
		font-size: 24rpx;
		border-radius: 5px;
	}
</style>
