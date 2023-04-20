<template>
	<view class="sendOrder">
		<!-- 发布订单, 从底部导航栏中间按钮进入 -->
		<public-module></public-module>
		<z-nav-bar backState="1000" bgColor="#002FA5" fontColor="#fff" class="z-nav-bar">
			<view solt="default" class="title">发布订单</view>
		</z-nav-bar>
		<view class="form-view">
			<view class="top-bg"></view>
			<u-form :model="form" ref="uForm" class="form-page">
				<view class="form-item-contain">
					<view class="form-item bg_fff" v-if="option !== 'update'&& nodeId===0"
						style="padding: 32rpx 34rpx;">
						<view class="form-title">{{form.requirementTypeName}}</view>
						<custom-input iconName="arrow-right" :border="false" placeholder="更换需求类型" style="height: 40rpx;"
							@click="getRequirementListShow('sendOrderPopupRequirement')" />
						<send-order-popup ref="sendOrderPopupRequirement" titleName="更换需求类型">
							<view class="workers-type-item-value">
								<view v-for="(item,index) in requirementList" :key="index"
									@click="getRequirementListType(item,index)" class="workers-type-item">
									<text class="text">{{item.label}}</text>
									<view class="selected" v-show="requirementTypeIndex === index">
										<u-icon name="checkmark" class="checkmark-icon" color="#fff" size="24">
										</u-icon>
									</view>
								</view>
							</view>
						</send-order-popup>
					</view>
					<view class="form-item">
						<view class="item-top">
							<view class="item-title">订单详情</view>
							<image src="/static/icon/open_arrow.png" :style="!formType?'transform: rotate(90deg);':''"
								class="arrow_down" />
							<view class="item-click" @click="formType = formType ? false : true">
								{{formType ? '点击展开' : '点击收起'}}
							</view>
							<view style="clear: both;"></view>
						</view>
						<view class="form-group" :style="{height: !formType ? '580rpx': '0'}">
							<view class="item-contain-information" v-if="nodeId===0">
								<view class="item-label">需求名称</view>
								<u-form-item prop="name" label="">
									<u-input v-model="form.requirementName" placeholder-style="fontSize:26rpx"
										placeholder="请输入需求名称" />
								</u-form-item>
							</view>
							<view class="item-contain-information">
								<view class="item-label">施工地点</view>
								<u-form-item prop="name" label="" style="padding: 6rpx 32rpx;">
									<custom-input placeholder="请选择施工地点" iconName="map-fill" v-model="together"
										@click="getConstructionSite" :border="false">
									</custom-input>
								</u-form-item>
							</view>
							<view class="item-contain-information">
								<view class="item-label">详细地点</view>
								<u-form-item prop="name" label="">
									<u-input v-model="form.address" placeholder="请输入详细地点"
										placeholder-style="fontSize:26rpx" />
								</u-form-item>
							</view>
							<view class="item-contain-information">
								<view class="item-label">上门时间</view>
								<u-form-item prop="name" label="" style="padding: 6rpx 32rpx;">
									<custom-input placeholder="请选择上门时间" iconName="calendar" v-model="form.expectDate"
										@click="getExpectTime" :border="false"></custom-input>
									<u-picker v-model="show" mode="time" :params="params" @confirm="confirmTime">
									</u-picker>
								</u-form-item>
							</view>
							<view class="item-contain-information">
								<view class="item-label">预期工期</view>
								<u-form-item prop="name" label="">
									<u-input type="digit" v-model="form.expectDuration"
										placeholder-style="fontSize:26rpx" placeholder="请输入预期工期" />
								</u-form-item>
							</view>
						</view>
					</view>
					<view class="form-item">
						<view class="item-top">
							<view class="item-title">支付信息</view>
							<image src="/static/icon/open_arrow.png" :style="!formType2?'transform: rotate(90deg);':''"
								class="arrow_down" />
							<view class="item-click" @click="formType2 = formType2 ? false : true">
								{{formType2 ? '点击展开' : '点击收起'}}
							</view>
							<view style="clear: both;"></view>
						</view>
						<view class="form-group" :style="{height: !formType2 ? '348rpx': '0'}">
							<view class="item-contain-information">
								<view class="item-label">选择工种</view>
								<u-form-item prop="name" label="" style="padding: 6rpx 32rpx;">
									<custom-input iconName="arrow-right" placeholder="请选择工种"
										v-model="skillTypeNameAlternative" :remove="true"
										@click="getRequirementListShow('sendOrderPopupWork')" :border="false">
									</custom-input>
								</u-form-item>
								<send-order-popup ref="sendOrderPopupWork" titleName="请选择工种" :commitStatus="false"
									v-if="nodeId===0">
									<view class="workers-type-item-value management-contain">
										<view v-for="(item,index) in managementList" :key="index"
											@click="getManagementType(item,index)" class="workers-type-item">
											<text class="text">{{item.label||item.name}}</text>
											<view class="selected" v-show="workTypeIndex === item.id">
												<u-icon name="checkmark" class="checkmark-icon" color="#fff" size="24">
												</u-icon>
											</view>
										</view>
									</view>
									<view class="work-name-title">工人师傅</view>
									<view class="workers-type-item-value worker-list">
										<view v-for="(item,index) in workTypeList" :key="index"
											@click="getWorkType(item,index)" class="workers-type-item">
											<text class="text">{{ item.skillName }}</text>
											<view class="selected" v-show="workTypeIndex === item.skillId">
												<u-icon name="checkmark" class="checkmark-icon" color="#fff" size="24">
												</u-icon>
											</view>
										</view>
									</view>
									<!-- <view class="reference" @click="getReference">不知道怎么选?</view> -->
								</send-order-popup>
							</view>
							<view class="item-contain-information" v-if="nodeId===0">
								<view class="item-label">报价方式</view>
								<u-form-item prop="name" label="" style="padding: 6rpx 32rpx;">
									<custom-input iconName="arrow-right" :border="false" :placeholder="offerType"
										style="height: 40rpx;" @click="getRequirementListShow('offerType')"
										placeholderColor="#333333" />
									<send-order-popup ref="offerType" titleName="选择报价方式">
										<view class="workers-type-item-value offer-type">
											<view v-for="(item,index) in list" :key="index"
												@click="getOfferType(item,index)" class="workers-type-item">
												{{item.name}}
												<view class="selected" v-show="offerTypeIndex === index">
													<u-icon name="checkmark" class="checkmark-icon" color="#fff"
														size="24">
													</u-icon>
												</view>
											</view>
										</view>
									</send-order-popup>
								</u-form-item>
							</view>
							<view class="item-contain-information">
								<view class="item-label">价格</view>
								<u-form-item prop="name" label="">
									<u-input type="digit" v-model="form.price" placeholder="请输入价格"
										placeholder-style="fontSize:26rpx" />
								</u-form-item>
								<view class="reference-price">
									<text class="price-text">参考价格:{{form.referencePrice || 0}}元</text>
								</view>
							</view>
						</view>
					</view>
					<view class="form-item" v-if="nodeId===0">
						<view class="item-top">
							<view class="item-title">联系人信息</view>
							<image src="/static/icon/open_arrow.png" :style="!formType3?'transform: rotate(90deg);':''"
								class="arrow_down" />
							<view class="item-click" @click="formType3 = formType3 ? false : true">
								{{formType3 ? '点击展开' : '点击收起'}}
							</view>
							<view style="clear: both;"></view>
						</view>
						<view class="form-group" :style="{height: !formType3 ? '232rpx': '0'}">
							<view class="item-contain-information">
								<view class="item-label">联系姓名</view>
								<u-form-item prop="name" label="">
									<u-input :border="true" v-model="form.contactName" placeholder="请输入姓名"
										style="border: 1rpx solid #EEEEEE;" placeholder-style="fontSize:26rpx" />
								</u-form-item>
								<view class="radio-contain">
									<u-radio-group v-model="contactGenderNew" @change="radioGroupChangeRender">
										<u-radio :active-color="themeColor" v-for="(item, index) in genderList"
											:key="index" :name="item.name" :disabled="item.disabled" size="30">
											{{item.name}}
										</u-radio>
									</u-radio-group>
								</view>
							</view>
							<view class="item-contain-information" style="margin-top: 2rpx;">
								<view class="item-label">联系方式</view>
								<u-form-item prop="name" label="">
									<u-input :border="true" type="digit" maxlength="11" v-model="form.contactPhone"
										placeholder="请输入联系方式" style="border: 1rpx solid #EEEEEE;"
										placeholder-style="fontSize:26rpx" />
								</u-form-item>
							</view>
						</view>
					</view>
					<view class="form-item">
						<view class="item-top">
							<view class="item-title">需求及附件</view>
							<image src="/static/icon/open_arrow.png" :style="!formType4?'transform: rotate(90deg);':''"
								class="arrow_down" />
							<view class="item-click" @click="formType4 = formType4 ? false : true">
								{{formType4 ? '点击展开' : '点击收起'}}
							</view>
							<view style="clear: both;"></view>
						</view>
						<view class="form-group" :style="{height: !formType4 ? 'max-content': '0'}">
							<view class="describe">
								<view class="phrase-contain">
									<view class="item-describe">需求描述</view>
									<view class="item-phrase align-items"
										@click="getRequirementListShow('sendOrderPopupPhrase')">
										<image class="list_icon" src="/static/icon/list.png"></image>
										<text class="item-phrase-text">常用语</text>
									</view>
								</view>
								<send-order-popup ref="sendOrderPopupPhrase" titleName="请选择常用语" :commitStatus="false">
									<view class="workers-type-item-value phrase-list">
										<view @click="getPhraseListType(item,index)" v-for="(item,index) in phraseList"
											:key="index" class="item-phrase">{{item.label}}</view>
									</view>
								</send-order-popup>
								<u-input v-model="form.requirementDesc" class="describe-input" height="190"
									type="textarea" placeholder="请输入需求描述文字" placeholder-style="fontSize:26rpx"
									:auto-height="false" />
								<view class="file-contain">
									<image-upload-new :uploadType="uploadType" :count="9" v-model="fileObject" />
								</view>
								<view class="voice-contain">
									<sound-recording @chooseVoice="chooseVoice" />
								</view>
							</view>
						</view>
					</view>
				</view>
			</u-form>
		</view>
		<bottom-button title="发布任务" @click="saveForm()" />
	</view>
</template>

<script>
	import {
		debounce
	} from "@/plugins/utils.js"
	import {
		CommonUpload
	} from '@/plugins/uploadPic.js';
	import {
		styleColor
	} from "@/style/mixin.js"
	export default {
		data() {
			return {
				themeColor: styleColor.themeColor,
				offerType: '一口价',
				formType: false, // 是否展开订单详情
				formType2: false, // 是否展开支付信息
				formType3: false, // 是否展开联系信息
				formType4: false, // 是否展开需求信息
				show: false,
				commitStatus: false,
				apiStr: '',
				form: {
					referencePrice: 0,
					requirementTypeName: '',
					priceWay: '1',
					contactGender: '1',
					address: '',
					expectDate: '',
					expectDuration: '',
					price: '',
					requirementName: '',
					requirementType: 1,
					contactName: '',
					contactPhone: '',
					requirementDesc: '',
					skillId: '',
					skillName: '',
					orderStatus: 0, // 订单状态：0=草稿，1=发布订单，2=等待报价，3=订单确认，4=接单完成，5=订单取消
					jobCode: 'R_WORKER', // 需求角色类型：R_WORKER=工人，R_PROJECT_MANAGER=项目经理，R_PROJECT_SUPERVISION=监理
					roleTypeName: '',
					userId: '',
					latitude: '',
					longitude: '',
					cityId: uni.getStorageSync('cityOperatorId') || '-1',
					cityName: uni.getStorageSync('userAddress').address || '',
					publishType: 1, // 发布类型：1=个人发布, 2=企业发布
					assignType: 2, // 指派模式 1=指派, 2=抢单
					companyId: '0', // 发布企业id，非企业发布为0，企业发布时必传,
					attachments: '', // 附件
				},
				audioFile: [],
				skillTypeNameAlternative: '',
				together: '',
				priceWayNew: '一口价',
				contactGenderNew: '先生',
				requirementList: [],
				requirementTypeIndex: 0,
				workTypeList: [],
				workTypeIndex: 0,
				offerTypeIndex: 0,
				managementList: [{
					label: '项目经理',
					value: 'JOB_PROJECT_MANAGER',
					id: '99'
				}, {
					label: '监理',
					value: 'JOB_PROJECT_SUPERVISION',
					id: '100'
				}],
				uploadType: ['图片', '视频', '文件'],
				phraseList: [],
				stepsList: [{
						lable: '1',
						text: '发布订单'
					},
					{
						lable: '2',
						text: '等待报价'
					},
					{
						lable: '3',
						text: '订单确认'
					},
					{
						lable: '4',
						text: '接单完成'
					},
				],
				list: [{
						name: '一口价',
						disabled: false
					},
					{
						name: '议价',
						disabled: false
					},
				],
				genderList: [{
						name: '先生',
						disabled: false
					},
					{
						name: '女士',
						disabled: false
					},
				],
				params: {
					year: true,
					month: true,
					day: true,
				},
				fileObject: '',
				rules: {},
				receiveUserIds: [],
				receiveUserList: [],
				nodeId: 0,
				skillId: ''
			}
		},
		onLoad(option) {
			this.option = option
			if (option.type === 'update') {
				this.orderDetails()
			}
			this.getRequirementList()
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		onShow() {
			let that = this
			uni.$on('updateData', function(data) {
				if (JSON.stringify(data) !== "{}") {
					// 这里的adcode应该和首页选择的运营商的cityId一致
					// that.form.cityId = data.adcode.substring(0, 2)
					that.form.cityName = data.pname + data.cityname + data.adname + data.name
					that.together = that.form.cityName
					that.form.longitude = data.location.lng
					that.form.latitude = data.location.lat
				}
			})
			uni.$on('checkList', function(data) {
				var list = data ? JSON.parse(data) : [];
				var employeeName = []
				var receiveUserIds = []
				that.receiveUserList = list
				list.map(res => {
					receiveUserIds.push(res.userId)
					employeeName.push(res.name)
				})
				that.receiveUserIds = receiveUserIds
				that.form.contactName = employeeName.toString()
			})
		},
		onUnload() {
			uni.$off('updateData')
			uni.$off('checkList')
		},
		methods: {
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
			getRequirementListShow(str) {
				this.$refs[str].requirementListShow = true
			},
			getRequirementListType(item, index) {
				this.requirementTypeIndex = index
				this.form.requirementTypeName = item.label
				this.form.requirementType = item.value
			},
			// 获取平台工种类型
			getWorkTypeList() {
				this.$httpApi.getWorkType({
					type: 2,
					clientType: 'platform',
					size:100
				}).then((res) => {
					if (res) {
						this.workTypeList = res.records
						this.getPhrase()
					}
				})
			},
			// 选择工种
			getWorkType(item, index) {
				this.workTypeIndex = item.skillId
				this.form.skillName = item.skillName
				this.skillTypeNameAlternative = item.skillName
				this.form.skillId = item.skillId
				this.form.referencePrice = item.guidingPrice || 0
				this.form.jobCode = 'R_WORKER'
				this.form.roleTypeName = '工人'
				this.skillId = item.skillId
				this.$refs.sendOrderPopupWork.close()
			},
			// 选择价格模式
			getOfferType(item, index) {
				this.offerTypeIndex = index
				this.priceWayNew = item.name
				this.offerType = item.name
				this.$refs.offerType.close()
			},
			// 选择监理或经理
			getManagementType(item, index) {
				this.workTypeIndex = item.id
				this.form.jobCode = item.value
				this.form.roleTypeName = item.label || item.name
				this.skillTypeNameAlternative = item.label || item.name
				this.form.skillId = ''
				this.form.skillName = item.name || ''
				this.$refs.sendOrderPopupWork.close()
			},
			// 获取常用短语
			getPhrase() {
				this.$http.get(
						`${this.apiStr}admin/dict/type?type=issue_order_description&companyId=${uni.getStorageSync('userPersonDetails').companyId || 0}`
					)
					.then(res => {
						this.phraseList = res
					})
			},
			// 常用语添加到需求描述中
			getPhraseListType(item, index) {
				this.form.requirementDesc = this.form.requirementDesc + item.label
			},
			// 发布抢单
			saveForm() {
				this.form.priceWay = this.priceWayNew === '一口价' ? 1 : 2
				this.form.contactGender = this.contactGenderNew === '先生' ? 1 : 2
				this.form.userId = uni.getStorageSync('userData').sysUser.userId
				this.form.expectDate = this.form.expectDate
				// 数据校验
				this.dataValidation()
			},
			dataValidation() {
				if (this.form.requirementName == '') {
					this.$util.toast('请输入需求名称');
					return
				}
				if (this.together == '') {
					this.$util.toast('请输入施工地点');
					return
				}
				if (this.form.address == '') {
					this.$util.toast('请输入详情地点');
					return
				}
				if (this.form.expectDate == '') {
					this.$util.toast('请输入上门时间');
					return
				}
				if (this.form.expectDuration == '') {
					this.$util.toast('请输入预期工期');
					return
				}
				if (this.skillTypeNameAlternative == '') {
					this.$util.toast('请选择工种');
					return
				}
				if (this.priceWayNew === '一口价' && this.form.price == '') {
					this.$util.toast('请输入价格');
					return
				}
				if (this.form.contactName == '') {
					this.$util.toast('请输入联系姓名');
					return
				}
				if (this.form.contactPhone == '') {
					this.$util.toast('请输入手机号');
					return
				}
				if (!this.$base.phoneRegular.test(this.form.contactPhone)) {
					this.$util.toast('手机号格式不正确');
					return
				}
				if(!this.$checkUploadProcess(this.fileObject)){
					return;
				}
				// 处理附件
				let attachmentsFile = this.fileObject !== '' && JSON.parse(this.fileObject)
				let fileAll = [...this.audioFile]
				if (attachmentsFile) {
					fileAll = [...this.audioFile, ...attachmentsFile]
				}
				this.form.attachments = fileAll
				this.sendOrder()
			},
			// 发布订单
			sendOrder() {
				uni.showLoading()
				if (this.option.type === 'update') {
					// 修改订单
					this.$httpApi.editOrder({
						...this.form,
					}).then(res => {
						if (!res) {
							this.$util.toast('网络异常, 请稍后再试~')
							return
						}
						uni.hideLoading()
						uni.navigateTo({
							url: `/pages/publishTask/sendOrderSuccess?id=${res.id}&orderCode=${res.orderCode}&typeName=修改成功`
						});
					}).catch(e => {
						console.log(e)
						this.$util.toast('网络异常, 请稍后再试~')
					});
				} else {
					// 发布订单
					this.$httpApi.sendOrder({
						...this.form,
					}).then(res => {
						if (res) {
							uni.hideLoading()
							// 清空表单数据
							this.together = ''
							this.skillTypeNameAlternative = ''
							this.offerType = ''
							for (let key in this.form) {
								this.form[key] = ''
							}
							uni.navigateTo({
								url: `/pages/publishTask/sendOrderSuccess?id=${res.id}&orderCode=${res.orderCode}&typeName=发布成功`
							});
						} else {
							this.$util.toast('网络异常, 请稍后再试~')
						}
					}).catch(e => {
						this.$util.toast(e.errMsg)
					});
				}
			},
			// 显示选择时间组件
			getExpectTime() {
				this.show = true
			},
			// 确认选择时间
			confirmTime(value) {
				this.form.expectDate = value.year + '-' + value.month + '-' + value.day
			},
			getConstructionSite() {
				uni.navigateTo({
					url: '/pages/mapChoose/mapChoose',
					animationType: 'slide-in-bottom',
				})
			},
			// 性别
			radioGroupChangeRender(value) {
				this.form.contactGender = value === '先生' ? 1 : 2
			},
			// 一口价 、议价
			radioGroupChange(value) {
				this.form.priceWay = value === '一口价' ? 1 : 2
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
					this.audioFile = audioFile
				}
			},
			getReference() {
				this.$util.toast('敬请期待 ! ! !');
			},
			orderDetails() {
				this.$http.get(`${this.apiStr}order/biz_order/${this.option.id}`).then(res => {
					this.form = res
					this.together = res.cityName
					this.skillTypeNameAlternative = res.skillTypeName
					switch (res.jobCode) {
						case 'R_WORKER':
							this.workTypeIndex = this.workTypeList.filter(item => res.skillType === item.workId)[0]
								.workId
							break
						case 'R_PROJECT_MANAGER':
							this.workTypeIndex = this.managementList.filter(item => res.roleType === item.value)[0]
								.id
							break
						case 'R_PROJECT_SUPERVISION':
							this.workTypeIndex = this.managementList.filter(item => res.roleType === item.value)[0]
								.id
							break
					}
				});
			},
		},
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';
	$orangeColor:linear-gradient(90deg, $themeColor 1%, $themeColor 100%);

	.z-nav-bar {
		.title {
			@include nav-bar-title(#FFFFFF)
		}
	}

	.form-view {
		.top-bg {
			height: 120rpx;
			background: $themeColor;
		}

		.form-page {
			margin-top: -80rpx;
		}
	}

	/deep/ .u-input {
		border-radius: 10rpx;
		padding: 6rpx 32rpx 6rpx 32rpx !important;

		.uni-textarea-textarea {
			font-size: 28rpx;
			color: #606266;
		}
	}

	.is-border {
		border: 1rpx solid #EEEEEE !important;
	}

	/deep/ .uni-input-input {
		color: #333333;
	}

	/deep/ .input-placeholder {
		color: rgb(192, 196, 204);
	}

	/deep/ .u-radio__label {
		// margin-right: 60rpx;
	}

	/deep/ .u-input__textarea {
		// padding: 28rpx 0 32rpx 0;
	}

	/deep/.u-radio__label {
		font-size: $smiddleFontSize;
	}

	.order-steps {
		display: flex;
		justify-content: space-around;
		background: $orangeColor;
		padding: 50rpx 34rpx 140rpx 38rpx;
	}

	.item-interval {
		height: 2rpx;
		width: 72rpx;
		background-color: #FFB887;
		position: relative;
		top: 50rpx;
		top: 24rpx;
		left: -16rpx;
	}

	.item-contain {
		display: flex;
		position: relative;

		&:first-child {
			.item-interval {
				display: none;
			}
		}
	}

	.item-steps {
		flex: 1;
		color: #FFFFFF;
	}

	.item-number-contain {
		display: flex;
		justify-content: center;

		.item-parent {
			width: 52rpx;
			height: 52rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 50%;

		}

		.itemParentActive {
			background-color: #FFDAC1;
		}
	}

	.item-number {
		color: #FF8061;
		width: 40rpx;
		height: 40rpx;
		background-color: #FFDAC1;
		border-radius: 50%;
		font-size: 24rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.active {
		color: $themeColor;
		background-color: #FFFFFF;
		font-size: 28rpx;
	}

	.intervalActive {
		background-color: #FFFFFF;
	}

	.item-text {
		white-space: nowrap;
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.6);
	}

	.textActive {
		color: #FFFFFF;
	}

	.form-item-contain {
		// margin-top: -78rpx;

		.u-cell-hover {
			// background-color: #FFFFFF !important;
		}
	}

	.bg_fff {
		background: #FFFFFF;
	}

	.form-item {
		margin: 10rpx 20rpx 8rpx 20rpx;
		border-radius: 10rpx;
		padding-top: 20rpx;

		.item-top {
			padding: 0 34rpx 20rpx;

			.item-title {
				font-weight: bold;
				font-family: PingFang SC;
				font-style: normal;
				font-size: $middleFontSize;
				line-height: 50rpx;
				color: $seconFontColor;
				float: left;
				font-weight: bold;
			}

			.item-click {
				font-weight: normal;
				font-size: $smiddleFontSize;
				line-height: 50rpx;
				float: right;
				color: #A7A7A7;
			}

			.arrow_down {
				width: 16rpx;
				height: 16rpx;
				transition: all .5s;
				float: right;
				margin-top: 17rpx;
				margin-left: 10rpx;
			}
		}

		.form-title {
			margin-bottom: 12rpx;
		}

		.form-group {
			overflow: hidden;
			transition: height .5s;
		}

		.item-contain-information {
			height: 114rpx;
			padding: 0 34rpx;
			margin-top: 2rpx;
			display: flex;
			align-items: center;
			background: #FFFFFF;
			border-radius: $miniBorderRadius;

			.item-label {
				width: max-content;
				height: 40rpx;
				min-width: 100rpx;
				line-height: 40rpx;
				color: #333333;
				font-size: 28rpx;
				margin: 0 18rpx 14rpx 0;
				padding-top: 6rpx;
			}

			.u-form-item {
				flex: 1;
				padding: 6rpx 0 14rpx 0;
			}
		}

		.describe {
			flex-direction: column;
			padding: 28rpx 22rpx 1rpx;
			background: #FFFFFF;
			border-radius: $miniBorderRadius;

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
					font-weight: 400;
					font-size: $middleFontSize;
					color: $mainFontColor;
					margin-left: 38rpx;
				}

				.item-phrase {
					font-size: 28rpx;
					color: #606166;

					.list_icon {
						width: 26rpx;
						height: 27rpx;
					}

					.item-phrase-text {
						font-size: $middleFontSize;
						color: $mainFontColor;
						margin: 0 18rpx 0 10rpx;
					}
				}
			}

			.file-contain {
				margin: 40rpx 0 20rpx 0;
			}
		}

		.item-radio {
			margin: 0 0 20rpx 130rpx;
		}

		.radio-contain {
			padding-left: 22rpx;
			margin-bottom: 14rpx;

			.release-type {
				font-size: $smiddleFontSize;
				color: $seconFontColor;
			}
		}

		.reference-price {
			padding-left: 32rpx;

			.price-text {
				font-size: $middleFontSize;
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

		.voice-contain {
			margin-bottom: 42rpx;
		}
	}

	.u-border-bottom:after {
		border: 0px;
	}

	.u-cell {
		padding: 12rpx 0 0rpx 0;

	}

	.u-cell__label {
		font-size: 28rpx;
		color: #999999;
	}

	.next-form {
		background: $orangeColor;
		border-radius: 10px;
		padding: 24rpx 230rpx;
		color: #FFFFFF;
		font-size: 28rpx;
		display: flex;
		justify-content: center;
	}

	.contain-bottom {
		padding: 50rpx 64rpx 64rpx 64rpx;
	}

	.type-contain {

		.type-title {
			font-size: 32rpx;
			color: $seconFontColor;
			margin: 0 20rpx;
			line-height: 1;
			padding-bottom: 36rpx;
			border-bottom: 2rpx solid #EEEEEE;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 42rpx;
		}

		.workers-type-item-value {
			padding: 40rpx;
			display: flex;
			flex-wrap: wrap;
		}

		.worker-list {
			padding-bottom: 20rpx;
		}

		.reference {
			font-size: 32rpx;
			color: $themeColor;
			text-align: center;
			margin-bottom: 48rpx;
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
		}

		.work-name-title {
			padding: 0 40rpx;
		}

		.management-contain {
			.workers-type-item {
				margin-bottom: 0;
			}
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

		.phrase-list {
			overflow-y: auto;
			max-height: 360rpx;
			padding-top: 16rpx;
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

	.button-determine {
		background: linear-gradient(90deg, $themeColor 0%, $themeColor 100%);
		border-radius: 10rpx;
		font-size: 28rpx;
		color: #FFFFFF;
		text-align: center;
		padding: 24rpx 284rpx;
		margin: 0 64rpx 54rpx 62rpx;
	}

	.align-items {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.offer-type {
		.workers-type-item {
			line-height: 1;
		}
	}
</style>
