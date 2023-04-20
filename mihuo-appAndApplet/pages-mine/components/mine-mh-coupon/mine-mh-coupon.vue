<template>
	<view class="coupon-container flex-center" @click="goToDetail">
		<view class="left">
			<view class="price flex-center" v-if="coupon.type === 0">
				<!-- 满减券 -->
				<text class="price-symbol">¥</text>
				{{ coupon.amount }}
			</view>
			<view class="price flex-center" v-else>
				<!-- 折扣券 -->
				{{ Number(coupon.amount) * 10 }}折
			</view>
			<view class="des">
				满{{ coupon.minPoint }}元可用
			</view>
		</view>
		<view class="center">
			<view class="center-title">
				{{ coupon.name }}
			</view>
			<view class="time">
				{{ coupon.startTime }} 至 {{ coupon.endTime }}
			</view>
			<view class="color-text">
				{{ coupon.useType === 0 ? '全场通用' : coupon.useType === 1 ? '指定分类可用' : '指定商品可用' }}
				<text class="limitation">
					{{ coupon.minPoint ? `满${coupon.minPoint}元可用` : '无门槛' }}
				</text>
			</view>
		</view>
		<view class="right-button flex-center" @click.stop="rightButtonClick">
			<view class="price" v-if="coupon.type === 0">
				<text class="price-symbol">¥</text>
				{{ coupon.amount }}
			</view>
			<view class="price" v-else>
				{{ Number(coupon.amount) * 10 }}折
			</view>
			<view class="button use" v-if="coupon.useStatus == -1 || coupon.useStatus == 0"
				:style="{ color: coupon.useStatus === 0 ? '#FFFFFF' : '', backgroundColor: coupon.useStatus === 0 ? '#000000' : '#FE6E32' }">
				{{ coupon.useStatus === -1 ? coupon.productId ? '购买' : '领取' : coupon.useStatus === 0 ? '使用' : ''}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			coupon: {
				type: Object,
				default: () => {
					return {}
				}
			}
		},
		data() {
			return {}
		},
		methods: {
			goToDetail() {
				this.toPage(
					`/pages-mall/couponDetail/couponDetail?couponId=${this.coupon.id}&receiveCount=${this.coupon.receiveCount}&useStatus=${this.coupon.useStatus}`
				)
			},
			rightButtonClick() {
				if (this.coupon.useStatus === 0) {
					// 去使用
					if (this.coupon.useType === 2 && this.coupon.productIds) {
						// 指定商品
						this.toPage(`/pages-mall/productDetail/productDetail?id=${this.coupon.productIds.split(',')}`)
					} else {
						// 指定分类 全场通用
						this.toTab('/pages/category/category')
					}
				} else if (this.coupon.useStatus === -1) {
					// 领取优惠券
					this.goToDetail()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.coupon-container {
		width: 690rpx;
		height: 156rpx;
		margin-top: 30rpx;
		border-radius: 5px;
		background-image: url('https://www.51mihuo.com/static/icon/personal_center_v2/coupon_bg.png');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;

		.left {
			width: 163rpx;
			font-size: 32rpx;

			.price {
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				color: #FFFFFF;
				justify-content: center;

				.price-symbol {
					color: #FFFFFF;
					margin-top: 4rpx;
					margin-right: 4rpx;
					font-size: 20rpx;
				}
			}

			.des {
				width: 100%;
				text-align: center;
				font-size: 20rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 400;
				color: #808080;
			}
		}

		.center {
			width: 377rpx;
			padding-left: 20rpx;

			.center-title {
				font-size: 24rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				color: #333333;
			}

			.time {
				font-size: 20rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 400;
				color: #808080;
			}

			.color-text {
				font-size: 20rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 400;
				color: #ED3832;

				.limitation {
					font-size: 20rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #999999;
					margin-left: 20rpx;
				}
			}
		}

		.right-button {
			width: 150rpx;
			flex-direction: column;
			justify-content: center;
			border-left: 2rpx #E6E6E6 solid;

			.price {
				font-size: 32rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				color: #000000;

				.price-symbol {
					font-size: 20rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 500;
					color: #000000;
					margin-right: 4rpx;
				}
			}

			.button {
				width: 80rpx;
				height: 40rpx;
				border-radius: 20rpx;
				text-align: center;
				line-height: 40rpx;
				font-size: 20rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				color: #000000;
			}

			.use {
				background: #FE6E32;
			}
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
