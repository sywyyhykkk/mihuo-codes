<template>
	<view class="upload-page">
		<view class="upload-preview-contain" v-for="(item,index) in previewList" :key="index">
			<view v-if="item.type === 'img'" class="upload-preview"
				@click="preview( $util.thumbnailImage(item.url,false))"
				:style="{ backgroundImage: 'url(' + $util.thumbnailImage(item.url,true) + ')' }">
			</view>
			<view v-if="item.type === 'video'" class="upload-preview"
				@click="preview( $util.thumbnailImage(item.url,false))"
				:style="{ backgroundImage: 'url(' + $util.thumbnailVideo(item.url,true) + ')' }">
			</view>
			<image @click="close(item,'图片',index)" class="file-close" src="@/static/images/icon_close/file-close.png" mode="">
			</image>
			<image v-if="item.type === 'video'" src="/static/images/video-start.png" class="video-play-img" mode=""
				@click="videoPlay($util.thumbnailImage(item.url,false))"></image>
		</view>
		<view :class="[fileActive === true?'file-contain-active':'file-contain-all']">
			<view class="evaluation-file x6-flex x6-item-flex" @click="getFlieUpload(index)">
				<image class="input-icon" src="/static/images/phone_3.png" mode="">
				</image>
				<text class="file-placeholder">添加图片/视频</text>
			</view>
		</view>
	</view>
</template>

<script>
	import base from '@/config/baseUrl';
	import {
		CommonUpload
	} from '@/plugins/uploadPic.js';
	import {
		lFile
	} from '@/uni_modules/l-file/components/l-file/l-file.vue';
	export default {
		name: 'image-upload',
		props: {
			// 图片上传数量
			count: {
				type: Number,
				default: 1
			},
			//默认上传类型 ['图片', '视频', '文件']
			uploadType: {
				type: Array,
				default: function() {
					return ['图片']
				},
			},
			// 视频上传数量
			videoNum: {
				type: Number,
				default: 3
			},
			documentNum: {
				type: Number,
				default: 1
			},
			index: {
				type: Number,
				default: 0
			},
			value: {
				type: String,
				default: '[]'
			}
		},
		data() {
			return {
				fileSize: 6291456, // 1M=1024KB=1048576B
				previewList: [],
				FileUrl: require("@/static/images/file.png"),
				fileFormat: ['doc', 'xlsx', 'pdf', 'pptx', 'art', 'rar', 'txt', 'zip'],
				sourceType: ['拍摄', '相册', '拍摄或相册'],
				flieList: [],
				videoList: [],
				videoStatus: false,
				fileStatus: false,
				videoClass: "",
				fileList: [],
				webViewShow: false,
				fileActive: false,
				fileObjectList: {
					imgList: '',
					videoList: ''
				}
			}
		},
		mounted() {
			if (this.value) {
				this.previewList = JSON.parse(this.value)
			} 
		},
		watch: {
			previewList: {
				handler(newVal, oldVal) {
					if (newVal.length === 0 && this.videoList.length === 0) {
						this.fileActive = false
					} else {
						this.fileActive = true
					}
				},
				deep: true
			},
		},
		methods: {
			getFlieUpload() {
				uni.showActionSheet({
					title: "选择上传类型",
					itemList: ['图片', '视频'],
					success: (res) => {
						switch (res.tapIndex) {
							case 0:
								this.uploadImages()
								break
							case 1:
								this.uploadVideo()
								break
						}
					}
				})
			},
			videoPlay(url){
				// uni.$emit('videoUpdate',{url:url})
				// this.toPage("/pages/full-screen/full-screen")
				this.toPage(`/pages/full-screen/full-screen?url=${url}`);
			},
			close(item, type, index) {
				this.previewList.splice(index, 1)
				this.getChangeFile()
			},
			preview(ul) {
				uni.previewImage({
					current: 1,
					urls: [ul],
				})
			},
			uploadImages() {
				let tempPreviewList = this.previewList
				uni.chooseImage({
					count: 9,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'], //从相册选择
					success: async (res) => {
						for (let i = 0; i < res.tempFiles.length; i++) {
							if (res.tempFiles[i].size > this.fileSize) {
								this.$util.toast('上传图片大小不能超过6MB');
							} else {
								tempPreviewList.push({
									type: 'img',
									url: await CommonUpload(res.tempFiles[i].path)
								})
							}
						}
						this.previewList = tempPreviewList
						this.getChangeFile()
					}
				})
			},
			uploadVideo() {
				let tempPreviewList = this.previewList
				uni.chooseVideo({
					sourceType: ['album'],
					success: async (res) => {
						if (this.videoList.length < this.$props.videoNum) {
							tempPreviewList.push({
								type: 'video',
								url: await CommonUpload(res.tempFilePath)
							})
							this.previewList = tempPreviewList
							this.getChangeFile()
						}
					}
				})
			},
			getChangeFile() {
				this.$emit('input', JSON.stringify(this.previewList))
			}
		},
	}
</script>

<style lang="scss" scoped>
	.upload-page {
		display: flex;
		flex-wrap: wrap;
	}


	.x6-flex {
		display: flex;
	}

	.x6-item-flex {
		align-items: center;
		justify-content: center;
	}

	.upload-preview-contain {
		position: relative;
		flex-wrap: wrap;
		display: flex;
		width: 33%;

		&:nth-of-type(3n +0) {
			.upload-preview {
				margin-right: 0rpx;
			}
		}

		.video-play-img {
			width: 50rpx;
			height: 50rpx;
			position: absolute;
			width: 50rpx;
			height: 50rpx;
			top: calc(100% - 125rpx);
			left: calc(100% - 125rpx);
		}

		.upload-preview {
			width: 100%;
			height: 186rpx;
			background: #F6F7F9;
			border: 1px solid #EEEEEE;
			box-sizing: border-box;
			border-radius: 10rpx;
			background-size: cover;
			background-position: center;
			margin-right: 12rpx;
			margin-bottom: 12rpx;
		}


		.close-circle-fill {
			right: 0rpx;
			top: -30rpx !important;
			position: absolute;
			z-index: 99;
		}
	}




	.upload-video {
		position: relative;
		width: 100%;

		.item-video {
			width: 95%;
			height: 186rpx;
			border-radius: 10rpx;
			margin-right: 12rpx;
			margin-bottom: 12rpx;
		}

		.close-circle-fill {
			right: 0rpx;
			top: 0rpx;
			z-index: 99;
			position: absolute;
		}
	}

	.file-close {
		width: 36rpx;
		height: 36rpx;
		position: absolute;
		right: 0rpx;
		top: -10rpx;
		z-index: 10;
	}

	.file-contain-active {
		width: 30%;
	}

	.file-contain-all {
		width: 100%;
	}

	.evaluation-file {
		background: #F7F6FB;
		border-radius: 8px;
		width: auto;
		min-width: 186rpx;
		height: 186rpx;
		flex-direction: column;

		.input-icon {
			width: 86rpx;
			height: 74rpx;
			margin-bottom: 12rpx;
		}

		.file-placeholder {
			font-size: 26rpx;
			line-height: 40rpx;
			text-align: center;
			color: #909199;
		}
	}

	.videoClass {
		/deep/ .uni-video-current-time {
			display: block;
		}

		/deep/ .uni-video-progress-container {
			display: block;
		}

		/deep/ .uni-video-duration {
			display: block;
		}
	}


	/deep/ .uni-video-current-time {
		display: none;
	}

	/deep/ .uni-video-progress-container {
		display: none;
	}

	/deep/ .uni-video-duration {
		display: none;
	}

	/deep/ .uicon-plus {
		color: #c4c4c4;
		position: relative;
		top: 52rpx !important;
		left: 52rpx;
	}

	/deep/ .close-circle-fill {
		right: -130rpx;
		top: -32rpx !important;
		position: relative;
	}

	/deep/ .u-add-tips {
		display: none;
	}

	/deep/ .u-list-item {
		background: #F6F7F9;
	}
</style>
