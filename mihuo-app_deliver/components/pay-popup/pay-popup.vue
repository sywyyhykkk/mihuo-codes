<template>
	<view class="popup">
		<view class="popup_with">
			<view class="popup_title">
				<span>{{!needVerify||type?'请输入支付密码':'请输入验证码'}}</span>
				<image src="/static/images/mine/popup_cancel.png" class="popup_cancel" @click="popupCancel">
			</view>

			<view v-if="money">
				<view class="popup_hint">本次提现</view>
				<view class="popup_money">￥<text>{{money}}</text></view>
				<view class="popup_border"></view>
				<view class="cover_charge">
					<view class="cover_charge_text">服务费</view>
					<view class="cover_charge_value">￥{{serviceCharge}}元</view>
				</view>
			</view>

			<!-- 支付密码 -->
			<view style="margin-top: 30rpx;" v-if="!needVerify||type">
				<u-message-input mode="box" :dot-fill="true" :focus="true" :active-color="$styleColor.themeColor"
					inactive-color="#eeeeee" :disabled-keyboard="false" :maxlength="maxlength" :bold="false"
					@finish="payInpFinish" v-model="password" />
				<view class="forget_psw" @click="toFind">忘记密码？</view>
			</view>

			<!-- 验证码 -->
			<view v-else>
				<view class="inputItem">
					<view class="title">绑定手机号</view>
					<view class="info">
						<input placeholder="" disabled placeholder-style="font-size:26rpx;color:#999"
							v-model="mobile" />
						<button @click="getCode">{{ codeText }}</button>
					</view>
				</view>
				<u-message-input mode="bottomLine" :focus="true" @finish="yzmInpFinish" v-model="temCode"
					:active-color="$styleColor.themeColor" inactive-color="#eeeeee" :disabled-keyboard="false"
					:maxlength="maxlength" :bold="false" />

				<view class="confirm_btn">
					<button @click="confirm">确认</button>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	var clear;
	import {
		encryption
	} from '@/plugins/utils.js';
	export default {
		name: "pay-popup",
		props: {
			needVerify: {
				type: Boolean,
				default: false
			},
			showNum: {
				type: Number,
				default: 0
			},
			//提现金额
			money: {
				type: [Number, String],
				default: ''
			},
			paramInfo: {
				type: Object,
				default: () => {
					return {}
				}
			},
			serviceCharge: {
				type:[String,Number],
				default: 0
			}
		},
		
		data() {
			return {
				password: '',
				temCode:'',
				code: '',
				maxlength: 6,
				readonly: false,
				codeText: '获取验证码',
				mobile: '',
				sessionKey: '',
				type: 0,
			}
		},

		mounted() {
			this.getUserPone()
		},

		methods: {
			//验证支付密码
			checkPayPwd() {
				let temCode = this.paramInfo.code,
					temSessionkey = this.paramInfo.sessionKey
				this.$http.post("admin/mfa/verify/ppwd",{
					password: this.password,
					smsCode: this.code ? this.code : temCode ? temCode : '',
					smsSessionKey: this.sessionKey ? this.sessionKey : temSessionkey ? temSessionkey : ''
				}).then(res => {
					if (res) {
						console.log('ticket',res.mfaVerifyTicket)
						this.$emit('popupCancel', false)
						this.$emit('finalConfirm', 2, false ,res.mfaVerifyTicket)
						this.password = ''
					}
				}).catch(err => {
					this.password = ''
					if(err&&this.needVerify){
						this.type = 0
						this.$util.toast(err.errMsg)
					}
				})
			},

			// 验证码确认
			confirm() {
				if (this.temCode.length === 6) {
					this.type = 1
					this.temCode = ''
				}
			},

			//获取用户手机号
			getUserPone() {
				this.$http.get("admin/mfa/info/get").then(res => {
					this.mobile = res.phone
				})
			},

			//验证码按钮文字状态
			getCodeState() {
				const _this = this;
				this.readonly = true;
				this.codeText = '60s';
				var s = 60;
				clear = setInterval(() => {
					s--;
					_this.codeText = s + 's';
					if (s <= 0) {
						clearInterval(clear);
						_this.codeText = '获取验证码';
						_this.readonly = false;
					}
				}, 1000);
			},

			//获取验证码
			getCode() {
				if (this.readonly) {
					uni.showToast({
						title: '验证码已发送',
						icon: 'none'
					});
					return;
				}
				// if (this.mobile == '') {
				// 	uni.showToast({
				// 		title: '请输入手机号',
				// 		icon: 'none'
				// 	});
				// 	return;
				// }
				// if (!this.$base.phoneRegular.test(this.mobile)) {
				// 	uni.showToast({
				// 		title: '手机号格式不正确',
				// 		icon: 'none'
				// 	});
				// 	return;
				// }
				this.$http.post("admin/mfa/smscode/send").then(res => {
					if (res) {
						this.sessionKey = res.sessionKey
						this.getCodeState();
					}
				});
			},

			// 支付密码输入完成
			payInpFinish(e) {
				if (e.length === 6) {
					this.password = e
					this.checkPayPwd()
				}
			},

			// 验证码输入完成
			yzmInpFinish(e) {
				if (e.length === 6) {
					this.code = e;
					this.temCode = e
				}
			},

			popupCancel() {
				this.$emit('popupCancel', false)
			},
			toFind() {
				uni.navigateTo({
					url: '/pages/setting/resetPayPassword'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.popup {
		position: fixed;
		bottom: 0;
		left: 0;
		top: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 333;

		.popup_with {
			position: absolute;
			// height: 516rpx;
			left: 46rpx;
			right: 46rpx;
			top: 20%;
			background: #FFFFFF;
			border-radius: 30rpx;
			padding: 30rpx 20rpx 0 20rpx;

			.forget_psw {
				font-weight: 400;
				font-size: $middleFontSize;
				line-height: 40rpx;
				text-align: right;
				color: $viceFontColor;
				margin: 30rpx 0;
			}

			.popup_title {
				font-weight: 400;
				font-size: $middleAddFontSize;
				line-height: 40rpx;
				text-align: center;
				color: $mainFontColor;
				position: relative;

				.popup_cancel {
					position: absolute;
					top: -10rpx;
					right: 10rpx;
					// float: right;
					width: 50rpx;
					height: 50rpx;
					margin-left: -50rpx;
				}
			}

			.popup_hint {
				margin-top: 30rpx;
				font-weight: 400;
				font-size: $middleAddFontSize;
				line-height: 40rpx;
				text-align: center;
				color: $mainFontColor;
			}

			.popup_money {
				font-weight: 900;
				font-size: $middleFontSize;
				line-height: 68rpx;
				text-align: center;
				color: $themeColor;
				margin-bottom: 20rpx;
				text{
					font-size: 48rpx;
					color: $themeColor;
				}
			}

			.popup_border {
				height: 2rpx;
				background: #EEEEEE;
			}

			.cover_charge {
				padding: 30rpx 40rpx 0 40rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.cover_charge_text {
					font-weight: 400;
					font-size: $middleFontSize;
					line-height: 40rpx;
					color: $viceFontColor;
					
				}

				.cover_charge_value {
					font-weight: 400;
					font-size: $middleFontSize;
					line-height: 40rpx;
					color: $viceFontColor;
					
				}
			}

			.num {
				width: 80rpx;
				height: 80rpx;
				// background: #f1f1f1;
				margin-right: calc((16.6% - 80rpx)/2);
				margin-left: calc((16.6% - 80rpx)/2);
				border-radius: 10rpx;
				border: solid 2rpx #EEEEEE;
				display: flex;
				justify-content: center;
				align-items: center;
				position: relative;
				float: left;
			}
		}
	}

	.inputItem {
		background-color: #fff;
		display: flex;
		align-items: center;
		padding: 0 25rpx;
		margin-top: 30rpx;
		border-top: 1px solid #f5f5f5;

		.photograph {
			width: 44rpx;
			height: 44rpx;
			margin-right: 18rpx;
		}
	}

	.inputItem .title {
		width: 120rpx;
		height: 100rpx;
		text-align: left;
		line-height: 100rpx;
		flex-shrink: 0;
		font-size: $middleFontSize;
		white-space: nowrap;
		margin-right: 32rpx;
		color: $fontColor33;
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
		width: 100%;
	}

	.inputItem .info button {
		height: 60rpx;
		line-height: 60rpx;
		font-size: 28rpx;
		flex-shrink: 0;
		padding: 0 15rpx;
		color: #fff;
		@include theme('btn_bg');
		color: #fff;
		border-radius: 8rpx;
	}

	.confirm_btn {
		padding: 30rpx;
		text-align: center;

		button {
			width: 136rpx;
			height: 60rpx;
			display: inline-block;
			line-height: 60rpx;
			font-size: 28rpx;
			flex-shrink: 0;
			padding: 0 15rpx;
			color: #fff;
			@include theme('btn_bg');
			color: #fff;
			border-radius: 8rpx;
		}
	}
</style>
