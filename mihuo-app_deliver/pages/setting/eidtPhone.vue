<template>
	<view>
		<public-module></public-module>
		<z-nav-bar backState="1000">
			<view class="nav-bar" slot="default">修改手机号</view>
		</z-nav-bar>
		
		<view style="margin-top: 10rpx;">
			<view class="form_list">
				<view class="form_list_title">新手机号</view>
				<input class="form_list_input" v-model="mobile" maxlength="11"  placeholder="请输入手机号" />
			</view>
			<view class="form_list">
				<view class="form_list_title">短信验证</view>
				<input class="form_list_input2" v-model="code" maxlength="6" placeholder="请输入短信验证码" />
				<view class="get_code"  @click="getCode">{{send}}</view>
			</view>
		</view>

		<view class="submit" @click="submitEidt">确认修改</view>
		
		<u-popup
			v-model="checkShow"
			width="85%"
			height="500"
			border-radius="30"
			mode="center"
			:closeable="false"
			:mask-close-able="false"
			negative-top="400"
		>
			<image src="/static/images/mine/popup_cancel.png" class="popup_cancel" @click="goBack">
			<view class="tel_title">验证原手机号</view>
			<view class="tips">为了保障您的权益,修改手机号需要先验证原手机号</view>
			<view class="inp_con">
				<view class="inputItem">
					<view class="title">手机号</view>
					<view class="info">
						<input type="number" maxlength="11" v-model="oldPhone" disabled placeholder="手机号" />
					</view>
				</view>
				<view class="inputItem" style="border: none;">
					<view class="title">短信验证</view>
					<view class="info">
						<input type="number" v-model="code2" maxlength="6" placeholder="验证码" />
					</view>
					<view class="get_code" @click="getCodeOldPhone">{{send2}}</view>
				</view>
				<view class="submit submit2" @click="onSubmit">确认</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				oldPhone:uni.getStorageSync('userSetting').phone||'',
				mobile:'',
				code:'',
				times: 60,
				send: '获取验证码',
				sendType: false,
				code2:'',
				times2: 60,
				send2: '获取验证码',
				sendType2: false,
				checkShow: true,
				ticket: ''
			}
		},
		methods:{
			getCode() {
				if (!this.$base.phoneRegular.test(this.mobile)) {
					uni.showToast({
						title: "手机号码格式不正确",
						icon: "none",
					});
					return;
				}
				if (this.sendType) {
					return;
				}
				let showMessage = true
				this.$httpApi.getMSGCode(this.mobile, 'SMSREGISTER', showMessage, {}).then(res => {
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
			getCodeOldPhone(){
				if (!this.oldPhone) {
					uni.showToast({
						title: "获取原手机号失败",
						icon: "none",
					});
					return;
				}
				if (this.sendType2) {
					return;
				}
				this.$httpApi.getMSGCode(this.oldPhone, 'SMSLOGIN', true, {}).then(res => {
					if (res) {
						const timer2 = setInterval(() => {
							this.times2--;
							if (this.times2 <= 0) {
								this.send2 = '获取验证码';
								clearInterval(timer2);
								this.times2 = 60;
								this.sendType2 = false;
							} else {
								this.send2 = this.times2 + '秒后重试';
								this.sendType2 = true;
							}
						}, 1000)
				
						uni.showToast({
							title: '验证码发送成功',
							icon: 'none'
						});
					}
				}).catch(err=>{
					uni.showToast({
						title: err.errMsg,
						icon: 'none'
					});
				})
			},
			onSubmit(){
				if (!this.code2) {
					uni.showToast({
						title: '请输入验证码',
						icon: 'none'
					});
					return;
				}
				this.$httpApi.checkOldPhone({
					code: this.code2,
					mobile: this.oldPhone,
				}).then(res => {
					if(res){
						this.checkShow = false
						this.ticket = res
					}
				})
			},
			submitEidt() {
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

				this.$http.put('admin/user/updateMobile', {
					code: this.code,
					mobile: this.mobile,
				},{header:{
					'mfa-verify-ticket': this.ticket
				}}).then(res => {
					uni.showToast({
						duration: 2000,
						title: '修改成功，即将重新登录',
						icon: 'none'
					});
					setTimeout(() => {
						this.toPage('/pages/user/login')
					},2000)
				})
			},
			
			goBack(){
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.nav-bar {
		font-size: 36rpx;
		color: $fontColor33;
	}

	.submit {
		line-height: 90rpx;
		background: linear-gradient(90deg, $themeColor 0%, $themeColor 100%);
		border-radius: 10rpx;
		font-weight: 400;
		font-size: 28rpx;
		text-align: center;
		color: #FFFFFF;
		margin: 600rpx 60rpx 0;
	}
	.submit2{
		margin: 25rpx;
	}

	.form_list {
		height: 120rpx;
		width: 100%;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		background: #FFFFFF;
		border-bottom: solid 2rpx #EEEEEE;
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
	}
	/deep/.uni-scroll-view-content{
		height: auto;
	}
	.popup_cancel {
		position: absolute;
		top: 20rpx;
		right: 20rpx;
		width: 50rpx;
		height: 50rpx;
	}
	.tel_title {
		margin: 30rpx 0;
		text-align: center;
	}
	.tips {
		margin: 0 0 20rpx 25rpx;
		font-size: 26rpx;
		color: #909090;
	}
	
	.inputItem {
		background-color: #fff;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 0 25rpx;
		border-bottom: 1rpx solid #f6f6f6;
	}
	
	.inputItem .title {
		min-width: 150rpx;
		height: 100rpx;
		line-height: 100rpx;
		font-size: 30rpx;
		white-space: nowrap;
	}
	
	.inputItem .info {
		color: #999;
	}
	
	.inputItem .info input {
		height: 100rpx;
		line-height: 100rpx;
		font-size: 30rpx;
		width: 100%;
	}
</style>
