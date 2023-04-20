<template>
	<view class="payment">
		<view class="amount_view">
			<view class="title">
				<text class="left">充值金额</text>
				<text v-if="!tipTextShow" class="right">缺货中</text>
			</view>

			<view class="amount">
				<view class="amount_item"
					:class="[selectCurrent===index?'isSelect':'', tipTextShow ? '':'amount_item_opactiy']"
					@click="selection(item,index)" v-for="(item,index) in amountList" :key="index">
					充{{item}}
				</view>
			</view>
			<view v-if="tipTextShow" class="item-price">
				<mihuo-input label="自定义金额" type="number" integer v-model="customPrice" placeholder="请输入充值金额"
					@input="priceInput"></mihuo-input>
			</view>
		</view>

		<view v-if="tipTextShow" class="item-form">
			<view class="item-phone">
				<mihuo-input required label="客户电话" v-model="form.phone" placeholder="请输入客户电话" @input="phoneInput">
				</mihuo-input>
			</view>
		</view>
		<mihuo-bottom-button :buttonList="getButtonList" @click="submit"></mihuo-bottom-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				option: {},
				selectCurrent: -1,
				amountList: [500, 1000, 2000, 5000, 10000, 20000],
				buttonList: [{
					name: '取消',
					status: false,
					display: false
				}, {
					name: '扫码充值',
					status: true,
					display: false
				}],
				list: [],
				productSkuId: '',
				orderDetails: '',
				skuPrice: 1,
				tipTextShow: false,
				payMoney: 0,
				customPrice: '',
				form: {
					phone: '',
					price: '',
					memberUserId: ''
				}
			}
		},
		computed: {
			getButtonList() {
				if (!this.tipTextShow) {
					return []
				}
				return this.buttonList

			}
		},
		mounted() {

		},
		onShow() {
			this.selectCustomerPage()
		},
		onLoad(option) {
			this.option = option
		},
		methods: {
			selection(item, i) {
				if (this.tipTextShow) {
					this.selectCurrent = i
					this.payMoney = item
					this.form.price = this.payMoney
					this.customPrice = ''
					this.getUpdateBySkus()
				}
			},
			phoneInput(event) {
				if (this.$base.phoneRegular.test(event)) {
					this.debounce(() => {
						this.$httpApi.userDetails(event).then((res) => {
							if (res) {
								this.memberUserId = res.userId
							}
						})
					}, 200)
				}
			},
			priceInput(event) {
				this.debounce(() => {
					this.form.price = this.customPrice
					this.selectCurrent = -1
					this.payMoney = ''
					this.getUpdateBySkus()
				}, 200)
			},
			selectCustomerPage() {
				let tempParameter = {
					cityOperatorId: uni.getStorageSync('cityOperatorId'),
					cityOperatorFlag: 2, // 	1=仅运营商商品，2=运营商及其下企业商品
					size: 20,
					verifyStatus: 1, // 审核通过
					current: 1,
					onlineState: 0,
					customCategory: '1025'
				}
				this.$httpApi.selectCustomerPage(tempParameter).then((res) => {
					if (res) {
						this.list = res.records
						this.getskuDetails()
					}
				})
			},
			getskuDetails() {
				let detailId = this.list[0].id
				if (!detailId) {
					return
				}
				this.$httpApi.selectProductDetails({
					id: detailId,
				}).then(res => {
					if (res) {
						// 查询是否有单价为 1元的 预付款商品，有则获取skuID，无 则提示 ‘需维护预付款商品’
						try {
							res.skuStocks.forEach(item => {
								if (item.price == this.skuPrice) {
									this.productSkuId = item.id
									throw e
								}
							})
							// 如果没有，则显示未配置优惠卷商品
							this.tipTextShow = false

						} catch (e) {
							//TODO handle the exception
							this.tipTextShow = true
							this.standardGenerateOrder()
						}
					}
				})
			},
			/**
			 * @description  自动生成预览单
			 * **/
			standardGenerateOrder() {
				if (!this.productSkuId) {
					return
				}
				let tempProducts = [{
					skuId: this.productSkuId,
					count: this.form.price || 1,
				}]

				let tempParameter = {
					enableDiffAmount: false,
					memberReceiveAddressId: -1,
					products: tempProducts,
					sourceType: 4 // 4=B端组合报价订单； 5=快速预算-模拟报价
				}
				this.$httpApi.standardGenerateOrder(tempParameter).then(res => {
					if (res) {
						this.orderDetails = res
					}
				})
			},
			submit(item) {
				if (item.name == '取消') {
					this.goBack()
					return
				}
				if (!this.form.price) {
					this.$util.toast('请选择或输入充值金额')
					return
				}
				if (!this.form.phone) {
					this.$util.toast('手机号码不能为空')
					return
				}
				if (!this.$base.phoneRegular.test(this.form.phone)) {
					this.$util.toast('手机号码格式不正确')
					return
				}

				this.standardOrderSave()
			},
			/**
			 * @description  提交订单
			 * **/
			standardOrderSave() {
				this.orderDetails['createServer'] = null
				this.orderDetails['memberUserId'] = this.memberUserId
				this.orderDetails['memberReceiveAddressId'] = -1
				this.$httpApi.standardOrderSave(this.orderDetails).then(res => {
					if (res) {
						this.toPage(
							`/pages/construction/clientBilling/paymentQrCode?payType=${1}&detailId=${res.orderIds[0]}&pageType=预付款`
							)
							
							// uni.redirectTo({
							// 	url:`/pages/construction/clientBilling/paymentQrCode?payType=${1}&detailId=${res.orderIds[0]}&pageType=预付款`
							// })
					}
				})
			},
			getUpdateBySkus() {
				if (!this.productSkuId) {
					return
				}
				if (this.orderDetails.companyOrders && this.orderDetails.companyOrders[0]) {
					let orders = this.orderDetails.companyOrders[0].orders[0]
					if (orders.orderItemList && orders.orderItemList[0]) {
						if (orders.orderItemList[0].skuStock) {
							orders.orderItemList[0].productQuantity = this.form.price
						}
					}
				}
				this.$httpApi.standardOrderCalculateAmount(this.orderDetails)
					.then((res) => {
						if (res) {
							this.orderDetails = res
						}
					})
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */
	.payment {
		.item-phone {
			background-color: #fff;
			padding: 20rpx 44rpx;
			margin-top: 10rpx;
		}

		.amount_item_opactiy {
			opacity: 0.5;
		}


		.amount_view {
			margin-top: 16rpx;
			background: #FFFFFF;
			padding: 10rpx 0rpx 40rpx 0rpx;

			.title {
				padding: 24rpx 44rpx;
				font-weight: 400;
				display: flex;
				justify-content: space-between;

				.left {
					font-size: $middleAddFontSize;
					color: $fontColor33;
				}

				.right {
					font-size: $middleAddFontSize;
					color: $fontColorPrice;
				}
			}

			.amount {
				margin-left: 44rpx;
				display: flex;
				flex-wrap: wrap;

				.amount_item {
					width: 30%;
					line-height: 90rpx;
					text-align: center;
					font-size: $middleFontSize;
					color: $fontColor66;
					margin: 0 16rpx 14rpx 0;
					border: 2rpx solid #E4E4E4;
					box-sizing: border-box;
					border-radius: $middleBorderRadius;
				}

				.isSelect {
					background: $themeColor;
					color: #FFFFFF;
					border: none;
				}
			}

			.item-price {
				padding: 0 44rpx;
				margin-top: 20rpx;
			}

		}
	}
</style>
