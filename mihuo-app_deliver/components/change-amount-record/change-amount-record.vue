<template>
	<view class="change-amount-record" v-if="info">
		<view class="left-contain">
			<u-avatar class="node" size="52" :src="$util.thumbnailImage(info.avatar,true)">
			</u-avatar>
		</view>
		<view class="right-contain">
			<view class="item-top">
				{{info.skillName}}
				({{info.personName}})
				{{info.created && info.created.substring(0,16)}}
				变更了金额
			</view>
			<view class="details-contain-all">
				<view class="details-contain">
					<view class="item-title">
						<text class="name">变更订单金额</text>
						<text class="num">{{info.afterCost}}</text>
						<text class="before">(变更前订单金额{{info.beforeCost}})</text>
					</view>
					<view class="item-why" v-if="info.remark">
						<text class="title">变更原因</text>
						<text class="why-content">{{info.remark}}</text>
					</view>
					<view class="image-contain" v-if="info.imgFile">
						<image-show right="20" :imgSrc="info.imgFile" :key="info.imgFile"></image-show>
					</view>
					<view class="audio-contain" v-if="info.voiceFile">
						<!-- <mihuo-audio :formDate="info.voiceFile"></mihuo-audio> -->
						<journal-audio :formDate="JSON.parse(info.voiceFile)" />
					</view>
				</view>
				<!-- <view class="results-contain" v-if="">
					<view class="item-results-contain">
						<view class="item-results">
							<u-avatar class="node" size="34" :src="$util.thumbnailImage('',true)">
							</u-avatar>
							<text>项目经理(李四)2021-12-25 14:00拒绝变更金额</text>
						</view>
						<view class="results-why">拒绝原因</view>
						<view class="results-desc">不想干赶紧走人，我才不惯着你，嘿嘿！</view>
					</view>
				</view> -->
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		props: {
			info: Object,
			default: function() {
				return {}
			},
		},
		data() {
			return {
				key: ''
			}
		},
		mounted() {
			this.getDetails()
		},
		methods: {
			getDetails() {

			}
		},
	}
</script>

<style lang="scss" scoped>
	.change-amount-record {
		display: flex;
		padding-left: 20rpx;

		&:last-child {
			.right-contain {
				margin-bottom: 0rpx;
			}
		}

		.left-contain {
			border-left: 1px dashed #C4C4C4;
			width: 40rpx;
			position: relative;

			.node {
				position: absolute;
				left: -28rpx;
				top: -10rpx;
			}
		}

		.right-contain {
			margin-bottom: 20rpx;
			display: flex;
			flex: 1;
			flex-direction: column;

			.item-top {
				font-weight: 400;
				font-size: $smiddleFontSize;
				color: $viceFontColor;
				margin-bottom: 30rpx;
			}

			.details-contain-all {
				border-radius: $miniBorderRadius;
			}

			.details-contain {
				padding: 40rpx 34rpx 34rpx 46rpx;
				background-color: #FFFFFF;
				border-top-left-radius: 10rpx;
				border-top-right-radius: 10rpx;

				.item-title {


					.name {
						font-weight: 400;
						font-size: $smiddleFontSize;
						color: $seconFontColor;
						margin-right: 8rpx;
					}

					.num {
						font-weight: 700;
						font-size: $middleFontSize;
						color: $errorFontColor;
						margin-right: 6rpx;
					}

					.before {
						font-weight: 400;
						font-size: $smallFontSize;
						color: #B4B6BA;
					}
				}

				.item-why {
					display: flex;
					flex-direction: column;
					margin-top: 20rpx;

					.title {
						font-weight: 400;
						font-size: $smallFontSize;
						color: #B4B6BA;
						margin-bottom: 10rpx;
					}

					.why-content {
						font-weight: 400;
						padding-right: 58rpx;
						font-size: $middleFontSize;
						color: $seconFontColor;
					}

				}

				.image-contain {
					margin-top: 22rpx;
				}

				.audio-contain {
					padding-right: 54rpx;
				}
			}


			.results-contain {
				background-color: #FFFFFF;
				border-bottom-left-radius: 10rpx;
				border-bottom-right-radius: 10rpx;

				.item-results-contain {
					margin: 0rpx 34rpx 0rpx 34rpx;
					border-top: 2rpx dashed #EEEEEE;
					padding: 26rpx 0rpx 34rpx 0rpx;
				}

				.item-results {
					display: flex;
					align-items: center;
					margin-bottom: 20rpx;

					text {
						margin-left: 10rpx;
						font-weight: 400;
						font-size: $smallFontSize;
						color: $errorFontColor;
					}
				}

				.results-why {
					font-weight: 400;
					font-size: $smallFontSize;
					color: #B4B6BA;
					margin-bottom: 10rpx;
				}

				.results-desc {
					font-weight: 400;
					font-size: $smiddleFontSize;
					color: $seconFontColor;
				}
			}
		}

	}
</style>
