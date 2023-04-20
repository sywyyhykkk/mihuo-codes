<template>
	<view :class="[{'border' : border}]" class="menu-item flex-center" @click="click" :style="{height: height+'rpx'}">
		<view class="left">
			<!-- <image class="left-icon" :src="leftIcon" mode=""></image> -->
			{{title}}
		</view>
		<view class="right flex-center">
			<slot></slot>
			<uni-icons :style="{visibility: isShowArrow ? 'visible' : 'hidden' }" type="right" :color="iconColor" size="14"></uni-icons>
		</view>
	</view>
</template>

<script>
	export default {
		name: "menu-item",
		props: {
			leftIcon:{
				type: String,
				default: ''
			},
			title: {
				type: String,
				default: '标题'
			},
			isShowArrow: {
				type: Boolean,
				default: true
			},
			border: {
				type: Boolean,
				default: false
			},
			height: {
				type: [Number, String],
				default: 124
			},
			iconColor: {
				type: String,
				default: '#999999'
			}
		},
		data() {
			return {

			};
		},
		methods: {
			click() {
				this.$emit('click')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.menu-item {
		width: 100%;
		justify-content: space-between;
		padding: 0rpx 28rpx;
		background-color: #fff;
		
		&.border {
			border-top: 1rpx #E5E5E5 solid;
		}
        // #ifdef APP-PLUS
		&:nth-first-of-type() {
			border-top: none;
		}
		// #endif
		// #ifdef APP-PLUS
		&:nth-last-of-type() {
			border-top: none;
		}
		// #endif
		
		.left-icon{
			width: 36rpx;
			height: 36rpx;
			margin-right: 16rpx;
		}

		.left {
			font-family: PingFang SC;
			font-style: normal;
			font-weight: 500;
			font-size: 28rpx;
			display: flex;
			align-items: center;
			line-height: 40rpx;
			color: #333333;
		}

		.right {
			justify-content: flex-end;

			.icon {
				width: 16rpx;
				height: 22rpx;
			}
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
