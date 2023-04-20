<template>
	<view>
		<z-nav-bar backState="1000">
			<view slot="default" class="left-container flex-center">
				<u-avatar v-if="miyou.userId > 0" :src="$util.avatarImage(miyou.userId, true)" size="56"></u-avatar>
				<u-avatar v-else :src="$util.thumbnailImage(miyou.userAvatar, true)" size="56"></u-avatar>
				<view class="info">
					<view class="name">{{ miyou.userNickName }}</view>
					<view class="time" v-if="miyou.date">{{ miyou.date.substring(0, 10) }}</view>
				</view>
			</view>
			<view slot="right" class="right-container flex-center">
				<image src="https://www.51mihuo.com/static/images/order_details/share.png" class="share-icon"
					@click="shareMiyou"></image>
			</view>
		</z-nav-bar>
		<!-- 删除评论 -->
		<u-action-sheet :safe-area-inset-bottom="true" :list="optionsList" v-model="showPicker" @click="confirmPicker">
		</u-action-sheet>
		<mh-skeleton :loading="!miyou.userId" :imgTitleHeight="600" :row="6">
			<view>
				<view class="swiper" v-if="miyou.userId > 0">
					<u-swiper height="960" :list="swiperImgList" :autoplay="false" mode="dot" :showIndicator="true"
						:circular="true" border-radius="0">
					</u-swiper>
				</view>
				<view class="swiper" v-else-if="miyou.content" style="height: max-content;">
					<!-- 平台端维护端富文本内容 -->
					<edit-view v-model="miyou.content"></edit-view>
				</view>
				<view class="main-container">
					<view class="buttons-container flex-center">
						<view class="left flex-center">
							<!-- <view class="icon-item flex-center">
									<image src="https://www.51mihuo.com/static/icon/miyou/button_3.png" class="icon"></image>
									<text class="num">{{ miyou.forwardCount }}</text>
								</view> -->
						</view>
						<view class="right flex-center">
							<view class="icon-item flex-center" @click="clickLike">
								<image :src="'https://www.51mihuo.com/static/icon/capp/'+ 
								(miyou.isLike?'have_praise.png':'praise.png')" class="icon-2"></image>
								<!-- 点赞次数 -->
								<text class="num" style="margin-top: 14rpx;">{{ miyou.likeCount }}</text>
							</view>
							<view class="icon-item flex-center">
								<image src="https://www.51mihuo.com/static/icon/capp/comment.png" class="icon-2"></image>
								<!-- 评论次数 -->
								<text class="num" style="margin-top: 14rpx;">{{ miyou.commentCount }}</text>
							</view>
							<view class="icon-item flex-center" @click="collectMiyou">
								<image :src="'https://www.51mihuo.com/static/icon/capp/'+ 
								(miyou.isCollect?'have_collect.png':'collect.png')" class="icon-2"></image>
								<!-- 收藏次数 -->
								<text class="num" style="margin-top: 14rpx;">{{ miyou.collectCount }}</text>
							</view>
						</view>
					</view>
					<view class="content-container">
						<view class="title" v-if="miyou.userId > 0">
							<!-- 觅友圈标题 -->
							{{ miyou.title }}
						</view>
						<view class="des" v-if="miyou.userId > 0">
							<!-- 觅友圈内容 -->
							{{ miyou.content }}
						</view>
						<view class="tags flex-center">
							<view class="tag-item flex-center" v-if="item" v-for="(item, index) in miyou.topics"
								:key="index">
								<view class="box"></view>
								<text class="text">{{ item }}</text>
							</view>
						</view>
					</view>
					<u-divider half-width="45%" :use-slot="false"></u-divider>
					<!-- 觅友圈评论 -->
					<view class="comment-container" v-if="miyouComment">
						<view class="title">
							{{ commentTotal }}条评论
						</view>
						<view class="comment-item" v-for="(item, index) in miyouComment" :key="index">
							<view class="flex-center">
								<view class="left flex-center">
									<u-avatar :src="$util.avatarImage(item.commentUserId)" size="56"></u-avatar>
								</view>
								<view class="center flex-center">
									<text class="name">{{ item.userName }} {{ item.commentDate }} </text>
									<text class="comment" @click="replyComment(item)">{{ item.comment }}</text>
								</view>
								<view class="right flex-center">
									<view class="dots flex-center" @click="clickCommentDots(item)">
										<view class="dot"></view>
										<view class="dot"></view>
										<view class="dot"></view>
									</view>
									<uni-icons v-if="item.isLike" type="heart" @click="likeComment(item)"
										color="#FE6E32">
									</uni-icons>
									<uni-icons v-if="!item.isLike" type="heart" @click="likeComment(item)"
										color="#999999">
									</uni-icons>
									<text :style="{ color: item.isLike ? '#FE6E32' : '#999999' }"
										class="num">{{ item.likeCount }}</text>
								</view>
							</view>
							<view class="child-comments" v-if="item.childComment.length">
								<view class="child-comment flex-center" v-for="child, index2 in item.childComment"
									:key="index2" @click="replyComment(child)">
									<view class="comment-name">
										{{ child.userName }}
									</view>
									{{ child.commentUserId !== item.userId ? '&nbsp回复' : '' }}
									<view class="blue-text" v-if="child.commentUserId !== item.userId">
										{{ '&nbsp@' + child.commentUserName }}
									</view>
									{{ ': ' + child.comment }}
								</view>
								<view class="child-comment"
									v-if="item.childCommentCount > 3 && item.childCommentCount > item.childComment.length"
									@click="loadMoreChildComment(item)">
									<view class="more-text">
										展开更多{{ item.childCommentCount - item.childComment.length }}条回复 >
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="bottom-buttons flex-center">
						<uni-easyinput prefixIcon="compose" :inputBorder="false" v-model="comment" @blur="onBlur"
							@confirm="confirmSend" confirm-type="send" class="input-container" :focus="isFocus"
							placeholder-class="placeholder" type="text" :placeholder="placeholderText" />
						<view class="right flex-center">
							<view class="icon-item flex-center" @click="clickLike">
								<image :src="'https://www.51mihuo.com/static/icon/capp/'+ 
								(miyou.isLike?'have_praise.png':'praise.png')" class="icon"></image>
								<text class="num">{{ miyou.likeCount }}</text>
							</view>
							<!-- <view class="icon-item flex-center">
									<image src="https://www.51mihuo.com/static/icon/miyou/button_4.png" class="icon"></image>
									<text class="num">{{ miyou.commentCount }}</text>
								</view> -->
							<view class="icon-item flex-center" @click="collectMiyou">
								<image :src="'https://www.51mihuo.com/static/icon/capp/'+ 
								(miyou.isCollect?'have_collect.png':'collect.png')" class="icon"></image>
								<text class="num">{{ miyou.collectCount }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</mh-skeleton>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isShowImage: false,
				showPicker: false,
				optionsList: [{
					text: '删除',
					fontSize: 28
				}],
				selectedComment: {},
				miyouId: '',
				miyou: {},
				comment: '',
				swiperImgList: [],
				miyouComment: [], // 觅友圈评论
				isReply: false, // 是否是回复评论
				placeholderText: '说点什么',
				isFocus: false,
				pageSize: 10,
				commentTotal: 0,
				userId: uni.getStorageSync('userData') ? uni.getStorageSync('userData').sysUser.userId : ''
			}
		},
		onLoad(option) {
			if (option.miyouId) {
				this.miyouId = option.miyouId
				this.getData()
				this.getComment()
			}
		},
		onShow() {
			this.$forceUpdate()
		},
		onReachBottom() {
			if (this.miyouComment.length === +this.commentTotal) {
				return
			}
			this.pageSize += 10
			this.getComment()
		},
		onShareAppMessage(e) {
			const coverImg = this.$util.thumbnailImage(this.miyou.images[0].url, true, 750)
			const path = `/pages-user/miyou/miyouDetail?miyouId=${this.miyou.id}`
			const result = this.$util.shareToWechat(this.miyou.title, coverImg, path, '觅友圈详情', true, 1)
			return result
		},
		methods: {
			shareMiyou() {
				// #ifdef APP-PLUS
				const coverImg = this.$util.thumbnailImage(this.miyou.images[0].url, true, 750)
				const path = `/pages-user/miyou/miyouDetail?miyouId=${this.miyou.id}`
				const result = this.$util.shareToWechat(this.miyou.title, coverImg, path, '觅友圈详情', true, 2)
				// #endif
			},
			loadMoreChildComment(item) {
				if (item.childComment.length === +item.childCommentCount) {
					return
				}
				item.current += 1
				this.$httpApi.getMiyouComment({
					circleId: this.miyouId,
					commentId: item.id,
					current: item.current,
					userId: this.userId
				}).then(res => {
					if (res.records.length === 0) {
						item.current -= 1
						return
					}
					item.childComment.push(...res.records)
				})
			},
			// 失去焦点
			onBlur() {
				this.selectedComment = {}
				// 此条注释，因为在编写内容时,切到其他app,在切回来后内容会置空
				// this.comment = ''
				this.placeholderText = '说点什么'
			},
			// 回复评论
			replyComment(item) {
				this.selectedComment = item
				this.isReply = true
				this.isFocus = true
				this.placeholderText = `回复${this.selectedComment.userName}: 说点什么`
			},
			// 获取评论
			getComment() {
				this.$httpApi.getMiyouComment({
					circleId: this.miyouId,
					size: this.pageSize,
					userId: this.userId
				}).then(res => {
					this.commentTotal = res.total
					const arr = res.records.map(item => {
						return {
							current: 0,
							...item
						}
					})
					this.miyouComment = arr
				})
			},
			// 收藏觅友圈
			collectMiyou() {
				if (!this.userId) {
					this.$util.toast('请先登录!')
					return
				}
				this.$httpApi.collectMiYou(this.miyou.id).then(res => {
					this.$util.toast(`${this.miyou.isCollect ? '已取消收藏' : '收藏成功'}！`)
					this.getData()
				})
			},
			// 点赞觅友圈
			clickLike() {
				if (!this.userId) {
					this.$util.toast('请先登录!')
					return
				}
				this.$httpApi.likeMiYou(this.miyou.id).then(res => {
					this.$util.toast(`${this.miyou.isLike ? '已取消点赞' : '点赞成功'}！`)
					this.getData()
				})
			},
			confirmPicker(e) {
				if (e === 0) {
					// 删除评论
					this.$httpApi.deleteMiYouComment(this.selectedComment.id).then(res => {
						this.getComment()
					})
				}
			},
			// 点赞评论
			likeComment(item) {
				this.$httpApi.likeMiYouComment(item.id).then(res => {
					this.getComment()
				})
			},
			getData() {
				this.$httpApi.getMiYouById({
					circleId: this.miyouId,
					userId: this.userId,
					status: 1
				}).then(res => {
					if (res) {
						this.miyou = res
						if (this.miyou.images && this.miyou.userId > 0) {
							let imgs = this.miyou.images
							this.swiperImgList = imgs.map(file => {
								return {
									image: this.$image.imageGlobal + file.url
								}
							})
							this.isShowImage = true
						}
					}
				})
			},
			clickCommentDots(item) {
				if (item.userId == this.userId) {
					// 评论ID和当前登录用户ID一致时，才可以删除评论
					this.showPicker = true
					this.selectedComment = item
				}
			},
			confirmSend() {
				if (!this.userId) {
					this.$util.toast('请先登录!')
					return
				}
				this.$httpApi.commentMiYou({
					circleId: this.miyou.id,
					commentId: this.isReply ? this.selectedComment.id : null,
					comment: this.comment
				}).then(res => {
					if (res) {
						this.$util.toast('发送成功！')
						if (!res.commentId) {
							// 回复觅友圈
							this.commentTotal++
							this.miyouComment.unshift(res)
						} else {
							// 回复评论
							const fIndex = this.miyouComment.findIndex(item => item.id === res.primaryCommentId)
							if (fIndex != -1) {
								this.miyouComment[fIndex].childComment.unshift(res)
							}
						}
						this.$forceUpdate()
						this.getData()
						this.isFocus = false
						this.selectedComment = {}
						this.comment = ''
						this.placeholderText = '说点什么'
					}
				}).catch(e => console.log(e))
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.left-container {
		width: 500rpx;
		height: 100%;
		justify-content: flex-start;

		.header-icon {
			margin: 0 16rpx;
			width: 20px;
			height: 20px;
		}

		.info {
			width: 300rpx;
			text-align: left;
			margin-left: 10rpx;

			.name {
				width: 100%;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 24rpx;
				line-height: 34rpx;
				color: $fontColor33;
				@include toe()
			}

			.time {
				width: 100%;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 20rpx;
				line-height: 28rpx;
				color: $fontColor99;
			}
		}
	}

	.right-container {
		width: 200rpx;
		height: 100%;
		justify-content: flex-end;
		padding-right: 30rpx;

		.share-icon {
			width: 34rpx;
			height: 34rpx;
		}
	}

	.swiper {
		width: 100vw;
		height: 960rpx;
	}

	.main-container {
		width: 100vw;
		background-color: #fff;

		.buttons-container {
			width: 100%;
			height: 100rpx;

			.left {
				width: 20%;
				height: 100rpx;
				justify-content: center;
			}

			.right {
				width: 80%;
				height: 100rpx;
				justify-content: flex-end;
			}

			.icon-item {
				flex-direction: column;
				justify-content: center;
				align-items: center;
				margin-right: 40rpx;

				.icon {
					width: 64rpx;
					height: 64rpx;
				}

				.icon-2 {
					width: 34rpx;
					height: 34rpx;
					margin-top: 2rpx;
				}

				.num {
					font-family: PingFang SC;
					font-style: normal;
					font-weight: 500;
					font-size: 20rpx;
					line-height: 28rpx;
					color: $fontColor66;
				}
			}
		}

		.title {
			width: 100%;
			font-family: PingFang SC;
			font-style: normal;
			font-weight: bold;
			font-size: 30rpx;
			line-height: 42rpx;
			color: $fontColor33;
			@include toe()
		}

		.content-container {
			width: 100%;
			min-height: 100rpx;
			height: max-content;
			padding: 20rpx;

			.des {
				width: 100%;
				margin-top: 20rpx;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: 500;
				font-size: 26rpx;
				line-height: 42rpx;
				color: #444444;
			}

			.tags {
				width: 100%;
				min-height: 48rpx;
				height: max-content;
				margin-top: 20rpx;
				flex-wrap: wrap;

				.tag-item {
					width: max-content;
					height: 48rpx;
					margin-right: 16rpx;
					margin-bottom: 16rpx;
					padding: 16rpx;
					border-radius: 4rpx;
					background: #F6F6F8;

					.box {
						width: 20rpx;
						height: 20rpx;
						background: #C4C4C4;
					}

					.text {
						margin-left: 6rpx;
						font-family: PingFang SC;
						font-style: normal;
						font-weight: 500;
						font-size: 24rpx;
						line-height: 34rpx;
						color: #444444;
					}
				}
			}
		}

		.comment-container {
			width: 100%;
			min-height: 300rpx;
			height: max-content;
			padding: 20rpx;
			padding-bottom: 144rpx;

			.comment-item {
				width: 692rpx;
				height: max-content;
				min-height: 110rpx;
				margin: 20rpx 0;

				.left {
					width: 10%;
					height: 110rpx;
					justify-content: center;
					align-items: flex-start;
					padding-top: 20rpx;
				}

				.center {
					width: 70%;
					height: max-content;
					max-height: 220rpx;
					padding-left: 20rpx;
					flex-direction: column;

					.name {
						width: 100%;
						height: 34rpx;
						font-family: PingFang SC;
						font-style: normal;
						font-size: 24rpx;
						line-height: 34rpx;
						color: #A5A4AA;
					}

					.comment {
						width: 100%;
						height: 34rpx;
						font-family: PingFang SC;
						font-style: normal;
						font-weight: 500;
						font-size: 24rpx;
						line-height: 34rpx;
						color: #333333;
						@include toe();
					}
				}

				.right {
					width: 20%;
					height: 110rpx;
					justify-content: flex-end;
					align-items: flex-start;
					padding-top: 20rpx;

					.dots {
						margin-top: 14rpx;
						margin-right: 10rpx;

						.dot {
							width: 8rpx;
							height: 8rpx;
							margin-right: 4rpx;
							border-radius: 50%;
							background-color: $fontColor99;
						}
					}

					.num {
						margin-left: 4rpx;
						margin-top: 4rpx;
						font-family: PingFang SC;
						font-style: normal;
						font-weight: bold;
						font-size: 24rpx;
						line-height: 28rpx;
						color: #A5A4AA;
					}
				}

				.child-comments {
					width: 592rpx;
					margin-left: 100rpx;
					background-color: #F7F7F7;
					padding: 16rpx;

					.child-comment {
						width: 100%;
						height: 44rpx;
						line-height: 44rpx;
						font-size: 24rpx;

						.comment-name {
							color: #467c99;
							font-size: 24rpx;
						}

						.blue-text {
							color: #467c99;
							font-size: 24rpx;
						}

						.more-text {
							color: #467c99;
							font-size: 24rpx;
						}
					}
				}
			}
		}

		.bottom-buttons {
			width: 100%;
			position: fixed;
			bottom: 0;
			background-color: #fff;
			/* #ifdef MP */
			padding: 0 20rpx 60rpx 20rpx;
			/* #endif */
			/* #ifdef APP */
			padding: 0 20rpx;
			height: 120rpx;
			/* #endif */
			/* #ifdef H5 */
			padding: 0 20rpx;
			/* #endif */
			padding-bottom: env(safe-area-inset-bottom);
			padding-top: 20rpx;
			flex: 1;

			.input-container {
				background: #F6F5FA;
				border-radius: 100rpx;
				color: #A5A4AA;
				padding: 0 20rpx;
			}

			/deep/ .placeholder {
				font-family: PingFang SC;
				font-style: normal;
				font-weight: 500;
				font-size: 20rpx;
				line-height: 28rpx;
				color: #A5A4AA;
			}

			.right {
				width: 30%;
				height: 100rpx;
				justify-content: flex-end;

				.icon-item {
					flex-direction: column;
					justify-content: center;
					align-items: center;
					margin-right: 40rpx;

					.icon {
						width: 34rpx;
						height: 34rpx;
					}

					.num {
						font-family: PingFang SC;
						font-style: normal;
						font-weight: 500;
						font-size: 20rpx;
						line-height: 28rpx;
						color: $fontColor66;
					}
				}
			}
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
