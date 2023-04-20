<template>
	<view class="upload-page">
		<view class="upload-preview-contain" v-for="(item,index) in previewList" :key="index">
			<view v-if="item.type !== 'video' && item.type != 'img'" class="upload-preview"
				@click="preview(item.localPathStatus ?  item : item.url )"
				:style="{ backgroundImage: 'url(' + setFileUrl(item) + ')' }">
				<view :class="[item.localPathStatus ? 'upload-preview-mask-default':'upload-preview-mask']"></view>
			</view>

			<image v-if="item.type == 'img'" :src="item.localPathStatus ? setFileUrl(item) :item.localPath"
				class="upload-preview" @click="imagePreview(item.localPathStatus ? setFileUrl(item) :item.localPath)">
				<view :class="[item.localPathStatus ? 'upload-preview-mask-default':'upload-preview-mask']"></view>
			</image>
			<view v-if="item.type === 'video'" class="upload-preview"
				:style="{ backgroundImage: 'url(' + $util.thumbnailVideo(item.url, true) + ')' }">
			</view>
			<image v-if="item.type === 'video'" src="/static/images/video-start.png" class="video-play-img" mode=""
				@click="videoPlay($util.thumbnailImage(item.url, false))"></image>
			<image @click="close(item,'图片',index)" class="file-close" src="/static/images/icon_close/file-close.png"
				mode="">
			</image>
			<!-- #ifdef APP-PLUS -->
			<!-- #endif -->
		</view>
		<view class="evaluation-file x6-flex x6-item-flex" @click="getFlieUpload()" v-if="count > previewList.length">
			<u-icon name="plus" class="close-plus" size="40"></u-icon>
		</view>
	</view>
</template>

<script>
	import base from '@/config/baseUrl';
	import moment from "@/static/js/moment.js"
	import {
		CommonUpload,
		CommonWaterMarkUpload
	} from '@/plugins/uploadPic.js';
	import {
		deepClone
	} from '@/plugins/utils.js'
	// import permission from '../../plugins/permission';
	import {
		judgePermission,
		gotoAppPermissionSetting
	} from '@/plugins/permission';
	import {
		mapState,
	} from 'vuex'
	export default {
		name: 'image-upload-new',
		// model: {
		// 	prop: 'value', // 默认是value
		// 	event: 'input', // 默认是input
		// },
		props: {
			// 图片上传数量
			count: {
				type: [String, Number],
				default: 99
			},
			//是否需要自动上传
			uploadAuto: {
				typeof: Boolean,
				default: true
			},
			//上传类型 
			uploadType: {
				type: Array,
				default: function() {
					return []
				}
			},
			value: {
				type: String,
				default: '[]'
			},
			//是否添加水印
			isAddWatermark: {
				type: Boolean,
				default: false
			},
			//是否添加视频
			isAddVideo: {
				type: Boolean,
				default: true
			},
			address: {
				type: String,
				default: ''
			},
			userInfo: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				fileSize: 6291456, // 1M=1024KB=1048576B
				previewList: [],
				path: '',
				flagC: false,
				photoData: [],
				companyName: '觅活科技有限公司',
				photoArray: [],
				canvasWidth: '',
				canvasHeight: '',
				photoIndex: 0,
				uploadTypeList: ['图片', '拍摄', '视频'],
				imageType: ['png', 'jpg', 'jfif', 'gif', 'jpeg'],
				videoType: ['mp3', 'mp4'],
				uploadImageLoading: require("@/static/images/no-data.png"),
				defaultUrl: {
					url: require("@/static/images/file_type/default.png")
				},
				isLocationPermissions: false,
				isPhotoLibraryPermissions: false,
				fileTypeSuffix: [{
						suffix: 'doc',
						url: require("@/static/images/file_type/doc.png")
					},
					{
						suffix: 'pdf',
						url: require("@/static/images/file_type/pdf.png")
					},
					{
						suffix: 'xls',
						url: require("@/static/images/file_type/xls.png")
					},
					{
						suffix: 'zip',
						url: require("@/static/images/file_type/zip.png")
					},
					{
						suffix: 'ppt',
						url: require("@/static/images/file_type/ppt.png")
					},
					{
						suffix: 'pptx',
						url: require("@/static/images/file_type/ppt.png")
					},
					{
						suffix: 'cad',
						url: require("@/static/images/file_type/cad.png")
					},
					{
						suffix: 'xlsx',
						url: require("@/static/images/file_type/xls.png")
					}
				],
			}
		},
		mounted() {
			this.assignment()
			this.initUploadType()
			this.authority()
		},
		computed: {
			...mapState(['authModalIndex']),
			setUploadType() {
				return [...new Set(this.uploadTypeList)]
			},
		},
		watch: {
			value: {
				handler(newVal, oldVal) {
					if (newVal) {}
				},
			},

		},
		beforeDestroy() {
			this.$store.commit('setAuthModalIndex', 0)
			uni.$off('sopFileUpload')
		},
		methods: {
			assignment() {
				if (this.value && this.value !== '[]') {
					this.previewList = JSON.parse(this.value)
				} else {
					// 如果v-model绑定的初始值是''（用户没有选择任何图片）要改成'[]', 不然判断图片上传进度时会出错
					this.previewList = []
					this.$emit('input', '[]')
				}
				uni.$on('sopFileUpload', (data) => {
					if (data) {
						if (data.length > 0) {
							this.previewList.push(...data)
							this.getChangeFile()
						}
					}
				})
			},
			initUploadType(){
				this.uploadType.forEach(item => {
					this.uploadTypeList.push(item)
				})
			},
			setFileUrl(item) {
				let tempUrl
				if (item.type !== 'img') {
					tempUrl = this.fileTypeSuffix.find(ev => ev.suffix == item.type)
					if (!tempUrl) {
						tempUrl = this.defaultUrl.url
					} else {
						tempUrl = tempUrl.url
					}
				} else {
					tempUrl = item.localPathStatus ? this.$util.thumbnailImage(item.url, true) : item.url
				}
				return tempUrl
			},
			getFlieUpload() {
				uni.showActionSheet({
					title: "选择上传类型",
					itemList: this.setUploadType,
					success: (res) => {
						let typeName = this.setUploadType[res.tapIndex]
						switch (typeName) {
							case '图片':
								this.uploadImages()
								break
							case '视频':
								this.uploadVideo()
								break
							case '文件':
								this.getDocumentFile()
								break
							case '拍摄':
								this.shooting()
								break
							case '电脑快传':
								this.toPage('/pages/sopFileUpload/sopFileUpload')
								break
						}
					}
				})
			},
			// 添加水印
			addWaterMark(url) {
				return new Promise((resolve, rej) => {
					// 在自定义组件内 需要传递第二参数 this canvas才生效
					const ctx = uni.createCanvasContext('myCanvas', this);
					uni.getImageInfo({
						src: url,
						success: res => {
							//获取时间
							const hour = moment(new Date()).format("HH:mm");
							const day = moment(new Date()).format("YYYY-MM-DD")
							const week = moment(new Date()).format("dddd")
							let list = [this.userInfo, "觅活科技有限公司", this.address, day + " " + week,
								hour
							]
							let icon = ["/static/watermark/avatar.png",
								"/static/watermark/company.png",
								"/static/watermark/address.png"
							];
							//这里的延时主要是为了处理循化带来的canvas来不及自己清理自己的内部数据导致绘制混乱。
							// 在IOS10下，自带浏览器和微信下，超过4096*4096像素则绘制空白；
							// HUAWEI NXT-TL00手机自带浏览器和UC浏览器下，不能超过8192*8192像素；
							// 在PC,CHROME浏览器，360浏览器，不能超过16384*16384像素；
							// 搜狗浏览器，要比16384*16384稍微小一些；
							// firefox,最大数在11164*11164左右；
							// IE11、EDGE浏览器，没找到极限，只不过越大电脑越慢内存消耗严重；
							// 所以这里的图片必须压缩进去
							let imageWith = res.width / 3;
							let imageHeight = res.height / 3;
							this.canvasWidth = `${imageWith}px`;
							this.canvasHeight = `${imageHeight}px`;
							ctx.clearRect(0, 0, imageWith, imageHeight);
							ctx.beginPath();
							ctx.drawImage(url, 0, 0, res
								.width, res
								.height
							); // 第一个参数是图片 第二、三是图片在画布位置 第四、五是将图片绘制成多大宽高（不写四五就是原图宽高）

							// 为图片添加水印
							//这部分是水印的大小位置和数量
							//水平方向
							let horizontal = Math.max(imageWith * 0.01, 50);
							//竖直方向
							let vertical = imageHeight * 0.95;
							//文字大小是固定缩放比列750
							let fontsize;
							fontsize = Math.max(25 * Math.min(imageHeight, imageWith) / 750,
								16)
							// 透明矩形的宽度
							const strgingLenght = list.map(item => item.length);
							strgingLenght.sort((a, b) => (b - a))
							const rectW = horizontal * 2 + strgingLenght[0] * fontsize
							const rectH = list.length * 2 * fontsize + imageHeight * 0.05
							ctx.beginPath();
							//先绘制矩形
							ctx.setFillStyle('rgba(0,0,0,0.1)')
							ctx.fillRect(0, imageHeight - rectH, rectW, rectH)
							for (let item in list) {
								if (item == list.length - 1) {
									ctx.setFontSize(fontsize * 1.5);
								} else {
									ctx.setFontSize(fontsize);
								}
								ctx.setFillStyle("rgb(255,255,255)");
								if (item < 3) {
									ctx.drawImage(icon[item], horizontal, vertical - (1.5 *
											item +
											0.7) * fontsize,
										fontsize * 0.8, fontsize * 0.8);
									ctx.fillText(list[item], horizontal + fontsize,
										vertical - 1.5 *
										item *
										fontsize);
								} else {
									ctx.fillText(list[item], horizontal, vertical - 1.5 *
										item *
										fontsize);
								}
							}
							// 开始绘制添加水印的图片并显示在页面中
							//ctx.draw()
							console.log("测试1", res.width, res.height, imageWith, imageHeight)
							setTimeout(() => {
								ctx.draw(false, () => {
									uni.canvasToTempFilePath({
										canvasId: "myCanvas",
										destWidth: imageWith,
										destHeight: imageHeight,
										success: data => {
											console.log("测试2")
											console.log(data
												.tempFilePath)
											resolve(data
												.tempFilePath
											);
										},
										fail(res) {
											rej(res)
										}

									})
									// 在自定义组件内 需要传递第二参数 this canvas才生效
									// }, this)
								});
							}, 500)
						}
					})
				})
			},
			videoPlay(url) {
				uni.$emit('videoUpdate', {
					url: url
				})
				this.toPage(`/pages/full-screen/full-screen?url=${url}`)
			},
			close(item, type, index) {
				this.previewList.splice(index, 1)
				this.getChangeFile()
				this.$store.commit('setFileUploadList', this.previewList)
			},
			imagePreview(path) {
				uni.previewImage({
					current: 1,
					urls: [path],
				})
			},
			preview(item) {
				let tempUrl = this.setFileUrl(item)
				uni.previewImage({
					current: 1,
					urls: [tempUrl],
				})
			},
			timeDelay(item) {
				return function() {}
			},
			shooting() {
				uni.chooseImage({
					count: Number(this.count) - this.previewList.length,
					sizeType: ['original', 'compressed'],
					sourceType: ['camera'], //拍摄
					success: async (res) => {
						for (let i = 0; i < res.tempFiles.length; i++) {
							if (res.tempFiles[i].size > this.fileSize) {
								this.$util.toast('上传图片大小不能超过6MB');
							} else {
								// 不压缩容易闪退安卓手机
								let tempUrl = await this.changeType(res.tempFiles[i].path)
								let pressimage = await this.$util.compressImage(tempUrl)
								let parameter = {
									type: 'img',
									localPath: pressimage.tempFilePath,
									localPathStatus: false,
									url: '',
									name: res.tempFiles[i] && res.tempFiles[i].name
								}
								this.previewList.push(parameter)
								this.$store.commit('setFileUploadList', this.previewList)
								if (this.uploadAuto) {
									let tempFile = pressimage.tempFilePath;
									if (this.isAddWatermark && this.isLocationPermissions) {
										let itemFile = await CommonWaterMarkUpload(tempFile, 'files', {
											address: this.address,
											companyName: this.companyName,
											nameAndPosition: this.userInfo
										});
										this.previewList[this.previewList.length - 1].url = itemFile.url;
										this.previewList[this.previewList.length - 1].localPathStatus = true;
										this.previewList[this.previewList.length - 1].name = itemFile
											.originalFileName;
									} else {
										let itemFile = await CommonUpload(tempFile, false, '名称')
										this.previewList[this.previewList.length - 1].url = itemFile.url;
										this.previewList[this.previewList.length - 1].localPathStatus = true;
										this.previewList[this.previewList.length - 1].name = itemFile
											.originalFileName;
									}
								} else {
									let tempFile = pressimage.tempFilePath;
									if (this.isAddWatermark && this.isLocationPermissions) {
										tempFile = await CommonWaterMarkUpload(tempFile, 'files', {
											address: this.address,
											companyName: this.companyName,
											nameAndPosition: this.userInfo
										});
										this.previewList[this.previewList.length - 1].url = itemFile.url;
										this.previewList[this.previewList.length - 1].localPathStatus = true;
									} else {
										this.previewList[this.previewList.length - 1].url = tempFile;
										this.previewList[this.previewList.length - 1].localPathStatus = true;
									}
								}
							}
						}
						// this.setFileUploadList('add')
						this.getChangeFile()
					}
				})
			},
			uploadImages() {
				uni.chooseImage({
					count: Number(this.count) - this.previewList.length,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'],
					success: async (res) => {
						for (let i = 0; i < res.tempFiles.length; i++) {
							if (res.tempFiles[i].size > this.fileSize) {
								this.$util.toast('上传图片大小不能超过6MB');
							} else {
								// 不压缩容易闪退安卓手机
								let tempUrl = await this.changeType(res.tempFiles[i].path)
								let pressimage = await this.$util.compressImage(tempUrl)
								let parameter = {
									type: 'img',
									localPath: pressimage.tempFilePath,
									localPathStatus: false,
									url: '',
									name: res.tempFiles[i] && res.tempFiles[i].name
								}
								this.previewList.push(parameter)
								this.$store.commit('setFileUploadList', this.previewList)
								if (this.uploadAuto) {
									let tempFile = pressimage.tempFilePath;
									if (this.isAddWatermark && this.isLocationPermissions) {
										let itemFile = await CommonWaterMarkUpload(tempFile, 'files', {
											address: this.address,
											companyName: this.companyName,
											nameAndPosition: this.userInfo
										});
										this.previewList[this.previewList.length - 1].url = itemFile.url;
										this.previewList[this.previewList.length - 1].localPathStatus = true;
										this.previewList[this.previewList.length - 1].name = itemFile
											.originalFileName;
									} else {
										let itemFile = await CommonUpload(tempFile, false, '名称')
										this.previewList[this.previewList.length - 1].url = itemFile.url;
										this.previewList[this.previewList.length - 1].localPathStatus = true;
										this.previewList[this.previewList.length - 1].name = itemFile
											.originalFileName;
									}
								} else {
									let tempFile = pressimage.tempFilePath;
									if (this.isAddWatermark && this.isLocationPermissions) {
										let itemFile = await CommonWaterMarkUpload(tempFile, 'files', {
											address: '昆明',
											companyName: '觅活科技',
											nameAndPosition: '彭银（管家'
										});
										this.previewList[this.previewList.length - 1].url = itemFile.url;
										this.previewList[this.previewList.length - 1].localPathStatus = true;
										this.previewList[this.previewList.length - 1].name = itemFile
											.originalFileName;
									} else {
										this.previewList[this.previewList.length - 1].url = tempFile;
										this.previewList[this.previewList.length - 1].localPathStatus = true;
									}
								}
							}
						}
						// this.setFileUploadList('add')
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
				if (this.previewList.length === 0) {
					this.$emit('input', '[]')
				} else {
					// 不置空会导致该表单文件字段长度超限制
					this.previewList.forEach(el => {
						el.localPath = ''
					})
					this.$emit('input', JSON.stringify(this.previewList))
				}
			},
			getIosFileUpload() {
				this.toPage('/pages/fileUpload/fileUpload')
			},
			getDocumentFile() { // 上传文档文件
				let fileBrowerTool = uni.requireNativePlugin("CL-FileBrower")
				var that = this
				if (uni.getSystemInfoSync().platform == "android") {
					fileBrowerTool.open({
						title: '选择文件'
					}, async result => {
						let typeName = result.substring(result.lastIndexOf('.') + 1);
						if (this.imageType.includes(typeName)) {
							typeName = 'img'
						} else if (this.videoType.includes(typeName)) {
							typeName = 'video'
						} else if (typeName.indexOf('HEIC') !== -1) {
							typeName = 'img'
						}
						this.previewList.push({
							type: typeName,
							url: result,
							localPathStatus: false,
							name: ''
						})
						let tempUrl = await this.changeType(result)
						let itemFile = await CommonUpload(tempUrl, false, '名称')
						if (!itemFile.url) return
						this.previewList[this.previewList.length - 1].url = itemFile.url;
						this.previewList[this.previewList.length - 1].localPathStatus = true;
						this.previewList[this.previewList.length - 1].name = itemFile.originalFileName;
						this.getChangeFile()
					});
				} else {
					fileBrowerTool.openIosPublicFile(
						async result => {
							let typeName = result.substring(result.lastIndexOf('.') + 1);
							if (this.imageType.includes(typeName)) {
								typeName = 'img'
							} else if (this.videoType.includes(typeName)) {
								typeName = 'video'
							}
							this.previewList.push({
								type: typeName,
								url: result,
								localPathStatus: false,
								name: ''
							})
							let tempUrl = await this.changeType(result)
							let itemFile = await CommonUpload(tempUrl, false, '名称')
							if (!itemFile.url) return
							this.previewList[this.previewList.length - 1].url = itemFile.url;
							this.previewList[this.previewList.length - 1].localPathStatus = true;
							this.previewList[this.previewList.length - 1].name = itemFile.originalFileName;
							this.getChangeFile()
						}
					);
				}
			},
			/**
			 * @description 1.在这个公共组件里面把选取的图片放在store里面。上传完一张就减少一张。提交的时候判断有没有没有上传的。给个提示还有几张没有上传然后继续上传。上传完了在提交
			 * 2.离开了当前提交界面就清空
			 * */
			setFileUploadList(type) {
				let result = deepClone(this.previewList)
				if (type == 'add') {
					this.$store.commit('setFileUploadList', result)
				} else {

				}
			},
			changeType(item) {
				if (item.indexOf('.HEIC') !== -1) {
					return new Promise((resolve, rej) => {
						plus.zip.compressImage({ // 5+ plus.zip.compressImage 了解一下，有详细的示例
							src: item, //src: 压缩原始图片的路径    
							dst: item.replace('.HEIC', '.jpg'),
							width: '90%', //dst: (String 类型 )压缩转换目标图片的路径，这里先在后面原始名后面加一个yasuo区分一下
							height: '90%', //width,height: (String 类型 )缩放图片的宽度,高度
							quality: 90, //quality: (Number 类型 )压缩图片的质量
							overwrite: true, //overwrite: (Boolean 类型 )覆盖生成新文件
						}, (event) => {
							let url = event.file
							console.log('压缩后图片信息:' + JSON.stringify(event), event.target);
							resolve(event.target)
							//返回压缩后的图片路径
						}, (err) => {
							console.log('Resolve file URL failed: ' + err.message);
							rej()
						});
					})
				} else {
					return new Promise((resolve, rej) => {
						resolve(item)
					})
				}
			},
			authority() {
				// #ifdef APP-PLUS
				// 定位权限
				let tips = []
				let index = 0
				if (this.isAddWatermark) {
					judgePermission('location', (res) => {
						// 未请求，1 = 已允许，0 = 拒绝 null 未请求 -1 已经拒绝
						if (res) {
							this.isLocationPermissions = res > 0 ? true : false
							if (res !== 1) {
								tips.push('您还未开启定位，无法添加水印')
							}
						}
					})
				}
				// 相册权限
				judgePermission('photoLibrary', (res) => {
					// 未请求，1 = 已允许，0 = 拒绝 null 未请求 -1 已经拒绝
					if (res) {
						this.isPhotoLibraryPermissions = res > 0 ? true : false
						if (res !== 1) {
							tips.push('您还未开启相册访问权限，无法上传图片')
						}
					}
				})

				setTimeout(() => {
					if (tips.length == 0) {
						return
					}
					let resultTips = tips.join(' ;')
					// 避免多次弹框
					let authModalIndex = this.authModalIndex
					authModalIndex++
					this.$store.commit('setAuthModalIndex', authModalIndex)

					if (this.authModalIndex == 1) {
						uni.showModal({
							content: resultTips,
							cancelText: "取消",
							confirmText: "去开启",
							success: (res) => {
								if (res.confirm) {
									gotoAppPermissionSetting();
								} else if (res.cancel) {
									this.$store.commit('setAuthModalIndex', 0)
									this.isLocationPermissions = false
								}
							}
						})
					}
				}, 500)
				// #endif
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
		// width: 33%;

		.speed-contain {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translateX(-58%) translateY(-58%);
			background-color: transparent !important;

		}

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
			background: #F6F7F9;
			border: 1rpx solid #EEEEEE;
			box-sizing: border-box;
			border-radius: 10rpx;
			background-size: cover;
			background-position: center;
			margin-right: 12rpx;
			margin-bottom: 12rpx;
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
			top: 0rpx,
		}

		.upload-preview-mask-default {
			width: 124rpx;
			height: 0rpx;
			position: absolute;
			bottom: 0rpx;
			top: 0rpx;
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
		width: 40rpx;
		height: 40rpx;
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

	.myCanvas {
		position: fixed;
		top: -9999999999999rpx;
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
