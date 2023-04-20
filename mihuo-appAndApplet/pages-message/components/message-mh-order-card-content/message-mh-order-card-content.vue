<template>
	<view class="card-content" style="padding: 0;">
		<view class="imageContent">
			<u-image border-radius="10" width="160" height="160"
				src="https://ns-strategy.cdn.bcebos.com/ns-strategy/upload/fc_big_pic/part-00047-3415.jpg" />
			</u-image>
		</view>
		<view style="width: 100%;">
			<view class="mini-title">
				<view class="ordertype">{{orderDetail.requirementName}}</view>
				<view class="ordermoney">{{orderDetail.price}}元</view>
				<slot name="close"></slot>
			</view>
			<view class="order-no">订单号：{{orderDetail.orderCode}}</view>
			<view class="address">施工地址：{{orderDetail.address}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "order-card-content",
		props: {
			orderDetail: {
				type: Object,
				default: () => ({})
			},
		},
		data() {
			return {

			};
		}
	}
</script>
<style lang="scss" scoped>
	@import '@/style/mixin.scss';
	.sendCard {
		position: fixed;
		bottom: 140rpx;
		width: 96%;
		margin: 0 2%;
	}
	.card {
		background-color: #FFFFFF;
		padding: 24rpx;
		border-radius: 10rpx;
		.status-button {
			background-color: #fff;
			color: #999;
			font-size: 28rpx;
		}
		.actionButton {
			margin-top: 30rpx;
			display: flex;
			height: 60rpx;
			justify-content: center;
			.cancel,
			.sure {
				height: 60rpx;
				line-height: 60rpx;
				width: 120rpx;
				display: inline-block;
			}
			.cancel {
				border: 1px solid #EEEEEE;
				box-sizing: border-box;
				border-radius: 5px;
				color: #666;
			}
			.sure {
				@include theme('btn_bg');
				color: #fff;
				margin-left: 76rpx;
			}
		}
		.title {
			font-size: 30rpx;
			line-height: 42rpx;
			color: #303133;
			margin-bottom: 20rpx;
		}
		.card-content {
			display: flex;
			.mini-title {
				padding-left: 20rpx;
				font-weight: normal;
				font-size: 24rpx;
				line-height: 34rpx;
				color: #909299;
				width: 100%;
				margin-bottom: 8rpx;
				display: flex;

				.ordertype {
					flex: 1;
					font-size: 28rpx;
					line-height: 40rpx;
					color: #303133;
				}
				.ordermoney {
					font-weight: bold;
					font-size: 15px;
					line-height: 21px;
					color: $themeColor;
				}
			}
			.order-no,
			.address {
				padding-left: 20rpx;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: normal;
				font-size: 24rpx;
				line-height: 34rpx;
				color: #909299;
				width: 100%;
			}
		}
	}
</style>

