<template>
	<view class="comment-items">
		<view class="comment-item" v-for="item, index in value.comments" :key="index">
			<view class="comment-header flex-center">
				<view class="left flex-center">
					<u-avatar :src="$util.thumbnailImage(item.memberAvatar, true, 80)" size="80"></u-avatar>
					<view class="comment-user">
						<view class="name">
							{{ item.customer || '未知用户' }}
						</view>
						<u-rate v-if="item.score" class="rating" disabled :current="item.score || 5" :allow-half="true" size="24"
							active-color="#EC7744" />
						<text class="score" v-if="item.score">
							{{ item.score }}分
						</text>
					</view>
				</view>
				<view class="right flex-center">
					<view class="time">
						{{ item.time }}
					</view>
				</view>
			</view>
			<view class="comment-text">
				{{ item.content }}
			</view>
			<view class="comment-images flex-center" v-if="item.pics">
				<!-- 	<u-lazy-load class="img-item" borderRadius="15" height="216"
						v-for="img, index2 in getItemPics(item.pics)"
						@click="previewImg(getItemPics(item.pics), index2)" :key="index2"
						:image="$util.thumbnailImage(img, true, 864)"></u-lazy-load> -->
			</view>
			<!-- <view class="comment-counts flex-center">
					<view class="count-item flex-center">
						<image class="icon" src="../static/icon/like-heart.png"></image>
						{{ item.likes }}
					</view>
					<view class="count-item flex-center" style="margin-left: 40rpx;">
						<image class="icon" src="../static/icon/comment.png"></image>
						{{ item.replyCount }}
					</view>
				</view> -->
			<view class="comment-reply" v-if="item.replyCount && item.reply">
				<view class="reply-item" v-if="!item.isShow">
					<text class="bold">
						{{ item.reply.roleType === 0 ? item.reply.memberName : '商家' }}
					</text>
					<text class="reply">
						{{ item.reply.roleType === 1 ? '回复' : '评论' }}({{ item.reply.updateTime }}):
					</text>
					<text class="bold">
						{{ item.reply.comment }}
					</text>
				</view>
				<view v-else>
					<view class="reply-item" v-for="rItem, rIndex in item.comments" :key="rIndex">
						<text class="bold">
							{{ rItem.roleType === 0 ? rItem.memberName : '商家' }}
						</text>
						<text class="reply">
							{{ rItem.roleType === 1 ? '回复' : '评论' }}({{ rItem.updateTime }}):
						</text>
						<text class="bold">
							{{ rItem.comment }}
						</text>
					</view>
				</view>
				<view class="expand-comment" v-if="item.replyCount > 1" @click.stop="expandComment(item, index)">
					{{ item.isShow ? '收起' : '展开' }}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			value: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {}
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.score {
		font-size: 22rpx;
		font-family: PingFang;
		font-weight: 800;
		color: #EC7744;
		line-height: 46rpx;
		margin-left: 16rpx;
	}

	.rating {
		margin-left: -4rpx;
	}

	.comment-items {
		width: 690rpx;
		height: max-content;

		.comment-item {
			padding: 30rpx;
			border-top: 2rpx #F7F7F7 solid;

			.comment-header {
				justify-content: space-between;
				align-items: flex-start;

				.left {
					align-items: center;

					.comment-user {
						margin-left: 20rpx;
						flex: 1;

						.name {
							padding-top: 6rpx;
							font-size: 28rpx;
							font-family: Noto Sans S Chinese;
							font-weight: 500;
							color: #000000;
							line-height: 34rpx;
						}
					}
				}

				.right {
					.time {
						font-size: 20rpx;
						font-family: Noto Sans S Chinese;
						font-weight: 400;
						color: #808080;
						line-height: 34rpx;
					}
				}
			}

			.comment-text {
				margin-top: 30rpx;
				font-size: 24rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 400;
				color: #333333;
				line-height: 36rpx;
			}

			.comment-images {
				margin-top: 30rpx;
				align-items: flex-start;
				flex-wrap: wrap;
				gap: 20rpx;

				.img-item {
					width: 216rpx;
					height: 216rpx;
					border-radius: 15rpx;
				}
			}

			.comment-counts {
				justify-content: flex-end;
				margin-top: 30rpx;

				.count-item {
					font-size: 20rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #141414;
					line-height: 27rpx;
				}

				.icon {
					width: 34rpx;
					height: 34rpx;
					margin-right: 10rpx;
				}
			}

			.comment-reply {
				width: 690rpx;
				height: max-content;
				margin-top: 30rpx;
				background: #F7F7F7;
				border-radius: 10rpx;
				padding: 10rpx 20rpx;

				.reply-item {
					.bold {
						font-size: 24rpx;
						font-family: Noto Sans S Chinese;
						font-weight: 400;
						color: #000000;
						line-height: 34rpx;
					}

					.reply {
						flex-shrink: 0;
						margin: 0 10rpx;
						font-size: 20rpx;
						font-family: Noto Sans S Chinese;
						font-weight: 400;
						color: #999999;
						line-height: 34rpx;
					}
				}

				.expand-comment {
					margin-top: 10rpx;
					text-align: right;
					font-size: 24rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #FE6E32;
					line-height: 34rpx;
				}
			}
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
