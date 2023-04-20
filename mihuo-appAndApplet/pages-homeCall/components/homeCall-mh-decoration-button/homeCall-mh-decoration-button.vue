<template>
	<view class="decoration-button" :style="{background:bgColor}">
		<view class="service_button" @click="clickButton('客服')">
			<!-- #ifdef APP-PLUS -->
			<image class="icon" mode="aspectToFit" src="@/pages-homeCall/static/icon/customer.png"/>
			<!-- #endif -->
			<!-- #ifndef APP-PLUS -->
			<mihuo-image class="icon" src="https://www.51mihuo.com/static/icon/home_v3/customer.png"/>
			<!-- #endif -->
			<text>客服</text>
		</view>
		<view class="call_button">
			<view @click="clickButton('设计师')">AI匹配设计师</view>
			<view style="background:#000000" @click="clickButton('管家')">AI匹配管家</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			bgColor:{
				type:String,
				default:()=> "#FFFFFF"
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			clickButton(type){
				this.$emit("clickButton",type)
			}
		}
	}
</script>

<style lang="scss" scoped>
.decoration-button{
	width: 100%;
	position: fixed;
	display: flex;
	padding: 15rpx 30rpx 0;
	z-index: 99;
	@include buttonsafearea();
	.service_button{
		display: flex;
		flex-direction: column;
		align-items: center;
		.icon{
			width: 32rpx;
			height: 32rpx;
		}
		text{
			color: #141414;
			font-size: 18rpx;
			font-weight: bold;
			font-family: PingFang-SC-Bold;
			padding-top: 15rpx;
		}
	}
	.call_button{
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex: 1;
		view{
			line-height: 84rpx;
			border-radius: 15rpx;
			font-size: 28rpx;
			font-family: NotoSansHans-Medium;
			font-weight: bold;
			color: #FFFFFF;
			background: #FE6E32;
			text-align: center;
			flex: 1;
			margin-left: 20rpx;
		}
	}
}
</style>
