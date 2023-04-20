<template>
	<view>
		<z-nav-bar fontColor="black" :title="options.title"></z-nav-bar>
		<view class="report">
			<view class="report-time">
				<text class="time">提交时间</text>
				<text>{{ reportContent.time }}</text>
			</view>
			<view v-if="reportContent.report && reportContent.report.id && 
			reportContent.report.answerArr && reportContent.report.answerArr.length" class="report-content">
				<view v-for="(item,index) in reportContent.report.surveyTemplatePartDTOList" :key="index">
					<view v-if="item.surveyTemplateQuesDTOList && item.surveyTemplateQuesDTOList.length"
						class="content-item">
						<view class="items-title">{{item.partName}}</view>
						<view class="collse-item_main" v-for="(item1,index1) in item.surveyTemplateQuesDTOList"
							:key="index1">
							<view class="collse-item_main-left">
								<text class="index-text">
									{{ index1 >= 9 ? index1 + 1 : '0' + (index1 + 1) }}
								</text>
								<text class="title">{{ item1.quesName || ''}}</text>
							</view>
							<view style="margin-left:70rpx">
								<view class="collse-item_main-left">
									<text class="des">{{ item1.questNote || ''}}</text>
								</view>
								<view v-if="![2,1].includes(Number(item1.quesType))">
									<image-show style="margin: 20rpx 0 0 0" v-if="item1.quesType == 4" :imgSrc="item1.answer" />
									<!-- <view class="flex-box" v-if="item1.quesType == 2 && item1.answer.length">
										<view class="collse-item_main-right" v-for="(v,i) in item1.answer" :key="i">
											<text class="collse-item_item">
												{{ v }}
											</text>
										</view>
									</view> -->
									<view class="collse-item_main-right" v-if="item1.quesType == 3">
										<text>{{ item1.answer }}</text>
									</view>
								</view>
								<view class="item_check item_check-ques" v-if="(item1.supplementAnswerFile && item1.supplementAnswerFile != '[]') || item1.supplementAnswerText">
									<image-show width="116" height="116"  v-if="item1.supplementAnswerFile && item1.supplementAnswerFile != '[]'" :imgSrc="item1.supplementAnswerFile" right="10" :num='5'></image-show>
									<view class="item_check-item">{{ item1.supplementAnswerText || '这是问题描述'}}</view>
								</view>
								<!-- 问题描述 -->
								<view v-if="[1,2].includes(Number(item1.quesType))" class="item_check">
									<view v-for="val,idx in item1.surveyTemplateOptionDTOList" :key="idx">
										<view v-if="(val.checked || val.optionName == item1.answer)">
											<view class="item_check-answers">{{ val.optionName }}</view>
											<image-show style="margin-top:10rpx" width="64" height="64" v-if="val.supplementAnswerFile && val.supplementAnswerFile != '[]'" :imgSrc="val.supplementAnswerFile" right="14" :num='8'></image-show>
											<view class="item_check-remark">{{ val.supplementAnswerText || ''}}</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<mh-empty v-else title="报告内容暂未作答~~"></mh-empty>
		</view>
	</view>
</template>

<script>
	/**
	 * quesType
	 * 1:单选
	 * 2:多选
	 * 3:文本
	 * 4:图片
	 */
	export default {
		data() {
			return {
				reportContent: {},
				title: '',
				options: {}
			}
		},
		onLoad(options) {
			this.options = options;
			this.getDetails()
		},
		methods: {
			checkIsShowAnswer(item) {
				if (item.quesType == 4) {
					if (!item.surveyTemplateOptionDTOList.length) return false
				} else {
					if (!item.answer) return false
				}
				return true
			},
			getDetails() {
				let params = {
					id: this.options.id,
				}
				if (uni.getStorageSync('userData')) {
					params.userId = uni.getStorageSync('userData').sysUser.userId
				}
				this.$httpApi.getConstruCaseDetail(params).then(res => {
					if (res) {
						let arrList = []
						let reportContent = null
						// 报告
						res.homeInspection = JSON.parse(res.homeInspection);
						if (res.homeInspection && res.homeInspection.length) {
							res.homeInspection.map((item) => {
								arrList = arrList.concat(item.reports)
							})
						}
						if (arrList.length) {
							arrList.some((item) => {
								if (this.options.title == item.report.surveyName) {
									reportContent = item;
									reportContent.report.surveyTemplatePartDTOList && reportContent.report
										.surveyTemplatePartDTOList
										.map((item1) => {
											if (item1.surveyTemplateQuesDTOList && item1
												.surveyTemplateQuesDTOList.length) {
												item1.surveyTemplateQuesDTOList.some((v) => {
													if (v.quesType == 2) {
														let answer = []
														if (v.surveyTemplateOptionDTOList && v
															.surveyTemplateOptionDTOList.length
															) {
															v.surveyTemplateOptionDTOList
																.forEach((val) => {
																	if (val.checked) {
																		answer.push(val
																			.optionName
																			)
																	}
																})
														}
														v.answer = (answer && answer.length) ?
															answer : ''
													}
													if (v.quesType == 4) {
														if (v.answer instanceof Array && v
															.answer.length == 0) v.answer = ''
													}
												})
											}
										})
									return true;
								}
							})
						}
						this.reportContent = reportContent
						if (this.reportContent && this.reportContent.report) {
							this.reportContent.report.surveyTemplatePartDTOList && this.reportContent.report
								.surveyTemplatePartDTOList
								.map((item) => {
									item.surveyTemplateQuesDTOList = item.surveyTemplateQuesDTOList && item
										.surveyTemplateQuesDTOList.filter((item) => item.answer)
								})
						}
						// 此操作用于判断整份问卷是否作答
						this.reportContent.report.answerArr = this.reportContent.report.surveyTemplatePartDTOList
							.filter((item) => item.surveyTemplateQuesDTOList && item.surveyTemplateQuesDTOList
								.length)
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.report {
		padding: 0 30rpx;

		.report-time {
			text {
				color: #808080;
				font-size: 22rpx;
			}

			.time {
				margin-right: 10rpx;
			}
		}

		.report-content {
			.content-item {
				padding: 20rpx 0;

				&:last-child {
					border: none;
				}

				.items-title {
					color: #000000;
					font-size: 28rpx;
					font-weight: bold;
					font-family: MicrosoftYaHei;
					padding-bottom: 20rpx;
					border-bottom: 1px solid #F3F4F8;
				}

				.items-content {
					color: #909399;
					font-size: 24rpx;
					font-family: MicrosoftYaHei;
					padding: 20rpx 0;
				}

				.passFlag {
					color: #FE6E32;
					font-size: 26rpx;
					font-family: MicrosoftYaHei;
					border-radius: 8rpx;
					padding: 5rpx 10rpx;
					background: #FFF0EA;

					&.passFlag_0 {}
				}

				.collse-item_main {
					padding: 30rpx 30rpx 30rpx 0;
					border-bottom: #F3F4F8 solid 2rpx;

					.collse-item_main-left {
						position: relative;
						padding-left: 70rpx;
						
						.index-text {
							font-size: 60rpx;
							font-weight: bold;
							opacity: 0.1;
							position: absolute;
							top: -10rpx;
							left: -10rpx;
						}
						
						.title {
							color: #000000;
							font-size: 28rpx;
							font-weight: bold;
						}
						
						.des {
							color: #A8A8A8;
							font-size: 20rpx;
						}
					}

					.collse-item_main-right {
						margin-top: 20rpx;
						
						text {
							color: #FE6E32;
							font-size: 24rpx;
							background: #FFF0EA;
							border-radius: 6rpx;
							padding: 10rpx;
							margin-right: 20rpx;
						}

						.collse-item_item {
							margin: 0 10rpx 10rpx 0;
						}
					}
				}
			}
		}
	}

	.flex-box {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}
	.item_check-ques{
		border-bottom: 2rpx solid #F0F0F0;
		padding: 30rpx 0 30rpx;
		.item_check-item{
			color: #000000;
			font-family: NotoSansHans-Regular;
			font-size: 24rpx;
		}
	}
	.item_check{
		// padding: 0 0 20rpx;
		.item_check-answers{
			color: #FE6E32;
			font-size: 24rpx;
			font-family: NotoSansHans-Regular;
			padding-top: 30rpx;
		}
		.item_check-remark{
			color: #999999;
			font-family: NotoSansHans-Regular;
			font-size: 20rpx;
		}
		
	}
</style>
