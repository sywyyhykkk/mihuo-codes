<template>
	<view class="questionnaire">
		<view class="questionnaire-item"
			 v-for="(item,index) in value" :key="index">
			<view class="questions-item" v-for="(el,num) in item.surveyTemplateQuesDTOList" :key="num">
				<view class="questions-item_item" v-if="questionId == el.id">
					<view class="question-types" v-if="el.quesType<3">{{ el.quesType==1?'单选':el.quesType==2?"多选":''}}</view>
					<!-- 文本题 -->
					<view v-if="Number(el.quesType) === 3" class="input-contain">
						<u-input v-model="el.answer" placeholder-style="color: #999999;font-size: 26rpx;"
							class="describe-input" height="156" type="textarea" placeholder="请输入描述信息" :border="true" />
						<image-upload-new class="marginTop" v-if="el.allowUploadFileFlag == 1" v-model="el.supplementAnswerFile" :key="el.supplementAnswerFile" count="9" />
					</view>
					<!-- 图片上传 -->
					<view class="image-contain" v-if="Number(el.quesType)=== 4">
						<image-upload-new v-model="el.answer" :key="el.answer" count="9" />
						<u-input  v-if="el.allowAddDescFlag == 1" v-model="el.supplementAnswerText" placeholder-style="color: #999999;font-size: 26rpx;"
							class="describe-input marginTop" height="156" type="textarea" placeholder="请输入补充说明" :border="true" />
					</view>
					<view class="questions-item-optionList">
						<!-- 单选 -->
						<view class="optionName" v-if="el.quesType == 1">
							<radio-group @change="radioGroupItemChange($event,el)">
								<view class="group-item">
									<label class="radioGroup" v-for=" (ev,nums) in el.surveyTemplateOptionDTOList" :key="nums" style="width:640rpx">
										<view class="optionName-group">
											<radio class="custom-radio" :value="ev.optionName" :checked="ev.defaultFlag == 1"/>
											<view class="group-label">{{ ev.optionName }}</view>
										</view>
										<block v-if="ev.defaultFlag == 1">
											<u-input v-if="ev.allowAddDescFlag == 1" v-model="ev.supplementAnswerText" placeholder-style="color: #999999;font-size: 26rpx;"
												class="inputGroup marginTop" height="156" type="textarea" placeholder="请输入补充说明" :border="true" />
											<image-upload-new bg="#FFFFFF" class="marginTop" v-if="ev.allowUploadFileFlag == 1" v-model="ev.supplementAnswerFile" :key="ev.supplementAnswerFile" count="9" />
										</block>
									</label>
								</view>
							</radio-group>
						</view>
						<!-- 多选 -->
						<view class="optionName" v-if="el.quesType == 2">
							<u-checkbox-group @change="checkboxGroupChange(index,num)">
								<view class="group-item">
									<view class="option-name-item" v-for=" (ev,nums) in el.surveyTemplateOptionDTOList"
										:key="nums">
										<u-checkbox active-color="#ff5d35" shape="circle" v-model="ev.checked"
											:name="ev.optionName">
											<text class="item-option-name">{{ev.optionName}}</text>
										</u-checkbox>
										<block v-if="ev.checked">
											<u-input v-if="ev.allowAddDescFlag == 1" v-model="ev.supplementAnswerText" placeholder-style="color: #999999;font-size: 26rpx;"
												class="inputGroup marginTop" height="156" type="textarea" placeholder="请输入补充说明" :border="true" />
											<image-upload-new bg="#FFFFFF" class="marginTop" v-if="ev.allowUploadFileFlag == 1" v-model="ev.supplementAnswerFile" :key="ev.supplementAnswerFile" count="9" />
										</block>
									</view>
								</view>
							</u-checkbox-group>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// answerType   1 单选  2多选  3文字输入  4上传
	export default {
		name: 'questionnaire-config',
		props: {
			type: {
				type: String,
				default: ''
			},
			questionId: {
				type: [String,Number],
				default: ''
			},
			value:{
				type: Array,
				default: []
			},
		},
		data() {
			return {}
		},
		methods: {
			checkboxGroupChange(index, num) {
				let tempList = this.value[index]['surveyTemplateQuesDTOList'][num][
					'surveyTemplateOptionDTOList'
				]
				let tempOptionName = []
				tempList.map(item => {
					if (item.checked) {
						tempOptionName.push(item.optionName)
					}else{
						item.supplementAnswerFile = "[]",
						item.supplementAnswerText = ""
					}
				})
				this.value[index]['surveyTemplateQuesDTOList'][num]['answer'] = tempOptionName.join(',')
				this.$forceUpdate()
			},
			radioGroupItemChange(e,data){
				data.answer = e.detail.value || null;
				data.surveyTemplateOptionDTOList.map((item)=>{
					if(e.detail.value != item.optionName){
						item.supplementAnswerFile = "[]",
						item.supplementAnswerText = ""
						item.defaultFlag = "0"
					}else{
						item.defaultFlag = "1"
					}
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.u-radio-group,
	.u-checkbox-group {
		display: flex;
		flex-direction: column;

		.u-radio {
			display: flex;
			align-items: center;
			justify-content: flex-start;
		}

		.item-option-name {
			font-size: 28rpx;
			color: $seconFontColor;
			display: inline-block;
			word-break: break-all;
			text-align: left;
			width: 600rpx;
		}
		.option-name-item {
			margin-left: 6rpx;
			line-height: 64rpx;
		}
	}

	.u-tabs-list {
		margin-bottom: 2rpx;

		.u-tabs-contain {
			margin-bottom: 2rpx;
			border-top-left-radius: $miniBorderRadius;
			border-top-right-radius: $miniBorderRadius;
		}

		/deep/ .u-tab-bar {
			bottom: -6rpx;
		}
	}

	.no-template {
		padding-top: 10rpx;
	}

	.describe-input {
		background-color: #F7F7F7;
		border: 0px;
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


	.questionnaire {
		margin-bottom: 2rpx;

		.item-title {
			font-weight: bold;
			font-size: 30rpx;
			color: $seconFontColor;
			line-height: 42rpx;
			padding-left: 34rpx;
		}

		.item-describe {
			padding-left: 34rpx;
			font-size: 26rpx;
			line-height: 36rpx;
			color: #909199;
			margin-bottom: 24rpx;
		}

		.space-list-sticky {
			// position: -webkit-sticky;
			// position: sticky;
			width: 100%;
			// top: 0rpx;
			// z-index: 99;
			// top: calc(88rpx + var(--status-bar-height));
			// top: calc(var(--status-bar-height));
		}
	}

	.questionnaire-item {
		margin-bottom: 20rpx;

		.title-top {
			display: flex;
			justify-content: space-between;
			align-items: center;
			min-height: 132rpx;

			.right {
				display: flex;
				align-items: center;
				margin-right: 20rpx;
				margin-left: 20rpx;
				min-width: 130rpx;

				text {
					font-size: 26rpx;
					color: #A7A7A7;
				}
			}
		}

		.title-top-active {
			padding-top: 30rpx;
		}

		.questions-item {
			background-color: #FFFFFF;
			.questions-item_item{
				padding: 20rpx 0;
				.question-types{
					font-family: NotoSansHans-Medium;
					font-size: 28rpx;
					color: #000000;
					font-weight: bold;
					padding-bottom: 30rpx;
				}
			}
			.questions-item_item_only{
				background: #F7F7F7;
				border-radius: 20rpx;
			}
			.questions-item-title {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.item-left {
					font-weight: bold;
					font-size: 28rpx;
					line-height: 40rpx;
					color: $themeColor;
					max-width: 460rpx;
				}

				.item-right {
					display: flex;
					align-items: center;

					text {
						color: #303133;
						font-size: 26rpx;
						margin-right: 6rpx;
					}

					.text-warring {
						color: #FF5D35;
						font-size: 26rpx;
						margin-right: 6rpx;
					}

				}
			}

			.required-flag {
				height: 28rpx;
				vertical-align: middle;
				display: inline-block;
				color: #FF5D35;
			}

			.questions-item-title-desc {
				margin-bottom: 20rpx;
				font-weight: bold;
				font-size: 24rpx;
				color: #909199;
				padding-left: 28rpx;
				white-space: pre-wrap;
			}

			.title-margin-default {
				margin-bottom: 10rpx;
			}

			.title-margin {
				margin-bottom: 20rpx
			}

			.questions-item-optionList {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				box-sizing: border-box;
				.optionName {
					width: 100%;
					background: #F7F7F7;
					border-radius: 20rpx;
					padding: 30rpx;
					font-size: 26rpx;
					color: #666666;
					// text-align: center;
					.group-item{
						display: flex;
						flex-direction: column;
					}
				}

			}
		}
	}


	.form-contain {
		height: 100%;
		background-color: #FFF;


		.public-name {
			color: #303133;
			font-size: 28rpx;
		}

		.public-item-bottom {
			background-color: #F7F7F7;
			margin-top: 14rpx;

			.u-input {
				border: 0rpx;
			}
		}


		.title {
			text-align: center;
			padding: 36rpx 0rpx;
			border-bottom: 2rpx solid #EEEEEE;
			color: $seconFontColor;
		}

		.item-contain {
			height: calc(100% - 280rpx);

			.desc-contian {
				border-radius: 10rpx;
				background: #FFFFFF;
				padding: 24rpx 32rpx 38rpx 34rpx;
				margin-top: 4rpx;
				margin-bottom: 8rpx;
			}

			.scroll-Y {
				height: 100%;
			}

		}

		.images-contain {
			padding: 0 32rpx;
		}

		.item-button-contain {
			position: fixed;
			display: flex;
			justify-content: center;
			width: 100%;
			padding-left: 26rpx;
			padding-right: 26rpx;
			@include buttonsafearea();

			.button-list {
				position: relative;
				display: flex;
				width: 100%;
				bottom: 20rpx;

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
	}
	.radioGroup{
		.optionName-group{
			display: flex;
			align-items: center;
			margin-top: 30rpx;
		}
		&:first-child{
			.optionName-group{
				margin-top: 0;
			}
		}
	}
	/deep/.custom-radio {
            &::before {
              display: none;
            }

            .uni-radio-wrapper,
            .wx-radio-wrapper {
              text {
                color: #000;
                font-size: 28rpx;
                font-weight: 500;
              }
            }

            .uni-radio-input,
            .wx-radio-input {
              width: 30rpx;
              height: 30rpx;
              margin-right: 23rpx;
              border: 1px solid #e6e6e6;
            }

            .uni-radio-input-checked,
            .wx-radio-input-checked {
              position: relative;
              border-color: #fe6e32 !important;
              background-color: #fff !important;

              &::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: auto;

                width: 14rpx;
                height: 14rpx;
                border-radius: 50%;

                background-color: #fe6e32;
              }
            }
          }
		.group-label{
			font-family: NotoSansHans-Medium;
			font-size: 24rpx;
			color: #000000;
		}
		/deep/.u-checkbox__icon-wrap--checked{
			border-color: #fe6e32 !important;
            background-color: #fff !important;
			.uicon-checkbox-mark{
				&::before {
					content:"";
					width: 14rpx;
					height: 14rpx;
					border-radius: 50%;
					background-color: #fe6e32;
					display: flex;
					align-items: center;
				}
			}
		}
		/deep/.u-checkbox__icon-wrap{
			.uicon-checkbox-mark{
				&::before {
					content: '' !important;
				}
			}
		}
	.marginTop{
		margin-top: 20rpx;
	}
	.inputGroup{
		background: #FFFFFF;
		border: 0;
	}
</style>
