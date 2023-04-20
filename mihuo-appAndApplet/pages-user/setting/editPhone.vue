<template>
	<view>
		<z-nav-bar fontColor="#333333" bgColor="#ffffff" title="修改手机号">
		</z-nav-bar>
		<view class="hint_info">为了您的账户安全，请先完成身份验证</view>
		<view class="form_list" style="background: none;">
			<view class="form_list_title">原手机号</view>
			<input class="form_list_input" disabled placeholder="请输入手机号" v-model="oldPhone" />
		</view>
		<view class="form_list">
			<view class="form_list_title">新手机号</view>
			<input class="form_list_input" v-model="mobile" maxlength="11" placeholder="请输入手机号" />
		</view>
		<view class="form_list">
			<view class="form_list_title">短信验证</view>
			<input class="form_list_input2" v-model="code" maxlength="6" placeholder="请输入短信验证码" />
			<view class="get_code" @click="getCode">{{send}}</view>
		</view>

		<view class="submit" @click="submitEidt">确认修改</view>
	</view>
</template>

<script>
	var timer
	export default {
		data() {
			return {
				oldPhone: uni.getStorageSync('userSetting').phone || '',
				mobile: '',
				code: '',
				times: 60,
				send: '获取验证码',
				sendType: false
			}
		},
		onHide() {
			timer && clearInterval(timer)
		},
		methods: {
			getCode() {
				if (!this.mobile) {
					uni.showToast({
						title: '手机号不能为空',
						icon: 'none'
					});
					return;
				}
				if (this.sendType) {
					return;
				}

				this.$httpApi.getMSGCode(this.mobile, 'SMSREGISTER').then(res => {

					if (res) {
						timer = setInterval(() => {
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


				this.$http.put('admin/user/updateMobile', {
					code: this.code,
					mobile: this.mobile,
				}).then(res => {

					uni.showToast({
						title: '手机号修改成功',
						icon: 'none'
					});
					uni.navigateBack({
						delta: 1
					})


				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.hint_info {
		font-weight: bold;
		font-size: 30rpx;
		line-height: 112rpx;
		color: #909199;
		text-align: center;
	}

	.submit {
		line-height: 90rpx;
		background: linear-gradient(90deg, #FF9A52 0%, #FF6A32 100%);
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
</style>
