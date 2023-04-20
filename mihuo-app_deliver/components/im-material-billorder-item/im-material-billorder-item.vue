<template>
	<view class="card-content">
		<view class="card">
			<view class="title"><text class="order-no">{{orderDetail.orderSn}}</text><text
					class="material-num">共{{orderDetail.orderItemList.length}}条材料</text></view>
			<view class="orderTime">下单日期：<text class="date">{{resolveDate(orderDetail.createTime)}}</text></view>
			<view class="requestime">预计到达时间：<text class="date">{{resolveDate(orderDetail.estimateTime)}}</text></view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "im-material-billorder-item",
		props: {
			orderDetail: {
				type: Object,
				default: () => ({})
			},
		},
		data() {
			return {

			};
		},
		methods:{
		  resolveDate(date){
			  if(!date) return '';
			  return date.substr(0,10)
		  }
		}
	}
</script>
<style lang="scss" scoped>
	.card-content{
		background-color: #fff;
		padding: 15rpx 20rpx;
		border-radius: 10rpx;
	}
	.title {
		font-size: 28rpx;
		line-height: 42rpx;
		color: #303133;
		margin-bottom: 10rpx;
		display: flex;
		.order-no{
			font-weight: 600;
			flex: 1;
		}
		.material-num{
			color: $themeColor;
			font-size:28rpx;
			margin-left: 5rpx;
		}
	}
	.requestime,.orderTime{
		font-size: 24rpx;
		color: #999;
		.date{
			font-size: 24rpx;
			color: #999;
		}
	}
</style>
