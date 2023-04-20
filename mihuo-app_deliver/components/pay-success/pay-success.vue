<template>
	<view class="content">
		<view class="success_info">
			<image class="pay_icon" src="/static/images/order_details/large_ali.png" v-if="paySuccessData.payMethod===4" />
			<image class="pay_icon" src="/static/images/order_details/large_wx.png" v-if="paySuccessData.payMethod===3" />
			<!-- <image class="pay_icon" src="/static/images/order_details/large_union.png" /> -->
			<view class="title">支付成功</view>
			<view class="sub_title">{{paySuccessData.orderType===1?'佣金已支付':'补款项已支付'}}</view>
			<!-- <view class="sub_title">补款项已支付</view> -->
			<view class="price">{{paySuccessData.payAmount}}元</view>
			<view class="pay_info">
				<view class="info_item">
					<view class="left">支付方式</view>
					<view class="right">{{payType}}支付</view>
				</view>
				<view class="info_item">
					<view class="left">付款金额</view>
					<view class="right">-{{paySuccessData.payAmount}}</view>
				</view>
			</view>
		</view>
		
		<view class="finish_btn" @click="finish">完成</view>
	</view>
</template>

<script>
	export default{
		props:{
			orderInfo: {
				type: Object,
				default:()=>({})
			},
			paySuccessData: {
				type: Object,
				default:()=>({})
			},
		},
		data(){
			return{
				
			}
		},
		
		computed:{
			payType(){
				if(this.paySuccessData.payMethod===4){
					return '支付宝'
				}else if(this.paySuccessData.payMethod===3){
					return '微信'
				}
			}
		},
		
		methods:{
			finish(){
				this.$emit('setPayFinish',false)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		height: 100vh;
		background: #f5f5f5;
		padding: 0 30rpx;
		overflow: hidden;
	}
	.success_info{
		text-align: center;
		background: #FFFFFF;
		border-radius: 24rpx;
		margin-top: 130rpx;
		.pay_icon{
			width: 159rpx;
			height: 159rpx;
			margin-top: 60rpx;
			display: inline-block;
		}
		.title{
			text-align: center;
			font-size: 32rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #141414;
			margin-top: 42rpx;
		}
		.sub_title{
			font-size: 26rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #808080;
			margin-top: 18rpx;
		}
		.price{
			font-size: 62rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #141414;
			margin-top: 62rpx;
		}
		.pay_info{
			margin-top: 114rpx;
			.info_item{
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 30rpx 38rpx;
				.left{
					font-size: 26rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #808080;
				}
				.right{
					font-size: 26rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #141414;
				}
			}
		}
	}
	.finish_btn{
		line-height: 84rpx;
		border-radius: 12rpx;
		text-align: center;
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #FFFFFF;
		background: #141414;
		margin-top: 57rpx;
	}
</style>
