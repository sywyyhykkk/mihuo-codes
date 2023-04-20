<template>
	<view class="disclosure-page-all">
		<public-module></public-module>
		<z-nav-bar backState="1000" bgColor="#FFF" fontColor="#979797">
			<view slot="default" class="nav-bar-title">
				{{nodeInfo.nodeName}}
			</view>
			<view slot="right" class="nav-bar-right" @click="goAcceptanceTab">
				验收记录
			</view>
		</z-nav-bar>
		<mihuo-order-information :projectId="projectId"></mihuo-order-information>
		<view class="disclosure-page">
			<!-- <task-node :nodeInfo="nodeInfo" pageType="验收"></task-node> -->
			<!-- 节点相关信息	 -->
			<node-information ref="nodeInformation"></node-information>
			<!-- 节点审核信息 -->
			<sop-node-check ref="nodeCheck"></sop-node-check>
			<!-- 手动开始、结束填写的数据 -->
			<sop-operation-detail ref="sopOperationDetail" :iconShow="false"></sop-operation-detail>

			<view v-if="nodeInfo.checkType==2">
				<custom-title title="验收通知"></custom-title>
				<view class="notice-contain">
					<view class="no-data" v-if="list.length === 0">
						<view class="no-data-item">
							<custom-no-data title="还没有验收通知记录 快去发起验收吧~"></custom-no-data>
						</view>
						<text v-if="$permissionRouting.getInstance().isShow()" class="x6-button" :class="[$setNodeSkipStatus('class')]"
							@click="getInitiate('发起通知')">发起验收通知</text>
					</view>
					<view v-else class="data-contain">
						<view class="x6-information">
							<view class="top" v-for="(item, index) in originator" :key="index">
								<u-avatar class="node" size="36" :src="$util.thumbnailImage(item.avatar,true)">
								</u-avatar>
								<view class="personnel-contain">
									<text>{{item.name}}</text>
									<text>({{item.skillName}})</text>
									<text>2021-01-01 11:33</text>
									<text>发起验收</text>
								</view>
							</view>
							<view class="bottom">
								<text class="title">发送至</text>
								<view class="personnel-item-contain">
									<view class="personnel-item" v-for="(item,index) in recipient" :key="index">
										<u-avatar class="node" size="36" :src="$util.thumbnailImage(item.avatar,true)">
										</u-avatar>
										<text class="name">{{item.skillName}}({{item.name}}) </text>
										<text class="item-status"
											v-if="list.notifyUserList[index].readFlag==1">[已读]</text>
										<text class="item-status" style="color:#FF5D35;"
											v-if="list.notifyUserList[index].readFlag==0">[未读]</text>
									</view>
								</view>
							</view>
						</view>
						<view class="data-notice-contain-all">
							<view class="data-notice-contain">
								<view class="title">{{list.notifyTitle}}</view>
								<voice-image-play :titleStyle="false" :data="list"
									style="padding: 0;margin: 0 !important;" :boxShow="false"></voice-image-play>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view v-if="nodeInfo.checkType==2&&acceptList.length<=0">
				<custom-title title="验收结果"></custom-title>
				<view class="notice-contain">
					<view class="no-data">
						<view class="no-data-item">
							<custom-no-data title="还没有验收结果~"></custom-no-data>
						</view>
						<text v-if="$permissionRouting.getInstance().isShow()" class="x6-button" :class="[$setNodeSkipStatus('class')]" @click="goAccept()">去验收</text>
					</view>
				</view>
			</view>
			<view v-if="acceptList.length>0 &&  userShow">
				<custom-title title="验收信息"></custom-title>
				<view style="margin-bottom: 6rpx;">
					<acceptanceItem v-for="(item,index) in acceptList2" :key="index" v-if="index==0" :data="item"
						:bottomType="nodeInfo.checkType==2?false:true">
					</acceptanceItem>

					<!-- <view class="">
						
					</view> -->
				</view>
				<view class="more" @click="getOpen()" v-if="acceptList.length>1">
					<view class="more-text">更多记录</view>
					<image :src="'../../static/demo/icon_right.png'" :class="openShow?'more-image2':'more-image' ">
					</image>
				</view>
				<acceptanceItem v-for="(item,index) in acceptList2" :key="index" :data="item" :index="index"
					:bottomType="nodeInfo.checkType==2?false:true" style="margin-bottom: 6rpx;" v-if="index>0">
				</acceptanceItem>
			</view>
		</view>

		<!-- 手动开始、手动结束 -->
		<sop-operation ref="sopOperation" ></sop-operation>
		
		<!-- 1.从待处理进入不显示手动开始、手动结束按钮 2.审核失败之后显示去验收按钮-->
		<bottom-button title="去验收" v-if="nodeInfo.status == 6 && $permissionRouting.getInstance().isShow()" @click="goAccept"></bottom-button>
	</view>
</template>


<script>
	import {
		mapState,
	} from 'vuex'
	export default {
		data() {
			return {
				list: [],
				acceptList: [],
				originator: [],
				recipient: [],
				openShow: false,
				userPersonIdList: [],
				userIdList: [],
				userShow: false,
				projectId: '',
				option: {}
			}
		},
		onLoad(option) {
			this.option = option
		},
		onShow() {
			this.userPersonIdList = []
			this.setParameter()
			this.getAcceptList()
			this.setNodeDetails()
		},
		computed: {
			...mapState(['projectInfo', 'nodeInfo']),
			acceptList2() {
				if (this.acceptList.length > 1 && !this.openShow) {
					var acceptList = []
					acceptList.push(this.acceptList[0])
					return acceptList;
				}
				if (this.acceptList.length > 1 && this.openShow) {
					return this.acceptList;
				}
				if (this.acceptList.length <= 1) {
					return this.acceptList;
				}
			}
		},
		methods: {
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
			setParameter() {
				this.projectId = this.projectInfo.projectId
			},
			getOpen() {
				this.openShow = !this.openShow
			},

			getNotifyList() { // 获取验收通知
				this.$httpApi.getAcceptanceNotify(this.nodeInfo.nodeId).then(res => {
					if (res) {
						this.list = res
						if (res.notifyExecPersonId) { //获取发起验收通知人员信息
							this.userPersonIdList.push(res.notifyExecPersonId)
						}
						if (res.notifyUserList.length > 0) { //获取验收通知抄送人员信息
							res.notifyUserList.map(el => {
								this.userPersonIdList.push(el.personId)
							})
						}
					}
					this.getUserInformation()
				})
			},
			getAcceptList() { // 通过nodeId查询任务验收管理列表
				this.$httpApi.getAcceptancesByTaskId(this.nodeInfo.nodeId).then(res => {
					if (res) {
						res.map(item => {
							// 初始化字段
							// item['acceptanceName'] = 'xx'
							item['acceptanceSkillName'] = '工人'
							// item['acceptanceCreatePersonName'] = 'xx' 

							if (item.acceptanceCreatePersonId) {
								this.userPersonIdList.push(item.acceptanceCreatePersonId)
							}
							if (item.applyPersonId) {
								this.userPersonIdList.push(item.applyPersonId)
							}
						})
						this.acceptList = res
						if (this.nodeInfo.checkType == 2) { // checkType 1 内部验收  2 外部验收
							this.getNotifyList()
						} else {
							this.getUserInformation()
						}
						
						
					}

				})
			},
			getUserInformation() { // 获取用户信息
				let tempPersonIdListNew = [...new Set(this.userPersonIdList)]
				if (tempPersonIdListNew.length === 0) {
					return
				}


				this.$getPersonIdUser(tempPersonIdListNew, (res) => {


					if (this.nodeInfo.checkType == 2) { // 外部验收
						// 通知发起人
						this.originator = []
						this.recipient = []
						res.map(item => {
							if (Number(item.personId) === Number(this.list.notifyExecPersonId)) {
								this.originator.push(item)
							}
						})
						if (this.list.notifyUserList && this.list.notifyUserList.length > 0) {
							this.list.notifyUserList.map(item => {
								res.map(el => {
									if (Number(el.personId) === Number(item.personId)) {
										this.recipient.push(el)
									}
								})
							})
						}
					}
					// 验收信息人员信息
					if (this.acceptList.length > 0) {
						let tempAcceptList = JSON.parse(JSON.stringify(this.acceptList))
						tempAcceptList.map(item => {
							res.map(el => {
								if (Number(el.personId) === Number(item.acceptanceCreatePersonId)) {
									// item['name'] = el.name
									item['acceptanceCreatePersonName'] = el.name
									item['avatar'] = el.avatar
									item['skillName'] = el.skillName
									item['skillId'] = el.skillId

								}
								if (Number(el.personId) === Number(item.applyPersonId) && Number(
										item.checkType) === 1) { // 内部验收
									item['acceptanceName'] = el.name
									item['acceptanceAvatar'] = el.avatar
									item['skillId'] = el.skillId
									item['acceptanceSkillName'] = el.skillName
								}
							})
						})
						this.acceptList = tempAcceptList
					}
					
					
					this.userShow = true
					// this.$forceUpdate()
				})
			},
			goAcceptanceTab() {
				uni.navigateTo({
					url: '/pages/construction/acceptance/acceptanceTab'
				})
			},
			goAccept() {
				if (!this.$setNodeSkipStatus('status')) {
					return
				}

				uni.navigateTo({
					url: '/pages/construction/acceptance/acceptanceManagement',
					success: (res) => {
						res.eventChannel.emit('getAcceptanceManagement', {});
					}
				})
			},
			getInitiate(val) {
				if (!this.$setNodeSkipStatus('status')) {
					return
				}
				this.toPage(`/pages/construction/disclosure/initiatePage?typeName=${'验收'}`)
			},
			getButton() {
				uni.navigateTo({
					url: '/pages/construction/acceptance/acceptanceManagement',
					success: (res) => {
						res.eventChannel.emit('getAcceptanceManagement', {});
					}
				})
			}
		}

	}
</script>

<style lang="scss" scoped>
	.more {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 90rpx;

		.more-text {
			font-weight: normal;
			font-size: 26rpx;
			color: #909199;
		}

		.more-image {
			width: 30rpx;
			height: 30rpx;
		}

		.more-image2 {
			width: 30rpx;
			height: 30rpx;
			transform: rotate(90deg);
			-ms-transform: rotate(90deg);
			/* IE 9 */
			-moz-transform: rotate(90deg);
			/* Firefox */
			-webkit-transform: rotate(90deg);
			/* Safari 和 Chrome */
			-o-transform: rotate(90deg);
		}
	}

	.nav-bar-right {
		font-size: 28rpx;
		text-align: center;
		color: #909199;
		margin-right: 50rpx;

	}

	.nav-bar-title {
		font-size: 36rpx;
		color: #333333;
	}

	.x6-flex {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.x6-button {
		width: 210rpx;
		display: inline-block;
		height: 72rpx;
		line-height: 72rpx;
		text-align: center;
		color: $themeColor;
		font-size: 26rpx;
		background: $bgColor;
		border: 1px solid $themeColor;
		border-radius: $miniBorderRadius;
	}

	.x6-information {
		.top {
			display: flex;
			margin-bottom: 18rpx;

			.node {
				margin-right: 10rpx;
			}

			.personnel-contain {
				text {
					font-size: $smiddleFontSize;
					color: $mainFontColor;
				}

			}
		}

		.bottom {
			display: flex;
			align-items: center;
			position: relative;
			display: flex;
			align-items: flex-start;
			margin-bottom: 26rpx;

			.title {
				// position: absolute;
				font-size: $smallFontSize;
				color: $viceFontColor;
				margin-right: 14rpx;
				flex-wrap: nowrap;
				white-space: nowrap;
			}

			.personnel-item-contain {
				display: flex;
				flex-wrap: wrap;

				.personnel-item {
					display: flex;
					align-items: center;
					margin-right: 16rpx;
					margin-bottom: 8rpx;
					// white-space: nowrap;

					.name {
						font-size: $smallFontSize;
						color: $seconFontColor;
						margin-right: 6rpx;
					}

					.item-status {
						font-size: 20rpx;
						color: $viceFontColor;
					}
				}
			}

		}
	}

	.x6-bottom-contain {
		display: flex;
		justify-content: space-between;
		padding-right: 34rpx;

		.left {
			font-size: $smiddleFontSize;
			color: $viceFontColor;
		}

		.right {
			display: flex;
			flex-direction: row;
			align-items: center;

			text {
				font-size: $smallFontSize;
				color: $themeColor;
				margin-right: 12rpx;
			}

			image {
				width: 16rpx;
				height: 14rpx;
			}
		}
	}

	.x6-bottom-contain-new {
		padding-right: 0rpx;
	}

	.disclosure-page-all {
		padding-bottom: 100rpx;
	}

	.disclosure-page {
		.item-introduction {
			display: flex;
			flex-direction: column;
			margin: 0 20rpx;
			padding: 36rpx 42rpx 42rpx 50rpx;
			background: $bgColor;
			border-radius: $miniBorderRadius;

			.top {
				margin-bottom: 6rpx;

				.left {
					font-weight: bold;
					font-size: $middleFontSize;
					color: $seconFontColor;
				}

				.right {
					font-size: $smallFontSize;
					color: $themeColor;
				}
			}

			.middle {
				margin-bottom: 22rpx;

				.left {
					font-size: $smallFontSize;
					color: $themeColor;
				}

				.right {
					font-size: $smallFontSize;
					color: $errorFontColor;
				}

			}

			.bottom {
				display: flex;

				.label {
					font-size: $middleFontSize;
					color: $fontColor99;
				}

				.value {
					font-size: $middleFontSize;
					color: $seconFontColor;
				}
			}
		}

		.notice-contain {
			margin: 0 20rpx;
			// min-height: 440rpx;
			background: $bgColor;
			border-radius: $miniBorderRadius;

			.no-data-item {
				margin-bottom: 34rpx;
			}

			.no-data {
				text-align: center;
				padding-bottom: 40rpx;
			}
		}

		.data-contain-new {
			padding: 44rpx 40rpx 26rpx 42rpx !important;

			.data-notice-contain {
				padding: 32rpx 50rpx 46rpx 38rpx !important;
			}
		}

		.data-contain {
			padding: 44rpx 0rpx 26rpx 42rpx;

			.data-notice-contain-all {
				padding-right: 40rpx;
			}


			.data-notice-contain {
				box-shadow: 0px 0px 8px rgba(158, 156, 156, 0.25);
				border-radius: $miniBorderRadius;
				// max-width: 628rpx;
				display: flex;

				flex-direction: column;
				padding: 32rpx 0rpx 46rpx 38rpx;
				margin-bottom: 34rpx;

				.title {
					color: $seconFontColor;
					font-size: $middleFontSize;
					margin-bottom: 8rpx;
					font-weight: bold;
				}

				.time {
					font-size: $smallFontSize;
					color: $viceFontColor;
					margin-bottom: 8rpx;
				}

				.desc-contain {
					margin-bottom: 22rpx;

					.label {
						color: $viceFontColor;
						font-size: $middleFontSize;
						margin-right: 18rpx;
					}

					.desc {
						color: $seconFontColor;
					}

					text {
						font-size: $middleFontSize;
					}
				}

				.file-contain {
					display: flex;
					flex-wrap: wrap;

					.item-image {
						width: 144rpx;
						margin-right: 34rpx;
						margin-bottom: 20rpx;
					}
				}

			}


		}
	}
</style>
