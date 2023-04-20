<template>
	<!-- 订单详情 -->
	<view class="order-contain">
		<z-nav-bar type="transparent" fontColor="#FFFFFF" :backState="3000" @backClick="goBack">
			<view class="nav-bar" slot="default">订单详情</view>
		</z-nav-bar>
		<view class="order-header">
			<view class="order-information">
				<view class="order-status">{{ getOrderStatus(detail.status) }}</view>
			</view>
			<image class="image-status" src="https://www.51mihuo.com/static/images/order_details/ds.png" mode="">
			</image>
		</view>
		<mh-skeleton :loading="!detail.orderItemList" :imgTitleHeight="300" :row="15">
			<view>
				<view class="order-basic-information public-bm" v-if="detail.status !== 4 && detail.status != 7">
					<view class="basic-item">
						<view class="basic-item-contain">
							<image class="order-basic-item-image"
								src="https://www.51mihuo.com/static/images/order_details/car.png" mode="">
							</image>
							<view class="basic-contain" v-if="orderTrends.length !== 0">
								<view class="sent-address">{{ orderTrends[0].content }}</view>
								<view class="time">{{ orderTrends[0].created }}</view>
							</view>
							<view class="basic-contain" v-else>
								<view class="sent-address">
									{{ detail.status === 0 ? '暂未发货' : '处理中...' }}
								</view>
							</view>
						</view>
					</view>
					<view class="basic-item">
						<view class="basic-item-contain">
							<image class="order-basic-item-image"
								src="https://www.51mihuo.com/static/images/order_details/adders.png" mode="">
							</image>
							<view class="basic-contain">
								<view class="name-contain flex-center">
									<view class="left flex-center">
										<view class="user-info">
											{{ detail.receiverName && detail.receiverName + ' ' + detail.receiverPhone }}
										</view>
									</view>
									<view v-if="(detail.status == 1 || detail.status == 0 )&& detail.orderType !== 4"
										class="edit-address" @click="editAddres">
										修改地址
									</view>
								</view>
								<view class="address">
									{{
										(detail.receiverProvince || '') + (detail.receiverCity == detail.receiverProvince ? '' : detail.receiverCity || '') +
										(detail.receiverRegion || '') + (detail.receiverLatAddress || '') + (detail.receiverPoiName || '') + 
										(detail.receiverDetailAddress || '')
									}}
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="public-bm public-radius">
					<view class="order-top" @click="goShop(detail.company)" v-if="detail.company">
						<view class="order-code">
							<text class="order-title">{{ detail.company.companyName }}</text>
						</view>
						<view class="right-tag" v-if="detail.sourceType == 4">
							项目管家开单
						</view>
					</view>
					<view class="order-top" @click="goShop(detail.cityOperator)" v-if="detail.cityOperator">
						<view class="order-code">
							<text class="order-title">{{ detail.cityOperator.name }}</text>
						</view>
						<view class="right-tag" v-if="detail.sourceType == 4">
							项目管家开单
						</view>
					</view>
					<view class="order-item-page" v-for="(item, index) in detail.orderItemList" :key="index"
						@click="goToProductDetail(item)">
						<view class="order-middle">
							<view class="order-middle-contain">
								<view class="order-attachments-coverNew">
									<image class="order-middle-image" border-radius="10" height="176" mode="aspectFill"
										:src="$util.thumbnailImage(item.productPic, true)">
									</image>
								</view>
								<view class="order-information">
									<view class="skill-type-contain">
										<view class="skill-type-all">
											<text class="order-name">{{ item.productName }}</text>
										</view>
										<view class="order-offer">
											<text class="price-symbol">¥</text>
											<text class="price">
												{{ item.productPrice }}
											</text>
										</view>
									</view>
									<view class="order-brand-contain">
										<view class="order-brand">{{ getSkuStr(item.productAttr) }}</view>
										<view class="order-num">x{{ item.productQuantity }}</view>
									</view>
								</view>
							</view>
							<view class="order-pic-statistical-length">
								<text class="gray-value" v-if="item.totalAmount">￥{{ item.totalAmount }}</text>
								<!-- <text class="gray-value"
									v-if="item.totalPreferentialAmount">,优惠￥-{{ item.totalPreferentialAmount }},</text>
								<text v-if="item.payAmount">
									￥{{ $math.floatSub(item.payAmount, item.prePayAmount || 0) }}
								</text> -->
							</view>
							<view class="order-remark">{{ item.remark || '' }}</view>
						</view>
						<view class="order-operation-status">
							<view v-if="getRefundStatusName(item.refundStatus)">
								<view class="order-status">
									{{ getRefundStatusName(item.refundStatus) }}
								</view>
							</view>
							<view v-else-if="detail.status != 7 && getDetailStatusList(detail.status).length"
								class="order-operation-item">
								<text class="button-text" v-for="(item2, index) in getDetailStatusList(detail.status)"
									@click.stop="productItemClick(item2.name, item)" :key="index">
									{{ item2.name }}
								</text>
							</view>
						</view>
						<view v-if="item.refundStatus == 4" class="product-refund">
							<div>拒绝时间：{{item.rejectRefundTime || ''}}</div>
							<div>拒绝理由：{{item.rejectRefundReason || ''}}</div>
						</view>
					</view>
				</view>
				<view class="order-pic-statistical">
					<view class="pic-item" v-if="detail.itemTotalAmount && detail.itemTotalAmount != 0">
						<text class="item-lable">商品总价</text>
						<text class="item-value price-symbol">{{ detail.itemTotalAmount }}</text>
					</view>
					<view class="pic-item" v-if="detail.diffAmount && detail.diffAmount != 0">
						<text class="item-lable">补齐费用</text>
						<text class="item-value">￥{{ detail.diffAmount }}</text>
					</view>
					<view class="pic-item" v-if="detail.freightAmount && detail.freightAmount != 0">
						<text class="item-lable">运费</text>
						<text class="item-value">￥{{ detail.freightAmount }}</text>
					</view>
					<view class="pic-item"
						v-if="detail.freightInstallationAmount && detail.freightInstallationAmount != 0">
						<text class="item-lable">安装费</text>
						<text class="item-value">￥{{ detail.freightInstallationAmount }}</text>
					</view>
					<view class="pic-item" v-if="detail.freightStairwayAmount && detail.freightStairwayAmount != 0">
						<text class="item-lable">上楼费</text>
						<text class="item-value">￥{{ detail.freightStairwayAmount }}</text>
					</view>
					<view class="pic-item" v-if="detail.totalAmount && detail.totalAmount != 0">
						<text class="item-lable">总计金额</text>
						<text class="item-value price-symbol">{{ detail.totalAmount }}</text>
					</view>
					<view class="pic-item" v-if="detail.promotionAmount && detail.promotionAmount != 0">
						<text class="item-lable">优惠</text>
						<text class="item-value promotion">
							{{ detail.promotionAmount }}
						</text>
					</view>
					<view class="pic-item" v-if="detail.couponAmount && detail.couponAmount != 0">
						<text class="item-lable">优惠券</text>
						<text class="item-value promotion">
							{{ detail.couponAmount }}
						</text>
					</view>
					<view class="pic-item" v-if="detail.prePayAmount && detail.prePayAmount != 0">
						<text class="item-lable">预付款抵扣金额</text>
						<text class="item-value promotion">{{ detail.prePayAmount || 0 }}</text>
					</view>
					<view class="pic-item" v-if="detail.discountAmount && detail.discountAmount != 0">
						<text class="item-lable">后台优惠金额</text>
						<text class="item-value promotion">{{ detail.discountAmount || 0 }}</text>
					</view>
					<view class="pic-item">
						<text class="item-lable">
							应付金额
						</text>
						<text class="item-value actual price-symbol">
							{{ detail.payAmount }}
						</text>
					</view>
					<view class="pic-item" v-if="detail.status != 0 && detail.status != 7">
						<text class="item-lable">
							实付金额
						</text>
						<text class="item-value actual price-symbol">
							<!-- 显示分期已支付的金额 -->
							{{ getActuallyPayAmount }}
						</text>
					</view>
				</view>
				<view class="order-pay-stages public-bm flex-center" v-if="detail.payStages && detail.payStages.length">
					<order-mh-pay-stages :dataList="detail.payStages" :show-button="false" type="2">
					</order-mh-pay-stages>
				</view>
				<view class="order-information-detalis public-bm public-radius">
					<view class="detalis-header"> 订单信息 </view>
					<view class="detalis-middle">
						<view class="details-item" v-if="detail.orderSn">
							<text class="details-item-lable">订单编号：</text>
							<text class="details-item-value">{{ detail.orderSn }}</text>
						</view>
						<view class="details-item" v-if="detail.createTime">
							<text class="details-item-lable">下单时间：</text>
							<text class="details-item-value">{{ detail.createTime }}</text>
						</view>
						<view class="details-item" v-if="detail.paymentTime">
							<text class="details-item-lable">付款时间：</text>
							<text class="details-item-value">{{ detail.paymentTime }}</text>
						</view>
						<view class="details-item" v-if="detail.deliveryTime">
							<text class="details-item-lable">发货时间：</text>
							<text class="details-item-value">{{ detail.deliveryTime }}</text>
						</view>
						<image class="order-copy" src="https://www.51mihuo.com/static/images/order_details/cp.png"
							mode="" @click="getCopy">
						</image>
					</view>
					<!-- 服务协议 -->
					<view class="service-contain">
						<view class="item-service" v-if="detail.orderType == 2 && detail.status == 0">
							<view class="item-contian">
								<view class="check-contain">
									<u-checkbox v-model="agreement" shape="circle" size="30">
									</u-checkbox>
									<text class="item-name" @click="()=>agreement = !agreement">我已阅读并同意 </text>
									<text class="item-bock" v-if="detail.skillId"
										@click="lookAgreement">《{{agreementObj.name}}》</text>
								</view>
								<view class="item-text-contain">
									<view class="item-title">【协议概述】</view>
									<view class="item-form">
										<text class="item-label">甲方：</text>
										<text
											class="item-value">{{ curUser.realName || curUser.nickName  }}&nbsp;{{curUser.phone || ""}}</text>
									</view>
									<view class="item-form">
										<text class="item-label">乙方：</text>
										<text
											class="item-value">{{ detail.createServer.userName || "" }}&nbsp;{{detail.createServer.phone || ""}}</text>
									</view>
									<view class="item-form">
										<text class="item-label">工程详细地址：</text>
										<text class="item-value item-address">{{
										(detail.receiverProvince || '') + (detail.receiverCity==detail.receiverProvince?'':detail.receiverCity || '') +
										(detail.receiverRegion || '') + (detail.receiverLatAddress || '') + (detail.receiverPoiName || '') + 
										(detail.receiverDetailAddress || '')
										}}</text>
									</view>
									<view class="item-form">
										<text class="item-label">委托任务内容：</text>
										<text
											class="item-value item-context">{{ getEntrustContent(detail.orderItemList)}}</text>
									</view>
									<view class="item-form">
										<text class="item-label">项目金额：</text>
										<text class="item-value item-context">{{ detail.payAmount }}元</text>
									</view>
								</view>
							</view>
							<!-- <view class="item-mask">
								<view class="item-bottom" @click="()=>isAgreement=true">
									<text>查看完整协议</text>
								</view>
							</view> -->
						</view>
					</view>
					<view class="detalis-bottom" @click="getIm">
						<image src="https://www.51mihuo.com/static/images/order_details/lt.png" mode=""></image>
						联系卖家
					</view>
				</view>
			</view>
		</mh-skeleton>
		<!-- <view class="recommend-container">
			<view class="title">
				<image class="img" src="https://www.51mihuo.com/static/images/home/dian.png"></image>
				猜您喜欢
			</view>
			<view class="cards flex-center">
				<order-mh-commodity-card-mini></order-mh-commodity-card-mini>
				<order-mh-commodity-card-mini></order-mh-commodity-card-mini>
			</view>
		</view> -->
		<view class="order-details-bottom iphonex-bottom" v-if="getOrderStatusList(detail.status).length !== 0">
			<text class="order-bottom-item button-default" v-for="(item, index) in getOrderStatusList(detail.status)"
				:key="index" @click="orderBottom(item.name)">{{ item.name }}</text>
			<text class="button-default view-list" @click="orderBottom('查看清单')"
				v-if="detail.orderItemList[0].product.customCategory == '1003'">
				查看清单
			</text>
		</view>
		<u-action-sheet @click="confirmPayType" :list="payTypeList" v-model="isShowSheet"
			:safe-area-inset-bottom="true">
		</u-action-sheet>
		<!-- 服务协议 -->
		<mh-agreement v-if="isAgreement" v-model="isAgreement" :info="agreementInfo"></mh-agreement>
		<u-popup v-model="isShowInstallmentPopup" height="653" mode="center" border-radius="30" closeable
			@close="closeInstallmentPopup">
			<view class="installment-popup">
				<view class="title">
					<view class="main-title">
						温馨提示
					</view>
					<view class="des">
						为了保护您的资金安全，该订单将分为{{ installmentOrders.length }}笔支付。
					</view>
				</view>
				<view class="progress-content flex-center">
					<view class="left-amount">
						{{ getPaidAmount['amount'] }}元
					</view>
					<progress class="progress-bar" :percent="getPaidAmount['percent']" stroke-width="5"
						border-radius="20" :show-info="false" activeColor="#000000" backgroundColor="#E6E6E6" />
					<view class="right-amount">
						{{ detail.payAmount }}元
					</view>
				</view>
				<scroll-view class="installment-plan" scroll-y>
					<view class="installment-item flex-center" v-for="item, index in installmentOrders" :key="index">
						<view class="item-count">
							第{{ getBigNumber(index + 1) }}笔
						</view>
						<view class="item-amount" v-if="item.amount">
							<text style="font-size: 20rpx;">¥</text>
							<text style="font-size: 30rpx;">{{ Math.floor(item.amount / 100) }}</text>
							<text style="font-size: 20rpx;">{{ item.amount / 100 | priceFormat }}</text>
						</view>
						<view class="item-status unpay" v-if="item.payStatus === 'pending'"
							:style="{ backgroundImage: 'url(../static/images/unpay.png)' }">
							未支付
						</view>
						<view class="item-status paid" v-else
							:style="{ backgroundImage: 'url(../static/images/paid.png)' }">
							已支付
						</view>
						<view class="item-time" v-if="item.payTime">
							{{ item.payTime.split('-')[1] + '-' + item.payTime.split('-')[2] }}
						</view>
						<view class="item-button" v-else @click="payInstallmentItem(item)">
							去支付
						</view>
					</view>
				</scroll-view>
				<view class="flex-center buttom-button">
					<view class="refund-button" @click="refundInstallmentOrder">
						退款
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		copy
	} from '@/plugins/utils.js'
	import {
		getMallStatusName
	} from '@/plugins/orderStatus.js'
	import moment from '@/static/js/moment.js'
	export default {
		data() {
			return {
				curUser: uni.getStorageSync('userData').sysUser,
				isShowSheet: false,
				payTypeList: [{
					text: '支付宝支付',
				}, {
					text: '微信小程序支付'
				}],
				isPay: false, // 是否发起过支付
				isService: false, // 是否是服务订单
				orderTrends: [], // 订单动态
				option: {},
				detail: {},
				orderId: '',
				orderItemListLength: 0,
				// 订单商品项目的按钮
				detailStatusList: [{
						name: '申请退款',
						statusList: [1, 2, 3, 4, 5, 6]
					},
					{
						name: '再次购买',
						statusList: [7]
					},
				],
				// 整个订单的按钮
				orderStatusList: [{
						name: '服务评价',
						statusList: [4, 5]
					},
					{
						name: '查看进度',
						statusList: [2, 3, 4, 5]
					},
					{
						name: '查看变更',
						statusList: [2, 3]
					},
					{
						name: '联系客服',
						statusList: [2, 3, 4, 5, 8]
					},
					{
						name: '取消订单',
						statusList: [0]
					},
					{
						name: '立即付款',
						statusList: [0]
					},
					{
						name: '查看退款',
						statusList: [8]
					},
					{
						name: '删除订单',
						statusList: [7]
					},
					{
						name: '再次购买',
						statusList: [7]
					},
				],
				agreementObj: {
					name: "服务协议",
					jobCode: ""
				},
				agreementInfo: {},
				agreement: true,
				isAgreement: false,
				isPay: false,
				isRefresh: false,
				isShowInstallmentPopup: false, // 是否显示分期付款弹窗
				installmentOrders: [], // 拆分订单信息
				payOrderNo: '', // 支付订单号
				payOrderInfo: {}, // 支付订单信息
				isSplit: false, // 分段支付账单
			}
		},
		onLoad(option) {
			this.option = option
			if (option.noticeId) {
				this.$util.readNotice(option.noticeId)
			}
			if (option.scene) {
				this.option.id = option.scene
			}
			this.getOrderDetails(false, 'onLoad')
		},
		onShow() {
			this.getOrderDetails()
			if (this.isShowInstallmentPopup) {
				// 当有拆分付款订单时，查询拆分订单付款状态
				this.getPayInstallmentOrder()
			}
		},
		computed: {
			// 实付金额
			getActuallyPayAmount() {
				if (this.detail.payStagesEnable === 1) {
					// 分期实付金额
					return this.detail.payStages.filter(item => item.payStatus === 'success').reduce((pre, cur) => {
						return this.$math.floatAdd(pre, cur.payAmount)
					}, 0)
				} else {
					return this.$math.floatSub(this.detail.payAmount, (this.detail.prePayAmount || 0))
				}
			},
			getPaidAmount() {
				const result = {
					amount: 0,
					percent: 0
				}
				if (!this.installmentOrders.length) return result
				const arr = this.installmentOrders.filter(item => item.payStatus === 'success')
				if (!arr.length) return result
				result.amount = arr.reduce((pre, cur) => {
					return Number(pre) + Number(cur.amount || 0)
				}, 0) / 100
				result.percent = (result.amount / this.detail.payAmount) * 100
				return result
			},
		},
		methods: {
			// 分段支付订单退款
			refundInstallmentOrder() {
				this.$httpApi.refundInstallmentOrder({
					payOrderNo: this.detail.payOrderNo
				}).then(res => {
					this.closeInstallmentPopup()
				})
			},
			getBigNumber(number) {
				return this.$util.getBigNumber(number)
			},
			// 跳转到商品详情页
			goToProductDetail(item) {
				if (this.detail.orderType === 4) {
					return
				}
				this.toPage(`/pages-mall/productDetail/productDetail?id=${item.productId}`)
			},
			goBack() {
				uni.navigateBack();
				if (this.isRefresh) uni.$emit('refresh');
			},
			// 修改收货地址 订单状态为1 待发货(待服务)
			editAddres() {
				uni.$once('roomAddress', data => {
					if (data.id) {
						this.$httpApi.changeOrderAddress({
							orderId: this.detail.id,
							addressId: data.id
						}).then(response => {
							if (response) {
								this.getOrderDetails()
							}
						})
					}
				})
				this.toPage(`/pages-common/addressList/addressList?isShow=${true}&lastPage=order`)
			},
			getRefundStatusName(status) {
				switch (status) {
					case 0:
						return ''
					case 1:
						return '已申请退款'
					case 2:
						return '退款已审核/待退款'
					case 3:
						return '已退款'
					case 4:
						return '已拒绝退款'
					default:
						return ''
				}
			},
			// sku信息
			getSkuStr(productAttr) {
				let sku = JSON.parse(productAttr);
				let skuStr = '';
				if (!sku) return skuStr
				sku.forEach((each, index) => {
					skuStr += `${each.value}${index == sku.length - 1 ? '' : '/'}`
				})
				return skuStr;
			},
			confirmPayType(e) {
				let payType = 0
				if (e === 0) {
					payType = 4
				} else if (e === 1) {
					payType = 3
				}
				this.applyPay(payType)
			},
			// 获取拆分支付订单
			getPayInstallmentOrder() {
				this.$httpApi.getInstallmentPaymentOrder({
					payOrderNo: this.payOrderNo
				}).then(res => {
					let isFinished = false
					for (const item of res) {
						if (item.payStatus === 'success') {
							isFinished = true
						} else {
							isFinished = false
						}
					}
					this.installmentOrders = res
					if (isFinished) {
						setTimeout(() => {
							// 延时一下看起来更美观
							this.closeInstallmentPopup()
						}, 1000)
					}
				})
			},
			// 关闭支付拆分单的弹窗
			closeInstallmentPopup() {
				this.getOrderDetails()
				this.isShowInstallmentPopup = false
			},
			// 支付拆分单
			payInstallmentItem(item) {
				if (item.payStatus !== 'pending') return
				// #ifdef APP-PLUS || H5
				const data = {
					payMethod: this.detail.payType,
					payOrderNo: item.bizOrderNo
				}
				this.$httpApi.confirmPayInstallmentOrder(data).then(payRes => {
					if (payRes.payInfo) {
						// isPay为true但不代表支付成功了，只是发起了支付
						this.isPay = true
						this.$util.requestPay(this.detail.payType, payRes.payInfo, 'mallOrder', () => {
							this.getPayInstallmentOrder()
						})
					}
				})
				// #endif
				// #ifdef MP-WEIXIN
				uni.showLoading()
				uni.login({
					success: (res) => {
						const data = {
							clientId: 'cmini',
							code: res.code,
							payOrderNo: item.bizOrderNo,
							payMethod: 3
						}
						var that = this
						this.$httpApi.confirmPayInstallmentOrder(data).then(payRes => {
							const data = JSON.parse(payRes.payInfo);
							uni.requestPayment({
								provider: 'wxpay',
								timeStamp: String(data.timeStamp),
								nonceStr: data.nonceStr,
								package: data.package,
								signType: data.signType,
								paySign: data.paySign,
								success: function(res) {
									// 支付成功
									uni.hideLoading()
									that.getPayInstallmentOrder()
								},
								fail: function(err) {
									that.getPayInstallmentOrder()
									console.log('fail:' + JSON.stringify(err));
								}
							});
						})
					}
				})
				// #endif
			},
			async applyPay(payType) {
				if (payType == 4) {
					// 支付宝支付
					const payRes = await this.$httpApi.payOrder({
						orderIds: [this.detail.id],
						payMethod: payType
					})
					if (payRes.splitFlag) {
						// 金额大于五万时 拆分支付订单
						// 已废弃
						return
						this.payOrderNo = payRes.payOrderNo
						this.installmentOrders = []
						this.getPayInstallmentOrder()
						this.isShowInstallmentPopup = true
					} else if (payRes.payStatus === 'SUCCESS') {
						// 金额为0的直接支付成功
						this.getOrderDetails(true)
					} else if (payRes.payInfo) {
						// isPay为true但不代表支付成功了，只是发起了支付
						this.isPay = true
						this.$util.requestPay(payType, {
							orderId: payRes.payInfo
						}, 'mallOrder', () => {
							this.getOrderDetails(true)
						})
					}
				} else {
					uni.$once('splitPayOrder', data => {
						if (data) {
							this.payOrderNo = data
							this.getPayInstallmentOrder()
							this.isShowInstallmentPopup = true
						}
					})
					this.$util.requestPay(payType, {
						orderId: {
							orderIds: [this.detail.id]
						}
					}, 'mallOrder', () => {
						this.getOrderDetails(true)
					})
				}
			},
			getCopy() {
				copy(this.detail.orderSn, '复制成功')
			},
			getOrderDetails(flag, type = '') {
				this.isRefresh = false
				this.$httpApi.getMallOrderDetailById(this.option.id).then((response) => {
					if (response) {
						let res
						if (response.length === 1) {
							res = response[0]
						}
						this.detail = res
						if (res.paySplitFlag == 1) {
							// 分段支付账单
							// 已废弃
							return
							this.isSplit = true
							this.payOrderNo = res.payOrderNo
							this.getPayInstallmentOrder()
						}
						// 订单类型：0=商品订单 1=服务订单 2-协作订单
						this.isService = this.detail.orderType != 0
						this.orderTrends = res.trends
						this.orderItemListLength = res.orderItemList.length
						/** 以下操作为适配协议组件字段 */
						// this.agreementObj.personName = res.createServer && res.createServer.userName
						// this.agreementObj.phone = res.createServer && res.createServer.phone
						// this.agreementObj.bidPrice = res.payAmount
						if (type === 'onLoad') {
							if (this.option.type == 'pay') {
								this.orderBottom('立即付款')
							}
							if (this.option.type == 'refund') {
								this.orderBottom('取消订单')
							}
							if ([1, 2, 3].includes(res.orderType)) {
								// 服务订单 协作订单 套餐订单 查询协议内容
								this.getAgreementName(res.skillId)
							}
						}
						if (flag) this.isRefresh = true;
					} else {
						this.$util.toast('订单不存在或已被删除，即将返回上一页');
						setTimeout(() => {
							uni.navigateBack()
						}, 1000)
					}
				})
			},
			// 点击商品项目的按钮
			productItemClick(name, productItem) {
				switch (name) {
					case '再次购买':
						this.toPage(`/pages-mall/productDetail/productDetail?id=${productItem.product.id}`)
						break
					case '申请退款':
						this.toPage(
							`/pages-order/applyRefund?id=${this.detail.id}&orderSn=${this.detail.orderSn}&itemId=${productItem.id}`
						)
						break
					default:
						break
				}
			},
			getOrderStatusList(status) {
				// 0=待付款；1=待发货；2=已发货；3=待验收 4=交易成功/待评价；5=待售后，6=售后完成，7=已关闭；8=退款；9=无效订单
				if (status === 4 && this.detail.replyStatus === 2) {
					// 如果已经评价过就跳转显示为查看评价
					this.orderStatusList.map((e) => {
						if (e.name === '服务评价' && e.statusList.indexOf(4) !== -1) {
							e.name = '查看评价'
						}
					})
				}
				let result = this.orderStatusList.filter(
					(item) => item.statusList.indexOf(status) !== -1
				)
				if (!this.isService) {
					// 材料订单不显示查看变更和查看进度
					result = result.filter((item) => {
						if (item.name != '查看变更' && item.name != '查看进度') {
							return item
						}
					})
				}
				if (this.detail.projectId) {
					result = result.filter((item) => {
						if (item.name != '查看变更') {
							return item
						}
					})
				}
				if (this.detail.payStages) {
					// 分期支付的订单显示立即付款按钮
					const find = this.detail.payStages.find(item => item.finalType === 1)
					if (find && find.payStatus !== 'success') {
						// 如果尾款阶段payStatus !== 'suceess', 显示支付按钮
						if (this.detail.status < 7 && this.detail
							.status != 0) {
							result.push({
								name: '立即付款',
								statusList: [0]
							})
						}
					}
				}
				return result
			},
			getDetailStatusList(status) {
				// 预付款订单隐藏操作入口
				if (this.detail.orderType === 4) return []
				if (this.detail.orderItemList.length == 1) {
					return this.detailStatusList.filter(item => {
						return item.statusList.indexOf(status) !== -1 && item.name != '再次购买'
					})
				} else {
					return this.detailStatusList.filter(
						(item) => item.statusList.indexOf(status) !== -1
					)
				}
			},
			// 点击页面底部按钮
			orderBottom(val) {
				let projectId = this.detail.projectId || '';
				switch (val) {
					case '查看清单':
						this.toPage(
							`/pages-mall/productDetail/productPackage?id=${this.detail.orderItemList[0].product.id}`)
						break
					case '删除订单':
						uni.showModal({
							title: "确认操作",
							content: "确认删除该订单？",
							cancelText: "取消",
							confirmText: "确认",
							confirmColor: "#FE6E32",
							success: (res) => {
								if (res.confirm) {
									this.$httpApi.deleteMallOrder(this.detail.id).then(response => {
										if (response) {
											uni.$emit('shouldUpdateList', '')
											uni.navigateBack()
										}
									})
								}
							},
						});
						break
					case '查看进度':
						if (!this.detail.constructionOrderId) return
						if (projectId) {
							this.toPage(
								`/pages-order/orderProgress?orderId=${this.detail.constructionOrderId}&projectId=${projectId}&optionList=${JSON.stringify(this.option)}`
							);
						} else {
							this.toPage(`/pages-order/callOrderDetails?id=${this.detail.constructionOrderId}`);
						}
						break
					case '查看变更':
						if (!this.detail.constructionOrderId) return
						if (projectId && projectId > 0) {
							this.toPage(`/pages-findMaster/changeItemList?projectId=${projectId}`)
						} else {
							this.toPage(`/pages-findMaster/changeItemList?orderId=${this.detail.constructionOrderId}`);
						}
						break
					case '查看退款':
						this.toPage(`/pages-order/refundDetails?id=${this.detail.id}`)
						break
					case '联系客服':
						this.$util.goToWeixin();
						//this.getIm()
						break
					case '取消订单':
						this.$httpApi.cancelMallOrder(this.detail.id).then(res => {
							this.getOrderDetails(true)
							uni.showToast({
								title: '取消成功',
								icon: 'none'
							});
						})
						break
					case '立即付款':
						if (!this.agreement) {
							this.$util.toast('请先同意服务协议')
						} else {
							//  如果订单金额为0，不用选择支付方式
							if (this.detail.payAmount === 0) {
								// 默认为4 支付宝支付 这里不会跳转到支付宝
								this.applyPay(4)
								return
							}
							// #ifndef MP
							if (this.isSplit) {
								// 分段支付订单 支付过一笔以后 不允许修改支付方式
								// 已废弃
								return
								this.getPayInstallmentOrder()
								this.isShowInstallmentPopup = true
							} else {
								this.isShowSheet = true
							}
							// #endif
							// #ifdef MP-WEIXIN
							this.applyPay(3)
							// #endif
						}
						break
					case '服务评价':
						if (this.detail.replyStatus == 2) {
							this.toPage('/pages-mine/myEvaluation')
						} else {
							this.toPage(
								`/pages-mine/evaluation?id=${this.detail.id}&orderSn=${this.detail.orderSn}`
							)
						}
						break
					case '查看评价':
						this.toPage('/pages-mine/myEvaluation?type=2')
						break
					case '再次购买':
						this.toPage(`/pages-mall/productDetail/productDetail?id=${this.detail.orderItemList[0].productId}`)
						break
					case '确认收货':
						this.$httpApi.confirmReceiveOrder(orderId).then(res => {
							if (res) {
								this.$util.toast('收货成功')
								this.getOrderDetails()
							}
						})
						break
				}
			},
			// 获取协议名字
			async getAgreementName(skillId) {
				if (!skillId) return
				let res = await this.$httpApi.getPlatformSkills({
					type: '',
					clientType: 'platform'
				})
				if (res && res.length) {
					let item = res.find((item) => item.skillId == skillId);
					if (item.jobCode == "JOB_MANAGER") {
						this.agreementObj.name = "管家服务协议";
						this.detail.jobCode = "JOB_MANAGER";
					}
					if (item.jobCode == "JOB_DESIGNER") {
						this.agreementObj.name = "设计服务协议";
						this.detail.jobCode = "JOB_DESIGNER";
					}
					if (item.jobCode == "JOB_SUPERVISION") {
						this.agreementObj.name = "监理服务协议";
						this.detail.jobCode = "JOB_SUPERVISION";
					}
					if (item.jobCode == "JOB_WORKER") {
						this.agreementObj.name = "服务用工协议";
						this.detail.jobCode = "JOB_WORKER";
					}
				}
			},
			// 委托内容
			getEntrustContent(data) {
				let name = "";
				if (data) {
					let info = data.map((item) => {
						return item.productName
					})
					name = info.join(",")
				}
				this.detail.requirementName = name;
				return name;
			},
			// 联系卖家
			getIm() {
				let data = this.detail
				this.$util.goToWeixin()
			},
			getOrderStatus(status) {
				return getMallStatusName(status, this.isService, this.detail.replyStatus)
			},
			// 进店逛逛
			goShop(data) {
				if (data.companyId) {
					this.toPage(`/pages-mall/shopInformation/shopInformation?companyId=${data.companyId}`)
				} else {
					const obj = {
						companyLogo: data.operatorLogo,
						companyShortName: data.name,
						completeAddress: data.address,
						contactTel: data.contactTel
					}
					this.toPage(
						`/pages-mall/shopInformation/shopInformation?cityOperatorId=${data.id}&data=${JSON.stringify(obj)}`
					)
				}
			},
			// 查看协议
			lookAgreement() {
				// this.agreementInfo = this.detail;
				let order = this.detail;
				this.agreementInfo.address = (order.receiverProvince || '') + (order.receiverCity == order
						.receiverProvince ? '' : order.receiverCity || '') +
					(order.receiverRegion || '') + (order.receiverLatAddress || '') + (order.receiverPoiName || '') +
					(order.receiverDetailAddress || '')
				this.agreementInfo.requirementName = this.getEntrustContent(order.orderItemList);
				this.agreementInfo.bName = order?.createServer.userName;
				this.agreementInfo.bPhone = order?.createServer.phone;
				this.agreementInfo.name = this.curUser.realName || this.curUser.nickName;
				this.agreementInfo.phone = this.curUser.phone;
				this.agreementInfo.amount = order?.totalAmount;
				this.agreementInfo.created = order?.createTime;
				this.agreementInfo.bidCreated = moment(new Date()).format("YYYY-MM-DD");
				this.agreementInfo.jobCode = order.jobCode;
				this.isAgreement = true;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.public-bm {
		background-color: #ffffff;
		margin: 0 20rpx 14rpx 20rpx;
	}

	.public-radius {
		border-radius: 10rpx;
	}

	.order-contain {
		padding-bottom: 182rpx;

		.nav-bar {
			color: #ffffff;
			font-weight: 700;
		}

		.order-header {
			background: linear-gradient(90deg, #ff9a52 0%, #ff6a32 100%);
			display: flex;
			padding: calc(var(--status-bar-height) + 120rpx) 60rpx 120rpx 40rpx;
			justify-content: space-between;

			.order-information {
				display: flex;
				flex-direction: column;

				.order-status,
				.order-describe {
					color: #ffffff;
					font-weight: bold;
				}

				.order-status {
					font-size: 40rpx;
				}

				.order-describe {
					font-size: 28rpx;
				}
			}

			.image-status {
				width: 130rpx;
				height: 106rpx;
			}
		}

		.order-basic-information {
			min-height: 280rpx;
			border-radius: 15px 15px 5px 5px;
			margin-top: -100rpx;
			padding: 0rpx 30rpx 0 30rpx;

			.basic-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 2rpx solid #f3f3f3;
				padding: 26rpx 0 26rpx 0;

				&:last-child {
					border-bottom: 0px;
				}

				.basic-item-contain {
					display: flex;
					align-items: center;
				}

				.order-basic-item-image {
					width: 64rpx;
					height: 64rpx;
					margin-right: 28rpx;
				}

				.basic-contain {
					width: 550rpx;

					.sent-address {
						font-weight: bold;
						font-size: 32rpx;
						line-height: 44rpx;
						color: #ff5d35;
						@include bov(2);
					}

					.time {
						font-weight: bold;
						font-size: 28rpx;
						line-height: 40rpx;
						color: #999999;
					}

					.name-contain {
						width: 100%;
						height: 44rpx;
						justify-content: space-between;

						.left {
							.user-info {
								width: max-content;
								height: 44rpx;
								max-width: 400rpx;
								font-weight: bold;
								font-size: 32rpx;
								line-height: 44rpx;
								color: #303133;
								margin-right: 20rpx;
								@include toe();
							}
						}

						.edit-address {
							width: max-content;
							height: 44rpx;
							padding: 0 10rpx;
							font-size: 24rpx;
							line-height: 40rpx;
							color: #A8A8A8;
							border: 2rpx #A8A8A8 solid;
							border-radius: 20rpx;
						}
					}

					.address {
						font-weight: bold;
						font-size: 28rpx;
						line-height: 40rpx;
						color: #999999;
						max-width: 540rpx;
						margin-top: 20rpx;
					}
				}
			}
		}

		.order-pay-stages {
			width: 690rpx;
			margin: 0 30rpx;
			padding: 0 30rpx;
		}

		.order-information-detalis {
			width: 690rpx;
			margin: 0 30rpx;
			min-height: auto;
			padding: 30rpx;

			.detalis-header {
				padding-bottom: 24rpx;
				border-bottom: 2rpx solid #eeeeee;
				font-weight: bold;
				font-size: 32rpx;
				line-height: 44rpx;
				color: #303133;
			}

			.detalis-middle {
				padding: 40rpx 0 40rpx 0;
				border-bottom: 2rpx solid #eeeeee;
				position: relative;

				.order-copy {
					position: absolute;
					width: 44rpx;
					height: 44rpx;
					top: 40rpx;
					right: 20rpx;
				}

				.details-item {
					margin-bottom: 28rpx;

					&:nth-last-child(2) {
						margin-bottom: 0;
					}

					text {
						font-weight: bold;
						font-size: 28rpx;
						line-height: 40rpx;
						color: #666666;
					}
				}
			}

			.order-agreement_item {
				view {
					font-size: 28rpx;
					margin-bottom: 10rpx;
				}
			}

			.order-agreement {
				display: flex;
				align-items: center;
				padding-bottom: 10rpx;

				.order-agreement_title {
					color: #000000;
					font-size: 32rpx;
				}

				.checkbox {
					display: block;
					margin-right: 10rpx;
				}

				text {
					color: #FE6E32;
					font-size: 32rpx;
				}
			}

			.flex-box {
				display: flex;
				align-items: flex-start;
			}

			.detalis-bottom {
				padding-top: 40rpx;
				text-align: center;
				font-weight: bold;
				font-size: 28rpx;
				line-height: 40rpx;
				color: #909199;
				display: flex;
				justify-content: center;
				align-items: center;

				image {
					display: inline-block;
					width: 54rpx;
					height: 54rpx;
					margin-right: 16rpx;
				}
			}
		}

		.recommend-container {
			height: max-content;
			background-color: #fff;
			margin: 10rpx 20rpx 0rpx 20rpx;
			padding: 20rpx;

			.title {
				width: 300rpx;
				height: 42rpx;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 30rpx;
				line-height: 42rpx;
				color: #303133;
				display: flex;
				align-items: center;

				.img {
					width: 32rpx;
					height: 24rpx;
					margin-right: 10rpx;
				}
			}

			.cards {
				display: flex;
				margin-top: 20rpx;
				justify-content: stretch;
				flex-wrap: wrap;
			}
		}
	}

	.order-pic-statistical {
		width: 690rpx;
		margin: 0rpx 30rpx;
		padding: 0 30rpx;
		padding-top: 30rpx;
		border-bottom: 2rpx dashed #f3f3f3;

		.pic-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 26rpx;

			.item-lable {
				font-weight: bold;
				font-size: 28rpx;
				line-height: 40rpx;
				color: #999999;
			}

			.item-value {
				font-size: 30rpx;
				color: #606166;
			}

			.promotion {
				color: #FE6E32;

				::before {
					content: '减 ';
					font-size: 20rpx;
				}
			}

			.price-symbol {
				::before {
					content: '¥';
					font-size: 20rpx;
				}
			}

			.actual {
				color: #ED3832;
			}
		}
	}

	.order-remark {
		font-size: 24rpx;
		color: #909199;
		padding-top: 20rpx;
	}

	.order-pic-statistical-length {
		text-align: right;

		.gray-value {
			color: #909199;
			margin-right: 8rpx;
		}

		text {
			font-size: 24rpx;
		}
	}

	.order-operation-status {
		display: flex;
		justify-content: flex-end;
		margin: 0 20rpx 0 20rpx;

		.order-status {
			width: 100%;
			text-align: right;
			color: #999999;
			margin-top: 20rpx;
			font-size: 24rpx;
		}

		.order-operation-item {
			padding: 14rpx 36rpx;
			margin: 30rpx 28rpx 30rpx 0rpx;
			font-size: 26rpx;
			color: #909199;
			border: 1px solid #eeeeee;
			border-radius: 10rpx;

			.button-text {
				font-size: 26rpx;
				color: #909199;
			}

			&:last-child {
				margin-right: 0rpx;
			}
		}
	}


	.order-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 26rpx 0;
		border-bottom: 2rpx dashed #eeeeee;
		margin-bottom: 28rpx;

		.order-code {
			font-size: 28rpx;

			.order-title {
				font-weight: bold;
				font-size: 30rpx;
				line-height: 42rpx;
				color: #303133;
			}
		}

		.order-status {
			font-size: 32rpx;
			color: #ff5d35;
			font-weight: bold;
		}

		.right-tag {
			width: max-content;
			padding: 4rpx 10rpx;
			font-size: 18rpx;
			color: $themeColor;
			background-color: #ffece5;
			border-radius: 16rpx;
		}
	}

	.order-item-page {
		background-color: #ffffff;
		margin: 0 20rpx 0rpx 20rpx;
		border-radius: 16rpx;
		padding: 34rpx 0;
		border-bottom: 2rpx solid #f3f3f3;

		.order-middle {
			padding-bottom: 22rpx;
			display: flex;
			flex-direction: column;

			.order-middle-contain {
				display: flex;
				margin-bottom: 18rpx;
			}

			.order-middle-image {
				margin-right: 28rpx;
				width: 176rpx;
				height: 176rpx;
			}

			.order-attachments-coverNew {
				position: relative;
			}

			.order-information {
				display: flex;
				flex-direction: column;
				flex: 1;

				.skill-type-contain {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 8rpx;
					margin-top: 10rpx;

					.skill-type {
						margin-top: 6rpx;
					}

					.skill-type-all {
						display: flex;
						flex-direction: row;
					}

					.order-offer {
						.price {
							font-size: 36rpx;
							color: #ff5d35;
							font-weight: bold;
						}

						.price-symbol {
							font-size: 24rpx;
							margin-right: 4rpx;
							color: #ff5d35;
						}
					}
				}

				.order-brand-contain {
					display: flex;
					width: 100%;
					align-items: center;
					margin-bottom: 10rpx;
					justify-content: space-between;

					.order-num {
						font-weight: bold;
						font-size: 24rpx;
						line-height: 34rpx;
						text-align: center;
						color: #303133;
					}
				}

				.order-brand {
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					max-width: 352rpx;
					color: #909299;
					font-size: 28rpx;
				}

				.order-name {
					font-weight: bold;
					font-size: 28rpx;
					line-height: 40rpx;
					color: #303133;
					max-width: 300rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}

				.item-image {
					&:first-child {
						margin-left: 0;
					}

					margin-left: -10rpx;
				}

				.offer-personnel {
					display: flex;
					align-items: center;
					justify-content: space-between;
				}

				.offer-personnel-contain {
					display: flex;
				}

				.personnel-num {
					color: #999999;
					font-size: 28rpx;
					margin-left: 4rpx;
				}
			}
		}
	}

	.order-details-bottom {
		height: 162rpx;
		width: 100%;
		background-color: #ffffff;
		position: fixed;
		z-index: 10;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding: 0 20rpx;

		text {
			text-align: center;
			display: inline-block;
			padding: 24rpx;
			border-radius: 10rpx;
		}

		.button-default {
			border: 2rpx solid #ebebeb;
			margin-right: 14rpx;
			font-weight: bold;
			font-size: 28rpx;
			color: #303133;

			&:last-child {
				margin-right: 0;
				color: #ffffff;
				background: linear-gradient(90deg, #ff9a52 0%, #ff6a32 100%);
			}
		}

		.view-list {
			background: none !important;
			background-color: #000000 !important;
			color: #FFFFFF !important;
		}

		.button-orange {
			color: #ffffff;
			background: linear-gradient(90deg, #ff9a52 0%, #ff6a32 100%);
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}

	/deep/ .u-checkbox {
		margin-right: 8rpx;
	}

	/deep/ .u-checkbox__label {
		display: none;
	}

	.service-contain {
		.item-service {
			position: relative;
			background-color: #fff;
			border-radius: 10rpx;
			margin-bottom: 40rpx;
		}

		.item-contian {
			padding-top: 30rpx;

			.check-contain {
				display: flex;
				align-items: center;

				.item-name {
					color: #303133;
					font-size: 28rpx;
				}

				.item-bock {
					font-size: 28rpx;
					color: #ff5d35;
				}
			}

			.item-text-contain {
				.item-title {
					margin-top: 24rpx;
					color: #606166;
					font-size: 26rpx;
					line-height: 40rpx;
					margin-bottom: 10rpx;
				}

				.item-form {
					display: flex;

					.item-label {
						white-space: nowrap;
					}
				}

				.item-address {
					@include toe();
				}

				.item-context {
					@include bov(2);
				}

				text {
					color: #606166;
					font-size: 26rpx;
					line-height: 40rpx;
				}
			}
		}

		.item-mask {
			text-align: center;
			position: absolute;
			width: 660rpx;
			height: 256rpx;
			top: 150rpx;
			background: linear-gradient(180deg, rgba(255, 255, 255, 0.30) 0%, #F1F1F1 80%);
			box-sizing: border-box;

			.item-bottom {
				display: flex;
				justify-content: center;
				align-items: center;
				position: absolute;
				bottom: 28rpx;
				left: 50%;
				transform: translateX(-50%);
			}

			text {
				color: #95886A;
				font-size: 26rpx;
			}

			image {
				width: 32rpx;
				height: 32rpx;
			}
		}
	}

	::v-deep .u-drawer-content {
		// background-color: transparent !important;
	}

	::v-deep .uni-progress-bar {
		border-radius: 10px;
	}

	::v-deep .uni-progress-inner-bar {
		border-radius: 10px;
	}

	.installment-popup {
		width: 630rpx;
		height: 653rpx;
		padding: 30rpx 0;

		.title {
			width: 100%;
			padding: 0 30rpx 30rpx;
			border-bottom: 2rpx solid #F0F0F0;

			.main-title {
				width: 100%;
				text-align: center;
				font-size: 32rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				color: #FE6E32;
				line-height: 34rpx;
			}

			.des {
				width: 100%;
				margin-top: 24rpx;
				text-align: center;
				font-size: 24rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 400;
				color: #999999;
				line-height: 34rpx;
			}
		}

		.progress-content {
			padding: 30rpx;
			justify-content: space-between;

			.left-amount {
				font-size: 24rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				color: #000000;
				line-height: 34rpx;
			}

			.progress-bar {
				width: 300rpx;
			}

			.right-amount {
				font-size: 24rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				color: #999999;
				line-height: 34rpx;
			}
		}

		.installment-plan {
			height: 300rpx;
			padding: 0 30rpx 10rpx;
			border-bottom: 2rpx solid #F0F0F0;

			.installment-item {
				width: 100%;
				margin: 30rpx 0;
				justify-content: space-between;

				.item-count {
					font-size: 24rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #808080;
					line-height: 34rpx;
				}

				.item-amount {
					text {
						font-family: Noto Sans S Chinese;
						font-weight: 500;
						color: #000000;
						line-height: 34px;
					}
				}

				.item-status {
					width: 108rpx;
					height: 30rpx;
					font-size: 20rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 500;
					line-height: 30rpx;
					padding-left: 24rpx;
					text-align: center;
					background-position: center;
					background-repeat: no-repeat;
					background-size: cover;
				}

				.unpay {
					color: #B3B3B3;
				}

				.paid {
					color: #FE6E32;
				}

				.item-time {
					font-size: 24rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #B3B3B3;
					line-height: 34rpx;
				}

				.item-button {
					width: 130rpx;
					height: 60rpx;
					border-radius: 30rpx;
					background-color: #000000;
					color: #FFFFFF;
					font-size: 24rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #FFFFFF;
					line-height: 60rpx;
					text-align: center;
				}
			}
		}

		.buttom-button {
			width: 100%;
			padding: 30rpx;
			justify-content: flex-end;

			.refund-button {
				width: 130rpx;
				height: 60rpx;
				background: #FE6E32;
				border-radius: 10rpx;
				text-align: center;
				font-size: 24rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 400;
				color: #000000;
				line-height: 60rpx;
			}
		}

		.buttom-button {
			width: 100%;
			padding: 30rpx;
			justify-content: flex-end;

			.refund-button {
				width: 130rpx;
				height: 60rpx;
				background: #FE6E32;
				border-radius: 10rpx;
				text-align: center;
				font-size: 24rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 400;
				color: #000000;
				line-height: 60rpx;
			}
		}
	}

	.product-refund {
		font-family: Noto Sans S Chinese;
		color: #909199;
		font-size: 26rpx;
		padding-top: 12rpx;
	}
</style>
