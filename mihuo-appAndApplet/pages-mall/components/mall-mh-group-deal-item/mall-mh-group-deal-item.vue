<template>
	<view class="item-container flex-center" @click="goToDetail">
		<u-lazy-load imgMode="scallToFit" height="260" :hasBottomRadius="true" border-radius="15"
			:image="$util.thumbnailImage(item.productCoverImg, true, 260)" class="product-img">
		</u-lazy-load>
		<view class="product-info flex-center">
			<view class="product-name">
				{{ item.productName }}
			</view>
			<view class="product-shop flex-center">
				<view class="shop-name flex-center">
					<u-avatar :image="$util.thumbnailImage(item.companyLogo, true, 36)" size="36" style="margin-right: 10rpx;"></u-avatar>
					{{ item.companyName}}
				</view>
				<view class="product-sale">
					已拼{{ item.groupBuyCount }}件
				</view>
			</view>
			<view class="product-button flex-center">
				<view class="product-price">
					<view class="upper">
						<text style="font-size: 20rpx;">¥</text>
						<text style="font-size: 32rpx;">
							{{ Math.floor(item.flashPromotionPrice) }}
						</text>
						<text style="font-size: 20rpx;">
							{{ item.flashPromotionPrice | priceFormat }}
						</text>
					</view>
					<view class="lower">
						<text style="font-size: 20rpx;">¥</text>
						<text style="font-size: 20rpx;">
							{{ item.skuPrice }}
						</text>
					</view>
				</view>
				<view class="deal-button flex-center">
					<text class="text" style="font-size: 20rpx;">{{ item.groupCount }}人团</text>
					<view class="line"></view>
					<text class="text" style="font-size: 20rpx;">去拼团</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			item: {
				type: Object,
				default: () => {
					return {}
				}
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			// 跳转到商品详情
			goToDetail(){
				this.toPage(`/pages-mall/productDetail/productDetail?id=${this.item.productId}`)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.item-container {
		width: 690rpx;
		height: 260rpx;
		margin-bottom: 30rpx;
		
		.product-img {
			width: 260rpx;
			height: 260rpx;
			border-radius: 15rpx;
		}
		
		.product-info {
			width: 410rpx;
			height: 260rpx;
			margin-left: 20rpx;
			padding-top: 20rpx;
			flex-direction: column;
			justify-content: space-between;
			
			.product-name {
				width: 100%;
				height: max-content;
				max-height: 80rpx;
				font-size: 32rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 400;
				color: #333333;
				line-height: 40rpx;
				@include bov(2);
			}
			
			.product-shop {
				width: 100%;
				height: 34rpx;
				margin-top: 20rpx;
				
				.shop-name {
					width: 70%;
					font-size: 16rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #000000;
					line-height: 34rpx;
					@include toe();
				}
				
				.product-sale {
					width: 30%;
					font-size: 24rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 500;
					color: #000000;
					line-height: 34rpx;
				}
			}
			
			.product-button {
				width: 410rpx;
				height: 90rpx;
				margin-top: 20rpx;
				background: linear-gradient(90deg, #FFF4E5, #FFE6E5);
				border-radius: 15rpx;
				padding: 0 20rpx;
				justify-content: space-between;
				
				.product-price {
					.upper {
						text {
							font-family: Noto Sans S Chinese;
							font-weight: 500;
							color: #ED3832;
							line-height: 34rpx;
						}
					}
					
					.lower {
						text {
							font-family: Noto Sans S Chinese;
							font-weight: 500;
							text-decoration: line-through;
							color: #000000;
							line-height: 34rpx;
						}
					}
				}
				
				.deal-button {
					width: 189rpx;
					height: 60rpx;
					background: linear-gradient(90deg, #FFB54D, #FF3A33);
					border-radius: 30rpx;
					justify-content: center;
					
					.line {
						width: 1rpx;
						height: 20rpx;
						background: rgba(255,255,255,0.4);
						border-radius: 1rpx;
						margin: 0 10rpx;
					}
					
					.text {
						font-size: 24rpx;
						font-family: Noto Sans S Chinese;
						font-weight: 400;
						color: #FFFFFF;
						line-height: 34rpx;
					}
				}
			}
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
