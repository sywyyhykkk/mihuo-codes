<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	.u-tabs-list {
		position: -webkit-sticky;
		position: sticky;
		width: 100%;
		z-index: 99;
		top: calc(88rpx + var(--status-bar-height));

		margin: 20rpx 0rpx 30rpx 0rpx;

		.u-tabs-contain {
			margin-bottom: 2rpx;
			border-top-left-radius: $miniBorderRadius;
			border-top-right-radius: $miniBorderRadius;
		}

		/deep/ .u-tab-bar {
			bottom: -6rpx;
		}

	}

	.questionnaire-contain {
		border-bottom-left-radius: 10rpx;
		border-bottom-right-radius: 10rpx;
		margin: 0rpx 20rpx 0rpx 20rpx;

		.questionnaire-answers {
			border-bottom: 2rpx dashed #EEEEEE;
			margin: 0rpx 0rpx 40rpx 0rpx;
			// padding: 40rpx 0rpx;


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

			.item-title-contain {
				background-color: #FFFFFF;

				margin-bottom: 20rpx;
				border-radius: 20rpx;

				.answer-contain {
					// margin-bottom: 32rpx;
				}

				.item-paragraph {

					.item-title-all {
						padding: 30rpx 28rpx 26rpx 28rpx;
						border-bottom: 2rpx solid #f5f5f5;

					}

					.answers-all {
						// padding: 30rpx 28rpx 30rpx 28rpx;
					}

					.item-title {
						display: flex;
						align-items: center;
						margin-bottom: 10rpx;

						.item-number {
							color: $seconFontColor;
							font-size: $smallFontSize;
							margin-right: 8rpx;
							font-weight: bold;
						}

						.ques-name {
							color: $seconFontColor;
							font-size: $middleFontSize;
							font-weight: bold;
						}
					}

					.other-answers {
						padding: 30rpx 10rpx 30rpx 28rpx;
					}

					.item-answers {
						font-weight: 400;
						font-size: $smiddleFontSize;
						color: #303133;


						.item-answers-other {
							padding: 30rpx 10rpx 30rpx 28rpx;
							border-bottom: 2rpx solid #f5f5f5;
						}

						.select-answers {
							padding: 30rpx 28rpx 30rpx 28rpx;

							.select-answers-text {
								font-size: 28rpx;
								color: #303133;
								margin-bottom: 10rpx;
							}

							.radio-item_contain {

								&:last-child {
									.radio-item {
										margin-bottom: 0rpx;
									}
								}
							}

							.radio-item {
								margin-bottom: 30rpx;

								.radio-item_desc {
									color: #999999;
									font-size: 24rpx;
								}

								/deep/ .item-image-all {
									margin-right: 10rpx !important;
									margin-bottom: 10rpx !important;
								}

							}
						}

					}

					.desc-item-text {
						font-weight: 400;
						font-size: $smiddleFontSize;
						color: #303133;
					}
				}
			}
		}
	}

	.questions-item-title-desc {
		font-weight: bold;
		font-size: 24rpx;
		color: #999999;
		white-space: pre-wrap;
	}
</style>

<template>
	<view class="questionnaire-answer" v-if="JSON.stringify(info) !== '{}'">
		<view class="u-tabs-list">
			<view class="space-list-sticky">
				<u-tabs class="u-tabs-contain" height="98" font-size="28" inactive-color="#909199"
					active-color="#002FA5" :active-item-style="activeItemStyle"
					:list="info.basicSurveyAnswerOutput || []" :is-scroll="true" :current="tabCurrent" @change="change">
				</u-tabs>
			</view>
		</view>
		<view v-if="info.basicSurveyAnswerOutput && info.basicSurveyAnswerOutput.length > 0"
			class="questionnaire-contain ">
			<view class="questionnaire-answers" :id="'questionnaire-item-'+item.id"
				v-for="(item,index) in info.basicSurveyAnswerOutput" :key="index">
				<view class="item-paragraph-title">
					<image src="/static/images/title.png" mode=""></image>
					<text>{{item.partName}}</text>
				</view>
				<view class="item-title-contain" v-for="(el,num) in item.surveyTemplateQuesDTOList" :key="num">
					<view v-if="!el.answer || el.answer != '[]' " class="answer-contain">
						<view class="item-paragraph">
							<view class="item-title-all">
								<view class="item-title">
									<text class="item-number">0{{num+1}}</text>
									<text class="ques-name">{{el.quesName}}</text>
								</view>
								<view class="questions-item-title-desc" v-if="el.quesDesc">
									{{el.quesDesc}}
								</view>
							</view>
							<view class="answers-all">
								<view v-if="[1,2].includes(Number(el.quesType))" class="item-answers">
									<view
										v-if="[1,2].includes(Number(el.quesType)) && (el.supplementAnswerText || (el.supplementAnswerFile && el.supplementAnswerFile !== '[]')  )"
										class="item-answers-other">
										<view class="image-contian">
											<image-show :enable="true" quantityPerLine="4" width="148" height="148"
												:imgSrc="el.supplementAnswerFile" right="20"
												:key="el.supplementAnswerFile" @viewMore="viewMore"></image-show>
										</view>
										<text class="desc-item-text">{{ el.supplementAnswerText}}</text>
									</view>
									<view v-if="[1].includes(Number(el.quesType)) || el.surveyTemplateOptionDTOList.length > 0" class="select-answers">
										<!-- 单选答案 -->
										<view class="select-answers-text" v-if="[1].includes(Number(el.quesType))">
											{{ el.answer}}
										</view>
										<!-- 单选的补充说明 -->
										<view class="radio-item_contain"
											v-for="(item3,index3) in el.surveyTemplateOptionDTOList" :key="index3">
											<view v-if="[2].includes(Number(el.quesType)) && item3.checked"
												class="select-answers-text">
												{{ item3.optionName}}
											</view>
											<view class="radio-item"
												v-if="item3.radioName == el.answer || item3.checked">
												<view class="image-contian radio-item_img">
													<image-show width="80" height="80" :enable="true"
														quantityPerLine="7" :imgSrc="item3.supplementAnswerFile"
														right="20" :key="item3.supplementAnswerFile"
														:morePosition="true" @viewMore="viewMore">
													</image-show>
												</view>
												<text class="radio-item_desc">{{ item3.supplementAnswerText}}</text>
											</view>
										</view>
									</view>
								</view>
								<!-- 答案为文本输入、补充为文件输入 -->
								<view v-if="[3].includes(Number(el.quesType))" class="other-answers">
									<view class="image-contian">
										<image-show :imgSrc="el.supplementAnswerFile" right="20" :enable="true"
											quantityPerLine="4" width="148" height="148" :key="el.supplementAnswerFile"
											@viewMore="viewMore">
										</image-show>
									</view>
									<text v-if="el.quesType == 3" class="desc-item-text">{{ el.answer}}</text>
								</view>
								<!-- 答案为文件输入、补充为文本输入 -->
								<view v-if="[4].includes(Number(el.quesType))" class="other-answers">
									<view class="image-contian">
										<image-show :imgSrc="el.answer" right="20" :key="el.answer" :enable="true"
											quantityPerLine="4" width="148" height="148" @viewMore="viewMore">
										</image-show>
									</view>
									<text v-if="el.quesType == 3"
										class="desc-item-text">{{ el.supplementAnswerText}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'questionnaire-answer',
		props: {
			info: {
				type: Object,
				default: () => {}
			},
			page: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {
				option: {},
				tabCurrent: 0,
				rollStatus: true,
				typeList: [],
				activeItemStyle: {
					color: '#002FA5',
					fontSize: '28rpx'
				}
			}
		},
		computed: {

		},
		mounted() {
			this.initAnswerScrollTo()
		},
		methods: {
			// 页面高度发生变化，重新获取dom信息
			viewMore() {
				this.initAnswerScrollTo()
			},
			change(index) {
				this.tabCurrent = index
				this.setPageScrollTo()
			},
			initAnswerScrollTo() {
				this.debounce(() => {
					
					console.log('this.info.basicSurveyAnswerOutput',this.info.basicSurveyAnswerOutput);
					
					setTimeout(() => {
						this.typeList = this.info.basicSurveyAnswerOutput.map(item => {
							return {
								id: item.id,
								name: item.name,
								scrollTo: '',
								top: '',
								height: ''
							}
						})
						const offset = 88 + 40
						this.typeList.forEach(item1 => {
							uni.createSelectorQuery().select("#questionnaire-item-" + item1.id)
								.boundingClientRect(item2 => {
									if (item2) {
										// 目标盒子   - 偏移
										item1.scrollTo = item2.top - offset
										item1.top = item2.top
										item1.height = item2.height
									}
								}).exec()
						})
						// console.log(this.typeList)
					}, 500)
				}, 200)
			},
			setPageScrollTo() {
				let result = this.typeList[this.tabCurrent] && this.typeList[this.tabCurrent].scrollTo
				this.rollStatus = false
				uni.pageScrollTo({
					duration: 0,
					scrollTop: result
				})
				// 延时放开限制
				setTimeout(() => {
					this.rollStatus = true
				}, 100)

			},
			setLocationType(ev) {
				if (!this.rollStatus) {
					return
				}
				// 设置10 的偏移值
				const offset = 10
				// 导航栏高度
				// #ifdef H5
				const navigationHeight = 44
				// #endif
				// #ifdef APP-PLUS
				const navigationHeight = 80
				// #endif

				// 避免直接滑动到顶部
				if (ev.scrollTop + offset < 90) {
					this.tabCurrent = 0
					return
				}
				// 避免滚动时一直在计算
				this.debounce(() => {
					this.typeList.forEach((item1, index) => {
						// 目标盒子 - 偏移
						let result = item1.top - navigationHeight
						// 滚动距离+目标高度 >= 页面滚动条高度 && 页面滚动条高度 + 偏移 >= 滚动距离
						if (result + item1.height >= ev.scrollTop && ev
							.scrollTop + navigationHeight >= result) {
							this.tabCurrent = index
						}
					})
				}, 200)
			},

		}
	}
</script>
