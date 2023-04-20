<template>
	<view class="page">
		<z-nav-bar></z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<view class="welcome_title">
			<text>你好，</text>
			<view>
				<text>欢迎使用觅活</text>
			</view>
		</view>
		<view class="input_box">
			<input type="number" maxlength="11" v-model="phone" placeholder="请输入手机号" />
		</view>
		<view class="input_box">
			<input type="number" v-model="code" placeholder="获取验证码" maxlength="6" />
			<!-- 下面这个input是修复ios输入时闪烁的问题 不要删除 -->
			<input class="clear-input">
			<button @click="useVerify">{{codeText}}</button>
		</view>
		<view class="input_box"><input type="password" v-model="password" placeholder="请输入密码" /></view>
		<view class="input_box"><input type="password" v-model="confirmPassword" placeholder="请再次输入密码" /></view>
		<!-- <view class="input_box"><input type="text" v-model="recommend" placeholder="请确认推荐人(选填)" /></view> -->
		<!-- <view class="input_box"><input type="digit" v-model="recommendCode" placeholder="推荐人手机号码（非必填）" @confirm="onSubmit"/></view> -->
		<!-- <view class="privacy">
			<u-checkbox-group>
				<u-checkbox style="transform: scale(0.8);" shape="circle" active-color="#002FA5" v-model="checked">
					我已阅读并同意
					<text class="agreement" @click.stop="toPage('/pages/privacy/privacy')">《隐私政策》</text>和
					<text class="agreement"
						@click.stop="toPage('/pages/serviceAgreement/serviceAgreement')">《用户协议》</text>
				</u-checkbox>
			</u-checkbox-group>
		</view> -->
		<view class="primary-button">
			<mh-primary-button title="注册" :onclick="onSubmit" :btnStyle="btnStyle" />
		</view>
		<view class="nav_box">
			<text>已有账号？</text>
			<text class="color" @click="onJumpPage()">立即登录</text>
		</view>
		<verify @success="success" :mode="'pop'" :captchaType="'blockPuzzle'"
			:imgSize="{ width: '330px', height: '155px' }" ref="verify" />
	</view>
</template>
<script>
	var clear;
	export default {
		data() {
			return {
				checked: false,
				//手机号
				phone: '',
				// 密码
				password: '',
				// 确认密码
				confirmPassword: '',
				code: '',// 验证码
				recommend: '',
				// 推荐码
				recommendCode: "",
				//验证码
				codeText: '获取验证码',
				//验证码已发
				readonly: false,
				btnStyle: {
					'font-size': '14px',
					'font-weight': 700,
					'width': '552rpx',
					'height': '80rpx'
				},
			};
		},
		//第一次加载
		onLoad(e) {},
		//页面显示
		onShow() {},
		//方法
		methods: {
			success(params) {
				console.log(params)
				this.$refs.verify.closeBox()
				this.getCode({code:params.captchaVerification})
				// params 返回的二次验证参数, 和登录参数一起回传给登录接口，方便后台进行二次验证
			},
			useVerify() {
				if (this.readonly) {
					uni.showToast({
						title: '验证码已发送',
						icon: 'none'
					});
					return;
				}
				if (!this.phone) {
					uni.showToast({
						title: '请输入手机号',
						icon: 'none'
					});
					return;
				}
				if (!this.$base.phoneRegular.test(this.phone)) {
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none'
					});
					return;
				}
				this.$refs.verify.show()
			},
			onJumpPage() {
				// uni.navigateTo({
				// 	url: './login'
				// });
				uni.navigateBack();
			},
			//获取验证码
			getCode(header) {
				if (this.readonly) {
					uni.showToast({
						title: '验证码已发送',
						icon: 'none'
					});
					return;
				}
				if (!this.phone) {
					uni.showToast({
						title: '请输入手机号',
						icon: 'none'
					});
					return;
				}
				if (!this.$base.phoneRegular.test(this.phone)) {
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none'
					});
					return;
				}
				this.$httpApi.getMSGCode(this.phone, 'SMSREGISTER', true, header)
					.then(res => {
						if (!res) {
							this.$util.toast('该手机号已被注册')
							return
						}
						this.getCodeState();
					}).catch((e) => {
						this.$util.toast('该手机号已被注册')
					});
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
			onSubmit() {
				if (!this.phone) {
					uni.showToast({
						title: '请输入手机号',
						icon: 'none'
					});
					return;
				}
				if (!this.$base.phoneRegular.test(this.phone)) {
					uni.showToast({
						title: '请输入正确的手机号',
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
						title: '请输入密码',
						icon: 'none'
					});
					return;
				}
				if (this.password.length < 6) {
					uni.showToast({
						title: '密码长度不能少于6位',
						icon: 'none'
					});
					return;
				}
				if (!this.confirmPassword) {
					uni.showToast({
						title: '请输入确认密码',
						icon: 'none'
					});
					return;
				}
				if (this.password != this.confirmPassword) {
					uni.showToast({
						title: '两次密码不一致',
						icon: 'none'
					});
					return;
				}
				let httpData = {
					phone: this.phone,
					code: this.code,
					password: this.password,
					recommend: this.recommend,
					username: this.phone
				};
				if (this.recommendCode) {
					httpData.recommendCode = this.recommendCode;
				}
				this.$httpApi.register(httpData).then(res => {
					if (res) {
						// #ifdef APP-PLUS
						// 注册成功后把手机号写入缓存, 返回登录页后直接获取
						let deviceInfo = uni.getStorageSync("deviceInfo");
						if(deviceInfo){
							deviceInfo['username'] = this.phone
							if (deviceInfo.password) {
								deviceInfo.password = ''
							}
							uni.setStorageSync('deviceInfo', deviceInfo)
						} else {
							let deviceInfo = {
								username: this.phone
							}
							uni.setStorageSync('deviceInfo', deviceInfo)
						}
						this.$util.toast('注册成功')
						// uni.showLoading({
						// 	duration: 500
						// })
						setTimeout(()=>{
							uni.navigateBack();
						},2000)
						// #endif
					}
				});
			}
		},
		//页面隐藏
		onHide() {
			// 奇怪的bug，必须要清空即使他没有使用
			clearInterval(clear);
		},
		//页面卸载
		onUnload() {
			clearInterval(clear);
		},
		//页面下来刷新
		onPullDownRefresh() {},
		//页面上拉触底
		onReachBottom() {},
	};
</script>
<style lang="scss" scoped>
	@import '@/style/mixin.scss';



	.page {
		background-color: #FFF;
		padding: 30rpx 65rpx;
		min-height: 100vh;

		.welcome_title {
			margin-top: 30rpx;
			margin-bottom: 50rpx;
			align-items: center;
			font-weight: 600;

			text {
				font-size: 36rpx;
				color: $fontColor33;
			}
		}

		.primary-button {
			display: flex;
			justify-content: center;
			margin-top: 20rpx;
		}

		.nav_box {
			margin-top: 62rpx;
			text-align: center;

			>text {
				font-size: 24rpx;
				color: $fontColor99;

				&.color {
					color: $themeColor;
				}
			}
		}

		.privacy {
			font-size: 12rpx;
			margin: 24rpx 0 29rpx 0;
			color: $fontColor99;
			text-align: center;

			.agreement {
				color: $themeColor;
			}
		}

		.title {
			padding: 60rpx 0 40rpx 0;
			font-size: 60rpx;
			color: #333333;
		}

		.input_box {
			display: flex;
			justify-content: space-between;
			height: 100rpx;
			padding-top: 20rpx;
			border-bottom: 1rpx solid #eeeeee;

			.clear-input {
				max-width: 0 !important;
				height: 0 !important;
				min-height: 0 !important;
				overflow: hidden !important;
			}

			input {
				flex: 1;
				height: 80rpx;
				line-height: 80rpx;
				font-size: 30rpx;
			}

			button {
				height: 78rpx;
				line-height: 78rpx;
				font-size: $middleFontSize;
				color: $themeColor;

				&:active {
					background-color: transparent;
				}
			}
		}

		.protocol {
			font-size: 24rpx;
			color: #999999;
			text-align: center;
			margin-top: 20rpx;

			text {
				color: $themeColor;
			}
		}
	}
</style>
