<template>
	<view class="apply-for-settlement">
		<view class="personnel-contain">
			<view class="item-modify">
				<view class="left">收款金额</view>
				<view class="right">
					<view class="input-contain">
						<u-input :clearable="false" v-model="form.price" @input="setInput" @blur="setBlur" type="digit" placeholder="请输入收款金额"
							height="64" />
					</view>
					<text>元</text>
				</view>
			</view>
			<view class="desc-contain">
				<view class="input-contain">
					<view class="input-contain-item">
						<u-input :clearable="false" v-model="form.remark" type="textarea" placeholder="请输入备注"
							height="168" />
					</view>
				</view>
			</view>
			<view class="file-contain">
				<view class="img-contain">
					<image-upload-new v-model="form.attachmentsPics" :uploadType="uploadType" />
				</view>
				<view class="voice-contain">
					<sound-recording @chooseVoice="chooseVoice" />
				</view>
			</view>
		</view>
		<view class="settlement-type">
			<view class="left">收款方式</view>
			<view class="right" @click="getPaymentType">
				<text>{{applyTypeName}}</text>
				<u-icon name="arrow-right" class="x6-icon" color="#d1d1d1" size="28"></u-icon>
			</view>
		</view>
		<view class="button-contain">
			<view class="cancel item-button" @click="cancel">取消</view>
			<view class="determine item-button" @click="getModify">确认</view>

			<u-select v-model="dicTypeShow" mode="single-column" selectAreaHeight="" :list="collectionTypeList"
				@confirm="confirm"></u-select>
		</view>
	</view>

</template>

<script>
	import {
		mapState,
	} from 'vuex'
	export default {
		data() {
			return {
				option: {},
				bidPrice: '',
				applyTypeName: '请选择',
				collectionTypeList: [],
				uploadType: ['图片','视频'],
				dicTypeShow: false,
				form: {
					attachmentsPics: '',
					attachmentsVoice: '',
					skillName: '',
					skillId: '',
					nodeId: '',
					projectId: '',
					name: '',
					price: '',
					type: '',
					typeName: '',
					remark: ''
				}
			}
		},
		computed: {
			...mapState(['userPersonInfo','nodeInfo','projectInfo','orderInfo']),
		},
		onShow() {
			this.setParameter()
			this.getDicType()
		},
		onLoad(option) {
			this.option = option
		},
		methods: {
			setInput(value) {
				this.$setInput((result) => {
					this.form.price = result
				}, value)
			},
			setBlur(value){
				this.$setBlur((result)=>{
					this.form.price = result
				},value)
			},
			setParameter() {
				this.form.skillName = this.userPersonInfo.skillName
				// 部分业务可能需要传 skillId -1
				// this.form.skillId = this.userPersonInfo.skillId
				this.form.skillId = '-1'
				this.form.nodeId = this.nodeInfo.nodeId
				this.form.projectId = this.projectInfo.projectId
				this.form.name = this.projectInfo.poiName + this.nodeInfo.nodeName
			},
			getDicType() {
				this.$httpApi.getDicType({
					type: 'receipt_type'
				}).then(res => {
					if (res) {
						this.collectionTypeList = res
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
					this.form.attachmentsVoice = JSON.stringify(temp)
				} else {
					this.form.attachmentsVoice = ''
				}
			},
			getPaymentType() {
				this.dicTypeShow = !this.dicTypeShow
			},
			confirm(e) {
				if (e.length > 0) {
					this.form.type = e[0].value
					this.form.typeName = e[0].label
					this.applyTypeName = e[0].label
				}
			},
			cancel() {
				this.goBack()
			},
			getModify() {
				if (!this.form.price) {
					this.$util.toast("请输入收款金额");
					return
				}

				if (!this.form.type) {
					this.$util.toast("请选择收款方式");
					return
				}
				if (!this.$checkUploadProcess(this.form.attachmentsPics)) {
					return
				}
				this.$httpApi.sopReceiptRecordsSave(this.form).then(res => {
					if (res) {
						this.$util.toast("操作成功");
						setTimeout(() => {
							this.goBack()
						}, 2000);
					}
				})
			}
		},

	}
</script>

<style lang="scss" scoped>
	/deep/ .u-select__header {
		background-color: #FFFFFF;
	}

	.project-contain {
		background-color: #FFFFFF;
		border-radius: $miniBorderRadius;
		padding: 46rpx 40rpx 28rpx 46rpx;
		margin-bottom: 4rpx;


		.top {
			font-weight: 700;
			color: $seconFontColor;
			font-size: $middleAddFontSize;
			margin-bottom: 6rpx;
			display: flex;
			justify-content: space-between;
		}

		.address {
			font-weight: 400;
			color: $viceFontColor;
			font-size: $smiddleFontSize;
		}
	}

	.apply-for-settlement {
		padding: 12rpx 0rpx 140rpx 0rpx;

		.personnel-contain {
			background-color: #FFFFFF;
			border-radius: $miniBorderRadius;
			padding: 44rpx 0rpx 48rpx 0rpx;
			margin: 0 20rpx;

			.user-contain {
				padding: 38rpx 36rpx 0rpx 48rpx;
				display: flex;
				margin-bottom: 20rpx;

				.right {
					display: flex;
					margin-left: 30rpx;
					flex: 1;
					justify-content: space-between;

					.public-arrow {
						width: 16rpx;
						height: 14rpx;
					}

					.item-contain {
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;

						.name {
							font-size: $smiddleFontSize;
							color: $viceFontColor;
						}

						.jobs {

							font-size: $middleAddFontSize;
							color: $seconFontColor;
						}
					}

					.item-detail {
						display: flex;
						align-items: center;
						font-size: $smiddleFontSize;
						color: $themeColor;

						.public-arrow {
							margin-left: 10rpx;
						}
					}
				}
			}

			.cost-item {
				padding-left: 52rpx;
				display: flex;
				justify-content: space-between;
				margin-bottom: 20rpx;

				&:last-child {
					margin-bottom: 0rpx;
				}

				.cost-item-contain {
					padding-right: 40rpx;
					display: flex;
					justify-content: space-between;

					.item-label {
						font-size: $middleFontSize;
						color: $seconFontColor;
						margin-right: 10rpx;
						min-width: 180rpx;
					}

					.item-value {
						font-size: $middleFontSize;
						color: $errorFontColor;
					}
				}
			}

			.item-modify {
				display: flex;
				align-items: center;
				padding-left: 50rpx;
				margin-bottom: 36rpx;

				.left {
					font-weight: 400;
					font-size: 14px;
					color: #303133;
					margin-right: 20rpx;
				}

				.right {
					display: flex;
					align-items: center;

				}

				.input-contain {
					width: 460rpx;
					padding-left: 22rpx;
					border: 2rpx solid #F6F6F6;
					border-radius: 10rpx;
					margin-right: 16rpx;
				}
			}
		}


		.desc-contain {
			background-color: #FFFFFF;
			border-radius: 5px;
			margin-bottom: 28rpx;

			.input-contain {
				background: #F7F7F7;
				border: 1px solid #FFFFFF;
				box-sizing: border-box;
				border-radius: 5px;
				margin: 0 26rpx;
			}

			.input-contain-item {
				padding: 4rpx 24rpx;
			}
		}

		.file-contain {
			padding: 0rpx 26rpx;
			background-color: #FFFFFF;

			.title {
				font-size: 28rpx;
				color: #46464E;
				margin-bottom: 24rpx;
			}

			.img-contain {
				margin-bottom: 28rpx;
			}
		}
	}

	.send-user {
		margin-bottom: 142rpx;

		.form-item {
			display: flex;
			border-radius: 10rpx;
			justify-content: space-between;
			align-items: center;
			padding: 42rpx 84rpx 42rpx 84rpx;
			margin-bottom: 2rpx;
			background-color: #FFFFFF;

			&:last-child {
				margin-bottom: 0;
			}

			.item-value {
				font-size: $middleFontSize;
				color: $fontColor99;
			}

			.form-lable {
				font-weight: bold;
				font-size: 28rpx;
				display: flex;
				white-space: nowrap;
				color: #46464E;
			}

			.x6-item-custom {
				border: 0rpx;
				justify-content: flex-end;
				padding-right: 0rpx !important;
			}

			// .u-icon {
			// 	display: none;
			// }
		}
	}

	.settlement-type {
		background: #FFFFFF;
		border-radius: $miniBorderRadius;
		display: flex;
		padding: 42rpx 56rpx;
		justify-content: space-between;
		// margin-bottom: 370rpx;
		margin: 2rpx  20rpx 0rpx 20rpx;

		.left {
			font-size: $middleFontSize;
			color: $seconFontColor;
		}

		.right {
			display: flex;

			text {
				font-size: $smiddleFontSize;
				color: $viceFontColor;
				margin-right: 20rpx;
			}

		}
	}

	.button-contain {
		display: flex;
		justify-content: center;
		width: 100%;
		// margin-bottom: 20rpx;
		position: fixed;
		bottom: 0px;
		padding: 20rpx 0rpx;
		background-color: #FFFFFF;
		
		// padding-bottom: constant(safe-area-inset-bottom);
		// padding-bottom: env(safe-area-inset-bottom);
		// @include safearea();
		

		.item-button {
			width: 268rpx;
			height: 88rpx;
			text-align: center;
			line-height: 88rpx;
			border-radius: 5px;
			font-size: $middleFontSize;
		}

		.cancel {
			background-color: #FFFFFF;
			border: 1px solid #E0E0E0;
			margin-right: 24rpx;
		}

		.determine {
			color: #FFFFFF;
			background-color: #002FA5;
		}
	}
</style>
