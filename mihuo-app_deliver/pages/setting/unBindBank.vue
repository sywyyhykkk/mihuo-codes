<template>
	<view class="content">
		<z-nav-bar backState="1000">
			<view slot="default" class="nav-bar">银行卡</view>
		</z-nav-bar>
		<u-gap height="4" bg-color="#f4f4f4"></u-gap>
		<view class="bank_list">
			<view class="bank_item" :style="{'background': bankData.theme}">
				<image class="bank_icon" src="/static/icon/bank_icon.png" />
				<view class="bank_info">
					<view class="bank">
						<image class="head_image" :src="$util.thumbnailImage(bankData.iconUrl)" />
					</view>
					<view class="bank_name">{{bankData.name}}</view>
				</view>
				<view class="card_num">
					{{setCardNo}}
				</view>
			</view>
			<view class="title">支付限额</view>
			<view class="sub_title">单笔限额20万元，单日限额50万元，每月限额100万元</view>
		</view>
		<view class="tips">提示：最终限额以实际支付场景为准</view>
		<pay-popup v-show="popupType" @finalConfirm="finalConfirm" @popupCancel="popupCancel" :needVerify="needVerify" />
		<button class="unbind_btn" @click="goUnbingBank()">解绑银行卡</button>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				bankData:{},
				bankCardId:'',
				popupType: false,
				needVerify: false
			}
		},

		onLoad(option) {
			this.bankData = JSON.parse(option.bankCard)
			this.getNeedVerify()
		},
		
		computed:{
			setCardNo(){
				let array = this.bankData.cardNo.replace(/\s/g,'').split('');
				for (let i = 0; i < array.length - 4; i+=1) {
					if( i >= 0 && i <= array.length - 4){
					    array[i] = '.';
					}
				    if( i % 4 == 3){
				          array[i] += ' '
				    }
				}
				let str = '';
				str = array.join('');
				return str
			},
		},
		
		methods:{
			// 获取是否需要二次校验
			getNeedVerify(){
				this.$httpApi.mfaConf().then(res => {
					this.needVerify = res.needVerify
				}).catch(err => console.log(err))
			},
			
			finalConfirm(num,flag,ticket){
				this.$httpApi.unbindPaymentAccountBankCard({
					bankCardId: Number(this.bankData.id)
				},{
					header: {'mfa-verify-ticket': ticket}
				}).then( res => {
					this.popupType = flag;
					setTimeout(()=>{
						uni.showModal({
							title: '提示',
							content: '解除成功',
							showCancel: false,
							success: res => {
								if(res.confirm){
									uni.navigateBack();
								}
							}
						});
					},1000)
					
				}).catch(err => {
					if(err){
						this.popupType = flag
						this.$util.toast(err.errMsg)
					}
				})
			},
			
			goUnbingBank(){
				this.popupType = true
				// uni.navigateTo({
				// 	url:"/pages/setting/inputPayPwd"
				// })
			},
			popupCancel(flag) {
				this.popupType = flag;
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';
	.nav-bar {
		font-weight: bold;
		font-size: 36rpx;
		color: $fontColor33;
	}
	.bank_list{
		margin: 4rpx 20rpx;
		padding: 30rpx;
		background: #FFFFFF;
		border-radius: $miniBorderRadius;
		.bank_item{
			height: 244rpx;
			background: #1A66A2;
			border-radius: $middleBorderRadius;
			position: relative;
			.bank_icon{
				width: 208rpx;
				height: 114rpx;
				position: absolute;
				right: 8rpx;
				top: 0;
			}
			.bank_info{
				padding: 50rpx 0 0 50rpx;
				display: flex;
				align-items: center;
				.bank{
					width: 80rpx;
					height: 80rpx;
					background: #FFFFFF;
					border-radius: 50%;
					display: flex;
					justify-content: center;
					align-items: center;
					.head_image{
						width: 80rpx;
						height: 80rpx;
						border-radius: 50%;
					}
				}
				.bank_name{
					margin-left: 16rpx;
					font-weight: 700;
					font-size: $mainFontSize;
					color: #FFFFFF;
				}
			}
			.card_num{
				margin-left: 154rpx;
				font-weight: 700;
				font-size: $largeTitleSize;
				color: #FFFFFF;
			}
		}
		.title{
			margin-top: 50rpx;
			font-size: $maxBorderRadius;
			color: $seconFontColor;
		}
		.sub_title{
			font-size: $smiddleFontSize;
			margin-top: 4rpx;
			color: $mainFontColor;
		}
	}
	.tips{
		margin: 34rpx 0 0 54rpx;
		font-size: $smallFontSize;
		color: $viceFontColor;
	}
	.unbind_btn{
		width: 624rpx;
		height: 88rpx;
		margin: auto;
		margin-top: 198rpx;
		background: #FFFFFF;
		font-weight: 700;
		font-size: 14px;
		line-height: 88rpx;
		color: $themeColor;
		border: 1px solid $themeColor;
		border-radius: $miniBorderRadius;
	}
</style>
