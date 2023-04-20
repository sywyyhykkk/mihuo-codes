<template>
	<view class="drawings-contain">
		<view class="image-grouping" v-if="listShow">
			<view class="item-image" v-for="(el,index) in imageList" :key="index">
				<view class="record-item-img-all">
					<u-lazy-load v-if="el.url"
						@click="el.type == 'img'? imgPreview($util.thumbnailImage(el.url ,true),index):''"
						imgMode="aspectFill" border-radius="10"
						:image="el.type == 'img'? $util.thumbnailImage(el.url,true):setFileType(el.type)" height="240">
					</u-lazy-load>
					<image v-else src="@/static/images/no-data.png" style="height: 144rpx;" class="record-item-img">
					</image>
					<view class="item-checkbox" v-if="!batchManagementStauts">
						<u-checkbox v-model="el.checked" @change="checkboxChange($event, index)"></u-checkbox>
					</view>
				</view>
				<view class="item-name">
					<text class="type-name">{{el.time}}</text>
				</view>
			</view>
		</view>
		<mh-empty v-show="!listShow" icon="/static/images/no_recommend.png" title="您还没有数据～～" />


		<view class="button-content" v-if="listShow && $permissionRouting.getInstance().isShow()">
			<view class="item-active" @click="batchManagement()" v-if="batchManagementStauts">
				批量管理
			</view>
			<view class="item-button-contain" v-else>
				<view class="item-left">
					<u-checkbox v-model="selectChecked" @change="checkboxChangeAll()">全选</u-checkbox>
				</view>
				<view class="item-right">
					<view class="item-button" @click="operation('下载')">
						下载
					</view>
					<view class="item-button item-button-active" @click="operation('取消')">
						取消
					</view>
				</view>
			</view>
		</view>

		<modal-new :shutDown="true" v-model="deletelShow" @click="deleteConfirm" @cancel="deleteModalCancel">
			<view class="label">是否确认删除</view>
		</modal-new>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	import moment from '@/static/js/moment.js'
	export default {
		data() {
			return {
				option: {},
				current: 0,
				drawingsType: [],
				call: require("@/static/images/call.png"),
				fileType: [],
				list: [],
				uploadGroup: '',
				systemType: '',
				projectId: '',
				batchManagementStauts: true,
				selectChecked: false,
				deletelShow: false,
				groupNameId: '',
				listShow: false,
				docImg: require('../../../static/images/file_type/doc.png'),
				pdfImg: require('../../../static/images/file_type/pdf.png'),
				xlsImg: require('../../../static/images/file_type/xls.png'),
				zipImg: require('../../../static/images/file_type/zip.png'),
				pptImg: require('../../../static/images/file_type/ppt.png'),
				cadImg: require('../../../static/images/file_type/cad.png'),
				defaultImg: require('../../../static/images/file_type/default.png'),
				imageList: [],
				selectCheckedList: []
			}
		},
		onShow() {

		},
		onLoad(option) {
			this.option = option
			this.setParameter()
			this.getType()
		},
		computed: {
			...mapState(['projectInfo']),
		},
		methods: {
			setParameter() {
				this.projectId = this.projectInfo.projectId
				this.uploadGroup = this.option.valueId
			},
			judgmentSystem() {
				if (uni.getSystemInfoSync().platform == 'android') {

				} else if (uni.getSystemInfoSync().platform == 'iOS') {

				}
			},
			getType() {
				this.$httpApi.getDicType({
					type: 'sop_upload_file_type'
				}).then(res => {
					if (res) {
						res.map((item, index) => {
							item['name'] = item.label
							item['value'] = item.value
						})
						this.drawingsType = res
						// this.uploadGroup = this.uploadGroup || res[0].value

						this.getList()
						uni.setStorageSync('SOP_UPLOAD_FILE_TYPE', this.drawingsType)
					}
				})
			},
			getList() {
				this.$httpApi.sopuploadGroupList({
					// projectId: this.projectId,
					uploadGroup: this.uploadGroup,
					addressId: this.projectInfo.addressId
				}).then(res => {
					if (res) {
						this.imageList = []

						let tempSopUploadList = res.find(item => item.groupName == this.option.groupName)
						this.list = tempSopUploadList && tempSopUploadList.sopUploadList
						this.selectCheckedList = []
						let tempList = []
						if (this.list.length == 0) {
							return
						}
						this.list.map((item) => {
							item['time'] = moment(item.created).format('MMMDo HH:mm')
							this.groupNameId = item.id
							if (item.uploadItemList.length > 0) {
								this.listShow = true
							} else {
								this.listShow = false
							}
							item.uploadItemList.map(ev => {
								ev['checked'] = false
								this.imageList.push({
									time: moment(item.created).format('MMMDo HH:mm'),
									url: ev.url,
									type: ev.type,
									checked: false,
								})
								this.selectCheckedList.push(ev)
							})
						})
					}
				})
			},
			setFileType(type) {
				switch (type) {
					case 'doc':
						return this.docImg
					case 'docx':
						return this.docImg
					case 'pdf':
						return this.pdfImg
					case 'xls':
						return this.xlsImg
					case 'zip':
						return this.zipImg
					case 'ppt':
						return this.pptImg
					case 'pptx':
						return this.pptImg
					case 'cad':
						return this.cadImg
					case 'xlsx':
						return this.xlsImg
					default:
						return this.defaultImg
				}
			},
			change(index) {
				this.current = index
				this.uploadGroup = this.drawingsType[index].value
				this.getList()
			},
			imgPreview(url, index) {
				let resultImageList = this.imageList.filter(item => item.type == 'img')
				resultImageList = resultImageList.map(el => {
					return this.$util.thumbnailImage(el.url, false)
				})
				uni.previewImage({
					current: index,
					urls: resultImageList,
					loop: true
				});
			},
			uploadFile() {
				this.toPage(
					`/pages/construction/drawings/upload?isShowTabs=true&valueId=${this.uploadGroup}`
				);
			},
			batchManagement() {
				this.batchManagementStauts = !this.batchManagementStauts
				uni.setNavigationBarTitle({
					title: "批量管理"
				});
			},
			checkboxChange(e, index, num) {
				// this.list[index].uploadItemList[num].checked = !this.list[index].uploadItemList[num].checked;
				this.imageList[index].checked = !this.imageList[index].checked
				this.$forceUpdate()
				this.setSelectChecked()
			},
			setSelectChecked() {
				let tempIndex = 0
				// this.list.map(item => {
				// 	item.uploadItemList.map(ev => {
				// 		if (ev['checked']) {
				// 			tempIndex++
				// 		}
				// 	})
				// })

				this.imageList.forEach(ev => {
					if (ev['checked']) {
						tempIndex++
					}
				})

				if (tempIndex == this.selectCheckedList.length) {
					this.selectChecked = true
				} else {
					this.selectChecked = false
				}
			},
			checkboxChangeAll() {
				this.selectChecked = !this.selectChecked
				this.list.map(item => {
					item.uploadItemList.map(ev => {
						if (this.selectChecked) {
							if (!ev['checked']) {
								ev['checked'] = true
							}
						} else {
							if (ev['checked']) {
								ev['checked'] = false
							}
						}
					})
				})

				this.imageList.forEach(ev => {
					if (this.selectChecked) {
						if (!ev['checked']) {
							ev['checked'] = true
						}
					} else {
						if (ev['checked']) {
							ev['checked'] = false
						}
					}
				})
			},
			operation(type) {
				if (type == '下载') {
					this.download()
				} else if (type == '删除') {
					let checkedIndex = 0
					// this.list.map(item => {
					// 	item.uploadItemList.map(ev => {
					// 		if (ev['checked']) {
					// 			checkedIndex++
					// 		}
					// 	})
					// })

					this.imageList.forEach(ev => {
						if (ev['checked']) {
							checkedIndex++
						}
					})

					if (!checkedIndex) {
						this.$util.toast('请选择图片!');
						return
					}
					this.deletelShow = !this.deletelShow
				} else {
					this.batchManagementStauts = !this.batchManagementStauts
				}
			},
			deleteConfirm() {
				this.deletelShow = !this.deletelShow
				let restImgs = []
				// this.list.map(item => {
				// 	item.uploadItemList.map(ev => {
				// 		if (!ev['checked']) {
				// 			restImgs.push(ev)
				// 		}
				// 	})
				// })

				this.imageList.forEach(ev => {
					if (!ev['checked']) {
						restImgs.push(ev)
					}
				})


				this.$httpApi.sopuploadModify({
					id: this.groupNameId,
					uploadItemList: restImgs
				}).then(res => {
					this.getList()
					this.$util.toast('操作成功!');
				})
			},
			deleteModalCancel() {
				this.deletelShow = !this.deletelShow
			},
			download() {
				let currentFile = []
				let currentIndex = 0
				let downIndex = 0
				// this.list.map(item => {
				// 	item.uploadItemList.map(ev => {
				// 		if (ev['checked']) {
				// 			currentFile.push(ev)
				// 			currentIndex++
				// 		}
				// 	})
				// })

				this.imageList.forEach(ev => {
					if (ev['checked']) {
						currentFile.push(ev)
						currentIndex++
					}
				})

				if (currentFile.length == 0) {
					this.$util.toast('请选择图片!');
					return
				}
				let that = this
				for (let i = 0; i < currentFile.length; i++) {
					(function(t, data) {
						setTimeout(() => {
							if (currentFile[i].type == 'img') {
								uni.downloadFile({
									url: that.$util.thumbnailImage(currentFile[i].url, true),
									success: (res) => {
										if (res.statusCode === 200) {
											uni.saveImageToPhotosAlbum({
												filePath: res.tempFilePath,
												success: () => {
													downIndex++
													return;
												},
												fail: () => {
													that.$util.toast('保存失败，请稍后重试～');
													return;
												}
											});
										}
									}
								});
							} else {
								const downloadTask = uni.downloadFile({
									url: that.$util.thumbnailImage(currentFile[i].url, true),
									success: (res) => {
										if (res.statusCode === 200) {
											downIndex++
										}
										uni.saveFile({
											tempFilePath: res.tempFilePath,
											success: function(response) {
												console.log(response)
											}
										});
									},
									fail: (res) => {
										console.log(res)
									},
									complete: (res) => {
										console.log(res)
									}
								});
							}
						}, 600 * t)
					})(i, 'dd')
				}
				setTimeout(() => {
					if (downIndex) {
						this.$util.toast('下载成功!');
					} else {
						this.$util.toast('保存失败，请稍后重试～');
					}
				}, currentFile.length * 600)

			},
		}
	}
</script>

<style lang="scss" scoped>
	.space-list-sticky {}

	.drawings-contain {
		padding-bottom: 140rpx;




		.image-contain {
			// padding-top: 264rpx;
			padding-top: 40rpx;

			.image-item {
				padding: 0 20rpx 34rpx 20rpx;

				.image-title {
					margin-bottom: 32rpx;
					font-weight: bold;
					font-size: 28rpx;
					color: $seconFontColor;
					padding-left: 46rpx;
				}

				.record-item-img {
					margin-bottom: 20rpx;
				}
			}
		}

		.image-grouping {
			background-color: #FFFFFF;
			padding: 20rpx;
			margin-top: 10rpx;
			column-count: 2; //想要排成的列数
			column-gap: 24rpx;
			// min-height: 100vh;

			.item-image {
				// column-count: 2; //想要排成的列数
				// column-gap: 24rpx;
				-webkit-column-break-inside: avoid;

				.record-item-img {
					width: 340rpx;
					height: 240rpx;
				}

				.item-list-contain {
					-webkit-column-break-inside: avoid;
				}

				.record-item-img-all {
					position: relative;

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

				.item-name {
					display: flex;
					flex-direction: column;
					justify-content: center;
					margin: 10rpx 0rpx 30rpx 0rpx;

					.type-name {
						font-size: $middleFontSize;
						color: $seconFontColor;
					}
				}
			}
		}

		/deep/ .u-tab-bar {
			bottom: -4rpx;
		}

		.btn {
			width: 624rpx;
			height: 88rpx;
			margin: 100rpx auto;
			border-radius: $miniBorderRadius;
			background-color: $themeColor;
			color: $bgColor;
			font-size: $middleFontSize;
			text-align: center;
			line-height: 88rpx;
			font-family: PingFang SC;
			font-style: normal;
			font-weight: bold;
		}
	}



	.button-content {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		// @include safearea();
		z-index: 10;
		background-color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
		padding-bottom: 20rpx;
		padding-left: 30rpx;
		padding-right: 30rpx;
		width: 100%;

		.item-active {
			color: #FFFFFF;
			background: #002FA5;
			border-radius: 5px;
			height: 88rpx;
			display: flex;
			flex: 1;
			align-items: center;
			justify-content: center;
			margin-top: 10rpx;
			margin-bottom: 6rpx;
			font-size: 24rpx;
			font-weight: bold;
		}

		.item-button-contain {
			display: flex;
			width: 100%;
			justify-content: space-between;
			align-items: center;
			margin-top: 10rpx;
			margin-bottom: 6rpx;
		}

		.item-left {
			padding-left: 54rpx;
		}

		.item-right {
			display: flex;
			align-items: center;
			padding-right: 24rpx;

			.item-button {
				width: 164rpx;
				height: 84rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				border: 1px solid #EEEEEE;
				border-radius: 5px;
				color: #303133;
				font-size: 28rpx;
				margin-right: 12rpx;

				&:last-child {
					margin-right: 0rpx;
				}
			}

			.item-button-active {
				// border: 2rpx solid #002FA5;
				background-color: #002FA5;
				color: #fff;
			}
		}
	}

	.button-content {
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}

	.label {
		color: #999999;
		font-size: $middleFontSize;
		text-align: center;
	}
</style>
