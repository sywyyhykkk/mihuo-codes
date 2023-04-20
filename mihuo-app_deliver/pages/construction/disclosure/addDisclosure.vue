<style lang="scss" scoped>
	.order-angle-sign-default {
		display: flex;
		position: absolute;
		right: 28rpx;
		top: -8rpx;
		justify-content: center;
		align-items: center;
		background-color: #FF5B05;

		.order-angle-sign-text {
			font-size: 24rpx;
			color: #fff;
			transform: scale(.85);
		}
	}

	.medium-order-angle-sign {
		border-radius: 30rpx;
		width: 30rpx;
		height: 30rpx;
	}

	.large-size-order-angle-sign {
		border-radius: 30rpx;
		width: 48rpx;
		height: 30rpx;
	}

	.order-angle-sign {
		border-radius: 50%;
		width: 28rpx;
		height: 28rpx;
	}

	.nav-bar-right {
		position: relative;
		padding-right: 50rpx;
		font-size: $middleFontSize;
		color: #606166;
	}

	.public-mg {
		margin-left: 20rpx;
		margin-right: 20rpx;

	}

	.input-contain {
		padding-right: 20rpx;

		.describe-input {
			border: 0;
			background-color: #F7F7F7;
		}
	}

	.add-disclosure-contain {
		padding-bottom: 20rpx;

		.form-contain {
			margin-top: 12rpx;
			margin-bottom: 40rpx;
		}

		.send-user {
			margin-bottom: 98rpx;
		}

		.form-contain,
		.send-user {
			.form-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 2rpx;
				padding: 32rpx 48rpx;
				border-radius: 10rpx;
				background-color: #FFF;

				&:last-child {
					margin-bottom: 0;
				}

				.item-value {
					font-size: $middleFontSize;
					color: $fontColor99;
				}

				.form-lable {
					display: flex;
					font-weight: bold;
					font-size: 28rpx;
					color: #46464E;
					white-space: nowrap;
				}

				.x6-item-custom {
					justify-content: flex-end;
					padding-right: 0rpx !important;
					border: 0rpx;
				}

				.u-icon {
					display: none;
				}
			}
		}

		.questionnaire {
			margin-bottom: 2rpx;

			.item-title {
				padding-left: 34rpx;
				line-height: 42rpx;
				font-weight: bold;
				font-size: 30rpx;
				color: $seconFontColor;
			}

			.item-describe {
				margin-bottom: 24rpx;
				padding-left: 34rpx;
				line-height: 36rpx;
				font-size: 26rpx;
				color: #909199;
			}

			.describe-contain {
				margin-bottom: 2rpx;
				padding: 48rpx 32rpx 52rpx;
				background-color: #FFF;

				.describe-label {
					margin-bottom: 20rpx;
					padding-left: 20rpx;
					font-weight: bold;
					font-size: 28rpx;
					color: #46464E;
				}

				.describe-input {
					margin-bottom: 20rpx;
					border: 0;
					background-color: #F7F7F7;
				}
			}

			.file-contain {
				.title {
					margin-bottom: 24rpx;
					font-size: 28rpx;
					color: #46464E;
				}

				.img-contain {
					margin-bottom: 28rpx;
				}

				padding: 24rpx 50rpx 32rpx;
				background-color: #FFF;
			}

		}

		.submit-text {
			margin: 0 60rpx 114rpx;
			padding: 24rpx 156rpx;
			border-radius: 10rpx;
			background: $themeColor;
			text-align: center;
			color: #FFF;
		}
	}
</style>
<template>
	<view class="add-disclosure-contain" id="add-disclosure-contain">
		<public-module></public-module>
		<z-nav-bar backState="1000" bgColor="#FFF" fontColor="#979797">
			<view slot="default" class="nav-bar-title">
				{{pageTitle}}
			</view>
			<view slot="right" class="nav-bar-right"
				@click="toPage(`/pages/construction/disclosure/disclosureConfirmation?quesId=${quesId}&detailsId=${options.detailsId}`)">
				待确认事项
				<view class="order-angle-sign-default"
					:class="[Number(templatePendingCount) > 10 ? Number(templatePendingCount) > 99 ? 'large-size-order-angle-sign': 'medium-order-angle-sign' :'order-angle-sign']"
					v-if=" Number(templatePendingCount) > 0">
					<view class="order-angle-sign-text">
						{{ Number(templatePendingCount) > 99 ? '99+':Number(templatePendingCount) }}
					</view>
				</view>
			</view>
		</z-nav-bar>


		<form-cache-item ref="formCacheItem" :cacheId="getCacheId()" @recovery="cacheForm('recovery')" type="交底问卷">
		</form-cache-item>
		<view class="form-contain public-mg">
			<view class="form-item">
				<view class="form-lable">日期</view>
				<view class="item-value" @click="timeShow = true">{{discloseDateName}}</view>
				<u-picker v-model="timeShow" mode="time" @confirm="confirmTime"></u-picker>
			</view>
			<view class="form-item">
				<view class="form-lable">位置</view>
				<custom-input placeholder="请选择施工地点" iconName="map-fill" v-model="form.discloseAddress"
					@click="getConstructionSite">
				</custom-input>
			</view>
			<!-- <view class="form-item">
				<view class="form-lable">房屋面积</view>
				<u-input placeholder v-model="form.houseArea" type="digit" :border="false" input-align="right"
					placeholder="请输入房屋面积" />
			</view> -->
		</view>
		<view class="questionnaire ">
			<questionnaire-config :uTabsFalse="true" :cacheId="getCacheId()" :isEditStatus="isEditStatus"
				:isEditStatusId="isEditStatusId" :id="quesId" type="交底" v-model="questionnaireObject"
				:titleObejct="titleObejct" :formCacheObejct="formCacheObejct" :confirmStatus="true"
				ref="questionnaireConfig" @getLoading="getLoading">
			</questionnaire-config>

			<view class="describe-contain">
				<view class="describe-label">备注内容</view>
				<u-input v-model="form.remark" class="describe-input" height="190" maxlength="200" type="textarea"
					placeholder="请输入备注" :border="true" />
			</view>
			<view class="file-contain">
				<view class="title">上传图片</view>
				<view class="img-contain">
					<image-upload-new v-model="fileImage" :key="imageUploadNewIndex" />
				</view>
				<view class="voice-contain">
					<sound-recording @chooseVoice="chooseVoice" />
				</view>
			</view>
		</view>
		<view class="send-user ">
			<view class="form-item" @click="getUser()">
				<view class="form-lable">抄送至</view>
				<view class="item-value">{{ccUserName}}</view>
			</view>
		</view>
		<mihuo-bottom-button :buttonList="buttonList" @click="submit"></mihuo-bottom-button>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	import moment from "@/static/js/moment.js"
	import formCache from '@/plugins/formCache'
	export default {
		data() {
			return {
				key: '',
				options: '',
				timeShow: false,
				resultIndex: 0,
				voiceFile: {},
				isEditStatus: false,
				isEditStatusId: '',
				submitDisplay: false,
				buttonList: [{
					name: '确认提交',
					status: true,
					display: true
				}],
				titleObejct: {
					showStatus: true,
					backgroundColor: '#f5f5f5',
				},
				quesId: '',
				ccUserName: '请选择(可多选)',
				discloseDateName: '请选择交底日期',
				form: {
					discloseDate: '',
					discloseAddress: '',
					houseArea: '',
					remark: '',
					ccPersons: [],
					answer: {},
					discloseLatitude: '',
					discloseLongitude: '',
					projectId: '',
					nodeId: '',
					discloseTitle: '',
					attachments: []
				},
				fileAllList: [],
				fileImage: '',
				fileAudio: '',
				attachment: [],
				questionnaireObject: {},
				tempSelectName: [],
				details: '',
				formCacheStatus: false,
				imageUploadNewIndex: 0,
				formCacheId: '',
				timer: null,
				fileLoading: true,
				saveLoading: false,
				pageTitle: '开工交底',
			}
		},
		onLoad(options) {
			this.options = options
			this.setAddress()
			this.getDetails()
			this.setCcPersons()
			this.$refs.questionnaireConfig && this.$refs.questionnaireConfig.getQuestionnaire()
		},
		onPageScroll(e) {
			// this.debounce(() => {
			this.$refs.questionnaireConfig && this.$refs.questionnaireConfig.setLocationType(e)
			// }, 200)
		},
		onShow() {
			uni.$once('checkList', (data) => {
				this.form.ccPersons = []
				let tempDataList = JSON.parse(data)
				tempDataList.forEach(el => {
					this.form.ccPersons.push({
						handlePersonId: el.personId,
						handlePersonName: el.name,
						handleSkillId: el.skillId,
						handleSkillName: el.skillName,
						handleUserId: el.userId,
					})
				})
				this.ccUserName = JSON.parse(data).map(item => item.name).join(',')
			})
			uni.$once('updateData', (data) => {
				this.form.discloseLatitude = data.location.lat,
					this.form.discloseLongitude = data.location.lng,
					this.form.discloseAddress = data.title
			})


			// 监听问卷数据是否渲染完成
			uni.$on('saveTiming', () => {
				// 保存问卷之后就不在执行定时任务
				if (!this.formCacheStatus) {
					this.saveTiming()
				}
			})

			this.$refs.questionnaireConfig && this.$refs.questionnaireConfig.getTodoDiscloseList()
		},
		watch: {
			questionnaireObject: {
				handler(newVal, oldVal) {},
				deep: true
			},
			fileUploadList: {
				handler(newVal, oldVal) {
					try {
						if (newVal.length > 0) {
							newVal.forEach(el => {
								if (el.localPathStatus) {
									this.fileLoading = true
									this.saveLoading = true
								} else {
									throw e
								}
							})
						} else {
							this.fileLoading = true
							this.saveLoading = true
						}
					} catch (e) {
						this.fileLoading = false
						this.saveLoading = false
					}
				},
				deep: true
			},
			saveLoading: {
				handler(newVal, oldVal) {
					this.buttonList[0].display = newVal ? false : true
				}
			}
		},
		computed: {
			...mapState(['projectInfo', 'orderInfo', 'nodeInfo', 'userPersonInfo', 'templatePendingCount',
				'fileUploadList'
			]),
			formCacheObejct() {
				return {
					formRemark: this.form.remark,
					fileAudio: this.fileAudio,
					fileImage: this.fileImage
				}
			}
		},
		onUnload() {
			if (!this.formCacheStatus) {
				this.cacheForm('add')
			}
			uni.$off('saveTiming')
			this.eliminateTiming()
			this.$store.commit('setFileUploadList', [])
		},

		onBackPress(options) {

		},
		methods: {
			saveTiming() {
				this.timer = setInterval(() => {
					this.cacheForm('add')
				}, 5000)
				uni.setStorageSync('eliminateTiming', this.timer)
			},
			eliminateTiming() {
				clearInterval(this.timer);
				this.timer = null
			},
			getCacheId() {
				if (this.options.detailsId) {
					this.formCacheId = this.options.detailsId
					return this.options.detailsId
				} else {
					this.formCacheId = this.nodeInfo.nodeId
					return this.nodeInfo.nodeId
				}
			},
			setAddress() {
				this.quesId = this.nodeInfo.quesId
				this.form.projectId = this.projectInfo.projectId
				this.form.nodeId = this.nodeInfo.nodeId
				this.form.discloseAddress = this.projectInfo.poiName + this.projectInfo.address
				this.form.discloseLongitude = this.projectInfo.longitude
				this.form.discloseLatitude = this.projectInfo.latitude
				this.form.discloseTitle = this.projectInfo.poiName + this.projectInfo.address + this.nodeInfo.nodeName

				this.setExecPerson()
				this.setDiscloseDateName()
				this.setTitle()
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
							this.form.execPersonId = tempPerson.personId
							this.form.execPersonName = res.realName
							this.form.execSkillId = tempPerson.skillId
							this.form.execSkillName = tempPerson.skillName
						}
					}
				})
			},
			setTitle() {
				if (!this.quesId) {
					return
				}
				this.$httpApi.getTemplateInfoById({
					id: this.quesId,
				}).then(res => {
					if (res) {
						// uni.setNavigationBarTitle({
						// 	title: this.options.detailsId ? `编辑${res.surveyName}` : res.surveyName
						// })
						this.pageTitle = this.options.detailsId ? `编辑${res.surveyName}` : res.surveyName
					}
				})
			},
			setDiscloseDateName() {
				this.discloseDateName = moment().format("YYYY-MM-DD")
			},
			getDetails() {
				if (!this.options.detailsId) {
					return
				}
				this.isEditStatus = true
				this.isEditStatusId = this.options.detailsId
				this.$httpApi.discloseDetails({
					id: this.options.detailsId
				}).then(res => {
					if (res) {
						this.form.remark = res.remark
						if (this.$isJSON(res.attachments)) {
							let tempAttachments = JSON.parse(res.attachments)
							tempAttachments.forEach(el => {
								if (el.type == 'img' || el.type == 'video') {
									el['localPathStatus'] = true
								}
							})
							this.fileImage = JSON.stringify(tempAttachments.filter(item => item.type == 'img' ||
								item.type == 'video'))
							this.imageUploadNewIndex++
						}

						// 赋值抄送信息
						if (res.ccPersons && res.ccPersons.length > 0) {
							this.ccUserName = res.ccPersons.map(item => item.handlePersonName).join(',')
							res.ccPersons.forEach(el => {
								this.form.ccPersons.push({
									handlePersonId: el.handlePersonId,
									handlePersonName: el.handlePersonName,
									handleSkillId: el.handleSkillId,
									handleSkillName: el.handleSkillName,
									handleUserId: el.handleUserId,
								})
							})
						}
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
			confirmTime(even) {
				this.discloseDateName = even.year + '-' + even.month + '-' + even.day
			},
			getUser() {
				this.toPage('/pages/publishTask/selectPick?pageType=团队成员&multiple=true&assign=1')
			},
			getConstructionSite() {
				uni.navigateTo({
					url: '/pages/mapChoose/mapChoose',
					animationType: 'slide-in-bottom',
				})
			},
			getLoading() {
				this.saveLoading = true
			},
			submit() {
				this.debounce(() => {
					if (!this.fileLoading) {
						this.$util.toast("图片上传失败，请重新上传");
						return
					}
					if (!this.saveLoading) {
						return
					}
					let verificationResult = ''
					this.$questionnaireVerification(this.questionnaireObject.questionnaireList, (res) => {
						verificationResult = res
					})
					if (verificationResult) {
						this.$refs.questionnaireConfig && this.$refs.questionnaireConfig.titleLocation(
							verificationResult)
						return
					}
					// 不需要提交 待确认状态
					this.questionnaireObject.questionnaireList.forEach(item => {
						item.surveyTemplateQuesDTOList.map(el => {
							el['confirmStatus'] = false
						})
					})
					this.form.answer = {
						answerContent: JSON.stringify(this.questionnaireObject.questionnaireList),
						surveyName: this.questionnaireObject.details && this.questionnaireObject.details
							.surveyName,
						surveyTemplateId: this.quesId,
						id: this.quesId
					}
					this.form.discloseDate = this.discloseDateName + ' 00:00:00'

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
						this.form.attachments = this.attachment
					}
					if (this.form.discloseDate.includes('请选择交底日期')) {
						this.$util.toast("请填写交底日期");
						return
					}

					uni.showLoading({
						title: '加载中',
						mask: true
					});

					if (!this.$checkUploadProcess(this.fileImage)) {
						return
					}
					this.$httpApi.saveOrderDisclose(this.form).then(res => {
						this.cacheForm('remove')
						if (this.options.detailsId) {
							this.$util.toast("编辑成功,将返回列表页~");
							uni.navigateBack({
								delta: 2
							});
						} else {
							this.$util.toast(`交底成功,将返回上一页`);
							this.setQuestionnaireObjectList()
							uni.navigateBack();
						}
					}).finally(() => {
						uni.hideLoading();
					})

				})
			},
			setQuestionnaireObjectList() {
				let questionnaireObjectList = uni.getStorageSync('questionnaireObjectList')
				if (questionnaireObjectList.length > 0) {
					questionnaireObjectList = questionnaireObjectList.filter(item => item.nodeId !== this.nodeInfo.nodeId)
					uni.setStorageSync('questionnaireObjectList', questionnaireObjectList)
				}
			},
			verifyData() {
				if (this.form.discloseDate.includes('请选择交底日期')) {
					this.$util.toast("请填写交底日期");
					return
				}

				if (!this.form.houseArea) {
					this.$util.toast("请填写房屋面积");
					return
				}

				if (this.form.ccPersons.length === 0) {
					this.$util.toast("请选择抄送人");
					return
				}
			},
			cacheForm(typeName) {
				let tempCache = new formCache()
				let tempParameter = {
					cacheId: this.getCacheId(),
					items: this.questionnaireObject,
					formRemark: this.form.remark,
					fileAudio: this.fileAudio,
					fileImage: this.fileImage
				}
				this.formCacheDetails = tempParameter
				switch (typeName) {
					case 'add':
						tempCache.contrastCache(tempParameter, '交底问卷')
						break
					case 'remove':
						tempCache.removelCache(tempParameter, '交底问卷', () => {
							this.formCacheStatus = true
						})
						break
					case 'recovery':
						tempCache.assignmentCache(tempParameter, (data) => {
							this.form.remark = data.formRemark
							this.fileImage = data.fileImage
							this.fileAudio = data.fileAudio
							this.imageUploadNewIndex++
						})
						this.$refs.questionnaireConfig && this.$refs.questionnaireConfig.recovery(() => {
							tempCache.removelCache(tempParameter, '交底问卷')
							this.$refs.formCacheItem && this.$refs.formCacheItem.eliminate()
						})
						break
					case 'saveTiming':
						tempCache.saveTiming(tempParameter, '交底问卷')
						break
				}
			},
			/**
			 * @description sop交底节点有配置通知岗位时，通过团队成员默认带出该岗位的所有人员
			 * */
			setCcPersons() {
				if (this.options.detailsId) {
					return
				}
				if (!this.nodeInfo.notifyJob) {
					return
				}
				this.$httpApi.getMemberList({
					projectId: this.projectInfo.projectId // 项目id
				}).then(res => {
					if (res) {
						let tempNotifyJob = this.nodeInfo.notifyJob.split(',')
						let tempCcPersons = res.filter(item => tempNotifyJob.includes(item.skillId))
						// 过滤掉自己
						tempCcPersons = tempCcPersons.filter(item => item.personId !== this.userPersonInfo
							.personId)
						if (tempCcPersons && tempCcPersons.length > 0) {
							this.ccUserName = tempCcPersons.map(item => item.name).join(',')
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
