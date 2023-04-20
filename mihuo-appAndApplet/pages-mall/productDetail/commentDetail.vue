<template>
	<view>
		<z-nav-bar backState="1000">
			<view class="nav-bar" slot="default">
				评价详情
			</view>
		</z-nav-bar>
		<view class="comment-item" v-if="comment.id">
			<view class="comment-header flex-center">
				<view class="left flex-center">
					<u-avatar :src="$util.thumbnailImage(comment.memberAvatar, true, 80)" size="80"></u-avatar>
					<view class="comment-user">
						<view>
							<view class="name">
								{{ comment.memberName || '未知用户' }}
							</view>
						</view>
						
						<view class="flex-center">
							<u-rate class="rating" disabled :current="comment.productScore" :allow-half="true" size="24"
								active-color="#EC7744" />
							<text class="score" v-if="comment.productScore">
								{{ comment.productScore.toFixed(2) }}分
							</text>
							<view class="divider-line"></view>
							<view class="comment-sku">
								<!-- {{ $tools.getSkuStr(comment.pmsSkuStock.spData) }} -->
							</view>
						</view>
					</view>
				</view>
				<view class="right flex-center">
					<view class="time">
						{{ comment.createTime }}
					</view>
				</view>
			</view>
			<view class="content">
				{{ comment.comment }}
			</view>
			<view class="comment-images" v-if="comment.pics">
				<image-show :imgSrc="getItemPics(comment.pics)" width="200" height="200" right="20" />
			</view>
			<view class="comment-counts flex-center">
				<view class="count-item flex-center">
					<image src="https://www.51mihuo.com/static/icon/capp/love.png" class="icon"></image>
					{{ comment.likes }}
				</view>
				<!-- <view class="count-item flex-center" style="margin-left: 40rpx;" @click="addComment">
					<image class="icon" src="../static/icon/comment.png"></image>
					{{ replyTotal }}
				</view> -->
			</view>
			<view class="comment-reply">
				<view class="reply-item" v-for="item, index in replyList" :key="index">
					<text class="comment-user">
						{{ item.replyType === 0 ? item.memberName : '商家' }}:
					</text>
					<text class="comment">
						{{ item.comment }}
					</text>
				</view>
			</view>
		</view>
		<view class="bottom-buttons flex-center">
			<uni-easyinput prefixIcon="compose" :inputBorder="false" v-model="commentText" 
				@confirm="confirmSend" confirm-type="send" class="input-container"
				placeholder-class="placeholder" type="text" placeholder="请输入你的评论" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				commentId: '',
				comment: {},
				replyList: [], // 评价回复
				replyTotal: 0, // 回复总数
				options: {},
				commentText: ''
			}
		},
		onLoad(options) {
			this.commentId = options.id
			this.options = options
			this.getData()
		},
		methods: {
			// 添加评论
			confirmSend() {
				this.$httpApi.addProductComment([{
					commentId: this.comment.id,
					comment: this.commentText,
					productId: this.options.productId,
					serviceType: this.options.serviceType,
					productScore: 5,
					serviceScore: 5,
					deliveryScore: 5
				}]).then(res => {
					this.commentText = ''
					this.$util.toast('评论成功～')
					this.getData()
				})
			},
			// 获取评价
			getData() {
				this.$httpApi.getProductCommentsById(this.commentId).then(res => {
					this.comment = res
					this.getReply()
				})
			},
			// 获取回复
			getReply() {
				this.$httpApi.getCommentReplyById({
					commentId: this.commentId,
					status: 1
				}).then(res => {
					this.replyList = res.records
					this.replyTotal = res.total
				})
			},
			getItemPics(pics) {
				try {
					// 真实用户的评价
					// 格式是 [{"type":"img","url":"29a056a5382d4a9f9f385044fcb2fbce.jpg"}]
					const images = JSON.parse(pics)
					return pics
				} catch (e) {
					// 平台维护的评价
					// 格式是 29a056a5382d4a9f9f385044fcb2fbce.jpg,29a056a5382d4a9f9f385044fcb2fbce.jpg
					const images = pics.split(',')
					return JSON.stringify(images.map(item => {
						return {
							url: item,
							type: 'img'
						}
					}))
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	
	.bottom-buttons {
		width: 100%;
		position: fixed;
		bottom: 0;
		padding: 30rpx;
	}
	
	.input-container {
		background: #F6F5FA;
		border-radius: 100rpx;
		color: #A5A4AA;
		padding: 0 20rpx;
	}
	
	.divider-line {
		width: 2rpx;
		height: 16rpx;
		margin: 0 10rpx;
		background-color: #E6E6E6;
	}
	
	.comment-sku {
		font-size: 20rpx;
		font-family: Noto Sans S Chinese;
		font-weight: 400;
		color: #B3B3B3;
		line-height: 34rpx;
	}
	
	.comment-item {
		width: 750rpx;
		padding: 0 30rpx;
	
		.comment-header {
			justify-content: space-between;
			align-items: flex-start;
			
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

		.content {
			width: 100%;
			font-size: 24rpx;
			margin-top: 30rpx;
			font-family: Noto Sans S Chinese;
			font-weight: 400;
			color: #333333;
			line-height: 36rpx;
		}

		.comment-images {
			margin-top: 30rpx;
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

			.reply-item {
				padding: 10rpx;
				background: #F7F7F7;

				.comment-user {
					font-size: 24rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 500;
					color: #000000;
					line-height: 34rpx;
					margin-right: 10rpx;
				}

				.comment {
					font-size: 24rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #000000;
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
