<template>
	<view class="collection-details">
		<mh-empty v-if="JSON.stringify(details) ===  '{}'" icon="/static/images/no_recommend.png" title="您还没有记录～～" />
		<view v-else class="item-contain-all">
			<view class="item-top">
				<view class="num" v-if="details.price">{{details.price}}元</view>
				<view class="address">{{details.name}}</view>
			</view>
			<view class="item-contain">
				<view class="label">收款方式</view>
				<view class="value">{{details.typeName}}</view>
			</view>
			<view class="item-contain">
				<view class="label">收款人</view>
				<view class="value" v-if="details.userName">{{details.userName}}({{details.skillName}})</view>
			</view>
			<view class="item-contain">
				<view class="label">收款时间</view>
				<view class="value">{{details.created}}</view>
			</view>
			<view class="item-contain">
				<view class="label">订单编号</view>
				<view class="value" v-if="details.receiptCode">{{details.receiptCode}}
					<image class="copy_icon" src="@/static/images/copy_1.png" @click.stop="copy(details.receiptCode)" />
				</view>
			</view>
			<view class="credentials-contain">
				<view class="label">凭证信息</view>
				<view class="remark-contain">
					<text class="name">备注</text>
					<text class="item-text">{{details.remark}}</text>
				</view>
			</view>
			<view class="image-contain">
				<image-show right="30" :imgSrc="details.attachmentsPics" :key="details.attachmentsPics" width="186"
					height="186"></image-show>
			</view>
			<view class="audio-contain" v-if="details.attachmentsVoice">
				<journal-audio :formDate="JSON.parse(details.attachmentsVoice)" class="voice" />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				key: '',
				formDate: {},
				option: {},
				details: {}
			}
		},
		onLoad(option) {
			this.option = option
		},
		onShow() {
			this.getDetails()
		},
		methods: {
			getDetails() {
				if (this.option.receiptId) {
					this.$httpApi.sopReceiptRecordsFindById({
						receiptId: this.option.receiptId
					}).then(res => {
						if (res) {
							this.details = res
						}
					})
				}
			}
		},
	}
</script>

<style>
	page {
		height: 100%;
		background-color: #FFFFFF;
	}
</style>

<style lang="scss" scoped>
	.copy_icon {
		width: 18rpx;
		height: 18rpx;
		margin-left: 4rpx;
	}

	.collection-details {
		border-radius: 5px;
		border-top: 18rpx solid #f5f5f5;

		.item-top {
			padding: 36rpx 44rpx 32rpx 44rpx;
			margin: 0rpx 44rpx;
			display: flex;
			align-items: center;
			flex-direction: column;
			border-bottom: 2rpx solid #F6F6F6;

			.num {
				font-weight: 700;
				font-size: 18px;
				color: $themeColor;
			}

			.address {
				color: $mainFontColor;
				font-size: $smiddleFontSize;
			}
		}
		
		.item-credentials{
			flex-direction: column;
		}
		.credentials-contain{
			display: flex;
			padding: 28rpx 84rpx 26rpx 64rpx;
			flex-direction: column;
			.label {
				font-size: $smallFontSize;
				color: #909199;
				margin-bottom: 8rpx;
			}
			.name{
				font-size: $smallFontSize;
				color: #909199;
				margin-right: 20rpx;
			}
			.item-text{
				font-size: $smiddleFontSize;
				color: $seconFontColor;
			}
			
		}

		.item-contain {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 28rpx 84rpx 26rpx 64rpx;

			.label {
				font-size: $smallFontSize;
				color: #909199;
			}

			.value {
				font-size: $smiddleFontSize;
				color: $seconFontColor;
				display: flex;
				align-items: center;
			}
		}

		.image-contain {
			padding: 0rpx 0rpx 0rpx 64rpx;
		}

		.audio-contain {
			padding: 0rpx 64rpx 0rpx 64rpx;

			.speak_btn {
				margin-top: 0rpx;
			}
		}
	}
</style>
