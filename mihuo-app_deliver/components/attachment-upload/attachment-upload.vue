<template>
	<view class="attachment-upload">
		<view class="upload-page" v-if="fileList.length > 0">
			<view class="upload-preview-contain" v-for="(item,index) in fileList" :key="index">
				<view v-if="item.type !== 'video'" class="upload-preview"
					:style="{ backgroundImage: 'url(' +setFileUrl(item) + ')' }">
				</view>
				<view v-if="item.type === 'video'" class="upload-preview"
					:style="{ backgroundImage: 'url(' + $util.thumbnailVideo(item.url,true) + ')' }">
				</view>
				<image v-if="item.type === 'video'" src="/static/images/video-start.png" class="video-play-img" mode=""
					@click="videoPlay($util.thumbnailImage(item.url,false))"></image>
				<image @click="close(index)" class="file-close" src="/static/images/icon_close/file-close.png" mode="">
				</image>
			</view>
		</view>
		<lsj-upload ref="lsjUpload" width="120rpx" height="120rpx" childId="upload" :size="10" :option="option"
			v-model="percent" @input="onInput" @callback="onCallback">
			<!-- <view class="item-attachment">选择附件上传</view> -->
			<view class="evaluation-file x6-flex x6-item-flex">
				<u-icon name="plus" class="close-plus" size="40"></u-icon>
			</view>
		</lsj-upload>
	</view>
</template>

<script>
	import base from '@/config/baseUrl';
	import {
		CommonUpload
	} from '@/plugins/uploadPic.js';
	export default {
		props: {
			value: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				file: '',
				fileList: [],
				option: {},
				percent: '',
				imageType: ['png', 'jpg', 'jfif', 'gif'],
				videoType: ['mp3', 'mp4'],
				defaultUrl: { url: require("@/static/images/file_type/default.png") },
				fileTypeSuffix: [{
						suffix: '.doc',
						url: require("@/static/images/file_type/doc.png")
					},
					{
						suffix: '.pdf',
						url: require("@/static/images/file_type/pdf.png")
					},
					{
						suffix: '.xls',
						url: require("@/static/images/file_type/xls.png")
					},
					{
						suffix: '.zip',
						url: require("@/static/images/file_type/zip.png")
					},
					{
						suffix: '.pptx',
						url: require("@/static/images/file_type/ppt.png")
					},
					{
						suffix: '.ppt',
						url: require("@/static/images/file_type/ppt.png")
					},
					{
						suffix: '.cad',
						url: require("@/static/images/file_type/cad.png")
					},
					{
						suffix: '.xlsx',
						url: require("@/static/images/file_type/xls.png")
					}
				],
			}
		},
		mounted() {
			if (this.value) {
				this.fileList = JSON.parse(this.value)
			}
			this.getInitializeData()
		},
		methods: {
			getInitializeData() {
				const userInfo = uni.getStorageSync('userInfo');
				this.option = {
					// #ifdef APP-PLUS
					cuWebview: this.$mp.page.$getAppWebview(), // app必传
					// #endif
					url: base.baseUrl + 'admin/sys-file/upload', //替换为你的接口地址
					name: 'file', // 附件key
					size: 30, // 附件上传大小上限(M)，默认10M
					debug: false,
					//根据你接口需求自定义请求头
					header: {
						'Authorization': userInfo.token_type + ' ' + userInfo.access_token,
						'VERSION': base.apiVersion,
					},
					//根据你接口需求自定义body参数
					formData: {

					}
				}
			},
			onCallback(e) {
				if (e) {
					let typeName = e.fileName.substring(e.fileName.lastIndexOf('.') + 1);
					let url = e.responseText && e.responseText !== '' && JSON.parse(e.responseText).data.url
					let tempPreviewList = this.fileList
					if (!url) return

					if (this.imageType.includes(typeName)) {
						typeName = 'img'
					} else if (this.videoType.includes(typeName)) {
						typeName = 'video'
					}

					tempPreviewList.push({
						type: typeName,
						url,
					})
					this.fileList = tempPreviewList
					this.$emit('input', JSON.stringify(this.fileList))
				}
			},
			onInput(e) {
				// console.log('上传进度', e);
			},
			setFileUrl(item) {
				let tempUrl
				if (item.type !== 'img') {
					this.fileTypeSuffix.map(el => {
						if (el.suffix.includes(item.type)) {
							tempUrl = el.url
						} else {
							tempUrl = this.defaultUrl.url
						}
					})
				} else {
					tempUrl = this.$util.thumbnailImage(item.url, true)
				}
				return tempUrl
			},
			close(index) {
				this.fileList.splice(index, 1)
				this.$emit('input', JSON.stringify(this.fileList))
			},
			videoPlay(url) {
				uni.$emit('videoUpdate', {
					url: url
				})
				this.toPage(`/pages/full-screen/full-screen?url=${url}`)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.attachment-upload {
		width: 100%;
		height: 100%;
		display: flex;
		flex-wrap: wrap;
		margin-top: 20rpx;
		margin-bottom: 16rpx;
	}

	.item-attachment {
		background-color: $themeColor;
		color: #FFFFFF;
		font-size: 24rpx;
		border-radius: 10rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 60rpx;
	}

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
			width: 50rpx;
			height: 50rpx;
			top: calc(100% - 100rpx);
			left: calc(100% - 100rpx);
		}

		.upload-preview {
			width: 126rpx;
			height: 126rpx;
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
		right: -2rpx;
		top: -12rpx;
		z-index: 10;
	}




	.evaluation-file {
		background: #F7F6FB;
		border-radius: 8px;
		width: auto;
		min-width: 126rpx;
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
