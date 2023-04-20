<template>
	<view class="new-order-page">
		<view class="secondary_tabs">
			<u-tabs :list="orderStatusList" :is-scroll="false" :current="currentNew" bar-width="42"
				@change="clickOrderStatus" :scrollable="false" inactive-color="#909299" active-color="#002FA5"
				font-size="30"></u-tabs>
		</view>
		<mescroll-uni ref="mescrollRef" @init="mescrollInit" :top="mescrollTop" :topbar="true" :down="downOption"
			:up="upOption" @down="downCallback" @up="upCallback">
			<scroll-view @scrolltolower="scrollToLower" :scroll-y="true" class="scroll-y">
				<view class="order-list">
					<view v-for="(item, index) in orderList" :key="index">
						<order-new-item :orderData="item" :tabIndex="titleIndex" :isSender="titleIndex === 1"
							@reloadDataList="getOrderData2" @getButton="getButton" @getLog="getLog"
							:is-show-distance="hasLocationPermisson">
						</order-new-item>
					</view>
					<mh-empty v-if="orderList.length === 0" icon="/static/images/no_recommend.png" title="暂时还没有订单～～" />
					<u-loadmore v-else :status="status" />
				</view>
			</scroll-view>
		</mescroll-uni>
		<!-- 立即、拒绝接单弹框 -->

		<modal-new :shutDown="true" v-model="modalShow" @click="confirm" @cancel="cancel">
			<view class="label">是否确认该操作</view>
		</modal-new>

		<!-- 拒绝接单弹窗 -->
		<view class="complaints-contain">
			<sku-popup v-model="showPopup" title="请选择原因" @clearCur="clearCur">
				<view class="content-sku">
					<view class="content-main">
						<scroll-view :scroll-y="true" class="scroll-y-complaints">
							<view class="content-main_res_list">
								<view class="content-main_res" @click="radioValue(item,index)"
									v-for="(item,index) in reasonList" :key="index">
									<view class="radio" :class="{radioSelect:curIndex === index}"></view>
									<view class="reason">{{item.label}}</view>
								</view>
							</view>
						</scroll-view>
						<textarea class="item-desc-input" placeholder-style="color:#808080" placeholder="请输入补充描述"
							v-model="replaceReason" />
					</view>
					<view class="item-button-contain" @click="confirmSubmit">
						<view class="item-button">
							确认提交
						</view>
					</view>
				</view>
			</sku-popup>
		</view>

		<!-- 操作日志弹窗 -->
		<log-pop-up v-model="logShowPopup" :logList="logList" title="操作记录" @close="getPopupClose"></log-pop-up>

		<!-- 服务协议弹框 -->
		<service-agreement-popup v-if="serviceAgreementPopupStatus" v-model="serviceAgreementPopupStatus"
			@close="getServiceClose" @submit="confirm" :info="serviceInfo" :typeName="serviceType">
		</service-agreement-popup>

		<!-- 待办日历 -->
		<!-- <view class="item-calendar" @click="getToCalendar()">
			<image src="@/static/images/Group.png" mode=""></image>
		</view> -->
	</view>
</template>

<script>
	import moment from '@/static/js/moment.js'
	import {
		getDistance
	} from "@/plugins/utils.js";
	export default {
		data() {
			return {
				items: ['我服务的', '我发布的'],
				status: 'nomore',
				titleIndex: 0,
				currentNew: 0,
				serviceInfo: {},
				serviceType: '',
				// 0=发布订单，5=等待报价，10=待确认接单，15=待付款，20=已付款/待付款，
				// 25=待开工，30=开工中，35=待验收，40=待结算，45=待评价(结算完成)，
				// 50=已完成，55=待售后，60=售后中，65=取消
				// 我服务的订单状态
				orderService: [{
						name: '全部',
						value: ''
					},
					{
						name: '待确认',
						value: 10
					},
					{
						name: '服务中',
						value: 30
					},
					{
						name: '待付款',
						value: 20 // 返回待结算(40) + 待付款(20)的订单
					},
					{
						name: '已完成',
						value: 50
					}
				],
				// 我接受的订单状态
				orderRelease: [{
						name: '全部',
						value: ''
					},
					// {
					// 	name: '待报价',
					// 	value: 10
					// },
					{
						name: '待确认',
						value: 10
					},
					{
						name: '服务中',
						value: 30
					},
					{
						name: '待付款',
						value: 20 // 返回待结算(40) + 待付款(20)的订单
					},
					{
						name: '已完成',
						value: 50
					}
				],
				orderStatusList: [],
				orderStatus: '',
				orderList: [],
				current: 1,
				serviceCurrent: 1,
				releaseCurrent: 1,
				contrast: 0,
				pageSize: 10,
				total: 0,
				pages: 0,
				latitude: 0,
				longitude: 0,
				downOption: {
					use: true,
					auto: false,
				},
				upOption: {
					use: false, // 上滑加载更多不使用mescroll实现
					toTop: {
						src: ''
					},
				},
				mescroll: null,
				hasLocationPermisson: true,
				reasonList: [],
				curIndex: 0,
				replaceReason: '',
				modalShow: false,
				showPopup: false,
				orderId: '',
				buttonType: '',
				logList: [],
				logShowPopup: false,
				mescrollTop: 74,
				serviceAgreementPopupStatus: false,
				orderDetails: '',
			}
		},
		onLoad() {
			// #ifdef APP-PLUS
			if (uni.getSystemInfoSync().platform == "android") {
				this.mescrollTop = 94
			}
			// #endif
			// #ifdef H5
			this.mescrollTop = 164
			// #endif
		},
		onShow() {
			if (!uni.getStorageSync('userInfo')) {
				// #ifdef APP-PLUS
				uni.navigateTo({
					url: '/pages/univerifyLogin/univerifyLogin'
				});
				// #endif
				// #ifdef H5
				uni.navigateTo({
					url: '/pages/user/login'
				});
				// #endif
				return;
			}
			let device = uni.getSystemInfoSync().platform;
			let locationPermission = uni.getStorageSync('位置')
			if (locationPermission === undefined || locationPermission === '') {
				locationPermission = true
			}
			this.hasLocationPermisson = locationPermission
			this.downCallback()
		},
		onUnload() {},
		onReachBottom() {
			// this.getRefresh()
		},
		methods: {
			getToDo() {
				this.toPage('/pages/toDoList/toDoListPage')
			},
			getToCalendar() {
				this.toPage('/pages/toDoList/calendarPage')
			},
			getPopupClose() {
				this.logShowPopup = false
				// #ifdef APP-PLUS
				uni.showTabBar({
					animation: true
				})
				// #endif
			},
			getLog(item) {
				// #ifdef APP-PLUS
				uni.hideTabBar({
					animation: true
				})
				// #endif

				if (!item.orderId) {
					return
				}
				this.$httpApi.getOrderLogByOrderId({
					orderId: item.orderId,
					// userId: uni.getStorageSync('userData').sysUser.userId
				}).then(res => {
					if (res) {
						this.logList = res
						this.logShowPopup = true
					}
				})
			},
			setLog(item) {
				return this.$getLogTypeName(item.type)
			},
			setLogTitleName(item) {
				if (!item.type) {
					return
				}
				let tempName
				switch (item.type) {
					case 'assign':
						tempName = '已指派'
						break
					case 'change':
						tempName = '已变更'
						break
					case 'change_pay':
						tempName = '变更支付'
						break
					case 'no_order_offer':
						tempName = '工人未报价'
						break
					case 'no_confirm_order_offer':
						tempName = '业主未确认报价'
						break
					case 'no_risk_order_offer':
						tempName = '业主确认报价,未确认风险'
						break
					case 'no_pay_order_offer':
						tempName = '业主确认报价,未付款'
						break
					case 'no_again_order_offer':
						tempName = '业主不确认报价，价格不合理，重新商讨'
						break
					case 'modify_order_offer':
						tempName = '修改报价'
						break
					case 'cancel_order_offer':
						tempName = '取消报价'
						break
					case 'submit_acceptance':
						tempName = '工人提交验收'
						break
					case 'confirm_acceptance':
						tempName = '业主确认验收'
						break
					case 'c_reply':
						tempName = '业主评价'
						break
					default:
						break
				}
				return tempName
			},
			getRefresh() {
				if (this.orderList.length === Number(this.total)) {
					this.status = 'nomore'
					return
				} else {
					this.status = 'loading'
					setTimeout(() => {
						if (this.titleIndex == 1) {
							this.releaseCurrent += 1
							this.getOrderData()
						} else {
							this.serviceCurrent += 1
							this.getOrderData2()
						}
					}, 200)
				}
			},
			// mescroll组件init
			mescrollInit(mescroll) {
				this.mescroll = mescroll
			},
			// 下拉时重新刷新
			downCallback() {
				// #ifdef APP-PLUS
				this.serviceCurrent = 1
				this.getAddress()
				// #endif
				// #ifdef H5
				// this.serviceCurrent = 1
				this.getList(this.titleIndex)
				// #endif
				// 停止重载动画
				setTimeout(() => {
					this.mescroll && this.mescroll.endBySize(10, true)
				}, 1000)
			},
			scrollToLower() {
				if (this.orderList.length === Number(this.total)) {
					this.status = 'nomore'
					return
				} else {
					this.status = 'loading'
					setTimeout(() => {
						if (this.titleIndex == 1) {
							this.releaseCurrent += 1
							this.getOrderData()
						} else {
							this.serviceCurrent += 1
							this.getOrderData2()
						}

					}, 200)
				}
			},
			upCallback() {},
			getAddress() {
				uni.getLocation({
					type: 'gcj02',
					geocode: true,
					success: (res) => {
						if (res) {
							this.latitude = res.latitude
							this.longitude = res.longitude
						}
					},
					fail: (error) => {},
					complete: (end) => {
						this.getList(this.titleIndex)
					}
				})
			},
			getList(index) {
				this.titleIndex = index
				this.pageSize = 10
				// this.currentNew = 0
				// this.orderStatus = ''
				if (index === 1) {
					this.orderStatusList = this.orderRelease
					this.getOrderData()
				} else {
					this.orderStatusList = this.orderService
					this.getOrderData2()
				}
			},
			changeTitle(e) {
				this.titleIndex = e.currentIndex
				this.pageSize = 10
				this.currentNew = 0
				this.orderList = []
				this.orderStatus = ''
				if (e.currentIndex === 1) {
					// 我发布的
					this.releaseCurrent = 1
					this.orderStatusList = this.orderRelease
					this.getOrderData()
				} else {
					// 我服务的
					this.serviceCurrent = 1
					this.orderStatusList = this.orderService
					this.getOrderData2()
				}
			},
			// 获取我服务的订单
			getOrderData2() {
				this.$httpApi.getMyReceivedOrder({
					current: this.serviceCurrent,
					size: this.pageSize,
					latitude: this.latitude,
					longitude: this.longitude,
					orderStatus: this.orderStatus
				}).then((res) => {
					if (!res) {
						return
					}
					// uni.hideLoading()
					this.total = res.total
					this.pages = res.pages
					res.records.map((item) => {
						item['resultDistance'] = getDistance(item.distance)
						item.distance = this.conversionUnit(item)
					})
					if (this.serviceCurrent > 1) {
						if (this.serviceCurrent !== this.contrast) {
							this.orderList = [...this.orderList, ...res.records]
							this.contrast = this.serviceCurrent
						} else {}
					} else {
						this.orderList = res.records
						this.contrast = this.serviceCurrent
					}
					if (this.orderList.length === Number(this.total)) {
						this.status = 'nomore'
					}
					if (this.total == 0) {
						this.status = 'nomore'
					}
				})
			},
			// 获取我发布的订单
			getOrderData() {
				this.$httpApi.getMyPublishedOrder({
					current: this.releaseCurrent,
					size: this.pageSize,
					latitude: this.latitude,
					longitude: this.longitude,
					orderStatus: this.orderStatus
				}).then((res) => {
					// uni.hideLoading()
					this.total = res.total
					this.pages = res.pages
					res.records.map((item) => {
						item.distance = this.conversionUnit(item)
						
					})
					if (this.releaseCurrent > 1) {
						if (this.releaseCurrent !== this.contrast) {
							this.orderList = this.orderList.concat(res.records)
							this.contrast = this.releaseCurrent
						}
					} else {
						this.orderList = res.records
						this.contrast = this.releaseCurrent
					}
					if (this.orderList.length === Number(this.total)) {
						this.status = 'nomore'
					}
					if (this.total == 0) {
						this.status = 'nomore'
					}

				})
			},
			// 换算距离
			conversionUnit(ev) {
				let tempDistance
				if (Number(ev.distance) > 1000) {
					return tempDistance = '距您' + (Number(ev.distance) / 1000).toFixed(2) + 'km'
				} else {
					if (Number(ev.distance) < 20) {
						return '目的地在您附近'
					} else {
						return tempDistance = '距您' + Number(ev.distance).toFixed(2) + '米'
					}
				}
			},
			clickOrderStatus(index) {
				this.currentNew = index
				this.orderStatus = this.orderStatusList[index].value
				this.orderList = []
				this.current = 1
				if (this.titleIndex === 1) {
					// 我发布的
					this.releaseCurrent = 1
					this.getOrderData()
				} else {
					// 我服务的
					this.serviceCurrent = 1
					this.getOrderData2()
				}
			},
			getButton(item) {
				this.orderDetails = item.orderData
				this.orderId = item.orderData.id
				this.buttonType = item.typeName
				switch (item.typeName) {
					case '拒绝接单':
						this.showPopup = !this.showPopup

						// #ifdef APP-PLUS
						uni.hideTabBar({
							animation: true
						})
						// #endif

						this.$http.get("admin/dict/type", {
							type: 'reasons_for_refusal',
							cityOperatorId: item.orderData.cityOperatorId
						}).then(res => {
							if (res) {
								if (res.length > 0) {
									this.reasonList = res
									this.replaceReason = this.reasonList[this.curIndex].label
								}
							}
						})
						break
					case '立即接单':
						this.$httpApi.getUserInfo().then(res => {
							if (res) {
								if (res.sysUser.userauthFlag == 0 && item.orderData.assignType !== 1) {
									this.$util.toast('完成实名认证才能接单')
								} else {
									// 如果是找项目管家、监理、的单子，则不需要弹服务协议
									if (['管家', '项目管家', '项目经理', '监理', '项目监理'].includes(item.orderData.skillName)) {
										this.modalShow = !this.modalShow
										// #ifdef APP-PLUS
										uni.hideTabBar({
											animation: true
										})
										// #endif
										return
									}
									// #ifdef APP-PLUS
									uni.hideTabBar({
										animation: true
									})
									// #endif
									this.$serviceInfo(item.orderData, (res) => {
										this.serviceInfo = res
										this.serviceType = item.orderData.skillName
										this.serviceAgreementPopupStatus = !this
											.serviceAgreementPopupStatus
									})
								}
							}
						})
						break
					case '提交验收':
						// 1.如果是子订单提交验收，则需要查询到组合报价获取到商品id
						// 2.如果是普通的则走正常提交
						if (item.orderData.beforeOrderId) {
							this.$httpApi.getOrderById(item.orderData.id).then(res => {
								if (!res) {
									return
								}
								// 子订单提交验收时需要传服务id，项目经理验收时需要根据服务id查询验收标准
								let tempGroupPrices = JSON.parse(JSON.stringify(res.groupPrices))
								tempGroupPrices.map(item => {
									item.productJson = item.productJson !== '' && JSON.parse(item
										.productJson)
								})
								let tempProductIds = []
								tempGroupPrices.forEach(item => {
									item.productJson.forEach(el => {
										tempProductIds.push(el.id)
									})
								})
								let parameter = {
									id: res.id,
									skillId: res.skillId,
									skillName: res.skillName,
									userName: res.userName,
									personId: res.bizOrderOffer && res.bizOrderOffer.personId,
									productIds: tempProductIds.join(',')
								}
								uni.navigateTo({
									url: `/pages/orderReceiving/acceptance/addAcceptance`,
									success(res) {
										res.eventChannel.emit('addAcceptanceParameter', parameter);
									}
								})
							})
						} else {
							this.toPage(
								`/pages/orderReceiving/addAcceptance?skillId=${item.orderData.skillId}&id=${this.orderId}`
							)
						}
						break
					case '开始服务':
						uni.navigateTo({
							url: '/pages/orderReceiving/constructionForm',
							success(res) {
								res.eventChannel.emit('orderDetails', {
									orderDetails: item.orderData,
									title: '开始服务',
									type: '订单列表'
								});
							}
						})
						break
					case '联系客户':
						if (item.orderData.contactPhone) {
							uni.makePhoneCall({
								phoneNumber: item.orderData.contactPhone
							})
						} else {
							this.$util.toast('用户不支持拨打电话~')
						}
						break
					case '联系客服':
						this.$util.goToWeixin()
						// this.toPage(
						// 	`/pages/message/group/index?toUserId=${uni.getStorageSync('cityOperatorId')}&type=constructionOrder&orderId=${item.orderData.id}`
						// )
						break
				}
			},
			radioValue(data, index) {
				this.replaceReason = data.label;
				this.curIndex = index;
			},
			getServiceClose() {
				this.serviceAgreementPopupStatus = !this.serviceAgreementPopupStatus
				// #ifdef APP-PLUS
				uni.showTabBar({
					animation: true
				})
				// #endif
			},
			confirm() {
				if (this.buttonType !== '拒绝接单') {
					if (this.orderDetails.skillName.includes('管家') || this.orderDetails.skillName
						.includes('监理')) {
						this.modalShow = !this.modalShow
					} else {
						this.getServiceClose()
					}
					this.$httpApi.setAccept({
						orderId: this.orderId
					}).then(res => {
						if (res) {
							this.getList(this.titleIndex)
							this.$util.toast('操作成功')
						}
					})
				}
			},
			cancel() {
				this.modalShow = !this.modalShow
				// #ifdef APP-PLUS
				uni.showTabBar({
					animation: true
				})
				// #endif
			},
			clearCur() {
				// #ifdef APP-PLUS
				uni.showTabBar({
					animation: true
				})
				// #endif
			},
			cancelReason() {
				this.reloadDataList()
			},
			confirmSubmit() {
				this.$httpApi.setReject({
					orderId: this.orderId,
					reason: this.replaceReason,
				}).then(res => {
					if (res) {
						this.showPopup = !this.showPopup
						// #ifdef APP-PLUS
						uni.showTabBar({
							animation: true
						})
						// #endif
						this.getList(this.titleIndex)
						this.$util.toast('操作成功')
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.u-modal-new {
		z-index: 3000;
	}

	.item-calendar {
		position: fixed;
		bottom: 164rpx;
		right: 56rpx;
		width: 84rpx;
		height: 84rpx;
		z-index: 10;
		border-radius: 50%;
		background-color: #002FA5;
		display: flex;
		justify-content: center;
		align-items: center;

		image {
			width: 36rpx;
			height: 32rpx;
		}
	}

	.new-order-page {}

	.main_tabs {
		position: fixed;
		width: 100%;
		z-index: 200;
		top: 88rpx;
		background-color: #fff;
		height: 88rpx;

		display: flex;
		align-items: center;
		justify-content: center;

		.item-text {
			color: rgb(0, 47, 165);
			font-size: 32rpx;
			font-weight: bold;
		}


		.to-do {
			position: absolute;
			z-index: 10;
			top: 12rpx;
			right: 40rpx;
			display: flex;

			.item-text {
				color: #303133;
				font-size: 28rpx;
			}

			.item-point {
				display: flex;
				width: 12rpx;
				height: 12rpx;
				border-radius: 50%;
				background: #FF5D35;
				margin-left: 10rpx;
				margin-top: 6rpx;
			}
		}
	}

	.secondary_tabs {
		width: 100vw;
		position: fixed;
		padding-top: 88rpx;
		z-index: 2000;
		background-color: #ffffff;
	}

	.scroll-y {
		height: calc(100vh - var(--status-bar-height) - 80rpx);
	}

	.order-list {
		padding-bottom: 40rpx;
	}

	.tab-title {
		float: left;
		width: 50%;
	}

	.title-wire {
		background: linear-gradient(90deg, #002FA5 5.22%, rgba(255, 255, 255, 0) 91.79%);
		border-radius: 110rpx;
		height: 10rpx;
		width: 122rpx;
		font-weight: 700;
		font-size: 32rpx;
	}

	.title-wire2 {
		height: 10rpx;
		width: 122rpx;
		font-weight: 700;
		font-size: 32rpx;
	}

	.title-text {
		font-family: PingFang SC;
		font-style: normal;
		font-weight: 700;
		font-size: 32rpx;
		text-align: center;
		color: #002FA5;
	}

	.title-text2 {
		font-family: PingFang SC;
		font-style: normal;
		font-weight: 700;
		font-size: 32rpx;
		text-align: center;
		color: #303133;
	}

	.title-left {
		padding-right: 46rpx;
	}

	.title-right {
		padding-left: 46rpx;
	}

	.right_dcl {
		color: #ffffff;
		font-weight: 700;
		font-size: 32rpx;
		margin: 0 46rpx 12rpx 0;
	}

	.state_dot {
		position: relative;

		&:after {
			content: '';
			position: absolute;
			top: 6rpx;
			right: -14rpx;
			color: #ffffff;
			width: 12rpx;
			height: 12rpx;
			background: $errorFontColor;
			border-radius: 50%;
		}
	}

	// .main-swiper,
	// .scroll-container {
	// 	width: 100vw;
	// 	height: calc(100vh - var(--status-bar-height) - 88rpx);
	// }


	.label {
		color: #999999;
		font-size: $middleFontSize;
		text-align: center;
	}

	.complaints-contain {
		/deep/ .sku {
			background-color: #fff !important;
		}

		.content-sku {
			.content-main {
				overflow: hidden;

				.content-main_res_list {
					max-height: 380rpx;
				}

				.content-main_res {
					display: flex;
					align-items: center;
					margin-top: 52rpx;

					.radio {
						width: 36rpx;
						height: 36rpx;
						border-radius: 50%;
						border: 4rpx solid #BDBDBD;
						margin-right: 30rpx;
					}

					.radioSelect {
						border: 4rpx solid #002FA5;
						position: relative;

						&::before {
							content: '';
							position: absolute;
							width: 20rpx;
							height: 20rpx;
							border-radius: 50%;
							background: #002FA5;
							top: 50%;
							left: 50%;
							transform: translate(-50%, -50%);
						}
					}

					.reason {
						color: #141414;
						font-size: 26rpx;
					}
				}

				.item-desc-input {
					width: 100%;
					height: 208rpx;
					padding: 24rpx 26rpx;
					margin-top: 64rpx;
					background: #F7F7F7;
					border-radius: 12rpx;
					font-size: 26rpx;
				}
			}

			.item-button-contain {
				position: absolute;
				bottom: 40rpx;
				padding-left: 20rpx;

				.item-button {
					position: relative;
					width: 624rpx;
					height: 88rpx;
					text-align: center;
					line-height: 88rpx;
					color: #002FA5;
					font-size: 24rpx;
					border: 2rpx solid #002FA5;
					border-radius: 10rpx;
				}
			}
		}
	}
</style>
