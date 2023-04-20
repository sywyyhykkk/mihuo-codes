<template>
	<view class="upload-page">
		<!-- 图片 -->
		<view class="upload-preview-contain" v-for="(item,index) in previewList" :key="index">
			<view class="upload-preview" @click="preview(item)" :style="{ backgroundImage: 'url(' + item + ')' }">
			</view>
			<view>
				<image @click="close(item,'图片',index)" class="file-close" src="/static/images/icon_close/file-close.png" mode=""></image>
			</view>
		</view>
		<!-- 视频 -->
		<view class="upload-video-contain" v-show="videoStatus">
			<view class="upload-video" v-for="(item, index) in videoList" :key="index">
				<image @click="close(item,'视频',index)" class="file-close" src="/static/images/icon_close/file-close.png" mode=""></image>
				<video :class="{ videoClass }" class="item-video" :id="'myVideo' + index"
					@play.stop="getPlay('myVideo' + index)" @fullscreenchange="fullscreenchange" :src="item" controls />
			</view>
		</view>
		<!-- 文件 -->
		<view class="upload-preview-contain" v-show="fileStatus">
			<view class="upload-preview" v-for="(item,index) in flieList" :key="index"
				:style="{ backgroundImage: 'url(' + FileUrl + ')' }">
				<image @click="close(item,'文件',index)" class="file-close" src="/static/images/icon_close/file-close.png" mode=""></image>
			</view>
		</view>
		<!-- 上传操作 -->
		<view class="upload" @click="uploadImage" v-show="previewList.length < count">
			<u-icon name="plus" class="close-plus" size="40"></u-icon>
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
				default: 1
			},
			value:{
				type: Object,
				default: function() {
					return {}
				},
			}
		},
		data() {
			return {
				faceUrl: '',
				imgFileSize:1024 * 1024 * 10,
				otherFileSize:1024 * 1024 * 20,
				previewList: [],
				FileUrl: require("@/static/images/file.png"),
				sourceType: ['拍摄', '相册', '拍摄或相册'],
				flieList: [],
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
							'type': 'img',
							'url': this.previewList
						}
						this.$emit('input', this.fileObjectList)
						this.$emit('change', this.fileObjectList) // 兼容之前的方法
						break
					case '视频':
						this.videoList = this.videoList.filter(el => el !== item)
						this.fileObjectList.videoList = {
							'type': 'video',
							'url': this.videoList
						}
						this.$emit('input', this.fileObjectList)
						this.$emit('change', this.fileObjectList) // 兼容之前的方法
						break
					case '文件':
						this.flieList = this.flieList.filter(el => el !== item)
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
					uni.showActionSheet({
						title: "选择上传类型",
						itemList: this.$props.uploadType,
						success: (res) => {
							switch (res.tapIndex) {
								case 0:
									this.uploadImages()
									break
								case 1:
									this.uploadVideo()
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
					sourceType: ['album'], //从相册选择
					success: async (res) => {
						for (let i = 0; i < res.tempFiles.length; i++) {
							if (res.tempFiles[i].size > this.imgFileSize) {
								this.$util.toast('上传图片大小不能超过10MB');
							} else {
								tempPreviewList.push(res.tempFiles[i].path)
							}
						}
						this.faceUrl = res.tempFilePaths
						this.previewList = [...this.previewList, ...tempPreviewList]
						this.fileObjectList.imgList = {
							'type': 'img',
							'url': this.previewList
						}
						this.$emit('input', this.fileObjectList)
						this.$emit('change', this.fileObjectList) // 兼容之前的方法
					}
				})
			},
			uploadVideo() {
				uni.chooseVideo({
					sourceType: ['album'],
					success: async (res) => {
						if (this.videoList.length < this.$props.videoNum) {
							if(res.size > this.otherFileSize){
								this.$util.toast('上传视频大小不能超过20MB');
								return
							}
							let tempVideoList = [res.tempFilePath]
							this.videoList = [...this.videoList, ...tempVideoList]
							this.fileObjectList.videoList = {
								'type': 'video',
								'url': this.videoList
							}
							this.$emit('input', this.fileObjectList)
							this.$emit('change', this.fileObjectList)  // 兼容之前的方法
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
		width: 124rpx;
		height: 124rpx;
		background: #F6F7F9;
		border: 1px solid #EEEEEE;
		box-sizing: border-box;
		border-radius: 10rpx;
		background-size: cover;
		background-position: center;
		margin-right: 12rpx;
		margin-bottom: 12rpx;
	}

	.upload-preview-contain,
	.upload-video-contain {
		flex-wrap: wrap;
		display: flex;
	}

	.upload-preview-contain {
		position: relative;
	}

	.upload-video {
		position: relative;

		.item-video {
			width: 124rpx;
			height: 124rpx;
			border-radius: 10rpx;
			margin-right: 12rpx;
			margin-bottom: 12rpx;
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

	.file-close{
		width: 36rpx;
		height: 36rpx;
		position: absolute;
		right: 0rpx;
		top: -10rpx;
		z-index: 10;
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
		top: 40rpx !important;
		left: 40rpx;
	}

</style>
