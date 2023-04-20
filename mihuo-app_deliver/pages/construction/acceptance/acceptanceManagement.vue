<template>
	<view class="processList-contain">
		<form-cache-item ref="formCacheItem" :cacheId="form.nodeId" @recovery="cacheForm('recovery')">
		</form-cache-item>

		<view class="information-contain public-m">
			<view class="processList-file ">
				<view style="display: flex;">
					<!-- <img-cache v-if="personInfo.userId" class="head_image" :src="$util.avatarImage(personInfo.userId)">
					</img-cache> -->
					<u-avatar class="node" size="70" :src="$util.thumbnailImage(option.avatar,true)">
					</u-avatar>
					<view style="margin-left: 20rpx;">
						<view style="line-height: 40rpx;">
							<text class="worker-type" v-if="option.skillName">{{option.skillName}}</text>
							<text class="worker-name" v-if="option.name">{{option.name}}</text>
						</view>
						<view class="worker-status">
							<view class="worker-date" v-if="option.time">{{option.time.substring(0,16)}} 发起</view>
							<view class="status-right" @click="goCompletionSituation">
								{{acceptanceTypeNew === 1?'完工情况':''}}
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
									<view class="number">
										<text class="star"
											v-if="Number(item.checkFlag)=== 1 || Number(item.indexStatus)=== 1 ">*
										</text>
										<text class="name">{{index<9?'0'+ (index+1):index+1}}.</text>
									</view>
									{{item.itemName}}
								</view>
								<!-- <view class="item-right" @click="clickOpen(index,'child')">
									<text>{{item.groupingShowStatus?'收起':'展开'}}</text>
									<image :class="[item.groupingShowStatus ? 'public-block':'public-none']"
										src="/static/images/bottom-icon.png" class="public-arrow"></image>
								</view> -->
							</view>
							<view class="item-title">
								<view class="name-contain-all">
									<view class="item-left">
										<view class="item-name-contain">
											<view class="item-name">
												{{item.standard}}
												<text class="score">({{item.score}}分)</text>
											</view>
										</view>
										<view class="character-contain" @click="goInstruction(index)">
											<view v-if="item.appendQues" class="character">已补充</view>
											<u-icon name="camera" class="plus-icon" size="44" color="#C5C5C5"></u-icon>
										</view>
									</view>
								</view>
								<view class="item-standard">
									<!-- {{item.standard}} -->
								</view>
							</view>
						</view>
					</view>
					<view class="status-contain">
						<text v-for="(el,num) in resulsParticulars" :key="num"
							:class="[el.value === item.active?'results-status-active':'']" class="item-status"
							@click="getParticulars(index,num)">
							{{el.label}}
							<text class="selected" v-show="el.value === item.active">
								<u-icon name="checkmark" class="checkmark-icon" color="#fff" size="24"></u-icon>
							</text>
						</text>
					</view>
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
			<view class="results">
				<text v-for="(item,index) in resulsStatus" :key="index"
					:class="[ resultsStatus && item.label === '验收通过' ? 'start-display-button' : item.value === form.statusFlag?'results-status-active':'']"
					class="results-status" @click="getResulsStatus(item)">
					{{item.label}}
					<text class="selected" v-show="form.statusFlag === item.value">
						<u-icon name="checkmark" class="checkmark-icon" color="#fff" size="24"></u-icon>
					</text>
				</text>
			</view>
			<view class="acceptance-desc">
				<u-input v-model="form.checkDesc" class="describe-input" height="190" maxlength="200" type="textarea"
					placeholder="是否合格，请具体描述" :border="true" />
				<view class="file-contain">
					<view class="image-contain">
						<image-upload-new :isAddWatermark="true" :address="waterAddress" :userInfo="waterUserInfo"
							:uploadType="uploadType" :key="imageUploadNewIndex" v-model="form.picFiles" />
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
		<bottom-button v-if="isShowButton && $permissionRouting.getInstance().isShow()"
			:style="`opacity: ${saveLoading ? 1 : 0.5}`" title="提交验收" @click="submit">
		</bottom-button>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	import formCache from '@/plugins/formCache'
	import {
		deepClone
	} from '@/plugins/utils.js'
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
				imageUploadNewIndex: 0,
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
					checkDesc: '',
					checkType: '',
					name: "",
					statusFlag: -1,
					picFiles: '',
					projectId: '',
					qualifiedCount: 0,
					score: 0,
					nodeId: '',
					templateId: 0,
					unqualifiedCount: 0,
					voiceFiles: '',
					notCount: ''
				},
				waterAddress: '',
				waterUserInfo: '',
				formCacheStatus: false,
				wholeStatus: true,
				acceptanceList: [],
				instructionIndex: 0,
				appendVoiceFile: '',
				resultsStatus: false,
				acceptanceType: '',
				acceptanceTypeNew: '',
				workObject: '',
				personId: '',
				projectId: '',
				nodeId: '',
				timer: null,
				saveLoading: false,

			}
		},
		watch: {
			appendVoiceFile(newVal, oldVal) {
				this.chooseVoice(newVal)
			}
		},
		onUnload() {
			if (!this.formCacheStatus) {
				this.cacheForm('add')
			}
			this.eliminateTiming()
		},
		onBackPress(options) {

		},
		onLoad() {
			const eventChannel = this.getOpenerEventChannel();
			eventChannel.on('getAcceptanceManagement', (data) => {
				this.option = data
				this.setParameter()
				this.getData()
				this.form.id = data.id || 0
				this.getInnerAcceptances()
				this.saveTiming()
				this.getLocaltion()
			});
		},
		onShow() {
			uni.$on('replenish', (data) => {
				var list = data ? JSON.parse(data) : {};
				if (list) {
					if (this.instructionIndex == -2) {
						this.form.picFiles = list.appendPicFiles
						this.form.voiceFiles = list.appendVoiceFile
						this.form.acceptancePlan = list.appendPlan
						this.form.acceptanceQues = list.appendQues
					} else {
						if (this.acceptanceList[this.instructionIndex]) {
							this.acceptanceList[this.instructionIndex].appendPicFiles = list.appendPicFiles
							this.acceptanceList[this.instructionIndex].appendQues = list.appendQues
							this.acceptanceList[this.instructionIndex].appendPlan = list.appendPlan
							this.acceptanceList[this.instructionIndex].appendVoiceFile = list.appendVoiceFile
							this.acceptanceList = deepClone(this.acceptanceList)
						}
					}
				}
			})


		},
		onHide() {},
		onReachBottom() {

		},
		computed: {
			...mapState(['projectInfo', 'nodeInfo', 'userPersonInfo', 'remainingDays', 'todo'])
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
						console.log(this.waterAddress)
					}
				})
			},
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
			setParameter() {
				this.personId = this.userPersonInfo.personId
				this.form.nodeId = this.nodeInfo.nodeId
				this.form.projectId = this.projectInfo.projectId
				this.form.checkType = this.nodeInfo.checkType
				this.projectId = this.projectInfo.projectId
				this.nodeId = this.nodeInfo.nodeId
				this.waterUserInfo = this.userPersonInfo.name + `（${this.userPersonInfo.skillName}）`;
			},
			getInnerAcceptances() {
				if (this.option.skillId) {
					if (!this.projectId) {
						return
					}

					this.$httpApi.getInnerAcceptances({
						projectId: this.projectId,
						skillId: this.option.skillId
					}).then(res => {
						if (res) {
							this.workObject = res[0]
						}
					})
				}
			},
			getData() {
				let newTime = moment().format('YYYY-MM-DD HH:mm')
				if (!this.nodeId) {
					return
				}
				this.$httpApi.getAcceptanceTemplate(this.nodeId)
					.then(res => {
						if (!res) {
							return
						}
						this.saveLoading = true
						this.getAcceptancesByTaskId()
						if (res.type == 2) {
							this.acceptanceTypeNew = res.type
							this.setGrouping(res.template.acceptanceItemTemplateList)
							this.acceptanceList = res.template && res.template.acceptanceItemTemplateList
							this.form.name = res.template && res.template.acceptanceName
							this.form.templateId = res.template && res.template.id
							this.$getPersonIdUser([this.personId], (ev) => {
								ev.map(item => {
									if (Number(this.personId) === Number(item.personId)) {
										console.log(item, "item")
										this.option.skillName = item.skillName
										this.option.avatar = item.avatar
										this.option.time = newTime
										this.option.applyPersonId = item.personId
									}
								})
								this.$forceUpdate()
							})
						} else {
							this.acceptanceTypeNew = res.type
							this.acceptanceType = res.type
							this.form.name = this.nodeInfo.nodeName
							this.acceptanceList = res.template && res.template.acceptanceItemTemplateList
						}
						this.cacheForm()
					})
			},
			setGrouping(list) {
				let tempName = []
				let tempList = {
					name: '',
					status: true,
					list: []
				}
				let resultList = []
				list.map(item => {
					tempName.push(item.part)
				})
				tempName = Array.from(new Set(tempName));
				list.map(item => {
					tempName.map(el => {
						if (item.part == el) {
							tempList.name = item.part
							tempList.list.push(item)
							resultList.push(tempList)
						}
					})
				})
				resultList = this.unique(resultList, 'name')
				console.log("tempName", resultList);
			},
			unique(arr, key) { // 数据去重
				let map = new Map()
				arr.forEach((item, index) => {
					if (!map.has(item[key])) {
						map.set(item[key], item)
					}
				})
				return [...map.values()]
			},
			goCompletionSituation() {
				uni.navigateTo({
					url: `/pages/construction/acceptance/completionSituation?skillId=${this.option.skillId}`
				})
			},
			goInstruction(index) {
				this.instructionIndex = index
				const activeStatus = this.acceptanceList[index].active || ''
				let tempParameter
				if (this.instructionIndex == -2) {
					tempParameter = {
						appendPicFiles: this.form.picFiles, // 补充图片
						appendQues: this.form.appendQues, // 存在问题
						appendPlan: this.form.appendPlan, // 	整改方案
						appendVoiceFile: this.form.appendVoiceFile // 	补充音频
					}
				} else {
					tempParameter = {
						appendPicFiles: this.acceptanceList[this.instructionIndex].appendPicFiles, // 补充图片
						appendQues: this.acceptanceList[this.instructionIndex].appendQues, // 存在问题
						appendPlan: this.acceptanceList[this.instructionIndex].appendPlan, // 	整改方案
						appendVoiceFile: this.acceptanceList[this.instructionIndex].appendVoiceFile // 	补充音频
					}
				}
				uni.navigateTo({
					url: `/pages/construction/acceptance/supplementaryInstruction`,
					events: {
						acceptDataFromOpenedPage: function(data) {}
					},
					success(res) {
						res.eventChannel.emit('supplementaryInstruction', {
							activeStatus,
							...tempParameter
						});
					}
				})
			},
			getParticulars(index, num) {
				this.acceptanceList[index].active = num == 0 ? 1 : 0
				this.acceptanceList = JSON.parse(JSON.stringify(this.acceptanceList))
				this.form.score = 0
				this.form.qualifiedCount = 0
				this.acceptanceList.map(res => {
					if (res.active == 1) {
						this.form.score += res.score
						this.form.qualifiedCount++
					}
				})
				this.setResultsStatus()

				if (this.resultsStatus) {
					this.form.statusFlag = 2
				} else {
					this.form.statusFlag = -1
				}
				if (!this.acceptanceList[index].active) {
					setTimeout(() => {
						this.goInstruction(index)
					}, 300);
				}
			},
			setResultsStatus() {
				// 若此次验收项中有硬性指标，并且该验收项选择了不通过，则整体不通过
				for (let i = 0; i < this.acceptanceList.length; i++) {
					if (Number(this.acceptanceList[i].indexStatus) === 1 && this.acceptanceList[i].active === 0) {
						this.resultsStatus = true
						return
					} else if (Number(this.acceptanceList[i].checkFlag) === 1 && this.acceptanceList[i].active === 0) {
						this.resultsStatus = true
						return
					} else {
						this.resultsStatus = false
					}
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
			getDetails(item, index) {
				this.toPage(`/pages/construction/acceptance/uploadCredentials?index=${index + 1}`)
			},
			submit() {
				this.form.applyPersonId = this.option.applyPersonId;

				this.debounce(() => {
					this.form.items = []
					this.acceptanceList.map(res => {
						this.form.items.push({
							appendPicFiles: res.appendPicFiles || '',
							appendQues: res.appendQues || '',
							appendPlan: res.appendPlan || '',
							appendVoiceFile: res.appendVoiceFile || '',
							checkFlag: res.checkFlag || res.indexStatus,
							dealJobIds: res.dealJobIds || '',
							itemName: res.itemName || res.title,
							part: res.part || '',
							passFlag: res.active, //是否通过
							score: res.score,
							sort: res.sort || 0,
							standard: res.standard || res.description,
							standardImg: res.standardImg || res.processPic || '',
							// templateItemId: res.templateId || 0,
							templateItemId: res.id || 0,

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
						if (this.form.items[i].passFlag === undefined && Number(this.form.items[i].checkFlag) !==
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
					if (this.form.statusFlag === -1) {
						this.$util.toast(`请确认是否通过`);
						return
					}

					if (!this.$checkUploadProcess(this.form.picFiles)) {
						return
					}
					// order/bizorderacceptance/saveAcceptance 原接口
					// this.$httpApi.saveAcceptanceById(this.form).
					this.$httpApi.saveAcceptance(this.form).then(res => {
						if (res) {
							this.cacheForm('remove')
							if (this.todo.toDoType) {
								this.$httpApi.bizpendingHandle({
									bizPendingDetailId: this.todo.bizPendingDetailId,
									handlePersonId: this.personId
								}).then(res => {
									this.$util.toast(`验收成功`);
									uni.navigateBack({
										delta: 1
									})
								})
							} else {
								this.$util.toast(`验收成功`);
								uni.navigateBack({
									delta: 1
								})
							}

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
					this.form.voiceFiles = JSON.stringify(temp)
				} else {
					this.form.voiceFiles = ''
				}
			},
			cacheForm(typeName) {
				this.form['cacheId'] = this.form.nodeId
				let tempCache = new formCache()
				switch (typeName) {
					case 'add':
						this.form.items = this.acceptanceList
						tempCache.contrastCache(this.form, '验收')
						break
					case 'remove':
						tempCache.removelCache(this.form, '验收', () => {
							this.formCacheStatus = true
						})
						break
					case 'recovery':
						tempCache.assignmentCache(this.form, (data) => {
							this.form = data
							if (this.form.items.length > 0) {
								this.acceptanceList = this.form.items
							}
							this.appendVoiceFile = this.form.voiceFiles
							tempCache.removelCache(this.form, '验收')
							this.$refs.formCacheItem && this.$refs.formCacheItem.eliminate()

							// 解决图片不会回显
							this.imageUploadNewIndex++
						})
						break
					default:
						this.$nextTick(() => {
							this.form.items = this.acceptanceList
							this.$refs.formCacheItem && this.$refs.formCacheItem.getCacheOther(this.form, '验收')
						})
						break
				}
			},
			/**
			 * 
			 * @description  查询所有验收记录 
			 * 
			 * */
			getAcceptancesByTaskId() {
				this.$httpApi.getAcceptancesByTaskId(this.nodeInfo.nodeId).then(res => {
					if (res) {
						let acceptance = res.find(item => item.id == this.option.id)
						let lastAcceptanceIndex = ''
						res.forEach((el, index) => {
							if (el.id == acceptance.id) {
								lastAcceptanceIndex = index + 1
							}
						})
						let lastAcceptanceId = res[lastAcceptanceIndex]?.id
						if (lastAcceptanceId) {
							this.getAcceptance(lastAcceptanceId)
						}
					}
				})
			},
			/**
			 * 
			 * @description  查询验收记录详情 
			 * 
			 * */
			getAcceptance(id) {
				this.$httpApi.getAcceptanceId({
					id
				}).then(res => {
					if (res) {
						let noList = res.items.filter(item => item.passFlag == 1)
						res.items.forEach((item, index) => {
							if (item.passFlag == 1) {
								this.getParticulars(index, 0)
							}
						})
					}
				})
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
					padding-bottom: 60rpx;
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

						.item-title {
							width: 100%;
						}

						.name-contain-all {
							width: 100%;

							.item-left {
								display: flex;
								align-items: flex-start;
								justify-content: space-between;

								.number {
									.name {
										font-size: 28rpx;
										color: #909199;
									}

								}

								.item-name-contain {
									display: flex;
									flex: 1;

									.item-name {
										font-size: 28rpx;
										color: #606166;
										padding-right: 10rpx;
										padding-left: 40rpx;
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

							.star {
								color: $errorColor;
							}
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

	.character-contain {
		position: relative;

		.character {
			position: absolute;
			padding: 8rpx;
			color: #10C57D;
			font-size: 20rpx;
			background: rgba(16, 197, 125, 0.1);
			white-space: nowrap;
			top: -56rpx;
			left: -15rpx;
			border-radius: 6rpx;
			transform: scale(0.85);

			&::after {
				content: '';
				position: absolute;
				bottom: -20rpx;
				left: 30rpx;
				width: 0px;
				height: 0px;
				border: 10rpx solid transparent;
				border-top-color: rgba(16, 197, 125, 0.1);

			}
		}

	}
</style>
