<template>
	<view>
		<z-nav-bar :title="activity.title"></z-nav-bar>
		<view class="form-container">
			<view class="form-item flex-center" v-for="item, index in quesionList" :key="index">
				<view class="question">
					{{ item.title }}
				</view>
				<view class="answer text-answer" v-if="item.type == 1">
					<uni-easyinput :clearable="false" text v-model="answerList[index].value" placeholder="请输入您的答案"
						fontColor="#333333" :textRight="true" fontSize="28" :placeholderStyle="placeholderStyle"
						:inputBorder="false" />
				</view>
				<view class="answer text-answer" v-if="item.type == 2">
					<radio-group v-model="answerList[index].value">
						<view v-for="radio, index2 in item.radioList" :key="index2" class="radio-box">
							<radio shape="circle" :value="radio.value" class="custom-radio"
								@click="handleClickRadio(radio, index, index2)">
								<text :style="{ color: answerList[index].value === radio.value ? '#FE6E32' : '#000'}">
									{{ radio.label }}
								</text>
							</radio>
						</view>
					</radio-group>
				</view>
				<view class="answer text-answer" v-if="item.type == 3">
					<u-checkbox-group :wrap="true" class="check-box">
						<u-checkbox @change="checkboxChange($event, index, index2)" v-model="checkbox.checked" active-color="#FE6E32"
							class="custom-checkbox" shape="circle" v-for="(checkbox, index2) in item.checkboxList"
							:key="index2" :name="item.label">
							<text class="text" :style="{ color: checkbox.checked ? '#FE6E32' : '#000'}">
								{{ checkbox.label }}
							</text>
						</u-checkbox>
					</u-checkbox-group>
				</view>
			</view>
		</view>
		<bottom-button title="提交" bgColor="transparent" @click="submitActivity">
		</bottom-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				answerList: [],
				placeholderStyle: 'font-size: 28rpx; font-family: Noto Sans S Chinese; color: #B3B3B3; line-height: 34rpx;',
				options: {},
				activity: {},
				quesionList: [],
				currentValue: {}
			}
		},
		onLoad(options) {
			this.options = options
			this.getData()
		},
		methods: {
			getData() {
				this.$httpApi.getAppEventById(this.options.id).then(res => {
					this.activity = res
					this.quesionList = JSON.parse(res.content)
					this.quesionList.forEach(item => {
						if (item.type === 1 || item.type === 2) {
							//  文本和单选
							this.answerList.push({
								type: item.type,
								value: ''
							})
						} else {
							const value = []
							item.checkboxList.forEach(checkbox => {
								value.push({
									...checkbox,
								})
							})
							this.answerList.push({
								type: item.type,
								value: value
							})
						}
					})
				})
			},
			submitActivity() {
				this.$httpApi.submitEvent({
					eventsId: this.options.id,
					eventsSubmit: JSON.stringify(this.answerList)
				}).then(res => {
					if(res){
						this.$util.toast('报名成功!')
						setTimeout(() => {
							this.toTab('/pages/home/home')
						}, 1500)
					}
				})
			},
			handleClickRadio(item, index) {
				this.answerList[index].value = item
			},
			checkboxChange(e, index, index2) {
				this.answerList[index].value[index2].checked = e.value
			}
		}
	}
</script>

<style lang="scss" scoped>
	.form-container {
		width: 100vw;
		padding: 30rpx;

		.form-item {
			width: 100%;
			min-height: 114rpx;
			height: max-content;
			border-bottom: 2rpx #f0f0f0 solid;

			.question {
				width: 50%;
				font-size: 28rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				color: #000000;
				line-height: 114rpx;
			}

			.answer {
				width: 50%;
			}

			.check-box {
				width: 350rpx;
				padding: 30rpx 0rpx;
				text-align: right;
					
				.custom-checkbox {
					margin: 20rpx 0;
					display: flex;
					justify-content: flex-end;

					.text {
						color: #000;
						font-size: 28rpx;
						font-weight: 500;
						margin-left: 10rpx;
					}
				}
			}

			.radio-box {
				padding: 30rpx 0;
				text-align: right;
			}

			/deep/ .custom-radio {
				width: 330rpx;

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
					border: 2rpx solid #e6e6e6;
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
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
