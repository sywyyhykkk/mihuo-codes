<template>
	<view>
		<view class="page_bg">
			<view class="nav_custom">
				<image class="back_arrow" src="/static/icon/arrow_back.png" @click="goBack"></image>
				绑定银行卡
			</view>
			<view style="margin-bottom: 250rpx;">
				<account-step />
			</view>
			<view class="inputItem_view">
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
			</view>
		</view>
		<bottom-button title="下一步" @click="onSubmit()" />
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
				phone: '',
				bankCardId: '',
				bankName: '',
				password: '',
			};
		},
		
		//页面显示
		onShow() {
			uni.$on('selectData', (data) => {
				this.bankName = data
			})
		},

		methods: {
			//绑定银行卡
			finalConfirm(){
				uni.showLoading()
				this.$http.post("pay/account/person/firstBindBankCard",{
					phone: this.phone,
					cardNo: this.bankCardId
				}).then(res => {
					if(res){
						setTimeout(()=>{
							uni.showModal({
								title: '提示',
								content: '绑定成功！',
								showCancel: false,
								success: res => {
									if(res.confirm){
										this.toPage("/pages/electronicProtocol/electronicProtocol")
									}
								}
							});
						},1000)
					}
				}).catch(err => console.log(err))
				.finally(()=>{
					uni.hideLoading()
				})
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
				this.finalConfirm()
			},
			
			goBack(){
				uni.switchTab({
					url:'/pages/mine/personalCenter'
				})
			}
		},
		onBackPress() {
			uni.switchTab({
				url:'/pages/mine/personalCenter'
			})
			return true;
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
	.page_bg{
		height: 660rpx;
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

	.inputItem_view{
		margin: 0 20rpx;
	}
	.inputItem_view :first-of-type{
		border-radius: 10rpx 10rpx 0 0;
	}
	.inputItem_view :last-of-type{
		border-radius: 0 0 10rpx 10rpx;
	}
	.inputItem {
		background-color: #fff;
		display: flex;
		align-items: center;
		padding: 0 25rpx;
		margin-bottom: 2rpx;
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
