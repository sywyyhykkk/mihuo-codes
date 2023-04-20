<template>
	<view class="recharge">
		<view class="top-contain">
			<view class="item-top" v-if="option.typeName !== '申请退款'">
				<text class="item-name">转入金额</text>
			</view>
			<view class="input-contain" v-if="option.typeName !== '申请退款'">
				<text class="item-symbol">￥</text>
				<u-input :clearable="false" class="item-input" v-model="form.amount" type="digit" :border="false"
					placeholder="请输入金额" placeholder-style="color:#999999" @input="setInput" @blur="setBlur" />
			</view>
			<view class="no-price" v-if="option.typeName !== '申请退款'">
				剩余{{option.amount}}未缴清
			</view>
			<view class="no-price" v-if="option.typeName == '申请退款'">
				申请金额{{option.retentionAmount}}
			</view>
		</view>
		<view class="desc-contian">
			<text class="item-desc">备注</text>
			<view class="public-item-bottom">
				<u-input v-model="form.applyRemark" class="describe-input" maxlength="200" height="140" type="textarea"
					placeholder="请输入备注" :border="true" />
			</view>
		</view>

		<view class="pay-contain" v-if="option.typeName !== '申请退款'">
			<view class="model-contain">
				<view class="text-title">选择支付方式</view>
				<view class="list-contain">
					<view class="item-settlement-way" v-for="(item,index) in paymentMethodList" :key="index">
						<view class="way-left">
							<image :src="item.image" class="balance"></image>
							<text>{{item.name}}</text>
						</view>
						<u-checkbox v-model="item.checkbox" shape="circle" :name="item.value" size="40rpx"
							@change="getCheckbox">
						</u-checkbox>
					</view>
				</view>
			</view>
			<view class="verification-code" v-if="verifyCodeShow">
				<view class="item-label">验证码</view>
				<u-input input-align="right" :clearable="false" class="item-input" v-model="verifyCode" type="digit"
					:border="false" placeholder="请输入验证码" placeholder-style="color:#999999" />
				<text class="item-send">{{send}}</text>
			</view>
		</view>
		<!-- <view class="item-seccetion">
			<text class="item-title">特别说明</text>
			<text class="desc-contain">
				尽请期待。。。
			</text>
		</view> -->

		<bottom-button :title="setTitle" @click="addOffer(setTitle)"></bottom-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				option: {},
				verifyCode: '',
				payOrderNo: '',
				timer: null,
				times: 60,
				send: '',
				verifyCodeShow: false,
				paymentMethodList: [{
						name: '支付宝支付',
						value: 4,
						image: '/static/images/order_details/large_ali.png',
						checkbox: false
					},
					{
						name: '微信小程序支付',
						value: 3,
						image: '/static/images/order_details/large_wx.png',
						checkbox: false
					},
					{
						name: '余额支付',
						value: 6,
						image: '/static/images/balance.png',
						checkbox: false
					}
				],
				form: {
					amount: 0,
					payMethod: '',
					applyRemark: '',
					// activePayName: ''
				}
			}
		},
		computed: {
			setTitle() {
				if (this.option.typeName == '质保金充值') {
					if (this.verifyCodeShow) {
						return '确认'
					} else {
						return '确认转入'
					}
				} else {
					return '确认申请'
				}
			}
		},
		mounted() {

		},
		onShow() {

		},
		onLoad(option) {
			this.option = option
			this.setForm()
		},
		onUnload() {
			clearInterval(this.timer);
			this.timer = null
		},
		methods: {
			setForm() {
				if (this.option.typeName == '申请退款') {
					this.form.amount = this.option.retentionAmount
				} else {
					this.form.amount = this.option.amount
				}
			},
			setInput(value) {
				this.$setInput((result) => {
					this.form.amount = result
				}, value)
			},
			setBlur(value) {
				this.$setBlur((result) => {
					this.form.amount = result
				}, value)
			},
			addOffer(item) {
				if (item == '确认转入') {
					if (!this.form.payMethod) {
						this.$util.toast("请选择支付方式");
						return
					}
					switch (this.form.payMethod) {
						case 3:
							setTimeout(() => {
								this.goBack()
							}, 3500)
							console.log(this.form)
							this.$util.requestPay(this.form.payMethod, this.form, 'retention')
							break
						case 4:
							this.$httpApi.retention(this.form).then(res => {
								if (res) {
									setTimeout(() => {
										this.goBack()
									}, 3500)
									this.$util.requestPay(this.form.payMethod, res.payInfo, '')
								}
							})
							break
						case 6:
							this.$httpApi.retention(this.form).then(res => {
								if (res) {
									switch (res.payStatus) {
										case 'FAIL':
											this.$util.toast(res.payInfo);
											break
										case 'PENDING':
											this.verifyCodeShow = true
											this.payOrderNo = res.payOrderNo
											this.$util.toast("验证码发送成功~");
											this.setTimer()
											break
										case 'SUCCESS':
											this.$util.toast("操作成功");
											break
									}
								}
							})
							break
					}
				} else if (item == '确认申请') {
					this.$httpApi.userApplyWithdraw(this.form).then(res => {
						if (res) {
							this.$util.toast("操作成功,将返回上一页~");
							setTimeout(() => {
								this.goBack()
							}, 1000)
						}
					})
				} else {
					this.$httpApi.payConfirm({
						bizOrderNo: this.payOrderNo,
						verifyCode: this.verifyCode
					}).then(res => {
						if (res) {
							this.$util.toast("操作成功,将返回上一页~");
							this.verifyCodeShow = false
							setTimeout(() => {
								this.goBack()
							}, 1000)
						}
					})
				}
			},
			setTimer() {
				this.timer = setInterval(() => {
					this.times--;
					if (this.times <= 0) {
						clearInterval(this.timer);
						this.times = 60;
					} else {
						this.send = this.times + '秒后重试';
						if (this.times == 1) {
							this.send = ''
							clearInterval(this.timer);
						}
					}
				}, 1000)
			},
			getCheckbox(item) {
				this.form.payMethod = item.name
				this.paymentMethodList.forEach(el => {
					if (el.value !== item.name) {
						el.checkbox = false
					} else {
						this.activePayName = el.name
					}
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */
	.recharge {
		padding-top: 12rpx;




		.top-contain {
			border-radius: 10rpx;
			background: #FFFFFF;
			padding: 34rpx 30rpx 32rpx 30rpx;

			.item-top {
				margin-bottom: 20rpx;

				.item-name {
					color: #909299;
					font-size: 26rpx;
				}
			}

			.input-contain {
				display: flex;
				align-items: center;
				border-bottom: 2rpx solid #F6F6F6;

				.item-symbo {
					color: #303133;
					font-size: 40rpx;
				}

				/deep/ .uni-input-input {
					color: #303133;
					font-size: 40rpx;
				}

			}

			.no-price {
				color: #002FA5;
				font-size: 28rpx;
				margin-top: 26rpx;
			}
		}



		.desc-contian {
			border-radius: 10rpx;
			background: #FFFFFF;
			padding: 24rpx 32rpx 38rpx 34rpx;
			margin-top: 4rpx;

			.item-desc {
				font-size: 28rpx;
				color: #303133;
				margin-bottom: 14rpx;
				display: inline-block;
			}

			.public-item-bottom {
				background-color: #F7F7F7;

				.u-input {
					border: 0rpx;
				}
			}
		}

		.pay-contain {
			.model-contain {
				padding-bottom: 52rpx;

				.balance {
					width: 40rpx;
					height: 40rpx;
					margin-right: 20rpx;
				}

				.text-title {
					font-size: 30rpx;
					color: #303133;
					height: 116rpx;
					display: flex;
					align-items: center;
					padding-left: 40rpx;
					border-bottom: 2rpx solid #F6F6F6;
				}

				.item-settlement-way {
					background: #FFFFFF;
					border-radius: 5px 5px 0px 0px;
					padding: 42rpx 32rpx;
					display: flex;
					justify-content: space-between;
					border-bottom: 2rpx solid #F6F6F6;

					&:last-child {
						margin-bottom: 0rpx;
						border-bottom: 0px;
					}

					.way-left {
						display: flex;

					}

					/deep/ .u-checkbox {
						display: initial;
					}
				}

				.item-button {
					margin: 0rpx 44rpx;
					width: 460rpx;
					height: 72rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 10rpx;
					background-color: #C8D8FF;
					font-size: 26rpx;
					color: #002FA5;
				}
			}

			.verification-code {
				background-color: #fff;
				display: flex;
				align-items: center;
				padding: 20rpx 40rpx;

				.item-label {
					font-size: 28rpx;
					color: #303133;
				}

				.item-send {
					font-size: 28rpx;
					color: #303133;
				}
			}
		}

		.item-seccetion {
			padding: 42rpx;
			display: flex;
			flex-direction: column;

			.item-title {
				color: #606166;
				font-size: 28rpx;
				margin-bottom: 14rpx;
			}

			.desc-contain {
				color: #909199;
				font-size: 28rpx;
			}
		}


	}
</style>
