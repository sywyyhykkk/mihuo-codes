<template>
	<view class="refund-details-contain">
		<view class="refund-top">
			<view class="prompt">
				<view class="prompt-status">退款中</view>
				<view class="text">退款已受理，正在为您退款</view>
			</view>
			<view class="amount-contain">
				<view class="item">
					<text class="item-left">退款金额</text>
					<text class="item-right">￥168</text>
				</view>
				<view class="item">
					<text class="item-left">退款账户</text>
					<text class="item-right">原支付账户</text>
				</view>
			</view>
		</view>
		<view class="refund-middle">
			<view class="header-contain">
				<view class="h-left">
					退款信息
				</view>
				<view class="h-right">
					<image src="https://www.51mihuo.com/static/images/order_details/lt.png" mode=""></image>
					<text>联系卖家</text>
				</view>
			</view>
			<view class="middle-contain">
				<view class="item-information">
					<view class="order-middle" @click="orderMiddle">
						<view class="order-middle-contain">
							<view class="order-attachments-coverNew">
								<u-lazy-load class="order-middle-image" border-radius="10" height="176"
									imgMode="aspectFill" image="https://www.51mihuo.com/static/images/order_details/lt.png">
								</u-lazy-load>
							</view>
							<view class="order-information">
								<view class="skill-type-contain">
									<view class="skill-type-all">
										<text class="order-name">断桥铝合金安装，单包口铝合金卫浴门安装...</text>
									</view>
									<text class="order-offer">399.90</text>
								</view>
								<view class="order-brand-contain ">
									<view class="order-brand">断桥铝盒108</view>
									<view class="order-num">x108
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="refund-reason">
					<image class="order-copy" src="https://www.51mihuo.com/static/images/order_details/cp.png" mode="" @click="getCopy">
					</image>
					<view class="reason-item">
						<text class="item-label">订单编号：</text>
						<text class="item-value">5888768886957</text>
					</view>
					<view class="reason-item">
						<text class="item-label">申请金额：</text>
						<text class="item-value item-pic">￥168</text>
					</view>
					<view class="reason-item">
						<text class="item-label">退款原因：</text>
						<text class="item-value">多拍、错拍、不想要</text>
					</view>
					<view class="reason-item">
						<text class="item-label">申请时间：</text>
						<text class="item-value">2021-07-22 10:17:21</text>
					</view>
					<view class="reason-item">
						<text class="item-label">凭证图片：</text>
						<text class="item-value">
							<view class="item-image-contain">
								<u-lazy-load class="recommended-image" border-radius="10" height="182"
									imgMode="aspectFill"
									image="https://mihuo-test.obs.cn-east-3.myhuaweicloud.com/f9eaa96b493a4ecc9f4425e6d3e0f4d7.webp">
								</u-lazy-load>
								<u-lazy-load class="recommended-image" border-radius="10" height="182"
									imgMode="aspectFill"
									image="https://mihuo-test.obs.cn-east-3.myhuaweicloud.com/f9eaa96b493a4ecc9f4425e6d3e0f4d7.webp">
								</u-lazy-load>
								<u-lazy-load class="recommended-image" border-radius="10" height="182"
									imgMode="aspectFill"
									image="https://mihuo-test.obs.cn-east-3.myhuaweicloud.com/f9eaa96b493a4ecc9f4425e6d3e0f4d7.webp">
								</u-lazy-load>
							</view>
						</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		onLoad() {

		},
		methods: {
			getCopy() {

			}
		},
		onReachBottom() {

		}
	}
</script>

<style lang="scss" scoped>
	.refund-details-contain {}

	.refund-top {
		margin-top: 2rpx;
		padding: 40rpx 36rpx;
		background: #FFFFFF;
		border-radius: 16rpx 16rpx 10rpx 10rpx;

		.prompt {
			padding-bottom: 40rpx;
			border-bottom: 2rpx dashed #DCDCDC;

			.prompt-status {
				font-weight: bold;
				font-size: 36rpx;
				color: #303133;
				margin-bottom: 2rpx;
			}

			.text {
				font-weight: bold;
				font-size: 28rpx;
				line-height: 40rpx;
				color: #909199;
			}
		}

		.amount-contain {
			padding-top: 34rpx;

			.item {
				display: flex;
				justify-content: space-between;
				margin-bottom: 30rpx;

				&:last-child {
					margin-bottom: 0rpx;
				}

				text {
					font-size: 28rpx;
					font-weight: bold;
					line-height: 40rpx;
				}

				.item-left {
					color: #909199;
				}

				.item-right {
					color: #303133;
				}
			}
		}
	}

	.refund-middle {
		background: #FFFFFF;
		border-radius: 10rpx;
		min-height: 944rpx;
		margin-top: 14rpx;
		padding: 34rpx 42rpx;

		.header-contain {
			display: flex;
			justify-content: space-between;
			padding-bottom: 20rpx;
			border-bottom: 2rpx dashed #EEEEEE;

			.h-left {
				font-weight: bold;
				font-size: 30rpx;
				line-height: 42rpx;
				color: #303133;
			}

			.h-right {
				display: flex;
				align-items: center;

				text {
					font-weight: bold;
					font-size: 28rpx;
					line-height: 40rpx;
					color: #909199;
				}

				image {
					width: 54rpx;
					height: 54rpx;
					margin-right: 16rpx;
				}
			}

		}


		.middle-contain {
			margin-top: 20rpx;

			.order-middle {
				padding-bottom: 22rpx;
				display: flex;
				flex-direction: column;
				border-bottom: 2rpx solid #F3F3F3;

				.order-middle-contain {
					display: flex;
				}

				.order-middle-image {
					margin-right: 28rpx;
					width: 176rpx;
					height: 176rpx;
				}

				.order-attachments-coverNew {
					position: relative;
				}

				.order-information {
					display: flex;
					flex-direction: column;
					flex: 1;

					.skill-type-contain {
						display: flex;
						align-items: center;
						justify-content: space-between;
						margin-bottom: 8rpx;
						margin-top: 10rpx;

						.skill-type {
							margin-top: 6rpx;
						}

						.skill-type-all {
							display: flex;
							flex-direction: row;
						}

						.order-offer {
							font-size: 32rpx;
							color: #FF5D35;
							font-weight: bold;
						}
					}

					.order-brand-contain {
						display: flex;
						width: 100%;
						align-items: center;
						margin-bottom: 10rpx;
						justify-content: space-between;

						.order-num {
							font-weight: bold;
							font-size: 24rpx;
							line-height: 34rpx;
							text-align: center;
							color: #303133;

						}
					}

					.distance {
						margin-left: 20rpx;
					}

					.distance,
					.order-brand {
						color: #909299;
						font-size: 28rpx;
					}

					.order-brand {
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
						max-width: 352rpx;
					}

					.order-name {
						font-weight: bold;
						font-size: 28rpx;
						line-height: 40rpx;
						color: #303133;
						max-width: 300rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
					}

				}
			}

			.refund-reason {
				padding-top: 46rpx;
				position: relative;

				.order-copy {
					position: absolute;
					right: 10rpx;
					top: 30rpx;
					width: 44rpx;
					height: 44rpx;
				}

				.reason-item {
					margin-bottom: 28rpx;

					&:last-child {
						margin-bottom: 0;
					}

					text {
						font-weight: bold;
						font-size: 28rpx;
						line-height: 40rpx;
						color: #666666;
					}

					.item-pic{
						color: #FF5D35;
					}

					.item-image-contain {
						display: flex;
						margin-top: 20rpx;

						.recommended-image {
							width: 172rpx;
							height: 172rpx;
							margin-right: 22rpx;

							&:last-child {
								margin-right: 0rpx;
							}
						}
					}
				}
			}
		}
	}
</style>
