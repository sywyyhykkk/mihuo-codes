<template>
	<view>
		<public-module></public-module>
		<z-nav-bar title="报价成功" bgColor="#fff">
			<view class="icon_setUp" slot="right" @click="isMenuOpen=!isMenuOpen">
			</view>
		</z-nav-bar>
		<view class="offerSuccess">
			<image src="../../static/images/success.png" class="success_image"></image>
			<view class="success_text">报价成功</view>
			<view class="success_text_prompt">您已报价成功。请及时关注订单状态</view>
			<view class="order_no">
				<span class="order_no_text">订单编号</span>
				<span class="order_no_value">{{ orderCode }}</span>
			</view>
			<view class="order_button">
				<view class="order_detial" @click="orderDetial">订单详情</view>
				<!-- <view class="modify_quotation" @click="eidtOffer">修改报价</view> -->
				<view style="clear: both;"></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderCode: ''
			}
		},
		onLoad(option) {
			this.orderCode = option.orderCode
		},
		methods: {
			orderDetial() {
				const delta = 2
				uni.navigateBack({
					delta: delta,
					success: () => {
						const pages = getCurrentPages() // 获取当前页面栈数组，第一个元素为首页，最后一个元素为当前页面
						let page = pages[Math.max(pages.length - 1 - delta, 0)] // 要返回到的页面，超过页面栈，则为首页
					}
				});
			},
			// eidtOffer(){
			// 	const delta = 1
			// 	uni.navigateBack({delta:delta,  success: () => {
			// 	        const pages = getCurrentPages() // 获取当前页面栈数组，第一个元素为首页，最后一个元素为当前页面
			// 	        let page = pages[Math.max(pages.length - 1 - delta, 0)] // 要返回到的页面，超过页面栈，则为首页
			// 	    }
			// 	});
			// }
		}
	}
</script>

<style lang="scss" scoped>
	.order_button {
		margin-top: 150rpx;

		.modify_quotation {
			// margin-right: calc(50% - 154px);
			margin-left: 40rpx;
			width: 268rpx;
			float: left;
			line-height: 90rpx;
			border-radius: 10rpx;
			background: linear-gradient(to right, $themeColor, $themeColor);
			text-align: center;
			color: #FFFFFF;
			font-size: 28rpx;
		}

		.order_detial {
			margin: 0 auto;
			width: 268rpx;
			line-height: 90rpx;
			text-align: center;
			border-radius: 10rpx;
			border: solid 2rpx #E0E0E0;
			color: #909299;
			font-size: 28rpx;
		}
	}

	.success_image {
		height: 136rpx;
		width: 136rpx;
		margin: 0 auto;
		margin-top: 160rpx;
	}

	.order_no {
		width: 100vw;
		margin: 0 auto;
		margin-top: 160rpx;
		text-align: center;
		line-height: 40rpx;

		.order_no_text {
			color: #999999;
			font-size: 28rpx;
			margin: 0 auto;
			text-align: center;
		}

		.order_no_value {
			margin: 0 auto;
			margin-left: 20rpx;
			font-size: 28rpx;
		}
	}

	.success_text_prompt {
		font-size: 28rpx;
		color: #999999;
		margin: 0 auto;
		margin-top: 20rpx;
		text-align: center;
	}

	.success_text {
		font-size: 40rpx;
		font-weight: 600;

		margin: 0 auto;
		margin-top: 20rpx;
		text-align: center;
	}
</style>
