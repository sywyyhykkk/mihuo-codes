<template>
	<view>
		<z-nav-bar :scrollTop="scrollTop" type="transparentFixed" fontColor="#FFFFFF" :bgColor="['#FF9A52', '#FF6A32']">
			<view slot="right" class="right-container flex-center">
				<view class="share-icon flex-center">
					<uni-icons type="upload" size="20" color="#FFFFFF" @click="shareCoupon"></uni-icons>
				</view>
			</view>
			<view slot="transparentFixedRight" class="right-container flex-center">
				<view class="share-icon icon-bg flex-center">
					<uni-icons type="upload" size="20" color="#FFFFFF" @click="shareCoupon"></uni-icons>
				</view>
			</view>
		</z-nav-bar>
		<view class="main-container">
			<image class="coupon-image" :src="$util.thumbnailImage(coupon.coverImg, true, 750)"></image>
			<view class="coupon-name">
				{{ coupon.name }}
			</view>
			<view class="coupon-info flex-center">
				<view class="left" v-if="coupon.type === 0">
					<text class="text" style="font-size: 24rpx;">
						¥
					</text>
					<text class="text" style="font-size: 34rpx;">
						{{ Math.floor(coupon.amount || 0) }}
					</text>
					<text class="text" style="font-size: 24rpx;">
						{{ coupon.amount | priceFormat }}
					</text>
					<text class="price-tag">
						{{ coupon.minPoint ? `满${coupon.minPoint}元可用` : '无门槛' }}
					</text>
				</view>
				<view class="left" v-else>
					<text class="text" style="font-size: 34rpx;">
						{{ coupon.amount * 10 }}折
					</text>
					<text class="price-tag">
						{{ coupon.minPoint ? `满${coupon.minPoint}元可用` : '无门槛' }}
					</text>
				</view>
				<view class="right">
					{{ `限${coupon.issuanceType === 2 ? '购' : '领' }${coupon.perLimit}张` }}
				</view>
			</view>
			<mall-mh-menu-item fontColor="#000000" :border="true" title="适用范围" height="100" :isShowArrow="false">
				<view class="slot-content flex-center">
					<view class="content-text">
						{{ coupon.useType === 0 ? '全场通用' : coupon.useType === 1 ? '指定分类可用' : '指定商品可用' }}
					</view>
				</view>
			</mall-mh-menu-item>
			<mall-mh-menu-item fontColor="#000000" :border="true" title="有效时间" height="100" :isShowArrow="false">
				<view class="slot-content flex-center">
					<view class="content-text">
						{{ coupon.startTime }} 至 {{ coupon.endTime }}
					</view>
				</view>
			</mall-mh-menu-item>
			<mall-mh-menu-item fontColor="#000000" :border="true" :title="coupon.type === 0 ? '优惠券额度' : '优惠券折扣'"
				height="100" :isShowArrow="false">
				<view class="slot-content flex-center">
					<view class="color-text" v-if="coupon.type === 0">
						抵{{ coupon.amount }}元
					</view>
					<view class="color-text" v-else>
						{{ coupon.amount * 10 }}折
					</view>
				</view>
			</mall-mh-menu-item>
			<view class="coupon-rule">
				<edit-view v-model="coupon.description"></edit-view>
			</view>
		</view>
		<bottom-button v-if="isShowButton" :title="coupon.productId ? '立即购买' : '立即领取'"
			:styleObj="{ backgroundColor: '#000000' }" @click="submitOrder"></bottom-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				useStatus: -1,
				isShowButton: false,
				coupon: {},
				scrollTop: 0,
				couponId: '',
				isFromShare: false, // 是否由分享进入页面
				receiveCount: 0,
				userId: uni.getStorageSync('userData')?.sysUser?.userId
			}
		},
		onLoad(option) {
			this.useStatus = Number(option.useStatus)
			this.couponId = option.couponId
			this.receiveCount = Number(option.receiveCount)
			if (option.isFromShare == '1') {
				this.isFromShare = true
			}
			this.getCouponDetail()
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		},
		onShareAppMessage() {
			const coverImg = this.$util.thumbnailImage('', true, 750)
			const path = `/pages-mall/couponDetail/couponDetail?couponId=${this.couponId}`
			const result = this.$util.shareToWechat('优惠券名称', coverImg, path, '优惠券', true, 1)
			return result
		},
		methods: {
			// 获取优惠券详情
			getCouponDetail() {
				this.$httpApi.getCouponById({
					id: this.couponId
				}).then(res => {
					if (!this.userId) {
						// 未登录时默认显示按钮
						this.isShowButton = true
					} else {
						if (!this.receiveCount) {
							this.receiveCount = res.receiveCount
						}
						this.isShowButton = this.useStatus === -1
						// this.isShowButton = this.receiveCount < res.perLimit
					}
					this.coupon = res
				})
			},
			// 分享优惠券
			shareCoupon() {
				// #ifdef APP-PLUS
				const coverImg = this.$util.thumbnailImage('', true, 750)
				const path = `/pages-mall/couponDetail/couponDetail?couponId=${this.couponId}`
				const result = this.$util.shareToWechat('优惠券名称', coverImg, path, '优惠券', true, 2)
				// #endif
			},
			// 购买或领取优惠券
			submitOrder() {
				if (uni.getStorageSync('userData')) {
					if (this.coupon.productId) {
						// 优惠券下单
						this.$httpApi
							.generateMallOrder({
								shoppingCart: false,
								enableDiffAmount: true,
								memberReceiveAddressId: -1,
								products: [{
									count: 1,
									skuId: this.coupon.productOneSkuId
								}],
								sourceType: 1 // app订单
							}).then(res => {
								uni.setStorageSync('orderConfirmInfo', res)
								this.toPage(`/pages-mall/submitOrder/submitOrder?isCoupon=1`)
							})
					} else {
						// 直接领取优惠券
						this.$httpApi.receiveCoupon({
							id: this.coupon.id
						}).then(res => {
							if (res) {
								this.$util.toast('领取成功, 可在“我的-优惠券”查看')
							}
						})
					}
				} else {
					this.$util.goToLoginPage()
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.nav-icon {
		margin: 0 30rpx;
	}

	.right-container {
		width: 200rpx;
		height: 100%;
		justify-content: flex-end;
		padding-right: 30rpx;

		.share-icon {
			padding: 10rpx 12rpx;
		}

		.icon-bg {
			border-radius: 50%;
			background-color: rgba(0, 0, 0, 0.2);
		}
	}

	.main-container {
		width: 100vw;

		.coupon-image {
			width: 100vw;
			height: 100vw;
			border-radius: 0 0 50rpx 50rpx;
		}

		.coupon-name {
			width: 100%;
			padding: 30rpx;
			font-size: 32rpx;
			font-family: Noto Sans S Chinese;
			font-weight: 500;
			color: #010101;
			line-height: 30rpx;
		}

		.coupon-info {
			width: 100%;
			padding: 0 30rpx;
			justify-content: space-between;
			margin-bottom: 30rpx;

			.left {
				width: 50%;

				.text {
					font-size: 24rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 500;
					color: #ED3832;
					line-height: 34rpx;
				}

				.price-tag {
					width: max-content;
					height: 34rpx;
					margin-left: 10rpx;
					padding: 0 10rpx;
					background: #F6F4F0;
					border-radius: 6rpx;
					font-size: 20rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #806A40;
					line-height: 34rpx;
				}
			}

			.right {
				width: 50%;
				text-align: right;
				font-size: 24rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 400;
				color: #808080;
				line-height: 30rpx;
			}
		}

		.coupon-rule {
			padding: 0 30rpx;
			border-top: 2rpx #F7F7F7 solid;
		}
	}

	.slot-content {
		.content-text {
			font-size: 24rpx;
			font-family: Noto Sans S Chinese;
			font-weight: 400;
			color: #4D4D4D;
			line-height: 34rpx;
		}

		.color-text {
			font-size: 28rpx;
			font-family: Noto Sans S Chinese;
			font-weight: 500;
			color: #ED3832;
			line-height: 34rpx;
		}
	}


	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
