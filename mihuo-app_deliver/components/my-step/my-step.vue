<template>
	<view class="my_step flex-center">
		<view v-for="(item,index) in stepTitle" :key="index" class="flex-center">
			<view class="step_border" v-if="index !== 0" :style="{opacity: index + 1 <= stepIndex ? '1' : '0.5'}">
			</view>
			<view class="step flex-center">
				<view :class="index + 1 <= stepIndex ? 'step_value_border flex-center' : 'step_value_unborder'">
					<view class="step_value" :style="{backgroundColor: index + 1 <= stepIndex ? '#002FA5' : '#ECECEC',
						color: index + 1 <= stepIndex ? '#FFFFFF' : '#909199'
					}">
						{{ index + 1 }}
					</view>
				</view>
				<view class="step_title" :style="{ color: index + 1 <= stepIndex ? '#002FA5' : '#B6B3B3' }">{{ item.name }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "my-step",
		props: {
			stepIndex: {
				type: Number,
				default: 1
			},
		},
		data() {
			return {
				stepTitle: [{
					name: '发布订单'
				}, {
					name: '等待报价'
				}, {
					name: '订单确认'
				}, {
					name: '订单完成'
				}, ]
			};
		}
	}
</script>

<style lang="scss" scoped>
	.my_step {
		width: 100vw;
		height: 180rpx;
		padding: 20rpx;
		background: transparent;
		justify-content: space-between;

		.step {
			width: 120rpx;
			height: 120rpx;
			flex-direction: column;

			.step_value_border {
				border: 6rpx solid rgba(0, 47, 165, 0.5);
				width: 52rpx;
				height: 52rpx;
				border-radius: 50%;
				margin: auto;
				flex-direction: row;
				justify-content: center;
			}

			.step_value_unborder {
				width: 52rpx;
				height: 52rpx;
				border-radius: 52rpx;
				margin: auto;
				border: 6rpx solid rgba(0, 47, 165, 0);
			}

			.step_value {
				font-size: 24rpx;
				color: #FFFFFF;
				width: 40rpx;
				height: 40rpx;
				border-radius: 50%;
				text-align: center;
				line-height: 40rpx;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
			}

			.step_title {
				text-align: center;
				margin-top: 16rpx;
				font-family: 'PingFang SC';
				font-style: normal;
				font-weight: 400;
				font-size: 24rpx;
				line-height: 34rpx;
				color: #002FA5;
			}
		}

		.step_border {
			height: 2rpx;
			width: 80rpx;
			background-color: #002FA5;
			margin-top: -50rpx;
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
