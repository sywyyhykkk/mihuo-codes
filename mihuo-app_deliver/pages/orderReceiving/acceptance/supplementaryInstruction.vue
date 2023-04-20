<template>
	<view>
		<public-module></public-module>

		<view class="release">
			<form>
				<view class="bg_fff" style="margin-top: 10rpx;">
					<view class="top_nav">
						<text class="left_nav">存在问题</text>
					</view>
					<view class="textarea_box">
						<textarea placeholder-style="color:#909199" placeholder="请输入存在的问题" style="width: 100%;
							height: 166rpx;padding: 24rpx 26rpx;box-sizing: border-box;background: #F7F7F7;
							border-radius: 10rpx;font-size: 25rpx;" v-model="form.appendQues" />
						<view class="upload" :key="imageUploadIndex">
							<image-upload-new :uploadType="uploadType" :count="9" v-model="form.appendPicFiles" />
						</view>
					</view>
					<view class="voice-contain" :key="imageUploadIndex + 1">
						<sound-recording v-model="appendVoiceFile" />
					</view>
				</view>
				<view class="bg_fff" style="margin-top: 10rpx;">
					<view class="top_nav">
						<text class="left_nav">整改方案</text>
					</view>
					<view class="textarea_box">
						<textarea placeholder-style="color:#909199" placeholder="请输入整改方案" v-model='form.appendPlan'
							style="width: 100%;
							height: 166rpx;padding: 24rpx 26rpx;box-sizing: border-box;background: #F7F7F7;
							border-radius: 10rpx;font-size: 25rpx;" />
					</view>
				</view>


				<view class="btm_btn">
					<button class="confirm" type="primary" @click="submit">确认提交</button>
				</view>
			</form>
		</view>
	</view>
</template>

<script>
	import {
		CommonUpload
	} from '@/plugins/uploadPic.js';
	export default {
		data() {
			return {
				uploadType: ['图片', '视频'],
				chooseVoiceObject: {},
				fileObject: {},
				conValue: '',
				option: {},
				appendVoiceFile: {},
				imageUploadIndex: 1,
				form: {
					appendPicFiles: "",
					appendPlan: "",
					appendQues: "",
					appendVoiceFile: "",
				}
			}
		},
		watch: {
			appendVoiceFile(newVal, oldVal) {
				this.chooseVoice(newVal)
			}
		},
		onShow() {

		},
		onLoad() {
			const eventChannel = this.getOpenerEventChannel();
			eventChannel.on('supplementaryInstruction', (data) => {


				this.option = data
				this.setDataInitial()
			});
		},
		methods: {
			setDataInitial() {
				let tempParameter = this.option
				if (JSON.stringify(tempParameter) !== '{}') {
					this.form.appendPlan = tempParameter.appendPlan
					this.form.appendQues = tempParameter.appendQues
					this.form.appendVoiceFile = tempParameter.appendVoiceFile
					this.appendVoiceFile = this.$isJSON(tempParameter.appendVoiceFile) ? JSON.parse(tempParameter
						.appendVoiceFile) : {}
					this.form.appendPicFiles = tempParameter.appendPicFiles
					this.imageUploadIndex++
				}

			},
			submit() {
				if (!this.form.appendQues) {
					this.$util.toast("请填写存在的问题");
					return
				}
				if (!this.$checkUploadProcess(this.form.appendPicFiles)) {
					return
				}

				uni.$emit('replenish', JSON.stringify(this.form))
				uni.navigateBack({
					delta: 1
				})
			},
			async chooseVoice(file) {
				if (!file) {
					return
				}

				if (file.path) {
					let temp = {
						type: 'video',
						timeLength: file.duration,
						url: await this.$CommonUpload(file.path)
					}
					this.form.appendVoiceFile = JSON.stringify(temp)
				} else {
					this.form.appendVoiceFile = ''
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.remediation {
		background: #FFFFFF;
		border-radius: 16rpx;
		margin-top: 6rpx;
		margin-left: 20rpx;
		margin-right: 20rpx;
	}

	.release {
		margin: 0 20rpx;

		.top_nav {
			.left_nav {
				font-weight: bold;
				font-size: $middleFontSize;
				color: $darkTitle;
			}
		}

		.bg_fff {
			margin-bottom: 10rpx;
			padding: 30rpx;
			background: #FFFFFF;
			border-radius: 10rpx;

			.inp_box {
				margin-bottom: 25rpx;
				padding: 0 16rpx 15rpx 0;
				border-bottom: 1.5rpx dashed #EEEEEE;
			}

			.textarea_box {
				padding: 25rpx 0;
				padding-bottom: 10rpx;

				.upload {
					margin: 25.5rpx 0;

					.upload_tool {
						width: 108rpx;
						height: 108rpx;
						border: 1.5rpx solid #E0E0E0;
						box-sizing: border-box;
						border-radius: 10rpx;
					}
				}
			}
		}
	}

	.position {
		height: 108rpx;
		margin: 6rpx 0 251rpx;
		padding: 0 42rpx;
		background: #FFFFFF;
		border-radius: 10rpx;

		.label {
			color: #909199;
			font-size: $middleFontSize;
		}

		.address {
			font-size: $middleFontSize;
			font-weight: bold;
			color: $fontColor33;
		}

		image {
			width: 32rpx;
			height: 36rpx;
		}
	}

	.btm_btn {
		margin: 76rpx 47rpx;
		text-align: center;

		.confirm {
			display: inline-block;
			width: 100%;
			height: 80rpx;
			text-align: center;
			line-height: 80rpx;
			font-weight: bold;
			font-size: $smallFontSize;
			border-radius: 10rpx;
			background: $themeColor;
		}
	}

	.align-items {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.center {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
