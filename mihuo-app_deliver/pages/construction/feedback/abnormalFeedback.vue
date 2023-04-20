<template>
	<view class="abnormalFeedback">
		<z-nav-bar :bgColor="['#FFF','#FFF']" fontColor="" title="异常反馈">
			<view slot="right" class="nav-refresh" @click="feedbackRecord">
				反馈记录
			</view>
		</z-nav-bar>
		<view class="abnormalFeedback-information">
			<order-user-information :orderInfo="{}"></order-user-information>
			<view class="feedback-content">
				<view class="title">
					<view class="title-left">请输入反馈内容</view>
					<view class="title-right">
						<u-icon name="list-dot" color="$themeColor" size="46"></u-icon>
						<text class="phrase" @click="getRequirementListShow('sendOrderPopupPhrase')">常用语</text>
					</view>
				</view>
				<send-order-popup ref="sendOrderPopupPhrase" titleName="请选择常用语" :commitStatus="false">
					<view class="workers-type-item-value phrase-list">
						<view @click="getPhraseListType(item,index)" v-for="(item,index) in phraseList" :key="index"
							class="item-phrase">{{item.label}}</view>
					</view>
				</send-order-popup>
				<view class="entry-information">
					<u-input v-model="form.requirementDesc" class="describe-input" height="190" type="textarea"
						placeholder="请输入需求描述文字" :border="true" />
					<view class="file-contain">
						<image-upload-new v-model="form.pics" :uploadType="uploadType" />
					</view>
				</view>
				<view class="voice-contain">
					<sound-recording @chooseVoice="chooseVoice" />
				</view>
			</view>
		</view>
		<view class="submit" @click="feedbackRecordSubmit">
			提交
		</view>
	</view>
</template>

<script>
	import {
		CommonUpload
	} from '@/plugins/uploadPic.js';
	import {
		debounce
	} from "@/plugins/utils.js"
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				option: {},
				uploadType: ['图片', '视频'],
				fileObject: {},
				chooseVoiceObject: {},
				phraseList: [],
				form: {
					audio: '',
					content: '',
					orderCode: '',
					personId: '',
					pics: ''
				}
			}
		},
		onLoad(option) {
			this.option = option
			this.getPhrase()
		},
		methods: {
			...mapMutations(['setLoadingShow']),
			feedbackRecord() {
				this.toPage('/pages/construction/feedback/feedbackRecord')
			},
			getRequirementListShow(str) {
				this.$refs[str].requirementListShow = true
			},
			getPhraseListType(item, index) {
				console.log("item", item, index)
			},
			getPhrase() {
				// this.$http.get(`${this.apiStr}admin/dict/type/issue_order_description`)
				// 	.then(res => {
				// 		if (res.data) {
				// 			this.phraseList = res
				// 		}
				// 	})
			},
			feedbackRecordSubmit() {
				let that = this
				if(!this.$checkUploadProcess(this.form.pics)){
					return
				}
				debounce(function() {
					that.debounce()
				}, 200)
			},
			debounce() {
				this.$httpApi.bizorderfeedbackSave(this.form).then(res => {
					if (res.data) {
						this.$util.toast("反馈成功");
					}
				})
			},
			async chooseVoice(file) {
				if (file.path) {
					let temp = {
						type: 'audio',
						timeLength: file.duration,
						url: await this.$CommonUpload(file.path)
					}
					this.form.audio = JSON.stringify(temp)
				} else {
					this.form.audio = ''
				}
			},
			getAttachment(file) {

				this.fileObject = file
			}
		}
	}
</script>

<style lang="scss" scoped>
	.nav-refresh {
		color: #909199;
		font-size: 28rpx;
		margin-right: 34rpx;
	}

	.abnormalFeedback-information {
		.feedback-content {
			margin: 0 20rpx;
			border-radius: 10px 10px 0px 0px;
			background-color: #FFFFFF;
			min-height: 608rpx;
			margin-bottom: 252rpx;

			.title {
				display: flex;
				justify-content: space-between;
				padding: 38rpx 16rpx 24rpx 24rpx;

				.title-left {
					font-weight: bold;
					font-size: 30rpx;
					line-height: 42rpx;
					color: $seconFontColor;
				}

				.title-right {
					display: flex;
					align-items: center;

					.u-icon--right {
						margin-right: 12rpx;
					}

					.phrase {
						font-size: 28rpx;
						line-height: 40rpx;
						color: #606166;

					}
				}
			}

			.entry-information {
				margin: 0 30rpx 0rpx 30rpx;

				.describe-input {
					background-color: #F7F7F7;
					margin-bottom: 20rpx;
				}
			}

			.voice-contain {
				padding: 0 16rpx 24rpx 16rpx;
			}
		}

	}

	.submit {
		background: $themeColor;
		border-radius: 10rpx;
		font-weight: bold;
		font-size: 28rpx;
		line-height: 40rpx;
		text-align: center;
		width: 624rpx;
		margin: 0 auto;
		padding: 24rpx;
		color: #FFFFFF;
	}
</style>
