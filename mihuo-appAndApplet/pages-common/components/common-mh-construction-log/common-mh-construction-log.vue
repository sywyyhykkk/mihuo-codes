<template>
	<view class="construction-log-contain">
		<view class="log-header" v-if="titleType">
			<view class="item-top">
				<mihuo-image class="img" src="https://www.51mihuo.com/static/images/home/dian_2.png"></mihuo-image>
				<view class="text">服务日志</view>
			</view>
		</view>
		<view class="log-contain">
			<view class="log-top">
				<image :src="$util.thumbnailImage(logItem.userAvatar, true, 96)" class="avatar"></image>
				<view class="people-contain">
					<view class="name">{{ logItem.userName || 'username' }}
						<text class="position">{{ logItem.userPosition || 'userPosition' }}</text>
					</view>
					<text class="time">{{ logItem.pushTime | dateDiff }}</text>
				</view>
			</view>
			<view class="log-middle">
				<view class="text-contain">
					{{ logItem.content || ''}}
				</view>
				<view class="image-contain">
					<u-lazy-load @click="imgPreview(index)" imgMode="aspectFill" height="204" class="case-item"
						:style="{width: getImgWidth}" :hasBottomRadius="true" border-radius="10"
						v-for="(img, index) in logItem.images ? logItem.images.split(',') : []" :key="index"
						v-if="index <= 2" :image="$util.thumbnailImage(img)">
					</u-lazy-load>
					<view class="img-num" v-if="len >= 3">
						<image src="https://www.51mihuo.com/static/images/case/img.png" class="icon" />
						{{ len || 0 }}
					</view>
				</view>
			</view>
			<view class="last-comment" v-if="logItem.lastComment">
				<view class="comment-titlet">
					最新评论
				</view>
				<view class="content">
					<u-avatar class="avatar" size="42" :src="$util.avatarImage(logItem.lastComment.createBy)">
					</u-avatar>
					<text class="text">{{ logItem.lastComment.content }}</text>
				</view>
			</view>
			<view class="log-bottom">
				<view class="left"> {{ logItem.status }}</view>
				<view class="right">
					<image src="https://www.51mihuo.com/static/images/case/dz_1.png" v-if="!logItem.isLike" class="buttom_praise"
						@click="likeLog" />
					<image src="https://www.51mihuo.com/static/images/case/dz_1_1.png" v-if="logItem.isLike" class="buttom_praise"
						@click="likeLog" />
					<view class="buttom_number" @click="likeLog">
						{{ logItem.likeNum <= 9999 ? logItem.likeNum : `${(logItem.likeNum / 10000).toFixed(2)}w` }}
					</view>
					<image src="https://www.51mihuo.com/static/images/myHome/message.png" class="bottom_message" @click="openComment"></image>
				</view>
			</view>
		</view>
		<view class="divider" v-if="!isLast"></view>
		<uni-easyinput @blur="blur" :focus="isFocus" v-if="isFocus" prefixIcon="compose" :inputBorder="false"
			v-model="comment" @confirm="confirmSend" confirm-type="send" class="input-container" type="text"
			placeholder="说点什么......" />
	</view>
</template>

<script>
	export default {
		props: {
			updateLog: {
				default: () => {}
			},
			titleType: {
				default: true
			},
			logItem: {
				default: () => {
					return {}
				}
			},
			isLast: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				len: 0,
				comment: '',
				isFocus: false,
				isBlur: false,
			}
		},
		computed: {
			getImgWidth() {
				if (!this.logItem.images) {
					return ''
				}
				let len = this.logItem.images.split(',').length
				this.len = len
				if (len === 1) {
					return '100%'
				} else if (len === 2) {
					return '46%'
				} else {
					return '30%'
				}
			}
		},
		mounted() {},
		methods: {
			blur() {
				this.isBlur = true
				this.openComment()
			},
			openComment(){
				if(this.isBlur){
					this.isFocus = false
				} else {
					this.isFocus = !this.isFocus
					this.isBlur = false
				}
				// 优化用户点击评论按钮时的交互
				setTimeout(() => {
					this.isBlur = false
				}, 100)
			},
			confirmSend() {
				if (!this.comment) {
					this.isFocus = false
					return
				}
				this.$httpApi.commentConstructionLogById({
					content: this.comment,
					journalId: Number(this.logItem.id)
				}).then(res => {
					if (res) {
						this.$util.toast('评论成功！')
						this.isFocus = false
						this.comment = ''
						this.$emit('updateLog')
					}
				})
			},
			imgPreview(index) {
				uni.previewImage({
					current: index,
					urls: this.logItem.images.split(',').map(item => {
						return this.$image.imageGlobal + item
					})
				})
			},
			likeLog() {
				this.$httpApi.likeConstructionLogById({
					isLike: !this.logItem.isLike,
					journalId: this.logItem.id
				}).then(res => {
					this.$emit('updateLog')
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.construction-log-contain {
		.log-header {
			.item-top {
				display: flex;
				align-items: center;
				margin-bottom: 28rpx;
				position: relative;
				padding-left: 20rpx;

				image {
					width: 8rpx;
					height: 40rpx;
				}

				.text {
					margin-left: 12rpx;
					position: relative;
					z-index: 2;
					font-family: PingFang SC;
					font-style: normal;
					font-weight: 900;
					font-size: 32rpx;
					line-height: 44rpx;
					color: #303133;
					margin-left: 20rpx;
				}

				.text-log {
					position: absolute;
					left: 74rpx;
					top: 8rpx;
				}
			}
		}

		.log-contain {
			background: #FFFFFF;
			border-radius: 20rpx;
			height: max-content;
			padding: 30rpx 44rpx 36rpx 44rpx;
			position: relative;

			.log-top {
				display: flex;
				margin-bottom: 28rpx;

				.avatar {
					width: 96rpx;
					height: 96rpx;
					border-radius: 50%;
				}

				.people-contain {
					display: flex;
					flex-direction: column;
					margin-left: 18rpx;

					.name {
						display: flex;
						align-items: center;
						font-weight: bold;
						font-size: 32rpx;
						line-height: 44rpx;
						color: #303133;

						.position {
							width: max-content;
							height: 28rpx;
							padding: 0 10rpx;
							margin-left: 10rpx;
							font-family: PingFang SC;
							font-style: normal;
							font-weight: 500;
							font-size: 20rpx;
							line-height: 28rpx;
							color: #FFFFFF;
							text-align: center;
							background: linear-gradient(90deg, #FF9A52 0%, #FF6A32 100%);
							border-radius: 25px 2px 2px 25px;
						}
					}

					.time {
						font-weight: bold;
						font-size: 28rpx;
						line-height: 40rpx;
						color: #909199;
					}
				}
			}

			.log-middle {
				margin-bottom: 40rpx;

				.text-contain {
					font-weight: bold;
					font-size: 28rpx;
					line-height: 40rpx;
					color: #606166;
					margin-bottom: 28rpx;
				}

				.image-contain {
					display: flex;
					flex-wrap: wrap;
					justify-content: space-between;

					.case-item {
						height: max-content;

						&:last-of-type {
							margin-right: 0;
						}
					}

					.img-num {
						width: 86rpx;
						height: 40rpx;
						padding: 0 20rpx;
						position: relative;
						left: 85%;
						bottom: 50rpx;
						display: flex;
						align-items: center;
						background: rgba(0, 0, 0, 0.5);
						border-radius: 30rpx;
						font-family: PingFang SC;
						font-style: normal;
						font-weight: 900;
						font-size: 28rpx;
						line-height: 40rpx;
						color: #FFFFFF;
						text-align: center;

						.icon {
							width: 36rpx;
							height: 36rpx;
						}
					}
				}
			}

			.last-comment {
				width: 660rpx;
				height: 138rpx;
				background: #F7F7F7;
				border-radius: 10rpx;
				padding: 20rpx;

				.comment-titlet {
					font-family: PingFang SC;
					font-style: normal;
					font-weight: bold;
					font-size: 28rpx;
					line-height: 50rpx;
					color: #000000;
				}

				.content {
					width: 100%;
					height: 60rpx;
					display: flex;
					align-items: center;

					.text {
						font-family: PingFang SC;
						font-style: normal;
						font-weight: bold;
						font-size: 24rpx;
						line-height: 60rpx;
						color: #909199;
						@include toe();
					}

					.avatar {
						margin-right: 10rpx;
					}
				}
			}

			.log-bottom {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				margin-top: 20rpx;

				.left {
					font-weight: bold;
					font-size: 26rpx;
					line-height: 36rpx;
					color: #909199;
				}

				.right {
					display: flex;

					image {
						width: 42rpx;
						height: 42rpx;
					}

					.buttom_number {
						font-weight: bold;
						font-size: 24rpx;
						line-height: 34rpx;
						color: #FF5D35;
						margin-right: 30rpx;
					}
				}
			}
		}


		.divider {
			width: 4rpx;
			height: 46rpx;
			background: #E4E5E9;
			margin-left: 40rpx;
		}

		.input-container {
			width: 100vw;
			height: 60rpx;
			background: #F2F2F2;
			border-radius: 100rpx;
			color: #A5A4AA;
			padding: 0 20rpx;
			margin-bottom: 20rpx;
		}

		/deep/ .placeholder {
			font-family: PingFang SC;
			font-style: normal;
			font-weight: 500;
			font-size: 20rpx;
			line-height: 28rpx;
			color: #A5A4AA;
		}
	}
</style>
