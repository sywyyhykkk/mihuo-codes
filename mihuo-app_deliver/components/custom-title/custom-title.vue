<template>
	<view class="custom-title-contain">
		<view class="left">
			<image src="/static/images/title.png" mode=""></image>
			<view class="item-title">{{title}}</view>
		</view>
		<view class="right">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 图片上传数量
			title: {
				type: '',
				default: '交底通知'
			}
		}
	}
</script>

<style lang="scss" scoped>
	.custom-title-contain {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 110rpx;
		margin: 0 20rpx;
		padding: 0 40rpx;

		.left {
			display: flex;
			align-items: center;

			image {
				width: 44rpx;
				height: 30rpx;
				margin-right: 10rpx;
			}

			.item-title {
				font-weight: bold;
				font-size: 28rpx;
				color: #303133;
			}
		}
	}
</style>
