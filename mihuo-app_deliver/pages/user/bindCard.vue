<template>
	<view>
		<z-nav-bar>
			<view slot="default" class="nav-bar">绑定银行卡</view>
		</z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		
		<view style="margin-top: 20rpx;">
			<view class="inputItem">
				<view class="title">银行卡号</view>
				<view class="info">
					<input type="text" placeholder="请输入银行卡号或拍照识别" placeholder-style="font-size:26rpx;color:#999" v-model="bankCardId" />
				</view>
				<image class="photograph" src="/static/icon/photograph.png" @click="chooseImage" />
			</view>
			<view class="inputItem">
				<view class="title">开户行</view>
				<view class="info">
					<input type="text" placeholder="请输入开户行或拍照识别" placeholder-style="font-size:26rpx;color:#999" v-model="bankName" />
					<!-- <u-icon name="/static/icon/menu_back.png" size="14" style="margin-right: 18rpx;" @click="goSelect" /> -->
				</view>
			</view>
			<view class="inputItem">
				<view class="title">预留手机</view>
				<view class="info">
					<input type="digit" placeholder="请输入手机号" placeholder-style="font-size:26rpx;color:#999" v-model="phone" />
				</view>
			</view>
			<view class="inputItem" v-if="needYzm">
				<view class="title">验证码</view>
				<view class="info">
					<input type="digit" placeholder="请输入验证码" placeholder-style="font-size:26rpx;color:#999" v-model="code" />
					<button @click="getCode">{{ codeText }}</button>
				</view>
			</view>
			<pay-popup v-if="popupType" @popupCancel="popupCancel" @finalConfirm="finalConfirm" :needVerify="needVerify" :paramInfo="info" />
			<bottom-button title="确认提交" @click="onSubmit()" />
		</view>
	</view>
</template>

<script>
	var clear;
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import {
		imageRecogn
	} from '@/plugins/uploadPic.js'
	import {
		encryption
	} from '@/plugins/utils.js';
	// #ifdef H5
	import {
		publicShare
	} from '@/plugins/utils';
	// #endif
	export default {
		data() {
			return {
				popupType: false,
				logoUrl: '',
				readonly: false,
				codeText: '获取验证码',
				phone: '',
				bankCardId: '',
				bankName: '',
				code: '',
				randomTimer: null,
				needVerify: false,
				needYzm: false,
				sessionKey: '',
				password: '',
				info: {},
				isCan: ''
			};
		},
		//第一次加载
		onLoad(e) {
			this.logoUrl = this.$base.logoUrl;
			this.getNeedVerify()
			this.getUserAccountState()
		},
		computed: {
			...mapState(['userInfo', 'chatScenesInfo'])
		},
		//页面显示
		onShow() {
			uni.$on('selectData', (data) => {
				this.bankName = data
			})
		},

		//方法
		methods: {
			...mapMutations(['setUserInfo']),
			
			// 用户账户状态
			getUserAccountState() {
				this.$httpApi.getPaymentAccountStatus().then(res => {
					if(res){
						for(let key in res){
							this.isCan = key
						}
					}
				})
			},
			// 获取是否需要二次校验
			getNeedVerify() {
				this.$httpApi.mfaConf().then(res => {
					this.needYzm = res.needVerify
				}).catch(err => console.log(err))
			},
			//绑定银行卡
			finalConfirm(num,flag,ticket){
				uni.showLoading()
				this.$httpApi.bindPaymentAccountBankCard({
					phone: this.phone,
					cardNo: this.bankCardId,
					unionBank: ''
				},{header:{
					'mfa-verify-ticket': ticket
				}}).then(res => {
					this.popupType = flag;
					if(res){
						setTimeout(()=>{
							uni.showModal({
								title: '提示',
								content: '绑定成功！',
								showCancel: false,
								success: res => {
									if(res.confirm){
										uni.navigateBack();
									}
								}
							});
						},1000)
					}
				}).catch(err => {
					if(err){
						this.popupType = flag
						this.$util.toast(err.errMsg)
					}
				}).finally(()=>{
					uni.hideLoading()
				})
			},
			
			popupCancel(flag) {
				this.popupType = flag;
			},
			
			chooseImage(){
				uni.chooseImage({
					count: 1, //默认9
					success: async (res) => {
						const data = await imageRecogn(res.tempFilePaths[0],'bankcard');
						if(data.error_msg){
							this.$util.toast('请提供正确的银行卡图片')
							return
						}
						this.bankCardId = data.result.bank_card_number;
						this.bankName = data.result.bank_name
					},
					fail: (err) => {
						console.log(err)
					}
				});
			},
			//去选择开户行
			goSelect(){
				uni.navigateTo({
					url:"/pages/setting/selectBank"
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
				if(this.isCan == 0){
					uni.showToast({
						title: '请先去开通账户并绑定手机号',
						icon: 'none'
					});
					return;
				}
				if(this.isCan == 1){
					uni.showToast({
						title: '请先去绑定手机号',
						icon: 'none'
					});
					return;
				}
				if (this.readonly) {
					uni.showToast({
						title: '验证码已发送',
						icon: 'none'
					});
					return;
				}
				if (this.phone == '') {
					uni.showToast({
						title: '请输入手机号',
						icon: 'none'
					});
					return;
				}
				if (!this.$base.phoneRegular.test(this.phone)) {
					uni.showToast({
						title: '手机号格式不正确',
						icon: 'none'
					});
					return;
				}
				this.$httpApi.smscodeSend().then(res => {
					if(res){
						this.sessionKey = res.sessionKey
						this.getCodeState();
					}
				});
			},
			//账号绑定
			onSubmit() {
				if (!this.bankCardId) {
					uni.showToast({
						title: '请填写银行卡号',
						icon: 'none'
					});
					return;
				}
				if (this.phone == '') {
					uni.showToast({
						title: '请输入手机号',
						icon: 'none'
					});
					return;
				}
				if (!this.$base.phoneRegular.test(this.phone)) {
					uni.showToast({
						title: '手机号格式不正确',
						icon: 'none'
					});
					return;
				}
				if (this.code == '' && this.needYzm) {
					uni.showToast({
						title: '请输入验证码',
						icon: 'none'
					});
					return;
				}
				this.info = {
					code:this.code,
					sessionKey:this.sessionKey
				}
				this.popupType = true
			}
		},
		//页面隐藏
		onHide() {},
		//页面卸载
		onUnload() {},
		//页面下来刷新
		onPullDownRefresh() {},
		//页面上拉触底
		onReachBottom() {},
		//用户点击分享
		onShareAppMessage(e) {
			return this.wxShare();
		}
	};
</script>
<style lang="scss" scoped>
	@import '@/style/mixin.scss';
	.nav-bar {
		@include nav-bar-title('#333')
	}
	.bindAccountBox {
		height: 283rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.btnContent {
		margin: 248rpx 64rpx 64rpx 64rpx;
	}

	.bindAccountBox>image {
		width: 95rpx;
		height: 95rpx;
		border-radius: 15rpx;
	}

	.bindAccountBox>view {
		width: 95rpx;
		height: 95rpx;
		padding: 0rpx 20rpx;
		display: flex;
		align-items: center;
	}

	.bindAccountBox>view image {
		width: 100%;
		height: 40rpx;
	}

	.bindAccountBut {
		margin-top: 60rpx;
	}

	.registeredBut {
		margin-bottom: 30rpx;
		padding: 0rpx 20rpx;
	}

	.registeredBut button {
		width: 178rpx;
		height: 62rpx;
		line-height: 62rpx;
		text-align: center;
		font-size: $smallFontSize;
		border-radius: $miniBorderRadius;
		background-color: $themeColor;
		color: #fff;
	}

	.inputItem {
		background-color: #fff;
		display: flex;
		align-items: center;
		padding: 0 25rpx;
		border-top: 1px solid #f5f5f5;
		.photograph{
			width: 44rpx;
			height: 44rpx;
			margin-right: 18rpx;
		}
	}
	
	.inputItem .title {
		width: 120rpx;
		height: 100rpx;
		text-align: right;
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
</style>
