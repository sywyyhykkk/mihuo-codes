<template>
	<view class="view-drawings">
		<public-module></public-module>
		<z-nav-bar type="transparent" fontColor="#979797" backState="1000"></z-nav-bar>
		<view class="swiper">
			<u-swiper :list="imgList" mode="rect" :height="swiperheight" @click="getSwiper" @change="onChangeSwiper" img-mode="aspectFit"
				:autoplay="false" border-radius="0"></u-swiper>
			<!-- image v-if="setVideo(imgList[currentFileIndex] && imgList[currentFileIndex].type )"
				src="/static/images/video-start.png" class="video-play-img" mode="" @click="videoPlay()"></image> -->
		</view>
		<view class="info">
			<view class="info-file" @click="getMoreFile()" v-if="otherFileList.length > 0">
				<view class="item-left">
					<image src="@/static/images/icon_file.png" mode=""></image>
					<text>{{otherFileList.length}}份附件</text>
				</view>
				<u-icon name="arrow-right" color="#979797" size="28"></u-icon>
			</view>
			<view class="info-other">
				<view class="header-container flex-center">
					<view class="left flex-center">
						<u-avatar :src="$util.thumbnailImage(nodeInfo.avatar, true, 36)" size="36"
							style="margin-right: 10rpx;"></u-avatar>
						{{ nodeInfo.personName }}<text>{{ item.updated }} 上传</text>
					</view>
				</view>
				<view class="note">
					<text class="item-label">备注</text>
					<view class="item-remark">
						{{item.remark}}
					</view>
				</view>
			</view>
			<bottom-button title="下载" @click="download"></bottom-button>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	export default {
		data() {
			return {
				fileList: [],
				imgList: [],
				currentFileIndex: 0,
				item: {},
				currentVideo: '',
				currentIndex: 0,
				videoType: ['avi', 'wmv', 'mpeg', 'mp4', 'm4v', 'mov', 'asf', 'flv', 'f4v', 'rmvb', 'rm', '3gp'],
				docImg: require('../../../static/images/file_type/doc.png'),
				pdfImg: require('../../../static/images/file_type/pdf.png'),
				xlsImg: require('../../../static/images/file_type/xls.png'),
				zipImg: require('../../../static/images/file_type/zip.png'),
				pptImg: require('../../../static/images/file_type/ppt.png'),
				cadImg: require('../../../static/images/file_type/cad.png'),
				defaultImg: require('../../../static/images/file_type/default.png'),
				swiperHeight: 1000,
				otherFileList:[],
			}
		},
		onLoad(option) {
			this.item = uni.getStorageSync('currentViewing')
			this.fileList = JSON.parse(this.item)
			this.setFileList()
			this.fileList.forEach(item => {
				if (item) {
					this.imgList.push({
						type: item.type,
						url: item.type == 'video' ? this.$util.thumbnailImage(item.url, false) : '',
						image: {
							img: this.$image.imageGlobal + item.url,
							video: this.$util.thumbnailVideo(item.url),
							doc: this.docImg,
							docx: this.docImg,
							pdf: this.pdfImg,
							xls: this.xlsImg,
							zip: this.zipImg,
							ppt: this.pptImg,
							pptx: this.pptImg,
							cad: this.cadImg,
							xlsx: this.xlsImg,
						} [item.type]
					})
					if (!item.image) {
						item.image = this.defaultImg
					}

					let tempUrl = this.imgList[0] && this.imgList[0].image
					this.videoType.forEach(el => {
						if (tempUrl.includes(el)) {
							this.currentVideo = tempUrl
						}
					})
				}
			})
			this.equipment()
		},
		computed: {
			...mapState(['nodeInfo'])
		},
		methods: {
			setFileList(){
				// return
				this.otherFileList = this.fileList.filter(item => !['img','video'].includes(item.type))
				this.fileList = this.fileList.filter(item => ['img','video'].includes(item.type))
			},
			setVideo(item) {
				if (item == 'video') {
					return true
				} else {
					return false
				}
			},
			equipment() {
				uni.getSystemInfo({
					success: (res) => {
						let height = res.windowHeight * (750 / res.windowWidth) * 0.75 //获取系统信息，可使用窗口的高度
						this.swiperheight = height;
					}
				});
			},
			onChangeSwiper(index) {
				this.currentFileIndex = index;
			},
			download() {
				let currentFile = this.fileList[this.currentFileIndex];
				if (currentFile.type === 'img') {
					// 图片保存到相册
					uni.downloadFile({
						url: this.$util.thumbnailImage(currentFile.url, true),
						success: (res) => {
							if (res.statusCode === 200) {
								uni.saveImageToPhotosAlbum({
									filePath: res.tempFilePath,
									success: () => {
										this.$util.toast('已保存至相册!');
										return;
									},
									fail: () => {
										this.$util.toast('保存失败，请稍后重试～');
										return;
									}
								});
							}
						}
					});
				} else {
					//其他类型文件下载到本地
					const downloadTask = uni.downloadFile({
						url: this.$util.thumbnailImage(currentFile.url, false),
						success: (res) => {
							if (res.statusCode === 200) {
								this.$util.toast('下载成功!');
							}
							uni.saveFile({
								tempFilePath: res.tempFilePath,
								success: function(response) {
									console.log(response)
								}
							});
						},
						fail: (res) => {
							this.$util.toast('下载失败，请稍后再试～');
							console.log(res)
						},
						complete: (res) => {
							console.log(res)
						}
					});
					// 进度条
					// downloadTask.onProgressUpdate((res) => {
					// 	console.log('下载进度' + res.progress);
					// 	console.log('已经下载的数据长度' + res.totalBytesWritten);
					// 	console.log('预期需要下载的数据总长度' + res.totalBytesExpectedToWrite);
					// });
				}
			},
			getSwiper(index){
				let tempUrl = this.imgList[index].url
				if (!tempUrl) {
					return
				}
				this.toPage(`/pages/full-screen/full-screen?url=${tempUrl}`);
			},
			videoPlay(url) {
				let tempUrl = this.imgList[this.currentFileIndex].url
				if (!tempUrl) {
					return
				}
				this.toPage(`/pages/full-screen/full-screen?url=${tempUrl}`);
			},
			getMoreFile(){
				let that =this
				uni.navigateTo({
					url: '/pages/construction/drawings/toViewFile',
					success(res) {
						res.eventChannel.emit('toViewFile', that.otherFileList);
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.view-drawings {
		height: 100%;
	}

	.swiper {
		width: 100%;
		height: 75vh;
		position: relative;
	}

	.video-play-img {
		width: 150rpx;
		height: 150rpx;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translateX(-50%) translateY(-50%);
	}

	.info {
		width: 100%;
		height: 25vh;
		background: #F6F7F9;
		border-radius: 10rpx 10rpx 0rpx 0rpx;

		.info-file {
			display: flex;
			justify-content: space-between;
			border-radius: 10rpx 10rpx 0rpx 0rpx;
			height: 84rpx;
			background-color: $bgColor;
			padding: 0 28rpx;


			.item-left {
				display: flex;
				align-items: center;
			}

			image {
				width: 40rpx;
				height: 40rpx;
			}
			
			text{
				color: #3D3D3D;
				font-size: 26rpx;
				margin-left: 16rpx;
			}

			.arrow-right {
				width: 20rpx;
			}
		}

		.info-other {
			padding: 32rpx;
		}

		.header-container {
			width: 100%;

			.left {
				width: 100%;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: 400;
				font-size: $smallFontSize;
				line-height: 34rpx;
				color: $mainFontColor;

				text {
					margin-left: 20rpx;
					font-family: PingFang SC;
					font-style: normal;
					font-weight: 300;
					font-size: $smallFontSize;
					line-height: 34rpx;
					color: $mainFontColor;
				}
			}
		}

		.note {
			margin-top: 20rpx;
			font-family: PingFang SC;
			font-style: normal;
			font-weight: 300;
			display: flex;


			.item-label {
				font-size: $smiddleFontSize;
				line-height: 36rpx;
				color: $viceFontColor;
				white-space: nowrap;
			}

			.item-remark {
				margin-left: 20rpx;
				font-style: normal;
				font-weight: 500;
				font-size: $smiddleFontSize;
				line-height: 36rpx;
				color: $mainFontColor;
				height: 100rpx;
				overflow-y: auto;
			}
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}

	.button-content {
		height: auto !important;

		/deep/ .bottom-button {
			background: #F6F7F9 ;
		}
	}
</style>
