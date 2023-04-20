<template>
	<view :class="[{'border' : border}]" class="menu-item flex-center" @click="click" :style="{height: height+'rpx'}">
		<image v-if="titleIcon" class="title-icon" :src="titleIcon"></image>
		<view class="left" :style="{marginLeft: titleIcon ? '64rpx' : ''}">
			{{ title }}
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
			titleIcon: {
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
		background-color: #fff;
		padding: 0 30rpx;
		
		.title-icon {
			position: absolute;
			width: 34rpx;
			height: 34rpx;
			margin-right: 30rpx;
		}
		
		&.border {
			border-top: 1rpx #E5E5E5 solid;
		}
        /* #ifdef APP-PLUS */
		
		&:nth-first-of-type() {
			border-top: none;
		}
		&:nth-last-of-type() {
			border-top: none;
		}
		
		/* #endif */

		.left {
			font-family: PingFang SC;
			font-style: normal;
			font-weight: 500;
			font-size: 28rpx;
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
