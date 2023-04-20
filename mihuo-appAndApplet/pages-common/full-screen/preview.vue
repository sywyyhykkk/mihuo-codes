<template>
	<view class="preview-contain-all">
		<text class="item-num">{{currentIndex}}/{{imageList.length}}</text>
		<view class="preview-contain" @click="setPreviewShow()" @longpress="longpress">
			<swiper class="swiper" :indicator-dots="false" :autoplay="false" :duration="500" :current="current"
				@change='change'>
				<swiper-item v-for="(item,index) in imageList" :key="index">
					<image v-if="item.type ==='video'" src="@/pages-common/static/images/video-start.png" class="video-play-img"
						@click.stop="videoPlay($util.thumbnailImage(item.url, false))"></image>
					<image class="item-image" style="width: 100%;" mode="widthFix"
						:src="item.type === 'video'? $util.thumbnailVideo(item.url) :$util.thumbnailImage(item.url ? item.url : item ,true)">
					</image>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imageList: [],
				current: 0,
				currentIndex:0,
			}
		},
		onLoad(option) {
			if (option) {
				let temp = option.parameter && JSON.parse(option.parameter)
				this.imageList = temp.imageList
				this.current = temp.index
				this.currentIndex = this.current + 1
			}
		},
		onShow() {
			// uni.$on('imagePreview', (data) => {
			// 	this.imageList = data.imageList
			// 	this.current = data.index
			// 	this.$forceUpdate()
			// 	console.log("data", this.imageList)
			// })
		},
		onHide() {
			// uni.$off('imagePreview')
		},
		methods: {
			setPreviewShow() {
				// uni.$off('imagePreview')
				uni.navigateBack();
			},
			videoPlay(url) {
				this.toPage(`/pages-common/full-screen/full-screen?url=${url}`);
			},
			change(e) {
				this.current = e.target.current
				this.currentIndex = this.current + 1
			},
			longpress() {
				let path = this.$util.thumbnailImage(this.imageList[this.current].url, true)
				uni.showActionSheet({
					title: "",
					itemList: ['保存'],
					success: (res) => {
						switch (res.tapIndex) {
							case 0:
								uni.saveImageToPhotosAlbum({
									filePath: path,
									success: function() {
										uni.showToast({
											title: '图片保存成功',
											icon: 'none',
											duration: 2200
										});
									}
								});
								break
						}
					}
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.preview-contain-all {
		background-color: #000000;
		width: 100%;
		height: 100%;
	}

	.item-num {
		color: #FFFFFF;
		z-index: 11;
		position: relative;
		font-size: 28rpx;
		top: 20rpx;
		left: calc( 50% - 22rpx);
	}

	.preview-contain {
		display: block;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 10;
		background: rgba(49, 49, 49, 1);
		// z-index: 100;

		.swiper {
			width: 100%;
			height: 100%;
			position: relative;

			.video-play-img {
				width: 100rpx;
				height: 100rpx;
				position: fixed;
				z-index: 10;
				left: 50%;
				top: 50%;
				-webkit-transform: translate(-50%, -50%);
				transform: translate(-50%, -50%);
			}

			.item-image {
				position: absolute;
				left: 50%;
				top: 50%;
				-webkit-transform: translate(-50%, -50%);
				transform: translate(-50%, -50%);
				max-height: 90%;
				max-width: 100%;
			}

		}
	}
</style>
