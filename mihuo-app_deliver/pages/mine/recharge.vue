<template>
	<view>
		<z-nav-bar>
			<view class="nav-bar" slot="default">充值</view>
			<view class="icon_setUp" slot="right" @click="goRechargeRecord">
				充值记录
			</view>
		</z-nav-bar>
		<view class="amount_view">
			<view class="title">充值金额</view>
			<view class="amount">
				<view class="amount_item" :class="selectCurrent===index?'isSelect':''" @click="selection(item,index)"
					v-for="(item,index) in amountList" :key="index">
					充{{item}}
				</view>
			</view>
			<view class="title">自定义金额</view>
			<input class="inp_view" placeholder="请输入充值金额" placeholder-style="color:#999999;font-size:28rpx"
				type="digit" v-model="amount" @input="checkNum" :maxlength="maxlength" />
		</view>
		<view class="pay_title">选择支付方式</view>
		<view class="pay_view">

			<view class="pay_type">
				<view class="pay_item align-center" v-for="(item,index) in payList" :key="index">
					<view class="left align-center">
						<image :src="item.payIcon" mode=""></image>
						<view class="pay_name">{{item.payName}}</view>
					</view>
					<view class="right">
						<u-radio-group v-model="value">
							<u-radio :active-color="$styleColor.themeColor" :name="item.value"
								@change="radioGroupChange" />
						</u-radio-group>
					</view>
				</view>
			</view>
		</view>
		<!-- <view class="explain">充值说明</view>
		<view class="explain_con">说明内容</view> -->

		<view class="btm_btn">
			<button class="cancel" @click="cancel">取消</button>
			<button class="confirm" @click="goRecharge">充值</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				value: 0,
				popupType: false,
				maxlength: 11,
				amount: null,
				selectCurrent: -1,
				amountList: [500, 1000, 2000, 5000, 10000, 20000],
				payList: [{
						payIcon: '/static/images/mine/ali_pay.png',
						payName: '支付宝支付',
						value: 4
					},
					{
						payIcon: '/static/images/mine/wx_pay.png',
						payName: '微信小程序支付',
						value: 3
					},
					// {payIcon:'/static/images/mine/yl_pay.png',payName:'银联支付',value:},
				],
				payMoney: 0
			}
		},

		methods: {
			//默认充值金额
			defaultMoney() {
				this.amountList.map((m, i) => {
					if (i === 0) {
						this.payMoney = m
					}
				})
			},

			radioGroupChange(value) {
				this.value = value //支付方式：1-微信扫码，2-微信APP，3-微信小程序，4-支付宝扫码，5-支付宝APP
			},

			goPay(payType, orderInfo) {
				if (payType==='alipay' && this.value===4) {
					let urllink = `alipays://platformapi/startapp?saId=10000007&qrcode=${orderInfo}?_s=web-other`;
					let platform = uni.getSystemInfoSync().platform; //获取平台判断
					if (platform == 'android') {
						plus.runtime.openURL(urllink)
					} else if (platform == 'ios') {
						plus.runtime.launchApplication({
							action: urllink
						})
					}
				} else if (payType==='wxpay' && this.value===2) {
					console.log('微信支付')
				}
			},

			finalConfirm() {
				let param = {
						amount: Number(this.payMoney),
						payMethodKey: this.value
					},
					payType = '';
				if (this.value === 3) {
					plus.share.getServices( res => {
							let sweixin = null;
							for (let i in res) {
								if (res[i].id == 'weixin') {
									sweixin = res[i];
								}
							}
							//唤醒微信小程序
							if (sweixin) {
								let miniProgramType = process.env.NODE_ENV === 'production' ? 0 : 1
								const userInfo = uni.getStorageSync('userInfo');
								const token = userInfo.token_type + ' ' + userInfo.access_token;
								const search =
									`amount=${Number(this.payMoney)}&payMethodKey=${this.value}&token=${token}`
								sweixin.launchMiniProgram({
									id: 'gh_b091d7f9d23e', //
									type: miniProgramType, //小程序版本  0-正式版； 1-测试版； 2-体验版。
									path: `pages/wxPay/wxPay?${search}` //小程序的页面,用传的参数在小程序接值判断跳转指定页面
								});
							}
						}
					);
				} else {
					this.$http.post("pay/account/person/applyDeposit", param).then( res => {
						if (res) {
							this.popupType = 2;
							// #ifdef APP-PLUS
							if (this.value === 4) {
								payType = 'alipay'
								//判断如果安装了支付宝跳转到支付宝app 否则跳转到下载页
								if (plus.runtime.isApplicationExist({
										pname: 'com.eg.android.AlipayGphone',
										action: 'alipay://'
									})) {
									this.goPay(payType, res)
								} else {
									uni.showToast({
										title: '您还未安装支付宝，请先去安装',
										icon: 'none'
									});
								}
							} else if(this.value === 2){
								payType = 'wxpay'
								//判断如果安装了微信跳转到微信app 否则跳转到下载页
								if (plus.runtime.isApplicationExist({
										pname: 'com.tencent.mm',
										action: 'weixin://'
									})) {
									this.goPay(payType, res)
								} else {
									uni.showToast({
										title: '您还未安装微信，请先去安装',
										icon: 'none'
									});
								}
							}
							// #endif
						}
					})
				}
			},

			goRechargeRecord() {
				this.toPage("/pages/mine/rechargeRecord")
			},
			cancel() {
				uni.navigateBack()
			},

			goRecharge() {
				if (!this.payMoney || !this.amount) {
					uni.showToast({
						title: '请选择充值金额或输入充值金额',
						icon: 'none'
					});
					return;
				}
				if (!this.value) {
					uni.showToast({
						title: '请选择支付方式',
						icon: 'none'
					});
					return;
				}
				this.finalConfirm()
				// this.popupType = true
			},
			checkNum(e) {
				let value = e.detail.value;
				let dot = value.indexOf('.'); //包含小数点
				let reg = /^[0-9]+$/; //正整数
				if (dot > -1) {
					this.maxlength = dot + 3; //长度是小数点后两位
				}
				if (reg.test(value)) { //如果是正整数不包含小数点
					this.maxlength = 8;
				}
				if(!value){
					this.selectCurrent = -1
				}
				this.payMoney = this.amount
			},
			selection(item, i) {
				this.selectCurrent = i
				this.payMoney = item
				this.amount = item
			}
		}
	}
</script>

<style lang="scss" scoped>
	.nav-bar {
		font-weight: bold;
		font-size: 36rpx;
		color: $fontColor33;
	}

	.icon_setUp {
		font-weight: bold;
		font-size: $middleFontSize;
		line-height: 40rpx;
		color: #909299;
		margin-right: 20rpx;
	}

	.amount_view {
		height: 297px;
		margin-top: 16rpx;
		background: #FFFFFF;

		.title {
			padding: 24rpx 44rpx;
			font-weight: 400;
			font-size: $middleAddFontSize;
			color: $fontColor33;
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

		.inp_view {
			height: 100rpx;
			margin: 0 20rpx 0 40rpx;
			padding: 0 28rpx;
			background: #F6F7F9;
			border-radius: $middleBorderRadius;
		}
	}

	.pay_title {
		margin-left: 40rpx;
		font-weight: 400;
		font-size: $middleAddFontSize;
		line-height: 100rpx;
		color: $seconFontColor;
	}

	.pay_view {
		background: #FFFFFF;
		border-radius: $smallBorderRadius;
		margin: 0 20rpx;

		.pay_item {
			height: 104rpx;
			justify-content: space-between;

			.left {
				.pay_name {
					margin-left: 20rpx;
					font-size: $middleFontSize;
					color: $seconFontColor;
				}

				image {
					width: 40rpx;
					height: 40rpx;
					margin-left: 32rpx;
				}
			}

			.right {}
		}

	}

	.explain {
		text-align: center;
		margin: 0 auto;
		padding-top: 56rpx;
		color: $fontColor33;
	}

	.explain_con {
		height: 264rpx;
		margin: 14rpx 96rpx 14rpx;
		line-height: 20px;
		font-size: $middleFontSize;
		color: $fontColor99;
		overflow-y: scroll;
	}

	.btm_btn {
		width: 100%;
		margin-top: 200rpx;
		position: fixed;
		bottom: 0;
		display: flex;
		justify-content: center;
		align-items: center;

		button {
			width: 268rpx;
			height: 88rpx;
			margin: 0 12rpx;
			line-height: 88rpx;
			font-size: $middleFontSize;
			border-radius: $miniBorderRadius;
		}

		.cancel {
			color: #909299;
			border: 2rpx solid #E0E0E0;
			background: #FFFFFF;
		}

		.confirm {
			color: #FFFFFF;
			background: $themeColor;
		}
	}

	.align-center {
		display: flex;
		align-items: center;
	}
</style>
