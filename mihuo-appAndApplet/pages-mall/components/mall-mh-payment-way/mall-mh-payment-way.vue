<template>
	<view class="payment-cotainer">
		<view class="items">
			<mall-mh-menu-item v-if="isShowPrepayment" style="border-radius: 16rpx 16rpx 0 0; margin-bottom: 2rpx;" title="预付款抵扣" :height="88" :isShowArrow="false" border>
				<view class="slot-content flex-center" style="justify-content: space-between;">
					<view class="left">
						余额: ¥{{ prePaymentAmount }}
					</view>
					<u-switch :disabled="prePaymentAmount === 0" v-model="isUsePrepayment" size="36" active-color="#ff5d35" @change="onChangePrepayment"></u-switch>
				</view>
			</mall-mh-menu-item>
			<!-- #ifndef MP-WEIXIN -->
			<view class="item flex-center">
				<image src="https://www.51mihuo.com/static/icon/alipay.png" class="icon"></image>
				<text>支付宝支付</text>
				<u-checkbox v-model="isAliPay" @change="onChangePayWay($event, 0)" shape="circle">
				</u-checkbox>
			</view>
			<view class="item flex-center">
				<image src="https://www.51mihuo.com/static/icon/wechatpay.png" class="icon"></image>
				<text>微信小程序支付</text>
				<u-checkbox v-model="isWechatPay" @change="onChangePayWay($event, 1)" shape="circle"></u-checkbox>
			</view>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 是否显示预付款选项
			isShowPrepayment: {
				type: Boolean,
				default: false
			}
		},
		data (){
			return {
				prePaymentAmount: 0,
				isUsePrepayment: false,
				selectedPaymentWay: -1, // // 1-微信扫码，2-微信原生App，3-微信小程序，4-支付宝扫码，5-支付宝原生App，6-余额
				isAliPay: false,
				isWechatPay: false,
			}
		},
		mounted() {
			this.paymentInit()
			this.getPrepaymentAmount()
		},
		methods: {
			// 获取预付款余额
			getPrepaymentAmount(){
				this.$httpApi.getUserPrepaymentAmount().then(res => {
					this.prePaymentAmount = res
				})
			},
			// 选择预付款
			onChangePrepayment(){
				this.$emit('selectPrepayment', this.isUsePrepayment)
			},
			emitData(){
				this.$emit('selectPaymentWay', this.selectedPaymentWay)
			},
			// 支付方式init
			paymentInit() {
				// #ifndef MP
				// 默认支付宝支付
				this.isAliPay = true;
				this.selectedPaymentWay = 4;
				// #endif
				// #ifdef MP-WEIXIN
				this.selectedPaymentWay = 3;
				this.isWechatPay = true;
				// #endif
				this.emitData()
			},
			// 更改支付方式
			onChangePayWay(e, index){
				if (!e.value) {
					this.selectedPaymentWay = -1;
					if (index === 0) {
						this.isAliPay = !e.value;
						this.isWechatPay = e.value;
					} else if (index === 1) {
						this.isWechatPay = !e.value;
						this.isAliPay = e.value;
					}
				} else {
					if (index === 0) {
						// 支付宝
						this.selectedPaymentWay = 4;
						this.isAliPay = e.value;
						this.isWechatPay = !e.value;
					} else if (index === 1) {
						// 微信小程序
						this.selectedPaymentWay = 3;
						this.isWechatPay = e.value;
						this.isAliPay = !e.value;
					} else {
						this.isWechatPay = !e.value;
						this.isAliPay = !e.value;
					}
				}
				this.emitData()
			},
		}
	}
</script>

<style lang="scss" scoped>
	.payment-cotainer {
		height: max-content;
		margin-top: 30rpx;
		margin-bottom: 30rpx;
		
		.items {
			width: 690rpx;
			height: max-content;
	
			.item {
				width: 100%;
				height: 120rpx;
				justify-content: space-between;
				padding: 0 32rpx;
				background-color: #fff;
				margin-bottom: 2rpx;
	
				text {
					width: 80%;
					font-family: PingFang SC;
					font-style: normal;
					font-weight: bold;
					font-size: 28rpx;
					line-height: 40rpx;
					color: #333333;
				}
	
				.icon {
					width: 40rpx;
					height: 40rpx;
				}

				&:last-of-type {
					border-radius: 0 0 16rpx 16rpx;
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
			width: 140rpx;
			height: 40rpx;
			text-align: center;
			background: #FCEBE3;
			border-radius: 6rpx;
			font-size: 20rpx;
			font-family: Noto Sans S Chinese;
			font-weight: 500;
			color: #FE6E32;
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
	
	.flex-center {
		display: flex;
		align-items: center;
	}
	
</style>