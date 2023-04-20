<template>
	<view>
		<z-nav-bar fontColor="#333333" bgColor="#ffffff" title="忘记密码">
		</z-nav-bar>
		<view v-show="pageIndex===0">
			<view class="forget_password" style="margin-top: 16rpx;">
				<image src="https://www.51mihuo.com/static/images/user/forgetPassword1.png" class="forget_password_image"></image>
				<view class="forget_password_hint">用于忘记密码，通过手机验证码找回密码</view>
				<view class="find_password" @click="pageIndex=1">找回密码</view>
			</view>
			<view class="forget_password" style="border-radius:0 0 16rpx 16rpx;">
				<image src="https://www.51mihuo.com/static/images/user/forgetPassword2.png" class="forget_password_image"></image>
				<view class="forget_password_hint">用于手机号丢失，通过人脸识别找回密码</view>
				<view class="find_password" @click="pageIndex=2">找回密码</view>
			</view>
		</view>
		<view v-show="pageIndex===1">
			<view class="form_list" style="margin-top: 20rpx;">
				<view class="form_list_title">手机号码</view>
				<input class="form_list_input" v-model="mobile" maxlength="11" type="number" placeholder="请输入手机号" />
			</view>
			<view class="form_list">
				<view class="form_list_title">短信验证</view>
				<input class="form_list_input2" v-model="code" type="number" maxlength="6" placeholder="请输入短信验证码" />
				<view class="get_code" @click="getCode">{{send}}</view>
			</view>
			<view class="form_list" style="margin-top: 20rpx;">
				<view class="form_list_title">登录密码</view>
				<input class="form_list_input" v-model="password" password placeholder="请输入登录密码" />
			</view>
			<view class="form_list">
				<view class="form_list_title">确认密码</view>
				<input class="form_list_input" v-model="confirmPassword" password placeholder="请再次输入登录密码" />
			</view>
			<view class="submit" @click="confirmSubmit">确认</view>
		</view>

		<view v-show="pageIndex===2">
			<view class="form_list" style="margin-top: 20rpx;">
				<view class="form_list_title">真实姓名</view>
				<input class="form_list_input" placeholder="请输入真实姓名" />
			</view>
			<view class="form_list">
				<view class="form_list_title">身份证号</view>
				<input class="form_list_input" placeholder="请输入身份证号" />
			</view>
			<view class="submit" @click="pageIndex=3">下一步</view>

		</view>


		<view v-show="pageIndex===3">
			<view class="mihuo_protocol">
				<image class="protocol_logo" src="https://www.51mihuo.com/static/images/user/logo.png"></image>
				<view class="protocol_title">觅活申请使用</view>
				<view style="clear: both;"></view>
				<view class="protocol_hint">
					人脸识别验证你的身份信息，请确保为本人操作
				</view>
				<view class="agree_information">
					<label class="agree_information_text">
						<radio value="r1" color="#FF9A52" class="agree_information_radio" /> 您同意服务提供者及觅活使用并传送相关数据用于身份验证。
					</label>
					<span class="find_detail">查看协议详情</span>
				</view>
			</view>
			<view class="submit2" @click="nextText">下一步</view>
		</view>

	</view>
</template>

<script>
	import {
		encryption
	} from '@/plugins/utils.js';
	export default {
		data() {
			return {
				pageIndex: 1,
				code: '',
				mobile: '',
				password: '',
				confirmPassword: '',
				times: 60,
				send: '获取验证码',
				sendType: false
			}
		},
		methods: {
			nextText(){
				uni.navigateTo({
					url:'/pages-user/faceIdentification'
				})
			},
			getCode() {
				if (this.sendType) {
					return;
				}
				this.$http.get('admin/mobile/' + this.mobile + '/SMSMSG').then(res => {

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
			confirmSubmit() {
				if (!this.mobile) {
					uni.showToast({
						title: '请输入手机号码',
						icon: 'none'
					});
					return;
				}
				if (!this.$base.phoneRegular.test(this.mobile)) {
					uni.showToast({
						title: '手机号码号码格式不正确',
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
				if (!this.password) {
					uni.showToast({
						title: '请输入密码或密码格式不正确',
						icon: 'none'
					});
					return;
				}
				if (this.password !== this.confirmPassword) {
					uni.showToast({
						title: '确认密码错误',
						icon: 'none'
					});
					return;
				}
				console.log("测试")

				//加密
				const user = encryption({
					data: {
						username: this.mobile,
						password: this.password,
						code: '',
						randomStr: ''
					},
					type: 'password',
					key: 'pigxpigxpigxpigx',
					param: ['password']
				})
				console.log(user)


				this.$http.put('admin/user/password/updateByMobile', {
					code: this.code,
					mobile: user.username,
					password: user.password
				}).then(res => {
					uni.showToast({
						title: '登录密码重置成功',
						icon: 'none'
					});
					uni.navigateBack({
						delta: 1
					})
				}).catch(e=>{
					console.log(e)
				})

			}
		}
	}
</script>

<style lang="scss" scoped>
	.mihuo_protocol {
		background: #FFFFFF;
		height: 816rpx;
		width: 100vw;
		margin-top: 20rpx;
		padding: 60rpx;

		.protocol_logo {
			height: 60rpx;
			width: 60rpx;
			float: left;
		}

		.protocol_title {
			float: left;
			font-weight: bold;
			font-size: 30rpx;
			line-height: 60rpx;
			color: #303133;
			margin-left: 14rpx;
		}

		.protocol_hint {
			font-weight: bold;
			font-size: 32rpx;
			line-height: 44rpx;
			color: #303133;
			margin-top: 34rpx;
		}

		.agree_information {
			margin-top: 380rpx;

			.agree_information_text {
				font-weight: bold;
				font-size: 26rpx;
				line-height: 60rpx;
				color: #909199;

			}

			.find_detail {
				color: #FF6A32;
				font-weight: bold;
				font-size: 26rpx;
				line-height: 50rpx;
			}

			.agree_information_radio {
				margin-right: 20rpx;
				transform: scale(0.7);
				color: #FF9A52;
			}
		}
	}

	.forget_password {
		background: #FFFFFF;
		border-radius: 16rpx 16rpx 0 0;
		height: 144rpx;
		padding: 24rpx 56rpx 24rpx 72rpx;
		border-bottom: solid 2rpx #EEEEEE;

		.forget_password_image {
			height: 96rpx;
			width: 96rpx;
			float: left;
		}

		.forget_password_hint {
			font-weight: bold;
			font-size: 26rpx;
			line-height: 36rpx;
			color: #999999;
			width: 330rpx;
			margin-left: 24rpx;
			margin-top: 12rpx;
			float: left;
		}

		.find_password {
			background: linear-gradient(90deg, #FF9A52 0%, #FF6A32 100%);
			border-radius: 10rpx;
			width: 136rpx;
			line-height: 64rpx;
			text-align: center;
			float: right;
			font-weight: bold;
			font-size: 24rpx;
			color: #FFFFFF;
			margin-top: 16rpx;
		}
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
			font-weight: bold;
			font-size: 30rpx;
			color: #303133;
		}

		.form_list_input {
			float: left;
			margin-left: 30rpx;
			width: calc(100% - 300rpx);
			height: 120rpx;
			font-weight: bold;
			font-size: 28rpx;
			color: #909199;
			line-height: 120rpx;
		}

		.form_list_input2 {
			float: left;
			margin-left: 30rpx;
			width: calc(100% - 480rpx);
			height: 120rpx;
			font-weight: bold;
			font-size: 28rpx;
			color: #909199;
			line-height: 120rpx;
		}

		.get_code {
			width: 180rpx;
			line-height: 60rpx;
			background: linear-gradient(90deg, #FF9A52 0%, #FF6A32 100%);
			border-radius: 10rpx;
			font-weight: bold;
			font-size: 24rpx;
			color: #FFFFFF;
			text-align: center;
			float: right;
			margin-right: 40rpx;
			margin-top: 30rpx;
		}
	}

	.submit {
		line-height: 90rpx;
		background: linear-gradient(90deg, #FF9A52 0%, #FF6A32 100%);
		border-radius: 10rpx;
		font-weight: bold;
		font-size: 28rpx;
		text-align: center;
		color: #FFFFFF;
		position: fixed;
		left: 60rpx;
		right: 60rpx;
		bottom: 360rpx;
	}

	.submit2 {
		line-height: 90rpx;
		background: linear-gradient(90deg, #FF9A52 0%, #FF6A32 100%);
		border-radius: 10rpx;
		font-weight: bold;
		font-size: 28rpx;
		text-align: center;
		color: #FFFFFF;
		margin: 160rpx 60rpx 0 60rpx;
	}
</style>
