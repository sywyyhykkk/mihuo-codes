<template>
	<u-popup v-model="value" :popup="false" mode="bottom" border-radius="30" :mask-close-able="maskCloseAble" @close="popupClose">
		<view class="titleContent">
			<text class="name">分享订单</text>
			<view class="close" @click="popupClose">
				<u-image width="60rpx" height="60rpx" src="../../static/images/close_icon.png"></u-image>
			</view>
		</view>
		<view class="actionContent">
			<u-row gutter="1" item="center" justify="center">
				<u-col span="3" @click="resolveFriend(0)">
					<view style="text-align: center;">
						<view class="imageContent">
							<u-image width="56rpx" height="56rpx" class="icon" src='/static/images/share-weixin.png'>
							</u-image>
						</view>
						<view>
							<text class="text">微信好友</text>
						</view>
					</view>
				</u-col>
				<u-col span="3" @click="resolveFriend(1)">
					<view style="text-align: center;">
						<view class="imageContent">
							<u-image width="56rpx" height="56rpx" class="icon" src='/static/images/share-friend.png'>
							</u-image>
						</view>
						<view>
							<text class="text">朋友圈</text>
						</view>
					</view>
				</u-col>
				<u-col span="3" @click="resolveFriend(2)">
					<view style="text-align: center;">
						<view class="imageContent">
							<u-image width="56rpx" height="56rpx" class="icon" src='/static/images/share-contruct.png'>
							</u-image>
						</view>
						<view>
							<text class="text">联系人</text>
						</view>
					</view>
				</u-col>
				<u-col span="3" @click="resolveFriend(2)">
					<view style="text-align: center;">
						<view class="imageContent">
							<u-image width="56rpx" height="56rpx" class="icon" src='/static/images/share-link.png'>
							</u-image>
						</view>
						<view>
							<text class="text">复制链接</text>
						</view>
					</view>
				</u-col>
			</u-row>
		</view>
	</u-popup>
</template>

<script>
	//基于uview的改造
	export default {
		name: 'share-popup',
		props: {
			shareData: {
				shareTitle: '',
				shareUrl: '',
				shareContent: '',
				shareImg: ''
			},
			value: {
				type: Boolean,
				default: true
			},
			maskCloseAble:{
				type:Boolean,
				default:true
			}
		},
		watch: {
			// 如果是异步关闭时，外部修改v-model的值为false时，重置内部的loading状态
			// 避免下次打开的时候，状态混乱
			value(n) {

			}
		},
		data() {
			return {

			};
		},
		methods: {
			popupClose() {
				this.$emit('input', false);
			}
		}
	};
</script>

<style scoped lang="scss">
	.titleContent {
		margin: 40rpx 40rpx 20rpx 40rpx;
		display: flex;

		.name {
			font-size: 40rpx;
			color: #303133;
			flex: 1;
			font-weight: 600;
		}

		.close {

			text-align: right;
		}
	}

	.actionContent {
		margin-bottom: 20rpx;
		.imageContent {
			background-color: #F3F5F7;
			width: 96rpx;
			height: 96rpx;
			border-radius: 48rpx;
			margin: 20rpx auto;
			position: relative;

			.icon {
				position: absolute;
				top: 20rpx;
				left: 20rpx;
				width: 56rpx;
				height: 56rpx;
			}
		}

		.text {
			color: #5F686F;
			font-size: 28rpx;
		}
	}
</style>
