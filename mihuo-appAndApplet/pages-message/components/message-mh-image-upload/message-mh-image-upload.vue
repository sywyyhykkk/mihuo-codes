<template>
	<view class="upload-page">
		<!-- 图片 -->
		<view class="upload-preview-contain" v-for="(item, index) in previewList" :key="index">
			<view class="upload-preview" @click="preview(item)" :style="{ backgroundImage: 'url(' + item + ')' }">
			</view>
			<view>
				<u-icon name="close-circle-fill" color="#FF6A32" v-show="faceUrl" class="close-circle-fill" size="50"
					@click="close(item,'图片',index)"></u-icon>
			</view>
		</view>

		<!-- 视频 -->
		<view class="upload-video-contain" v-show="videoStatus">
			<view class="upload-video" v-for="(item,index) in videoList" :key="index">
				<view>
					<u-icon name="close-circle-fill" color="#FF6A32" class="close-circle-fill" size="50"
						@click="close(item,'视频',index)"></u-icon>
				</view>
				<!-- <video :class="{ videoClass }" class="item-video" :id="'myVideo' + index"
					@play.stop="getPlay('myVideo' + index)" @fullscreenchange="fullscreenchange" controls /> -->
				<image :src="item" class="upload-preview"></image>
			</view>
		</view>
		<!-- 文件 -->
		<view class="upload-preview-contain" v-show="fileStatus">
			<view class="upload-preview" v-for="(item, index) in fileList" :key="index"
				:style="{ backgroundImage: 'url(' + FileUrl + ')' }">
				<view>
					<u-icon name="close-circle-fill" color="#FF6A32" class="close-circle-fill" size="50"
						@click="close(item,'文件')"></u-icon>...mapState
				</view>
			</view>
		</view>
		<!-- 上传操作 -->
		<view class="upload" @click="uploadImage" v-show="previewList.length < count">
			<u-icon name="plus" class="close-plus" size="55"></u-icon>
		</view>
		<web-view v-if="webViewShow" src="/hybrid/html/index.html" :style="{ height: '100vh'}"></web-view>
	</view>
</template>

<script>
	import base from '@/config/baseUrl';
	import {
		CommonUpload
	} from '@/plugins/uploadPic.js';
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
				default: 1
			},
			documentNum: {
				type: Number,
				default: 1
			}
		},
		data() {
			return {
				faceUrl: '',
				fileSize: 6291456, // 1M=1024KB=1048576B
				previewList: [],
				FileUrl: "https://www.51mihuo.com/static/images/file.png",
				fileFormat: ['doc', 'xlsx', 'pdf', 'pptx', 'art', 'rar', 'txt', 'zip'],
				sourceType: ['拍摄', '相册', '拍摄或相册'],
				fileList: [],
				videoList: [],
				videoStatus: false,
				fileStatus: false,
				videoClass: "",
				fileList: [],
				webViewShow: false,
				fileObjectList: {
					imgList: '',
					videoList: ''
				}
			}
		},
		mounted() {
			if (this.$props && this.$props.uploadType) {
				if (this.$props.uploadType.indexOf('视频') !== -1) {
					this.videoStatus = true
				}
				if (this.$props.uploadType.indexOf('文件') !== -1) {
					this.fileStatus = true
				}
			}
		},
		methods: {
			getPlay(e) {
				this.videoContext = uni.createVideoContext(e);
				this.videoContext.requestFullScreen();

			},
			fullscreenchange(e) {
				if (e.target.fullScreen) {
					this.videoClass = "show"
				} else {
					this.videoClass = ""
				}
			},
			close(item, type, index) {
				switch (type) {
					case '图片':
						this.previewList = this.previewList.filter(el => el !== item)
						this.fileObjectList.imgList = {
							'fileType': 'img',
							'fileList': this.previewList
						}
						this.$emit('change', this.fileObjectList)
						break
					case '视频':
						this.videoList = this.videoList.filter(el => el !== item)
						this.fileObjectList.videoList = {
							'fileType': 'video',
							'fileList': this.videoList
						}
						this.$emit('change', this.fileObjectList)
						break
					case '文件':
						this.fileList = this.fileList.filter(el => el !== item)
						break
				}

			},
			preview(ul) {
				uni.previewImage({
					current: 1,
					urls: [ul],
				})
			},
			uploadImage() {
				if (this.$props.uploadType && this.$props.uploadType.length === 1) {
					if (this.$props.uploadType.indexOf('图片') !== -1) {
						this.uploadImages()
					} else if (this.$props.uploadType.indexOf('视频') !== -1) {
						this.uploadVideo()
					}
				} else {
					let itemList = []
					if(this.$props.uploadType.indexOf('文件') === -1){
						itemList = ['图片', '视频']
					} else {
						itemList = ['图片', '视频', '其它']
					}
					uni.showActionSheet({
						title: "选择上传类型",
						itemList,
						success: (res) => {
							switch (res.tapIndex) {
								case 0:
									this.uploadImages()
									break
								case 1:
									if (this.videoList.length < this.$props.videoNum) {
										this.uploadVideo()
									} else {
										this.$util.toast(`只能上传${this.$props.videoNum}个视频～`);
									}
									break
								case 2:
									this.uploadFile()
									break
							}
						}
					})
				}
			},
			uploadImages() {
				let tempPreviewList = []
				uni.chooseImage({
					count: this.$props.count - this.previewList.length,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'], //从相册选择
					success: async (res) => {
						for (let i = 0; i < res.tempFiles.length; i++) {
							if (res.tempFiles[i].size > this.fileSize) {
								this.$util.toast('上传图片大小不能超过6MB');
							} else {
								tempPreviewList.push(res.tempFiles[i].path)
							}
						}
						this.faceUrl = res.tempFilePaths
						this.previewList = [...this.previewList, ...tempPreviewList]
						this.fileObjectList.imgList = {
							'fileType': 'img',
							'fileList': this.previewList
						}
						this.$emit('change', this.fileObjectList)
					}
				})
			},
			uploadVideo() {
				uni.chooseVideo({
					sourceType: ['album', 'camera'],
					success: async (res) => {
						if (this.videoList.length < this.$props.videoNum) {
							let tempVideoList = [res.tempFilePath]
							this.videoList = [...this.videoList, ...tempVideoList]
							this.fileObjectList.videoList = {
								'fileType': 'video',
								'fileList': this.videoList
							}
							this.$emit('change', this.fileObjectList)
						}
					}
				})
			},
			uploadFile() {
				// this.getFileIo()
				this.getUploadFileDemo()
			},
			getUploadFileDemo() {
				// this.webViewShow = true
				this.getFileIo()
				// this.toPage(`/pages/publishTask/fileUpload`)
			},
			getFileIo() {
				// #ifdef APP-PLUS
				let main = plus.android.runtimeMainActivity(); // 调用android原生页面
				let Intent = plus.android.importClass("android.content.Intent");
				let fileIntent = new Intent(Intent.ACTION_GET_CONTENT)
				fileIntent.setType("*/*"); //无类型限制
				fileIntent.addCategory(Intent.CATEGORY_OPENABLE);
				main.startActivityForResult(fileIntent, 1);
				// #endif
			},
			fileSuccesCB() {

			},
			fileErrorCB() {

			},
		},
	}
</script>

<style lang="scss" scoped>
	/deep/ .u-add-tips {
		display: none;
	}

	/deep/ .u-list-item {
		background: #F6F7F9;
	}

	.upload-page {
		display: flex;
		flex-wrap: wrap;
	}

	.upload,
	.upload-preview {
		width: 166rpx;
		height: 166rpx;
		background: #F6F7F9;
		border: 1px solid #EEEEEE;
		box-sizing: border-box;
		border-radius: 10rpx;
		background-size: cover;
		background-position: center;
		margin-right: 12rpx;
		margin-bottom: 12rpx;
		
		.close-plus {
			/* #ifdef MP-WEIXIN */
			position: absolute;
			margin-top: 50rpx;
			left: 93rpx;
			/* #endif */
		}
	}

	.upload-preview-contain,
	.upload-video-contain {
		flex-wrap: wrap;
		display: flex;
	}

	.upload-preview-contain {
		position: relative;

		.close-circle-fill {
			right: 0rpx;
			top: -30rpx !important;
			position: absolute;
			z-index: 99;
		}
	}

	.upload-video {
		position: relative;

		.item-video {
			width: 166rpx;
			height: 166rpx;
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

	video {
		border-radius: 10rpx;
		z-index: 97;
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
</style>
