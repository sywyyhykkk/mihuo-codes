<template>
	<view class="processList-contain">
		<view class="information-contain public-m">
			<view class="processList-file ">
				<view style="display: flex;">
					<u-avatar class="node" size="70" :src="$util.thumbnailImage(checkedData.applyPersonAvatar,true)">
					</u-avatar>
					<view style="margin-left: 20rpx;">
						<view style="line-height: 40rpx;">
							<text class="worker-type"
								v-if="checkedData.applySkillName">{{checkedData.applySkillName}}</text>
							<text class="worker-name"
								v-if="checkedData.applyPersonName">{{checkedData.applyPersonName}}</text>
						</view>
						<view class="worker-status">
							<view class="worker-date" v-if="checkedData.applyTime">
								{{checkedData.applyTime.substring(0,16)}} 发起
							</view>
							<view class="status-right" @click="goCompletionSituation">
								完工情况
							</view>
						</view>
					</view>
				</view>
				<view class="worker-hint" v-if="workObject && workObject.name">{{workObject.name}}已完工，请求验收</view>
			</view>
			<view class="processList-standard">
				<view class="item-particulars" :key="index" v-for="(item,index) in acceptanceList">
					<view class="title">
						<view class="name-contain">
							<view class="item-grouping">
								<view class="item-left">
									{{item.productName}}
								</view>
								<view class="item-right" @click="clickOpen(item)">
									<text>点击{{item.openShow?'收起':'展开'}}</text>
									<image :class="[item.openShow ? 'public-block':'public-none']"
										src="/static/images/bottom-icon.png" class="public-arrow"></image>
								</view>
							</view>
							<view :style="{ display:item.openShow ? 'block':'none' }" class="item-grouping-contain" v-for="(el,nums) in item.checkStandard" :key="nums">
								<view class="item-title">
									<view class="name-contain-all">
										<view class="item-left">
											<view class="item-name-contain">
												<view class="item-name">
													<text class="star" v-if="el.indexStatus== 1 ">*</text>
													<text class="name">{{nums<9?'0'+ (nums+1):nums+1}}.</text>
													{{el.title}}
													<text class="score">({{el.score}}分)</text>
												</view>
												<view class="item-desc">
													{{el.description}}
												</view>
											</view>
											<view class="public-instructions" @click="goInstruction(index,nums)">
												<u-icon name="camera" class="plus-icon" size="44" color="#C5C5C5">
												</u-icon>
											</view>
										</view>
									</view>
								</view>
								<view class="status-contain">
									<text v-for="(en,num) in el.resulsParticulars" :key="num"
										:class="[el.selectActive === en.value?'results-status-active':'']"
										class="item-status" @click="getParticulars(index,nums,el,en)">
										{{en.label}}
										<text class="selected" v-show="el.selectActive === en.value">
											<u-icon name="checkmark" class="checkmark-icon" color="#fff" size="24">
											</u-icon>
										</text>
									</text>
								</view>
							</view>
						</view>
					</view>
					<!-- <view class="status-contain">
						<text v-for="(el,num) in resulsParticulars" :key="num"
							:class="[el.value === item.active?'results-status-active':'']" class="item-status"
							@click="getParticulars(index,num,el)">
							{{el.label}}
							<text class="selected" v-show="el.value === item.active">
								<u-icon name="checkmark" class="checkmark-icon" color="#fff" size="24"></u-icon>
							</text>
						</text>
					</view> -->
				</view>
				<view class="score">当前得分：{{form.score}}分</view>
			</view>
		</view>
		<view class="processList-conclusion public-m">
			<view class="title">
				<view class="left">总结</view>
				<!-- <view class="right public-instructions" @click="goInstruction(-2)">
					<u-icon name="camera" class="plus-icon" size="44" color="#C5C5C5"></u-icon>
					补充说明
				 </view> -->
			</view>
			<!-- <view class="results">
				<text v-for="(item,index) in resulsStatus" :key="index"
					:class="[ resultsStatus && item.label === '验收通过' ? 'start-display-button' : item.value === form.statusFlag?'results-status-active':'']"
					class="results-status" @click="getResulsStatus(item)">
					{{item.label}}
					<text class="selected" v-show="form.statusFlag === item.value">
						<u-icon name="checkmark" class="checkmark-icon" color="#fff" size="24"></u-icon>
					</text>
				</text>
			</view> -->
			<view class="acceptance-desc">
				<u-input v-model="form.checkDesc" class="describe-input" height="190" maxlength="200" type="textarea"
					placeholder="是否合格，请具体描述" :border="true" />
				<view class="file-contain">
					<view class="image-contain">
						<image-upload-new :uploadType="uploadType" v-model="form.acceptancePicFiles" />
					</view>
					<view class="voice-contain" @click="isShowButton = false">
						<sound-recording v-model="appendVoiceFile" @close="isShowButton = true" />
					</view>
				</view>
			</view>
		</view>
		<!-- 	<view class="submit-text" @click="submit">
			确认验收
		</view> -->
		<bottom-button v-if="isShowButton" title="确认验收" @click="submit()"></bottom-button>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	import moment from "@/static/js/moment.js"
	/*********项目经理或者监理确认验收**********/
	export default {
		data() {
			return {
				isShowButton: true,
				score: 0,
				option: {},
				current: 1,
				shouqiShow: false,
				resultIndex: -1,
				uploadType: ['图片', '视频'],
				resulsParticulars: [{
						label: '通过',
						value: 1
					},
					{
						label: '不通过',
						value: 0
					}
				],
				resulsStatus: [{
						label: '验收通过',
						value: 1
					},
					{
						label: '验收不通过',
						value: 2
					}
				],
				form: {
					items: [],
					acceptanceQues: '', //	存在问题		false	
					applyDesc: '', //	验收申请描述		false	
					applyPersonId: '', //	验收申请人Id		false	
					applyPersonName: '', //	验收申请人姓名		false	
					applySkillId: '', //	验收申请岗位		false	
					applySkillName: '', //	验收申请岗位名称		false	
					applyTime: '', //	验收申请时间		false	
					checkDesc: '', // 备注
					name: '', //	验收名称		false	
					notCount: '', //	未选项		false	
					id: '', //	验收项id		false	
					qualifiedCount: '', //	合格项		false	
					score: '', //	分数		false	
					templateId: '0', //	验收模板Id		false	
					unqualifiedCount: '', //	不合格项		false	
					acceptanceVoiceFiles: '', // 音频文件
					acceptancePicFiles: '', //	图片文件		false
					statusFlag: '1'
				},
				checkedData: {},
				wholeStatus: true,
				acceptanceList: [],
				instructionIndex: 0,
				instructionIndexProblem: 0,
				appendVoiceFile: '',
				resultsStatus: false,
				acceptanceType: '',
				acceptanceTypeNew: '',
				workObject: '',
				personId: '',
				projectId: '',
				nodeId: '',
				acceptanceTemplateId: ''

			}
		},
		watch: {
			appendVoiceFile(newVal, oldVal) {
				this.chooseVoice(newVal)
			}
		},
		onLoad(option) {
			this.option = option
			this.setParameter()
		},
		onShow() {
			uni.$once('replenish', (data) => {
				var list = data ? JSON.parse(data) : {};
				if (list) {
					let tempData = this.acceptanceList[this.instructionIndex]
					if (tempData) {
						if (tempData['checkStandard'][this.instructionIndexProblem]) {
							tempData['checkStandard'][this.instructionIndexProblem].appendPicFiles = list
								.appendPicFiles
							tempData['checkStandard'][this.instructionIndexProblem].appendQues = list.appendQues
							tempData['checkStandard'][this.instructionIndexProblem].appendPlan = list.appendPlan
							tempData['checkStandard'][this.instructionIndexProblem].appendVoiceFile = list
								.appendVoiceFile
						}
					}
				}
			})
		},
		onUnload() {
			uni.$off('replenish')
		},
		onHide() {},
		onReachBottom() {

		},
		methods: {
			setParameter() {
				this.form.id = this.option.itemId
				this.getTemplateId()
				this.getCheckedData()
			},
			getTemplateId() {
				if (this.option.productIds) {
					this.$httpApi.getProductAcceptanceList({
						productIds: this.option.productIds
					}).then(res => {
						if (res) {
							res.map(item => {
								item['openShow'] = true 
								item.checkStandard = item.checkStandard != '' && JSON.parse(item
									.checkStandard)
							})
							res.map(el => {
								el.checkStandard.map(ev => {
									ev['selectActive'] = -1
									ev['resulsParticulars'] = [{
										label: '通过',
										value: 1
									}, {
										label: '不通过',
										value: 0
									}]

									// 补充问题
									ev['appendPicFiles'] = ''
									ev['appendQues'] = ''
									ev['appendPlan'] = ''
									ev['appendVoiceFile'] = ''
								})
							})
							this.acceptanceList = res
							console.log("acceptanceList", this.acceptanceList);
						}
					})
				}
				return

				this.$httpApi.selectSysjobskill({
					skillId: this.option.skillId
				}).then(res => {
					if (res) {
						this.acceptanceTemplateId = res.acceptanceTemplateId
						this.form.templateId = this.acceptanceTemplateId
						this.getData()
					}
				})
			},
			getData() {
				let newTime = moment().format('YYYY-MM-DD HH:mm')
				if (!this.acceptanceTemplateId) {
					return
				}
				this.$httpApi.getTemplateById({
					templateId: this.acceptanceTemplateId
				}).then(res => {
					if (res) {
						this.acceptanceList = res.acceptanceItemTemplateList
						this.form.name = res.acceptanceName
					}
				})
			},
			getCheckedData() { // 验收资料
				this.$http.get("order/customer/bizorderacceptance/getByOrderId", {
					orderId: this.option.id
				}).then(res => {
					if (res) {
						if (res.length > 0) {
							this.checkedData = res[0]
							this.form.applyPersonId = res[0].applyPersonId
							this.form.applyPersonName = res[0].applyPersonName
							this.form.applySkillId = res[0].applySkillId
							this.form.applySkillName = res[0].applySkillName
							this.form.applyTime = res[0].applyTime
							this.form.applyDesc = res[0].applyDesc

							this.form.name = res[0].applyDesc
						}
					}
				})
			},

			goCompletionSituation() {
				uni.navigateTo({
					url: `/pages/orderReceiving/acceptance/completionSituation?itemId=${this.option.itemId}&orderId=${this.option.id}`
				})
			},
			goInstruction(index, nums) {
				this.instructionIndex = index
				this.instructionIndexProblem = nums
				let tempParameter = {
					appendPicFiles: this.acceptanceList[index]['checkStandard'][nums].appendPicFiles, // 补充图片
					appendQues: this.acceptanceList[index]['checkStandard'][nums].appendQues, // 存在问题
					appendPlan: this.acceptanceList[index]['checkStandard'][nums].appendPlan, // 	整改方案
					appendVoiceFile: this.acceptanceList[index]['checkStandard'][nums].appendVoiceFile // 	补充音频
				}

				uni.navigateTo({
					url: `/pages/orderReceiving/acceptance/supplementaryInstruction`,
					events: {
						acceptDataFromOpenedPage: function(data) {}
					},
					success(res) {
						res.eventChannel.emit('supplementaryInstruction', tempParameter);
					}
				})
			},
			getParticulars(index, nums, item, event) {
				// 1.选中  如果不通过，则跳转补充说明
				item.selectActive = event.value
				// 计算分数、合格项
				this.form.score = 0
				this.form.qualifiedCount = 0
				this.acceptanceList.map(res => {
					res.checkStandard.map(ev => {
						if (ev.selectActive == 1) {
							this.form.score = Number(ev.score) + Number(this.form.score)
							this.form.qualifiedCount++
						}
					})
				})
				let tempList = []
				this.acceptanceList.forEach(item => {
					item.checkStandard.forEach(el => {
						tempList.push({
							selectActive: el.selectActive,
							indexStatus: el.indexStatus
						})
					})
				})
				console.log('tempList', tempList);
				try {
					tempList.forEach(el => {
						if (el.selectActive == 0 && el.indexStatus == 1) {
							throw true
						} else {
							this.resultsStatus = false
						}
					})
				} catch (e) {
					this.resultsStatus = e
				}
				//判断验收结果是否通过还是不通过
				// if (this.resultsStatus) {
				// 	this.form.statusFlag = 2
				// } else {
				// 	this.form.statusFlag = -1
				// }
				// 跳转补充说明
				if (!item.selectActive) {
					setTimeout(() => {
						this.goInstruction(index, nums)
					}, 300);
				}
			},
			getResulsStatus(item) {
				if (this.acceptanceType === 1) {
					if (!(this.resultsStatus && item.label === '验收通过')) {
						this.form.statusFlag = item.value
					}
				} else {
					this.form.statusFlag = item.value
				}
			},
			clickOpen(item) {		
				item.openShow = !item.openShow
			},
			getDetails(item, index) {
				this.toPage(`/pages/construction/acceptance/uploadCredentials?index=${index + 1}`)
			},
			submit() {
				this.debounce(() => {
					this.form.items = []
					this.acceptanceList.map(item => {
						item.checkStandard.map(res => {
							this.form.items.push({
								appendPicFiles: res.appendPicFiles || '',
								appendQues: res.appendQues || '',
								appendPlan: res.appendPlan || '',
								appendVoiceFile: res.appendVoiceFile || '',
								checkFlag: res.checkFlag || res.indexStatus,
								dealJobIds: res.dealJobIds || '',
								itemName: res.itemName || res.title,
								part: res.part || '',
								passFlag: res.selectActive, //是否通过
								score: res.score,
								sort: res.sort || 0,
								standard: res.standard || res.description,
								standardImg: res.standardImg || res.processPic || '',
								templateItemId: res.id || 0,
							})
						})
					})
					let tempUnqualifiedCount = []
					let tempNotCount = []
					if (this.form.items.length > 0) {
						this.form.items.map(item => {
							if (item.passFlag == 0) {
								tempUnqualifiedCount.push(item)
							} else if (item.passFlag === undefined) {
								tempNotCount.push(item)
							}
						})
					}
					this.form.unqualifiedCount = tempUnqualifiedCount.length
					this.form.notCount = tempNotCount.length
					for (let i = 0; i < this.form.items.length; i++) {
						if (this.form.items[i].passFlag == -1 && Number(this.form.items[i].checkFlag) !==
							0) {
							this.$util.toast(`请对${this.form.items[i].itemName}进行验收`);
							return
						} else if (this.form.items[i].passFlag === 0) {
							if (!this.form.items[i].appendQues) {
								this.$util.toast(`请填写${this.form.items[i].itemName}补充说明`);
								return
							}
						}
					}
					// if (this.form.statusFlag === -1) {
					// 	this.$util.toast(`请确认是否通过`);
					// 	return
					// }
					if (!this.$checkUploadProcess(this.form.picFiles)) {
						return
					}
					console.log("this.form", this.form)
					// return
					this.$httpApi.saveAcceptanceById(
						this.form
					).then(res => {
						if (res) {
							this.$util.toast(`验收成功`);
							uni.navigateBack({
								delta: 1
							})
						}
					})
				}, 200)
			},
			async chooseVoice(file) {
				this.isShowButton = true
				if (file.path) {
					let temp = {
						type: 'audio',
						timeLength: file.duration,
						url: await this.$CommonUpload(file.path)
					}
					this.form.acceptanceVoiceFiles = JSON.stringify(temp)
				} else {
					this.form.acceptanceVoiceFiles = ''
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.public-arrow {
		margin-left: 10rpx;
		width: 16rpx;
		height: 16rpx;
		transform: rotate(90deg)
	}

	.public-none {
		transition: all .2s;
		transform: rotate(0deg);
	}

	.public-block {
		transition: all .2s;
		transform: rotate(90deg);
	}

	.score {
		font-size: 28rpx;
		text-align: right;
		color: $themeColor;
		margin-left: 20rpx;
	}

	.start-display-button {
		opacity: 0.5;
	}

	.processList-contain {
		padding-bottom: 60rpx;

		.public-m {
			background: #FFFFFF;
			border-radius: 16rpx;
			margin-left: 20rpx;
			margin-right: 20rpx;
		}

		.public-instructions {
			font-weight: bold;
			font-size: 24rpx;
			color: $themeColor;
		}

		.information-contain {
			padding: 46rpx 44rpx 52rpx 44rpx;
			margin-bottom: 8rpx;
			margin-top: 12rpx;

			.processList-file {
				// display: flex;
				padding-bottom: 42rpx;
				border-bottom: 2rpx dashed #EEEEEE;
				margin-bottom: 48rpx;

				.worker-hint {
					font-weight: normal;
					font-size: 28rpx;
					line-height: 40rpx;
					color: #606166;
				}

				.worker-status {
					display: flex;
					height: 40rpx;
					align-items: center;
					width: calc(100vw - 220rpx);

					.worker-date {
						font-weight: normal;
						font-size: 26rpx;
						color: #909199;
					}

					.status-right {
						flex: 1;
						text-align: right;
						font-weight: 500;
						font-size: 28rpx;
						color: $themeColor;
					}
				}


				.worker-type {
					font-weight: bold;
					font-size: 28rpx;
					color: $seconFontColor;
				}

				.worker-name {
					font-weight: normal;
					font-size: 28rpx;
					color: #909199;
					margin-left: 10rpx;

				}

				.person-image {
					height: 70rpx;
					width: 70rpx;
					border-radius: 70rpx;
				}

				.item-image {
					width: 182rpx;
					margin-right: 18rpx;
				}
			}

			.processList-standard {
				.item-particulars {
					border-bottom: 2rpx dashed #EBEBEB;
					// padding-bottom: 60rpx;
					margin-bottom: 34rpx;
					width: 100%;

					&:last-child {
						margin-bottom: 0rpx;
						border-bottom: 0rpx;
					}
				}

				.title {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 22rpx;
					flex: 1;

					.name-contain {
						display: flex;
						align-items: baseline;
						flex-direction: column;
						flex: 1;

						.item-grouping {
							display: flex;
							align-items: center;
							width: 100%;
							justify-content: space-between;
							margin-bottom: 28rpx;

							.item-left {
								font-size: 30rpx;
								color: #303133;
								font-weight: bold;
								display: flex;
								align-items: center;
							}

							.item-right {
								display: flex;
								align-items: center;

								text {
									font-size: 26rpx;
									color: #A7A7A7;
								}
							}
						}

						.item-grouping-contain {
							width: 100%;
							margin-bottom: 48rpx;
						}

						.item-title {
							width: 100%;
						}

						.name-contain-all {
							width: 100%;

							.item-left {
								display: flex;
								align-items: flex-start;
								justify-content: space-between;

								.item-name-contain {
									display: flex;
									flex: 1;
									flex-direction: column;

									.item-name {
										font-size: 28rpx;
										color: #606166;
										padding-right: 10rpx;
										margin-bottom: 10rpx;

										.name {
											font-size: 28rpx;
											color: #909199;
										}

										.star {
											color: $errorColor;
										}
									}

									.item-desc {
										font-size: 26rpx;
										padding-left: 52rpx;
										color: #909199;
										margin-bottom: 22rpx;
									}
								}
							}
						}

						.item-standard {
							font-size: 26rpx;
							color: #909199;
						}

						// .name {
						// 	font-weight: bold;
						// 	font-size: 28rpx;
						// 	max-width: 380rpx;
						// 	color: $seconFontColor;
						// }

						.indicators {
							display: inline-block;
							transform: scale(0.80);
							font-size: 12rpx;
							color: $errorColor;
							// transition: ;
						}

						.number {
							display: flex;
							align-items: center;
							font-weight: bold;
							font-size: 28rpx;
							color: #909199;
							margin-right: 10rpx;


						}
					}
				}

				.status-contain {
					padding-left: 50rpx;

					.item-status {
						font-size: 26rpx;
						display: inline-block;
						padding: 16rpx 48rpx 20rpx 48rpx;
						border: 2rpx solid #D9D9D9;
						border-radius: 10rpx;
						margin-right: 60rpx;
						position: relative;
					}


				}
			}
		}

		.processList-conclusion {
			padding: 40rpx 44rpx 32rpx 32rpx;
			margin-bottom: 72rpx;


			.title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 36rpx;

				.left {
					font-weight: bold;
					font-size: 30rpx;
					color: $seconFontColor;
				}
			}

			.results-status {
				display: inline-block;
				width: 210rpx;
				padding: 16rpx 0 20rpx 0;
				margin-bottom: 30rpx;
				border: 2rpx solid #D9D9D9;
				font-size: 26rpx;
				color: #666666;
				text-align: center;
				border-radius: 10rpx;
				margin-right: 38rpx;

				&:last-child {
					margin-right: 0rpx;
				}
			}

			.describe-input {
				background-color: #F7F7F7;
				margin-bottom: 20rpx;
				border: 0px;
			}
		}

		.results-status-active {
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

		.plus-icon {
			margin-right: 10rpx;
		}

		.submit-text {
			background: $themeColor;
			border-radius: 10rpx;
			margin: 0rpx 60rpx;
			padding: 24rpx 256rpx;
			font-size: 28rpx;
			color: #FFFFFF;
		}
	}

	.file-contain {
		.image-contain {
			margin-bottom: 20rpx;
		}
	}
</style>
