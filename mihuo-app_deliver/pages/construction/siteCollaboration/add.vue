<template>
	<view class="site-collaboration_add">
		<view class="form">
			<view class="item-contain">
				<text class="label">
					<text class="star">*</text>
					委托标题
				</text>
				<view class="public-input">
					<u-input placeholder="请输入委托标题" v-model="form.requirementName" placeholder-style="color:#909199"
						height="52" :clearable="false" type="text" :border="false" />
				</view>
			</view>
			<view class="item-contain" @click="showTime = true">
				<text class="label"><text class="star">*</text>开工时间</text>
				<view class="time-contain ">
					<view class="left" :class="[form.expectDate && 'active-time']">
						{{form.expectDate ? form.expectDate:'开始时间'}}
					</view>
					<view class="right" :class="[form.expectDate && 'active-time']">
						{{form.expectCompleteDate ? form.expectCompleteDate:'结束时间'}}
					</view>
				</view>
			</view>
			<view class="item-contain">
				<text class="label"><text class="star">*</text>所需工种</text>
				<view class="skill-contain display-justify_between" @click="skillShow = true">
					<view class="right" :class="[form.skillName && 'active-time']">
						{{form.skillName ? form.skillName:'请选择所需工种'}}
					</view>
					<u-icon name="arrow-right" size="24" color="#D9D9D9"></u-icon>
				</view>
			</view>

			<view class="item-contain">
				<text class="label">委托内容</text>
				<view class="public-input_textarea">
					<u-input v-model="form.requirementDesc" class="describe-input" maxlength="200" height="140"
						type="textarea" placeholder="请输入内容" :border="false" />
				</view>
			</view>

			<view class="img-contain">
				<image-upload-new v-model="pics" :uploadType="uploadType"> </image-upload-new>
			</view>
			<view class="voice-contain">
				<sound-recording @chooseVoice="chooseVoice" />
			</view>
		</view>

		<!-- <u-calendar v-model="showTime" mode="range" @change="changeTime" max-date="2099-12-30"></u-calendar> -->
		<mihuo-calendar v-model="showTime" mode="range" max-date="2099-12-30" @change="changeTime"></mihuo-calendar>
		
		
		<u-picker mode="selector" v-model="skillShow" :default-selector="[skillIndex]" :range="skillList"
			range-key="skillName" @confirm="confirmSkillt">
		</u-picker>
		
		<mihuo-bottom-button :buttonList="buttonList" @click="getButton"></mihuo-bottom-button>
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
				audio: '',
				pics: '[]',
				attachment: [],
				form: {
					attachments: [],
					cityOperatorId: uni.getStorageSync('cityOperatorId'),
					expectCompleteDate: "",
					expectDate: "",
					jobCode: "",
					nodeId:0,
					projectId: 0,
					requirementDesc: "",
					requirementName: "",
					skillId: 0,
					skillName: ""
				},
				showTime: false,
				skillShow: false,
				uploadType: ['图片'],
				skillList: [],
				skillIndex: 0,
				buttonList: [{
					name: '取消',
					status: false
				}, {
					name: '确定',
					status: true
				}],
			}
		},
		computed: {
			...mapState(['projectInfo', 'orderInfo'])
		},
		mounted() {

		},
		onShow() {

		},
		onLoad(option) {
			this.option = option
			this.getWorkTypeList()
			this.setParameter()
		},
		methods: {
			setParameter() {
				this.form.projectId = this.projectInfo.projectId
			},
			changeTime(item) {
				this.form.expectDate = item.startDate
				this.form.expectCompleteDate = item.endDate
			},
			confirmSkillt(item) {
				this.skillIndex = item[0]
				this.form.skillId = this.skillList[item].skillId
				this.form.skillName = this.skillList[item].skillName
				this.form.jobCode = this.skillList[item].jobCode
			},
			async chooseVoice(file, flag) {
				if (file.path != '{}') {
					let temp = [{
						name: '',
						type: 'audio',
						timeLength: file.duration,
						url: await this.$CommonUpload(file.path)
					}]
					this.audio = temp;
				}
				if (flag) {
					this.audio = []
				}
			},
			getButton(item) {
				if (item.name == '取消') {
					this.goBack()
				} else {
					if (!this.form.requirementName) {
						this.$util.toast(`请填写委托标题~`);
						return
					}

					if (!this.form.expectDate) {
						this.$util.toast(`请选择开完工时间~`);
						return
					}
					if (!this.form.skillId) {
						this.$util.toast(`请选择所需工种~`);
						return
					}
					this.attachment = []
					let tempImages = JSON.parse(this.pics)
					if (tempImages.length > 0) {
						tempImages.forEach(el => {
							this.attachment.push({
								name: el.name,
								timeLength: '',
								type: this.$setFileType(el.url),
								url: el.url
							})
						})
					}
					if (this.audio.length > 0) {
						this.attachment.push(this.audio[0])
					}
					if (this.attachment.length > 0) {
						this.form.attachments = this.attachment
					}

					this.$httpApi.outsourcingAdd(this.form).then(res => {
						if (res) {
							this.$util.toast(`添加成功~`);
							uni.redirectTo({
								url: `/pages/construction/siteCollaboration/details?id=${res}`
							})
						}
					})
				}
			},
			getWorkTypeList() {
				this.$httpApi.getWorkType({
					type: 1,
					clientType: 'platform',
					size: 99
				}).then(res => {
					if (res) {
						res.records = res.records.filter(item => item.jobCode == 'JOB_OUTSOURCING')
						this.skillList = res.records
					}
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */
	/deep/ .u-input__input {
		color: #303133;
	}

	.active-time {
		color: #303133 !important;
	}

	.star {
		color: $errorColor;
		height: 28rpx;
		vertical-align: middle;
		display: inline-block;
	}

	/deep/ .u-select__header {
		background-color: #FFFFFF;
	}

	/deep/ .uni-scroll-view {
		background-color: #FFFFFF;
	}

	.public-input {
		margin-top: 12rpx;
		background-color: #F6F7F9;
		border-radius: 10rpx;
		height: 88rpx;
		display: flex;
		align-items: center;
		padding: 0rpx 26rpx;
		flex: 1;
	}

	.voice-contain {
		margin-top: 22rpx;
	}

	.public-input_textarea {
		margin-top: 12rpx;
		background-color: #F6F7F9;
		border-radius: 10rpx;
		display: flex;
		align-items: center;
		padding: 0rpx 26rpx;
		flex: 1;
	}





	.site-collaboration_add {
		.form {
			margin: 12rpx 20rpx 0rpx 20rpx;
			padding: 30rpx 28rpx;
			border-radius: 10rpx;
			background: #FFFFFF;
		}

		.item-contain {
			margin-bottom: 30rpx;

			&:last-child {
				margin-bottom: 0rpx;
			}

			.label {
				color: $seconFontColor;
				font-size: 28rpx;
				font-weight: bold;
				margin-left: 10rpx;
			}

			.time-contain {
				display: flex;
				margin-top: 12rpx;

				.left,
				.right {
					flex: 1;
					display: flex;
					align-items: center;
					height: 88rpx;
					padding: 20rpx 30rpx;
					background-color: #F5F6F9;
					border-radius: 10rpx;
					color: $viceFontColor99;
					font-size: $fontSize26;
				}

				.left {
					margin-right: 14rpx;
				}
			}

			.skill-contain {
				margin-top: 12rpx;
				display: flex;
				align-items: center;
				height: 88rpx;
				padding: 20rpx 30rpx;
				background-color: #F5F6F9;
				border-radius: 10rpx;
				color: $viceFontColor99;
				font-size: $fontSize26;

				.right {
					color: $viceFontColor99;
					font-size: $fontSize26;
				}
			}
		}
	}
</style>e
