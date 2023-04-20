<template>
	<view>
		<public-module></public-module>
		<z-nav-bar fontColor="#333333" bgColor="#ffffff" title="设置支付密码">
		</z-nav-bar>
		<view class="form_list" style="margin-top: 10rpx;">
			<view class="form_list_title">支付密码</view>
			<input class="form_list_input" v-model="payPwd" type="number" @input="inputPayPwd" password maxlength="6"
				placeholder="请输入6位数字支付密码" />
		</view>
		<view class="form_list">
			<view class="form_list_title">确认密码</view>
			<input class="form_list_input" v-model="confirmPwd" type="number" @input="changePayPwd" password
				maxlength="6" placeholder="请再次输入6位数字支付密码" />
		</view>
		<view class="submit" @click="submitPayPwd">确认</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				payPwd: '',
				confirmPwd: '',
			}
		},
		methods: {
			inputPayPwd(event) {
				let value = event.target.value;
				const rule = /[^0-9]/g;
				this.$nextTick(() => {
					this.payPwd = value.replace(rule, '');
				})
			},
			changePayPwd(event) {
				let value = event.target.value;
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
			submitPayPwd() {
				if (!this.payPwd || this.payPwd.length !== 6) {
					uni.showToast({
						title: '请输入密码或密码格式不正确',
						icon: 'none'
					});
					return;
				}
				if (this.payPwd !== this.confirmPwd) {
					uni.showToast({
						title: '确认密码错误',
						icon: 'none'
					});
					return;
				}
				this.$http.put('admin/user/updateUserPayPwd', {
					payPwd: this.payPwd
				}).then(res => {
					uni.showToast({
						title: '支付密码设置成功',
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
			font-weight: bold;
			font-size: 30rpx;
			color: $seconFontColor;
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
	}
</style>
