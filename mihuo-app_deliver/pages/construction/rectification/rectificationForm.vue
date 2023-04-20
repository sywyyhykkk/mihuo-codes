<template>
	<view class="rectification-form">
		<view class="details-contain">
			<view class="details-header">
				<view class="left">
					<u-avatar size="70" v-if="details.person" :src="$util.thumbnailImage(details.person.avatar,true)">
					</u-avatar>
					<view class="information" v-if="details.person">
						<view class="personnel">
							<view class="personnel-jobs">{{details.person.skillName}}</view>
							<view class="name">{{details.person.name}}</view>
						</view>
						<view class="time" v-if="details.created">{{details.created.substring(0,16)}}发起</view>
					</view>
				</view>
				<view class="right">
					<text class="status">待整改</text>
				</view>
			</view>
			<view class="details-information">
				<view class="text-desc">
					<text class="desc-title">存在问题:</text>
					<text class="desc-contain">{{details.issueContents}}</text>
				</view>
				<view class="image-contain" v-if="details.issuePics">
					<image-show :imgSrc="details.issuePics" right="20"></image-show>
				</view>
				<view class="audio-contain" v-if="details.issueAudio">
					<mihuo-audio :formDate="details.issueAudio"></mihuo-audio>
				</view>
			</view>
		</view>
		<view class="file-contain-all">
			<view class="text-contain">
				<view class="title-left">整改结果</view>
				<u-input v-model="form.contents" class="describe-input" height="176" type="textarea"
					placeholder="请输入整改描述" :border="true" />
			</view>
			<view class="img-contain">
				<image-upload-new :isAddWatermark="true" :address="waterAddress" :userInfo="waterUserInfo" v-model="form.pics" />
			</view>
			<view class="voice-contain">
				<sound-recording @chooseVoice="chooseVoice" />
			</view>
		</view>

		<view class="submit-text iphonex-bottom" @click="submit()">
			确认提交
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
				uploadType: ['图片', '视频'],
				details: {},
				waterAddress: '',
				waterUserInfo:'',
				form: {
					contents: '',
					audio: '',
					pics: '',
					abarbeitungId: '',
					parentId: '',
					personId: '',
					status: 1
				},
			}
		},
		onLoad(option) {
			this.option = option;
			this.form.parentId = this.option.id;
			this.getLocaltion();
		},
		onShow() {
			this.setParameter()
			this.getDetails()
		},
		onReachBottom() {

		},
		computed: {
			...mapState(['userPersonInfo']),
		},
		methods: {
			//得到当前位置
			getLocaltion() {
				uni.getLocation({
					type: 'gcj02',
					geocode: true,
					success:(data)=>{
						this.waterAddress = data.address?data.address.city+data.address.district+data.address.street+data.address.streetNum + data.address.poiName:''
					}
				})
			},
			setParameter() {
				this.form.personId = this.userPersonInfo.personId;
				this.waterUserInfo = this.userPersonInfo.name + `（${this.userPersonInfo.skillName}）`;
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
			getDetails() {
				this.$httpApi.getOrderabarbeitungDetails({
					id: this.option.id
				}).then(res => {
					if (res) {
						this.details = res
						this.details.issueAudio = res.issueAudio && JSON.parse(res.issueAudio)[0]
					}
				})
			},
			submit() {
				if(!this.$checkUploadProcess(this.form.pics)){
					return;
				}
				this.debounce(() => {
					this.$httpApi.getOrderabarbeitungSave(this.form).then(res => {
						if (res) {
							this.$util.toast(`提交成功`);
							if (this.option.toDoType) {
								this.$httpApi.bizpendingHandle({
									bizPendingDetailId: this.option.bizPendingDetailId,
									handlePersonId:this.userPersonInfo.personId
								}).then(res => {
									uni.navigateBack()
								})
							} else {
								uni.navigateBack()
							}
						}
					})
				}, 200)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.rectification-form {
		padding-top: 6rpx;
		padding-bottom: 130rpx;

		.details-contain {
			margin: 0rpx 20rpx 14rpx 20rpx;
			padding: 48rpx 26rpx 52rpx 26rpx;
			background-color: #FFFFFF;
			border-radius: 10rpx;

			.details-header {
				display: flex;
				justify-content: space-between;
				padding-bottom: 46rpx;
				border-bottom: 2rpx dashed #EEEEEE;

				.left {
					display: flex;
					align-items: center;

					.information {
						margin-left: 18rpx;

						.personnel {
							display: flex;
						}

						.time {
							font-size: 26rpx;
							color: #909199;
						}

						.personnel-jobs {
							font-weight: bold;
							font-size: 28rpx;
							color: $seconFontColor;
							margin-right: 18rpx;
						}

						.name {
							font-size: 28rpx;
							color: #909199;
						}
					}
				}

				.right {
					.status {
						font-size: 24rpx;
						color: #FF5D35;
						width: 100rpx;
						height: 42rpx;
						line-height: 42rpx;
						display: inline-block;
						text-align: center;
						background: #FFE4DD;
						border-radius: 0px 20rpx 20rpx 20rpx;
					}
				}
			}

			.details-information {
				padding-top: 32rpx;

				.applyLog-list {}

				.title {
					display: flex;
					justify-content: space-between;
					margin-bottom: 24rpx;

					.left {
						font-weight: bold;
						font-size: 30rpx;
						color: $seconFontColor;

					}

					.right {
						font-size: 26rpx;
						color: $themeColor;

					}
				}

				.text-desc {
					margin-bottom: 26rpx;

					.desc-title {
						font-size: 28rpx;
						color: #909199;
						margin-right: 18rpx;
					}

					.desc-contain {
						font-size: 28rpx;
						color: $seconFontColor;

					}
				}

				.image-contain {
					margin-bottom: 20rpx;
					flex-wrap: wrap;
					display: flex;

					.record-item-img {
						width: 188rpx;
						margin-right: 20rpx;
					}
				}
			}
		}

		.file-contain-all {
			background: #FFFFFF;
			margin: 0rpx 20rpx 4rpx 20rpx;
			padding: 30rpx 40rpx 42rpx 40rpx;
			border-radius: 10rpx;

			.text-contain {
				.title-left {
					font-weight: bold;
					font-size: 30rpx;
					color: #46464E;
					margin-bottom: 22rpx;
				}

				.describe-input {
					background-color: #F7F7F7;
					margin-bottom: 20rpx;
					border: 0px;
				}
			}


			.img-contain {
				margin-bottom: 28rpx;
			}

			.file-title {
				font-size: 30rpx;
				color: $seconFontColor;
				font-weight: bold;
				margin-bottom: 22rpx;
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
	}
</style>
