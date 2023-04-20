<template>
	<view class="content">
		<view class="company">
			<image class="pay_logo" mode="aspectFit" src="https://www.51mihuo.com/static/images/pay_logo.png" />
		</view>
		<view class="payinfo">
			<view class="wait_content">
				<image class="wait_icon" :src="paySrc" />
				<view class="wait">
					{{ payText }}
				</view>
			</view>
			<view class="order_info">
				<view class="order_no" v-if="orderInfo.orderNo">
					<text>订单编号</text>
					<text>{{}}</text>
				</view>
				<view class="order_amount" v-if="orderInfo.payAmount">
					<text style="font-size: 28rpx">金额</text>
					<text style="font-size: 30rpx; color: #ed3832">
						<text style="font-size: 20rpx; color: #ed3832">¥</text>
						{{ orderInfo.payAmount }}
					</text>
				</view>
			</view>
			<view>
				<view class="action">
					<button class="minibtn" @click="lookmini" v-if="paysuccess == 2">
						逛逛小程序
					</button>
					<button class="minibtn" @click="restartPay" v-if="paysuccess == 1">
						再次支付
					</button>
					<button class="backbtn" open-type="launchApp" app-parameter="wechat"
						v-if="paysuccess == 2 || paysuccess == 1" binderror="launchAppError">
						返回APP
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import base from '@/config/common.js'
	export default {
		data() {
			return {
				paysuccess: 0, //0未支付 1 支付失败 2 支付成功
				orderInfo: {},
				payText: '等待支付',
				options: {},
				paySrc: 'https://www.51mihuo.com/static/images/wait_pay.png',
				payOrderNo: '',
				installmentOrders: [], // 分段支付订单
				currentInstallmentIndex: 0, // 当前支付的笔数
				authToken: ''
			}
		},
		onHide() {},
		watch: {
			paysuccess(nvalue, ovalue) {
				switch (nvalue) {
					case 0:
						this.payText = '等待支付'
						this.paySrc = 'https://www.51mihuo.com/static/images/wait_pay.png'
						break
					case 1:
						this.payText = '支付失败'
						this.paySrc = 'https://www.51mihuo.com/static/images/pay_error.png'
						break
					case 2:
						this.payText = '支付成功'
						this.paySrc = 'https://www.51mihuo.com/static/images/pay_success.png'
						break
				}
			}
		},
		onLoad(options) {
			this.options = options
			const {
				type
			} = options
			uni.login({
				success: (res) => {
					switch (type) {
						case 'mallOrder':
							// 商城订单
							this.payMallOrder(res, options)
							break
						case 'workOrder':
							// 找人订单
							this.payWorkOrder(res, options)
							break
						case 'changeItem':
							// 订单变更项
							this.payChangeItem(res, options)
							break
						case 'retention':
							// 服务端质保金充值
							this.payRetention(res, options)
							break
						case 'insurance':
							// 保险支付
							this.payInsurance(res, options)
							break
						default:
							// 服务端钱包充值
							this.payDeposit(res, options)
							break
					}
				}
			})
		},
		methods: {
			// 获取分段支付订单
			getPayInstallmentOrder(options) {
				const {
					token
				} = options
				uni.request({
					url: base.apiUrl + 'pay/tradeorder/getSubConsumePay',
					method: 'GET',
					data: {
						payOrderNo: this.payOrderNo
					},
					header: {
						Authorization: token,
						deviceId: uni.getStorageSync('APP-UUID'),
						VERSION: 'A'
					},
					success: (success) => {
						this.installmentOrders = success.data.data
						if (this.currentInstallmentIndex > this.installmentOrders.length - 1) {
							// 支付成功
							this.currentInstallmentIndex = 0
							this.paysuccess = 2
							return
						} else {
							this.payInstallmentItem(options)
						}
					}
				})
			},
			// 支付拆分单
			payInstallmentItem(options) {
				const {
					token
				} = options
				const item = this.installmentOrders[this.currentInstallmentIndex]
				uni.login({
					success: (res) => {
						const data = {
							clientId: 'cmini',
							code: res.code,
							payOrderNo: item.bizOrderNo,
							payMethod: 3
						}
						uni.request({
							url: base.apiUrl + 'pay/tradeorder/subConsumePay',
							method: 'POST',
							data: data,
							header: {
								Authorization: token,
								deviceId: uni.getStorageSync('APP-UUID'),
								VERSION: 'A'
							},
							success: (payRes) => {
								if(payRes.data.data){
									const data = JSON.parse(payRes.data.data.payInfo)
									var that = this
									uni.requestPayment({
										provider: 'wxpay',
										timeStamp: String(data.timeStamp),
										nonceStr: data.nonceStr,
										package: data.package,
										signType: data.signType,
										paySign: data.paySign,
										success: function(res) {
											// 支付成功
											that.getPayInstallmentOrder(options)
											// 支付下一笔
											that.currentInstallmentIndex += 1
										},
										fail: function(err) {
											that.getPayInstallmentOrder(options)
											console.log('fail:' + JSON.stringify(err));
										}
									});
								}
							}
						})
					}
				})
			},
			// 重新唤起支付
			restartPay() {
				const options = this.options
				const {
					type
				} = options
				uni.login({
					success: (res) => {
						switch (type) {
							case 'mallOrder':
								// 商城订单
								this.payMallOrder(res, options)
								break
							case 'workOrder':
								// 找人订单
								this.payWorkOrder(res, options)
								break
							case 'changeItem':
								// 订单变更项
								this.payChangeItem(res, options)
								break
							case 'retention':
								// 服务端质保金充值
								this.payRetention(res, options)
								break
							case 'insurance':
								// 保险支付
								this.payInsurance(res, options)
								break
							default:
								// 服务端钱包充值
								this.payDeposit(res, options)
								break
						}
					}
				})
			},
			// 逛逛小程序
			lookmini() {
				uni.reLaunch({
					url: '/pages/home/home'
				})
			},
			launchAppError() {},
			// 支付订单变更项
			payChangeItem() {
				uni.showLoading()
				const {
					token,
					ticket,
					payMethodKey,
					orderInfo
				} = options
				uni.request({
					url: base.apiUrl + 'order/customer/pay/alteration',
					method: 'POST',
					data: {
						ids: orderInfo,
						payMethod: payMethodKey,
						code: res.code,
						clientId: 'cmini'
					},
					header: {
						Authorization: token,
						deviceId: uni.getStorageSync('APP-UUID'),
						'mfa-verify-ticket': ticket,
						VERSION: 'A'
					},
					success: (result) => {
						if (result.data.code == 0) {
							const data = JSON.parse(result.data.data.payInfo)
							this.orderInfo = JSON.parse(result.data.data)
							uni.hideLoading()
							uni.requestPayment({
								provider: 'wxpay',
								timeStamp: String(data.timeStamp),
								nonceStr: data.nonceStr,
								package: data.package,
								signType: data.signType,
								paySign: data.paySign,
								success: (res) => {
									this.paysuccess = 2
								},
								fail: (err) => {
									this.paysuccess = 1
									console.log('fail:' + JSON.stringify(err))
								}
							})
						} else {
							this.paysuccess = 1
							this.$util.toast(result.data)
						}
					},
					fail: (error) => {
						this.paysuccess = 1
						console.log(error)
					}
				})
			},
			// 支付商城订单
			payMallOrder(res, options) {
				uni.showLoading()
				const {
					token,
					ticket,
					payMethodKey,
					orderInfo,
					isUsePrepayment
				} = options
				uni.request({
					url: base.apiUrl + 'mall/order/carOrderPay',
					method: 'POST',
					data: {
						bizType: 40,
						orderIds: [orderInfo],
						payMethod: payMethodKey,
						code: res.code,
						usePrepayment: isUsePrepayment,
						clientId: 'cmini'
					},
					header: {
						Authorization: token,
						deviceId: uni.getStorageSync('APP-UUID'),
						'mfa-verify-ticket': ticket,
						VERSION: 'A'
					},
					success: (result) => {
						if (result.data.code == 0) {
							var that = this
							const data = JSON.parse(result.data.data.payInfo)
							this.orderInfo = result.data.data
							this.authToken = token
							if(result.payStatus === 'SUCCESS'){
								this.paysuccess = 2
								uni.hideLoading()
								return
							}
							if (result.data.data.splitFlag) {
								// 金额大于五万时 拆分支付订单
								that.payOrderNo = result.data.data.payOrderNo
								that.getPayInstallmentOrder(options)
								return
							}
							uni.hideLoading()
							uni.requestPayment({
								provider: 'wxpay',
								timeStamp: String(data.timeStamp),
								nonceStr: data.nonceStr,
								package: data.package,
								signType: data.signType,
								paySign: data.paySign,
								success: (res) => {
									this.paysuccess = 2
								},
								fail: (err) => {
									this.paysuccess = 1
									console.log('fail:' + JSON.stringify(err))
								}
							})
						} else {
							this.paysuccess = 1
							this.$util.toast(result.data)
						}
					},
					fail: (error) => {
						this.paysuccess = 1
						console.log(error)
					}
				})
			},
			// 支付找人订单
			payWorkOrder(res, options) {
				uni.showLoading()
				const {
					token,
					ticket,
					payMethodKey,
					orderInfo,
					amount
				} = options
				uni.request({
					url: base.apiUrl + 'order/customer/pay/order',
					method: 'POST',
					data: {
						amount,
						orderId: orderInfo,
						payMethod: payMethodKey,
						code: res.code,
						clientId: 'cmini',
					},
					header: {
						Authorization: token,
						'mfa-verify-ticket': ticket,
						deviceId: uni.getStorageSync('APP-UUID'),
						VERSION: 'A'
					},
					success: (result) => {
						uni.hideLoading()
						if (result.data.code == 0) {
							const data = JSON.parse(result.data.data.payInfo)
							this.orderInfo = result.data.data
							uni.requestPayment({
								provider: 'wxpay',
								timeStamp: String(data.timeStamp),
								nonceStr: data.nonceStr,
								package: data.package,
								signType: data.signType,
								paySign: data.paySign,
								success: (res) => {
									this.paysuccess = 2
								},
								fail: (err) => {
									this.paysuccess = 1
									console.log('fail:' + JSON.stringify(err))
								}
							})
						} else {
							this.paysuccess = 1
							this.$util.toast(result.data)
						}
					},
					fail: (error) => {
						this.paysuccess = 1
						console.log(error)
					}
				})
			},
			// 服务端充值
			payDeposit(res, options) {
				uni.showLoading()
				const {
					amount,
					token,
					ticket,
					payMethodKey
				} = options
				uni.request({
					url: base.apiUrl + 'pay/account/person/applyDeposit',
					method: 'POST',
					data: {
						amount: amount,
						payMethodKey: payMethodKey,
						code: res.code,
						clientId: 'cmini'
					},
					header: {
						Authorization: token,
						'mfa-verify-ticket': ticket,
						deviceId: uni.getStorageSync('APP-UUID'),
						VERSION: 'A'
					},
					success: (result) => {
						if (result.data.code == 0) {
							uni.hideLoading()
							const data = JSON.parse(result.data.data)
							this.orderInfo = result.data.data
							uni.requestPayment({
								provider: 'wxpay',
								timeStamp: String(data.timeStamp),
								nonceStr: data.nonceStr,
								package: data.package,
								signType: data.signType,
								paySign: data.paySign,
								success: (res) => {
									this.paysuccess = 2
								},
								fail: (err) => {
									this.paysuccess = 1
									console.log('fail:' + JSON.stringify(err))
								}
							})
						} else {
							this.paysuccess = 1
							this.$util.toast(result.data)
						}
					},
					fail: (error) => {
						this.paysuccess = 1
						console.log(error)
					}
				})
			},
			// 支付质保金
			payRetention(res, options) {
				uni.showLoading()
				const {
					orderInfo,
					token,
					ticket,
					payMethodKey
				} = options
				uni.request({
					url: base.apiUrl + 'order/customer/pay/retention',
					method: 'POST',
					data: {
						amount: JSON.parse(orderInfo)['amount'],
						payMethod: payMethodKey,
						code: res.code,
						clientId: 'cmini'
					},
					header: {
						Authorization: token,
						'mfa-verify-ticket': ticket,
						deviceId: uni.getStorageSync('APP-UUID'),
						VERSION: 'A'
					},
					success: (result) => {
						uni.hideLoading()
						if (result.data.code == 0) {
							const data = JSON.parse(result.data.data.payInfo)
							this.orderInfo = result.data.data
							uni.requestPayment({
								provider: 'wxpay',
								timeStamp: String(data.timeStamp),
								nonceStr: data.nonceStr,
								package: data.package,
								signType: data.signType,
								paySign: data.paySign,
								success: (res) => {
									this.paysuccess = 2
								},
								fail: (err) => {
									this.paysuccess = 1
									console.log('fail:' + JSON.stringify(err))
								}
							})
						} else {
							this.paysuccess = 1
							this.$util.toast(result.data)
						}
					},
					fail: (error) => {
						this.paysuccess = 1
						console.log(error)
					}
				})
			},
			// 支付保险
			payInsurance(res, options) {
				uni.showLoading()
				const {
					orderInfo,
					token,
					ticket,
					payMethodKey
				} = options
				uni.request({
					url: base.apiUrl + 'order/insurancesetmealorder/pay',
					method: 'POST',
					data: {
						id: JSON.parse(orderInfo)['id'],
						payAmount: JSON.parse(orderInfo)['payAmount'],
						payMethod: payMethodKey,
						code: res.code,
						clientId: 'cmini'
					},
					header: {
						Authorization: token,
						'mfa-verify-ticket': ticket,
						deviceId: uni.getStorageSync('APP-UUID'),
						VERSION: 'A'
					},
					success: (result) => {
						uni.hideLoading()
						if (result.data.code == 0) {
							const data = JSON.parse(result.data.data.payInfo)
							this.orderInfo = result.data.data
							uni.requestPayment({
								provider: 'wxpay',
								timeStamp: String(data.timeStamp),
								nonceStr: data.nonceStr,
								package: data.package,
								signType: data.signType,
								paySign: data.paySign,
								success: (res) => {
									this.paysuccess = 2
								},
								fail: (err) => {
									this.paysuccess = 1
									console.log('fail:' + JSON.stringify(err))
								}
							})
						} else {
							this.paysuccess = 1
							this.$util.toast(result.data)
						}
					},
					fail: (error) => {
						this.paysuccess = 1
						console.log(error)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		position: relative;

		.payinfo {
			position: absolute;
			z-index: 666;
			top: 150rpx;
			width: 100%;

			.wait_content {
				margin: 0 5%;
				width: 90%;
				background: #ffffff;
				box-shadow: 0rpx 5rpx 20rpx 0rpx rgba(0, 0, 0, 0.06);
				border-radius: 50rpx;
				text-align: center;
				padding: 86rpx 0;

				.wait_icon {
					width: 75rpx;
					height: 75rpx;
					margin: auto;
				}

				.wait {
					font-size: 28rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 500;
					color: #000000;
					line-height: 34rpx;
					text-align: center;
					margin: 30rpx 0 0 0;
				}
			}
		}
	}

	.company {
		background-color: #000;
		height: 300rpx;
		width: 100%;
		border-bottom-left-radius: 100rpx;
		border-bottom-right-radius: 100rpx;
		padding: 30rpx 0 0 0;

		.pay_logo {
			width: 106rpx;
			height: 36rpx;
			margin: 25rpx auto;
		}
	}

	.order_info {
		margin: 50rpx 36rpx 0 36rpx;
	}

	.order_no,
	.order_amount {
		display: flex;
		justify-content: space-between;
		border-top: 1rpx solid #f0f0f0;
		padding: 38rpx 0;
		font-size: 24rpx;
	}

	.order_amount {
		border-bottom: 1rpx solid #f0f0f0;
	}

	.backbtn {
		width: 40%;
		background-color: #fff;
		color: #fe6e32;
		margin: 0 20rpx;
		font-size: 28rpx;
		margin: 30rpx auto;
		padding: 10rpx 0;
		border: 1rpx solid #fe6e32;
		border-radius: 20rpx;
	}

	.minibtn {
		width: 40%;
		margin: 0 20rpx;
		background-color: #fff;
		color: #000;
		border: 1rpx solid #000;
		font-size: 28rpx;
		margin: 100rpx auto 0 auto;
		padding: 10rpx 0;
		border-radius: 20rpx;
	}
</style>
