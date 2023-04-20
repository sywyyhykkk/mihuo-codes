<template>
	<view>
		<view class="nav-bar no-stock" v-if="commodity.stock == 0">
			缺货
		</view>
		<view class="card" @click="goToProductDetail" :style="{ opacity: commodity.stock == 0 ? '0.2' : '1' }">
			<image :id="commodity.id" @error="onImageLoadError" lazy-load="true" class="img" :src="commodityCover"
				:key="commodity.id"></image>
			<view class="product-activity flex-center">
				<view class="activity-item" v-if="commodity.groupBuyFlag === 1">
					拼团抢购
				</view>
				<view class="activity-item" v-if="commodity.flashPromotionFlag === 1">
					限时秒杀
				</view>
			</view>
			<view class="title">
				<text class="package-label" v-if="commodity.customCategory === '1003'">
					品质套餐
				</text>
				{{ commodity.name || '商品名称' }}
			</view>
			<view class="footer-container flex-center">
				<view v-if="commodity.customCategory == '1003' && commodity.basePrice" class="price flex-center">
					<!-- 套餐金额 -->
					<view class="price-symbol">¥</view> {{Math.floor(commodity.basePrice) || 0}}
					<view class="small-text" v-if="commodity.basePrice !== 0">
						{{ commodity.basePrice | priceFormat }}{{ commodity.unit ? '/' + commodity.unit : '' }}
					</view>
					<view class="origin-price" v-if="commodity.originalPrice">¥{{ commodity.originalPrice }}</view>
				</view>
				<view class="price flex-center" v-else>
					<view class="price-symbol">¥</view> {{Math.floor(commodity.price) || 0}}
					<view class="small-text" v-if="commodity.price !== 0">
						{{ commodity.price | priceFormat }}{{ commodity.unit ? '/' + commodity.unit : '' }}
					</view>
					<view class="origin-price" v-if="commodity.originalPrice">¥{{ commodity.originalPrice }}</view>
				</view>
				<view class="sale">{{ commodity.sale }}人购买</view>
			</view>
			<view class="commodity-tags" v-if="commodity.tags && commodity.tags.length">
				<text class="commodity-tags-item" v-for="(item, i) in commodity.tags.split(',')" :key="i">
					{{ item }}
				</text>
			</view>
			<view class="company-info flex-center" @click.stop="goToShop" v-if="isShowCompanyInfo">
				<u-lazy-load v-if="commodity.companyLogo" height="30" class="lazy-img" :style="{ width: '30rpx' }"
					imgMode="aspectFill" border-radius="30" :image="$util.thumbnailImage(commodity.companyLogo,true)">
				</u-lazy-load>
				<view class="text">
					{{ commodity.companyName }}
				</view>
				<!-- #ifdef H5 || APP-PLUS -->
				<u-icon name="arrow-right" color="#000000" size="14"></u-icon>
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<u-icon name="arrow-right" top="2rpx" color="#000000" size="14"></u-icon>
				<!-- #endif -->
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "mall-mh-commodity-card",
		props: {
			commodity: {},
			isShowCompanyInfo: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				commodityCover: ''
			};
		},
		mounted() {
			this.commodityCover = this.$util.thumbnailImage(this.commodity.coverImg)
		},
		methods: {
			// 图片加载错误
			onImageLoadError(e) {
				this.commodityCover = ''
				setTimeout(() => {
					this.commodityCover = this.$util.thumbnailImage(this.commodity.coverImg)
				}, 50)
			},
			// 查看商品
			goToProductDetail() {
				if (this.isShowCompanyInfo) {
					this.toPage(`/pages-mall/productDetail/productDetail?id=${this.commodity.id}`)
				} else {
					this.toPage(`/pages-mall/productDetail/productDetail?id=${this.commodity.id}&from=shop`)
				}
			},
			// 店铺页面
			goToShop() {
				if (this.commodity.companyId != -1) {
					this.toPage(`/pages-mall/shopInformation/shopInformation?companyId=${this.commodity.companyId}`)
				} else {
					const data = {
						companyLogo: this.commodity.companyLogo,
						companyShortName: this.commodity.companyName,
						completeAddress: this.commodity.completeAddress,
						contactTel: this.commodity.companyTel
					}
					this.toPage(
						`/pages-mall/shopInformation/shopInformation?cityOperatorId=${this.commodity.cityOperatorId}&data=${JSON.stringify(data)}`
					)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.no-stock {
		position: absolute;
		margin-top: 20%;
		margin-left: 130rpx;
		z-index: 99;
	}

	.card {
		width: 330rpx;
		height: max-content;
		background-color: #fff;
		margin-bottom: 50rpx;
		border-radius: 20rpx;
		position: relative;
		
		.product-activity {
			position: absolute;
			top: 290rpx;
			left: 10rpx;
			gap: 10rpx;
			justify-content: space-between;
			
			.activity-item {
				width: max-content;
				height: 32rpx;
				padding: 0 10rpx;
				text-align: center;
				background: linear-gradient(90deg, #FFB54D, #FF3A33);
				border-radius: 6rpx;
				font-size: 20rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				color: #FFFFFF;
				line-height: 32rpx;
			}
		}

		.img {
			width: 330rpx;
			height: 330rpx;
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

		.commodity-tags {
			margin-top: 20rpx;
			display: flex;
			flex-wrap: wrap;

			.commodity-tags-item {
				border-radius: 4rpx;
				border: 2rpx solid #FE6E32;
				color: #FE6E32;
				background: #FFF0EA;
				padding: 4rpx;
				font-size: 16rpx;
				font-family: NotoSansHans-Regular;
				margin: 0 10rpx 10rpx 0;
			}
		}

		.company-info {
			width: 330rpx;
			margin-top: 16rpx;

			.lazy-img {
				margin-right: 9rpx;
			}

			.text {
				height: 28rpx;
				font-size: 16rpx;
				line-height: 28rpx;
				color: #000000;
				font-family: NotoSansHans-Regular;
			}
		}

		.flex-center {
			display: flex;
			align-items: center;
		}
	}
</style>
