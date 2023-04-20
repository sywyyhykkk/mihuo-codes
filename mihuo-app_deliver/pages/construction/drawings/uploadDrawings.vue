<template>
	<view>
		<public-module></public-module>
		<z-nav-bar backState="1000" class="z-nav-bar">
			<view slot="default" class="nav-bar-title">
				{{ navbarTitle }}
			</view>
			<view slot="right" class="nav-bar-right" @click="showTabs">
				施工文件
			</view>
		</z-nav-bar>
		<view class="main-container">
			<mihuo-order-information :projectId="projectId" style="margin-top: 18rpx"></mihuo-order-information>
			<!-- 节点相关信息	 -->
			<node-information ref="nodeInformation"></node-information>
			<!-- 节点审核信息 -->
			<sop-node-check ref="nodeCheck"></sop-node-check>
			<!-- 手动开始、结束填写的数据 -->
			<sop-operation-detail ref="sopOperationDetail" :iconShow="false"></sop-operation-detail>
			<view class="title flex-center">
				<image src="../../../static/icon/Group8813.png" class="icon"></image>
				<text>上传记录</text>
			</view>
			<view v-if="fileRecordList.length === 0">
				<image src="@/static/images/no_upload_data.png" class="no-data-img"></image>
				<view class="no-data-text" @click="addTypeUpload()">
					还没有上传文件，<text>点击上传</text>
				</view>
			</view>
			<view class="items">
				<view class="drawings-item" v-for="(imgObj,index) in fileRecordList" :key="index">
					<view class="title-container flex-center">
						<view class="left">
							{{ imgObj.groupName }}
						</view>
						<view class="right flex-center" v-if="$setNodeSkipStatus('show') && $permissionRouting.getInstance().isShow()" @click.stop="add(imgObj)">
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
						<view v-else class="no-contain">
							<image src="@/static/images/no_upload_data.png" class="no-data-img"></image>
							<view class="no-text">
								还没有上传文件~
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 手动开始、手动结束 -->
		<sop-operation ref="sopOperation"></sop-operation>
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
				isShowTabs: false,
				navbarTitle: "上传设计图",
				optionsList: [{
					name: "全部",
					value: "-1",
				}, ],
				projectId: '',
				uploadGroup: "",
				uploadGroupValue: '',
				uploadRecords: [],
				nodeId: "",
				imgList: [],
				loading: false,
				fileRecordList: []
			};
		},
		onLoad(option) {
			this.uploadGroup = option.uploadGroup;
			// 获取，配置上传文件节点的文件分组uploadGroup
			this.uploadGroupValue = this.nodeInfo.uploadGroup
			this.nodeId = this.nodeInfo.nodeId;
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
				this.setNavbarTitle()
				this.setNodeDetails()
			},
			setNodeDetails() {
				// 刷新节点审核信息
				this.$refs.nodeInformation && this.$refs.nodeInformation.getReviewList()
				
				this.$refs.nodeCheck && this.$refs.nodeCheck.getReviewList()
			
				// 更新node详情  
				this.$getNodeDetails(() => {
					// 刷新 手动添加的内容
					this.$refs.sopOperationDetail && this.$refs.sopOperationDetail.getDetails()
					this.$refs.sopOperation && this.$refs.sopOperation.getDetails()
					this.$refs.sopOperation && this.$refs.sopOperation.getButtonList()
				})
			},
			setNavbarTitle() {
				this.navbarTitle = this.nodeInfo.nodeName
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
						nodeId: this.nodeId,
						projectId: this.projectId,
					}
				}

				if (!tempParameter.projectId) {
					return
				}
				this.$httpApi.sopuploadGroupList(tempParameter).then(res => {
					if (res) {
						res.map(item => {
							if (item.sopUploadList.length > 0) {
								item['sortIndex'] = 1
								item.sopUploadList.map(el => {
									el['tempUploadItemList'] = JSON.stringify(el.uploadItemList)
								})
							} else {
								item['sortIndex'] = 2
							}
						})
						this.fileRecordList = res
						this.fileRecordList.forEach(el => {
							if (el.sopUploadList.length > 0) {
								el['created'] = el.sopUploadList[0].created
							}
						})
						this.fileRecordList.sort(this.compare('created', 'inverted'))
					}
				})
			},
			compare(prop, align) {
				return function(a, b) {
					var value1 = a[prop];
					var value2 = b[prop];
					if (align == "positive") { //正序
						return new Date(value1) - new Date(value2);
					} else if (align == "inverted") { //倒序
						return new Date(value2) - new Date(value1);
					}
				}
			},
			sortArr(attr) {
				return function(a, b) {
					return a[attr] - b[attr]
				}
			},
			uploadFile() {
				this.toPage(
					`/pages/construction/drawings/upload?options=${this.nodeInfo.uploadFile}&valueId=${this.uploadGroupValue}&isShowTabs=${this.isShowTabs}`
				);
			},
			change(index) {
				this.current = index;
				this.uploadGroup = this.optionsList[index].value;
				this.sopuploadGroupList();
			},
			showTabs() {
				this.toPage('/pages/construction/drawings/constructionDocuments')
			},
			add(imgObj) {
				let options = this.nodeInfo.uploadFile;
				if (imgObj) {
					this.toPage(
						`/pages/construction/drawings/upload?options=${options}&itemName=${imgObj.groupName || ""}&valueId=${this.uploadGroupValue}&isShowTabs=${this.isShowTabs}`
					);
				}
			},
			addTypeUpload(item) {
				let options = this.nodeInfo.uploadFile;
				this.toPage(
					`/pages/construction/drawings/upload?options=${options}&valueId=${this.uploadGroupValue}&isShowTabs=${this.isShowTabs}&itemName=${item.groupName}`
				);
			},
			edit(item) {
				this.toPage(
					`/pages/construction/drawings/editDrawings?data=${item.tempUploadItemList}&imgId=${item.id}&groupName=${item.groupName}`
				);
			},
			goToView(item) {
				let fileList = this.$isJSON(item) && JSON.parse(item)
				let otherFile = fileList.filter(ev => !['img','video'].includes(ev.type))
				let imageList = fileList.filter(ev => ['img','video'].includes(ev.type))
				uni.setStorageSync("currentViewing", item);
				if(otherFile.length > 0 && imageList.length == 0){
					// 如果只有附件 跳转 pages/construction/drawings/toViewFile
					uni.navigateTo({
						url: '/pages/construction/drawings/toViewFile',
						success(res) {
							res.eventChannel.emit('toViewFile', otherFile);
						}
					})
				}else{
					// 如果包含 附件 pages/construction/drawings/viewDrawings
					this.toPage("/pages/construction/drawings/viewDrawings");
				}
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
			border-radius: 10rpx 10rpx 0 0;
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

	.no-contain {

		.no-text {
			text-align: center;
			font-size: 24rpx;
			color: #909199;
		}

	}
</style>
