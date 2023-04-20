<template>
	<view class="construction-info">
		<view class="info-title" v-if="titleStyle">开工信息</view>
		<view class="info-item" v-if="titleStyle">
			<u-avatar size="32" :src="$util.thumbnailImage(data.avatar,true)"></u-avatar>
			<view class="item-name">{{data.name}}({{data.skillName}})</view>
			<view class="item-date" v-if="data.executeDateTime">{{data.executeDateTime.substring(0,16)}} 开工</view>
		</view>
		<view :class="boxShow?'info-content':'info-content2'">
			<view class="content-title">
				<view class="title-title">内容描述</view>
				<view class="title-text">{{data.notifyContent||data.coment||data.applyDesc}}</view>
			</view>
			<view class="content-image" v-if="data.imgFile !=='[]'">
				<image-show :imgSrc="data.imgFile" right="20"></image-show>
			</view>
			<journal-audio :formDate="JSON.parse(data.voiceFile)" v-if="data.voiceFile" style="margin-top: 20rpx;">
			</journal-audio>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			titleStyle: {
				type: Boolean,
				default: true
			},
			boxShow: {
				type: Boolean,
				default: true
			},
			data: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
			}
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.construction-info {
		background: #FFFFFF;
		margin: 0rpx;
		border-radius: 10rpx;
		padding: 0rpx;

		.info-content2 {
			background: #FFFFFF;
			padding-right: 40rpx;

			.content-image {
				align-items: center;
				display: grid;
				grid-template-columns: auto auto auto;
				margin-top: 20rpx;

				.image-icon {
					width: 154rpx;
					height: 154rpx;
					border-radius: 10rpx;


				}

			}

			.content-title {
				display: flex;

				.title-title {
					font-weight: normal;
					font-size: 24rpx;
					line-height: 34rpx;
					color: #909199;

				}

				.title-text {
					font-weight: normal;
					font-size: 26rpx;
					line-height: 34rpx;
					color: #303133;
					margin-left: 20rpx;


				}
			}
		}

		.info-content {
			background: #FFFFFF;
			box-shadow: 0 0 16rpx rgba(158, 156, 156, 0.25);
			border-radius: 10rpx;
			padding: 36rpx 50rpx 40rpx 50rpx;

			.content-image {
				align-items: center;
				display: grid;
				grid-template-columns: auto auto auto;
				margin-top: 20rpx;

				.image-icon {
					width: 154rpx;
					height: 154rpx;
					border-radius: 10rpx;


				}

			}

			.content-title {
				display: flex;

				.title-title {
					font-weight: normal;
					font-size: 24rpx;
					line-height: 34rpx;
					color: #909199;
				}

				.title-text {
					font-weight: normal;
					font-size: 26rpx;
					line-height: 34rpx;
					color: #303133;
					margin-left: 20rpx;

				}
			}
		}

		.info-title {
			font-weight: bold;
			font-size: 28rpx;
			line-height: 40rpx;
			margin-bottom: 20rpx;
		}

		.info-item {
			display: flex;
			align-items: center;
			margin-bottom: 20rpx;

			.item-name {
				font-weight: normal;
				font-size: 24rpx;
				color: #606166;
				margin-left: 10rpx;
			}

			.item-date {
				font-weight: normal;
				font-size: 24rpx;
				color: #909199;
				margin-left: 20rpx;
			}

			.item-image {
				width: 32rpx;
				height: 32rpx;
				border-radius: 32rpx;
			}
		}
	}
</style>
