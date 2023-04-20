<template>
	<view class="initiate-page">
		<public-module></public-module>
		<z-nav-bar backState="1000"  bgColor="#FFF" fontColor="#979797">
			<view slot="default" class="nav-bar-title">
				{{title}}
			</view>
			<view slot="right" v-if="!option.type" class="nav-bar-right" @click="editQuestionnaire()">
				编辑记录
			</view>
		</z-nav-bar>

		<view class="x6-form-item">
			<view class="item-information " v-if="JSON.stringify(orderInfo) !== '{}'">
				<view class="item-information-contain">
					<view class="item-address">{{orderInfo.address}}</view>
					<view class="item-location">
						<image src="/static/images/icon-address/weizhi.png" mode=""></image>
						<text>{{details.discloseAddress}}</text>
					</view>
					<view class="item-contain">
						<view class="left">交底时间</view>
						<view class="right">{{details.discloseDate && details.discloseDate.substring(0,10)}}</view>
					</view>
					<view class="item-contain">
						<view class="left">发起人</view>
						<view class="right">{{details.execSkillName}} {{details.execPersonName}}</view>
					</view>
				</view>
				<view class="item-line"
					v-if="details.basicSurveyAnswerOutput && details.basicSurveyAnswerOutput.length > 0"></view>
			</view>
			<!-- 问卷答案 -->
			<view v-if="questionnaireAnswerShow">
				<questionnaire-answer ref="questionnaireAnswer" :info="details" >
				</questionnaire-answer>
			</view>
		</view>
		<view class="file-contain-all">
			<view class="text-contain" v-if="details.remark">
				<view class="title">备注内容</view>
				<view class="text">
					{{details.remark}}
				</view>
			</view>
			<view class="img-contain" v-if="details.attachmentsList !== '[]'">
				<image-show :imgSrc="details.attachmentsList" :key="details.attachmentsList" right="20"></image-show>
			</view>
			<view class="voice-contain" v-if="details.discloseExecAudio">
				<mihuo-audio :formData="details.discloseExecAudio"></mihuo-audio>
			</view>
		</view>

		<view class="supplement-contain">
			<view class="title">补充信息</view>
			<view class="supplement-contain-item" v-for="(item,index) in details.discloseAddDTOList" :key="index">
				<view class="personnel-contain">
					<u-avatar class="node" size="36" :src="$util.avatarImage(item.createBy)">
					</u-avatar>
					<view class="name-contain">
						<view class="item-name">{{item.createPersonName}}({{item.createSkillName}})</view>
						<view class="item-time" v-if="item.createTime">{{item.createTime.substring(0,16)}}添加</view>
					</view>
				</view>
				<view class="describe-contain">
					<view class="title-contain">
						<text class="item-title">内容描述</text>
						<text class="item-describe">{{item.addContent}}</text>
					</view>
					<view class="img-contain" v-if="item.addFilesImage">
						<image-show :imgSrc="item.addFilesImage" right="20"></image-show>
					</view>
					<view class="voice-contain-supplement" v-if="item.addFilesAudio">
						<mihuo-audio :formData="item.addFilesAudio"></mihuo-audio>
					</view>
				</view>
			</view>
			<view class="add-supplement" v-if="!option.type">
				<view class="left"> 发现新的问题？去添加新的补充</view>
				<view class="right" @click="addSupplement">
					<image src="/static/images/add-new.png"></image> <text class="item-text">添加补充</text>
				</view>
			</view>
		</view>

		<mihuo-bottom-button v-if="!option.type" :buttonList="buttonList" @click="getButton"></mihuo-bottom-button>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	export default {
		data() {
			return {
				details: {},
				initiatorUser: {},
				userIdList: [],
				option: {},
				tabCurrent: 0,
				title: '',
				editQuestionnaireStatus: false,
				questionnaireAnswerShow: false,
				buttonList: [{
						name: '下载报告',
						status: false
					},
					{
						name: '编辑',
						status: true
					}
				],
				activeItemStyle: {
					color: '#002FA5',
					fontSize: '28rpx'
				},
			}
		},
		onLoad(option) {
			this.option = option
			this.readNotifyUsingPOST()
		},
		onShow() {
			this.setTitle()
			this.getDetails()
		},
		onPageScroll(e) {
			this.$refs.questionnaireAnswer && this.$refs.questionnaireAnswer.setLocationType(e)
		},
		computed: {
			...mapState(['nodeInfo', 'userPersonInfo', 'projectInfo', 'orderInfo']),
			setQuestionnaireList() {
				return [this.details.basicSurveyAnswerOutput[this.tabCurrent]]
			}
		},
		methods: {
			getDetails() {
				if(!this.option.detailsId){
					return
				}
				this.$httpApi.discloseDetails({
					id: this.option.detailsId
				}).then(res => {
					if (res) {
						this.details = res
						this.details['basicSurveyAnswerOutput'] = res.answer && JSON.parse(res.answer
							.answerContent)

						if (this.details['basicSurveyAnswerOutput']) {
							this.details['basicSurveyAnswerOutput'].map(item => {
								
								// item.surveyTemplateQuesDTOList = item.surveyTemplateQuesDTOList.filter(el => el.answer !== '')
								item.name = item.partName

								// 单选、多选过滤掉未选中的选项
								item.surveyTemplateQuesDTOList.forEach(item2 => {
									if ([1, 2].includes(Number(item2.quesType))) {
										item2.surveyTemplateOptionDTOList = item2
											.surveyTemplateOptionDTOList.filter(item3 => item3
												.checked || item3.radioName)
									}
								})
							})
						}
						if (this.$isJSON(this.details.attachments)) {
							this.details['attachmentsList'] = JSON.stringify(JSON.parse(this.details.attachments)
								.filter(item => item.type == 'img' || item.type == 'video'))

							this.details['discloseExecAudio'] = JSON.parse(this.details.attachments).find(item =>
								item.type == 'audio')
						}
						if (this.details.discloseAddDTOList) {
							this.details.discloseAddDTOList.map(item => {
								if (this.$isJSON(item.addFiles)) {
									item['addFilesImage'] = JSON.stringify(JSON.parse(item.addFiles)
										.filter(item => item.type == 'img' || item.type == 'video'))
									item['addFilesAudio'] = JSON.parse(item.addFiles).find(item => item
										.type == 'audio')
								}
							})
						}
						
						this.questionnaireAnswerShow = true
						if (this.option.toDoType) {
							this.setReadNotifyUsing()
						}
					}
				})
			},
			setTitle() {
				if (!this.nodeInfo.quesId) {
					return
				}
				this.$httpApi.getTemplateInfoById({
					id: this.nodeInfo.quesId,
				}).then(res => {
					if (res) {
						this.title = '查看' + res.surveyName
					}
				})
			},
			addSupplement() {
				if (this.details.id) {
					this.toPage(`/pages/construction/disclosure/supplement?id=${this.details.id}`)
				}
			},
			setReadNotifyUsing() {
				let personId = this.userPersonInfo.personId
				if (personId) {
					let tempNotify = this.details.ccPersons.find(item => item.handlePersonId == personId)

					if (tempNotify) {
						this.$httpApi.readNotify({
							notifyId: tempNotify.id
						}).then(res => {})
					}
				}
			},
			readNotifyUsingPOST() {
				if (this.option.notifyId) {
					this.$httpApi.readNotify({
						notifyId: this.option.notifyId
					}).then(res => {})
				}
				if (this.option.toDoType) {
					this.$httpApi.bizpendingHandle({
						bizPendingDetailId: this.option.bizPendingDetailId,
						handlePersonId: this.userPersonInfo.personId
					}).then(res => {

					})
				}
			},
			change(index) {
				this.tabCurrent = index
			},
			editQuestionnaire() {
				this.toPage('/pages/construction/disclosure/editRecord')
			},
			getButton(item) {
				if (item.name == '编辑') {
					this.editRecord()
				} else {
					this.download()
				}
			},
			editRecord() {
				this.toPage(`/pages/construction/disclosure/addDisclosure?type=编辑&detailsId=${this.option.detailsId}`)
			},
			download() {
				// 变更=1 交底=2 验收=3 巡检=4 B端变更=5
				const fileName = (this.details.answer?.surveyName || '') + '-' + this.details.discloseAddress || ''
				this.$util.downloadPdfReport(this.option.detailsId, 2, fileName)
			},

		}
	}
</script>

<style lang="scss" scoped>
	.initiate-page {
		padding-top: 12rpx;
		padding-bottom: 180rpx;
	}

	.nav-bar-right {
		font-size: $middleFontSize;
		color: $viceFontColor;
		padding-right: 28rpx;
	}

	.file-contain-all {
		margin: 4rpx 20rpx 4rpx 20rpx;
		border-radius: 10rpx;
		padding: 0rpx 40rpx 0rpx 40rpx;
		background: #FFFFFF;
		border-radius: $miniBorderRadius;

		.text-contain {
			padding: 40rpx 0rpx 16rpx 0rpx;

			.title {
				font-size: $middleFontSize;
				color: $mainFontColor;
				margin-bottom: 20rpx;
			}

			.text {
				font-size: $middleFontSize;
				color: $seconFontColor;
				line-height: 1.5;
			}

		}


		.img-contain {
			display: flex;
			flex-wrap: wrap;
			background-color: #FFFFFF;
			padding: 16rpx 0rpx 0rpx 0rpx;

			.record-item-img {
				width: 154rpx;
				margin-right: 28rpx;
			}
		}

		.voice-contain {
			background: #FFFFFF;
			margin-bottom: 2rpx;
			padding-top: 16rpx;
		}

	}

	.supplement-contain {
		padding: 42rpx 30rpx 40rpx 30rpx;
		margin: 0rpx 20rpx 4rpx 20rpx;
		background-color: $bgColor;
		border-radius: 20rpx;

		.title {
			color: $seconFontColor;
			font-size: $middleFontSize;
			font-weight: bold;
			margin-bottom: 20rpx;
		}

		.personnel-contain {
			display: flex;
			align-items: center;
			margin-bottom: 20rpx;

			.name-contain {
				display: flex;
				margin-left: 10rpx;

				.item-name {
					color: $mainFontColor;
					font-size: $smiddleFontSize;
					margin-right: 10rpx;
				}

				.item-time {
					color: $viceFontColor;
					font-size: $smiddleFontSize;
				}
			}
		}

		.describe-contain {
			box-shadow: 0px 0px 8px rgba(191, 191, 191, 0.25);
			border-radius: $miniBorderRadius;
			padding: 36rpx 40rpx 40rpx 42rpx;
			margin-bottom: 42rpx;

			.title-contain {
				.item-title {
					color: $viceFontColor;
					font-size: $smallFontSize;
					margin-right: 18rpx;
				}

				.item-describe {
					color: $seconFontColor;
					font-size: $smiddleFontSize;
				}

			}

			.img-contain {
				display: flex;
				flex-wrap: wrap;
				margin-top: 22rpx;

				.record-item-img {
					width: 154rpx;
					margin-right: 34rpx;

					&:nth-of-type(3n + 0) {
						margin-right: 0;
					}
				}
			}

			.voice-contain-supplement {
				margin-top: 20rpx;
			}
		}

		.add-supplement {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;

			.left {
				color: $viceFontColor;
				font-size: $smiddleFontSize;
			}

			.right {
				display: flex;
				align-items: center;

				image {
					width: 32rpx;
					height: 32rpx;
					margin-right: 8rpx;
				}

				text {
					color: $themeColor;
					font-size: $smiddleFontSize;
				}

			}
		}
	}


	.x6-form-item {

		border-radius: 10rpx;

		.item-information {
			background-color: #FFFFFF;
			border-top-left-radius: 10rpx;
			border-top-right-radius: 10rpx;
			margin: 0rpx 20rpx 0rpx 20rpx;

			.item-information-contain {
				padding: 48rpx 40rpx 30rpx 40rpx;
			}

			.item-address {
				color: $seconFontColor;
				font-size: $middleAddFontSize;
				font-weight: bold;
				margin-bottom: 12rpx;
			}

			.item-location {
				display: flex;
				align-items: center;
				margin-bottom: 24rpx;

				image {
					width: 32rpx;
					height: 32rpx;
				}
			}

			.item-contain {
				display: flex;
				margin-bottom: 10rpx;

				&:last-child {
					margin-bottom: 0rpx;
				}

				.left {
					color: #909199;
					font-size: $smiddleFontSize;
					margin-right: 20rpx;
				}

				.right {
					color: #909199;
					font-size: $middleFontSize;
				}
			}

			.item-line {
				border-bottom: 1rpx solid #EEEEEE;
				margin: 0rpx 26rpx;

			}
		}
	}


	.survey-content {
		.item-surveyTemplateQuesDTOList {
			.other-item-contain {
				display: flex;
				flex-direction: column;

				.right-contain {
					padding-top: 10rpx;

					.image-contian {
						display: flex;
						flex-wrap: wrap;
					}
				}
			}
		}
	}


	.item-button-contain {
		position: fixed;
		display: flex;
		justify-content: center;
		width: 100%;
		padding-left: 26rpx;
		padding-right: 26rpx;
		@include buttonsafearea();
		background-color: #fff;
		z-index: 99;

		.button-list {
			position: relative;
			display: flex;
			width: 100%;
			// bottom: 20rpx;
			// padding-bottom: 20rpx;
			padding: 10rpx 0rpx;

			.item-button {
				display: flex;
				flex: 1;
				justify-content: center;
				height: 88rpx;
				text-align: center;
				line-height: 88rpx;
				color: #002FA5;
				background-color: #fff;
				font-size: 24rpx;
				border-radius: 10rpx;
				border: 2rpx solid #002FA5;
				font-weight: bold;
			}

			.item-button-active {
				background-color: #002FA5;
				color: #fff;
				margin-left: 8rpx;
				font-weight: bold;
			}
		}
	}
</style>
