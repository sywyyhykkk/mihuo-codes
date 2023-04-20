<template>
	<view>
		<public-module></public-module>
		<z-nav-bar backState="1000">
			<view slot="default" class="nav-bar-title">
				编辑图片
			</view>
			<view slot="right" class="nav-bar-right" @click="selectAll">
				全选
			</view>
		</z-nav-bar>
		<view class="main-container iphonex-bottom">
			<view class="title flex-center">
				<view class="left">
					<u-checkbox shape="circle" v-model="isCheckedAll" @change="selectAll"></u-checkbox>
					<text>{{ groupName }}</text>
				</view>
				<view class="right">
					<view class="notice-status pulic-flex-center" @click="addImage()">
						<view class="icon-text">
							<u-icon color="#002FA5" size="24" name="plus"></u-icon>
						</view>
						<view class="name">新增</view>
					</view>
				</view>
			</view>
			<view class="list-contain">
				<view class="img-item flex-center" v-for="(item, index) in imgList" :key="index">
					<u-checkbox shape="circle" active-color="#002FA5" class="item-circle" v-model="checkList[index]"
						@change="checkItem($event, index)"></u-checkbox>
					<u-lazy-load imgMode="aspectFill" border-radius="10" class="img" height="200"
						:image="setFileUrl(item) ">
					</u-lazy-load>
				</view>
			</view>
		</view>
		<bottom-button title="删除图纸" @click="delDrawings"></bottom-button>
		<!-- <view class="loading" v-if="loadingShow">
			<u-loading mode="circle" size="60"></u-loading>
		</view> -->
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	import {
		CommonUpload
	} from '@/plugins/uploadPic.js';
	export default {
		data() {
			return {
				imgId: '',
				imgList: [],
				isCheckedAll: false,
				fileSize: 6291456, // 1M=1024KB=1048576B
				checkList: [],
				groupName: '',
				option: {},
				// loadingShow:false,
				defaultUrl: {
					url: require("@/static/images/file_type/default.png")
				},
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
				]
			}
		},
		computed: {
			...mapState(['userPersonInfo', 'examineType', 'businessCode', 'projectInfo', 'nodeInfo', 'userPersonId'])
		},
		onLoad(option) {
			this.option = option
			this.imgList = option.data !== '' ? JSON.parse(option.data) : []
			this.imgId = option.imgId

			this.imgList = this.imgList.filter(item => item !== null)
			this.imgList.forEach(item => {
				this.checkList.push(false)
			})
			this.groupName = option.groupName
		},
		watch: {
			checkList() {
				let flag = true;
				for (let i = 0; i < this.checkList.length; i++) {
					if (this.checkList[i] === false) {
						flag = false;
					}
				}
				this.isCheckedAll = flag;
			}
		},
		methods: {
			setFileUrl(item) {
				// let tempUrl
				// if(item){
				// 	if (item.type !== 'img') {
				// 		this.fileTypeSuffix.map(el => {
				// 			if (el.suffix.includes(item.type)) {
				// 				tempUrl = el.url
				// 			} else {
				// 				tempUrl = this.defaultUrl.url
				// 			}
				// 		})
				// 	} else {
				// 		tempUrl = this.$util.thumbnailImage(item.url, true)
				// 	}
				// 	return tempUrl
				// }

				let tempUrl
				if (item.type !== 'img') {
					tempUrl = this.fileTypeSuffix.find(ev => ev.suffix == item.type)
					if (!tempUrl) {
						tempUrl = this.defaultUrl.url
					} else {
						tempUrl = tempUrl.url
					}
				} else {
					tempUrl = this.$util.thumbnailImage(item.url, true)
				}
				return tempUrl
			},
			selectAll() {
				this.checkList = this.checkList.map(item => {
					if (this.isCheckedAll) {
						return false;
					} else {
						return true;
					}
				});
			},
			checkItem(e, index) {
				this.checkList[index] = e.value;
			},
			delDrawings() {
				if (this.isCheckedAll) {
					this.$httpApi.sopuploadModify({
						id: this.imgId,
						uploadItemList: []
					}).then(res => {
						this.imgList = []
						this.isCheckedAll = false
						this.getMyPending()
					})
				} else {
					this.delImage()
				}
			},
			sopuploadModify(restImgs) {
				this.$httpApi.sopuploadModify({
					id: this.imgId,
					uploadItemList: restImgs,
					businessCode: this.businessCode && this.examineType == '审查方' ? this.businessCode : ''
				}).then(res => {
					this.imgList = restImgs
					this.isCheckedAll = false
					this.checkList = []
					this.imgList.forEach(item => {
						this.checkList.push(false)
					})
					this.getMyPending()
				})
			},
			delImage() {
				let restImgs = []
				let tempRestImgs = []
				this.checkList.forEach((item, index) => {
					if (!item) {
						restImgs.push(this.imgList[index])
					} else {
						tempRestImgs.push(this.imgList[index])
					}
				})

				if (restImgs.length === 0) {
					this.$util.toast('请选择要删除的图纸！')
					return
				}

				if (!this.isCheckedAll) {
					if (tempRestImgs.length === 0) {
						this.$util.toast('请选择要删除的图纸！')
						return
					}
				}
				this.sopuploadModify(restImgs)
			},
			addImage() {
				let tempPreviewList = []
				uni.chooseImage({
					count: 9,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'], //从相册选择
					success: async (res) => {
						// this.loadingShow = !this.loadingShow
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
						this.imgList = [...this.imgList, ...tempPreviewList]
						this.checkList = []
						this.imgList.forEach(item => {
							this.checkList.push(false)
						})
						this.sopuploadModify(this.imgList, true)
					}
				})
			},
			/**
			 * 
			 * @description 编辑时，处理待办成功值后再向审查人发代办项
			 * 
			 * */
			getMyPending() {
				
				console.log('this.businessCode',this.businessCode);
				console.log('this.examineType',this.examineType);
				
				if (this.businessCode && this.examineType == '审查方') {
					let tempNodeId = this.businessCode.split('_')
					let resultNodeId
					if (tempNodeId.length > 0) {
						resultNodeId = tempNodeId[1]
					}
					
					console.log('resultNodeId',resultNodeId,tempNodeId,tempNodeId.length);
					
					if (resultNodeId) {
						this.$httpApi.setProjectNodeComplete({
							executePersonId: this.userPersonId,
							finishAttachments: this.imgList,
							nodeId: resultNodeId,
							projectId: this.projectInfo.projectId
						}).then(res => {

						})
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.nav-bar-title {
		font-family: PingFang SC;
		font-style: normal;
		font-weight: bold;
		font-size: $mainFontSize;
		text-align: center;
		color: $seconFontColor;
	}

	.loading {
		position: absolute;
		z-index: 999;
		width: 100%;
		height: 100vh;
		top: 0px;
		background: #000000;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.nav-bar-right {
		font-family: PingFang SC;
		font-style: normal;
		font-weight: bold;
		font-size: $middleFontSize;
		text-align: center;
		color: $viceFontColor;
		margin-right: 20rpx;
	}

	.main-container {
		width: 710rpx;
		margin: 18rpx 20rpx 0 20rpx;
		padding: 48rpx 34rpx;
		border-radius: $miniBorderRadius;
		background-color: $bgColor;
		overflow: scroll;

		.title {
			margin-bottom: 20rpx;
			display: flex;
			justify-content: space-between;

			.left {
				display: flex;
				align-items: center;

				text {
					font-family: PingFang SC;
					font-style: normal;
					font-weight: bold;
					font-size: $mainFontSize;
					line-height: 44rpx;
					color: $seconFontColor;
					margin-left: -20rpx;
				}
			}

			.right {

				.notice-status {
					margin-right: 20rpx;
					display: flex;
					flex-direction: row;
					align-items: center;

					.icon-text {
						width: 36rpx;
						height: 36rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius: $miniBorderRadius;
						border: 1px solid $themeColor;
						margin-right: 6rpx;
					}

					.name {
						font-size: $smallFontSize;
						color: $themeColor;
					}
				}
			}
		}


		.list-contain {
			display: flex;
			flex-wrap: wrap;

		}

		.img-item {
			position: relative;
			margin: 0 20rpx 20rpx 0rpx;

			&:nth-of-type(3n+0) {
				margin-right: 0rpx;
			}

			.img {
				width: 200rpx;
				border-radius: $miniBorderRadius;
			}

			.item-circle {
				position: absolute;
				top: 20rpx;
				left: 20rpx;
				z-index: 10;

				/deep/ .u-checkbox__icon-wrap {
					background-color: #FFFFFF;
				}
			}
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
