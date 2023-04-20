<template>
	<view class="drawings-contain">
		<view class="drawings-contain-top">
			<u-sticky offset-top="0" class="space-list-sticky">
				<u-tabs class="u-tabs-contain" :list="drawingsType" font-size="26" active-color="#002FA5"
					inactive-color="#606166" bar-height="4" :current="current" @change="change"></u-tabs>
			</u-sticky>
		</view>
		<view class="image-grouping" v-if="list.length > 0">
			<view class="item-image" v-for="(item,index) in list" :key="index" @click.stop="getImageDetails(item)">
				<view class="left">
					<u-lazy-load v-if="item.cover "
						height="144" imgMode="aspectFit" class="record-item-img" border-radius="10"
						:image="item.type == 'img' ? $util.thumbnailImage(item.cover,true):item.cover">
					</u-lazy-load>
					<image v-else src="@/static/images/no-data.png" style="height: 144rpx;" class="record-item-img">
					</image>
					<view class="item-name">
						<text class="type-name">{{item.groupName}}</text>
						<text class="type-num" v-if="item.imageLength">{{item.imageLength}}张</text>
					</view>
				</view>
				<view class="right">
					<image class="arrow" src="@/static/images/right-vector.png" mode=""></image>
				</view>
			</view>
		</view>
		<mh-empty v-show="list.length === 0" icon="/static/images/no_recommend.png" title="您还没有数据～～" />
		<mihuo-bottom-button :buttonList="buttonList" @click="uploadFile()"></mihuo-bottom-button>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	import common from '@/config/common.js'
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
				docImg: require('../../../static/images/file_type/doc.png'),
				pdfImg: require('../../../static/images/file_type/pdf.png'),
				xlsImg: require('../../../static/images/file_type/xls.png'),
				zipImg: require('../../../static/images/file_type/zip.png'),
				pptImg: require('../../../static/images/file_type/ppt.png'),
				cadImg: require('../../../static/images/file_type/cad.png'),
				defaultImg: require('../../../static/images/file_type/default.png'),
				buttonList: [{
					name: '上传文件',
					status: true
				}],
			}
		},
		onShow() {
			this.setParameter()
			this.getType()

		},
		onLoad(option) {
			this.option = option
		},
		computed: {
			...mapState(['projectInfo', 'nodeInfo'])
		},
		methods: {
			setParameter() {
				this.projectId = this.projectInfo.projectId
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
						this.uploadGroup = this.uploadGroup || res[0].value
						this.getList()
						uni.setStorageSync('SOP_UPLOAD_FILE_TYPE', this.drawingsType)
					}
				})
			},
			getList() {
				let {
					type,
					projectId
				} = this.option
				if (type == '查看图纸') {
					this.projectId = projectId
				} else {
					this.projectId = this.projectId
				}
				this.$httpApi.sopuploadGroupList({
					uploadGroup: this.uploadGroup,
					addressId:this.projectInfo.addressId
				}).then(res => {
					if (res) {
						let tempIndex = 0
						res.forEach(item => {
							let tempUrl = item.sopUploadList.length > 0 && item.sopUploadList[0]
								.uploadItemList[0] && item.sopUploadList[0].uploadItemList[0]
							if (tempUrl) {
								item['cover'] = this.setFileType(tempUrl)
								item['type'] = tempUrl.type
							}
							tempIndex = 0
							item.sopUploadList.forEach(el =>{
								el.uploadItemList.forEach(ev =>{
									tempIndex++
								})
							})
							item['imageLength'] = tempIndex
						})
						this.list = res

						console.log('this.list', this.list);
					}
				})
			},
			change(index) {
				this.current = index
				this.uploadGroup = this.drawingsType[index].value
				this.getList()
			},
			imgPreview(url) {
				uni.previewImage({
					current: url,
					urls: [url],
				});
			},
			callPhone(userId) {
				uni.showLoading()
				this.$httpApi.getPhoneNumberByUserId(userId).then(res => {
					if (res) {
						uni.hideLoading()
						uni.makePhoneCall({
							phoneNumber: res
						});
					}
				})
			},
			uploadFile() {
				this.toPage(
					`/pages/construction/drawings/upload?isShowTabs=true&valueId=${this.uploadGroup}`
				);
			},
			getImageDetails(item) {
				this.toPage(
					`/pages/construction/drawings/toViewImage?valueId=${this.uploadGroup}&groupName=${item.groupName}`)
			},
			setFileType(item) {
				switch (item.type) {
					case 'img':
						return item.url
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.drawings-contain {

		.drawings-contain-top {
			// position: fixed;
			// z-index: 10;
			box-shadow: 0px 6rpx 4rpx rgba(183, 183, 183, 0.25);
		}



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
			padding: 8rpx 52rpx 40rpx 52rpx;
			margin-top: 10rpx;

			.item-image {
				display: flex;
				justify-content: space-between;
				padding-bottom: 32rpx;
				border-bottom: 2rpx dashed #EEEEEE;
				padding-top: 32rpx;

				&:last-child {
					border-bottom: 0rpx;
					padding-bottom: 0rpx;
				}

				.left {
					display: flex;

					.record-item-img {
						width: 144rpx;
					}

					.item-name {
						display: flex;
						margin-left: 22rpx;
						flex-direction: column;
						justify-content: center;

						.type-name {
							font-size: $middleFontSize;
							color: $seconFontColor;
							margin-bottom: 4rpx;
						}

						.type-num {
							font-size: $smallFontSize;
							color: $viceFontColor;
						}
					}
				}

				.right {
					display: flex;
					align-items: center;

					.arrow {
						width: 14rpx;
						height: 26rpx;
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
</style>
