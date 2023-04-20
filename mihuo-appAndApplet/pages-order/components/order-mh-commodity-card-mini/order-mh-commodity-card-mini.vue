<template>
	<view class="card" @click="goToDetail">
		<image class="img" :src="$util.thumbnailImage(commodity.coverImg)"
			:key="commodity.id"></image>
		<view class="title">
			<text class="package-label" v-if="commodity.customCategory === '1003'">
				品质套餐
			</text>
			{{ commodity.name || '商品名称'}}
		</view>
		<view class="footer-container flex-center" v-if="commodity">
			<view class="price flex-center" v-if="commodity.customCategory == '1003' && commodity.basePrice">
				<view class="price-symbol">¥</view> {{Math.floor(commodity.basePrice) || 0}}
				<view v-if="commodity.basePrice !== 0">
					{{ commodity.basePrice | priceFormat }}{{ commodity.unit ? '/' + commodity.unit: '' }} </view>
				<view class="origin-price" v-if="commodity.originalPrice">¥{{ commodity.originalPrice }}</view>
			</view>
			<view class="price flex-center" v-else>
				<view class="price-symbol">¥</view> {{Math.floor(commodity.price) || 0}}
				<view v-if="commodity.price !== 0">
					{{ commodity.price | priceFormat }}{{ commodity.unit ? '/' + commodity.unit: '' }} </view>
				<view class="origin-price" v-if="commodity.originalPrice">¥{{ commodity.originalPrice }}</view>
			</view>
			<view class="sale">{{ commodity.sale }}人购买</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "order-mh-commodity-card-mini",
		props: {
			commodity: {}
		},
		data() {
			return {};
		},
		mounted() {},
		methods: {
			goToDetail() {
				uni.redirectTo({
					url: `/pages-mall/productDetail/productDetail?id=${this.commodity.id}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.card {
		width: 335rpx;
		height: max-content;
		padding: 14rpx 7rpx;
		background-color: #fff;
		
		.img {
			width: 335rpx;
			height: 330rpx;
			border-radius: 20rpx 20rpx 0 0;
		}

		.title {
			margin-top: 10rpx;
			width: 328rpx;
			height: max-content;
			font-family: PingFang SC;
			font-style: normal;
			font-weight: bold;
			font-size: 28rpx;
			line-height: 40rpx;
			color: #303133;
			@include bov(2);
			
			.package-label {
				padding: 0 10rpx;
				background: #FE6E32;
				border-radius: 6rpx;
				text-align: center;
				font-size: 26rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 400;
				color: #FFFFFF;
				margin-right: 8rpx;
			}
		}

		.footer-container {
			width: 328rpx;
			justify-content: space-between;
			margin-top: 10rpx;

			.price {
				align-items: flex-end;
				font-family: Microsoft YaHei;
				font-style: normal;
				font-weight: bold;
				font-size: 34rpx;
				line-height: 34rpx;
				color: #FF5D35;
			
				.price-symbol {
					height: 30rpx;
					font-family: Microsoft YaHei;
					font-style: normal;
					font-weight: bold;
					font-size: 24rpx;
					color: #FF5D35;
					margin-right: 2rpx;
				}
			
				.small-text {
					height: 24rpx;
					font-family: Microsoft YaHei;
					font-style: normal;
					font-weight: bold;
					font-size: 24rpx;
					line-height: 22rpx;
					color: #FF5D35;
				}
			}
			
			.origin-price {
				margin-right: 30rpx;
				font-size: 20rpx;
				line-height: 28rpx;
				color: #999999;
				text-decoration: line-through;
			}
		}

		.flex-center {
			display: flex;
			align-items: center;
		}
	}
</style>
