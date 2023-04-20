<template>
	<view class="disclosure-confirmation">

		<view v-if="todoDiscloseList.length > 0">
			<!-- 问卷tab -->
			<view class="u-tabs-list">
				<u-tabs class="u-tabs-contain" height="98" font-size="28" inactive-color="#909199"
					active-color="#002FA5" :active-item-style="activeItemStyle"
					:list="details.surveyTemplatePartDTOList || []" :is-scroll="true" :current="tabCurrent"
					@change="change">
				</u-tabs>
			</view>

			<view class="list-pending">
				<!-- 段落 -->
				<view class="item-pending-contain">
					<view class="item-pending" v-for="(item,index) in setQuestionnaireList" :key="index">
						<!-- 题目 -->
						<view class="item-children">
							<view class="top" @click="getAnswer(item)">
								<view class="top-left">
									<view class="item-name">{{index+1}}.{{item.quesName}}</view>
									<view class="reason">原因:{{item.reason}}</view>
								</view>
								<image src="@/static/icon/arrow.png" class="right-icon">
								</image>
							</view>
							<view class="time">{{item.time}}</view>
						</view>
					</view>
				</view>

			</view>
		</view>
		<mh-empty v-else title="这里空荡荡哒～" />


		<!-- 答题弹框 -->
		<answer-pop-up v-model="answerShow" :title="info.quesName" @close="answerShow = false" :info="info" @submit="answerSubmit">
		</answer-pop-up>
	</view>

</template>

<script>
	import {
		mapState,
	} from 'vuex'
	export default {
		data() {
			return {
				option: {},
				tabCurrent: 0,
				details: {},
				tabList: [],
				todoDiscloseList: [],
				answerShow: false,
				quesType: '',
				info: {},
				activeItemStyle: {
					color: '#002FA5',
					fontSize: '28rpx'
				},
				detailsData:{},// 源数据
				questionnaireList:[],
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
			...mapState(['nodeInfo', 'projectInfo', 'orderInfo']),
			setQuestionnaireList() {
				if (this.details.surveyTemplatePartDTOList && this.details.surveyTemplatePartDTOList[this.tabCurrent]) {
					return this.details.surveyTemplatePartDTOList[this.tabCurrent].surveyTemplateQuesDTOList
				} else {
					return []
				}
			}
		},
		mounted() {

		},
		onShow() {

		},
		onLoad(option) {
			this.option = option
			this.getTemplateInfo()
			this.setAddress()
		},
		methods: {
			change(index) {
				this.tabCurrent = index
			},
			getTemplateInfo() {
				this.$httpApi.getTemplateInfoById({
					id: this.option.quesId
				}).then(res => {
					if (res) {
						res.surveyTemplatePartDTOList.forEach(ev => {
							ev['name'] = ev.partName
							ev.surveyTemplateQuesDTOList.forEach(ev2 => {
								ev2['time'] = ''
							})
						})
						this.getTodoDiscloseList(res)
					}
				})
			},
			getTodoDiscloseList(result) {
				if (!this.projectInfo.projectId) {
					return
				}
				this.$httpApi.todoDiscloseList({
					nodeId: this.nodeInfo.nodeId,
					projectId: this.projectInfo.projectId
				}).then(res => {
					if (res) {
						this.todoDiscloseList = res
						this.$store.commit('setTemplatePendingCount', this.todoDiscloseList.length)
						if (res.length == 0) {
							return
						}
						result.surveyTemplatePartDTOList.forEach(ev => {
							ev.surveyTemplateQuesDTOList.forEach(ev2 => {
								this.todoDiscloseList.forEach(item => {
									if (ev2.id == item.questionId) {
										ev2['reason'] = item.reason
										ev2['time'] = item.applyTime
										ev2['answer'] = ''
										ev2['todoId'] = item.id
									}
								})
							})
						})
						result.surveyTemplatePartDTOList.forEach(ev => {
							ev.surveyTemplateQuesDTOList = ev.surveyTemplateQuesDTOList.filter(item => item
								.time)
						})
						// result.surveyTemplatePartDTOList = result.surveyTemplatePartDTOList.filter(ev => ev
						// 	.surveyTemplateQuesDTOList.length > 0)
							
						console.log('result', result);
						this.details = result
						
						this.getDetails()
					}
				})
			},
			setAddress() {
				this.quesId = this.nodeInfo.quesId
				this.form.projectId = this.projectInfo.projectId
				this.form.nodeId = this.nodeInfo.nodeId
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
							this.form.execPersonId = tempPerson.personId
							this.form.execPersonName = res.realName
							this.form.execSkillId = tempPerson.skillId
							this.form.execSkillName = tempPerson.skillName
						}
					}
				})
			},
			getDetails() {
				if (!this.option.detailsId) {
					return
				}
				if (this.option.detailsId == 'undefined') {
					return
				}
				this.$httpApi.discloseDetails({
					id: this.option.detailsId
				}).then(res => {
					if (res) {
						this.form.discloseDate = res.discloseDate
						
						if (res.answer && this.$isJSON(res.answer.answerContent)) {
							this.questionnaireList = JSON.parse(res.answer.answerContent)
							this.detailsData = res
						}
					}
				})
			},
			getAnswer(item) {
				this.info = item
				this.answerShow = true
			},
			answerSubmit(answer) {
				// 1.如果是第一次添加，提交答案直接删除
				// 2.如果是编辑，则提交
				if (this.option.detailsId && this.option.detailsId !== 'undefined') {
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
						surveyName: this.detailsData.surveyName,
						surveyTemplateId: this.quesId,
						id: this.option.quesId
					}
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
									this.getTemplateInfo()
								}
							})
				} else {
					this.$httpApi.todoDiscloseDelete({
						id: this.info.todoId
					}).then(res => {
						this.getTemplateInfo()
					})
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	/deep/ .u-drawer {
		z-index: 990 !important;
	}

	.disclosure-confirmation {
		padding-top: 10rpx;
		padding-bottom: 80rpx;
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

	.list-pending {
		margin-top: 2rpx;
		background: #FFFFFF;
		padding: 28rpx 32rpx;

		.item-pending-contain {
			background: linear-gradient(270deg, rgba(243, 246, 255, 0.50) 5%, rgba(244, 247, 255, 0.30) 97%);
			border-radius: 10rpx;
		}
	}

	.item-pending {
		padding: 32rpx 36rpx 32rpx 36rpx;
		margin-top: 2rpx;
		border-bottom: 10rpx solid rgba(207, 216, 238, 0.2);

		.item-children {
			.top {
				display: flex;
				justify-content: space-between;

				.reason {
					color: #FF5D35;
					font-size: 26rpx;
					line-height: 36rpx;
					margin-bottom: 6rpx;
				}
			}

			.time {
				color: #606166;
				font-size: 26rpx;
				line-height: 36rpx;
				margin-bottom: 6rpx;
			}

			.item-name {
				color: #303133;
				font-size: 28rpx;
				line-height: 36rpx;
				margin-bottom: 6rpx;
			}
		}
	}



	.item-button-contain {
		position: fixed;
		display: flex;
		justify-content: center;
		flex-direction: column;
		width: 100%;
		padding-left: 26rpx;
		padding-right: 26rpx;
		@include buttonsafearea();
		// bottom: 20rpx;
		// height: 200rpx;
		background-color: #fff;


		.item-titp {
			color: #909199;
			font-size: 26rpx;
			height: 90rpx;
			text-align: center;
			line-height: 90rpx;
		}

		.button-list {
			position: relative;
			display: flex;
			width: 100%;
			margin-bottom: 20rpx;


			.item-button {
				display: flex;
				flex: 1;
				justify-content: center;
				height: 88rpx;
				text-align: center;
				line-height: 88rpx;
				color: #fff;
				background-color: #002FA5;
				font-size: 24rpx;
				border-radius: 10rpx;
				font-weight: bold;
			}

			.item-button-active {
				background-color: #002FA5;
				color: #fff;
				margin-left: 8rpx;
			}
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
</style>
