<template>
	<view>
		<z-nav-bar backState="1000" color="#fff">
			<view slot="default" class="navbar-title">确认订单</view>
		</z-nav-bar>
		<view class="main-container" v-if="orderConfirmInfo">
			<view class="address-container flex-center" @click="goToAddressPage" v-if="!isCoupon">
				<view class="left flex-center">
					<image src="https://www.51mihuo.com/static/icon/address_large.png" class="img"></image>
				</view>
				<view class="center flex-center">
					<view class="upper" v-if="postAddress">
						{{ getPostAddress }}
					</view>
					<view class="upper des-text" v-else> 维护收货地址 </view>
					<view class="lower" v-if="postAddress">
						{{ postAddress.name || '' }}
						{{ postAddress.phoneNumber || '' }}
					</view>
				</view>
				<view class="right flex-center" v-if="!isShowWorker">
					<image src="https://www.51mihuo.com/static/icon/menu_back.png" class="icon"></image>
				</view>
			</view>
			<view class="shop-container" v-for="(shop, index) in orderConfirmInfo.companyOrders" :key="index">
				<view class="title flex-center" @click="goShop(shop)">
					<u-avatar :src="$util.thumbnailImage(shop.companyLogo)" class="logo" size="40">
					</u-avatar>
					{{ shop.companyName }}
				</view>
				<view class="items" v-for="(order, orderIndex) in shop.orders" :key="orderIndex">
					<view class="cart-item" v-for="(item, index2) in order.orderItemList" :key="index2"
						:style="{ opacity: item.publishStatus == 1 && item.freightStatus == 1 ? '1' : '0.5' }">
						<view class="upper-container flex-center">
							<u-lazy-load class="img" height="180" imgMode="aspectFit" borderRadius="20"
								:image="$util.thumbnailImage(item.productPic, true)">
							</u-lazy-load>
							<view class="info flex-center">
								<view class="upper flex-center">
									<view class="left flex-center">
										<view class="title-2">
											{{ item.productName }}
										</view>
										<view class="sku flex-center">
											<view class="text flex-center">
												{{ getSkuStr(item.productAttr) }}
											</view>
										</view>
									</view>
									<view class="right flex-center">
										<view class="price" v-if="item.customCategory != '1003'">
											￥{{ item.productPrice }}</view>
										<view class="price" v-else>￥{{ orderConfirmInfo.ordersTotalAmount }}</view>
									</view>
								</view>
								<view class="quantity-container flex-center">
									<u-number-box v-if="item.skuStock && item.customCategory != '1003'"
										input-height="36" size="32" input-width="140"
										:disabled=" isEdit && !(item.publishStatus == 1 && item.freightStatus == 1)"
										:disabledInput="isEditInput" @change="onCartItemChange"
										v-model="orderConfirmInfo.companyOrders[index].orders[orderIndex].orderItemList[index2].productQuantity"
										:min="1" :max="item.skuStock.stock" :index="item.id">
									</u-number-box>
								</view>
							</view>
						</view>
					</view>
					<!-- 订单类型：0=商品订单 1=服务订单 2-协作订单 -->
					<!-- <mall-mh-menu-item v-if="orderConfirmInfo.couponHistoryDetailList && orderConfirmInfo.couponHistoryDetailList.length"
						title="优惠券" :height="88" :isShowArrow="true" border @click="showCoupon">
						<view class="slot-content flex-center" style="justify-content: flex-end;">
							<view class="coupon">
								{{ couponText }}
							</view>
						</view>
					</mall-mh-menu-item> -->
					<!-- <mall-mh-menu-item title="小记" :height="88" :isShowArrow="false" border>
						<view class="slot-content flex-center" style="justify-content: flex-end;">
							<view class="price">
								<text style="font-size: 20rpx; margin-right: 4rpx;">¥</text>
								{{ orderConfirmInfo.ordersTotalAmount }}
							</view>
						</view>
					</mall-mh-menu-item> -->
					<mall-mh-menu-item title="配送方式" :height="88" v-if="order.orderType == 0"
						@click="viewRules(order, 0)" border>
						<view class="slot-content flex-center">
							<view class="left"></view>
							<view class="right">
								{{
									orderConfirmInfo.deliveryType === 0 ? '商家配送' : '上门自提'
								}}
							</view>
						</view>
					</mall-mh-menu-item>
					<mall-mh-menu-item title="运费" :height="88" v-if="order.orderType == 0 && order.freightAmount != 0"
						@click="viewRules(order, 1)" border>
						<view class="slot-content flex-center">
							<view class="left"></view>
							<view class="right"> 运费 ¥{{ order.freightAmount }} </view>
						</view>
					</mall-mh-menu-item>
					<mall-mh-menu-item title="入户/安装" :height="88"
						v-if="order.orderType == 0 && order.freightInstallationAmount != 0" @click="viewRules(order, 2)"
						border>
						<view class="slot-content flex-center">
							<view class="left"></view>
							<view class="right">入户/安装费 ¥{{ order.freightInstallationAmount }}</view>
						</view>
					</mall-mh-menu-item>
					<mall-mh-menu-item title="搬运上楼" :height="88"
						v-if="order.orderType == 0 && order.freightStairwayAmount != 0" @click="viewRules(order, 2)"
						border>
						<view class="slot-content flex-center">
							<view class="left"></view>
							<view class="right">上楼费 ¥{{ order.freightStairwayAmount }}</view>
						</view>
					</mall-mh-menu-item>
					<mall-mh-menu-item title="补齐费用" :height="88" border @click="viewRules(order, 3)"
						v-if="order.diffAmount != 0">
						<view class="slot-content flex-center">
							<view class="left"></view>
							<view class="right">需补齐 ¥{{ order.diffAmount }}</view>
						</view>
					</mall-mh-menu-item>
					<mall-mh-menu-item title="订单备注" :height="88" :isShowArrow="false" border>
						<view class="slot-content flex-center">
							<view class="left">
								<input v-model="order.note" placeholder="请输入订单备注" inputBorder="false"
									:placeholder-style="placeholderStyle" style="color: #909199; font-size: 24rpx" />
							</view>
						</view>
					</mall-mh-menu-item>
					<mall-mh-menu-item title="资料补充" :height="88" :isShowArrow="false" border
						v-if="order.orderType == 1">
						<view class="slot-content flex-center" @click="goToUplaodFile(order, orderIndex, index)">
							<view class="right">
								{{ order.attachments ? '点击查看附件' : '点击上传附件' }}
							</view>
						</view>
					</mall-mh-menu-item>
				</view>
			</view>
			<!-- 分期商品不允许使用预付款和优惠券 -->
			<mall-mh-menu-item style="margin-top: 30rpx; border-radius: 15rpx"
				v-if="orderConfirmInfo.couponHistoryDetailList
				&& orderConfirmInfo.couponHistoryDetailList.length
				&& orderConfirmInfo.companyOrders[0].orders[0].payStagesEnable !== 1"
				title="优惠券" :height="88" :isShowArrow="true" border @click="showCoupon">
				<view class="slot-content flex-center" style="justify-content: flex-end">
					<view class="coupon">
						{{ couponText }}
					</view>
				</view>
			</mall-mh-menu-item>
			<!-- 服务端快速开单工人信息 -->
			<view class="worker-view flex-center" v-if="isShowWorker && orderConfirmInfo.createServer">
				<view class="left-avater">
					<u-avatar class="avatar" size="100"
						:src="$util.avatarImage(orderConfirmInfo.createServer.userId)" />
					<view class="ident-level"
						v-if=" orderConfirmInfo.createServer && orderConfirmInfo.createServer.level">
						V{{ orderConfirmInfo.createServer.level }}
					</view>
				</view>
				<view class="right-info">
					<view class="top flex-center">
						<view class="name">
							{{ orderConfirmInfo.createServer.userName || '' }}
						</view>
						<view class="skill-name"
							v-if="orderConfirmInfo.createServer && orderConfirmInfo.createServer.skillName">
							{{ orderConfirmInfo.createServer.skillName || '' }}
						</view>
					</view>
					<view class="center flex-center">
						<view class="price">
							{{ orderConfirmInfo.ordersTotalAmount }}
						</view>
						<view class="text">元</view>
					</view>
				</view>
			</view>
			<!-- 选择支付方式组件 -->
			<!-- 分期商品不允许使用预付款和优惠券 -->
			<mall-mh-payment-way :isShowPrepayment="orderConfirmInfo.companyOrders[0].orders[0].payStagesEnable !== 1"
				@selectPaymentWay="selectPaymentWay" @selectPrepayment="selectPrepayment"></mall-mh-payment-way>
		</view>
		<view class="bottom-buttons flex-center" v-if="orderConfirmInfo.quantity">
			<view class="left flex-center">
				<!-- 共 {{ orderConfirmInfo.quantity }} 件 -->
				<view class="left-price">
					<view class="text">
						<text class="price-text" style="font-size: 28rpx"> ￥ </text>
						<text class="price-text" style="font-size: 48rpx">
							{{ Math.floor(orderConfirmInfo.ordersPayAmount) }}
						</text>
						<text class="price-text" style="font-size: 36rpx">
							{{ orderConfirmInfo.ordersPayAmount | priceFormat }}
						</text>
					</view>
					<view class="small-text">
						<text class="color-text"
							v-if="orderConfirmInfo.companyOrders[0].orders[0].payStagesEnable === 1">
							{{ getPayStagesText() }}
						</text>
					</view>
					<view class="small-text">
						<text class="text" style="font-weight: 300">
							共{{ orderConfirmInfo.quantity }}件{{ orderConfirmInfo.ordersTotalAmount === orderConfirmInfo.ordersPayAmount? ', 无优惠' : `, 已优惠:` }}
						</text>
						<text class="color-text"
							v-if="orderConfirmInfo.ordersTotalAmount !== orderConfirmInfo.ordersPayAmount">
							￥{{ $math.floatSub(orderConfirmInfo.ordersTotalAmount, orderConfirmInfo.ordersPayAmount) }}
						</text>
					</view>
				</view>
			</view>
			<view class="right flex-center">
				<view class="button" @click="submitOrder">提交订单</view>
			</view>
		</view>
		<!-- 验证手机号的弹框 -->
		<view class="popup-2" v-if="verificationTelShow" @click="verificationTelShow = false">
			<view class="popup_with" @click.stop="verificationTelShow = true">
				<view class="tel_title">验证手机号</view>
				<view class="tips">为了保障您的权益, 首次需要验证手机号</view>
				<view class="inp_con">
					<view class="inputItem">
						<view class="title">手机号</view>
						<view class="info">
							<input type="number" maxlength="11" v-model="mobile" disabled placeholder="请输入手机号" />
						</view>
					</view>
					<view class="inputItem" style="border: none">
						<view class="title">短信验证</view>
						<view class="info">
							<input type="number" v-model="code" maxlength="6" placeholder="请输入验证码" />
						</view>
						<view class="get_code" @click="getCode">{{ send }}</view>
					</view>
					<view class="add-text" @click="onConfirm">确认</view>
				</view>
			</view>
		</view>
		<mihuo-popup v-if="orderConfirmInfo.couponHistoryDetailList" ref="couponPopup"
			:title="`可用优惠券(${orderConfirmInfo.couponHistoryDetailList.length})`">
			<view class="coupons-container">
				<mall-mh-coupon :selectedCouponId="selectedCouponId" :selectedCouponCode="selectedCouponCode"
					:couponCode="item.couponCode" v-for="(item, index) in orderConfirmInfo.couponHistoryDetailList"
					:coupon="item.coupon" :key="index" @selectCoupon="selectCoupon"></mall-mh-coupon>
			</view>
		</mihuo-popup>
		<!-- 运费模版/入户搬运费模版弹窗 -->
		<mihuo-popup title="商品说明" ref="isShowRules" mode="bottom" :safe-area-inset-bottom="true" border-radius="20"
			:mask-close-able="true">
			<mall-mh-freight-popup v-if="currentRuleType == 1" :freights="freight" :products="products">
			</mall-mh-freight-popup>
			<mall-mh-installation-popup v-if="currentRuleType == 2" :installations="installation" :products="products">
			</mall-mh-installation-popup>
			<view class="rule-text" v-if="currentRuleType == 3">
				<view class="rule-title"> 补齐价格说明 </view>
				<view class="rule-des">
					{{ fillAmountDesc }}
				</view>
			</view>
		</mihuo-popup>
		<!-- 不可下单商品的弹窗 -->
		<u-popup v-model="isShowUnavailableProduct" mode="bottom" :safe-area-inset-bottom="true" border-radius="20"
			:mask-close-able="true">
			<view class="unavailable-product">
				<view class="title"> 以下商品暂不能下单 </view>
				<view class="product-item flex-center" v-for="(item, index) in productUnavailable" :key="index">
					<u-lazy-load class="img" height="100" imgMode="aspectFit" borderRadius="20"
						:image="$util.thumbnailImage(item.productPic, true)">
					</u-lazy-load>
					<view class="name">
						{{ item.productName }}
					</view>
					<view class="reason" v-if="item.freightStatus == 2">
						原因: 无法发货
					</view>
					<view class="reason" v-if="item.publishStatus == 2">
						原因：商品已下架
					</view>
				</view>
				<!-- <bottom-button title="移除不可下单商品" v-if="productUnavailable.length > 1" @click="removeUnavailableProduct">
				</bottom-button> -->
				<bottom-button title="返回订单" v-if="productUnavailable.length == 1"
					@click="isShowUnavailableProduct = false"></bottom-button>
			</view>
		</u-popup>
		<u-popup v-model="isShowInstallmentPopup" height="653" mode="center" border-radius="30" closeable
			@close="closeInstallmentPopup">
			<view class="installment-popup">
				<view class="title">
					<view class="main-title"> 温馨提示 </view>
					<view class="des">
						为了保护您的资金安全，该订单将分为{{ installmentOrders.length }}笔支付。
					</view>
				</view>
				<view class="progress-content flex-center">
					<view class="left-amount"> {{ getPaidAmount['amount'] }}元 </view>
					<progress class="progress-bar" :percent="getPaidAmount['percent']" stroke-width="5"
						border-radius="20" :show-info="false" activeColor="#000000" backgroundColor="#E6E6E6" />
					<view class="right-amount">
						{{ orderConfirmInfo.ordersTotalAmount }}元
					</view>
				</view>
				<scroll-view class="installment-plan" scroll-y>
					<view class="installment-item flex-center" v-for="(item, index) in installmentOrders" :key="index">
						<view class="item-count"> 第{{ getBigNumber(index + 1) }}笔 </view>
						<view class="item-amount" v-if="item.amount">
							<text style="font-size: 20rpx">¥</text>
							<text style="font-size: 30rpx">{{ Math.floor(item.amount / 100) }}</text>
							<text style="font-size: 20rpx">{{ (item.amount / 100) | priceFormat }}</text>
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
							{{
								item.payTime.split('-')[1] + '-' + item.payTime.split('-')[2]
							}}
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
		<u-action-sheet @click="confirmWay" :list="wayList" v-model="isSelectDeliveryType"
			:safe-area-inset-bottom="true">
		</u-action-sheet>
	</view>
</template>

<script>
	var timer
	import {
		debounce
	} from '@/plugins/utils.js'

	export default {
		data() {
			return {
				couponText: '查看优惠券',
				selectedCouponCode: '', // 当前选择的优惠券code
				selectedCouponId: '', // 当前选择的优惠券ID
				wayList: [{
						text: '商家配送'
					},
					{
						text: '上门自提'
					}
				], // 配送方式
				products: [], // 当前查看订单运费模版或入户/安装费模版的所有商品
				placeholderStyle: `
					font-family: PingFang SC;
					font-style: normal;
					font-weight: 500;
					font-size: 24rpx;
					line-height: 34rpx;
					color: #999999;
					`,
				times: 60, // 获取验证码后的倒计时
				code: '', // 验证码
				mobile: '', // 手机号
				send: '获取验证码', // 验证码文字
				sendType: false, // 是否发送验证码
				verificationTelShow: false, // 是否显示验证号的弹窗
				chooseVoiceObject: {}, // 订单音频
				isAliPay: false, // 是否支付宝支付
				isWechatPay: false, // 是否微信支付
				selectedPaymentWay: -1, // // 1-微信扫码，2-微信原生App，3-微信小程序，4-支付宝扫码，5-支付宝原生App，6-余额
				postAddress: {}, // 用户收货地址
				totalAmount: {}, // 订单总金额
				isPay: false, // 是否支付
				freight: [], // 当前查看的运费模版
				installation: [], // 当前查看的入户/安装费模版
				currentRuleType: 0, // 当前查看的模版类型 1=运费模版 2=入户/安装费模版
				productUnavailable: [], // 不可下单的商品
				isShowUnavailableProduct: false, // 是否显示不可下单商品的弹窗
				freightList: [], // 购物车商品运费列表
				installationList: [], // 购物车入户搬运费列表
				orderConfirmInfo: null, // 确认订单信息
				fillAmountDesc: '', // 最低价格说明
				isSelectDeliveryType: false, // 选择配送方式
				isEdit: true, // 是否允许编辑商品数量
				isEditInput: false, // 是否允许输入框编辑商品数量
				isShowWorker: false, // 是否显示工匠信息(项目管家开单)
				options: {}, // 接收路由传参
				isShowInstallmentPopup: false, // 是否显示分期付款弹窗
				installmentOrders: [], // 拆分订单信息
				payOrderNo: '', // 支付订单号
				payOrderInfo: {}, // 支付订单信息
				isUsePrepayment: false, // 是否使用预付款支付
				isCoupon: false, // 是否是优惠券订单
			}
		},
		computed: {
			// 用户收货地址
			getPostAddress() {
				if (this.postAddress?.province) {
					return (
						this.postAddress.province +
						this.postAddress.city +
						this.postAddress.region +
						this.postAddress.poiName +
						this.postAddress.latAddress
					)
				} else {
					return '维护收货地址'
				}
			},
			getPaidAmount() {
				const result = {
					amount: 0,
					percent: 0
				}
				if (!this.installmentOrders.length) return result
				const arr = this.installmentOrders.filter(
					(item) => item.payStatus === 'success'
				)
				if (!arr.length) return result
				result.amount =
					arr.reduce((pre, cur) => {
						return Number(pre) + Number(cur.amount || 0)
					}, 0) / 100
				result.percent =
					(result.amount / this.orderConfirmInfo.ordersTotalAmount) * 100
				return result
			}
		},
		onHide() {
			timer && clearInterval(timer)
		},
		onLoad(options) {
			if (options.isCoupon == '1') {
				this.isCoupon = true
			}
			this.isEditInput = false
			if (options.invitatonCode) {
				// 设置邀请码
				uni.setStorageSync('invitatonCode', options.invitatonCode)
			}
			// 快速开单参数初始化
			if (options.scene && decodeURIComponent(options.scene)) {
				let tempOptions = decodeURIComponent(options.scene)
				let tempOptionsList = tempOptions.split('&')
				let resultOptions = []
				tempOptionsList.forEach((item) => {
					resultOptions.push(item.split('='))
				})
				options = this.getOption(resultOptions)
				this.options = options
			}
			if (options.shareType == 1) {
				// 服务端分享小程序开单跳转到确认订单页面
				this.isEdit = true
				this.isEditInput = true
				this.isShowWorker = true
				this.$httpApi
					.getOrderConfirmPreview(options.id)
					.then((res) => {
						if (res) {
							this.orderConfirmInfo = res
							this.postAddress = this.orderConfirmInfo.createServer?.address
							uni.setStorageSync('roomAddress', this.postAddress)
							uni.setStorageSync('orderConfirmInfo', res)
						}
					})
					.catch((e) => {
						uni.setStorageSync(
							'navigatePage',
							`/pages-mall/submitOrder/submitOrder?id=${options.id}&shareType=1`
						)
						this.$util.goToLoginPage()
					})
			} else {
				this.orderConfirmInfo = uni.getStorageSync('orderConfirmInfo')
			}
		},
		onShow() {
			if (this.isShowInstallmentPopup) {
				// 当有拆分付款订单时，查询拆分订单付款状态
				this.getPayInstallmentOrder()
			}
			// 获取收货地址
			if (!this.isShowWorker) {
				this.getUserPostAddress()
			}
		},
		methods: {
			// 获取分期支付内容
			getPayStagesText() {
				if (this.orderConfirmInfo.companyOrders[0].orders[0].payStagesEnable === 1) {
					const stage1 = this.orderConfirmInfo.companyOrders[0].orders[0].payStages[0]
					return `分期商品，需付${stage1.name}: ${stage1.payAmount}元`
				}
				return ''
			},
			// 选择优惠券
			selectCoupon(data, code) {
				if (this.selectedCouponCode != data.code) {
					this.selectedCouponId = data.id
					this.orderConfirmInfo.couponId = data.id
					this.selectedCouponCode = code
					if (data.type === 0) {
						this.couponText = `满${data.minPoint}减${data.amount}`
					} else {
						this.couponText = `满${data.minPoint}打${Number(data.amount) * 10}折`
					}
				} else {
					this.selectedCouponId = ''
					this.orderConfirmInfo.couponId = ''
					this.couponText = '查看优惠券'
					this.selectedCouponCode = ''
				}
				this.$refs.couponPopup.close()
				this.updateOrderInfo()
			},
			// 显示可选优惠券
			showCoupon() {
				this.$refs.couponPopup.open()
			},
			// 分段支付订单退款
			refundInstallmentOrder() {
				this.closeInstallmentPopup('refund')
			},
			getBigNumber(number) {
				return this.$util.getBigNumber(number)
			},
			getOption(arr) {
				let obj = {}
				arr.forEach((v) => {
					let key = v[0]
					let value = v[1]
					obj[key] = value
				})
				return obj
			},
			// 上传订单附件
			goToUplaodFile(order, orderIndex, index) {
				this.toPage(`./uploadOrderFile?data=${order.attachments || ''}`)
				uni.$once('uploadOrderFile', (data) => {
					if (data) {
						this.orderConfirmInfo.companyOrders[orderIndex].orders[
							index
						].attachments = data
					}
				})
			},
			// 更换地址、修改商品数量、更换配送方式时更新订单信息
			updateOrderInfo() {
				if (!this.postAddress?.id) return
				this.orderConfirmInfo.memberReceiveAddressId = this.postAddress?.id
				this.$httpApi
					.calculateMallOrderAmount(this.orderConfirmInfo)
					.then((res) => {
						if (res) {
							uni.setStorageSync('orderConfirmInfo', res)
							this.orderConfirmInfo = res
						}
					})
			},
			// 从订单中移除不可下单的商品
			removeUnavailableProduct() {
				console.log(this.productUnavailable)
			},
			// 确认选择配送方式
			confirmWay(data) {
				// 配送方式 1=商家配送 2=上门自提
				this.orderConfirmInfo.deliveryType = data
				this.updateOrderInfo()
			},
			// 查看模版规则
			viewRules(order, type) {
				if (type == 0) {
					this.isSelectDeliveryType = true
					return
				}
				const products = []
				const freight = []
				const installation = []
				let desc = ''
				order.orderItemList.forEach((item) => {
					if (item && item.freightTemplate && item.freightInstallationTemplate) {
						products.push(item)
						freight.push(item.freightTemplate)
						installation.push(item.freightInstallationTemplate)
						desc += ' ' + item.minAmountDescription
					}
				})
				// 0=配送方式 1=运费 2=入户搬运费 3=最低价格说明
				this.currentRuleType = type
				this.products = products
				if (type == 1) {
					this.freight = freight
					if (!this.freight.length) return
				} else if (type == 2) {
					this.installation = installation
					if (!this.installation.length) return
				} else {
					this.fillAmountDesc = desc
					if (!this.fillAmountDesc.length) return
				}
				this.$refs.isShowRules.open()
			},
			// 修改商品数量后刷新订单金额
			onCartItemChange() {
				if (this.options.shareType != 1) {
					debounce(() => {
						this.updateOrderInfo()
					}, 500)
				}
			},
			// 获取用户手机号
			getPhone() {
				this.$httpApi.getPersonSettingInfo().then((res) => {
					if (res) {
						this.mobile = res.phone
						this.verificationTelShow = true
					}
				})
			},
			// 获取验证码
			getCode() {
				if (!this.mobile) {
					uni.showToast({
						title: '手机号不能为空',
						icon: 'none'
					})
					return
				}
				if (this.sendType) {
					return
				}
				//用于用户账户绑定手机号发送验证码
				this.$httpApi
					.sendPaymentAccountVerifyCode({
						phone: this.mobile
					})
					.then((res) => {
						if (res) {
							timer = setInterval(() => {
								this.times -= 1
								if (this.times <= 0) {
									this.send = '获取验证码'
									clearInterval(timer)
									this.times = 60
									this.sendType = false
								} else {
									this.send = this.times + '秒后重试'
									this.sendType = true
								}
							}, 1000)
							uni.showToast({
								title: '验证码发送成功',
								icon: 'none'
							})
						}
					})
			},
			// 确认绑定手机号
			onConfirm() {
				if (!this.code) {
					uni.showToast({
						title: '请输入验证码',
						icon: 'none'
					})
					return
				}
				let httpData = {
					phone: this.mobile,
					verifyCode: this.code
				}
				this.$httpApi.bindPhone(httpData).then((res) => {
					if (res) {
						this.verificationTelShow = false
						uni.showToast({
							title: '验证成功',
							icon: 'none'
						})
					}
				})
			},
			// 获取收货地址
			getUserPostAddress() {
				// 从本地缓存中获取用户已选收货地址
				// 如果用户没有选择过再获取默认地址，如果没有设置过默认地址，再获取第一个地址
				let addressLocal = uni.getStorageSync('roomAddress')
				const userData = uni.getStorageSync('userData')
				if (addressLocal && userData) {
					if (addressLocal.memberId != userData.sysUser.userId) {
						uni.removeStorageSync('roomAddress')
						addressLocal = null
					}
				}
				this.postAddress = addressLocal
				if (!this.postAddress) {
					this.$httpApi.getPostAddress().then((res) => {
						if (res && res.length !== 0) {
							const findItem = res.find((item) => item.defaultStatus == 0)
							if (findItem) this.postAddress = findItem
							else this.postAddress = res[0]
							uni.setStorageSync('roomAddress', this.postAddress)
							this.updateOrderInfo()
						} else {
							this.postAddress = null
							uni.removeStorageSync('roomAddress')
						}
					})
				} else {
					if (this.options.shareType != 1) {
						this.updateOrderInfo()
					}
				}
			},
			// 选择支付方式
			selectPaymentWay(data) {
				this.selectedPaymentWay = data
			},
			selectPrepayment(data) {
				this.isUsePrepayment = data
			},
			// 商品规格
			getSkuStr(item) {
				let sku = JSON.parse(item)
				let skuStr = ''
				sku.forEach((each, index) => {
					skuStr += `${each.value}${index == sku.length - 1 ? '' : '/'}`
				})
				return skuStr
			},
			goToAddressPage() {
				if (this.isShowWorker) return
				this.toPage(
					`/pages-common/addressList/addressList?isShow=${true}&lastPage=order`
				)
			},
			// 调用接口提交订单获取订单信息发起支付
			saveOrder() {
				// 绑定邀请码 如果分享页面有邀请码，则使用该邀请码
				this.orderConfirmInfo['referrerInvitationCode'] =
					uni.getStorageSync('invitatonCode') || ''
				this.$httpApi.submitMallOrder(this.orderConfirmInfo).then((res) => {
					if (res && res.orderIds.length !== 0) {
						this.payOrderInfo = res
						this.saveOrderSuccess()
					}
				})
			},
			// 快速开单判断手机号和当前用户手机号是否一致
			submitOrderCheck() {
				if (this.isShowWorker) {
					if (
						this.postAddress.phoneNumber !==
						uni.getStorageSync('userData').sysUser.phone
					) {
						uni.showModal({
							title: '提示',
							content: '当前登录用户信息和开单信息手机号不匹配，是否继续？',
							confirmText: '继续',
							cancelText: '取消',
							success: (res) => {
								this.submitOrder()
							}
						})
					}
				} else {
					this.submitOrder()
				}
			},
			// 提交订单
			submitOrder() {
				this.debounce(() => {
					this.productUnavailable = []
					this.orderConfirmInfo.companyOrders.forEach((item) => {
						item.orders.forEach((order) => {
							order.orderItemList.forEach((product) => {
								if (product.publishStatus != 1 || product.freightStatus !=
									1) {
									this.productUnavailable.push(product)
								}
							})
						})
					})
					if (this.productUnavailable.length !== 0) {
						// 订单中有商品无法下单
						this.isShowUnavailableProduct = true
						return
					}
					if (!this.postAddress) {
						this.$util.toast('请选择一个收货地址!')
						return
					}
					if (this.selectedPaymentWay === -1) {
						this.$util.toast('请选择支付方式!')
						return
					}
					// 判断有没有绑定过支付账户，没有的要先绑定
					this.$httpApi.checkPhoneBeforePay().then((res) => {
						if (res && res == 1) {
							this.saveOrder()
						} else {
							this.getPhone()
						}
					})
				}, 200)
			},
			// 下单成功后的回调
			async saveOrderSuccess() {
				// 1-微信扫码，2-微信原生App，3-微信小程序，4-支付宝扫码，5-支付宝原生App，6-余额
				// 直接下单
				if (this.selectedPaymentWay === 3) {
					// 微信小程序
					this.isPay = true
					uni.$once('splitPayOrder', (data) => {
						if (data) {
							this.payOrderNo = data
							this.getPayInstallmentOrder()
							this.isShowInstallmentPopup = true
						}
					})
					this.$util.requestPay(
						this.selectedPaymentWay, {
							orderId: this.payOrderInfo
						},
						'mallOrder',
						() => {
							this.closeInstallmentPopup()
						},
						this.isUsePrepayment
					)
				} else {
					// 支付宝扫码
					const payRes = await this.$httpApi.payOrder({
						orderIds: this.payOrderInfo.orderIds,
						payMethod: this.selectedPaymentWay,
						usePrepayment: this.isUsePrepayment
					})
					if (payRes.payStatus === 'SUCCESS') {
						this.closeInstallmentPopup()
						return
					}
					if (payRes.splitFlag) {
						// 金额大于五万时 拆分支付订单
						this.payOrderNo = payRes.payOrderNo
						this.getPayInstallmentOrder()
						this.isShowInstallmentPopup = true
					} else if (payRes.payInfo) {
						// isPay为true但不代表支付成功了，只是发起了支付
						this.isPay = true
						this.$util.requestPay(
							this.selectedPaymentWay,
							payRes.payInfo,
							'mallOrder',
							() => {
								this.closeInstallmentPopup()
							},
							this.isUsePrepayment
						)
					}
				}
			},
			// 获取拆分支付订单
			getPayInstallmentOrder() {
				this.$httpApi
					.getInstallmentPaymentOrder({
						payOrderNo: this.payOrderNo
					})
					.then((res) => {
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
								// 延时一下优化体验
								this.closeInstallmentPopup()
							}, 1000)
						}
					})
			},
			// 关闭支付拆分单的弹窗
			closeInstallmentPopup(type = '') {
				if (this.payOrderInfo.orderIds.length === 1) {
					// 只有一个订单时，跳转到订单详情页
					uni.redirectTo({
						url: `/pages-order/orderDetails?id=${this.payOrderInfo.orderIds[0]}&type=${type}`
					})
				} else {
					// 多个订单跳转到订单列表页
					uni.redirectTo({
						url: `/pages-order/orderList?index=-1&status=0&autoReirect=1`
					})
				}
			},
			// 支付拆分单
			payInstallmentItem(item) {
				if (item.payStatus !== 'pending') return
				// #ifdef APP-PLUS || H5
				const data = {
					payMethod: this.selectedPaymentWay,
					payOrderNo: item.bizOrderNo
				}
				this.$httpApi.confirmPayInstallmentOrder(data).then((payRes) => {
					if (payRes.payInfo) {
						// isPay为true但不代表支付成功了，只是发起了支付
						this.isPay = true
						this.$util.requestPay(
							this.selectedPaymentWay,
							payRes.payInfo,
							'mallOrder',
							() => {
								this.getPayInstallmentOrder()
							}
						)
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
						this.$httpApi.confirmPayInstallmentOrder(data).then((payRes) => {
							const data = JSON.parse(payRes.payInfo)
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
									console.log('fail:' + JSON.stringify(err))
								}
							})
						})
					}
				})
				// #endif
			},
			// 进店逛逛
			goShop(data) {
				if (data.companyId != -1) {
					this.toPage(
						`/pages-mall/shopInformation/shopInformation?companyId=${data.companyId}`
					)
				} else {
					const obj = {
						companyLogo: data.companyLogo,
						companyShortName: data.companyName,
						completeAddress: data.completeAddress,
						contactTel: data.companyTel
					}
					this.toPage(
						`/pages-mall/shopInformation/shopInformation?cityOperatorId=${
            data.cityOperatorId
          }&data=${JSON.stringify(obj)}`
					)
				}
			}
		}
	}
</script>
<style>
	page {
		background-color: #f5f5f5;
	}
</style>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	page {
		background-color: #f5f5f5;
	}

	.navbar-title {
		font-family: PingFang SC;
		font-style: normal;
		font-weight: 900;
		font-size: 36rpx;
		line-height: 50rpx;
		text-align: center;
		color: #333333;
	}

	.main-container {
		width: 690rpx;
		height: calc(100vh - var(--status-bar-height) - 88rpx - 144rpx);
		overflow-y: scroll;
		margin: 0rpx 30rpx;

		.address-container {
			width: 690rpx;
			height: 148rpx;
			background-color: #fff;
			justify-content: flex-start;
			margin-top: 16rpx;
			border-radius: 16rpx;
			padding: 0 30rpx;

			.left {
				width: 44rpx;
				height: 148rpx;
				justify-content: center;

				.img {
					width: 44rpx;
					height: 44rpx;
				}
			}

			.center {
				width: 500rpx;
				height: 148rpx;
				flex-direction: column;
				justify-content: center;
				margin-left: 20rpx;

				.upper {
					width: 100%;
					height: 50rpx;
					font-family: PingFang SC;
					font-style: normal;
					font-weight: bold;
					font-size: 36rpx;
					line-height: 50rpx;
					color: #303133;
					@include toe();
				}

				.des-text {
					font-weight: normal;
					font-size: 26rpx;
					line-height: 50rpx;
					color: #a8a8a8;
				}

				.lower {
					width: 100%;
					height: 40rpx;
					font-family: PingFang SC;
					font-style: normal;
					font-weight: 500;
					font-size: 28rpx;
					line-height: 40rpx;
					color: #999999;
					@include toe();
				}
			}

			.right {
				width: 20rpx;
				height: 148rpx;
				justify-content: center;
				margin-left: 40rpx;

				.icon {
					width: 11rpx;
					height: 20rpx;
				}
			}
		}

		.shop-container {
			width: 690rpx;
			margin-top: 30rpx;
			padding: 20rpx 0;
			border-radius: 16rpx;
			background-color: #fff;

			.title {
				width: 100%;
				height: 44rpx;
				padding: 0rpx 30rpx;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 30rpx;
				line-height: 44rpx;
				color: #303133;

				.logo {
					margin-right: 12rpx;
				}
			}

			.items {
				margin-top: 20rpx;

				.cart-item {
					width: 690rpx;
					height: max-content;
					margin-bottom: 30rpx;
					background-color: #fff;

					.upper-container {
						align-items: flex-start;

						.img {
							width: 160rpx;
							height: 160rpx;
							border-radius: 20rpx;
							margin-left: 20rpx;
						}

						.info {
							width: 480rpx;
							height: 100rpx;
							margin-left: 30rpx;
							flex-direction: column;

							.upper {
								width: 480rpx;
								height: 100rpx;

								.left {
									width: 80%;
									height: 100rpx;
									flex-direction: column;

									.title-2 {
										width: 100%;
										height: max-content;
										max-height: 72rpx;
										font-family: PingFang SC;
										font-style: normal;
										font-weight: bold;
										font-size: 26rpx;
										line-height: 36rpx;
										color: #303133;
										@include bov(2);
									}

									.sku {
										width: 100%;
										justify-content: flex-start;

										.text {
											width: max-content;
											max-width: 400rpx;
											height: max-content;
											max-height: 72rpx;
											font-family: PingFang SC;
											font-style: normal;
											font-weight: bold;
											font-size: 22rpx;
											line-height: 36rpx;
											color: #999999;
											display: -webkit-box;
											@include bov(2);
										}
									}
								}

								.right {
									width: 200rpx;
									height: 100rpx;
									flex-direction: column;
									justify-content: space-between;

									.price {
										font-family: PingFang SC;
										font-style: normal;
										font-weight: 500;
										font-size: 28rpx;
										line-height: 28rpx;
										color: #333333;
									}
								}
							}

							.quantity-container {
								width: 100%;
								justify-content: flex-end;
								height: 56rpx;
								padding-right: 10rpx;
								margin-top: 30rpx;
							}
						}
					}
				}
			}
		}

		.slot-content {
			width: 400rpx;
			justify-content: flex-start;

			.left {
				width: max-content;
				height: 34rpx;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: 500;
				font-size: 24rpx;
				line-height: 34rpx;
				color: #999999;
				@include toe();
			}

			.right {
				width: max-content;
				margin-right: 10rpx;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 24rpx;
				line-height: 34rpx;
				color: #909199;
			}

			.coupon {
				width: max-content;
				height: 40rpx;
				padding: 0 10rpx;
				text-align: center;
				background: #fcebe3;
				border-radius: 6rpx;
				font-size: 20rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				color: #fe6e32;
				line-height: 40rpx;
			}

			.price {
				font-size: 32rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				color: #000000;
				line-height: 34rpx;
			}
		}

		.worker-view {
			width: 690rpx;
			margin: 30rpx 0;
			background-color: #ffffff;
			border-radius: 16rpx;
			padding: 30rpx;

			.left-avater {
				margin-right: 38rpx;
				position: relative;

				.ident-level {
					position: absolute;
					top: 0;
					right: -10rpx;
					font-size: 15rpx;
					font-family: FZRuiZhengHei_GBK;
					font-weight: bold;
					color: #ffffff;
					text-align: center;
					padding: 5rpx 10rpx 0rpx;
					background: linear-gradient(90deg, #333333, #666666);
					border-radius: 10rpx 0;
					font-style: italic;
				}
			}

			.right-info {
				.top {
					.name {
						font-size: $middleFontSize;
						color: $mainFontColor14;
						font-family: PingFang SC;
						font-weight: bold;
						margin-right: 17rpx;
					}

					.skill-name {
						font-size: $fontSize22;
						color: $fontColorPrice;
						font-family: FZRuiZhengHei_GBK;
						font-weight: 800;
						display: inline-block;
						line-height: 34rpx;
						padding: 0 8rpx;
						text-align: center;
						border: 2rpx solid $fontColorPrice;
						border-radius: 6rpx;
					}
				}

				.center {
					padding: 10rpx 0;

					.price {
						color: #fe6e32;
						font-weight: bold;
						font-size: 32rpx;
						font-family: Arial-BoldMT;
					}

					.text {
						font-size: 24rpx;
					}
				}
			}
		}
	}

	.bottom-buttons {
		width: 100vw;
		height: 144rpx;
		background-color: #ffffff;
		position: sticky;
		bottom: 0;
		padding: 0 30rpx;
		justify-content: space-between;

		.left {
			width: max-content;
			height: 100%;
			justify-content: flex-start;
			font-family: PingFang SC;
			font-style: normal;
			font-weight: bold;
			font-size: 28rpx;
			line-height: 40rpx;
			color: #333333;

			.left-price {
				padding-top: 10rpx;

				.price-text {
					font-family: Microsoft YaHei;
					font-style: normal;
					font-weight: bold;
					font-size: 32rpx;
					line-height: 32rpx;
					text-align: center;
					color: #ff5d35;
				}

				.small-text {
					width: 100%;
					font-family: Microsoft YaHei;

					.color-text {
						font-weight: bold;
						color: #ff5d35;
					}

					text {
						font-style: normal;
						font-size: 20rpx;
						line-height: 32rpx;
						color: #333333;
					}
				}
			}
		}

		.right {
			width: max-content;
			height: 100%;
			justify-content: center;

			.button {
				width: 224rpx;
				height: 88rpx;
				background: linear-gradient(90deg, #ff9a52 0%, #ff6a32 100%);
				border-radius: 60rpx;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 32rpx;
				line-height: 88rpx;
				text-align: center;
				color: #ffffff;
			}
		}
	}

	.popup-2 {
		position: fixed;
		bottom: 0;
		left: 0;
		top: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 99999;

		.popup_with {
			position: absolute;
			left: 46rpx;
			right: 46rpx;
			top: 20%;
			background: #ffffff;
			border-radius: 30rpx;
			padding: 30rpx 20rpx;

			.tel_title {
				text-align: center;
			}

			.inputItem {
				background-color: #fff;
				display: flex;
				padding: 0 25rpx;
				border-bottom: 1rpx solid #f6f6f6;
			}

			.inputItem .title {
				min-width: 150rpx;
				height: 100rpx;
				line-height: 100rpx;
				flex-shrink: 0;
				font-size: 30rpx;
				white-space: nowrap;
			}

			.inputItem .info {
				flex: 1;
				display: flex;
				align-items: center;
				color: #999;
			}

			.inputItem .info input {
				height: 100rpx;
				line-height: 100rpx;
				font-size: 30rpx;
				width: 75%;
			}

			.get_code {
				width: 140rpx;
				height: 50rpx;
				line-height: 50rpx;
				background: linear-gradient(90deg, $themeColor 0%, $themeColor 100%);
				border-radius: 10rpx;
				font-weight: 400;
				font-size: 24rpx;
				color: #ffffff;
				text-align: center;
				margin-right: 40rpx;
				margin-top: 20rpx;
			}

			.btnContent {
				margin: 248rpx 64rpx 64rpx 64rpx;
				text-align: center;

				.button {
					width: 624rpx;
					line-height: 88rpx;
					display: inline-block;
					color: #ffffff;
					background: #fe6e32;
					font-size: $middleFontSize;
					border-radius: $miniBorderRadius;
				}
			}

			.add-text {
				margin: 20rpx 20rpx 0;
				@include button;
			}

			.popup_cancel {
				position: absolute;
				top: -10rpx;
				right: 10rpx;
				width: 50rpx;
				height: 50rpx;
				margin-left: -50rpx;
			}

			.tips {
				margin: 10rpx 23rpx 0;
				font-size: 26rpx;
				color: #909090;
			}
		}
	}

	.rule-text {
		width: 100vw;
		height: 55vh;
		padding: 30rpx;

		.rule-title {
			width: 100%;
			text-align: center;
			font-family: PingFang SC;
			font-style: normal;
			font-weight: 500;
			font-size: 28rpx;
			line-height: 40rpx;
			color: #333333;
		}

		.rule-des {
			margin-top: 30rpx;
			font-family: PingFang SC;
			font-style: normal;
			font-size: 26rpx;
			line-height: 40rpx;
			color: #333333;
		}
	}

	.unavailable-product {
		width: 100vw;
		height: 50vh;
		padding: 30rpx;

		.title {
			width: 100%;
			text-align: center;
			font-family: PingFang SC;
			font-style: normal;
			font-weight: 500;
			font-size: 30rpx;
			line-height: 40rpx;
			color: #333333;
		}

		.product-item {
			margin-top: 30rpx;

			.img {
				width: 100rpx;
				height: 100rpx;
			}

			.name {
				min-width: 200rpx;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: 500;
				font-size: 28rpx;
				line-height: 40rpx;
				color: #333333;
				margin-left: 30rpx;
			}

			.reason {
				border-left: 2rpx #a8a8a8 solid;
				padding-left: 30rpx;
				font-family: PingFang SC;
				font-style: normal;
				font-size: 26rpx;
				line-height: 40rpx;
				color: #333333;
				margin-left: 30rpx;
			}
		}
	}

	.installment-popup {
		width: 630rpx;
		height: 653rpx;
		padding: 30rpx 0;

		.title {
			width: 100%;
			padding: 0 30rpx 30rpx;
			border-bottom: 2rpx solid #f0f0f0;

			.main-title {
				width: 100%;
				text-align: center;
				font-size: 32rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				color: #fe6e32;
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
			border-bottom: 2rpx solid #f0f0f0;

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
					color: #b3b3b3;
				}

				.paid {
					color: #fe6e32;
				}

				.item-time {
					font-size: 24rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #b3b3b3;
					line-height: 34rpx;
				}

				.item-button {
					width: 130rpx;
					height: 60rpx;
					border-radius: 30rpx;
					background-color: #000000;
					color: #ffffff;
					font-size: 24rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #ffffff;
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
				background: #fe6e32;
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

	.coupons-container {
		width: 100vw;
		padding: 30rpx;
	}

	// ::v-deep .u-drawer-content {
	// 	background-color: transparent !important;
	// }

	::v-deep .uni-progress-bar {
		border-radius: 10px;
	}

	::v-deep .uni-progress-inner-bar {
		border-radius: 10px;
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
