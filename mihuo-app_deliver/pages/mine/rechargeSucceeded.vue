<template>
	<view>
		<z-nav-bar>
			<view class="nav-bar" slot="default">充值成功</view>
		</z-nav-bar>
		<view class="con_view">
			<image class="success" src="/static/images/mine/success.png" mode=""></image>
			<view class="title">充值成功</view>
			<view class="sub_title">您已成功支付{{money}}元</view>
			<view class="btn_view">
				<button class="back_btn" @click="backHome">返回首页</button>
				<button class="continue_btn" @click="back">继续充值</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				money: ''
			}
		},
		
		onLoad(option) {
			this.money = option.payMoney
		},
		
		methods: {
			back(){
				uni.navigateBack()
			},
			
			backHome(){
				uni.switchTab({
					url: "/pages/home/home"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.nav-bar {
		font-weight: bold;
		font-size: 36rpx;
		color: $fontColor33;
	}
	.con_view{
		text-align: center;
		margin-top: 16rpx;
		height: calc(100vh - 88rpx - var(--status-bar-height) - 16rpx);
		background: #FFFFFF;
		.success{
			display: inline-block;
			margin-top: 280rpx;
			width: 136rpx;
			height: 136rpx;
		}
		.title{
			font-size: $mainFontSize;
			color: $seconFontColor;
			margin-top: 10rpx;
		}
		.sub_title{
			font-size: $middleFontSize;
			color: $fontColor99;
			margin-top: 4rpx;
		}
	}
	.btn_view{
		padding-top: 238rpx;
		margin: auto;
		text-align: center;
		button{
			display: inline-block;
			width: 268rpx;
			height: 88rpx;
			margin: 0 12rpx;
			line-height: 88rpx;
			font-size: $middleFontSize;
			border-radius: $miniBorderRadius;
		}
		.back_btn{
			color: #909299;
			border: 1px solid #E0E0E0;
		}
		.continue_btn{
			background: $themeColor;
			color: #FFFFFF;
		}
	}
</style>
