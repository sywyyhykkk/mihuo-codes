<template>
	<view>
		<view class="main-container flex-center">
			<u-swiper height="498" class="coupon-img" :current="currentCoupon" v-if="dataList.length > 0"
				:list="dataList" @change="onSwiperChange" name="mainImg" :autoplay="false" :interval="5000"
				:duration="500" :circular="false" border-radius="20" img-mode="aspectFill" mode="dot"
				:showIndicator="true" @click="goToDetail">
			</u-swiper>
			<view class="coupon-button" @click="goToDetail">
				立即领取
			</view>
		</view>
		<image class="close-icon" @click="closeCoupon"
			src="https://www.51mihuo.com/static/icon/home_v3/coupon-close.png"></image>
	</view>
</template>

<script>
	export default {
		name: "coupon-popup",
		props: {
			couponList: {
				type: Array,
				default: () => {
					return []
				}
			}
		},
		data() {
			return {
				currentCoupon: 0, // 当前优惠券
				dataList: []
			};
		},
		mounted() {
			if (this.couponList.length) {
				this.dataList = this.couponList.map(item => {
					return {
						...item,
						mainImg: this.$util.thumbnailImage(item.mainImg, true, 750)
					}
				})
			}
		},
		methods: {
			setData(data){
				this.dataList = data.map(item => {
					return {
						...item,
						mainImg: this.$util.thumbnailImage(item.mainImg, true, 750)
					}
				})
			},
			onSwiperChange(e) {
				this.currentCoupon = e
			},
			goToDetail() {
				const coupon = this.dataList[this.currentCoupon]
				this.toPage(`/pages-mall/couponDetail/couponDetail?couponId=${coupon.id}&useStatus=-1`)
				this.closeCoupon()
			},
			closeCoupon() {
				this.$emit('close')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.main-container {
		width: 630rpx;
		height: 850rpx;
		background-image: url('https://www.51mihuo.com/static/icon/home_v3/main-coupon-bg.png');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		flex-direction: column;
		justify-content: center;
		padding-top: 180rpx;
		margin-top: -200rpx;

		.coupon-img {
			width: 498rpx;
			height: 498rpx;
			border-radius: 10rpx;
		}

		.coupon-button {
			width: 316rpx;
			height: 69rpx;
			margin-top: 30rpx;
			background: #000000;
			border-radius: 35rpx;
			font-size: 28rpx;
			font-family: Noto Sans S Chinese;
			font-weight: 500;
			color: #F7EBCD;
			text-align: center;
			line-height: 69rpx;
		}
	}

	.close-icon {
		width: 60rpx;
		height: 60rpx;
		margin: 60rpx auto 0 auto;
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
