<template>
	<view>
		<public-module></public-module>
		<z-nav-bar backState="3000" @backClick="goBackPage()">
			<view class="nav-bar" slot="default">
				<!-- {{ isEdit === 1 ? '修改报价' : '立即报价' }} -->
				提交报价
			</view>
		</z-nav-bar>
		<view class="forms">
			<!-- 只有项目管家、项目经理、项目监理才显示 -->
			<view class="decoration-type" v-if="decorationTypeList.length > 0">
				<view class="decoration-title">
					请选择客户装修类型
				</view>
				<view class="decoration-list">
					<view class="item-decoration-type"
						:class="[ decorationTypeActive == index ? 'item-decoration-type-active':'']"
						@click="getDecoration(item,index)" v-for="(item,index) in decorationTypeList" :key="index">
						{{item.label}}
						<view class="selected-type" v-if="decorationTypeActive == index">
							<u-icon name="checkmark" class="decoration-checkmark-icon" color="#fff" size="24">
							</u-icon>
						</view>
					</view>
				</view>
			</view>
			<view class="bid_amount">
				<view class="item-other">
					<view class="item-top">
						<view class="bid_amount_text" style="padding-left: 40rpx;"><text class="asterisk">*</text>我的报价
						</view>
						<view class="right" @click="getJump('组合价格')">
							<image src="/static/images/add-house.png" mode=""></image>
							组合价格
						</view>
					</view>

					<input class="bid_amount_value" :auto-focus="!isDisabled" @click="clickInput" @blur="setBlur"
						@input="setInput" :disabled="isDisabled" v-model="bidPrice" type="digit" placeholder="请输入报价金额"
						placeholder-style="color:#999999;" />

					<!-- 组合报价时不允许修改价格	 -->
					<!-- 	<view class="combined-quotation">
						<view class="item-price">
							<view class="item-symbol">￥</view>
							<view class="item-price-num">{{bidPrice}}</view>
						</view>
						<view class="item-num">6</view>
					</view> -->
				</view>
				<view class="select-material-other" v-if="setMaterialList.length !== 0">
					<mihuo-portfolio-price v-model="priceObject"></mihuo-portfolio-price>
				</view>
			</view>
			<view class="bid_amount order_time_contain">
				<view class="bid_amount_text" style="padding-left: 40rpx;">
					<view class="item-left">
						<text class="asterisk">*</text>服务时间
					</view>
					<view class="item-right">
						<view class="item-make-up-expenses">
							<text> {{startTimeStatus ? '确定':'不确定'}}服务时间</text>
							<u-switch v-model="startTimeStatus" @change="startTime" size="30" inactive-color="#F6F7F9"
								active-color="#002FA5">
							</u-switch>
						</view>
					</view>
				</view>
				<view class="order_time" v-if="startTimeStatus">
					<view class="item_left">
						<view class="item_time" @click="getTime()">
							{{startDateLabel}}
						</view>
						<text class="item_division">-</text>
						<view class="item_time" @click="getTime()">
							{{endDateLabel}}
						</view>
					</view>
					<view class="time_num">
						{{totalTime}}天
					</view>
				</view>
				<view class="start-timeStatus" v-if="!startTimeStatus">
					<u-input v-model="startDateDesc" placeholder-style="color: #999999;fontSize: 26rpx;"
						class="describe-input" maxlength="150" height="100" type="textarea" placeholder="请输入预计开工时间"
						:border="true" />
				</view>
			</view>
			<view class="bid_amount">
				<view class="bid_amount_text">报价说明</view>
				<view class="input-contain">
					<u-input class="bid_amount_value" type="textarea" v-model="bidDescription"
						placeholder="合理的报价说明，能提高抢单成功率" placeholder-style="color:#999999" />
				</view>
			</view>
			<view class="risk-statement">
				<view class="risk_title">风险提示</view>
				<view class="risk-statement-list" v-for="(item,index) in risks" :key="index">
					<view class="risk-contian">
						<view class="item-desc">
							<u-input v-model="item.name" placeholder-style="color: #999999;fontSize: 26rpx;"
								class="describe-input" maxlength="200" height="100" type="textarea"
								placeholder="请输入一条说明内容" :border="true" />
						</view>
						<view class="img-contain">
							<image-upload-new :uploadType="['图片','拍摄']" :count="9" v-model="item.attachments" />
						</view>
					</view>
					<view class="risk_add" v-if=" risks.length > 1" @click="addRisk('delete',index)">
						<u-icon name="minus" size="24" color="#002FA5"></u-icon>
						<text>删除</text>
					</view>
					<view class="risk_add" v-if="index + 1 == risks.length" @click="addRisk('add')">
						<u-icon name="plus" size="24" color="#002FA5"></u-icon>
						<text>新增</text>
					</view>
				</view>
			</view>
			<!-- 暂时隐藏 -->
			<!-- 	<view class="instalment-contain">
				<view class="instalment-top">
					<view class="item-left">
						分期付款
					</view>
					<view class="item-right">
						<u-switch v-model="instalmentChecked" :active-value="instalmentChecked" active-color="#002FA5"
							inactive-color="#C4C4C4" :inactive-value="instalmentChecked" @change="switchChange()"
							size="30"></u-switch>
					</view>
				</view>
				<view class="instalment-list">
					<view class="item-instalment-default"
						:class="[instalmentActive == item.value && instalmentChecked ? 'item-instalment-contain-active':'' ]"
						v-for="(item,index) in instalmentList" :key="index" @click="getInstalment(index,item)">
						<view class="item-type">
							{{item.type}}
						</view>
						<view class="item-label">
							<text>{{item.label}}</text>
							<u-icon v-if="item.type == '按比例付款'" class="item-icon" name="arrow-right" color="#909199"
								size="24"></u-icon>
						</view>
						<view class="selected" v-show="instalmentActive === item.value && instalmentChecked">
							<u-icon name="checkmark" class="checkmark-icon" color="#fff" size="24">
							</u-icon>
						</view>
					</view>
				</view>
			</view> -->

			<!-- <view class="bid_amount">
				<view class="expectOffer">客户期望报价</view>
				<view class="amount">￥{{ expectPrice }}</view>
				<view style="clear:both"></view>
				<view class="offer_remark">
					参考客户期望价格进行报价更容易被雇佣，请合理提交报价，请勿随意/恶意报价，否则将收到平台惩罚!
				</view>
			</view> -->

		</view>
		<view class="agreement">
			<p>1、按照订单信息给出合理报价，可以增加被雇佣的机率</p>
			<p>2、恶意报价、乱报价、报价不服务将会被扣除信用分且 降低一定的接单权益。</p>
		</view>

		<u-calendar v-model="timeShow" mode="range" @change="changeTime" max-date="2099-12-30"></u-calendar>

		<!-- <bottom-button :title=" isEdit === 1 ? '修改报价' : '立即报价'" @click="addOffer()"></bottom-button> -->
		<bottom-button title="提交报价" @click="addOffer()"></bottom-button>
		<!-- <view class="offer_immediately" @click="addOffer">{{ isEdit === 1 ? '修改报价' : '立即报价' }}</view> -->

		<!-- 分期付款弹框 -->
		<u-popup v-model="showPopup" border-radius="30" height="600" mode="bottom" :safe-area-inset-bottom="true"
			:closeable="true">
			<view class="instalment-contain-page">
				<view class="tittle">
					选择付款比例
				</view>
				<view class="type-list-contain">
					<scroll-view :scroll-y="true" class="scroll-Y">
						<view class="item-type-list">
							<view class="item-type-contain-default"
								:class="[ instalmentTypeActive == item.id ? 'item-type-contain-active':'' ]"
								@click="getInstalmentType(index,item)" v-for="(item,index) in instalmentType"
								:key="index">
								<text class="item-name" v-if="item.contain == 10">
									全款支付
								</text>
								<text class="item-name" v-if="item.contain != 10">
									按{{item.contain}}比例付款
								</text>
							</view>
						</view>
					</scroll-view>
				</view>
				<view class="item-button-contain" @click="confirmSubmit()">
					<view class="item-button">
						确认
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import moment from "@/static/js/moment.js"
	import operation from '@/plugins/mathoperation.js'
	export default {
		data() {
			return {
				bidDescription: '',
				bidPrice: '',
				orderId: '',
				isEdit: 0,
				bidId: '', // 报价ID
				expectPrice: 0, // 期望价格
				isDisabled: false,
				isFirstPrice: false, // 是否首次报价一口价
				curData: {},
				productJson: '',
				totalPrice: '',
				personId: '',
				timeShow: false,
				priceObject: {},
				startDate: '',
				endDate: '',
				startDateLabel: '开始日期',
				endDateLabel: '结束日期',
				totalTime: '',
				risksResult: [],
				risks: [{
					attachments: "",
					id: 0,
					name: "",
					orderId: 0,
					status: 0,
					userId: 0
				}],
				showPopup: false,
				instalmentChecked: false,
				instalmentActive: 0,
				instalmentTypeActive: -1,
				payPlan: '0', //支付计划 0-全款支付 1-按工种支付 2-按比例支付
				payPlanTemplated: '', //比例模板id
				instalmentType: [],
				decorationTypeActive: 0,
				decorationTypeList: [], // 装修类型
				requirementType: '',
				requirementTypeName: '',
				startTimeStatus: true,
				isStartDate: 1,
				startDateDesc: '',
				combinedquotationShow: false,
				materialList: [],
				skillNameList: ['项目管家', '项目经理', '管家', '监理', '项目监理'],
				instalmentList: [{
						type: '按工种付款',
						label: '按工种在施工前付款',
						value: 1,
					},
					{
						type: '按比例付款',
						label: '按6:3:1比例进行付款',
						value: 2
					}
				],
				form: {
					companyId: '',
					cityId: ''
				}
			}
		},
		computed: {
			...mapState(['serviceGoodsList', 'offerTotalPrice', 'offerDetails']),
			setMaterialList() {
				return this.serviceGoodsList
			},
		},
		onLoad(option) {
			const eventChannel = this.getOpenerEventChannel();
			eventChannel.on('getOrderDetails', (data) => {
				this.initParameter(data)
			});
		},
		onShow() {
			// 监听组件报价价格
			// if (['项目管家', '项目经理','管家'].includes(this.curData.skillName)) {
			uni.$on('offerTotalPrice', (res) => {
				this.bidPrice = res
			})
			// }
			this.getArtificialCostList()
		},
		watch: {
			priceObject: {
				handler(newVal, oldVal) {
					// if (!['项目管家', '项目经理','管家'].includes(this.curData.skillName)) {
					this.bidPrice = newVal.totalPrice
					// }
				},
				deep: true
			}
		},
		onUnload() {
			uni.$off('offerTotalPrice')
			// this.$store.commit('setServiceGoodsList', [])
		},
		methods: {
			/**
			 * description 初始化传递参数 
			 * */
			initParameter(data) {
				this.curData = data
				this.isEdit = data.isEdit
				this.personId = data.personId
				this.updateRisks(data)
				this.unpdateTime(data)
				if (data.isEdit === 3) {
					// 一口价首次报价
					this.isDisabled = true
					this.bidPrice = data.expectPrice
					this.isFirstPrice = true
				} else if (data.isEdit === 4) {
					// 一口价非首次报价, 禁止报价
					this.isDisabled = true
					this.bidPrice = data.expectPrice
					this.isFirstPrice = false
				} else {
					// 议价
					this.isFirstPrice = data.isEdit !== 1 ? true : false
					this.bidPrice = data.bidPrice || ''
				}
				this.orderCode = data.orderCode || ''
				this.orderId = data.orderId
				this.bidDescription = data.bidDescription || ''
				this.bidId = data.bidId || ''
				this.expectPrice = data.expectPrice || 0
				// 分期付款相关
				this.form.companyId = data.companyId
				this.form.cityId = data.cityId
				this.payPlan = data.payPlan
				this.payPlanTemplated = data.payPlanTemplateId

				// 开工、结束 相关
				if ([0, 1].includes(Number(data.isStartDate))) {
					this.startTimeStatus = data.isStartDate == 1 ? true : false
					this.startDateDesc = data.startDateDesc
				}
				// 0-全款支付 1-按工种支付 2-按比例支付
				if (this.payPlan) {
					this.instalmentChecked = true
					this.instalmentActive = this.payPlan
					this.instalmentTypeActive = this.payPlanTemplated
				}
				this.paymentByInstalments()
				this.getRequirementList()
			},
			/**
			 * @description 只有项目管家、项目经理报价时才需要查询需求类型
			 * @param 
			 */
			getRequirementList() { // 获取订单需求类型
				if (this.curData.skillName) {
					if (this.skillNameList.includes(this.curData.skillName)) {
						this.$httpApi.getDicType({
							type: 'order_requirement_type'
						}).then(res => {
							if (res) {
								this.decorationTypeList = res
								if (res.length > 0) {
									this.requirementType = res[0].value
									this.requirementTypeName = res[0].label
								}
								//需求类型相关
								this.setRequirementType()
							}
						})
					}
				}
			},
			goBackPage() {
				this.$store.commit('setServiceGoodsList', [])
				uni.navigateBack({
					delta: 1
				})
			},
			setInput(event) {
				let value = event.target.value
				this.$setInput((result) => {
					if (result) {
						this.bidPrice = result
					} else {
						// this.bidPrice = ''
					}
				}, value)
			},
			setBlur(event) {
				let value = event.target.value
				this.$setBlur((result) => {
					this.bidPrice = result
				}, value)
			},
			clickInput() {
				if (this.isDisabled) {
					this.$util.toast('一口价模式不允许修改报价~')
				}
			},
			setRequirementType() {
				this.decorationTypeList.forEach((el, index) => {
					if (el.id == this.curData.requirementType) {
						this.decorationTypeActive = index
					}
				})
				// 编辑
				// this.requirementType = this.curData.requirementType
				// this.requirementTypeName = this.curData.requirementTypeName
			},
			addOffer() {
				// 允许报价为0元
				this.setProductJson()
				// 风险项数据赋值
				this.setRisks()

				if (!this.startDate && this.startTimeStatus) {
					this.$util.toast('请填写开始日期~')
					return
				}

				if (this.instalmentChecked) {
					if (this.payPlan == 2) {
						if (!this.payPlanTemplated) {
							this.$util.toast('请选择分期付款比例')
							return
						}
					}
				}



				if (this.bidPrice >= 0 && this.bidPrice !== '') {
					// uni.showLoading()
					if (this.isEdit === 1) {
						// 修改议价
						let tempParameter = {
							bidDescription: this.bidDescription,
							bidPrice: parseFloat(this.bidPrice),
							id: this.bidId, // 报价ID
							totalPrice: parseFloat(this.bidPrice),
							startDate: this.startDate,
							endDate: this.endDate,
							risks: this.risksResult,
							payPlan: this.payPlan || 0, //支付计划 0-全款支付 1-按工种支付 2-按比例支付
							payPlanTemplateId: this.payPlanTemplated || '', //比例模板id
							requirementType: this.skillNameList.includes(this.curData.skillName) ? this
								.requirementType : 1,
							requirementTypeName: this.skillNameList.includes(this.curData.skillName) ? this
								.requirementTypeName : '装修',
							isStartDate: this.startTimeStatus ? 1 : 0,
							startDateDesc: this.startDateDesc
						}
						this.$httpApi.updateOrderOfferPrice(tempParameter).then(data => {
							this.$store.commit('setServiceGoodsList', [])
							if (data) {
								uni.hideLoading()
								uni.navigateBack();
							}
						});
					} else if (this.isEdit === 2 || this.isEdit === 3) {
						// 新增报价
						const dataObj = {
							bidDescription: this.bidDescription,
							bidPrice: parseFloat(this.bidPrice),
							orderId: this.orderId,
							totalPrice: parseFloat(this.bidPrice),
							startDate: this.startDate,
							endDate: this.endDate,
							risks: this.risksResult,
							payPlan: this.payPlan || 0, //支付计划 0-全款支付 1-按工种支付 2-按比例支付
							payPlanTemplateId: this.payPlanTemplated || '', //比例模板id
							requirementType: this.requirementType || 1,
							requirementTypeName: this.requirementTypeName || '装修',
							isStartDate: this.startTimeStatus ? 1 : 0,
							startDateDesc: this.startDateDesc
						};
						this.$httpApi.addOrderOfferPrice(dataObj).then(data => {
							this.$store.commit('setServiceGoodsList', [])
							if (data) {
								uni.hideLoading()
								this.toOfferSuccess()
							}
						}).catch(e => {
							// 提示要求技能认证
							this.$util.toast(e.errMsg)
						});
					} else {
						// 一口价模式提示不能再次报价
						this.$util.toast('你已经报过价了, 请耐心等待~ ')
						return
					}
				} else {
					this.$util.toast('请输入报价金额~')
					return
				}
			},
			toOfferSuccess() {
				uni.navigateTo({
					url: `/pages/orderReceiving/offerSuccess?orderCode=${this.orderCode}`
				});
			},
			setProductJson() {
				if (this.priceObject && Number(this.priceObject.totalPrice) > 0) {
					this.bidPrice = this.priceObject.totalPrice
				}
			},
			/**
			 * @description 选择报价
			 * 1.除项目经理之外的只需进行普通报价
			 * 2.项目经理报价则需要分模块报价
			 */
			getJump() {
				this.toPage(
					`/pages/orderReceiving/quotedPrice/quotedPricePage?bidId=${this.curData.bidId}&requirementType=${this.requirementType}`
				)
			},
			getTime() {
				this.timeShow = !this.timeShow
			},
			changeTime(value) {
				this.startDate = value.startDate
				this.endDate = value.endDate
				this.startDateLabel = value.startDate
				this.endDateLabel = value.endDate

				let tempTime = moment(this.endDate).diff(this.startDate, 'day')
				this.totalTime = tempTime + 1
			},
			addRisk(type, index) {
				if (type == 'add') {
					this.risks.push({
						attachments: "",
						id: 0,
						name: "",
						orderId: 0,
						status: 0,
						userId: 0
					})
				} else {
					this.risks.splice(index, 1)
				}
			},
			setRisks() {
				this.risksResult = []
				this.risks.forEach(el => {
					el.orderId = this.orderId
					el.userId = this.curData.billUserId
					if (el.name || el.attachments !== '[]') {
						this.risksResult.push(el)
					}
				})
			},
			updateRisks(data) {
				if (data.risk) {
					let tempRisks = data.risk !== '' && JSON.parse(data.risk)
					if (tempRisks && tempRisks.length > 0) {
						this.risks = []
						tempRisks.forEach(el => {
							this.risks.push(el)
						})
					}
				}
			},
			unpdateTime(data) {
				let tempTime = data.startDate
				if (tempTime) {
					this.changeTime(data)
				}
			},
			/**
			 * @description 选按工种付款、分期付款
			 * payPlan:'', 支付计划 0-全款支付 1-按工种支付 2-按比例支付
			 */
			switchChange() {
				if (this.instalmentChecked) {
					if (!this.payPlan) {
						this.payPlan = 1
						this.instalmentActive = 1
					}
				} else {
					this.payPlan = 0
					this.payPlanTemplated = ''
				}
			},
			/**
			 * @description 按工种付款
			 * payPlan:'', 支付计划 0-全款支付 1-按工种支付 2-按比例支付
			 */
			getInstalment(index, item) {
				if (this.instalmentChecked) {
					this.payPlan = item.value
					this.instalmentActive = item.value
					if (item.type == '按比例付款') {
						this.showPopup = true
					} else {
						this.payPlanTemplateId = ''
						this.showPopup = false
					}
				}
			},
			/**
			 * @description 按分期付款
			 * payPlanTemplated:'', 比例模板id
			 */
			getInstalmentType(index, item) {
				this.instalmentTypeActive = item.id
				this.payPlanTemplated = this.instalmentType[index].id
				if (this.instalmentType[index].contain == 10) {
					this.instalmentList[1].label = `全款支付`
				} else {
					this.instalmentList[1].label = `按${this.instalmentType[index].contain}比例进行付款`
				}
			},
			confirmSubmit() {
				this.showPopup = false
			},
			/**
			 * @description 查询分期付款比例
			 */
			paymentByInstalments() {
				if (!this.form.cityId) {
					return
				}
				return
				this.$httpApi.getPaymentBy({
					cityOperatorId: this.form.cityId,
					size: 99
				}).then(res => {
					if (res) {
						res.records.forEach(el => {
							el['contain'] = ''
							el.itemTemplates.forEach((ev, index) => {
								ev.ratio = Math.round(ev.ratio * 10)
								el['contain'] += ev.ratio + (index + 1 < el.itemTemplates.length ?
									':' : '')
							})
						})
						this.instalmentType = res.records
						if (this.instalmentType.length > 0) {
							if (this.payPlanTemplated) {
								let tempContain = this.instalmentType.find(item => item.id == this
									.payPlanTemplated)
								if (tempContain) {
									this.instalmentList[1].label = `按${tempContain.contain}比例进行付款`
								}
							} else {
								this.instalmentList[1].label = `按${this.instalmentType[0].contain}比例进行付款`
							}
						}
					}
				})
			},
			/**
			 * @description 选择需求类型(只支持项目经理)
			 */
			getDecoration(item, index) {
				this.decorationTypeActive = index
				this.requirementType = item.value
				this.requirementTypeName = item.label
			},
			startTime(event) {
				if (!event) {
					// this.startDateLabel = ''
					// this.endDateLabel = ''
				} else {
					// this.startDateDesc = ''
				}

			},
			/**
			 * @description 查询报价选材情况
			 */
			getArtificialCostList() {
				if (!this.bidId) {
					return
				}
				this.$httpApi.groupPriceByOfferId({
					offerId: this.bidId
				}).then(res => {
					if (res) {
						this.materialList = res
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	/deep/ .uni-textarea-textarea {
		color: #333333;
	}

	/deep/ .u-select__header {
		background-color: #FFFFFF;
	}

	/deep/ .uni-scroll-view {
		background-color: #FFFFFF;
	}


	.nav-bar {
		@include nav-bar-title($fontColor33)
	}

	.offer_immediately {
		height: 90rpx;
		width: calc(100vw - 120rpx);
		text-align: center;
		line-height: 90rpx;
		font-size: $middleFontSize;
		font-weight: 700;
		margin: 304rpx 60rpx 0;
		color: #FFFFFF;
		border-radius: 10rpx;
		background: linear-gradient(to right, $themeColor, $themeColor);

	}

	.agreement {
		margin: 60rpx;
		font-size: 26rpx;
		color: #909299;
		line-height: 40rpx;
	}

	.forms {
		margin: 16rpx 20rpx;

		.offer_remark {
			color: #909299;
			font-size: $smiddleFontSize;
			margin-top: 12rpx;
			padding-left: 42rpx;
		}

		.expectOffer {
			margin-top: 20rpx;
			padding-left: 42rpx;
			font-size: 32rpx;
			font-weight: 500;
			float: left;
		}

		.amount {
			font-size: 30rpx;
			color: $seconFontColor;
			float: left;
			margin: 20rpx 0 0 12rpx;
			font-weight: 500;
		}

		.decoration-type {
			border-radius: 10rpx;
			padding: 44rpx 20rpx 20rpx 20rpx;
			background-color: #fff;

			.decoration-title {
				font-size: 32rpx;
				color: #303133;
				margin-bottom: 36rpx;
			}

			.decoration-list {
				display: flex;
				flex-wrap: wrap;

				.item-decoration-type {
					width: 210rpx;
					height: 96rpx;
					text-align: center;
					line-height: 96rpx;
					border: 2rpx solid #F0F0F0;
					border-radius: 10rpx;
					margin-right: 20rpx;
					margin-bottom: 20rpx;
					color: #606166;
					font-size: 28rpx;


					&:nth-of-type(3n) {
						margin-right: 0rpx;
					}
				}

				.item-decoration-type-active {
					border: 2rpx solid $themeColor;
					color: $themeColor;
					position: relative;

					.selected-type {
						width: 0;
						height: 0;
						border-bottom: 44rpx solid $themeColor;
						border-left: 44rpx solid transparent;
						position: absolute;
						right: 0rpx;
						bottom: 0rpx;

						.decoration-checkmark-icon {
							position: relative;
							bottom: 18rpx;
							right: 24rpx;
							transform: scale(0.8);
						}
					}

				}
			}
		}

		.bid_amount {
			// height: 160rpx;
			background-color: #FFFFFF;
			margin-top: 2rpx;
			border-radius: 10rpx;
			padding: 0rpx 0rpx 30rpx 0rpx;

			.bid_amount_text {
				padding: 32rpx 30rpx 0rpx 52rpx;
				font-size: $middleAddFontSize;
				font-weight: 500;
				color: $fontColor33;
				display: flex;
				justify-content: space-between;

				.asterisk {
					color: #FF5D35;
				}

				.item-left {}

				.item-right {
					display: flex;
					align-items: center;

					.item-make-up-expenses {
						display: flex;
						align-items: center;
					}

					text {
						font-size: 26rpx;
						color: #606166;
						margin-right: 20rpx;
					}
				}
			}

			.input-contain {
				padding-left: 52rpx;
				height: auto;

				/deep/ .u-input__textarea {
					min-height: 28rpx !important;
				}
			}

			.item-other {
				display: flex;
				flex-direction: column;

				.item-top {
					display: flex;
					justify-content: space-between;

					.right {
						display: flex;
						align-items: center;
						font-size: $smiddleFontSize;
						color: $themeColor;
						padding-right: 36rpx;
					}

				}

				image {
					width: 18rpx;
					height: 18rpx;
					margin-right: 6rpx;
				}
			}

			.bid_amount_value {
				// width: 50%;
				padding-left: 52rpx;
				margin-top: 20rpx;
				font-size: 36rpx;
				color: #FF5D35;

				.uni-input-placeholder {
					font-size: 26rpx;
				}
			}

			.combined-quotation {
				padding-left: 46rpx;
				display: flex;

				.item-price {
					display: flex;
					align-items: baseline;

					.item-symbol {
						color: #FF5D35;
						font-size: 24rpx;
						transform: scale(0.9);
						transform-origin: bottom;
					}

					.item-price-num {
						color: #FF5D35;
						font-size: 36rpx;
					}
				}

				.item-num {
					width: 38rpx;
					height: 38rpx;
					border-radius: 50%;
					display: flex;
					background-color: #FF5D35;
					align-items: center;
					justify-content: center;
					font-size: 24rpx;
					color: #fff;
					margin-top: -16rpx;
					margin-left: 4rpx;
				}

			}
		}
	}

	.order_time_contain {


		.order_time {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 50rpx;
			// padding: 0rpx 30rpx 0rpx 50rpx;
			margin-top: 28rpx;

			.item_left {
				display: flex;
				align-items: center;

				.item_division {
					color: #999999;
					margin: 0rpx 8rpx;
				}

				.item_time {
					// line-height: 72rpx;
					text-align: left;
					width: 256rpx;
					height: 72rpx;
					background: #F6F7F9;
					border: 2rpx solid #F6F7F9;
					border-radius: 10rpx;
					color: #606166;
					font-size: 26rpx;
					padding: 20rpx;
				}
			}

			.time_num {
				font-size: 26rpx;
				color: #303133;
			}
		}

		.start-timeStatus {
			background: #F6F7F9;
			border-radius: 10rpx;
			margin-bottom: 10rpx;
			margin: 26rpx 32rpx 0rpx 40rpx;

			.describe-input {
				border: 0px;
			}
		}
	}

	.select-material-other {
		// padding: 20rpx 30rpx 0rpx 30rpx;
		height: 1px;
		z-index: -10;
		opacity: 0.1;
		display: none;
		position: absolute;
	}

	.risk-statement {
		padding: 32rpx;
		background-color: #FFFFFF;
		margin-top: 2rpx;

		.risk_title {
			font-size: 30rpx;
			margin-bottom: 18rpx;
			color: #333333;
		}

		.risk-contian {
			width: 80%;
		}

		.risk-statement-list {
			display: flex;
			margin-bottom: 20rpx;
		}

		.risk_add {
			border: 2rpx solid #002FA5;
			border-radius: 10rpx;
			width: 112rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 72rpx;
			margin-left: 20rpx;

			text {
				font-size: 24rpx;
				color: #002FA5;
				margin-left: 4rpx;
			}

		}

		.item-desc {
			background: #F6F7F9;
			border-radius: 10rpx;
			margin-bottom: 10rpx;

			.describe-input {
				border: 0px;
			}
		}
	}

	.instalment-contain {
		background-color: #FFFFFF;
		border-radius: 10rpx;
		margin-top: 2rpx;
		padding: 32rpx;

		.instalment-top {
			display: flex;
			justify-content: space-between;
			margin-bottom: 20rpx;

			.item-left {
				font-size: 30rpx;
				color: #333333;
			}

			.item-right {
				padding-right: 16rpx;
			}
		}

		.instalment-list {
			display: flex;

			.item-instalment-default {
				width: 304rpx;
				padding: 26rpx;
				background-color: #F6F6F6;
				margin-right: 32rpx;
				border-radius: 10rpx;
				border: 1px solid #fff;
				position: relative;

				.selected {
					width: 0;
					height: 0;
					border-bottom: 44rpx solid $themeColor;
					border-left: 44rpx solid transparent;
					position: absolute;
					right: 0rpx;
					bottom: 0rpx;

					.checkmark-icon {
						position: relative;
						top: 12rpx;
						left: -24rpx;
						transform: scale(0.8);
					}
				}





				&:last-child {
					margin-right: 0rpx;
				}

				.item-type {
					font-size: 26rpx;
					color: #303133;
					margin-bottom: 4rpx;
				}

				.item-label {
					text {
						font-size: 24rpx;
						color: #909199;
					}
				}
			}

			.item-instalment-contain-active {
				background-color: #F6F8FF;
				border: 1px solid #002FA5;

				.item-type {
					color: #002FA5;
				}

				.item-label {
					text {
						color: rgba(0, 47, 165, 0.6);
					}
				}
			}
		}

	}

	.instalment-contain-page {
		height: 100%;

		.tittle {
			font-size: 30rpx;
			font-weight: bold;
			text-align: center;
			padding: 36rpx 0rpx;
			border-bottom: 2rpx solid #EEEEEE;
			color: $seconFontColor;
		}

		.type-list-contain {
			height: calc(100% - 220rpx);
			padding: 40rpx 70rpx 30rpx 70rpx;

			.scroll-Y {
				height: 100%;
			}

			.item-type-list {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;

				.item-type-contain-default {
					background: #F6F6F6;
					border: 1px solid #fff;
					border-radius: 3px;
					width: 280rpx;
					padding: 18rpx 42rpx;
					display: flex;
					align-items: center;
					margin-right: 34rpx;
					margin-bottom: 32rpx;

					.item-name {
						color: #303133;
						font-size: 26rpx;
					}

					&:nth-of-type(2n + 0) {
						margin-right: 0rpx;
					}
				}

				.item-type-contain-active {
					background: #F6F8FF;
					border: 1px solid #002FA5;

					.item-name {
						color: #002FA5;
					}
				}
			}



		}

		.item-button-contain {
			position: fixed;
			display: flex;
			justify-content: center;
			width: 100%;

			.item-button {
				position: relative;
				width: 624rpx;
				height: 88rpx;
				text-align: center;
				background-color: #002FA5;
				line-height: 88rpx;
				color: #fff;
				font-size: 24rpx;
				border-radius: 10rpx;
			}
		}
	}
</style>
