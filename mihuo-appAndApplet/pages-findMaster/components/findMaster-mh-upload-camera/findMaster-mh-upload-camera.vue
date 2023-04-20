<template>
	<view class="upload-page">
		<view class="upload-preview-contain" v-for="(item,index) in previewList" :key="index">
			<view v-if="item.type !== 'video'" class="upload-preview"
				@click="preview(item.localPathStatus ? $util.thumbnailImage(item.url, true) : item.url )"
				:style="{ backgroundImage: 'url(' + setFileUrl(item) + ')' }">
				<view :class="[item.localPathStatus ? 'upload-preview-mask-default':'upload-preview-mask']"></view>
			</view>
			<view v-if="item.type === 'video'" class="upload-preview"
				:style="{ backgroundImage: 'url(' + $util.thumbnailVideo(item.url, true) + ')' }">
			</view>
			<image v-if="item.type === 'video'" src="https://www.51mihuo.com/static/images/video-start.png" class="video-play-img" mode=""
				@click="videoPlay(item.url)"></image>
			<image @click="close(item,'图片',index)" class="file-close" src="https://www.51mihuo.com/static/icon/work_type/close.png" mode="">
			</image>
		</view>
		<view class="upload-demo" v-if="previewList.length===0" @click="getFlieUpload()">
			<image class="camera" src="https://www.51mihuo.com/static/icon/work_type/camera.png"/>
			<text class="camera-tpis">上传图片</text>
		</view>
		<view class="evaluation-file x6-flex x6-item-flex" @click="getFlieUpload()" v-if="(count > previewList.length) &&previewList.length>0">
			<u-icon name="plus" class="close-plus" size="40"></u-icon>
		</view>
	</view>
</template>

<script>
	import base from '@/config/baseUrl';
	import {
		CommonUpload
	} from '@/plugins/uploadPic.js';
	export default {
		name: 'image-upload-new',
		props: {
			// 图片上传数量
			count: {
				type: [String, Number],
				default: 9
			},
			//是否需要自动上传
			uploadAuto: {
				typeof: Boolean,
				default: true
			},
			//默认上传类型 ['图片', '视频', '文件']
			uploadType: {
				type: Array,
				default: function() {
					return ['图片']
				}
			},
			value: {
				type: [String,Array],
				default: ''
			}
		},
		data() {
			return {
				fileSize: 6291456, // 1M=1024KB=1048576B
				previewList: [],
				path: '',
				imageType: ['png', 'jpg', 'jfif', 'gif'],
				videoType: ['mp3', 'mp4'],
				fileTypeSuffix: [{
						suffix: '.doc',
						url: "https://www.51mihuo.com/static/images/file_type/doc.png"
					},
					{
						suffix: '.pdf',
						url: "https://www.51mihuo.com/static/images/file_type/pdf.png"
					},
					{
						suffix: '.xls',
						url: "https://www.51mihuo.com/static/images/file_type/xls.png"
					},
					{
						suffix: '.zip',
						url: "https://www.51mihuo.com/static/images/file_type/zip.png"
					},
					{
						suffix: '.ppt',
						url: "https://www.51mihuo.com/static/images/file_type/ppt.png"
					},
					{
						suffix: '.cad',
						url: "https://www.51mihuo.com/static/images/file_type/cad.png"
					},
					{
						suffix: '.xlsx',
						url: "https://www.51mihuo.com/static/images/file_type/xls.png"
					}
				],

			}
		},
		mounted() {
			if (this.value) {
				this.previewList = JSON.parse(this.value)
			} else {
				// 如果v-model绑定的初始值是''（用户没有选择任何图片）要改成'[]', 不然判断图片上传进度时会出错
				this.previewList = []
				this.$emit('input', '[]')
			}
			this.uploadType.push('拍摄')
		},
		computed: {
			setUploadType() {
				return [...new Set(this.uploadType)]
			}
		},
		methods: {
			setFileUrl(item) {
				let tempUrl
				if (item.type !== 'img') {
					this.fileTypeSuffix.map(el => {
						if (el.suffix.includes(item.type)) {
							tempUrl = el.url
						}
					})
				} else {
					if(item.localPathStatus){
						tempUrl = item.localPathStatus ? this.$util.thumbnailImage(item.url, true) : item.url;
					}else{
						tempUrl = item.localPathStatus ? item.url:this.$util.thumbnailImage(item.url, true);
					}
				}
				return tempUrl
			},
			getFlieUpload() {
				if (this.uploadType.length === 1 && this.uploadType.includes('图片')) {
					this.uploadImages()
				} else {
					uni.showActionSheet({
						title: "选择上传类型",
						itemList: this.setUploadType,
						success: (res) => {
							let typeName = this.uploadType[res.tapIndex]
							switch (typeName) {
								case '图片':
									this.uploadImages()
									break
								case '视频':
									this.uploadVideo()
									break
								case '文件':
									this.getDocumentFile()
									// TODO iOS上传文件
									// plus.os.name === "iOS" ? this.getIosFileUpload() : this.getDocumentFile()
									break
								case '拍摄':
									this.shooting()
									break
							}
						}
					})
				}

			},
			videoPlay(url) {
				uni.$emit('videoUpdate', {
					url: url
				})
				this.toPage(`/pages-common/full-screen/full-screen?url=${url}`)
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
			timeDelay(item) {
				return function() {
					console.log("item", item);
				}
			},
			shooting() {
				let tempPreviewList = this.previewList
				let that = this
				uni.chooseImage({
					count: Number(this.count) - this.previewList.length,
					sizeType: ['original', 'compressed'],
					sourceType: ['camera'], //从相册选择
					success: async (res) => {
						for (let i = 0; i < res.tempFiles.length; i++) {
							(function(t, data) {
								setTimeout(() => {
									if (res.tempFiles[i].size > that.fileSize) {
										that.$util.toast('上传图片大小不能超过6MB');
									} else {
										let parameter = {
											type: 'img',
											localPath: '',
											localPathStatus: false,
											url: ''
										}
										if (that.uploadAuto) {
											let tempPromise = new Promise(function(resolve, reject) {
												let url = CommonUpload(res.tempFiles[i].path)
												if (Array.isArray(url)) {
													url = url[0]
												}
												url.then((result) => {
													resolve(result)
												})
											})
											tempPromise.then((res) => {
												parameter.url = res
												parameter.localPathStatus = true
												that.getChangeFile()
											})
										}
										parameter.url = res.tempFiles[i].path
										if (!parameter.url) return;
										tempPreviewList.push(parameter)
									}
								}, 600 * t)
							})(i, 'dd')


						}
						this.previewList = tempPreviewList
						this.getChangeFile()
					}
				})
			},
			uploadImages() {
				let tempPreviewList = this.previewList
				let that = this
				uni.chooseImage({
					count: Number(this.count) - this.previewList.length,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'],
					success: async (res) => {
						for (let i = 0; i < res.tempFiles.length; i++) {
							(function(t, data) {
								setTimeout(() => {
									if (res.tempFiles[i].size > that.fileSize) {
										that.$util.toast('上传图片大小不能超过6MB');
									} else {
										let parameter = {
											type: 'img',
											localPath: '',
											localPathStatus: false,
											url: ''
										}
										if (that.uploadAuto) {
											let tempPromise = new Promise(function(resolve,
											reject) {
												let url = CommonUpload(res.tempFiles[i]
													.path)
												if (Array.isArray(url)) {
													url = url[0]
												}
												url.then((result) => {
													resolve(result)
												})
											})
											tempPromise.then((res) => {
												parameter.url = res
												parameter.localPathStatus = true
												that.getChangeFile()
											})
										}
										parameter.url = res.tempFiles[i].path
										if (!parameter.url) return;
										tempPreviewList.push(parameter)
									}
								}, 600 * t)
							})(i, res)
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
						let url = await CommonUpload(res.tempFilePath)
						if (!url) return
						tempPreviewList.push({
							type: 'video',
							url
						})
						this.previewList = tempPreviewList
						this.getChangeFile()
					}
				})
			},
			getChangeFile() {
				if(this.previewList.length === 0){
					this.$emit('input', '[]')
				} else {
					this.$emit('input', JSON.stringify(this.previewList))
				}
			},
			async resultPath(e) {
				let tempPreviewList = this.previewList
				let tempType
				this.fileTypeSuffix.map(item => {
					if (e.includes(item.suffix)) {
						tempType = item.suffix
					}
				})
				if (tempType) {
					tempPreviewList.push({
						type: tempType.replace('.', ''),
						url: await CommonUpload(e)
					})
					this.previewList = tempPreviewList
					this.getChangeFile()
				} else {
					this.$util.toast('暂不支持该格式的文件');
				}
			},
			getIosFileUpload() {
				this.toPage('/pages/fileUpload/fileUpload')
			},
			getDocumentFile() { // 上传文档文件
				let fileBrowerTool = uni.requireNativePlugin("CL-FileBrower")
				fileBrowerTool.open({
					title: 'Select File'
				}, result => {
					console.log("返回文件绝对路径", result); //返回文件绝对路径
					let tempPreviewList = this.previewList
					let url = CommonUpload(result)
					if (!url) return
					let typeName = result.substring(result.lastIndexOf('.') + 1);
					if (this.imageType.includes(typeName)) {
						typeName = 'img'
					} else if (this.videoType.includes(typeName)) {
						typeName = 'video'
					}

					tempPreviewList.push({
						type: typeName,
						url
					})
					this.previewList = tempPreviewList
					this.getChangeFile()

				});
				return

				// #ifdef APP-PLUS
				if (plus.os.name.toLowerCase() !== "android") {
					return
				}
				let that = this
				let main = plus.android.runtimeMainActivity();
				let Intent = plus.android.importClass("android.content.Intent");
				let fileIntent = new Intent(Intent.ACTION_GET_CONTENT)
				//fileIntent.setType(“image/*”);//选择图片
				//fileIntent.setType(“audio/*”); //选择音频
				//fileIntent.setType(“video/*”); //选择视频 （mp4 3gp 是android支持的视频格式）
				//fileIntent.setType(“video/*;image/*”);//同时选择视频和图片
				fileIntent.setType("*/*"); //无类型限制
				fileIntent.addCategory(Intent.CATEGORY_OPENABLE);
				main.startActivityForResult(fileIntent, 1);
				// 获取回调
				main.onActivityResult = function(requestCode, resultCode, data) {
					let Activity = plus.android.importClass("android.app.Activity");
					let ContentUris = plus.android.importClass("android.content.ContentUris");
					let Cursor = plus.android.importClass("android.database.Cursor");
					let Uri = plus.android.importClass("android.net.Uri");
					let Build = plus.android.importClass("android.os.Build");
					let Environment = plus.android.importClass("android.os.Environment");
					let DocumentsContract = plus.android.importClass("android.provider.DocumentsContract");
					let MediaStore = plus.android.importClass("android.provider.MediaStore");
					// 给系统导入 contentResolver
					let contentResolver = main.getContentResolver()
					plus.android.importClass(contentResolver);
					// 返回路径
					let path = '';
					if (resultCode == Activity.RESULT_OK) {
						let uri = data.getData()
						if ("file" == uri.getScheme().toLowerCase()) { //使用第三方应用打开
							path = uri.getPath();
							return;
						}
						if (Build.VERSION.SDK_INT > Build.VERSION_CODES.KITKAT) { //4.4以后
							console.log("4.4以后")
							path = getPath(this, uri);
						} else { //4.4以下下系统调用方法
							console.log("4.4以下下系统调用方法")
							path = getRealPathFromURI(uri)
						}
						// 回调
						that.resultPath(path)
						// that.$emit('result', path)
					}
					// 4.4 以上 从Uri 获取文件绝对路径
					function getPath(context, uri) {
						let isKitKat = Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT;
						let scheme = uri.getScheme().toLowerCase()
						if (isKitKat && DocumentsContract.isDocumentUri(context, uri)) {
							// ExternalStorageProvider
							if (isExternalStorageDocument(uri)) {
								let docId = DocumentsContract.getDocumentId(uri);
								let split = docId.split(":");
								let type = split[0];
								// 如果是手机内部存储
								if ("primary" == type.toLowerCase()) {
									return Environment.getExternalStorageDirectory() + "/" + split[1];
								} else {
									return '/storage/' + type + "/" + split[1];
								}
							}
							// DownloadsProvider
							else if (isDownloadsDocument(uri)) {
								let id = DocumentsContract.getDocumentId(uri);
								let split = id.split(":");
								return split[1]
								// console.log(id)
								// let contentUri = ContentUris.withAppendedId(Uri.parse("content://downloads/public_downloads"), id);
								// return getDataColumn(context, contentUri, null, null);
							}
							// MediaProvider
							else if (isMediaDocument(uri)) {
								let docId = DocumentsContract.getDocumentId(uri);
								let split = docId.split(":");
								let type = split[0];
								let contentUri = null;
								if ("image" == type.toLowerCase()) {
									contentUri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
								} else if ("video" == type.toLowerCase()) {
									contentUri = MediaStore.Video.Media.EXTERNAL_CONTENT_URI;
								} else if ("audio" == type.toLowerCase()) {
									contentUri = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI;
								}
								let selection = "_id=?";
								let selectionArgs = [split[1]];
								return getDataColumn(context, contentUri, selection, selectionArgs);
							}
						}
						// MediaStore (and general)
						else if ("content" == scheme) {
							return getDataColumn(context, uri, null, null);
						}
						// File
						else if ("file" == scheme) {
							return uri.getPath();
						}
					}
					// 4.4 以下 获取 绝对路径
					function getRealPathFromURI(uri) {
						let res = null
						let proj = [MediaStore.Images.Media.DATA]
						let cursor = contentResolver.query(uri, proj, null, null, null);
						if (null != cursor && cursor.moveToFirst()) {
							;
							let column_index = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
							res = cursor.getString(column_index);
							cursor.close();
						}
						return res;
					}
					// 通过uri 查找出绝对路径
					function getDataColumn(context, uri, selection, selectionArgs) {
						let cursor = null;
						let column = "_data";
						let projection = [column];
						// let contentResolver = context.getContentResolver()
						// plus.android.importClass(contentResolver);
						cursor = contentResolver.query(uri, projection, selection, selectionArgs, null);
						if (cursor != null && cursor.moveToFirst()) {
							let column_index = cursor.getColumnIndexOrThrow(column);
							return cursor.getString(column_index);
						}
					}

					function isExternalStorageDocument(uri) {
						return "com.android.externalstorage.documents" == uri.getAuthority() ? true : false
					}

					function isDownloadsDocument(uri) {
						return "com.android.providers.downloads.documents" == uri.getAuthority() ? true : false
					}

					function isMediaDocument(uri) {
						return "com.android.providers.media.documents" == uri.getAuthority() ? true : false
					}
				}
				// #endif
				// #ifndef APP-PLUS
				uni.showModal({
					title: '提示',
					content: '仅支持Android平台',
					success: function(res) {

					}
				});
				// #endif


			}
		},
	}
</script>

<style lang="scss" scoped>
	.upload-page {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		.upload-demo{
			height: 200rpx;
			width: 100%;
			border-radius: 8rpx;
			border:1rpx dashed #D5D5D5;
			display: flex;
			justify-content: center;
			align-items: center;
			.camera{
				width: 50rpx;
				height: 50rpx;
			}
			.camera-tpis{
				font-size: $smallFontSize;
				padding-left: 20rpx;
			}
		}
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
		// width: 33%;

		&:nth-of-type(4n +0) {
			.upload-preview {
				// margin-right: 0rpx;
			}
		}

		.video-play-img {
			width: 50rpx;
			height: 50rpx;
			position: absolute;
			top: calc(100% - 100rpx);
			left: calc(100% - 100rpx);
		}

		.upload-preview {
			width: 125rpx;
			height: 125rpx;
			background: #F1F1F9;
			border: 1rpx solid #EEEEEE;
			box-sizing: border-box;
			border-radius: 10rpx;
			background-size: cover;
			background-position: center;
			margin-right: 20rpx;
			margin-bottom: 20rpx;
			position: relative;
		}

		.upload-preview-mask {
			width: 124rpx;
			height: 126rpx;
			position: absolute;
			border-radius: 10rpx;
			background-color: rgba(0, 0, 0, 0.6);
			transition: all 0.8s ease 0s;
			bottom: 0rpx;
		}

		.upload-preview-mask-default {
			width: 124rpx;
			height: 0rpx;
			position: absolute;
			bottom: 0rpx;
			background-color: rgba(0, 0, 0, 0.6);
			// transition: height 0.6s;
			transition: all 0.8s ease 0s;
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
			height: 126rpx;
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
		right: 10rpx;
		top: -12rpx;
		z-index: 10;
	}




	.evaluation-file {
		background: #F7F7F7;
		border-radius: 8px;
		width: auto;
		min-width: 126rpx;
		;
		height: 126rpx;
		display: flex;
		align-items: center;
		justify-content: center;
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
		// color: #c4c4c4;
		// position: relative;
		// top: 52rpx !important;
		// left: 52rpx;
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
