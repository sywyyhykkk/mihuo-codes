<template>
	<view class="item-records-desc" v-if="info" :class="paddingShow()">
		<!-- 申请工费相关 -->
		<view class="operating-costs" v-if="info.customAmount">
			<view class="item-contain">
				<view class="item-value">
					<text class="label">工人接单价</text>
					<text class="value">{{info.customAmount.bidPrice}}元</text>
				</view>
				<view class="item-value" v-if="info.customAmount.forfeitPrice">
					<text class="label">罚款金额</text>
					<text class="value">{{info.customAmount.forfeitPrice}}元</text>
				</view>
			</view>
			<view class="item-contain">
				<view class="item-value">
					<text class="label">应结工费</text>
					<text class="value">{{info.customAmount.bidPrice}}元</text>
				</view>
			</view>
			<view class="item-contain">
				<view class="item-value">
					<text class="label">已结工费</text>
					<text class="value">{{info.customAmount.payCost}}</text>
				</view>
			</view>
			<view class="item-contain" v-if="info.customAmount.managerChangeAmount">
				<view class="item-value">
					<text class="label">申请修改应结工费 </text>
					<text class="value">{{info.customAmount.managerChangeAmount}}</text>
				</view>
			</view>
		</view>
		<view class="title" v-if="info.comment">{{info.comment}}</view>
		<view class="image-contain" v-if="info.pics">
			<image-show :imgSrc="info.pics" right="20"></image-show>
		</view>
		<view class="audio-contain" v-if="info.audio">
			<mihuo-audio :formData="info.audio" />
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
			this.info.customAmount = this.info.customAmount && this.info.customAmount!== '' && JSON.parse(this.info.customAmount)
		},
		methods: {
			paddingShow() {
				if (this.info.comment || this.info.pics || this.info.audio) {
					return 'isPadding'
				}
			},
			getDetails() {
				if (!this.jump) {
					this.toPage(`/pages/construction/evaluation/evaluationDetails?personId=${this.info.execPersonId}`)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.isPadding {
		padding: 40rpx 44rpx 40rpx 46rpx;
	}

	.item-records-desc {
		background-color: #FFFFFF;
		border-radius: 10rpx;

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

	.evaluation-list {

		.item-evaluation {
			margin: 0rpx 20rpx 6rpx 20rpx;
			background-color: $bgColor;
			padding: 44rpx 0rpx 42rpx 60rpx;
			border-bottom-left-radius: $miniBorderRadius;
			border-bottom-right-radius: $miniBorderRadius;

			&:last-child {
				margin: 0rpx 20rpx 0rpx 20rpx;
			}

			.top {
				display: flex;
				margin-bottom: 28rpx;
				padding-right: 40rpx;

				.personnel {
					width: 100%;
					margin-left: 12rpx;

					.item-personnel {
						display: flex;
						justify-content: space-between;
						margin-bottom: 6rpx;

						.item-name {
							font-weight: bold;
							font-size: $middleFontSize;
							color: $seconFontColor;
						}

						.item-status {
							font-size: $smiddleFontSize;
							color: $themeColor;
						}

					}
				}
			}

			.tab-list {
				display: flex;
				flex-wrap: wrap;
				margin-bottom: 14rpx;

				.item-tab {
					padding: 8rpx 18rpx;
					background-color: rgba(29, 70, 175, 0.1);
					font-size: $smiddleFontSize;
					color: $themeColor;
					border-radius: $miniBorderRadius;
					margin-right: 14rpx;
					margin-bottom: 14rpx;
				}
			}

			.describe {
				font-size: $smiddleFontSize;
				color: $mainFontColor;
				margin-bottom: 20rpx;
				padding-right: 40rpx;
			}

			.image-contain {
				margin-bottom: 30rpx;
			}

			.bottom-contain {
				display: flex;
				align-items: center;
				padding-right: 40rpx;

				text {
					font-size: $smallFontSize;
				}

				.item-name {
					margin: 0 10rpx 0 10rpx;
					color: $mainFontColor;
				}

				.item-time {
					color: $viceFontColor;
				}
			}
		}
	}
	.operating-costs{

		.item-contain{
			display: flex;
			justify-content: space-between;
			margin-bottom: 10rpx;

			.item-value{

				.label{
					font-weight: 400;
					font-size: $middleFontSize;
					color: $mainFontColor;
					margin-right: 20rpx;
				}

				.value{
					font-weight: 400;
					font-size: $middleFontSize;
					color: $errorFontColor;
				}
			}
		}
	}
</style>
