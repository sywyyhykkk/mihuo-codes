<template>
	<view style="height: 190rpx;">
		<view style="height:100rpx;"></view>
		<view class="bottom-button" :style="{ background: bgColor, position: fixed ? 'fixed' : 'initial' }">
			<view class="add-text" :style="[styleObj]" @click="goSend">
				<slot name="icon-left"></slot>
				<text class="add-text_title" :style="{ color: color }">
					{{ title }}
				</text>
				<slot name="icon-right"></slot>
			</view>
			<view v-if="isShow" class="button-tips">{{ tipName }}</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'bottom-button',
		props: {
			fixed: {
				type: Boolean,
				default: true
			},
			title: {
				type: String || Number,
				default: ''
			},
			styleObj: {
				type: Object,
				default: () => {}
			},
			tipName: {
				type: String,
				default: () => '急速响应'
			},
			isShow: {
				type: Boolean,
				default: () => false
			},
			color: {
				type: String,
				default: () => '#FFFFFF'
			},
			bgColor: {
				type: String,
				default: '#FFFFFF'
			}
		},
		data() {
			return {}
		},
		methods: {
			goSend() {
				this.$emit('click')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bottom-button {
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
		@include buttonsafearea();
		
		.button-tips {
			position: absolute;
			background: #fe6e32;
			display: inline-block;
			top: 0;
			font-size: 24rpx;
			color: #ffffff;
			padding: 0 10rpx;
			left: calc(50% + 35px);
			border-bottom-right-radius: 10rpx;
			border-top-left-radius: 10rpx;
		}
	}

	.add-text {
		line-height: 90rpx;
		height: 90rpx;
		border-radius: 10rpx;
		margin: 10rpx 30rpx 20rpx;
		background: #424242;
		display: flex;
		justify-content: center;

		.add-text_title {
			font-size: 28rpx;
			font-family: Noto Sans S Chinese;
			font-weight: 500;
			color: #ffffff;
		}
	}
</style>
