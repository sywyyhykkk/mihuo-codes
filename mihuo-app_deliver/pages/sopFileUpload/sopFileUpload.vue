<template>
	<view class="sop-file-page">
		<public-module></public-module>
		<z-nav-bar backState="3000" bgColor="#fff" @backClick="goBackPage()">
			<view slot="default" class="nav-bar-title">
				电脑文件
			</view>
			<view slot="right" class="nav-bar-right" v-if="loginStatus" @click="scanningCode">
				<image src="@/static/images/scan.png" class="set_image2"></image>
			</view>
		</z-nav-bar>
		<view class="no-list" v-if="!loginStatus">
			<image src="@/static/images/sopFile.png" mode=""></image>
			<view class="item-desc">
				<text class="item-label">操作步骤</text>
				<text class="item-label">1.用电脑浏览打开网址<text class="website" @click="getCopy()">{{website}}</text></text>
				<text class="item-label">2.点击页面下方扫码登录按钮进行登录</text>
				<text class="item-label">3.上传文件，手机端选择确认</text>
			</view>
			<view class="copy-website" @click="getCopy()">复制链接</view>
		</view>
		<view class="list-contian" v-if="loginStatus">
			<view class="list-contain">
				<view class="item-file" v-for="(item,index) in resultList" :key="item.filePath">
					<!-- @click="item.type == 'img' ? imgPreview(index):''" -->
					<view v-if="item.type !== 'video'" class="upload-preview" @click="checkboxChange(index)"
						:style="{ backgroundImage: 'url(' + getFileType(item) + ')' }">
					</view>
					<view class="item-checkbox" v-if="!batchManagementStauts">
						<u-checkbox v-model="item.checked" @change="checkboxChange(index)"></u-checkbox>
					</view>
				</view>
			</view>
		</view>
		<!-- <bottom-button :title="setButtonTitle()" @click="getCode()"></bottom-button> -->

		<view class="custom-nodes-page-button">
			<scroll-view :scroll-x="true" class="scroll-X">
				<view class="item-button-list">
					<view class="item-button-default"
						:class="[item.active ? 'item-button-default-active':'',item.borderActive ? 'item-button-default-border':'' ]"
						v-for="(item,index) in setButtonList" :key="index" @click="getButton(item)">
						{{item.name}}
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import baseConfig from '@/config/common.js'
	export default {
		data() {
			return {
				option: {},
				website: baseConfig.fileUpload,
				accessToken: '',
				expires: '',
				loginStatus: true,
				list: [],
				resultList: [],
				batchManagementStauts: false,
				imageType: ['png', 'jpg', 'jfif', 'gif', 'jpeg'],
				videoType: ['mp3', 'mp4'],
				buttonList: [{
						name: '同步',
						active: false,
						borderActive: true,
					},
					{
						name: '扫码登录',
						active: true,
						borderActive: false,
					},
					{
						name: '确认',
						typeName: '确认',
						active: true,
						borderActive: false,
					}
				],
				fileType: [{
						url: require("@/static/images/file_type/doc.png"),
						type: 'doc'
					},
					{
						url: require("@/static/images/file_type/pdf.png"),
						type: 'pdf'
					},
					{
						url: require("@/static/images/file_type/xls.png"),
						type: 'xls'
					},
					{
						url: require("@/static/images/file_type/xls.png"),
						type: 'xlsx'
					},
					{
						url: require("@/static/images/file_type/zip.png"),
						type: 'zip'
					},
					{
						url: require("@/static/images/file_type/ppt.png"),
						type: 'ppt'
					},
					{
						url: require("@/static/images/file_type/ppt.png"),
						type: 'pptx'
					},
					{
						url: require("@/static/images/file_type/cad.png"),
						type: 'cad'
					},
					{
						url: require("@/static/images/file_type/doc.png"),
						type: 'doc'
					},
					{
						url: require("@/static/images/file_type/doc.png"),
						type: 'docx'
					}
				],
			}
		},
		computed: {
			setButtonList() {
				let resultButton = this.buttonList
				if (this.loginStatus) {
					let selectList = this.resultList.filter(item => item.checked)
					resultButton = resultButton.filter(item => item.name !== '扫码登录')
					resultButton.forEach(el => {
						if (el.typeName == '确认') {
							el.name == `完成(${selectList.length}/${9})`
						}
					})
					return resultButton
				} else {
					return resultButton.filter(item => item.name == '扫码登录')
				}
			}
		},
		mounted() {

		},
		onUnload() {
			// console.log('this.timer-xiaohui',this.timer);
			// console.log('getStorageSync',uni.getStorageSync('fileTiming'));
			// clearInterval(this.timer);
			// this.timer = null
		},
		onShow() {
			this.setAccessToken()
		},
		onLoad(option) {
			this.option = option
			this.getLoginResult()
			// this.setTimer()
		},
		methods: {

			setButtonTitle() {
				if (this.loginStatus) {
					let selectList = this.resultList.filter(item => item.checked)
					return `完成(${selectList.length}/${9})`
				} else {
					return '扫码登录'
				}
			},
			goBackPage() {
				clearInterval(this.timer);
				this.timer = null
				uni.navigateBack({
					delta: 1
				})
			},
			setTimer() {
				return
				this.timer = setInterval(() => {
					if (this.loginStatus) {
						// console.log('this.timer-开始',this.timer);
						this.getFileList()
					}
				}, 3000)
				uni.setStorageSync('fileTiming', this.timer)
			},
			getFileType(item) {
				let suffix = item.url.substring(item.url.lastIndexOf('.') + 1)
				if (this.imageType.includes(suffix)) {
					return this.$util.thumbnailImage(item.url, true)
				} else {
					let tempFile = this.fileType.find(item => item.type == suffix)
					if (tempFile) {
						return tempFile.url
					} else {
						return this.defaultIcon
					}
				}
			},
			setAccessToken() {
				const userInfo = uni.getStorageSync('userInfo');
				this.accessToken = userInfo ? userInfo.access_token : ''
				this.expires = userInfo ? userInfo.expires_in : ''
			},
			checkboxChange(index) {
				this.resultList[index].checked = !this.resultList[index].checked
				this.setButtonTitle()
				this.$forceUpdate()
			},
			scanningCode() {
				//  plus.barcode.BarcodeStyles {
				// 	attribute String width;
				// 	attribute String height;
				// }
				uni.scanCode({
					success: (res) => {
						// 缓存GUID 
						uni.setStorageSync('GUID', res.result)
						this.$httpApi.loginQr({
							expires: this.expires,
							guid: res.result,
							token: this.accessToken
						}).then(resutl => {
							if (resutl) {
								this.$util.toast('登录成功')
								this.loginStatus = true
							}
						})
					}
				})
			},
			getButton(item) {
				switch (item.name) {
					case '扫码登录':
						this.scanningCode()
						break
					case '同步':
						this.getFileList()
						break
					default:
						clearInterval(this.timer);
						this.timer = null
						let selectList = this.resultList.filter(item => item.checked)
						uni.$emit('sopFileUpload', selectList)
						this.goBack()
						break
				}
			},
			getCode() {
				if (this.setButtonTitle() == '扫码登录') {
					this.scanningCode()
				} else {
					clearInterval(this.timer);
					this.timer = null
					let selectList = this.resultList.filter(item => item.checked)
					uni.$emit('sopFileUpload', selectList)
					this.goBack()
				}
			},
			getLoginResult() {
				// 退出登录时清空
				let tempGuid = uni.getStorageSync('GUID')
				if (tempGuid) {
					// 判断是否登录成功	
					this.$httpApi.getLoginResult({
						guid: tempGuid
					}).then(res => {
						if (res) {
							if (res.token) {
								this.loginStatus = true
								this.getFileList()
							} else {
								this.loginStatus = false
							}
						}
					})
				} else {
					this.loginStatus = false
				}
			},
			getFileList() {
				// 退出登录时清空
				let tempGuid = uni.getStorageSync('GUID')
				console.log('tempGuid',tempGuid);
				if (tempGuid) {
					// 查询文件
					this.$httpApi.getFileList({
						guid: tempGuid
					}).then(res => {
						if (res) {
							res.forEach(el => {
								el['checked'] = false
								el['url'] = el.filePath
								el['localPathStatus'] = true
								// 设置type
								let suffix = el.url.substring(el.url.lastIndexOf('.') + 1)
								if (this.imageType.includes(suffix)) {
									el['type'] = 'img'
								} else if (this.videoType.includes(suffix)) {
									el['type'] = 'video'
								} else {
									el['type'] = suffix
								}
							})
							this.resultList = JSON.parse(JSON.stringify(res))
							this.$forceUpdate()
						}
					})
				}
			},
			getCopy() {
				uni.setClipboardData({
					data: this.website,
					success: () => { // 复制成功的回调函数
						this.$util.toast("复制成功");
					}
				})
			},
			imgPreview(index) {
				let resultImageList = this.resultList.filter(item => item.type == 'img')
				resultImageList = resultImageList.map(el => {
					return this.$util.thumbnailImage(el.url, false)
				})
				uni.previewImage({
					current: index,
					urls: resultImageList,
					loop: true
				});
			}
		}
	}
</script>
<style>
	page {
		height: 100%;
		/* background-color: #FFFFFF; */
	}
</style>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */
	
	.sop-file-page{
		padding-bottom: 180rpx;
	}

	.nav-bar-right {
		.set_image2 {
			width: 56rpx;
			height: 56rpx;
			margin-right: 20rpx;
		}
	}

	.no-list {
		display: flex;
		align-items: center;
		flex-direction: column;
		height: 82vh;
		margin-top: 10rpx;
		background-color: #FFFFFF;


		image {
			width: 400rpx;
			height: 254rpx;
			margin: 200rpx 0rpx 140rpx 0rpx;
		}

		.item-desc {
			display: flex;
			flex-direction: column;
			padding: 0 40rpx;

			.item-label {
				color: #303133;
				font-size: 28rpx;
				line-height: 60rpx;
			}

			.website {
				color: #002FA5;
				font-size: 28rpx;
				text-decoration: underline
			}
		}

		.copy-website {
			color: #909199;
			font-size: 28rpx;
			margin-top: 40rpx;
		}
	}

	.list-contain {
		display: flex;
		padding: 10rpx 0rpx;
		flex-wrap: wrap;

		.item-file {
			margin-right: 2rpx;
			margin-bottom: 2rpx;
			position: relative;

			&:nth-of-type(3n) {
				margin-right: 0rpx;
			}


			.item-checkbox {
				position: absolute;
				bottom: 0rpx;
				z-index: 9;
				// background-color: rgba(0, 0, 0, 0.6);
				width: 99%;
				height: 50rpx;
				border-bottom-left-radius: 10rpx;
				border-bottom-right-radius: 10rpx;
				display: flex;
				align-items: center;
				justify-content: flex-end;

				/deep/ .u-checkbox__icon-wrap {
					border: 2rpx solid #fff;
					background-color: rgba(0, 0, 0, 0.6);
				}

				/deep/ .u-checkbox__label {
					margin-right: 0rpx !important;
				}

				/deep/.u-checkbox__icon-wrap--checked {
					background-color: #002FA5;
				}
			}
		}

		.upload-preview {
			width: 249rpx;
			height: 249rpx;
			background: #F6F7F9;
			box-sizing: border-box;
			background-size: cover;
			background-position: center;
			position: relative;
		}
	}

	.custom-nodes-page-button {
		position: fixed;
		bottom: 0rpx;
		width: 100%;
		z-index: 10;
		// width: 200rpx;

		.scroll-X {
			width: 100%;
			background-color: #fff;
		}

		.item-button-list {
			margin: 18rpx 26rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);

			.item-button-default {
				height: 88rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				flex: 1;
				color: #606166;
				border: 2rpx solid #EBEBEB;
				border-radius: 10rpx;
				font-size: 32rpx;
				margin-right: 24rpx;
				white-space: nowrap;

				padding: 0 20rpx;

				&:last-child {
					margin-right: 0rpx;
				}
			}

			.item-button-default-active {
				border: 2rpx solid $themeColor;
				color: #fff;
				background-color: $themeColor;
			}

			.item-button-default-border {
				border: 2rpx solid $themeColor;
				// margin-right: 24rpx;
				color: $themeColor;
			}

			.item-disable {
				opacity: 0.5;
			}
		}
	}
</style>
