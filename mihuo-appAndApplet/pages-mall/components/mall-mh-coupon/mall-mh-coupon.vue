<template>
	<view class="coupon-container flex-center">
		<view class="left" @click="onChange">
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
		<view class="center" @click="onChange">
			<view class="center-title">
				{{ coupon.name }}
			</view>
			<view class="time">
				{{ coupon.startTime }} 至 {{ coupon.endTime }}
			</view>
			<view class="color-text">
				{{ coupon.useType === 0 ? '全场通用' : coupon.useType === 1 ? '指定分类可用' : '指定商品可用' }}
				<text class="limitation">
					每人限{{ coupon.perLimit || 0 }}张
				</text>
			</view>
		</view>
		<view class="right-button flex-center" v-if="coupon.id && !readonly">
			<u-checkbox :value="couponCode == selectedCouponCode" @change="onChange" shape="circle" />
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 是否只是展示内容
			readonly: {
				type: Boolean,
				default: false
			},
			selectedCouponId: {
				type: [String, Number],
				default: ''
			},
			coupon: {
				type: Object,
				default: () => {
					return {}
				}
			},
			selectedCouponCode: {
				type: String,
				default: ''
			},
			couponCode: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				
			}
		},
		mounted() {},
		methods: {
			onChange() {
				this.$emit('selectCoupon', this.coupon, this.couponCode)
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
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
