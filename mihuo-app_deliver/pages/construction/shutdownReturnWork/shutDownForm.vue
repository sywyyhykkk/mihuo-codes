<template>
	<view class="contain-all">
		<view class="complaint-contain">
			<view class="complaint-type" v-if="typeNameStatus" @click="show = true">
				<view class="item-label">停工类型</view>
				<view class="item-value">
					<text>{{typeName}}</text>
					<image src="/static/images/right-vector.png" mode=""></image>
				</view>
			</view>
			<view class="complaint-type" v-if="!typeNameStatus" @click="showTime = true">
				<view class="item-label">复工时间</view>
				<view class="item-value">
					<text>{{typeName}}</text>
					<image src="/static/images/right-vector.png" mode=""></image>
				</view>
			</view>
			<view class="file-contain-all">
				<view class="text-contain">
					<view class="title-left">{{typeNameStatus === true ? '停工原因':'复工备注' }}</view>
					<u-input  v-model="form.reason" class="describe-input" height="166" type="textarea"
						:placeholder=" typeNameStatus === true ? '请输入停工原因':'请输入复工备注' " :border="true" />
				</view>
				<view class="img-contain">
					<view class="title">上传图片</view>
					<image-upload-new v-model="form.pics" :uploadType="uploadType"> </image-upload-new>
				</view>
				<view class="voice-contain">
					<sound-recording @chooseVoice="chooseVoice" />
				</view>
			</view>
			<view class="complaint-type" v-if="typeNameStatus" @click="showTime = true">
				<view class="item-label">计划停工</view>
				<view class="item-value" v-if="form.totalDay">
					<text>{{startTime}}至{{endTime}} 共{{form.totalDay}}天 </text>
					<image src="/static/images/right-vector.png" mode=""></image>
				</view>
				<view class="item-value" v-if="!form.totalDay">
					<text>请选择日期范围</text>
					<image src="/static/images/right-vector.png" mode=""></image>
				</view>

			</view>
			<u-select selectAreaHeight="" v-model="show" :list="list" @confirm="confirm" value-name="value" label-name="label"></u-select>
			
			
			<!-- <u-calendar v-model="showTime" :mode="typeNameStatus === true ? 'range':'date'" @change="changeTime"
				max-date="2099-12-30"></u-calendar> -->
		</view>
		
		<mihuo-calendar v-model="showTime" :mode="typeNameStatus === true ? 'range':'date'" max-date="2099-12-30" @change="changeTime"></mihuo-calendar>
		
		<mihuo-bottom-button :buttonList="buttonList" @click="submit"></mihuo-bottom-button>
	</view>

</template>

<script>
	import {
		mapState,
	} from 'vuex'
	export default {
		data() {
			return {
				show: false,
				showTime: false,
				fileList: [],
				uploadType: ['图片'],
				params: {
					year: true,
					month: true,
					day: true,
				},
				list: [{
						value: '1',
						label: '江'
					},
					{
						value: '2',
						label: '湖'
					}
				],
				option: {},
				typeName: '请选择停工类型',
				temPic: {},
				endTime: '',
				startTime: '',
				
				form: {
					pics: '',
					audio: '',
					personId: '',
					projectId: '',
					reason: '',
					startTime: '',
					endTime: '',
					status: 0,
					type: '',
					typeName: '',
					totalDay: '',
					currSkillName: '', // 操作岗位
					currPersonName: '', // 操作岗位姓名
					cityOperatorId: '' ,// 当前企业编号
					currTypeNam:''
				},
				typeNameStatus: false
			}
		},
		onLoad(option) {
			this.option = option
			this.setParameter()
			this.getDicType()
			this.getTypeName()
		},
		onShow() {
			// this.getTypeName()
		},
		computed: {
			...mapState(['projectInfo','userPersonInfo','orderInfo']),
			buttonList() {
				let buttonList = [{
					name: '取消',
					status: false
				},{
					name: this.option.typeName,
					status: true
				}]
				return buttonList
			}
		},
		methods: {
			setParameter(){
				this.form.personId = this.userPersonInfo.personId
				this.form.projectId = this.projectInfo.projectId
				this.form.currSkillName = this.userPersonInfo.skillName
				this.form.currPersonName = this.userPersonInfo.name
				this.form.cityOperatorId = this.orderInfo.cityOperatorId
			},
			confirm(e) {
				this.typeName = e[0].label
				this.form.typeName = e[0].label
				this.form.type = Number(e[0].value)
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
			calendarMode() {
				if (this.typeNameStatus) {
					return 'range'
				} else {
					return 'date'
				}
			},
			changeTime(e) {
				if (this.typeNameStatus) {
					this.startTime = e.startDate
					this.endTime = e.endDate
					this.form.totalDay = (e.endDay - e.startDay) + 1
				} else {
					this.typeName = e.result
					this.startTime = e.result
				}
			},
			getDicType() {
				this.$httpApi.getDicType({
					type: 'order_lockout_type',
				}).then(res => {
					if (res) {
						this.list = res
					}
				})
			},
			getTypeName() {
				if (this.option.typeName === '停工') {
					this.typeNameStatus = true
					this.typeName = '请选择停工类型'
				} else {
					this.typeNameStatus = false
					this.typeName = '请选择复工时间'
				}

				if (this.typeNameStatus) {
					uni.setNavigationBarTitle({
						title: '停工'
					})
				} else {
					uni.setNavigationBarTitle({
						title: '复工'
					})
				}

			},
			submit(item) {
				if (item.name === '取消') {
					uni.navigateBack()
					return
				}

				if (this.typeNameStatus) {
					if (this.typeName === '请选择停工类型') {
						this.$util.toast("请选择停工类型");
						return
					}
				} else {
					if (!this.startTime) {
						this.$util.toast("请选择复工时间");
						return
					}
				}

				if (!this.startTime) {
					this.$util.toast(`${this.typeNameStatus === true ? '请选择停工时间':'请选择复工时间'}`);
					return
				}
				this.form.status = this.typeNameStatus === true ? 0 : 1
				if (this.form.status !== 1) {
					this.form.endTime = this.endTime + ' 00:00:00'
				}
				this.form.startTime = this.startTime + ' 00:00:00'
				this.form.currTypeName = this.form.typeName

				this.debounce(() => {
					if(!this.$checkUploadProcess(this.form.pics)){
						return;
					}
					this.$httpApi.orderworkstatusSave(this.form).then(res => {
						if (res) {
							this.$util.toast(`${this.typeNameStatus === true? '停工成功':'复工成功' }`);
							uni.navigateBack()
						}
					})
				})

			}

		}
	}
</script>

<style lang="scss" scoped>
	/deep/ .u-select__header {
		background-color: #FFFFFF;
	}

	/deep/ .uni-scroll-view {
		background-color: #FFFFFF;
	}

	.contain-all {
		padding-bottom: 140rpx;
	}

	.complaint-contain {
		padding-top: 16rpx;

		.complaint-type {
			display: flex;
			margin: 0rpx 20rpx 4rpx 20rpx;
			padding: 42rpx 40rpx 42rpx 36rpx;
			justify-content: space-between;
			background-color: #FFFFFF;

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
				background: #FFFFFF;
				margin-bottom: 2rpx;

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

			.attachment-contain{
				padding: 0rpx 40rpx 28rpx 40rpx;
				background: #FFFFFF;
			}


			.img-contain {
				background: #FFFFFF;
				padding: 30rpx 40rpx 28rpx 40rpx;

				.title {
					font-weight: bold;
					font-size: 28rpx;
					color: #46464E;
					margin-bottom: 24rpx;

				}
			}

			.voice-contain {
				background: #FFFFFF;
				padding: 0 40rpx 32rpx 40rpx;
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
