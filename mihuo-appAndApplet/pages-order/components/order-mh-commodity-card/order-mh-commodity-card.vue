<template>
	<view class="card">
		<!-- #ifdef MP-WEIXIN -->
		<order-mh-mihuo-image class="img" border-radius="20" :upper-radius="true" :src="$util.thumbnailImage(commodity.coverImg)" mode="widthFix"
			:key="commodity.id"></order-mh-mihuo-image>
		<!-- #endif -->
		<!-- #ifndef MP -->
		<order-mh-mihuo-image class="img" border-radius="20" :upper-radius="true" :src="$util.thumbnailImage(commodity.coverImg)"
			:key="commodity.id"></order-mh-mihuo-image>
		<!-- #endif -->
		<view class="title">
			<text class="package-label" v-if="commodity.customCategory === '1003'">
				品质套餐
			</text>
			{{commodity.name || '商品名称'}}
		</view>
		<view class="footer-container flex-center">
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
		name: "order-mh-commodity-card",
		props: {
			commodity: {}
		},
		data() {
			return {};
		},
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.card {
		width: 330rpx;
		height: max-content;
		background-color: #fff;
		margin-bottom: 50rpx;
		border-radius: 20rpx;

		.img {
			width: 330rpx;
			/* #ifndef MP */
			height: 330rpx;
			/* #endif */
			border-radius: 20rpx 20rpx 0 0;
		}

		.title {
			width: 330rpx;
			height: max-content;
			margin-top: 24rpx;
			font-family: PingFang SC;
			font-style: normal;
			font-size: 28rpx;
			line-height: 40rpx;
			color: #000000;
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
			width: 330rpx;
			margin-top: 16rpx;
			padding: 0 8rpx;
			justify-content: space-between;

			.price {
				align-items: flex-end;
				font-family: Microsoft YaHei;
				font-style: normal;
				font-weight: bold;
				font-size: 32rpx;
				line-height: 34rpx;
				color: #ED3832;
				@include toe();

				.price-symbol {
					height: 32rpx;
					font-family: Microsoft YaHei;
					font-style: normal;
					font-weight: bold;
					font-size: 20rpx;
					color: #ED3832;
					margin-right: 4rpx;
				}

				.small-text {
					height: 24rpx;
					font-family: Microsoft YaHei;
					font-style: normal;
					font-size: 20rpx;
					line-height: 20rpx;
					color: #ED3832;
				}

				.origin-price {
					height: 28rpx;
					margin-left: 10rpx;
					font-size: 20rpx;
					line-height: 28rpx;
					color: #999999;
					text-decoration: line-through;
				}
			}

			.sale {
				height: 38rpx;
				font-family: PingFang SC;
				font-style: normal;
				font-size: 20rpx;
				line-height: 38rpx;
				color: #A8A8A8;
				@include toe();
			}
		}

		.flex-center {
			display: flex;
			align-items: center;
		}
	}
</style>
