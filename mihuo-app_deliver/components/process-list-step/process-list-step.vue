<template>
	<view>
		<view v-for="(item, index) in stepList">
			<view class="step flex-center">
				<view class="left text flex-center">
					<view class="num">
						{{index + 1}}
					</view>
					{{item.name}}
				</view>
				<view class="right flex-center">
					<image class="icon" src="../../static/icon/arrow_right.png"></image>
				</view>
			</view>
			<view class="step-line" v-if="index < stepList.length - 1"></view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "process-list-step",
		props: ['stepList'],
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
	.step {
		width: 710rpx;
		height: 125rpx;
		justify-content: space-between;
		padding: 0rpx 40rpx;

		.left {
			height: 100%;
			width: 50%;

			.num {
				width: 44rpx;
				height: 44rpx;
				border-radius: 50%;
				background-color: #D7D7D7;
				text-align: center;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: 900;
				font-size: 28rpx;
				line-height: 40rpx;
				margin-right: 20rpx;
			}
		}

		.right {
			height: 100%;
			width: 50%;
			justify-content: flex-end;

			.icon {
				width: 14rpx;
				height: 24rpx;
			}
		}

		.text {
			font-family: PingFang SC;
			font-style: normal;
			font-weight: bold;
			font-size: 28rpx;
			line-height: 40rpx;
			color: #606166;
		}
	}

	.step-line {
		height: 40rpx;
		width: 1rpx;
		border: 2rpx dashed #d7d7d7;
		position: relative;
		left: 60rpx;
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
