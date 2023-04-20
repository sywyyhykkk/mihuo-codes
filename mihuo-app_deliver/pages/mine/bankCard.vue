<template>
	<view>
		<public-module></public-module>
		<z-nav-bar fontColor="#333333" bgColor="#ffffff" title="银行卡">
		</z-nav-bar>

		<view class="my_card" v-for="item in cardList" :key="index" :style="'background:'+ item.backColor">
			<image :src="item.backLogo" class="my_card_logo" ></image>
			<view class="my_card_name">{{item.name}}</view>
			<view style="clear: both;"></view>
			<view class="my_card_id">{{item.cardNo.replace(reg, "$1.... .... ....  $2")}}</view>
		</view>
		<view class="addCard" @click="goAddCard">添加银行卡</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				reg: /^(\d{0})\d+(\d{4})$/,
				cardNo:'6228481208052601778',
				cardList:[{
					name:'中信银行储蓄卡',
					cardNo:'6228481208052601778',
					cardValue:'中信银行',
					backColor:'#FF6B65',
					backLogo:'../../static/images/mine/yh_zxyh.png'
				},{
					name:'中国农业银行',
					cardNo:'6228481208052600373',
					cardValue:'农业银行',
					backColor:'#039aa8',
					backLogo:'../../static/images/mine/yh_zxyh.png'
				},]
			}
		},
		methods:{
			goAddCard(){
				uni.navigateTo({
					url: '/pages/mine/addCard'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.addCard{
		margin: 360rpx 60rpx 0 60rpx;
		line-height: 90rpx;
		background: linear-gradient(90deg, $themeColor 0%, $themeColor 100%);
		border-radius: 10rpx;
		font-weight: bold;
		font-size: 28rpx;
		text-align: center;
		color: #FFFFFF;
	}
	.my_card {
		background: #FF6B65;
		border-radius: 16rpx;
		margin: 30rpx 48rpx 0 48rpx;
		height: 244rpx;
		padding-top: 50rpx;

		.my_card_logo {
			width: 82rpx;
			height: 82rpx;
			border-radius: 82rpx;
			padding: 10rpx;
			background: #FFFFFF;
			margin: 0rpx 16rpx 0 48rpx;
			float: left;
		}

		.my_card_name {
			font-weight: bold;
			font-size: 32rpx;
			line-height: 82rpx;
			color: #FFFFFF;
			float: left;
		}

		.my_card_id {
			font-weight: bold;
			font-size: 48rpx;
			line-height: 68rpx;
			color: #FFFFFF;
			margin-left: 146rpx;
		}
	}
</style>
