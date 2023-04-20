<template>
	<view>
		<view class="worker-detial">
			<view class="worker-title">
				<u-avatar size="96" src="../../../static/demo/1.jpg"></u-avatar>
				<view style="margin-left: 30rpx;flex: 1;">
					<view class="worker-type">设计师</view>
					<view class="worker-name">王大强</view>
				</view>
				<image src="../../static/icon/tel.png" class="icon"></image>
			</view>
			<view class="close-pice">应结算工费 <text class="pice">8888元</text></view>
			<view class="node-item" v-for="item in 2" :key="item">
				<view>
					<view class="node-title">设计及交付</view>
					<view class="node-date">2021-07-01至2021-08-01</view>
				</view>
				<view class="node-type">已完成</view>
			</view>
			<view class="button-image">
				<view v-for="(item,index) in imageList" :key="index" style="margin-top: 20rpx;">
					<image :class="index==4?'image-item2':'image-item'" :src="item"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imageList: ['../../static/icon/worker_detial/group9087.png',
					'../../static/icon/worker_detial/group9086.png',
					'../../static/icon/worker_detial/group9095.png',
					'../../static/icon/worker_detial/group9094.png',
					'../../static/icon/worker_detial/group9088.png'
				]
			}
		}
	}
</script>

<style lang="scss" scoped>
	.worker-detial {
		padding-left: 40rpx;
		background-color: #FFFFFF;
		margin: 20rpx;
		border-radius: 16rpx;

		.button-image {
			margin-left: -40rpx;
			border-top: 2rpx solid #F6F6F6;
			display: grid;
			grid-template-columns: auto auto auto auto;
			padding-bottom: 20rpx;

			.image-item {
				width: 112rpx;
				height: 126rpx;
				margin: 0 auto;
			}
			.image-item2 {
				margin: 0 auto;
				width: 80rpx;
				height: 126rpx;
			}
		}

		.node-item {
			height: 120rpx;
			display: flex;
			align-items: center;

			.node-title {
				font-weight: bold;
				font-size: 28rpx;
				line-height: 40rpx;
				color: $seconFontColor;
			}

			.node-date {
				font-weight: normal;
				font-size: 26rpx;
				line-height: 36rpx;
				color: #A3A3A3;
			}

			.node-type {
				flex: 1;
				text-align: right;
				font-style: normal;
				font-weight: normal;
				font-size: 26rpx;
				color: #10BF78;
				margin-right: 50rpx;

			}
		}

		.close-pice {
			font-family: PingFang SC;
			font-style: normal;
			font-weight: normal;
			font-size: 28rpx;
			padding-bottom: 28rpx;
			color: #606166;
			border-bottom: 2rpx solid #F6F6F6;

			.pice {
				font-family: PingFang SC;
				font-style: normal;
				font-weight: normal;
				font-size: 28rpx;
				line-height: 40rpx;
				margin-left: 20rpx;
				color: #FF5D35;
			}

		}

		.worker-title {
			display: flex;
			align-items: center;
			height: 160rpx;
			width: 100%;

			.icon {
				width: 72rpx;
				height: 72rpx;
				margin-right: 50rpx;
				text-align: right;
			}

			.worker-type {
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 32rpx;
				line-height: 44rpx;
				color: $seconFontColor;

			}

			.worker-name {
				font-family: PingFang SC;
				font-style: normal;
				font-weight: normal;
				font-size: 26rpx;
				line-height: 36rpx;
				color: #909199;

			}
		}
	}
</style>
