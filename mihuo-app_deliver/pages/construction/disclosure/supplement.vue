<template>
	<view class="complaint-contain-all">
		<view class="complaint-contain">
			<view class="file-contain-all">
				<view class="text-contain">
					<view class="title-left">补充内容</view>
					<u-input v-model="form.addContent" class="describe-input" height="176" type="textarea"
						placeholder="请输入补充内容" :border="true" />
				</view>
				<view class="img-contain">
					<view class="title">上传图片</view>
					<image-upload-new v-model="fileImage" />
				</view>
				<view class="voice-contain">
					<sound-recording @chooseVoice="chooseVoice" />
				</view>
			</view>
		</view>

		<mihuo-bottom-button :buttonList="buttonList" @click="submit()"></mihuo-bottom-button>
	</view>

</template>

<script>
	import {
		mapState,
	} from 'vuex'
	export default {
		data() {
			return {
				form: {
					addFiles: [],
					addContent: '',
					discloseId: '',
					createPersonId: '',
					createPersonName: '',
					createSkillId: '',
					createSkillName: '',
				},
				buttonList: [{
					name: '确认添加',
					status: true
				}],
				fileAllList: [],
				fileImage: '',
				fileAudio: '',
			}
		},
		onLoad(option) {
			this.option = option
			this.setParameter()
		},
		onShow() {

		},
		computed: {
			...mapState(['userPersonInfo'])
		},
		methods: {
			setParameter() {
				this.form.createPersonId = this.userPersonInfo.personId
				this.form.createPersonName = this.userPersonInfo.name
				this.form.createSkillId = this.userPersonInfo.skillId
				this.form.createSkillName = this.userPersonInfo.skillName
			},
			async chooseVoice(file) {
				if (file.path) {
					let temp = {
						type: 'audio',
						timeLength: file.duration,
						url: await this.$CommonUpload(file.path)
					}
					this.fileAudio = temp
				} else {
					this.fileAudio = ''
				}
			},
			submit() {
				if (!this.form.addContent) {
					this.$util.toast("请填写补充内容");
					return
				}
				if (!this.$checkUploadProcess(this.fileImage)) {
					return
				}

				this.debounce(() => {
					// 附件处理
					this.fileAllList = []
					let tempImages = JSON.parse(this.fileImage)
					if (tempImages.length > 0) {
						tempImages.forEach(el => {
							this.fileAllList.push({
								name: '',
								timeLength: '',
								type: this.$setFileType(el.url),
								url: el.url
							})
						})
					}
					if (this.fileAudio) {
						this.fileAllList.push({
							name: '',
							timeLength: this.fileAudio.timeLength,
							type: this.fileAudio.type,
							url: this.fileAudio.url
						})
					}
					if (this.fileAllList.length > 0) {
						this.form.addFiles = this.fileAllList
					}

					this.form.discloseId = this.option.id
					this.$httpApi.saveDiscloseAdd(this.form).then(res => {
						this.$util.toast(`操作成功~`);
						uni.navigateBack()
					})
				}, 200)
			}

		}
	}
</script>

<style lang="scss" scoped>
	/deep/ .u-select__header {
		background-color: #FFFFFF;
	}

	.complaint-contain-all {
		padding-bottom: 140rpx;
	}

	.punishment-contain {
		background-color: #FFFFFF;
		margin: 0rpx 20rpx 0rpx 20rpx;
		padding: 30rpx 40rpx 30rpx 40rpx;

		.forfeit-logList {
			margin-bottom: 20rpx;
		}

		.file {
			display: flex;
			flex-wrap: wrap;

			.item-image {
				margin-right: 20rpx;
				margin-bottom: 20rpx;
			}
		}

		.item-contain {
			display: flex;

			.label {
				padding-left: 20rpx;
				font-size: 24rpx;
				color: #909199;

				text {
					padding-left: 10rpx;
					font-size: 24rpx;
					color: #ff5d35;
				}
			}
		}

		.title {
			font-size: 28rpx;
			font-weight: bold;
			color: #333333;
			margin-bottom: 10rpx;
		}

		.file {
			margin-bottom: 46rpx;
			margin-top: 28rpx;
			padding-left: 20rpx;

			.record-item-img {
				width: 150rpx;

			}
		}

		.punishment-type {
			.title {
				font-size: 30rpx;
				font-weight: bold;
				color: #333333;
				margin-bottom: 28rpx;
			}
		}
	}

	.apply-list-contain {
		background-color: #FFFFFF;
		padding: 48rpx 48rpx 56rpx 40rpx;

		.type-title {
			display: flex;
			justify-content: space-between;
			margin-bottom: 34rpx;

			.left {
				flex: 1;
				font-size: 28rpx;
				color: #909199;
			}

			.right {
				flex: 1;
				justify-content: space-between;
				display: flex;

				.title {
					font-weight: bold;
					font-size: 30rpx;
					color: $seconFontColor;
				}

				.determine {
					font-weight: bold;
					font-size: 28rpx;
					color: $themeColor;
				}
			}
		}

		.grouping-contain {
			margin-bottom: 28rpx;

			.name {
				font-size: 28rpx;
				color: #909199;
				padding-left: 28rpx;
				margin-bottom: 28rpx;
			}

			.options-list {
				display: flex;
				flex-flow: wrap;
			}

			.options-item {
				display: flex;
				min-width: 210rpx;
				padding: 24rpx 0rpx;
				border: 2rpx solid #D9D9D9;
				font-size: 26rpx;
				color: #666666;
				justify-content: center;
				border-radius: 10rpx;
				margin-right: 10rpx;
				margin-bottom: 16rpx;

				&:last-child {
					margin-right: 0rpx;
				}
			}

			.options-item-acitve {
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

	.complaint-contain {
		padding-top: 16rpx;

		.complaint-type {
			display: flex;
			margin: 0rpx 20rpx 4rpx 20rpx;
			padding: 42rpx 40rpx 42rpx 36rpx;
			justify-content: space-between;
			background-color: #FFFFFF;
			border-radius: 5px;

			.item-label {
				font-weight: bold;
				font-size: 28rpx;
				color: #333333;
			}

			.item-value {
				display: flex;
				align-items: center;
				justify-content: space-between;

				text {
					font-size: 28rpx;
					color: #909199;
					margin-right: 32rpx;
				}

				image {
					width: 14rpx;
					height: 26rpx;
				}

			}
		}

		.file-contain-all {

			margin: 0rpx 20rpx 4rpx 20rpx;

			border-radius: 10rpx;

			.text-contain {
				padding: 30rpx 40rpx 42rpx 40rpx;
				margin-bottom: 2rpx;
				background: #FFFFFF;
				border-radius: 10rpx;

				.title-left {
					font-weight: bold;
					font-size: 30rpx;
					color: #46464E;
					margin-bottom: 22rpx;
				}

				.describe-input {
					background-color: #F7F7F7;
					border: 0px;
				}
			}


			.img-contain {
				padding: 30rpx 40rpx 42rpx 40rpx;
				background: #FFFFFF;
				border-radius: 10rpx;

				.title {
					font-weight: bold;
					font-size: 28rpx;
					color: #46464E;
					margin-bottom: 24rpx;
				}
			}

			.voice-contain {
				padding: 0rpx 40rpx 42rpx 40rpx;
				background: #FFFFFF;
				border-radius: 10rpx;
			}

			.file-title {
				font-size: 30rpx;
				color: $seconFontColor;
				font-weight: bold;
				margin-bottom: 22rpx;
			}
		}

		.personnel-information {
			background-color: #FFFFFF;
			box-shadow: inset 0px 3px 3px rgba(183, 183, 183, 0.25);
			min-height: 142rpx;
			padding: 46rpx 42rpx 24rpx 38rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 34rpx;

			.left {
				display: flex;

				.name-contain {
					display: flex;
					align-items: center;
					margin-left: 16rpx;

					.label {
						font-size: 28rpx;
						line-height: 40rpx;
						color: $seconFontColor;
						font-weight: bold;
						margin-right: 16rpx;
					}

					.value {
						font-size: 26rpx;
						line-height: 36rpx;
						color: #909199;
						font-weight: bold;
					}
				}
			}

			.right {
				display: flex;

				image {
					width: 28rpx;
					height: 28rpx;
					margin-right: 14rpx;
				}

				text {
					font-size: 13px;
					font-weight: bold;
					line-height: 18px;
					color: #606166;
				}
			}
		}

		.image-contain {
			.image-item {
				padding: 0 20rpx 34rpx 20rpx;

				.image-title {
					margin-bottom: 32rpx;
					font-weight: bold;
					font-size: 28rpx;
					color: $seconFontColor;
					padding-left: 46rpx;
				}

				.record-item-img {
					margin-bottom: 20rpx;
				}
			}
		}

		/deep/ .u-tab-bar {
			bottom: -4rpx;
		}
	}

	.submit-text {
		display: flex;
		position: fixed;
		bottom: 0;
		justify-content: center;
		width: 624rpx;
		margin: 20rpx 64rpx 20rpx 64rpx;
		background: $themeColor;
		color: #FFFFFF;
		font-weight: bold;
		font-size: 28rpx;
		line-height: 88rpx;
		border-radius: 10rpx;
	}


	.submit-text-contain {
		// background-color: #FFFFFF;
		padding: 20rpx 64rpx 20rpx 64rpx;
		position: fixed;
		bottom: 0;
		display: flex;
		justify-content: center;
		width: 100%;

		.submit-agree,
		.refused-to {
			display: flex;
			justify-content: center;
			width: 268rpx;
			height: 88rpx;
			font-weight: bold;
			font-size: 28rpx;
			align-items: center;
			border-radius: 10rpx;
		}

		.submit-agree {
			background: $themeColor;
			color: #FFFFFF;

		}

		.refused-to {
			background: #FFFFFF;
			border: 2rpx solid #E0E0E0;
			color: #909299;
			margin-right: 24rpx;
		}
	}
</style>
