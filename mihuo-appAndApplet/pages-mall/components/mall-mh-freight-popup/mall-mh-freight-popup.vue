<template>
	<view class="popup">
		<view class="popup-contnet" v-for="freight, index in freights" :key="index">
			<view class="product-info flex-center" v-if="products.length !== 0">
				<u-lazy-load class="img" height="100" imgMode="aspectFit" borderRadius="20"
					:image="$util.thumbnailImage(products[index].productPic, true)">
				</u-lazy-load>
				<view class="product-name">
					{{ products[index].productName }}
				</view>
			</view>
			<!-- <view class="content-item">
				<view class="upper  flex-center">
					<view class="left">
						发货地
					</view>
					<view class="right">
						{{ freight.address.name.split(' ')[freight.address.name.split(' ').length - 1] }}
					</view>
				</view>
			</view> -->
			<view class="content-item">
				<view class="upper  flex-center">
					<view class="left">
						默认运费规则
					</view>
					<view class="right">
						{{ getFreightRule(freight) }}
					</view>
				</view>
			</view>
			<view class="content-item" v-if="freight.secondFreight.length !== 0">
				<view class="upper flex-center">
					<view class="left">
						指定地区运费
					</view>
				</view>
				<view class="address-content flex-center" v-for="item, index in freight.secondFreight" :key="index">
					<view class="address-name">
						<view class="name" v-for="address, index2 in item.addresses" :key="index2">
							{{ address.name.split(' ')[address.name.split(' ').length - 1] }}
						</view>
					</view>
					<view class="rule">
						{{ getRule(item.caseRule, freight.freightMode) }}
					</view>
				</view>
			</view>
			<view class="content-item" v-if="freight.thirdFreight.length !== 0">
				<view class="upper flex-center">
					<view class="left">
						指定条件免运费
					</view>
				</view>
				<view class="address-content flex-center" v-for="item, index in freight.thirdFreight" :key="index">
					<view class="address-name">
						<view class="name" v-for="address, index2 in item.addresses" :key="index2">
							{{ address.name.split(' ')[address.name.split(' ').length - 1] }}
						</view>
					</view>
					<view class="rule">
						{{ `订单金额满${item.minimumAmount}元免运费` }}
					</view>
				</view>
			</view>
			<view class="content-item" v-if="freight.fourthFreight.length !== 0">
				<view class="upper flex-center">
					<view class="left">
						限制下单区域
					</view>
				</view>
				<view class="address-content flex-center" v-for="item, index in freight.fourthFreight" :key="index">
					<view class="address-name">
						<view class="name">
							{{ item.name.split(' ')[item.name.split(' ').length - 1] }}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getFreightRule,
		getRule,
	} from "@/plugins/utils.js";
	export default {
		props: {
			freights: {
				type: Array,
				default: (() => {
					return []
				})
			},
			products: {
				type: Array,
				default: (() => {
					return []
				})
			}
		},
		data() {
			return {

			}
		},
		methods: {
			// 运费规则
			getRule(caseRule, mode) {
				return getRule(caseRule, mode)
			},
			getFreightRule(freight) {
				return getFreightRule(freight)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.popup {
		width: 100vw;
		padding: 30rpx;
		height: max-content;
		max-height: 40vh;
		
		.popup-contnet {
			width: 100%;
			padding-top: 30rpx;
			/* #ifdef APP-PLUS */
			padding-bottom: 100rpx;
			/* #endif */

			.product-info {
				width: 100%;
				margin-bottom: 30rpx;
				gap: 20rpx;
				
				.img {
					width: 100rpx;
					height: 100rpx;
				}

				.product-name {
					font-family: PingFang SC;
					font-style: normal;
					font-weight: 500;
					font-size: 28rpx;
					line-height: 40rpx;
					color: #333333;
				}
			}

			.content-item {
				width: 100%;
				margin-bottom: 30rpx;

				.upper {
					width: 100%;
					height: max-content;

					.left {
						min-width: 200rpx;
						font-family: PingFang SC;
						font-style: normal;
						font-weight: 500;
						font-size: 28rpx;
						line-height: 40rpx;
						color: #333333;
					}

					.right {
						margin-left: 30rpx;
						padding-left: 30rpx;
						font-family: PingFang SC;
						font-style: normal;
						font-size: 26rpx;
						line-height: 40rpx;
						color: #333333;
					}
				}

				.address-content {
					width: 100%;
					height: max-content;
					margin-top: 10rpx;

					.address-name {
						width: 200rpx;
						height: max-content;

						.name {
							font-family: PingFang SC;
							font-style: normal;
							font-size: 24rpx;
							line-height: 40rpx;
							color: #333333;
						}
					}

					.rule {
						margin-left: 30rpx;
						max-width: 500rpx;
						padding-left: 30rpx;
						font-family: PingFang SC;
						font-style: normal;
						font-size: 22rpx;
						line-height: 40rpx;
						color: #333333;
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
