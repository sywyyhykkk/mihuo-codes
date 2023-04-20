<template>
	<view v-if="list.length" class="item-coupon display-justify_between" @click="$emit('click')">
		<view class="left">
			<text class="name">可用优惠券</text>
			<text class="num">({{list.length}}项可用)</text>
		</view>
		<view class="right">
			<text class="select-num">{{ couponId ? "已选":"点击选择"}}</text>
			<u-icon name="arrow-right" size="24" color="#C4C4C4"></u-icon>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			list: {
				type: Array,
				default: () => []
			},
			couponId:{
				type: String,
				default: ''
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
	.item-coupon {
		border-radius: 10rpx;
		padding: 40rpx 30rpx;
		background-color: #fff;
		margin-bottom: 10rpx;


		.left {
			.name {
				font-size: $middleFontSize;
				color: $seconFontColor;
				margin-right: 10rpx;
			}

			.num {
				font-size: $smallFontSize;
				color: #999999;
			}

		}

		.select-num {
			color: $mainFontColor;
			font-size: $fontSize26;
			margin-right: 10rpx;
		}
	}
</style>
