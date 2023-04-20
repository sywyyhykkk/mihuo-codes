<template>
	<view>
		<view class="title-back">
		</view>
		<view class="order-title-detial">
			<order-title-detial></order-title-detial>
		</view>
		<view class="offer">
			<view class="offer-title">报价方式</view>
			<view class="offer-price">
				<view class="price-text">一口价</view>
				<view class="price-num">360元</view>
			</view>
		</view>
		<view class="offer">
			<view class="offer-title">需求及附件</view>
			<view class="accessory">
				<view class="accessory-desc">
					需求描述内容，及时预约客户，不要评价商品，带 齐安装工具，安装价格保密，不拿走客户配件。
				</view>
				<view class="accessory-image">
					<image :src="'../../static/demo/2.jpg'" class="image-con" v-for="item in 3" :key="index"></image>
				</view>
				<mihuo-audio></mihuo-audio>
			</view>
		</view>
		<view class="offer">
			<view class="offer-title">指派工匠</view>
			<view class="work-people">
				<work-people v-for="item in 3" :key="item"></work-people>
			</view>
		</view>
	</view>
</template>

<script>
</script>

<style scoped lang="scss">
	.offer {
		margin: 10rpx 20rpx 0 20rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
		.work-people{
			
		}
		

		.accessory {
			padding: 30rpx 20rpx 30rpx 30rpx;

			.accessory-desc {
				font-weight: normal;
				font-size: 28rpx;
				line-height: 40rpx;
				color: #666666;

			}

			.accessory-image {
				display: flex;
				justify-content: space-between;
				margin-top: 30rpx;
				margin-bottom: 30rpx;

				.image-con {
					width: 200rpx;
					height: 200rpx;
					border-radius: 10rpx;

				}
			}
		}

		.offer-price {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 114rpx;

			.price-text {
				font-weight: bold;
				font-size: 28rpx;
				color: #666666;
				margin-left: 30rpx;

			}

			.price-num {
				font-weight: bold;
				font-size: 32rpx;
				color: #FF5D35;
				margin-right: 30rpx;

			}
		}

		.offer-title {
			font-weight: bold;
			font-size: 32rpx;
			line-height: 100rpx;
			color: $seconFontColor;
			padding-left: 30rpx;
			border-bottom: 1rpx solid #eeeeee;
		}
	}

	.order-title-detial {
		margin-top: -100rpx;
	}

	.title-back {
		height: 120rpx;
		background: $themeColor;
	}
</style>
