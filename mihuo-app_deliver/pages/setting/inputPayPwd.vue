<template>
	<view class="content">
		<view class="main">
			<view class="item-code">
				<view class="item-phone">
					<view class="label">手机号码</view>
					<view class="value">{{phone}}</view>
				</view>
				<view class="message-authentication" @click="getCode('验证码')">
					<view class="left">短信验证</view>
					<view class="right">
						<u-input v-model="valueCode" type="number" :border="false" maxlength="6" @click="getInput"
							placeholder="请输入短信验证码" :clearable="false" />
						<view class="item-button" @click.stop="smscodeSend">{{send}}</view>
					</view>
				</view>
			</view>
			<!-- <view class="password-item" @click="getCode('密码')">
				<view class="title">验证支付密码</view>
				<view class="sub_title">请输入支付密码</view>
				<view class="input_view">
					<u-message-input mode="box" :value="passwordCode" :dot-fill="true" :focus="false"
						:active-color="$styleColor.themeColor" inactive-color="#eeeeee" :disabled-keyboard="true"
						:maxlength="numCodeLength" :bold="false" @change="pwChange" @finish="inpFinish" />
				</view>
				<view class="forget_btn" @click.stop="editPayPassword">忘记密码？</view>
			</view> -->
		</view>
		<!-- <u-keyboard ref="uKeyboard" v-model="keyboardShow" mode="number" @change="valChange" @backspace="backspace"
			:safe-area-inset-bottom="true" :mask-close-able="false" :tooltip="false" :dot-enabled="false" :mask="false">
		</u-keyboard> -->
		<bottom-button :style="`opacity: ${buttonShow ? 1 : 0.5}`" title="确认申请"  @click="submit()"></bottom-button>
		
		<!-- <view class="submit-text" @click="submit" :style="`opacity: ${isDisabled ? 0.5 : 1}`">
			确认申请
		</view> -->
	</view>
</template>
<script>
	/**
	 *  @description 工人工费支付步骤
	 *  1.点击获取验证码  调用 order/costapply/payAmount接口(获取支付信息) =》order/costapply/pay(获取验证码)
	 *  2.获取到验收码，并输入完成时，确认支付按钮亮起
	 *  3.确认支付，调用payConfirm传入验证码、订单号
	 * */

	export default {
		data() {
			return {
				numCodeLength: 6,
				buttonShow:false,
				option: {},
				valueCode: '',
				passwordCode: '', // 密码
				verificationCode: '', // 验证码code
				keyboardShow: true,
				times: 60,
				sendType: false,
				mfaVerifyTicket: '',
				// codeShow: false,
				phone: '',
				codeType: '',
				payOrderNo:'',
				send: '获取验证码',
			}
		},
		watch: {
			valueCode: {
				handler(newVal, oldVal) {
					this.codeType = '验证码'
				}
			}
		},
		onReady() {
			if (this.option.operationType === '余额结算' && this.option.needVerify === '验证码校验') {
				this.keyboardShow = false
			} else {
				this.keyboardShow = true;
			}
		},
		onLoad(option) {
			this.option = option
			this.infoGet()
		},
		onShow() {
			this.initializePage()
		},
		methods: {
			getCode(type) {
				this.codeType = type
				if (type === '密码') {
					this.keyboardShow = true
				}
			},
			getInput() {
				this.codeType = '验证码'
				this.keyboardShow = false
			},
			infoGet() { // 获取用户信息
				this.$httpApi.infoGet().then(res => {
					if (res) {
						this.phone = res.phone
					}
				})
			},
			pwChange(e) {},
			inpFinish(e) {
				// #ifdef APP-PLUS
				this.payAmount()
				// #endif
			},
			initializePage() {
				uni.onWindowResize((res) => {
					plus.key.hideSoftKeybord()
				})
				this.codeType = '验证码'
				this.keyboardShow = false
				uni.setNavigationBarTitle({
					title: '输入验证码'
				})

				return
				if (this.option.operationType === '余额结算' && this.option.needVerify === '验证码校验') {
					this.codeShow = true
					this.codeType = '验证码'
					this.keyboardShow = false
					uni.setNavigationBarTitle({
						title: '输入验证码'
					})
				} else {
					this.codeShow = false
					this.codeType = '密码'
				}
			},
			valChange(val) {
				if (this.passwordCode.length < this.numCodeLength) {
					this.passwordCode += val;
					if (this.passwordCode.length == this.numCodeLength) {
						this.payAmount()
					}
				}
			},
			backspace() {
				if (this.codeType === '验证码') {
					if (this.valueCode.length) {
						this.valueCode = this.valueCode.substr(0, this.valueCode.length - 1);
						this.verificationCode = this.valueCode
					}
				} else {
					if (this.passwordCode.length) {
						this.passwordCode = this.passwordCode.substr(0, this.passwordCode.length - 1);
					}
				}

			},
			smscodeSend() { // 获取验证码
				if (this.sendType) {
					return;
				}
				this.$http.post(`order/costapply/payAmount`, [this.option.applyIds]).then(event => {
					if (event) {
						// 发起支付
						this.$http.post(`order/costapply/pay`, {
							applyIds: [this.option.applyIds],
							amount: event.amount,
							fee: event.fee,
							total: event.total,
						}).then(res => {
							if(res){
								// uni.setStorageSync("sessionKey", res.sessionKey)
								this.payOrderNo = res.payOrderNo
								const timer = setInterval(() => {
									this.times--;
									if (this.times <= 0) {
										this.send = '获取验证码';
										clearInterval(timer);
										this.times = 60;
										this.sendType = false;
									} else {
										this.send = this.times + '秒后重试';
										this.sendType = true;
									}
								}, 1000)
								this.buttonShow = true
								this.$util.toast("验证码发送成功");
							}
						})
					}
				})
				
				return
				this.$httpApi.smscodeSend().then(res => {
					if (res) {
						uni.setStorageSync("sessionKey", res.sessionKey)
						const timer = setInterval(() => {
							this.times--;
							if (this.times <= 0) {
								this.send = '获取验证码';
								clearInterval(timer);
								this.times = 60;
								this.sendType = false;
							} else {
								this.send = this.times + '秒后重试';
								this.sendType = true;
							}
						}, 1000)
						this.$util.toast("验证码发送成功");
					}
				})
			},
			submit(){
				if(!this.buttonShow){
					return
				}
				if ((this.valueCode.length == 0) || (this.valueCode.length > 0 && this.valueCode.length !== this
						.numCodeLength)) {
					this.$util.toast("验证码格式不正确");
					return
				}
				if(!this.payOrderNo){
					this.$util.toast("订单编号不能为空");
					return
				}
				this.$httpApi.payConfirm({
					bizOrderNo:this.payOrderNo,
					verifyCode:this.valueCode
				}).then(res =>{
					if(res){
						this.toPage('/pages/construction/laborCost/paySuccess')
					}
				})
			},
			payAmount() { // 校验用户-企业支付密码并获取ticket
				if (this.codeShow) {
					if ((this.valueCode.length == 0) || (this.valueCode.length > 0 && this.valueCode.length !== this
							.numCodeLength)) {
						this.$util.toast("验证码格式不正确");
						return
					}
				}
				this.$httpApi.corpVerifyPpwd({
					password: this.passwordCode,
					smsSessionKey: uni.getStorageSync('sessionKey'),
					smsCode: this.valueCode,
				}).then(res => {
					if (res) {
						// 查询支付金额
						this.$http.post(`order/costapply/payAmount`, [this.option.applyIds]).then(event => {
							if (event) {
								// 发起支付
								this.$http.post(`order/costapply/pay`, {
									applyIds: [this.option.applyIds],
									amount: event.amount,
									fee: event.fee,
									total: event.total,
								}, {
									header: {
										'mfa-verify-ticket': res.mfaVerifyTicket
									}
								}).then(res => {
									if (res == 0) {
										this.toPage('/pages/construction/laborCost/paySuccess')
									}
								})
							}
						})
					}
				})
			},
			editPayPassword() {
				this.toPage('/pages/setting/resetPayPassword')
			}
		}
	}
</script>

<style>
	page {
		height: 100%;
		background-color: #FFFFFF;
	}
</style>
<style lang="scss" scoped>
	@import '@/style/mixin.scss';


	.content {
		background: #FFFFFF;
	}

	.nav-bar {
		font-weight: bold;
		font-size: 36rpx;
		color: $fontColor33;
	}



	.main {
		// height: 90vh;
		position: relative;
		border-top: 2rpx solid rgb(238, 238, 238);

		.item-code {

			.item-phone {
				display: flex;
				background-color: #f5f5f5;
				align-items: center;
				padding: 40rpx 0rpx 26rpx 58rpx;

				.label {
					color: $seconFontColor;
					font-size: 30rpx;
					margin-right: 22rpx;
				}

				.value {
					color: #909199;
					font-size: 30rpx;
				}
			}

			.message-authentication {
				display: flex;
				padding: 28rpx 0rpx 28rpx 58rpx;
				align-items: center;
				border-bottom: 2rpx solid #f5f5f5;
				position: relative;
				z-index: 99999;

				.left {
					font-size: 30rpx;
					color: $seconFontColor;
					white-space: nowrap;
				}

				.right {
					display: flex;
					align-items: center;
					flex: 1;
					padding-left: 22rpx;
					padding-right: 20rpx;

					.item-button {
						color: #FFFFFF;
						background: #002FA5;
						border-radius: 5px;
						font-size: 13px;
						padding: 14rpx 24rpx;
					}
				}
			}
		}

		.password-item {
			padding: 34rpx 50rpx 0rpx 58rpx;
			position: relative;
			z-index: 99999;

			.title {
				font-size: 30rpx;
				color: $seconFontColor;
			}

			.sub_title {
				margin-top: 8rpx;
				font-weight: 400;
				font-size: $smiddleFontSize;
				color: $viceFontColor;
			}

			.input_view {
				margin-top: 30rpx;
			}

			.forget_btn {
				margin: 34rpx 46rpx 0 0;
				text-align: right;
				font-size: $smiddleFontSize;
				color: $themeColor;
				position: fixed;
				right: 0rpx;
				z-index: 99999;
			}
		}
	}
</style>
