<template>
	<view>
		<public-module></public-module>
		<z-nav-bar fontColor="#333333" bgColor="#ffffff">
			<view slot="default" class="nav_bar">{{pegeType==='设置支付密码'?'设':'重'}}置支付密码</view>
		</z-nav-bar>
		<view class="hint_info">为了您的账户安全，请先完成身份验证</view>
		<view class="form_list" style="margin-top: 16rpx;">
			<view class="form_list_title">手机号</view>
			<input class="form_list_input" disabled @confirm="submitEidt" v-model="mobile" type="text"
				:placeholder="!mobile?'账户未绑定手机号':''" />
		</view>
		<view class="form_list">
			<view class="form_list_title">验证码</view>
			<input class="form_list_input2" @confirm="submitEidt" v-model="code" type="number" maxlength="6"
				placeholder="请输入短信验证码" />
			<view class="get_code" @click="getCode">{{send}}</view>
		</view>
		
		<view class="form_list" style="margin-top: 20rpx;">
			<view class="form_list_title">{{pegeType==='设置支付密码'?'':'新'}}密码</view>
			<input class="form_list_input" @confirm="submitEidt" v-model="payPwd" @input="inputPayPwd"
				type="digit" password maxlength="6" placeholder="请输入新支付密码" />
		</view>
		
		<view class="form_list">
			<view class="form_list_title">确认{{pegeType==='设置支付密码'?'':'新'}}密码</view>
			<input class="form_list_input" @confirm="submitEidt" v-model="confirmPwd" type="digit" 
				@input="changePayPwd" password maxlength="6" placeholder="请再次输入新支付密码" />
		</view>
		<view class="submit" @click="submitEidt">确认提交</view>
	</view>
</template>

<script>
	import {
		encryption
	} from '@/plugins/utils.js';

	export default {
		data() {
			return {
				pegeType: '',
				mobile: '',
				code: '',
				payPwd: '',
				confirmPwd: '',
				times: 60,
				send: '获取验证码',
				sendType: false,
				sessionKey:'',
				userAccountData: {}
			}
		},
		
		onLoad(option) {
			this.pegeType = option.pegeType
			this.getUserPone()
			this.getUserAccountState()
		},
		
		methods: {
			
			finalConfirm(ticket){
				this.$http.post(`pay/account/person/resetPassword`,{
					password:this.payPwd
				},{header:{
					'mfa-verify-ticket': ticket
				}}).then(res => {
					if(res){
						uni.showToast({
							title: this.pegeType==='设置支付密码'?'支付密码设置成功':'支付密码重置成功',
							icon: 'none'
						});
						setTimeout(()=>{
							uni.navigateBack()
						},1000)
					}
				}).catch(err => console.log(err))
			},
			
			//获取用户手机号
			getUserPone(){
				this.$http.get("admin/mfa/info/get").then(res => {
					this.mobile = res.phone
				})
			},
			
			// 用户账户状态
			getUserAccountState() {
				this.$httpApi.getPaymentAccountStatus().then(res => {
					if(res){
						this.userAccountData = res
					}
				})
			},
			
			pagesControl() {
				for (let key in this.userAccountData) {
					switch (key) {
						case '0':
							uni.showModal({
								title: '确认操作',
								content: '您还未注册个人支付账户，是否注册?',
								success: res => {
									if (res.confirm) {
										this.$httpApi.registerPaymentAccount().then(res => {
											if (res) {
												this.$util.toast('注册成功，请尽快去绑定手机号')
												this.getUserAccountState()
											}
										}).catch(err => console.log(err))
									}
								}
							});
							return false;
						case '1':
							uni.showModal({
								title: '确认操作',
								content: '您的账户还未绑定手机号，是否去绑定手机号?',
								success: res => {
									if (res.confirm) {
										this.toPage("/pages/user/bindPhoneStep")
									}
								}
							})
							return false;
						case '2':
						case '3':
						case '4':
						case '5':
							return true;
						default:
							return true
					}
				}
			},
			
			getCode() {
				// if(!this.pagesControl()){
				// 	return
				// }
				
				if (this.sendType) {
					return;
				}

				this.$http.post("admin/mfa/smscode/send").then(res => {
					if (res) {
						this.sessionKey = res.sessionKey
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

						uni.showToast({
							title: '验证码发送成功',
							icon: 'none'
						});
					}
				}).catch(err => console.log(err))
			},
			inputPayPwd(event) {
				let value = event.target.value;
				//密码的输入规则是：数字
				const rule = /[^0-9]/g;
				
				this.$nextTick(() => {
					this.payPwd = value.replace(rule, '');
				
				})
			},

			changePayPwd(event) {
				if (this.payPwd.length !== 6) {
					uni.showToast({
						title: '请输入6位数字密码',
						icon: 'none'
					});
					return '';
					this.$nextTick(() => {
						this.confirmPwd =''
					})
					return;
				}
				let value = event.target.value;
				
				if (!value || value == " ") {
					return '';
				}
				//密码的输入规则是：数字
				const rule = /[^0-9]/g;
				this.$nextTick(() => {
					this.confirmPwd = value.replace(rule, '');
					if (this.confirmPwd.length === 6 && this.confirmPwd !== this.payPwd) {
						uni.showToast({
							title: '确认密码错误',
							icon: 'none'
						});
						return;
					}
				})
			},
			
			submitEidt() {
				if (!this.code) {
					uni.showToast({
						title: '请输入验证码',
						icon: 'none'
					});
					return;
				}
				if (!this.payPwd||this.payPwd.length!==6) {
					uni.showToast({
						title: '请输入密码或密码格式不正确',
						icon: 'none'
					});
					return;
				}
				if(this.payPwd!==this.confirmPwd){
					uni.showToast({
						title: '确认密码错误',
						icon: 'none'
					});
					return;
				}
				this.$http.post("admin/mfa/verify/sms",{
					code:this.code,
					sessionKey:this.sessionKey
				}).then(res => {
					if(res){
						this.finalConfirm(res.mfaVerifyTicket)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';
	
	.nav_bar {
		@include nav-bar-title($fontColor33)
	}
	
	.hint_info {
		font-weight: 400;
		font-size: 30rpx;
		line-height: 112rpx;
		color: #909199;
		text-align: center;
	}

	.submit {
		line-height: 90rpx;
		background: linear-gradient(90deg, $themeColor 0%, $themeColor 100%);
		border-radius: 10rpx;
		font-weight: bold;
		font-size: 28rpx;
		text-align: center;
		color: #FFFFFF;
		margin-left: 60rpx;
		margin-right: 60rpx;
		margin-top: 400rpx;

	}

	.form_list {
		height: 120rpx;
		width: 100%;
		background: #FFFFFF;
		border-bottom: solid 2rpx #EEEEEE;

		// margin-top: 2rpx;
		.form_list_title {
			float: left;
			width: 160rpx;
			text-align: right;
			line-height: 120rpx;
			font-weight: 400;
			font-size: 30rpx;
			color: $seconFontColor;
		}

		.form_list_input {
			float: left;
			margin-left: 30rpx;
			width: calc(100% - 300rpx);
			height: 120rpx;
			font-weight: 400;
			font-size: $middleFontSize;
			color: $viceFontColor;
			line-height: 120rpx;
		}

		.form_list_input2 {
			float: left;
			margin-left: 30rpx;
			width: calc(100% - 480rpx);
			height: 120rpx;
			font-weight: 400;
			font-size: 28rpx;
			color: #909199;
			line-height: 120rpx;
		}

		.get_code {
			width: 180rpx;
			line-height: 60rpx;
			background: linear-gradient(90deg, $themeColor 0%, $themeColor 100%);
			border-radius: 10rpx;
			font-weight: 400;
			font-size: 24rpx;
			color: #FFFFFF;
			text-align: center;
			float: right;
			margin-right: 40rpx;
			margin-top: 30rpx;
		}
	}
</style>
