<template>
	<view>
		<public-module></public-module>
		<z-nav-bar backState="1000" bgColor="#FFF" fontColor="#979797">
			<view slot="default" class="nav-bar-title">
				{{nodeInfo.nodeName}}
			</view>
			<view v-if="userRole !== 'R_WORKER'" slot="right" class="nav-bar-right" @click="goConstructionPlan">
				施工计划
			</view>
		</z-nav-bar>
		<mihuo-order-information :projectId="projectId"></mihuo-order-information>
		<!-- <task-node pageType="施工" :nodeInfo="nodeInfo"> -->
		<node-information ref="nodeInformation"></node-information>
		<!-- 节点审核信息 -->
		<sop-node-check ref="nodeCheck"></sop-node-check>
		<!-- 手动开始、结束填写的数据 -->
		<sop-operation-detail ref="sopOperationDetail" :iconShow="false"></sop-operation-detail>

		<view class="construction-all" v-if="startWorkList.length > 0">
			<voice-image-play v-for="(item, index) in startWorkList" :key="index" :data="item"></voice-image-play>
		</view>

		<view class="accept-info" v-if="acceptanceList.length>0">
			<view class="accept-title">
				<view class="title-text">验收信息</view>
				<view class="title-date" v-if="setTotalDays">
					完成合计天数:{{setTotalDays}}天</view>
				<view class="title-status" :class="getAcceptanceStatusClass">{{getAcceptanceStatus}}</view>
			</view>
			<view class="accept-item-all">
				<view v-for="(item,index) in acceptanceInformation" :key="index" class="item-all">
					<view class="accept-item">
						<view class="accept-item-contain" v-if="item.statusTypeName === '完工信息'">
							<u-avatar size="32" :src="$util.thumbnailImage(item.avatar,true) "></u-avatar>
							<view class="item-name">{{item.name}}({{item.skillName}})</view>
							<view class="item-date">{{item.time}}
								发起验收
							</view>
						</view>
						<view class="accept-item-contain" v-if="item.statusTypeName === '验收结果'">
							<u-avatar size="32"
								:src="$util.thumbnailImage(item.personInfo&&item.personInfo.avatar,true) "></u-avatar>
							<view class="item-name">
								{{item.personInfo&&item.personInfo.name}}({{item.personInfo&&item.personInfo.skillName}})
							</view>
							<view class="item-date">{{item.time}}
								执行验收
							</view>
						</view>
						<view class="accept-item-contain" v-if="item.statusTypeName === '整改信息' && item.personInfo ">
							<u-avatar size="32" :src="$util.thumbnailImage(item.personInfo.avatar,true) "></u-avatar>
							<view class="item-name">{{item.personInfo.name}}({{item.personInfo.skillName}})</view>
							<view class="item-date">{{item.time}}
								发起整改
							</view>
						</view>
					</view>
					<view class="accept-content">
						<view v-if="item.statusTypeName === '完工信息'">
							<view class="content-title">
								<view class="content-text">完工时长</view>
								<view class="content-data">{{item.workTimeLength}}&nbsp;&nbsp;</view>
							</view>
							<view class="content-description">
								<view class="top">
									<text class="desc">内容描述</text>
									<text class="desc-contain">
										{{item.coment}}
									</text>
								</view>
								<view v-if="item.imgFile !== '[]'" class="content-image">
									<image-show :imgSrc="item.imgFile" :key="item.imgFile"></image-show>
								</view>
								<view class="content-audio" v-if="item.voiceFile">
									<journal-audio :formDate="JSON.parse(item.voiceFile)" class="voice" />
								</view>
							</view>
						</view>
						<view class="content-title" v-if="item.statusTypeName === '验收结果'">
							<view class="content-text2">
								<view class="status-dot1">{{item.qualifiedCount + item.unqualifiedCount}}项验收</view>
								<view class="status-dot2">{{item.qualifiedCount}}项合格</view>
								<view class="status-dot3">{{item.unqualifiedCount}}项不合格</view>
							</view>
							<view class="content-right" @click="viewAcceptanceDetails(item)">
								<view class="right-text2">查看详情</view>
								<image :src="'../../static/images/shouqi.png'" class="right-image"></image>
							</view>
						</view>
						<view class="content-title" v-if="item.statusTypeName === '整改信息'">
							<view class="content-text2">异常来源：{{item.name}}</view>
							<view class="content-right" @click="goRectification(item.id)">
								<view class="right-text">{{getRectificationStatus(item.totalStatus)}}</view>
								<image :src="'../../static/images/shouqi.png'" class="right-image"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="process-item-page">
			<process-item :isRecord="true" v-for="(item,index) in processList" :key="index" :data="item" />
		</view>

		<!-- 撤销验收弹框 -->
		<modal-new :shutDown="true" v-model="modalShow" @click="confirm" @cancel="modalShow = false">
			<view class="label">是否撤销验收！</view>
		</modal-new>

		<!-- 手动开始、手动结束 -->
		<sop-operation ref="sopOperation" :addButtonList="setAddButtonList" @getButton="getButton"></sop-operation>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	import moment from "@/static/js/moment.js"
	export default {
		data() {
			return {
				titleStyle: false,
				nodeList: [{
					type: 1
				}, {
					type: 2
				}, {
					type: 3
				}],
				sopOperationKey: 0,
				processList: [],
				completeWorkList: [],
				startWorkList: [],
				acceptanceList: [],
				acceptanceInformation: [],
				rectificationDetails: {},
				startWork: false,
				acceptanceWork: false,
				projectId: '',
				modalShow: false,
				cancelStatus: false
			}
		},
		onShow() {
			this.setParameter()
			this.getWorkerList()
			this.getProcessList()
			this.setRectification()

			this.setNodeDetails()
		},
		computed: {
			...mapState(['projectInfo', 'nodeInfo', 'orderInfo', 'userPersonInfo', 'userRole']),
			getAcceptanceStatus() { //验收状态
				let tempName = ''
				this.acceptanceList.map(item => {
					// if(item.unqualifiedCount > 0){
					// 	tempName = '验收不通过'
					// }
					switch (Number(item.statusFlag)) {
						case 0:
							tempName = '待验收'
							break
						case 1:
							tempName = '验收通过'
							break
						case 2:
							tempName = '验收未通过'
							break
					}
				})
				return tempName
			},
			getAcceptanceStatusClass() {
				let tempName = ''
				this.acceptanceList.map(item => {
					switch (Number(item.statusFlag)) {
						case 0:
							tempName = 'status-error'
							break
						case 1:
							tempName = 'status-success'
							break
						case 2:
							tempName = 'status-error'
							break
					}
				})
				return tempName
			},
			setTotalDays() {
				let tempData = this.acceptanceInformation.find(item => item.statusFlag == 1)
				let constructionInformation = this.completeWorkList.find(item => item.itemType == 2)
				if (tempData && constructionInformation) {
					return moment(tempData.time).diff(constructionInformation.created, 'day')
				}

			},
			setAddButtonList() {
				let tempButton = []
				if (this.acceptanceWork) {
					tempButton.push({
						name: '撤销验收',
						active: true,
						disable: this.cancelStatus,
					})
				} else {
					tempButton.push({
						name: '提交验收',
						active: true,
					})
				}
				if (this.startWork) {
					tempButton.push({
						borderActive: true,
						name: '服务日志'
					})
				} else {
					tempButton.push({
						disable: false,
						name: '去开工'
					})
				}
				return tempButton
			},
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
					// 刷新按钮禁用
					this.$refs.sopOperation && this.$refs.sopOperation.getDetails()
					this.$nextTick(() => {
						// 刷新按钮显示
						this.$refs.sopOperation && this.$refs.sopOperation.getButtonList()
					})
				})
			},
			getButton(type) {
				this.goStartWorker(type)
			},
			setParameter() {
				this.projectId = this.projectInfo.projectId
			},
			getRectificationStatus(item) {
				return item === 0 ? '待整改' : '已整改'
			},
			goRectification(id) {
				uni.navigateTo({
					url: `/pages/construction/rectification/rectificationList`
				});
			},
			confirm() {
				this.modalShow = !this.modalShow
				this.$httpApi.revokeWork({
					itemType: 3,
					nodeId: Number(this.nodeInfo.nodeId),
					projectId: Number(this.projectId)
				}).then(res => {
					this.$util.toast('操作成功!')
					this.getWorkerList()
				})
			},
			goStartWorker(type) {
				if (['去开工', '完工'].includes(type)) {
					if (this.startWork) {
						return
					}
					this.toPage(`/pages/construction/constructionCompletion?type=${type}`)
				} else {
					if (this.startWork && type == '服务日志') {
						this.toPage('/pages/construction/constructionLog')
						return
					}
					if (this.acceptanceWork) {
						if (type == '撤销验收') {
							this.modalShow = !this.modalShow
						}
						return
					}
					this.toPage('/pages/construction/acceptance/acceptanceList')
				}
			},
			goConstructionPlan() {
				uni.navigateTo({
					url: '/pages/construction/constructionPlan'
				})
			},
			viewAcceptanceDetails(item) { // 查看验收情况
				this.toPage(`/pages/construction/acceptance/acceptanceDetails?detialId=${item.id}`)
			},
			goSendOrder() {
				uni.navigateTo({
					url: ''
				})
			},
			getProcessList() {
				if (!this.projectId) {
					console.error('项目id不能为空')
					return
				}
				if (!this.userPersonInfo.skillId) {
					console.error('岗位id不能为空')
					return
				}
				if (!this.nodeInfo.nodeId) {
					console.error('nodeId不能为空')
					return
				}
				this.$httpApi.getProcessList({
					projectId: this.projectId,
					skillId: this.userPersonInfo.skillId,
					nodeId: this.nodeInfo.nodeId,
				}).then(res => {
					if (res) {
						res.map(item => {
							item.details.map(el => {
								if (el.status == 2) {
									this.startWork = true
								}
							})
						})
						this.processList = res
						this.$nextTick(() => {
							this.$refs.sopOperation && this.$refs.sopOperation.getButtonList()
						})
					}
				})
			},
			getWorkerList() {
				this.$http.get('order/sopConstruction/completeWorkAndAcceptList', {
					nodeId: this.nodeInfo.nodeId
				}).then(res => {
					var applyPersonId = [];

					if (res.acceptanceList && res.acceptanceList.length > 0) {
						res.acceptanceList.map(item => {
							if (item.statusFlag == 0) {
								applyPersonId.push(item.applyPersonId)
							} else {
								applyPersonId.push(item.acceptanceCreatePersonId)
							}
						})
					} else {
						this.acceptanceWork = false
					}

					res.completeWorkList.map(item => {
						applyPersonId.push(item.personId)
					})


					let tempApplyPersonId = [...new Set(applyPersonId)]
					if (tempApplyPersonId.length > 0) {
						this.$getPersonIdUser(tempApplyPersonId, (el) => {
							if (res.acceptanceList) {
								res.acceptanceList.map((item, index) => {
									res.acceptanceList[index].personInfo = el[index]
								})
								this.acceptanceList = res.acceptanceList
							}
							res.completeWorkList.map((item, index) => {
								el.map(ev => {
									if (Number(item.personId) === Number(ev.personId)) {
										item.name = ev.name
										item.avatar = ev.avatar
										item.skillName = ev.skillName
									}
								})
							})
							this.completeWorkList = res.completeWorkList
							this.startWorkList = res.completeWorkList.filter(item => item.itemType == 2)
							this.setAcceptanceListInitialize()

							this.judgeIsDisable(res.completeWorkList)
						})
					}
				})
			},
			setTime(time) {
				let finishTime = this.completeWorkList[0] && moment(this.completeWorkList[0].created)
				let remainingDays = finishTime.diff(time, 'day')
				if (remainingDays < 0) {
					return '超时' + Math.abs(remainingDays) + '天'
				} else if (remainingDays === 0) {
					return '当天完成'
				} else {
					return remainingDays + '天'
				}
			},
			setAcceptanceListInitialize() { // 验收信息初始化
				// 1.添加完工信息
				this.acceptanceInformation = []
				this.completeWorkList.map(item => {
					if (item.itemType === 3) {
						this.acceptanceInformation.push({
							status: '',
							time: item.executeDateTime,
							statusTypeName: '完工信息',
							// workTimeLength: this.setTime(item.created),
							...item
						})
					}
				})

				// 2.添加验收结果
				this.acceptanceList.map(item => {
					if (Number(item.statusFlag)) { // statusFlag	验收状态   0、待验收 1、通过 2、未通过
						this.acceptanceInformation.push({
							status: '',
							time: item.acceptanceCreateTime,
							statusTypeName: '验收结果',
							...item
						})
					}
				})

				// 3.添加整改信息
				this.acceptanceList.forEach(el => {
					if (el.statusFlag == 2) {
						this.acceptanceInformation.push({
							status: '',
							time: el.acceptanceCreateTime,
							statusTypeName: '整改信息',
							...this.rectificationDetails,
							...el
						})
					}
				})
			},
			setRectification() {
				if(this.userPersonInfo.personId && this.projectId){
					this.$httpApi.getAcceptanceStatus({
						personId: this.userPersonInfo.personId,
						projectId: this.projectId,
					}).then(res => {
						if (res) {
							this.rectificationDetails = res
						}
					})
				}
			},
			judgeIsDisable(list) {
				list.map(item => {
					if (Number(item.itemType) === 2) {
						this.startWork = true
					}
					// 1.提交验收之后不能再次提交验收
					if (Number(item.itemType) === 3) {
						this.acceptanceWork = true
						this.startWork = true
					}
				})
				// 2.如果节点审核失败，可以再次提交验收
				if (this.nodeInfo.status == 6) {
					this.acceptanceWork = false
				}
				// 提交了验收，但进行了撤销验收操作
				if (this.acceptanceWork && this.acceptanceList.length == 0) {
					this.acceptanceWork = false
				} else {
					// 1.如果已经验收通过，则禁用撤销验收 2。如果验收不通过，则只能进行整改
					this.acceptanceList.forEach(el => {
						if (el.statusFlag == 1) {
							this.cancelStatus = true
						} else if (el.statusFlag == 2) {
							this.cancelStatus = true
						}
					})
				}
				//如果施工节点配置了审查人，则不允许撤销 5待审查  
				if (this.nodeInfo.status == 5) {
					this.cancelStatus = true
				}
				this.$nextTick(() => {
					this.$refs.sopOperation && this.$refs.sopOperation.getButtonList()
				})
			}

		}
	}
</script>

<style lang="scss" scoped>
	.label {
		color: #999999;
		font-size: $middleFontSize;
		text-align: center;
	}

	.process-item-page {
		padding-bottom: 140rpx;
	}

	.bottom-buttom {
		display: flex;
		justify-content: center;
		position: fixed;
		bottom: 0rpx;
		width: 100%;
		padding: 20rpx 0rpx;
		background-color: #FFF;

		.start-worker {
			background: #FFFFFF;
			border: 2rpx solid $themeColor;
			border-radius: 10rpx;
			font-weight: bold;
			font-size: 28rpx;
			line-height: 90rpx;
			text-align: center;
			color: $themeColor;
			width: 268rpx;
			margin-right: 10rpx;
		}

		.start-display-button {
			opacity: 0.5;
		}

		.confirm-display-button {
			opacity: 0.5;
		}

		.confirm-accept {
			background: #FFFFFF;
			background: $themeColor;
			border-radius: 10rpx;
			width: 268rpx;
			font-size: 28rpx;
			line-height: 90rpx;
			text-align: center;
			color: #FFFFFF;
			margin-left: 10rpx;
		}
	}

	.construction-all {
		margin: 10rpx 20rpx;
		padding: 32rpx;
		background: #FFFFFF;
		border-radius: 8rpx;

		.construction-info {}
	}

	.process-list {
		background: #FFFFFF;
		border-radius: 16rpx;
		margin: 10rpx 20rpx;
		padding: 30rpx;
		display: flex;

		// justify-content: space-between;
		.list-image {
			border-radius: 10rpx;
			width: 122rpx;
			height: 122rpx;
		}

		.list-right {
			margin-left: 40rpx;

			.right-status {
				background: rgba(#FAD0A0, 0.3);
				border-radius: 0 20rpx 20rpx 20rpx;
				font-weight: 500;
				font-size: 24rpx;
				line-height: 40rpx;
				color: #FF5D35;
				width: 100rpx;
				text-align: center;

			}

			.right-image {
				width: 16rpx;
				height: 16rpx;
				transform: rotate(-90deg);
				margin-top: 66rpx;
				float: right;
			}
		}

		.list-text {
			margin-left: 20rpx;
			flex: 1;

			.text-title {
				font-weight: bold;
				font-size: 30rpx;
				color: #303133;
			}

			.text-content {
				margin-top: 10rpx;
				font-weight: normal;
				font-size: 26rpx;
				line-height: 36rpx;
				color: #909199;

			}

		}
	}

	.accept-info {
		background: #FFFFFF;
		border-radius: 10rpx;
		margin: 20rpx;
		padding: 0 40rpx 0rpx 20rpx;

		.accept-content {
			padding-left: 34rpx;
			border-left: 2rpx dashed #EEEEEE;
			margin-left: 16rpx;
			padding-bottom: 40rpx;

			.content-title {
				display: flex;
				height: 70rpx;
				align-items: center;

				.content-text {
					font-weight: normal;
					font-size: 26rpx;
					color: #606166;
				}

				.content-text2 {
					font-weight: bold;
					font-size: 26rpx;
					color: #303133;
					flex: 1;
					display: flex;

					.status-dot1 {
						background: #EFF6FF;
						border-radius: 50rpx;
						line-height: 40rpx;
						font-weight: 500;
						font-size: 20rpx;
						color: $themeColor;
						padding-left: 10rpx;
						padding-right: 10rpx;
						margin-right: 20rpx;

					}

					.status-dot2 {
						background: #D8FFF0;
						border-radius: 50rpx;
						line-height: 40rpx;
						font-weight: 500;
						font-size: 20rpx;
						color: #3BC548;
						padding-left: 10rpx;
						padding-right: 10rpx;
						margin-right: 20rpx;

					}

					.status-dot3 {
						background: #FFF2E9;
						border-radius: 50rpx;
						line-height: 40rpx;
						font-weight: 500;
						font-size: 20rpx;
						color: #FF5D35;
						padding-left: 10rpx;
						padding-right: 10rpx;
						margin-right: 20rpx;

					}
				}

				.content-right {
					align-items: center;
					display: flex;
					height: 40rpx;

					.right-text {
						font-weight: normal;
						font-size: 26rpx;
						color: #FF5D35;

					}

					.right-text2 {
						font-weight: normal;
						font-size: 26rpx;
						color: #002FA5;

					}

					.right-image {
						width: 16rpx;
						height: 16rpx;
						transform: rotate(-90deg);
						-webkit-transform: rotate(-90deg);
						margin-left: 20rpx;

					}
				}

				.content-data {
					font-weight: normal;
					font-size: 24rpx;
					color: #002FA5;
					margin-left: 20rpx;
				}

			}

			.content-description {
				padding: 36rpx 38rpx 42rpx 38rpx;
				box-shadow: 0px 0px 8px rgba(158, 156, 156, 0.25);
				border-radius: $miniBorderRadius;

				.top {
					.desc {
						color: $viceFontColor;
						font-size: $smallFontSize;
						margin-right: 18rpx;
					}

					.desc-contain {
						color: $seconFontColor;
						font-size: $smiddleFontSize;
					}
				}

				.content-image {
					margin-top: 16rpx;
				}

				.content-audio {
					.speak_btn {
						margin-top: 0rpx;
					}
				}
			}
		}

		.accept-item-all {
			padding-top: 40rpx;

			.item-all {
				&:last-child {
					.accept-content {
						border-left: 0rpx;
					}
				}
			}
		}

		.accept-item {
			display: flex;
			align-items: center;

			.accept-item-contain {
				display: flex;
			}

			.item-name {
				font-weight: normal;
				font-size: 24rpx;
				color: #606166;
				margin-left: 10rpx;
			}

			.item-date {
				font-weight: normal;
				font-size: 24rpx;
				color: #909199;
				margin-left: 20rpx;
			}

			.item-image {
				width: 32rpx;
				height: 32rpx;
				border-radius: 32rpx;
			}
		}

		.accept-title {
			display: flex;
			align-items: center;
			height: 110rpx;
			border-bottom: 2rpx solid #F6F6F6;

			.title-text {
				font-weight: bold;
				font-size: 28rpx;
				color: #303133;
				margin-left: 20rpx;
			}

			.title-date {
				font-weight: normal;
				font-size: 24rpx;
				color: #002FA5;
				margin-left: 20rpx;
			}

			.title-status {
				font-weight: normal;
				font-size: 24rpx;
				flex: 1;
				text-align: right;
			}

			.status-error {
				color: $errorFontColor;
			}

			.status-success {
				color: $successNewFontColor;
			}


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
</style>
