<template>
	<view class="initiate-page">
		<z-nav-bar>
			<view slot="default" class="nav-bar">{{ title }}</view>
		</z-nav-bar>
		<view class="x6-form-item">
			<view class="item-information">
				<view class="item-information-contain">
					<view class="item-location">
						<u-icon name="map-fill"></u-icon>
						<text>{{ details.discloseAddress }}</text>
					</view>
					<view class="item-contain">
						<view class="left">交底时间</view>
						<view class="right">{{
                            details.discloseDate &&
                            details.discloseDate.substring(0, 10)
                        }}</view>
					</view>
					<view class="item-contain">
						<view class="left">发起人</view>
						<view class="right">{{ execPersonId.skillName }}
							{{ execPersonId.name }}
						</view>
					</view>
					<view class="row">
						<view>
							<text class="affirm">提交人</text>
							<view class="affirm-right">
								<view class="flex-box" style="margin-top: 10rpx">
									<u-avatar class="avatar" size="40" :src="
                                            $util.avatarImage(
                                                execPersonId.userId
                                            )
                                        " v-if="execPersonId.userId" />
									<text class="name">{{
                                        execPersonId.name
                                    }}</text>
									<text class="skill-name">{{
                                        execPersonId.skillName
                                    }}</text>
								</view>
							</view>
						</view>
						<view>
							<text class="affirm">确认人</text>
							<view class="affirm-right">
								<view class="flex-box" style="margin-top: 10rpx" v-for="(item, index) in checkPerson"
									:key="index">
									<u-avatar class="avatar" size="40" :src="$util.avatarImage(item.userId)"
										v-if="item.userId" />
									<text class="name">{{
                                        item.userType == 1
                                            ? "业主"
                                            : item.personName
                                    }}</text>
									<text class="skill-name" v-if="item.skillName">{{ item.skillName }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="u-tabs-list" v-if="details.basicSurveyAnswerOutput">
				<view class="u-tabs-contain" id="sticky_id" :class="{ sticky: isSticky }"
					:style="{ '--ip14-status-bar-height': ip14StatusBarHeight, top: stickyHeight }">
					<u-tabs height="98" font-size="28" inactive-color="#909199" active-color="#FE6E32"
						:active-item-style="activeItemStyle" :list="details.basicSurveyAnswerOutput" :is-scroll="true"
						:current="tabCurrent" @change="changeTab">
					</u-tabs>
				</view>
			</view>
			<view class="questionnaire-contain"
				v-if="details.basicSurveyAnswerOutput && details.basicSurveyAnswerOutput.length > 0">
				<view class="questionnaire-answers" v-for="(item,index) in details.basicSurveyAnswerOutput"
					:key="index">
					<view :id="'report_' + index">

						<view class="questionnaire_title">{{ item.name }}</view>
						<view class="item-title-contain" v-for="(el, num) in item.surveyTemplateQuesDTOList" :key="num">
							<view class="item-title-contain_item">
								<view class="answer-contain">
									<view class="item-paragraph">
										<view class="item-title padding">{{ num + 1 }}、{{
												el.quesName || ""
											}}</view>
										<!-- <view class="item-tips padding">这是给C端用户看的描述</view> -->
										<view class="item-tips padding" v-if="el.quesNote">{{ el.quesNote }}</view>
										<view class="item-answers padding" v-if="
												![4, 2, 1].includes(Number(el.quesType))
											">{{ el.answer }}
										</view>
										<view class="image-contian padding" v-if="
												el.quesType === '4' && el.answer != '[]'
											">
											<image-show :imgSrc="el.answer" :key="el.answer" right="20"></image-show>
										</view>
									</view>
									<!-- 题目描述 -->
									<view class="item_check item_check-ques" v-if="
											(el.supplementAnswerFile &&
												el.supplementAnswerFile != '[]') ||
											el.supplementAnswerText
										">
										<view style="margin-top: 30rpx">
											<image-show width="116" height="116" v-if="
													el.supplementAnswerFile &&
													el.supplementAnswerFile != '[]'
												" :imgSrc="el.supplementAnswerFile" right="10" :num="5"></image-show>
											<view class="item_check-item">{{
												el.supplementAnswerText || ""
											}}</view>
										</view>
									</view>
									<!-- 问题描述 -->
									<view v-if="[1, 2].includes(Number(el.quesType))" class="item_check">
										<view v-for="(
												val, idx
											) in el.surveyTemplateOptionDTOList" :key="idx">
											<view v-if="
													val.checked ||
													val.optionName == el.answer
												">
												<view class="item_check-answers">{{
													val.optionName
												}}</view>
												<image-show style="margin-top: 10rpx" width="64" height="64" v-if="
														val.supplementAnswerFile &&
														val.supplementAnswerFile != '[]'
													" :imgSrc="val.supplementAnswerFile" right="14" :num="8"></image-show>
												<view class="item_check-remark">{{
													val.supplementAnswerText || ""
												}}</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="file-contain-all"
				v-if="details.remark || details.discloseExecImg || details.discloseExecAudio">
				<view class="text-contain">
					<view class="title">备注内容</view>
					<view class="text">
						{{ details.remark || "" }}
					</view>
				</view>
				<view class="img-contain" v-if="
                        details.discloseExecImg &&
                        details.discloseExecImg.length
                    ">
					<image-show :imgSrc="JSON.stringify(details.discloseExecImg)" right="20"></image-show>
				</view>
				<view class="voice-contain" v-if="details.discloseExecAudio">
					<mihuo-audio v-if="
                            details.discloseExecAudio &&
                            details.discloseExecAudio.url
                        " :formDate="details.discloseExecAudio"></mihuo-audio>
				</view>
			</view>
		</view>
		<myHome-mh-form-bottom-button v-if="nodeData.status == 0" @onCancel="() => toDealt(1)"
			@onSure="() => toDealt(2)" />
		<bottom-button v-else @click="download" title="下载报告"></bottom-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				details: {},
				option: {},
				tabCurrent: 0,
				activeItemStyle: {
					color: "#FE6E32",
					fontSize: "28rpx",
				},
				title: "交底内容",
				execPersonId: {},
				nodeData: {},
				checkPerson: [],
				reportId: "", // 报告id
				isSticky: false,
				tabHeight: 0,
				stickyHeight: '88rpx',
				ip14StatusBarHeight: '', // iphone 14 pro max状态栏高度
				scollChidH: [],
			};
		},
		onLoad(option) {
			// #ifdef MP-WEIXIN
			uni.getSystemInfo({
				success: (e) => {
					if (uni.getSystemInfoSync().platform == "ios") {
						if (e.model.indexOf('14 Pro') !== -1) {
							// 据说ip14 pro 和pro max的状态栏高度会多5px
							this.ip14StatusBarHeight = '10rpx'
						}
						this.stickyHeight = '99rpx'
					} else {
						this.stickyHeight = '78rpx'
					}
				}
			})
			// #endif
			this.option = option;
			if (option.noticeId) {
				this.$util.readNotice(option.noticeId);
			}
			// this.getDiscoTemplate()

		},
		onShow() {
			if (this.option.reviewId) {
				this.getNode();
			}
			this.getCheckPerson();
		},
		mounted() {
			this.getDetails();
		},
		onPageScroll(e) {
			this.isSticky = e.scrollTop > this.tabHeight ? true : false;
			this.debounce(() => {
				this.positionTab(e.scrollTop)
			}, 500)
		},
		methods: {
			positionTab(num) {
				var i = 0,
					sum = 0,
					len = this.scollChidH.length
				if (!(len > 0)) {
					return
				}
				for (i == 0; i < len; i++) {
					sum += this.scollChidH[i]
					if (sum >= num) {
						this.tabCurrent = i
						return
					}
				}
			},
			// 下载pdf
			download() {
				const fileName = (this.details.answer?.surveyName || "") + "-" + this.details.discloseAddress || "";
				const date = this.details?.discloseDate;
				let dateShort
				if (date) {
					dateShort = '_' + date.slice(0, 16)
				}
				const reportName = `${this.title || ""}${dateShort}`;
				// 变更=1 交底=2 验收=3 巡检=4
				this.$util.downloadPdfReport(this.reportId, 2, fileName, reportName)
			},
			// 查询节点信息
			getNode() {
				this.$httpApi.getCheckNode(this.option.reviewId).then((res) => {
					this.nodeData = res;
				});
			},
			// 查询节点审查人
			getCheckPerson() {
				this.$httpApi.getCheckPerson(this.option.nodeId).then((res) => {
					if (res && res.length) {
						this.checkPerson = res.filter((item) => item.status != 0);
					}
				});
			},
			confirm() {
				this.$httpApi
					.handleToDoPending({
						id: this.option.reviewId,
						status: 2,
					})
					.then((res) => {
						if (res) {
							this.$util.toast("处理成功，即将返回上一页");
							setTimeout(() => {
								uni.navigateBack();
							}, 500);
						}
					});
			},
			// 查询交底模板
			getDiscoTemplate() {
				this.$httpApi
					.getTemplateInfoById(this.option.quesId)
					.then((res) => {
						if (res) {
							this.title = res.surveyName;
						}
					});
			},
			// 查询交底记录，取第一条（最新一条）
			getDetails() {
				this.$httpApi
					.orderDiscloseGet({
						nodeId: this.option.nodeId,
					})
					.then((res) => {
						if (res) {
							if (res && res.length) {
								this.reportId = res[0].id;
								this.getDisclose(res[0]);
							}
						}
					});
			},
			// 查询交底内容详情
			getDisclose(data) {
				this.$httpApi.getDiscloseContent(data.id).then((res) => {
					if (res) {
						res.basicSurveyAnswerOutput =
							res.answer &&
							res.answer.answerContent &&
							JSON.parse(res.answer.answerContent || "");
						res.basicSurveyAnswerOutput &&
							res.basicSurveyAnswerOutput.map((item) => {
								item.surveyTemplateQuesDTOList =
									item.surveyTemplateQuesDTOList.filter(
										(el) => el.answer !== ""
									);
								item.name = item.partName;
							});
						// 获取确认交办人
						if (res.execPersonId) {
							this.getUserNews(res.execPersonId);
						}
						this.title = res.answer?.surveyName;
						this.details = res;
						// 获取标签距离顶部的高度
						this.$nextTick(() => {
							const query = uni.createSelectorQuery()
							query.select('#sticky_id').boundingClientRect((data) => {
								if (data) {
									this.tabHeight = data.top
								}
							}).exec();
							let tabH = [];
							if (!this.details.basicSurveyAnswerOutput) {
								return
							}
							for (let index = 0; index < this.details.basicSurveyAnswerOutput
								.length; index++) {
								let query = uni.createSelectorQuery().select('#report_' + index)
								query.fields({
										size: true
									}, data => {
										tabH.push(data?.height)
									})
									.exec()
							}
							this.scollChidH = tabH
						}, 100)
					}
				});
			},
			// 获取交底用户
			getUserNews(personId) {
				this.$getPersonIdUser([personId], (res) => {
					if (res && res.length) {
						this.execPersonId = res[0];
					}
				});
			},
			// tab切换
			changeTab(index) {
				this.tabCurrent = index;
				if (!this.scollChidH) return
				let height = this.scollChidH.slice(0, index)
				let scrollTop = height.reduce(function(total, value) {
					return total + value
				}, 0)
				let shiftHeight = 100
				// #ifdef APP-PLUS
				if (uni.getSystemInfoSync().platform == "ios") {
					try {
						shiftHeight = 120
					} catch (error) {
						console.log(error);
					}
				}
				// #endif
				// #ifdef MP-WEIXIN
				wx.getSystemInfo({
					success: function(res) {
						if (res.platform == "ios") {
							shiftHeight = 140
						}
					}
				})
				// #endif
				uni.pageScrollTo({
					scrollTop: scrollTop + shiftHeight,
					duration: 300
				})
				this.isSticky = true
			},
			toDealt(status) {
				this.toPage(
					`/pages-myHome/commonHandleTodo?reviewId=${this.option.reviewId}&status=${status}&nodeId=${this.option.nodeId}`
				);
			},
		},
	};
</script>
<style lang="scss">
	page {
		background: #f5f5f5;
	}
</style>
<style lang="scss" scoped>
	.u-tabs-list {
		background: #ffffff;
		border-radius: 10rpx 10rpx 0 0;
		margin-top: 10px;
		border-bottom: 2rpx solid #eeeeee;
		width: 750rpx;

		.u-tabs-contain {
			width: 100%;
			background: #ffffff;
		}
	}

	.file-contain-all {
		margin: 20rpx 30rpx 0;
		border-radius: 10rpx;
		background: #ffffff;
		border-radius: $miniBorderRadius;
		padding: 20rpx;

		.text-contain {
			margin-bottom: 32rpx;

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
			background-color: #ffffff;
			margin-bottom: 12rpx;

			.record-item-img {
				width: 154rpx;
				margin-right: 28rpx;
			}
		}

		.voice-contain {
			background: #ffffff;
			margin-bottom: 2rpx;
		}
	}

	.supplement-contain {
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
					text {
						color: $fontColor00;
						font-size: $middleFontSize;
						font-weight: bold;
					}
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
		padding: 20rpx 0 180rpx;

		.item-information {
			background: #ffffff;
			border-radius: 10rpx;
			padding: 20rpx;
			margin: 0 30rpx;

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

				text {
					margin-left: 10rpx;
				}
			}

			.item-contain {
				display: flex;
				margin-bottom: 10rpx;
				align-items: center;

				&:last-child {
					margin-bottom: 0rpx;
				}

				.left {
					color: #909199;
					font-size: $smiddleFontSize;
					margin-right: 20rpx;
				}

				.right {
					color: #000000;
					font-size: $middleFontSize;
				}
			}
		}
	}

	.questionnaire-contain {
		border-radius: 0 0 10rpx 10rpx;
		margin: 0 30rpx 30rpx;

		.questionnaire_title {
			color: #000000;
			font-family: NotoSansHans-Medium;
			font-size: 28rpx;
			font-weight: bold;
			padding-top: 20rpx;
		}

		.questionnaire-answers {

			// border-bottom: 2rpx dashed #eeeeee;
			// padding: 20rpx;
			&:last-child {
				margin-bottom: 0rpx;
				border-bottom: 0rpx;
			}

			.item-paragraph-title {
				display: flex;
				align-items: center;
				margin-bottom: 22rpx;

				image {
					width: 44rpx;
					height: 30rpx;
				}

				text {
					font-size: $middleFontSize;
					color: $seconFontColor;
					margin-left: 8rpx;
					font-weight: bold;
				}
			}

			.item_check-ques {
				border-bottom: 2rpx solid #f0f0f0;
				padding-bottom: 30rpx;

				.item_check-item {
					color: #000000;
					font-family: NotoSansHans-Regular;
					font-size: 24rpx;
				}
			}

			.item_check {
				padding: 0 20rpx 20rpx;

				.item_check-answers {
					color: #fe6e32;
					font-size: 24rpx;
					font-family: NotoSansHans-Regular;
					padding-top: 30rpx;
				}

				.item_check-remark {
					color: #999999;
					font-family: NotoSansHans-Regular;
					font-size: 20rpx;
				}
			}

			.item-title-contain {
				padding: 20rpx 0;

				.item-title-contain_item {
					border-radius: 20rpx;
					padding-top: 20rpx;
					background: #ffffff;
				}

				.answer-contain {
					// margin-bottom: 0rpx;
				}

				.item-paragraph {
					border-bottom: 2rpx solid #f0f0f0;

					.item-title {
						display: flex;
						align-items: center;
						color: $fontColor00;
						font-size: $middleFontSize;
						font-weight: bold;
						margin-bottom: 20rpx;
					}

					.item-answers {
						font-size: 24rpx;
						color: #fe6e32;
						// background: #feefe9;
						border-radius: 6rpx;
						margin-bottom: 20rpx;
					}

					.other-answers {
						padding-left: 26rpx;

						.desc-item-text {
							font-size: 24rpx;
							color: #fe6e32;
							background: #feefe9;
							border-radius: 6rpx;
							padding: 10rpx;
						}
					}

					.item-tips {
						color: #999999;
						font-size: 24rpx;
						padding-bottom: 20rpx;
						white-space: pre-wrap;
					}

					.image-contian {
						display: flex;
						flex-wrap: wrap;
					}
				}
			}
		}
	}

	.flex {
		display: flex;
		align-items: flex-start;
	}

	.flex-box {
		display: flex;
		align-items: center;
	}

	.row {
		display: flex;

		view {
			flex: 1;

			text {
				font-size: 24rpx;
				font-family: NotoSansHans-Regular;
				color: #909199;
				margin-right: 10rpx;
			}

			.affirm {
				font-size: $fontSize26;
			}

			.affirm-right {
				display: flex;
				flex-direction: column;
			}

			.name {
				color: #000000;
				margin-left: 10rpx;
			}

			.skill-name {
				color: #fe6e32;
				background: #fff0ea;
				padding: 2rpx 10rpx;
				font-weight: 600;
				border-radius: 10rpx 0;
				font-size: 20rpx;
			}
		}
	}

	.case-bottom {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
		padding: 0 30rpx;

		.case-do {
			padding-top: 20rpx;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
			background: #f5f5f5;

			view {
				margin-right: 20rpx;
				flex: 1;

				&:last-child {
					margin-right: 0;
				}

				padding: 20rpx 0;
				text-align: center;
				border-radius: 100rpx;
			}

			.button-confirm {
				color: #ffffff;
				background: #000000;
				border: 1.5rpx solid #000000;
			}

			.button-no {
				color: #000000;
				border: 1.5rpx solid #000000;
				background: #ffffff;
			}
		}
	}

	.padding {
		padding: 0 20rpx;
	}

	.sticky {
		z-index: 9;
		position: fixed;
		padding-top: var(--status-bar-height);
		/*  #ifdef MP-WEIXIN  */
		top: calc(88rpx + var(--status-bar-height) + var(--ip14-status-bar-height));
		/*  #endif  */
		animation: move 0.1s linear;
	}

	@keyframes move {
		to {
			top: calc(60rpx + var(--status-bar-height));
		}

		from {
			top: 0;
		}
	}
</style>
