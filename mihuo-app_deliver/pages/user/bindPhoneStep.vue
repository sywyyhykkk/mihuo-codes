<template>
	<view>
		<view class="page_bg">
			<view class="nav_custom">
				<image class="back_arrow" src="/static/icon/arrow_back.png" @click="goBack"></image>
				验证手机号并设置支付密码
			</view>
			<!-- 流程组件 -->
			<view style="margin-bottom: 250rpx;">
				<account-step />
			</view>
			
			<view class="form_list_view">
				<view class="form_list">
					<view class="form_list_title">手机号</view>
					<input class="form_list_input" type="number" maxlength="11" v-model="mobile" disabled  placeholder="请输入手机号" />
				</view>
				<view class="form_list">
					<view class="form_list_title">短信验证</view>
					<input class="form_list_input2" type="number" v-model="code" maxlength="6" placeholder="请输入短信验证码" />
					<view class="get_code"  @click="getCode">{{send}}</view>
				</view>
				<view class="form_list">
					<view class="form_list_title">支付密码</view>
					<input class="form_list_input" @confirm="confirmInp" v-model="payPwd" @input="inputPayPwd"
						type="number" password maxlength="6" placeholder="请输入6位数字支付密码" />
				</view>
				<view class="form_list">
					<view class="form_list_title">确认密码</view>
					<input class="form_list_input" @confirm="confirmInp" v-model="confirmPwd" type="number" 
						@input="changePayPwd" password maxlength="6" placeholder="请再次输入6位数字支付密码" />
				</view>
			</view>
		</view>
		
		<view class="submit" @click="submitEdit">下一步</view>
	</view>
</template>

<script>
	import {
		encryption
	} from '@/plugins/utils.js';
	export default {
		data() {
			return {
				mobile:'',
				code:'',
				times: 60,
				send: '获取验证码',
				sendType: false,
				payPwd: '',
				confirmPwd: ''
			}
		},
		
		onLoad() {
			this.getAccountStatus()
			//获取用户登陆的手机号
			this.$httpApi.getPersonSettingInfo().then(res => {
				if(res){
					this.mobile = res.phone
				}
			}).catch(err => console.log(err))
		},
		
		methods:{
			//进入页面如果没开通账户 开通一下
			getAccountStatus(){
				this.$httpApi.getPaymentAccountStatus().then( res => {
					for(let key in res){
						if(key==0){
							this.$httpApi.registerPaymentAccount().catch(err => console.log(err))
						}
					}
				}).catch(err => console.log(err))
			},
			getCode() {
				if(!this.mobile){
					uni.showToast({
						title: '手机号不能为空',
						icon: 'none'
					});
					return;
				}
				if (this.sendType) {
					return;
				}
				//用于用户账户绑定手机号发送验证码
				this.$httpApi.sendPaymentAccountVerifyCode({
					phone:this.mobile
				}).then(res => {
					if (res) {
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
				})
			},
			confirmInp(){
				this.submitEdit()
			},
			submitEdit() {
				if (!this.mobile) {
					uni.showToast({
						title: '请输入手机号码',
						icon: 'none'
					});
					return;
				}
				if (!this.$base.phoneRegular.test(this.mobile)) {
					uni.showToast({
						title: '手机号码格式不正确',
						icon: 'none'
					});
					return;
				}
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
				uni.showLoading()
				// 用户账户绑定手机号
				this.$httpApi.bindPaymentAccountPhonePwd({
					password: this.payPwd,
					phone: this.mobile,
					verifyCode: this.code,
				}).then(res => {
					if(res){
						uni.showToast({
							title: '设置成功',
							icon: 'none'
						});
						this.$httpApi.getPaymentAccountStatus().then( res => {
							for(let key in res){
								if(key == 3){
									this.toPage("/pages/user/bindCardStep")
								}else if(key == 2){
									this.toPage("/pages/user/realNameStep")
								}
							}
						}).catch(err => console.log(err))
					}
				}).catch(err => console.log(err))
				.finally(()=>{
					uni.hideLoading()
				})
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
			
			goBack(){
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page_bg{
		padding-top: var(--status-bar-height);
		background: linear-gradient(180deg, rgba(7,59,188,.1) 0%, rgba(201, 217, 255, .1) 100%);
		.nav_custom{
			height: 48px;
			font-size: 36rpx;
			color: $fontColor33;
			text-align: center;
			line-height: 96rpx;
			position: fixed;
			position: relative;
			.back_arrow{
				width: 44rpx;
				height: 44rpx;
				position: absolute;
				left: 34rpx;
				top: 24rpx;
			}
		}
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
	
	.form_list_view{
		margin: 0 20rpx;
	}
	.form_list_view :first-of-type{
		border-radius: 10rpx 10rpx 0 0;
	}
	.form_list_view :last-of-type{
		border-radius: 0 0 10rpx 10rpx;
	}

	.form_list {
		height: 120rpx;
		width: 100%;
		background: #FFFFFF;
		margin-bottom: 2rpx;
		display: flex;
		.form_list_title {
			width: 160rpx;
			text-align: right;
			line-height: 120rpx;
			font-weight: 400;
			font-size: 30rpx;
			color: $seconFontColor;
		}

		.form_list_input {
			margin-left: 30rpx;
			width: calc(100% - 300rpx);
			height: 120rpx;
			font-weight: 400;
			font-size: 28rpx;
			color: #909199;
			line-height: 120rpx;
		}

		.form_list_input2 {
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
			height: 60rpx;
			line-height: 60rpx;
			background: linear-gradient(90deg, $themeColor 0%, $themeColor 100%);
			border-radius: 10rpx;
			font-weight: 400;
			font-size: 24rpx;
			color: #FFFFFF;
			text-align: center;
			margin-right: 40rpx;
			margin-top: 30rpx;
		}
	}
</style>
