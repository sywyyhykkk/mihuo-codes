<template>
	<u-popup v-model="showPopup" border-radius="30" height="600" mode="bottom" @close="close"
		:safe-area-inset-bottom="false" :closeable="true">
		<view class="criteria-contian">
			<view class="tittle">
				{{title}}
			</view>
			<view class="list-contain">
				<scroll-view :scroll-y="true" class="scroll-Y">
					<view class="answer-contian">
						<!-- 文本 -->
						<view class="input-contain" v-if="info.quesType == 3">
							<textarea v-model="formAnswer" maxlength="140"
								style="padding:6px 9px;border-radius: 8rpx;background: #F7F7F7;width: 100%;height:200rpx;font-size:28rpx"
								placeholder="请输入描述信息" placeholder-style="color:#909199;font-size: 13px" />
						</view>
						<!-- 图片上传 -->
						<view class="image-contain" v-if="info.quesType == 4">
							<image-upload-new v-model="formAnswer" :key="formAnswer" count="9" />
						</view>

						<view class="questions-item-optionList">
							<!-- 单选 -->
							<view class="optionName" v-if="info.quesType == 1">
								<u-radio-group v-model="formAnswer">
									<view class="option-name-item"
										v-for=" (ev,nums) in info.surveyTemplateOptionDTOList" :key="nums">
										<u-radio active-color="#002FA5" :name="ev.optionName">
											<text class="item-option-name">{{ev.optionName}}</text>
										</u-radio>
									</view>
								</u-radio-group>
							</view>

							<!-- 多选 -->
							<view class="optionName" v-if="info.quesType == 2">
								<u-checkbox-group @change="checkboxGroupChange">
									<view class="option-name-item"
										v-for=" (ev,nums) in info.surveyTemplateOptionDTOList" :key="nums">
										<u-checkbox active-color="#002FA5" shape="circle" v-model="ev.checked"
											:name="ev.optionName">
											<text class="item-option-name">{{ev.optionName}}</text>
										</u-checkbox>
									</view>
								</u-checkbox-group>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<view class="item-button-contain">
				<view class="button-list">
					<view class="item-button" :class="[item.status ? 'item-button-active':'']"
						v-for="(item,index) in buttonList" :key="index" @click="getButton(item)">
						{{item.name}}
					</view>
				</view>
			</view>
		</view>
	</u-popup>
</template>
<script>
	import {
		getUnique
	} from '@/plugins/utils.js'
	export default {
		props: {
			title: {
				type: String,
				default: '筛选'
			},
			value: {
				type: Boolean,
				default: false
			},
			info: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {
				showPopup: false,
				formAnswer: '',
				buttonList: [{
						name: '取消',
						status: false
					},
					{
						name: '确认',
						status: true
					}
				]
			}
		},
		computed: {

		},
		watch: {
			value(val) {
				if (val) {
					this.open();
				} else if (!this.showPopup) {
					this.close();
				}
				this.showPopup = false;
			}
		},
		mounted() {
			this.value && this.open();
		},
		methods: {
			open() {
				this.$nextTick(() => {
					this.showPopup = true
					this.$emit('open')
				})
			},
			close() {
				this.$nextTick(() => {
					this.$emit('close')
					this.formAnswer = ''
					this.showPopup = false
				})
			},
			radioGroupChange() {
			
			},
			radioGroupItemChange() {
			
			},
			checkboxGroupChange(item) {
				this.formAnswer = item.join(',')
			},
			getButton(item) {
				if (item.name == '取消') {
					this.$emit('close')
				} else {
					this.$emit('submit', this.formAnswer)
					this.close()
				}
			}
			
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */

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
			height: calc(100% - 116rpx - 108rpx);
		}

		.scroll-Y {
			height: 100%;
		}

		.answer-contian {
			padding-top: 40rpx;
			padding-bottom: 40rpx;

			.input-contain {
				background-color: #F7F7F7;
				margin-top: 14rpx;

				.u-input {
					border: 0rpx;
				}
			}

			.questions-item-optionList {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;

				.optionName {
					font-size: 26rpx;
					color: #666666;
					text-align: center;
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
				color: #909199;
				background-color: #E8E8E8;
				font-size: 24rpx;
				border-radius: 10rpx;
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
