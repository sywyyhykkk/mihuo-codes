<template>
	<view class="add-disclosure-contain">
		<view class="form-contain public-mg">
			<view class="form-item">
				<view class="form-lable">测量人</view>
				<u-input placeholder v-model="form.area" type="digit" :border="false" input-align="right"
					placeholder="请选择" />
				<image :src="'../../static/demo/icon_right.png'" class="right-image"></image>
			</view>
			<view class="form-item">
				<view class="form-lable">测量日期</view>
				<u-input placeholder class="form-input" v-model="form.time" @click="timeShow = true" :border="false"
					input-align="right" placeholder="请选择" />
				<u-picker v-model="timeShow" mode="time" @confirm="confirmTime"></u-picker>
				<image :src="'../../static/demo/icon_right.png'" class="right-image"></image>
			</view>
			<view class="form-item">
				<view class="form-lable">房屋面积</view>
				<u-input placeholder v-model="form.area" type="digit" :border="false" input-align="right"
					placeholder="请输入房屋面积" />
				<view class="right-image"></view>
			</view>
		</view>
		<view class="questionnaire public-mg">
			<view class="questionnaire-item" v-for="(item,index) in details" :key="index">
				<!--   -->
				<view class="questions-item" v-for="(el,num) in item.questionsList" :key="num">
					<view class="questions-item-title">{{el.title}}</view>
					<view class="questions-item-optionList" v-show="el.answerType !== 3">
						<view class="optionName" v-for=" (ev,nums) in el.optionList" :key="nums"
							:class="[el.groupingIndex.indexOf(nums) !== -1 ? 'results-status-active':'']"
							@click="getActive(index,num,nums,el)">{{ev.optionName}}
							<text class="selected" v-show="el.groupingIndex.indexOf(nums) !== -1">
								<u-icon name="checkmark" class="checkmark-icon" color="#fff" size="24"></u-icon>
							</text>
						</view>
					</view>
				</view>
				<view class="form-contain">
					<view class="form-item">
						<view class="form-lable">测量人</view>
						<u-input placeholder v-model="form.area" type="digit" :border="false" input-align="right"
							placeholder="请输入" />
						<view class="right-image"></view>
					</view>
				</view>
			</view>
			<view class="describe-contain">
				<view class="describe-label">备注内容</view>
						<u-input v-model="form.desc" class="describe-input" height="190" maxlength="200" type="textarea"
					placeholder="请输入备注" :border="true" count/>

			</view>
			<view class="file-contain">
				<view class="title">上传图片</view>
				<view class="img-contain">
					<image-upload :uploadType="['图片']" :count="99" v-model="form.pic" />
				</view>
				<view class="voice-contain">
					<sound-recording @chooseVoice="chooseVoice" />
				</view>
			</view>
		</view>

		<view class="submit-text" @click="submit">确认提交</view>
	</view>
</template>

<script>
	// 开工交底
	// answerType   1 单选  2多选  3文字输入  4上传
	export default {
		data() {
			return {
				key: '',
				timeShow: false,
				resultIndex: 0,
				voiceFile: {},
				details: '[{"paragraphName":"大法师的","describe":"手动阀","questionsList":[{"title":"手动阀","describe":"手动阀","answerType":1,"answerTypeName":"","groupingIndex":[0],"optionList":[{"optionName":"是","checkedIndex":0},{"optionName":"否","checkedIndex":0}]},{"title":"上的","describe":"上的","answerType":2,"answerTypeName":"","groupingIndex":[0],"optionList":[{"optionName":"上的","checkedIndex":0},{"optionName":"手动阀","checkedIndex":0},{"optionName":"啊啊","checkedIndex":0}]}]}]',
				form: {
					time: '',
					location: '云纺国际商厦A座',
					area: '',
					desc: '',
					pic: {},

				},

			}
		},
		onLoad() {
			this.details = JSON.parse(this.details)
			console.log("this.details", this.details)
		},
		methods: {
			confirmTime(even) {
				this.form.time = even.year + '-' + even.month + '-' + even.day
			},
			getActive(index, num, nums, el) {
				if (el.answerType === 2) { // 多选
					this.details[index]['questionsList'][num]['groupingIndex'].push(nums)
				} else if (el.answerType == 1) { // 单选
					this.details[index]['questionsList'][num]['groupingIndex'][0] = nums
					this.$forceUpdate()
				}
				console.log("nums", this.details[index]['questionsList'][num])
			},
			getMultiSelect() {

			},
			chooseVoice(file) {
				this.voiceFile = file
			},
			getConstructionSite() {
				uni.navigateTo({
					url: '/pages/mapChoose/mapChoose',
					animationType: 'slide-in-bottom',
				})
			},
			submit() {
				this.debounce(() => {
					// console.log("form",this.form)
					this.toPage('/pages/construction/disclosure/disclosureDetails')
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.public-mg {
		margin-left: 20rpx;
		margin-right: 20rpx;
	}

	.add-disclosure-contain {
		padding-top: 12rpx;
		padding-bottom: 20rpx;

		.form-contain {
			margin-bottom: 2rpx;
		}

		.send-user {
			margin-bottom: 98rpx;
		}

		.form-contain,
		.send-user {

			.form-item {
				display: flex;
				border-radius: 10rpx;
				justify-content: space-between;
				align-items: center;
				height: 120rpx;
				padding: 0rpx 48rpx 0rpx 48rpx;
				margin-bottom: 2rpx;
				background-color: #FFFFFF;

				&:last-child {
					margin-bottom: 0;
				}

				.form-lable {
					font-weight: bold;
					font-size: 28rpx;
					color: #46464E;
				}

				.form-input {
					font-size: 28rpx;
					text-align: right;
					color: #999999;

				}

				.right-image {
					height: 32rpx;
					width: 32rpx;
					margin-left: 20rpx;
				}
			}
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

			.questions-item {
				background-color: #FFFFFF;
				padding: 48rpx 0 52rpx 38rpx;
				margin-bottom: 2rpx;

				.questions-item-title {
					margin-bottom: 36rpx;
					font-weight: bold;
					font-size: 28rpx;
					line-height: 40rpx;
					color: #333333;

				}

				.questions-item-optionList {
					display: flex;
					flex-direction: row;

					.optionName {
						display: flex;
						width: 152rpx;
						justify-content: center;
						padding: 16rpx 0 20rpx 0;
						border: 2rpx solid #D9D9D9;
						font-size: 26rpx;
						color: #666666;
						text-align: center;
						border-radius: 10rpx;
						margin-right: 38rpx;

						&:last-child {
							margin-right: 0rpx;
						}
					}

					.results-status-active {
						border: 2rpx solid $themeColor !important;
						color: $themeColor !important;
						position: relative;

						.selected {
							width: 0;
							height: 0;
							border-bottom: 44rpx solid $themeColor;
							border-left: 44rpx solid transparent;
							position: absolute;
							right: 0rpx;
							bottom: 0rpx;
						}

						.checkmark-icon {
							position: relative;
							top: 12rpx;
							left: -24rpx;
							transform: scale(0.8);
						}
					}

				}
			}

			.describe-contain {
				padding: 48rpx 32rpx 52rpx 32rpx;
				background-color: #FFFFFF;
				margin-bottom: 2rpx;

				.describe-label {
					font-weight: bold;
					font-size: 28rpx;
					color: #46464E;
					margin-bottom: 20rpx;
					padding-left: 20rpx;
				}

				.describe-input {
					background-color: #F7F7F7;
					margin-bottom: 20rpx;
					border: 0px;
				}
			}

			.file-contain {
				.title {
					font-size: 28rpx;
					color: #46464E;
					margin-bottom: 24rpx;
				}

				padding: 24rpx 50rpx 32rpx 50rpx;
				background-color: #FFFFFF;
			}

		}

		.submit-text {
			background: $themeColor;
			border-radius: 10rpx;
			padding: 24rpx 156rpx;
			text-align: center;
			color: #FFFFFF;
			margin: 68rpx 60rpx 114rpx 60rpx;
		}
	}
</style>
