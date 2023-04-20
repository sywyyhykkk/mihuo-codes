<template>
	<view>
		<!-- 指派订单或从SOP模版节点发布订单, 从任务详情页进入 -->
		<view class="order-title-detial">
			<order-title-detial :orderId="orderId"></order-title-detial>
		</view>
		<view class="group-price-list" v-if="groupPriceList.length > 0">
			<view class="item-title">
				服务清单
			</view>
			<view class="item-group" v-for="(item,index) in groupPriceList" :key="index">
				<view class="item-server" v-for="(ev,num) in  item.products" :key="num">
					<view class="item-left">
						<text class="item-num">0.{{num+1}}</text>
						<text class="item-name">{{ev.productName}}</text>
						<text class="item-specifications">{{ev.price}}X{{ev.selectNum}}</text>
					</view>
					<view class="item-right">
						{{ev.totalPice}}
					</view>
				</view>
			</view>
			<view class="item-total-contain">
				<view class="item-total-left">
					共计{{setTotalNum}}个项目
				</view>
				<view class="item-total-right">
					<text class="item-text">合计</text>
					<text class="item-price">{{setTotalPrice}}</text>
					<text class="item-unit">元</text>
				</view>
			</view>
		</view>
		<view v-if="!outsourcingStatus" class="item-all">
			<view class="item-contain radius-top">
				<view class="public-item-left">
					<view class="symbol-contain">
						<text class="symbol">*</text>
					</view>
					<text class="label">报价模式</text>
				</view>
				<view class="item-right" @click="setTypeShow ">
					<view class="public-item-text">{{priceWayNew}}</view>
					<image class="icon-arrow" src="/static/images/right-vector.png" mode=""></image>
				</view>
				<u-picker v-model="typeShow" :range="typeColumns" mode="selector" @confirm="typeConfirm"></u-picker>
			</view>
			<view class="item-contain-place">
				<view class="item-top-place">
					<view class="public-item-left">
						<view class="symbol-contain">
							<text class="symbol">*</text>
						</view>
						<text class="label">{{priceWayNew == '一口价' ? '订单价格':'期望报价'}}</text>
					</view>
				</view>
				<view class="item-bottom">
					<view class="item-price-contian-input"
						v-if="groupPriceList.length == 0 && projectInfo.source !== 2">
						<u-input :clearable="false" v-model="form.price" type="digit" @input="setInput" @blur="setBlur"
							:border="false" placeholder="请输入价格" placeholder-style="color:#999999" />
					</view>
					<view class="item-price-contian" v-if="projectInfo.source !== 0 && form.price">
						{{form.price}}
					</view>
				</view>
			</view>
		</view>

		<view v-if="outsourcingStatus" class="outsourcing">
			<view class="form">
				<view class="item-contain">
					<text class="label">
						<text class="star">*</text>
						需求标题
					</text>
					<view class="public-input">
						<u-input placeholder="请输入需求标题" v-model="outsourcingForm.requirementName"
							placeholder-style="color:#909199" height="52" :clearable="false" type="text"
							:border="false" />
					</view>
				</view>
			</view>
		</view>


		<view class="form-group">
			<view class="form-item">
				<view class="item-contain-information describe">
					<view class="phrase-contain">
						<view class="item-describe">需求描述</view>
						<view class="item-phrase">
							<u-icon name="list-dot" :color="$styleColor.themeColor" size="32"></u-icon><text
								class="item-phrase-text"
								@click="getRequirementListShow('sendOrderPopupPhrase')">常用语</text>
						</view>
					</view>

					<send-order-popup ref="sendOrderPopupPhrase" titleName="请选择常用语" :commitStatus="false">
						<view class="workers-type-item-value phrase-list">
							<scroll-view class="left-nav-bar" :scroll-y="true">
								<view @click="getPhraseListType(item,index)" v-for="(item,index) in phraseList"
									:key="index" class="item-phrase2">{{ item.content }}</view>
							</scroll-view>
						</view>
					</send-order-popup>

					<view class="item-desc-contain">
						<u-input v-model="form.requirementDesc" class="desc-input"
							placeholder-style="color: #999999;fontSize: 26rpx;" height="190" type="textarea"
							placeholder="请输入需求描述文字" :border="true" />
					</view>
				</view>
				<view class="file-contain">
					<image-upload-new :uploadType="uploadType" :count="9" v-model="fileObject" />
				</view>
				<view class="voice-contain">
					<sound-recording @chooseVoice="chooseVoice" />
				</view>
			</view>
		</view>
		<view v-if="!outsourcingStatus" class="form-group">
			<view class="form-item">
				<view class="item-contain-information">
					<view class="radio-contain">
						<u-radio-group v-model="contactGenderNew">
							<u-radio style="margin-left: 80rpx;" :active-color="$styleColor.themeColor"
								v-for="(item, index) in genderList" :key="index" :name="item.name"
								:disabled="item.disabled">
								<view :style="contactGenderNew==item.name?{'color':$styleColor.themeColor}:''">
									{{ item.name }}
								</view>
							</u-radio>
						</u-radio-group>
					</view>
				</view>
			</view>
			<view class="form-item" v-if="contactGenderNew === '直接指派'">
				<view class="item-contain-information">
					<view class="item-label">选择成员</view>
					<u-input v-model="receiveUserName" @click="goToSelect" disabled style="text-align: right;"
						placeholder="请选择" placeholderStyle="text-align: right;" />
					<image src="../../static/icon/arrow_down_2.png" class="information-image"></image>
				</view>
			</view>
		</view>
		<bottom-button title="发布订单" @click="saveForm()"></bottom-button>

		<!-- 电话号码校验 -->
		<u-popup v-model="authenticationShow" mode="center" width="520" border-radius="16">
			<view class="authentication-contain">
				<view class="tips-contain">
					<view class="item-tips-text">
						为了保障您的权益，本次发单需要
					</view>
					<view class="item-tips-text">
						验证是否您本人操作
					</view>
				</view>
				<view class="item-phone">
					{{certification.phone}}
				</view>
				<view class="verification-code">
					<u-input :clearable="false" type="number" class="code-input" v-model="certification.code"
						height="50" :border="false" placeholder="请输入验证码" placeholder-style="color:#999999" />
					<view class="obtain" @click="getOperation(send)">
						{{send}}
					</view>
				</view>
				<view class="item-button" @click="getOperation('确认')">
					确认
				</view>
			</view>
		</u-popup>

		<u-calendar v-model="showTime" mode="range" @change="changeTime" max-date="2099-12-30"></u-calendar>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	import {
		CommonUpload
	} from '@/plugins/uploadPic.js';
	import operation from '@/plugins/mathoperation.js'
	import {
		onLogin
	} from '../../config/login';
	export default {
		data() {
			return {
				apiStr: '',
				requirementListShow: false,
				priceWayNew: '一口价',
				typeShow: false,
				typeColumns: ['一口价', '议价'],
				formType2: true,
				formType3: true,
				formType4: true,
				phraseList: [],
				showTime: false,
				genderList: [{
						name: '发布抢单',
						value:2,
						disabled: false
					},
					{
						name: '直接指派',
						value:1,
						disabled: false
					},
				],
				contactGenderNew: '直接指派',
				form: {},
				receiveUserName: '',
				fileObject: '',
				attachmentsAudio: [],
				audioFile: [],
				uploadType: ['图片', '视频', '文件'],
				jobName: '',
				jobCode: '',
				option: {},
				orderId: '',
				personId: '',
				categoryFlag: '',
				userSkillId: '',
				userSkillName: '',
				orderDispatchingPost: '', // 派单岗位
				groupPriceList: [],
				groupPrices: [],
				userList: [],
				currentUser: '',
				authenticationShow: false,
				send: '获取验证码',
				timer: null,
				times: 60,
				sendType: false,
				skillIdData: '',
				outsourcingForm: {
					requirementName: ''
				},
				outsourcingStatus: false, // 是否是外包工种
				certification: {
					phone: '',
					realPhone: '',
					code: ''
				},
			}
		},
		onLoad(option) {
			this.option = option
			this.setParameter()
			this.initialCertification()
			
		},
		onShow() {
			let that = this
			uni.$once('checkList', function(data) {
				var list = data ? JSON.parse(data) : [];
				var employeeName = []
				var receiveUserIds = []
				list.map(res => {
					res['personName'] = res.name
					that.userSkillId = res.skillId
					that.userSkillName = res.skillName
					receiveUserIds.push(res.userId)
					employeeName.push(res.name)
					that.jobName = res.skillName
					that.jobCode = res.jobCode
					res.employeeId = res.personId
				})
				that.receiveUserList = list
				that.receiveUserIds = receiveUserIds
				that.receiveUserName = employeeName.toString()
			})

			uni.$once('selectUserId', (data) => {
				this.getUserDetails(data)
			})

		},
		onUnload() {
			uni.$off('selectUserId')
			uni.$off('checkList')
			clearInterval(this.timer);
			this.timer = null
		},
		computed: {
			...mapState(['projectInfo', 'nodeInfo', 'orderInfo', 'userPersonInfo', 'remainingDays']),
			setTotalNum() {
				let tempList = []
				this.groupPriceList.forEach(item => {
					item.products.forEach(el => {
						tempList.push(el)
					})
				})
				return tempList.length
			},
			setTotalPrice() {
				let tempList = []
				this.groupPriceList.forEach(item => {
					tempList.push(item.payAmount)
				})
				return operation.funCalc(tempList)
			}
		},
		methods: {
			initialCertification() {
				let tempPersons = uni.getStorageSync('userData').sysUser.phone
				tempPersons = tempPersons ? tempPersons.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : ''
				this.certification.phone = tempPersons
				this.certification.realPhone = uni.getStorageSync('userData').sysUser.phone
			},
			getUserDetails(data) {
				if (data) {
					this.$httpApi.getPersonSettingInfo({
						userId: data,
					}).then(res => {
						if (res) {
							this.receiveUserList = []
							// 审核状态（0已提交、1未通过、2已通过）
							this.userList = res.personageList.filter(item => item.auditStatus == 2)
							if (this.userList.length > 0) {
								this.currentUser = this.userList.find(item => item.skillId == this.nodeInfo.skillId)
								this.receiveUserList.push(this.currentUser)
							}
							this.receiveUserName = res.realName
						}
					})
				}
			},
			setTypeShow() {
				if (this.groupPriceList.length == 0 && this.projectInfo.source !== 2) {
					this.typeShow = true
				}
			},
			setInput(value) {
				this.$setInput((result) => {
					this.form.price = result
				}, value)
			},
			setBlur(value) {
				this.$setBlur((result) => {
					this.form.price = result
				}, value)
			},
			setParameter() {
				this.orderId = this.orderInfo.orderId
				this.personId = this.userPersonInfo.personId
				// sop指派订单默认requirementType为5
				// ORDER_requirementType_skillId
				// this.categoryFlag = 'ORDER_5_' + this.userPersonInfo.skillId
				this.getReceiveDetail()
			},
			setInput(value) {
				this.$setInput((result) => {
					this.form.price = result
				}, value)
			},
			getReceiveDetail() {
				if (!this.orderInfo.orderId) {
					console.error('订单id不能为空')
					return
				}
				this.$httpApi.getReceiveDetail({
					id: this.orderInfo.orderId
				}).then(res => {
					this.form = res
					// 描述要取当前节点的描述 #25722 地址+岗位+服务/施工
					let tempName = ''
					if (['项目管家', '项目经理'].includes(this.nodeInfo.skillName)) {
						tempName = '服务'
					} else {
						tempName = '施工'
					}
					this.form.requirementDesc = this.projectInfo.latAddress || '' + this.projectInfo.poiName ||
						'' + this.nodeInfo.skillName || '' + tempName
					// 查询常用语需要
					this.form.requirementType = res.requirementType
					this.orderDispatchingPost = res.skillId
					this.categoryFlag = 'ORDER_' + this.nodeInfo.skillId
					this.getPhrase()
					this.getProjectGroupPriceList()
					this.getTypeList()
				})
			},
			// 获取常用短语
			getPhrase() {
				// TODO: api
				if (this.categoryFlag) {
					this.$httpApi.selectPhrase({
						categoryFlag: this.categoryFlag,
					}).then(res => {
						if (res) {
							this.phraseList = res.records
						}
					})
				}
			},
			getPhraseListType(item, index) {
				this.form.requirementDesc = this.form.requirementDesc + item.content
			},
			getRequirementListShow(str) {
				this.$refs[str].requirementListShow = true
			},
			getAttachment(file) {
				this.fileObject = file
			},
			async chooseVoice(file) {
				// 音频
				let audioFile = []
				if (file.duration > 0 && file.path) {
					audioFile.push({
						type: 'audio',
						url: await CommonUpload(file.path),
						timeLength: file.duration
					})
				}
				this.audioFile = audioFile
			},
			saveForm() {
				if (this.outsourcingStatus) {
					this.submitOutsourcing()
					return
				}
				if (this.option.pageType == '去派单') {
					if (this.contactGenderNew === "直接指派") {
						// 指派订单
						this.getUploadFile()
						this.sendOrder(1)
					} else {
						// 发布订单
						if (this.form.price < 0) {
							this.$util.toast('请输入正确的价格')
							return
						}
						this.getUploadFile()
						this.sendOrder(2)
					}
				} else {
					// 加派
					this.addSendOrder()
				}
			},
			// 发单
			sendOrder(type) {
				let assignPersonId = '',assignPersonName = ''
				if (type == 1) {
					if (!this.receiveUserName) {
						uni.showToast({
							title: '请选择成员~',
							icon: 'none'
						})
						return;
					}
				}
				if (type === 1) {
					if (this.projectInfo.source == 2 && this.orderInfo.publishType == 1) {
						if (this.currentUser) {
							assignPersonId = this.currentUser.personId
							assignPersonName = this.receiveUserName
						} else {
							uni.showToast({
								title: '不符合该工种~',
								icon: 'none'
							})
							return
						}
					} else {
						assignPersonId = this.receiveUserList && this.receiveUserList[0] && this.receiveUserList[0]
							.personId
						assignPersonName = this.receiveUserList && this.receiveUserList[0] && this.receiveUserList[0].name
					}
				}
				var obj = {
					assignPersonId, // 被指派人的Id
					assignPersonName, // 被指派人的姓名
					attachments: this.form.attachments,
					assignType: type, // 1指派 2抢单
					expectDate: this.form.expectDate,
					expectDuration: this.form.expectDuration,
					jobCode: this.nodeInfo.jobCode,
					nodeId: this.option.pageType != '新增成员' ? this.nodeInfo.nodeId : '',
					personId: this.personId, // 指派人的Id
					price: this.form.price,
					priceWay: this.priceWayNew === '一口价' ? 1 : 2,
					projectId: this.form.projectId,
					referencePrice: this.form.referencePrice,
					remark: '', // 备注
					requirementDesc: this.form.requirementDesc,
					skillId: type === 1 ? this.userSkillId : this.form.skillId,
					skillName: type === 1 ? this.userSkillName : this.form.skillName,
					bigOrderId: this.projectInfo.source == 2 ? this.orderInfo.orderId : '',
					publishType: type == 1 ? 2 : 3, // "发布类型：1=个人发布(外部)，2=企业发布(内部)，3=企业发布(外部)"
				}
				uni.showLoading({
					isFullScreen: true
				})
				this.$httpApi.assignOrder(obj).then(res => {
					uni.hideLoading()
					if (res) {
						uni.showToast({
							title: '订单发布成功',
							icon: 'none'
						})
						if (this.contactGenderNew == '发布抢单') {
							uni.navigateTo({
								url: `/pages/orderReceiving/releaseOrderDetails?id=${res}&pageType=发单` //跳转地址
							})
						} else {
							this.goBack()
						}
					}
				}).catch(res => {
					if (res.response && res.response.data == 6) {
						this.authenticationShow = true
					}
				})
			},
			setTimer() {
				this.timer = setInterval(() => {
					this.times--;
					if (this.times <= 0) {
						this.send = '获取验证码';
						clearInterval(this.timer);
						this.times = 60;
						this.sendType = false;
					} else {
						this.sendType = true;
						this.send = this.times + '秒后重试';
					}
				}, 1000)
			},
			getOperation(type) {
				this.debounce(() => {
					if (type == '获取验证码') {
						if (this.certification.realPhone)
							this.$httpApi.sendPaymentAccountVerifyCode({
								phone: this.certification.realPhone
							}).then(res => {
								if (res) {
									this.setTimer()
									this.$util.toast('发送成功~')
								}
							})
					} else if (type == '确认') {
						if (this.certification.code) {
							this.$httpApi.cBindPhone({
								phone: this.certification.realPhone,
								verifyCode: this.certification.code
							}).then(res => {
								this.authenticationShow = false
								if (res) {
									clearInterval(this.timer);
									this.timer = null
									this.$util.toast('操作成功~')
								}
							})
						} else {
							this.$util.toast('请输入验证码')
						}

					}
				}, 200)
			},
			// 加派
			addSendOrder() {
				if (this.contactGenderNew === '发布抢单') {
					// 加派的时候允许再次发单
					if (this.form.price < 0) {
						this.$util.toast(请输入正确的价格)
						return
					}
					this.getUploadFile()
					this.sendOrder(2)
				} else {
					// if (!this.receiveUserList || (this.receiveUserList && this.receiveUserList.length <= 0)) {
					// 	uni.showToast({
					// 		title: '请选择成员~',
					// 		icon: 'none'
					// 	})
					// 	return;
					// }
					if (!this.receiveUserName) {
						uni.showToast({
							title: '请选择成员~',
							icon: 'none'
						})
						return;
					}
					this.getUploadFile()
					this.sendOrder(1)
				}
			},
			 getUploadFile() {
				// 图片、视频
				if (!this.$checkUploadProcess(this.fileObject)) {
					return;
				}
				let imgAndVideo = this.$isJSON(this.fileObject) &&  JSON.parse(this.fileObject)
				let fileAll
				if (this.audioFile) {
					fileAll = [...this.audioFile, ...imgAndVideo]
				} else {
					fileAll = imgAndVideo
				}
				this.form.attachments = fileAll
			},
			goToSelect() {
				this.toPage('/pages/user/userTeam?pageType=派单')
			},
			typeConfirm(e) {
				if (this.contactGenderNew === '直接指派' && this.typeColumns[parseInt(e.toString())] === '议价') {
					this.$util.toast('直接指派必须为一口价模式~')
					return
				}
				this.priceWayNew = this.typeColumns[parseInt(e.toString())]
			},
			/**
			 * @description 查询组合报价信息
			 * 如果项目经理报价时选择了人工费，则在指派时按工种进行指派 
			 * 
			 * c端发起的单子，新增订单详情、查看详情/开单 ，隐藏材料申请
			 *projectInfo=》 source 来源：0=无；1=推广渠道 2=订单自动生成的项目
			 */
			getProjectGroupPriceList() {
				if (this.projectInfo.source != 0) {
					if (!this.orderInfo.orderId) {
						return
					}
					if (this.option.pageType == '新增成员') {
						return
					}
					this.$httpApi.createPublisherGroupPrice({
						projectId: this.projectInfo.projectId,
						skillId: this.nodeInfo.skillId,
					}).then(res => {
						if (res) {
							let tempList = []
							res.forEach(el => {
								el['source'] = 1 // 1订单，2变更订单，3项目预算，4材料管理）
								if (el.products) {
									el.products.forEach(ev => {
										ev['coverImg'] = ev.productImg
										ev['selectNum'] = ev.quantity
										tempList.push(ev)
									})
								}
							})
							this.groupPriceList = res
							this.form.price = this.setTotalPrice
						}
					})
				}
			},
			/**
			 * @description 查询工种信息，如果当前工种是外协工种，则隐藏  报价模式、订单价格、发单模式 、选择成员 
			 * */
			getTypeList() {
				this.$httpApi.getWorkType({
					type: 1,
					clientType: 'platform',
					size: 99
				}).then(res => {
					if (res) {
						this.skillIdData = res.records.find(item => item.skillId == this.nodeInfo.skillId)
						if (this.skillIdData) {
							if (this.skillIdData.jobCode == 'JOB_OUTSOURCING') {
								this.outsourcingStatus = true
							} else {
								this.outsourcingStatus = false
							}
						}
					}
				})
			},
			changeTime(item) {
				console.log('item', item)
			},
			/**
			 * @description 发外协单
			 * */
			submitOutsourcing() {
				if (!this.outsourcingForm.requirementName) {
					this.$util.toast(`请填写需求标题~`);
					return
				}
				let attachments = []
				let tempImages = JSON.parse(this.fileObject)
				if (tempImages.length > 0) {
					tempImages.forEach(el => {
						attachments.push({
							name: el.name,
							timeLength: '',
							type: this.$setFileType(el.url),
							url: el.url
						})
					})
				}
				if (this.audioFile.length > 0) {
					attachments.push(this.audioFile[0])
				}
				let parameter = {
					attachments: attachments,
					cityOperatorId: uni.getStorageSync('cityOperatorId'),
					expectCompleteDate: this.orderInfo.expectCompleteDate,
					expectDate: this.orderInfo.expectDate,
					jobCode: this.skillIdData.jobCode,
					nodeId: this.nodeInfo.nodeId,
					projectId: this.projectInfo.projectId,
					requirementDesc: this.form.requirementDesc,
					requirementName: this.outsourcingForm.requirementName,
					skillId: this.nodeInfo.skillId,
					skillName: this.nodeInfo.skillName
				}
				this.$httpApi.outsourcingAdd(parameter).then(res => {
					if (res) {
						this.$util.toast(`派单成功~`);
						uni.setStorageSync('outsourcingId',res)
						uni.redirectTo({
							url: `/pages/construction/siteCollaboration/details?id=${res}`
						})
					}
				})
			},

		}
	}
</script>

<style lang="scss" scoped>
	$orangeColor:$themeColor;

	/deep/ .order-title-detial {

		.order-info {
			margin: 10rpx 20rpx 8rpx 20rpx !important;
		}
	}

	.title-back {
		height: 120rpx;
		background: $themeColor;
	}

	.icon-arrow {
		width: 14rpx;
		height: 26rpx;
	}

	/deep/ .uni-input-input {
		color: #333333;
	}

	.group-price-list {
		margin: 10rpx 20rpx 8rpx 20rpx;
		background-color: #fff;
		border-radius: 16rpx;
		padding: 36rpx;

		.item-title {
			color: #303133;
			font-size: 28rpx;
			margin-bottom: 20rpx;
		}

		.item-server {
			display: flex;
			justify-content: space-between;
			margin-bottom: 8rpx;

			&:last-child {
				margin-bottom: 0rpx;
			}

			.item-left {
				.item-num {
					color: #909199;
					font-size: 24rpx;
				}

				.item-name {
					font-size: 28rpx;
					color: #303133;
					margin-right: 8rpx;
				}

				.item-specifications {
					color: #909199;
					font-size: 24rpx;
				}
			}

			.item-right {
				color: #FF5D35;
				font-size: 28rpx;
			}
		}
	}

	.item-all {
		margin-bottom: 8rpx;

		.item-contain {
			background-color: #FFFFFF;
			margin: 0rpx 20rpx 2rpx 20rpx;
			display: flex;
			padding: 42rpx 36rpx;
			border-radius: 10rpx 10rpx 0px 0px;

			.item-right {
				display: flex;
				align-items: center;
				width: 100%;
				margin-left: 30rpx;

				.icon-arrow {
					margin-left: 26rpx;
				}
			}

			.duration {
				font-size: $smiddleFontSize;
				color: #999999;
			}
		}

		.public-item-text {
			color: #333333;
			font-size: $smiddleFontSize;
			display: flex;
			justify-content: flex-end;
			flex: 1;
		}

		.public-item-left {
			display: flex;
			align-items: center;

			.symbol-contain {
				position: relative;
				width: 12rpx;
				height: 36rpx;

				.symbol {
					position: absolute;
					top: 8rpx;
					color: $errorFontColor;
					right: 4rpx;
				}
			}


			.label {
				font-size: $middleFontSize;
				color: $seconFontColor;
				white-space: nowrap;
			}
		}

		.item-contain-place {
			padding: 36rpx 36rpx 30rpx 36rpx;
			background-color: #FFFFFF;
			margin: 0rpx 20rpx 2rpx 20rpx;
			border-radius: 0px 0px 10rpx 10rpx;

			.item-top-place {
				display: flex;
				justify-content: space-between;
				margin-bottom: 8rpx;

				.right {
					font-size: $smiddleFontSize;
					color: $themeColor;
					display: flex;
					align-items: center;

					image {
						width: 18rpx;
						height: 18rpx;
						margin-right: 6rpx;
					}
				}
			}

			.item-bottom {
				display: flex;
				align-items: center;
				margin-left: 10rpx;
				width: 100%;

				.item-price-contian {
					font-size: 30rpx;
				}
			}

			.reference-price {
				font-size: $smallFontSize;
				color: $errorFontColor;
				margin-left: 4rpx;
			}

			.public-item-placeholder {
				justify-content: flex-start;
			}


		}
	}



	.item-top {
		height: 120rpx;
		display: flex;
		align-items: center;
		padding-left: 50rpx;
		padding-right: 50rpx;

		.item-title {
			font-family: PingFang SC;
			font-style: normal;
			font-weight: bold;
			font-size: 30rpx;
			line-height: 50rpx;
			color: $seconFontColor;
			flex: 1;
		}

		.item-click {
			font-weight: normal;
			font-size: 26rpx;
			line-height: 50rpx;
			color: #A7A7A7;
		}

		.arrow_down {
			width: 20rpx;
			height: 16rpx;
			margin-left: 10rpx;
			opacity: 0.2;
			transition: all 0.5s;
		}
	}

	.form-group {
		overflow: hidden;
		transition: height .5s;
	}

	.form-item {
		margin: 0rpx 20rpx 2rpx 20rpx;
		background: #FFFFFF;
		border-radius: 10rpx;
		padding: 32rpx 34rpx;

		.form-title {
			margin-bottom: 12rpx;
		}

		.item-contain-information {
			display: flex;
			align-items: center;

			.information-image {
				width: 24rpx;
				height: 16rpx;
				transform: rotate(-90deg);
				opacity: 0.2;
				margin-left: 20rpx;
			}

			.item-label {
				color: $seconFontColor;
				font-size: 28rpx;
				font-weight: bold;
				margin: 0 18rpx 0rpx 0;
			}

			.information-text {
				font-size: 28rpx;
				color: $themeColor;
				margin-left: 20rpx;
			}

			.u-form-item {
				flex: 1;
				padding: 0rpx 0 14rpx 0;
			}

			.phrase-list {
				// overflow-y: scroll;
				height: 400rpx;
				padding-top: 16rpx;

				.left-nav-bar {
					height: 100%;
				}
			}

			.workers-type-item-value {
				padding: 40rpx;
				display: flex;
				flex-direction: column;
			}
		}

		.describe {
			flex-direction: column;

			.describe-input {
				width: 100%;
				background-color: #F7F7F7;
			}

			.haveDesc {
				background: #E2E2E2;
			}

			.phrase-contain {
				display: flex;
				width: 100%;
				justify-content: space-between;
				margin-bottom: 28rpx;

				.item-describe {
					font-weight: normal;
					font-size: 28rpx;
					color: #606166;
				}

				.item-phrase {
					font-size: 28rpx;
					color: #606166;

					.item-phrase-text {
						margin-left: 10rpx;
					}
				}
			}
		}

		.item-phrase2 {
			width: 100%;
			margin-bottom: 20rpx;
			padding-bottom: 20rpx;
			border-bottom: 2rpx dashed #E4E4E4;

			&:hover {
				color: #7b7878;
			}
		}

		.item-radio {
			margin: 0 0 20rpx 130rpx;
		}

		.radio-contain {
			padding-left: 22rpx;
			margin-bottom: 14rpx;
		}

		.reference-price {
			padding-left: 126rpx;

			.price-text {
				font-size: 28rpx;
				color: $themeColor;
			}
		}

		.attachment {
			margin-bottom: 26rpx;

			.attachment-title {
				font-weight: 900;
				font-size: 32rpx;
				line-height: 44rpx;
				color: #333333;
				margin-bottom: 6rpx;
			}

			.attachment-prompt {
				font-size: 24rpx;
				line-height: 34rpx;
				color: #909299;
			}
		}

		.file-contain {
			margin-top: 40rpx;
			margin-bottom: 40rpx;
		}

		.voice-contain {
			// margin-bottom: 42rpx;
		}
	}

	.item-desc-contain {
		background: #F6F7F9;
		border-radius: 10rpx;
		margin-bottom: 40rpx;
		width: 100%;

		.desc-input {
			border: 0px;
		}
	}

	.item-total-contain {
		background: #F9F9F9;
		border-radius: 10rpx;
		padding: 0rpx 18rpx;
		height: 84rpx;
		line-height: 84rpx;
		display: flex;
		justify-content: space-between;
		margin-top: 20rpx;

		.item-total-left {
			font-size: 24rpx;
			color: #909199;
		}

		.item-total-right {

			.item-text {
				font-size: 24rpx;
				color: #909199;
			}

			.item-price {
				font-size: 46rpx;
				color: #FF5D35;

			}

			.item-unit {
				font-size: 24rpx;
				color: #FF5D35;
			}
		}
	}

	.authentication-contain {
		padding: 40rpx 0rpx;

		.item-tips-text {
			font-size: 26rpx;
			color: #606166;
			text-align: center;
			padding: 0 60rpx;
		}

		.item-phone {
			margin-top: 22rpx;
			text-align: center;
			color: #303133;
			font-weight: bold;
			font-size: 30rpx;
		}

		.verification-code {
			margin-top: 14rpx;
			margin: 14rpx 40rpx 0rpx 40rpx;
			display: flex;
			border: 2rpx solid #F6F6F6;
			border-radius: 50rpx;
			height: 72rpx;
			align-items: center;

			.obtain {
				font-size: 26rpx;
				color: #002FA5;
				border-left: 2rpx solid #E9E9E9;
				padding: 0rpx 20rpx 0rpx 14rpx;
			}

			.code-input {
				padding-left: 30rpx !important;
			}
		}

		.item-button {
			margin: 40rpx 40rpx 0rpx 40rpx;
			background-color: #002FA5;
			border-radius: 10rpx;
			color: #fff;
			padding: 18rpx 0rpx;
			text-align: center;
			font-size: 28rpx;
		}
	}

	.outsourcing {

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

		.form {
			margin: 12rpx 20rpx 8rpx 20rpx;
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
</style>
