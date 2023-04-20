<template>
	<view class="issue-order-page">
		<view class="item-all">
			<view class="item-contain radius-top" v-if="listing">
				<view class="public-item-left">
					<view class="symbol-contain">
						<text class="symbol">*</text>
					</view>
					<text class="label">需求类型</text>
				</view>
				<view class="item-right" @click="getPopupType('需求类型')">

					<view class="public-item-text" v-if="setConfigStatus">{{form.requirementTypeName}}</view>

					<view class="public-item-other" v-else>
						<view class="public-item-placeholder" v-if="!form.requirementTypeName">请选择需求类型</view>
						<view class="public-item-text" v-else>{{form.requirementTypeName}}</view>
						<image class="icon-arrow" src="/static/images/right-vector.png" mode=""></image>
					</view>
				</view>
			</view>

			<view class="item-contain radius-top">
				<view class="public-item-left">
					<view class="symbol-contain">
						<text class="symbol">*</text>
					</view>
					<text class="label">所需工种</text>
				</view>
				<view class="item-right" @click="getPopupType('工种')">
					<view class="public-item-text" v-if="setConfigStatus">{{form.skillName}}</view>
					<view class="public-item-other" v-else>
						<view class="public-item-placeholder" v-if="!form.skillName">请选择所需工种</view>
						<view class="public-item-text" v-else>{{form.skillName}}</view>
						<image class="icon-arrow" v-if="listing" src="/static/images/right-vector.png" mode=""></image>
					</view>
				</view>
			</view>
			<view class="item-contain-place">
				<view class="item-top">
					<view class="public-item-left">
						<view class="symbol-contain">
							<text class="symbol">*</text>
						</view>
						<text class="label">施工地点</text>
					</view>
				</view>
				<view class="item-bottom" @click.stop="getJump('施工地点')">
					<view class="no-address" v-if="!form.address">
						<view class="public-item-placeholder">请填写施工地点</view>
						<image class="icon-arrow" src="/static/images/right-vector.png" mode=""></image>
					</view>
					<view class="select-address" v-else>
						<view class="item-name">
							<text class="name">{{form.contactName}}</text>
							<text class="phone">{{form.contactPhone}}</text>
						</view>
						<view class="item-bottom-address">
							<view class="address">
								{{form.provinceName}}{{form.cityName}}{{form.districtName}}{{form.latAddress}}{{form.poiName}}{{form.address}}
							</view>
							<image v-if="listing" class="icon-arrow" src="/static/images/right-vector.png" mode="">
							</image>
						</view>
					</view>
				</view>
			</view>
			<view class="item-contain radius-bottom">
				<view class="public-item-left">
					<view class="symbol-contain">
						<text class="symbol">*</text>
					</view>
					<text class="label">上门日期</text>
				</view>
				<view class="item-right" @click="getPopupType('上门日期')">
					<view class="public-item-placeholder" v-if="!form.expectDate">请选择上门日期</view>
					<view class="public-item-text" v-else>{{form.expectDate}}</view>
					<image class="icon-arrow" src="/static/images/right-vector.png" mode=""></image>
				</view>
			</view>
		</view>

		<view class="item-all">
			<view class="item-contain radius-top">
				<view class="public-item-left">
					<view class="symbol-contain">
						<text class="symbol">*</text>
					</view>
					<text class="label">报价模式</text>
				</view>
				<view class="item-right" @click="getPopupType('报价模式')">
					<view class="public-item-text" v-if="setConfigStatus">
						{{Number(form.priceWay) == 1 ? '一口价': Number(form.priceWay) == 2 ? '竞价': '议价' }}
					</view>

					<view class="public-item-other" v-else>
						<view class="public-item-text">
							{{Number(form.priceWay) == 1 ? '一口价': Number(form.priceWay) == 2 ? '竞价': '议价' }}
						</view>
						<image v-if="listing" class="icon-arrow" src="/static/images/right-vector.png" mode=""></image>
					</view>
				</view>
			</view>
			<view class="item-contain-place">
				<view class="item-top">
					<view class="public-item-left">
						<view class="symbol-contain">
							<text class="symbol">*</text>
						</view>
						<text class="label">{{Number(form.priceWay) == 1 ? '订单价格':'期望价格'}}</text>
						<text class="reference-price" v-if="form.referencePrice">(参考价 {{form.referencePrice}}元)</text>
					</view>
					<view class="right" v-if="listing && !setConfigStatus" @click="getJump('组合价格')">
						<image src="/static/images/add-house.png" mode=""></image>
						组合价格
					</view>
				</view>
				<view class="item-bottom">
					<view class="select-material-price" v-if="setConfigStatus">{{form.price}}</view>

					<view v-if="setMaterialList.length > 0 &&　!setConfigStatus">
						<mihuo-portfolio-price v-model="priceObject" :isEditor="listing">
						</mihuo-portfolio-price>
					</view>
					<view class="no-select-material" v-if="setMaterialList.length == 0　&&　!setConfigStatus">
						<u-input :clearable="false" @input="setInput" type="digit" v-model="form.price" :border="false"
							placeholder="请输入价格" placeholder-style="color:#999999" />
						<image class="icon-arrow" src="/static/images/right-vector.png" mode=""></image>
					</view>
				</view>
			</view>
			<view class="item-contain radius-bottom expected-duration">
				<view class="public-item-left">
					<text class="label">预期工期</text>
				</view>
				<view class="item-right duration">
					<u-input :clearable="false" type="number" v-model="form.expectDuration" height="50" :border="false"
						placeholder="请输入预期工期" placeholder-style="color:#999999" />
				</view>
			</view>
		</view>

		<view class="demand-contain">
			<view class="item-all item-requirement-name">
				<view class="item-contain radius-bottom expected-duration">
					<view class="public-item-left">
						<text class="label">需求标题</text>
					</view>
					<view class="item-right duration">
						<u-input :clearable="false" type="text" v-model="form.requirementName" height="50"
							:border="false" placeholder="请简要输入需求标题" placeholder-style="color:#999999" />
					</view>
				</view>
			</view>
			<view class="item-all desc-contain">
				<view class="item-tltle">
					<view class="left">
						需求描述
					</view>
					<view class="right" @click="getPopupType('常用语')">
						<image class="list_icon" src="/static/icon/list.png"></image>
						常用语
					</view>
				</view>
				<view class="item-desc">
					<u-input v-model="form.requirementDesc" placeholder-style="color: #999999;fontSize: 26rpx;"
						class="describe-input" maxlength="200" height="150" type="textarea" placeholder="请输入需求描述文字"
						:border="true" />
				</view>
				<view class="item-attachment">
					<view class="file-contain">
						<image-upload-new :uploadType="uploadType" :count="9" :key="fileJsonKey" v-model="fileJson" />
					</view>
					<view class="voice-contain" v-if="isShowRecording" @click="isShowButton = false">
						<sound-recording @chooseVoice="chooseVoice" v-model="audioFile" @close="isShowButton = true" />
					</view>
				</view>
			</view>
		</view>


		<!-- 组合报价发单时显示，编辑时不显示-->
		<view class="form-group" v-if="sendOrderTypeShow">
			<view class="form-item">
				<view class="item-contain-information-other">
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
				<view class="item-contain-information-other">
					<view class="item-label">选择成员</view>
					<u-input v-model="receiveUserName" input-align="right" @click="goToSelect" disabled
						placeholder="请选择" placeholderStyle="text-align: right;" />
					<image src="../../static/icon/arrow_down_2.png" class="information-image"></image>
				</view>
			</view>
		</view>


		<bottom-button v-show="isShowButton" :title=" option.type == 'update' ? '修改订单':'发布订单' " @click="submit">
		</bottom-button>

		<!-- 选择需求类型 -->
		<send-order-popup ref="sendOrderPopupRequirement" titleName="更换需求类型">
			<view class="popup-type-contain">
				<view class="workers-type-item-value">
					<view v-for="(item,index) in requirementList" :key="index"
						@click="getRequirementListType(item,index)" class="workers-type-item"
						:class="[requirementTypeIndex === index ? 'workers-type-item-active':'']">
						<text class="text">{{item.label}}</text>
						<view class="selected" v-show="requirementTypeIndex === index">
							<u-icon name="checkmark" class="checkmark-icon" color="#fff" size="24">
							</u-icon>
						</view>
					</view>
				</view>
			</view>
		</send-order-popup>

		<!-- 选择工种 -->
		<send-order-popup ref="sendOrderPopupWork" titleName="请选择工种" :commitStatus="false">
			<view class="popup-type-contain">
				<view class="workers-type-item-value management-contain">
					<view v-for="(item,index) in managementList" :key="index" @click="getManagementType(item,index)"
						class="workers-type-item"
						:class="[workTypeIndex === item.skillId ? 'workers-type-item-active':'']">
						<text class="text">{{item.skillName}}</text>
						<view class="selected" v-show="workTypeIndex === item.skillId">
							<u-icon name="checkmark" class="checkmark-icon" color="#fff" size="24">
							</u-icon>
						</view>
					</view>
				</view>
				<view class="work-name-title">工人师傅</view>
				<view class="workers-type-item-value worker-list">
					<view v-for="(item,index) in workTypeList" :key="index" @click="getWorkType(item,index)"
						class="workers-type-item"
						:class="[workTypeIndex === item.skillId ? 'workers-type-item-active':'']">
						<text class="text">{{ item.skillName }}</text>
						<view class="selected" v-show="workTypeIndex === item.skillId">
							<u-icon name="checkmark" class="checkmark-icon" color="#fff" size="24">
							</u-icon>
						</view>
					</view>
				</view>
			</view>
		</send-order-popup>

		<!-- 施工日期 -->
		<u-picker v-model="expectDurationShow" mode="time" :params="params" @confirm="confirmTime"
			:is-allow-passed-time="false" :start-year="(new Date().getFullYear())">
		</u-picker>

		<!-- 报价模式 -->
		<send-order-popup ref="offerType" titleName="选择报价方式">
			<view class="popup-type-contain">
				<view class="item-tips">
					{{quotationModeList[offerTypeIndex].desc}}
				</view>
				<view class="workers-type-item-value offer-type">
					<view v-for="(item,index) in quotationModeList"
						:class="[offerTypeIndex === index ? 'workers-type-item-active' :'']" :key="index"
						@click="getOfferType(item,index)" class="workers-type-item">
						{{item.name}}
						<view class="selected" v-show="offerTypeIndex === index">
							<u-icon name="checkmark" class="checkmark-icon" color="#fff" size="24">
							</u-icon>
						</view>
					</view>
				</view>
			</view>
		</send-order-popup>

		<!-- 常用语 -->
		<send-order-popup ref="sendOrderPopupPhrase" titleName="请选择常用语" :commitStatus="false">
			<view class="popup-type-contain">
				<view class="workers-type-item-value phrase-list">
					<scroll-view class="right-nav-bar" :scroll-y="true">
						<view @click="getPhraseListType(item,index)" v-for="(item,index) in phraseList" :key="index"
							class="item-phrase">{{item.content}}</view>
					</scroll-view>
				</view>
			</view>
		</send-order-popup>

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

	</view>
</template>

<script>
	import {
		CommonUpload
	} from '@/plugins/uploadPic.js';
	import operation from '@/plugins/mathoperation.js'
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				isShowButton: true,
				audioFile: {
					type: 'audio',
					url: '',
					timeLength: ''
				},
				uploadType: ['图片', '视频', '文件'],
				contactGenderNew: '发布抢单',
				receiveUserName: '',
				genderList: [{
						name: '发布抢单',
						disabled: false
					},
					{
						name: '直接指派',
						disabled: false
					},
				],
				materialList: [1, 2, 3.4, 5, 6, 7],
				managementList: [{
					label: '项目经理',
					value: 'R_PROJECT_MANAGER',
					id: '99'
				}, {
					label: '监理',
					value: 'R_PROJECT_SUPERVISION',
					id: '100'
				}],
				quotationModeList: [{
						name: '一口价',
						disabled: false,
						desc: '一个人抢单，无需报价',
						value: 1
					},
					{
						name: '议价',
						disabled: false,
						desc: '只允许单个人报价',
						value: 3
					},
					// {
					// 	name: '竞价',
					// 	disabled: false,
					// 	desc: '允许多个人进行报价',
					// 	value: 2
					// },
				],
				workTypeList: [],
				workTypeIndex: 0, //选中的工种标记
				offerTypeIndex: 0, // 选中的报价模式标记
				requirementTypeIndex: 0,
				phraseList: [],
				expectDurationShow: false,
				params: {
					year: true,
					month: true,
					day: true,
				},
				requirementList: [],
				fileJson: '',
				fileJsonShow: false,
				fileJsonKey: 0,
				categoryFlag: '', //'查询常用语标识'
				isShowRecording: true,
				priceObject: {},
				authenticationShow: false,
				temPauthenticationShow: false,
				certification: {
					phone: '',
					realPhone: '',
					code: ''
				},
				times: 60,
				send: '获取验证码',
				sendType: false,
				timer: null,
				listing: true,
				sendOrderTypeShow: false,
				form: {
					jobCode: 'R_WORKER', // 需求角色类型：R_WORKER=工人，R_PROJECT_MANAGER=项目经理，R_PROJECT_SUPERVISION=监理
					contactGender: '1', // 联系人性别称谓: 1=先生；2=女士
					address: '', // 施工地-详细地址
					contactName: '', // 	联系人名称
					contactPhone: '', // 	联系人电话
					referencePrice: 0, // 参考价格
					requirementType: 1, // 需求类型
					requirementTypeName: '',
					priceWay: '1', // 	定价方式: 1=一口价；2-竞价 3=议价
					expectDate: '', // 期望上门日期，yyyy-MM-dd
					expectDuration: '', // 期望工期，单位：天
					price: '', // 	期望价格，单位：元
					requirementName: '', // 需求名称
					requirementDesc: '', // 	需求描述
					skillId: '',
					skillName: '',
					orderStatus: 0, // 订单状态：0=草稿，1=发布订单，2=等待报价，3=订单确认，4=接单完成，5=订单取消
					userId: '', // 发布用户id
					userName: '',
					latitude: '',
					longitude: '',
					// cityId: uni.getStorageSync('cityOperatorId') || '-1',
					cityId: '-1',
					cityName: uni.getStorageSync('userAddress').address || '',
					publishType: 1, // 发布类型：1=个人发布, 2=企业发布
					assignType: 2, // 指派模式 1=指派, 2=抢单
					companyId: '0', // 发布企业id，非企业发布为0，企业发布时必传,
					attachments: '', // 附件
					provinceName: '', // 省
					cityName: '', //  城市
					districtName: '', //区
					latAddress: '', //街道
					poiName: '', // 商区地址，街道地址
					productJson: '', // 组合报价商品信息
					totalPrice: '', // 组合报价商品总价
					beforeOrderId: '', // 组合报价发单使用
					groupPriceId: '',
					assignPersonId: '', // 	指派人员id（指派方式为批派时必传）
					assignPersonName: '' // 指派人员名字（指派方式为批派时必传）
				}
			}
		},
		computed: {
			...mapState(['projectInfo', 'orderInfo', 'userRole', 'userPersonInfo', 'serviceGoodsList']),
			setMaterialList() {
				return this.serviceGoodsList
			},
			setConfigStatus() {
				// configStatus 工种是否配置交付模版(0未配置， 其他配置)
				// source 订单来源 1个人(c端) 2服务者(B端) 3企业 4平台
				if (Number(this.option.configStatus) == 0 && this.option.source == 2) {
					return false
				} else {
					return true
				}
			},
		},
		onShow() {
			uni.$on('setConstructionStie', (data) => {
				this.setConstructionStie(data)
			})
			uni.$on('selectedData', (data) => {
				let tempData = data && JSON.parse(data)
				this.receiveUserName = tempData.workerName
				this.form.assignPersonId = tempData.workerPersonId
				this.form.assignPersonName = tempData.workerName
			})

			this.$forceUpdate()
		},
		onBackPress(options) {
			if (options.from === 'navigateBack') {
				return false;
			}
			this.$store.commit('setServiceGoodsList', [])
		},
		onUnload() {
			uni.$off('setConstructionStie')
			uni.$off('selectedData')
			clearInterval(this.timer);
			this.timer = null
		},
		onLoad(option) {
			this.option = option
			if (option.type === 'update' || option.listing == '清单') {
				if (option.type === 'update') {
					uni.setNavigationBarTitle({
						title: "修改订单"
					});
				}
				this.orderDetails()
			}
			this.getRequirementList()
			this.initialCertification()
		},
		methods: {

			setInput(value) {
				this.$setInput((result) => {
					this.form.price = result
				}, value)
			},
			initialCertification() {
				let tempPersons = uni.getStorageSync('userData').sysUser.phone
				tempPersons = tempPersons ? tempPersons.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : ''
				this.certification.phone = tempPersons
				this.certification.realPhone = uni.getStorageSync('userData').sysUser.phone
				this.$httpApi.getPaymentAccountStatus({}, false).then(res => {
					// 小于1为未绑定手机号
					for (let key in res) {
						if (Number(key) < 2) {
							this.temPauthenticationShow = true
						} else {
							this.temPauthenticationShow = false
						}
					}
				})
			},
			// 获取订单需求类型
			getRequirementList() {
				this.$httpApi.getOrderType({
					size: 99
				}).then(res => {
					if (res) {
						this.requirementList = res
						this.requirementList.forEach((item, index) => {
							// 默认第一个
							if (index === 0) {
								this.form.requirementTypeName = item.label
								this.form.requirementType = item.value
							}
						})
						this.getWorkTypeList()
					}
				})
			},
			// 获取平台工种类型
			getWorkTypeList() {
				this.$httpApi.getWorkType({
					type: 2,
					clientType: 'platform',
					size: 999
				}).then((res) => {
					if (res) {
						this.workTypeList = res.records
					}
				})
				this.$httpApi.getWorkType({
					type: 1,
					clientType: 'platform',
					size: 999
				}).then((res) => {
					if (res) {
						this.managementList = res.records
					}
				})
			},
			// 获取常用短语
			getPhrase() {
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
			async chooseVoice(file) {
				if (file.buttonType !== 'clear') {
					this.isShowButton = true
				}
				// 音频
				if (!file.path) {
					return
				}
				if (file.duration > 0 && file.path) {
					this.audioFile.url = await CommonUpload(file.path)
					this.audioFile.timeLength = file.duration
				}
			},
			getJump(typeName) {
				switch (typeName) {
					case '施工地点':
						if (this.form.address) {
							if (!this.listing) {
								return
							}
							let that = this
							uni.navigateTo({
								url: '/pages/publishTask/constructionStie',
								success(res) {
									res.eventChannel.emit('viewConstructionStie', {
										contactGender: that.form.contactGender,
										contactName: that.form.contactName, // 	联系人名称
										contactPhone: that.form.contactPhone, // 	联系人电话
										address: that.form.address,
										cityName: that.form.cityName,
										longitude: that.form.longitude,
										latitude: that.form.latitude,
										provinceName: that.form.provinceName,
										districtName: that.form.districtName,
										latAddress: that.form.latAddress,
										poiName: that.form.poiName,
										cityId: that.form.cityId
									});
								}
							})
						} else {
							this.toPage('/pages/publishTask/constructionStie')
						}
						break;
					case '组合价格':
						this.toPage('/pages/publishTask/portfolioPrice')
						break;
				}
			},
			getPopupType(typeName) {
				if (!['常用语', '上门日期'].includes(typeName)) {
					// 如果配置了sop交付
					if (this.setConfigStatus) {
						return
					}
				}

				switch (typeName) {
					case '工种':
						if (!this.listing) {
							return
						}
						this.$refs['sendOrderPopupWork'].requirementListShow = true
						break;
					case '上门日期':
						this.expectDurationShow = !this.expectDurationShow
						break;
					case '报价模式':
						if (!this.listing) {
							return
						}
						this.$refs['offerType'].requirementListShow = true
						break;
					case '常用语':
						if (!this.form.requirementType) {
							this.$util.toast('请选择需求类型');
							return
						}
						if (!this.form.skillId) {
							this.$util.toast('请选择工种');
							return
						}
						this.$refs['sendOrderPopupPhrase'].requirementListShow = true
						break;
					case '需求类型':
						this.$refs['sendOrderPopupRequirement'].requirementListShow = true
						break
				}
			},
			getRequirementListType(item, index) {
				this.requirementTypeIndex = index
				this.form.requirementTypeName = item.label
				this.form.requirementType = item.value
				this.categoryFlag = 'ORDER_' + this.form.requirementType + '_' + this.form.skillId
				this.getPhrase()
			},
			// 选择监理或经理
			getManagementType(item, index) {
				this.workTypeIndex = item.skillId
				this.form.jobCode = item.value
				this.form.skillId = item.skillId
				this.form.skillName = item.skillName
				this.categoryFlag = 'ORDER_' + this.form.requirementType + '_' + this.form.skillId
				this.getPhrase()
				this.$refs.sendOrderPopupWork.close()
			},
			// 选择工种
			getWorkType(item, index) {
				this.workTypeIndex = item.skillId
				this.form.skillName = item.skillName
				this.form.skillId = item.skillId
				this.form.referencePrice = item.guidingPrice
				this.form.jobCode = 'R_WORKER'
				this.categoryFlag = 'ORDER_' + this.form.requirementType + '_' + this.form.skillId
				this.getPhrase()
				this.$refs.sendOrderPopupWork.close()
			},
			removeAddress() {
				if (!this.option.relationOrderIdName) {
					// this.form.contactGender = ''
					// this.form.contactName = ''
					// this.form.contactPhone = ''
					// this.form.address = ''
					// this.form.cityName = ''
					// this.form.latitude = ''
					// this.form.longitude = ''
					// this.form.provinceName = ''
					// this.form.districtName = ''
					// this.form.latAddress = ''
					// this.form.poiName = ''
					this.form.requirementDesc = ''
				}
			},
			setConstructionStie(data) {
				let {
					cityId,
					contactGender,
					contactName,
					contactPhone,
					address,
					cityName,
					longitude,
					latitude,
					provinceName, // 省
					districtName, //区
					latAddress, //街道
					poiName, // 商区地址，街道地址
				} = data
				this.form.contactGender = contactGender
				this.form.contactName = contactName
				this.form.contactPhone = contactPhone
				this.form.address = address
				this.form.cityName = cityName
				this.form.cityId = cityId
				this.form.latitude = latitude
				this.form.longitude = longitude
				this.form.provinceName = provinceName
				this.form.districtName = districtName
				this.form.latAddress = latAddress
				this.form.poiName = poiName
			},
			// 报价模式
			getOfferType(item, index) {
				this.offerTypeIndex = index
				this.form.priceWay = item.value
				// this.$refs.offerType.close()
			},
			// 常用语添加到需求描述中
			getPhraseListType(item, index) {
				this.form.requirementDesc = this.form.requirementDesc + item.content
				this.$refs.sendOrderPopupPhrase.requirementListShow = false
			},
			recentlyUsed() {

			},
			confirmTime(value) {
				this.form.expectDate = value.year + '-' + value.month + '-' + value.day
			},
			setProductJson() {
				if (this.priceObject && Number(this.priceObject.totalPrice) > 0) {
					this.form.totalPrice = this.priceObject.totalPrice
					this.form.price = this.form.totalPrice
					this.form.groupPrices = this.priceObject.productJson
				} else {
					this.form.productJson = null
					this.form.totalPrice = 0
				}
				this.setCommonlyUser()
			},
			setCommonlyUser() { // 保存常用商品(只保存平台商品，自定义的不保存)
				let tempCommonlyUserList = uni.getStorageSync('CommonlyUserList') || []
				this.serviceGoodsList.map(item => {
					if (item.coverImg) {
						tempCommonlyUserList.unshift(item.id)
					}
				})
				if (tempCommonlyUserList.length < 21) {
					tempCommonlyUserList = [...new Set(tempCommonlyUserList)]
					uni.setStorageSync('CommonlyUserList', tempCommonlyUserList)
				}
			},
			submit() {
				if (this.temPauthenticationShow) {
					this.authenticationShow = true
					return
				} else {
					this.authenticationShow = false
				}

				if (!this.form.requirementTypeName) {
					this.$util.toast('请选择需求类型');
					return
				}
				if (!this.form.skillName) {
					this.$util.toast('请选择所需工种');
					return
				}
				if (!this.form.address) {
					this.$util.toast('请填写详细地址');
					return
				}
				if (!this.form.expectDate) {
					this.$util.toast('请输入上门日期');
					return
				}
				// 一口价，竞价
				// 内部订单允许工期为0天
				// if (this.form.publishType === 1 && !this.form.expectDuration) {
				// 	this.$util.toast('请输入预期工期');
				// 	return
				// }
				// return
				this.setProductJson()
				if ([1, 2, 3].indexOf(Number(this.form.priceWay)) !== -1) {
					if(!this.setConfigStatus){
						if (!this.form.price) {
							this.$util.toast('请输入价格');
							return
						}
					}
				}
				// 先判断上传是否完成，上传完成后的url才是网络路径
				if (!this.$checkUploadProcess(this.fileJson)) {
					return
				}
				// 处理附件
				let attachmentsFile = this.fileJson !== '' && JSON.parse(this.fileJson)
				let fileAll = []
				if (attachmentsFile) {
					fileAll = [...attachmentsFile]
				}
				if (this.audioFile.url) {
					fileAll.push(this.audioFile)
				}
				if (!this.form.expectDuration) {
					this.form.expectDuration = 0
				}
				this.form.attachments = fileAll
				this.sendOrder()
			},
			sendOrder() {
				uni.showLoading({
					isFullScreen: true
				})
				if (this.option.type === 'update') {
					// 修改订单
					console.log("this.form", this.form);
					this.$httpApi.editOrder({
						...this.form,
					}).then(res => {
						if (!res) {
							this.$util.toast('网络异常, 请稍后再试~')
							this.$store.commit('setServiceGoodsList', [])
							return
						}
						uni.hideLoading()
						this.goBack()
					}).catch(e => {
						console.log(e)
						this.$util.toast('网络异常, 请稍后再试~')
					});
				} else {
					// 发布订单
					if ([1, 2, 3].indexOf(Number(this.form.priceWay)) !== -1) {
						if (!this.form.price) {
							this.$util.toast('请输入价格');
							return
						}
					}
					if (this.contactGenderNew == '直接指派') {
						this.form.assignType = 1
					} else {
						this.form.assignPersonId = '', // 	指派人员id（指派方式为批派时必传）
							this.form.assignPersonName = ''
					}
					this.$httpApi.sendOrder({
						...this.form,
					}).then(res => {
						this.$store.commit('setServiceGoodsList', [])
						if (res) {
							uni.hideLoading()
							// 清空表单数据
							// for (let key in this.form) {
							// 	this.form[key] = ''
							// }
							// this.form.cityId = uni.getStorageSync('cityOperatorId') || '-1',
							// 	this.form.publishType = 1
							// this.form.priceWay = 1
							// this.form.orderStatus = 0
							// this.form.assignType = 2
							// this.form.companyId = 0
							// this.workTypeIndex = 0 //选中的工种标记
							// this.offerTypeIndex = 0 // 选中的报价模式标记
							// this.requirementTypeIndex = 0
							this.getRequirementList()
							uni.navigateTo({
								url: `/pages/orderReceiving/releaseOrderDetails?id=${res.id}&pageType=发单` //跳转地址
							})
						} else {
							this.$util.toast('网络异常, 请稍后再试~')
						}
					}).catch(e => {
						this.$util.toast(e.errMsg)
					});
				}
			},
			parsingServiceGoodsList(tempProductJson) {
				if (this.option.type == 'update') {
					this.form.groupPrices.map(item => {
						item.productJson = item.productJson && JSON.parse(item.productJson)
					})
					let tempList = []
					this.form.groupPrices.map(item => {
						item.productJson.map(el => {
							tempList.push(el)
						})
					})
					this.$store.commit('setServiceGoodsList', tempList)
				}
			},
			orderDetails() {
				this.$httpApi.getOrderDetails({
					id: this.option.id,
				}).then(res => {
					if (res) {
						this.form = res
						// 组合报价发单
						if (this.option.listing) {
							this.form.skillId = this.option.skillId
							this.form.skillName = this.option.skillName
							this.form.beforeOrderId = this.option.id
							this.form.groupPriceId = this.option.deailsId
							this.removeAddress()
							this.listing = false
							// 组合报价转发时只能选择一口价
							this.form.priceWay = 1
							this.offerTypeIndex = 0
							if (this.option.relationOrderIdName) {
								this.sendOrderTypeShow = false
							} else {
								this.sendOrderTypeShow = true
							}
							this.categoryFlag = 'ORDER_' + this.form.requirementType + '_' + this.form.skillId
							this.getPhrase()
						} else {
							// 	定价方式: 1=一口价；2-竞价 3=议价
							switch (res.priceWay) {
								case 1:
									this.offerTypeIndex = 0
									break
								case 2:
									this.offerTypeIndex = 2
									break
								case 3:
									this.offerTypeIndex = 1
									break
							}
						}


						if (this.form.groupPrices && this.form.groupPrices.length > 0) {
							this.parsingServiceGoodsList()
						}
						let tempAttachments = res.attachments && res.attachments !== '' && JSON.parse(res
							.attachments)
						if (tempAttachments && tempAttachments.length > 0 && this.option.listing != '清单') {
							let fileJson = tempAttachments.filter(item => item.type == 'img' || item.type ==
								'video')
							fileJson.map(item => {
								item['localPathStatus'] = true
							})
							this.fileJson = JSON.stringify(fileJson)
							tempAttachments.map(item => {
								if (item.timeLength) {
									this.audioFile = item
								}
							})
							this.fileJsonKey++
						}

						switch (res.jobCode) {
							case 'R_WORKER':
								if (this.workTypeList.length > 0) {
									let tempIndex = this.workTypeList.find(item => item.skillId == res.skillId)
									this.workTypeIndex = tempIndex && tempIndex.skillId
								}
								break
							case 'R_PROJECT_MANAGER':
								if (this.managementList.length > 0) {
									let tempIndex = this.managementList.find(item => item.skillId == res.skillId)
									this.workTypeIndex = tempIndex && tempIndex.skillId

								}
								break
							case 'R_PROJECT_SUPERVISION':
								if (this.managementList.length > 0) {
									let tempIndex = this.managementList.find(item => item.skillId == res.skillId)
									this.workTypeIndex = tempIndex && tempIndex.skillId

								}
								break
						}
					}
				});
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
									this.initialCertification()
									this.$util.toast('操作成功~')
								}
							})
						} else {
							this.$util.toast('请输入验证码')
						}

					}
				}, 200)
			},
			goToSelect() {
				uni.navigateTo({
					url: `/pages/publishTask/assignCraftsman?companyId=${this.form.companyId}&skillId=${this.option.skillId}`
				})

			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/ .uni-input-input {
		color: #333333;
	}

	.icon-arrow {
		width: 14rpx;
		height: 26rpx;
	}

	.public-item-other {
		display: flex;
		flex: 1;
		align-items: center;
	}

	.public-item-placeholder {
		color: #999999;
		font-size: $smiddleFontSize;
		display: flex;
		justify-content: flex-end;
		flex: 1;
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

	.form-item {
		background: #FFFFFF;
		border-radius: 10rpx;
		padding: 32rpx 34rpx;
		margin-bottom: 4rpx;

		.form-title {
			margin-bottom: 12rpx;
		}

		.item-contain-information-other {
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

		}
	}



	.popup-type-contain {
		.workers-type-item-value {
			padding: 40rpx;
			display: flex;
			flex-wrap: wrap;
		}

		.workers-type-item-value-active {
			border: 2rpx solid $themeColor;

			.text {
				color: $themeColor;
			}
		}

		.management-contain {
			.workers-type-item {
				margin-bottom: 20rpx;
			}
		}

		.worker-list {
			padding-bottom: 20rpx;
		}

		.work-name-title {
			padding: 0 40rpx;
		}


		.workers-type-item {
			padding: 24rpx 39rpx;
			width: 31%;
			border-radius: 10rpx;
			border: 1px solid #D9D9D9;
			margin-bottom: 20rpx;
			position: relative;
			margin-right: 15rpx;
			display: flex;
			justify-content: center;

			.text {
				width: 100%;
				text-align: center;
				font-size: 28rpx;
				line-height: 36rpx;
				color: #666666;
			}

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

		.workers-type-item-active {
			border: 2rpx solid $themeColor;

			.text {
				color: $themeColor;
			}
		}

		.offer-type {
			padding: 0rpx 40rpx 40rpx 40rpx;

			.workers-type-item {
				line-height: 1;
			}

			.workers-type-item-active {
				color: $themeColor;
				border: 2rpx solid $themeColor;
			}
		}

		.phrase-list {
			height: 360rpx;
			padding-top: 16rpx;

			.right-nav-bar {
				height: 100%;
			}

			.item-phrase {
				width: 100%;
				margin-bottom: 20rpx;
				padding-bottom: 20rpx;
				border-bottom: 2rpx dashed #E4E4E4;

				&:hover {
					color: #7b7878;
				}
			}
		}
	}

	.issue-order-page {
		padding: 20rpx 20rpx 110rpx 20rpx;

		.item-all {
			margin-bottom: 6rpx;

			.item-contain,
			.item-contain-place {
				background-color: #fff;
			}

			.radius-top {
				border-radius: 10rpx 10rpx 0px 0px;
			}

			.radius-bottom {
				margin-bottom: 0rpx;
				border-radius: 0px 0px 10rpx 10rpx;
			}

			.item-contain {
				margin-bottom: 2rpx;
				display: flex;
				padding: 42rpx 36rpx;

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

			.item-contain-place {
				margin-bottom: 2rpx;
				padding: 36rpx 36rpx 30rpx 36rpx;

				.item-top {
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

				.reference-price {
					font-size: $smallFontSize;
					color: $errorFontColor;
					margin-left: 4rpx;
				}

				.public-item-placeholder {
					justify-content: flex-start;
				}

				.item-bottom {
					display: flex;
					align-items: center;
					margin-left: 10rpx;
					width: 100%;
				}

				.no-address {
					display: flex;
					align-items: center;
					width: 100%;
				}

				.select-address {
					width: 100%;

					.item-name {
						margin-bottom: 6rpx;

						.name,
						.phone {
							color: $viceFontColor;
							font-size: $middleFontSize;
						}
					}

					.item-bottom-address {
						display: flex;
						align-items: center;
						justify-content: space-between;

						.address {
							color: $seconFontColor;
							font-size: $smiddleFontSize;
						}
					}
				}

				.no-select-material {
					display: flex;
					align-items: center;
					width: 100%;
				}

				.select-material-price {
					font-size: 28rpx;
					color: #303133;
				}

				.select-material {
					display: flex;
					justify-content: space-between;
					width: 100%;
					margin-top: 20rpx;

					.left {
						.material-list {
							width: 500rpx;
							display: flex;
						}

						.item-select-material {
							margin-right: 14rpx;

							.material-name {
								margin-top: 8rpx;
								width: 120rpx;
								overflow: hidden;
								text-overflow: ellipsis;
								color: $viceFontColor;
								white-space: nowrap;
								font-size: $smiddleFontSize;
							}
						}
					}

					.right {
						display: flex;
						flex-direction: column;
						justify-content: center;
						width: 100%;
						align-items: flex-end;

						.item-pice {
							font-size: 32rpx;
							font-weight: bold;
							color: $errorFontColor;
						}

						.symbol {
							font-size: 24rpx;
							color: $errorFontColor;
						}

						.item-num {
							font-size: 30rpx;
							color: $viceFontColor;
						}

					}

				}
			}
		}

		.desc-contain {
			background-color: #fff;
			padding: 28rpx 22rpx 22rpx 22rpx;
			border-radius: 0rpx 0rpx 10rpx 10rpx;

			.item-tltle {
				display: flex;
				justify-content: space-between;
				margin-bottom: 32rpx;

				.left {
					font-size: $middleFontSize;
					color: $seconFontColor;
				}

				.right {
					display: flex;
					align-items: center;
					font-size: $middleFontSize;
					color: #606166;

					.list_icon {
						width: 26rpx;
						height: 26rpx;
						margin-right: 10rpx;
					}
				}
			}

			.item-desc {
				background: #F6F7F9;
				border-radius: 10rpx;
				margin-bottom: 40rpx;

				.describe-input {
					border: 0px;
				}

				.speech-recognition {
					color: #666666;
					font-size: $smiddleFontSize;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					padding: 0rpx 20rpx 20rpx 0rpx;

					image {
						width: 24rpx;
						height: 24rpx;
					}
				}
			}

			.item-attachment {
				.file-contain {
					margin-bottom: 22rpx;
				}
			}
		}

		.billing-mode {
			background-color: #fff;
			border-radius: 10rpx;
			margin-bottom: 2rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 144rpx;

			.radio-contain {

				.u-radio {
					margin-right: 80rpx;
					margin-left: 0rpx !important;
				}

				.u-radio:last-child {
					margin-right: 0rpx;
				}
			}
		}

		.item-contain-information {
			background-color: #fff;
			display: flex;
			align-items: center;
			padding: 0rpx 36rpx;
			border-radius: 10rpx;
			height: 122rpx;

			.icon-arrow {
				margin-left: 26rpx;
			}

			.item-label {
				color: #46464E;
				font-size: $middleFontSize;
			}
		}

		.expected-duration {
			height: 124rpx;
		}

	}

	.item-tips {
		font-size: 28rpx;
		text-align: left;
		color: #999999;
		padding: 20rpx 0rpx 40rpx 40rpx;
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

	.button-content {
		/deep/ .bottom-button {
			z-index: 10000;
		}
	}

	.demand-contain {
		.item-requirement-name {
			margin-bottom: 2rpx;

			.item-contain {
				border-radius: 10rpx 10rpx 0rpx 0rpx;
			}
		}
	}
</style>
