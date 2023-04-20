<template>
	<view class="card" @click="goToDetail">
		<mh-skeleton :loading="!isShow" :imgTitleHeight="340" :row="1">
			<image class="card-image" v-if="!isVideo" mode="widthFix"
				:src="$util.thumbnailImage(coverPic, true, 340)" :index="miyouItem.id">
			</image>
			<image class="card-image" v-else mode="widthFix" :src="coverPic" :index="miyouItem.id">
			</image>
			<view class="info">
				<view class="title">
					{{ miyouItem.title }}
				</view>
				<view class="footer flex-center">
					<view class="left flex-center">
						<u-avatar v-if="miyouItem.userId" :src="$util.avatarImage(miyouItem.userId)" size="28">
						</u-avatar>
						<view class="text">
							{{ miyouItem.userNickName }}
						</view>
					</view>
					<view class="right flex-center">
						<image src="https://www.51mihuo.com/static/icon/miyou/button_2.png" class="icon"></image>
						<view class="text">
							{{ miyouItem.likeCount }}
						</view>
					</view>
				</view>
			</view>
		</mh-skeleton>
	</view>
</template>

<script>
	export default {
		name: "mh-miyou-card",
		props: {
			miyouItem: {
				default: () => {
					return {}
				}
			}
		},
		data() {
			return {
				isShow: false,
				coverPic: '',
				isVideo: false,
			};
		},
		mounted() {
			if (!this.miyouItem.images) {
				this.coverPic = ''
				return
			}
			try {
				let arr = this.miyouItem.images
				if (arr.length !== 0) {
					const item = arr[0]
					if (item.type === 'img') {
						this.coverPic = item.url
					} else {
						this.isVideo = true
						this.coverPic = this.$util.thumbnailVideo(item.url, true, 340)
					}
				}
			} catch (e) {
				// 平台维护内容时 封面图为单张图片
				let arr = this.miyouItem.images.split(',')
				this.coverPic = this.$util.thumbnailVideo(arr[0], true, 340)
			}
			setTimeout(() => {
				this.isShow = true
			}, 1000)
		},
		methods: {
			goToDetail() {
				this.toPage(`/pages-user/miyou/miyouDetail?miyouId=${this.miyouItem.id}`)
			}
		},
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.card {
		width: 340rpx;
		height: max-content;
		min-height: 200rpx;
		background-color: #fff;
		margin-bottom: 12rpx;
		border-radius: 8rpx;
		
		.card-image {
			width: 340rpx;
			border-radius: 8rpx;
		}
		
		.info {
			width: 100%;
			height: 100rpx;
			padding: 0 12rpx;

			.title {
				width: 100%;
				height: 60rpx;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 28rpx;
				line-height: 60rpx;
				color: $fontColor33;
				@include toe()
			}

			.footer {

				.left,
				.right {
					height: 40rpx;

					.icon {
						width: 28rpx;
						height: 28rpx;
					}

					.text {
						margin-left: 8rpx;
						font-family: PingFang SC;
						font-style: normal;
						font-weight: 500;
						font-size: 20rpx;
						line-height: 40rpx;
						color: $fontColor99;
						@include toe()
					}
				}

				.left {
					width: 75%;
				}

				.right {
					width: 25%;
					justify-content: flex-end;
				}
			}
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
