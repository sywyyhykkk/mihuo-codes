<template>
	<view class="disclose-pending">
		<!-- <public-module></public-module> -->
		<view class="top-nav-bar">
			<view class="nav-view">
				<image class="arrow_back" src="/static/icon/arrow_back.png" mode="" @click="goBack" />
				<message-tabs :items="items" :current="current" @clickItem="onClickItem" />
			</view>
		</view>

		<view class="disclose-pending_list" v-if="current == 0">
			<!-- <view class="top-titp_contain" v-if="templateIds.length > 0">
				<view class="top-titp">还不确定选项？从客户那里确定答案</view>
			</view> -->
			<view class="list-pending" v-if="templateIds.length > 0">
				<!-- 卷子 -->
				<view class="item-pending" v-for="(item1,index1) in todoDiscloseGroup" :key="index1">
					<view class="item-top" v-if="item1.questionnaire">
						<text class="left">{{item1.questionnaire.surveyName}}</text>
						<view class="right" @click="getShow(index1)">
							<text>{{item1.questionnaire.show ? '收起':'展开'}}</text>
							<image :class="[item1.questionnaire.show  ? 'public-block':'public-none']"
								src="/static/images/bottom-icon.png" class="public-arrow"></image>
						</view>
					</view>
					<view class="children" v-if="item1.questionnaire && item1.questionnaire.show">
						<!-- 段落 -->
						<view class="item-children" v-for="(item2,index2) in item1.questionnaire.surveyTemplatePartDTOList"
							:key="index2">
							<view class="item-name">{{item2.partName}}</view>
							<!-- 题目 -->
							<view class="item-title" v-for="(item3,index3) in item2.surveyTemplateQuesDTOList"
								:key="index3">
								<view class="top" @click="getAnswer()">
									<text class="item-title_name">{{index3+1}}.{{item3.quesName}}</text>
									<view class="pending" v-if="item3.pendingCount" @click="getPending(item3)">
										<text>已催办{{item3.pendingCount}}次</text>
										<image src="/static/images/bottom-icon.png" class="public-arrow public-none">
										</image>
									</view>
								</view>

								<view class="reason">原因:{{item3.reason}}</view>
								<view class="time">{{item3.time}}</view>
								<!-- 答题 -->
								<view v-if="$permissionRouting.getInstance().isShow()" class="title-button_contain">
									<view class="item-button" v-for="(ev2,num2) in operationButton" :key="num2"
										@click="getButton(ev2,item3)">
										{{ev2.name}}
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<mh-empty v-if="templateIds.length == 0" title="这里空荡荡哒～" />
		</view>
		<view class="pending-ist" v-else>
			<view v-if="list.length > 0" class="list-contain">
				<view v-for="item in list" :key="item.id" class="notice-content" @click="getTodoItem(item)">
					<view v-if="Number(item.detailStatus) == 0" class="node"></view>
					<view><text class="title">{{ item.skillName }}({{item.userName}}){{ item.title }}</text>
					</view>
					<!-- <view class="date-content">
						类型
					</view> -->
					<view style="margin-top: 14rpx;"><text class="content">{{item.created}}</text></view>
				</view>
			</view>
			<mh-empty v-if="list.length == 0" icon="/static/images/no_recommend.png" title="这里空荡荡哒～" />
		</view>

		<!-- 答案弹框 -->
		<answer-pop-up v-model="answerShow" :title="info.quesName" @close="answerShow = false" :info="info"
			@submit="answerSubmit">
		</answer-pop-up>

		<!-- 催办记录弹窗 -->
		<log-pop-up v-model="logShowPopup" type="待确认" :title="title" :logList="logList" @close="logShowPopup = false">
		</log-pop-up>

	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	import {
		deepClone
	} from '@/plugins/utils.js'
	export default {
		data() {
			return {
				option: {},
				showPopup: false,
				answerShow: false,
				logShowPopup: false,
				logList: [],
				info: {},
				title: '',
				current: 0,
				operationButton: [{
						name: '答题',
					},
					{
						name: '催办',
					}
				],
				templateList: [],
				templateListData: [],
				buttonList: [{
						name: '答题',
						status: false
					},
					{
						name: '催办',
						status: true
					}
				],
				templateIds: [],
				questionnaireList: [],
				list: [],
				nodeListData: [],
				todoDiscloseList: [],
				todoDiscloseGroup: [],
				form: {
					discloseDate: '',
					discloseAddress: '',
					houseArea: '',
					remark: '',
					ccPersons: [],
					answer: {},
					discloseLatitude: '',
					discloseLongitude: '',
					projectId: '',
					nodeId: '',
					discloseTitle: '',
					attachments: []
				},
			}
		},
		computed: {
			...mapState(['nodeInfo', 'projectInfo', 'orderInfo', 'userPersonInfo', 'userPersonId', 'userRole']),
			items() {
				let unread = 0,
					notice = 0;
				this.todoDiscloseList.forEach(item => {
					unread += 1
				})
				this.list.forEach(item => {
					if (item.detailStatus == 0) {
						notice += 1
					}
				})
				return [`待确认(${unread})`, `待处理(${notice})`];
			}
		},
		mounted() {

		},
		onShow() {
			this.getTodoDiscloseList()
			this.setAddress()
			this.getToDo()
			this.getGroupTask()
		},
		onLoad(option) {
			this.option = option
		},
		methods: {
			onClickItem(e) {
				this.current = e.currentIndex
			},
			getPending(item) {
				this.title = item.quesName
				this.logShowPopup = true
				this.$httpApi.todoDisclosePendingLogs({
					todoId: item.todoId
				}).then(res => {
					if (res) {
						this.logList = res
					}
				})
			},
			getShow(index) {
				this.todoDiscloseGroup[index].questionnaire.show = !this.todoDiscloseGroup[index].questionnaire.show
			},
			getAnswer() {

				this.showPopup = true
			},
			getTodoDiscloseList() {
				if (this.option.disclosePendingShow == 'false') {
					return
				}
				this.$httpApi.todoDiscloseList({
					projectId: this.projectInfo.projectId
				}).then(res => {
					if (res) {
						// 根据节点分组，确认生成几份卷子
						this.todoDiscloseGroup = this.group(res, 'nodeId')
						this.todoDiscloseList = res
						this.templateIds = []
						if (res.length > 0) {
							this.todoDiscloseGroup.forEach(el => {
								this.templateIds.push(el.surveyId)
							})
							// this.templateIds = [...new Set(this.templateIds)]
							this.getTemplate()
						}
					}
				})
			},
			getTemplate() {
				this.$httpApi.getTemplateDetailsByIds(this.templateIds).then(res => {
					if (res) {
						this.templateListData = JSON.parse(JSON.stringify(res))
						this.todoDiscloseGroup.forEach(item1 => {
							res.forEach((ev1, index) => {
								if (index == 0) {
									ev1['show'] = true
								} else {
									ev1['show'] = true
								}
								if (item1.surveyId == ev1.id) {
									item1['questionnaire'] = ev1
								}
							})
						})

						this.todoDiscloseGroup.forEach(item1 => {
							if (item1.list) {
								item1.list.forEach(item2 => {
									if (item1.questionnaire) {
										item1.questionnaire.surveyTemplatePartDTOList.forEach(
											ev2 => {
												ev2.surveyTemplateQuesDTOList.forEach((ev3,
													index) => {
													// 问卷id相同
													if (item1.surveyId == item1
														.questionnaire.id) {
														// 过滤出相同题目
														if (item2.questionId == ev3
															.id) {
															ev3['time'] = item2
																.applyTime
															ev3['reason'] = item2
																.reason
															ev3['pendingCount'] = item2
																.pendingCount
															ev3['todoId'] = item2.id
															ev3['discloseId'] = item2
																.discloseId // 交底id
															ev3['surveyId'] = item1
																.questionnaire
																.id // 问卷id
															ev3['nodeId'] = item2
																.nodeId // 节点id
														}
													}
												})
											})
										item1.questionnaire = deepClone(item1.questionnaire)
									}
								})
							}
						})
						// // 获取未确认的题目	
						this.todoDiscloseGroup.forEach(ev1 => {
							if (ev1.questionnaire) {
								ev1.questionnaire.surveyTemplatePartDTOList.forEach(ev2 => {
									ev2.surveyTemplateQuesDTOList = ev2.surveyTemplateQuesDTOList
										.filter(ev3 => ev3.todoId)
								})
							}
						})
						this.todoDiscloseGroup.forEach(ev1 => {
							if (ev1.questionnaire) {
								ev1.questionnaire.surveyTemplatePartDTOList = ev1.questionnaire
									.surveyTemplatePartDTOList.filter(ev2 => ev2
										.surveyTemplateQuesDTOList.length > 0)
							}
						})
						this.todoDiscloseGroup = deepClone(this.todoDiscloseGroup)
					}
				})
			},

			getButton(ev2, item3) {
				if (ev2.name == '答题') {
					this.info = item3
					this.answerShow = true
					// this.answerTitle = ''
				} else {
					this.$httpApi.todoDisclosePending({
						personId: this.userPersonId,
						todoIds: [item3.todoId],
					}).then(res => {
						if (res) {
							this.$util.toast(`催办成功`);
							this.getTodoDiscloseList()
						}
					})
				}
			},
			setAddress() {
				this.form.projectId = this.projectInfo.projectId
				// this.form.nodeId = this.nodeInfo.nodeId
				this.form.discloseAddress = this.projectInfo.latAddress
				this.form.discloseLongitude = this.projectInfo.longitude
				this.form.discloseLatitude = this.projectInfo.latitude
				this.form.discloseTitle = this.projectInfo.latAddress + this.nodeInfo.nodeName
				this.setExecPerson()
			},
			setExecPerson() {
				this.$httpApi.getPersonSettingInfo({
					userId: uni.getStorageSync('userData').sysUser && uni.getStorageSync('userData').sysUser.userId
				}).then(res => {
					if (res) {
						// 审核状态（0已提交、1未通过、2已通过）
						let tempPersonageList = res.personageList.filter(item => item.auditStatus == 2)
						if (tempPersonageList.length > 0) {
							let tempPerson = tempPersonageList.find(item => item.skillId == this.orderInfo.skillId)
							this.form.execPersonName = res.realName
							if(tempPerson){
								this.form.execPersonId = tempPerson.personId
								this.form.execSkillId = tempPerson.skillId
								this.form.execSkillName = tempPerson.skillName
							}
						}
					}
				})
			},

			answerSubmit(answer) {
				// 如果有交底id
				if (this.info.discloseId) {
					// 查询问卷答案
					this.$httpApi.discloseDetails({
						id: this.info.discloseId
					}).then(res => {
						if (res) {
							this.form.discloseDate = res.discloseDate
							this.form.nodeId = this.info.nodeId
							if (res.answer && this.$isJSON(res.answer.answerContent)) {
								this.questionnaireList = JSON.parse(res.answer.answerContent)
								this.questionnaireList.forEach((item, index) => {
									// 段落id
									if (item.id == this.info.partId) {
										item.surveyTemplateQuesDTOList.forEach(ev => {
											// 问题id
											if (ev.id == this.info.id) {
												ev['answer'] = answer
											}
										})
									}
								})
								this.form.answer = {
									answerContent: JSON.stringify(this.questionnaireList),
									// answerContent: this.questionnaireList,
									surveyName: res.answer.surveyName,
									surveyTemplateId: res.answer.surveyTemplateId,
									id: res.answer.surveyTemplateId
								}
								this.getHandle()
							}
						}
					})

				} else {
					this.$httpApi.todoDiscloseDelete({
						id: this.info.todoId
					}).then(res => {
						this.getTodoDiscloseList()
					})
				}
			},
			getHandle() {
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				this.$http.post(`order/order_disclose/todo/disclose/handle?todoId=${this.info.todoId}`, this.form)
					.then(
						res => {
							uni.hideLoading();
							if (res) {
								this.$util.toast(`操作成功`);
								this.getTodoDiscloseList()
							}
						})
			},
			getGroupTask() {
				if (!this.orderInfo.orderId) {
					console.error('订单id不能为空')
					return
				}
				this.$httpApi.selfGroupTask({
					orderId: this.orderInfo.orderId
				}).then((res) => {
					this.nodeListData = []
					if (res.nodes) {
						res.nodes.forEach(el => {
							this.nodeListData.push(el)
						})
					}

				})
			},
			getToDo() {
				this.$http.get(`order/bizpending/myPending`, {
					projectId: this.projectInfo.projectId,
					personId: this.userPersonInfo.personId,
					size: 99,
				}).then((res) => {
					if (res) {
						this.list = res.records
					}
				})
			},
			getTodoItem(el) {
				if (!el) {
					return
				}
				if (el.businessCode) {
					let parameter = el.businessCode.split('_')
					if (parameter.length > 0) {
						let typeName = parameter[0]
						let businessId = parameter[1]
						let detailsId = parameter[1]
						if (['disclose', 'discloseNotify', 'check', 'nodeReview', 'custom', 'nodeReviewFail'].includes(
								typeName)) {
							if (typeName == 'custom') {
								this.toPage(
									`/pages/construction/assignForm?toDoType=待办事项&detailId=${el.id}&status=${el.status}&pendingDetailId=${el.pendingDetailId}`
								)
								return
							}
							if (!businessId) {
								return
							}
							if (['nodeReview', 'disclose', 'nodeReviewFail', 'check'].includes(typeName)) {
								businessId = el.businessParams !== '' && JSON.parse(el.businessParams).nodeId || 0
							}
							this.$httpApi.sopNodeTemplate({
								nodeId: businessId
							}).then(res => {
								if (res) {
									this.$store.commit('setNodeInfo', res)
									switch (typeName) {
										case 'disclose':
											this.toPage(
												`/pages/construction/disclosure/viewDisclosureText?toDoType=待办事项&bizPendingDetailId=${el.pendingDetailId}&detailsId=${detailsId}`
											)
											break
										case 'discloseNotify':
											this.toPage(
												`/pages/construction/disclosure/viewDisclosureNotice?toDoType=待办事项&bizPendingDetailId=${el.pendingDetailId}`
											)
											break
										case 'check':
											this.$store.commit('setExamineType', '审查方')
											this.$store.commit('setTodo', {
												toDoType: '待办事项',
												bizPendingDetailId: el.pendingDetailId,
											})
											this.toPage(`/pages/construction/middleExternalAccept`)
											break
										case 'nodeReview':
											// 因为收到的待处理项需要跳转到对应的sop节点  见tfs 27794
											this.$store.commit('setExamineType', '审查方')
											let tempNode = this.nodeListData.find(item => item.nodeId ==
												businessId)
											if (tempNode) {
												this.handleAssigenment(tempNode, '审查方')
											} else {
												this.toPage(`/pages/construction/customNodes/customNodesPage`)
											}
											break
										case 'nodeReviewFail':
											// 因为收到的待处理项需要跳转到对应的sop节点  见tfs 27794
											this.$store.commit('setExamineType', '审查方')
											this.$store.commit('setBusinessCode', el.businessCode)
											let tempNodeError = this.nodeListData.find(item => item.nodeId ==
												businessId)
											if (tempNodeError) {
												this.handleAssigenment(tempNodeError, '审查方')
											} else {
												this.toPage(`/pages/construction/customNodes/customNodesPage`)
											}
											break
									}
								}
							})
						} else {
							switch (typeName) {
								case 'apply':
									uni.setStorageSync('typeName', '申请')
									this.toPage(
										`/pages/construction/complaint/complaintDetails?id=${businessId}&pageType=发送给我的&toDoType=待办事项&bizPendingDetailId=${el.pendingDetailId}`
									)
									break
								case 'appeal':
									uni.setStorageSync('typeName', '申述')
									this.toPage(
										`/pages/construction/complaint/complaintDetails?id=${businessId}&pageType=发送给我的&toDoType=待办事项&bizPendingDetailId=${el.pendingDetailId}`
									)
									break
								case 'acceptanceCorrection':
									this.toPage(
										`/pages/construction/rectification/rectificationDetails?id=${businessId}&toDoType=待办事项&bizPendingDetailId=${el.pendingDetailId}`
									)
									break
								case 'inspectCorrection':
									this.toPage(
										`/pages/construction/rectification/rectificationDetails?id=${businessId}&toDoType=待办事项&bizPendingDetailId=${el.pendingDetailId}`
									)
									break
								case 'alteration':
									this.toPage(
										`/pages/construction/changeRecord/changeDetails?id=${detailsId}`
									)
									break
							}

						}
					}
				}
			},
			group(result, itemType) {                let map = {}                let dest = []                let resultList = []                result.forEach(item => {                    if (!map[item[itemType]]) {                        dest.push({                            type: item[itemType],                            list: [item],                            surveyId: item.surveyId                        })                        map[item[itemType]] = item                    } else {                        dest.forEach(el => {                            if (el.type == item[itemType]) {                                el.list.push(item)                            }                        })                    }                })                resultList = [...dest]                return resultList            },			handleAssigenment(item, type) {
				this.$store.commit('setNodeInfo', item)
				// 距离该节点完成时间还剩多少天
				this.$remainingDays()
				// 从sop节点进入的默认为发起方
				if (!type) {
					this.$store.commit('setExamineType', '发起方')
				}
				switch (item.businessType) {
					case '1001':
						this.toPage('/pages/construction/selectMaterial/selectMaterialPage')
						break
					case '1002': // 指派工人或发布抢单
						this.toPage(`/pages/construction/middleOrder?nodeId=${item.nodeId}`)
						break
					case '1003':
						this.toPage(`/pages/construction/budget/budgetPage`)
						break
					case '1004': //施工
						this.toPage(`/pages/construction/middleConstruction`)
						break
					case '1005':
						this.toPage(`/pages/construction/middleExternalAccept`)
						break
					case '1006':
						this.toPage(
							`/pages/construction/drawings/uploadDrawings?nodeId=${item.nodeId}`
						)
						break
					case '1009':
						this.toPage('/pages/construction/evaluation/evaluationPage')
						break
					case '1010':
						this.toPage('/pages/construction/disclosure/disclosurePage')
						break
					case '1011':
						this.toPage('/pages/construction/measuringRoom/measuringRoomPage')
						break
					case '1012':
						this.toPage('/pages/construction/collection/collectionPage')
						break
					case '1015':
						// return
						uni.setStorageSync('clientBilling', 'sop开单')
						this.toPage('/pages/construction/clientBilling/clientBilling')
						break
					case '1000': // 无
						// 从sop节点进入的默认为发起方
						this.toPage(`/pages/construction/customNodes/customNodesPage`)
						break
				}
			},
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	.top-nav-bar {
		width: 100%;
		background: #FFFFFF;
		position: fixed;
		top: 0;
		z-index: 20;

		.nav-view {
			position: relative;

			.arrow_back {
				position: absolute;
				top: calc(14rpx + var(--status-bar-height));
				left: 0;
				width: 44rpx;
				height: 44rpx;
				z-index: 999;
				margin-left: 24rpx;
			}

			.message-tab {
				font-weight: bold;
				color: $fontColor33;
				text-align: center;
				padding: calc(10rpx + var(--status-bar-height)) 0 30rpx 0;
			}
		}
	}

	.nav-bar-title {
		font-weight: bold;
	}

	.nav-bar-right {
		font-size: $middleFontSize;
		color: $viceFontColor;
		padding-right: 36rpx;
	}

	.public-arrow {
		margin-left: 10rpx;
		width: 16rpx;
		height: 16rpx;
		transform: rotate(90deg)
	}


	.public-none {
		transition: all .2s;
		transform: rotate(0deg);
	}

	.public-block {
		transition: all .2s;
		transform: rotate(90deg);
	}

	.disclose-pending_list {
		margin-top: calc(88rpx + var(--status-bar-height));
	}

	.disclose-pending {
		padding-bottom: 240rpx;
		padding-top: 12rpx;


		.list-pending {
			border-radius: 10rpx;
			background: #FFFFFF;
		}

		.item-pending {
			padding: 32rpx 0rpx;
			border-bottom: 2rpx solid #F9F9F9;
			margin: 0 36rpx;

			.item-top {
				display: flex;
				justify-content: space-between;
				line-height: 40rpx;


				.left {
					color: #303133;
					font-size: 28rpx;
					font-weight: bold;
				}

				.right {
					display: flex;
					align-items: center;

					text {
						color: #909199;
						font-size: 28rpx;
					}
				}
			}

			.children {
				display: flex;
				margin-bottom: 20rpx;
				margin-top: 28rpx;
				flex-direction: column;

				.item-children {
					background: linear-gradient(270deg, rgba(243, 246, 255, 0.50) 5%, rgba(244, 247, 255, 0.30) 97%);
					border-radius: 16rpx;
					padding: 28rpx 32rpx;

					&:last-child {
						padding: 28rpx 32rpx 0rpx 32rpx;
					}

					.item-name {
						color: #303133;
						font-size: 30rpx;
						line-height: 36rpx;
						margin-bottom: 8rpx;
					}

					.item-title {
						padding-bottom: 36rpx;
						border-bottom: 10rpx solid rgba(207, 216, 238, 0.2);
						margin-bottom: 34rpx;

						&:last-child {
							margin-bottom: 0rpx;
							border-bottom: 0rpx;
						}

						.top {
							display: flex;
							justify-content: space-between;

							.item-title_name {
								color: #606166;
								font-size: 26rpx;
								padding-right: 10rpx;
								line-height: 36rpx;
								margin-bottom: 10rpx;
								max-width: 560rpx;

							}

							.pending {
								display: flex;
								align-items: center;
								min-width: 150rpx;
								justify-content: end;

								text {
									color: #002FA5;
									font-size: 24rpx;
								}
							}
						}

						.reason {
							color: #FF5D35;
							font-size: 26rpx;
							line-height: 36rpx;
							margin-bottom: 6rpx;
						}

						.time {
							color: #606166;
							font-size: 26rpx;
							line-height: 36rpx;
							margin-bottom: 6rpx;
						}

						.title-button_contain {
							display: flex;
							margin-top: 20rpx;

							.item-button {
								display: flex;
								justify-content: center;
								align-items: center;
								flex: 1;
								height: 66rpx;
								border-radius: 10rpx;
								border: 2rpx solid #002FA5;
								color: #002FA5;
								background-color: #fff;
								margin-right: 14rpx;
								font-size: 26rpx;

								&:last-child {
									margin-right: 0rpx;
								}
							}
						}
					}


				}

			}
		}

		.top-titp_contain {
			display: flex;
			justify-content: center;
			flex-direction: column;
			width: 100%;
			padding-left: 26rpx;
			padding-right: 26rpx;
			position: -webkit-sticky;
			position: sticky;
			width: 100%;
			background-color: #f5f5f5;
			top: calc(88rpx + var(--status-bar-height));
			// top: calc(var(--status-bar-height));
			// top: 0rpx;
			z-index: 99;

			.top-titp {
				color: #909199;
				font-size: 26rpx;
				height: 90rpx;
				text-align: center;
				line-height: 90rpx;
			}
		}

		.right-icon {
			width: 48rpx;
			height: 48rpx;
		}

		.criteria-contian {
			height: 100%;
			background-color: #FFF;

			.tittle {
				text-align: center;
				padding: 36rpx 0rpx;
				margin: 0 20rpx;
				border-bottom: 2rpx solid #EEEEEE;
				color: $seconFontColor;
			}

			.list-contain {
				padding: 0rpx 40rpx;
				height: calc(100% - 116rpx - 88rpx);
				padding-bottom: 20rpx;
			}

			.scroll-Y {
				height: 100%;
			}

			.sop-type_list {
				padding: 20rpx 0rpx;
			}


			.item-button:nth-of-type(1) {
				background-color: #fff;
				color: #002FA5;
				border: 2rpx solid #002FA5;
			}
		}
	}

	.pending-ist {
		margin-top: calc(88rpx + var(--status-bar-height));

		.notice-content {
			background: #fff;
			border-radius: 16rpx;
			margin: 20rpx;
			padding: 36rpx;
			position: relative;

			.date-content {
				border-bottom: 2rpx solid $divider;
				padding-bottom: 20rpx;
				margin-top: 3rpx;
				line-height: 100%;
				color: $viceFontColor;
				font-size: 24rpx;
			}

			.node {
				position: absolute;
				top: 49%;
				left: 10rpx;
				width: 10rpx;
				height: 10rpx;
				border-radius: 10rpx;
				background-color: $linghtWarningColor;
			}

			.title {
				color: $seconFontColor;
				font-size: 30rpx;
				flex: 1;
			}

			.content {
				color: $viceFontColor;
				font-size: 26rpx;
			}

			.delete {
				position: absolute;
				top: 30rpx;
				right: 20rpx;
				width: 60rpx;
				height: 60rpx;
			}
		}
	}
</style>
