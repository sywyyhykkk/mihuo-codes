<template>
	<view v-if="info" class="item-records">
		<view class="records-header">
			<view class="left">罚款明细</view>
		</view>
		<view class="text-all-contain" v-if="info.orderForfeit">
			<view class="text-contain" v-for="(el,num) in info.orderForfeit.forfeitLogList" :key="num">
				<view class="title">{{el.name}}:</view>
				<view class="text-desc">
					<text class="text-contain">
						<text class="text-label">处罚金额</text>
						<text class="text-value">{{el.money}}</text>
					</text>
					<text class="text-contain">
						<text class="text-label">积分</text>
						<text class="text-value">{{el.integral}}</text>
					</text>
					<text class="text-contain" v-if="el.day">
						<text class="text-label">禁单天数</text>
						<text class="text-value">{{el.day}}</text>
					</text>
				</view>
			</view>
			<view class="image-contain">
				<image-show :imgSrc="info.pics" right="20"></image-show>
			</view>
		</view>
		<view class="total-contain">
			<view class="left">总计</view>
			<view class="right">
				<text class="text-contain">
					<text class="text-label">金额</text>
					<text class="text-value">{{info.orderForfeit.total.totalMoney}}</text>
				</text>
				<text class="text-contain">
					<text class="text-label">积分</text>
					<text class="text-value">{{info.orderForfeit.total.totalIntegral}}</text>
				</text>
				<text class="text-contain" v-if="info.orderForfeit.total.totalDay">
					<text class="text-label">禁单</text>
					<text class="text-value">{{info.orderForfeit.total.totalDay}}</text>
				</text>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * @description 显示申请、申述显示记录
	 */
	export default {
		name: 'evaluation-item',
		props: {
			info: {
				type: Object,
				default: function() {
					return {}
				},
			}
		},
		data() {
			return {

			}
		},
		onLoad() {

		},
		mounted() {
			console.log("info",this.info)
		},
		methods: {
			getDetails() {
				if (!this.jump) {
					this.toPage(`/pages/construction/evaluation/evaluationDetails?personId=${this.info.execPersonId}`)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>


	.item-records {
		background-color: #FFFFFF;
		padding: 40rpx 44rpx 40rpx 46rpx;
		border-radius: 10rpx;

		.item-records-desc {
			.title {
				font-weight: bold;
				font-size: 30rpx;
				color: #333333;
			}

			.image-contain {
				display: flex;
				flex-wrap: wrap;
				margin-top: 22rpx;

				.record-item-img {
					width: 150rpx;
					margin-right: 16rpx;
					margin-bottom: 16rpx;
				}
			}

			.audio-contain {
				margin-top: 32rpx;
			}
		}

		.records-header {
			display: flex;
			justify-content: space-between;
			margin-bottom: 36rpx;

			.left {
				font-weight: bold;
				font-size: 28rpx;
				color: $seconFontColor;
			}

			.right {
				font-size: 26rpx;
				color: $themeColor;

			}
		}

		.text-all-contain {
			padding-left: 20rpx;

			.text-contain {
				margin-bottom: 28rpx;

				.title {
					font-weight: bold;
					font-size: 26rpx;
					color: #606166;
					margin-bottom: 10rpx;
				}

				.text-desc {
					font-size: 28rpx;
					color: $seconFontColor;

					.text-contain {
						margin-right: 66rpx;

						&:last-child {
							margin-right: 0;
						}

						.text-label {
							font-size: 24rpx;
							color: #909199;
							margin-right: 4rpx;

						}

						.text-value {
							font-size: 24rpx;
							color: #FF5D35;
						}
					}
				}

			}

			.image-contain {
				margin-bottom: 44rpx;
				display: flex;
				flex-wrap: wrap;

				.record-item-img {
					width: 160rpx;
					margin-right: 16rpx;
					margin-bottom: 16rpx;
				}
			}
		}

		.total-contain {
			display: flex;

			.left {
				font-weight: bold;
				font-size: 32rpx;
				color: $seconFontColor;
				margin-right: 24rpx;
			}

			.text-contain {
				margin-right: 26rpx;

				&:last-child {
					margin-right: 0rpx;
				}

				.text-label {
					font-size: 28rpx;
					color: #606166;
					margin-right: 4rpx;
				}

				.text-value {
					font-size: 28rpx;
					color: #FF5D35;
				}
			}
		}
	}

</style>
