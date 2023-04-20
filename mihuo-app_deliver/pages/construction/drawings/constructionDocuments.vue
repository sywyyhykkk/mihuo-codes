<template>
	<view>
		<public-module></public-module>
		<view class="main-container">
			<mihuo-order-information :projectId="projectId" style="margin-top: 18rpx"></mihuo-order-information>
			<view class="tabs">
				<u-tabs active-color="#002FA5" :list="optionsList" style="border-radius: 10rpx 10rpx 0 0; "
					:is-scroll="true" :current="current" @change="change" bar-width="42" bar-height="4"></u-tabs>
			</view>
			<view v-if="fileRecordList.length === 0">
				<image src="@/static/images/no_upload_data.png" class="no-data-img"></image>
				<view v-if="$permissionRouting.getInstance().isShow()" class="no-data-text" @click="addTypeUpload()">
					还没有上传文件，<text>点击上传</text>
				</view>
			</view>
			<view class="items">
				<view class="drawings-item" v-for="(imgObj,index) in fileRecordList" :key="index">
					<view class="title-container flex-center">
						<view class="left">
							{{ imgObj.groupName }}
						</view>
						<view class="right flex-center" @click.stop="add(imgObj)">
							<view class="icon-container flex-center">
								<image src="@/static/icon/Group74.png" class="icon"></image>
							</view>
						</view>
					</view>
					<view class="content">
						<view v-if="imgObj.sopUploadList.length >  0" class="content-item" :key="imgObj.id">
							<view v-for="(items,index) in imgObj.sopUploadList" :key="index">
								<view class="header-container flex-center">
									<view class="left flex-center">
										<u-avatar :src="$util.avatarImage(items.creatorId, true, 36)" size="36"
											style="margin-right: 10rpx"></u-avatar>
										{{ items.creatorName }}
										<text class="item-text" v-if="items.skillName">({{ items.skillName }})</text>
										<text>{{ items.created && items.created.substring(0,16) }} 上传</text>
									</view>
									<view class="right" @click.stop="edit(items)">
										<image src="@/static/images/icon_edit/editor_2.png" class="icon"></image>
									</view>
								</view>
								<view class="note" v-if="items.remark">
									备注<text>{{ items.remark }}</text>
								</view>
								<view class="images">
									<image-show @goToView="goToView(items.tempUploadItemList)"
										:imgSrc="items.tempUploadItemList" :key="items.tempUploadItemList"
										:isCallback="false" height="174" width="174" />
								</view>
							</view>
						</view>
						<view v-else class="c">
							<image src="@/static/images/no_upload_data.png" class="no-data-img"></image>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		CommonUpload
	} from "@/plugins/uploadPic.js";
	import {
		mapState,
	} from 'vuex'
	export default {
		data() {
			return {
				current: 0,
				isShowTabs: true,
				optionsList: [{
					name: "全部",
					value: "-1",
				}, ],
				projectId: '',
				uploadGroup: "",
				uploadGroupValue: '',
				nodeId: "",
				fileRecordList: []
			};
		},
		onLoad() {
			this.getType();
		},
		onShow() {
			this.setParameters()
		},
		computed: {
			...mapState(['projectInfo', 'nodeInfo', 'userPersonInfo'])
		},
		methods: {
			setParameters() {
				this.projectId = this.projectInfo.projectId
				this.nodeId = this.nodeInfo.nodeId
				this.sopuploadGroupList()
			},
			sopuploadGroupList() {
				let tempParameter
				if (this.uploadGroup) {
					if (this.uploadGroup == -1) {
						tempParameter = {
							projectId: this.projectId,
						}
					} else {
						tempParameter = {
							projectId: this.projectId,
							uploadGroup: this.uploadGroup,
						}
					}
				} else {
					tempParameter = {
						projectId: this.projectId,
					}
				}

				if (!tempParameter.projectId) {
					return
				}

				this.$httpApi.sopuploadGroupList(tempParameter).then(res => {
					if (res) {
						res.map(item => {
							item.sopUploadList.map(el => {
								el['tempUploadItemList'] = JSON.stringify(el.uploadItemList)
							})
						})
						this.fileRecordList = res
					}
				})
			},
			uploadFile() {
				this.toPage(
					`/pages/construction/drawings/upload?options=${this.nodeInfo.uploadFile}&valueId=${this.optionsList[this.current].value}&isShowTabs=${this.isShowTabs}`
				);
			},
			getType() {
				this.$httpApi
					.getDicType({
						type: "sop_upload_file_type",
					})
					.then((res) => {
						if (res) {
							res.map((item, index) => {
								item["name"] = item.label;
								item["value"] = item.value;
							});
							this.optionsList = this.optionsList.concat(res);
							uni.setStorageSync("SOP_UPLOAD_FILE_TYPE", res);
						}
					});
			},
			change(index) {
				this.current = index;
				this.uploadGroup = this.optionsList[index].value;
				console.log("uploadGroup",this.uploadGroup);
				this.sopuploadGroupList();
			},
			add(imgObj) {
				let options = this.nodeInfo.uploadFile;
				if (imgObj) {
					this.toPage(
						`/pages/construction/drawings/upload?options=${options}&itemName=${imgObj.groupName || ""}&valueId=${this.uploadGroup}&isShowTabs=${this.isShowTabs}`
					);
				}
			},
			addTypeUpload(item) {
				let options = this.nodeInfo.uploadFile;
				this.toPage(
					`/pages/construction/drawings/upload?valueId=${this.optionsList[this.current].value}&options=${options}&isShowTabs=${this.isShowTabs}`
				);
			},
			edit(item) {
				this.toPage(
					`/pages/construction/drawings/editDrawings?data=${item.tempUploadItemList}&imgId=${item.id}&groupName=${item.groupName}`
				);
			},
			goToView(item) {
				uni.setStorageSync("currentViewing", item);
				this.toPage("/pages/construction/drawings/viewDrawings");
			},
		},
	};
</script>

<style lang="scss" scoped>
	@import "@/style/mixin.scss";

	.nav-bar-title {
		font-family: PingFang SC;
		font-style: normal;
		font-weight: bold;
		font-size: $mainFontSize;
		text-align: center;
		color: $seconFontColor;
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
		overflow: scroll;

		.tabs {
			width: 710rpx;
			// height: 104rpx;
			margin: 10rpx 20rpx 2rpx 20rpx;
		}

		.order-info {
			background: $bgColor;
			border-radius: $miniBorderRadius;
			padding: 36rpx 40rpx 40rpx 50rpx;
			margin: 0 20rpx;

			.info-other {
				margin-top: 20rpx;
			}

			.info-item {
				justify-content: space-between;
				height: 40rpx;

				.item-price {
					font-weight: normal;
					font-size: 24rpx;
					color: #ff5d35;
				}

				.item-item {
					display: flex;
					// width: 45%;

					.item-worker {
						font-weight: normal;
						font-size: 28rpx;
						color: #909199;
					}

					.worker-type {
						font-weight: normal;
						font-size: 28rpx;
						color: #333333;
						margin-left: 20rpx;
					}
				}

				.item-title {
					font-weight: bold;
					font-size: 28rpx;
					color: #303133;
				}

				.item-content {
					font-weight: normal;
					font-size: 24rpx;
					color: $themeColor;
				}
			}

			.info-item2 {
				justify-content: space-between;
				height: 40rpx;

				.item-title2 {
					font-size: $smallFontSize;
					color: $themeColor;
				}

				.item-content2 {
					font-weight: normal;
					font-size: $smallFontSize;
					color: $errorFontColor;
				}
			}
		}

		.title {
			margin: 40rpx 0 40rpx 30rpx;

			text {
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: $middleFontSize;
				line-height: 40rpx;
				color: #303133;
			}

			.icon {
				width: 44rpx;
				height: 30rpx;
				margin-right: 10rpx;
			}
		}

		.items {
			width: 710rpx;
			margin: 0 20rpx;
			overflow: hidden;
		}

		.drawings-item {
			background: $bgColor;
			margin-bottom: 10rpx;
			padding: 34rpx 42rpx;

			.title-container {
				justify-content: space-between;

				.left {
					font-family: PingFang SC;
					font-style: normal;
					font-weight: bold;
					font-size: $middleFontSize;
					line-height: 40rpx;
					color: $themeColor;

				}

				.right {
					font-family: PingFang SC;
					font-style: normal;
					font-weight: 500;
					font-size: $smallFontSize;
					line-height: 34rpx;
					color: $themeColor;

					.icon-container {
						width: 36rpx;
						height: 36rpx;
						border: 2rpx solid $themeColor;
						border-radius: $miniBorderRadius;
						margin-right: 6rpx;
						justify-content: center;

						.icon {
							width: 14rpx;
							height: 14rpx;
						}
					}
				}
			}

			.content {
				width: 100%;
				height: max-content;
				margin-top: 30rpx;
				border-top: 2rpx $borderColor solid;

				.content-item {
					width: 100%;
					padding-top: 32rpx;

					.header-container {
						width: 100%;
						margin-bottom: 36rpx;

						.left {
							width: 90%;
							white-space: nowrap;
							font-family: PingFang SC;
							font-style: normal;
							font-weight: 400;
							font-size: $smallFontSize;
							line-height: 34rpx;
							color: $mainFontColor;

							.item-text {
								font-size: $smallFontSize;
								color: $mainFontColor;
							}

							text {
								margin-left: 20rpx;
								font-family: PingFang SC;
								font-style: normal;
								font-weight: 300;
								font-size: $smallFontSize;
								line-height: 34rpx;
								color: $mainFontColor;
							}
						}

						.right {
							width: 10%;

							.icon {
								width: 34rpx;
								height: 34rpx;
								float: right;
							}
						}
					}

					.note {
						margin-top: 20rpx;
						font-family: PingFang SC;
						font-style: normal;
						font-weight: 300;
						font-size: $smiddleFontSize;
						line-height: 36rpx;
						color: $viceFontColor;

						text {
							margin-left: 20rpx;
							font-style: normal;
							font-weight: 500;
							font-size: $smiddleFontSize;
							line-height: 36rpx;
							color: $mainFontColor;
						}
					}

					.images {
						width: 640rpx;
						// height: 154rpx;
						margin-top: 24rpx;
					}
				}
			}
		}

		.no-data-img {
			width: 208rpx;
			height: 208rpx;
			margin: auto;
			margin-bottom: 20rpx;
		}

		.no-data-text {
			width: 100%;
			font-family: PingFang SC;
			font-style: normal;
			font-weight: 500;
			font-size: 26rpx;
			line-height: 36rpx;
			text-align: center;
			color: #909199;

			text {
				font-family: PingFang SC;
				font-style: normal;
				font-weight: 500;
				font-size: 26rpx;
				line-height: 36rpx;
				color: $themeColor;
			}
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
