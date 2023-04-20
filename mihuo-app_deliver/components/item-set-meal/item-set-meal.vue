<template>
	<view class="item-set-meal" @click="$emit('click',info)">
		<image-lazy-load :image="info.productPic" height="146" :viewStatus="false"></image-lazy-load>
		<view class="right-contain" >
			<view class="top display-justify_between">
				<text class="name">{{info.productName}}</text>
				<text v-if="viewShow" class="view">查看</text>
			</view>
			<view v-if="info.minAmountDescription" class="desc">{{info.minAmountDescription}}</view>
			<view class="bottom display-justify_between">
				<view class="price">
					<view class="symbol">￥</view>
					<view class="item-price">{{info.realAmount}}</view>
				</view>
				<view v-if="numShow" class="num">
					<view class="unit">x</view>
					<view class="item-num">{{info.productQuantity}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			info: {
				type: Object,
				default: () => {}
			},
			viewShow:{
				type: Boolean,
				default: true
			},
			numShow:{
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				option: {}
			}
		},
		computed: {
			
		},
		mounted() {
		},
		onShow() {

		},
		onLoad(option) {
			this.option = option
		},
		methods: {

		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	.record-item-img {
		width: 146rpx;
		height: 146rpx;
	}

	.item-set-meal {
		margin-bottom: 30rpx;
		display: flex;

		&:last-child {
			margin-bottom: 0rpx;
		}

		.right-contain {
			display: flex;
			flex-direction: column;
			margin-left: 16rpx;
			justify-content: space-around;
			flex: 1;

			.name {
				color: $seconFontColor;
				font-size: $mainFontSize;
				line-height: 40rpx;
			}

			.view {
				font-size: $smallFontSize;
				color: $themeColor;
			}

			.desc {
				color: $viceFontColor;
				font-size: $fontSize26;
				margin-top: 6rpx;
			}

			.bottom {

				.price,
				.num {
					display: flex;
				}

				.symbol {
					transform: scale(0.9);
					transform-origin: bottom;
					font-size: 24rpx;
					color: $errorFontColor;
				}

				.item-price {
					color: $errorFontColor;
					font-size: $mainFontSize;
					line-height: $mainFontSize;
				}

				.num {
					color: $seconFontColor;
					font-size: $middleFontSize;
					
					.unit, .item-num{
						color: $seconFontColor;
						font-size: $middleFontSize;
					}
				}

			}
		}
	}
</style>
