<template>
	<view class="initiate-page">
		<mihuo-order-information :projectId="projectId"></mihuo-order-information>
		<view class="file-contain-all">
			<view class="text-contain">
				<view class="title-left">通知内容</view>
				<u-input v-model="form.notifyContent" class="describe-input" height="176" type="textarea"
					placeholder="请输入描述信息" :border="true" />
			</view>
			<view class="img-contain">
				<view class="title">上传图片</view>
				<image-upload-new :isAddWatermark="true" :address="waterAddress" :userInfo="waterUserInfo"
					v-model="fileImage" />
			</view>
			<view class="voice-contain">
				<sound-recording @chooseVoice="chooseVoice" />
			</view>
			<view class="form-contain">
				<view class="form-item">
					<view class="form-lable" v-if="typeName">验收日期</view>
					<view class="form-lable" v-else>交底日期</view>
					<view class="item-value" @click="timeShow = true">{{discloseDateName}}
						<image src="/static/images/right-vector.png" mode=""></image>
					</view>
					<u-picker v-model="timeShow" mode="time" @confirm="confirmTime"></u-picker>
				</view>
				<view class="form-item" @click="getUser()">
					<view class="form-lable" v-if="typeName">抄送至</view>
					<view class="form-lable" v-else>发送至</view>
					<view class="item-value">{{makeName}}
						<image src="/static/images/right-vector.png" mode=""></image>
					</view>
				</view>
			</view>
		</view>
		<bottom-button v-if="typeName" title="发起验收通知" @click="submit"></bottom-button>
		<bottom-button v-else title="发起交底通知" @click="submit"></bottom-button>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	import moment from "@/static/js/moment.js"
	export default {
		data() {
			return {
				form: {
					surveyName: '',
					ccPersons: [], //	通知抄送人	
					createPersonId: '', //	创建人员Id			
					createPersonName: '', //	创建人员名字			
					createSkillId: '', //	创建人员工种id			
					createSkillName: '', //	创建人员工种			
					nodeId: '', //	节点Id		true	
					notifyAttachments: [], //	通知文件		
					notifyContent: '', //	通知交底内容			
					notifyDate: '', //	通知交底日期			
					notifyTitle: '', //	通知标题			
					projectId: '', //	项目Id			
				},
				timeShow: false,
				discloseDateName: '请选择交底日期',
				makeName: '请选择(可多选)',
				tempTime: '',
				fileAllList: [],
				fileImage: '',
				fileAudio: '',
				typeName: '',
				option: {},
				waterAddress: '',
				waterUserInfo: '',
				projectId: '',
				surveyName: '',
				attachment: [],
				notifyCcPerson: []
			}
		},
		onLoad(option) {
			if (option.typeName) {
				this.option = option
				this.typeName = option.typeName
				this.discloseDateName = '请选择验收日期'
				uni.setNavigationBarTitle({
					title: '发起验收通知'
				})
			} else {
				uni.setNavigationBarTitle({
					title: this.nodeInfo.nodeName + '通知'
				})
			}
			this.setParameters()
			this.setCcPersons()
			this.getLocaltion()
		},
		onShow() {
			uni.$once('checkList', (data) => {
				let tempDataList = JSON.parse(data)
				this.notifyCcPerson = []
				this.form.ccPersons = []
				tempDataList.forEach(el => {
					this.form.ccPersons.push({
						handlePersonId: el.personId,
						handlePersonName: el.name,
						handleSkillId: el.skillId,
						handleSkillName: el.skillName,
						handleUserId: el.userId,
					})
					if (this.typeName == '验收') {
						this.notifyCcPerson.push(el.personId)
					}
				})

				this.makeName = JSON.parse(data).map(item => item.name).join(',')
			})
		},
		onUnload() {
			// uni.$off('checkList')
		},
		computed: {
			...mapState(['projectInfo', 'nodeInfo', 'userPersonInfo', 'orderInfo', 'remainingDays'])
		},
		methods: {
			//得到当前位置
			getLocaltion() {
				uni.getLocation({
					type: 'gcj02',
					geocode: true,
					success: (data) => {
						console.log(data);
						this.waterAddress = data.address ? data.address.city + data.address.district + data
							.address.street + data.address.streetNum + data.address.poiName : ''
					}
				})
			},
			setDiscloseDateName() {
				this.discloseDateName = moment().format("YYYY-MM-DD")
				this.form.notifyDate = moment().format("YYYY-MM-DD") + ' 00:00:00'
			},
			setParameters() {
				this.form.projectId = this.projectInfo.projectId
				this.projectId = this.projectInfo.projectId
				this.form.nodeId = this.nodeInfo.nodeId
				this.form.notifyTitle = this.projectInfo.poiName + this.nodeInfo.nodeName
				this.personId = this.userPersonInfo.personId
				this.waterUserInfo = this.userPersonInfo.name + `（${this.userPersonInfo.skillName}）`;
				this.setDiscloseDateName()
				this.getTemplateInfoById()
				this.setExecPerson()

			},
			setExecPerson() {
				this.$httpApi.getPersonSettingInfo({
					userId: uni.getStorageSync('userData').sysUser && uni.getStorageSync('userData').sysUser.userId
				}).then(res => {
					if (res) {
						// 审核状态（0已提交、1未通过、2已通过）
						let tempPersonageList = res.personageList.filter(item => item.auditStatus == 2)
						if (tempPersonageList.length > 0) {
							let tempPerson = tempPersonageList.find(item => item.skillId == this.orderInfo.skillId)
							this.form.createPersonId = tempPerson.personId
							this.form.createPersonName = res.realName
							this.form.createSkillId = tempPerson.skillId
							this.form.createSkillName = tempPerson.skillName

						}
					}
				})
			},
			getTemplateInfoById() {
				this.$httpApi.getTemplateInfoById({
					id: this.nodeInfo.quesId
				}).then(res => {
					if (res) {
						this.form.surveyName = res.surveyName
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
					this.fileAudio = temp
				} else {
					this.fileAudio = ''
				}
			},
			getInitiate(val) {
				this.toPage(`/pages/construction/disclosure/initiatePage`)
			},
			confirmTime(even) {
				this.discloseDateName = even.year + '-' + even.month + '-' + even.day
				this.form.notifyDate = even.year + '-' + even.month + '-' + even.day + ' 00:00:00'
			},
			getUser() {
				this.toPage('/pages/publishTask/selectPick?pageType=团队成员&multiple=true&assign=1')
			},
			submit() {
				this.debounce(() => {
					this.fileAllList = []

					if (!this.form.notifyContent) {
						this.$util.toast(`请填写${this.option.typeName == '验收'?'通知':'交底'}内容`);
						return
					}

					if (!this.form.notifyDate) {
						this.$util.toast(`请填写${this.option.typeName == '验收'?'验收':'交底'}日期`);
						return
					}

					// if (this.typeName !== '验收') {
					// }

					if (this.form.ccPersons.length === 0) {
						this.$util.toast(`请选择抄送人`);
						return
					}

					// 附件处理
					this.attachment = []
					let tempImages = JSON.parse(this.fileImage)
					if (tempImages.length > 0) {
						tempImages.forEach(el => {
							this.attachment.push({
								name: '',
								timeLength: '',
								type: this.$setFileType(el.url),
								url: el.url
							})
						})
					}

					if (this.fileAudio) {
						this.attachment.push({
							name: '',
							timeLength: this.fileAudio.timeLength,
							type: this.fileAudio.type,
							url: this.fileAudio.url
						})
					}

					if (this.attachment.length > 0) {
						this.form.notifyAttachments = this.attachment
					}

					if (!this.projectId) {
						return
					}
					if (!this.$checkUploadProcess(this.fileImage)) {
						return
					}
					if (this.typeName == '验收') {
						var obj = {
							"notifyTitle": this.projectInfo.poiName + this.nodeInfo.nodeName + '验收通知',
							"notifyContent": this.form.notifyContent,
							"notifyDate": this.form.notifyDate,
							"notifyFiles": this.form.notifyFiles,
							"notifyPersonIds": this.notifyCcPerson,
							"nodeId": this.form.nodeId,
							projectId: this.projectId,
						}
						this.$http.post('order/bizorderacceptance/notifyAcceptance', obj).then(res => {
							if (res) {
								setTimeout(() => {
									this.$util.toast(`发起成功,将返回上一页`);
									uni.navigateBack()
								}, 1500)
							}
						})
					} else {
						// console.log("this.form",this.form);
						// return
						this.$httpApi.saveDiscloseNotify(this.form).then(res => {
							setTimeout(() => {
								this.$util.toast(`发起成功,将返回上一页`);
								uni.navigateBack()
							}, 1500)
						})
					}
				}, 200)
			},
			/**
			 * @description sop交底节点有配置通知岗位时，通过团队成员默认带出该岗位的所有人员
			 * */
			setCcPersons() {
				if (!this.nodeInfo.notifyJob) {
					return
				}
				this.$httpApi.getMemberList({
					projectId: this.projectInfo.projectId // 项目id
				}).then(res => {
					if (res) {
						let tempNotifyJob = this.nodeInfo.notifyJob.split(',')
						let tempCcPersons = res.filter(item => tempNotifyJob.includes(item.skillId))
						// console.log('tempCcPersons', tempCcPersons);
						// 过滤掉自己
						tempCcPersons = tempCcPersons.filter(item => this.userPersonInfo !== item.userId && item
							.personId !== this.userPersonInfo.personId)
						// console.log('tempCcPersons', tempCcPersons);
						if (tempCcPersons && tempCcPersons.length > 0) {
							this.makeName = tempCcPersons.map(item => item.name).join(',')
							tempCcPersons.forEach(el => {
								this.form.ccPersons.push({
									handlePersonId: el.personId,
									handlePersonName: el.name,
									handleSkillId: el.skillId,
									handleSkillName: el.skillName,
									handleUserId: el.userId,
								})
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.file-contain-all {

		margin: 0rpx 20rpx 4rpx 20rpx;

		border-radius: 10rpx;

		.text-contain {
			background: #FFFFFF;
			padding: 30rpx 40rpx 42rpx 40rpx;
			margin-bottom: 2rpx;

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
			background: #FFFFFF;
			padding: 30rpx 40rpx 0rpx 40rpx;

			.title {
				font-weight: bold;
				font-size: $middleFontSize;
				color: #46464E;
				margin-bottom: 24rpx;
			}
		}

		.voice-contain {
			background: #FFFFFF;
			padding: 30rpx 40rpx 42rpx 40rpx;
			margin-bottom: 2rpx;
		}

		.file-title {
			font-size: 30rpx;
			color: $seconFontColor;
			font-weight: bold;
			margin-bottom: 22rpx;
		}

		.form-contain {
			.form-item {
				display: flex;
				border-radius: 10rpx;
				justify-content: space-between;
				align-items: center;
				padding: 42rpx 48rpx 42rpx 48rpx;
				margin-bottom: 2rpx;
				background-color: #FFFFFF;

				&:last-child {
					margin-bottom: 0;
				}

				.item-value {
					font-size: $middleFontSize;
					color: $fontColor99;
					display: flex;
					align-items: center;


					image {
						margin-left: 26rpx;
						width: 14rpx;
						height: 26rpx;
					}
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

				.u-icon {
					display: none;
				}
			}
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
</style>
