<template>
	<view class="people-worker-type" :style="{background: bgColor}">
		<view class="woker-class" :style="{color: textColor, backgroundColor: bgColor}">V{{ level }}</view>
		<view class="type-text" :style="{color: textColor}">{{ title }}</view>
	</view>
</template>

<script>
	export default {
		name: "skill-level-tag",
		props: {
			title: {
				type: String,
				default: '技能'
			},
			level: {
				type: [String, Number],
				default: "1"
			},
			bgColor: {
				type: String,
				default: '#002FA5'
			},
			textColor: {
				type: String,
				default: '#FFFFFF'
			}
		}
	}
</script>

<style lang="scss" scoped>
	.people-worker-type {
		display: flex;
		height: 36rpx;
		border-radius: 8rpx;
		margin-left: 8rpx;
	
		.woker-class {
			width: 50rpx;
			height: 50rpx;
			font-weight: bold;
			font-size: 18rpx;
			color: #FFFFFF;
			text-align: center;
			border-radius: 50rpx;
			margin-top: -10rpx;
			margin-left: -10rpx;
			line-height: 42rpx;
			border: 6rpx solid #FFFFFF;
			font-style: italic;
		}
	
		.type-text {
			font-weight: normal;
			font-size: 20rpx;
			line-height: 36rpx;
			padding-left: 10rpx;
			padding-right: 10rpx;
		}
	}
</style>
